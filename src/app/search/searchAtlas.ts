import type {
  AtlasSearchEntry,
  AtlasSearchMatch,
  AtlasSearchMatchedBy,
  IndexedAtlasSearchEntry,
} from "../types/atlasSearch";
import {
  normalizeSearchQuery,
  normalizeSearchText,
  tokenizeSearchQuery,
  tokenizeSearchText,
} from "./normalizeSearchQuery";

const INTENT_ENTRY_BOOSTS: Record<string, Record<string, number>> = {
  trust: {
    "behavioral-architecture": 76,
    "sovereign-ux": 70,
    "design-philosophy": 58,
    "agentic-insurance": 52,
    "authority-gradient": 48,
  },
  "human-authority": {
    "authority-gradient": 82,
    "agentic-insurance": 62,
    "sovereign-ux": 58,
    "authority-drift": 54,
    "behavioral-architecture": 42,
  },
  governance: {
    "behavioral-architecture": 82,
    "authority-gradient": 76,
    "sovereign-ux": 42,
    "agentic-insurance": 36,
  },
  "ai-behavior": {
    "behavioral-architecture": 86,
    "design-philosophy": 64,
    "authority-drift": 60,
    "sovereign-ux": 48,
  },
};

export function indexAtlasSearchEntries(
  entries: readonly AtlasSearchEntry[],
): IndexedAtlasSearchEntry[] {
  return entries.map((entry) => {
    const normalizedAliases = entry.aliases.map(normalizeSearchText);
    const normalizedKeywords = entry.keywords.map(normalizeSearchText);
    const normalizedTopics = entry.topics.map(normalizeSearchText);
    const normalizedDescription = normalizeSearchText(entry.description);
    const normalizedFieldTerms = new Set(
      [
        entry.title,
        entry.typeLabel,
        entry.parentLabel,
        ...entry.aliases,
        ...entry.keywords,
        ...entry.topics,
      ].flatMap(tokenizeSearchText),
    );

    return {
      ...entry,
      normalizedTitle: normalizeSearchText(entry.title),
      normalizedAliases,
      normalizedKeywords,
      normalizedTopics,
      normalizedDescription,
      normalizedFieldTerms,
      normalizedDescriptionTerms: new Set(tokenizeSearchText(entry.description)),
    };
  });
}

function isIndexedEntry(
  entry: AtlasSearchEntry | IndexedAtlasSearchEntry,
): entry is IndexedAtlasSearchEntry {
  return "normalizedTitle" in entry;
}

function intentBoost(entry: AtlasSearchEntry, query: string) {
  let boost = 0;
  let intentMatched = false;

  if (/\b(strongest work|best (work|projects?)|portfolio|case stud(y|ies)|product work)\b/.test(query)) {
    if (entry.id === "case-studies") boost += 126;
    else if (entry.kind === "case-study") boost += 44;
    intentMatched = entry.id === "case-studies" || entry.kind === "case-study";
  }

  if (/\b(ai (design )?frameworks?|design methods?|methodolog(y|ies)|how wilson thinks)\b/.test(query)) {
    if (entry.id === "frameworks") boost += 126;
    else if (entry.kind === "framework") boost += 46;
    intentMatched = intentMatched || entry.id === "frameworks" || entry.kind === "framework";
  }

  if (/\b(about wilson|wilson|background|experience|career|journey|profile|philosophy)\b/.test(query)) {
    if (entry.id === "about-wilson") {
      boost += 150;
      intentMatched = true;
    }
  }

  const thematicRules: Array<[RegExp, keyof typeof INTENT_ENTRY_BOOSTS]> = [
    [/\b(ai trust|trust|trustworthy)\b/, "trust"],
    [/\b(human authority|human judgment|user authority)\b/, "human-authority"],
    [/\b(governance|governed)\b/, "governance"],
    [/\b(ai behavior|model behavior|system behavior)\b/, "ai-behavior"],
  ];

  thematicRules.forEach(([pattern, rule]) => {
    if (!pattern.test(query)) return;
    const entryBoost = INTENT_ENTRY_BOOSTS[rule][entry.id] ?? 0;
    boost += entryBoost;
    intentMatched = intentMatched || entryBoost > 0;
  });

  return { boost, intentMatched };
}

