import type { AtlasEntryRelationship } from "./types";

export const ATLAS_RELATIONSHIPS: AtlasEntryRelationship[] = [
  {
    id: "globality-presence-navigation",
    type: "informed",
    sourceId: "globality",
    targetId: "presence-navigation",
    sourceSectionId: "context",
    targetSectionId: "arrival",
    summary:
      "Questions about orientation, changing work states, and attention first surfaced through this project.",
    reverseSummary:
      "Questions about orientation first surfaced while redesigning a complex enterprise procurement workflow.",
    lineageSummary:
      "Questions about orientation, changing work states, and attention eventually became part of a broader framework for designing how people enter and understand complex interfaces.",
  },
];
