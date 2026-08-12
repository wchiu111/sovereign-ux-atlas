import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AtlasAssistProviderError,
  createAtlasAssistProviderSelection,
} from "../atlas-assist/providers";
import { executeAtlasAssistQuestion } from "../atlas-assist/submitAtlasAssistQuestion";
import { useAtlasAssistContext } from "./useAtlasAssistContext";
import type {
  AtlasAssistAnalyticsEvent,
  AtlasAssistAnswer,
  AtlasAssistInteractionMethod,
  AtlasAssistMode,
  AtlasAssistPromptCategory,
  AtlasAssistProvider,
  AtlasAssistScope,
  AtlasAssistStatus,
} from "../types/atlasAssist";

const REQUEST_TIMEOUT = 15_000;

interface StoredAssistSession {
  scope: AtlasAssistScope;
  query: string;
  answer: AtlasAssistAnswer | null;
}

function readSession(key: string, fallbackScope: AtlasAssistScope): StoredAssistSession {
  if (typeof window === "undefined") {
    return { scope: fallbackScope, query: "", answer: null };
  }
  try {
    const stored = window.sessionStorage.getItem(key);
    if (!stored) return { scope: fallbackScope, query: "", answer: null };
    const parsed = JSON.parse(stored) as StoredAssistSession;
    return {
      scope: parsed.scope ?? fallbackScope,
      query: typeof parsed.query === "string" ? parsed.query : "",
      answer: parsed.answer ?? null,
    };
  } catch {
    return { scope: fallbackScope, query: "", answer: null };
  }
}

