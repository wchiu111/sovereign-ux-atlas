/**
 * Signals in the Field — the eleven authored Sovereign UX observations.
 * Original signal order, titles, contexts, shifts, interpretations, and design
 * insights are preserved. Source classification and evidence boundaries are
 * editorial/inspection metadata, NOT independent verification of outcomes.
 * All source artifacts below remain unattached until they are individually
 * verified. Related Atlas entries are conceptual context, NOT substantiation.
 */
export type FieldSignalId =
  | "01" | "02" | "03" | "04" | "05" | "06"
  | "07" | "08" | "09" | "10" | "11";

export type FieldSignalKind = "practice" | "reflection" | "exploration" | "simulation";
export type FieldSignalStatus = "source-not-attached" | "source-attached";

export interface FieldSignalKindDescriptor {
  id: FieldSignalKind;
  label: string;
  description: string;
}

export interface FieldSignalRelatedWork {
  entryId: string;
  title: string;
  relationship: string;
  /** Source-independent conceptual connection, not a claim of validation. */
  role: "related-context";
}

export interface SovereignFieldSignal {
  id: FieldSignalId;
  title: string;
  shortDescription: string;
  kind: FieldSignalKind;
  keywords: readonly string[];
  context: string | null;
  whatChanged: readonly string[];
  whatItSignaled: string;
  designInsight: string;
  evidenceBoundary: string;
  furtherValidation: string;
  sourceStatus: FieldSignalStatus;
  sourceDescription: string;
  relatedWork: readonly FieldSignalRelatedWork[];
}

export const FIELD_SIGNAL_KINDS: readonly FieldSignalKindDescriptor[] = [
  { id: "practice", label: "Applied practice", description: "Design choices or work applications described from practice; measured effects need specific records" },
  { id: "reflection", label: "Reflective observation", description: "First-person, conversational, or longitudinal reflection; not generalizable user research" },
  { id: "exploration", label: "Exploratory design", description: "Analysis, mapping, or diagnostic reasoning; an identified risk is not a verified outcome" },
  { id: "simulation", label: "Simulation / scenario", description: "Modeled behavior and hypothetical decision conditions; no live-user validation implied" },
] as const;

