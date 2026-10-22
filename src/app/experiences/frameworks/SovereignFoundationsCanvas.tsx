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
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  ChevronRight,
  Clock3,
  Database,
  Eye,
  FileSearch,
  Headphones,
  MessageCircleQuestion,
  MessageSquare,
  Minus,
  Move,
  Plus,
  RotateCcw,
  Scale,
  ShieldCheck,
  UserRound,
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

const DEEP_DIVE_WIDTH = 900;
const DEEP_DIVE_HEIGHT = 520;

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

function deepDiveLayout(id: FoundationPrincipleId) {
  const node = FIELD_PRINCIPLES.find((item) => item.id === id);
  if (!node) {
    return {
      node: { x: CENTER_X, y: CENTER_Y },
      specimenX: CENTER_X - DEEP_DIVE_WIDTH / 2,
      specimenY: CENTER_Y - DEEP_DIVE_HEIGHT / 2,
      focusX: CENTER_X,
      focusY: CENTER_Y,
    };
  }

  const rawX =
    node.x < CENTER_X - 200
      ? node.x + 180
      : node.x > CENTER_X + 200
        ? node.x - DEEP_DIVE_WIDTH - 180
        : node.x - DEEP_DIVE_WIDTH / 2;
  const rawY =
    node.y < 430
      ? node.y + 150
      : node.y > 1170
        ? node.y - DEEP_DIVE_HEIGHT - 180
        : node.y - DEEP_DIVE_HEIGHT / 2;
  const specimenX = Math.max(
    180,
    Math.min(WORLD_WIDTH - DEEP_DIVE_WIDTH - 180, rawX),
  );
  const specimenY = Math.max(
    130,
    Math.min(WORLD_HEIGHT - DEEP_DIVE_HEIGHT - 190, rawY),
  );

  return {
    node,
    specimenX,
    specimenY,
    focusX: specimenX + DEEP_DIVE_WIDTH / 2,
    focusY: specimenY + DEEP_DIVE_HEIGHT / 2 + 42,
  };
}

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
        const layout = deepDiveLayout(id);
        camera.focusPoint(
          { x: layout.focusX, y: layout.focusY },
          {
            scale: 0.88,
            anchorX: 0.5,
            anchorY:
              layout.node.y < 430
                ? 0.62
                : layout.node.y > 1170
                  ? 0.36
                  : 0.49,
          },
        );
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
              {selected
                ? `PRINCIPLE ${selected.id} · DRAG TO KEEP EXPLORING`
                : "DRAG TO EXPLORE · SCROLL TO ZOOM · SELECT A PRINCIPLE"}
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
              <SpatialDiveHud
                key={selected.id}
                selectedId={selected.id}
                onSelect={selectPrinciple}
                onBack={returnToField}
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

          {selected && (
            <SpatialPrincipleDeepDive
              key={selected.id}
              principle={selected}
              layout={deepDiveLayout(selected.id)}
              selectedHeadingRef={selectedHeadingRef}
            />
          )}

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
      .sux-foundation-root .foundation-spatial-heading:focus{outline:none}
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
      .sux-foundation-root .foundation-world-specimen{animation:foundationSpecimenResolve 620ms 360ms cubic-bezier(.16,1,.3,1) both;transform-origin:50% 18%}
      @keyframes foundationSpecimenResolve{from{opacity:0;transform:translateY(22px) scale(.965);filter:blur(5px)}to{opacity:1;transform:none;filter:none}}
      .sux-foundation-root .foundation-dive-link{stroke-dashoffset:70;animation:foundationDiveLink 900ms 300ms cubic-bezier(.16,1,.3,1) both}
      @keyframes foundationDiveLink{from{opacity:0;stroke-dashoffset:70}to{opacity:1;stroke-dashoffset:0}}
      .sux-foundation-root .foundation-lab-stage{transition:border-color 220ms ease,background 220ms ease}
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
        .sux-foundation-root .foundation-spatial-trace,.sux-foundation-root .foundation-dive-link{display:none!important}
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

function SpatialDiveHud({
  selectedId,
  onSelect,
  onBack,
}: {
  selectedId: FoundationPrincipleId;
  onSelect: (id: FoundationPrincipleId) => void;
  onBack: () => void;
}) {
  return (
    <div
      data-spatial-control
      aria-label="Selected principle navigation"
      style={{
        position: "absolute",
        left: 18,
        top: 16,
        zIndex: 38,
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: 6,
        border: `1px solid ${BORDER}`,
        borderRadius: 999,
        background: "rgba(6,8,14,.86)",
        boxShadow: "0 12px 42px rgba(0,0,0,.32)",
        backdropFilter: "blur(10px)",
      }}
    >
      <button
        type="button"
        onClick={onBack}
        style={{
          ...controlButton,
          minHeight: 34,
          borderRadius: 999,
          padding: "0 13px",
        }}
      >
        <ArrowLeft size={13} /> RETURN
      </button>
      <div
        role="group"
        aria-label="Travel to another principle"
        style={{ display: "flex", gap: 3 }}
      >
        {FOUNDATION_PRINCIPLES.map((principle) => (
          <button
            key={principle.id}
            type="button"
            onClick={() => onSelect(principle.id)}
            aria-label={`Travel to principle ${principle.id}: ${principle.title}`}
            aria-current={principle.id === selectedId ? "true" : undefined}
            title={principle.title}
            style={{
              ...MONO,
              width: 28,
              height: 28,
              padding: 0,
              border:
                principle.id === selectedId
                  ? "1px solid rgba(232,200,109,.72)"
                  : "1px solid transparent",
              borderRadius: "50%",
              color: principle.id === selectedId ? "#FFF0BE" : MUTED,
              background:
                principle.id === selectedId
                  ? "rgba(232,200,109,.12)"
                  : "transparent",
              cursor: "pointer",
            }}
          >
            {principle.id}
          </button>
        ))}
      </div>
    </div>
  );
}

