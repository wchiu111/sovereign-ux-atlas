import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "vite";

const server = await createServer({
  appType: "custom",
  logLevel: "silent",
  server: { middlewareMode: true },
});

try {
  const paths = {
    "agentic-insurance": "/src/app/content/case-studies/agentic-insurance.ts",
    globality: "/src/app/content/case-studies/globality.ts",
    oracle: "/src/app/content/case-studies/oracle.ts",
    "sovereign-atlas": "/src/app/content/case-studies/sovereign-atlas.ts",
  };

  const entries = Object.fromEntries(
    await Promise.all(
      Object.entries(paths).map(async ([id, path]) => {
        const module = await server.ssrLoadModule(path);
        return [id, module.default];
      }),
    ),
  );

  await test("case studies expose their authored Focus Mode roles", () => {
    assert.equal(entries["agentic-insurance"].role, "Product Designer");
    assert.equal(entries.globality.role, "Senior Product Designer II");
    assert.equal(entries.oracle.role, "Interactive Designer");
    assert.equal(
      entries["sovereign-atlas"].role,
      "Product Designer · Design Engineer",
    );
  });

  await test("Sovereign Atlas is an intentional five-section exception", () => {
    const sovereignAtlas = entries["sovereign-atlas"];

    assert.deepEqual(
      sovereignAtlas.sections.map((section) => section.id),
      ["context", "problem", "approach", "outcomes", "lessons"],
    );
    assert.equal(sovereignAtlas.sectionStructure.kind, "authored-exception");
    assert.ok(!sovereignAtlas.sections.some((section) => section.id === "decisions"));
    assert.ok(!sovereignAtlas.overviewStars.some((star) => star.id === "decisions"));
  });

  await test("standard case studies retain their six authored sections", () => {
    for (const id of ["agentic-insurance", "globality", "oracle"]) {
      assert.equal(entries[id].sections.length, 6, id);
    }
  });
} finally {
  await server.close();
}
