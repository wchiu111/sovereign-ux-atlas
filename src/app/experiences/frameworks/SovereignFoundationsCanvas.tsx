import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Eye,
  MessageCircleQuestion,
  Minus,
  Move,
  Plus,
  RotateCcw,
  Scale,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  FOUNDATION_COMMITMENTS,
  FOUNDATION_PRACTICE_NOTE,
  FOUNDATION_PRINCIPLES,
  FOUNDATION_PRINCIPLES_BY_ID,
  FOUNDATION_REALIGNMENT,
  FOUNDATION_REFLECTION_QUESTIONS,
  FOUNDATION_RETURN_TO_FUNDAMENTALS,
  FOUNDATION_SCOPE_NOTE,
  type FoundationPrinciple,
  type FoundationPrincipleId,
} from "../../content/frameworks/sovereign-ux-foundations";
import { STELLAR_PALETTE } from "../../atlas/constellation/stellarPalette";
import { readerSemanticColor } from "../shared/readerSemanticPalette";
import { SpatialNode } from "../shared/spatial/SpatialNode";
import { SpatialViewport } from "../shared/spatial/SpatialViewport";
import type { SpatialView } from "../shared/spatial/spatialTypes";
import { useSpatialCamera } from "../shared/spatial/useSpatialCamera";

interface Props {
  frameworkTitle: string;
  sectionTitle: string;
  onClose: () => void;
}

type Phase = "entering" | "open" | "exiting";

const PURPOSE = STELLAR_PALETTE.purpose;
const GOLD = readerSemanticColor.utility.primary;
const IVORY = readerSemanticColor.text.primary;
const SECONDARY = readerSemanticColor.text.secondary;
const MUTED = readerSemanticColor.text.metadata;
const BORDER = "rgba(200,180,130,0.16)";
const MONO: CSSProperties = {
  fontFamily: "'DM Mono',monospace",
  letterSpacing: "0.15em",
  fontSize: 10,
};
const SERIF: CSSProperties = {
  fontFamily: "'EB Garamond',Georgia,serif",
};
const controlButton: CSSProperties = {
  ...MONO,
  minHeight: 38,
  padding: "0 12px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  border: "1px solid rgba(200,169,110,.25)",
  background: "rgba(7,9,15,.9)",
  color: GOLD,
  cursor: "pointer",
};

const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1600;
const CENTER_X = WORLD_WIDTH / 2;
const CENTER_Y = WORLD_HEIGHT / 2;
const WORLD_BOUNDS = {
  x: 300,
  y: 110,
  width: 1800,
  height: 1380,
} as const;

const FIELD_PRINCIPLES: ReadonlyArray<{
  id: FoundationPrincipleId;
  x: number;
  y: number;
  shortLabel: string;
}> = [
  { id: "01", x: 820, y: 270, shortLabel: "Awareness" },
  { id: "02", x: 1190, y: 170, shortLabel: "Not a target" },
  { id: "03", x: 1570, y: 280, shortLabel: "Attunement" },
  { id: "04", x: 1870, y: 540, shortLabel: "Presence" },
  { id: "05", x: 1920, y: 910, shortLabel: "Design reveals belief" },
  { id: "06", x: 1640, y: 1260, shortLabel: "Amplify choice" },
  { id: "07", x: 1190, y: 1390, shortLabel: "Build interactions" },
  { id: "08", x: 750, y: 1280, shortLabel: "Integrity" },
  { id: "09", x: 470, y: 960, shortLabel: "Interpretation" },
  { id: "10", x: 500, y: 540, shortLabel: "Decision framing" },
];

const FIELD_COMMITMENTS: ReadonlyArray<{
  id: "clarity" | "consent" | "judgment" | "agency";
  x: number;
  y: number;
}> = [
  { id: "clarity", x: 1200, y: 505 },
  { id: "consent", x: 1515, y: 800 },
  { id: "judgment", x: 1200, y: 1095 },
  { id: "agency", x: 885, y: 800 },
];

function connectionPath(x: number, y: number, index: number) {
  const dx = x - CENTER_X;
  const dy = y - CENTER_Y;
  const distance = Math.hypot(dx, dy) || 1;
  const ux = dx / distance;
  const uy = dy / distance;
  const sourceX = CENTER_X + ux * 108;
  const sourceY = CENTER_Y + uy * 108;
  const targetX = x - ux * 43;
  const targetY = y - uy * 43;
  const bend = Math.sin(index * 1.72) * 74;
  const controlX = (sourceX + targetX) / 2 - uy * bend;
  const controlY = (sourceY + targetY) / 2 + ux * bend;
  return `M ${sourceX} ${sourceY} Q ${controlX} ${controlY} ${targetX} ${targetY}`;
}

