import { useCallback, useEffect, useRef, useState } from "react";
import {
  ATLAS_GUIDED_PROMPTS,
  ATLAS_NO_RESULT_SUGGESTIONS,
} from "../data/atlasGuidedPrompts";
import { ATLAS_SEARCH_INDEX } from "../data/atlasSearchIndex";
import { useAtlasSearch } from "../hooks/useAtlasSearch";
import {
  getAtlasSearchPreviewDestination,
  resolveAtlasSearchDestination,
  validateAtlasSearchDestinations,
} from "../search/resolveAtlasSearchDestination";
import { topicForAtlasQuery } from "../search/searchAtlas";
import type {
  AtlasSearchAnalyticsEvent,
  AtlasSearchDestination,
  AtlasSearchEntry,
  AtlasSearchInteractionMethod,
  AtlasSearchKind,
  AtlasSearchMatch,
} from "../types/atlasSearch";

export type { AtlasSearchAnalyticsEvent } from "../types/atlasSearch";

interface AtlasCommandPaletteProps {
  onOpenChange?: (open: boolean) => void;
  onPreviewDestination?: (destinationId: string | null) => void;
  onNavigate?: (destination: AtlasSearchDestination) => void;
  onAnalyticsEvent?: (event: AtlasSearchAnalyticsEvent) => void;
}

const RESULT_COLORS: Record<AtlasSearchKind, string> = {
  system: "#E8C86D",
  "case-study": "#798BDF",
  framework: "#63C391",
  experiment: "#A68BD4",
  observatory: "#E8C86D",
};

const destinationIssues = validateAtlasSearchDestinations(ATLAS_SEARCH_INDEX);
if (import.meta.env.DEV) {
  destinationIssues.forEach((issue) => console.warn(issue.message));
}

function interactionFromPointer(pointerType: string): AtlasSearchInteractionMethod {
  return pointerType === "touch" ? "touch" : "mouse";
}

function availabilityLabel(entry: AtlasSearchEntry) {
  if (entry.availability === "available") return null;
  if (entry.availability === "preview" && entry.releaseVersion) {
    return `AVAILABLE IN ATLAS ${entry.releaseVersion}`;
  }
  return entry.availability === "preview" ? "PREVIEW" : "PLANNED";
}

