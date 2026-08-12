import { handleAtlasAssistRequest } from "../server/atlas-assist/handler";

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

function headerValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function positiveNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function requestBody(value: unknown) {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return undefined;
  }
}

function allowedOrigin(request: ServerRequest) {
  const origin = headerValue(request.headers.origin);
  if (!origin) return undefined;
  const configured = (process.env.ATLAS_ASSIST_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const host = headerValue(request.headers.host);
  const sameOrigin = host && (origin === `https://${host}` || origin === `http://${host}`);
  return sameOrigin || configured.includes(origin) ? origin : null;
}

export default async function atlasAssistEndpoint(
  request: ServerRequest,
  response: ServerResponse,
) {
  const origin = allowedOrigin(request);
  if (origin === null) {
    response.status(403).json({
      error: { code: "origin_not_allowed", message: "This Atlas Assist origin is not allowed." },
    });
    return;
  }
  if (origin) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Vary", "Origin");
  }
  if (request.method === "OPTIONS") {
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.status(204).end();
    return;
  }

  const forwardedFor = headerValue(request.headers["x-forwarded-for"]);
  if (process.env.NODE_ENV !== "production") {
    console.info({
      hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
      model: process.env.OPENAI_ATLAS_ASSIST_MODEL ?? "missing",
      pid: process.pid,
    });
  }
  const result = await handleAtlasAssistRequest(
    {
      method: request.method ?? "GET",
      body: requestBody(request.body),
      clientId: forwardedFor?.split(",")[0]?.trim()
        || request.socket?.remoteAddress
        || "unknown",
    },
    {
      apiKey: process.env.OPENAI_API_KEY ?? "",
      model: process.env.OPENAI_ATLAS_ASSIST_MODEL ?? "gpt-5.6-luna",
      timeoutMs: positiveNumber(process.env.ATLAS_ASSIST_TIMEOUT_MS, 12_000),
      requestsPerMinute: positiveNumber(process.env.ATLAS_ASSIST_REQUESTS_PER_MINUTE, 12),
    },
  );

  Object.entries(result.headers ?? {}).forEach(([name, value]) => {
    response.setHeader(name, value);
  });
  response.status(result.status).json(result.body);
}