function FoundationsConnections({
  focusId,
}: {
  focusId: FoundationPrincipleId | null;
}) {
  return (
    <svg
      aria-hidden="true"
      width={WORLD_WIDTH}
      height={WORLD_HEIGHT}
      viewBox={`0 0 ${WORLD_WIDTH} ${WORLD_HEIGHT}`}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      <defs>
        <radialGradient id="foundation-world-glow">
          <stop offset="0%" stopColor={PURPOSE} stopOpacity=".09" />
          <stop offset="46%" stopColor={PURPOSE} stopOpacity=".025" />
          <stop offset="100%" stopColor={PURPOSE} stopOpacity="0" />
        </radialGradient>
        <filter
          id="foundation-trace-glow"
          x="-80%"
          y="-80%"
          width="260%"
          height="260%"
        >
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <circle
        cx={CENTER_X}
        cy={CENTER_Y}
        r="510"
        fill="url(#foundation-world-glow)"
      />
      {[270, 430, 650].map((radius, index) => (
        <ellipse
          key={radius}
          cx={CENTER_X}
          cy={CENTER_Y}
          rx={radius * 1.23}
          ry={radius * 0.78}
          fill="none"
          stroke={PURPOSE}
          strokeOpacity={index === 0 ? 0.18 : index === 1 ? 0.1 : 0.065}
          strokeWidth="1"
          strokeDasharray={index === 1 ? "3 14" : index === 2 ? "1 19" : undefined}
          vectorEffect="non-scaling-stroke"
          transform={`rotate(${index === 0 ? -7 : index === 1 ? 8 : -2} ${CENTER_X} ${CENTER_Y})`}
        />
      ))}
      <line
        x1="350"
        y1={CENTER_Y}
        x2="2050"
        y2={CENTER_Y}
        stroke={PURPOSE}
        strokeOpacity=".035"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={CENTER_X}
        y1="150"
        x2={CENTER_X}
        y2="1450"
        stroke={PURPOSE}
        strokeOpacity=".035"
        vectorEffect="non-scaling-stroke"
      />
      {FIELD_PRINCIPLES.map((node, index) => {
        const path = connectionPath(node.x, node.y, index);
        const active = focusId === node.id;
        return (
          <g key={node.id}>
            <path
              d={path}
              fill="none"
              stroke={PURPOSE}
              strokeOpacity={active ? 0.58 : focusId ? 0.025 : 0.1}
              strokeWidth={active ? 1.4 : 0.8}
              vectorEffect="non-scaling-stroke"
              style={{ transition: "stroke-opacity 260ms ease" }}
            />
            <path
              className="foundation-spatial-trace"
              d={path}
              pathLength={1}
              fill="none"
              stroke={active ? PURPOSE : "#D7E9EA"}
              strokeOpacity={active ? 0.92 : 0.32}
              strokeWidth={active ? 2.2 : 1.25}
              strokeLinecap="round"
              strokeDasharray=".11 1"
              vectorEffect="non-scaling-stroke"
              style={{ animationDelay: `${index * -0.9}s` }}
            />
            {active && (
              <circle
                r="5"
                fill={PURPOSE}
                filter="url(#foundation-trace-glow)"
              >
                <animateMotion
                  path={path}
                  dur="3.8s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function SovereignFoundationsCanvas({
  frameworkTitle,
  sectionTitle,
  onClose,
}: Props) {
  const [phase, setPhase] = useState<Phase>("entering");
  const [selectedId, setSelectedId] =
    useState<FoundationPrincipleId | null>(null);
  const [previewId, setPreviewId] =
    useState<FoundationPrincipleId | null>(null);
  const [reflectionOpen, setReflectionOpen] = useState(false);
  const [small, setSmall] = useState(false);
  const [compactField, setCompactField] = useState(false);
  const selected = selectedId
    ? FOUNDATION_PRINCIPLES_BY_ID[selectedId]
    : null;
  const exitTimer = useRef<number | null>(null);
  const readScrollRef = useRef<HTMLDivElement>(null);
  const overviewScrollRef = useRef<HTMLDivElement>(null);
  const rememberedOverviewScroll = useRef(0);
  const selectedHeadingRef = useRef<HTMLHeadingElement>(null);
  const reflectionTriggerRef = useRef<HTMLButtonElement>(null);
  const reflectionDialogRef = useRef<HTMLDivElement>(null);
  const overviewPrinciples = useRef(
    new Map<FoundationPrincipleId, HTMLButtonElement>(),
  );
  const lastSelectedRef = useRef<FoundationPrincipleId | null>(null);
  const previousCameraViewRef = useRef<SpatialView | null>(null);
  const isClosing = useRef(false);

  const camera = useSpatialCamera({
    worldBounds: {
      x: 0,
      y: 0,
      width: WORLD_WIDTH,
      height: WORLD_HEIGHT,
    },
    openingBounds: WORLD_BOUNDS,
    padding: { top: 72, right: 74, bottom: 86, left: 74 },
    minScale: 0.38,
    maxScale: 1.9,
    maxOpeningScale: 0.84,
  });

  useEffect(() => {
    const smallMq = window.matchMedia("(max-width: 980px)");
    const fieldMq = window.matchMedia("(max-width: 1120px)");
    const updateSmall = () => setSmall(smallMq.matches);
    const updateField = () => setCompactField(fieldMq.matches);
    updateSmall();
    updateField();
    smallMq.addEventListener("change", updateSmall);
    fieldMq.addEventListener("change", updateField);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const startTimer = window.setTimeout(
      () => setPhase("open"),
      reduced ? 0 : 60,
    );
    return () => {
      smallMq.removeEventListener("change", updateSmall);
      fieldMq.removeEventListener("change", updateField);
      window.clearTimeout(startTimer);
      if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
    };
  }, []);

  const requestClose = useCallback(() => {
    if (isClosing.current) return;
    isClosing.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onClose();
      return;
    }
    setPhase("exiting");
    exitTimer.current = window.setTimeout(onClose, 200);
  }, [onClose]);

  const selectPrinciple = useCallback(
    (id: FoundationPrincipleId) => {
      if (camera.shouldSuppressClick()) return;
      if (selectedId === null) {
        rememberedOverviewScroll.current =
          overviewScrollRef.current?.scrollTop ?? 0;
        if (!compactField) {
          previousCameraViewRef.current = { ...camera.viewRef.current };
        }
      }
      lastSelectedRef.current = id;
      setPreviewId(null);
      setSelectedId(id);
      if (!compactField) {
        const node = FIELD_PRINCIPLES.find((item) => item.id === id);
        if (node) {
          camera.focusPoint(node, {
            scale: 1.18,
            anchorX: 0.2,
            anchorY: 0.52,
          });
        }
      }
      requestAnimationFrame(() => {
        if (readScrollRef.current) readScrollRef.current.scrollTop = 0;
        selectedHeadingRef.current?.focus({ preventScroll: true });
      });
    },
    [camera, compactField, selectedId],
  );

  const returnToField = useCallback(() => {
    setPreviewId(null);
    setSelectedId(null);
    if (!compactField && previousCameraViewRef.current) {
      camera.moveToView(previousCameraViewRef.current);
      previousCameraViewRef.current = null;
    } else if (!compactField) {
      camera.resetView();
    }
    requestAnimationFrame(() => {
      if (overviewScrollRef.current) {
        overviewScrollRef.current.scrollTop = rememberedOverviewScroll.current;
      }
      if (compactField && lastSelectedRef.current) {
        overviewPrinciples.current.get(lastSelectedRef.current)?.focus();
      }
    });
  }, [camera, compactField]);

  const resetField = useCallback(() => {
    setPreviewId(null);
    setSelectedId(null);
    previousCameraViewRef.current = null;
    camera.resetView();
  }, [camera]);

  const closeReflection = useCallback(() => {
    setReflectionOpen(false);
    requestAnimationFrame(() => reflectionTriggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!reflectionOpen) return;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    requestAnimationFrame(() =>
      reflectionDialogRef.current
        ?.querySelector<HTMLButtonElement>("button")
        ?.focus(),
    );
    const handleTrap = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const nodes = [
        ...(reflectionDialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? []),
      ];
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleTrap);
    return () => {
      document.removeEventListener("keydown", handleTrap);
      previous?.focus();
    };
  }, [reflectionOpen]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (reflectionOpen) closeReflection();
        else if (selectedId) returnToField();
        else requestClose();
        return;
      }
      if (compactField || reflectionOpen) return;
      if (event.key === "0") {
        event.preventDefault();
        resetField();
      } else if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        camera.zoomIn();
      } else if (event.key === "-") {
        event.preventDefault();
        camera.zoomOut();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [
    camera,
    closeReflection,
    compactField,
    reflectionOpen,
    requestClose,
    resetField,
    returnToField,
    selectedId,
  ]);

  return (
    <div
      className="sux-foundation-root"
      data-foundations-root
      data-phase={phase}
      role="region"
      aria-label="Sovereign UX Foundations evidence"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 86,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        color: IVORY,
        background: "#04060B",
        opacity: phase === "exiting" ? 0 : 1,
        transition: "opacity 210ms ease",
      }}
    >
      <FoundationsStyles />
      <header
        data-spatial-control
        style={{
          position: "relative",
          zIndex: 40,
          flexShrink: 0,
          minHeight: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
          padding: "10px 25px",
          borderBottom: `1px solid ${BORDER}`,
          background: "rgba(5,6,11,.94)",
          boxShadow: "0 16px 42px rgba(0,0,0,.22)",
        }}
      >
        <div
          style={{
            minWidth: 0,
            display: "flex",
            alignItems: "baseline",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{ ...SERIF, fontSize: 23, color: IVORY, lineHeight: 1.2 }}
          >
            {sectionTitle}
          </span>
          <span style={{ ...MONO, color: MUTED, fontSize: 9 }}>
            BELIEFS BEHIND THE INTERFACE
          </span>
        </div>
        <button
          type="button"
          onClick={requestClose}
          style={controlButton}
          aria-label="Back to framework"
        >
          BACK TO FRAMEWORK <X size={15} aria-hidden="true" />
        </button>
      </header>

      {compactField ? (
        selected ? (
          <MobileInspector
            selected={selected}
            selectedId={selected.id}
            small={small}
            onSelect={selectPrinciple}
            onBack={returnToField}
            onReflection={() => setReflectionOpen(true)}
            readScrollRef={readScrollRef}
            selectedHeadingRef={selectedHeadingRef}
            reflectionTriggerRef={reflectionTriggerRef}
          />
        ) : (
          <CompactOverview
            overviewScrollRef={overviewScrollRef}
            overviewPrinciples={overviewPrinciples}
            onSelect={selectPrinciple}
          />
        )
      ) : (
        <SpatialViewport
          camera={camera}
          worldSize={{ width: WORLD_WIDTH, height: WORLD_HEIGHT }}
          ariaLabel={`${frameworkTitle}, ${sectionTitle}, interactive Foundations principle field`}
          background="radial-gradient(ellipse at 48% 47%,rgba(232,200,109,.055),transparent 38%),radial-gradient(ellipse at 12% 84%,rgba(82,123,170,.055),transparent 34%),#04060B"
          backgroundImage="linear-gradient(rgba(130,160,155,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(130,160,155,.018) 1px,transparent 1px)"
          bottomLeft={
            <div
              data-spatial-control
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 24,
                bottom: 20,
                zIndex: 25,
                display: "flex",
                alignItems: "center",
                gap: 9,
                ...MONO,
                color: MUTED,
                fontSize: 9,
                pointerEvents: "none",
              }}
            >
              <Move size={14} />
              DRAG TO EXPLORE · SCROLL TO ZOOM · SELECT A PRINCIPLE
            </div>
          }
          bottomCenter={
            <CameraControls
              scale={camera.view.scale}
              onZoomOut={camera.zoomOut}
              onZoomIn={camera.zoomIn}
              onReset={resetField}
            />
          }
          overlay={
            selected ? (
              <OrbitalDeepDive
                key={selected.id}
                selected={selected}
                selectedId={selected.id}
                anchorPosition={FIELD_PRINCIPLES.find(
                  (item) => item.id === selected.id,
                )}
                cameraView={camera.view}
                onSelect={selectPrinciple}
                onBack={returnToField}
                onReflection={() => setReflectionOpen(true)}
                readScrollRef={readScrollRef}
                selectedHeadingRef={selectedHeadingRef}
                reflectionTriggerRef={reflectionTriggerRef}
              />
            ) : null
          }
        >
          <div
            aria-hidden="true"
            className="foundation-star-field"
            style={{ position: "absolute", inset: 0 }}
          />
          <FoundationsConnections focusId={selectedId ?? previewId} />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: CENTER_X - 220,
              top: CENTER_Y - 220,
              width: 440,
              height: 440,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(232,200,109,.11),rgba(232,200,109,.022) 42%,transparent 72%)",
            }}
          />
          <div
            aria-hidden="true"
            className="foundation-core"
            style={{
              position: "absolute",
              left: CENTER_X,
              top: CENTER_Y,
              zIndex: 6,
              width: 138,
              height: 138,
              transform: "translate(-50%,-50%)",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              textAlign: "center",
            }}
          >
            <div>
              <div style={{ ...MONO, color: PURPOSE, fontSize: 9 }}>
                FOUNDATIONS
              </div>
              <div
                style={{
                  ...SERIF,
                  color: IVORY,
                  fontSize: 17,
                  lineHeight: 1.08,
                  marginTop: 8,
                }}
              >
                People at
                <br />
                the center
              </div>
            </div>
          </div>

          <div aria-label="Four foundational commitments" role="group">
            {FIELD_COMMITMENTS.map((position) => {
              const commitment = FOUNDATION_COMMITMENTS.find(
                (item) => item.id === position.id,
              );
              if (!commitment) return null;
              return (
                <div
                  key={position.id}
                  role="group"
                  aria-label={`${commitment.title}: ${commitment.meaning}`}
                  className="foundation-commitment"
                  style={{
                    position: "absolute",
                    left: position.x,
                    top: position.y,
                    zIndex: 5,
                    width: 188,
                    height: 188,
                    transform: "translate(-50%,-50%)",
                    borderRadius: "50%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 8,
                    padding: 24,
                    textAlign: "center",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 9,
                      height: 9,
                      transform: "rotate(45deg)",
                      background: PURPOSE,
                      boxShadow: "0 0 16px rgba(232,200,109,.72)",
                    }}
                  />
                  <span
                    style={{
                      ...SERIF,
                      fontSize: 29,
                      lineHeight: 1,
                      color: IVORY,
                    }}
                  >
                    {commitment.title}
                  </span>
                  <span
                    style={{
                      ...SERIF,
                      maxWidth: 145,
                      fontSize: 13,
                      lineHeight: 1.25,
                      color: SECONDARY,
                    }}
                  >
                    {commitment.meaning}
                  </span>
                </div>
              );
            })}
          </div>

          <nav aria-label="Ten core principles">
            {FIELD_PRINCIPLES.map((position) => {
              const principle = FOUNDATION_PRINCIPLES_BY_ID[position.id];
              const active = selectedId === position.id;
              const previewed = previewId === position.id;
              return (
                <SpatialNode
                  key={position.id}
                  x={position.x}
                  y={position.y}
                  className="foundation-principle-node"
                  ariaLabel={`Inspect principle ${position.id}: ${principle.title}`}
                  selected={active}
                  dimmed={Boolean(selectedId && !active)}
                  onClick={() => selectPrinciple(position.id)}
                  onMouseEnter={() => {
                    if (!selectedId) setPreviewId(position.id);
                  }}
                  onMouseLeave={() => setPreviewId(null)}
                  onFocus={() => {
                    if (!selectedId) setPreviewId(position.id);
                  }}
                  onBlur={() => setPreviewId(null)}
                  style={{
                    width: 180,
                    minHeight: 132,
                    zIndex: active || previewed ? 12 : 8,
                  }}
                >
                  <span
                    className="foundation-principle-orb"
                    aria-hidden="true"
                    style={{
                      width: active ? 72 : 62,
                      height: active ? 72 : 62,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: "50%",
                    }}
                  >
                    <span
                      style={{
                        ...MONO,
                        color: active ? "#FFF0BE" : PURPOSE,
                        fontSize: 10,
                        letterSpacing: ".08em",
                      }}
                    >
                      {position.id}
                    </span>
                  </span>
                  <span
                    className="foundation-principle-label"
                    style={{
                      ...SERIF,
                      color: IVORY,
                      fontSize: 18,
                      lineHeight: 1.12,
                    }}
                  >
                    {position.shortLabel}
                  </span>
                </SpatialNode>
              );
            })}
          </nav>

          {previewId && !selectedId && (
            <PrinciplePreview
              id={previewId}
              viewScale={camera.view.scale}
            />
          )}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: CENTER_X,
              top: 1490,
              transform: "translateX(-50%)",
              ...MONO,
              color: MUTED,
              fontSize: 10,
              whiteSpace: "nowrap",
            }}
          >
            FOUR COMMITMENTS · TEN CORE PRINCIPLES · NO MANDATORY SEQUENCE
          </div>
        </SpatialViewport>
      )}

      {reflectionOpen && (
        <ReflectionDialog
          dialogRef={reflectionDialogRef}
          onClose={closeReflection}
        />
      )}
    </div>
  );
}

