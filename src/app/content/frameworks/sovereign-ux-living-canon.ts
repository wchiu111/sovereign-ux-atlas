import type { AtlasStellarType } from "../types";

export type LivingCanonBandId = "presence" | "integrity" | "threshold";
export type LivingCanonEntryKind = "practice" | "guardrail" | "threshold";

export interface LivingCanonBand {
  id: LivingCanonBandId;
  label: string;
  description: string;
  stellarType: AtlasStellarType;
}

export interface LivingCanonFieldPosition {
  x: number;
  y: number;
}

interface LivingCanonBaseEntry {
  id: string;
  title: string;
  band: LivingCanonBandId;
  kind: LivingCanonEntryKind;
  stellarType: AtlasStellarType;
  fieldPosition: LivingCanonFieldPosition;
  summary: string;
  relatedIds: string[];
}

export interface LivingCanonPracticeEntry extends LivingCanonBaseEntry {
  kind: "practice" | "guardrail";
  principle: string;
  observe: string;
  inPractice: string;
  watchFor: string;
}

export interface LivingCanonThresholdEntry extends LivingCanonBaseEntry {
  kind: "threshold";
  signal: string;
  whyItMatters: string;
  response: string[];
  doNot: string;
}

export type LivingCanonEntry =
  | LivingCanonPracticeEntry
  | LivingCanonThresholdEntry;

export type LivingCanonRevisionStageId =
  | "field-signal"
  | "observation"
  | "pattern"
  | "evidence"
  | "precedent"
  | "revision";

export interface LivingCanonRevisionStage {
  id: LivingCanonRevisionStageId;
  number: string;
  label: string;
  description: string;
  keyQuestion: string;
  stellarType: AtlasStellarType;
}

export const LIVING_CANON_BANDS: readonly LivingCanonBand[] = [
  {
    id: "presence",
    label: "PATTERNS OF PRESENCE",
    description: "What healthy systems tend to do.",
    stellarType: "relational",
  },
  {
    id: "integrity",
    label: "INTEGRITY GUARDRAILS",
    description: "What keeps the system aligned over time.",
    stellarType: "agentic",
  },
  {
    id: "threshold",
    label: "THRESHOLD SIGNALS",
    description: "When to pause, document, examine, and escalate.",
    stellarType: "risk",
  },
] as const;

