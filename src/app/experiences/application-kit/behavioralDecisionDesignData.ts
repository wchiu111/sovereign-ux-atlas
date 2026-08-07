export type BehavioralStageId =
  | "interpret"
  | "separate"
  | "frame"
  | "recommend"
  | "confirm"
  | "act";

export interface BehavioralStage {
  id: BehavioralStageId;
  number: string;
  title: string;
  summary: string;
  detail: string;
  prompts: string[];
  colorRole:
    | "agentic"
    | "purpose"
    | "strategy"
    | "judgment"
    | "risk"
    | "relational";
}

export const BEHAVIORAL_STAGES: BehavioralStage[] = [
  {
    id: "interpret",
    number: "01",
    title: "Interpret",
    summary: "Understand context before forming a response.",
    detail:
      "Make the system's read of the situation inspectable: what signals matter, what is missing, and what assumptions are being made.",
    prompts: [
      "What signals is the system using?",
      "What context may be missing?",
      "Which assumptions affect the outcome?",
    ],
    colorRole: "agentic",
  },
  {
    id: "separate",
    number: "02",
    title: "Separate",
    summary: "Keep information, interpretation, and recommendation distinct.",
    detail:
      "Prevent a system from presenting inference as fact or recommendation as inevitability. Users should be able to tell what is known, inferred, and suggested.",
    prompts: [
      "What is observable information?",
      "What has the system inferred?",
      "What is merely being recommended?",
    ],
    colorRole: "purpose",
  },
  {
    id: "frame",
    number: "03",
    title: "Frame",
    summary: "Expose options, trade-offs, assumptions, and consequences.",
    detail:
      "Decision framing changes what feels available. Show the criteria and alternatives that shape the recommendation instead of quietly narrowing the user's decision space.",
    prompts: [
      "What alternatives remain viable?",
      "Which trade-offs are being privileged?",
      "What would change the framing?",
    ],
    colorRole: "strategy",
  },
  {
    id: "recommend",
    number: "04",
    title: "Recommend",
    summary: "Offer a next step with proportional strength.",
    detail:
      "Recommendations should be identifiable as recommendations, calibrated to evidence, and accompanied by enough rationale for the user to challenge them.",
    prompts: [
      "How strong should the recommendation sound?",
      "What evidence supports it?",
      "When should the system remain neutral?",
    ],
    colorRole: "judgment",
  },
  {
    id: "confirm",
    number: "05",
    title: "Confirm",
    summary: "Return consequential choice to the human.",
    detail:
      "Before meaningful action, give users a clear opportunity to confirm, correct, reject, or revise the system's interpretation and proposed next step.",
    prompts: [
      "What requires explicit confirmation?",
      "Can the interpretation be corrected?",
      "Can the user reject the recommendation cleanly?",
    ],
    colorRole: "risk",
  },
  {
    id: "act",
    number: "06",
    title: "Act",
    summary: "Proceed only within confirmed authority and scope.",
    detail:
      "Action is the end of the behavioral sequence, not the starting assumption. The system should act only after authority, scope, and intent are sufficiently clear.",
    prompts: [
      "Has intent been confirmed?",
      "Is the action within system scope?",
      "Can the action be reversed or audited?",
    ],
    colorRole: "relational",
  },
];

export const PATTERNS = [
  ["Reflection Before Action", "Pause to interpret before responding", "AI response or automation"],
  ["Information / Interpretation / Recommendation", "Keep meaning visibly separated", "Recommendations and summaries"],
  ["Decision Framing", "Expose options, criteria, and trade-offs", "Complex or consequential choices"],
  ["Confidence Disclosure", "Calibrate certainty to evidence", "Predictions and recommendations"],
  ["Assumption Disclosure", "Reveal what the system is presuming", "Incomplete or ambiguous context"],
  ["Confirmation Loop", "Return consequential choice to the user", "Before action"],
  ["Correction Loop", "Allow interpretation and criteria to change", "When system inference may be wrong"],
  ["Tone Modulation", "Match response intensity to context", "Routine vs stressed states"],
] as const;

export const CHECKLIST = [
  "Can users distinguish facts from interpretation?",
  "Is the recommendation visibly a recommendation?",
  "Are assumptions exposed where they affect the outcome?",
  "Is uncertainty communicated proportionally?",
  "Can the user correct the system's interpretation?",
  "Can the recommendation be rejected without friction?",
  "Does the system seek confirmation before consequential action?",
  "Can the system decide not to recommend?",
];
