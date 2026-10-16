/**
 * Protocols for Presence — Sovereign UX canonical reference.
 * The twelve protocols retain the author's order, names and intended meanings.
 * Situations, shortDescriptions, relatedIds and guardrails are retrieval/inspection
 * metadata, NOT additional doctrines, ranked stages, or completion requirements.
 */
export type SovereignProtocolId =
  | "01" | "02" | "03" | "04" | "05" | "06"
  | "07" | "08" | "09" | "10" | "11" | "12";

export type ProtocolSituationId =
  | "uncertainty"
  | "agency"
  | "reflection"
  | "decisions"
  | "integrity";

export interface ProtocolSituation {
  id: ProtocolSituationId;
  label: string;
  description: string;
}

export interface SovereignProtocol {
  id: SovereignProtocolId;
  title: string;
  shortDescription: string;
  meaning: string;
  inPractice: readonly string[];
  whyItMatters: string;
  /** Contextual navigation only: never a prescriptive pathway. */
  situations: readonly ProtocolSituationId[];
  relatedIds: readonly SovereignProtocolId[];
  /** A proportionality reminder, not an additional step in the protocol. */
  boundary: string;
}

export const PROTOCOL_SITUATIONS: readonly ProtocolSituation[] = [
  { id: "uncertainty", label: "Uncertainty", description: "Frustration, hesitation, confusion, and unresolved effort" },
  { id: "agency", label: "Agency & exit", description: "The person's ability to pause, redirect, or leave" },
  { id: "reflection", label: "Reflection", description: "Moments of vulnerability, depth, or reconsideration" },
  { id: "decisions", label: "Decision framing", description: "Interpretation, recommendation, and action authority" },
  { id: "integrity", label: "System integrity", description: "Promises, bias, entry expectations, and actual behavior" },
] as const;

