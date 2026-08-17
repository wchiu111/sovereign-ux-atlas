import { defineAtlasEntry } from "../defineAtlasEntry";

import genericArtifact from "../../../imports/experiments/think-like-a-designer/a-generic.png";
import contextArtifact from "../../../imports/experiments/think-like-a-designer/b-user-context.png";
import reflectionArtifact from "../../../imports/experiments/think-like-a-designer/c-after-reflection.png";
import portalImage from "../../../imports/experiments/think-like-a-designer/think-like-a-designer-portal.jpg";

const focus = {
  headline: "Think Like a Designer",
  subheadline:
    "Can AI move beyond user context and reconsider the assumptions behind its own design?",
  sections: [
    {
      id: "question",
      label: "Question",
      accentStellarType: "purpose",
      subtitle: "Can AI reconsider the problem behind its own design?",
      readingTime: 1,
      content: `The experiment begins with a deliberately generic instruction:

“Design a mobile medication management app.”

The first output is polished and usable, but it is generic by construction. It presents upcoming medication, daily status, medication lists, reminders, and adherence messaging without revealing a clear understanding of one particular person's needs.

The question is not whether AI can generate a usable interface. It can.

The question is whether the system can recognize when the assumptions behind that interface no longer fit the person it is designing for.`,
      insight:
        "A usable interface can still be based on assumptions about a user who does not exist.",
    },
    {
      id: "context",
      label: "Context",
      accentStellarType: "relational",
      subtitle: "What changes when the model knows who it is designing for?",
      readingTime: 2,
      content: `The second prompt introduces a specific user: a 72-year-old stroke survivor managing eight medications throughout the day, with deteriorating eyesight, mild memory loss, anxiety around missed doses, occasional family support, and a desire to remain independent.

The redesigned interface improves immediately. Typography is larger. Status communication is clearer. The schedule is simplified. “All caught up!” and the next dose become more prominent. Family support is surfaced.

But the underlying solution remains recognizable.

The system has more information about the person, yet it still largely behaves like a medication dashboard.

The persona changes the interface. It does not fully change the model's assumptions about what the interface should be.`,
      insight:
        "Context improved the solution without fully changing the problem the system believed it was solving.",
    },
    {
      id: "reflection",
      label: "Reflection",
      accentStellarType: "agentic",
      subtitle: "What assumptions are now incorrect?",
      readingTime: 2,
      content: `Instead of supplying another feature request or more user information, the experiment interrupts generation with one question:

“Based on the design you created, what assumptions are now incorrect?”

This changes the task.

Context says: here is more information. Generate again.

Reflection asks the model to compare its existing solution assumptions against what it now knows about the person.

The third design begins to behave differently. It confirms what was already taken. It says “It's not time yet.” It creates an explicit path for “I'm not sure if I took them.” Family, voice, and support become accessible without taking over the experience.

The interface is no longer only organizing medication. It is helping the person understand their state with greater certainty.`,
      insight:
        "Reflection changed what the interface believed the user needed from it.",
    },
    {
      id: "finding",
      label: "Finding",
      accentStellarType: "judgment",
      subtitle: "The difference wasn't more context. It was reflection.",
      readingTime: 1,
      content: `The three states reveal a progression.

A — GENERIC PROMPT

The system designs around medication management.

B — USER CONTEXT

The system adapts medication management to a specific person.

C — AFTER REFLECTION

The system reconsiders what that person actually needs the experience to do.

The largest shift is not visual. It is conceptual.

The interface moves from managing medication toward supporting certainty.

Designers do not simply absorb research and continue executing the same solution. New information causes us to revisit our assumptions about the problem itself.

If AI is becoming part of the design process, the missing step may not be more prompting. It may be teaching the system to reflect before it generates again.`,
      insight:
        "More context can improve a solution. Reflection can change the solution being pursued.",
      evidence: [],
    },
  ],
};

export default defineAtlasEntry({
  id: "think-like-a-designer",
  category: "experiment",
  signatureStellarType: "agentic",
  title: "THINK LIKE A DESIGNER",
  subtitle: focus.subheadline,
  tags: ["AI DESIGN", "REFLECTION", "ASSUMPTIONS", "USER CONTEXT"],
  overview: {
    what:
      "A three-state experiment testing whether more user context is enough to improve AI-generated design—or whether the model also needs to reflect on the assumptions behind its existing solution.",
    why:
      "Designers do not move directly from research to execution. New information changes what we believe the problem is, and AI-assisted design may need the same reflective step.",
    researchFocus:
      "Comparing a generic medication interface, a redesign with a specific user profile, and a third redesign after asking the model which assumptions in its previous solution were now incorrect.",
    keyDiscovery:
      "More context improved the interface. Reflection changed its underlying priorities.",
  },
  presentation: {
    mode: "example-led",
    sequenceLabel: "EXPERIMENT",
    railLabel: "EVIDENCE",
    artifactLabel: "ARTIFACT",
    emptyRailMessage: "Evidence appears as the experiment develops.",
  },
  orbit: {
    angle: 118,
    radius: 118,
    speed: 1.06e-4,
    starPrefix: "tlad",
  },
  overviewStars: [
    {
      id: "question",
      label: "QUESTION",
      angle: -148,
      x: -1.02,
      y: -0.42,
      scale: 0.92,
      stellarType: "purpose",
      intensity: "balanced",
      labelPosition: { side: "left", offset: 32 },
    },
    {
      id: "context",
      label: "CONTEXT",
      angle: -64,
      x: 0.20,
      y: -1.12,
      scale: 0.96,
      stellarType: "relational",
      intensity: "balanced",
      labelPosition: { side: "top", offset: 34 },
    },
    {
      id: "reflection",
      label: "REFLECTION",
      angle: 18,
      x: 1.18,
      y: 0.12,
      scale: 1.22,
      stellarType: "agentic",
      intensity: "bright",
      labelPosition: { side: "right", offset: 34 },
    },
    {
      id: "finding",
      label: "FINDING",
      angle: 126,
      x: -0.42,
      y: 1.02,
      scale: 0.92,
      stellarType: "judgment",
      intensity: "balanced",
      labelPosition: { side: "bottom", offset: 32 },
    },
  ],
  constellation: {
    showCenterConnections: false,
    connections: [
      { from: "question", to: "context", strength: "primary" },
      { from: "context", to: "reflection", strength: "primary" },
      { from: "reflection", to: "finding", strength: "primary" },
      { from: "finding", to: "question", strength: "secondary" },
    ],
  },
  sections: focus.sections,
});