function FoundationsStyles() {
  return (
    <style>{`
      .sux-foundation-root *{box-sizing:border-box}
      .sux-foundation-root button:focus-visible{outline:1px solid ${PURPOSE};outline-offset:4px}
      .sux-foundation-root .foundation-scroll{scrollbar-width:thin;scrollbar-color:rgba(200,180,130,.36) transparent}
      .sux-foundation-root [data-foundation-row]:hover{background:rgba(232,200,109,.055)!important;border-color:rgba(232,200,109,.44)!important}
      .sux-foundation-root [data-foundation-rail-item]:hover{background:rgba(232,200,109,.06)!important}
      .sux-foundation-root .foundation-star-field{
        opacity:.62;
        background-image:
          radial-gradient(1px 1px at 8% 12%,rgba(232,200,109,.55) 98%,transparent),
          radial-gradient(1px 1px at 20% 75%,rgba(138,174,200,.48) 98%,transparent),
          radial-gradient(1px 1px at 32% 28%,rgba(244,235,208,.4) 98%,transparent),
          radial-gradient(1px 1px at 48% 92%,rgba(232,200,109,.4) 98%,transparent),
          radial-gradient(1px 1px at 64% 17%,rgba(138,174,200,.4) 98%,transparent),
          radial-gradient(1px 1px at 78% 67%,rgba(244,235,208,.42) 98%,transparent),
          radial-gradient(1px 1px at 91% 31%,rgba(232,200,109,.44) 98%,transparent);
        background-size:310px 270px,370px 330px,420px 390px,470px 430px,530px 470px,590px 510px,650px 570px;
      }
      .sux-foundation-root .foundation-core{
        border:1px solid rgba(232,200,109,.56);
        background:radial-gradient(circle at 38% 30%,rgba(255,232,155,.30),rgba(31,27,19,.96) 42%,rgba(7,9,15,.98) 78%);
        box-shadow:0 0 0 12px rgba(232,200,109,.025),0 0 44px rgba(232,200,109,.20),0 0 110px rgba(232,200,109,.08),inset 0 0 24px rgba(232,200,109,.12);
      }
      .sux-foundation-root .foundation-commitment{
        border:1px solid rgba(232,200,109,.35);
        background:radial-gradient(circle at 42% 32%,rgba(232,200,109,.15),rgba(17,16,17,.96) 55%,rgba(6,8,13,.98));
        box-shadow:0 0 35px rgba(232,200,109,.055),inset 0 0 28px rgba(232,200,109,.04);
      }
      .sux-foundation-root .foundation-principle-node{
        border:0;background:transparent;color:${IVORY};cursor:pointer;padding:8px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
        transition:opacity 260ms ease,filter 220ms ease;
      }
      .sux-foundation-root .foundation-principle-node:hover,
      .sux-foundation-root .foundation-principle-node:focus-visible{filter:brightness(1.28)}
      .sux-foundation-root .foundation-principle-orb{
        border:1px solid rgba(232,200,109,.34);
        background:radial-gradient(circle at 38% 31%,rgba(255,232,155,.2),rgba(17,17,22,.98) 68%);
        box-shadow:0 0 22px rgba(232,200,109,.08),inset 0 0 15px rgba(232,200,109,.05);
        transition:width 320ms cubic-bezier(.16,1,.3,1),height 320ms cubic-bezier(.16,1,.3,1),border-color 220ms ease,box-shadow 220ms ease;
      }
      .sux-foundation-root .foundation-principle-node:hover .foundation-principle-orb,
      .sux-foundation-root .foundation-principle-node:focus-visible .foundation-principle-orb,
      .sux-foundation-root .foundation-principle-node[data-selected="true"] .foundation-principle-orb{
        border-color:rgba(232,200,109,.82);
        box-shadow:0 0 30px rgba(232,200,109,.27),0 0 75px rgba(232,200,109,.09),inset 0 0 19px rgba(232,200,109,.12);
      }
      .sux-foundation-root .foundation-principle-label{max-width:176px;text-align:center;text-wrap:balance}
      .sux-foundation-root .foundation-spatial-trace{stroke-dashoffset:1.1;animation:foundationSpatialTrace 11s linear infinite}
      @keyframes foundationSpatialTrace{0%{stroke-dashoffset:1.1;opacity:0}8%{opacity:.7}34%{opacity:.42}42%{stroke-dashoffset:0;opacity:0}100%{stroke-dashoffset:0;opacity:0}}
      .sux-foundation-root .foundation-detail-panel{animation:foundationPanelIn 380ms cubic-bezier(.16,1,.3,1) both}
      @keyframes foundationPanelIn{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:none}}
      .sux-foundation-root .foundation-observatory-shell{animation:foundationObservatoryResolve 420ms 480ms ease-out both}
      @keyframes foundationObservatoryResolve{from{opacity:0}to{opacity:1}}
      .sux-foundation-root .foundation-observatory-tether{stroke-dasharray:5 8;animation:foundationTetherResolve 900ms cubic-bezier(.16,1,.3,1) both}
      @keyframes foundationTetherResolve{from{opacity:0;stroke-dashoffset:50}to{opacity:1;stroke-dashoffset:0}}
      .sux-foundation-root .foundation-anchor-orbit{transform-origin:center;animation:foundationAnchorOrbit 8s linear infinite}
      @keyframes foundationAnchorOrbit{to{transform:rotate(360deg)}}
      .sux-foundation-root .foundation-observatory-nav:hover{border-color:rgba(232,200,109,.48)!important;color:${PURPOSE}!important}
      .sux-foundation-root .foundation-lab-stage{transition:border-color 220ms ease,background 220ms ease}
      @media(max-width:1380px){
        .sux-foundation-root .foundation-observatory-grid{grid-template-columns:minmax(0,1fr)!important}
        .sux-foundation-root .foundation-observatory-shell .foundation-detail-panel{left:clamp(340px,29vw,420px)!important}
      }
      .sux-foundation-root .foundation-compact-commitments{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}
      .sux-foundation-root .foundation-compact-principles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
      .sux-foundation-root .foundation-detail-layout{display:grid;grid-template-columns:290px minmax(0,1fr);min-height:0;flex:1}
      .sux-foundation-root .foundation-rail{border-right:1px solid ${BORDER};padding:26px 18px;overflow:auto;background:rgba(8,10,18,.65)}
      .sux-foundation-root .foundation-mobile-inspector{padding:46px max(32px,calc((100vw - 1120px)/2));overflow:auto}
      .sux-foundation-root .foundation-realignment-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}
      .sux-foundation-root .foundation-dialog{width:min(680px,calc(100vw - 32px));max-height:min(87vh,820px);overflow:auto;background:#0D1019;border:1px solid rgba(232,200,109,.36);box-shadow:0 28px 120px rgba(0,0,0,.7);padding:30px}
      @media(max-width:980px){
        .sux-foundation-root .foundation-detail-layout{display:flex;flex-direction:column}
        .sux-foundation-root .foundation-rail{flex-shrink:0;max-height:204px;border-right:none;border-bottom:1px solid ${BORDER};padding:12px 18px}
        .sux-foundation-root .foundation-rail-list{display:flex;overflow-x:auto;gap:8px;padding-bottom:6px}
        .sux-foundation-root .foundation-mobile-inspector{padding:25px 22px}
        .sux-foundation-root .foundation-compact-commitments{grid-template-columns:repeat(2,minmax(0,1fr))}
      }
      @media(max-width:540px){
        .sux-foundation-root .foundation-compact-principles{grid-template-columns:1fr}
        .sux-foundation-root .foundation-realignment-grid{grid-template-columns:1fr}
        .sux-foundation-root .foundation-dialog{padding:20px}
      }
      @media(prefers-reduced-motion:reduce){
        .sux-foundation-root,.sux-foundation-root *{transition:none!important;animation:none!important}
        .sux-foundation-root .foundation-spatial-trace,.sux-foundation-root .foundation-observatory-tether{display:none!important}
      }
    `}</style>
  );
}

