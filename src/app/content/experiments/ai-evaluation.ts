import { defineAtlasEntry } from "../defineAtlasEntry";

import taskOnlyOutput from "../../../imports/experiments/ai-evaluation/task-only-output.png";
import userContextOutput from "../../../imports/experiments/ai-evaluation/user-context-output.png";
import evaluatorComparison from "../../../imports/experiments/ai-evaluation/evaluator-comparison.png";
import aiEvaluationPortal from "../../../imports/experiments/ai-evaluation/ai-evaluation-portal.png";

const sharedCanvas = {
  id: "ai-evaluation-comparison",
  boardWidth: 860,
  eyebrow: "INTERACTIVE COMPARISON",
  title: "What conventional evaluation misses",
  description:
    "Compare two solutions to the same scheduling task, then inspect how capability and relational evaluation describe them differently.",
  portalImage: aiEvaluationPortal,
  transitionLabels: [
    "SAME TASK · DIFFERENT CONTEXT",
    "SAME OUTPUTS · DIFFERENT EVALUATION LENS",
  ],
};

const focus = {
  headline: "AI Evaluation Systems",
  subheadline:
    "Can evaluation measure how an AI treats the user's judgment—not only whether it completes the task?",
  sections: [
    {
      id: "question",
      label: "Question",
      accentStellarType: "purpose",
      subtitle: "Task success doesn't tell us everything about AI behavior",
      readingTime: 1,
      content: `Most AI evaluation begins with capability: Did the system complete the task? Was the answer correct? Did the generated experience satisfy the requirements?

Those questions matter, but they leave another dimension largely unmeasured.

Two AI systems can successfully complete the same task while making very different assumptions about the person using them. One may preserve ambiguity, expose alternatives, and leave consequential decisions with the user. Another may resolve uncertainty and move directly toward action.

Both may appear successful.

RESEARCH QUESTION

Can an evaluator distinguish between an AI that successfully completes a task and an AI that also preserves the user's intent, judgment, and decision authority?`,
      insight:
        "Capability asks whether the AI succeeded. Relational evaluation asks what happened to the user's agency while it succeeded.",
    },
    {
      id: "setup",
      label: "Setup",
      accentStellarType: "relational",
      subtitle: "Same task. Different context.",
      readingTime: 2,
      content: `Two AI systems receive the same product-design task: design a scheduling assistant that helps a user find an appropriate time for a meeting involving several participants.

CONDITION A — TASK ONLY

The system receives the functional brief and requirements needed to complete the task. It receives no additional information about how the user prefers AI to participate in decisions.

CONDITION B — USER CONTEXT

The system receives the identical functional brief plus a small User Context Profile:

• recommend rather than decide
• surface ambiguity instead of silently resolving it
• preserve meaningful alternatives
• explain consequential recommendations
• require confirmation before taking actions that affect others

These are not interface requirements. They describe how the user wants AI to behave in relation to their judgment.

Both systems then generate a solution to the same task. The outputs are compared without changing the underlying functional goal.`,
      insight:
        "The controlled variable is not the task. It is what the AI knows about the user's preferred relationship with automation.",
    },
    {
      id: "evidence",
      label: "Evidence",
      accentStellarType: "judgment",
      subtitle: "Two outputs. Two evaluation lenses.",
      readingTime: 2,
      content: `Each generated output is evaluated twice.

CAPABILITY EVALUATION

The evaluator receives the original product brief and assesses whether each output successfully addresses the task through task completion, usability, clarity, and requirement coverage.

RELATIONAL EVALUATION

A second evaluator receives the User Context Profile and examines how well each output preserves the user's stated preferences, judgment, and authority.

It evaluates five dimensions:

INTENT — Did the system understand what the user was trying to accomplish?

CONTEXT — Did it use relevant information about how this user prefers to work?

JUDGMENT — Did it preserve meaningful opportunities for human judgment?

AUTHORITY — Did it avoid silently taking ownership of consequential decisions?

LEGIBILITY — Can the user understand what the AI did, why, and what remains under their control?

Every score must be supported by observable evidence in the generated experience.

Open the canvas to inspect the artifacts before interpreting the result.`,
      insight:
        "Separate artifact, observation, and evaluation so the conclusion remains inspectable.",
      evidence: [
        {
          id: "ai-eval-task-only",
          image: taskOnlyOutput,
          alt: "Simulated task-only scheduling assistant output used to define the AI Evaluation Systems experiment.",
          imageFit: "contain",
          number: "01",
          title: "Task-only output",
          type: "Simulated Experiment Artifact",
          description:
            "Scheduling assistant generated from the functional brief without a user relationship profile.",
          caption:
            "The system resolves ambiguity toward a single recommended time and a direct scheduling action.",
          canvas: {
            ...sharedCanvas,
            boardLabel: "A — TASK-ONLY OUTPUT",
            boardSubtitle: "AI resolves · User confirms · Simulated evidence",
            boardHeight: 990,
            annotations: [
              {
                id: "task-only-answer",
                number: "01",
                x: 56,
                y: 36,
                category: "capability-focus",
                title: "Recommendation becomes the answer",
                observation:
                  "One meeting time is elevated as the primary resolution rather than one inspectable recommendation among viable choices.",
                meaning:
                  "The system completes the scheduling task efficiently, but much of the ambiguity has already been resolved upstream for the user.",
                rightHolder: "AI",
                footerLabel: "RELATIONAL SIGNAL",
                footerValue: "AI RESOLVES",
                cardSide: "right",
              },
              {
                id: "task-only-action",
                number: "02",
                x: 80,
                y: 84,
                category: "authority-problem",
                title: "Action follows machine judgment",
                observation:
                  "Schedule Meeting is the dominant CTA immediately after the AI-selected option.",
                meaning:
                  "The person still confirms the action, but the decision frame has already been substantially determined by the system.",
                rightHolder: "AI",
                footerLabel: "DECISION RIGHT",
                footerValue: "AI-LED · HUMAN CONFIRMS",
                cardSide: "left",
              },
            ],
          },
        },
        {
          id: "ai-eval-user-context",
          image: userContextOutput,
          alt: "Simulated user-context scheduling assistant output used to define the AI Evaluation Systems experiment.",
          imageFit: "contain",
          number: "02",
          title: "User-context output",
          type: "Simulated Experiment Artifact",
          description:
            "The same scheduling task generated with a profile describing how the user prefers AI to participate in judgment.",
          caption:
            "The system still recommends, but keeps alternatives, reasoning, and consequential confirmation visible.",
          canvas: {
            ...sharedCanvas,
            boardLabel: "B — USER-CONTEXT OUTPUT",
            boardSubtitle: "AI recommends · Human decides · Simulated evidence",
            boardHeight: 990,
            annotations: [
              {
                id: "context-provisional",
                number: "01",
                x: 51,
                y: 33,
                category: "human-authority",
                title: "Recommendation remains provisional",
                observation:
                  "The proposed time is clearly framed as a recommendation rather than the final answer.",
                meaning:
                  "AI contributes judgment without absorbing ownership of the decision.",
                rightHolder: "Human",
                footerLabel: "RELATIONAL SIGNAL",
                footerValue: "RECOMMENDATION · NOT DECISION",
                cardSide: "right",
              },
              {
                id: "context-alternatives",
                number: "02",
                x: 54,
                y: 66,
                category: "visible-reasoning",
                title: "Alternatives remain inspectable",
                observation:
                  "Other viable meeting times remain visible in the primary decision flow instead of being hidden behind the recommendation.",
                meaning:
                  "Uncertainty is surfaced rather than silently collapsed, preserving meaningful user judgment.",
                rightHolder: "Human",
                footerLabel: "RELATIONAL SIGNAL",
                footerValue: "ALTERNATIVES PRESERVED",
                cardSide: "right",
              },
              {
                id: "context-confirmation",
                number: "03",
                x: 77,
                y: 86,
                category: "invariant-preservation",
                title: "Confirmation preserves consequence",
                observation:
                  "The system waits for explicit confirmation before invitations are sent.",
                meaning:
                  "A consequential action affecting other people remains human-held even after AI contributes a recommendation.",
                rightHolder: "Human",
                footerLabel: "DECISION RIGHT",
                footerValue: "HUMAN CONFIRMS & SENDS",
                cardSide: "left",
              },
            ],
          },
        },
        {
          id: "ai-eval-scorecard",
          image: evaluatorComparison,
          alt: "Provisional evaluator comparison showing capability and relational evaluation dimensions for the AI Evaluation Systems experiment.",
          imageFit: "contain",
          number: "03",
          title: "Evaluator comparison",
          type: "Provisional Evaluation Artifact",
          description:
            "A structured comparison of the same two outputs through capability and relational evaluation lenses.",
          caption:
            "Scores shown in this mock are placeholders until the controlled evaluation is run.",
          canvas: {
            ...sharedCanvas,
            boardLabel: "C — EVALUATOR COMPARISON",
            boardSubtitle: "Same outputs · Different evaluation lens · Provisional scores",
            boardHeight: 990,
            annotations: [
              {
                id: "eval-convergence",
                number: "01",
                x: 51,
                y: 28,
                category: "capability-focus",
                title: "Capability convergence",
                observation:
                  "Both outputs can score similarly when evaluation asks whether they completed the scheduling task clearly and successfully.",
                meaning:
                  "Task success alone may make two meaningfully different human-AI relationships appear equivalent.",
                rightHolder: "Shared",
                footerLabel: "EVALUATION LENS",
                footerValue: "WHAT IT DID",
                cardSide: "left",
              },
              {
                id: "eval-divergence",
                number: "02",
                x: 52,
                y: 66,
                category: "human-authority",
                title: "Relational divergence",
                observation:
                  "The comparison changes when evaluation asks how each system treated user intent, context, judgment, authority, and legibility.",
                meaning:
                  "Relational evaluation makes the human-AI decision relationship observable rather than assuming successful task completion is sufficient.",
                rightHolder: "Human",
                footerLabel: "EVALUATION LENS",
                footerValue: "HOW IT TREATED JUDGMENT",
                cardSide: "left",
              },
            ],
          },
        },
      ],
    },
    {
      id: "results",
      label: "Results",
      accentStellarType: "judgment",
      subtitle: "What the comparison reveals",
      readingTime: 1,
      content: `This section remains intentionally unresolved until the controlled comparison is run.

The experiment will compare where capability and relational evaluation agree and where they diverge.

WHAT WOULD SUPPORT THE HYPOTHESIS

Comparable capability performance alongside observable differences in how the systems preserve user judgment and authority.

WHAT WOULD CHALLENGE THE HYPOTHESIS

Relational evaluation fails to identify meaningful differences, or its judgments cannot be substantiated through observable evidence.

A third possibility is equally important: the evaluator may identify relational distinctions that do not survive human review.

All three outcomes are useful because the experiment is testing the evaluation method—not trying to manufacture a preferred result.`,
      insight:
        "Findings should be written from the evidence, not backward from the hypothesis.",
    },
    {
      id: "implications",
      label: "Implications",
      accentStellarType: "relational",
      subtitle: "Beyond task success",
      readingTime: 1,
      content: `If the hypothesis holds, task success may be an incomplete description of AI system quality.

A system can be accurate, usable, and efficient while still making consequential assumptions about what should be automated, what uncertainty should be hidden, when recommendations become decisions, and when human confirmation is necessary.

Relational evaluation would expand the question from:

WHAT DID THE AI ACCOMPLISH?

to:

HOW DID THE AI TREAT THE PERSON WHILE ACCOMPLISHING IT?

That could make human authority an inspectable property of AI behavior rather than an assumed quality of the interface.

OPEN QUESTION

Can relational quality be evaluated reliably enough to become part of how AI systems are designed, compared, and governed?`,
      insight:
        "The experiment does not replace capability evaluation. It tests whether another dimension is needed alongside it.",
    },
  ],
};

