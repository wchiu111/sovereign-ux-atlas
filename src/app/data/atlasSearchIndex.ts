import { ATLAS_ENTRIES } from "../content";
import sovereignUx from "../content/frameworks/sovereign-ux";
import type { AtlasEntry } from "../content/types";
import { ATLAS_SYSTEM_CONFIGS } from "./atlasSystemConfig";
import { indexAtlasSearchEntries } from "../search/searchAtlas";
import type {
  AtlasSearchAvailability,
  AtlasSearchEntry,
  AtlasSearchKind,
} from "../types/atlasSearch";

interface SearchEntryOverride {
  title?: string;
  aliases?: string[];
  keywords?: string[];
  topics?: string[];
  priority?: number;
  availability?: AtlasSearchAvailability;
  releaseVersion?: string;
}

const SEARCH_OVERRIDES: Record<string, SearchEntryOverride> = {
  "case-studies": {
    topics: ["strongest work", "best projects", "portfolio", "product work", "case studies"],
    priority: 14,
  },
  "agentic-insurance": {
    topics: ["insurance", "claims", "AI trust", "human authority", "decision rights"],
    priority: 11,
  },
  globality: {
    topics: ["procurement", "enterprise AI", "navigation", "workflows", "product design"],
    priority: 10,
  },
  oracle: {
    title: "Oracle Higher Education",
    aliases: ["Oracle"],
    topics: ["higher education", "information architecture", "design systems", "enterprise cloud"],
    priority: 9,
  },
  "sovereign-atlas-cs": {
    aliases: ["sovereign-atlas", "atlas portfolio"],
    topics: ["portfolio", "knowledge systems", "search", "spatial navigation", "design engineering"],
    priority: 12,
  },
  frameworks: {
    topics: ["AI frameworks", "design methods", "methodology", "how Wilson thinks"],
    priority: 14,
  },
  "sovereign-ux": {
    aliases: ["sovereign design"],
    topics: ["AI trust", "human authority", "consent", "autonomy", "reflection"],
    priority: 10,
    availability: "preview",
    releaseVersion: "V1.1",
  },
  "behavioral-architecture": {
    topics: ["AI behavior", "governance", "trust", "constraints", "alignment", "model design"],
    priority: 12,
  },
  "authority-gradient": {
    topics: ["human authority", "governance", "decision rights", "authority gradient", "delegation"],
    priority: 11,
  },
  "application-kit": {
    topics: ["design systems", "framework adoption", "governance", "organizational scale"],
    priority: 8,
  },
  "relational-ai-literacy": {
    topics: ["AI literacy", "human AI relationship", "reflection", "mirror testing"],
    priority: 5,
  },
  "regenerative-systems": {
    topics: ["system recovery", "alignment", "drift", "resilience"],
    priority: 4,
  },
  "presence-navigation": {
    topics: ["AI presence", "calibrated deference", "attention", "restraint"],
    priority: 4,
  },
  experiments: {
    topics: ["experiments", "research", "active explorations", "AI behavior"],
    priority: 12,
  },
  "authority-drift": {
    topics: ["human authority", "AI behavior", "governance", "delegation", "decision making"],
    priority: 11,
  },
  "mirror-test": {
    topics: ["AI trust", "evaluation", "alignment", "AI behavior", "agreement"],
    priority: 10,
    availability: "preview",
    releaseVersion: "V1.1",
  },
  "ai-evaluation": {
    topics: ["AI evaluation", "benchmarking", "relational quality"],
    priority: 4,
  },
  "atlas-prototypes": {
    topics: ["prototyping", "spatial navigation", "information architecture"],
    priority: 3,
  },
  "emotional-heatmapping": {
    topics: ["emotion", "biometrics", "interfaces"],
    priority: 2,
  },
  "future-concepts": {
    topics: ["future interfaces", "interaction patterns", "calibrated deference"],
    priority: 2,
  },
  "post-filter-shopping": {
    topics: ["shopping", "recommendations", "filter bubbles", "decision quality"],
    priority: 2,
  },
  "about-wilson": {
    topics: ["about Wilson", "background", "experience", "career", "journey", "philosophy"],
    priority: 14,
  },
};

