import { useEffect, useMemo, useRef, useState } from "react";

interface AtlasCommandPaletteProps {
  onOpen?: () => void;
  onSubmit?: (query: string) => void;
  onPreviewDestination?: (destinationId: string | null) => void;
  onActivatePath?: (destinationId: string, query: string) => void;
  onAskAtlas?: (query: string, sourceIds: string[]) => void;
  onComparePaths?: (leftId: string, rightId: string, query: string) => void;
  onAnalyticsEvent?: (event: AtlasSearchAnalyticsEvent) => void;
}

type ResultKind = "ask" | "compare" | "case-study" | "framework" | "experiment" | "observatory";
type SearchIntent = "navigate" | "ask" | "compare" | "explore";
type ActivationState = "idle" | "resolving" | "activated" | "leaving";
type Availability = "available" | "preview" | "planned";
type InteractionMethod = "mouse" | "keyboard" | "touch";

export interface AtlasSearchAnalyticsEvent {
  name:
    | "atlas_search_opened"
    | "atlas_query_submitted"
    | "atlas_result_selected"
    | "atlas_intent_detected"
    | "atlas_ask_started"
    | "atlas_comparison_started"
    | "atlas_no_results"
    | "atlas_path_cancelled";
  properties: {
    queryLength?: number;
    detectedIntent?: SearchIntent;
    resultCount?: number;
    selectedResultType?: ResultKind;
    selectedPosition?: number;
    interactionMethod?: InteractionMethod;
    topic?: string;
  };
}

interface AtlasResult {
  id: string;
  title: string;
  action: string;
  kind: ResultKind;
  meta: string;
  description: string;
  keywords: string[];
  aliases?: string[];
  previewId?: string;
  availability?: Availability;
  release?: string;
}

interface RankedResult {
  result: AtlasResult;
  score: number;
  reason: string;
}

interface ActivationPayload {
  state: ActivationState;
  result: AtlasResult;
  query: string;
  sourceIds: string[];
  comparisonIds?: [string, string];
}

const KIND_COLOR: Record<ResultKind, string> = {
  ask: "#E8C86D",
  compare: "#E8C86D",
  "case-study": "#7FC7FF",
  framework: "#72D99A",
  experiment: "#B18AF4",
  observatory: "#E8C86D",
};

const INTENT_LABEL: Record<SearchIntent, string> = {
  navigate: "NAVIGATE",
  ask: "ASK ATLAS",
  compare: "COMPARE",
  explore: "EXPLORE",
};

