import {
  ContactValidationError,
  validateContactMessage,
} from "./contracts.js";
import {
  ContactProviderError,
  sendContactMessage,
  type ContactProviderConfig,
} from "./resendProvider.js";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

export interface ContactHandlerConfig extends ContactProviderConfig {
  requestsPerMinute?: number;
  now?: () => number;
  rateLimitStore?: Map<string, RateLimitRecord>;
}

export interface ContactHandlerInput {
  method: string;
  body?: unknown;
  clientId: string;
}

const defaultRateLimitStore = new Map<string, RateLimitRecord>();

function errorBody(code: string, message: string) {
  return { error: { code, message } };
}

function consumeRateLimit(clientId: string, config: ContactHandlerConfig) {
  const now = (config.now ?? Date.now)();
  const store = config.rateLimitStore ?? defaultRateLimitStore;
  const limit = config.requestsPerMinute ?? 5;
  const current = store.get(clientId);
  if (!current || current.resetAt <= now) {
    store.set(clientId, { count: 1, resetAt: now + 60_000 });
    return undefined;
  }
  if (current.count >= limit) return current.resetAt;
  current.count += 1;
  return undefined;
}

export async function handleContactRequest(
  input: ContactHandlerInput,
  config: ContactHandlerConfig,
) {
  if (input.method !== "POST") {
    return { status: 405, headers: { Allow: "POST" }, body: errorBody("method_not_allowed", "Contact accepts POST requests only.") };
  }
  if (!config.apiKey || !config.from || !config.to) {
    return { status: 503, body: errorBody("provider_unavailable", "The contact channel is not configured on this deployment.") };
  }
  const retryAt = consumeRateLimit(input.clientId, config);
  if (retryAt) {
    const retryAfter = Math.max(1, Math.ceil((retryAt - (config.now ?? Date.now)()) / 1_000));
    return {
      status: 429,
      headers: { "Retry-After": String(retryAfter) },
      body: errorBody("rate_limited", "The contact channel is busy. Please try again shortly."),
    };
  }

  try {
    const message = validateContactMessage(input.body);
    await sendContactMessage(message, config);
    return {
      status: 202,
      headers: { "Cache-Control": "no-store" },
      body: { accepted: true },
    };
  } catch (error) {
    if (error instanceof ContactValidationError) {
      return { status: 400, body: errorBody("invalid_request", error.message) };
    }
    if (error instanceof ContactProviderError) {
      return { status: error.status, body: errorBody(error.code, error.message) };
    }
    return { status: 502, body: errorBody("provider_error", "The message could not be delivered.") };
  }
}