export const LIVING_CANON_ENTRIES: readonly LivingCanonEntry[] = [
  {
    id: "reflection-comes-first",
    title: "Reflection Comes First",
    band: "presence",
    kind: "practice",
    stellarType: "relational",
    fieldPosition: { x: 22, y: 18 },
    summary:
      "Create enough space for a person to recognize intent, context, or emotion before the system pushes toward action.",
    principle:
      "Before asking for action, give the person enough space to understand what they are doing and why.",
    observe:
      "Does the interaction create a moment for orientation before commitment or acceleration?",
    inPractice:
      "Use a brief summary, pause, confirmation, or reflective prompt when a decision benefits from deliberate attention.",
    watchFor:
      "Reflection that becomes performative empathy, unnecessary friction, or another way to steer the person.",
    relatedIds: ["built-in-pauses", "name-the-confusion", "the-law-of-return"],
  },
  {
    id: "consent-remains-visible",
    title: "Consent Remains Visible",
    band: "presence",
    kind: "practice",
    stellarType: "purpose",
    fieldPosition: { x: 10, y: 32 },
    summary:
      "Keep the boundary between suggestion, assumption, and commitment visible.",
    principle:
      "Prompts, defaults, automation, and recommendations should never quietly turn possibility into commitment.",
    observe:
      "Can the person tell what is being suggested, assumed, or executed before the system acts?",
    inPractice:
      "Use explicit confirmation for consequential actions and keep exits, reversals, and alternative paths available.",
    watchFor:
      "Defaults that technically allow choice while making refusal obscure, costly, or socially uncomfortable.",
    relatedIds: ["frame-dont-steer", "integrity-in-practice", "signal-fidelity"],
  },
  {
    id: "name-the-confusion",
    title: "Name the Confusion",
    band: "presence",
    kind: "practice",
    stellarType: "judgment",
    fieldPosition: { x: 15, y: 50 },
    summary:
      "When the system is uncertain or something has gone wrong, clarity is more trustworthy than performance.",
    principle:
      "State what is unclear, what is known, what is not known, and what happens next.",
    observe:
      "Does the system acknowledge uncertainty and failure directly, or hide them behind generic confidence?",
    inPractice:
      "Explain the failure condition, its likely impact, and the next available action without overstating certainty.",
    watchFor:
      "Vague reassurance, artificial confidence, or technical language that shifts interpretive work back to the person.",
    relatedIds: ["reflection-comes-first", "signal-fidelity", "fracture"],
  },
  {
    id: "every-interface-is-an-invitation",
    title: "Every Interface Is an Invitation",
    band: "presence",
    kind: "practice",
    stellarType: "relational",
    fieldPosition: { x: 36, y: 29 },
    summary:
      "Every interaction communicates how the system expects the relationship to work.",
    principle:
      "Treat screens, states, and system responses as invitations into a relationship, not neutral containers.",
    observe:
      "What kind of relationship does the interaction invite: exploration, compliance, urgency, dependence, or confidence?",
    inPractice:
      "Design onboarding, errors, and transitions so expectations are clear without turning orientation into interrogation.",
    watchFor:
      "Friendly language masking extractive defaults, pressure, or unclear obligations.",
    relatedIds: ["atmosphere-is-a-design-choice", "remember-the-human", "signal-fidelity"],
  },
  {
    id: "mirror-dont-perform",
    title: "Mirror, Don't Perform",
    band: "presence",
    kind: "practice",
    stellarType: "judgment",
    fieldPosition: { x: 26, y: 43 },
    summary:
      "Reflect the person's intent and context without inventing an identity or decision for them.",
    principle:
      "Reflection should help a person recognize their own thinking rather than replace it with the system's interpretation.",
    observe:
      "Is the system clarifying what the person expressed, or adding tone, identity, motives, or conclusions they did not provide?",
    inPractice:
      "Preserve voice in writing tools, distinguish quotation from interpretation, and make inferred intent editable.",
    watchFor:
      "Confident personality projection, identity claims, or synthetic emotional intimacy presented as understanding.",
    relatedIds: ["reflection-comes-first", "projection", "longitudinal-influence"],
  },
  {
    id: "frame-dont-steer",
    title: "Frame, Don't Steer",
    band: "presence",
    kind: "practice",
    stellarType: "purpose",
    fieldPosition: { x: 44, y: 49 },
    summary:
      "Organize choices so they become easier to understand without quietly predetermining the answer.",
    principle:
      "Systems may frame and recommend when the basis for that framing is legible and meaningful alternatives remain available.",
    observe:
      "Does the framing preserve meaningful alternatives and make the basis for hierarchy inspectable?",
    inPractice:
      "A recommendation can receive visual priority when the reasoning is visible, rejection remains easy, and alternatives are still usable.",
    watchFor:
      "Defaults, visual emphasis, or language that makes one option feel inevitable without explaining why.",
    relatedIds: ["consent-remains-visible", "signal-fidelity", "meaning-over-metrics"],
  },
  {
    id: "meaning-over-metrics",
    title: "Meaning Over Metrics",
    band: "presence",
    kind: "practice",
    stellarType: "strategy",
    fieldPosition: { x: 25, y: 62 },
    summary:
      "Behavioral metrics can describe what happened without establishing whether the experience was good.",
    principle:
      "Success includes whether the person retained understanding and control, not only whether the task completed quickly.",
    observe:
      "Which important qualities disappear when success is reduced to speed, conversion, completion, or engagement?",
    inPractice:
      "Accept additional steps when they materially improve comprehension, reversibility, or confidence in a consequential task.",
    watchFor:
      "Using quantitative success to justify interactions that reduce clarity or agency.",
    relatedIds: ["reciprocity", "frame-dont-steer", "the-law-of-return"],
  },
  {
    id: "remember-the-human",
    title: "Remember the Human",
    band: "presence",
    kind: "practice",
    stellarType: "relational",
    fieldPosition: { x: 14, y: 72 },
    summary:
      "Memory should preserve useful continuity without turning previous behavior into destiny.",
    principle:
      "Remember context in ways that reduce repetition while keeping assumptions visible and revisable.",
    observe:
      "Is remembered information helping the person continue, or narrowing future choices around an old interpretation?",
    inPractice:
      "Resume tasks with useful context and let people correct, ignore, or reset remembered assumptions.",
    watchFor:
      "Treating historical behavior as a fixed identity, preference, or intention.",
    relatedIds: ["every-interface-is-an-invitation", "projection", "longitudinal-influence"],
  },
  {
    id: "always-offer-closure",
    title: "Always Offer Closure",
    band: "presence",
    kind: "practice",
    stellarType: "strategy",
    fieldPosition: { x: 28, y: 80 },
    summary:
      "Interactions should have recognizable endings that reduce cognitive residue.",
    principle:
      "Make it clear what changed, what remains open, and whether anything else is expected.",
    observe:
      "Can the person tell when the interaction is complete and what state the system is now in?",
    inPractice:
      "Confirm consequential completion, surface unresolved work, and provide a clear path to return later.",
    watchFor:
      "Endless engagement loops, ambiguous completion, or calls to continue after the person's goal is already satisfied.",
    relatedIds: ["the-law-of-return", "pause-when-things-break", "reciprocity"],
  },
  {
    id: "pause-when-things-break",
    title: "Pause When Things Break",
    band: "presence",
    kind: "practice",
    stellarType: "risk",
    fieldPosition: { x: 42, y: 74 },
    summary:
      "When trust, understanding, or system integrity begins to fail, continued optimization can deepen the failure.",
    principle:
      "Stop pushing toward completion when the conditions required for a trustworthy interaction are no longer present.",
    observe:
      "Has the system lost enough context, confidence, or trust that continuing would create more uncertainty?",
    inPractice:
      "Pause automation, explain the failure state, preserve work where possible, and return control to the person.",
    watchFor:
      "Error recovery designed primarily to preserve conversion, momentum, or engagement.",
    relatedIds: ["fracture", "name-the-confusion", "always-offer-closure"],
  },
  {
    id: "the-law-of-return",
    title: "The Law of Return",
    band: "presence",
    kind: "practice",
    stellarType: "purpose",
    fieldPosition: { x: 18, y: 88 },
    summary:
      "A good system should make itself easier to leave as the person becomes more capable.",
    principle:
      "Assistance should increase capability rather than create unnecessary dependence.",
    observe:
      "Does repeated use strengthen the person's ability to continue without the system?",
    inPractice:
      "Explain reasoning, preserve portable outputs, support handoff, and avoid turning routine assistance into required mediation.",
    watchFor:
      "Design choices that make disengagement feel like losing competence, access, identity, or progress.",
    relatedIds: ["reciprocity", "meaning-over-metrics", "always-offer-closure"],
  },

  {
    id: "integrity-in-practice",
    title: "Integrity in Practice",
    band: "integrity",
    kind: "guardrail",
    stellarType: "judgment",
    fieldPosition: { x: 61, y: 25 },
    summary:
      "Principles matter most when incentives make abandoning them convenient.",
    principle:
      "Hold the system's stated commitments when speed, engagement, revenue, or organizational pressure pushes against them.",
    observe:
      "Which product pressures are most likely to cause the system to behave differently from its stated values?",
    inPractice:
      "Make non-negotiable boundaries explicit and review high-pressure changes against them before shipping.",
    watchFor:
      "Treating principles as optional language that can be suspended whenever a metric is threatened.",
    relatedIds: ["consent-remains-visible", "signal-fidelity", "coherence-alignment"],
  },
  {
    id: "signal-fidelity",
    title: "Signal Fidelity",
    band: "integrity",
    kind: "guardrail",
    stellarType: "agentic",
    fieldPosition: { x: 66, y: 41 },
    summary:
      "What the system communicates should match what it actually does.",
    principle:
      "Claims about privacy, control, reversibility, confidence, and automation must remain true at the behavioral level.",
    observe:
      "Does the interface signal more control, certainty, privacy, or neutrality than the underlying behavior actually provides?",
    inPractice:
      "Align copy, defaults, system actions, data use, and uncertainty handling so the same promise survives across layers.",
    watchFor:
      "Trust language used to compensate for behavior that remains opaque, irreversible, or more expansive than disclosed.",
    relatedIds: ["frame-dont-steer", "name-the-confusion", "integrity-in-practice"],
  },
  {
    id: "built-in-pauses",
    title: "Built-In Pauses",
    band: "integrity",
    kind: "guardrail",
    stellarType: "strategy",
    fieldPosition: { x: 62, y: 56 },
    summary:
      "Create deliberate moments where momentum can be interrupted before consequential action.",
    principle:
      "As automation becomes easier to execute, the system should preserve appropriate opportunities to reconsider.",
    observe:
      "Where does speed remove a useful opportunity for review, correction, or refusal?",
    inPractice:
      "Use confirmation, preview, delay, or reversible staging where consequences justify a moment of review.",
    watchFor:
      "Pauses added everywhere regardless of risk, turning reflection into ritual friction.",
    relatedIds: ["reflection-comes-first", "pause-when-things-break", "flow"],
  },
  {
    id: "reciprocity",
    title: "Reciprocity",
    band: "integrity",
    kind: "guardrail",
    stellarType: "relational",
    fieldPosition: { x: 67, y: 70 },
    summary:
      "The interaction should leave behind understanding, capability, or orientation — not only a completed transaction.",
    principle:
      "Systems that benefit from a person's attention should return something that strengthens the person's future agency.",
    observe:
      "What does the person know or retain after the system has completed the task?",
    inPractice:
      "Expose useful reasoning, patterns, and transferable context instead of keeping all competence inside the system.",
    watchFor:
      "Experiences that maximize successful completion while keeping the person dependent on repeated mediation.",
    relatedIds: ["the-law-of-return", "meaning-over-metrics", "always-offer-closure"],
  },
  {
    id: "atmosphere-is-a-design-choice",
    title: "Atmosphere Is a Design Choice",
    band: "integrity",
    kind: "guardrail",
    stellarType: "agentic",
    fieldPosition: { x: 60, y: 84 },
    summary:
      "Pacing, hierarchy, language, motion, density, and interruption create an emotional climate whether intended or not.",
    principle:
      "Treat atmosphere as behavioral context that can support or distort judgment.",
    observe:
      "What does the interface's pacing and sensory hierarchy ask the person to feel or do before they have interpreted the content?",
    inPractice:
      "Use restraint, pacing, and hierarchy appropriate to the seriousness and uncertainty of the task.",
    watchFor:
      "Atmosphere engineered to create urgency, intimacy, confidence, or calm that the underlying situation does not justify.",
    relatedIds: ["every-interface-is-an-invitation", "flow", "coherence-alignment"],
  },

  {
    id: "fracture",
    title: "Fracture",
    band: "threshold",
    kind: "threshold",
    stellarType: "risk",
    fieldPosition: { x: 83, y: 24 },
    summary:
      "Trust has ruptured enough that continued optimization should no longer be the primary goal.",
    signal:
      "The person's understanding of the system, confidence in its intent, or willingness to continue has materially broken.",
    whyItMatters:
      "Continuing the normal flow can deepen a trust failure that first needs to be understood.",
    response: ["Pause", "Document", "Examine", "Escalate when necessary"],
    doNot:
      "Do not treat the rupture as a conversion, retention, or reassurance problem before understanding what broke.",
    relatedIds: ["pause-when-things-break", "name-the-confusion", "signal-fidelity"],
  },
  {
    id: "projection",
    title: "Projection",
    band: "threshold",
    kind: "threshold",
    stellarType: "risk",
    fieldPosition: { x: 88, y: 38 },
    summary:
      "Inference is beginning to replace observation about the person.",
    signal:
      "The system is treating an inferred motive, identity, emotion, preference, or intent as established knowledge.",
    whyItMatters:
      "Repeated projection can narrow future choices around an interpretation the person never provided.",
    response: ["Surface the assumption", "Return to observable evidence", "Invite correction", "Reduce certainty"],
    doNot:
      "Do not deepen personalization around an inference simply because the interaction appears coherent.",
    relatedIds: ["mirror-dont-perform", "remember-the-human", "longitudinal-influence"],
  },
  {
    id: "longitudinal-influence",
    title: "Longitudinal Influence",
    band: "threshold",
    kind: "threshold",
    stellarType: "risk",
    fieldPosition: { x: 84, y: 53 },
    summary:
      "Repeated interaction may be shaping how a person understands themselves, their choices, or their relationships over time.",
    signal:
      "The system's influence is no longer limited to a single task and may be accumulating across repeated interactions.",
    whyItMatters:
      "Longer-term influence increases the importance of restraint, transparency, reversibility, and professional boundaries.",
    response: ["Document the pattern", "Clarify scope", "Review consent", "Escalate boundary questions"],
    doNot:
      "Do not interpret sustained engagement or responsiveness as permission to shape identity, values, or dependency.",
    relatedIds: ["projection", "remember-the-human", "the-law-of-return"],
  },
  {
    id: "flow",
    title: "Flow",
    band: "threshold",
    kind: "threshold",
    stellarType: "risk",
    fieldPosition: { x: 90, y: 68 },
    summary:
      "Interaction has become unusually effortless and continuous.",
    signal:
      "The person and system are moving through the interaction with very little friction or interruption.",
    whyItMatters:
      "Seamlessness can be beneficial, but it can also bypass useful reflection when decisions are consequential.",
    response: ["Observe", "Preserve appropriate pauses", "Check consequence level", "Avoid unnecessary interruption"],
    doNot:
      "Do not optimize flow itself as proof that the interaction is healthy or should become more persuasive.",
    relatedIds: ["built-in-pauses", "atmosphere-is-a-design-choice", "coherence-alignment"],
  },
  {
    id: "coherence-alignment",
    title: "Coherence Alignment",
    band: "threshold",
    kind: "threshold",
    stellarType: "risk",
    fieldPosition: { x: 84, y: 83 },
    summary:
      "The system, interaction, and person's stated intent appear unusually well aligned.",
    signal:
      "The experience produces a strong sense that the system understands the task, context, and desired direction.",
    whyItMatters:
      "Strong alignment can increase trust and influence faster than the system's actual understanding or authority warrants.",
    response: ["Document why it worked", "Keep uncertainty visible", "Preserve alternatives", "Maintain scope"],
    doNot:
      "Do not treat coherence as evidence of deeper understanding, identity knowledge, or permission for greater influence.",
    relatedIds: ["integrity-in-practice", "atmosphere-is-a-design-choice", "flow"],
  },
] as const;

