import { getAtlasEntry, getEntriesByCategory } from "../content/registry";
import type { AtlasEntry } from "../content/types";
import { initialAtlasState, type AtlasState } from "../state/atlasState";

export const CASE_STUDIES_PATH = "/case-studies";

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

function findCaseStudy(routeId: string): AtlasEntry | undefined {
  return getEntriesByCategory("case-study").find(
    (entry) =>
      publicSlug(entry) === routeId ||
      entry.id === routeId ||
      entry.aliases?.includes(routeId),
  );
}

export function caseStudyBasePath(entryId: string): string {
  const entry = getAtlasEntry(entryId);
  return `${CASE_STUDIES_PATH}/${entry ? publicSlug(entry) : entryId}`;
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

  if (pathname === CASE_STUDIES_PATH) {
    return {
      atlasState: navigationState({
        level: 1,
        activeSystemId: "case-studies",
      }),
      canonicalPath: CASE_STUDIES_PATH,
    };
  }

  const canonicalPrefix = `${CASE_STUDIES_PATH}/`;
  const legacyPrefix = "/case-study/";
  const prefix = pathname.startsWith(canonicalPrefix)
    ? canonicalPrefix
    : pathname.startsWith(legacyPrefix)
      ? legacyPrefix
      : null;
  if (!prefix) return null;

  const routeSegments = pathname.slice(prefix.length).split("/").map(safeDecode);
  const entry = findCaseStudy(routeSegments[0]);
  if (!entry) return null;
  const canonicalBase = caseStudyBasePath(entry.id);
  const segments = routeSegments.slice(1);

  if (segments.length === 0) {
    return {
      atlasState: navigationState({
        level: 2,
        activeSystemId: "case-studies",
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
      activeSystemId: "case-studies",
      activePlanetId: entry.id,
      focusSection: sectionIndex,
    }),
    canonicalPath: evidenceId
      ? caseStudyEvidencePath(entry.id, section.id, evidenceId)
      : caseStudySectionPath(entry.id, section.id),
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
