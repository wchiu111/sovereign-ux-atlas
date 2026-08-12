export type AtlasAssistScope = "section" | "project" | "atlas";

export type AtlasAssistMode = "overview" | "focused";

export type AtlasAssistSourceType =
  | "section"
  | "evidence"
  | "decision"
  | "outcome"
  | "framework"
  | "case-study"
  | "experiment";

export interface AtlasAssistSource {
  id: string;
  title: string;
  sourceType: AtlasAssistSourceType;
  destinationId?: string;
  sectionId?: string;
  evidenceId?: string;
  parentTitle?: string;
}

export interface AtlasAssistAnswer {
  answer: string;
  scope: AtlasAssistScope;
  sources: AtlasAssistSource[];
  limitations: string[];
  suggestedFollowUps: string[];
  interpretation?: boolean;
}

export type AtlasAssistContentBlockType =
  | "overview"
  | "research"
  | "discovery"
  | "section"
  | "decision"
  | "outcome"
  | "evidence"
  | "related";

export interface AtlasAssistContentBlock {
  id: string;
  type: AtlasAssistContentBlockType;
  title?: string;
  body: string;
  source: AtlasAssistSource;
}

export interface AtlasAssistGroundingSummary {
  title: string;
  sectionTitle?: string;
  entryCount: number;
  caseStudyCount: number;
  frameworkCount: number;
  experimentCount: number;
  sectionCount: number;
  evidenceCount: number;
  decisionCount: number;
  outcomeCount: number;
  limitationCount: number;
  relatedCount: number;
}

export interface AtlasAssistContext {
  scope: AtlasAssistScope;
  projectId?: string;
  sectionId?: string;
  contentBlocks: AtlasAssistContentBlock[];
  sourceIds: string[];
  limitations: string[];
  grounding: AtlasAssistGroundingSummary;
}

export interface AtlasAssistContextInput {
  scope: AtlasAssistScope;
  projectId?: string;
  sectionId?: string;
  query?: string;
}

export interface AtlasAssistProvider {
  answer(input: {
    query: string;
    context: AtlasAssistContext;
  }): Promise<AtlasAssistAnswer>;
}

export type AtlasAssistPromptCategory = "understand" | "explore" | "question";

export interface AtlasAssistPrompt {
  id: string;
  label: string;
  query: string;
  category: AtlasAssistPromptCategory;
}

export type AtlasAssistStatus =
  | "idle"
  | "submitting"
  | "success"
  | "error"
  | "unavailable";

export type AtlasAssistInteractionMethod = "mouse" | "keyboard";

export type AtlasAssistAnalyticsEventName =
  | "atlas_assist_opened"
  | "atlas_assist_scope_changed"
  | "atlas_assist_prompt_selected"
  | "atlas_assist_question_submitted"
  | "atlas_assist_answer_received"
  | "atlas_assist_source_opened"
  | "atlas_assist_failed";

export interface AtlasAssistAnalyticsEvent {
  name: AtlasAssistAnalyticsEventName;
  properties: {
    mode: AtlasAssistMode;
    scope: AtlasAssistScope;
    projectId?: string;
    sectionId?: string;
    sourceCount?: number;
    promptCategory?: AtlasAssistPromptCategory;
    interactionMethod?: AtlasAssistInteractionMethod;
    queryLength?: number;
  };
}
