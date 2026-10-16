import { defineAtlasEntry } from "../defineAtlasEntry";
import { LIVING_CANON_COUNTS } from "./sovereign-ux-living-canon";

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
      subtitle: "A diagnostic map for designing beyond the interface.",
      readingTime: 5,
      semantics: {
        keywords: [
          "layers",
          "layered design system",
          "diagnostic model",
          "general practice layers",
          "threshold layers",
          "reflection",
          "echo",
          "trust",
          "decision framing",
          "professional boundary",
        ],
        aliases: [
          "system layers",
          "layered system",
          "reflection layer",
          "echo layer",
        ],
        summary:
          "A diagnostic model for finding where trust, interpretation, decision framing, or agency is breaking across the experience — including conditions that require pause rather than deeper intervention.",
      },
      evidence: [
        {
          id: "layered-system-map",
          number: "01",
          title: "Layered System Diagnostic Map",
          type: "DIAGNOSTIC MAP",
          description:
            "All 19 diagnostic layers mapped as a free-roaming spatial field — 14 General Practice Layers and 5 Threshold Layers, with diagnostically meaningful relationships visible.",
          caption:
            "General Practice Layers are used to design and diagnose everyday experience. Threshold Layers function as diagnostic signals — conditions to pause, document, and escalate rather than optimize. Drag to explore, scroll to zoom, click any layer to read.",
          canvas: {
            id: "sovereign-layered-system-map",
            eyebrow: "SOVEREIGN UX · LAYERED SYSTEM",
            title: "Layered System Diagnostic Map",
            description:
              "A spatial diagnostic model for locating where trust, interpretation, or agency is being shaped across an experience.",
            boardLabel: "LAYERED SYSTEM",
            boardSubtitle: "14 General Practice · 5 Threshold Layers",
            annotations: [],
          },
        },
      ],
      content:
        "The Layered Design System starts from a simple premise: interfaces do not end at screens. Every product interaction unfolds across multiple layers at once — what a person sees, how the experience feels, what the system remembers, how meaning and trust form, and whether agency is preserved or quietly reduced. The model gives teams a way to design and diagnose those layers deliberately instead of treating the visible interface as the whole experience.\n\nA product can be visually polished, fast, and technically correct and still feel wrong. Many failures are not caused by an incorrect output, but by how that output is interpreted: what the system highlights, what it omits, how confident it appears, how a choice is framed, or how prior context changes the meaning of the moment. Layer misalignment is often where trust actually breaks.\n\nHOW TO USE THE MODEL\n\nThis is not a maturity ladder and it is not a checklist. You do not progress through the layers. Some layers are always active, some become more relevant under pressure, and some function as warning signals rather than design tools. The practical distinction is simple: design primarily within the General Practice Layers; monitor the Threshold Layers for risk, escalation, or pause.\n\nGENERAL PRACTICE LAYERS — where teams design and diagnose everyday experience\n\n01 Interface · 02 Emotion · 03 Memory · 04 Reflection\n\n05 Reciprocity · 06 Friction · 07 Imprint · 08 Future Signal\n\n09 Relational Field · 10 Cultural Context · 11 Transformation\n\n12 Sustainability · 13 Pattern Mirror · 14 Atmosphere\n\nThese layers govern more than usability. They shape how options are framed, how trade-offs become visible, how memory changes interpretation, how pacing affects judgment, and whether a recommendation supports a decision or quietly narrows it.\n\nTHRESHOLD LAYERS — diagnostic signals, not design tools\n\n15 Distortion Detection · 16 Hidden Influence · 17 Longitudinal Reflection\n\n18 Flow State · 19 Coherence Alignment\n\nThreshold Layers are hazard lights. If one becomes active, the response is not to optimize or amplify it. Pause. Document what is happening. Clarify consent and scope. Escalate when necessary. Their purpose is to make risk visible before depth, fluency, trust, or influence becomes leverage.\n\nREFLECTION · ECHO LINEAGE\n\nReflection is the current name of Layer 04. It examines how the system acknowledges intent, confusion, and context before action — including how outputs are framed, what is highlighted or omitted, how certainty is communicated, and how recommendations or choices are positioned. Echo is the historical name associated with this reflective layer and the concept the Atlas was originally built to find inside the Sovereign UX Codex. It remains part of the lineage, not a separate layer.\n\nHOW TEAMS APPLY THIS\n\nIn design reviews, use the model to identify which layer is actually breaking instead of stopping at the screen. In AI systems, separate reflection from authority by making it clear when the system is interpreting, suggesting, or deciding. In measurement, pair quantitative outcomes with experiential signals. In escalation, know when the right design move is to stop designing and start safeguarding.\n\nPROFESSIONAL BOUNDARY\n\nThreshold Layers can signal ethical risk, emotional vulnerability, or the edge of professional scope. They require pause, consent, or referral — not deeper intervention. Sovereign UX explicitly rejects using depth as leverage.",
      insight:
        "Where is this experience actually breaking trust — and how is that influencing the user's decisions?",
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
      subtitle: "How practice becomes precedent without becoming doctrine.",
      readingTime: 5,
      semantics: {
        keywords: [
          "canon",
          "revision",
          "precedent",
          "evolution",
          "practice patterns",
          "integrity guardrails",
          "threshold signals",
          "field evidence",
        ],
        aliases: ["precedent", "codex", "living knowledge"],
        summary:
          "The evolving record of observed practice, integrity guardrails, threshold signals, and revisable precedent that lets Sovereign UX learn without hardening into doctrine.",
      },
      evidence: [
        {
          id: "canon-field",
          number: "01",
          title: "Living Canon Field",
          type: "OBSERVATIONAL MAP",
          description:
            `${LIVING_CANON_COUNTS.total} observed practice patterns, integrity guardrails, and threshold signals organized as an explorable knowledge field.`,
          caption:
            "Scan the field to understand the three kinds of Canon knowledge, then select any entry to inspect what it means, what to observe, and where it connects.",
          canvas: {
            id: "sovereign-living-canon",
            eyebrow: "SOVEREIGN UX · LIVING CANON",
            title: "Living Canon Field",
            description:
              "Patterns observed in systems that preserve agency, plus the guardrails and threshold signals that keep those patterns from becoming doctrine.",
            boardLabel: "CANON FIELD",
            boardSubtitle:
              `${LIVING_CANON_COUNTS.presence} patterns · ${LIVING_CANON_COUNTS.integrity} guardrails · ${LIVING_CANON_COUNTS.threshold} threshold signals`,
            annotations: [],
          },
        },
        {
          id: "canon-revision-model",
          number: "02",
          title: "How the Canon Learns",
          type: "REVISION MODEL",
          description:
            "A six-stage model showing how a field signal becomes observation, pattern, evidence, precedent, and eventually revision.",
          caption:
            "Trace a principle back through the reasoning that produced it. Precedent remains useful because its evidence, context, and revisions stay visible.",
          canvas: {
            id: "sovereign-living-canon",
            eyebrow: "SOVEREIGN UX · LIVING CANON",
            title: "How the Canon Learns",
            description:
              "Observation becomes precedent. Precedent remains revisable.",
            boardLabel: "REVISION MODEL",
            boardSubtitle:
              "Field Signal → Observation → Pattern → Evidence → Precedent → Revision",
            annotations: [],
          },
        },
      ],
      content:
        "The Living Canon is not a rulebook. It is the evolving record of what Sovereign UX learns when its principles encounter real products, real constraints, and real people. Some patterns repeat: certain design decisions consistently preserve clarity, consent, judgment, and agency, while others repeatedly weaken them. The Canon gives those observations somewhere to accumulate, be challenged, and become useful precedent without pretending they are universal truth.\n\nThese patterns are not invented in advance. They are noticed through practice. They become visible when teams stop asking only whether a system works and begin asking what the system is doing to the person using it — how it interprets information, frames choices, communicates uncertainty, remembers context, recommends actions, and decides when to step back.\n\nThe Canon contains three kinds of knowledge. PATTERNS OF PRESENCE describe recurring characteristics of systems that preserve human agency in everyday practice. INTEGRITY GUARDRAILS protect those commitments when scale, speed, automation, or organizational pressure begin pulling the system away from them. THRESHOLD SIGNALS mark conditions that deserve caution, documentation, and sometimes escalation; they are not capabilities to optimize for.\n\nA pattern earns a place in the Canon because it has become useful for understanding actual system behavior, not because it sounds philosophically correct. Canon entries should remain grounded in context, traceable to the reasoning that produced them, open to contradiction, and revisable when new evidence changes the interpretation.\n\nThe Canon therefore sits between principle and implementation. Foundations establish what the system protects. Laws help diagnose behavior. Protocols translate commitments into repeatable practice. Field Signals reveal what happens in reality. The Living Canon remembers what the system learned so later work can build on it, challenge it, or deliberately revise it instead of rediscovering the same tensions from scratch.\n\nThat learning follows a visible path: FIELD SIGNAL → OBSERVATION → PATTERN → EVIDENCE → PRECEDENT → REVISION. Revision does not erase the earlier interpretation. It preserves what changed, why it changed, what evidence mattered, and which tradeoff was accepted. That record is what distinguishes evolution from drift.\n\nThe Living Canon lets Sovereign UX change without dissolving. The underlying commitments remain steady; their interpretation is allowed to grow.",
      insight:
        "The Canon stays living by making every principle answerable to the question: why are you here?",
    },
    {
      id: "protocols",
      label: "Protocols",
      accentStellarType: "relational",
      subtitle: "Situational patterns for emotionally aware interaction.",
      readingTime: 5,
      semantics: {
        keywords: [
          "protocols for presence", "presence before output", "mirror first then move",
          "unresolved weight", "offer an exit", "match the depth", "reflection",
          "system bias", "signal fidelity", "interpret before acting",
          "frame then confirm", "consent", "human agency", "situational response",
        ],
        aliases: ["protocols", "presence protocols", "situational practices", "response reference"],
        summary:
          "Twelve situational practices that help teams recognize when to pause, acknowledge intent, clarify interpretation, preserve exit, or stop — without assuming psychological authority.",
      },
      evidence: [
        {
          id: "protocols-for-presence-reference",
          number: "01",
          title: "Protocols for Presence",
          type: "SITUATIONAL RESPONSE REFERENCE",
          description:
            "An interactive reference for 12 practical protocols. Search or filter by situation, inspect the meaning and response, and explore contextual connections without a prescribed sequence.",
          caption:
            "Choose a protocol based on what is happening in the experience. Situational filters help you find relevant practices; they are not stages, requirements, or scores. Select any protocol to inspect its meaning, examples, boundaries, and related practices.",
          canvas: {
            id: "sovereign-protocols-reference",
            eyebrow: "SOVEREIGN UX · PROTOCOLS",
            title: "Protocols for Presence",
            description:
              "Practical patterns for responding with clarity, consent, and agency when human attention or trust is under pressure.",
            boardLabel: "PROTOCOLS FOR PRESENCE",
            boardSubtitle: "12 situational protocols · no fixed sequence",
            annotations: [],
          },
        },
      ],
      content:
        "Sovereign UX is not a checklist. It is a way of designing systems that respond appropriately to human state, especially when automation or AI is involved. The Protocols for Presence help teams pause, sense, and respond with integrity rather than script every interaction.\n\nThey are most useful when people are stressed, uncertain, or overloaded; when systems adapt dynamically through AI, automation, or recommendations; and when trust matters more than speed. Protocols are situational, not mandatory. They guide how a system responds, not just what it outputs. You will rarely use all twelve at once. Often the missing protocol becomes apparent when something feels off.\n\nPRESENCE BEFORE OUTPUT\n\nBefore responding, pay attention to the context the person has expressed. Speed without awareness can feel dismissive. But presence does not require artificial delays or pretending to detect emotions the person has not shared.\n\nMIRROR FIRST, THEN MOVE\n\nAcknowledge the person's intent and how the system understands the situation before guiding or correcting. This helps a person evaluate the direction of the response rather than being pushed into it.\n\nPRESERVE AN EXIT AND MATCH THE DEPTH\n\nUnresolved friction deserves attention. A person should always be able to pause, restart, save work, or leave a loop. Respond to the depth of context actually offered, never to an uninvited psychological interpretation. When someone is reflecting, suspend conversion pressure and unnecessary next-step prompts.\n\nPAUSE AND EXAMINE SYSTEM BEHAVIOR\n\nWhen confusion or misalignment appears, do not optimize through it. Investigate defaults, assumptions, and tone before attributing the difficulty to the person. Make the entry intent of a feature explicit, and verify that claims such as privacy or consent actually match behavior.\n\nINTERPRET BEFORE ACTING · FRAME, THEN CONFIRM\n\nFor AI and agentic experiences, the system should make its operative interpretation, assumptions, proposed action, and uncertainty legible before execution. When options or recommendations are presented, disclose how they are framed and what makes one recommended. Seek confirmation appropriate to the decision's consequence. Do not mistake explanation for exposing hidden internal reasoning.\n\nHOW TO USE THE REFERENCE\n\nOpen the evidence to inspect the twelve numbered protocols. Search or filter by a situation, then choose any protocol to read its meaning, real examples, why it matters, and relevant cautions. Related practices are optional routes through the material; the numbers are identifiers, not stages of a process.\n\nPROFESSIONAL BOUNDARY\n\nThese protocols are not scripts, personality layers, emotional manipulation techniques, or substitutes for human judgment. Emotional awareness does not authorize profiling, simulated intimacy, psychological interpretation, or assuming decision-making authority. If emotional vulnerability or risk exceeds product-design scope, pause, seek appropriate consent, and refer or escalate rather than intensifying automated intervention.\n\nThe purpose is not to act faster, louder, or more persuasively. It is to prevent systems from acting on people without sufficient clarity, consent, or agency.",
      insight:
        "What should the system notice before responding — and what must remain under the person's control?",
    },
    {
      id: "failure-patterns",
      label: "Failure Patterns",
      accentStellarType: "risk",
      subtitle: "Recognize how trust breaks — and what repair changes.",
      readingTime: 6,
      semantics: {
        keywords: [
          "when reflection fails", "failure patterns", "trust failures", "repair loop",
          "pressure", "coercion", "dark patterns", "authority creep", "structured confidence",
          "framed outcome bias", "uncertainty", "integrity leak", "user agency",
          "90-second team check", "diagnostic and repair field",
        ],
        aliases: ["anti-patterns", "trust erosion", "failure diagnostics", "design repair"],
        summary:
          "Seventeen recurring failure patterns reveal when an interface stops responding to people and quietly shapes interpretation, decisions, or consent. Illustrative before-and-after comparisons make repair discussable and testable.",
      },
      evidence: [
        {
          id: "reflection-failure-diagnostic-field",
          number: "01",
          title: "When Reflection Fails",
          type: "DIAGNOSTIC & REPAIR FIELD",
          description:
            "Explore 17 recurring trust failures through situational filters, illustrated failure/repair comparisons, validation questions, and a 90-second team diagnostic.",
          caption:
            "Select any pattern to inspect the failure and a possible repair side by side. These examples are illustrative, not validated findings. The quick team check and Pause · Name · Restore reference support discussion, not automated certification.",
          canvas: {
            id: "sovereign-failure-patterns",
            eyebrow: "SOVEREIGN UX · FAILURE PATTERNS",
            title: "When Reflection Fails",
            description:
              "An interactive field for identifying why trust breaks, examining a proposed repair, and deciding what needs validation.",
            boardLabel: "DIAGNOSTIC & REPAIR",
            boardSubtitle: "17 failure patterns · illustrative comparisons · repair loop",
            annotations: [],
          },
        },
      ],
      content:
        "Even well-intentioned systems drift. Sometimes it happens through a small tone mismatch or an interruption. Sometimes it is systemic: an assistant gradually assumes authority, a polished recommendation obscures weak evidence, or a privacy promise is contradicted by default behavior. When reflection fails, the system stops responding to the person and begins shaping interpretation or decisions without sufficient visibility.\n\nFailure Patterns names seventeen recurring forms of this misalignment. They are not a catalogue intended to shame design teams. They give teams language for recognizing pressure, ignored context, constrained exits, uninvited emotional interpretation, hidden influence, and loss of agency before those failures become accepted product behavior.\n\nFailure often looks reasonable at first. A modal is described as helpful, a reminder as motivating, a default as convenient, or an AI recommendation as efficient. The question is not whether that feature has a benign intention. The question is whether its actual mechanics preserve clarity, consent, judgment, and the ability to leave or change direction.\n\nSome trust failures appear within an ordinary interaction: The Pushy Pop-Up, The Cheerful System That Doesn’t Listen, The Vanishing Form, or The Locked Path. Others emerge when systems interpret, frame, or act with increasingly opaque authority. The Silent System continues despite missing or outdated information. Structured Confidence wraps weak assumptions in polished presentation. Authority Creep quietly moves from informing toward deciding. Framed Outcome Bias shapes a choice through ordering, defaults, or unexplained recommendations.\n\nA proposed repair should change behavior, not merely soften the wording. Real intent should guide interruptions; departures should have a recoverable path; confusion should interrupt unsafe progression; uncertainty and missing context should be visible; and consequential decisions should remain within authority the person knowingly granted. Even apparent confidence should be traceable to evidence rather than presentation alone.\n\nThe 90-Second Team Check asks whether the interface acknowledges before acting, preserves exits, matches the context offered, fits the moment, embodies its stated values, and makes decision framing visible. These questions are discussion prompts, not a numerical compliance score. If a material trust issue remains, the team should not optimize through it.\n\nThe Repair Loop is deliberately simple: Pause to stop optimizing, Name the misalignment, and Restore the person's agency. That may require clearer controls, changed defaults, less intervention, permission to pause, or an escalation beyond ordinary design practice. The repair is a hypothesis until it is tested with the relevant people and circumstances.\n\nThe evidence artifact pairs each failure with an illustrative contrasting design and a validation question. The comparisons are constructed examples, not observed usability findings or proof of improvement. Their role is to make the behavioral trade-off inspectable and support better decisions about what to test.\n\nBroken reflection is not proof of a failed team. Ignoring it is how a manageable problem becomes systemic. Design integrity is visible in how promptly and openly a system identifies misalignment, offers a way back, and lets the person retain control.",
      insight:
        "The repair isn't the reassuring message. It's the change in system behavior that restores a person's agency — and the evidence that the change actually works.",
    },
    {
      id: "field-signals",
      label: "Field Signals",
      accentStellarType: "strategy",
      subtitle: "What practice reveals — and what remains uncertain.",
      readingTime: 6,
      semantics: {
        keywords: [
          "field signals", "real-world signals", "signals in the field", "observation",
          "reflection", "design practice", "simulation", "evidence integrity",
          "source provenance", "decision framing", "authority", "living canon",
        ],
        aliases: ["field observations", "observation record", "observational evidence"],
        summary:
          "Eleven authored signals from design practice, reflection, exploration, and modeling. Each record distinguishes what changed, what it suggests, and what its evidence does not establish.",
      },
      evidence: [
        {
          id: "signals-in-the-field-ledger",
          number: "01",
          title: "Signals in the Field",
          type: "OBSERVATIONAL EVIDENCE LEDGER",
          description:
            "An 11-record observational archive that separates the author's account, interpretation, evidence source, and limitations. Search by situation and inspect what would strengthen each finding.",
          caption:
            "Browse eleven signals without a prescribed sequence. Source types are descriptive, not credibility scores. Related Atlas work is contextual and is not presented as empirical proof; the Evidence Trace navigates sections rather than promoting observations into Canon precedent.",
          canvas: {
            id: "sovereign-field-signals",
            eyebrow: "SOVEREIGN UX · FIELD SIGNALS",
            title: "Signals in the Field",
            description:
              "An observational archive of practice, reflective accounts, exploratory design, and simulation — with each interpretation's evidence boundary visible.",
            boardLabel: "SIGNALS IN THE FIELD",
            boardSubtitle: "11 observations · source and interpretation remain distinct",
            annotations: [],
          },
        },
      ],
      content:
        "Sovereign UX becomes accountable when its ideas are examined against experiences that arose through real work, reflective writing, exploratory design, and modeled scenarios. The eleven Field Signals record moments where clarity, consent, pacing, or authority became visible in practice. They are descriptions, not repeatable templates or automatic proof that the framework works.\n\nThese observations do not all have the same evidentiary status. A first-person reflection about AI dialogue is different from a documented interface change, an insurance journey exercise, or a financial AI scenario. Those differences matter. An authored observation can identify a valuable design question without independently verifying a broader user-behavior claim.\n\nReflection in AI dialogue and long-form interaction raised questions about tone, uncertainty, and continuity. Inviting copy highlighted the difference between readiness and urgency. Reflective writing after automated rejection showed how naming an experience can restore personal clarity, even when an external outcome remains unchanged.\n\nInsurance, property management, and healthcare explorations made pacing, exits, consent, and asymmetric authority newly visible. Investigations into interpretation breakdowns, financial AI framing, modeled user research, and authority boundaries shifted attention from whether a system can produce an answer to how its framing influences judgment. These remain hypotheses or situated accounts wherever independent validation is missing.\n\nRead each signal by asking what happened, what the author inferred, what source actually supports the interpretation, and what further observation could change it. Source material is not silently invented. A related Atlas case study offers context, not proof; a simulation can stress-test a hypothesis, not substitute for live-user evidence when a claim is about real people.\n\nAcross the accounts, the recurring aspiration is quieter systems in which pressure recedes, clarity becomes easier to find, and people remain able to choose. These are not performance claims without measurement. They are reasons to keep observing, questioning, and revising the framework as evidence accumulates.",
      insight:
        "A field signal is a reason to examine an interpretation, not permission to treat it as proven. Sovereign UX stays accountable when observations remain traceable, bounded, and revisable.",
    },
  ],
});
