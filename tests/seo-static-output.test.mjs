import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createServer } from "vite";

const expected = [
  ["/", "Wilson Chiu — Product Designer & Design Engineer | Sovereign Atlas", "Product designer and design engineer exploring AI-native UX, agentic systems, trust, and complex enterprise products. Explore case studies, frameworks, and experiments in the Sovereign Atlas."],
  ["/case-studies/agentic-insurance", "Agentic Insurance — AI Product Design Case Study | Wilson Chiu", "An exploration of AI-assisted insurance workflows examining how agents can support complex decisions while preserving human judgment, visibility, and control."],
  ["/case-studies/globality", "Globality — Enterprise AI Product Design Case Study | Wilson Chiu", "Product design work at Globality focused on AI-powered enterprise procurement, complex workflows, scalable product systems, and reducing friction across sourcing experiences."],
  ["/case-studies/oracle", "Oracle — Enterprise Design Case Study | Wilson Chiu", "Design work at Oracle translating a complex higher-education product ecosystem into a clearer, adaptable customer experience through information architecture and progressive disclosure."],
  ["/case-studies/sovereign-atlas", "Sovereign Atlas — Product Design & Design Engineering Case Study | Wilson Chiu", "How Wilson Chiu designed and built an interactive knowledge system connecting case studies, frameworks, experiments, evidence, search, and AI-assisted exploration."],
  ["/frameworks/authority-gradient", "Decision Rights — Human & AI Decision Authority Framework | Wilson Chiu", "A framework for determining when AI should recommend, act, defer, or require human approval within AI-assisted products."],
  ["/frameworks/relational-ai-literacy", "Relational AI Literacy — Understanding Human-AI Relationships | Wilson Chiu", "A framework for understanding how people interpret, trust, collaborate with, and establish boundaries with increasingly relational AI systems."],
  ["/frameworks/regenerative-systems", "Regenerative Systems — Preserving Design Intent in AI Systems | Wilson Chiu", "A framework for identifying, containing, and repairing design drift as AI-generated products evolve from design through implementation."],
  ["/frameworks/presence-navigation", "Presence Navigation — Designing Interfaces Around User State | Wilson Chiu", "A framework exploring how interfaces can respond to attention, context, readiness, and user state rather than relying only on conventional navigation."],
];

function outputPath(route) {
  return route === "/" ? "dist/index.html" : `dist${route}/index.html`;
}

function content(html, expression, label) {
  const match = html.match(expression);
  assert.ok(match, label);
  return match[1];
}

function decodeHtml(value) {
  return value.replaceAll("&amp;", "&").replaceAll("&quot;", '"');
}

for (const [route, title, description] of expected) {
  await test(`${route} has route-specific initial HTML`, async () => {
    const html = await readFile(outputPath(route), "utf8");
    const canonical = `https://wchiudesign.com${route === "/" ? "/" : route}`;
    assert.equal(decodeHtml(content(html, /<title>(.*?)<\/title>/, "title")), title);
    assert.equal(decodeHtml(content(html, /<meta name="description" content="([^"]+)"/, "description")), description);
    assert.equal(content(html, /<meta name="robots" content="([^"]+)"/, "robots"), "index, follow");
    assert.equal(content(html, /<link rel="canonical" href="([^"]+)"/, "canonical"), canonical);
    assert.equal(content(html, /<meta property="og:url" content="([^"]+)"/, "og:url"), canonical);
    assert.equal(decodeHtml(content(html, /<meta property="og:title" content="([^"]+)"/, "og:title")), title);
    assert.equal(decodeHtml(content(html, /<meta property="og:description" content="([^"]+)"/, "og:description")), description);
    assert.equal(decodeHtml(content(html, /<meta name="twitter:title" content="([^"]+)"/, "twitter:title")), title);
    assert.equal(decodeHtml(content(html, /<meta name="twitter:description" content="([^"]+)"/, "twitter:description")), description);
    const schema = JSON.parse(content(html, /<script id="atlas-structured-data" type="application\/ld\+json">(.*?)<\/script>/, "JSON-LD"));
    assert.equal(schema["@context"], "https://schema.org");
  });
}

await test("application states use a noindex initial shell", async () => {
  const html = await readFile("dist/app-shell.html", "utf8");
  assert.equal(content(html, /<meta name="robots" content="([^"]+)"/, "robots"), "noindex, nofollow");
  assert.match(html, /<script type="module" crossorigin src="\/assets\/index-[^"]+\.js"><\/script>/);
});

await test("sitemap contains exactly the approved Pass 1 routes", async () => {
  const sitemap = await readFile("dist/sitemap.xml", "utf8");
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(urls, expected.map(([route]) => `https://wchiudesign.com${route === "/" ? "/" : route}`));
  assert.doesNotMatch(sitemap, /experiments|application-kit|behavioral-architecture|staging/);
});

const vite = await createServer({ appType: "custom", logLevel: "silent", server: { middlewareMode: true } });
try {
  const policy = await vite.ssrLoadModule("/src/app/seo/seoMetadata.ts");
  await test("explicit indexability policy protects excluded destinations", () => {
    assert.equal(policy.getSeoMetadata("/frameworks/application-kit").indexability, "hold");
    assert.equal(policy.getSeoMetadata("/frameworks/behavioral-architecture").indexability, "retired");
    assert.equal(policy.getSeoMetadata("/experiments/authority-drift").indexability, "unreleased");
    assert.equal(policy.getSeoMetadata("/case-studies/globality/problem").indexability, "app-state-only");
  });
} finally {
  await vite.close();
}