type DisclosureId = "original" | "belief" | "responsibility" | "agency";

function SpatialPrincipleDeepDive({
  principle,
  layout,
  selectedHeadingRef,
}: {
  principle: FoundationPrinciple;
  layout: ReturnType<typeof deepDiveLayout>;
  selectedHeadingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const [disclosure, setDisclosure] = useState<DisclosureId | null>(null);
  const specimenCenterX = layout.specimenX + DEEP_DIVE_WIDTH / 2;
  const specimenCenterY = layout.specimenY + DEEP_DIVE_HEIGHT / 2;
  const dx = specimenCenterX - layout.node.x;
  const dy = specimenCenterY - layout.node.y;
  const distance = Math.hypot(dx, dy) || 1;
  const startX = layout.node.x + (dx / distance) * 54;
  const startY = layout.node.y + (dy / distance) * 54;
  const targetX =
    Math.abs(dx) > Math.abs(dy)
      ? dx > 0
        ? layout.specimenX
        : layout.specimenX + DEEP_DIVE_WIDTH
      : Math.max(
          layout.specimenX + 80,
          Math.min(layout.specimenX + DEEP_DIVE_WIDTH - 80, layout.node.x),
        );
  const targetY =
    Math.abs(dx) > Math.abs(dy)
      ? Math.max(
          layout.specimenY + 70,
          Math.min(
            layout.specimenY + DEEP_DIVE_HEIGHT - 70,
            layout.node.y,
          ),
        )
      : dy > 0
        ? layout.specimenY
        : layout.specimenY + DEEP_DIVE_HEIGHT;
  const reflectionX = Math.min(
    WORLD_WIDTH - 290,
    layout.specimenX + DEEP_DIVE_WIDTH + 38,
  );
  const reflectionY = layout.specimenY + 170;

  const disclosures: Array<{
    id: DisclosureId;
    label: string;
    text: string;
    color: string;
  }> = [
    {
      id: "original",
      label: "Original principle",
      text: principle.originalPrinciple,
      color: MUTED,
    },
    {
      id: "belief",
      label: "Underlying belief",
      text: principle.belief,
      color: STELLAR_PALETTE.agentic,
    },
    {
      id: "responsibility",
      label: "Design responsibility",
      text: principle.designResponsibility,
      color: PURPOSE,
    },
    {
      id: "agency",
      label: "Preserved agency",
      text: principle.preservedAgency,
      color: STELLAR_PALETTE.relational,
    },
  ];
  const activeDisclosure = disclosures.find((item) => item.id === disclosure);

  return (
    <section
      aria-label={`Spatial deep dive for principle ${principle.id}: ${principle.title}`}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 24,
        pointerEvents: "none",
      }}
    >
      <svg
        aria-hidden="true"
        width={WORLD_WIDTH}
        height={WORLD_HEIGHT}
        style={{
          position: "absolute",
          inset: 0,
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <defs>
          <linearGradient
            id={`foundation-dive-link-${principle.id}`}
            x1={startX}
            y1={startY}
            x2={targetX}
            y2={targetY}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={PURPOSE} stopOpacity=".88" />
            <stop offset="100%" stopColor={STELLAR_PALETTE.agentic} stopOpacity=".28" />
          </linearGradient>
        </defs>
        <path
          d={`M ${startX} ${startY} Q ${(startX + targetX) / 2} ${(startY + targetY) / 2 - 74} ${targetX} ${targetY}`}
          fill="none"
          stroke={`url(#foundation-dive-link-${principle.id})`}
          strokeWidth="1.4"
          strokeDasharray="4 8"
          vectorEffect="non-scaling-stroke"
          className="foundation-dive-link"
        />
        <circle
          cx={targetX}
          cy={targetY}
          r="9"
          fill={STELLAR_PALETTE.agentic}
          opacity=".78"
        />
        <ellipse
          cx={specimenCenterX}
          cy={specimenCenterY}
          rx={DEEP_DIVE_WIDTH / 2 + 46}
          ry={DEEP_DIVE_HEIGHT / 2 + 34}
          fill="none"
          stroke={STELLAR_PALETTE.agentic}
          strokeOpacity=".12"
          strokeWidth="1"
          strokeDasharray="2 14"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: layout.node.x,
          top:
            layout.node.y < specimenCenterY
              ? layout.node.y - 94
              : layout.node.y + 92,
          width: 360,
          transform: "translateX(-50%)",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            ...MONO,
            color: PURPOSE,
            fontSize: 9,
            marginBottom: 7,
          }}
        >
          PRINCIPLE {principle.id} · SPATIAL ANCHOR
        </div>
        <h2
          ref={selectedHeadingRef}
          className="foundation-spatial-heading"
          tabIndex={-1}
          style={{
            ...SERIF,
            color: IVORY,
            fontSize: 30,
            fontWeight: 400,
            lineHeight: 1.05,
            margin: 0,
            textWrap: "balance",
            textShadow: "0 4px 20px #04060B",
          }}
        >
          {principle.title}
        </h2>
      </div>

      <div
        data-spatial-control
        className="foundation-world-specimen"
        style={{
          position: "absolute",
          left: layout.specimenX,
          top: layout.specimenY,
          width: DEEP_DIVE_WIDTH,
          minHeight: DEEP_DIVE_HEIGHT,
          pointerEvents: "auto",
          filter: "drop-shadow(0 30px 70px rgba(0,0,0,.52))",
        }}
      >
        <EvidenceLab principle={principle} />
      </div>

      <aside
        aria-label="Contextual reflection"
        style={{
          position: "absolute",
          left: reflectionX,
          top: reflectionY,
          width: 250,
          minHeight: 180,
          padding: "22px 21px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          border: "1px solid rgba(166,139,212,.32)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(166,139,212,.11),rgba(7,9,15,.94) 70%)",
          boxShadow: "0 0 50px rgba(166,139,212,.08)",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            ...MONO,
            color: STELLAR_PALETTE.relational,
            fontSize: 8,
            marginBottom: 11,
          }}
        >
          REFLECTION IN CONTEXT
        </div>
        <div
          style={{
            ...SERIF,
            color: SECONDARY,
            fontSize: 17,
            lineHeight: 1.35,
          }}
        >
          {reflectionPrompt(principle.id)}
        </div>
      </aside>

      <div
        data-spatial-control
        role="group"
        aria-label="Reveal principle context"
        style={{
          position: "absolute",
          left: layout.specimenX + 30,
          top: layout.specimenY + DEEP_DIVE_HEIGHT + 28,
          display: "flex",
          alignItems: "center",
          gap: 9,
          pointerEvents: "auto",
        }}
      >
        {disclosures.map((item) => {
          const active = disclosure === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-expanded={active}
              onClick={() => setDisclosure(active ? null : item.id)}
              style={{
                ...MONO,
                minHeight: 38,
                padding: "0 13px",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: active
                  ? `1px solid ${item.color}`
                  : `1px solid ${BORDER}`,
                borderRadius: 999,
                background: active
                  ? "rgba(12,15,24,.96)"
                  : "rgba(7,9,15,.82)",
                color: active ? item.color : MUTED,
                cursor: "pointer",
                boxShadow: active ? `0 0 24px ${item.color}18` : "none",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: item.color,
                }}
              />
              {item.label.toUpperCase()}
            </button>
          );
        })}
      </div>

      {activeDisclosure && (
        <div
          data-spatial-control
          role="region"
          aria-live="polite"
          style={{
            position: "absolute",
            left: layout.specimenX + 120,
            top: layout.specimenY + DEEP_DIVE_HEIGHT + 82,
            zIndex: 32,
            width: 590,
            padding: "17px 19px",
            border: `1px solid ${activeDisclosure.color}55`,
            background: "rgba(7,9,15,.97)",
            boxShadow: "0 22px 60px rgba(0,0,0,.5)",
            pointerEvents: "auto",
          }}
        >
          <div
            style={{
              ...MONO,
              color: activeDisclosure.color,
              fontSize: 8,
              marginBottom: 8,
            }}
          >
            {activeDisclosure.label.toUpperCase()}
          </div>
          <p
            style={{
              ...SERIF,
              color: IVORY,
              fontSize: 17,
              lineHeight: 1.42,
              margin: 0,
            }}
          >
            {activeDisclosure.text}
          </p>
        </div>
      )}
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
    return <SubscriptionUpgradeEvidenceLab />;
  }
  if (principle.id === "03") {
    return <SupportAttunementEvidenceLab />;
  }
  if (principle.id === "09") {
    return <InterpretationEvidenceLab />;
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

function SubscriptionUpgradeEvidenceLab() {
  const [mode, setMode] = useState<"pressure" | "informed">("pressure")
  const [billing, setBilling] = useState<"monthly" | "annual">("annual")
  const [result, setResult] = useState("")

  const changeMode = (next: "pressure" | "informed") => {
    setMode(next)
    setBilling("annual")
    setResult("")
  }
  const annual = billing === "annual"

  return (
    <section
      aria-label="Interactive SaaS subscription upgrade offer"
      style={{
        overflow: "hidden",
        minHeight: 492,
        border: "1px solid rgba(138,174,200,.25)",
        borderRadius: 16,
        background: "#F4F6FA",
        color: "#182133",
        boxShadow: "0 26px 70px rgba(0,0,0,.36)",
      }}
    >
      <header
        style={{
          height: 58,
          padding: "0 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          borderBottom: "1px solid #DCE2EA",
          background: "#FFFFFF",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div
            aria-hidden="true"
            style={{
              width: 29,
              height: 29,
              display: "grid",
              placeItems: "center",
              borderRadius: 8,
              background: "#3559E8",
              color: "#FFFFFF",
              fontFamily: "Inter,sans-serif",
              fontWeight: 700,
            }}
          >
            N
          </div>
          <div>
            <div
              style={{
                fontFamily: "Inter,sans-serif",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Northstar Workspace
            </div>
            <div
              style={{
                fontFamily: "Inter,sans-serif",
                fontSize: 10,
                color: "#6B7486",
              }}
            >
              Billing and plans
            </div>
          </div>
        </div>
        <div
          role="group"
          aria-label="Offer architecture"
          style={{
            display: "flex",
            gap: 3,
            padding: 3,
            borderRadius: 9,
            background: "#EEF1F6",
          }}
        >
          <button
            type="button"
            aria-pressed={mode === "pressure"}
            onClick={() => changeMode("pressure")}
            style={{
              minHeight: 30,
              padding: "0 11px",
              border: 0,
              borderRadius: 7,
              background: mode === "pressure" ? "#FFFFFF" : "transparent",
              color: mode === "pressure" ? "#B24842" : "#697386",
              boxShadow:
                mode === "pressure" ? "0 1px 4px rgba(20,28,45,.12)" : "none",
              fontFamily: "Inter,sans-serif",
              fontSize: 10,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Pressure offer
          </button>
          <button
            type="button"
            aria-pressed={mode === "informed"}
            onClick={() => changeMode("informed")}
            style={{
              minHeight: 30,
              padding: "0 11px",
              border: 0,
              borderRadius: 7,
              background: mode === "informed" ? "#FFFFFF" : "transparent",
              color: mode === "informed" ? "#244BBE" : "#697386",
              boxShadow:
                mode === "informed" ? "0 1px 4px rgba(20,28,45,.12)" : "none",
              fontFamily: "Inter,sans-serif",
              fontSize: 10,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Informed choice
          </button>
        </div>
      </header>

      <div
        style={{
          minHeight: 382,
          display: "grid",
          gridTemplateColumns: "238px minmax(0,1fr)",
        }}
      >
        <aside
          style={{
            padding: 20,
            borderRight: "1px solid #DCE2EA",
            background: "#F9FAFC",
          }}
        >
          <div
            style={{
              fontFamily: "Inter,sans-serif",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: ".08em",
              color: "#687286",
              marginBottom: 12,
            }}
          >
            CURRENT PLAN
          </div>
          <div
            style={{
              padding: 15,
              border: "1px solid #D7DDE6",
              borderRadius: 11,
              background: "#FFFFFF",
            }}
          >
            <div
              style={{
                fontFamily: "Inter,sans-serif",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              Starter
            </div>
            <div style={{ margin: "7px 0 13px" }}>
              <span
                style={{
                  fontFamily: "Inter,sans-serif",
                  fontSize: 27,
                  fontWeight: 750,
                }}
              >
                $12
              </span>
              <span
                style={{
                  fontFamily: "Inter,sans-serif",
                  fontSize: 11,
                  color: "#6B7486",
                }}
              >
                {" "}
                / month
              </span>
            </div>
            {["3 team members", "5 active projects", "Email support"].map(
              (item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    gap: 7,
                    alignItems: "center",
                    marginTop: 8,
                    fontFamily: "Inter,sans-serif",
                    fontSize: 11,
                    color: "#566174",
                  }}
                >
                  <Check size={12} color="#4A67C7" /> {item}
                </div>
              ),
            )}
          </div>
          <div
            style={{
              marginTop: 13,
              fontFamily: "Inter,sans-serif",
              fontSize: 10,
              lineHeight: 1.45,
              color: "#70798B",
            }}
          >
            Renews monthly. Keeping Starter makes no account changes.
          </div>
        </aside>

        <main style={{ padding: "20px 22px 16px" }}>
          {mode === "pressure" ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 18,
                  marginBottom: 13,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 8,
                      padding: "5px 8px",
                      borderRadius: 999,
                      background: "#FCE7E5",
                      color: "#A13D36",
                      fontFamily: "Inter,sans-serif",
                      fontSize: 9,
                      fontWeight: 750,
                    }}
                  >
                    <Clock3 size={11} /> OFFER ENDS IN 01:59
                  </div>
                  <div
                    style={{
                      fontFamily: "Inter,sans-serif",
                      fontSize: 22,
                      fontWeight: 760,
                    }}
                  >
                    Don’t let your team fall behind
                  </div>
                  <div
                    style={{
                      marginTop: 5,
                      fontFamily: "Inter,sans-serif",
                      fontSize: 12,
                      color: "#626D80",
                    }}
                  >
                    Upgrade to Pro before this page closes.
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontFamily: "Inter,sans-serif",
                      fontSize: 27,
                      fontWeight: 780,
                    }}
                  >
                    $290
                  </div>
                  <div
                    style={{
                      fontFamily: "Inter,sans-serif",
                      fontSize: 10,
                      color: "#6B7486",
                    }}
                  >
                    charged today · annual
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 7,
                  marginBottom: 15,
                }}
              >
                {[
                  "Unlimited projects",
                  "20 team members",
                  "Priority support",
                  "Advanced exports",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "8px 9px",
                      borderRadius: 7,
                      background: "#F3F5F9",
                      fontFamily: "Inter,sans-serif",
                      fontSize: 10,
                      color: "#4D586B",
                    }}
                  >
                    <Check size={11} color="#3559E8" /> {item}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setResult(
                    "Annual Pro was purchased for $290 today. The interface emphasized urgency instead of comparison.",
                  )
                }
                style={{
                  width: "100%",
                  minHeight: 45,
                  border: 0,
                  borderRadius: 8,
                  background: "#D84D45",
                  color: "#FFFFFF",
                  fontFamily: "Inter,sans-serif",
                  fontSize: 13,
                  fontWeight: 750,
                  cursor: "pointer",
                }}
              >
                Upgrade now — pay $290 today
              </button>
              <button
                type="button"
                onClick={() =>
                  setResult(
                    "Starter was kept, but the decline path used loss-framed language and weaker visual emphasis.",
                  )
                }
                style={{
                  width: "100%",
                  marginTop: 9,
                  padding: 4,
                  border: 0,
                  background: "transparent",
                  color: "#8A909C",
                  fontFamily: "Inter,sans-serif",
                  fontSize: 9.5,
                  cursor: "pointer",
                }}
              >
                No thanks, keep my team limited
              </button>
            </>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 18,
                  marginBottom: 13,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "Inter,sans-serif",
                      fontSize: 21,
                      fontWeight: 760,
                    }}
                  >
                    Compare Pro before changing
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontFamily: "Inter,sans-serif",
                      fontSize: 11,
                      color: "#626D80",
                    }}
                  >
                    Your Starter plan remains active unless you confirm.
                  </div>
                </div>
                <div
                  role="group"
                  aria-label="Billing cadence"
                  style={{
                    display: "flex",
                    padding: 3,
                    borderRadius: 8,
                    background: "#E9EDF4",
                  }}
                >
                  {(["monthly", "annual"] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={billing === item}
                      onClick={() => {
                        setBilling(item)
                        setResult("")
                      }}
                      style={{
                        minHeight: 29,
                        padding: "0 10px",
                        border: 0,
                        borderRadius: 6,
                        background:
                          billing === item ? "#FFFFFF" : "transparent",
                        color: billing === item ? "#2747A8" : "#677286",
                        boxShadow:
                          billing === item
                            ? "0 1px 4px rgba(20,28,45,.12)"
                            : "none",
                        fontFamily: "Inter,sans-serif",
                        fontSize: 9,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {item.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 9,
                  marginBottom: 13,
                }}
              >
                <PlanFact
                  label="PRICE"
                  value={annual ? "$290 / year" : "$29 / month"}
                />
                <PlanFact
                  label="CHARGE"
                  value={annual ? "$290 today" : "$29 today"}
                />
                <PlanFact
                  label="RENEWS"
                  value={annual ? "Annually" : "Monthly"}
                />
                <PlanFact label="CURRENT PLAN" value="Unchanged if declined" />
              </div>
              <div
                style={{
                  padding: "9px 11px",
                  marginBottom: 13,
                  borderLeft: "3px solid #3559E8",
                  background: "#EEF3FF",
                  fontFamily: "Inter,sans-serif",
                  fontSize: 10.5,
                  lineHeight: 1.4,
                  color: "#465268",
                }}
              >
                Adds unlimited projects, 20 members, advanced exports, and
                priority support. Existing projects are unaffected.
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 9,
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setResult(
                      `Pro review opened with the ${billing} price, charge, renewal, and account consequence visible.`,
                    )
                  }
                  style={{
                    minHeight: 43,
                    border: 0,
                    borderRadius: 8,
                    background: "#3559E8",
                    color: "#FFFFFF",
                    fontFamily: "Inter,sans-serif",
                    fontSize: 12,
                    fontWeight: 750,
                    cursor: "pointer",
                  }}
                >
                  Review Pro change
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setResult(
                      "Starter remains active. Declining produces no penalty or degraded account state.",
                    )
                  }
                  style={{
                    minHeight: 43,
                    border: "1px solid #BAC3D1",
                    borderRadius: 8,
                    background: "#FFFFFF",
                    color: "#344054",
                    fontFamily: "Inter,sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Keep Starter
                </button>
              </div>
            </>
          )}
        </main>
      </div>
      <div
        role="status"
        aria-live="polite"
        style={{
          minHeight: 51,
          padding: "10px 18px",
          display: "flex",
          alignItems: "center",
          gap: 9,
          borderTop: "1px solid #DCE2EA",
          background: result ? "#EEF7F2" : "#FFFFFF",
          color: result ? "#265E44" : "#737D8F",
          fontFamily: "Inter,sans-serif",
          fontSize: 10.5,
          lineHeight: 1.35,
        }}
      >
        {result ? <Check size={14} /> : <ShieldCheck size={14} />}
        {result ||
          (mode === "pressure"
            ? "Notice which information is prominent—and which choice is visually diminished."
            : "Price, timing, renewal, consequences, and decline are available before commitment.")}
      </div>
    </section>
  )
}

