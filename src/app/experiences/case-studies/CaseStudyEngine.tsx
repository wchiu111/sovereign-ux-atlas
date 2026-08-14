import { getAtlasEntry } from "../../content/registry";
import { atlasEntryToReadingDocument } from "../shared/adapters";
import AtlasReadingEngine from "../shared/AtlasReadingEngine";
import type { AtlasAssistSource } from "../../types/atlasAssist";

interface Props {
  planetId: string;
  system: { color: string; label: string };
  onExit: () => void;
  onAtlas?: () => void;
  onSystem?: () => void;
  initialSectionIndex?: number;
  onOpenAssistSource?: (source: AtlasAssistSource) => void;
}

export default function CaseStudyEngine({ planetId, ...props }: Props) {
  const entry = getAtlasEntry(planetId);

  if (!entry || entry.category !== "case-study") {
    return null;
  }

  const document = atlasEntryToReadingDocument(entry);

  return (
    <AtlasReadingEngine
      document={document}
      routeSegment="case-study"
      routeBasePath={entry.routeSlug ? `/case-studies/${entry.routeSlug}` : undefined}
      {...props}
    />
  );
}
