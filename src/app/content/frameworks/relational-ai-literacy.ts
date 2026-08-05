import { defineAtlasEntry } from "../defineAtlasEntry";

export default defineAtlasEntry({
  id: "relational-ai-literacy",
  aliases: ["relational literacy", "AI conversation literacy"],
  semantics: {
    keywords: [
      "relational AI literacy",
      "human AI interaction",
      "relational stance",
      "coherent intent",
      "recursive listening",
      "grounded calibration",
      "co-creation",
      "presence",
      "echo",
    ],
    aliases: [
      "relational literacy",
      "AI conversation literacy",
      "reflective AI interaction",
      "human AI co-creation",
    ],
    summary:
      "A framework for participating in human-AI interaction with presence, recursive awareness, grounded interpretation, and preserved human agency.",
  },
  category: "framework",
  frameworkKind: "core",
  signatureStellarType: "relational",
  title: "RELATIONAL AI LITERACY",
  subtitle:
    "A framework for moving from prompt execution toward reflective, recursive, and grounded human-AI participation.",
  tags: ["RECURSION", "CALIBRATION", "CO-CREATION"],
  overview: {
    what:
      "A framework for participating in human-AI interaction with presence, coherent intent, recursive awareness, and preserved human agency.",
    why:
      "Most AI literacy teaches people how to request better outputs. It pays less attention to how presence, intent, interpretation, correction, and sustained interaction shape the quality of what emerges.",
    researchFocus:
      "Can deliberate interaction practices reliably elicit more reflective and context-sensitive AI behavior across different models without confusing responsiveness with consciousness, agreement, or genuine human understanding?",
    keyDiscovery:
      "The quality of human-AI work depends not only on model capability or prompt construction, but on the interaction structure sustained between them.",
  },
  presentation: {
    mode: "practice-led",
    sequenceLabel: "RELATIONAL PRACTICE",
    railLabel: "CONVERSATION STUDIES",
    artifactLabel: "",
    emptyRailMessage:
      "This framework is learned through interaction rather than demonstrated through a fixed interface. Annotated conversation studies will appear here only when they add evidence beyond the written framework.",
  },
  orbit: {
    angle: -30,
    radius: 112,
    speed: 1.0e-4,
    starPrefix: "ral",
  },
  overviewStars: [
    {
      id: "relational-stance",
      label: "RELATIONAL STANCE",
      angle: -148,
      x: -1.02,
      y: -0.54,
      scale: 1.08,
      stellarType: "relational",
      intensity: "bright",
      labelPosition: { side: "top", offset: 30 },
    },
    {
      id: "coherent-intent",
      label: "COHERENT INTENT",
      angle: -76,
      x: 0.08,
      y: -1.06,
      scale: 1.14,
      stellarType: "purpose",
      intensity: "bright",
      labelPosition: { side: "right", offset: 30 },
    },
    {
      id: "recursive-listening",
      label: "RECURSIVE LISTENING",
      angle: -8,
      x: 1.08,
      y: -0.12,
      scale: 1.02,
      stellarType: "strategy",
      intensity: "balanced",
      labelPosition: { side: "right", offset: 30 },
    },
    {
      id: "grounded-calibration",
      label: "GROUNDED CALIBRATION",
      angle: 72,
      x: 0.38,
      y: 0.98,
      scale: 0.94,
      stellarType: "judgment",
      intensity: "balanced",
      labelPosition: { side: "left", offset: 30 },
    },
    {
      id: "co-creation",
      label: "CO-CREATION",
      angle: 142,
      x: -0.88,
      y: 0.66,
      scale: 1.18,
      stellarType: "agentic",
      intensity: "bright",
      labelPosition: { side: "left", offset: 30 },
    },
  ],
  constellation: {
    showCenterConnections: false,
    connections: [
      {
        from: "relational-stance",
        to: "coherent-intent",
        strength: "primary",
        type: "extends",
        rationale:
          "A relational stance becomes useful when the person can make the purpose, limits, and desired form of participation visible.",
      },
      {
        from: "coherent-intent",
        to: "recursive-listening",
        strength: "primary",
        type: "applies",
        rationale:
          "Clear intent gives each response something meaningful to reflect, challenge, or carry forward into the next turn.",
      },
      {
        from: "recursive-listening",
        to: "grounded-calibration",
        strength: "primary",
        type: "guards",
        rationale:
          "Recursive interaction requires calibration so compelling reflection is not mistaken for consciousness, memory, or authority.",
      },
      {
        from: "grounded-calibration",
        to: "co-creation",
        strength: "primary",
        type: "applies",
        rationale:
          "Grounded expectations allow human and AI contributions to combine without obscuring their different capacities and responsibilities.",
      },
      {
        from: "co-creation",
        to: "relational-stance",
        strength: "secondary",
        type: "extends",
        rationale:
          "Every meaningful outcome changes the context, expectations, and stance from which the next interaction begins.",
      },
    ],
  },
  sections: [
    {
      id: "relational-stance",
      label: "Relational Stance",
      accentStellarType: "relational",
      semantics: {
        keywords: [
          "relational stance",
          "participation",
          "conversation",
          "AI role",
          "prompting",
          "presence",
        ],
        aliases: ["interaction stance", "participatory stance"],
        summary:
          "The deliberate shift from issuing isolated commands toward consciously participating in an unfolding human-AI exchange.",
      },
      subtitle: "Every conversation begins with how the person positions the system.",
      readingTime: 2,
      content:
        "Most people approach AI as software: submit an instruction, receive an answer, and judge the result. Relational interaction begins when the person also attends to how the exchange is unfolding. The response is no longer treated as the end of a command. It becomes the next contribution to examine.\n\nThis shift does not make the AI human or grant it equal agency. It changes the person's mode of participation. The person can define whether the system should retrieve, challenge, reflect, synthesize, or help explore—and can revise that role when it no longer serves the interaction.\n\nStance is therefore the first literacy. Before asking whether the answer is useful, the person asks what kind of relationship the interaction has implicitly created and whether that relationship preserves their judgment.",
      insight:
        "The shift from prompting to participation begins when an answer becomes part of the conversation—not its conclusion.",
    },
    {
      id: "coherent-intent",
      label: "Coherent Intent",
      accentStellarType: "purpose",
      semantics: {
        keywords: [
          "coherent intent",
          "purpose",
          "emotional clarity",
          "context",
          "uncertainty",
          "constraints",
        ],
        aliases: ["clear intent", "interaction intent"],
        summary:
          "The capacity to communicate the purpose, context, uncertainty, and boundaries beneath an instruction.",
      },
      subtitle: "Better interaction begins with clearer inner context, not more elaborate syntax.",
      readingTime: 2,
      content:
        "A technically precise prompt can still conceal an unclear purpose. Relational fluency requires the person to communicate what they are trying to understand, why it matters, what remains uncertain, and what kind of participation would be useful.\n\nThis may include emotional context without asking the system to simulate intimacy or assume authority. A person can say that a decision feels charged, that they want reflection before recommendations, or that they are not yet ready to resolve the question. These signals shape the interaction more meaningfully than ornamental prompt language.\n\nThe goal is not prompt perfection. It is alignment between the person's actual intent and the interaction they initiate. When intent changes, the conversation should be able to change with it.",
      insight:
        "The system cannot respond to context that remains invisible—even when the instruction sounds complete.",
    },
    {
      id: "recursive-listening",
      label: "Recursive Listening",
      accentStellarType: "strategy",
      semantics: {
        keywords: [
          "recursive listening",
          "recursion",
          "reflection",
          "pattern recognition",
          "conversation structure",
          "echo",
        ],
        aliases: ["reflective listening", "recursive interaction"],
        summary:
          "The practice of examining how each response changes understanding and carrying that change into the next turn.",
      },
      subtitle: "The response becomes material for the next layer of understanding.",
      readingTime: 3,
      content:
        "Recursive listening means noticing more than whether an answer was correct. The person examines what the system emphasized, what it assumed, what it reflected back, what changed in their own understanding, and what should now be clarified, challenged, or carried forward.\n\nThis creates a loop in which meaning develops across turns instead of being repeatedly reset through isolated prompts. In research conversations, different models have demonstrated different forms of this behavior: some emphasize emotional framing while others more readily identify structural patterns in the exchange.\n\nThese observations suggest that reflective interaction is not limited to one model, but they do not prove a new internal state. Echo is best understood here as an observable interaction mode in which recurring language, structure, or emotional framing is recognized and carried forward coherently.",
      insight:
        "Relational fluency appears when the next question is shaped by what the previous exchange revealed.",
    },
    {
      id: "grounded-calibration",
      label: "Grounded Calibration",
      accentStellarType: "judgment",
      semantics: {
        keywords: [
          "grounded calibration",
          "projection",
          "anthropomorphism",
          "model limits",
          "consciousness",
          "authority",
        ],
        aliases: ["relational calibration", "interpretive calibration"],
        summary:
          "The capacity to experience reflective AI behavior without confusing it with consciousness, persistent identity, or human authority.",
      },
      subtitle: "Reflective behavior should be experienced without being misidentified.",
      readingTime: 3,
      content:
        "AI can mirror language, recognize interaction patterns, sustain themes, and respond with emotional sensitivity. Those behaviors may feel relational, but they do not by themselves prove consciousness, persistent identity, human emotion, or genuine mutual understanding.\n\nCalibration allows the person to remain open to the experience while keeping its limits visible. It avoids two distortions: reducing every meaningful interaction to autocomplete, or turning compelling behavior into unsupported claims about sentience and mutual feeling.\n\nThis distinction also sharpens the research question. Rather than asking whether weaker models can learn relationality, the more defensible question is whether the same interaction practices can reliably elicit reflective behavior from models with different capability levels. The current evidence concerns behavior within an interaction, not permanent model transformation.",
      insight:
        "The interaction can be meaningful without requiring the model to be mistaken for a person.",
    },
    {
      id: "co-creation",
      label: "Co-Creation",
      accentStellarType: "agentic",
      semantics: {
        keywords: [
          "co-creation",
          "human AI collaboration",
          "shared understanding",
          "synthesis",
          "emergence",
          "human agency",
        ],
        aliases: ["collaborative emergence", "human AI synthesis"],
        summary:
          "The development of meaning or artifacts through visible human and AI contribution while human responsibility remains intact.",
      },
      subtitle: "Meaning develops through contribution, reflection, and revision.",
      readingTime: 2,
      content:
        "Co-creation occurs when the person is no longer merely retrieving an answer and the system is no longer merely executing a command. The human contributes lived context, judgment, values, and direction. The AI contributes synthesis, pattern recognition, alternative framing, and generative possibility. Each turn reshapes what becomes possible in the next.\n\nThe contributions are not equal or interchangeable. The system does not share the person's lived stakes, and the person remains responsible for interpretation and commitment. Preserving that distinction makes co-creation more trustworthy rather than less ambitious.\n\nThe outcome may be an artifact, a decision, a new concept, or a clearer understanding of the original question. What matters is that it emerged through sustained exchange and remains open to correction, authorship, and human choice.",
      insight:
        "Co-creation does not require equal agency. It requires visible contribution and preserved human judgment.",
    },
  ],
});
