import { getAtlasEntry } from "../../content/registry";
import { atlasEntryToReadingDocument } from "../shared/adapters";
import AtlasReadingEngine from "../shared/AtlasReadingEngine";
import type { AtlasAssistSource } from "../../types/atlasAssist";
import { frameworkBasePath } from "../../routing/atlasRoutes";

interface Props {
  planetId: string;
  system: { color: string; label: string };
  onExit: () => void;
  onAtlas?: () => void;
  onSystem?: () => void;
  initialSectionIndex?: number;
  onOpenAssistSource?: (source: AtlasAssistSource) => void;
}

export default function FrameworkEngine({ planetId, ...props }: Props) {
  const entry = getAtlasEntry(planetId);
  if (!entry || entry.category !== "framework") return null;
  return (
    <AtlasReadingEngine
      document={atlasEntryToReadingDocument(entry)}
      routeSegment="framework"
      routeBasePath={frameworkBasePath(entry.id)}
      {...props}
    />
  );
}