const AVAILABLE_ENTRY_IDS = new Set([
  "agentic-insurance",
  "globality",
  "oracle",
  "sovereign-atlas-cs",
  "authority-gradient",
  "behavioral-architecture",
  "application-kit",
  "authority-drift",
]);

const KIND_BY_CATEGORY: Record<AtlasEntry["category"], AtlasSearchKind> = {
  "case-study": "case-study",
  framework: "framework",
  experiment: "experiment",
};

const TYPE_BY_CATEGORY: Record<AtlasEntry["category"], string> = {
  "case-study": "CASE STUDY",
  framework: "FRAMEWORK",
  experiment: "EXPERIMENT",
};

const PARENT_BY_CATEGORY: Record<AtlasEntry["category"], string> = {
  "case-study": "CASE STUDIES",
  framework: "FRAMEWORKS",
  experiment: "EXPERIMENTS",
};

function displayTitle(value: string) {
  if (value !== value.toUpperCase()) return value;
  return value
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\bAi\b/g, "AI")
    .replace(/\bUx\b/g, "UX");
}

function unique(values: Array<string | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value?.trim()))));
}

function availabilityFor(entry: AtlasEntry, override?: SearchEntryOverride) {
  if (override?.availability) return override.availability;
  return AVAILABLE_ENTRY_IDS.has(entry.id) ? "available" : "planned";
}

function contentSearchEntry(entry: AtlasEntry): AtlasSearchEntry {
  const override = SEARCH_OVERRIDES[entry.id];
  return {
    id: entry.id,
    title: override?.title ?? displayTitle(entry.title),
    kind: KIND_BY_CATEGORY[entry.category],
    typeLabel: TYPE_BY_CATEGORY[entry.category],
    parentLabel: PARENT_BY_CATEGORY[entry.category],
    description: entry.overview.what,
    aliases: unique([
      ...(entry.aliases ?? []),
      ...(entry.semantics?.aliases ?? []),
      ...(override?.aliases ?? []),
    ]),
    keywords: unique([
      ...(entry.semantics?.keywords ?? []),
      ...(entry.tags ?? []),
      ...(override?.keywords ?? []),
    ]),
    topics: unique(override?.topics ?? []),
    priority: override?.priority,
    availability: availabilityFor(entry, override),
    releaseVersion: override?.releaseVersion,
  };
}

const systemEntries: AtlasSearchEntry[] = ATLAS_SYSTEM_CONFIGS.map((system) => {
  const override = SEARCH_OVERRIDES[system.id];
  return {
    id: system.id,
    title: displayTitle(system.label),
    kind: "system",
    typeLabel: "SYSTEM",
    parentLabel: "SOVEREIGN ATLAS",
    description: system.subtitle,
    aliases: unique(override?.aliases ?? []),
    keywords: unique(override?.keywords ?? []),
    topics: unique(override?.topics ?? []),
    priority: override?.priority,
    availability: "available",
  };
});

const sourceEntries = Array.from(
  new Map([...ATLAS_ENTRIES, sovereignUx].map((entry) => [entry.id, entry])).values(),
);

const observatoryEntry: AtlasSearchEntry = {
  id: "about-wilson",
  title: "About Wilson",
  kind: "observatory",
  typeLabel: "OBSERVATORY",
  parentLabel: "PROFILE",
  description: "Explore Wilson’s background, journey, values, and design philosophy.",
  aliases: ["Wilson", "Wilson Chiu", "profile"],
  keywords: ["designer", "product designer", "design leader"],
  topics: SEARCH_OVERRIDES["about-wilson"].topics ?? [],
  priority: SEARCH_OVERRIDES["about-wilson"].priority,
  availability: "available",
};

export const ATLAS_SEARCH_INDEX: AtlasSearchEntry[] = [
  ...systemEntries,
  ...sourceEntries.map(contentSearchEntry),
  observatoryEntry,
];

export const INDEXED_ATLAS_SEARCH_ENTRIES = indexAtlasSearchEntries(ATLAS_SEARCH_INDEX);
