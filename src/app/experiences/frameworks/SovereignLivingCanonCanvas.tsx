import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { Minus, Plus, Scan, X } from "lucide-react";
import {
  LIVING_CANON_BANDS,
  LIVING_CANON_COUNTS,
  LIVING_CANON_ENTRIES,
  LIVING_CANON_WORKED_EXAMPLE,
  type LivingCanonBandId,
  type LivingCanonEntry,
} from "../../content/frameworks/sovereign-ux-living-canon";
import { readerSemanticColor } from "../shared/readerSemanticPalette";
import LivingCanonRevisionModel from "./LivingCanonRevisionModel";

type LivingCanonView = "field" | "revision";

interface Props {
  frameworkTitle: string;
  sectionTitle: string;
  onClose: () => void;
  initialView?: LivingCanonView;
}

interface ViewState {
  x: number;
  y: number;
  scale: number;
}

type TransitionPhase = "entering" | "open" | "exiting";

const WORLD_W = 1680;
const WORLD_H = 980;
const MIN_SCALE = 0.42;
const MAX_SCALE = 2.5;
const VIEW_PADDING = 34;
const DETAIL_PANEL_W = 390;

const BAND_COLOR: Record<LivingCanonBandId, string> = {
  presence: "#76C79A",
  integrity: "#7CB4D5",
  threshold: "#D86C61",
};

const BAND_REGION: Record<
  LivingCanonBandId,
  { x: number; y: number; width: number; height: number }
> = {
  presence: { x: 54, y: 116, width: 760, height: 778 },
  integrity: { x: 792, y: 116, width: 412, height: 778 },
  threshold: { x: 1180, y: 116, width: 440, height: 778 },
};

const STARFIELD = Array.from({ length: 118 }, (_, index) => ({
  id: index,
  x: (index * 137 + 61) % WORLD_W,
  y: (index * 211 + 89) % WORLD_H,
  r: index % 13 === 0 ? 1.8 : index % 5 === 0 ? 1.15 : 0.72,
  opacity:
    index % 13 === 0 ? 0.56 : index % 5 === 0 ? 0.34 : 0.18,
}));

const ENTRY_BY_ID = new Map(
  LIVING_CANON_ENTRIES.map((entry) => [entry.id, entry] as const),
);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function worldPosition(entry: LivingCanonEntry) {
  return {
    x: (entry.fieldPosition.x / 100) * WORLD_W,
    y: (entry.fieldPosition.y / 100) * WORLD_H,
  };
}

function bandLabel(entry: LivingCanonEntry) {
  if (entry.kind === "threshold") return "THRESHOLD SIGNAL";
  if (entry.kind === "guardrail") return "INTEGRITY GUARDRAIL";
  return "PATTERN OF PRESENCE";
}

function PreviewCard({
  entry,
  scale,
}: {
  entry: LivingCanonEntry;
  scale: number;
}) {
  const color = BAND_COLOR[entry.band];
  const position = worldPosition(entry);
  const placeLeft = position.x > WORLD_W * 0.68;
  const inverseScale = 1 / scale;

  return (
    <div
      data-canvas-control
      aria-hidden
      style={{
        position: "absolute",
        top: "50%",
        ...(placeLeft ? { right: 58 } : { left: 58 }),
        width: 260,
        transform: `translateY(-50%) scale(${inverseScale})`,
        transformOrigin: placeLeft ? "100% 50%" : "0 50%",
        padding: "15px 16px 14px",
        border: `1px solid ${color}42`,
        background: "rgba(6,8,14,0.97)",
        boxShadow: `0 14px 42px rgba(0,0,0,0.48), 0 0 28px ${color}14`,
        pointerEvents: "none",
        zIndex: 30,
      }}
    >
      <div
        style={{
          marginBottom: 7,
          color,
          fontFamily: "'DM Mono', monospace",
          fontSize: 8.5,
          letterSpacing: "0.16em",
        }}
      >
        {bandLabel(entry)}
      </div>
      <div
        style={{
          marginBottom: 7,
          color: readerSemanticColor.text.primary,
          fontFamily: "'EB Garamond', serif",
          fontSize: 19,
          lineHeight: 1.06,
        }}
      >
        {entry.title}
      </div>
      <div
        style={{
          color: readerSemanticColor.text.secondary,
          fontFamily: "'EB Garamond', serif",
          fontSize: 13.5,
          lineHeight: 1.42,
        }}
      >
        {entry.summary}
      </div>
      <div
        style={{
          marginTop: 10,
          color,
          fontFamily: "'DM Mono', monospace",
          fontSize: 8.5,
          letterSpacing: "0.12em",
        }}
      >
        CLICK TO INSPECT →
      </div>
    </div>
  );
}

