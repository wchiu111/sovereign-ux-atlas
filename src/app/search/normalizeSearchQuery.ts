const NATURAL_LANGUAGE_PREFIXES = [
  "can you take me to",
  "could you take me to",
  "i want to see",
  "i want to find",
  "take me to",
  "tell me about",
  "where can i find",
  "where is",
  "show me",
  "help me find",
  "explain",
  "explore",
  "browse",
  "find",
  "open",
];

const QUERY_FILLER = new Set(["a", "an", "please", "the"]);

const SINGULAR_FORMS: Record<string, string> = {
  studies: "study",
  caseStudies: "case study",
  projects: "project",
  frameworks: "framework",
  methods: "method",
  methodologies: "methodology",
  systems: "system",
  experiments: "experiment",
  decisions: "decision",
  claims: "claim",
  journeys: "journey",
  concepts: "concept",
};

export function normalizeSearchText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripNaturalLanguagePrefix(value: string) {
  let current = value;
  let changed = true;

  while (changed) {
    changed = false;
    for (const prefix of NATURAL_LANGUAGE_PREFIXES) {
      if (current === prefix) return "";
      if (current.startsWith(`${prefix} `)) {
        current = current.slice(prefix.length).trim();
        changed = true;
        break;
      }
    }
  }

  return current;
}

export function singularizeSearchTerm(term: string) {
  return SINGULAR_FORMS[term] ?? term;
}

export function tokenizeSearchText(value: string) {
  return normalizeSearchText(value)
    .split(" ")
    .filter(Boolean)
    .filter((term) => !QUERY_FILLER.has(term))
    .map(singularizeSearchTerm);
}

export function normalizeSearchQuery(value: string) {
  return stripNaturalLanguagePrefix(normalizeSearchText(value));
}

export function tokenizeSearchQuery(value: string) {
  return tokenizeSearchText(normalizeSearchQuery(value));
}
