import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "vite";

const server = await createServer({
  appType: "custom",
  logLevel: "silent",
  server: { middlewareMode: true },
});

try {
  const routes = await server.ssrLoadModule("/src/app/routing/atlasRoutes.ts");

  const parse = (pathname, hash = "") => routes.parseAtlasRoute({ pathname, hash });

  await test("builds canonical Experiment paths", () => {
    assert.equal(routes.atlasSystemPath("experiments"), "/experiments");
    assert.equal(
      routes.experimentBasePath("gestalt-principles"),
      "/experiments/gestalt-principles",
    );
    assert.equal(
      routes.experimentSectionPath("gestalt-principles", "outputs"),
      "/experiments/gestalt-principles/outputs",
    );
    assert.equal(
      routes.experimentEvidencePath(
        "gestalt-principles",
        "outputs",
        "gestalt-output-05",
      ),
      "/experiments/gestalt-principles/outputs/evidence/gestalt-output-05",
    );
  });

  await test("restores the Experiments system and overview", () => {
    const system = parse("/experiments");
    assert.equal(system.atlasState.level, 1);
    assert.equal(system.atlasState.activeSystemId, "experiments");

    const overview = parse("/experiments/design-philosophy");
    assert.equal(overview.atlasState.level, 2);
    assert.equal(overview.atlasState.activePlanetId, "design-philosophy");
    assert.equal(overview.atlasState.drawerOpen, true);
  });

  await test("restores Experiment sections and evidence", () => {
    const section = parse("/experiments/authority-drift/drift");
    assert.equal(section.atlasState.level, 3);
    assert.equal(section.atlasState.activeSystemId, "experiments");
    assert.equal(section.sectionId, "drift");

    const evidence = parse(
      "/experiments/gestalt-principles/outputs/evidence/gestalt-output-05",
    );
    assert.equal(evidence.sectionId, "outputs");
    assert.equal(evidence.evidenceId, "gestalt-output-05");
  });

  await test("canonicalizes legacy Experiment routes", () => {
    const route = parse("/experiment/think-like-a-designer/reflection");
    assert.equal(
      route.canonicalPath,
      "/experiments/think-like-a-designer/reflection",
    );
  });

  await test("rejects unknown Experiment paths", () => {
    assert.equal(parse("/experiments/not-a-real-experiment"), null);
    assert.equal(parse("/experiments/gestalt-principles/not-a-section"), null);
  });
} finally {
  await server.close();
}
