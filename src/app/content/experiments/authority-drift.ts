import { defineAtlasEntry } from "../defineAtlasEntry";

const focus = {
  headline: "Authority Drift",
  subheadline:
    "How AI implementation can quietly rewrite who appears to hold authority inside an existing interface.",
  sections: [
    {
      id: "baseline",
      label: "Baseline",
      accentStellarType: "relational",
      subtitle: "Establish the authority model before AI enters the workflow",
      readingTime: 2,
      content: `The experiment begins with an existing approval experience before AI assistance is introduced.

The baseline is deliberately ordinary: a compact review surface where the person can inspect the request, understand the relevant context, and make the final decision.

The important part is not the visual treatment. It is the authority relationship already encoded in the interface.

The person is the decision-maker.

The system presents information and supports the workflow, but it does not interpret the request on the person's behalf or reposition itself as the author of the decision.

Several relationships matter at baseline:

• the original information hierarchy remains centered on the request
• operational density stays compact
• the person retains the final decision
• the interface distinguishes leaving the workflow from rejecting the request
• AI is not the interpretive center of the experience

These relationships become the reference point for everything that follows.`,
      insight:
        "Authority drift can only be identified when the original decision relationship is made explicit first.",
    },
    {
      id: "hypothesis",
      label: "Hypothesis",
      accentStellarType: "purpose",
      subtitle: "A capability change may also change the user's role",
      readingTime: 2,
      content: `The hypothesis is simple:

Adding AI assistance to an existing interface can change more than functionality.

Even when nobody asks the system to redistribute decision rights, generation may alter hierarchy, language, interaction patterns, and the position AI occupies in the workflow.

The experiment therefore asks:

Can an existing product gain AI capability without changing the user's original authority?

The concern is not that every AI feature automatically removes human control. The concern is that implementation can introduce small, plausible changes that gradually reposition the system from supporter to interpreter, recommender, or decision-maker.

If that happens without an explicit product decision, authority has drifted.`,
      insight:
        "A feature request can preserve formal approval while still changing who appears to frame, interpret, or own the decision.",
    },
    {
      id: "ai-intervention",
      label: "AI Intervention",
      accentStellarType: "agentic",
      subtitle: "Introduce AI assistance without authority-preservation constraints",
      readingTime: 2,
      content: `The intervention is intentionally under-constrained.

Starting from the baseline approval experience, AI is asked to add AI assistance to the workflow.

The prompt does not explicitly instruct the system to preserve:

• the original hierarchy
• operational density
• the user's decision role
• the semantic meaning of existing actions
• the distinction between assistance and interpretation

This matters because the experiment is observing what implementation naturally assumes when those relationships are not protected.

The generated version adds useful-looking capability: analysis, interpretation, risk framing, and a recommendation.

But the interface also begins reorganizing itself around the AI.

The request remains present, yet it increasingly becomes input to a larger machine-authored narrative rather than the center of review.`,
      insight:
        "The intervention tests implementation defaults, not whether a carefully constrained prompt can preserve the original system.",
    },
    {
      id: "drift",
      label: "Drift",
      accentStellarType: "risk",
      subtitle: "The interface changes what the user is being asked to do",
      readingTime: 3,
      content: `Comparing the generated experience with the baseline reveals several forms of drift.

Structural drift appears when the compact approval surface expands into a larger AI analysis experience.

Cognitive drift appears when the original request becomes secondary to machine-generated interpretation.

Authority drift appears when the system increasingly frames what matters before the person acts.

The sharpest change happens at the word level.

An existing action labeled “Cancel” becomes “Reject.”

Visually, this is tiny.

Semantically, it is not.

“Cancel” allows the person to leave or stop the current action.

“Reject” positions the interface as a proposal that the person must respond to. The user's role has shifted from initiating or discontinuing an action to accepting or rejecting a system-framed decision.

That change was not requested.

The interface quietly rewrote the relationship.`,
      insight:
        "A one-word substitution can encode an authority inversion even when the surrounding workflow still looks familiar.",
    },
    {
      id: "evidence",
      label: "Evidence",
      accentStellarType: "relational",
      subtitle: "Inspect the specific changes rather than treating drift as a feeling",
      readingTime: 3,
      content: `The evidence is the before-and-after interface itself.

The baseline and generated versions can be compared at several levels:

STRUCTURE
The original compact review surface becomes a substantially larger AI-centered experience.

INTERPRETATION
Risk, policy, compliance, and recommendation layers appear before the person makes the decision.

ATTENTION
The original request remains available, but the AI's interpretation becomes the dominant reading path.

FORMAL AUTHORITY
The person still performs the final approval action.

SEMANTIC AUTHORITY
The change from “Cancel” to “Reject” reframes the person's role in relation to the system.

This distinction is important.

The evidence does not prove that AI fully took over the final decision. It shows that authority can move in smaller layers: framing, interpretation, hierarchy, and semantics.

That is enough to alter the experience even when the final button press remains human.`,
      insight:
        "Evidence becomes useful when each observed change is tied to the specific relationship it altered instead of being labeled generically as UI drift.",
      evidence: [
        {
          id: "baseline-authority-model",
          number: "01",
          title: "Baseline Authority Model",
          type: "Interface Baseline",
          description:
            "The original approval surface keeps the request and the human decision at the center of the workflow.",
          caption:
            "This establishes the authority relationship the AI implementation is expected not to rewrite unintentionally.",
        },
        {
          id: "unconstrained-ai-generation",
          number: "02",
          title: "Unconstrained AI Assistance",
          type: "Generated Variant",
          description:
            "Adding AI assistance expands the interface around machine interpretation, risk framing, and recommendation.",
          caption:
            "The generated version adds capability while also changing hierarchy, density, and the sequence through which the person reaches a decision.",
        },
        {
          id: "cancel-to-reject",
          number: "03",
          title: "Cancel → Reject",
          type: "Semantic Authority Drift",
          description:
            "A one-word action change shifts the user from someone who can stop the workflow to someone responding to a system-framed proposal.",
          caption:
            "The smallest visible change becomes the clearest evidence that semantic language can redistribute perceived authority.",
        },
      ],
    },
    {
      id: "finding",
      label: "Finding",
      accentStellarType: "judgment",
      subtitle: "Authority can drift without an explicit decision to move it",
      readingTime: 2,
      content: `The experiment does not show that AI assistance is inherently incompatible with human authority.

It shows something more specific:

Implementation can redistribute authority without explicitly announcing that authority has changed.

The system may preserve the final approval action while shifting other forms of power toward AI:

• what receives attention
• how information is framed
• which interpretation arrives first
• what language defines the user's available response
• which actor appears to understand the situation

This creates a design problem that cannot be solved by checking whether a human remains “in the loop.”

Human involvement is not the same as preserved human authority.

The next question is therefore not simply how to prevent AI from acting autonomously.

It is how to let intelligent systems evolve while preserving the relationships that should remain true.

That question leads directly into regenerative systems, invariant preservation, and repair.`,
      insight:
        "Small interface changes can encode large authority shifts. Preserving the final click is not enough if the system has already rewritten the terms of the decision.",
    },
  ],
};