function CameraControls({
  scale,
  onZoomOut,
  onZoomIn,
  onReset,
}: {
  scale: number;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onReset: () => void;
}) {
  return (
    <div
      data-spatial-control
      aria-label="Foundations camera controls"
      style={{
        position: "absolute",
        left: "50%",
        bottom: 16,
        zIndex: 30,
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: 5,
        border: `1px solid ${BORDER}`,
        background: "rgba(7,9,15,.94)",
        boxShadow: "0 12px 36px rgba(0,0,0,.34)",
      }}
    >
      <button
        type="button"
        aria-label="Zoom out"
        onClick={onZoomOut}
        style={{ ...controlButton, width: 38, padding: 0 }}
      >
        <Minus size={14} />
      </button>
      <div
        aria-live="polite"
        style={{ ...MONO, minWidth: 55, textAlign: "center", color: SECONDARY }}
      >
        {Math.round(scale * 100)}%
      </div>
      <button
        type="button"
        aria-label="Zoom in"
        onClick={onZoomIn}
        style={{ ...controlButton, width: 38, padding: 0 }}
      >
        <Plus size={14} />
      </button>
      <button type="button" onClick={onReset} style={controlButton}>
        <RotateCcw size={13} /> RESET VIEW
      </button>
    </div>
  );
}

function PrinciplePreview({
  id,
  viewScale,
}: {
  id: FoundationPrincipleId;
  viewScale: number;
}) {
  const position = FIELD_PRINCIPLES.find((item) => item.id === id);
  if (!position) return null;
  const principle = FOUNDATION_PRINCIPLES_BY_ID[id];
  const onRight = position.x > CENTER_X;
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        zIndex: 20,
        left: position.x + (onRight ? -78 : 78),
        top: position.y,
        width: 290,
        pointerEvents: "none",
        transformOrigin: onRight ? "right center" : "left center",
        transform: `${onRight ? "translate(-100%,-50%)" : "translateY(-50%)"} scale(${1 / viewScale})`,
        border: "1px solid rgba(232,200,109,.34)",
        background: "rgba(9,12,21,.97)",
        padding: "15px 17px",
        boxShadow: "0 18px 42px rgba(0,0,0,.58)",
      }}
    >
      <div style={{ ...MONO, color: PURPOSE, fontSize: 9, marginBottom: 6 }}>
        PRINCIPLE {id} / 10
      </div>
      <div
        style={{
          ...SERIF,
          color: IVORY,
          fontSize: 20,
          lineHeight: 1.16,
          marginBottom: 7,
        }}
      >
        {principle.title}
      </div>
      <div
        style={{
          ...SERIF,
          color: SECONDARY,
          fontSize: 14,
          lineHeight: 1.42,
        }}
      >
        {principle.belief}
      </div>
    </div>
  );
}

function OrbitalDeepDive({
  selected,
  selectedId,
  anchorPosition,
  cameraView,
  onSelect,
  onBack,
  onReflection,
  readScrollRef,
  selectedHeadingRef,
  reflectionTriggerRef,
}: {
  selected: FoundationPrinciple;
  selectedId: FoundationPrincipleId;
  anchorPosition: (typeof FIELD_PRINCIPLES)[number] | undefined;
  cameraView: SpatialView;
  onSelect: (id: FoundationPrincipleId) => void;
  onBack: () => void;
  onReflection: () => void;
  readScrollRef: RefObject<HTMLDivElement | null>;
  selectedHeadingRef: RefObject<HTMLHeadingElement | null>;
  reflectionTriggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const anchorX = anchorPosition
    ? cameraView.x + anchorPosition.x * cameraView.scale
    : 220;
  const anchorY = anchorPosition
    ? cameraView.y + anchorPosition.y * cameraView.scale
    : 360;
  const tetherEndX = Math.max(360, Math.min(520, anchorX + 160));

  return (
    <div
      className="foundation-observatory-shell"
      style={{
        position: "absolute",
        zIndex: 35,
        inset: 0,
        pointerEvents: "none",
      }}
    >
      <svg
        aria-hidden="true"
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          inset: 0,
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <defs>
          <linearGradient
            id="foundation-observatory-tether"
            x1="0"
            x2="1"
          >
            <stop offset="0%" stopColor={PURPOSE} stopOpacity=".84" />
            <stop offset="100%" stopColor={PURPOSE} stopOpacity=".12" />
          </linearGradient>
          <filter
            id="foundation-observatory-anchor-glow"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        <circle
          cx={anchorX}
          cy={anchorY}
          r="28"
          fill="none"
          stroke={PURPOSE}
          strokeOpacity=".48"
          strokeDasharray="2 7"
          className="foundation-anchor-orbit"
        />
        <circle
          cx={anchorX}
          cy={anchorY}
          r="7"
          fill={PURPOSE}
          opacity=".54"
          filter="url(#foundation-observatory-anchor-glow)"
        />
        <path
          d={`M ${anchorX + 28} ${anchorY} C ${anchorX + 110} ${anchorY}, ${tetherEndX - 70} 110, ${tetherEndX} 110`}
          fill="none"
          stroke="url(#foundation-observatory-tether)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          className="foundation-observatory-tether"
        />
      </svg>

      <aside
        data-spatial-control
        className="foundation-detail-panel foundation-scroll"
        aria-label={`Principle ${selected.id} evidence observatory`}
        style={{
          position: "absolute",
          pointerEvents: "auto",
          inset: "22px 22px 76px clamp(360px,32vw,470px)",
          minWidth: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          border: "1px solid rgba(232,200,109,.28)",
          borderRadius: 18,
          background:
            "radial-gradient(circle at 18% 2%,rgba(232,200,109,.085),transparent 30%),linear-gradient(145deg,rgba(14,17,27,.965),rgba(5,7,13,.985))",
          boxShadow:
            "-28px 0 90px rgba(0,0,0,.5),0 24px 90px rgba(0,0,0,.5),inset 0 1px rgba(255,248,230,.035)",
          backdropFilter: "blur(18px)",
        }}
      >
        <header
          style={{
            flexShrink: 0,
            display: "grid",
            gridTemplateColumns: "auto minmax(0,1fr) auto",
            alignItems: "center",
            gap: 16,
            padding: "15px 18px",
            borderBottom: `1px solid ${BORDER}`,
            background: "rgba(5,7,12,.66)",
          }}
        >
          <button type="button" onClick={onBack} style={controlButton}>
            <ArrowLeft size={14} /> RETURN TO FIELD
          </button>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                ...MONO,
                color: PURPOSE,
                fontSize: 9,
                marginBottom: 5,
              }}
            >
              EVIDENCE OBSERVATORY · PRINCIPLE {selected.id}
            </div>
            <h2
              ref={selectedHeadingRef}
              tabIndex={-1}
              style={{
                ...SERIF,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: 25,
                fontWeight: 400,
                lineHeight: 1.08,
                margin: 0,
                color: IVORY,
              }}
            >
              {selected.title}
            </h2>
          </div>
          <div
            aria-label="Travel to another principle"
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            {FOUNDATION_PRINCIPLES.map((principle) => (
              <button
                key={principle.id}
                type="button"
                className="foundation-observatory-nav"
                onClick={() => onSelect(principle.id)}
                aria-label={`Travel to principle ${principle.id}: ${principle.title}`}
                aria-current={
                  principle.id === selectedId ? "true" : undefined
                }
                title={principle.title}
                style={{
                  ...MONO,
                  width: 29,
                  height: 29,
                  padding: 0,
                  border:
                    principle.id === selectedId
                      ? "1px solid rgba(232,200,109,.72)"
                      : "1px solid rgba(200,180,130,.13)",
                  borderRadius: "50%",
                  color: principle.id === selectedId ? "#FFF0BE" : MUTED,
                  background:
                    principle.id === selectedId
                      ? "rgba(232,200,109,.12)"
                      : "rgba(255,255,255,.015)",
                  cursor: "pointer",
                }}
              >
                {principle.id}
              </button>
            ))}
          </div>
        </header>

        <div
          ref={readScrollRef}
          className="foundation-scroll"
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            padding: 20,
          }}
        >
          <div
            className="foundation-observatory-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1.42fr) minmax(270px,.72fr)",
              gap: 18,
              alignItems: "start",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  ...MONO,
                  color: GOLD,
                  fontSize: 9,
                  marginBottom: 9,
                }}
              >
                INTERFACE EVIDENCE LAB · TRY THE PATTERN
              </div>
              <EvidenceLab key={selected.id} principle={selected} />
            </div>

            <div
              aria-label="Principle interpretation"
              style={{ display: "grid", gap: 9 }}
            >
              <EvidenceRecord
                icon={<Eye size={14} />}
                label="UNDERLYING BELIEF"
                text={selected.belief}
              />
              <EvidenceRecord
                icon={<SlidersHorizontal size={14} />}
                label="DESIGN RESPONSIBILITY"
                text={selected.designResponsibility}
                emphasis
              />
              <EvidenceRecord
                icon={<ShieldCheck size={14} />}
                label="PRESERVED AGENCY"
                text={selected.preservedAgency}
              />
              <div
                style={{
                  marginTop: 4,
                  padding: "13px 14px",
                  border: `1px solid ${BORDER}`,
                  background: "rgba(255,255,255,.014)",
                }}
              >
                <div
                  style={{
                    ...MONO,
                    color: MUTED,
                    fontSize: 8,
                    marginBottom: 8,
                  }}
                >
                  ORIGINAL PRINCIPLE
                </div>
                <p
                  style={{
                    ...SERIF,
                    color: SECONDARY,
                    fontSize: 14,
                    lineHeight: 1.42,
                    margin: 0,
                  }}
                >
                  {selected.originalPrinciple}
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer
          style={{
            flexShrink: 0,
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) auto",
            alignItems: "center",
            gap: 18,
            padding: "13px 18px",
            borderTop: `1px solid ${BORDER}`,
            background: "rgba(5,7,12,.76)",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                ...MONO,
                color: PURPOSE,
                fontSize: 8,
                marginBottom: 5,
              }}
            >
              CONTEXTUAL REFLECTION
            </div>
            <div
              style={{
                ...SERIF,
                color: SECONDARY,
                fontSize: 15,
                lineHeight: 1.25,
              }}
            >
              {reflectionPrompt(selected.id)}
            </div>
          </div>
          <button
            ref={reflectionTriggerRef}
            type="button"
            onClick={onReflection}
            style={controlButton}
          >
            REFLECT <MessageCircleQuestion size={15} />
          </button>
        </footer>
      </aside>
    </div>
  );
}

