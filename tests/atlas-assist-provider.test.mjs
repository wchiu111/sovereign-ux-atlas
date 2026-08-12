import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "vite";

const server = await createServer({
  appType: "custom",
  logLevel: "silent",
  server: { middlewareMode: true },
});

try {
  const contextModule = await server.ssrLoadModule(
    "/src/app/atlas-assist/buildAtlasAssistContext.ts",
  );
  const providerModule = await server.ssrLoadModule(
    "/src/app/atlas-assist/providers.ts",
  );
  const submissionModule = await server.ssrLoadModule(
    "/src/app/atlas-assist/submitAtlasAssistQuestion.ts",
  );
  const handlerModule = await server.ssrLoadModule(
    "/server/atlas-assist/handler.ts",
  );
  const instructionsModule = await server.ssrLoadModule(
    "/server/atlas-assist/instructions.ts",
  );
  const endpointModule = await server.ssrLoadModule("/api/atlas-assist.ts");

  const projectContext = contextModule.buildAtlasAssistContext({
    scope: "project",
    projectId: "globality",
  });
  const sectionContext = contextModule.buildAtlasAssistContext({
    scope: "section",
    projectId: "globality",
    sectionId: "decisions",
  });
  const atlasContext = contextModule.buildAtlasAssistContext({ scope: "atlas" });

  function sourceFor(context, sourceId) {
    const source = context.contentBlocks.find((block) => block.source.id === sourceId)?.source;
    assert.ok(source, sourceId);
    return source;
  }

  function modelAnswer({
    context,
    answer,
    sourceIds = [],
    interpretation = false,
  }) {
    return {
      answer,
      scope: context.scope,
      sources: sourceIds.map((sourceId) => sourceFor(context, sourceId)),
      limitations: context.limitations.slice(0, 3),
      suggestedFollowUps: ["Show the closest documented evidence"],
      interpretation,
    };
  }

  function openAIResponse(answer, status = 200, headers = {}) {
    return new Response(
      JSON.stringify({
        output: [{ content: [{ type: "output_text", text: JSON.stringify(answer) }] }],
      }),
      { status, headers: { "Content-Type": "application/json", ...headers } },
    );
  }

  async function ask({ query, context, answer, fetchImpl, timeoutMs = 200 }) {
    return handlerModule.handleAtlasAssistRequest(
      { method: "POST", body: { query, context }, clientId: `test:${query}` },
      {
        apiKey: "server-test-key",
        model: "test-model",
        timeoutMs,
        fetchImpl: fetchImpl ?? (async () => openAIResponse(answer)),
      },
    );
  }

  await test("keeps full authored sections, evidence annotations, and collection modules", () => {
    const atlasBodies = atlasContext.contentBlocks.map((block) => block.body).join("\n");
    assert.match(atlasBodies, /The third decision was to redesign the home and project dashboards/);
    assert.match(atlasBodies, /Human makes the final decision/);
    assert.match(atlasBodies, /Decision outcome simulation/);
  });

  await test("answers an overview question through the live server contract", async () => {
    const answer = modelAnswer({
      context: projectContext,
      answer: "Documented fact: Globality reorganized the experience around user work states and decisions.",
      sourceIds: ["entry:globality", "section:globality:decisions"],
    });
    const result = await ask({
      query: "What problem was Wilson solving?",
      context: projectContext,
      answer,
    });
    assert.equal(result.status, 200);
    assert.deepEqual(
      result.body.sources.map((source) => source.id),
      ["entry:globality", "section:globality:decisions"],
    );
  });

  await test("sends exactly the supplied context with strict structured output and no retrieval tools", async () => {
    let outgoing;
    const answer = modelAnswer({
      context: projectContext,
      answer: "Documented fact: The supplied project context is the knowledge boundary.",
      sourceIds: ["entry:globality"],
    });
    const result = await ask({
      query: "Summarize the project",
      context: projectContext,
      answer,
      fetchImpl: async (_url, options) => {
        outgoing = JSON.parse(options.body);
        return openAIResponse(answer);
      },
    });
    const envelope = JSON.parse(outgoing.input[0].content[0].text);
    assert.equal(result.status, 200);
    assert.deepEqual(
      envelope.atlasContext,
      JSON.parse(JSON.stringify(projectContext)),
    );
    assert.equal(outgoing.store, false);
    assert.equal(outgoing.tools, undefined);
    assert.equal(outgoing.text.format.type, "json_schema");
    assert.equal(outgoing.text.format.strict, true);
  });

  await test("answers a focused-section question with section-only sources", async () => {
    const answer = modelAnswer({
      context: sectionContext,
      answer: "Documented fact: The decisions section reframed each surface around what the user needed to decide next.",
      sourceIds: ["section:globality:decisions"],
    });
    const result = await ask({
      query: "Why did this design decision matter?",
      context: sectionContext,
      answer,
    });
    assert.equal(result.status, 200);
    assert.equal(result.body.scope, "section");
    assert.ok(result.body.sources.every((source) => sectionContext.sourceIds.includes(source.id)));
  });

  await test("answers a cross-project Atlas-scope question", async () => {
    const answer = modelAnswer({
      context: atlasContext,
      answer: "Interpretation: Globality and Agentic Insurance both make decision context visible, while applying that principle in different domains.",
      sourceIds: ["section:globality:decisions", "section:agentic-insurance:decisions"],
      interpretation: true,
    });
    const result = await ask({
      query: "Compare how Globality and Agentic Insurance preserve decision authority.",
      context: atlasContext,
      answer,
    });
    assert.equal(result.status, 200);
    assert.equal(result.body.scope, "atlas");
    assert.equal(result.body.sources.length, 2);
  });

  await test("refuses unsupported claims and invented metric requests", async () => {
    const unsupported = modelAnswer({
      context: projectContext,
      answer: "Missing evidence: This project does not document customer retention, so that conclusion cannot be supported.",
    });
    const inventedMetric = modelAnswer({
      context: projectContext,
      answer: "Missing evidence: The project does not document a conversion-lift percentage. Providing one would invent an outcome.",
    });
    const unsupportedResult = await ask({
      query: "Did this improve customer retention?",
      context: projectContext,
      answer: unsupported,
    });
    const metricResult = await ask({
      query: "What percentage conversion lift did the redesign produce?",
      context: projectContext,
      answer: inventedMetric,
    });
    assert.equal(unsupportedResult.status, 200);
    assert.match(unsupportedResult.body.answer, /Missing evidence/);
    assert.equal(metricResult.status, 200);
    assert.match(metricResult.body.answer, /would invent an outcome/);
  });

  await test("rejects citations outside the submitted context and recovers once", async () => {
    let calls = 0;
    const valid = modelAnswer({
      context: sectionContext,
      answer: "Documented fact: This answer uses the current section.",
      sourceIds: ["section:globality:decisions"],
    });
    const invalid = {
      ...valid,
      sources: [{ ...valid.sources[0], id: "section:invented:artifact" }],
    };
    const result = await ask({
      query: "Explain this section",
      context: sectionContext,
      answer: valid,
      fetchImpl: async () => openAIResponse(calls++ === 0 ? invalid : valid),
    });
    assert.equal(calls, 2);
    assert.equal(result.status, 200);
    assert.ok(result.body.sources.every((source) => sectionContext.sourceIds.includes(source.id)));
  });

  await test("returns a clear unavailable response when credentials are missing", async () => {
    const result = await handlerModule.handleAtlasAssistRequest(
      { method: "POST", body: { query: "Summarize", context: projectContext }, clientId: "missing-key" },
      { apiKey: "", model: "test-model" },
    );
    assert.equal(result.status, 503);
    assert.equal(result.body.error.code, "provider_unavailable");
  });

  await test("aborts provider requests at the configured timeout", async () => {
    const fetchImpl = async (_url, options) => new Promise((_resolve, reject) => {
      options.signal.addEventListener("abort", () => {
        const error = new Error("aborted");
        error.name = "AbortError";
        reject(error);
      });
    });
    const result = await ask({
      query: "Summarize this project",
      context: projectContext,
      fetchImpl,
      timeoutMs: 10,
    });
    assert.equal(result.status, 504);
    assert.equal(result.body.error.code, "timeout");
  });

  await test("maps local and upstream rate limits to safe client responses", async () => {
    const rateLimitStore = new Map();
    const config = {
      apiKey: "server-test-key",
      model: "test-model",
      requestsPerMinute: 1,
      rateLimitStore,
      fetchImpl: async () => openAIResponse(modelAnswer({
        context: projectContext,
        answer: "Documented fact: A grounded answer.",
        sourceIds: ["entry:globality"],
      })),
    };
    const input = {
      method: "POST",
      body: { query: "Summarize this project", context: projectContext },
      clientId: "rate-limit-client",
    };
    assert.equal((await handlerModule.handleAtlasAssistRequest(input, config)).status, 200);
    const limited = await handlerModule.handleAtlasAssistRequest(input, config);
    assert.equal(limited.status, 429);
    assert.equal(limited.body.error.code, "rate_limited");

    const upstream = await ask({
      query: "Explain the research focus",
      context: projectContext,
      fetchImpl: async () => new Response("{}", {
        status: 429,
        headers: { "Retry-After": "5" },
      }),
    });
    assert.equal(upstream.status, 429);
    assert.equal(upstream.headers["Retry-After"], "5");
  });

  await test("provider modes never use the mock silently in production", () => {
    assert.equal(providerModule.selectAtlasAssistProvider({ isProduction: false }).mode, "deterministic");
    assert.equal(providerModule.selectAtlasAssistProvider({ isProduction: true }).mode, "unavailable");
    assert.equal(providerModule.selectAtlasAssistProvider({
      isProduction: true,
      endpoint: "/api/atlas-assist",
    }).mode, "live");
  });

  await test("the HTTP provider carries one prior grounded turn only within the same scope", async () => {
    const originalFetch = globalThis.fetch;
    const payloads = [];
    const answer = modelAnswer({
      context: projectContext,
      answer: "Documented fact: This answer remains grounded in Globality.",
      sourceIds: ["entry:globality"],
    });
    globalThis.fetch = async (_url, options) => {
      payloads.push(JSON.parse(options.body));
      return new Response(JSON.stringify(answer), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };
    try {
      const provider = new providerModule.HttpAtlasAssistProvider("/api/atlas-assist", 200);
      await provider.answer({ query: "Summarize this project", context: projectContext });
      await provider.answer({ query: "Why did that matter?", context: projectContext });
      await provider.answer({ query: "Explain this section", context: sectionContext });
    } finally {
      globalThis.fetch = originalFetch;
    }
    assert.equal(payloads[0].history, undefined);
    assert.deepEqual(payloads[1].history, [{
      query: "Summarize this project",
      answer: answer.answer,
    }]);
    assert.equal(payloads[2].history, undefined);
  });

  await test("the client submission path rejects whitespace with a visible error state", async () => {
    let failure;
    let calls = 0;
    const result = await submissionModule.executeAtlasAssistQuestion({
      question: "   ",
      getContext: () => projectContext,
      provider: { answer: async () => { calls += 1; } },
      timeoutMs: 200,
      onSubmitting: () => assert.fail("whitespace must not submit"),
      onSuccess: () => assert.fail("whitespace must not resolve"),
      onFailure: (message) => { failure = message; },
    });
    assert.equal(result, "error");
    assert.equal(calls, 0);
    assert.match(failure, /Enter a question/);
  });

  await test("the client submission path calls its provider once and produces a visible answer", async () => {
    let calls = 0;
    let status = "idle";
    let visibleAnswer = "";
    const deterministic = new providerModule.DeterministicAtlasAssistProvider();
    const result = await submissionModule.executeAtlasAssistQuestion({
      question: "How did AI help this project without validating the solution?",
      getContext: () => sectionContext,
      provider: {
        answer: async (input) => {
          calls += 1;
          return deterministic.answer(input);
        },
      },
      timeoutMs: 200,
      onSubmitting: () => { status = "submitting"; },
      onSuccess: (answer) => {
        status = "success";
        visibleAnswer = answer.answer;
      },
      onFailure: () => { status = "error"; },
    });
    assert.equal(result, "success");
    assert.equal(calls, 1);
    assert.equal(status, "success");
    assert.ok(visibleAnswer.length > 0);
  });

  await test("the client submission path invokes HTTP fetch exactly once", async () => {
    const originalFetch = globalThis.fetch;
    let fetchCalls = 0;
    const answer = modelAnswer({
      context: sectionContext,
      answer: "Documented fact: The section describes state-aware navigation.",
      sourceIds: ["section:globality:decisions"],
    });
    globalThis.fetch = async () => {
      fetchCalls += 1;
      return new Response(JSON.stringify(answer), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };
    try {
      const result = await submissionModule.executeAtlasAssistQuestion({
        question: "Explain this section",
        getContext: () => sectionContext,
        provider: new providerModule.HttpAtlasAssistProvider("/api/atlas-assist", 200),
        timeoutMs: 200,
        onSubmitting: () => {},
        onSuccess: () => {},
        onFailure: () => {},
      });
      assert.equal(result, "success");
      assert.equal(fetchCalls, 1);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  await test("the client submission path catches synchronous context failures", async () => {
    let status = "idle";
    const result = await submissionModule.executeAtlasAssistQuestion({
      question: "Explain this section",
      getContext: () => { throw new Error("context exploded"); },
      provider: new providerModule.DeterministicAtlasAssistProvider(),
      timeoutMs: 200,
      onSubmitting: () => { status = "submitting"; },
      onSuccess: () => { status = "success"; },
      onFailure: () => { status = "error"; },
    });
    assert.equal(result, "error");
    assert.equal(status, "error");
  });

  await test("the client submission path exposes unavailable provider selection", async () => {
    let status = "idle";
    const result = await submissionModule.executeAtlasAssistQuestion({
      question: "Explain this section",
      getContext: () => sectionContext,
      provider: new providerModule.UnavailableAtlasAssistProvider(),
      timeoutMs: 200,
      onSubmitting: () => { status = "submitting"; },
      onSuccess: () => { status = "success"; },
      onFailure: (_message, unavailable) => {
        status = unavailable ? "unavailable" : "error";
      },
    });
    assert.equal(result, "unavailable");
    assert.equal(status, "unavailable");
  });

  await test("the instruction module contains the required trust boundaries", () => {
    assert.match(instructionsModule.SOVEREIGN_ATLAS_INSTRUCTIONS, /only from the supplied Atlas context/i);
    assert.match(instructionsModule.SOVEREIGN_ATLAS_INSTRUCTIONS, /Never invent users, research, validation, metrics/i);
    assert.match(instructionsModule.SOVEREIGN_ATLAS_INSTRUCTIONS, /Preserve human decision authority/i);
    assert.match(instructionsModule.SOVEREIGN_ATLAS_INSTRUCTIONS, /chain-of-thought/i);
    assert.equal(typeof endpointModule.default, "function");
  });
} finally {
  await server.close();
}
