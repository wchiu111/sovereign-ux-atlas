export type SovereignLayerBand = "general-practice" | "threshold";

export type SovereignLayerId =
  | "interface"
  | "emotion"
  | "memory"
  | "reflection"
  | "reciprocity"
  | "friction"
  | "imprint"
  | "future-signal"
  | "relational-field"
  | "cultural-context"
  | "transformation"
  | "sustainability"
  | "pattern-mirror"
  | "atmosphere"
  | "distortion-detection"
  | "hidden-influence"
  | "longitudinal-reflection"
  | "flow-state"
  | "coherence-alignment";

interface SovereignLayerBase {
  id: SovereignLayerId;
  number: string;
  title: string;
  band: SovereignLayerBand;
}

export interface SovereignGeneralPracticeLayer extends SovereignLayerBase {
  band: "general-practice";
  definition: string;
  inPractice: string;
  diagnosticQuestion: string;
  historicalAlias?: string;
  lineage?: string;
}

export interface SovereignThresholdLayer extends SovereignLayerBase {
  band: "threshold";
  signal: string;
  whyItMatters: string;
  response: readonly string[];
  doNot: string;
}

export type SovereignLayer =
  | SovereignGeneralPracticeLayer
  | SovereignThresholdLayer;

export const SOVEREIGN_UX_LAYERS: readonly SovereignLayer[] = [
  {
    id: "interface",
    number: "01",
    title: "Interface",
    band: "general-practice",
    definition:
      "What appears, when it appears, and how it behaves — the visible structure through which a person encounters the system.",
    inPractice:
      "Buttons, layouts, transitions, pacing, affordances, and the timing of what becomes visible or actionable.",
    diagnosticQuestion:
      "What is the person being shown, asked to do, or allowed to control at this moment?",
  },
  {
    id: "emotion",
    number: "02",
    title: "Emotion",
    band: "general-practice",
    definition:
      "How the experience feels moment to moment — calm, rushed, reassuring, stressful, grounded, or uncertain.",
    inPractice:
      "Tone, pacing, feedback, motion, and system language all contribute to the emotional state surrounding a task.",
    diagnosticQuestion:
      "What emotional state is this interaction producing, and is that appropriate to the situation?",
  },
  {
    id: "memory",
    number: "03",
    title: "Memory",
    band: "general-practice",
    definition:
      "What the system remembers and what the person remembers afterward — including progress, recognition, continuity, and prior context.",
    inPractice:
      "Saved state, remembered preferences, prior decisions, continuity between sessions, and clear control over what persists.",
    diagnosticQuestion:
      "What persists after this interaction, and does that memory support continuity without overreaching?",
  },
  {
    id: "reflection",
    number: "04",
    title: "Reflection",
    band: "general-practice",
    definition:
      "How the system acknowledges intent, confusion, and context before action — including how it frames outputs, choices, confidence, recommendations, omissions, and emphasis.",
    inPractice:
      "Intent acknowledgement, explicit interpretation, visible uncertainty, and recommendation framing that lets a person see how the system is reading the situation.",
    diagnosticQuestion:
      "Can the person understand what the system thinks is happening before being pushed toward action?",
    historicalAlias: "Echo",
    lineage:
      "Echo is the historical name associated with this reflective layer and the concept the Sovereign Atlas was originally built to locate inside the growing Sovereign UX Codex. It remains part of the lineage, not a separate layer.",
  },
  {
    id: "reciprocity",
    number: "05",
    title: "Reciprocity",
    band: "general-practice",
    definition:
      "Whether the system meaningfully adapts in response to user input rather than simply continuing its existing path.",
    inPractice:
      "Learning, adjusting, recalibrating, accepting correction, and changing behavior when the person provides new context.",
    diagnosticQuestion:
      "Does the system actually respond to what the person expressed, or merely continue its existing path?",
  },
  {
    id: "friction",
    number: "06",
    title: "Friction",
    band: "general-practice",
    definition:
      "Points where hesitation, resistance, effort, or mistrust appear in the experience.",
    inPractice:
      "Unnecessary steps, unclear asks, hidden costs, repeated confirmation, or moments where the person slows down because something no longer feels clear.",
    diagnosticQuestion:
      "Where is the person hesitating, and what is that hesitation telling us?",
  },
  {
    id: "imprint",
    number: "07",
    title: "Imprint",
    band: "general-practice",
    definition:
      "The emotional residue left after an interaction — relief, resentment, confidence, doubt, or another feeling that persists beyond the immediate task.",
    inPractice:
      "Completion, errors, recovery, rejection, and high-stakes decisions often leave an imprint that shapes the next interaction.",
    diagnosticQuestion:
      "What feeling or belief remains after the interaction is over?",
  },
  {
    id: "future-signal",
    number: "08",
    title: "Future Signal",
    band: "general-practice",
    definition:
      "How the system anticipates what may be needed next without quietly pushing the person toward that future.",
    inPractice:
      "Suggestions, reminders, previews, or anticipatory assistance that remain optional rather than coercive nudges.",
    diagnosticQuestion:
      "Is the system helping the person see what may come next, or quietly deciding the direction for them?",
  },
  {
    id: "relational-field",
    number: "09",
    title: "Relational Field",
    band: "general-practice",
    definition:
      "The tone and intent people sense behind the system — whether the relationship feels collaborative, transactional, supportive, or extractive.",
    inPractice:
      "Language, responsiveness, defaults, requests for data, and how the system behaves when the person disagrees all shape the perceived relationship.",
    diagnosticQuestion:
      "What kind of relationship does the system appear to be asking the person to enter?",
  },
  {
    id: "cultural-context",
    number: "10",
    title: "Cultural Context",
    band: "general-practice",
    definition:
      "How language, symbols, assumptions, norms, and defaults change meaning across cultures and contexts.",
    inPractice:
      "A convention that reads as neutral, polite, urgent, or trustworthy in one context may carry a different meaning in another.",
    diagnosticQuestion:
      "Whose assumptions are being treated as neutral or universal here?",
  },
  {
    id: "transformation",
    number: "11",
    title: "Transformation",
    band: "general-practice",
    definition:
      "Moments where capability, confidence, understanding, or identity meaningfully shifts.",
    inPractice:
      "First success, completion, recovery, mastery, or a moment where the person can now do something they could not do before.",
    diagnosticQuestion:
      "What has become possible for the person after this moment that was not possible before it?",
  },
  {
    id: "sustainability",
    number: "12",
    title: "Sustainability",
    band: "general-practice",
    definition:
      "Whether the interaction model supports long-term use without fatigue, dependency, or constant interruption.",
    inPractice:
      "Pacing, notification rhythm, recovery, rest, workload, and whether repeated use remains healthy rather than extractive.",
    diagnosticQuestion:
      "Could this relationship remain healthy if repeated for months or years?",
  },
  {
    id: "pattern-mirror",
    number: "13",
    title: "Pattern Mirror",
    band: "general-practice",
    definition:
      "Small interaction details that reveal the larger values and behavioral assumptions of the system.",
    inPractice:
      "Error messages, edge cases, exits, cancellation, recovery, and exception states often reveal more about a product than its ideal path.",
    diagnosticQuestion:
      "What does this small interaction reveal about how the system actually treats people?",
  },
  {
    id: "atmosphere",
    number: "14",
    title: "Atmosphere",
    band: "general-practice",
    definition:
      "The overall emotional and cognitive climate created by tone, pacing, density, motion, language, and environment.",
    inPractice:
      "An experience can feel calm or frantic, grounded or aggressive, even when no single component is responsible for that impression.",
    diagnosticQuestion:
      "What emotional and cognitive climate does the product create overall?",
  },
  {
    id: "distortion-detection",
    number: "15",
    title: "Distortion Detection",
    band: "threshold",
    signal:
      "Fear, bias, urgency, or pressure is beginning to shape how information is interpreted or how decisions are made.",
    whyItMatters:
      "The apparent preference or decision may no longer reflect clear judgment. Pressure can change the meaning of the choice before any interface error is visible.",
    response: [
      "Pause the decision path",
      "Separate evidence from pressure",
      "Document the distortion",
      "Escalate if the pressure cannot be resolved",
    ],
    doNot:
      "Do not design around panic, fear, or urgency as though they were neutral expressions of preference.",
  },
  {
    id: "hidden-influence",
    number: "16",
    title: "Hidden Influence",
    band: "threshold",
    signal:
      "Defaults, bias, incentives, hierarchy, or power dynamics are affecting interpretation or choice without being sufficiently visible.",
    whyItMatters:
      "A person cannot meaningfully evaluate or consent to influence they cannot see. Technically available alternatives are not enough when the decision frame is obscured.",
    response: [
      "Surface the influence",
      "Review consent",
      "Inspect decision framing",
      "Escalate unresolved power or incentive conflicts",
    ],
    doNot:
      "Do not treat technically available choice as meaningful consent when the forces shaping that choice remain hidden.",
  },
  {
    id: "longitudinal-reflection",
    number: "17",
    title: "Longitudinal Reflection",
    band: "threshold",
    signal:
      "Repeated interaction may be influencing who the person is becoming across time, not merely helping with the immediate task.",
    whyItMatters:
      "Long-term influence raises the stakes for consent, restraint, reversibility, and professional boundaries because effects can accumulate beyond a single interaction.",
    response: [
      "Review the accumulated pattern",
      "Reduce unnecessary intervention",
      "Clarify consent and scope",
      "Escalate identity or dependency concerns",
    ],
    doNot:
      "Do not use accumulated familiarity as permission to shape identity, values, or dependency.",
  },
  {
    id: "flow-state",
    number: "18",
    title: "Flow State",
    band: "threshold",
    signal:
      "Interaction has become unusually effortless, absorbed, or still, with very little friction or interruption.",
    whyItMatters:
      "Flow can be beneficial, but seamlessness can also bypass useful reflection when decisions become consequential.",
    response: [
      "Respect the state",
      "Preserve easy exit and control",
      "Maintain appropriate pauses",
      "Avoid unnecessary interruption or exploitation",
    ],
    doNot:
      "Do not optimize effortless interaction as proof that greater engagement or influence is desirable.",
  },
  {
    id: "coherence-alignment",
    number: "19",
    title: "Coherence Alignment",
    band: "threshold",
    signal:
      "The system, interaction, and person's stated intent appear unusually well aligned — the experience seems to click into place.",
    whyItMatters:
      "Strong alignment can accelerate trust and influence faster than the system's actual understanding or authority warrants.",
    response: [
      "Document why the alignment occurred",
      "Keep uncertainty visible",
      "Preserve alternatives",
      "Maintain scope and decision authority",
    ],
    doNot:
      "Do not interpret strong alignment as permission for greater authority, persuasion, or psychological inference.",
  },
] as const;

export const GENERAL_PRACTICE_LAYERS = SOVEREIGN_UX_LAYERS.filter(
  (layer): layer is SovereignGeneralPracticeLayer => layer.band === "general-practice",
);

export const THRESHOLD_LAYERS = SOVEREIGN_UX_LAYERS.filter(
  (layer): layer is SovereignThresholdLayer => layer.band === "threshold",
);

export const SOVEREIGN_UX_LAYER_COUNTS = {
  total: SOVEREIGN_UX_LAYERS.length,
  generalPractice: GENERAL_PRACTICE_LAYERS.length,
  threshold: THRESHOLD_LAYERS.length,
} as const;

export const SOVEREIGN_UX_LAYER_PROFESSIONAL_BOUNDARY =
  "Threshold Layers can indicate ethical risk, emotional vulnerability, or the edge of professional scope. They require pause, consent, or referral — not deeper intervention. Sovereign UX explicitly rejects using depth as leverage.";
