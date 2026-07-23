import { defineAtlasEntry } from "../defineAtlasEntry";

export default defineAtlasEntry({
  id: "regenerative-systems",
  category: "framework",
  frameworkKind: "core",
  title: "REGENERATIVE SYSTEMS",
  subtitle: "A framework for designing systems that recover from misalignment and drift without requiring external intervention.",
  overview: {
    what: "A framework for designing systems that recover from misalignment and drift without requiring external intervention.",
    why: "All systems drift over time. Most product design assumes stability and handles drift reactively.",
    researchFocus: "How do systems naturally return to alignment — and how can that return be structurally supported?",
    keyDiscovery: "Regeneration requires three designed elements: a clear values baseline, drift sensing, and explicit recovery pathways.",
  },
  orbit: {
    angle: 150,
    radius: 112,
    speed: 1.05e-4,
    starPrefix: "rs",
  },
  sections: undefined,
});
