import {
  AtlasAssistValidationError,
  validateAtlasAssistRequest,
} from "./contracts.js";
import {
  answerWithOpenAI,
  AtlasAssistUpstreamError,
  type OpenAIAtlasAssistConfig,
} from "./openaiProvider.js";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

export interface AtlasAssistHandlerInput {
  method: string;
  body?: unknown;
  clientId: string;
}

export interface AtlasAssistHandlerResult {
  status: number;
  headers?: Record<string, string>;
  body: unknown;
}

export interface AtlasAssistHandlerConfig extends OpenAIAtlasAssistConfig {
  requestsPerMinute?: number;
  now?: () => number;
  rateLimitStore?: Map<string, RateLimitRecord>;
}

function safeError(code: string, message: string) {
  return { error: { code, message } };
}

function consumeRateLimit(clientId: string, config: AtlasAssistHandlerConfig) {
  const now = (config.now ?? Date.now)();
  const store = config.rateLimitStore ?? defaultRateLimitStore;
  const limit = config.requestsPerMinute ?? 12;
  const current = store.get(clientId);

  if (!current || current.resetAt <= now) {
    store.set(clientId, { count: 1, resetAt: now + 60_000 });
    return undefined;
  }
  if (current.count >= limit) return current.resetAt;
  current.count += 1;
  return undefined;
}

const defaultRateLimitStore = new Map<string, RateLimitRecord>();

export async function handleAtlasAssistRequest(
  input: AtlasAssistHandlerInput,
  config: AtlasAssistHandlerConfig,
): Promise<AtlasAssistHandlerResult> {
  if (input.method !== "POST") {
    return {
      status: 405,
      headers: { Allow: "POST" },
      body: safeError("method_not_allowed", "Atlas Assist accepts POST requests only."),
    };
  }
  if (!config.apiKey) {
    return {
      status: 503,
      body: safeError("provider_unavailable", "Atlas Assist is not configured on this deployment."),
    };
  }

  const retryAt = consumeRateLimit(input.clientId, config);
  if (retryAt) {
    const retryAfter = Math.max(1, Math.ceil((retryAt - (config.now ?? Date.now)()) / 1_000));
    return {
      status: 429,
      headers: { "Retry-After": String(retryAfter) },
      body: safeError("rate_limited", "Atlas Assist is receiving too many requests. Please try again shortly."),
    };
  }

  try {
    const request = validateAtlasAssistRequest(input.body);
    const answer = await answerWithOpenAI(request, config);
    return {
      status: 200,
      headers: { "Cache-Control": "no-store" },
      body: answer,
    };
  } catch (error) {
    if (error instanceof AtlasAssistValidationError) {
      return {
        status: 400,
        body: safeError("invalid_request", "Atlas Assist could not use that request."),
      };
    }
    if (error instanceof AtlasAssistUpstreamError) {
      return {
        status: error.status,
        headers: error.retryAfter ? { "Retry-After": error.retryAfter } : undefined,
        body: safeError(error.code, error.message),
      };
    }
    return {
      status: 502,
      body: safeError("provider_error", "Atlas Assist could not prepare a grounded answer."),
    };
  }
}