export function useAtlasAssist({
  mode,
  projectId,
  sectionId,
  defaultScope,
  lockedScope,
  provider: suppliedProvider,
  onAnalyticsEvent,
}: {
  mode: AtlasAssistMode;
  projectId?: string;
  sectionId?: string;
  defaultScope: AtlasAssistScope;
  lockedScope?: AtlasAssistScope;
  provider?: AtlasAssistProvider;
  onAnalyticsEvent?: (event: AtlasAssistAnalyticsEvent) => void;
}) {
  const sessionKey = `atlas-assist:${mode}:${projectId ?? "atlas"}:${sectionId ?? "overview"}`;
  const initial = useMemo(
    () => {
      const stored = readSession(sessionKey, defaultScope);
      if (!lockedScope) return stored;
      if (stored.answer && stored.answer.scope !== lockedScope) {
        return { scope: lockedScope, query: "", answer: null };
      }
      return { ...stored, scope: lockedScope };
    },
    [sessionKey, defaultScope, lockedScope],
  );
  const providerSelection = useMemo(() => {
    if (suppliedProvider) {
      return {
        mode: "deterministic" as const,
        provider: suppliedProvider,
        endpoint: undefined,
        selectionError: null,
      };
    }
    try {
      return { ...createAtlasAssistProviderSelection(), selectionError: null };
    } catch (caught) {
      return {
        mode: "unavailable" as const,
        provider: null,
        endpoint: undefined,
        selectionError: caught,
      };
    }
  }, [suppliedProvider]);
  const [scope, setScopeState] = useState<AtlasAssistScope>(initial.scope);
  const [query, setQuery] = useState(initial.query);
  const [answer, setAnswer] = useState<AtlasAssistAnswer | null>(initial.answer);
  const [status, setStatus] = useState<AtlasAssistStatus>(initial.answer ? "success" : "idle");
  const [error, setError] = useState<string | null>(null);
  const [progressIndex, setProgressIndex] = useState(0);
  const requestIdRef = useRef(0);
  const { context, error: contextError, prompts } = useAtlasAssistContext({
    mode,
    scope,
    projectId,
    sectionId,
    query,
  });

  const emit = useCallback(
    (event: AtlasAssistAnalyticsEvent) => onAnalyticsEvent?.(event),
    [onAnalyticsEvent],
  );

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    console.debug("[Atlas Assist] provider.selected", JSON.stringify({
      mode: providerSelection.mode,
      endpoint: providerSelection.endpoint ?? null,
      hasQuestion: false,
      scope,
      projectId,
      sectionId,
    }));
  }, [projectId, providerSelection.endpoint, providerSelection.mode, scope, sectionId]);

  useEffect(() => {
    const stored = readSession(sessionKey, defaultScope);
    setScopeState(lockedScope ?? stored.scope);
    const canRestoreStoredAnswer = !lockedScope || stored.answer?.scope === lockedScope;
    const storedAnswer = canRestoreStoredAnswer ? stored.answer : null;
    setQuery(canRestoreStoredAnswer ? stored.query : "");
    setAnswer(storedAnswer);
    setStatus(storedAnswer ? "success" : "idle");
    setError(null);
  }, [defaultScope, lockedScope, sessionKey]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        sessionKey,
        JSON.stringify({ scope, query, answer } satisfies StoredAssistSession),
      );
    } catch {
      // Session persistence is optional when storage is unavailable.
    }
  }, [answer, query, scope, sessionKey]);

  useEffect(() => {
    if (!contextError) return;
    setError("Atlas could not prepare the current grounding context.");
    setStatus("error");
    if (import.meta.env.DEV) {
      console.error("[Atlas Assist] context.build.failed", contextError);
    }
  }, [contextError]);

  const setScope = useCallback((nextScope: AtlasAssistScope) => {
    if (lockedScope) return;
    requestIdRef.current += 1;
    setScopeState(nextScope);
    setAnswer(null);
    setStatus("idle");
    setError(null);
    emit({
      name: "atlas_assist_scope_changed",
      properties: { mode, scope: nextScope, projectId, sectionId },
    });
  }, [emit, lockedScope, mode, projectId, sectionId]);

  const submitQuestion = useCallback(async (
    nextQuery: string,
    options: {
      promptCategory?: AtlasAssistPromptCategory;
      interactionMethod?: AtlasAssistInteractionMethod;
    } = {},
  ) => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const clean = nextQuery.trim();

    if (import.meta.env.DEV) {
      console.debug("[Atlas Assist] submit.received", JSON.stringify({
        mode: providerSelection.mode,
        endpoint: providerSelection.endpoint ?? null,
        hasQuestion: Boolean(clean),
        scope,
        projectId,
        sectionId,
      }));
    }

    let progressTimer: number | undefined;
    const result = await executeAtlasAssistQuestion({
      question: nextQuery,
      getContext: () => {
        if (contextError) throw contextError;
        if (!context) throw new Error("Atlas Assist context is unavailable.");
        if (providerSelection.selectionError) throw providerSelection.selectionError;
        if (!providerSelection.provider) {
          throw new AtlasAssistProviderError(
            "provider_unavailable",
            "Atlas Assist is not available on this deployment.",
          );
        }
        return context;
      },
      provider: providerSelection.provider ?? {
        answer: async () => {
          throw new AtlasAssistProviderError(
            "provider_unavailable",
            "Atlas Assist is not available on this deployment.",
          );
        },
      },
      timeoutMs: REQUEST_TIMEOUT,
      onSubmitting: (submittedQuery) => {
        setQuery(submittedQuery);
        setStatus("submitting");
        setAnswer(null);
        setError(null);
        setProgressIndex(0);
        progressTimer = window.setInterval(() => {
          setProgressIndex((current) => Math.min(2, current + 1));
        }, 420);
        emit({
          name: options.promptCategory
            ? "atlas_assist_prompt_selected"
            : "atlas_assist_question_submitted",
          properties: {
            mode,
            scope,
            projectId,
            sectionId,
            promptCategory: options.promptCategory,
            interactionMethod: options.interactionMethod,
            queryLength: submittedQuery.length,
          },
        });
        if (import.meta.env.DEV) {
          console.debug("[Atlas Assist] provider.answer.start", {
            mode: providerSelection.mode,
            scope,
            projectId,
            sectionId,
          });
        }
      },
      onSuccess: (nextAnswer) => {
        if (requestId !== requestIdRef.current) return;
        setAnswer(nextAnswer);
        setStatus("success");
        emit({
          name: "atlas_assist_answer_received",
          properties: {
            mode,
            scope,
            projectId,
            sectionId,
            sourceCount: nextAnswer.sources.length,
          },
        });
        if (import.meta.env.DEV) {
          console.debug("[Atlas Assist] provider.answer.success", {
            mode: providerSelection.mode,
            sourceCount: nextAnswer.sources.length,
          });
        }
      },
      onFailure: (message, unavailable, caught) => {
        if (requestId !== requestIdRef.current) return;
        setError(message);
        setStatus(unavailable ? "unavailable" : "error");
        emit({
          name: "atlas_assist_failed",
          properties: { mode, scope, projectId, sectionId },
        });
        if (import.meta.env.DEV) {
          console.error("[Atlas Assist] submit.failed", caught);
        }
      },
    });

    if (progressTimer !== undefined) window.clearInterval(progressTimer);
    return result;
  }, [context, contextError, emit, mode, projectId, providerSelection, scope, sectionId]);

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    try {
      window.sessionStorage.removeItem(sessionKey);
    } catch {
      // Session persistence is optional when storage is unavailable.
    }
    setAnswer(null);
    setQuery("");
    setStatus("idle");
    setError(null);
    setProgressIndex(0);
  }, [sessionKey]);

  return {
    scope,
    setScope,
    query,
    answer,
    status,
    error,
    progressIndex,
    context,
    prompts,
    providerMode: providerSelection.mode,
    submitQuestion,
    submit: submitQuestion,
    reset,
  };
}
