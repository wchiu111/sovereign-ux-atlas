import type {
  AtlasAssistAnswer,
  AtlasAssistContentBlock,
  AtlasAssistContext,
  AtlasAssistScope,
  AtlasAssistSource,
  AtlasAssistSourceType,
} from "../../src/app/types/atlasAssist";

const SCOPES = new Set<AtlasAssistScope>(["section", "project", "atlas"]);
const SOURCE_TYPES = new Set<AtlasAssistSourceType>([
  "section",
  "evidence",
  "decision",
  "outcome",
  "framework",
  "case-study",
  "experiment",
]);
const BLOCK_TYPES = new Set([
  "overview",
  "research",
  "discovery",
  "section",
  "decision",
  "outcome",
  "evidence",
  "related",
]);
const ID_PATTERN = /^[a-z0-9][a-z0-9:_-]{0,159}$/;
const MAX_QUERY_LENGTH = 600;
const MAX_CONTEXT_CHARACTERS = 500_000;

export interface AtlasAssistHistoryTurn {
  query: string;
  answer: string;
}

export interface AtlasAssistRequest {
  query: string;
  context: AtlasAssistContext;
  history?: AtlasAssistHistoryTurn[];
}

export class AtlasAssistValidationError extends Error {
  readonly code = "invalid_request";
}

