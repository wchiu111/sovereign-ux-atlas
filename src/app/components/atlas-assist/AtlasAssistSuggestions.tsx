import { ArrowRight } from "lucide-react";
import type {
  AtlasAssistInteractionMethod,
  AtlasAssistPrompt,
  AtlasAssistPromptCategory,
} from "../../types/atlasAssist";

const CATEGORY_LABELS: Record<AtlasAssistPromptCategory, string> = {
  understand: "UNDERSTAND",
  explore: "EXPLORE",
  question: "QUESTION",
};

export default function AtlasAssistSuggestions({
  prompts,
  compact = false,
  onSelect,
}: {
  prompts: AtlasAssistPrompt[];
  compact?: boolean;
  onSelect: (
    prompt: AtlasAssistPrompt,
    interactionMethod: AtlasAssistInteractionMethod,
    trigger: HTMLButtonElement,
  ) => void;
}) {
  const visiblePrompts = compact
    ? prompts.filter((item) => item.category !== "question").slice(0, 4)
    : prompts;
  const groups = (["understand", "explore", "question"] as const)
    .map((category) => ({
      category,
      prompts: visiblePrompts.filter((item) => item.category === category),
    }))
    .filter((group) => group.prompts.length > 0);

  return (
    <div
      className={`atlas-assist-suggestions${compact ? " atlas-assist-suggestions--compact" : ""}`}
      aria-label="Suggested consultation questions"
    >
      {groups.map((group) => (
        <section key={group.category}>
          {!compact && <h3>{CATEGORY_LABELS[group.category]}</h3>}
          <div className="atlas-assist-suggestions__rows">
            {group.prompts.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={(event) => onSelect(
                  item,
                  event.detail === 0 ? "keyboard" : "mouse",
                  event.currentTarget,
                )}
              >
                <span>{item.label}</span>
                <ArrowRight aria-hidden="true" size={13} strokeWidth={1.35} />
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