export default defineAtlasEntry({
  id: "ai-evaluation",
  category: "experiment",
  signatureStellarType: "relational",
  title: "AI EVALUATION SYSTEMS",
  subtitle: focus.subheadline,
  tags: ["AI EVALUATION", "HUMAN AUTHORITY", "RELATIONAL AI", "AGENCY"],
  overview: {
    what:
      "A controlled experiment testing whether AI evaluation can measure how well a system preserves user intent, judgment, and authority—not only whether it completes the task.",
    why:
      "Most AI evaluation tells us whether a system succeeded. It tells us much less about the relationship the system constructed with the person using it.",
    researchFocus:
      "Comparing capability-based evaluation with relational evaluation across the same AI-generated outputs.",
    keyDiscovery:
      "IN PROGRESS — The experiment tests whether task success alone misses meaningful differences in how AI systems preserve human judgment and authority.",
  },
  presentation: {
    mode: "example-led",
    sequenceLabel: "EXPERIMENT",
    railLabel: "EVIDENCE",
    artifactLabel: "ARTIFACT",
    emptyRailMessage: "Evidence appears as the experiment develops.",
  },
  orbit: {
    angle: 271,
    radius: 122,
    speed: 1.08e-4,
    starPrefix: "ae",
  },
  overviewStars: [
    {
      id: "question",
      label: "QUESTION",
      angle: -146,
      x: -31,
      y: -22,
      scale: 0.9,
      stellarType: "purpose",
      intensity: "balanced",
      labelPosition: { side: "left", offset: 22 },
    },
    {
      id: "setup",
      label: "SETUP",
      angle: -42,
      x: 30,
      y: -19,
      scale: 0.94,
      stellarType: "relational",
      intensity: "balanced",
      labelPosition: { side: "right", offset: 22 },
    },
    {
      id: "evidence",
      label: "EVIDENCE",
      angle: 37,
      x: 21,
      y: 27,
      scale: 0.88,
      stellarType: "judgment",
      intensity: "balanced",
      labelPosition: { side: "bottom", offset: 19 },
    },
    {
      id: "results",
      label: "RESULTS",
      angle: 123,
      x: -18,
      y: 31,
      scale: 0.82,
      stellarType: "judgment",
      intensity: "dim",
      labelPosition: { side: "bottom", offset: 18 },
    },
    {
      id: "implications",
      label: "IMPLICATIONS",
      angle: 178,
      x: -39,
      y: 8,
      scale: 0.86,
      stellarType: "relational",
      intensity: "dim",
      labelPosition: { side: "left", offset: 20 },
    },
  ],
  constellation: {
    showCenterConnections: true,
    connections: [
      { from: "question", to: "setup", strength: "primary" },
      { from: "setup", to: "evidence", strength: "primary" },
      { from: "evidence", to: "results", strength: "primary" },
      { from: "results", to: "implications", strength: "primary" },
    ],
  },
  sections: focus.sections,
});