export class AtlasAssistMalformedOutputError extends Error {
  readonly code = "malformed_model_output";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertString(
  value: unknown,
  label: string,
  { min = 0, max = 10_000 }: { min?: number; max?: number } = {},
) {
  if (typeof value !== "string" || value.trim().length < min || value.length > max) {
    throw new AtlasAssistValidationError(`${label} is invalid.`);
  }
  return value.trim();
}

function optionalId(value: unknown, label: string) {
  if (value === undefined || value === null) return undefined;
  const id = assertString(value, label, { min: 1, max: 160 });
  if (!ID_PATTERN.test(id)) throw new AtlasAssistValidationError(`${label} is invalid.`);
  return id;
}

function validateSource(value: unknown): AtlasAssistSource {
  if (!isRecord(value)) throw new AtlasAssistValidationError("A context source is invalid.");
  const id = assertString(value.id, "Source ID", { min: 1, max: 160 });
  const sourceType = value.sourceType;
  if (!ID_PATTERN.test(id) || !SOURCE_TYPES.has(sourceType as AtlasAssistSourceType)) {
    throw new AtlasAssistValidationError("A context source is invalid.");
  }

  return {
    id,
    title: assertString(value.title, "Source title", { min: 1, max: 300 }),
    sourceType: sourceType as AtlasAssistSourceType,
    destinationId: optionalId(value.destinationId, "Source destination ID"),
    sectionId: optionalId(value.sectionId, "Source section ID"),
    evidenceId: optionalId(value.evidenceId, "Source evidence ID"),
    parentTitle: value.parentTitle == null
      ? undefined
      : assertString(value.parentTitle, "Source parent title", { max: 300 }),
  };
}

function validateBlock(value: unknown): AtlasAssistContentBlock {
  if (!isRecord(value) || !BLOCK_TYPES.has(String(value.type))) {
    throw new AtlasAssistValidationError("A context block is invalid.");
  }

  return {
    id: assertString(value.id, "Content block ID", { min: 1, max: 200 }),
    type: value.type as AtlasAssistContentBlock["type"],
    title: value.title == null
      ? undefined
      : assertString(value.title, "Content block title", { max: 500 }),
    body: assertString(value.body, "Content block body", { min: 1, max: 60_000 }),
    source: validateSource(value.source),
  };
}

function validateContext(value: unknown): AtlasAssistContext {
  if (!isRecord(value) || !SCOPES.has(value.scope as AtlasAssistScope)) {
    throw new AtlasAssistValidationError("Atlas Assist scope is invalid.");
  }
  const scope = value.scope as AtlasAssistScope;
  const projectId = optionalId(value.projectId, "Project ID");
  const sectionId = optionalId(value.sectionId, "Section ID");

  if ((scope === "project" || scope === "section") && !projectId) {
    throw new AtlasAssistValidationError("This scope requires a valid project ID.");
  }
  if (scope === "section" && !sectionId) {
    throw new AtlasAssistValidationError("Section scope requires a valid section ID.");
  }
  if (scope !== "section" && sectionId) {
    throw new AtlasAssistValidationError("Section ID is not valid for this scope.");
  }
  if (!Array.isArray(value.contentBlocks) || value.contentBlocks.length === 0 || value.contentBlocks.length > 1_000) {
    throw new AtlasAssistValidationError("Atlas Assist context blocks are invalid.");
  }

  const contentBlocks = value.contentBlocks.map(validateBlock);
  const contextSize = contentBlocks.reduce((size, block) => size + block.body.length, 0);
  if (contextSize > MAX_CONTEXT_CHARACTERS) {
    throw new AtlasAssistValidationError("Atlas Assist context is too large.");
  }
  if (!Array.isArray(value.sourceIds)) {
    throw new AtlasAssistValidationError("Atlas Assist source IDs are invalid.");
  }
  const sourceIds = value.sourceIds.map((id) => assertString(id, "Source ID", { min: 1, max: 160 }));
  const declaredSources = new Set(sourceIds);
  const blockSources = new Set(contentBlocks.map((block) => block.source.id));
  if (contentBlocks.some((block) => !declaredSources.has(block.source.id))) {
    throw new AtlasAssistValidationError("A content block references an undeclared source ID.");
  }
  if (sourceIds.some((sourceId) => !blockSources.has(sourceId))) {
    throw new AtlasAssistValidationError("Atlas Assist declares a source without content.");
  }
  if (
    projectId
    && !contentBlocks.some((block) => block.source.destinationId === projectId)
  ) {
    throw new AtlasAssistValidationError("Project ID is not represented in the supplied context.");
  }
  if (
    sectionId
    && !contentBlocks.some((block) =>
      block.source.destinationId === projectId && block.source.sectionId === sectionId)
  ) {
    throw new AtlasAssistValidationError("Section ID is not represented in the supplied context.");
  }
  if (!Array.isArray(value.limitations) || value.limitations.length > 10) {
    throw new AtlasAssistValidationError("Atlas Assist limitations are invalid.");
  }
  const limitations = value.limitations.map((limitation) =>
    assertString(limitation, "Limitation", { min: 1, max: 1_500 }));
  if (!isRecord(value.grounding)) {
    throw new AtlasAssistValidationError("Atlas Assist grounding summary is invalid.");
  }

  return {
    scope,
    projectId,
    sectionId,
    contentBlocks,
    sourceIds: Array.from(new Set(sourceIds)),
    limitations: Array.from(new Set(limitations)),
    grounding: value.grounding as unknown as AtlasAssistContext["grounding"],
  };
}

function validateHistory(value: unknown): AtlasAssistHistoryTurn[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.length > 1) {
    throw new AtlasAssistValidationError("Atlas Assist history is invalid.");
  }
  return value.map((turn) => {
    if (!isRecord(turn)) throw new AtlasAssistValidationError("Atlas Assist history is invalid.");
    return {
      query: assertString(turn.query, "Previous question", { min: 1, max: MAX_QUERY_LENGTH }),
      answer: assertString(turn.answer, "Previous answer", { min: 1, max: 8_000 }),
    };
  });
}

export function validateAtlasAssistRequest(value: unknown): AtlasAssistRequest {
  if (!isRecord(value)) throw new AtlasAssistValidationError("Atlas Assist request is invalid.");
  return {
    query: assertString(value.query, "Question", { min: 1, max: MAX_QUERY_LENGTH }),
    context: validateContext(value.context),
    history: validateHistory(value.history),
  };
}

