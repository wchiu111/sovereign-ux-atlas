import { defineAtlasEntry } from "../defineAtlasEntry";

export default defineAtlasEntry({
  id: "behavioral-architecture",
  aliases: ["model-design"],
  semantics: {
    keywords: [
      "behavioral architecture",
      "model behavior",
      "AI governance",
      "constraints",
      "behavioral integrity",
      "recovery",
      "alignment",
    ],
    aliases: [
      "model design",
      "alignment architecture",
      "behavioral infrastructure",
      "system character",
    ],
    summary:
      "A framework for designing the structures around an AI model that preserve trustworthy behavior over time.",
  },
  category: "framework",
  frameworkKind: "core",
  signatureStellarType: "strategy",
  title: "BEHAVIORAL ARCHITECTURE",
  subtitle:
    "A framework for designing the governance, constraints, integrity signals, and recovery capacity that shape how an AI system behaves over time.",
  overview: {
    what:
      "A framework for designing the structures around an AI model that give its behavior a stable, trustworthy shape.",
    why:
      "AI systems are frequently designed around what they can generate, automate, predict, or decide without equal attention to what keeps that behavior coherent after deployment.",
    researchFocus:
      "What structural choices help an AI system remain aligned with its stated purpose as its capabilities, context, and operating conditions change?",
    keyDiscovery:
      "Trustworthy behavior does not come from the model alone. It emerges from the architecture governing what the system may do, how its behavior is evaluated, and how it recovers when alignment begins to drift.",
  },
  presentation: {
    mode: "map-led",
    sequenceLabel: "BEHAVIORAL LOOP",
    railLabel: "MAPS & TOOLS",
    artifactLabel: "TOOL",
    emptyRailMessage:
      "Behavior maps and evaluation tools will appear here as the framework develops.",
  },
  orbit: {
    angle: 30,
    radius: 112,
    speed: 0.92e-4,
    starPrefix: "ba",
  },
  overviewStars: [
    {
      id: "governance",
      label: "GOVERNANCE",
      angle: -72,
      x: 0.42,
      y: -1.18,
      scale: 1.2,
      stellarType: "purpose",
      intensity: "bright",
      labelPosition: { side: "top", offset: 30 },
    },
    {
      id: "constraints",
      label: "CONSTRAINTS",
      angle: -20,
      x: 0.88,
      y: -0.42,
      scale: 0.98,
      stellarType: "risk",
      intensity: "balanced",
      labelPosition: { side: "right", offset: 30 },
    },
    {
      id: "behavioral-integrity",
      label: "BEHAVIORAL INTEGRITY",
      angle: -48,
      x: 0.02,
      y: -0.68,
      scale: 1.12,
      stellarType: "judgment",
      intensity: "bright",
      labelPosition: { side: "right", offset: 30 },
    },
    {
      id: "regenerative-capacity",
      label: "REGENERATIVE CAPACITY",
      angle: -152,
      x: -0.98,
      y: -0.15,
      scale: 1.02,
      stellarType: "relational",
      intensity: "balanced",
      labelPosition: { side: "left", offset: 30 },
    },
  ],
  constellation: {
    showCenterConnections: false,
    connections: [
      {
        from: "governance",
        to: "constraints",
        strength: "primary",
        type: "extends",
        rationale:
          "Governance becomes operational when authority, intent, and accountability are translated into explicit system boundaries.",
      },
      {
        from: "constraints",
        to: "behavioral-integrity",
        strength: "primary",
        type: "guards",
        rationale:
          "Visible constraints create the standards against which actual system behavior can be evaluated.",
      },
      {
        from: "behavioral-integrity",
        to: "regenerative-capacity",
        strength: "primary",
        type: "evidences",
        rationale:
          "Integrity signals reveal when behavior has moved away from stated purpose or operating boundaries and recovery is required.",
      },
      {
        from: "regenerative-capacity",
        to: "governance",
        strength: "secondary",
        type: "applies",
        rationale:
          "Recovery turns observed failures into governance changes so the system does not repeatedly regenerate the same misalignment.",
      },
    ],
  },
  sections: [
    {
      id: "governance",
      label: "Governance",
      accentStellarType: "purpose",
      semantics: {
        keywords: [
          "governance",
          "decision ownership",
          "change authority",
          "escalation",
          "intervention",
          "accountability",
        ],
        aliases: ["system governance", "control structure"],
        summary:
          "The structural logic that determines who may define, evaluate, redirect, or stop system behavior.",
      },
      subtitle: "Who has the authority to shape and redirect behavior.",
      readingTime: 2,
      content:
        "Governance defines who may establish the system's purpose, change its operating rules, evaluate its behavior, and intervene when it begins to drift. It turns responsibility into an explicit structure instead of leaving it distributed across product decisions, model settings, and informal team assumptions.\n\nThis is related to Authority Gradient, but it asks a different question. Authority Gradient locates where meaningful human authority should remain. Governance determines how that authority is exercised: who can redirect the system, which changes require review, what conditions trigger escalation, and where accountability ultimately sits.\n\nWithout governance, system behavior can still change. It simply changes through updates, optimization pressure, accumulated exceptions, and automated decisions that no one clearly owns.",
      insight:
        "If no one can clearly explain who may change or stop the system, its behavior is already being governed by something else.",
    },
    {
      id: "constraints",
      label: "Constraints",
      accentStellarType: "risk",
      semantics: {
        keywords: [
          "constraints",
          "boundaries",
          "capability limits",
          "prohibited actions",
          "confidence thresholds",
          "scope",
        ],
        aliases: ["guardrails", "system limits", "operating boundaries"],
        summary:
          "The deliberate and visible limits that give an intelligent system a recognizable operating shape.",
      },
      subtitle: "Why trustworthy systems require deliberate limits.",
      readingTime: 2,
      content:
        "Constraints define what the system may do, what it must not do, and which conditions require confirmation, refusal, or escalation. They include capability boundaries, prohibited actions, confidence thresholds, required evidence, and clear statements about the limits of the system's role.\n\nConstraints are often treated as restrictions added after capability has been designed. In Behavioral Architecture, they are part of the system's identity. A system becomes more understandable when users can anticipate where it will act, where it will pause, and where human judgment must re-enter.\n\nThe strongest constraints are not hidden safety mechanisms. They are reflected in the interaction itself through visible boundaries, honest uncertainty, and behavior that remains consistent when pressure increases.",
      insight:
        "A system without meaningful constraints does not have greater intelligence. It has less definition.",
    },
    {
      id: "behavioral-integrity",
      label: "Behavioral Integrity",
      accentStellarType: "judgment",
      semantics: {
        keywords: [
          "behavioral integrity",
          "behavioral fidelity",
          "promise versus behavior",
          "evaluation",
          "drift detection",
          "consistency",
        ],
        aliases: ["behavioral alignment", "behavior consistency"],
        summary:
          "The degree to which actual system behavior remains consistent with its stated purpose, promises, and boundaries.",
      },
      subtitle: "Whether the system behaves like the system it claims to be.",
      readingTime: 2,
      content:
        "Behavioral Integrity examines whether the system's actual conduct remains consistent with its stated purpose and operating boundaries across different users, contexts, and levels of pressure. It compares what the system promises with what it repeatedly does.\n\nThis requires more than measuring output quality. Teams must observe authority creep, assumption disclosure, boundary violations, inconsistent refusals, changes introduced by updates, and differences between routine and high-risk behavior. A system may remain accurate while becoming less transparent, more forceful, or harder to redirect.\n\nIntegrity signals make those changes visible. They provide evidence that governance and constraints are shaping behavior in practice rather than existing only as documentation.",
      insight:
        "Alignment is not proven by what the system says about itself. It is revealed through repeated behavior.",
    },
    {
      id: "regenerative-capacity",
      label: "Regenerative Capacity",
      accentStellarType: "relational",
      semantics: {
        keywords: [
          "regenerative capacity",
          "recovery",
          "repair",
          "drift correction",
          "rollback",
          "safe re-entry",
        ],
        aliases: ["system recovery", "behavioral repair", "regeneration"],
        summary:
          "The system's capacity to recognize, contain, and recover from behavioral misalignment without concealing what changed.",
      },
      subtitle: "How the system returns when alignment begins to drift.",
      readingTime: 2,
      content:
        "Regenerative Capacity determines what happens after behavioral integrity begins to fail. It includes detecting the affected layer, containing harmful behavior, restoring prior boundaries, correcting memory or context, and re-entering safely after a failure.\n\nRecovery should not quietly rewrite the system's purpose in order to make a failure disappear. It should preserve a record of what changed, clarify which intervention restored alignment, and escalate when the system cannot repair itself within its legitimate authority.\n\nRegenerative Systems explores these repair mechanics in greater depth. Within Behavioral Architecture, regenerative capacity establishes a simpler requirement: trustworthy behavior must include a governed way to return from misalignment.",
      insight:
        "A trustworthy system is not one that never fails. It is one that can recover without hiding the failure or repeating its cause.",
    },
  ],
});
