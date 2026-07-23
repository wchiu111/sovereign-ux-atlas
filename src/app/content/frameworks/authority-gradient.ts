import { defineAtlasEntry } from "../defineAtlasEntry";

export default defineAtlasEntry({
  id: "authority-gradient",
  aliases: ["reverse-pyramid"],
  category: "framework",
  frameworkKind: "core",
  signatureStellarType: "purpose",
  title: "AUTHORITY GRADIENT",
  subtitle:
    "A framework for determining where human authority should remain as AI systems move from purpose to execution.",
  overview: {
    what:
      "A framework for locating human authority across system purpose, strategy, AI decisions, and human approval.",
    why:
      "Human-in-the-loop patterns often add approval steps without clarifying whether people still control the system's purpose, strategy, or operating boundaries.",
    researchFocus:
      "How can individual decisions be delegated to AI without quietly delegating the authority to define what the system is trying to accomplish?",
    keyDiscovery:
      "Human authority does not require manual control over every decision. It requires meaningful control over purpose, boundaries, and the conditions under which decisions are made.",
  },
  orbit: {
    angle: -90,
    radius: 112,
    speed: 1.18e-4,
    starPrefix: "ag",
  },
  overviewStars: [
    {
      id: "system-purpose",
      label: "SYSTEM PURPOSE",
      angle: -145,
      x: -0.88,
      y: -0.56,
      scale: 1.24,
      stellarType: "purpose",
      intensity: "bright",
    },
    {
      id: "system-strategy",
      label: "SYSTEM STRATEGY",
      angle: -58,
      x: 0.52,
      y: -0.88,
      scale: 1.08,
      stellarType: "strategy",
      intensity: "balanced",
    },
    {
      id: "ai-decision",
      label: "AI DECISION",
      angle: 20,
      x: 0.9,
      y: 0.3,
      scale: 1,
      stellarType: "agentic",
      intensity: "bright",
    },
    {
      id: "human-approval",
      label: "HUMAN APPROVAL",
      angle: 126,
      x: -0.5,
      y: 0.86,
      scale: 0.92,
      stellarType: "judgment",
      intensity: "balanced",
    },
  ],
  constellation: {
    showCenterConnections: false,
    connections: [
      { from: "system-purpose", to: "system-strategy", strength: "primary" },
      { from: "system-strategy", to: "ai-decision", strength: "primary" },
      { from: "ai-decision", to: "human-approval", strength: "secondary" },
    ],
  },
  sections: undefined,
});