const DESTINATIONS: AtlasResult[] = [
  {
    id: "case-studies",
    title: "Explore Case Studies",
    action: "Browse Case Studies",
    kind: "case-study",
    meta: "SYSTEM · 4 SELECTED PROJECTS",
    description: "See Wilson’s strongest product work and the decisions behind it.",
    keywords: ["case studies", "case study", "projects", "portfolio", "work", "recruiter"],
    aliases: ["selected work", "project work", "portfolio projects"],
    previewId: "case-studies",
  },
  {
    id: "agentic-insurance",
    title: "Agentic Insurance",
    action: "Open Agentic Insurance",
    kind: "case-study",
    meta: "CASE STUDY · AI-ASSISTED CLAIMS",
    description: "AI support, claim-adjuster research, and preserved human authority.",
    keywords: ["insurance", "claims", "claim adjuster", "agentic", "human authority"],
    aliases: ["insurance project", "claims project"],
    previewId: "agentic-insurance",
  },
  {
    id: "globality",
    title: "Globality",
    action: "Open Globality",
    kind: "case-study",
    meta: "CASE STUDY · ENTERPRISE AI",
    description: "Conversational procurement workflows designed at enterprise scale.",
    keywords: ["globality", "procurement", "enterprise", "conversational ai", "nlp"],
    aliases: ["enterprise procurement", "procurement ai"],
    previewId: "globality",
  },
  {
    id: "oracle",
    title: "Oracle Higher Education",
    action: "Open Oracle Higher Education",
    kind: "case-study",
    meta: "CASE STUDY · INFORMATION ARCHITECTURE",
    description: "A complex higher-education journey made easier to understand.",
    keywords: ["oracle", "education", "higher education", "journey", "information architecture"],
    aliases: ["oracle education", "higher ed"],
    previewId: "oracle",
  },
  {
    id: "frameworks",
    title: "Explore Frameworks",
    action: "Browse Frameworks",
    kind: "framework",
    meta: "SYSTEM · DESIGN METHODS",
    description: "Understand how Wilson approaches AI, trust, and system behavior.",
    keywords: ["frameworks", "framework", "methods", "process", "thinking", "hiring manager"],
    aliases: ["design methods", "how wilson thinks", "methodology"],
    previewId: "frameworks",
  },
  {
    id: "sovereign-ux",
    title: "Sovereign UX",
    action: "Open Sovereign UX",
    kind: "framework",
    meta: "FRAMEWORK · SOVEREIGN DESIGN",
    description: "Designing for consent, reflection, intervention, and human authority.",
    keywords: ["sovereign ux", "consent", "reflection", "authority", "trust", "ai design"],
    aliases: ["sovereign design", "human authority"],
    previewId: "sovereign-ux",
  },
  {
    id: "behavioral-architecture",
    title: "Behavioral Architecture",
    action: "Open Behavioral Architecture",
    kind: "framework",
    meta: "FRAMEWORK · SOVEREIGN DESIGN",
    description: "Structures that preserve coherent and trustworthy AI behavior.",
    keywords: ["behavioral architecture", "governance", "constraints", "trust", "model behavior"],
    aliases: ["ai governance", "behavior governance"],
    previewId: "behavioral-architecture",
  },
  {
    id: "decision-rights",
    title: "Decision Rights",
    action: "Open Decision Rights",
    kind: "framework",
    meta: "FRAMEWORK · SOVEREIGN DESIGN",
    description: "Defines who may decide, approve, redirect, or intervene.",
    keywords: ["decision rights", "authority", "approval", "intervention", "governance"],
    aliases: ["who decides", "human approval"],
    previewId: "decision-rights",
  },
  {
    id: "authority-drift",
    title: "Authority Drift",
    action: "Open Authority Drift",
    kind: "experiment",
    meta: "EXPERIMENT · SOVEREIGN DESIGN",
    description: "How decision authority gradually shifts from human to system.",
    keywords: ["authority drift", "authority", "drift", "human decision", "ai decision"],
    aliases: ["authority shift", "decision drift"],
    previewId: "authority-drift",
    availability: "preview",
    release: "v1.1",
  },
  {
    id: "mirror-test",
    title: "Mirror Test",
    action: "Open Mirror Test",
    kind: "experiment",
    meta: "EXPERIMENT · AI EVALUATION",
    description: "Testing whether system behavior remains aligned under pressure.",
    keywords: ["mirror test", "evaluation", "alignment", "trust", "behavior"],
    aliases: ["alignment test", "ai evaluation"],
    previewId: "mirror-test",
    availability: "preview",
    release: "v1.1",
  },
  {
    id: "experiments",
    title: "Explore Experiments",
    action: "Browse Experiments",
    kind: "experiment",
    meta: "SYSTEM · ACTIVE EXPLORATIONS",
    description: "Browse questions about AI behavior, authority, and interaction.",
    keywords: ["experiments", "experiment", "research", "ideas", "explorations", "designer"],
    aliases: ["lab", "research experiments", "current ideas"],
    previewId: "experiments",
    availability: "preview",
    release: "v1.1",
  },
  {
    id: "about-wilson",
    title: "Learn About Wilson",
    action: "Open About Wilson",
    kind: "observatory",
    meta: "OBSERVATORY · PROFILE",
    description: "Explore Wilson’s background, journey, and design philosophy.",
    keywords: ["wilson", "about", "profile", "background", "experience", "journey"],
    aliases: ["about wilson", "who is wilson", "designer profile"],
    previewId: "about-wilson",
  },
];

const EMPTY_SUGGESTIONS = [DESTINATIONS[0], DESTINATIONS[4], DESTINATIONS[10], DESTINATIONS[11]];
const ASK_PREFIX = /^(explain|what|why|how|summarize|tell me about|help me understand)\b/i;
const EXPLORE_PREFIX = /^(show me|browse|explore|find|discover)\b/i;
const COMPARE_PREFIX = /^(compare|difference between|how does .* differ from)\b/i;
const COMPARISON_SEPARATOR = /\s+(?:vs\.?|versus|and|with)\s+/i;

const AMBIGUOUS_REFINEMENTS: Record<string, string[]> = {
  design: ["case-studies", "frameworks", "experiments"],
  work: ["case-studies", "about-wilson", "frameworks"],
  ai: ["frameworks", "case-studies", "experiments"],
  trust: ["behavioral-architecture", "sovereign-ux", "agentic-insurance"],
};

function topicForQuery(query: string): string {
  const clean = normalize(query);
  if (/case|project|portfolio|work/.test(clean)) return "case-studies";
  if (/framework|method|governance|authority|trust/.test(clean)) return "frameworks";
  if (/experiment|research|test|drift/.test(clean)) return "experiments";
  if (/wilson|about|profile|background/.test(clean)) return "biography";
  return "unknown";
}