function scoreEntry(entry: IndexedAtlasSearchEntry, query: string) {
  let score = 0;
  let directWeight = 0;
  let matchedBy: AtlasSearchMatchedBy = "description";

  const setDirectMatch = (weight: number, reason: AtlasSearchMatchedBy) => {
    score += weight;
    if (weight > directWeight) {
      directWeight = weight;
      matchedBy = reason;
    }
  };

  if (entry.normalizedTitle === query) setDirectMatch(160, "exact-title");
  else if (entry.normalizedAliases.includes(query)) setDirectMatch(145, "alias");
  else if (entry.normalizedTitle.startsWith(query)) setDirectMatch(110, "title-prefix");
  else if (entry.normalizedTitle.includes(query)) setDirectMatch(90, "title-prefix");

  if (entry.normalizedKeywords.includes(query)) setDirectMatch(70, "keyword");
  else if (entry.normalizedKeywords.some((value) => value.includes(query))) {
    setDirectMatch(52, "keyword");
  }

  if (entry.normalizedTopics.includes(query)) setDirectMatch(60, "topic");
  else if (entry.normalizedTopics.some((value) => value.includes(query))) {
    setDirectMatch(46, "topic");
  }

  const terms = tokenizeSearchQuery(query);
  let matchedTerms = 0;
  let descriptionTerms = 0;

  terms.forEach((term) => {
    if (entry.normalizedFieldTerms.has(term)) {
      score += 18;
      matchedTerms += 1;
      return;
    }
    if (entry.normalizedDescriptionTerms.has(term)) {
      score += 8;
      descriptionTerms += 1;
    }
  });

  if (terms.length > 1 && matchedTerms + descriptionTerms === terms.length) score += 12;
  if (directWeight === 0 && matchedTerms > 0) matchedBy = "keyword";
  if (directWeight === 0 && matchedTerms === 0 && descriptionTerms > 0) matchedBy = "description";

  const intent = intentBoost(entry, query);
  score += intent.boost;
  if (intent.intentMatched && intent.boost > directWeight) matchedBy = "intent-rule";

  if (score > 0) score += Math.min(15, Math.max(0, entry.priority ?? 0));

  return { score, matchedBy };
}

export function searchAtlas({
  query,
  entries,
  limit = 4,
  includePlanned = false,
}: {
  query: string;
  entries: readonly AtlasSearchEntry[] | readonly IndexedAtlasSearchEntry[];
  limit?: number;
  includePlanned?: boolean;
}): AtlasSearchMatch[] {
  const normalizedQuery = normalizeSearchQuery(query);
  if (!normalizedQuery) return [];

  const indexedEntries = entries.map((entry) =>
    isIndexedEntry(entry) ? entry : indexAtlasSearchEntries([entry])[0],
  );

  return indexedEntries
    .flatMap((entry) => {
      const explicitlyRequested = entry.normalizedTitle === normalizedQuery
        || entry.normalizedAliases.includes(normalizedQuery);
      if (entry.availability === "planned" && !includePlanned && !explicitlyRequested) {
        return [];
      }

      const match = scoreEntry(entry, normalizedQuery);
      return match.score > 0
        ? [{ entry: entry as AtlasSearchEntry, ...match }]
        : [];
    })
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, Math.max(0, Math.min(4, limit)));
}

export function topicForAtlasQuery(query: string) {
  const normalized = normalizeSearchQuery(query);
  if (/case stud(y|ies)|portfolio|strongest work|best projects?/.test(normalized)) return "case-studies";
  if (/framework|methodolog|design method/.test(normalized)) return "frameworks";
  if (/wilson|background|career|journey|profile|philosophy/.test(normalized)) return "biography";
  if (/trust|authority|governance|ai behavior|model behavior/.test(normalized)) return "ai-governance";
  return "atlas-navigation";
}