export default function AtlasCommandPalette({
  onOpenChange,
  onPreviewDestination,
  onNavigate,
  onAnalyticsEvent,
}: AtlasCommandPaletteProps) {
  const { query, setQuery, normalizedQuery, matches } = useAtlasSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isOpenRef = useRef(false);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const pointerMethodRef = useRef<AtlasSearchInteractionMethod>("mouse");
  const openMethodRef = useRef<AtlasSearchInteractionMethod>("mouse");
  const lastNoResultQueryRef = useRef("");

  const openPalette = useCallback((method: AtlasSearchInteractionMethod) => {
    if (!isOpenRef.current) {
      openMethodRef.current = method;
      isOpenRef.current = true;
      setIsOpen(true);
      onOpenChange?.(true);
      onAnalyticsEvent?.({
        name: "atlas_search_opened",
        properties: { interactionMethod: method },
      });
    }
  }, [onAnalyticsEvent, onOpenChange]);

  const closePalette = useCallback((restoreFocus: boolean) => {
    if (isOpenRef.current) {
      isOpenRef.current = false;
      setIsOpen(false);
      onOpenChange?.(false);
    }
    setActiveIndex(-1);
    onPreviewDestination?.(null);

    if (restoreFocus) {
      const target = returnFocusRef.current;
      requestAnimationFrame(() => target?.focus());
    }
  }, [onOpenChange, onPreviewDestination]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.tagName === "INPUT"
        || target?.tagName === "TEXTAREA"
        || target?.isContentEditable;
      const isShortcut = (event.key === "/" && !typing)
        || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k");

      if (isShortcut) {
        event.preventDefault();
        if (document.activeElement !== inputRef.current) {
          returnFocusRef.current = document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        }
        openPalette("keyboard");
        inputRef.current?.focus();
      } else if (event.key === "Escape" && isOpenRef.current) {
        event.preventDefault();
        const restoreShortcutFocus = openMethodRef.current === "keyboard";
        if (restoreShortcutFocus) inputRef.current?.blur();
        closePalette(restoreShortcutFocus);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closePalette, openPalette]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (
        isOpenRef.current
        && rootRef.current
        && !rootRef.current.contains(event.target as Node)
      ) {
        closePalette(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [closePalette]);

  useEffect(() => {
    const match = activeIndex >= 0 ? matches[activeIndex] : undefined;
    onPreviewDestination?.(
      match ? getAtlasSearchPreviewDestination(match.entry.id) ?? null : null,
    );
  }, [activeIndex, matches, onPreviewDestination]);

  useEffect(() => {
    if (!isOpen || normalizedQuery.length < 2 || matches.length > 0) {
      lastNoResultQueryRef.current = "";
      return;
    }

    const timer = window.setTimeout(() => {
      if (lastNoResultQueryRef.current === normalizedQuery) return;
      lastNoResultQueryRef.current = normalizedQuery;
      onAnalyticsEvent?.({
        name: "atlas_no_results",
        properties: {
          queryLength: query.trim().length,
          resultCount: 0,
          topic: topicForAtlasQuery(query),
        },
      });
    }, 220);

    return () => window.clearTimeout(timer);
  }, [isOpen, matches.length, normalizedQuery, onAnalyticsEvent, query]);

  const updateQuery = (
    nextQuery: string,
    method: AtlasSearchInteractionMethod,
  ) => {
    setQuery(nextQuery);
    setActiveIndex(-1);
    openPalette(method);
    onAnalyticsEvent?.({
      name: "atlas_query_changed",
      properties: {
        queryLength: nextQuery.trim().length,
        interactionMethod: method,
        topic: topicForAtlasQuery(nextQuery),
      },
    });
  };

  const navigate = (
    match: AtlasSearchMatch,
    method: AtlasSearchInteractionMethod,
  ) => {
    const destination = resolveAtlasSearchDestination(match.entry.id);
    if (!destination) {
      if (import.meta.env.DEV) {
        console.warn(`Atlas search could not resolve "${match.entry.id}".`);
      }
      return;
    }

    const selectedPosition = matches.findIndex(
      (candidate) => candidate.entry.id === match.entry.id,
    ) + 1;
    const eventProperties = {
      queryLength: query.trim().length,
      resultCount: matches.length,
      interactionMethod: method,
      topic: topicForAtlasQuery(query),
    };

    onAnalyticsEvent?.({
      name: "atlas_query_submitted",
      properties: eventProperties,
    });
    onAnalyticsEvent?.({
      name: "atlas_result_selected",
      properties: {
        ...eventProperties,
        selectedResultType: match.entry.kind,
        selectedPosition,
        matchedBy: match.matchedBy,
      },
    });

    onPreviewDestination?.(null);
    closePalette(false);
    setQuery("");
    onNavigate?.(destination);
  };

  const choosePrompt = (
    promptId: string,
    promptQuery: string,
    destinationId: string,
    method: AtlasSearchInteractionMethod,
  ) => {
    onAnalyticsEvent?.({
      name: "atlas_guided_prompt_selected",
      properties: {
        promptId,
        queryLength: promptQuery.length,
        interactionMethod: method,
        topic: topicForAtlasQuery(promptQuery),
      },
    });

    const destination = resolveAtlasSearchDestination(destinationId);
    if (!destination) {
      if (import.meta.env.DEV) {
        console.warn(`Atlas guided path could not resolve "${destinationId}".`);
      }
      updateQuery(promptQuery, method);
      return;
    }

    onPreviewDestination?.(null);
    closePalette(false);
    setQuery("");
    onNavigate?.(destination);
  };

  const activeDescendant = activeIndex >= 0 && matches[activeIndex]
    ? `atlas-result-${matches[activeIndex].entry.id}`
    : undefined;

  return (
    <div
      ref={rootRef}
      className="atlas-search-v2"
      style={{
        position: "absolute",
        top: 30,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        width: "min(45vw, 470px)",
        minWidth: 360,
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          minHeight: 40,
          borderBottom: `1px solid ${isOpen ? "rgba(232,200,109,0.78)" : "rgba(232,200,109,0.46)"}`,
          boxShadow: isOpen ? "0 10px 22px -17px rgba(232,200,109,0.72)" : "none",
          transition: "border-color 220ms cubic-bezier(0.16,1,0.3,1), box-shadow 220ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            color: "#E8C86D",
            fontSize: 17,
            lineHeight: 1,
            opacity: isOpen ? 1 : 0.72,
          }}
        >
          ✦
        </span>
        <input
          ref={inputRef}
          value={query}
          role="combobox"
          aria-label="Search the Sovereign Atlas"
          aria-expanded={isOpen}
          aria-controls="atlas-search-results"
          aria-autocomplete="list"
          aria-activedescendant={activeDescendant}
          placeholder="What would you like to explore today?"
          onPointerDown={(event) => {
            pointerMethodRef.current = interactionFromPointer(event.pointerType);
            if (document.activeElement !== inputRef.current) {
              returnFocusRef.current = document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
            }
          }}
          onFocus={(event) => {
            if (!returnFocusRef.current && event.relatedTarget instanceof HTMLElement) {
              returnFocusRef.current = event.relatedTarget;
            }
            openPalette(pointerMethodRef.current);
          }}
          onClick={() => openPalette(pointerMethodRef.current)}
          onChange={(event) => updateQuery(event.currentTarget.value, "keyboard")}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" && matches.length) {
              event.preventDefault();
              setActiveIndex((index) => index < 0 ? 0 : (index + 1) % matches.length);
            } else if (event.key === "ArrowUp" && matches.length) {
              event.preventDefault();
              setActiveIndex((index) => index <= 0 ? matches.length - 1 : index - 1);
            } else if (event.key === "Home" && matches.length) {
              event.preventDefault();
              setActiveIndex(0);
            } else if (event.key === "End" && matches.length) {
              event.preventDefault();
              setActiveIndex(matches.length - 1);
            } else if (event.key === "Enter") {
              event.preventDefault();
              const match = matches[activeIndex >= 0 ? activeIndex : 0];
              if (match) {
                navigate(match, "keyboard");
              } else if (normalizedQuery) {
                onAnalyticsEvent?.({
                  name: "atlas_query_submitted",
                  properties: {
                    queryLength: query.trim().length,
                    resultCount: 0,
                    interactionMethod: "keyboard",
                    topic: topicForAtlasQuery(query),
                  },
                });
              }
            }
          }}
          style={{
            flex: 1,
            minWidth: 0,
            height: 40,
            padding: 0,
            border: 0,
            outline: 0,
            background: "transparent",
            color: "#F4EBD0",
            caretColor: "#E8C86D",
            fontFamily: "'EB Garamond', Georgia, serif",
            fontSize: 16,
            lineHeight: 1.2,
          }}
        />
        {query && (
          <button
            type="button"
            aria-label="Clear Atlas search"
            onClick={() => {
              setQuery("");
              setActiveIndex(-1);
              onPreviewDestination?.(null);
              inputRef.current?.focus();
            }}
            style={{
              width: 44,
              height: 44,
              marginRight: -10,
              border: 0,
              background: "transparent",
              color: "rgba(244,235,208,0.48)",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            ×
          </button>
        )}
      </div>

      {isOpen && (
        <div
          id="atlas-search-results"
          role={query.trim() && matches.length ? "listbox" : undefined}
          aria-label={query.trim() && matches.length ? "Atlas search results" : undefined}
          className="atlas-search-panel"
          style={{
            marginTop: 12,
            overflow: "hidden",
            border: "1px solid rgba(232,200,109,0.18)",
            borderRadius: 12,
            background: "rgba(8,8,14,0.86)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 18px 52px rgba(0,0,0,0.24)",
            animation: "atlasSearchReveal 120ms ease-out",
          }}
        >
          {!query.trim() ? (
            <div aria-label="Guided Atlas paths" style={{ padding: "8px 16px" }}>
              {ATLAS_GUIDED_PROMPTS.map((prompt, index) => (
                <button
                  key={prompt.id}
                  type="button"
                  onPointerDown={(event) => {
                    pointerMethodRef.current = interactionFromPointer(event.pointerType);
                  }}
                  onClick={(event) => choosePrompt(
                    prompt.id,
                    prompt.query,
                    prompt.destinationId,
                    event.detail === 0 ? "keyboard" : pointerMethodRef.current,
                  )}
                  onMouseEnter={() => onPreviewDestination?.(
                    prompt.previewDestinationId
                      ? getAtlasSearchPreviewDestination(prompt.previewDestinationId) ?? null
                      : null,
                  )}
                  onMouseLeave={() => onPreviewDestination?.(null)}
                  style={{
                    width: "100%",
                    minHeight: 44,
                    padding: "10px 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    border: 0,
                    boxShadow: index < ATLAS_GUIDED_PROMPTS.length - 1
                      ? "inset 0 -1px rgba(232,200,109,0.10)"
                      : "none",
                    background: "transparent",
                    color: "rgba(244,235,208,0.74)",
                    fontFamily: "'EB Garamond', Georgia, serif",
                    fontSize: 15,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <span>{prompt.label}</span>
                  <span aria-hidden="true" style={{ color: "rgba(232,200,109,0.58)" }}>→</span>
                </button>
              ))}
            </div>
          ) : matches.length ? (
            <div style={{ padding: 4 }} onMouseLeave={() => setActiveIndex(-1)}>
              {matches.map((match, index) => {
                const { entry } = match;
                const active = index === activeIndex;
                const accent = RESULT_COLORS[entry.kind];
                const cardBorder = active ? "rgba(232,200,109,0.20)" : "transparent";
                const status = availabilityLabel(entry);

                return (
                  <button
                    key={entry.id}
                    id={`atlas-result-${entry.id}`}
                    role="option"
                    aria-selected={active}
                    type="button"
                    onPointerDown={(event) => {
                      pointerMethodRef.current = interactionFromPointer(event.pointerType);
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onClick={(event) => navigate(
                      match,
                      event.detail === 0 ? "keyboard" : pointerMethodRef.current,
                    )}
                    style={{
                      width: "100%",
                      minHeight: 84,
                      display: "grid",
                      gridTemplateColumns: "minmax(0,1fr) 24px",
                      alignItems: "center",
                      gap: 16,
                      padding: "14px 16px",
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderTopColor: cardBorder,
                      borderRightColor: cardBorder,
                      borderBottomColor: !active && index < matches.length - 1
                        ? "rgba(232,200,109,0.10)"
                        : cardBorder,
                      borderLeftColor: cardBorder,
                      borderRadius: active ? 9 : 0,
                      background: active ? "rgba(13,13,21,0.92)" : "transparent",
                      color: "#F4EBD0",
                      textAlign: "left",
                      cursor: "pointer",
                      boxShadow: active ? "0 0 24px rgba(232,200,109,0.05)" : "none",
                      transition: "background 180ms ease-out, border-color 180ms ease-out, box-shadow 180ms ease-out",
                    }}
                  >
                    <span style={{ minWidth: 0 }}>
                      <span
                        style={{
                          display: "block",
                          marginBottom: 4,
                          fontFamily: "'EB Garamond', Georgia, serif",
                          fontSize: 18,
                          lineHeight: 1.1,
                          color: active ? "#FFF0BE" : "#F4EBD0",
                        }}
                      >
                        {entry.title}
                      </span>
                      <span
                        style={{
                          display: "block",
                          marginBottom: 7,
                          color: accent,
                          fontFamily: "'DM Mono', ui-monospace, monospace",
                          fontSize: 9,
                          lineHeight: 1.25,
                          letterSpacing: "0.15em",
                        }}
                      >
                        {entry.typeLabel} · {entry.parentLabel}{status ? ` · ${status}` : ""}
                      </span>
                      <span
                        style={{
                          display: "block",
                          color: "rgba(244,235,208,0.68)",
                          fontFamily: "Inter, sans-serif",
                          fontSize: 12,
                          lineHeight: 1.4,
                        }}
                      >
                        {entry.description}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      style={{
                        color: "#E8C86D",
                        fontFamily: "'EB Garamond', Georgia, serif",
                        fontSize: 20,
                        opacity: active ? 1 : 0.64,
                        transform: active ? "translateX(2px)" : "none",
                        transition: "opacity 180ms ease-out, transform 180ms ease-out",
                      }}
                    >
                      →
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div role="status" style={{ padding: "20px 20px 12px" }}>
              <div
                style={{
                  marginBottom: 6,
                  color: "#F4EBD0",
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontSize: 18,
                }}
              >
                No direct path found.
              </div>
              <div
                style={{
                  marginBottom: 10,
                  color: "rgba(244,235,208,0.56)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  lineHeight: 1.5,
                }}
              >
                Try a documented path:
              </div>
              <div aria-label="Alternative Atlas paths">
                {ATLAS_NO_RESULT_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => {
                      updateQuery(suggestion.query, "mouse");
                      inputRef.current?.focus();
                    }}
                    style={{
                      minHeight: 44,
                      marginRight: 18,
                      padding: 0,
                      border: 0,
                      background: "transparent",
                      color: "rgba(232,200,109,0.78)",
                      fontFamily: "'DM Mono', ui-monospace, monospace",
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      cursor: "pointer",
                    }}
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <style>{`
        @keyframes atlasSearchReveal{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:translateY(0)}}
        .atlas-search-panel button:focus-visible{outline:1px solid rgba(232,200,109,.62)!important;outline-offset:-2px}
        @media(max-width:767px){.atlas-search-v2{position:fixed!important;top:68px!important;width:calc(100vw - 32px)!important;min-width:0!important}.atlas-search-panel{max-height:calc(100dvh - 136px);overflow-y:auto!important}#atlas-search-results button[role="option"]{min-height:96px!important;padding:16px!important}}
        @media(prefers-reduced-motion:reduce){.atlas-search-v2 *{animation:none!important;transition-duration:.01ms!important}}
        @media(forced-colors:active){.atlas-search-v2>div:first-child,.atlas-search-panel{border-color:CanvasText!important}.atlas-search-panel button:focus-visible{outline:2px solid Highlight!important}}
      `}</style>
    </div>
  );
}