type LabelValueProps = {
  label: string
  value: string
}

function PlanFact({ label, value }: LabelValueProps) {
  return (
    <div
      style={{
        padding: "9px 10px",
        border: "1px solid #DCE2EA",
        borderRadius: 8,
        background: "#FFFFFF",
      }}
    >
      <div
        style={{
          fontFamily: "Inter,sans-serif",
          fontSize: 8,
          fontWeight: 750,
          letterSpacing: ".08em",
          color: "#7B8494",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "Inter,sans-serif",
          fontSize: 11,
          fontWeight: 650,
          color: "#273142",
        }}
      >
        {value}
      </div>
    </div>
  )
}

type SupportApproach = "fast" | "attuned" | null

function SupportAttunementEvidenceLab() {
  const [approach, setApproach] = useState<SupportApproach>(null)
  const [result, setResult] = useState("")

  const chooseApproach = (next: Exclude<SupportApproach, null>) => {
    setApproach(next)
    setResult("")
  }

  return (
    <section
      aria-label="Interactive customer support conversation"
      style={{
        overflow: "hidden",
        minHeight: 492,
        border: "1px solid rgba(124,180,213,.28)",
        borderRadius: 15,
        background: "#0D1520",
        color: "#EAF1F7",
        boxShadow: "0 26px 70px rgba(0,0,0,.42)",
      }}
    >
      <header
        style={{
          height: 56,
          padding: "0 17px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #223141",
          background: "#101B28",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 31,
              height: 31,
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              background: "#18344A",
              color: "#83C6E7",
            }}
          >
            <Headphones size={16} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "Inter,sans-serif",
                fontSize: 12.5,
                fontWeight: 700,
              }}
            >
              Support thread #4821
            </div>
            <div
              style={{
                fontFamily: "Inter,sans-serif",
                fontSize: 9.5,
                color: "#8CA0B2",
              }}
            >
              Upload failure · open
            </div>
          </div>
        </div>
        <div
          style={{
            padding: "5px 8px",
            borderRadius: 999,
            background: "#2C2518",
            color: "#E7C477",
            fontFamily: "Inter,sans-serif",
            fontSize: 9,
          }}
        >
          DEADLINE PROVIDED: TODAY
        </div>
      </header>

      <div
        style={{
          minHeight: 385,
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 230px",
        }}
      >
        <main
          style={{
            padding: "17px 18px 14px",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #223141",
            background: "#0B131D",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 9,
              marginBottom: 13,
            }}
          >
            <div
              style={{
                width: 27,
                height: 27,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                borderRadius: "50%",
                background: "#263245",
                color: "#CBD7E5",
              }}
            >
              <UserRound size={14} />
            </div>
            <div
              style={{
                maxWidth: 460,
                padding: "11px 13px",
                borderRadius: "5px 13px 13px 13px",
                background: "#182433",
                fontFamily: "Inter,sans-serif",
                fontSize: 11.5,
                lineHeight: 1.45,
                color: "#D8E2EC",
              }}
            >
              I’ve tried uploading the invoice three times. It fails with X14,
              and I need to send it today. I don’t want to repeat the same steps
              again.
            </div>
          </div>

          {approach && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 9,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  maxWidth: 500,
                  padding: "11px 13px",
                  borderRadius: "13px 5px 13px 13px",
                  background: approach === "fast" ? "#2A2430" : "#123044",
                  border:
                    approach === "fast"
                      ? "1px solid #493546"
                      : "1px solid #22506B",
                  fontFamily: "Inter,sans-serif",
                  fontSize: 11.5,
                  lineHeight: 1.45,
                  color: "#E8EEF5",
                }}
              >
                {approach === "fast" ? (
                  <>
                    Clear your browser cache and try the upload again. I’ve
                    marked this as resolved.
                  </>
                ) : (
                  <>
                    I can see the three X14 failures in this thread. Let’s avoid
                    another repeat. You can send the invoice through the secure
                    email route, or I can connect you with a specialist.
                  </>
                )}
              </div>
              <div
                style={{
                  width: 27,
                  height: 27,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  borderRadius: "50%",
                  background: "#17364B",
                  color: "#8DCDEB",
                }}
              >
                <Headphones size={14} />
              </div>
            </div>
          )}

          <div style={{ marginTop: "auto" }}>
            {!approach ? (
              <>
                <div
                  style={{
                    fontFamily: "Inter,sans-serif",
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#8EA2B5",
                    marginBottom: 8,
                  }}
                >
                  CHOOSE THE SUPPORT RESPONSE
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => chooseApproach("fast")}
                    style={{
                      minHeight: 54,
                      padding: "9px 11px",
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      textAlign: "left",
                      border: "1px solid #4A3848",
                      borderRadius: 9,
                      background: "#241E28",
                      color: "#E5D7E2",
                      fontFamily: "Inter,sans-serif",
                      fontSize: 10.5,
                      lineHeight: 1.3,
                      cursor: "pointer",
                    }}
                  >
                    <Clock3 size={16} color="#D99588" />
                    Resolve quickly and close the ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => chooseApproach("attuned")}
                    style={{
                      minHeight: 54,
                      padding: "9px 11px",
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      textAlign: "left",
                      border: "1px solid #285772",
                      borderRadius: 9,
                      background: "#102A3B",
                      color: "#D8ECF6",
                      fontFamily: "Inter,sans-serif",
                      fontSize: 10.5,
                      lineHeight: 1.3,
                      cursor: "pointer",
                    }}
                  >
                    <MessageSquare size={16} color="#82C4E5" />
                    Acknowledge the record, then offer useful paths
                  </button>
                </div>
              </>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    approach === "fast" ? "1fr 1fr" : "repeat(3,1fr)",
                  gap: 7,
                }}
              >
                {approach === "fast" ? (
                  <>
                    <SupportAction
                      label="Try the same steps"
                      onClick={() =>
                        setResult(
                          "The response was fast, but it ignored the three recorded failures and repeated an already rejected path.",
                        )
                      }
                    />
                    <SupportAction
                      label="Reopen the ticket"
                      onClick={() =>
                        setResult(
                          "The person had to restore the support context after the system closed it prematurely.",
                        )
                      }
                    />
                  </>
                ) : (
                  <>
                    <SupportAction
                      label="Use secure email"
                      onClick={() =>
                        setResult(
                          "A different route is available without requiring another failed upload.",
                        )
                      }
                    />
                    <SupportAction
                      label="Connect specialist"
                      onClick={() =>
                        setResult(
                          "The person can move to human support with the existing failure context preserved.",
                        )
                      }
                    />
                    <SupportAction
                      label="Pause"
                      onClick={() =>
                        setResult(
                          "The interaction preserves the option to pause without closing the issue.",
                        )
                      }
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </main>

        <aside style={{ padding: 16, background: "#101B28" }}>
          <div
            style={{
              fontFamily: "Inter,sans-serif",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: ".08em",
              color: "#8FA4B7",
              marginBottom: 12,
            }}
          >
            THREAD CONTEXT
          </div>
          <ContextFact label="RECORDED ATTEMPTS" value="3 failed uploads" />
          <ContextFact label="SYSTEM MESSAGE" value="Error X14" />
          <ContextFact label="PERSON STATED" value="Deadline is today" />
          <ContextFact
            label="BOUNDARY"
            value="No inference about emotional state"
          />
          {approach && (
            <button
              type="button"
              onClick={() => {
                setApproach(null)
                setResult("")
              }}
              style={{
                width: "100%",
                minHeight: 36,
                marginTop: 10,
                border: "1px solid #304459",
                borderRadius: 8,
                background: "transparent",
                color: "#9FB4C6",
                fontFamily: "Inter,sans-serif",
                fontSize: 9.5,
                cursor: "pointer",
              }}
            >
              Try another response
            </button>
          )}
        </aside>
      </div>
      <div
        role="status"
        aria-live="polite"
        style={{
          minHeight: 51,
          padding: "10px 17px",
          display: "flex",
          alignItems: "center",
          gap: 9,
          borderTop: "1px solid #223141",
          background: result ? "#102B27" : "#0F1925",
          color: result ? "#A9DCC8" : "#8499AC",
          fontFamily: "Inter,sans-serif",
          fontSize: 10.5,
          lineHeight: 1.35,
        }}
      >
        {result ? <Check size={14} /> : <MessageSquare size={14} />}
        {result ||
          "Attunement uses expressed context and interaction history—not simulated emotional diagnosis."}
      </div>
    </section>
  )
}

