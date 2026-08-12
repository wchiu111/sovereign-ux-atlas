import { ATLAS_ENTRIES, getAtlasEntry } from "../content/registry";
import type {
  AtlasCategory,
  AtlasEntry,
  AtlasEntryEvidence,
  AtlasEntrySection,
} from "../content/types";
import type {
  AtlasAssistContentBlock,
  AtlasAssistContentBlockType,
  AtlasAssistContext,
  AtlasAssistContextInput,
  AtlasAssistSource,
  AtlasAssistSourceType,
} from "../types/atlasAssist";

const LIMITATION_PATTERN =
  /\b(i would not|i do not have|i did not|did not conduct|cannot claim|could not validate|not validated|unvalidated|no direct (access|validation)|without direct access|would require real|requires real|simulated evaluation|design hypothesis|remained a design hypothesis|still unfinished|limitation)\b/i;

const SOURCE_TYPE_BY_CATEGORY: Record<AtlasCategory, AtlasAssistSourceType> = {
  "case-study": "case-study",
  experiment: "experiment",
  framework: "framework",
};

function compact(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function firstSentence(text: string, maxLength = 520) {
  const clean = compact(text);
  const sentence = clean.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() ?? clean;
  return sentence.length > maxLength
    ? `${sentence.slice(0, maxLength - 1).trimEnd()}...`
    : sentence;
}

function blockTypeForSection(section: AtlasEntrySection): AtlasAssistContentBlockType {
  const id = `${section.id} ${section.label}`.toLowerCase();
  if (id.includes("decision")) return "decision";
  if (id.includes("outcome") || id.includes("result")) return "outcome";
  return "section";
}

function sourceTypeForSection(section: AtlasEntrySection): AtlasAssistSourceType {
  const type = blockTypeForSection(section);
  if (type === "decision") return "decision";
  if (type === "outcome") return "outcome";
  return "section";
}

function entrySource(entry: AtlasEntry): AtlasAssistSource {
  return {
    id: `entry:${entry.id}`,
    title: entry.title,
    sourceType: SOURCE_TYPE_BY_CATEGORY[entry.category],
    destinationId: entry.id,
  };
}

function sectionSource(entry: AtlasEntry, section: AtlasEntrySection): AtlasAssistSource {
  return {
    id: `section:${entry.id}:${section.id}`,
    title: section.label,
    sourceType: sourceTypeForSection(section),
    destinationId: entry.id,
    sectionId: section.id,
    parentTitle: entry.title,
  };
}

function evidenceSource(
  entry: AtlasEntry,
  section: AtlasEntrySection,
  evidence: AtlasEntryEvidence,
): AtlasAssistSource {
  return {
    id: `evidence:${entry.id}:${section.id}:${evidence.id}`,
    title: evidence.title,
    sourceType: "evidence",
    destinationId: entry.id,
    sectionId: section.id,
    evidenceId: evidence.id,
    parentTitle: `${entry.title} / ${section.label}`,
  };
}

function evidenceBody(evidence: AtlasEntryEvidence) {
  const canvas = evidence.canvas;
  const annotations = canvas?.annotations.map((annotation) => [
    annotation.title,
    annotation.observation,
    annotation.meaning,
    `Documented decision-right holder: ${annotation.rightHolder}.`,
  ].filter(Boolean).join(" ")) ?? [];

  return [
    evidence.description,
    evidence.caption,
    canvas?.description,
    ...annotations,
  ].filter(Boolean).join("\n\n");
}

function overviewBlocks(entry: AtlasEntry): AtlasAssistContentBlock[] {
  const source = entrySource(entry);
  return [
    {
      id: `overview:${entry.id}:summary`,
      type: "overview",
      title: `${entry.title} summary`,
      body: entry.overview.what,
      source,
    },
    {
      id: `overview:${entry.id}:why`,
      type: "overview",
      title: "Why it started",
      body: entry.overview.why,
      source,
    },
    {
      id: `overview:${entry.id}:research`,
      type: "research",
      title: "Research focus",
      body: entry.overview.researchFocus,
      source,
    },
    {
      id: `overview:${entry.id}:discovery`,
      type: "discovery",
      title: "Key discovery",
      body: entry.overview.keyDiscovery,
      source,
    },
  ];
}

function sectionBlocks(
  entry: AtlasEntry,
  section: AtlasEntrySection,
  fullNarrative: boolean,
): AtlasAssistContentBlock[] {
  const source = sectionSource(entry, section);
  const body = fullNarrative
    ? section.content
    : section.insight || firstSentence(section.content);
  const blocks: AtlasAssistContentBlock[] = [
    {
      id: source.id,
      type: blockTypeForSection(section),
      title: section.label,
      body,
      source,
    },
  ];

  section.evidence?.forEach((evidence) => {
    const evidenceItemSource = evidenceSource(entry, section, evidence);
    blocks.push({
      id: evidenceItemSource.id,
      type: "evidence",
      title: evidence.title,
      body: evidenceBody(evidence),
      source: evidenceItemSource,
    });
  });

  return blocks;
}

function collectionBlocks(entry: AtlasEntry): AtlasAssistContentBlock[] {
  if (!entry.collection) return [];
  const source = entrySource(entry);

  return entry.collection.families.flatMap((family) =>
    family.modules.map((module) => ({
      id: `collection:${entry.id}:${module.id}`,
      type: "section" as const,
      title: `${family.title} / ${module.title}`,
      body: [
        module.purpose,
        `Includes:\n${module.includes.map((item) => `- ${item}`).join("\n")}`,
        `Use when: ${module.useWhen}`,
        module.watchFor ? `Watch for: ${module.watchFor}` : undefined,
      ].filter(Boolean).join("\n\n"),
      source,
    })),
  );
}

function relatedBlocks(entry: AtlasEntry, sectionId?: string): AtlasAssistContentBlock[] {
  const sections = entry.sections ?? [];
  const sectionById = new Map(sections.map((section) => [section.id, section]));
  const constellationRelations = (entry.constellation?.connections ?? [])
    .filter((connection) => !sectionId || connection.from === sectionId || connection.to === sectionId)
    .flatMap((connection) => {
      const targetId = sectionId && connection.to === sectionId
        ? connection.from
        : connection.to;
      const target = sectionById.get(targetId) ?? sectionById.get(connection.to);
      if (!target) return [];
      const fromTitle = sectionById.get(connection.from)?.label ?? connection.from;
      const toTitle = sectionById.get(connection.to)?.label ?? connection.to;
      const relationship = connection.rationale
        ?? `${fromTitle} ${connection.type ?? "relates to"} ${toTitle}.`;
      return [{
        id: `related:${entry.id}:${connection.from}:${connection.to}`,
        type: "related" as const,
        title: target.label,
        body: relationship,
        source: sectionSource(entry, target),
      }];
    });

  if (sectionId || !entry.collection) return constellationRelations;

  const collectionRelations = entry.collection.families.flatMap((family) =>
    family.modules.flatMap((module) =>
      (module.relatedFrameworks ?? []).flatMap((relatedId) => {
        const relatedEntry = getAtlasEntry(relatedId);
        if (!relatedEntry) return [];
        return [{
          id: `related:${entry.id}:${module.id}:${relatedEntry.id}`,
          type: "related" as const,
          title: relatedEntry.title,
          body: `${module.title} explicitly identifies ${relatedEntry.title} as related work.`,
          source: {
            ...entrySource(relatedEntry),
            parentTitle: `${entry.title} / ${module.title}`,
          },
        }];
      }),
    ),
  );

  return [...constellationRelations, ...collectionRelations];
}

function limitationSentences(blocks: AtlasAssistContentBlock[]) {
  const sentences = blocks
    .filter((block) => /lessons?|limitations?|outcomes?/i.test(
      `${block.source.sectionId ?? ""} ${block.title ?? ""}`,
    ))
    .flatMap((block) => compact(block.body).split(/(?<=[.!?])\s+/))
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 30 && LIMITATION_PATTERN.test(sentence));

  return Array.from(new Set(sentences)).slice(0, 5);
}

