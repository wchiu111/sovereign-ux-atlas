import { ATLAS_ENTRIES } from "../content";
import { ATLAS_SYSTEM_CONFIGS } from "../data/atlasSystemConfig";
import type {
  AtlasSearchDestination,
  AtlasSearchEntry,
} from "../types/atlasSearch";

const systemIds = new Set(ATLAS_SYSTEM_CONFIGS.map((system) => system.id));
const systemIdByCategory = new Map(
  ATLAS_SYSTEM_CONFIGS.map((system) => [system.category, system.id]),
);
const entryById = new Map(ATLAS_ENTRIES.map((entry) => [entry.id, entry]));

export function resolveAtlasSearchDestination(
  entryId: string,
): AtlasSearchDestination | undefined {
  if (entryId === "about-wilson") {
    return { type: "observatory", targetId: "about-wilson" };
  }

  if (entryId === "sovereign-ux") {
    return { type: "system", targetId: "frameworks" };
  }

  if (systemIds.has(entryId)) {
    return { type: "system", targetId: entryId };
  }

  const entry = entryById.get(entryId);
  if (!entry) return undefined;
  const systemId = systemIdByCategory.get(entry.category);
  if (!systemId) return undefined;

  return { type: "entry", targetId: entry.id, systemId };
}

export function getAtlasSearchPreviewDestination(entryId: string) {
  return resolveAtlasSearchDestination(entryId)?.targetId;
}

export function validateAtlasSearchDestinations(
  entries: readonly AtlasSearchEntry[],
) {
  return entries
    .filter((entry) => !resolveAtlasSearchDestination(entry.id))
    .map((entry) => ({
      entryId: entry.id,
      message: `Atlas search entry "${entry.id}" has no live navigation destination.`,
    }));
}
