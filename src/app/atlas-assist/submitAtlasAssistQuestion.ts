import type {
  AtlasAssistAnswer,
  AtlasAssistContext,
  AtlasAssistProvider,
} from "../types/atlasAssist";
import { AtlasAssistProviderError } from "./providers";

export type AtlasAssistSubmissionResult = "success" | "error" | "unavailable";

export async function executeAtlasAssistQuestion({
  question,
  getContext,
  provider,
  timeoutMs,
  onSubmitting,
  onSuccess,
  onFailure,
}: {
  question: string;
  getContext: () => AtlasAssistContext;
  provider: AtlasAssistProvider;
  timeoutMs: number;
  onSubmitting: (question: string) => void;
  onSuccess: (answer: AtlasAssistAnswer) => void;
  onFailure: (message: string, unavailable: boolean, error: unknown) => void;
}): Promise<AtlasAssistSubmissionResult> {
  const clean = question.trim();
  if (!clean) {
    const error = new Error("Enter a question before consulting Atlas.");
    onFailure(error.message, false, error);
    return "error";
  }

  try {
    const context = getContext();
    onSubmitting(clean);

    let timeoutId: ReturnType<typeof globalThis.setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = globalThis.setTimeout(
        () => reject(new Error("Atlas Assist timed out.")),
        timeoutMs,
      );
    });

    try {
      const answer = await Promise.race([
        provider.answer({ query: clean, context }),
        timeout,
      ]);
      if (!answer?.answer) {
        throw new Error("Atlas Assist returned an empty answer.");
      }
      onSuccess(answer);
      return "success";
    } finally {
      if (timeoutId !== undefined) globalThis.clearTimeout(timeoutId);
    }
  } catch (caught) {
    const unavailable = caught instanceof AtlasAssistProviderError
      && caught.code === "provider_unavailable";
    const message = caught instanceof AtlasAssistProviderError
      ? caught.message
      : "Atlas could not prepare a grounded answer.";
    onFailure(message, unavailable, caught);
    return unavailable ? "unavailable" : "error";
  }
}
