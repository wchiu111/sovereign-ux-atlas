/**
 * Foundations — From Belief to Behavior.
 * Canonical principle titles and statements preserve the author's original
 * Foundations. Belief / design responsibility / agency and examples are
 * editorial interpretations for inspection, not newly enacted laws.
 */
export type FoundationPrincipleId =
  | "01" | "02" | "03" | "04" | "05"
  | "06" | "07" | "08" | "09" | "10";

export interface FoundationCommitment {
  id: "clarity" | "consent" | "judgment" | "agency";
  title: string;
  meaning: string;
}

export interface FoundationIllustration {
  context: string;
  heading: string;
  behavior: string;
  note: string;
}

export interface FoundationPrinciple {
  id: FoundationPrincipleId;
  title: string;
  originalPrinciple: string;
  belief: string;
  designResponsibility: string;
  preservedAgency: string;
  illustration: FoundationIllustration;
}

export const FOUNDATION_COMMITMENTS: readonly FoundationCommitment[] = [
  { id: "clarity", title: "Clarity", meaning: "People can tell what the system is doing and why." },
  { id: "consent", title: "Consent", meaning: "Consequential system behavior is chosen rather than quietly assumed." },
  { id: "judgment", title: "Judgment", meaning: "A person's own reasoning is strengthened, not replaced." },
  { id: "agency", title: "Agency", meaning: "People can change direction, pause, decline, or leave." },
] as const;

export const FOUNDATION_PRINCIPLES: readonly FoundationPrinciple[] = [
  {
    id: "01", title: "Every interaction includes awareness",
    originalPrinciple: "People aren’t just clicking buttons—they’re interpreting meaning, weighing options, and deciding what to trust. Design should account for that reality.",
    belief: "People interpret an interface while using it; every decision also carries context and meaning.",
    designResponsibility: "Reveal the information, timing, and consequences people need to interpret the interaction. Don't treat their response as a bare click.",
    preservedAgency: "The person can understand the situation and decide how to proceed without guessing the system's intent.",
    illustration: { context: "ILLUSTRATIVE · APPLICATION", heading: "Before you continue", behavior: "A submission screen explains what will be sent and what happens next before accepting confirmation.", note: "Awareness is supported by context, not inferred from user behavior." },
  },
  {
    id: "02", title: "The user is not a target",
    originalPrinciple: "Interfaces should not manipulate behavior. They should support informed choice, clear exits, and respectful communication.",
    belief: "A person is an active participant, not a conversion target to be moved toward a desired outcome.",
    designResponsibility: "Offer honest choices, visible exits, and non-coercive copy rather than obscured dismissal or manufactured urgency.",
    preservedAgency: "The person may continue, decline, or disengage without a penalty designed to force a conversion.",
    illustration: { context: "ILLUSTRATIVE · PRODUCT OFFER", heading: "Explore this option", behavior: "An optional recommendation appears alongside an equally accessible 'Not now' choice.", note: "A dismissal is an ordinary choice, not a failure state." },
  },
  {
    id: "03", title: "Attunement over optimization",
    originalPrinciple: "Speed matters, but emotional fit matters too. A flow can be efficient and still feel wrong. Sovereign UX treats “how it feels” as a real design signal, not noise.",
    belief: "Task efficiency alone cannot tell us whether an interaction fits its human context.",
    designResponsibility: "Adjust pacing and language based on the situation people actually express; test appropriateness, not just completion time.",
    preservedAgency: "The person can move at an appropriate pace and ask for clarification or a pause.",
    illustration: { context: "ILLUSTRATIVE · SUPPORT", heading: "We can work through this", behavior: "After a repeated failure, the interface offers a clear explanation, alternative route, and pause option instead of escalating urgency.", note: "Do not pretend to know an unexpressed emotional state." },
  },
  {
    id: "04", title: "Presence over persuasion",
    originalPrinciple: "Design should not pressure users into action. It should make users feel understood, oriented, and in control.",
    belief: "Being present to a person's goal matters more than compelling the next click.",
    designResponsibility: "Orient before requesting action. Favor truthful context and invitational language over urgency or conversion pressure.",
    preservedAgency: "The person retains control of when, whether, and how to proceed.",
    illustration: { context: "ILLUSTRATIVE · ONBOARDING", heading: "Here is what you can explore", behavior: "An onboarding panel explains available paths and includes 'Explore later' instead of a forced activation sequence.", note: "Presence is observable in choice architecture, not in simulated intimacy." },
  },
  {
    id: "05", title: "Design reveals belief",
    originalPrinciple: "Every layout, label, and flow expresses what you believe about people. If the design assumes users are careless, impatient, or easy to trick—users will feel that.",
    belief: "Design patterns expose implicit assumptions about the person's competence, intent, and capacity to choose.",
    designResponsibility: "Review defaults, labels, timing, and constraints for hidden assumptions; let the interface communicate respect through behavior.",
    preservedAgency: "The person is treated as capable of evaluating information and directing their own actions.",
    illustration: { context: "ILLUSTRATIVE · ACCOUNT SETTINGS", heading: "You choose how this works", behavior: "Privacy settings explain each option without preselecting expanded data sharing.", note: "Defaults reveal priorities; inspect what those defaults assume." },
  },
  {
    id: "06", title: "Technology should amplify choice, not override it",
    originalPrinciple: "Systems should expand agency with clear options, trade-offs, and control—not force outcomes through defaults, friction, or hidden constraints.",
    belief: "System capability is valuable when it enlarges the person's practical choice, not when it displaces it.",
    designResponsibility: "Make trade-offs, reversibility, controls, and the boundary of automation visible before consequential action.",
    preservedAgency: "The person can compare, override, revise, and decline automated recommendations.",
    illustration: { context: "ILLUSTRATIVE · AI ASSISTANT", heading: "Suggested change — review before applying", behavior: "A proposed action exposes its effects and offers Edit, Apply, and Cancel without quietly executing.", note: "Recommendation is not delegated authority." },
  },
  {
    id: "07", title: "We’re not just building products—we’re building interactions people remember",
    originalPrinciple: "Even “simple” flows leave a residue. Trust is shaped by whether users feel respected, rushed, dismissed, or supported.",
    belief: "The experience of an interaction can outlast the immediate task outcome.",
    designResponsibility: "Consider recovery, completion, timing, and the way the system treats people when they struggle or leave.",
    preservedAgency: "The person can end the interaction with clarity, continuity, and respect for their effort.",
    illustration: { context: "ILLUSTRATIVE · FORM EXIT", heading: "Your draft is available", behavior: "Leaving an unfinished form produces an understandable save-or-delete choice and a reliable return path.", note: "Continuity is a design commitment, not a claim about remembered emotions." },
  },
  {
    id: "08", title: "Integrity holds it together",
    originalPrinciple: "Without boundaries, transparency, and care, even good design becomes unsafe. Integrity means the system does what it claims—and doesn’t overreach.",
    belief: "Trustworthy systems must align their stated values with their actual mechanics and boundaries.",
    designResponsibility: "Audit whether permissions, explanations, defaults, and exits match what the experience promises.",
    preservedAgency: "The person can rely on visible limits, accurate claims, and meaningful consent.",
    illustration: { context: "ILLUSTRATIVE · PRIVACY", heading: "Private by default", behavior: "Data-sharing settings start in the state promised by the product, with clear, equivalent paths to opt in or remain private.", note: "A privacy claim is not evidence of privacy; behavior must support it." },
  },
  {
    id: "09", title: "Interpretation is part of design",
    originalPrinciple: "Systems don’t just present information—they shape how it is understood. If a system provides data, recommendations, or outputs, it is responsible for how those are framed, contextualized, and acted upon.",
    belief: "Presentation and context influence the meaning people derive from otherwise identical information.",
    designResponsibility: "Separate what was observed from what the system inferred, and identify limits relevant to a decision.",
    preservedAgency: "The person can distinguish facts from interpretations and challenge the system's account.",
    illustration: { context: "ILLUSTRATIVE · AI SUMMARY", heading: "Summary with sources and limitations", behavior: "A generated summary distinguishes source statements, interpretation, and missing context without overstating certainty.", note: "Clear formatting alone does not make an interpretation correct." },
  },
  {
    id: "10", title: "Decision framing shapes behavior",
    originalPrinciple: "The way choices are presented can change what users believe, trust, and do next. Design must make framing visible, especially when systems recommend, rank, summarize, or compare options. A system should not quietly steer decisions while pretending to simply present information.",
    belief: "The arrangement and labeling of alternatives affects the apparent meaning of a decision.",
    designResponsibility: "Expose recommendation criteria, underlying assumptions, and material alternatives, especially when one path is highlighted.",
    preservedAgency: "The person can understand the framing, inspect relevant trade-offs, and decide for themselves.",
    illustration: { context: "ILLUSTRATIVE · RECOMMENDATION", heading: "Recommended based on your stated priority", behavior: "A recommendation explains the selection criteria and provides a balanced comparison with other viable options.", note: "A visible recommendation is not a substitute for informed consent." },
  },
] as const;