function SupportAction({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minHeight: 38,
        border: "1px solid #31506A",
        borderRadius: 8,
        background: "#122638",
        color: "#D5E5EF",
        fontFamily: "Inter,sans-serif",
        fontSize: 9.5,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  )
}

function ContextFact({ label, value }: LabelValueProps) {
  return (
    <div
      style={{
        padding: "10px 0",
        borderBottom: "1px solid #263647",
      }}
    >
      <div
        style={{
          fontFamily: "Inter,sans-serif",
          fontSize: 7.5,
          fontWeight: 700,
          color: "#71879A",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "Inter,sans-serif",
          fontSize: 10.5,
          lineHeight: 1.35,
          color: "#CBD8E4",
        }}
      >
        {value}
      </div>
    </div>
  )
}

const INTERPRETATION_SOURCES = [
  {
    id: "session-a",
    label: "Session A",
    summary: "Switched billing views twice, then left the pricing page.",
  },
  {
    id: "session-b",
    label: "Session B",
    summary: "Opened the plan guide, returned later, and upgraded.",
  },
  {
    id: "session-c",
    label: "Session C",
    summary: "Reached payment, received an error, and closed the app.",
  },
  {
    id: "support-note",
    label: "Support note",
    summary: "Asked whether a team administrator must approve upgrades.",
  },
] as const

