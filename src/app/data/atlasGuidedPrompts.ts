import type { AtlasGuidedPrompt, AtlasSearchSuggestion } from "../types/atlasSearch";

export const ATLAS_GUIDED_PROMPTS: AtlasGuidedPrompt[] = [
  {
    id: "strongest-case-studies",
    label: "Show me the strongest case studies",
    query: "Show me the strongest case studies",
    previewDestinationId: "case-studies",
  },
  {
    id: "authority-drift",
    label: "Explain Authority Drift",
    query: "Explain Authority Drift",
    previewDestinationId: "authority-drift",
  },
  {
    id: "ai-design-frameworks",
    label: "Explore AI Design Frameworks",
    query: "Explore AI Design Frameworks",
    previewDestinationId: "frameworks",
  },
  {
    id: "about-wilson",
    label: "Tell me about Wilson",
    query: "Tell me about Wilson",
    previewDestinationId: "about-wilson",
  },
];

export const ATLAS_NO_RESULT_SUGGESTIONS: AtlasSearchSuggestion[] = [
  { id: "authority-drift", label: "Authority Drift", query: "Authority Drift" },
  { id: "oracle", label: "Oracle", query: "Oracle" },
  { id: "frameworks", label: "Frameworks", query: "Frameworks" },
  { id: "about-wilson", label: "About Wilson", query: "About Wilson" },
];
