import { defineAtlasEntry } from "../defineAtlasEntry";

export default defineAtlasEntry({
  id: "sovereign-ux",
  category: "framework",
  frameworkKind: "core",
  signatureStellarType: "purpose",
  semantics: {
    keywords: [
      "autonomy",
      "consent",
      "agency",
      "judgment",
      "clarity",
      "legibility",
      "reversibility",
      "sovereign design",
      "user sovereignty",
    ],
    aliases: [
      "sovereign ux",
      "sovereign design",
      "sovereign experience",
    ],
    summary:
      "A living system for designing intelligent products so people retain clarity, consent, judgment, and agency over time.",
  },
  title: "SOVEREIGN UX",
  subtitle:
    "A framework for designing AI-integrated products that preserve user autonomy, judgment, and identity over time.",
  tags: ["AUTONOMY", "CONSENT", "JUDGMENT"],
  overview: {
    what:
      "A living system for designing intelligent products so people retain clarity, consent, judgment, and agency as the system evolves around them.",
    why:
      "Most AI UX frameworks optimize for engagement. Sovereign UX optimizes for the quality of the user's relationship with their own thinking.",
    researchFocus:
      "How should intelligent systems behave so people retain clarity, consent, judgment, and agency over time?",
    keyDiscovery:
      "Autonomy is not preserved by limiting AI capability — it is preserved by making AI behavior legible, reversible, and explicitly chosen.",
  },
  presentation: {
    mode: "map-led",
    sequenceLabel: "SYSTEM AREAS",
    railLabel: "EXPLORE THE AREA",
    artifactLabel: "",
  },
  orbit: {
    angle: -80,
    radius: 112,
    speed: 1.18e-4,
    starPrefix: "sux",
  },
  overviewStars: [
    // Main-cycle areas now frame the core as a wider spatial composition:
    // Foundations anchors the left, Laws and Protocols form the upper arc,
    // Field Signals anchors the right, and Living Canon closes the system below.
    {
      id: "foundations",
      label: "FOUNDATIONS",
      angle: -144,
      x: -1.28,
      y: -0.42,
      scale: 1.22,
      stellarType: "purpose",
      intensity: "bright",
      labelPosition: { side: "left", offset: 30 },
    },
    {
      id: "laws",
      label: "LAWS",
      angle: -41,
      x: -0.50,
      y: -1.18,
      scale: 1,
      stellarType: "judgment",
      intensity: "balanced",
      labelPosition: { side: "right", offset: 30 },
    },
    {
      id: "protocols",
      label: "PROTOCOLS",
      angle: 28,
      x: 0.90,
      y: -0.74,
      scale: 0.96,
      stellarType: "relational",
      intensity: "balanced",
      labelPosition: { side: "right", offset: 28 },
    },
    {
      id: "field-signals",
      label: "FIELD SIGNALS",
      angle: 100,
      x: 1.58,
      y: 0.18,
      scale: 0.86,
      stellarType: "strategy",
      intensity: "dim",
      labelPosition: { side: "right", offset: 28 },
    },
    {
      id: "living-canon",
      label: "LIVING CANON",
      angle: 180,
      x: 0.28,
      y: 1.62,
      scale: 0.98,
      stellarType: "strategy",
      intensity: "balanced",
      labelPosition: { side: "left", offset: 30 },
    },
    // Layered System and Failure Patterns remain the interior diagnostic / response
    // branch, kept close to the core while the larger system areas spread outward.
    {
      id: "layered-system",
      label: "LAYERED SYSTEM",
      angle: -81,
      x: 0.40,
      y: -0.08,
      scale: 1.12,
      stellarType: "agentic",
      intensity: "balanced",
      labelPosition: { side: "top", offset: 28 },
    },
    {
      id: "failure-patterns",
      label: "FAILURE PATTERNS",
      angle: 33,
      x: -0.60,
      y: 0.14,
      scale: 0.9,
      stellarType: "risk",
      intensity: "dim",
      labelPosition: { side: "left", offset: 28 },
    },
  ],
  constellation: {
    showCenterConnections: false,
    connections: [
      {
        from: "foundations",
        to: "laws",
        strength: "primary",
        type: "applies",
        rationale:
          "Beliefs become principles: the foundational commitments are translated into the laws the system must hold.",
      },
      {
        from: "foundations",
        to: "layered-system",
        strength: "secondary",
        type: "extends",
        rationale:
          "Beliefs become diagnostics: the foundations become an operating structure the layered system can read.",
      },
      {
        from: "layered-system",
        to: "failure-patterns",
        strength: "secondary",
        type: "evidences",
        rationale:
          "Diagnostics surface the recurring ways autonomy erodes, naming them as failure patterns.",
      },
      {
        from: "laws",
        to: "protocols",
        strength: "primary",
        type: "applies",
        rationale:
          "Principles become responses: the laws are carried into the repeatable moves teams actually practice.",
      },
      {
        from: "failure-patterns",
        to: "protocols",
        strength: "secondary",
        type: "guards",
        rationale:
          "Named failure patterns shape protocols so the system guards against the erosions it has already seen.",
      },
      {
        from: "protocols",
        to: "field-signals",
        strength: "primary",
        type: "evidences",
        rationale:
          "Responses become observation: protocols in real use generate the field signals the system learns from.",
      },
      {
        from: "field-signals",
        to: "living-canon",
        strength: "primary",
        type: "extends",
        rationale:
          "Observation becomes learning: signals feed the living canon with the material for honest revision.",
      },
      {
        from: "living-canon",
        to: "foundations",
        strength: "primary",
        type: "applies",
        rationale:
          "Learning refines beliefs: the canon feeds revised understanding back into the foundations, closing the loop.",
      },
    ],
  },
  sections: [
    {
      id: "foundations",
      label: "Foundations",
      accentStellarType: "purpose",
      subtitle: "The commitments the rest of the system defends.",
      readingTime: 2,
      semantics: {
        keywords: ["clarity", "consent", "judgment", "agency", "autonomy"],
        aliases: ["first principles", "commitments"],
        summary:
          "The four commitments — clarity, consent, judgment, agency — that every other area of Sovereign UX exists to protect.",
      },
      content:
        "Sovereign UX begins from a single question: how should intelligent systems behave so people retain clarity, consent, judgment, and agency over time? These four are not features to add. They are commitments the rest of the system exists to defend.\n\nClarity means a person can tell what the system is doing and why. Consent means the system's behavior is explicitly chosen rather than quietly assumed. Judgment means the person's own reasoning is strengthened rather than replaced. Agency means the person can still change direction, including changing the system itself.\n\nEverything downstream — the layers, the laws, the protocols — is an attempt to hold these four commitments under real conditions, as the product grows and the model underneath it changes.",
      insight:
        "Autonomy is not preserved by limiting AI capability — it is preserved by making AI behavior legible, reversible, and explicitly chosen.",
    },
    {
      id: "layered-system",
      label: "Layered System",
      accentStellarType: "agentic",
      subtitle: "A diagnostic model for reading where a system shapes experience.",
      readingTime: 4,
      semantics: {
        keywords: [
          "layers",
          "diagnostic model",
          "reflection",
          "echo",
          "threshold signals",
          "codex",
        ],
        aliases: ["system layers", "reflection layer", "echo layer"],
        summary:
          "The diagnostic model that reads a product as layers — general practice lenses plus threshold signals — with Reflection · Echo among them.",
      },
      evidence: [
        {
          id: "layered-system-map",
          number: "01",
          title: "Layered System Diagnostic Map",
          type: "DIAGNOSTIC MAP",
          description:
            "All 19 diagnostic layers mapped as a free-roaming spatial field — 14 General Practice Layers and 5 Threshold Signals, with their connections visible.",
          caption:
            "Each node is a lens for investigation, not a feature requirement. The Threshold Signals mark conditions deserving additional scrutiny, not goals to build toward. Drag to explore, scroll to zoom, click any layer to read.",
          canvas: {
            id: "sovereign-layered-system-map",
            eyebrow: "SOVEREIGN UX · LAYERED SYSTEM",
            title: "Layered System Diagnostic Map",
            description:
              "A spatial map of the 19 diagnostic layers with connections between them.",
            boardLabel: "LAYERED SYSTEM",
            boardSubtitle: "19 diagnostic lenses",
            annotations: [],
          },
        },
      ],
      content:
        "The Layered System is a diagnostic model. It helps designers examine where an intelligent system is shaping a person's experience, interpretation, behavior, or authority — and whether that person keeps clarity, consent, judgment, and agency at each of those points.\n\nThe layers are not product features, implementation requirements, a maturity ladder, or a checklist every product must contain. They are lenses for investigation. You hold a layer up to a product and ask a question: what is the system doing here, and who does it serve?\n\nThe current model is organized into two groups. General Practice Layers are the ordinary lenses used during design and evaluation. Threshold Signals mark conditions that deserve additional attention, caution, or escalation.\n\nGENERAL PRACTICE LAYERS — everyday diagnostic lenses\n\n01 Interface · 02 Emotion · 03 Memory · 04 Reflection · Echo\n\n05 Reciprocity · 06 Friction · 07 Imprint · 08 Future Signal\n\n09 Relational Field · 10 Cultural Context · 11 Transformation\n\n12 Sustainability · 13 Pattern Mirror · 14 Atmosphere\n\nTHRESHOLD SIGNALS — conditions to watch, not capabilities to build toward\n\n15 Distortion Detection · 16 Hidden Influence · 17 Longitudinal Reflection\n\n18 Flow State · 19 Coherence Alignment\n\nA Threshold Signal is not a desirable feature to optimize for. When one appears it is a prompt to slow down and look closer — a sign the system may be shaping the person in ways that need scrutiny rather than acceleration.\n\nREFLECTION · ECHO\n\nReflection examines whether the system gives the person enough space to recognize their own intent, interpretation, or change in perspective before the system pushes toward action.\n\nEcho is the historical name of this concept. The original Sovereign Atlas began as an attempt to find Echo inside the growing Sovereign UX Codex — to locate and make navigable the reflective layer the rest of the framework had always assumed. Echo is preserved here as one layer within the larger system, not yet a top-level area of its own.",
      insight:
        "Reflection · Echo asks whether a person can still recognize their own intent before the system moves them to act — the reflective layer Atlas was first built to find.",
    },
    {
      id: "laws",
      label: "Laws",
      accentStellarType: "judgment",
      subtitle:
        "Diagnostic principles for understanding how systems affect trust, agency, and human judgment.",
      readingTime: 3,
      semantics: {
        keywords: [
          "laws",
          "interface laws",
          "diagnostic principles",
          "trust",
          "agency",
          "decision framing",
          "relational laws",
          "alignment signals",
          "signal fidelity",
          "silent drift",
          "right to disengage",
        ],
        aliases: [
          "laws of the interface",
          "interface principles",
          "sovereign ux laws",
        ],
        summary:
          "Diagnostic principles for understanding how systems preserve or erode trust, clarity, agency, and human judgment.",
      },
      evidence: [
        {
          id: "laws-index",
          number: "01",
          title: "Laws of the Interface",
          type: "DIAGNOSTIC REFERENCE",
          description:
            "22 laws and 3 alignment signals organized as a diagnostic reference for reading how system behavior affects trust, agency, and human judgment.",
          caption:
            "Core Laws establish foundational principles. Relational Laws address sensitive or high-pressure moments. Advanced Alignment Signals are conditions to observe and document — not goals to optimize.",
          canvas: {
            id: "sovereign-laws-index",
            eyebrow: "SOVEREIGN UX · LAWS",
            title: "Laws of the Interface",
            description:
              "A diagnostic reference for identifying where trust, agency, or behavioral integrity is being preserved — or beginning to break.",
            boardLabel: "LAWS INDEX",
            boardSubtitle: "22 laws · 3 alignment signals",
            annotations: [],
          },
        },
      ],
      content:
        "The Laws of the Interface describe how systems should behave when interacting with real humans. They are diagnostic principles — ways to understand why a product feels trustworthy, coercive, calm, or exhausting. When a system feels off, the Laws provide language for examining what changed and why trust may be breaking.\n\nThe Laws are observational, not blindly prescriptive. They apply across interface design, AI behavior, copy, pacing, defaults, and decision framing. Their role is not to hand teams a universal recipe, but to help distinguish what a system is doing: reflecting, suggesting, deciding, or quietly shaping the conditions around a choice.\n\nThe framework is organized into three bands. CORE LAWS are foundational principles that apply across interfaces. RELATIONAL LAWS address moments of stress, uncertainty, vulnerability, or heightened emotional load. ADVANCED ALIGNMENT SIGNALS are conditions that may indicate deep alignment or ethical overreach; they are signals to observe, document, and scrutinize — not goals to optimize.\n\nThe Laws govern UX and system behavior. They do not justify psychological interpretation, identity shaping, or therapeutic intervention. When emotional depth exceeds design scope, the appropriate response is pause, consent, or referral — not deeper automation.",
      insight:
        "Is this system helping people act with clarity — or quietly shaping their decisions without their awareness?",
    },
    {
      id: "living-canon",
      label: "Living Canon",
      accentStellarType: "strategy",
      subtitle: "How the system revises itself without losing itself.",
      readingTime: 2,
      semantics: {
        keywords: ["canon", "revision", "precedent", "evolution"],
        aliases: ["precedent", "codex"],
        summary:
          "The evolving record of how the laws are interpreted, argued, and revised as the field and the technology change.",
      },
      content:
        "A framework that cannot change becomes wrong the moment its assumptions do. The Living Canon is how Sovereign UX evolves without dissolving: an evolving record of how the laws have been interpreted, where they have been tested, and why they were revised.\n\nEach decision leaves a trace — the argument, the context, the tradeoff accepted. Over time this becomes precedent that later work can build on or overturn, but not ignore. The canon is what keeps revision honest, so the system changes through argument rather than through drift.\n\nThis is what makes the framework living rather than fixed. The commitments hold steady; their interpretation is allowed to grow.",
      insight:
        "The canon keeps the system changing through argument rather than through drift.",
    },
    {
      id: "protocols",
      label: "Protocols",
      accentStellarType: "relational",
      subtitle: "The repeatable moves teams use in practice.",
      readingTime: 2,
      semantics: {
        keywords: ["protocols", "practices", "methods", "rituals"],
        aliases: ["practices", "playbook"],
        summary:
          "The concrete, repeatable moves that turn the framework's commitments into everyday design and engineering practice.",
      },
      content:
        "Protocols are where Sovereign UX becomes something a team can actually do. They are the repeatable moves — reviews, checks, framing questions, default patterns — that carry the commitments into everyday design and engineering.\n\nA protocol turns a value into a habit. Instead of hoping a team remembers to preserve reversibility, a protocol makes the reversible path the one that is easiest to ship. Instead of debating legibility case by case, a protocol establishes what the system must always be able to explain.\n\nProtocols are the connective tissue between the layered system and the people building on top of it. They are also where failure patterns are first caught, because a protocol that keeps getting skipped is usually pointing at a pattern worth naming.",
      insight:
        "A protocol turns a commitment into the path of least resistance, so autonomy survives contact with a deadline.",
    },
    {
      id: "failure-patterns",
      label: "Failure Patterns",
      accentStellarType: "risk",
      subtitle: "The recurring ways autonomy quietly erodes.",
      readingTime: 2,
      semantics: {
        keywords: ["failure", "drift", "dark patterns", "erosion"],
        aliases: ["anti-patterns", "erosion"],
        summary:
          "The recurring, often well-intentioned ways intelligent systems quietly strip clarity, consent, judgment, or agency.",
      },
      content:
        "Autonomy is rarely lost in one obvious move. It erodes through recurring patterns that usually look reasonable in the moment: a default that quietly decides, a summary that replaces the source, an assistant that grows from helping to deciding, a reversible action that becomes hard to undo.\n\nNaming these patterns is what makes them defensible against. A failure pattern is not a single bug; it is a shape the system keeps drifting toward under the pull of engagement, convenience, or speed. Once named, it can be watched for in protocols and guarded against in the laws.\n\nMost failure patterns begin as small, well-intentioned optimizations. That is exactly why they need names — so a helpful change can be recognized as an erosion before it becomes the norm.",
      insight:
        "Autonomy is rarely taken; it is optimized away one reasonable-looking default at a time.",
    },
    {
      id: "field-signals",
      label: "Field Signals",
      accentStellarType: "strategy",
      subtitle: "What real use tells the system about itself.",
      readingTime: 2,
      semantics: {
        keywords: ["signals", "feedback", "observation", "evidence"],
        aliases: ["telemetry", "field evidence"],
        summary:
          "Observations gathered from real use that feed the canon and surface failure patterns before they harden.",
      },
      content:
        "Field Signals are what the system learns from real use. They are the observations — behaviors, confusions, workarounds, moments of lost trust — that reveal how the framework is actually holding up outside the studio.\n\nSignals are the earliest evidence that a failure pattern is forming, often long before it is nameable. They feed the Living Canon with the material for honest revision, and they tell the protocols where they are being skipped or subverted.\n\nWithout field signals the framework would only ever argue with itself. With them, the living system stays accountable to the people it claims to serve.",
      insight:
        "Field signals are how a living framework stays accountable to real people rather than only to its own principles.",
    },
  ],
});
