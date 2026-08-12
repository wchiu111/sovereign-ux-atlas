export type AtlasSearchKind =
  | "system"
  | "case-study"
  | "framework"
  | "experiment"
  | "observatory";

export type AtlasSearchAvailability = "available" | "preview" | "planned";

export type AtlasSearchMatchedBy =
  | "exact-title"
  | "alias"
  | "title-prefix"
  | "keyword"
  | "topic"
  | "description"
  | "intent-rule";

export interface AtlasSearchEntry {
  id: string;
  title: string;
  kind: AtlasSearchKind;
  typeLabel: string;
  parentLabel: string;
  description: string;
  aliases: string[];
  keywords: string[];
  topics: string[];
  priority?: number;
  availability: AtlasSearchAvailability;
  releaseVersion?: string;
}

export interface IndexedAtlasSearchEntry extends AtlasSearchEntry {
  normalizedTitle: string;
  normalizedAliases: string[];
  normalizedKeywords: string[];
  normalizedTopics: string[];
  normalizedDescription: string;
  normalizedFieldTerms: Set<string>;
  normalizedDescriptionTerms: Set<string>;
}

export interface AtlasSearchMatch {
  entry: AtlasSearchEntry;
  score: number;
  matchedBy: AtlasSearchMatchedBy;
}

export interface AtlasGuidedPrompt {
  id: string;
  label: string;
  query: string;
  previewDestinationId?: string;
}

export interface AtlasSearchSuggestion {
  id: string;
  label: string;
  query: string;
}

export type AtlasSearchDestination =
  | { type: "system"; targetId: string }
  | { type: "entry"; targetId: string; systemId: string }
  | { type: "observatory"; targetId: "about-wilson" };

export type AtlasSearchInteractionMethod = "mouse" | "keyboard" | "touch";

export type AtlasSearchAnalyticsEventName =
  | "atlas_search_opened"
  | "atlas_query_changed"
  | "atlas_query_submitted"
  | "atlas_result_selected"
  | "atlas_no_results"
  | "atlas_guided_prompt_selected";

export interface AtlasSearchAnalyticsEvent {
  name: AtlasSearchAnalyticsEventName;
  properties: {
    queryLength?: number;
    resultCount?: number;
    selectedResultType?: AtlasSearchKind;
    selectedPosition?: number;
    interactionMethod?: AtlasSearchInteractionMethod;
    topic?: string;
    matchedBy?: AtlasSearchMatchedBy;
    promptId?: string;
  };
}
