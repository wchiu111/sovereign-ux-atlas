import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "vite";

const server = await createServer({
  appType: "custom",
  logLevel: "silent",
  server: { middlewareMode: true },
});

try {
  const normalization = await server.ssrLoadModule("/src/app/search/normalizeSearchQuery.ts");
  const search = await server.ssrLoadModule("/src/app/search/searchAtlas.ts");
  const data = await server.ssrLoadModule("/src/app/data/atlasSearchIndex.ts");
  const destinations = await server.ssrLoadModule(
    "/src/app/search/resolveAtlasSearchDestination.ts",
  );

  const runSearch = (query, limit = 4) => search.searchAtlas({
    query,
    entries: data.INDEXED_ATLAS_SEARCH_ENTRIES,
    limit,
  });

  await test("normalizes punctuation, natural-language prefixes, and plurals", () => {
    assert.equal(
      normalization.normalizeSearchQuery("  Show me: AI Design Systems!!  "),
      "ai design systems",
    );
    assert.deepEqual(
      normalization.tokenizeSearchQuery("Browse case studies"),
      ["case", "study"],
    );
  });

  await test("ranks exact titles first", () => {
    const matches = runSearch("globality");
    assert.equal(matches[0].entry.id, "globality");
    assert.equal(matches[0].matchedBy, "exact-title");
  });

  await test("resolves renamed framework aliases to canonical entries", () => {
    const modelDesign = runSearch("model design");
    const authorityGradient = runSearch("authority gradient");
    assert.equal(modelDesign[0].entry.id, "behavioral-architecture");
    assert.equal(modelDesign[0].matchedBy, "alias");
    assert.equal(authorityGradient[0].entry.id, "authority-gradient");
  });

  await test("supports multi-term content matching", () => {
    assert.equal(runSearch("higher education")[0].entry.id, "oracle");
    assert.equal(runSearch("human authority")[0].entry.id, "authority-gradient");
  });

  await test("applies broad visitor intent without forcing every topic to a system", () => {
    assert.equal(runSearch("strongest work")[0].entry.id, "case-studies");
    assert.equal(runSearch("AI frameworks")[0].entry.id, "frameworks");
    assert.equal(runSearch("about Wilson")[0].entry.id, "about-wilson");

    const trustIds = runSearch("trust").map((match) => match.entry.id);
    assert.ok(trustIds.includes("behavioral-architecture"));
    assert.ok(trustIds.includes("sovereign-ux"));
    assert.ok(trustIds.some((id) => id === "mirror-test" || id === "agentic-insurance"));
  });

  await test("uses stable alphabetical tie-breaking", () => {
    const tiedEntries = search.indexAtlasSearchEntries([
      {
        id: "zulu",
        title: "Zulu",
        kind: "framework",
        typeLabel: "FRAMEWORK",
        parentLabel: "FRAMEWORKS",
        description: "Shared concept",
        aliases: [],
        keywords: ["shared"],
        topics: [],
        availability: "available",
      },
      {
        id: "alpha",
        title: "Alpha",
        kind: "framework",
        typeLabel: "FRAMEWORK",
        parentLabel: "FRAMEWORKS",
        description: "Shared concept",
        aliases: [],
        keywords: ["shared"],
        topics: [],
        availability: "available",
      },
    ]);
    const matches = search.searchAtlas({ query: "shared", entries: tiedEntries, limit: 4 });
    assert.deepEqual(matches.map((match) => match.entry.id), ["alpha", "zulu"]);
  });

  await test("never returns more than four results", () => {
    assert.equal(runSearch("AI", 20).length, 4);
  });

  await test("hides planned content unless it is explicitly requested", () => {
    assert.ok(!runSearch("systems").some((match) => match.entry.id === "regenerative-systems"));
    const explicit = runSearch("Regenerative Systems");
    assert.equal(explicit[0].entry.id, "regenerative-systems");
    assert.equal(explicit[0].entry.availability, "planned");
  });

  await test("returns an empty result for an unrelated query", () => {
    assert.deepEqual(runSearch("quantum weather forecast"), []);
  });

  await test("validates every search destination", () => {
    assert.deepEqual(
      destinations.validateAtlasSearchDestinations(data.ATLAS_SEARCH_INDEX),
      [],
    );
    assert.deepEqual(
      destinations.resolveAtlasSearchDestination("sovereign-atlas-cs"),
      { type: "entry", targetId: "sovereign-atlas-cs", systemId: "case-studies" },
    );
    assert.deepEqual(
      destinations.resolveAtlasSearchDestination("sovereign-ux"),
      { type: "system", targetId: "frameworks" },
    );
  });

  await test("acceptance queries return sensible paths", () => {
    const queries = [
      "globality",
      "oracle",
      "insurance",
      "case studies",
      "strongest work",
      "portfolio",
      "AI frameworks",
      "design methods",
      "trust",
      "human authority",
      "governance",
      "decision rights",
      "authority gradient",
      "authority drift",
      "mirror test",
      "about Wilson",
      "background",
      "higher education",
      "procurement",
      "AI behavior",
    ];
    queries.forEach((query) => assert.ok(runSearch(query).length > 0, query));
  });
} finally {
  await server.close();
}