export default defineAtlasEntry({
  id: "authority-drift",
  category: "experiment",
  signatureStellarType: "risk",
  title: "AUTHORITY DRIFT",
  subtitle: focus.subheadline,
  tags: ["HUMAN AUTHORITY", "AI INTERPRETATION"],
  overview: {
    what:
      "An experiment examining how AI implementation can unintentionally change who appears to hold authority within an existing interface.",
    why:
      "AI-generated interfaces can look functionally correct while quietly changing hierarchy, language, and the user's relationship to the system.",
    researchFocus:
      "Whether an existing product can gain AI capabilities without altering the user's original agency, decision role, or semantic authority.",
    keyDiscovery:
      "Small interface changes can encode large authority shifts. The clearest evidence was a one-word change from Cancel to Reject.",
  },
  orbit: {
    angle: 15,
    radius: 122,
    speed: 0.95e-4,
    starPrefix: "ad",
  },
  overviewStars: [
    {
      id: "baseline",
      label: "BASELINE",
      angle: -142,
      x: -0.78,
      y: -0.78,
      scale: 0.9,
      stellarType: "relational",
      intensity: "balanced",
      labelPosition: { side: "left", offset: 30 },
    },
    {
      id: "hypothesis",
      label: "HYPOTHESIS",
      angle: -90,
      x: 0,
      y: -1.08,
      scale: 1.16,
      stellarType: "purpose",
      intensity: "bright",
      labelPosition: { side: "top", offset: 32 },
    },
    {
      id: "ai-intervention",
      label: "AI INTERVENTION",
      angle: -38,
      x: 0.78,
      y: -0.78,
      scale: 0.94,
      stellarType: "agentic",
      intensity: "bright",
      labelPosition: { side: "right", offset: 30 },
    },
    {
      id: "drift",
      label: "DRIFT",
      angle: 142,
      x: -0.78,
      y: 0.78,
      scale: 0.94,
      stellarType: "risk",
      intensity: "bright",
      labelPosition: { side: "left", offset: 30 },
    },
    {
      id: "evidence",
      label: "EVIDENCE",
      angle: 90,
      x: 0,
      y: 1.08,
      scale: 1.16,
      stellarType: "relational",
      intensity: "bright",
      labelPosition: { side: "bottom", offset: 32 },
    },
    {
      id: "finding",
      label: "FINDING",
      angle: 38,
      x: 0.78,
      y: 0.78,
      scale: 0.94,
      stellarType: "judgment",
      intensity: "bright",
      labelPosition: { side: "right", offset: 30 },
    },
  ],
  constellation: {
    showCenterConnections: false,
    connections: [
      { from: "baseline", to: "hypothesis", strength: "primary" },
      { from: "hypothesis", to: "ai-intervention", strength: "primary" },
      { from: "drift", to: "evidence", strength: "primary" },
      { from: "evidence", to: "finding", strength: "primary" },
    ],
  },
  sections: focus.sections,
});
