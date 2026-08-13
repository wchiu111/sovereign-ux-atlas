import type { AtlasAssistAnswer } from "../../src/app/types/atlasAssist.js";
import {
  ATLAS_ASSIST_ANSWER_JSON_SCHEMA,
  AtlasAssistMalformedOutputError,
  type AtlasAssistRequest,
  validateAtlasAssistAnswer,
} from "./contracts.js";
import {
  buildSovereignAtlasInput,
  SOVEREIGN_ATLAS_INSTRUCTIONS,
} from "./instructions.js";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

export class AtlasAssistUpstreamError extends Error {
  constructor(
    message: string,
    readonly code: "timeout" | "rate_limited" | "provider_error",
    readonly status: number,
    readonly retryAfter?: string,
  ) {
    super(message);
  }
}

export interface OpenAIAtlasAssistConfig {
  apiKey: string;
  model: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

function extractOutputText(payload: unknown) {
  if (!payload || typeof payload !== "object") return undefined;
  const response = payload as {
    output_text?: unknown;
    output?: Array<{ content?: Array<{ type?: string; text?: unknown }> }>;
  };
  if (typeof response.output_text === "string") return response.output_text;

  const text = response.output
    ?.flatMap((item) => item.content ?? [])
    .filter((item) => item.type === "output_text" && typeof item.text === "string")
    .map((item) => item.text as string)
    .join("");
  return text || undefined;
}

async function requestModel(
  request: AtlasAssistRequest,
  config: OpenAIAtlasAssistConfig,
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs ?? 12_000);
  const fetchImpl = config.fetchImpl ?? fetch;

  try {
    const response = await fetchImpl(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: config.model,
        store: false,
        instructions: SOVEREIGN_ATLAS_INSTRUCTIONS,
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: buildSovereignAtlasInput(request) },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "atlas_assist_answer",
            description: "A source-grounded Sovereign Atlas consultation answer.",
            strict: true,
            schema: ATLAS_ASSIST_ANSWER_JSON_SCHEMA,
          },
        },
        max_output_tokens: 2_400,
      }),
    });

    if (response.status === 429) {
      throw new AtlasAssistUpstreamError(
        "Atlas Assist is receiving too many requests.",
        "rate_limited",
        429,
        response.headers.get("retry-after") ?? undefined,
      );
    }
    if (!response.ok) {
      throw new AtlasAssistUpstreamError(
        "Atlas Assist could not reach its interpretation provider.",
        "provider_error",
        502,
      );
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      throw new AtlasAssistMalformedOutputError("The model response was not JSON.");
    }
    const outputText = extractOutputText(payload);
    if (!outputText) {
      throw new AtlasAssistMalformedOutputError("The model returned no structured answer.");
    }

    let candidate: unknown;
    try {
      candidate = JSON.parse(outputText);
    } catch {
      throw new AtlasAssistMalformedOutputError("The model returned malformed structured output.");
    }
    return validateAtlasAssistAnswer(candidate, request.context);
  } catch (error) {
    if (error instanceof AtlasAssistUpstreamError || error instanceof AtlasAssistMalformedOutputError) {
      throw error;
    }
    if (controller.signal.aborted || (error instanceof Error && error.name === "AbortError")) {
      throw new AtlasAssistUpstreamError(
        "Atlas Assist timed out while preparing a grounded answer.",
        "timeout",
        504,
      );
    }
    throw new AtlasAssistUpstreamError(
      "Atlas Assist could not reach its interpretation provider.",
      "provider_error",
      502,
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function answerWithOpenAI(
  request: AtlasAssistRequest,
  config: OpenAIAtlasAssistConfig,
): Promise<AtlasAssistAnswer> {
  try {
    return await requestModel(request, config);
  } catch (error) {
    if (!(error instanceof AtlasAssistMalformedOutputError)) throw error;
    return requestModel(request, config);
  }
}
