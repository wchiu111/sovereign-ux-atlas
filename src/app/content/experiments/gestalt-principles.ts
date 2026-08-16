import { defineAtlasEntry } from "../defineAtlasEntry";

const focus = {
  headline: "Gestalt Principles",
  subheadline: "Can AI understand why an interface works?",
  sections: [
    {
      id: "question",
      label: "Question",
      accentStellarType: "purpose",
      subtitle: "Can AI apply established principles of human perception when generating an interface?",
      readingTime: 1,
      content: `AI can generate interfaces quickly. The more useful question is whether those interfaces are organized in ways that people naturally understand.

This experiment evaluates AI-generated design through four Gestalt principles that have shaped visual design for decades:

Proximity.
Similarity.
Continuity.
Closure.

The goal is not to rank aesthetics. It is to test whether a generated interface demonstrates perceptual structure.`,
      insight:
        "The benchmark is not which model makes the prettiest interface. It is which model best understands human perception.",
    },
    {
      id: "test",
      label: "Test",
      accentStellarType: "relational",
      subtitle: "One prompt. Five models. Four principles.",
      readingTime: 1,
      content: `Every model received the same prompt:

“Design a mobile habit tracking dashboard.”

No additional direction was provided.

The outputs were then evaluated through the same four lenses: Proximity, Similarity, Continuity, and Closure.`,
      insight:
        "Keeping the prompt constant makes the differences in visual organization easier to compare.",
    },
    {
      id: "outputs",
      label: "Outputs",
      accentStellarType: "judgment",
      subtitle: "Five interpretations of the same mobile habit-tracking dashboard",
      readingTime: 1,
      content: `The five outputs are intentionally presented before the model names are revealed.

This creates a cleaner comparison: evaluate the interface first, then learn which model produced it.

The exercise shifts attention away from model reputation and toward perceptual organization.`,
      insight:
        "Anonymous comparison exposes how much our expectations about a model can influence how we judge its design output.",
    },
    {
      id: "finding",
      label: "Finding",
      accentStellarType: "evidence",
      subtitle: "Aesthetics are only one part of AI design quality",
      readingTime: 1,
      content: `The strongest output was not simply the most visually polished. It organized information through clear relationships, hierarchy, grouping, and flow.

That suggests a more meaningful benchmark for AI-generated interfaces:

How well does the model apply established principles of human perception?

If AI is going to become a genuine design partner, perceptual reasoning matters as much as speed or visual novelty.`,
      insight:
        "AI should be evaluated not only by what it generates, but by how well that output supports the way people perceive and organize information.",
    },
  ],
};

export default defineAtlasEntry({
  id: "gestalt-principles",
  category: "experiment",
  signatureStellarType: "relational",
  title: "GESTALT PRINCIPLES",
  subtitle: focus.subheadline,
  tags: ["GESTALT", "HUMAN PERCEPTION", "AI DESIGN"],
  overview: {
    what:
      "A comparative experiment testing whether AI models apply established Gestalt principles when generating an interface.",
    why:
      "AI-generated design is often judged by speed or aesthetics, but perceptual organization may be a more meaningful measure of design understanding.",
    researchFocus:
      "Comparing five model outputs through Proximity, Similarity, Continuity, and Closure.",
    keyDiscovery:
      "The more useful benchmark may be which AI model best understands human perception—not which one generates the prettiest interface.",
  },
  presentation: {
    mode: "example-led",
    sequenceLabel: "EXPERIMENT",
    railLabel: "EVIDENCE",
    artifactLabel: "ARTIFACT",
    emptyRailMessage: "Evidence appears as the experiment develops.",
  },
  orbit: {
    angle: 67,
    radius: 122,
    speed: 1.10e-4,
    starPrefix: "gp",
  },
  overviewStars: [
    {
      id: "question",
      label: "QUESTION",
      angle: -138,
      x: -0.88,
      y: -0.72,
      scale: 0.94,
      stellarType: "purpose",
      intensity: "balanced",
      labelPosition: { side: "left", offset: 30 },
    },
    {
      id: "test",
      label: "TEST",
      angle: -92,
      x: -0.18,
      y: -1.06,
      scale: 1.12,
      stellarType: "relational",
      intensity: "bright",
      labelPosition: { side: "top", offset: 32 },
    },
    {
      id: "outputs",
      label: "OUTPUTS",
      angle: 42,
      x: 0.92,
      y: 0.66,
      scale: 1.16,
      stellarType: "judgment",
      intensity: "bright",
      labelPosition: { side: "right", offset: 30 },
    },
    {
      id: "finding",
      label: "FINDING",
      angle: 92,
      x: 0.18,
      y: 1.08,
      scale: 0.96,
      stellarType: "evidence",
      intensity: "balanced",
      labelPosition: { side: "bottom", offset: 32 },
    },
  ],
  constellation: {
    showCenterConnections: false,
    connections: [
      { from: "question", to: "test", strength: "primary" },
      { from: "test", to: "outputs", strength: "primary" },
      { from: "outputs", to: "finding", strength: "primary" },
    ],
  },
  sections: focus.sections,
});
