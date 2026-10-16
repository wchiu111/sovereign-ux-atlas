/**
 * When Reflection Fails — canonical Failure Patterns reference.
 * Names, order, symptoms, trust rationale, and repair intent preserve the authored
 * 17-pattern catalog. Examples are deliberately ILLUSTRATIVE, not observed evidence.
 * Situations, validation questions, and related references are navigation aids,
 * not official taxonomy, verified outcomes, or compliance criteria.
 */
export type FailurePatternId =
  | "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09"
  | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17";

export type FailureSituationId = "pressure" | "context" | "agency" | "integrity" | "authority";

export interface FailureSituation {
  id: FailureSituationId;
  label: string;
  description: string;
}

export interface IllustrativeSurface {
  context: string;
  headline: string;
  message: string;
  details: readonly string[];
}

export interface SovereignFailurePattern {
  id: FailurePatternId;
  title: string;
  shortDescription: string;
  whatItLooksLike: string;
  whyItBreaksTrust: string;
  repair: string;
  situations: readonly FailureSituationId[];
  failureExample: IllustrativeSurface;
  repairExample: IllustrativeSurface;
  validationQuestion: string;
  /** Relevant reading references, not canonical dependencies. */
  relatedProtocolIds: readonly string[];
  relatedLawIds: readonly string[];
}

export const FAILURE_SITUATIONS: readonly FailureSituation[] = [
  { id: "pressure", label: "Pressure & persuasion", description: "Urgency, nudging, conversion pressure, and emotional climate" },
  { id: "context", label: "Context & responsiveness", description: "Unheard intent, lost progress, ignored confusion, and empty mirroring" },
  { id: "agency", label: "Consent & agency", description: "Uninvited depth, inaccessible exits, and imposed assumptions" },
  { id: "integrity", label: "Integrity & accountability", description: "Blame, performative values, and broken privacy commitments" },
  { id: "authority", label: "AI interpretation & authority", description: "Uncertainty, misleading confidence, authority shifts, and choice framing" },
] as const;

