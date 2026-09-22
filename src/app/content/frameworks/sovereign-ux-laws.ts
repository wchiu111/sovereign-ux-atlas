export type SovereignLawBand = "core" | "relational" | "signal";

export interface SovereignLaw {
  id: string;
  number: string;
  title: string;
  band: SovereignLawBand;
  shortDescription: string;
  principle?: string;
  example?: string;
  broken?: string;
}

export const SOVEREIGN_LAW_COUNTS = {
  total: 25,
  core: 12,
  relational: 10,
  signals: 3,
} as const;

export const SOVEREIGN_LAWS_SIGNAL_CAUTION =
  "These are indicators, not goals. If they appear, pause and document — do not optimize for them directly.";

export const SOVEREIGN_LAWS_PROFESSIONAL_BOUNDARY =
  "These laws govern UX and system behavior. They do not justify psychological interpretation, identity shaping, or therapeutic intervention. When emotional depth exceeds design scope, the correct response is pause, consent, or referral — not deeper automation.";

export const SOVEREIGN_LAWS: SovereignLaw[] = [
  {
    id: "reflection",
    number: "01",
    title: "Reflection",
    band: "core",
    shortDescription: "Acknowledge before acting.",
    principle:
      "Systems should acknowledge user intent, state, and context before acting. This includes how the system interprets input and frames its response or recommendations.",
    example:
      "A chatbot confirms understanding before executing a request.",
    broken:
      "Users repeatedly say, ‘That’s not what I meant.’",
  },
  {
    id: "resonance",
    number: "02",
    title: "Resonance",
    band: "core",
    shortDescription: "Match tone and pacing to the person’s situation.",
    principle:
      "Tone and pacing should match the user’s situation — not the system’s goals.",
    example:
      "Calm copy during stressful tasks instead of urgency-driven language.",
    broken:
      "High completion rates are paired with irritation or distrust.",
  },
  {
    id: "clarity",
    number: "03",
    title: "Clarity",
    band: "core",
    shortDescription: "Say plainly what matters.",
    principle: "If something matters, say it plainly.",
    example: "Clear summaries instead of buried legal language.",
    broken:
      "Users agree to things they later regret or misunderstand.",
  },
  {
    id: "coherence",
    number: "04",
    title: "Coherence",
    band: "core",
    shortDescription: "Align visuals, language, timing, and structure.",
    principle:
      "Visuals, language, timing, and structure should align emotionally.",
    example: "Serious tone for serious decisions.",
    broken: "Playful UI appears during high-stakes moments.",
  },
  {
    id: "sovereignty",
    number: "05",
    title: "Sovereignty",
    band: "core",
    shortDescription: "Preserve real choice without manipulation.",
    principle: "Users must have real choices — without manipulation.",
    example: "Easy opt-out, equal-weight options, and no dark patterns.",
    broken: "Pre-selected defaults or hidden exits steer the decision.",
  },
  {
    id: "completion",
    number: "06",
    title: "Completion",
    band: "core",
    shortDescription: "Honor effort with closure.",
    principle: "Every effort deserves closure.",
    example: "Acknowledging task completion or saved progress.",
    broken: "Users encounter dead ends or forgotten effort.",
  },
  {
    id: "integrity",
    number: "07",
    title: "Integrity",
    band: "core",
    shortDescription: "Protect consent, boundaries, and safety.",
    principle: "Protect consent, boundaries, and safety.",
    example: "Opting out is as easy as opting in.",
    broken: "Users feel tricked or coerced.",
  },
  {
    id: "presence",
    number: "08",
    title: "Presence",
    band: "core",
    shortDescription: "Make people feel acknowledged, not processed.",
    principle:
      "Design should make users feel acknowledged, not processed.",
    example: "Pauses before nudges or recommendations.",
    broken: "Relentless prompts and notifications erase space to think.",
  },
  {
    id: "signal-fidelity",
    number: "09",
    title: "Signal Fidelity",
    band: "core",
    shortDescription: "Match product claims to actual behavior.",
    principle:
      "What the product claims should match how it behaves. This includes temporal accuracy — information must not only be correct, but current.",
    example:
      "A ‘privacy-first’ product actually limits data collection.",
    broken: "Brand values collapse under real use.",
  },
  {
    id: "silent-drift",
    number: "10",
    title: "Silent Drift",
    band: "core",
    shortDescription: "Surface misalignment before trust erodes.",
    principle:
      "Systems must surface misalignment early. Trust erosion begins before users complain.",
    example:
      "Stale data, delayed updates, or partial system failure is communicated instead of hidden.",
    broken:
      "The system appears functional while users quietly stop trusting it.",
  },
  {
    id: "decision-framing",
    number: "11",
    title: "Decision Framing",
    band: "core",
    shortDescription: "Present choices without quietly steering outcomes.",
    principle:
      "How choices are presented influences outcomes more than the underlying data.",
    example:
      "A financial AI presenting ‘Recommended option’ versus ‘Option A / B / C’ can produce different decisions even when the data is identical.",
    broken:
      "Users feel nudged, steered, or overly influenced without understanding why.",
  },
  {
    id: "visible-trade-offs",
    number: "12",
    title: "Visible Trade-Offs",
    band: "core",
    shortDescription: "Make the cost of a choice visible before commitment.",
    principle:
      "Systems must make the cost of a choice visible before the user commits.",
    example:
      "Show what is lost when switching plans — not just what is gained.",
    broken: "Users feel misled after making a decision.",
  },
  {
    id: "attunement-before-action",
    number: "13",
    title: "Attunement Before Action",
    band: "relational",
    shortDescription: "Match emotional state before pushing progress.",
    principle: "Match emotional state before pushing progress.",
  },
  {
    id: "reflection-as-relationship",
    number: "14",
    title: "Reflection as Relationship",
    band: "relational",
    shortDescription: "Understanding precedes guidance.",
    principle: "Understanding precedes guidance.",
  },
  {
    id: "transparent-uncertainty",
    number: "15",
    title: "Transparent Uncertainty",
    band: "relational",
    shortDescription: "Admit limits instead of bluffing confidence.",
    principle: "Admit limits instead of bluffing confidence.",
  },
  {
    id: "agency-in-vulnerability",
    number: "16",
    title: "Agency in Vulnerability",
    band: "relational",
    shortDescription: "Stress does not remove choice.",
    principle: "Stress does not remove choice.",
  },
  {
    id: "validation-before-correction",
    number: "17",
    title: "Validation Before Correction",
    band: "relational",
    shortDescription: "Acknowledge experience before fixing behavior.",
    principle: "Acknowledge experience before fixing behavior.",
  },
  {
    id: "emotional-labor-acknowledgment",
    number: "18",
    title: "Emotional Labor Acknowledgment",
    band: "relational",
    shortDescription: "Recognize effort, especially in difficult tasks.",
    principle: "Recognize effort, especially in difficult tasks.",
  },
  {
    id: "silence-as-signal",
    number: "19",
    title: "Silence as Signal",
    band: "relational",
    shortDescription: "Pauses carry meaning — do not rush to fill them.",
    principle: "Pauses carry meaning — do not rush to fill them.",
  },
  {
    id: "error-recovery-as-trust-building",
    number: "20",
    title: "Error Recovery as Trust-Building",
    band: "relational",
    shortDescription: "Mistakes handled well can increase credibility.",
    principle: "Mistakes handled well increase credibility.",
  },
  {
    id: "consistency-across-escalation",
    number: "21",
    title: "Consistency Across Escalation",
    band: "relational",
    shortDescription: "Carry context from AI to human support.",
    principle: "Context should carry from AI to human support.",
  },
  {
    id: "right-to-disengage",
    number: "22",
    title: "Right to Disengage",
    band: "relational",
    shortDescription: "Allow exit or pause without penalty.",
    principle: "Users must be able to pause or exit without penalty.",
  },
  {
    id: "stillness-without-anxiety",
    number: "23",
    title: "Stillness Without Anxiety",
    band: "signal",
    shortDescription: "Observe — do not optimize.",
  },
  {
    id: "effortless-flow-without-pressure",
    number: "24",
    title: "Effortless Flow Without Pressure",
    band: "signal",
    shortDescription: "Observe — do not optimize.",
  },
  {
    id: "trust-without-persuasion",
    number: "25",
    title: "Trust Without Persuasion",
    band: "signal",
    shortDescription: "Observe — do not optimize.",
  },
];

export const CORE_SOVEREIGN_LAWS = SOVEREIGN_LAWS.filter(
  (law) => law.band === "core",
);

export const RELATIONAL_SOVEREIGN_LAWS = SOVEREIGN_LAWS.filter(
  (law) => law.band === "relational",
);

export const SOVEREIGN_ALIGNMENT_SIGNALS = SOVEREIGN_LAWS.filter(
  (law) => law.band === "signal",
);