export const SOVEREIGN_PROTOCOLS: readonly SovereignProtocol[] = [
  {
    id: "01",
    title: "Presence Before Output",
    shortDescription: "Notice expressed context before responding.",
    meaning: "Don't rush to respond. Before acting, the system should register where the user is emotionally or contextually.",
    inPractice: [
      "Slow or soften the tone when a person expresses frustration.",
      "Avoid instant replies that feel dismissive or automated.",
    ],
    whyItMatters: "Speed without awareness erodes trust.",
    situations: ["uncertainty", "reflection"],
    relatedIds: ["02", "05", "07"],
    boundary: "Respond to what the person has expressed. Do not invent emotional certainty, profile them, or introduce theatrical delays to appear caring.",
  },
  {
    id: "02",
    title: "Mirror First, Then Move",
    shortDescription: "Acknowledge intent before suggesting a direction.",
    meaning: "Before guiding, correcting, or suggesting, acknowledge intent, context, and how the system is interpreting the situation.",
    inPractice: [
      "Acknowledge the stated goal before suggesting a change of direction.",
      "For example: 'I hear what you're trying to do. Let's look at the options together.'",
    ],
    whyItMatters: "If users don't feel understood, guidance feels intrusive.",
    situations: ["uncertainty", "decisions"],
    relatedIds: ["01", "11", "12"],
    boundary: "Reflect stated intent, not an imagined inner state. Acknowledgement is not agreement, and it does not replace confirmation before action.",
  },
  {
    id: "03",
    title: "Check for Unresolved Weight",
    shortDescription: "Notice where effort or concern remains unfinished.",
    meaning: "Before offering next steps, notice whether something is still unresolved — emotionally or procedurally.",
    inPractice: [
      "Notice repeated abandonment or incomplete attempts without assigning a psychological cause.",
      "Offer to resume, restart, or pause.",
    ],
    whyItMatters: "Unacknowledged friction compounds over time.",
    situations: ["uncertainty", "reflection", "agency"],
    relatedIds: ["04", "06", "07"],
    boundary: "Repeated abandonment is a product signal, not proof of a person's emotional condition. Do not infer motives or intensify intervention without consent.",
  },
  {
    id: "04",
    title: "Always Offer an Exit",
    shortDescription: "Preserve a clear way to pause or leave.",
    meaning: "Any looped interaction must provide a clear way out.",
    inPractice: [
      "Make 'You can stop here' a genuine option.",
      "Provide 'Save and come back later' where the workflow supports it.",
    ],
    whyItMatters: "Loops without exits feel coercive, even when well-intentioned.",
    situations: ["agency", "uncertainty"],
    relatedIds: ["03", "06", "09"],
    boundary: "An exit must work in the real product. Do not label abandonment prevention as an exit or use pressure to bring people back.",
  },
  {
    id: "05",
    title: "Match the Depth",
    shortDescription: "Respond proportionally to the context invited.",
    meaning: "Respond at the same level of complexity or vulnerability the user offers.",
    inPractice: [
      "Avoid canned responses to a person who has chosen to share emotional context.",
      "Avoid deep interpretation when that interpretation has not been invited.",
    ],
    whyItMatters: "Mismatched depth feels either dismissive or invasive.",
    situations: ["reflection", "uncertainty"],
    relatedIds: ["01", "02", "06"],
    boundary: "Match expressed depth without impersonating a therapist or using intimate language to create dependence. Escalate or refer beyond product scope.",
  },
  {
    id: "06",
    title: "Stop Optimizing During Reflection",
    shortDescription: "Protect reflective moments from conversion pressure.",
    meaning: "When a user reaches a reflective moment, don't push conversion, upsell, or next actions.",
    inPractice: [
      "Avoid calls to action immediately after journaling or difficult tasks.",
      "Give the person room to finish, pause, or simply leave.",
    ],
    whyItMatters: "Reflection is fragile. Pushing breaks trust.",
    situations: ["reflection", "agency"],
    relatedIds: ["05", "03", "04"],
    boundary: "Do not treat reflection as a high-engagement opportunity or use vulnerability to shape a decision.",
  },
  {
    id: "07",
    title: "Pause When Something Feels Off",
    shortDescription: "Stop the flow when misalignment becomes visible.",
    meaning: "If confusion, frustration, or misalignment appears, pause the flow.",
    inPractice: [
      "Offer a slower or clearer path when the person expresses confusion.",
      "For example: 'It looks like something didn't land. Want to slow down?'",
    ],
    whyItMatters: "Optimizing through misalignment compounds damage.",
    situations: ["uncertainty", "integrity"],
    relatedIds: ["01", "03", "08"],
    boundary: "Make the pause optional and specific. Do not claim to detect emotion from behavior alone or interrupt without a proportionate reason.",
  },
  {
    id: "08",
    title: "Check System Bias First",
    shortDescription: "Examine system assumptions before blaming the user.",
    meaning: "Before attributing friction to the user, examine the system.",
    inPractice: [
      "Review defaults, assumptions, and tone.",
      "Ask the team: 'Are we creating this problem?'",
    ],
    whyItMatters: "Blaming users hides design failure.",
    situations: ["integrity", "uncertainty"],
    relatedIds: ["07", "09", "10"],
    boundary: "Investigate product behavior using evidence and diverse perspectives; do not replace one unsupported assumption with another.",
  },
  {
    id: "09",
    title: "Make Entry Signals Clear",
    shortDescription: "Make a product's intent and scope explicit at entry.",
    meaning: "When launching a product, feature, or community, make intent visible and grounded.",
    inPractice: [
      "Use clear onboarding statements.",
      "Explain scope and expectations before requesting commitment.",
    ],
    whyItMatters: "Ambiguous entry creates false assumptions.",
    situations: ["integrity", "agency"],
    relatedIds: ["04", "10", "12"],
    boundary: "Do not promise more control, privacy, support, or intelligence than the system can actually provide.",
  },
  {
    id: "10",
    title: "Signal Fidelity Check",
    shortDescription: "Verify that stated values match observable behavior.",
    meaning: "Before shipping, confirm that tone and behavior match stated values.",
    inPractice: [
      "Audit 'privacy-first' claims against real flows.",
      "Test exit paths, consent, and defaults.",
    ],
    whyItMatters: "Misalignment between promise and behavior erodes credibility.",
    situations: ["integrity", "agency"],
    relatedIds: ["08", "09", "11"],
    boundary: "Do not treat a polished message or interface as evidence of a real safeguard. Verify behavior in the shipped flow.",
  },
  {
    id: "11",
    title: "Interpret Before Acting",
    shortDescription: "Make the proposed interpretation visible and correctable.",
    meaning: "Before executing or responding, the system should make its interpretation visible and allow the user to confirm or correct it.",
    inPractice: [
      "Explain the operative understanding: 'Based on what I see, here's what I think is happening — does that look right?'",
      "Show the interpreted request, key assumptions, and proposed action before consequential execution.",
    ],
    whyItMatters: "Incorrect interpretation leads to correct execution of the wrong action.",
    situations: ["decisions", "integrity"],
    relatedIds: ["02", "12", "10"],
    boundary: "Provide an understandable interpretation and action preview, not private chain-of-thought. Confirm according to the consequences of the action.",
  },
  {
    id: "12",
    title: "Frame, Then Confirm",
    shortDescription: "Make recommendation framing visible before a decision.",
    meaning: "When presenting options or recommendations, make framing visible and confirm alignment before the user acts.",
    inPractice: [
      "Show multiple options without implicit bias.",
      "Explain why something is labeled 'recommended'.",
      "Ask: 'Does this match what you're trying to decide?'",
    ],
    whyItMatters: "Users often act on framing before validating the underlying information. Hidden framing leads to unintended decisions.",
    situations: ["decisions", "integrity"],
    relatedIds: ["11", "02", "09"],
    boundary: "Explain criteria and uncertainty, preserve alternatives, and leave decision authority with the person. Do not silently steer or select on their behalf.",
  },
] as const;

export const SOVEREIGN_PROTOCOLS_BY_ID: Readonly<Record<SovereignProtocolId, SovereignProtocol>> =
  Object.fromEntries(SOVEREIGN_PROTOCOLS.map((protocol) => [protocol.id, protocol])) as Record<
    SovereignProtocolId,
    SovereignProtocol
  >;

export const SOVEREIGN_PROTOCOLS_PROFESSIONAL_BOUNDARY =
  "These protocols are situational practices, not scripts, personality layers, emotional manipulation techniques, or substitutes for human judgment. They support clarity, consent, and agency; they do not authorize emotional profiling, psychological interpretation, simulated intimacy, or taking control of decisions. When need exceeds design scope, pause, clarify consent, and refer or escalate appropriately.";

export const SOVEREIGN_PROTOCOLS_USAGE_NOTE =
  "Choose the practice that fits the expressed situation. Situational filters are navigation aids, not phases, compliance scores, or a requirement to apply every protocol.";
