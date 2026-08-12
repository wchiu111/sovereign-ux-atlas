import type {
  AtlasAssistContext,
  AtlasAssistMode,
  AtlasAssistPrompt,
} from "../types/atlasAssist";

function prompt(
  id: string,
  label: string,
  category: AtlasAssistPrompt["category"],
  query = label,
): AtlasAssistPrompt {
  return { id, label, query, category };
}

function focusedUnderstand(sectionId?: string) {
  if (sectionId === "problem") {
    return [
      prompt("explain-problem", "Explain this section", "understand"),
      prompt("why-problem", "Why did this matter?", "understand"),
      prompt("core-problem", "What is the core problem?", "understand"),
    ];
  }
  if (sectionId === "approach") {
    return [
      prompt("summarize-approach", "Summarize the approach", "understand"),
      prompt("why-method", "Why was this method chosen?", "understand"),
      prompt("approach-tradeoffs", "What tradeoffs were documented?", "understand"),
    ];
  }
  if (sectionId === "outcomes") {
    return [
      prompt("summarize-outcomes", "Summarize the outcomes", "understand"),
      prompt("evidenced-outcomes", "Which outcomes are directly evidenced?", "understand"),
      prompt("unvalidated-outcomes", "What remains unvalidated?", "understand"),
    ];
  }
  if (sectionId === "decisions") {
    return [
      prompt("summarize-decisions", "Summarize the design decisions", "understand"),
      prompt("decision-rationale", "Why were these decisions made?", "understand"),
      prompt("decision-tradeoffs", "What tradeoffs were documented?", "understand"),
    ];
  }
  return [
    prompt("explain-section", "Explain this section", "understand"),
    prompt("key-insight", "What is the key insight?", "understand"),
    prompt("why-matter", "Why does this matter?", "understand"),
  ];
}

export function getAtlasAssistPrompts({
  mode,
  context,
}: {
  mode: AtlasAssistMode;
  context: AtlasAssistContext;
}): AtlasAssistPrompt[] {
  const prompts: AtlasAssistPrompt[] = [];
  const hasEvidence = context.grounding.evidenceCount > 0;
  const hasDecisions = context.grounding.decisionCount > 0;
  const hasLimitations = context.grounding.limitationCount > 0;
  const hasRelated = context.grounding.relatedCount > 0;

  if (mode === "focused" && context.scope === "section") {
    prompts.push(...focusedUnderstand(context.sectionId));
  } else if (context.scope === "atlas") {
    prompts.push(
      prompt("atlas-summary", "Summarize the documented Atlas", "understand"),
      prompt("atlas-themes", "What themes connect this work?", "understand"),
      prompt("atlas-case-studies", "Compare the documented case studies", "explore"),
    );
  } else {
    prompts.push(
      prompt("project-summary", "Summarize this project", "understand"),
      prompt("project-problem", "What problem was Wilson solving?", "understand"),
      prompt("project-research", "What was the research focus?", "understand"),
    );
  }

  if (hasEvidence) {
    prompts.push(prompt("supporting-evidence", "Show supporting evidence", "explore"));
  }
  if (hasDecisions) {
    prompts.push(prompt("design-decisions", "Show the documented design decisions", "explore"));
  }
  if (hasRelated) {
    prompts.push(prompt("related-work", "Connect explicitly related work", "explore"));
  } else if (hasLimitations) {
    prompts.push(prompt("limitations", "What should be interpreted cautiously?", "explore"));
  }

  prompts.push(prompt("custom", "Ask your own question", "question", ""));
  const customPrompt = prompts.find((item) => item.category === "question");
  return [
    ...prompts.filter((item) => item.category !== "question").slice(0, 5),
    ...(customPrompt ? [customPrompt] : []),
  ];
}

export function getAtlasAssistFollowUps(context: AtlasAssistContext) {
  const followUps = getAtlasAssistPrompts({
    mode: context.scope === "section" ? "focused" : "overview",
    context,
  })
    .filter((item) => item.category !== "question")
    .map((item) => item.query);

  return Array.from(new Set(followUps)).slice(0, 3);
}
