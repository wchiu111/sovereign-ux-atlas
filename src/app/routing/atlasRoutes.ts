import { getAtlasEntry, getEntriesByCategory } from "../content/registry";
import type { AtlasCategory, AtlasEntry } from "../content/types";
import { initialAtlasState, type AtlasState } from "../state/atlasState";

export const CASE_STUDIES_PATH = "/case-studies";
export const EXPERIMENTS_PATH = "/experiments";

interface RoutableAtlasCategory {
  category: Extract<AtlasCategory, "case-study" | "experiment">;
  systemId: "case-studies" | "experiments";
  systemPath: string;
  legacyPrefix: string;
}

const ROUTABLE_CATEGORIES: RoutableAtlasCategory[] = [
  {
    category: "case-study",
    systemId: "case-studies",
    systemPath: CASE_STUDIES_PATH,
    legacyPrefix: "/case-study/",
  },
  {
    category: "experiment",
    systemId: "experiments",
    systemPath: EXPERIMENTS_PATH,
    legacyPrefix: "/experiment/",
  },
];

export interface AtlasRoute {
  atlasState: AtlasState;
  canonicalPath: string;
  sectionId?: string;
  evidenceId?: string;
}

function navigationState(overrides: Partial<AtlasState>): AtlasState {
  return {
    ...initialAtlasState,
    ...overrides,
    searchMode: null,
    focusTransition: null,
  };
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function publicSlug(entry: AtlasEntry): string {
  return entry.routeSlug ?? entry.id;
}

function findEntry(
  category: AtlasCategory,
  routeId: string,
): AtlasEntry | undefined {
  return getEntriesByCategory(category).find(
    (entry) =>
      publicSlug(entry) === routeId ||
      entry.id === routeId ||
      entry.aliases?.includes(routeId),
  );
}

function routeConfigForEntry(entry: AtlasEntry): RoutableAtlasCategory | undefined {
  return ROUTABLE_CATEGORIES.find((config) => config.category === entry.category);
}

export function atlasSystemPath(systemId: string): string | null {
  return ROUTABLE_CATEGORIES.find((config) => config.systemId === systemId)
    ?.systemPath ?? null;
}

export function atlasEntryBasePath(entryId: string): string | null {
  const entry = getAtlasEntry(entryId);
  if (!entry) return null;
  const config = routeConfigForEntry(entry);
  return config ? `${config.systemPath}/${publicSlug(entry)}` : null;
}

export function atlasEntrySectionPath(
  entryId: string,
  sectionId: string,
): string | null {
  const basePath = atlasEntryBasePath(entryId);
  return basePath ? `${basePath}/${encodeURIComponent(sectionId)}` : null;
}

export function atlasEntryEvidencePath(
  entryId: string,
  sectionId: string,
  evidenceId: string,
): string | null {
  const sectionPath = atlasEntrySectionPath(entryId, sectionId);
  return sectionPath
    ? `${sectionPath}/evidence/${encodeURIComponent(evidenceId)}`
    : null;
}

export function caseStudyBasePath(entryId: string): string {
  return atlasEntryBasePath(entryId) ?? `${CASE_STUDIES_PATH}/${entryId}`;
}

export function experimentBasePath(entryId: string): string {
  return atlasEntryBasePath(entryId) ?? `${EXPERIMENTS_PATH}/${entryId}`;
}

export function experimentSectionPath(
  entryId: string,
  sectionId: string,
): string {
  return atlasEntrySectionPath(entryId, sectionId)
    ?? `${experimentBasePath(entryId)}/${encodeURIComponent(sectionId)}`;
}

export function experimentEvidencePath(
  entryId: string,
  sectionId: string,
  evidenceId: string,
): string {
  return atlasEntryEvidencePath(entryId, sectionId, evidenceId)
    ?? `${experimentSectionPath(entryId, sectionId)}/evidence/${encodeURIComponent(evidenceId)}`;
}

export function caseStudySectionPath(
  entryId: string,
  sectionId: string,
): string {
  return `${caseStudyBasePath(entryId)}/${encodeURIComponent(sectionId)}`;
}

export function caseStudyEvidencePath(
  entryId: string,
  sectionId: string,
  evidenceId: string,
): string {
  return `${caseStudySectionPath(entryId, sectionId)}/evidence/${encodeURIComponent(evidenceId)}`;
}

export function parseAtlasRoute(
  location: Pick<Location, "pathname" | "hash">,
): AtlasRoute | null {
  const pathname = location.pathname.replace(/\/+$/, "") || "/";
  if (pathname === "/") {
    return { atlasState: navigationState({ level: 0 }), canonicalPath: "/" };
  }

  const systemRoute = ROUTABLE_CATEGORIES.find(
    (config) => pathname === config.systemPath,
  );
  if (systemRoute) {
    return {
      atlasState: navigationState({
        level: 1,
        activeSystemId: systemRoute.systemId,
      }),
      canonicalPath: systemRoute.systemPath,
    };
  }

  const routeConfig = ROUTABLE_CATEGORIES.find((config) =>
    pathname.startsWith(`${config.systemPath}/`)
    || pathname.startsWith(config.legacyPrefix),
  );
  if (!routeConfig) return null;
  const canonicalPrefix = `${routeConfig.systemPath}/`;
  const prefix = pathname.startsWith(canonicalPrefix)
    ? canonicalPrefix
    : routeConfig.legacyPrefix;

  const routeSegments = pathname.slice(prefix.length).split("/").map(safeDecode);
  const entry = findEntry(routeConfig.category, routeSegments[0]);
  if (!entry) return null;
  const canonicalBase = atlasEntryBasePath(entry.id)!;
  const segments = routeSegments.slice(1);

  if (segments.length === 0) {
    return {
      atlasState: navigationState({
        level: 2,
        activeSystemId: routeConfig.systemId,
        activePlanetId: entry.id,
        drawerOpen: true,
      }),
      canonicalPath: canonicalBase,
    };
  }

  const sectionIndex = entry.sections?.findIndex(
    (section) => section.id === segments[0],
  ) ?? -1;
  if (sectionIndex < 0) return null;
  const section = entry.sections![sectionIndex];
  const pathEvidenceId =
    segments[1] === "evidence" && segments[2] ? segments[2] : undefined;
  const hashEvidenceId = location.hash ? safeDecode(location.hash.slice(1)) : undefined;
  const candidateEvidenceId = pathEvidenceId ?? hashEvidenceId;
  const evidenceId = section.evidence?.some(
    (evidence) => evidence.id === candidateEvidenceId,
  )
    ? candidateEvidenceId
    : undefined;

  return {
    atlasState: navigationState({
      level: 3,
      activeSystemId: routeConfig.systemId,
      activePlanetId: entry.id,
      focusSection: sectionIndex,
    }),
    canonicalPath: evidenceId
      ? atlasEntryEvidencePath(entry.id, section.id, evidenceId)!
      : atlasEntrySectionPath(entry.id, section.id)!,
    sectionId: section.id,
    evidenceId,
  };
}

export function currentBrowserPath(): string {
  if (typeof window === "undefined") return "/";
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

export function pushAtlasPath(path: string): void {
  if (typeof window === "undefined" || currentBrowserPath() === path) return;
  window.history.pushState({}, "", path);
}

export function replaceAtlasPath(path: string): void {
  if (typeof window === "undefined" || currentBrowserPath() === path) return;
  window.history.replaceState({}, "", path);
}