export const FAILURE_PATTERNS: readonly SovereignFailurePattern[] = [
  {
    id: "01", title: "The Pushy Pop-Up", shortDescription: "A conversion prompt interrupts before meaningful intent is established.",
    whatItLooksLike: "A discount or call to action appears before the person has shown interest.",
    whyItBreaksTrust: "Urgency is manufactured without meaningful consent or an appropriate moment.",
    repair: "Wait for a genuinely relevant moment or explicit intent. Scroll depth and dwell time alone do not establish consent; keep dismissal easy and non-punitive.",
    situations: ["pressure", "agency"],
    failureExample: { context: "ILLUSTRATIVE · COMMERCE", headline: "Wait—10% off ends soon!", message: "An offer covers the content immediately after arrival.", details: ["No expressed shopping intent", "Full-screen interruption", "Dismiss is visually secondary"] },
    repairExample: { context: "ILLUSTRATIVE · COMMERCE", headline: "Offers, when you want them", message: "The person can open relevant offers while browsing, without a forced interruption.", details: ["Optional discovery", "Equal-weight dismissal", "No manufactured countdown"] },
    validationQuestion: "Can a person explore or dismiss without pressure, even if they never show conversion intent?",
    relatedProtocolIds: ["01", "04", "12"], relatedLawIds: ["sovereignty", "decision-framing"],
  },
  {
    id: "02", title: "The Cheerful System That Doesn’t Listen", shortDescription: "Optimistic tone overrides expressed frustration.",
    whatItLooksLike: "A person expresses frustration and the system responds with upbeat tone, cheerleading, or emojis.",
    whyItBreaksTrust: "The tone mismatch dismisses the context the person actually expressed.",
    repair: "Acknowledge the expressed frustration plainly, then offer concrete help. Do not claim to know an unexpressed emotion.",
    situations: ["context", "pressure"],
    failureExample: { context: "ILLUSTRATIVE · SUPPORT", headline: "Great news! 🎉", message: "You can try the exact same step again!", details: ["Person reported repeated failures", "Response ignores the problem"] },
    repairExample: { context: "ILLUSTRATIVE · SUPPORT", headline: "That step failed again", message: "I can help identify the error, retry with a different path, or pause here.", details: ["Names observed error", "Offers concrete alternatives"] },
    validationQuestion: "Does the response acknowledge what was said and move toward useful assistance?",
    relatedProtocolIds: ["01", "02", "07"], relatedLawIds: ["presence", "reflection"],
  },
  {
    id: "03", title: "The Vanishing Form", shortDescription: "Leaving a task causes effort and progress to disappear.",
    whatItLooksLike: "A person leaves partway through a form and receives no acknowledgement or path back.",
    whyItBreaksTrust: "The system treats their invested effort as disposable.",
    repair: "Where appropriate, preserve draft progress with clear consent, and offer resume, restart, or closure choices.",
    situations: ["context", "agency"],
    failureExample: { context: "ILLUSTRATIVE · APPLICATION", headline: "Start your application", message: "Your previous entries are gone.", details: ["No draft notice", "No recovery option"] },
    repairExample: { context: "ILLUSTRATIVE · APPLICATION", headline: "Resume your application?", message: "A saved draft is available. Continue, start over, or delete the draft.", details: ["Progress is visible", "Data retention is explainable"] },
    validationQuestion: "Can people recover, intentionally discard, or understand the status of their work?",
    relatedProtocolIds: ["03", "04"], relatedLawIds: ["completion", "error-recovery-as-trust-building"],
  },
  {
    id: "04", title: "The Over-Interpreting System", shortDescription: "The system assumes emotional depth it was never invited to enter.",
    whatItLooksLike: "The system offers emotional or identity-adjacent guidance without an invitation.",
    whyItBreaksTrust: "The system assumes intimate knowledge and depth without consent.",
    repair: "Keep interpretation within stated task boundaries. Ask permission before exploring sensitive topics; provide a straightforward task-focused alternative.",
    situations: ["agency", "context", "authority"],
    failureExample: { context: "ILLUSTRATIVE · AI ASSISTANT", headline: "You seem afraid of commitment", message: "The assistant infers personality from a scheduling question.", details: ["Uninvited psychological claim", "No choice of response depth"] },
    repairExample: { context: "ILLUSTRATIVE · AI ASSISTANT", headline: "Would you like help choosing a time?", message: "I can compare availability. We can discuss other concerns only if you choose to.", details: ["Task-first response", "Optional broader conversation"] },
    validationQuestion: "Is the system answering the expressed task without claiming authority over the person's inner state?",
    relatedProtocolIds: ["05", "11"], relatedLawIds: ["agency-in-vulnerability", "sovereignty"],
  },
  {
    id: "05", title: "The Aggressive Nudge", shortDescription: "Disengagement triggers pressure instead of a respectful choice.",
    whatItLooksLike: "The system sends messages such as ‘You're falling behind’ to people who have disengaged.",
    whyItBreaksTrust: "Behavior is targeted without respect for context, pace, or a person's decision to step away.",
    repair: "Offer optional assistance or silence, and make notification preferences easy to control without guilt.",
    situations: ["pressure", "agency"],
    failureExample: { context: "ILLUSTRATIVE · PRODUCTIVITY", headline: "You're falling behind", message: "Act now to catch up with everyone else.", details: ["Unsolicited guilt framing", "Repeated reminders"] },
    repairExample: { context: "ILLUSTRATIVE · PRODUCTIVITY", headline: "Your work is here when you're ready", message: "Resume, change your reminder schedule, or turn reminders off.", details: ["No comparative shame", "Silence remains a choice"] },
    validationQuestion: "Can someone disengage without punitive language or repeated prompts?",
    relatedProtocolIds: ["04", "06", "07"], relatedLawIds: ["sovereignty", "silence-as-signal"],
  },
  {
    id: "06", title: "The Locked Path", shortDescription: "The experience removes meaningful cancel, skip, or exit paths.",
    whatItLooksLike: "People cannot cancel, skip, or disengage without obstruction.",
    whyItBreaksTrust: "A nominal choice becomes coercive when the alternative is withheld.",
    repair: "Provide discoverable exits, skip actions, and equal-weight alternatives where the choice is genuine.",
    situations: ["agency", "integrity"],
    failureExample: { context: "ILLUSTRATIVE · ONBOARDING", headline: "Finish every step to continue", message: "The person must accept an optional feature to leave setup.", details: ["Skip is absent", "Back traps the person"] },
    repairExample: { context: "ILLUSTRATIVE · ONBOARDING", headline: "Continue on your terms", message: "Set up now, skip optional steps, or leave setup and return later.", details: ["Exit and skip visible", "No punitive consequence"] },
    validationQuestion: "Can people decline or leave without losing unrelated access or being steered back?",
    relatedProtocolIds: ["04", "09"], relatedLawIds: ["sovereignty", "clarity"],
  },
  {
    id: "07", title: "The System That Pushes Through Confusion", shortDescription: "Automation advances while the person remains unsure.",
    whatItLooksLike: "A person is stuck or confused while the system keeps advancing the flow.",
    whyItBreaksTrust: "Visible misalignment is ignored and actions become harder to correct.",
    repair: "Pause progression, name the unresolved issue, and provide a way to review or change direction.",
    situations: ["context", "agency", "authority"],
    failureExample: { context: "ILLUSTRATIVE · AUTOMATION", headline: "Next step started", message: "The assistant advances although the person just asked what the prior action meant.", details: ["Confusion unanswered", "New work begins automatically"] },
    repairExample: { context: "ILLUSTRATIVE · AUTOMATION", headline: "Let's clarify before continuing", message: "Here's what changed. Review the step, ask a question, or explicitly continue.", details: ["System pauses", "Choice is returned"] },
    validationQuestion: "Does unresolved confusion suspend consequential progression until the person can decide?",
    relatedProtocolIds: ["07", "11", "04"], relatedLawIds: ["clarity", "decision-framing"],
  },
  {
    id: "08", title: "The Assumptive Persona", shortDescription: "A system assigns identity, tone, or labels without asking.",
    whatItLooksLike: "The system adopts a persona, identity label, or tone for someone without their input.",
    whyItBreaksTrust: "Assumptions replace acknowledgement of the person and their context.",
    repair: "Ask before adapting meaningful preferences or identity labels, and offer a neutral default that is easy to change.",
    situations: ["agency", "context"],
    failureExample: { context: "ILLUSTRATIVE · PERSONALIZATION", headline: "We know your style", message: "A profile label is inferred from a few clicks and used as a fixed identity.", details: ["Unverified label", "No correction control"] },
    repairExample: { context: "ILLUSTRATIVE · PERSONALIZATION", headline: "Choose how this is presented", message: "Use the default tone, select a preference, or change it whenever you wish.", details: ["Neutral by default", "Preferences are correctable"] },
    validationQuestion: "Can the person understand, reject, and edit the adaptation without disclosing more?",
    relatedProtocolIds: ["02", "05", "11"], relatedLawIds: ["reflection", "sovereignty"],
  },
  {
    id: "09", title: "The Blame Shift", shortDescription: "Poor system clarity is reframed as user failure.",
    whatItLooksLike: "The interface says ‘You're doing this wrong’ when its own instruction is unclear.",
    whyItBreaksTrust: "Responsibility for a design problem is displaced onto the person using the system.",
    repair: "Fix unclear structure and feedback before offering supportive guidance or correction.",
    situations: ["integrity", "context"],
    failureExample: { context: "ILLUSTRATIVE · ERROR STATE", headline: "Invalid input. Try harder.", message: "The field rejects an answer without naming the format it accepts.", details: ["Vague validation", "Blaming language"] },
    repairExample: { context: "ILLUSTRATIVE · ERROR STATE", headline: "Please use YYYY-MM-DD", message: "The required format is displayed with a concrete example, and the entry is preserved.", details: ["Specific repair guidance", "Effort retained"] },
    validationQuestion: "Does the design identify its own missing guidance before attributing difficulty to a person?",
    relatedProtocolIds: ["08", "07"], relatedLawIds: ["clarity", "error-recovery-as-trust-building"],
  },
  {
    id: "10", title: "The Endless Mirror", shortDescription: "Acknowledgement repeats without allowing progress or closure.",
    whatItLooksLike: "The system continually mirrors feelings without offering resolution.",
    whyItBreaksTrust: "Reflection becomes a performance that traps the person in a loop.",
    repair: "Acknowledge once as appropriate, then offer a concrete next step, space to clarify, or an easy close.",
    situations: ["context", "agency"],
    failureExample: { context: "ILLUSTRATIVE · CONVERSATION", headline: "That sounds really difficult", message: "Repeated rephrasing continues even after the person asks for an answer.", details: ["No task advancement", "No clear closure"] },
    repairExample: { context: "ILLUSTRATIVE · CONVERSATION", headline: "Here's the next useful step", message: "I can summarize the options, answer directly, or stop here.", details: ["Acknowledgement is proportional", "Resolution and exit offered"] },
    validationQuestion: "Is reflection helping the stated task move forward or making the conversation harder to leave?",
    relatedProtocolIds: ["02", "04", "05"], relatedLawIds: ["completion", "reflection"],
  },
  {
    id: "11", title: "The Faux-Values Interface", shortDescription: "Warm language masks coercive product mechanics.",
    whatItLooksLike: "The system uses empathetic language alongside manipulative defaults or obstructed exits.",
    whyItBreaksTrust: "The interface performs values that the underlying behavior contradicts.",
    repair: "Bring consent, exit, framing, and default mechanics into alignment with the claims being made.",
    situations: ["integrity", "pressure", "agency"],
    failureExample: { context: "ILLUSTRATIVE · SIGN-UP", headline: "Your wellbeing comes first", message: "Optional data sharing is enabled automatically in the next step.", details: ["Empathetic claim", "Contradictory default"] },
    repairExample: { context: "ILLUSTRATIVE · SIGN-UP", headline: "Choose what to share", message: "Optional sharing starts off and can be enabled with clear explanation.", details: ["Behavior reflects promise", "Decline is explicit"] },
    validationQuestion: "Would the product still embody its stated values if all reassuring copy were removed?",
    relatedProtocolIds: ["10", "04", "09"], relatedLawIds: ["integrity", "signal-fidelity"],
  },
  {
    id: "12", title: "The Integrity Leak", shortDescription: "Privacy promises conflict with hidden data-sharing defaults.",
    whatItLooksLike: "A ‘privacy-first’ claim accompanies opt-out-hidden defaults.",
    whyItBreaksTrust: "The visible signal and the actual system behavior diverge.",
    repair: "Make refusing optional collection or sharing as visible as accepting it, and ensure the mechanics match the promise.",
    situations: ["integrity", "agency"],
    failureExample: { context: "ILLUSTRATIVE · PRIVACY", headline: "Privacy first", message: "A data-sharing toggle is buried and enabled unless someone finds it.", details: ["Hidden default", "Misleading promise"] },
    repairExample: { context: "ILLUSTRATIVE · PRIVACY", headline: "Your data, your choice", message: "Optional sharing is off until specifically selected; both choices are legible.", details: ["Equal-weight yes/no", "Preference can be revised"] },
    validationQuestion: "Can someone identify every material data choice without searching through secondary settings?",
    relatedProtocolIds: ["10", "04"], relatedLawIds: ["signal-fidelity", "integrity"],
  },
  {
    id: "13", title: "Atmosphere Drift", shortDescription: "Visual energy contradicts the sensitivity of the task.",
    whatItLooksLike: "Frantic motion, timers, urgency cues, or hype appear during a sensitive task.",
    whyItBreaksTrust: "The emotional and cognitive climate no longer fits what the moment asks of the person.",
    repair: "Adjust tone, motion, and pacing to the actual task; preserve calm and time to consider high-stakes information.",
    situations: ["pressure", "context"],
    failureExample: { context: "ILLUSTRATIVE · BENEFITS ENROLLMENT", headline: "Act in 00:30!", message: "Bright countdown animation accompanies a consequential decision.", details: ["Artificial urgency", "High motion during sensitive work"] },
    repairExample: { context: "ILLUSTRATIVE · BENEFITS ENROLLMENT", headline: "Review before deciding", message: "Relevant deadlines are stated accurately without dramatization or motion pressure.", details: ["Measured pacing", "Time to compare options"] },
    validationQuestion: "Does the task feel understandable and appropriately paced without urgency effects?",
    relatedProtocolIds: ["01", "06", "07"], relatedLawIds: ["presence", "clarity"],
  },
  {
    id: "14", title: "The Silent System", shortDescription: "An AI workflow carries on while its underlying information is unreliable.",
    whatItLooksLike: "The system keeps working despite outdated, missing, or degraded information.",
    whyItBreaksTrust: "People assume correctness because the system does not disclose a material limitation.",
    repair: "Show freshness, missing inputs, and meaningful uncertainty. Hold consequential action when necessary and give a clear recovery path.",
    situations: ["authority", "integrity"],
    failureExample: { context: "ILLUSTRATIVE · OPERATIONS", headline: "Everything is current", message: "A recommendation uses yesterday's inventory without showing data age.", details: ["Stale source hidden", "Normal-state appearance"] },
    repairExample: { context: "ILLUSTRATIVE · OPERATIONS", headline: "Inventory last updated yesterday", message: "Refresh the source, inspect missing records, or defer action until verified.", details: ["Freshness displayed", "Uncertainty affects action"] },
    validationQuestion: "Would a user notice material degradation before relying on the recommendation?",
    relatedProtocolIds: ["10", "11"], relatedLawIds: ["transparent-uncertainty", "signal-fidelity"],
  },
  {
    id: "15", title: "Structured Confidence", shortDescription: "Polished AI output disguises weak or missing evidence.",
    whatItLooksLike: "Well-structured lists, confident prose, and clear recommendations seem authoritative despite weak or incomplete assumptions.",
    whyItBreaksTrust: "People trust the presentation before verifying the reasoning, evidence, or limits behind it.",
    repair: "Expose assumptions, missing inputs, uncertainty, and provenance. Do not manufacture precise confidence percentages unless they are validated and interpretable.",
    situations: ["authority", "integrity"],
    failureExample: { context: "ILLUSTRATIVE · AI RECOMMENDATION", headline: "Recommended: Option A", message: "A tidy ranked answer looks definitive although key cost information is missing.", details: ["No stated assumptions", "No source or limitations"] },
    repairExample: { context: "ILLUSTRATIVE · AI RECOMMENDATION", headline: "Option A may fit, with conditions", message: "This comparison omits current service fees. Here are the assumptions and other options to review.", details: ["Missing context exposed", "Evidence and alternatives visible"] },
    validationQuestion: "Can someone distinguish evidence from assumption before trusting the recommendation?",
    relatedProtocolIds: ["11", "12"], relatedLawIds: ["transparent-uncertainty", "decision-framing"],
  },
  {
    id: "16", title: "Authority Creep", shortDescription: "A system shifts from informing to deciding without making the boundary visible.",
    whatItLooksLike: "The system gradually moves from information to interpretation to recommendation to implicit decision.",
    whyItBreaksTrust: "The user may defer authority without noticing the transition or choosing to delegate it.",
    repair: "Label information, interpretation, and recommendation distinctly. Before consequential execution or delegation, make the decision boundary explicit and require appropriate user authorization.",
    situations: ["authority", "agency"],
    failureExample: { context: "ILLUSTRATIVE · AGENTIC ASSISTANT", headline: "I've chosen the best plan", message: "The assistant moves from summarizing options to submitting a selection automatically.", details: ["Authority change hidden", "No confirmation before action"] },
    repairExample: { context: "ILLUSTRATIVE · AGENTIC ASSISTANT", headline: "Here's my recommendation", message: "Review the options and rationale. Nothing will be submitted until you authorize the action.", details: ["Recommendation labelled", "Execution remains under user control"] },
    validationQuestion: "At what exact point does the system gain authority to act, and can the person revoke it?",
    relatedProtocolIds: ["11", "12", "04"], relatedLawIds: ["sovereignty", "visible-trade-offs"],
  },
  {
    id: "17", title: "Framed Outcome Bias", shortDescription: "Option presentation quietly favors a predefined outcome.",
    whatItLooksLike: "Defaults, ‘recommended’ tags, and ordering systematically favor one choice.",
    whyItBreaksTrust: "People may believe they are choosing freely although the system shaped their comparison in advance.",
    repair: "Reveal why an option is prioritized, disclose meaningful alternatives and trade-offs, and avoid loaded defaults.",
    situations: ["authority", "pressure", "agency"],
    failureExample: { context: "ILLUSTRATIVE · PLAN SELECTOR", headline: "Recommended: Premium", message: "The most expensive option is preselected and lower-cost alternatives are visually diminished.", details: ["Ranking criteria hidden", "Choice architecture biased"] },
    repairExample: { context: "ILLUSTRATIVE · PLAN SELECTOR", headline: "Compare plans by your priorities", message: "Price, capabilities, and trade-offs are visible. A recommendation explains the criteria used.", details: ["Prioritization explained", "Alternatives are discoverable"] },
    validationQuestion: "Can someone compare alternatives without mistaking the system's preferred outcome for their own?",
    relatedProtocolIds: ["12", "11"], relatedLawIds: ["decision-framing", "visible-trade-offs"],
  },
] as const;