function stringArray(
  value: unknown,
  label: string,
  maxItems: number,
  maxLength: number,
) {
  if (!Array.isArray(value) || value.length > maxItems) {
    throw new AtlasAssistMalformedOutputError(`${label} is invalid.`);
  }
  return value.map((item) => {
    if (typeof item !== "string" || !item.trim() || item.length > maxLength) {
      throw new AtlasAssistMalformedOutputError(`${label} is invalid.`);
    }
    return item.trim();
  });
}

export function validateAtlasAssistAnswer(
  value: unknown,
  context: AtlasAssistContext,
): AtlasAssistAnswer {
  if (!isRecord(value)) throw new AtlasAssistMalformedOutputError("The model response is invalid.");
  if (value.scope !== context.scope) {
    throw new AtlasAssistMalformedOutputError("The model returned the wrong scope.");
  }
  if (!Array.isArray(value.sources) || value.sources.length > 8) {
    throw new AtlasAssistMalformedOutputError("The model returned invalid sources.");
  }

  const sources = value.sources.map((source) => {
    try {
      return validateSource(source);
    } catch {
      throw new AtlasAssistMalformedOutputError("The model returned an invalid source.");
    }
  });
  const allowedSources = new Map(
    context.contentBlocks.map((block) => [block.source.id, block.source]),
  );
  const invalidSourceIds = sources.filter((source) => !allowedSources.has(source.id));
  if (invalidSourceIds.length > 0) {
    throw new AtlasAssistMalformedOutputError("The model cited a source outside the supplied context.");
  }
  const canonicalSources = sources.map((source) => allowedSources.get(source.id)!);
  const answer = typeof value.answer === "string" && value.answer.trim() && value.answer.length <= 8_000
    ? value.answer.trim()
    : undefined;
  if (!answer) {
    throw new AtlasAssistMalformedOutputError("The model answer is invalid.");
  }
  const explicitlyUnsupported = /\bmissing evidence\b|does not document|not enough evidence|cannot (?:be )?support/i.test(answer);
  if (canonicalSources.length === 0 && !explicitlyUnsupported) {
    throw new AtlasAssistMalformedOutputError("A substantive answer did not cite a supplied source.");
  }
  const returnedLimitations = stringArray(value.limitations, "Model limitations", 5, 1_500);
  if (returnedLimitations.some((limitation) => !context.limitations.includes(limitation))) {
    throw new AtlasAssistMalformedOutputError("The model returned an unsupported limitation.");
  }

  return {
    answer,
    scope: context.scope,
    sources: Array.from(new Map(canonicalSources.map((source) => [source.id, source])).values()),
    limitations: Array.from(new Set([...returnedLimitations, ...context.limitations])).slice(0, 5),
    suggestedFollowUps: stringArray(value.suggestedFollowUps, "Model follow-ups", 3, 300),
    interpretation: typeof value.interpretation === "boolean" ? value.interpretation : false,
  };
}

const nullableString = { anyOf: [{ type: "string" }, { type: "null" }] } as const;

export const ATLAS_ASSIST_ANSWER_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    answer: { type: "string" },
    scope: { type: "string", enum: ["section", "project", "atlas"] },
    sources: {
      type: "array",
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          sourceType: {
            type: "string",
            enum: ["section", "evidence", "decision", "outcome", "framework", "case-study", "experiment"],
          },
          destinationId: nullableString,
          sectionId: nullableString,
          evidenceId: nullableString,
          parentTitle: nullableString,
        },
        required: [
          "id",
          "title",
          "sourceType",
          "destinationId",
          "sectionId",
          "evidenceId",
          "parentTitle",
        ],
      },
    },
    limitations: { type: "array", maxItems: 5, items: { type: "string" } },
    suggestedFollowUps: { type: "array", maxItems: 3, items: { type: "string" } },
    interpretation: { type: "boolean" },
  },
  required: ["answer", "scope", "sources", "limitations", "suggestedFollowUps", "interpretation"],
} as const;
