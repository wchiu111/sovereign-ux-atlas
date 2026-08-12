import { getAtlasAssistFollowUps } from "../data/atlasAssistPrompts";
import type {
  AtlasAssistAnswer,
  AtlasAssistContentBlock,
  AtlasAssistContext,
  AtlasAssistProvider,
  AtlasAssistSource,
} from "../types/atlasAssist";

const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, " ").trim();

const QUERY_STOP_WORDS = new Set([
  "about",
  "could",
  "does",
  "from",
  "have",
  "into",
  "should",
  "that",
  "their",
  "there",
  "this",
  "what",
  "when",
  "where",
  "which",
  "with",
  "would",
  "your",
]);

function sentence(text: string, maxLength = 360) {
  const clean = text.replace(/\s+/g, " ").trim();
  const first = clean.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() ?? clean;
  return first.length > maxLength
    ? `${first.slice(0, maxLength - 1).trimEnd()}...`
    : first;
}

function uniqueSources(blocks: AtlasAssistContentBlock[], limit = 5) {
  const sources = new Map<string, AtlasAssistSource>();
  blocks.forEach((block) => sources.set(block.source.id, block.source));
  return Array.from(sources.values()).slice(0, limit);
}

function blocksForQuery(query: string, context: AtlasAssistContext) {
  const clean = normalize(query);
  const blocks = context.contentBlocks;
  const byType = (...types: AtlasAssistContentBlock["type"][]) =>
    types.flatMap((type) => blocks.filter((block) => block.type === type));

  if (/evidence|artifact|supporting|proof/.test(clean)) return byType("evidence");
  if (/decision|choice|rationale/.test(clean)) return byType("decision", "evidence");
  if (/outcome|result|impact|validated|unvalidated/.test(clean)) return byType("outcome", "evidence");
  if (/research|method|approach/.test(clean)) {
    return blocks.filter(
      (block) => block.type === "research" || /approach|research/i.test(block.title ?? ""),
    );
  }
  if (/problem|why did this matter|why does this matter/.test(clean)) {
    return blocks.filter(
      (block) => block.type === "overview" || /problem/i.test(block.title ?? ""),
    );
  }
  if (/limitation|cautious|challenge|tradeoff|missing/.test(clean)) {
    return blocks.filter((block) =>
      context.limitations.some((limitation) => block.body.includes(limitation)),
    );
  }
  if (/related|connect.*framework/.test(clean)) return byType("related");

  if (/summarize|summary|explain|key insight|what themes/.test(clean)) {
    return blocks.filter((block) => block.type !== "evidence");
  }

  const tokens = clean
    .split(/\W+/)
    .filter((token) => token.length > 3 && !QUERY_STOP_WORDS.has(token));
  const matched = blocks.filter((block) => {
    const haystack = normalize(`${block.title ?? ""} ${block.body}`);
    return tokens.some((token) => haystack.includes(token));
  });
  if (matched.length > 0) return matched;

  return [];
}

function documentedAnswer(
  query: string,
  context: AtlasAssistContext,
  blocks: AtlasAssistContentBlock[],
) {
  const clean = normalize(query);
  const selected = blocks.slice(0, 4);
  const label =
    /challenge|tradeoff|why|theme|connect/.test(clean)
      ? "Interpretation based on the documented Atlas material:"
      : "Documented in the Atlas:"
  const points = selected.map((block) => {
    const title = block.title ? `${block.title}: ` : "";
    return `${title}${sentence(block.body)}`;
  });

  return `${label}\n\n${points.join("\n\n")}`;
}

function unsupportedAnswer(context: AtlasAssistContext) {
  const place = context.scope === "section"
    ? "this section"
    : context.scope === "project"
      ? "this project"
      : "the available Atlas";
  return `The documented content in ${place} does not contain enough evidence to answer that confidently. No external knowledge was added. You can inspect the closest grounded sources below or intentionally expand the consultation scope.`;
}

function comparisonRequiresAtlas(context: AtlasAssistContext) {
  return {
    answer: "A comparison requires the Entire Atlas scope so both documented subjects can be included. The scope was not expanded automatically. Select Entire Atlas, then submit the comparison again.",
    scope: context.scope,
    sources: uniqueSources(context.contentBlocks, 3),
    limitations: context.limitations.slice(0, 3),
    suggestedFollowUps: getAtlasAssistFollowUps(context),
  } satisfies AtlasAssistAnswer;
}

export function groundAtlasAssistAnswer(
  candidate: AtlasAssistAnswer,
  context: AtlasAssistContext,
): AtlasAssistAnswer {
  const allowedSources = new Map(
    context.contentBlocks.map((block) => [block.source.id, block.source]),
  );
  const sources = candidate.sources
    .map((source) => allowedSources.get(source.id))
    .filter((source): source is AtlasAssistSource => Boolean(source));
  const limitations = candidate.limitations.filter((limitation) =>
    context.limitations.includes(limitation),
  );

  return {
    ...candidate,
    scope: context.scope,
    sources: Array.from(new Map(sources.map((source) => [source.id, source])).values()),
    limitations: Array.from(new Set([...limitations, ...context.limitations])).slice(0, 3),
    suggestedFollowUps: candidate.suggestedFollowUps.slice(0, 3),
  };
}