function uniqueSources(blocks: AtlasAssistContentBlock[]) {
  return new Map(blocks.map((block) => [block.source.id, block.source])).size;
}

function resolveProject(projectId?: string) {
  if (!projectId) return undefined;
  return getAtlasEntry(projectId);
}

export function buildAtlasAssistContext({
  scope,
  projectId,
  sectionId,
}: AtlasAssistContextInput): AtlasAssistContext {
  const project = resolveProject(projectId);
  let blocks: AtlasAssistContentBlock[] = [];
  let title = "Sovereign Atlas";
  let sectionTitle: string | undefined;

  if (scope === "section") {
    if (!project || !sectionId) {
      throw new Error("Section scope requires a documented project and section.");
    }
    const section = project.sections?.find((item) => item.id === sectionId);
    if (!section) {
      throw new Error("The requested Atlas section is not documented.");
    }
    blocks = [
      ...sectionBlocks(project, section, true),
      ...relatedBlocks(project, section.id),
    ];
    title = project.title;
    sectionTitle = section.label;
  } else if (scope === "project") {
    if (!project) {
      throw new Error("Project scope requires a documented Atlas entry.");
    }
    title = project.title;
    blocks = [
      ...overviewBlocks(project),
      ...(project.sections?.flatMap((section) => sectionBlocks(project, section, true)) ?? []),
      ...collectionBlocks(project),
      ...relatedBlocks(project),
    ];
  } else {
    blocks = ATLAS_ENTRIES.flatMap((entry) => [
      ...overviewBlocks(entry),
      ...(entry.sections?.flatMap((section) => sectionBlocks(entry, section, true)) ?? []),
      ...collectionBlocks(entry),
      ...relatedBlocks(entry),
    ]);
  }

  const limitations = limitationSentences(blocks);
  const entryIds = new Set(
    blocks.map((block) => block.source.destinationId).filter(Boolean),
  );
  const includedEntries = ATLAS_ENTRIES.filter((entry) => entryIds.has(entry.id));
  const sectionIds = new Set(
    blocks
      .filter((block) => block.source.sectionId)
      .map((block) => `${block.source.destinationId}:${block.source.sectionId}`),
  );

  return {
    scope,
    projectId: project?.id,
    sectionId: scope === "section" ? sectionId : undefined,
    contentBlocks: blocks,
    sourceIds: Array.from(new Set(blocks.map((block) => block.source.id))),
    limitations,
    grounding: {
      title,
      sectionTitle,
      entryCount: entryIds.size,
      caseStudyCount: includedEntries.filter((entry) => entry.category === "case-study").length,
      frameworkCount: includedEntries.filter((entry) => entry.category === "framework").length,
      experimentCount: includedEntries.filter((entry) => entry.category === "experiment").length,
      sectionCount: sectionIds.size,
      evidenceCount: blocks.filter((block) => block.type === "evidence").length,
      decisionCount: blocks.filter((block) => block.type === "decision").length,
      outcomeCount: blocks.filter((block) => block.type === "outcome").length,
      limitationCount: limitations.length,
      relatedCount: blocks.filter((block) => block.type === "related").length,
    },
  };
}

export function getAtlasAssistSourceCount(context: AtlasAssistContext) {
  return uniqueSources(context.contentBlocks);
}
