import { useMemo } from "react";
import { buildAtlasAssistContext } from "../atlas-assist/buildAtlasAssistContext";
import { getAtlasAssistPrompts } from "../data/atlasAssistPrompts";
import type {
  AtlasAssistContext,
  AtlasAssistContextInput,
  AtlasAssistMode,
} from "../types/atlasAssist";

export function useAtlasAssistContext({
  mode,
  ...input
}: AtlasAssistContextInput & { mode: AtlasAssistMode }) {
  const contextResult = useMemo<{
    context: AtlasAssistContext | null;
    error: Error | null;
  }>(
    () => {
      try {
        return { context: buildAtlasAssistContext(input), error: null };
      } catch (caught) {
        return {
          context: null,
          error: caught instanceof Error ? caught : new Error("Atlas context could not be prepared."),
        };
      }
    },
    [input.projectId, input.query, input.scope, input.sectionId],
  );
  const prompts = useMemo(
    () => contextResult.context
      ? getAtlasAssistPrompts({ mode, context: contextResult.context })
      : [],
    [contextResult.context, mode],
  );
  return { ...contextResult, prompts };
}