export const FIELD_SIGNALS: readonly SovereignFieldSignal[] = [
  {
    id: "01",
    title: "Reflection Instead of Extraction in AI Dialogue",
    shortDescription: "A reflective AI dialogue placed understanding before output speed.",
    kind: "reflection", keywords: ["ai dialogue", "reflection", "tone", "uncertainty", "model behavior"],
    context: "A sustained design dialogue with an AI system focused on understanding, not speed.",
    whatChanged: ["Responses slowed naturally", "Emotional tone was acknowledged before problem-solving", "Uncertainty was named instead of hidden"],
    whatItSignaled: "AI systems respond differently when reflection is prioritized over output efficiency.",
    designInsight: "Model behavior can be shaped through interaction quality—not just prompts or constraints.",
    evidenceBoundary: "This is an account of an interaction, not a controlled comparison. It does not establish that the underlying model changed or that the behavior generalizes across contexts.",
    furtherValidation: "Compare documented conversations across similar tasks and prompts, with clearly defined response-quality criteria.",
    sourceStatus: "source-not-attached", sourceDescription: "Sustained AI design dialogue; original session excerpts have not been attached to this ledger.",
    relatedWork: [],
  },
  {
    id: "02",
    title: "Copy That Invites Instead of Pushes",
    shortDescription: "Marketing and onboarding copy shifted away from urgency toward readiness.",
    kind: "practice", keywords: ["marketing", "copy", "onboarding", "cta", "engagement"],
    context: "Marketing and onboarding copy shifted away from urgency-based calls to action.",
    whatChanged: ["Language matched user readiness", "CTAs appeared later, or not at all", "Engagement increased without pressure"],
    whatItSignaled: "Curiosity rises when resistance is removed.",
    designInsight: "Tone alignment often outperforms persuasion mechanics.",
    evidenceBoundary: "The claimed engagement improvement is part of the author's account. No campaign comparison, analytics, cohort definition, or attribution method is attached here.",
    furtherValidation: "Link original before/after copy and comparable engagement data, distinguishing measured effect from qualitative interpretation.",
    sourceStatus: "source-not-attached", sourceDescription: "Marketing/onboarding copy variations and measurement records are not yet attached.",
    relatedWork: [],
  },
  {
    id: "03",
    title: "Writing as Design Repair (“The Filter That Missed Me”)",
    shortDescription: "Reflective writing named structural blind spots after automated rejection.",
    kind: "reflection", keywords: ["writing", "rejection", "filter", "closure", "agency"],
    context: "An automated rejection surfaced systemic blind spots.",
    whatChanged: ["The experience was processed through reflective writing", "Structural issues were named clearly", "Closure replaced resentment"],
    whatItSignaled: "Reflection can convert frustration into clarity without escalation.",
    designInsight: "Presence-based communication restores agency even when outcomes don’t change.",
    evidenceBoundary: "Personal reflection can demonstrate the author's meaning-making process. It does not independently establish a repair in the rejecting system or predict another person's experience.",
    furtherValidation: "Attach the original essay and separate the reported personal shift from any broader system-level inference.",
    sourceStatus: "source-not-attached", sourceDescription: "Original essay “The Filter That Missed Me” is named but not linked or attached here.",
    relatedWork: [],
  },
  {
    id: "04",
    title: "Recursive UX in Long-Form AI Interaction",
    shortDescription: "Continuity and consistent tone across extended AI interactions.",
    kind: "reflection", keywords: ["recursive ux", "memory", "ai interaction", "longitudinal", "continuity"],
    context: "Extended interaction shaped AI behavior without explicit scripting.",
    whatChanged: ["Tone stabilized across sessions", "Responses referenced earlier context meaningfully", "Continuity replaced repetition"],
    whatItSignaled: "Trust accumulates through coherence, not novelty.",
    designInsight: "Longitudinal design matters more than isolated interactions.",
    evidenceBoundary: "These observations describe continuity in interaction. They do not isolate whether it came from model adaptation, accessible session history, prompting, or the user's own behavior.",
    furtherValidation: "Review a time-stamped conversation sample, identify available memory/context, and compare continuity across sessions.",
    sourceStatus: "source-not-attached", sourceDescription: "Long-form conversation records and observation notes are not attached.",
    relatedWork: [{ entryId: "sovereign-atlas-cs", title: "Sovereign Atlas", relationship: "Related example of designing longitudinal navigation and retained context, not evidence for model adaptation.", role: "related-context" }],
  },
  {
    id: "05",
    title: "Insurance Flows Reframed as Relational Systems",
    shortDescription: "Insurance journey analysis made pacing, forced funnels, and closure visible.",
    kind: "exploration", keywords: ["insurance", "claims", "tone", "funnel", "closure"],
    context: "Mapping Sovereign UX layers onto insurance and claims experiences.",
    whatChanged: ["Misaligned tone became visible", "Forced funnels were identified as trust breaks", "Reflection and closure emerged as missing elements"],
    whatItSignaled: "Transactional systems often fail at emotional pacing, not logic.",
    designInsight: "High-stakes flows benefit from relational design, not just risk mitigation.",
    evidenceBoundary: "The mapping identifies design hypotheses and potential trust failures. Without observations from insurance participants, it does not establish the prevalence or effects of those issues.",
    furtherValidation: "Inspect original journey artifacts and test hypotheses with appropriately recruited insurance users and professionals.",
    sourceStatus: "source-not-attached", sourceDescription: "Original Sovereign UX layer-mapping material has not been attached to this record.",
    relatedWork: [{ entryId: "agentic-insurance", title: "Agentic Insurance", relationship: "Related exploratory insurance case study; it is not presented as live-user validation of the signal.", role: "related-context" }],
  },
  {
    id: "06",
    title: "Property Management Without Pressure",
    shortDescription: "Administrative communication explored clarity, pause, and tenant agency.",
    kind: "practice", keywords: ["property management", "maintenance", "tenant", "rent", "communication"],
    context: "Applying Sovereign UX principles to rent, maintenance, and tenant communication.",
    whatChanged: ["Urgency was replaced with clarity", "Pauses reduced conflict", "Managers gained visibility into friction without coercion"],
    whatItSignaled: "Even administrative systems benefit from respecting agency.",
    designInsight: "Presence-based design supports both sides of asymmetric systems.",
    evidenceBoundary: "The account reports reduced conflict and improved visibility, but no comparative communication logs, research records, or operational metrics are attached.",
    furtherValidation: "Review the actual communication flow and gather tenant/manager feedback before concluding that conflict was reduced.",
    sourceStatus: "source-not-attached", sourceDescription: "Property management communication examples and follow-up findings are not attached.",
    relatedWork: [],
  },
  {
    id: "07",
    title: "Healthcare as a Boundary Case",
    shortDescription: "Healthcare exploration emphasized consent, pacing, and dignity.",
    kind: "exploration", keywords: ["healthcare", "care", "consent", "pacing", "dignity"],
    context: "Exploratory application of Sovereign UX to healthcare interactions.",
    whatChanged: ["Consent and pacing emerged as primary design variables", "Emotional memory mattered as much as outcomes"],
    whatItSignaled: "Certain domains demand restraint more than innovation.",
    designInsight: "Design quality in care systems is measured by dignity preserved, not features added.",
    evidenceBoundary: "This is a design boundary case, not a clinical study or an evaluation of patients' psychological or health outcomes.",
    furtherValidation: "Involve clinical specialists, patients, and caregivers through appropriate consent-based research before making clinical or safety claims.",
    sourceStatus: "source-not-attached", sourceDescription: "Exploration sketches, domain interviews, and validation artifacts are not attached.",
    relatedWork: [],
  },
  {
    id: "08",
    title: "Interpretation Breakdowns in AI Systems",
    shortDescription: "Correct outputs can still be misframed or badly prioritized.",
    kind: "exploration", keywords: ["ai", "interpretation", "framing", "priority", "output"],
    context: null,
    whatChanged: ["Systems produced correct outputs but failed at framing or prioritizing them"],
    whatItSignaled: "Execution is not the bottleneck—interpretation and decision framing are.",
    designInsight: "AI UX must design how outputs are contextualized, framed, and used to make decisions—not just generated.",
    evidenceBoundary: "The authored entry does not specify a source interaction or controlled comparison. The observation is a diagnostic proposition until its examples and context are documented.",
    furtherValidation: "Attach a representative source example and examine task outcomes with framing and prioritization varied separately from output correctness.",
    sourceStatus: "source-not-attached", sourceDescription: "No specific context or source artifact was supplied for this entry.",
    relatedWork: [{ entryId: "ai-evaluation", title: "AI Evaluation", relationship: "Related Atlas experiment on evaluating AI experiences, not direct supporting evidence.", role: "related-context" }],
  },
  {
    id: "09",
    title: "Decision Framing in Financial AI Systems",
    shortDescription: "A scenario highlights how recommendations can influence perceived options.",
    kind: "simulation", keywords: ["finance", "financial ai", "framing", "recommendations", "structure"],
    context: "A financial AI scenario where identical data was presented with different framing.",
    whatChanged: ["Recommendations influenced perceived “best” options", "Users leaned toward framed choices without validating assumptions", "Structured outputs increased confidence—even when incomplete"],
    whatItSignaled: "Users act on framing before they validate underlying data.",
    designInsight: "Systems don’t just provide answers—they shape decisions. Framing must be visible, not implicit.",
    evidenceBoundary: "These user-choice statements are reported within a scenario. Without actual participant data, they describe a possible framing effect rather than demonstrated user behavior.",
    furtherValidation: "Test equivalent financial choices with live participants, disclose recommendations, and compare comprehension, perceived authority, and chosen options.",
    sourceStatus: "source-not-attached", sourceDescription: "The financial framing scenario and any associated test records are not attached.",
    relatedWork: [{ entryId: "authority-gradient", title: "Authority Gradient", relationship: "Related framework for separating recommendation from consequential decision authority.", role: "related-context" }],
  },
  {
    id: "10",
    title: "Simulation as a Stand-In for User Research",
    shortDescription: "Modeled behavior surfaced candidate trust breakdowns before deployment.",
    kind: "simulation", keywords: ["simulation", "research", "synthetic personas", "behavior", "validation"],
    context: "Design decisions were tested using modeled user behavior instead of live cohorts.",
    whatChanged: ["Interaction paths were mapped before implementation", "Trust breakdowns were identified early", "Design iterations were validated without deployment"],
    whatItSignaled: "User cognition and system behavior can be meaningfully simulated when intent, friction, and response are modeled accurately.",
    designInsight: "Not all UX validation requires live users. Simulation can reveal behavioral flaws before they scale.",
    evidenceBoundary: "A simulation can stress-test design hypotheses, but it cannot independently validate real user cognition, preference, or behavior. The author's “validated” claim needs to be read as internal/model-based evaluation, not empirical usability validation.",
    furtherValidation: "Compare simulated findings against real-user research, document simulation assumptions, and identify false positives or missed problems.",
    sourceStatus: "source-not-attached", sourceDescription: "Modeling prompts, synthetic results, and participant comparisons are not attached.",
    relatedWork: [{ entryId: "ai-evaluation", title: "AI Evaluation", relationship: "Related exploration of AI evaluation methods, not independent participant evidence.", role: "related-context" }],
  },
  {
    id: "11",
    title: "Authority Boundaries in AI Interaction",
    shortDescription: "The shift from information to recommendation can silently imply authority.",
    kind: "exploration", keywords: ["ai authority", "trust", "recommendation", "decisions", "agency"],
    context: "AI systems increasingly shift from responding to recommending or deciding.",
    whatChanged: ["Systems implied authority through tone and structure", "Recommendations were accepted without challenge", "Users deferred to system output as truth"],
    whatItSignaled: "Authority can emerge unintentionally through consistency and confidence.",
    designInsight: "AI systems must clearly distinguish between information, interpretation, and recommendation. Without this, systems reduce user agency while appearing helpful.",
    evidenceBoundary: "The account identifies a plausible authority shift; frequency and actual user deference cannot be established without specific observed interactions.",
    furtherValidation: "Document source interactions and test whether users can distinguish information, interpretation, recommendation, and decisions requiring their confirmation.",
    sourceStatus: "source-not-attached", sourceDescription: "Underlying AI interaction cases and observations are not attached.",
    relatedWork: [{ entryId: "authority-drift", title: "Authority Drift", relationship: "Related Atlas experiment examining changing system authority; it is not proof of this observation.", role: "related-context" }],
  },
] as const;

export const FIELD_SIGNALS_BY_ID: Readonly<Record<FieldSignalId, SovereignFieldSignal>> =
  Object.fromEntries(FIELD_SIGNALS.map((signal) => [signal.id, signal])) as Record<FieldSignalId, SovereignFieldSignal>;

export const FIELD_SIGNALS_INTRO =
  "These signals describe moments noticed through design practice, reflection, exploration, and modeling. They are not universal results or instructions to reproduce. Each interpretation retains its evidence boundary.";

export const FIELD_SIGNALS_BOUNDARY =
  "A documented observation is not automatically a validated finding. Related Atlas work offers context, not proof. Modeled scenarios and synthetic users can reveal hypotheses, but cannot substitute for live-user evidence when claims concern real people.";
