import { defineAtlasEntry } from "../defineAtlasEntry";

export default defineAtlasEntry({
  id: "authority-gradient",
  aliases: ["reverse-pyramid", "decision-rights"],
  semantics: {
    keywords: [
      "decision rights",
      "authority",
      "human authority",
      "human in the loop",
      "AI governance",
      "delegation",
    ],
    aliases: [
      "authority gradient",
      "authority model",
      "delegation model",
      "HITL",
    ],
    summary:
      "A framework for mapping who defines purpose, sets strategy, delegates AI decisions, and retains meaningful review authority.",
  },
  category: "framework",
  frameworkKind: "core",
  signatureStellarType: "purpose",
  title: "DECISION RIGHTS",
  subtitle:
    "A framework for mapping who defines purpose, sets strategy, delegates AI decisions, and retains meaningful review authority.",
  tags: ["HUMAN AUTHORITY", "DELEGATION", "GOVERNANCE"],
  overview: {
    what:
      "A framework for mapping who holds decision rights across system purpose, strategy, AI execution, and human review.",
    why:
      "Human-in-the-loop patterns often add approval without clarifying who controls the choices that shape the system upstream.",
    researchFocus:
      "How can individual decisions be delegated to AI without quietly delegating the authority to define what the system is trying to accomplish?",
    keyDiscovery:
      "Human authority does not require manual control over every decision. It requires meaningful control over purpose, boundaries, and the conditions under which decisions are made.",
  },
  presentation: {
    mode: "map-led",
    sequenceLabel: "AUTHORITY PATH",
    railLabel: "MAPS & TOOLS",
    artifactLabel: "TOOL",
    emptyRailMessage:
      "Maps and application tools will appear here as the framework develops.",
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
      {
        from: "system-purpose",
        to: "system-strategy",
        strength: "primary",
        type: "extends",
        rationale:
          "Strategy translates the system's purpose into operating logic, constraints, and acceptable methods.",
      },
      {
        from: "system-strategy",
        to: "ai-decision",
        strength: "primary",
        type: "applies",
        rationale:
          "AI decisions apply the policies, thresholds, and boundaries established at the strategy layer.",
      },
      {
        from: "ai-decision",
        to: "human-approval",
        strength: "secondary",
        type: "guards",
        rationale:
          "Human approval can guard consequential decisions when reviewers retain context, alternatives, and permission to disagree.",
      },
    ],
  },
  sections: [
    {
      id: "system-purpose",
      label: "System Purpose",
      accentStellarType: "purpose",
      semantics: {
        keywords: [
          "purpose",
          "intent",
          "outcomes",
          "values",
          "operating boundaries",
          "authority",
        ],
        aliases: ["system intent", "why"],
        summary:
          "The intended outcome, protected values, and boundaries that govern every downstream system decision.",
      },
      subtitle: "Why authority begins upstream.",
      readingTime: 2,
      content:
        "Before an AI system makes a decision, someone has already decided what the system is trying to accomplish. System purpose defines the intended outcome, who the system is meant to serve, which values must be protected, and what the system should never optimize for.\n\nThis is the deepest layer of authority because every downstream strategy and decision inherits its direction from here. If the purpose is incomplete, misaligned, or invisible, adding human review later cannot repair the foundation.\n\nThe practical question is not whether a person touches every output. It is whether people can still examine, challenge, and change the purpose governing those outputs.",
      insight:
        "If people do not control the system's purpose, reviewing its outputs does not restore meaningful authority.",
    },
    {
      id: "system-strategy",
      label: "System Strategy",
      accentStellarType: "strategy",
      semantics: {
        keywords: [
          "strategy",
          "policy",
          "constraints",
          "thresholds",
          "escalation",
          "governance",
        ],
        aliases: ["operating logic", "how"],
        summary:
          "The policies, constraints, thresholds, and acceptable methods that translate purpose into operating logic.",
      },
      subtitle: "How human intent becomes operating logic.",
      readingTime: 2,
      content:
        "System strategy translates purpose into policies, constraints, thresholds, evidence requirements, and acceptable methods. It determines how competing goals are weighed and which conditions require escalation.\n\nThis is often the least visible layer. Teams may agree on a responsible purpose while allowing implementation choices, optimization targets, or model behavior to quietly redefine it. The system still appears aligned because the stated goal has not changed, but its operating logic has.\n\nStrategy is usually a shared layer. AI can recommend methods and adapt within context, but the boundaries governing those adaptations must remain visible and contestable.",
      insight:
        "Strategy is where human intent either becomes structural or quietly disappears.",
    },
    {
      id: "ai-decision",
      label: "AI Decision",
      accentStellarType: "agentic",
      semantics: {
        keywords: [
          "AI decision",
          "automation",
          "delegation",
          "classification",
          "routing",
          "recommendation",
        ],
        aliases: ["agentic decision", "automated decision", "decide"],
        summary:
          "A decision delegated to AI within visible purpose, constraints, confidence thresholds, and escalation conditions.",
      },
      subtitle: "What can be delegated without surrendering the system.",
      readingTime: 2,
      content:
        "AI decisions include classification, routing, prioritization, recommendations, and routine actions made within established boundaries. These are the moments most people notice because they produce visible outcomes.\n\nDelegation at this layer can be useful. A system does not need human permission for every low-risk decision if its purpose, constraints, confidence thresholds, and escalation conditions are well governed.\n\nThe danger appears when repeated execution begins changing the rules that were meant to contain it. Decision authority has expanded into strategic authority, often without an explicit handoff.",
      insight:
        "Delegating a decision is not the same as delegating the authority to define the conditions under which it is made.",
    },
    {
      id: "human-approval",
      label: "Human Approval",
      accentStellarType: "judgment",
      semantics: {
        keywords: [
          "human approval",
          "oversight",
          "review",
          "accountability",
          "judgment",
          "human in the loop",
        ],
        aliases: ["human review", "HITL", "approval step"],
        summary:
          "The conditions under which human review preserves meaningful authority instead of merely performing approval.",
      },
      subtitle: "Why a final review can create the appearance of control.",
      readingTime: 2,
      content:
        "Human-in-the-loop is often treated as a safety guarantee: the AI proposes and a person approves. But approval only preserves authority when the reviewer has enough context, time, alternatives, and permission to meaningfully disagree.\n\nWhen people review too many outputs, inherit invisible assumptions, or can only accept and reject what the system has already framed, approval becomes ceremonial. A human is present, but the consequential choices were made earlier.\n\nSome integrity and review steps may eventually be automated as well. That does not automatically make the system unsafe. It makes the upstream questions more important: who defined the evaluator's purpose, which standards govern it, and where can a person still redirect the system?",
      insight:
        "A person can approve every output while controlling none of the assumptions that produced it.",
    },
  ],
});