export const FOUNDATION_PRINCIPLES_BY_ID: Readonly<Record<FoundationPrincipleId, FoundationPrinciple>> =
  Object.fromEntries(FOUNDATION_PRINCIPLES.map((principle) => [principle.id, principle])) as Record<FoundationPrincipleId, FoundationPrinciple>;

export const FOUNDATION_REFLECTION_QUESTIONS: readonly string[] = [
  "Are we honoring user awareness—or treating people like click targets?",
  "Are we designing for how it feels—not just how fast it completes?",
  "Is the user’s consent real—or are we nudging without permission?",
  "Does the design reflect a belief we’re proud to hold about people?",
  "Would a user say: “I feel respected, safe, and free to choose”?",
] as const;

/** Operational sequence shared with Failure Patterns; originally authored in Foundations as Name, Pause, Restore. */
export const FOUNDATION_REALIGNMENT: readonly { id: "pause" | "name" | "restore"; title: string; description: string }[] = [
  { id: "pause", title: "Pause", description: "Stop pushing forward. Re-observe what the user is experiencing." },
  { id: "name", title: "Name", description: "Identify what feels off and where trust may be breaking." },
  { id: "restore", title: "Restore", description: "Reconnect to the person's intent, choices, and ability to disengage." },
] as const;

export const FOUNDATION_SCOPE_NOTE =
  "Sovereign UX focuses on interface behavior, system behavior, and decision framing. It is not therapy, psychological diagnosis, financial advice, legal advice, or identity interpretation.";

export const FOUNDATION_PRACTICE_NOTE =
  "These principles describe commitments and interpretive responsibilities, not compliance stages or a score. The applied illustrations are constructed examples, not empirical findings.";

export const FOUNDATION_RETURN_TO_FUNDAMENTALS =
  "If the framework stops producing clarity, return to fundamentals: the user's ability to choose, the designer's responsibility, and respect for the person on the other side.";