export class DeterministicAtlasAssistProvider implements AtlasAssistProvider {
  async answer({
    query,
    context,
  }: {
    query: string;
    context: AtlasAssistContext;
  }): Promise<AtlasAssistAnswer> {
    if (import.meta.env?.DEV) {
      console.debug("[Atlas Assist] deterministic.answer", {
        scope: context.scope,
        projectId: context.projectId,
        sectionId: context.sectionId,
      });
    }
    if (/\bcompare\b|\bvs\.?\b|↔/i.test(query) && context.scope !== "atlas") {
      return groundAtlasAssistAnswer(comparisonRequiresAtlas(context), context);
    }

    const blocks = blocksForQuery(query, context);
    const interpretation = /challenge|tradeoff|why|theme|connect/.test(normalize(query));
    const sources = uniqueSources(blocks.length > 0 ? blocks : context.contentBlocks, 5);

    return groundAtlasAssistAnswer(
      {
        answer: blocks.length > 0
          ? documentedAnswer(query, context, blocks)
          : unsupportedAnswer(context),
        scope: context.scope,
        sources: blocks.length > 0 ? sources : sources.slice(0, 3),
        limitations: context.limitations.slice(0, 3),
        suggestedFollowUps: getAtlasAssistFollowUps(context),
        interpretation,
      },
      context,
    );
  }
}

export class HttpAtlasAssistProvider implements AtlasAssistProvider {
  private previousTurn?: { query: string; answer: string };
  private contextKey?: string;

  constructor(
    private readonly endpoint: string,
    private readonly timeoutMs = 12_000,
  ) {}

  async answer(input: {
    query: string;
    context: AtlasAssistContext;
  }): Promise<AtlasAssistAnswer> {
    const contextKey = [
      input.context.scope,
      input.context.projectId ?? "atlas",
      input.context.sectionId ?? "overview",
    ].join(":");
    if (this.contextKey !== contextKey) {
      this.previousTurn = undefined;
      this.contextKey = contextKey;
    }

    const controller = new AbortController();
    const timeout = globalThis.setTimeout(() => controller.abort(), this.timeoutMs);
    let response: Response;
    try {
      if (import.meta.env?.DEV) {
      console.debug("[Atlas Assist] http.fetch", JSON.stringify({
          endpoint: this.endpoint,
          scope: input.context.scope,
          projectId: input.context.projectId,
          sectionId: input.context.sectionId,
        }));
      }
      response = await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          ...input,
          history: this.previousTurn ? [this.previousTurn] : undefined,
        }),
      });
    } catch (error) {
      if (controller.signal.aborted) {
        throw new AtlasAssistProviderError(
          "timeout",
          "Atlas Assist timed out while preparing a grounded answer.",
        );
      }
      throw new AtlasAssistProviderError(
        "provider_error",
        "Atlas Assist could not reach its interpretation provider.",
      );
    } finally {
      globalThis.clearTimeout(timeout);
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      throw new AtlasAssistProviderError(
        "invalid_response",
        "Atlas Assist received an invalid provider response.",
      );
    }
    if (!response.ok) {
      const code = isProviderErrorPayload(payload) ? payload.error.code : "provider_error";
      const message = isProviderErrorPayload(payload)
        ? payload.error.message
        : "Atlas Assist could not prepare a grounded answer.";
      throw new AtlasAssistProviderError(code, message);
    }

    const candidate = payload as AtlasAssistAnswer;
    if (
      !candidate
      || typeof candidate.answer !== "string"
      || !Array.isArray(candidate.sources)
      || !Array.isArray(candidate.limitations)
      || !Array.isArray(candidate.suggestedFollowUps)
    ) {
      throw new Error("Atlas Assist provider returned an invalid response.");
    }
    const answer = groundAtlasAssistAnswer(candidate, input.context);
    this.previousTurn = { query: input.query, answer: answer.answer };
    return answer;
  }
}

export type AtlasAssistProviderMode = "deterministic" | "live" | "unavailable";

export interface AtlasAssistProviderSelection {
  mode: AtlasAssistProviderMode;
  provider: AtlasAssistProvider;
  endpoint?: string;
}

export class AtlasAssistProviderError extends Error {
  constructor(readonly code: string, message: string) {
    super(message);
  }
}

export class UnavailableAtlasAssistProvider implements AtlasAssistProvider {
  async answer(): Promise<AtlasAssistAnswer> {
    throw new AtlasAssistProviderError(
      "provider_unavailable",
      "Atlas Assist is not available on this deployment.",
    );
  }
}

function isProviderErrorPayload(
  value: unknown,
): value is { error: { code: string; message: string } } {
  if (!value || typeof value !== "object" || !("error" in value)) return false;
  const error = (value as { error?: unknown }).error;
  return Boolean(
    error
    && typeof error === "object"
    && "code" in error
    && typeof (error as { code?: unknown }).code === "string"
    && "message" in error
    && typeof (error as { message?: unknown }).message === "string",
  );
}

export function selectAtlasAssistProvider({
  endpoint,
  isProduction,
}: {
  endpoint?: string;
  isProduction: boolean;
}): AtlasAssistProviderSelection {
  if (endpoint?.trim()) {
    return {
      mode: "live",
      provider: new HttpAtlasAssistProvider(endpoint.trim()),
      endpoint: endpoint.trim(),
    };
  }
  if (isProduction) {
    return { mode: "unavailable", provider: new UnavailableAtlasAssistProvider() };
  }
  return { mode: "deterministic", provider: new DeterministicAtlasAssistProvider() };
}

export function createAtlasAssistProvider(): AtlasAssistProvider {
  return createAtlasAssistProviderSelection().provider;
}

export function createAtlasAssistProviderSelection(): AtlasAssistProviderSelection {
  const environment = (import.meta as ImportMeta & {
    env?: Record<string, string | boolean | undefined>;
  }).env;
  return selectAtlasAssistProvider({
    endpoint: environment?.VITE_ATLAS_ASSIST_ENDPOINT as string | undefined,
    isProduction: environment?.PROD === true,
  });
}