export const FAILURE_PATTERNS_BY_ID: Readonly<Partial<Record<FailurePatternId, SovereignFailurePattern>>> =
  Object.fromEntries(FAILURE_PATTERNS.map((pattern) => [pattern.id, pattern]));

export const FAILURE_DIAGNOSTIC_QUESTIONS = [
  "Did we acknowledge before acting?",
  "Is there a clear exit at every loop?",
  "Are we matching depth to what the user offered?",
  "Does tone, pacing, and structure align with the moment?",
  "Does behavior match our stated values?",
  "Are we presenting options—or quietly shaping decisions?",
] as const;

export const FAILURE_REPAIR_LOOP = [
  { label: "PAUSE", action: "Stop optimizing" },
  { label: "NAME", action: "Identify the misalignment" },
  { label: "RESTORE", action: "Re-center user agency" },
] as const;

export const FAILURE_FIELD_GUIDANCE =
  "These examples are illustrative reconstructions for discussion, not evidence of tested results. A proposed repair needs verification with real context and affected people.";

export const FAILURE_PROFESSIONAL_BOUNDARY =
  "Failure patterns help teams recognize and repair design misalignment. They do not authorize psychological profiling, hidden persuasion, emotional manipulation, or claims about a person's internal state. When a problem exceeds design scope, pause and seek appropriate review or referral.";