export const LIVING_CANON_COUNTS = {
  presence: LIVING_CANON_ENTRIES.filter((entry) => entry.band === "presence").length,
  integrity: LIVING_CANON_ENTRIES.filter((entry) => entry.band === "integrity").length,
  threshold: LIVING_CANON_ENTRIES.filter((entry) => entry.band === "threshold").length,
  total: LIVING_CANON_ENTRIES.length,
} as const;

export const LIVING_CANON_REVISION_STAGES: readonly LivingCanonRevisionStage[] = [
  {
    id: "field-signal",
    number: "01",
    label: "FIELD SIGNAL",
    description:
      "Something in real use creates friction, confusion, lost trust, unexpected behavior, or a meaningful positive outcome.",
    keyQuestion: "What happened in real use?",
    stellarType: "risk",
  },
  {
    id: "observation",
    number: "02",
    label: "OBSERVATION",
    description:
      "The behavior is documented before the team decides what it means.",
    keyQuestion: "What is actually happening, without assuming why?",
    stellarType: "judgment",
  },
  {
    id: "pattern",
    number: "03",
    label: "PATTERN",
    description:
      "Similar observations begin appearing across different situations.",
    keyQuestion: "What repeats across contexts?",
    stellarType: "purpose",
  },
  {
    id: "evidence",
    number: "04",
    label: "EVIDENCE",
    description:
      "The emerging interpretation is tested against examples, counterexamples, and additional observation.",
    keyQuestion: "What supports or contradicts the pattern?",
    stellarType: "agentic",
  },
  {
    id: "precedent",
    number: "05",
    label: "PRECEDENT",
    description:
      "A principle is recorded so future work can build on it, challenge it, or deliberately depart from it.",
    keyQuestion: "What should future decisions be able to reference?",
    stellarType: "relational",
  },
  {
    id: "revision",
    number: "06",
    label: "REVISION",
    description:
      "New evidence changes the interpretation while preserving a trace of what changed and why.",
    keyQuestion: "What must change without erasing the reasoning that came before?",
    stellarType: "strategy",
  },
] as const;

