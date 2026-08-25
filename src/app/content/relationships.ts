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
  {
    id: "agentic-insurance-decision-rights",
    type: "informed",
    sourceId: "agentic-insurance",
    targetId: "authority-gradient",
    sourceSectionId: "decisions",
    targetSectionId: "system-purpose",
    summary:
      "Exploring where AI recommendations should stop and professional judgment should begin later informed Decision Rights.",
    reverseSummary:
      "Questions about where AI recommendations should stop and professional judgment should begin emerged while exploring an agentic insurance claims workflow.",
    lineageSummary:
      "The project began by asking how much of a claims journey AI could automate. Domain research exposed a different problem: capability alone does not determine who should hold authority. AI could gather, compare, explain, and recommend while consequential decisions remained with the adjuster.",
  },
  {
    id: "oracle-presence-navigation",
    type: "informed",
    sourceId: "oracle",
    targetId: "presence-navigation",
    sourceSectionId: "approach",
    targetSectionId: "orientation",
    summary:
      "Sequencing a dense product portfolio around when information became useful later informed Presence Navigation.",
    reverseSummary:
      "Questions about sequencing information around when it becomes useful surfaced while translating Oracle’s Higher Education portfolio into a coherent customer journey.",
    lineageSummary:
      "The Higher Education experience treated information as a sequence rather than a static hierarchy. Product context, exploration, proof, and detail were revealed as they became useful—a pattern that later evolved into Presence Navigation’s focus on temporal hierarchy.",
  },
];