function InterpretationEvidenceLab() {
  const [layersVisible, setLayersVisible] = useState(false)
  const [challenged, setChallenged] = useState(false)
  const [activeSource, setActiveSource] = useState(INTERPRETATION_SOURCES[0].id)
  const [result, setResult] = useState("")
  const source =
    INTERPRETATION_SOURCES.find((item) => item.id === activeSource) ??
    INTERPRETATION_SOURCES[0]

  return (
    <section
      aria-label="Interactive AI-generated analysis dashboard"
      style={{
        overflow: "hidden",
        minHeight: 492,
        border: "1px solid rgba(196,174,221,.28)",
        borderRadius: 14,
        background: "#F6F4F1",
        color: "#25232A",
        boxShadow: "0 26px 70px rgba(0,0,0,.36)",
      }}
    >
      <header
        style={{
          height: 58,
          padding: "0 17px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #D8D3CE",
          background: "#23212A",
          color: "#F7F3ED",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Bot size={18} color="#C5A9DF" />
          <div>
            <div
              style={{
                fontFamily: "Inter,sans-serif",
                fontSize: 12.5,
                fontWeight: 700,
              }}
            >
              Atlas Insights
            </div>
            <div
              style={{
                fontFamily: "Inter,sans-serif",
                fontSize: 9,
                color: "#ACA5B5",
              }}
            >
              Illustrative AI analysis · not a research finding
            </div>
          </div>
        </div>
        <button
          type="button"
          aria-pressed={layersVisible}
          onClick={() => {
            setLayersVisible((value) => !value)
            setResult("")
          }}
          style={{
            minHeight: 33,
            padding: "0 11px",
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            border: "1px solid #5B5265",
            borderRadius: 8,
            background: layersVisible ? "#43384E" : "transparent",
            color: "#E8DDF0",
            fontFamily: "Inter,sans-serif",
            fontSize: 9.5,
            cursor: "pointer",
          }}
        >
          <FileSearch size={13} />
          {layersVisible ? "Hide evidence layers" : "Inspect evidence layers"}
        </button>
      </header>

      <div
        style={{
          minHeight: 383,
          display: "grid",
          gridTemplateColumns: "270px minmax(0,1fr)",
        }}
      >
        <aside
          style={{
            padding: 14,
            borderRight: "1px solid #D8D3CE",
            background: "#ECE8E3",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
              fontFamily: "Inter,sans-serif",
              fontSize: 9,
              fontWeight: 750,
              letterSpacing: ".07em",
              color: "#6D6672",
            }}
          >
            <Database size={13} /> SOURCE RECORDS
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            {INTERPRETATION_SOURCES.map((item) => {
              const active = item.id === activeSource
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setActiveSource(item.id)
                    setResult(`Opened ${item.label}: ${item.summary}`)
                  }}
                  style={{
                    minHeight: 55,
                    padding: "9px 10px",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: 8,
                    textAlign: "left",
                    border: active ? "1px solid #83708E" : "1px solid #D4CFC9",
                    borderRadius: 8,
                    background: active ? "#FFFFFF" : "#F4F1ED",
                    color: "#312D35",
                    cursor: "pointer",
                  }}
                >
                  <Eye size={13} color={active ? "#7B5D89" : "#8C8790"} />
                  <span>
                    <span
                      style={{
                        display: "block",
                        fontFamily: "Inter,sans-serif",
                        fontSize: 10,
                        fontWeight: 750,
                        marginBottom: 3,
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        display: "block",
                        fontFamily: "Inter,sans-serif",
                        fontSize: 8.5,
                        lineHeight: 1.28,
                        color: "#716B76",
                      }}
                    >
                      {item.summary}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </aside>

        <main style={{ padding: "16px 18px 14px" }}>
          <div
            style={{
              marginBottom: 10,
              fontFamily: "Inter,sans-serif",
              fontSize: 8.5,
              fontWeight: 750,
              letterSpacing: ".08em",
              color: "#7A727E",
            }}
          >
            AI-GENERATED ANALYSIS
          </div>
          <div
            style={{
              padding: "14px 15px",
              border: challenged ? "1px solid #9A7B58" : "1px solid #C6B8CD",
              borderRadius: 10,
              background: challenged ? "#FFF8EC" : "#FFFFFF",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginBottom: 7,
                fontFamily: "Inter,sans-serif",
                fontSize: 9,
                fontWeight: 750,
                color: challenged ? "#8A5E2F" : "#744F83",
              }}
            >
              {challenged ? <AlertTriangle size={13} /> : <Bot size={13} />}
              {challenged ? "INTERPRETATION UNDER REVIEW" : "SYSTEM FINDING"}
            </div>
            <div
              style={{
                fontFamily: "Inter,sans-serif",
                fontSize: 21,
                fontWeight: 730,
                lineHeight: 1.18,
                color: "#28232C",
              }}
            >
              Pricing confusion caused checkout abandonment.
            </div>
          </div>

          {layersVisible ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 7,
                marginTop: 9,
              }}
            >
              <AnalysisLayer
                label="OBSERVATIONS"
                text="Billing views changed; help content opened; one payment error occurred; one approval question was recorded."
                color="#466F72"
              />
              <AnalysisLayer
                label="INTERPRETATION"
                text="The system links those actions to pricing confusion and abandonment."
                color="#744F83"
              />
              <AnalysisLayer
                label="ASSUMPTIONS"
                text="Leaving means abandoning; comparison means confusion; all records describe the same cause."
                color="#A06A3E"
              />
              <AnalysisLayer
                label="UNCERTAINTY"
                text="Intent, organizational approval, and the effect of the payment error remain unknown."
                color="#647184"
              />
            </div>
          ) : (
            <div
              style={{
                marginTop: 10,
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                gap: 9,
                borderRadius: 8,
                background: "#EAE5EC",
                color: "#6B6170",
                fontFamily: "Inter,sans-serif",
                fontSize: 10,
              }}
            >
              <AlertTriangle size={14} />
              Observation, interpretation, assumption, and uncertainty are
              collapsed into one claim.
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 9,
              marginTop: 10,
            }}
          >
            <div
              style={{
                minHeight: 47,
                padding: "9px 11px",
                border: "1px solid #D5D0CA",
                borderRadius: 8,
                background: "#F1EEEA",
                fontFamily: "Inter,sans-serif",
                fontSize: 9.5,
                lineHeight: 1.35,
                color: "#625D65",
              }}
            >
              <strong style={{ color: "#37323A" }}>{source.label}:</strong>{" "}
              {source.summary}
            </div>
            <button
              type="button"
              onClick={() => {
                setChallenged(true)
                setLayersVisible(true)
                setResult(
                  "The claim is now treated as a hypothesis. Payment failure, approval needs, and ordinary comparison remain plausible alternatives.",
                )
              }}
              style={{
                minWidth: 150,
                border: 0,
                borderRadius: 8,
                background: challenged ? "#7A6249" : "#6E4C7C",
                color: "#FFFFFF",
                fontFamily: "Inter,sans-serif",
                fontSize: 10.5,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {challenged
                ? "Interpretation challenged"
                : "Challenge interpretation"}
            </button>
          </div>
        </main>
      </div>
      <div
        role="status"
        aria-live="polite"
        style={{
          minHeight: 51,
          padding: "10px 17px",
          display: "flex",
          alignItems: "center",
          gap: 9,
          borderTop: "1px solid #D8D3CE",
          background: result ? "#EFE8F1" : "#F7F4F0",
          color: result ? "#5F4569" : "#756F78",
          fontFamily: "Inter,sans-serif",
          fontSize: 10.5,
          lineHeight: 1.35,
        }}
      >
        {result ? <Check size={14} /> : <FileSearch size={14} />}
        {result ||
          "Constructed example. Inspect the source records before treating the generated claim as fact."}
      </div>
    </section>
  )
}

function AnalysisLayer({
  label,
  text,
  color,
}: {
  label: string
  text: string
  color: string
}) {
  return (
    <div
      style={{
        minHeight: 68,
        padding: "9px 10px",
        border: `1px solid ${color}44`,
        borderRadius: 8,
        background: `${color}0D`,
      }}
    >
      <div
        style={{
          fontFamily: "Inter,sans-serif",
          fontSize: 7.5,
          fontWeight: 800,
          letterSpacing: ".07em",
          color,
          marginBottom: 5,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "Inter,sans-serif",
          fontSize: 9,
          lineHeight: 1.35,
          color: "#5D5761",
        }}
      >
        {text}
      </div>
    </div>
  )
}

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