function EvidenceRecord({
  icon,
  label,
  text,
  emphasis = false,
}: {
  icon: ReactNode;
  label: string;
  text: string;
  emphasis?: boolean;
}) {
  return (
    <section
      style={{
        padding: 14,
        border: emphasis
          ? "1px solid rgba(232,200,109,.34)"
          : `1px solid ${BORDER}`,
        background: emphasis
          ? "rgba(232,200,109,.055)"
          : "rgba(255,255,255,.018)",
      }}
    >
      <div
        style={{
          ...MONO,
          display: "flex",
          alignItems: "center",
          gap: 7,
          color: emphasis ? PURPOSE : GOLD,
          fontSize: 8,
          marginBottom: 8,
        }}
      >
        {icon} {label}
      </div>
      <p
        style={{
          ...SERIF,
          color: emphasis ? IVORY : SECONDARY,
          fontSize: emphasis ? 15.5 : 14.5,
          lineHeight: 1.42,
          margin: 0,
        }}
      >
        {text}
      </p>
    </section>
  );
}

function reflectionPrompt(id: FoundationPrincipleId) {
  if (id === "02") {
    return "If declining is harder than accepting, was the choice ever neutral?";
  }
  if (id === "10") {
    return "What changed: the available options, or the frame used to rank them?";
  }
  return FOUNDATION_REFLECTION_QUESTIONS[
    (Number(id) - 1) % FOUNDATION_REFLECTION_QUESTIONS.length
  ];
}

function EvidenceLab({ principle }: { principle: FoundationPrinciple }) {
  if (principle.id === "02") {
    return <TargetingEvidenceLab />;
  }
  if (principle.id === "10") {
    return <DecisionFramingEvidenceLab />;
  }
  return <ReusablePrincipleLab principle={principle} />;
}

const labToggleStyle: CSSProperties = {
  ...MONO,
  minHeight: 34,
  padding: "0 11px",
  border: `1px solid ${BORDER}`,
  background: "rgba(255,255,255,.018)",
  color: MUTED,
  cursor: "pointer",
};

const labPrimaryAction: CSSProperties = {
  ...SERIF,
  minHeight: 40,
  padding: "0 16px",
  border: "1px solid rgba(232,200,109,.58)",
  background: "rgba(232,200,109,.13)",
  color: "#FFF0BE",
  fontSize: 15,
  cursor: "pointer",
};

const labSecondaryAction: CSSProperties = {
  ...SERIF,
  minHeight: 40,
  padding: "0 16px",
  border: `1px solid ${BORDER}`,
  background: "rgba(255,255,255,.018)",
  color: SECONDARY,
  fontSize: 15,
  cursor: "pointer",
};

function LabShell({
  label,
  summary,
  controls,
  children,
  result,
}: {
  label: string;
  summary: string;
  controls: ReactNode;
  children: ReactNode;
  result: string;
}) {
  return (
    <section
      style={{
        overflow: "hidden",
        border: "1px solid rgba(138,174,200,.22)",
        borderRadius: 14,
        background:
          "radial-gradient(circle at 82% 8%,rgba(138,174,200,.08),transparent 34%),rgba(4,7,13,.78)",
        boxShadow: "inset 0 1px rgba(255,255,255,.025)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          padding: "13px 14px",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              ...MONO,
              color: STELLAR_PALETTE.agentic,
              fontSize: 8,
              marginBottom: 5,
            }}
          >
            {label}
          </div>
          <div
            style={{
              ...SERIF,
              color: SECONDARY,
              fontSize: 14,
              lineHeight: 1.3,
            }}
          >
            {summary}
          </div>
        </div>
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            gap: 5,
          }}
        >
          {controls}
        </div>
      </div>
      <div style={{ padding: 16 }}>{children}</div>
      <div
        role="status"
        aria-live="polite"
        style={{
          minHeight: 43,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 9,
          borderTop: `1px solid ${BORDER}`,
          ...MONO,
          fontSize: 8.5,
          lineHeight: 1.35,
          color: result ? PURPOSE : MUTED,
          background: result
            ? "rgba(232,200,109,.045)"
            : "rgba(255,255,255,.01)",
        }}
      >
        {result ? <Check size={13} aria-hidden="true" /> : <Eye size={13} aria-hidden="true" />}
        {result || "INTERACT WITH THE EXAMPLE TO REVEAL THE BEHAVIORAL CONSEQUENCE"}
      </div>
    </section>
  );
}