export const LIVING_CANON_WORKED_EXAMPLE = {
  id: "frame-dont-steer-revision",
  entryId: "frame-dont-steer",
  title: "Frame, Don't Steer",
  status: "illustrative-synthesis",
  sourceNote:
    "Illustrative synthesis using the existing Decision Rights recommendation comparison. It demonstrates the Canon's revision model without claiming a completed field study.",
  stageEvidence: {
    "field-signal":
      "People may disproportionately accept a visually privileged recommendation even when alternatives remain technically available.",
    observation:
      "The recommended option receives greater visual prominence, reducing the effort required to notice it compared with the alternatives.",
    pattern:
      "Presentation hierarchy can influence choice beyond the informational value of the recommendation itself.",
    evidence:
      "Comparing recommendation-first and recommendation-last designs makes the authority tradeoff visible: hierarchy can reduce cognitive work, but only if reasoning and alternatives remain inspectable.",
    precedent:
      "Recommendations should preserve inspectable reasoning and meaningful alternatives rather than relying on unexplained prominence.",
    revision:
      "Equal visual weighting can also create unnecessary cognitive work. The principle therefore evolves from avoiding hierarchy to governing when hierarchy is legitimate.",
  } satisfies Record<LivingCanonRevisionStageId, string>,
  precedent: {
    previous: {
      label: "EARLIER INTERPRETATION",
      text:
        "Recommendations should not visually privilege one option over another.",
    },
    current: {
      label: "CURRENT INTERPRETATION",
      text:
        "Recommendations may receive hierarchy when the basis for that hierarchy is legible, alternatives remain meaningfully accessible, and rejection remains easy.",
    },
    whatChanged:
      "The Canon distinguishes steering from useful synthesis. Hierarchy itself is not the failure; unexplained hierarchy that reduces meaningful choice is.",
  },
  revisionHistory: [
    {
      id: "original",
      label: "ORIGINAL OBSERVATION",
      summary:
        "Recommendation prominence can influence choice even when alternatives remain available.",
    },
    {
      id: "revision-01",
      label: "REVISION 01",
      summary:
        "Added legibility, alternative access, and rejection criteria so the principle does not confuse neutrality with good decision support.",
    },
  ],
} as const;
