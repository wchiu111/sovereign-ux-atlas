import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "vite";

const server = await createServer({ appType: "custom", logLevel: "silent", server: { middlewareMode: true } });

try {
  const { handleContactRequest } = await server.ssrLoadModule("/server/contact/handler.ts");
  const validBody = { name: "Wilson", email: "wilson@example.com", message: "A grounded test message.", website: "" };
  const config = {
    apiKey: "test-key",
    from: "Atlas <hello@example.com>",
    to: "owner@example.com",
    fetchImpl: async (_url, options) => {
      const body = JSON.parse(options.body);
      assert.equal(body.reply_to, validBody.email);
      assert.deepEqual(body.to, ["owner@example.com"]);
      return new Response(JSON.stringify({ id: "message-id" }), { status: 200 });
    },
  };

  await test("accepts only after the provider accepts the message", async () => {
    const result = await handleContactRequest({ method: "POST", body: validBody, clientId: "accept" }, config);
    assert.equal(result.status, 202);
    assert.deepEqual(result.body, { accepted: true });
  });

  await test("fails closed when provider configuration is missing", async () => {
    const result = await handleContactRequest({ method: "POST", body: validBody, clientId: "missing" }, { ...config, apiKey: "" });
    assert.equal(result.status, 503);
  });

  await test("rejects malformed input and honeypot submissions", async () => {
    const malformed = await handleContactRequest({ method: "POST", body: { ...validBody, email: "invalid" }, clientId: "invalid" }, config);
    assert.equal(malformed.status, 400);
    const honeypot = await handleContactRequest({ method: "POST", body: { ...validBody, website: "bot" }, clientId: "bot" }, config);
    assert.equal(honeypot.status, 400);
  });

  await test("does not report success on provider rejection", async () => {
    const result = await handleContactRequest(
      { method: "POST", body: validBody, clientId: "reject" },
      { ...config, fetchImpl: async () => new Response("rejected", { status: 422 }) },
    );
    assert.equal(result.status, 502);
  });
} finally {
  await server.close();
}
