import { useEffect, useRef, useState, type RefObject } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useAtlasAssist } from "../../hooks/useAtlasAssist";
import type {
  AtlasAssistAnalyticsEvent,
  AtlasAssistInteractionMethod,
  AtlasAssistMode,
  AtlasAssistPromptCategory,
  AtlasAssistProvider,
  AtlasAssistSource,
} from "../../types/atlasAssist";
import AtlasAssistAnswer from "./AtlasAssistAnswer";
import AtlasAssistStatus from "./AtlasAssistStatus";
import AtlasAssistSuggestions from "./AtlasAssistSuggestions";
import "./atlasAssist.css";

export default function AtlasAssistPanel({
  mode,
  projectId,
  sectionId,
  color,
  initialQuery,
  initialPromptCategory,
  initialInteractionMethod,
  returnFocusRef,
  onClose,
  onOpenSource,
  provider,
  onAnalyticsEvent,
}: {
  mode: AtlasAssistMode;
  projectId: string;
  sectionId?: string;
  color: string;
  initialQuery?: string;
  initialPromptCategory?: AtlasAssistPromptCategory;
  initialInteractionMethod?: AtlasAssistInteractionMethod;
  returnFocusRef?: RefObject<HTMLElement>;
  onClose: () => void;
  onOpenSource: (source: AtlasAssistSource) => void;
  provider?: AtlasAssistProvider;
  onAnalyticsEvent?: (event: AtlasAssistAnalyticsEvent) => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const submittedInitialRef = useRef<string | null>(null);
  const submissionMethodRef = useRef<AtlasAssistInteractionMethod>("keyboard");
  const [question, setQuestion] = useState("");
  const assist = useAtlasAssist({
    mode,
    projectId,
    sectionId,
    defaultScope: "project",
    lockedScope: "project",
    provider,
    onAnalyticsEvent,
  });

  const close = () => {
    if (mode === "focused") assist.reset();
    onClose();
    requestAnimationFrame(() => returnFocusRef?.current?.focus());
  };

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    onAnalyticsEvent?.({
      name: "atlas_assist_opened",
      properties: {
        mode,
        scope: assist.scope,
        projectId,
        sectionId,
      },
    });
  }, []);

  useEffect(() => {
    if (!initialQuery || submittedInitialRef.current === initialQuery) return;
    if (assist.answer && assist.query === initialQuery) {
      submittedInitialRef.current = initialQuery;
      return;
    }
    submittedInitialRef.current = initialQuery;
    void assist.submitQuestion(initialQuery, {
      promptCategory: initialPromptCategory,
      interactionMethod: initialInteractionMethod,
    });
  }, [initialInteractionMethod, initialPromptCategory, initialQuery]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (mode === "focused" && window.location.hash) return;
      event.preventDefault();
      close();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [mode]);

  const openSource = (source: AtlasAssistSource) => {
    onAnalyticsEvent?.({
      name: "atlas_assist_source_opened",
      properties: {
        mode,
        scope: assist.scope,
        projectId,
        sectionId,
        sourceCount: assist.answer?.sources.length,
      },
    });
    onOpenSource(source);
  };

  const selectPrompt = (
    prompt: (typeof assist.prompts)[number],
    interactionMethod: AtlasAssistInteractionMethod,
  ) => {
    if (prompt.category === "question") {
      requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
      return;
    }
    void assist.submitQuestion(prompt.query, {
      promptCategory: prompt.category,
      interactionMethod,
    });
  };

  const submitQuestion = async (nextQuestion: string) => {
    if (import.meta.env.DEV) {
      console.debug("[Atlas Assist] panel.submit", {
        hasQuestion: Boolean(nextQuestion.trim()),
        scope: assist.scope,
        projectId,
        sectionId,
        interactionMethod: submissionMethodRef.current,
      });
    }
    const result = await assist.submitQuestion(nextQuestion, {
      interactionMethod: submissionMethodRef.current,
    });
    if (result === "success") setQuestion("");
  };

  const grounding = assist.context?.grounding;
  const focused = mode === "focused";
  const renderBody = () => {
    switch (assist.status) {
      case "idle":
        return (
          <>
            <p className="atlas-assist-panel__invitation">
              {focused ? "Not sure what to ask? Try one of these:" : "What would you like to understand?"}
            </p>
            <AtlasAssistSuggestions
              prompts={assist.prompts}
              compact={focused}
              onSelect={(prompt, method) => selectPrompt(prompt, method)}
            />
          </>
        );
      case "submitting":
        return assist.context ? (
          <AtlasAssistStatus context={assist.context} progressIndex={assist.progressIndex} />
        ) : (
          <AtlasAssistStatus progressIndex={assist.progressIndex} error="Atlas could not prepare the current grounding context." />
        );
      case "success":
        return assist.answer ? (
          <AtlasAssistAnswer
            answer={assist.answer}
            grounding={assist.context?.grounding}
            question={assist.query}
            showSources={!focused}
            onOpenSource={openSource}
          />
        ) : (
          <AtlasAssistStatus progressIndex={assist.progressIndex} error="Atlas returned no grounded answer." />
        );
      case "error":
      case "unavailable":
        return (
          <AtlasAssistStatus
            context={assist.context}
            progressIndex={assist.progressIndex}
            error={assist.error ?? (
              assist.status === "unavailable"
                ? "Atlas Assist is not available on this deployment."
                : "Atlas could not prepare a grounded answer."
            )}
            onRetry={assist.query ? () => void assist.submitQuestion(assist.query) : undefined}
          />
        );
    }
  };

  return (
    <section
      className={`atlas-assist-panel${focused ? " atlas-assist-panel--focused" : ""}`}
      style={{ "--atlas-assist-color": color } as React.CSSProperties}
      role="complementary"
      aria-label={mode === "focused" ? "Consult this section" : "Ask a question"}
      data-mode={mode}
      data-status={assist.status}
    >
      <header className="atlas-assist-panel__header">
        {focused ? (
          <div className="atlas-assist-panel__focused-title">
            <span aria-hidden="true">✦</span>
            <h2 ref={headingRef} tabIndex={-1}>Ask about this section</h2>
          </div>
        ) : (
          <div>
            <div className="atlas-assist-section-heading">ASK A QUESTION</div>
            <h2 ref={headingRef} tabIndex={-1}>
              {grounding?.title ?? "Atlas consultation"}
            </h2>
          </div>
        )}
        <button
          type="button"
          className="atlas-assist-panel__close"
          onClick={close}
          aria-label={focused ? "Close Ask about this section" : undefined}
        >
          {focused ? (
            <X aria-hidden="true" size={16} strokeWidth={1.35} />
          ) : (
            <>
              <ArrowLeft aria-hidden="true" size={14} strokeWidth={1.35} />
              <span>Overview</span>
            </>
          )}
        </button>
      </header>

      <div className="atlas-assist-panel__body">
        {renderBody()}
      </div>

      <footer className="atlas-assist-panel__footer">
        <form
          className="atlas-assist-question"
          onSubmit={(event) => {
            event.preventDefault();
            void submitQuestion(question);
          }}
        >
          <label
            className="atlas-assist-visually-hidden"
            htmlFor={`atlas-assist-question-${mode}-${projectId}`}
          >
            Ask another question
          </label>
          <div>
            <input
              ref={inputRef}
              id={`atlas-assist-question-${mode}-${projectId}`}
              value={question}
              disabled={assist.status === "submitting"}
              onChange={(event) => setQuestion(event.currentTarget.value)}
              onKeyDown={(event) => {
                submissionMethodRef.current = "keyboard";
                if (event.key !== "Enter") return;
                event.preventDefault();
                void submitQuestion(event.currentTarget.value);
              }}
              placeholder={assist.status === "idle" ? "Ask a question..." : "Ask another question..."}
              aria-invalid={assist.error === "Enter a question before consulting Atlas." || undefined}
            />
            <button
              type="submit"
              disabled={assist.status === "submitting"}
              aria-label="Ask Atlas this question"
              onPointerDown={() => { submissionMethodRef.current = "mouse"; }}
              onKeyDown={() => { submissionMethodRef.current = "keyboard"; }}
            >
              <ArrowRight aria-hidden="true" size={15} strokeWidth={1.35} />
            </button>
          </div>
        </form>
      </footer>
    </section>
  );
}