function confidenceLabel(results: RankedResult[], query: string): string {
  if (!query.trim()) return "Four guided entry points";
  if (AMBIGUOUS_REFINEMENTS[normalize(query)]) return "Several interpretations found";
  const top = results[0]?.score ?? 0;
  const second = results[1]?.score ?? 0;
  if (top >= 100 && top - second >= 24) return "Strongest path first";
  if (results.length > 1) return `${Math.min(results.length, 4)} related paths across the Atlas`;
  return "One related path found";
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function inferIntent(query: string): SearchIntent {
  const clean = query.trim();
  if (!clean) return "explore";
  if (COMPARE_PREFIX.test(clean) || /\bvs\.?\b/i.test(clean)) return "compare";
  if (ASK_PREFIX.test(clean) || /\?$/.test(clean)) return "ask";
  if (EXPLORE_PREFIX.test(clean)) return "explore";
  return "navigate";
}

function stripIntentLanguage(query: string, intent: SearchIntent): string {
  if (intent === "compare") return query.replace(COMPARE_PREFIX, "").trim();
  if (intent === "ask") return query.replace(ASK_PREFIX, "").trim();
  if (intent === "explore") return query.replace(EXPLORE_PREFIX, "").trim();
  return query.trim();
}

function scoreResult(result: AtlasResult, query: string): RankedResult {
  const clean = normalize(query);
  const title = normalize(result.title);
  const action = normalize(result.action);
  const description = normalize(result.description);
  const aliases = (result.aliases ?? []).map(normalize);
  const keywords = result.keywords.map(normalize);
  const words = clean.split(" ").filter((word) => word.length > 2);

  let score = 0;
  let reason = result.description;

  if (title === clean || action === clean) {
    score += 120;
    reason = "Direct match for this Atlas destination.";
  } else if (aliases.includes(clean)) {
    score += 105;
    reason = "Matches a common way visitors look for this path.";
  } else if (title.startsWith(clean)) {
    score += 82;
    reason = "Closest title match in the Atlas.";
  } else if (title.includes(clean)) {
    score += 66;
    reason = "Title contains the subject of your search.";
  }

  const matchedKeywords = keywords.filter((keyword) => clean.includes(keyword) || keyword.includes(clean));
  const matchedAliases = aliases.filter((alias) => clean.includes(alias) || alias.includes(clean));
  score += matchedKeywords.length * 28;
  score += matchedAliases.length * 32;

  for (const word of words) {
    if (title.includes(word)) score += 14;
    if (description.includes(word)) score += 7;
    if (keywords.some((keyword) => keyword.includes(word))) score += 10;
    if (aliases.some((alias) => alias.includes(word))) score += 12;
  }

  if (matchedKeywords.length > 0 && score < 100) {
    reason = `Relevant because it connects to ${matchedKeywords.slice(0, 2).join(" and ")}.`;
  } else if (description.includes(clean) && clean.length > 2) {
    reason = "Relevant because this idea appears in the documented work.";
  }

  return { result, score, reason };
}

function findComparisonEntities(query: string): AtlasResult[] {
  const stripped = stripIntentLanguage(query, "compare");
  const parts = stripped.split(COMPARISON_SEPARATOR).map(normalize).filter(Boolean);
  if (parts.length < 2) return [];

  return parts
    .slice(0, 2)
    .map((part) =>
      DESTINATIONS.map((destination) => scoreResult(destination, part))
        .sort((a, b) => b.score - a.score)[0]?.result,
    )
    .filter((result): result is AtlasResult => Boolean(result));
}

function intentGlyph(intent: SearchIntent): string {
  if (intent === "ask") return "✦";
  if (intent === "compare") return "⇄";
  if (intent === "explore") return "◇";
  return "→";
}


function ActivationView({ activation, destinations }: { activation: ActivationPayload; destinations: AtlasResult[] }) {
  const { result, state, query, sourceIds, comparisonIds } = activation;
  const accent = KIND_COLOR[result.kind];
  const sourceTitles = sourceIds
    .map((id) => destinations.find((destination) => destination.id === id)?.title)
    .filter((title): title is string => Boolean(title));
  const comparisonTitles = comparisonIds
    ? comparisonIds.map((id) => destinations.find((destination) => destination.id === id)?.title ?? id)
    : [];

  const heading = result.kind === "ask"
    ? "ASK ATLAS"
    : result.kind === "compare"
      ? "COMPARISON PATH"
      : "PATH ACTIVATED";
  const status = state === "resolving" ? "Resolving path…" : state === "activated" ? "Path aligned" : "Entering Atlas…";

  return (
    <div
      aria-live="polite"
      style={{
        minHeight: 246,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "28px 24px 30px",
        textAlign: "center",
        animation: state === "leaving" ? "atlasActivationLeave 240ms ease-in both" : "atlasActivationIn 260ms cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 66,
          height: 66,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          color: accent,
          fontSize: result.kind === "compare" ? 22 : 24,
          border: `1px solid ${accent}70`,
          background: `radial-gradient(circle, ${accent}28 0 18%, ${accent}10 19% 48%, transparent 50%)`,
          boxShadow: state === "activated" ? `0 0 0 12px ${accent}08, 0 0 42px ${accent}42` : `0 0 28px ${accent}24`,
          transform: state === "activated" ? "scale(1.08)" : "scale(1)",
          transition: "transform 240ms ease-out, box-shadow 240ms ease-out",
          animation: state === "resolving" ? "atlasActivationPulse 900ms ease-in-out infinite" : "none",
        }}
      >
        {result.kind === "ask" ? "✦" : result.kind === "compare" ? "⇄" : "→"}
      </div>

      <div style={{ marginTop: 18, color: accent, fontFamily: '"DM Mono", monospace', fontSize: 8, letterSpacing: "0.2em" }}>{heading}</div>
      <div style={{ marginTop: 8, color: "#FFF0BE", fontFamily: "'EB Garamond', serif", fontSize: 21, lineHeight: 1.2 }}>
        {result.kind === "compare" && comparisonTitles.length === 2 ? `${comparisonTitles[0]} ↔ ${comparisonTitles[1]}` : result.title}
      </div>
      <div style={{ marginTop: 6, maxWidth: 430, color: "rgba(245,235,210,0.6)", fontFamily: "'Inter', sans-serif", fontSize: 11, lineHeight: 1.45 }}>
        {result.kind === "ask" ? query : result.kind === "compare" ? "Building a shared view across both Atlas paths." : `Opening from “${query}”`}
      </div>

      {result.kind === "ask" && sourceTitles.length > 0 && (
        <div style={{ marginTop: 18, width: "min(420px, 100%)", paddingTop: 14, borderTop: "1px solid rgba(232,200,109,0.14)" }}>
          <div style={{ color: "rgba(232,200,109,0.7)", fontFamily: '"DM Mono", monospace', fontSize: 7, letterSpacing: "0.18em", marginBottom: 8 }}>GATHERING FROM {sourceTitles.length} ATLAS SOURCES</div>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 6 }}>
            {sourceTitles.map((title) => (
              <span key={title} style={{ padding: "5px 8px", borderRadius: 999, border: "1px solid rgba(232,200,109,0.18)", background: "rgba(232,200,109,0.05)", color: "rgba(245,235,210,0.66)", fontFamily: "'Inter', sans-serif", fontSize: 9 }}>{title}</span>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 18, color: "rgba(245,235,210,0.44)", fontFamily: '"DM Mono", monospace', fontSize: 7, letterSpacing: "0.16em" }}>{status}</div>
    </div>
  );
}

export default function AtlasCommandPalette({
  onOpen,
  onSubmit,
  onPreviewDestination,
  onActivatePath,
  onAskAtlas,
  onComparePaths,
  onAnalyticsEvent,
}: AtlasCommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activation, setActivation] = useState<ActivationPayload | null>(null);
  const [activationError, setActivationError] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [lastAnnouncedIntent, setLastAnnouncedIntent] = useState<SearchIntent | null>(null);
  const blurTimer = useRef<number | null>(null);
  const activationTimers = useRef<number[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const intent = useMemo(() => inferIntent(query), [query]);
  const rankedForStatus = useMemo(() => {
    const topicalQuery = stripIntentLanguage(query.trim(), intent) || query.trim();
    return topicalQuery
      ? DESTINATIONS.map((result) => scoreResult(result, topicalQuery)).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score)
      : [];
  }, [intent, query]);

  const visibleResults = useMemo(() => {
    const clean = query.trim();
    if (!clean) return EMPTY_SUGGESTIONS;

    const ambiguousIds = AMBIGUOUS_REFINEMENTS[normalize(clean)];
    if (ambiguousIds) {
      return ambiguousIds
        .map((id) => DESTINATIONS.find((destination) => destination.id === id))
        .filter((result): result is AtlasResult => Boolean(result))
        .map((result) => ({
          ...result,
          description: result.id === "case-studies"
            ? "Explore design work through selected product case studies."
            : result.id === "frameworks"
              ? "Explore the methods behind Wilson’s design decisions."
              : "Explore active design and AI research experiments.",
        }));
    }

    const topicalQuery = stripIntentLanguage(clean, intent) || clean;
    const ranked = DESTINATIONS.map((result) => scoreResult(result, topicalQuery))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score);

    const results: AtlasResult[] = [];

    if (intent === "compare") {
      const entities = findComparisonEntities(clean);
      if (entities.length === 2 && entities[0].id !== entities[1].id) {
        results.push({
          id: `compare-${entities[0].id}-${entities[1].id}`,
          title: "Compare in Atlas",
          action: `Compare ${entities[0].title} and ${entities[1].title}`,
          kind: "compare",
          meta: "AI ASSIST · SIDE-BY-SIDE REASONING",
          description: `${entities[0].title} ↔ ${entities[1].title}`,
          keywords: [],
        });
        results.push(...entities);
      }
    } else if (intent === "ask") {
      results.push({
        id: `ask-${normalize(clean)}`,
        title: "Ask Atlas",
        action: clean,
        kind: "ask",
        meta: "AI ASSIST · GROUNDED IN THE ATLAS",
        description: clean,
        keywords: [],
      });
    }

    for (const item of ranked) {
      if (results.some((existing) => existing.id === item.result.id)) continue;
      results.push({ ...item.result, description: item.reason });
      if (results.length === 4) break;
    }

    return results.slice(0, 4);
  }, [intent, query]);

  const hasResults = visibleResults.length > 0;
  const activeResult = visibleResults[activeIndex];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => {
      media.removeEventListener?.("change", update);
      activationTimers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    if (!query.trim() || lastAnnouncedIntent === intent) return;
    setLastAnnouncedIntent(intent);
    onAnalyticsEvent?.({
      name: "atlas_intent_detected",
      properties: { queryLength: query.trim().length, detectedIntent: intent, topic: topicForQuery(query) },
    });
  }, [intent, lastAnnouncedIntent, onAnalyticsEvent, query]);

  useEffect(() => {
    if (isOpen && query.trim() && visibleResults.length === 0) {
      onAnalyticsEvent?.({
        name: "atlas_no_results",
        properties: { queryLength: query.trim().length, detectedIntent: intent, resultCount: 0, topic: topicForQuery(query) },
      });
    }
  }, [intent, isOpen, onAnalyticsEvent, query, visibleResults.length]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen(true);
        setActiveIndex(0);
        inputRef.current?.focus();
        onOpen?.();
        onAnalyticsEvent?.({ name: "atlas_search_opened", properties: { interactionMethod: "keyboard" } });
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [onAnalyticsEvent, onOpen]);

  useEffect(() => {
    if (activeIndex >= visibleResults.length) setActiveIndex(0);
  }, [activeIndex, visibleResults.length]);

  useEffect(() => {
    if (!isOpen || activation || !activeResult || activeResult.kind === "ask" || activeResult.kind === "compare") {
      onPreviewDestination?.(null);
      return;
    }
    onPreviewDestination?.(activeResult.previewId ?? activeResult.id);
    return () => onPreviewDestination?.(null);
  }, [activation, activeResult, isOpen, onPreviewDestination]);

  const clearActivationTimers = () => {
    activationTimers.current.forEach((timer) => window.clearTimeout(timer));
    activationTimers.current = [];
  };

  const finishActivation = (payload: ActivationPayload) => {
    const { result, query: activationQuery, sourceIds, comparisonIds } = payload;

    try {
      if (result.kind === "ask") {
        onAnalyticsEvent?.({ name: "atlas_ask_started", properties: { queryLength: activationQuery.length, detectedIntent: "ask", resultCount: sourceIds.length, topic: topicForQuery(activationQuery) } });
        onAskAtlas?.(activationQuery, sourceIds);
        if (!onAskAtlas) onSubmit?.(result.action);
      } else if (result.kind === "compare" && comparisonIds) {
        onAnalyticsEvent?.({ name: "atlas_comparison_started", properties: { queryLength: activationQuery.length, detectedIntent: "compare", resultCount: 2, topic: topicForQuery(activationQuery) } });
        onComparePaths?.(comparisonIds[0], comparisonIds[1], activationQuery);
        if (!onComparePaths) onSubmit?.(result.action);
      } else {
        onActivatePath?.(result.previewId ?? result.id, activationQuery);
        if (!onActivatePath) onSubmit?.(result.action);
      }
    } catch {
      setActivationError("That path could not be opened. Related Atlas paths are still available below.");
      setActivation(null);
      setIsOpen(true);
      return;
    }
  };

  const activateResult = (result: AtlasResult, interactionMethod: InteractionMethod = "mouse") => {
    const cleanQuery = query.trim() || result.action;
    const groundedSources = visibleResults
      .filter((item) => item.kind !== "ask" && item.kind !== "compare")
      .map((item) => item.previewId ?? item.id)
      .slice(0, 3);
    const comparisonEntities = result.kind === "compare" ? findComparisonEntities(cleanQuery) : [];
    const comparisonIds = comparisonEntities.length === 2
      ? [comparisonEntities[0].id, comparisonEntities[1].id] as [string, string]
      : undefined;

    const payload: ActivationPayload = {
      state: "resolving",
      result,
      query: cleanQuery,
      sourceIds: groundedSources,
      comparisonIds,
    };

    clearActivationTimers();
    setActivationError(null);
    onPreviewDestination?.(null);
    onAnalyticsEvent?.({
      name: "atlas_result_selected",
      properties: {
        queryLength: cleanQuery.length,
        detectedIntent: intent,
        resultCount: visibleResults.length,
        selectedResultType: result.kind,
        selectedPosition: Math.max(0, visibleResults.findIndex((item) => item.id === result.id)) + 1,
        interactionMethod,
        topic: topicForQuery(cleanQuery),
      },
    });
    setActivation(payload);

    const alignedDelay = prefersReducedMotion ? 0 : 260;
    const leaveDelay = prefersReducedMotion ? 40 : 460;
    const finishDelay = prefersReducedMotion ? 80 : 500;

    activationTimers.current.push(window.setTimeout(() => {
      setActivation((current) => current ? { ...current, state: "activated" } : current);
    }, alignedDelay));

    activationTimers.current.push(window.setTimeout(() => {
      setActivation((current) => current ? { ...current, state: "leaving" } : current);
    }, leaveDelay));

    activationTimers.current.push(window.setTimeout(() => {
      finishActivation(payload);
      setIsOpen(false);
      setActivation(null);
    }, finishDelay));
  };

  const submitQuery = (value: string) => {
    const clean = value.trim();
    if (!clean) return;
    const synthetic: AtlasResult = {
      id: `query-${normalize(clean)}`,
      title: intent === "ask" ? "Ask Atlas" : "Open Atlas Path",
      action: clean,
      kind: intent === "ask" ? "ask" : "observatory",
      meta: intent === "ask" ? "AI ASSIST · GROUNDED IN THE ATLAS" : "ATLAS · DIRECT QUERY",
      description: clean,
      keywords: [],
      availability: "available",
    };
    onAnalyticsEvent?.({ name: "atlas_query_submitted", properties: { queryLength: clean.length, detectedIntent: intent, resultCount: visibleResults.length, interactionMethod: "keyboard", topic: topicForQuery(clean) } });
    activateResult(synthetic, "keyboard");
  };

  return (
    <div
      className="atlas-command-palette"
      role={isOpen ? "dialog" : undefined}
      aria-modal={isOpen ? "false" : undefined}
      aria-label={isOpen ? "Search the Sovereign Atlas" : undefined}
      style={{
        position: "absolute",
        top: 26,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        pointerEvents: "auto",
        width: "min(610px, calc(100vw - 40px))",
      }}
    >
      <div
        style={{
          width: "100%",
          background: "rgba(9,10,16,0.9)",
          border: `1px solid ${isOpen ? "rgba(232,200,109,0.64)" : "rgba(232,200,109,0.38)"}`,
          borderRadius: isOpen ? "18px" : "16px",
          backdropFilter: "blur(24px)",
          boxShadow: isOpen
            ? "0 28px 90px rgba(0,0,0,0.58), 0 0 48px rgba(232,200,109,0.12)"
            : "0 18px 60px rgba(0,0,0,0.38), 0 0 30px rgba(232,200,109,0.08)",
          overflow: "hidden",
          transition: "border-color 220ms ease-out, border-radius 220ms ease-out, box-shadow 220ms ease-out",
        }}
      >
        <div style={{ width: "100%", minHeight: 52, display: "flex", alignItems: "center", gap: 14, padding: "0 20px 0 22px" }}>
          <div aria-hidden="true" style={{ color: "#E8C86D", fontSize: 18, lineHeight: 1, opacity: isOpen || query.trim() ? 1 : 0.72, transition: "opacity 220ms ease-out", flexShrink: 0 }}>
            ✦
          </div>

          <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
            <input
              ref={inputRef}
              value={query}
              disabled={Boolean(activation)}
              role="combobox"
              aria-label="Search the Sovereign Atlas"
              aria-expanded={isOpen}
              aria-controls="atlas-search-results"
              aria-autocomplete="list"
              aria-activedescendant={isOpen && activeResult ? `atlas-result-${activeResult.id}` : undefined}
              placeholder="What would you like to explore today?"
              onFocus={() => {
                if (blurTimer.current) window.clearTimeout(blurTimer.current);
                setIsOpen(true);
                if (!query.trim()) setActiveIndex(0);
                onOpen?.();
                onAnalyticsEvent?.({ name: "atlas_search_opened", properties: { interactionMethod: "keyboard" } });
              }}
              onClick={() => {
                setIsOpen(true);
                onOpen?.();
                onAnalyticsEvent?.({ name: "atlas_search_opened", properties: { interactionMethod: "mouse" } });
              }}
              onBlur={() => {
                if (activation) return;
                blurTimer.current = window.setTimeout(() => setIsOpen(false), 140);
              }}
              onChange={(event) => {
                setQuery(event.currentTarget.value);
                setActivationError(null);
                setIsOpen(true);
                setActiveIndex(0);
                onOpen?.();
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  if (hasResults) setActiveIndex((previous) => (previous + 1) % visibleResults.length);
                }
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  if (hasResults) setActiveIndex((previous) => (previous === 0 ? visibleResults.length - 1 : previous - 1));
                }
                if (event.key === "Enter") {
                  event.preventDefault();
                  if (activation) return;
                  const selected = isOpen && hasResults ? visibleResults[activeIndex] : undefined;
                  if (selected) activateResult(selected, "keyboard");
                  else submitQuery(query);
                }
                if (event.key === "Escape") {
                  if (activation?.state === "resolving") {
                    clearActivationTimers();
                    setActivation(null);
                    onAnalyticsEvent?.({ name: "atlas_path_cancelled", properties: { queryLength: query.trim().length, detectedIntent: intent, interactionMethod: "keyboard", topic: topicForQuery(query) } });
                    return;
                  }
                  setIsOpen(false);
                  onPreviewDestination?.(null);
                  event.currentTarget.blur();
                }
              }}
              style={{
                width: "100%",
                height: 52,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#F4EBD0",
                fontFamily: "'EB Garamond', serif",
                fontSize: 16,
                letterSpacing: "0.005em",
                padding: query.trim() ? "8px 0 0" : 0,
                minWidth: 0,
              }}
            />
            {query.trim() && (
              <div
                aria-live="polite"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 7,
                  color: "rgba(232,200,109,0.72)",
                  fontFamily: '"DM Mono", monospace',
                  fontSize: 7,
                  letterSpacing: "0.18em",
                  pointerEvents: "none",
                  animation: "atlasIntentIn 160ms ease-out",
                }}
              >
                {INTENT_LABEL[intent]}
              </div>
            )}
          </div>

          {query.trim() && !activation && (
            <button
              type="button"
              aria-label="Clear Atlas search"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => { setQuery(""); setActiveIndex(0); setActivationError(null); inputRef.current?.focus(); }}
              style={{ width: 28, height: 28, border: 0, background: "transparent", color: "rgba(245,235,210,0.48)", cursor: "pointer", fontSize: 16, lineHeight: 1 }}
            >
              ×
            </button>
          )}

          <button
            aria-label={`${INTENT_LABEL[intent].toLowerCase()} query`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => submitQuery(query)}
            style={{
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#E8C86D",
              background: "transparent",
              border: "none",
              cursor: query.trim() ? "pointer" : "default",
              fontFamily: "'EB Garamond', serif",
              fontSize: intent === "compare" ? 15 : 18,
              lineHeight: 1,
              padding: 0,
              opacity: query.trim() ? 1 : 0.42,
              transition: "opacity 160ms ease-out, transform 160ms ease-out",
            }}
          >
            {intentGlyph(intent)}
          </button>
        </div>

        {isOpen && (
          <div
            id="atlas-search-results"
            role="listbox"
            style={{
              position: "relative",
              borderTop: "1px solid rgba(232,200,109,0.14)",
              padding: 12,
              overflow: "hidden",
              background:
                "radial-gradient(circle at 10% 0%, rgba(232,200,109,0.055), transparent 30%), radial-gradient(circle at 92% 88%, rgba(177,138,244,0.045), transparent 34%)",
              animation: "atlasPaletteIn 220ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {!activation && (
              <div id="atlas-search-status" aria-live="polite" style={{ padding: "1px 14px 10px", color: "rgba(245,235,210,0.42)", fontFamily: '"DM Mono", monospace', fontSize: 7, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                {confidenceLabel(rankedForStatus, query)}
              </div>
            )}
            {activationError && !activation && (
              <div role="status" style={{ margin: "0 4px 10px", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(232,200,109,0.2)", background: "rgba(232,200,109,0.06)", color: "rgba(245,235,210,0.7)", fontFamily: "'Inter', sans-serif", fontSize: 10, lineHeight: 1.45 }}>
                {activationError}
              </div>
            )}
            {activation ? (
              <ActivationView activation={activation} destinations={DESTINATIONS} />
            ) : hasResults && (
              <svg aria-hidden="true" viewBox={`0 0 100 ${visibleResults.length * 64}`} preserveAspectRatio="none" style={{ position: "absolute", inset: "14px auto 14px 23px", width: 34, height: "calc(100% - 28px)", overflow: "visible", pointerEvents: "none", opacity: 0.78 }}>
                <path
                  d={`M 50 10 ${visibleResults.map((_, index) => { const y = 28 + index * 64; const bend = index % 2 === 0 ? 18 : 82; return `Q ${bend} ${y - 16}, 50 ${y}`; }).join(" ")}`}
                  fill="none"
                  stroke="rgba(232,200,109,0.16)"
                  strokeWidth="1.2"
                  strokeDasharray="2 5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            )}

            {!activation && (hasResults ? (
              visibleResults.map((result, index) => {
                const isActive = index === activeIndex;
                const accent = KIND_COLOR[result.kind];
                const isAssist = result.kind === "ask" || result.kind === "compare";

                return (
                  <button
                    key={result.id}
                    id={`atlas-result-${result.id}`}
                    role="option"
                    aria-selected={isActive}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => activateResult(result, "mouse")}
                    onMouseEnter={() => setActiveIndex(index)}
                    style={{
                      width: "100%",
                      position: "relative",
                      display: "grid",
                      gridTemplateColumns: "42px minmax(0, 1fr) 24px",
                      alignItems: "center",
                      gap: 14,
                      padding: isAssist ? "14px 16px" : "13px 16px",
                      marginBottom: index < visibleResults.length - 1 ? 6 : 0,
                      background: isActive
                        ? isAssist
                          ? "linear-gradient(105deg, rgba(232,200,109,0.18), rgba(232,200,109,0.08))"
                          : "rgba(255,255,255,0.055)"
                        : isAssist
                          ? "linear-gradient(105deg, rgba(232,200,109,0.11), rgba(232,200,109,0.035))"
                          : "rgba(255,255,255,0.018)",
                      border: `1px solid ${isActive ? `${accent}70` : isAssist ? "rgba(232,200,109,0.30)" : "rgba(255,255,255,0.075)"}`,
                      borderRadius: 12,
                      color: "#F4EBD0",
                      textAlign: "left",
                      cursor: "pointer",
                      boxShadow: isActive ? `0 0 24px ${accent}12, inset 0 0 18px ${accent}08` : "none",
                      transition: "background 180ms ease-out, border-color 180ms ease-out, box-shadow 180ms ease-out, transform 180ms ease-out",
                      transform: isActive ? "translateX(3px)" : "translateX(0)",
                      animation: `atlasResultIn 260ms cubic-bezier(0.16,1,0.3,1) ${index * 38}ms both`,
                    }}
                  >
                    <span aria-hidden="true" style={{ position: "absolute", left: 10, top: "50%", width: isActive ? 18 : 8, height: 1, transform: "translateY(-50%)", background: `linear-gradient(90deg, ${accent}00, ${accent}AA)`, opacity: isActive ? 0.9 : 0, transition: "width 180ms ease-out, opacity 180ms ease-out" }} />
                    <span
                      aria-hidden="true"
                      style={{
                        position: "relative",
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: accent,
                        fontSize: isAssist ? 17 : 10,
                        background: `radial-gradient(circle, ${accent}22 0 24%, ${accent}0C 25% 52%, transparent 54%)`,
                        border: `1px solid ${accent}${isActive ? "46" : "24"}`,
                        boxShadow: isActive ? `0 0 0 6px ${accent}08, 0 0 24px ${accent}30` : `0 0 16px ${accent}16`,
                        transition: "border-color 180ms ease-out, box-shadow 180ms ease-out, transform 180ms ease-out",
                        transform: isActive ? "scale(1.06)" : "scale(1)",
                      }}
                    >
                      {result.kind === "ask" ? "✦" : result.kind === "compare" ? "⇄" : <span style={{ width: 7, height: 7, borderRadius: "50%", background: accent, boxShadow: `0 0 12px ${accent}` }} />}
                    </span>

                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, color: isActive || isAssist ? "#FFF0BE" : "rgba(245,235,210,0.92)", fontFamily: "'EB Garamond', serif", fontSize: isAssist ? 17 : 16, lineHeight: 1.15, marginBottom: 5 }}>
                        <span>{result.title}</span>
                        {isActive && (
                          <span style={{ color: `${accent}B8`, fontFamily: '"DM Mono", monospace', fontSize: 7, letterSpacing: "0.12em", whiteSpace: "nowrap" }}>
                            PATH {String(index + 1).padStart(2, "0")}
                          </span>
                        )}
                      </span>
                      <span style={{ display: "block", color: accent, fontFamily: '"DM Mono", monospace', fontSize: 8, lineHeight: 1.25, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 5 }}>
                        {result.meta}
                        {result.availability && result.availability !== "available" ? ` · ${result.availability === "preview" ? `AVAILABLE IN ATLAS ${result.release ?? "SOON"}` : "PLANNED"}` : ""}
                      </span>
                      <span style={{ display: "block", color: "rgba(245,235,210,0.62)", fontFamily: "'Inter', sans-serif", fontSize: 11, lineHeight: 1.4, whiteSpace: "normal" }}>
                        {result.description}
                      </span>
                    </span>

                    <span aria-hidden="true" style={{ color: "#E8C86D", fontFamily: "'EB Garamond', serif", fontSize: 18, justifySelf: "end", opacity: isActive ? 1 : 0.62 }}>
                      →
                    </span>
                  </button>
                );
              })
            ) : (
              <div style={{ padding: "16px 16px 18px" }}>
                <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, color: "rgba(245,235,210,0.84)", marginBottom: 5 }}>No clear path found.</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, lineHeight: 1.45, color: "rgba(245,235,210,0.48)", marginBottom: 12 }}>Try a project, company, framework, or design topic.</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["AI governance", "case studies", "about Wilson"].map((suggestion) => (
                    <button key={suggestion} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { setQuery(suggestion); setActiveIndex(0); }} style={{ minHeight: 36, padding: "7px 10px", borderRadius: 999, border: "1px solid rgba(232,200,109,0.16)", background: "rgba(232,200,109,0.04)", color: "rgba(245,235,210,0.66)", fontFamily: "'Inter', sans-serif", fontSize: 10, cursor: "pointer" }}>{suggestion}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes atlasPaletteIn {
          from { opacity: 0; transform: translateY(-8px) scaleY(0.985); transform-origin: top; }
          to { opacity: 1; transform: translateY(0) scaleY(1); transform-origin: top; }
        }
        @keyframes atlasResultIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes atlasIntentIn {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes atlasActivationIn {
          from { opacity: 0; transform: translateY(8px) scale(0.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes atlasActivationLeave {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.97); }
        }
        @keyframes atlasActivationPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @media (max-width: 640px) {
          .atlas-command-palette {
            position: fixed !important;
            inset: 0 !important;
            transform: none !important;
            width: 100vw !important;
            padding: 12px !important;
            display: flex !important;
            align-items: flex-start !important;
          }
          .atlas-command-palette > div {
            max-height: calc(100dvh - 24px);
            overflow: auto !important;
            border-radius: 16px !important;
          }
          #atlas-search-results button[role="option"] { min-height: 72px; }
        }
        @media (prefers-reduced-motion: reduce) {
          #atlas-search-results,
          #atlas-search-results button,
          #atlas-search-results + * { animation: none !important; }
        }
      `}</style>
    </div>
  );
}