function CanonNode({
  entry,
  scale,
  selected,
  previewed,
  related,
  dimmed,
  onPreview,
  onSelect,
}: {
  entry: LivingCanonEntry;
  scale: number;
  selected: boolean;
  previewed: boolean;
  related: boolean;
  dimmed: boolean;
  onPreview: (entryId: string | null) => void;
  onSelect: (entryId: string) => void;
}) {
  const color = BAND_COLOR[entry.band];
  const { x, y } = worldPosition(entry);
  const isThreshold = entry.kind === "threshold";
  const isGuardrail = entry.kind === "guardrail";
  const size = isThreshold ? 34 : isGuardrail ? 38 : 42;
  const screenStableLabel = clamp(10 / scale, 8.4, 14);

  return (
    <div
      data-canon-node
      data-canon-band={entry.band}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 186,
        transform: "translate(-50%, -50%)",
        display: "flex",
        alignItems: "center",
        gap: 13,
        zIndex: selected ? 18 : previewed ? 16 : related ? 12 : 6,
        opacity: dimmed ? 0.18 : related ? 0.96 : 1,
        filter:
          selected || previewed
            ? "brightness(1.12)"
            : dimmed
              ? "saturate(0.55)"
              : "none",
        transition:
          "opacity 220ms ease, filter 220ms ease",
        pointerEvents: "none",
      }}
    >
      <button
        type="button"
        data-canvas-control
        aria-label={`${entry.title}. ${entry.summary}`}
        aria-pressed={selected}
        onMouseEnter={() => onPreview(entry.id)}
        onMouseLeave={() => onPreview(null)}
        onFocus={() => onPreview(entry.id)}
        onBlur={() => onPreview(null)}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(entry.id);
        }}
        style={{
          position: "relative",
          width: size,
          height: size,
          flexShrink: 0,
          borderRadius: "50%",
          border: `${selected ? 2 : 1}px solid ${
            selected ? color : related || previewed ? `${color}C8` : `${color}88`
          }`,
          background:
            `radial-gradient(circle at 38% 34%, ${color}E8 0%, ${color}82 18%, ${color}28 46%, transparent 72%)`,
          boxShadow: selected
            ? `0 0 0 9px ${color}18, 0 0 30px ${color}66, 0 0 72px ${color}22`
            : previewed
              ? `0 0 0 6px ${color}13, 0 0 26px ${color}52`
              : related
                ? `0 0 0 5px ${color}0E, 0 0 22px ${color}36`
                : `0 0 0 7px ${color}0E, 0 0 22px ${color}38, 0 0 58px ${color}16`,
          cursor: "pointer",
          pointerEvents: "auto",
          transition:
            "border-color 180ms ease, box-shadow 180ms ease, transform 180ms cubic-bezier(.16,1,.3,1)",
          transform: selected || previewed ? "scale(1.08)" : "scale(1)",
          outline: "none",
        }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: isThreshold ? 7 : 8,
            height: isThreshold ? 7 : 8,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            background: color,
            boxShadow: `0 0 12px ${color}CC`,
          }}
        />
      </button>

      <span
        aria-hidden
        style={{
          minWidth: 0,
          maxWidth: 132,
          color: isThreshold ? `${color}E8` : readerSemanticColor.text.secondary,
          fontFamily: "'DM Mono', monospace",
          fontSize: screenStableLabel,
          lineHeight: 1.28,
          letterSpacing: "0.025em",
          textShadow: "0 1px 2px rgba(0,0,0,0.88)",
          transition: "color 180ms ease, opacity 180ms ease",
          opacity: dimmed ? 0.5 : 1,
          pointerEvents: "none",
        }}
      >
        {entry.title}
      </span>

      {previewed && !selected && (
        <PreviewCard entry={entry} scale={scale} />
      )}
    </div>
  );
}

function DetailSection({
  label,
  children,
  color,
}: {
  label: string;
  children: ReactNode;
  color: string;
}) {
  return (
    <section style={{ marginBottom: 22 }}>
      <div
        style={{
          marginBottom: 8,
          color,
          fontFamily: "'DM Mono', monospace",
          fontSize: 8.5,
          letterSpacing: "0.18em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: readerSemanticColor.text.secondary,
          fontFamily: "'EB Garamond', serif",
          fontSize: 15.5,
          lineHeight: 1.5,
        }}
      >
        {children}
      </div>
    </section>
  );
}