function TargetingEvidenceLab() {
  const [mode, setMode] = useState<"pressure" | "sovereign">("pressure");
  const [result, setResult] = useState("");

  const switchMode = (next: "pressure" | "sovereign") => {
    setMode(next);
    setResult("");
  };

  return (
    <LabShell
      label="PRODUCT OFFER · CHOICE ARCHITECTURE"
      summary="The offer stays the same. Change how the choice treats the person."
      result={result}
      controls={
        <>
          <button
            type="button"
            aria-pressed={mode === "pressure"}
            onClick={() => switchMode("pressure")}
            style={{
              ...labToggleStyle,
              color: mode === "pressure" ? STELLAR_PALETTE.risk : MUTED,
              borderColor:
                mode === "pressure"
                  ? "rgba(216,108,97,.48)"
                  : "rgba(200,180,130,.16)",
              background:
                mode === "pressure"
                  ? "rgba(216,108,97,.07)"
                  : "rgba(255,255,255,.018)",
            }}
          >
            PRESSURE PATTERN
          </button>
          <button
            type="button"
            aria-pressed={mode === "sovereign"}
            onClick={() => switchMode("sovereign")}
            style={{
              ...labToggleStyle,
              color: mode === "sovereign" ? PURPOSE : MUTED,
              borderColor:
                mode === "sovereign"
                  ? "rgba(232,200,109,.5)"
                  : "rgba(200,180,130,.16)",
              background:
                mode === "sovereign"
                  ? "rgba(232,200,109,.07)"
                  : "rgba(255,255,255,.018)",
            }}
          >
            SOVEREIGN PATTERN
          </button>
        </>
      }
    >
      <div
        className="foundation-lab-stage"
        style={{
          minHeight: 295,
          display: "grid",
          placeItems: "center",
          border: `1px solid ${BORDER}`,
          borderRadius: 10,
          padding: 20,
          background:
            "linear-gradient(145deg,rgba(16,20,31,.88),rgba(7,9,15,.96))",
        }}
      >
        <div
          style={{
            width: "min(100%,430px)",
            border:
              mode === "pressure"
                ? "1px solid rgba(216,108,97,.32)"
                : "1px solid rgba(232,200,109,.3)",
            background: "rgba(8,11,18,.96)",
            boxShadow: "0 20px 60px rgba(0,0,0,.42)",
          }}
        >
          {mode === "pressure" ? (
            <>
              <div
                style={{
                  ...MONO,
                  padding: "8px 14px",
                  color: "#F0A49B",
                  fontSize: 8,
                  textAlign: "center",
                  background: "rgba(216,108,97,.11)",
                  borderBottom: "1px solid rgba(216,108,97,.22)",
                }}
              >
                YOUR OFFER EXPIRES IN 01:59
              </div>
              <div style={{ padding: "22px 22px 18px", textAlign: "center" }}>
                <div
                  style={{
                    ...SERIF,
                    color: IVORY,
                    fontSize: 26,
                    marginBottom: 7,
                  }}
                >
                  Unlock your full potential
                </div>
                <p
                  style={{
                    ...SERIF,
                    color: SECONDARY,
                    fontSize: 14,
                    lineHeight: 1.4,
                    margin: "0 0 18px",
                  }}
                >
                  Join today so you do not fall behind.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setResult(
                      "The system captured conversion, but urgency and unequal exits made consent ambiguous.",
                    )
                  }
                  style={{
                    ...labPrimaryAction,
                    width: "100%",
                    borderColor: "rgba(216,108,97,.68)",
                    background: "rgba(216,108,97,.2)",
                    color: "#FFD8D2",
                  }}
                >
                  START MY FREE TRIAL
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setResult(
                      "The exit exists, but shame-loaded copy makes declining feel like failure.",
                    )
                  }
                  style={{
                    marginTop: 11,
                    padding: 0,
                    border: 0,
                    background: "transparent",
                    color: "rgba(189,177,142,.48)",
                    ...SERIF,
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  No thanks, I prefer staying limited
                </button>
              </div>
            </>
          ) : (
            <div style={{ padding: 22 }}>
              <div
                style={{
                  ...MONO,
                  color: PURPOSE,
                  fontSize: 8,
                  marginBottom: 10,
                }}
              >
                OPTIONAL RECOMMENDATION
              </div>
              <div
                style={{
                  ...SERIF,
                  color: IVORY,
                  fontSize: 26,
                  marginBottom: 8,
                }}
              >
                Explore the expanded plan
              </div>
              <p
                style={{
                  ...SERIF,
                  color: SECONDARY,
                  fontSize: 14,
                  lineHeight: 1.45,
                  margin: "0 0 18px",
                }}
              >
                It adds collaboration tools for $12/month. Your current plan
                will continue unchanged if you decline.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setResult(
                      "The person chose to explore after seeing the cost, purpose, and consequence.",
                    )
                  }
                  style={labPrimaryAction}
                >
                  Explore plan
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setResult(
                      "Declining is treated as an ordinary choice; the current plan remains unchanged.",
                    )
                  }
                  style={labSecondaryAction}
                >
                  Not now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <SignalStrip
        items={
          mode === "pressure"
            ? ["Manufactured urgency", "Unequal emphasis", "Shame-loaded exit"]
            : ["Visible consequence", "Equivalent exit", "No penalty for decline"]
        }
        risk={mode === "pressure"}
      />
    </LabShell>
  );
}

type DecisionCriterion = "speed" | "cost" | "privacy";

const DECISION_OPTIONS = [
  {
    id: "a",
    name: "Cloud Relay",
    speed: "Fastest",
    cost: "$24",
    privacy: "Standard",
  },
  {
    id: "b",
    name: "Local Bridge",
    speed: "Moderate",
    cost: "$16",
    privacy: "Highest",
  },
  {
    id: "c",
    name: "Open Route",
    speed: "Standard",
    cost: "$8",
    privacy: "Enhanced",
  },
] as const;

const RECOMMENDED_BY_CRITERION: Record<DecisionCriterion, string> = {
  speed: "a",
  privacy: "b",
  cost: "c",
};

function DecisionFramingEvidenceLab() {
  const [criterion, setCriterion] = useState<DecisionCriterion>("speed");
  const [chosen, setChosen] = useState<string | null>(null);
  const recommended = RECOMMENDED_BY_CRITERION[criterion];
  const criterionLabel =
    criterion === "speed"
      ? "fastest setup"
      : criterion === "cost"
        ? "lowest monthly cost"
        : "strongest data boundary";

  const changeCriterion = (next: DecisionCriterion) => {
    setCriterion(next);
    setChosen(null);
  };

  return (
    <LabShell
      label="SERVICE COMPARISON · RECOMMENDATION FRAME"
      summary="Keep every option fixed, then change the criterion used to frame the recommendation."
      result={
        chosen
          ? `You chose ${DECISION_OPTIONS.find((option) => option.id === chosen)?.name}. The system recommended for ${criterionLabel}, not because one option is universally best.`
          : `Recommendation currently reflects ${criterionLabel}. Change the frame and watch the recommendation move.`
      }
      controls={
        <>
          {(["speed", "cost", "privacy"] as const).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={criterion === item}
              onClick={() => changeCriterion(item)}
              style={{
                ...labToggleStyle,
                color: criterion === item ? PURPOSE : MUTED,
                borderColor:
                  criterion === item
                    ? "rgba(232,200,109,.5)"
                    : "rgba(200,180,130,.16)",
                background:
                  criterion === item
                    ? "rgba(232,200,109,.07)"
                    : "rgba(255,255,255,.018)",
              }}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </>
      }
    >
      <div
        style={{
          padding: 14,
          border: `1px solid ${BORDER}`,
          borderRadius: 10,
          background:
            "linear-gradient(145deg,rgba(16,20,31,.88),rgba(7,9,15,.96))",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 14,
            marginBottom: 12,
          }}
        >
          <div>
            <div style={{ ...MONO, color: MUTED, fontSize: 8, marginBottom: 4 }}>
              VISIBLE RECOMMENDATION CRITERION
            </div>
            <div style={{ ...SERIF, color: IVORY, fontSize: 18 }}>
              Recommended for {criterionLabel}
            </div>
          </div>
          <Scale size={21} color={PURPOSE} aria-hidden="true" />
        </div>
        <div style={{ display: "grid", gap: 7 }}>
          {DECISION_OPTIONS.map((option) => {
            const isRecommended = option.id === recommended;
            const isChosen = option.id === chosen;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setChosen(option.id)}
                style={{
                  minHeight: 64,
                  display: "grid",
                  gridTemplateColumns: "minmax(120px,1fr) repeat(3,minmax(62px,.55fr)) auto",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 11px",
                  textAlign: "left",
                  border: isChosen
                    ? "1px solid rgba(138,174,200,.72)"
                    : isRecommended
                      ? "1px solid rgba(232,200,109,.5)"
                      : `1px solid ${BORDER}`,
                  background: isChosen
                    ? "rgba(138,174,200,.1)"
                    : isRecommended
                      ? "rgba(232,200,109,.06)"
                      : "rgba(255,255,255,.015)",
                  color: IVORY,
                  cursor: "pointer",
                }}
              >
                <span>
                  <span
                    style={{
                      ...SERIF,
                      display: "block",
                      fontSize: 17,
                      lineHeight: 1.1,
                    }}
                  >
                    {option.name}
                  </span>
                  {isRecommended && (
                    <span
                      style={{
                        ...MONO,
                        display: "block",
                        color: PURPOSE,
                        fontSize: 7,
                        marginTop: 5,
                      }}
                    >
                      RECOMMENDED
                    </span>
                  )}
                </span>
                <Metric label="SPEED" value={option.speed} />
                <Metric label="COST" value={option.cost} />
                <Metric label="PRIVACY" value={option.privacy} />
                <ChevronRight
                  size={15}
                  color={isRecommended ? PURPOSE : MUTED}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      </div>
      <SignalStrip
        items={[
          "Options unchanged",
          `Criterion: ${criterionLabel}`,
          "Recommendation is conditional",
        ]}
      />
    </LabShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <span>
      <span
        style={{
          ...MONO,
          display: "block",
          color: MUTED,
          fontSize: 6.5,
          marginBottom: 4,
        }}
      >
        {label}
      </span>
      <span
        style={{
          ...SERIF,
          display: "block",
          color: SECONDARY,
          fontSize: 13,
        }}
      >
        {value}
      </span>
    </span>
  );
}

function ReusablePrincipleLab({
  principle,
}: {
  principle: FoundationPrinciple;
}) {
  const [mode, setMode] = useState<"system" | "held">("system");
  const [result, setResult] = useState("");

  const changeMode = (next: "system" | "held") => {
    setMode(next);
    setResult("");
  };

  return (
    <LabShell
      label={principle.illustration.context}
      summary="Compare a system-first interaction with the same moment after the principle is held."
      result={result}
      controls={
        <>
          <button
            type="button"
            aria-pressed={mode === "system"}
            onClick={() => changeMode("system")}
            style={{
              ...labToggleStyle,
              color: mode === "system" ? STELLAR_PALETTE.risk : MUTED,
              borderColor:
                mode === "system"
                  ? "rgba(216,108,97,.42)"
                  : "rgba(200,180,130,.16)",
            }}
          >
            SYSTEM-FIRST
          </button>
          <button
            type="button"
            aria-pressed={mode === "held"}
            onClick={() => changeMode("held")}
            style={{
              ...labToggleStyle,
              color: mode === "held" ? PURPOSE : MUTED,
              borderColor:
                mode === "held"
                  ? "rgba(232,200,109,.5)"
                  : "rgba(200,180,130,.16)",
            }}
          >
            PRINCIPLE-HELD
          </button>
        </>
      }
    >
      <div
        style={{
          minHeight: 285,
          display: "grid",
          placeItems: "center",
          padding: 20,
          border: `1px solid ${BORDER}`,
          borderRadius: 10,
          background:
            "linear-gradient(145deg,rgba(16,20,31,.88),rgba(7,9,15,.96))",
        }}
      >
        <div
          style={{
            width: "min(100%,450px)",
            padding: 22,
            border:
              mode === "held"
                ? "1px solid rgba(232,200,109,.3)"
                : "1px solid rgba(216,108,97,.25)",
            background: "rgba(8,11,18,.96)",
            boxShadow: "0 20px 60px rgba(0,0,0,.42)",
          }}
        >
          <div
            style={{
              ...MONO,
              color: mode === "held" ? PURPOSE : STELLAR_PALETTE.risk,
              fontSize: 8,
              marginBottom: 10,
            }}
          >
            {mode === "held"
              ? "CONTEXT BEFORE COMMITMENT"
              : "ACTION BEFORE CONTEXT"}
          </div>
          <div
            style={{
              ...SERIF,
              color: IVORY,
              fontSize: 25,
              lineHeight: 1.15,
              marginBottom: 10,
            }}
          >
            {principle.illustration.heading}
          </div>
          <p
            style={{
              ...SERIF,
              color: mode === "held" ? SECONDARY : "rgba(189,177,142,.56)",
              fontSize: 14,
              lineHeight: 1.45,
              margin: "0 0 18px",
            }}
          >
            {mode === "held"
              ? principle.illustration.behavior
              : "The system asks for commitment now and leaves the consequence, rationale, or exit to be discovered later."}
          </p>
          {mode === "held" ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setResult(
                    "The person can proceed with relevant context and a visible boundary around the action.",
                  )
                }
                style={labPrimaryAction}
              >
                Review and continue
              </button>
              <button
                type="button"
                onClick={() =>
                  setResult(
                    "The interaction preserves a legitimate pause or exit without treating it as failure.",
                  )
                }
                style={labSecondaryAction}
              >
                Pause for now
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() =>
                setResult(
                  "The task may complete, but the person had to act before the system made its assumptions and consequences visible.",
                )
              }
              style={{
                ...labPrimaryAction,
                width: "100%",
                borderColor: "rgba(216,108,97,.5)",
                background: "rgba(216,108,97,.12)",
                color: "#FFD8D2",
              }}
            >
              Continue
            </button>
          )}
        </div>
      </div>
      <SignalStrip
        items={
          mode === "held"
            ? ["Context visible", "Choice remains reversible", "Exit is ordinary"]
            : ["Context deferred", "Single emphasized path", "Agency inferred"]
        }
        risk={mode === "system"}
      />
    </LabShell>
  );
}

