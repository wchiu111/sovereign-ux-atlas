import { entries as caseStudies } from "./case-studies";
import { entries as experiments } from "./experiments";
import { entries as frameworks } from "./frameworks";
import { ATLAS_RELATIONSHIPS } from "./relationships";
import type {
  AtlasCategory,
  AtlasEntry,
  AtlasResolvedRelationship,
} from "./types";

export const ATLAS_ENTRIES: AtlasEntry[] = [
  ...caseStudies,
  ...experiments,
  ...frameworks,
];

export const ATLAS_ENTRY_MAP = new Map<string, AtlasEntry>();

ATLAS_ENTRIES.forEach((entry) => {
  ATLAS_ENTRY_MAP.set(entry.id, entry);
  entry.aliases?.forEach((alias) => ATLAS_ENTRY_MAP.set(alias, entry));
});

export function getAtlasEntry(id: string): AtlasEntry | undefined {
  return ATLAS_ENTRY_MAP.get(id);
}

export function getEntriesByCategory(category: AtlasCategory): AtlasEntry[] {
  return ATLAS_ENTRIES.filter((entry) => entry.category === category);
}

export function getAtlasRelationships(entryId: string): AtlasResolvedRelationship[] {
  const entry = getAtlasEntry(entryId);
  if (!entry) return [];

  return ATLAS_RELATIONSHIPS.flatMap((relationship) => {
    if (relationship.sourceId === entry.id) {
      const related = getAtlasEntry(relationship.targetId);
      if (!related) return [];

      return [
        {
          id: relationship.id,
          type: relationship.type,
          direction: "outgoing" as const,
          relatedId: related.id,
          relatedLabel: related.title,
          relatedCategory: related.category,
          sectionId: relationship.sourceSectionId,
          summary: relationship.summary,
          lineageSummary: relationship.lineageSummary ?? relationship.summary,
        },
      ];
    }

    if (relationship.targetId === entry.id) {
      const related = getAtlasEntry(relationship.sourceId);
      if (!related) return [];

      const summary = relationship.reverseSummary ?? relationship.summary;

      return [
        {
          id: relationship.id,
          type: relationship.type,
          direction: "incoming" as const,
          relatedId: related.id,
          relatedLabel: related.title,
          relatedCategory: related.category,
          sectionId: relationship.targetSectionId,
          summary,
          lineageSummary: summary,
        },
      ];
    }

    return [];
  });
}