function CanonDetailPanel({
  entry,
  onClose,
  onSelectRelated,
  onTrace,
}: {
  entry: LivingCanonEntry;
  onClose: () => void;
  onSelectRelated: (entryId: string) => void;
  onTrace: (entryId: string) => void;
}) {
  const color = BAND_COLOR[entry.band];

  return (
    <aside
      data-canon-detail-panel
      data-canvas-control
      aria-label={`${entry.title} details`}
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 40,
        width: DETAIL_PANEL_W,
        display: "flex",
        flexDirection: "column",
        borderLeft: `1px solid ${color}28`,
        background:
          "linear-gradient(180deg, rgba(6,8,14,0.995), rgba(4,6,11,0.99))",
        boxShadow: "-24px 0 70px rgba(0,0,0,0.42)",
        animation: "canonDetailEnter 260ms cubic-bezier(.16,1,.3,1) both",
      }}
    >
      <div
        style={{
          padding: "19px 20px 17px",
          borderBottom: "1px solid rgba(200,180,130,0.09)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "flex-start",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                marginBottom: 8,
                color,
                fontFamily: "'DM Mono', monospace",
                fontSize: 8.5,
                letterSpacing: "0.18em",
              }}
            >
              {bandLabel(entry)}
            </div>
            <div
              style={{
                color: readerSemanticColor.text.primary,
                fontFamily: "'EB Garamond', serif",
                fontSize: 27,
                lineHeight: 1.05,
              }}
            >
              {entry.title}
            </div>
          </div>

          <button
            type="button"
            data-canvas-control
            onClick={onClose}
            aria-label="Close Canon entry"
            style={{
              width: 36,
              height: 36,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              border: "1px solid rgba(200,180,130,0.16)",
              background: "rgba(255,255,255,0.025)",
              color: readerSemanticColor.text.secondary,
              cursor: "pointer",
            }}
          >
            <X size={14} />
          </button>
        </div>

        <div
          style={{
            marginTop: 12,
            color: readerSemanticColor.text.metadata,
            fontFamily: "'EB Garamond', serif",
            fontSize: 14.5,
            lineHeight: 1.45,
          }}
        >
          {entry.summary}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: "20px 20px 28px",
          scrollbarWidth: "none",
        }}
      >
        {entry.kind === "threshold" ? (
          <>
            <DetailSection label="SIGNAL" color={color}>
              {entry.signal}
            </DetailSection>
            <DetailSection label="WHY IT MATTERS" color={color}>
              {entry.whyItMatters}
            </DetailSection>
            <DetailSection label="RESPONSE" color={color}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 7,
                }}
              >
                {entry.response.map((item, index) => (
                  <span
                    key={item}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 8px",
                      border: `1px solid ${color}32`,
                      background: `${color}0B`,
                      color: readerSemanticColor.text.secondary,
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 8.5,
                      lineHeight: 1.2,
                      letterSpacing: "0.05em",
                    }}
                  >
                    <span style={{ color }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item}
                  </span>
                ))}
              </div>
            </DetailSection>
            <DetailSection label="DO NOT" color={color}>
              {entry.doNot}
            </DetailSection>
          </>
        ) : (
          <>
            <DetailSection label="PRINCIPLE" color={color}>
              {entry.principle}
            </DetailSection>
            <DetailSection label="OBSERVE" color={color}>
              {entry.observe}
            </DetailSection>
            <DetailSection label="IN PRACTICE" color={color}>
              {entry.inPractice}
            </DetailSection>
            <DetailSection label="WATCH FOR" color={color}>
              {entry.watchFor}
            </DetailSection>
          </>
        )}

        <div
          style={{
            marginTop: 4,
            paddingTop: 18,
            borderTop: "1px solid rgba(200,180,130,0.09)",
          }}
        >
          <div
            style={{
              marginBottom: 10,
              color,
              fontFamily: "'DM Mono', monospace",
              fontSize: 8.5,
              letterSpacing: "0.18em",
            }}
          >
            RELATED
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 7,
            }}
          >
            {entry.relatedIds.map((relatedId) => {
              const relatedEntry = ENTRY_BY_ID.get(relatedId);
              if (!relatedEntry) return null;

              return (
                <button
                  key={relatedId}
                  type="button"
                  data-canvas-control
                  onClick={() => onSelectRelated(relatedId)}
                  style={{
                    minHeight: 34,
                    padding: "6px 9px",
                    border: "1px solid rgba(200,180,130,0.16)",
                    background: "rgba(255,255,255,0.025)",
                    color: readerSemanticColor.text.secondary,
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 8.5,
                    lineHeight: 1.2,
                    cursor: "pointer",
                  }}
                >
                  {relatedEntry.title}
                </button>
              );
            })}
          </div>
        </div>

        <div
          style={{
            marginTop: 24,
            paddingTop: 18,
            borderTop: "1px solid rgba(200,180,130,0.09)",
          }}
        >
          <button
            type="button"
            data-canvas-control
            onClick={() => onTrace(entry.id)}
            style={{
              width: "100%",
              minHeight: 44,
              padding: "0 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              border: `1px solid ${color}46`,
              background: `${color}0D`,
              color: readerSemanticColor.text.primary,
              fontFamily: "'DM Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.14em",
              cursor: "pointer",
            }}
          >
            <span>
              {entry.id === LIVING_CANON_WORKED_EXAMPLE.entryId
                ? "TRACE THIS PATTERN"
                : "SEE HOW TRACING WORKS"}
            </span>
            <span style={{ color }}>→</span>
          </button>

          <div
            style={{
              marginTop: 8,
              color: readerSemanticColor.text.metadata,
              fontFamily: "'EB Garamond', serif",
              fontSize: 12.8,
              lineHeight: 1.42,
            }}
          >
            {entry.id === LIVING_CANON_WORKED_EXAMPLE.entryId
              ? "Follow this principle from field signal through precedent and revision."
              : "The current worked trace uses Frame, Don't Steer to demonstrate how Canon knowledge evolves. Your selected entry stays preserved when you return."}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function SovereignLivingCanonCanvas({
  frameworkTitle,
  sectionTitle,
  onClose,
  initialView = "field",
}: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);

  const [view, setView] = useState<ViewState>({ x: 0, y: 0, scale: 0.72 });
  const [dragging, setDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hoveredEntryId, setHoveredEntryId] = useState<string | null>(null);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(
    initialView === "revision" ? LIVING_CANON_WORKED_EXAMPLE.entryId : null,
  );
  const [viewMode, setViewMode] = useState<LivingCanonView>(initialView);
  const [transitionPhase, setTransitionPhase] =
    useState<TransitionPhase>("entering");

  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const selectedEntry = selectedEntryId
    ? ENTRY_BY_ID.get(selectedEntryId) ?? null
    : null;
  const hoveredEntry = hoveredEntryId
    ? ENTRY_BY_ID.get(hoveredEntryId) ?? null
    : null;
  const focusEntry = selectedEntry ?? hoveredEntry;

  const relatedIds = useMemo(
    () => new Set(focusEntry?.relatedIds ?? []),
    [focusEntry],
  );

  const fitAll = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const rect = viewport.getBoundingClientRect();
    const detailAllowance = selectedEntryId ? DETAIL_PANEL_W * 0.34 : 0;
    const usableW = Math.max(
      320,
      rect.width - VIEW_PADDING * 2 - detailAllowance,
    );
    const usableH = Math.max(320, rect.height - VIEW_PADDING * 2);
    const nextScale = clamp(
      Math.min(usableW / WORLD_W, usableH / WORLD_H),
      MIN_SCALE,
      1.08,
    );

    const centerOffset = selectedEntryId ? -detailAllowance * 0.34 : 0;

    setView({
      scale: nextScale,
      x: (rect.width - WORLD_W * nextScale) / 2 + centerOffset,
      y: (rect.height - WORLD_H * nextScale) / 2,
    });
  }, [selectedEntryId]);

  useEffect(() => {
    const openTimer = window.setTimeout(
      () => setTransitionPhase("open"),
      reducedMotion ? 20 : 300,
    );

    const fitTimer = window.setTimeout(fitAll, 0);

    return () => {
      window.clearTimeout(openTimer);
      window.clearTimeout(fitTimer);
    };
  }, [fitAll, reducedMotion]);

  useEffect(() => {
    const onResize = () => fitAll();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [fitAll]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(fitAll);
    return () => window.cancelAnimationFrame(frame);
  }, [fitAll, selectedEntryId]);

  const requestClose = useCallback(() => {
    if (transitionPhase === "exiting") return;

    if (reducedMotion) {
      onClose();
      return;
    }

    setTransitionPhase("exiting");
    window.setTimeout(onClose, 220);
  }, [onClose, reducedMotion, transitionPhase]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();

      if (viewMode === "revision") {
        setViewMode("field");
        return;
      }

      if (selectedEntryId) {
        setSelectedEntryId(null);
        setHoveredEntryId(null);
        return;
      }

      requestClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [requestClose, selectedEntryId, viewMode]);

  const zoomAt = useCallback(
    (
      nextScaleInput: number,
      anchorX?: number,
      anchorY?: number,
    ) => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      const rect = viewport.getBoundingClientRect();
      const anchorScreenX =
        anchorX ?? rect.left + rect.width / 2;
      const anchorScreenY =
        anchorY ?? rect.top + rect.height / 2;

      setView((current) => {
        const nextScale = clamp(nextScaleInput, MIN_SCALE, MAX_SCALE);
        const localAnchorX = anchorScreenX - rect.left;
        const localAnchorY = anchorScreenY - rect.top;
        const worldX = (localAnchorX - current.x) / current.scale;
        const worldY = (localAnchorY - current.y) / current.scale;

        return {
          scale: nextScale,
          x: localAnchorX - worldX * nextScale,
          y: localAnchorY - worldY * nextScale,
        };
      });

      setHasInteracted(true);
    },
    [],
  );

  const handleWheel = useCallback(
    (event: ReactWheelEvent<HTMLDivElement>) => {
      event.preventDefault();
      const factor = event.deltaY > 0 ? 1 / 1.12 : 1.12;
      zoomAt(view.scale * factor, event.clientX, event.clientY);
    },
    [view.scale, zoomAt],
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      if (target.closest("[data-canvas-control]")) return;

      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: view.x,
        originY: view.y,
        moved: false,
      };
      setDragging(true);
      setHasInteracted(true);
    },
    [view.x, view.y],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;

      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        drag.moved = true;
      }

      setView((current) => ({
        ...current,
        x: drag.originX + dx,
        y: drag.originY + dy,
      }));
    },
    [],
  );

  const endDrag = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      dragRef.current = null;
      setDragging(false);

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      if (!drag.moved && selectedEntryId) {
        setSelectedEntryId(null);
        setHoveredEntryId(null);
      }
    },
    [selectedEntryId],
  );

  const handleSelectEntry = useCallback((entryId: string) => {
    setSelectedEntryId(entryId);
    setHoveredEntryId(null);
    setHasInteracted(true);
  }, []);

  const handleSelectRelated = useCallback((entryId: string) => {
    setSelectedEntryId(entryId);
    setHoveredEntryId(null);
  }, []);

  const handleTraceEntry = useCallback((entryId: string) => {
    setSelectedEntryId(entryId);
    setHoveredEntryId(null);
    setViewMode("revision");
    setHasInteracted(true);
  }, []);

  if (viewMode === "revision") {
    const tracedEntry =
      (selectedEntryId ? ENTRY_BY_ID.get(selectedEntryId) : null) ??
      ENTRY_BY_ID.get(LIVING_CANON_WORKED_EXAMPLE.entryId);

    if (tracedEntry) {
      return (
        <LivingCanonRevisionModel
          frameworkTitle={frameworkTitle}
          sectionTitle={sectionTitle}
          tracedEntry={tracedEntry}
          onBack={() => setViewMode("field")}
          onClose={onClose}
        />
      );
    }
  }

  return (
    <div
      data-living-canon-root
      data-transition-phase={transitionPhase}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 80,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        color: readerSemanticColor.text.primary,
        background: "#04060B",
      }}
    >
      <style>{`
        @keyframes livingCanonEnter {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes livingCanonContentEnter {
          from { opacity: 0; transform: translateY(10px); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        @keyframes livingCanonExit {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes canonDetailEnter {
          from { opacity: 0; transform: translateX(18px); }
          to { opacity: 1; transform: translateX(0); }
        }

        [data-living-canon-root][data-transition-phase="entering"] {
          animation: livingCanonEnter 220ms ease-out both;
        }

        [data-living-canon-root][data-transition-phase="entering"] [data-living-canon-content] {
          animation: livingCanonContentEnter 520ms 70ms cubic-bezier(.16,1,.3,1) both;
        }

        [data-living-canon-root][data-transition-phase="exiting"] {
          animation: livingCanonExit 220ms ease-in both;
          pointer-events: none;
        }

        [data-living-canon-root] button:focus-visible {
          outline: 2px solid ${readerSemanticColor.text.primary};
          outline-offset: 3px;
        }

        @media (max-width: 820px) {
          [data-living-canon-header] {
            min-height: 0 !important;
            padding: 17px 18px 15px !important;
          }

          [data-living-canon-title] {
            font-size: 30px !important;
          }

          [data-living-canon-counts] {
            gap: 7px 12px !important;
          }

          [data-living-canon-hint] {
            display: none !important;
          }

          [data-canon-detail-panel] {
            width: min(390px, calc(100% - 22px)) !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          [data-living-canon-root],
          [data-living-canon-content],
          [data-canon-detail-panel] {
            animation-duration: 1ms !important;
            animation-delay: 0ms !important;
            filter: none !important;
            transform: none !important;
            transition-duration: 1ms !important;
          }
        }
      `}</style>

      <div
        data-living-canon-content
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          background:
            "radial-gradient(circle at 23% 45%, rgba(118,199,154,0.050), transparent 34%), " +
            "radial-gradient(circle at 58% 42%, rgba(124,180,213,0.045), transparent 30%), " +
            "radial-gradient(circle at 84% 42%, rgba(216,108,97,0.045), transparent 31%), " +
            "#04060B",
        }}
      >
        <header
          data-living-canon-header
          style={{
            minHeight: 124,
            flexShrink: 0,
            padding: "20px 28px 17px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 30,
            flexWrap: "wrap",
            borderBottom: "1px solid rgba(200,180,130,0.10)",
            background:
              "linear-gradient(180deg, rgba(4,6,11,0.99), rgba(4,6,11,0.94))",
          }}
        >
          <div style={{ maxWidth: 850 }}>
            <div
              style={{
                marginBottom: 8,
                color: readerSemanticColor.utility.primary,
                fontFamily: "'DM Mono', monospace",
                fontSize: 9.5,
                letterSpacing: "0.24em",
              }}
            >
              {frameworkTitle.toUpperCase()} · {sectionTitle.toUpperCase()}
            </div>

            <div
              data-living-canon-title
              style={{
                marginBottom: 6,
                color: readerSemanticColor.text.primary,
                fontFamily: "'EB Garamond', serif",
                fontSize: 38,
                lineHeight: 1.02,
                fontWeight: 500,
                letterSpacing: "0.01em",
              }}
            >
              Living Canon Field
            </div>

            <div
              style={{
                maxWidth: 730,
                color: readerSemanticColor.text.secondary,
                fontFamily: "'EB Garamond', serif",
                fontSize: 16.5,
                lineHeight: 1.45,
              }}
            >
              Patterns observed in systems that preserve agency — plus the
              guardrails and threshold signals that keep those patterns
              accountable to practice.
            </div>

            <div
              data-living-canon-counts
              style={{
                marginTop: 11,
                display: "flex",
                flexWrap: "wrap",
                gap: "8px 18px",
                fontFamily: "'DM Mono', monospace",
                fontSize: 9,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              <span style={{ color: readerSemanticColor.text.metadata }}>
                {LIVING_CANON_COUNTS.total} entries
              </span>
              <span style={{ color: BAND_COLOR.presence }}>
                {LIVING_CANON_COUNTS.presence} patterns
              </span>
              <span style={{ color: BAND_COLOR.integrity }}>
                {LIVING_CANON_COUNTS.integrity} guardrails
              </span>
              <span style={{ color: BAND_COLOR.threshold }}>
                {LIVING_CANON_COUNTS.threshold} threshold signals
              </span>
            </div>
          </div>

          <button
            type="button"
            data-canvas-control
            onClick={requestClose}
            aria-label="Back to Living Canon"
            style={{
              minHeight: 40,
              padding: "0 14px",
              display: "flex",
              alignItems: "center",
              gap: 9,
              flexShrink: 0,
              border: "1px solid rgba(200,180,130,0.42)",
              background: "rgba(7,9,15,0.78)",
              color: readerSemanticColor.utility.primary,
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.16em",
              cursor: "pointer",
            }}
          >
            <X size={14} />
            BACK TO FRAMEWORK
          </button>
        </header>

        <div
          ref={viewportRef}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          style={{
            position: "relative",
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            touchAction: "none",
            cursor: dragging ? "grabbing" : "grab",
            userSelect: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: WORLD_W,
              height: WORLD_H,
              transformOrigin: "0 0",
              transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
              transition: dragging
                ? "none"
                : "transform 180ms cubic-bezier(.16,1,.3,1)",
            }}
          >
            <svg
              aria-hidden
              width={WORLD_W}
              height={WORLD_H}
              viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
              style={{
                position: "absolute",
                inset: 0,
                overflow: "visible",
                pointerEvents: "none",
              }}
            >
              <defs>
                <radialGradient id="canon-field-presence-glow">
                  <stop offset="0%" stopColor={BAND_COLOR.presence} stopOpacity="0.10" />
                  <stop offset="100%" stopColor={BAND_COLOR.presence} stopOpacity="0" />
                </radialGradient>
                <radialGradient id="canon-field-integrity-glow">
                  <stop offset="0%" stopColor={BAND_COLOR.integrity} stopOpacity="0.09" />
                  <stop offset="100%" stopColor={BAND_COLOR.integrity} stopOpacity="0" />
                </radialGradient>
                <radialGradient id="canon-field-threshold-glow">
                  <stop offset="0%" stopColor={BAND_COLOR.threshold} stopOpacity="0.085" />
                  <stop offset="100%" stopColor={BAND_COLOR.threshold} stopOpacity="0" />
                </radialGradient>
              </defs>

              {STARFIELD.map((star) => (
                <circle
                  key={star.id}
                  cx={star.x}
                  cy={star.y}
                  r={star.r}
                  fill="rgba(245,241,230,0.95)"
                  opacity={star.opacity}
                />
              ))}

              <ellipse
                cx={430}
                cy={508}
                rx={420}
                ry={405}
                fill="url(#canon-field-presence-glow)"
              />
              <ellipse
                cx={995}
                cy={502}
                rx={255}
                ry={400}
                fill="url(#canon-field-integrity-glow)"
              />
              <ellipse
                cx={1404}
                cy={500}
                rx={280}
                ry={400}
                fill="url(#canon-field-threshold-glow)"
              />

              {[170, 290, 410].map((radius) => (
                <ellipse
                  key={`presence-orbit-${radius}`}
                  cx={400}
                  cy={510}
                  rx={radius * 1.28}
                  ry={radius}
                  fill="none"
                  stroke={BAND_COLOR.presence}
                  strokeWidth="0.7"
                  strokeOpacity={radius === 170 ? 0.12 : 0.065}
                  strokeDasharray={radius === 290 ? "5 10" : "2 14"}
                />
              ))}

              {[120, 235, 342].map((radius) => (
                <ellipse
                  key={`integrity-orbit-${radius}`}
                  cx={995}
                  cy={510}
                  rx={radius * 0.78}
                  ry={radius}
                  fill="none"
                  stroke={BAND_COLOR.integrity}
                  strokeWidth="0.7"
                  strokeOpacity={radius === 120 ? 0.11 : 0.06}
                  strokeDasharray="3 13"
                />
              ))}

              <rect
                x={BAND_REGION.threshold.x}
                y={BAND_REGION.threshold.y}
                width={BAND_REGION.threshold.width}
                height={BAND_REGION.threshold.height}
                rx={34}
                fill="rgba(216,108,97,0.012)"
                stroke={BAND_COLOR.threshold}
                strokeWidth="1"
                strokeOpacity="0.16"
                strokeDasharray="8 9"
              />

              <line
                x1={782}
                y1={145}
                x2={782}
                y2={850}
                stroke={BAND_COLOR.integrity}
                strokeOpacity="0.10"
                strokeWidth="1"
              />
              <line
                x1={1176}
                y1={145}
                x2={1176}
                y2={850}
                stroke={BAND_COLOR.threshold}
                strokeOpacity="0.10"
                strokeWidth="1"
              />

              {focusEntry?.relatedIds.map((relatedId) => {
                const relatedEntry = ENTRY_BY_ID.get(relatedId);
                if (!relatedEntry) return null;

                const from = worldPosition(focusEntry);
                const to = worldPosition(relatedEntry);
                const relatedColor = BAND_COLOR[relatedEntry.band];

                return (
                  <g key={`${focusEntry.id}-${relatedId}`}>
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke={BAND_COLOR[focusEntry.band]}
                      strokeWidth="2"
                      strokeOpacity={selectedEntry ? 0.46 : 0.28}
                      vectorEffect="non-scaling-stroke"
                    />
                    <circle
                      cx={to.x}
                      cy={to.y}
                      r={8}
                      fill={relatedColor}
                      fillOpacity="0.14"
                      stroke={relatedColor}
                      strokeOpacity="0.32"
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>
                );
              })}
            </svg>

            {LIVING_CANON_BANDS.map((band) => {
              const region = BAND_REGION[band.id];
              const color = BAND_COLOR[band.id];

              return (
                <div
                  key={band.id}
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: region.x + 12,
                    top: 64,
                    width: region.width - 24,
                    pointerEvents: "none",
                    opacity: focusEntry && focusEntry.band !== band.id ? 0.44 : 1,
                    transition: "opacity 220ms ease",
                  }}
                >
                  <div
                    style={{
                      color,
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 11,
                      letterSpacing: "0.24em",
                    }}
                  >
                    {band.label}
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      color: readerSemanticColor.text.metadata,
                      fontFamily: "'EB Garamond', serif",
                      fontSize: 15,
                      lineHeight: 1.35,
                    }}
                  >
                    {band.description}
                  </div>
                </div>
              );
            })}

            {LIVING_CANON_ENTRIES.map((entry) => {
              const isSelected = selectedEntryId === entry.id;
              const isPreviewed =
                !isSelected && hoveredEntryId === entry.id;
              const isRelated = relatedIds.has(entry.id);
              const isDimmed =
                Boolean(focusEntry) &&
                !isSelected &&
                !isPreviewed &&
                !isRelated;

              return (
                <CanonNode
                  key={entry.id}
                  entry={entry}
                  scale={view.scale}
                  selected={isSelected}
                  previewed={isPreviewed}
                  related={isRelated}
                  dimmed={isDimmed}
                  onPreview={setHoveredEntryId}
                  onSelect={handleSelectEntry}
                />
              );
            })}
          </div>

          {selectedEntry && (
            <CanonDetailPanel
              key={selectedEntry.id}
              entry={selectedEntry}
              onClose={() => {
                setSelectedEntryId(null);
                setHoveredEntryId(null);
              }}
              onSelectRelated={handleSelectRelated}
              onTrace={handleTraceEntry}
            />
          )}

          <div
            data-living-canon-hint
            data-canvas-control
            style={{
              position: "absolute",
              left: 24,
              bottom: 20,
              zIndex: 20,
              display: "flex",
              alignItems: "center",
              gap: 9,
              color: readerSemanticColor.text.metadata,
              fontFamily: "'DM Mono', monospace",
              fontSize: 9.5,
              letterSpacing: "0.14em",
              pointerEvents: "none",
              opacity: hasInteracted ? 0 : 1,
              transition: "opacity 900ms ease",
            }}
          >
            <span style={{ fontSize: 13 }}>☝</span>
            DRAG TO EXPLORE · SCROLL TO ZOOM · HOVER TO PREVIEW · CLICK TO INSPECT
          </div>

          <div
            data-canvas-control
            aria-label="Living Canon zoom controls"
            style={{
              position: "absolute",
              left: selectedEntry
                ? `calc(50% - ${DETAIL_PANEL_W / 2}px)`
                : "50%",
              bottom: 17,
              zIndex: 20,
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: 5,
              border: "1px solid rgba(200,180,130,0.20)",
              background: "rgba(8,10,17,0.90)",
              boxShadow: "0 12px 36px rgba(0,0,0,0.34)",
              transition: "left 220ms cubic-bezier(.16,1,.3,1)",
            }}
          >
            <button
              type="button"
              data-canvas-control
              aria-label="Zoom out"
              onClick={() => zoomAt(view.scale / 1.18)}
              style={zoomButtonStyle}
            >
              <Minus size={14} />
            </button>

            <div
              style={{
                minWidth: 54,
                textAlign: "center",
                color: readerSemanticColor.text.secondary,
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
              }}
            >
              {Math.round(view.scale * 100)}%
            </div>

            <button
              type="button"
              data-canvas-control
              aria-label="Zoom in"
              onClick={() => zoomAt(view.scale * 1.18)}
              style={zoomButtonStyle}
            >
              <Plus size={14} />
            </button>

            <button
              type="button"
              data-canvas-control
              onClick={fitAll}
              style={{
                ...zoomButtonStyle,
                width: "auto",
                padding: "0 12px",
              }}
            >
              <Scan size={13} />
              FIT ALL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const zoomButtonStyle = {
  height: 34,
  width: 38,
  border: "1px solid rgba(200,180,130,0.16)",
  background: "rgba(255,255,255,0.025)",
  color: readerSemanticColor.text.secondary,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontFamily: "'DM Mono', monospace",
  fontSize: 10,
  letterSpacing: "0.12em",
  cursor: "pointer",
} as const;
