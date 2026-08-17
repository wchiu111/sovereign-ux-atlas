import { defineAtlasEntry } from "../defineAtlasEntry";

import output01 from "../../../imports/experiments/gestalt-principles/output-01.png";
import output02 from "../../../imports/experiments/gestalt-principles/output-02.png";
import output03 from "../../../imports/experiments/gestalt-principles/output-03.png";
import output04 from "../../../imports/experiments/gestalt-principles/output-04.png";
import output05 from "../../../imports/experiments/gestalt-principles/output-05.png";
import gestaltPortal from "../../../imports/experiments/gestalt-principles/gestalt-principles-portal.jpg";

const focus = {
  headline: "Gestalt Principles",
  subheadline: "Can AI understand why an interface works?",
  sections: [
    {
      id: "question",
      label: "Question",
      accentStellarType: "purpose",
      subtitle: "Can AI understand why an interface works?",
      readingTime: 1,
      content: `AI can generate polished interfaces quickly. But visual polish does not necessarily mean the system understands the perceptual relationships that make an interface easy to read.

This experiment evaluates generated interfaces through four Gestalt principles that have shaped visual design for decades:

PROXIMITY — Related information should feel grouped through spatial relationships.

SIMILARITY — Shared visual characteristics should communicate relationships.

CONTINUITY — Visual organization should guide the eye through information.

CLOSURE — People should be able to perceive complete structures without every boundary being explicitly drawn.

The goal is not to rank aesthetics. It is to test whether perceptual structure emerges from the model without being explicitly requested.`,
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

No style direction.
No component requirements.
No design system.
No Gestalt instructions.

The outputs were then evaluated through the same four lenses: Proximity, Similarity, Continuity, and Closure.

Keeping the prompt deliberately minimal makes the differences in visual organization easier to compare.`,
      insight:
        "The experiment tests what perceptual organization emerges naturally from each model—not whether a model can follow explicit Gestalt instructions.",
    },
    {
      id: "outputs",
      label: "Outputs",
      accentStellarType: "judgment",
      subtitle: "Five anonymous interpretations of the same prompt",
      readingTime: 2,
      content: `The five outputs are presented anonymously before the model names are revealed.

This removes model reputation from the first evaluation pass.

Instead of asking which tool produced each interface, inspect the relationships inside the interface:

What feels grouped?
What looks related?
Where does the eye move next?
How much structure depends on containers rather than perceptual relationships?

Open the canvas to compare all five outputs side by side.`,
      insight:
        "Evaluate the interface first. Reveal the model second.",
      evidence: [
        {
          id: "gestalt-output-01",
          image: output01,
          alt: "Anonymous Output 01 from the Gestalt Principles experiment.",
          imageFit: "contain",
          number: "01",
          title: "Output 01",
          type: "Experiment Artifact",
          description:
            "An anonymous habit-tracking dashboard generated from the shared prompt.",
          caption:
            "Inspect grouping, repeated visual language, reading flow, and implied structure before revealing the model.",
          canvas: {
            id: "gestalt-five-output-comparison",
            eyebrow: "INTERACTIVE COMPARISON",
            title: "How each model organizes perception",
            description:
              "Compare five anonymous responses to the same habit-tracking prompt through Proximity, Similarity, Continuity, and Closure.",
            portalImage: gestaltPortal,
            boardLabel: "OUTPUT 01",
            boardSubtitle: "Anonymous model output — evaluate the interface before the reveal",
            boardHeight: 1080,
            annotations: [
              {
                id: "o1-proximity",
                number: "01",
                x: 34,
                y: 35,
                category: "visible-reasoning",
                title: "Proximity",
                observation:
                  "Progress metrics are grouped into a single dominant region before the habit list begins.",
                meaning:
                  "Spatial grouping creates a clear relationship between summary information and daily activity.",
                rightHolder: "Shared",
                footerLabel: "GESTALT LENS",
                footerValue: "PROXIMITY",
                cardSide: "right",
              },
              {
                id: "o1-similarity",
                number: "02",
                x: 34,
                y: 64,
                category: "visible-reasoning",
                title: "Similarity",
                observation:
                  "Habit rows repeat a consistent structure while color differentiates individual habits.",
                meaning:
                  "Repeated visual treatment makes the items read as members of the same system.",
                rightHolder: "Shared",
                footerLabel: "GESTALT LENS",
                footerValue: "SIMILARITY",
                cardSide: "right",
              },
            ],
          },
        },
        {
          id: "gestalt-output-02",
          image: output02,
          alt: "Anonymous Output 02 from the Gestalt Principles experiment.",
          imageFit: "contain",
          number: "02",
          title: "Output 02",
          type: "Experiment Artifact",
          description:
            "A second anonymous interpretation of the identical habit-tracking prompt.",
          caption:
            "Compare how much hierarchy is carried by spacing, containers, repetition, and alignment.",
          canvas: {
            id: "gestalt-five-output-comparison",
            eyebrow: "INTERACTIVE COMPARISON",
            title: "How each model organizes perception",
            description:
              "Compare five anonymous responses to the same habit-tracking prompt through Proximity, Similarity, Continuity, and Closure.",
            boardLabel: "OUTPUT 02",
            boardSubtitle: "Anonymous model output — evaluate the interface before the reveal",
            boardHeight: 1080,
            annotations: [],
          },
        },
        {
          id: "gestalt-output-03",
          image: output03,
          alt: "Anonymous Output 03 from the Gestalt Principles experiment.",
          imageFit: "contain",
          number: "03",
          title: "Output 03",
          type: "Experiment Artifact",
          description:
            "A third anonymous interpretation of the identical habit-tracking prompt.",
          caption:
            "Look for whether the composition behaves like a mobile product interface or primarily an information architecture exercise.",
          canvas: {
            id: "gestalt-five-output-comparison",
            eyebrow: "INTERACTIVE COMPARISON",
            title: "How each model organizes perception",
            description:
              "Compare five anonymous responses to the same habit-tracking prompt through Proximity, Similarity, Continuity, and Closure.",
            boardLabel: "OUTPUT 03",
            boardSubtitle: "Anonymous model output — evaluate the interface before the reveal",
            boardHeight: 1080,
            annotations: [],
          },
        },
        {
          id: "gestalt-output-04",
          image: output04,
          alt: "Anonymous Output 04 from the Gestalt Principles experiment.",
          imageFit: "contain",
          number: "04",
          title: "Output 04",
          type: "Experiment Artifact",
          description:
            "A fourth anonymous interpretation of the identical habit-tracking prompt.",
          caption:
            "Inspect the visual language and how strongly it relies on familiar interface conventions.",
          canvas: {
            id: "gestalt-five-output-comparison",
            eyebrow: "INTERACTIVE COMPARISON",
            title: "How each model organizes perception",
            description:
              "Compare five anonymous responses to the same habit-tracking prompt through Proximity, Similarity, Continuity, and Closure.",
            boardLabel: "OUTPUT 04",
            boardSubtitle: "Anonymous model output — evaluate the interface before the reveal",
            boardHeight: 1080,
            annotations: [],
          },
        },
        {
          id: "gestalt-output-05",
          image: output05,
          alt: "Anonymous Output 05 from the Gestalt Principles experiment.",
          imageFit: "contain",
          number: "05",
          title: "Output 05",
          type: "Experiment Artifact",
          description:
            "A fifth anonymous interpretation of the identical habit-tracking prompt.",
          caption:
            "Use the same four perceptual lenses before comparing the model identities.",
          canvas: {
            id: "gestalt-five-output-comparison",
            eyebrow: "INTERACTIVE COMPARISON",
            title: "How each model organizes perception",
            description:
              "Compare five anonymous responses to the same habit-tracking prompt through Proximity, Similarity, Continuity, and Closure.",
            boardLabel: "OUTPUT 05",
            boardSubtitle: "Anonymous model output — evaluate the interface before the reveal",
            boardHeight: 1080,
            annotations: [],
          },
        },
      ],
    },
    {
      id: "finding",
      label: "Finding",
      accentStellarType: "judgment",
      subtitle: "Aesthetics are only one part of AI design quality",
      readingTime: 1,
      content: `The most useful comparison was not which interface looked the most modern. It was how consistently each output used perceptual relationships to organize information. The experiment suggests a more meaningful benchmark for AI-generated interfaces:

Which AI model best understands human perception?

REVEAL

01 — Figma

02 — ChatGPT

03 — Claude

04 — Gemini

05 — Sovereign UX

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
      stellarType: "judgment",
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
