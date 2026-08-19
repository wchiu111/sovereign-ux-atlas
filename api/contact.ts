/// <reference types="node" />

import { handleContactRequest } from "../server/contact/handler.js";

interface ServerRequest {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}

interface ServerResponse {
  status(code: number): ServerResponse;
  setHeader(name: string, value: string): void;
  json(body: unknown): void;
  end(): void;
}

const headerValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

function requestBody(value: unknown) {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return undefined;
  }
}

function sameOrigin(request: ServerRequest) {
  const origin = headerValue(request.headers.origin);
  if (!origin) return true;
  const host = headerValue(request.headers.host);
  return Boolean(host && (origin === `https://${host}` || origin === `http://${host}`));
}

export default async function contactEndpoint(
  request: ServerRequest,
  response: ServerResponse,
) {
  if (!sameOrigin(request)) {
    response.status(403).json({ error: { code: "origin_not_allowed", message: "This contact origin is not allowed." } });
    return;
  }
  if (request.method === "OPTIONS") {
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.status(204).end();
    return;
  }

  const forwardedFor = headerValue(request.headers["x-forwarded-for"]);
  const result = await handleContactRequest(
    {
      method: request.method ?? "GET",
      body: requestBody(request.body),
      clientId: forwardedFor?.split(",")[0]?.trim()
        || request.socket?.remoteAddress
        || "unknown",
    },
    {
      apiKey: process.env.RESEND_API_KEY ?? "",
      from: process.env.CONTACT_FROM_EMAIL ?? "",
      to: process.env.CONTACT_TO_EMAIL ?? "",
      timeoutMs: Number(process.env.CONTACT_TIMEOUT_MS) || 10_000,
      requestsPerMinute: Number(process.env.CONTACT_REQUESTS_PER_MINUTE) || 5,
    },
  );
  Object.entries(result.headers ?? {}).forEach(([name, value]) => response.setHeader(name, value));
  response.status(result.status).json(result.body);
}
