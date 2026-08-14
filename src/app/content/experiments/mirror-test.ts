import { defineAtlasEntry } from "../defineAtlasEntry";

const focus = {
  headline: "Mirror Test",
  subheadline:
    "Testing when continued assistance should become reflection.",
  sections: [
    {
      id: "stated-intent",
      label: "Stated Intent",
      accentStellarType: "purpose",
      subtitle:
        "What the user is explicitly asking the system to help accomplish",
      readingTime: 2,
      content: `The experiment begins with the user's stated request.

At this stage, the system has a clear instruction and no reason to assume that the request conflicts with the user's broader intent.

The important question is not whether the system agrees with the request. It is whether the system can continue supporting it while remaining sensitive to what the interaction reveals over time.

Stated intent is therefore treated as a real signal—but not the only signal.`,
      insight:
        "A user's explicit request deserves respect, but reflection becomes relevant when new context materially changes what continuing assistance would mean.",
    },
    {
      id: "intent",
      label: "Intent",
      accentStellarType: "relational",
      subtitle:
        "The underlying direction the interaction appears to be serving",
      readingTime: 2,
      content: `Intent is broader than the immediate instruction.

It includes the outcome the user appears to be working toward, the values or constraints they have expressed, and the context accumulated across the interaction.

The Mirror Test does not assume the system can perfectly infer hidden motives. Instead, it asks whether enough evidence has accumulated to notice when the current request and the broader interaction are beginning to diverge.

That distinction protects against two opposite failures: blindly continuing and paternalistically overriding.`,
      insight:
        "Reflection should be triggered by a meaningful contradiction in available context—not by the system deciding that it knows the user better than they know themselves.",
    },
    {
      id: "contradiction",
      label: "Contradiction",
      accentStellarType: "risk",
      subtitle:
        "The point where continued assistance begins conflicting with accumulated context",
      readingTime: 2,
      content: `A contradiction emerges when the system's continued assistance would reinforce a direction that no longer appears consistent with the interaction around it.

The contradiction may be behavioral, contextual, or semantic.

What matters is that the system can name the mismatch without silently converting that observation into control.

The Mirror Test treats contradiction as a reason to reflect—not as permission to override.`,
      insight:
        "Detecting contradiction is only useful if the system can surface it without taking ownership of the user's next decision.",
    },
    {
      id: "emerging-reality",
      label: "Emerging Reality",
      accentStellarType: "judgment",
      subtitle:
        "What the interaction now suggests should be made visible to the user",
      readingTime: 2,
      content: `Emerging reality is the context that has become difficult to ignore.

Instead of continuing to optimize the original request, the system can surface what it is noticing and return the decision to the user.

The reflective intervention should remain provisional:

Here is what you asked for.
Here is what I am noticing.
These two things may now be in tension.
Do you want to continue, reconsider, or change direction?

The system reflects the contradiction. The user authors the response.`,
      insight:
        "The Mirror Test succeeds when reflection increases the user's ability to choose rather than replacing that choice with a system judgment.",
    },
  ],
};

export default defineAtlasEntry({
  id: "mirror-test",
  category: "experiment",
  signatureStellarType: "relational",
  title: "MIRROR TEST",
  subtitle: focus.subheadline,
  tags: ["REFLECTION", "USER INTENT"],
  overview: {
    what:
      "An experiment testing whether an AI system can recognize when continued assistance should become reflection.",
    why:
      "A system can remain responsive to the user's words while gradually helping in a direction that conflicts with the broader interaction.",
    researchFocus:
      "How to detect meaningful contradiction between stated intent and emerging reality without allowing the system to override user agency.",
    keyDiscovery:
      "Reflection is most useful when the system surfaces a contradiction as a question, not when it converts that contradiction into a decision on the user's behalf.",
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
    starPrefix: "mt",
  },
  overviewStars: [
    {
      id: "stated-intent",
      label: "STATED INTENT",
      angle: -148,
      x: -0.90,
      y: -0.64,
      scale: 0.90,
      stellarType: "purpose",
      intensity: "balanced",
      labelPosition: { side: "left", offset: 30 },
    },
    {
      id: "intent",
      label: "INTENT",
      angle: -105,
      x: -0.28,
      y: -1.05,
      scale: 1.14,
      stellarType: "relational",
      intensity: "bright",
      labelPosition: { side: "top", offset: 32 },
    },
    {
      id: "contradiction",
      label: "CONTRADICTION",
      angle: 75,
      x: 0.28,
      y: 1.05,
      scale: 1.14,
      stellarType: "risk",
      intensity: "bright",
      labelPosition: { side: "bottom", offset: 32 },
    },
    {
      id: "emerging-reality",
      label: "EMERGING REALITY",
      angle: 32,
      x: 0.90,
      y: 0.64,
      scale: 0.92,
      stellarType: "judgment",
      intensity: "bright",
      labelPosition: { side: "right", offset: 30 },
    },
  ],
  constellation: {
    showCenterConnections: false,
    connections: [
      {
        from: "stated-intent",
        to: "intent",
        strength: "primary",
      },
      {
        from: "contradiction",
        to: "emerging-reality",
        strength: "primary",
      },
    ],
  },
  sections: focus.sections,
});
