import type { ContactMessage } from "./contracts.js";

export interface ContactProviderConfig {
  apiKey: string;
  from: string;
  to: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

export class ContactProviderError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export async function sendContactMessage(
  message: ContactMessage,
  config: ContactProviderConfig,
): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs ?? 10_000);
  try {
    const response = await (config.fetchImpl ?? fetch)("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        reply_to: message.email,
        subject: `Sovereign Atlas contact from ${message.name}`,
        text: `Name: ${message.name}\nEmail: ${message.email}\n\n${message.message}`,
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new ContactProviderError(
        response.status === 429 ? 429 : 502,
        response.status === 429 ? "rate_limited" : "provider_error",
        response.status === 429
          ? "The contact channel is busy. Please try again shortly."
          : "The message provider did not accept this transmission.",
      );
    }
    const body = await response.json() as { id?: unknown };
    if (typeof body.id !== "string" || !body.id) {
      throw new ContactProviderError(
        502,
        "provider_error",
        "The message provider returned an invalid response.",
      );
    }
  } catch (error) {
    if (error instanceof ContactProviderError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new ContactProviderError(
        504,
        "provider_timeout",
        "The contact channel timed out. Please try again.",
      );
    }
    throw new ContactProviderError(
      502,
      "provider_error",
      "The contact channel could not reach the message provider.",
    );
  } finally {
    clearTimeout(timeout);
  }
}