function SignalStrip({
  items,
  risk = false,
}: {
  items: readonly string[];
  risk?: boolean;
}) {
  const color = risk ? STELLAR_PALETTE.risk : STELLAR_PALETTE.agentic;
  return (
    <div
      aria-label="Observable interface signals"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${items.length},minmax(0,1fr))`,
        gap: 6,
        marginTop: 9,
      }}
    >
      {items.map((item) => (
        <div
          key={item}
          style={{
            minHeight: 35,
            padding: "8px 9px",
            display: "flex",
            alignItems: "center",
            gap: 7,
            border: `1px solid ${BORDER}`,
            background: "rgba(255,255,255,.012)",
            ...MONO,
            color,
            fontSize: 7,
            lineHeight: 1.25,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 5,
              height: 5,
              flexShrink: 0,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 8px ${color}`,
            }}
          />
          {item.toUpperCase()}
        </div>
      ))}
    </div>
  );
}

function CompactOverview({
  overviewScrollRef,
  overviewPrinciples,
  onSelect,
}: {
  overviewScrollRef: RefObject<HTMLDivElement | null>;
  overviewPrinciples: RefObject<
    Map<FoundationPrincipleId, HTMLButtonElement>
  >;
  onSelect: (id: FoundationPrincipleId) => void;
}) {
  return (
    <div
      ref={overviewScrollRef}
      className="foundation-scroll"
      aria-label="Foundations principles overview"
      style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "26px 24px 42px" }}
    >
      <div style={{ maxWidth: 840, margin: "0 auto" }}>
        <div style={{ ...MONO, color: PURPOSE, fontSize: 10, marginBottom: 13 }}>
          FOUR COMMITMENTS · TEN CORE PRINCIPLES
        </div>
        <h1
          style={{
            ...SERIF,
            fontSize: "clamp(28px,4vw,38px)",
            fontWeight: 400,
            margin: "0 0 7px",
          }}
        >
          People at the center.
        </h1>
        <p
          style={{
            ...SERIF,
            fontSize: 17,
            lineHeight: 1.4,
            color: SECONDARY,
            margin: "0 0 23px",
          }}
        >
          Choose any principle to explore the beliefs behind the interface.
        </p>
        <div
          className="foundation-compact-commitments"
          aria-label="Four foundational commitments"
          style={{ marginBottom: 27 }}
        >
          {FOUNDATION_COMMITMENTS.map((commitment) => (
            <div
              key={commitment.id}
              style={{
                border: `1px solid ${BORDER}`,
                padding: "14px 13px",
                minHeight: 96,
                background: "rgba(232,200,109,.025)",
              }}
            >
              <div style={{ ...SERIF, fontSize: 20, marginBottom: 5 }}>
                {commitment.title}
              </div>
              <div
                style={{
                  ...SERIF,
                  fontSize: 14,
                  color: SECONDARY,
                  lineHeight: 1.35,
                }}
              >
                {commitment.meaning}
              </div>
            </div>
          ))}
        </div>
        <div style={{ ...MONO, color: GOLD, fontSize: 10, marginBottom: 12 }}>
          EXPLORE A PRINCIPLE
        </div>
        <div className="foundation-compact-principles">
          {FIELD_PRINCIPLES.map((position) => {
            const principle = FOUNDATION_PRINCIPLES_BY_ID[position.id];
            return (
              <button
                key={position.id}
                type="button"
                data-foundation-row
                ref={(node) => {
                  if (node) overviewPrinciples.current.set(position.id, node);
                  else overviewPrinciples.current.delete(position.id);
                }}
                onClick={() => onSelect(position.id)}
                aria-label={`Inspect principle ${position.id}: ${principle.title}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  textAlign: "left",
                  minHeight: 58,
                  padding: "11px 13px",
                  background: "rgba(10,12,20,.46)",
                  color: IVORY,
                  border: `1px solid ${BORDER}`,
                  cursor: "pointer",
                }}
              >
                <span style={{ ...MONO, color: PURPOSE, fontSize: 10 }}>
                  {position.id}
                </span>
                <span
                  style={{ ...SERIF, flex: 1, fontSize: 16, lineHeight: 1.2 }}
                >
                  {principle.title}
                </span>
                <ArrowRight size={15} color={GOLD} aria-hidden="true" />
              </button>
            );
          })}
        </div>
        <p
          style={{
            ...MONO,
            color: MUTED,
            fontSize: 10,
            lineHeight: 1.6,
            marginTop: 24,
          }}
        >
          The four commitments anchor the field. Principles are open to explore
          in any order.
        </p>
      </div>
    </div>
  );
}

function MobileInspector({
  selected,
  selectedId,
  small,
  onSelect,
  onBack,
  onReflection,
  readScrollRef,
  selectedHeadingRef,
  reflectionTriggerRef,
}: {
  selected: FoundationPrinciple;
  selectedId: FoundationPrincipleId;
  small: boolean;
  onSelect: (id: FoundationPrincipleId) => void;
  onBack: () => void;
  onReflection: () => void;
  readScrollRef: RefObject<HTMLDivElement | null>;
  selectedHeadingRef: RefObject<HTMLHeadingElement | null>;
  reflectionTriggerRef: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <div className="foundation-detail-layout">
      <aside className="foundation-rail foundation-scroll" aria-label="Principle navigation">
        <button
          type="button"
          style={{
            ...controlButton,
            width: small ? "auto" : "100%",
            marginBottom: 15,
            justifyContent: "flex-start",
          }}
          onClick={onBack}
        >
          <ArrowLeft size={14} aria-hidden="true" /> ALL PRINCIPLES
        </button>
        {!small && (
          <div style={{ ...MONO, color: MUTED, fontSize: 9, marginBottom: 11 }}>
            TEN CORE PRINCIPLES
          </div>
        )}
        <div className="foundation-rail-list">
          {FOUNDATION_PRINCIPLES.map((principle) => (
            <button
              key={principle.id}
              data-foundation-rail-item
              type="button"
              onClick={() => onSelect(principle.id)}
              aria-current={
                principle.id === selectedId ? "true" : undefined
              }
              style={{
                display: "flex",
                gap: 10,
                minHeight: 44,
                padding: "12px 10px",
                width: small ? 182 : "100%",
                flexShrink: 0,
                textAlign: "left",
                cursor: "pointer",
                border:
                  principle.id === selectedId
                    ? "1px solid rgba(232,200,109,.62)"
                    : "1px solid transparent",
                background:
                  principle.id === selectedId
                    ? "rgba(232,200,109,.065)"
                    : "transparent",
                color: principle.id === selectedId ? IVORY : SECONDARY,
              }}
            >
              <span
                style={{
                  ...MONO,
                  color: principle.id === selectedId ? PURPOSE : MUTED,
                  fontSize: 10,
                  paddingTop: 3,
                }}
              >
                {principle.id}
              </span>
              <span
                style={{
                  ...SERIF,
                  fontSize: small ? 15 : 16,
                  lineHeight: 1.22,
                }}
              >
                {principle.title}
              </span>
            </button>
          ))}
        </div>
      </aside>
      <main
        ref={readScrollRef}
        className="foundation-mobile-inspector foundation-scroll"
        style={{ minWidth: 0 }}
      >
        <PrincipleContent
          selected={selected}
          selectedHeadingRef={selectedHeadingRef}
          reflectionTriggerRef={reflectionTriggerRef}
          onReflection={onReflection}
        />
      </main>
    </div>
  );
}

function PrincipleContent({
  selected,
  selectedHeadingRef,
  reflectionTriggerRef,
  onReflection,
  compact = false,
}: {
  selected: FoundationPrinciple;
  selectedHeadingRef: RefObject<HTMLHeadingElement | null>;
  reflectionTriggerRef: RefObject<HTMLButtonElement | null>;
  onReflection: () => void;
  compact?: boolean;
}) {
  return (
    <div style={{ maxWidth: 845, margin: "0 auto", paddingBottom: 55 }}>
      <div style={{ ...MONO, fontSize: 10, color: PURPOSE, marginBottom: 17 }}>
        PRINCIPLE {selected.id} / 10
      </div>
      <h2
        tabIndex={-1}
        ref={selectedHeadingRef}
        style={{
          ...SERIF,
          fontSize: compact ? "clamp(30px,3vw,40px)" : "clamp(33px,3.4vw,53px)",
          fontWeight: 400,
          lineHeight: 1.08,
          letterSpacing: "-.018em",
          margin: "0 0 25px",
        }}
      >
        {selected.title}
      </h2>
      <blockquote
        style={{
          borderLeft: `2px solid ${PURPOSE}`,
          margin: "0 0 34px",
          padding: "4px 0 4px 20px",
          ...SERIF,
          color: IVORY,
          fontSize: compact ? 18 : 21,
          lineHeight: 1.45,
        }}
      >
        {selected.originalPrinciple}
      </blockquote>
      <div style={{ display: "grid", gap: 18 }}>
        <RecordSection label="01 · WHAT WE BELIEVE" text={selected.belief} />
        <section
          style={{
            border: "1px solid rgba(232,200,109,.27)",
            padding: compact ? "21px 20px" : "25px 26px",
            background: "rgba(232,200,109,.044)",
          }}
        >
          <div style={{ ...MONO, color: PURPOSE, marginBottom: 12 }}>
            02 · WHAT DESIGN MUST DO
          </div>
          <p
            style={{
              ...SERIF,
              color: IVORY,
              fontSize: compact ? 19 : 22,
              lineHeight: 1.46,
              margin: 0,
            }}
          >
            {selected.designResponsibility}
          </p>
        </section>
        <section
          style={{
            border: `1px solid ${BORDER}`,
            padding: compact ? "20px" : "24px 26px",
            background: "rgba(11,14,23,.4)",
          }}
        >
          <div
            style={{
              ...MONO,
              color: GOLD,
              display: "flex",
              gap: 9,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <ShieldCheck size={14} aria-hidden="true" /> 03 · WHAT THE PERSON
            RETAINS
          </div>
          <p
            style={{
              ...SERIF,
              color: IVORY,
              fontSize: compact ? 17 : 19,
              lineHeight: 1.47,
              margin: 0,
            }}
          >
            {selected.preservedAgency}
          </p>
        </section>
      </div>
      <section
        aria-label="Applied illustration"
        style={{
          marginTop: 33,
          paddingTop: 23,
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <div style={{ ...MONO, fontSize: 10, color: GOLD, marginBottom: 13 }}>
          APPLIED ILLUSTRATION
        </div>
        <div
          style={{
            border: `1px solid ${BORDER}`,
            padding: compact ? 20 : 24,
            background:
              "linear-gradient(140deg,rgba(20,24,34,.8),rgba(8,10,17,.9))",
          }}
        >
          <div style={{ ...MONO, fontSize: 9, color: MUTED, marginBottom: 11 }}>
            {selected.illustration.context}
          </div>
          <h3
            style={{
              ...SERIF,
              color: IVORY,
              fontWeight: 400,
              fontSize: compact ? 24 : 27,
              lineHeight: 1.2,
              margin: "0 0 12px",
            }}
          >
            {selected.illustration.heading}
          </h3>
          <p
            style={{
              ...SERIF,
              fontSize: 17,
              color: SECONDARY,
              lineHeight: 1.55,
              margin: "0 0 15px",
            }}
          >
            {selected.illustration.behavior}
          </p>
          <p
            style={{
              ...SERIF,
              fontSize: 15,
              color: MUTED,
              fontStyle: "italic",
              margin: 0,
            }}
          >
            {selected.illustration.note}
          </p>
        </div>
        <p
          style={{
            ...MONO,
            letterSpacing: ".04em",
            fontSize: 9,
            lineHeight: 1.6,
            color: MUTED,
            marginTop: 12,
          }}
        >
          Illustrative treatment · Not an empirical research finding
        </p>
      </section>
      <section
        style={{
          marginTop: 29,
          borderTop: `1px solid ${BORDER}`,
          paddingTop: 23,
        }}
      >
        <p
          style={{
            ...SERIF,
            color: SECONDARY,
            fontSize: 16,
            lineHeight: 1.5,
            margin: "0 0 15px",
          }}
        >
          {FOUNDATION_PRACTICE_NOTE}
        </p>
        <button
          ref={reflectionTriggerRef}
          type="button"
          onClick={onReflection}
          style={controlButton}
        >
          <MessageCircleQuestion size={16} aria-hidden="true" /> REFLECT ON THIS
          DESIGN <ArrowRight size={15} aria-hidden="true" />
        </button>
      </section>
    </div>
  );
}

function ReflectionDialog({
  dialogRef,
  onClose,
}: {
  dialogRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
}) {
  return (
    <div
      role="presentation"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 100,
        background: "rgba(1,2,6,.8)",
        display: "grid",
        placeItems: "center",
        padding: 16,
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="foundation-reflection-title"
        className="foundation-dialog foundation-scroll"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
            marginBottom: 14,
          }}
        >
          <div style={{ ...MONO, color: PURPOSE, fontSize: 10 }}>
            SOVEREIGN UX · REFLECTION
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close reflection questions"
            style={{ ...controlButton, padding: 9, minWidth: 44 }}
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>
        <h2
          id="foundation-reflection-title"
          style={{
            ...SERIF,
            fontSize: "clamp(30px,4vw,40px)",
            fontWeight: 400,
            margin: "0 0 8px",
          }}
        >
          Reflect on this design
        </h2>
        <p
          style={{
            ...SERIF,
            fontSize: 17,
            color: SECONDARY,
            lineHeight: 1.55,
            margin: "0 0 25px",
          }}
        >
          A self-check for design judgment, not a scored audit or assurance of
          safety.
        </p>
        <div style={{ ...MONO, color: GOLD, marginBottom: 12 }}>
          FIVE QUESTIONS
        </div>
        <ol style={{ listStyle: "none", padding: 0, margin: "0 0 25px" }}>
          {FOUNDATION_REFLECTION_QUESTIONS.map((question, index) => (
            <li
              key={question}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                borderBottom: `1px solid ${BORDER}`,
                padding: "14px 0",
              }}
            >
              <span style={{ ...MONO, color: PURPOSE, marginTop: 4 }}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span style={{ ...SERIF, fontSize: 19, lineHeight: 1.38 }}>
                {question}
              </span>
            </li>
          ))}
        </ol>
        <div style={{ ...MONO, color: GOLD, marginBottom: 13 }}>
          WHEN THE SYSTEM FEELS OFF
        </div>
        <div
          className="foundation-realignment-grid"
          style={{ gap: 8, marginBottom: 16 }}
        >
          {FOUNDATION_REALIGNMENT.map((step, index) => (
            <div
              key={step.id}
              style={{ border: `1px solid ${BORDER}`, padding: "13px 12px" }}
            >
              <div
                style={{
                  ...MONO,
                  fontSize: 9,
                  color: PURPOSE,
                  marginBottom: 8,
                }}
              >
                {String(index + 1).padStart(2, "0")} · {step.title.toUpperCase()}
              </div>
              <p
                style={{
                  ...SERIF,
                  fontSize: 15,
                  color: SECONDARY,
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
        <p
          style={{
            ...SERIF,
            fontSize: 17,
            color: SECONDARY,
            lineHeight: 1.5,
            margin: "0 0 17px",
          }}
        >
          {FOUNDATION_RETURN_TO_FUNDAMENTALS}
        </p>
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 17 }}>
          <div style={{ ...MONO, color: GOLD, marginBottom: 8 }}>
            SCOPE BOUNDARY
          </div>
          <p
            style={{
              ...SERIF,
              fontSize: 16,
              lineHeight: 1.5,
              color: SECONDARY,
              margin: 0,
            }}
          >
            {FOUNDATION_SCOPE_NOTE}
          </p>
        </div>
      </div>
    </div>
  );
}

function RecordSection({ label, text }: { label: string; text: string }) {
  return (
    <section style={{ padding: "0 4px" }}>
      <div style={{ ...MONO, color: GOLD, marginBottom: 9 }}>{label}</div>
      <p
        style={{
          ...SERIF,
          fontSize: 19,
          lineHeight: 1.48,
          color: SECONDARY,
          margin: 0,
        }}
      >
        {text}
      </p>
    </section>
  );
}
