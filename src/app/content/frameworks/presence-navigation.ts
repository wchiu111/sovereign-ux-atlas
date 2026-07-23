import { defineAtlasEntry } from "../defineAtlasEntry";

export default defineAtlasEntry({
  id: "presence-navigation",
  category: "framework",
  frameworkKind: "core",
  title: "PRESENCE NAVIGATION",
  subtitle: "A framework for designing AI systems that navigate the degree of their own presence — knowing when to recede.",
  overview: {
    what: "A framework for designing AI systems that navigate the degree of their own presence — knowing when to recede.",
    why: "Most AI systems are designed to always be present. Presence navigation explores what becomes possible when AI knows when to step back.",
    researchFocus: "What does calibrated AI presence look like across different task types and user states?",
    keyDiscovery: "The highest-quality AI interactions often involve creating space rather than filling it. Capacity to step back is as important as capacity to engage.",
  },
  orbit: {
    angle: 210,
    radius: 112,
    speed: 1.12e-4,
    starPrefix: "pn",
  },
  sections: undefined,
});
