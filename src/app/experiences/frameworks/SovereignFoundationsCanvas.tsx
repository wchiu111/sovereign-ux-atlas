import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Bot,
  CalendarDays,
  Check,
  Clock3,
  Cloud,
  Database,
  Download,
  Eye,
  FileCheck2,
  FileSearch,
  FileText,
  Headphones,
  KeyRound,
  LockKeyhole,
  Mail,
  MessageCircleQuestion,
  MessageSquare,
  Minus,
  Move,
  Pause,
  Play,
  Plus,
  ReceiptText,
  RotateCcw,
  Scale,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import foundationsNebula from "@/assets/foundations-nebula.webp";
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

function clampAtmosphere(value: number, limit: number) {
  return Math.max(-limit, Math.min(limit, value));
}

function FoundationsNebulaBackground({
  camera,
  dimmed,
}: {
  camera: ReturnType<typeof useSpatialCamera>;
  dimmed: boolean;
}) {
  const parallaxX = clampAtmosphere(camera.view.x * 0.035, 72);
  const parallaxY = clampAtmosphere(camera.view.y * 0.035, 56);
  const zoomResponse = Math.max(
    1.06,
    Math.min(1.11, 1.075 + (camera.view.scale - 0.7) * 0.025),
  );
  const transition = camera.reducedMotion
    ? "none"
    : camera.cameraTransition === "none"
      ? "opacity 420ms ease,filter 420ms ease"
      : `${camera.cameraTransition},opacity 420ms ease,filter 420ms ease`;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: "-14%",
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        background: "#02050A",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${foundationsNebula})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          opacity: dimmed ? 0.24 : 0.42,
          filter: dimmed
            ? "saturate(.68) brightness(.58) contrast(1.08)"
            : "saturate(.82) brightness(.72) contrast(1.05)",
          transform: `translate3d(${parallaxX}px,${parallaxY}px,0) scale(${zoomResponse})`,
          transformOrigin: "50% 50%",
          transition,
          willChange: camera.reducedMotion ? undefined : "transform,opacity,filter",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: dimmed
            ? "radial-gradient(ellipse at 50% 48%,rgba(2,5,12,.9) 0%,rgba(2,5,12,.72) 34%,rgba(2,5,12,.52) 66%,rgba(2,5,12,.64) 100%)"
            : "radial-gradient(ellipse at 50% 48%,rgba(2,5,12,.78) 0%,rgba(2,5,12,.48) 34%,rgba(2,5,12,.18) 67%,rgba(2,5,12,.35) 100%)",
          transition: camera.reducedMotion ? "none" : "background 420ms ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg,rgba(2,4,10,.28),transparent 24%,transparent 70%,rgba(2,4,10,.44)),radial-gradient(ellipse at center,transparent 42%,rgba(1,3,8,.42) 100%)",
        }}
      />
    </div>
  );
}

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
        background: `radial-gradient(ellipse at center,rgba(2,5,12,.8) 0%,rgba(2,5,12,.58) 52%,rgba(2,5,12,.72) 100%),url(${foundationsNebula}) center / cover no-repeat,#04060B`,
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
          background="#02050A"
          backgroundLayer={
            <FoundationsNebulaBackground
              camera={camera}
              dimmed={Boolean(selectedId)}
            />
          }
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
        opacity:.24;
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
  if (id === "03") {
    return "Does the response acknowledge what the person has already experienced before proposing a solution?";
  }
  if (id === "10") {
    return "What changed: the available options, or the frame used to rank them?";
  }
  return FOUNDATION_REFLECTION_QUESTIONS[
    (Number(id) - 1) % FOUNDATION_REFLECTION_QUESTIONS.length
  ];
}

function EvidenceLab({ principle }: { principle: FoundationPrinciple }) {
  if (principle.id === "01") {
    return <SubmissionAwarenessEvidenceLab />;
  }
  if (principle.id === "02") {
    return <SubscriptionUpgradeEvidenceLab />;
  }
  if (principle.id === "03") {
    return <SupportAttunementEvidenceLab />;
  }
  if (principle.id === "04") {
    return <PresenceCheckpointEvidenceLab />;
  }
  if (principle.id === "05") {
    return <AccountRecoveryEvidenceLab />;
  }
  if (principle.id === "06") {
    return <ChoiceAmplificationEvidenceLab />;
  }
  if (principle.id === "07") {
    return <MeaningfulClosureEvidenceLab />;
  }
  if (principle.id === "08") {
    return <PrivacyIntegrityEvidenceLab />;
  }
  if (principle.id === "09") {
    return <InterpretationEvidenceLab />;
  }
  if (principle.id === "10") {
    return <DecisionFramingEvidenceLab />;
  }
  return null;
}

function SubmissionAwarenessEvidenceLab() {
  const [mode, setMode] = useState<"quick" | "aware">("quick");
  const [includeNotes, setIncludeNotes] = useState(true);
  const [result, setResult] = useState("");

  const changeMode = (next: "quick" | "aware") => {
    setMode(next);
    setResult("");
  };

  return (
    <section
      aria-label="Interactive submission and review interface"
      style={{
        minHeight: 492,
        overflow: "hidden",
        border: "1px solid rgba(135,157,184,.28)",
        borderRadius: 15,
        background: "#F5F7FA",
        color: "#1F2937",
        boxShadow: "0 26px 70px rgba(0,0,0,.38)",
      }}
    >
      <header
        style={{
          height: 56,
          padding: "0 17px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #D9E0E8",
          background: "#FFFFFF",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              display: "grid",
              placeItems: "center",
              borderRadius: 8,
              background: "#E8EEF8",
              color: "#355A91",
            }}
          >
            <FileText size={16} />
          </div>
          <div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12.5, fontWeight: 750 }}>
              Editorial submission
            </div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9.5, color: "#738095" }}>
              Draft saved · Review cycle 2
            </div>
          </div>
        </div>
        <div
          role="group"
          aria-label="Submission design"
          style={{ display: "flex", gap: 3, padding: 3, borderRadius: 9, background: "#EDF1F6" }}
        >
          {(["quick", "aware"] as const).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={mode === item}
              onClick={() => changeMode(item)}
              style={{
                minHeight: 30,
                padding: "0 11px",
                border: 0,
                borderRadius: 7,
                background: mode === item ? "#FFFFFF" : "transparent",
                color: mode === item ? (item === "quick" ? "#9D463F" : "#315C8F") : "#6D7889",
                boxShadow: mode === item ? "0 1px 4px rgba(20,28,45,.12)" : "none",
                fontFamily: "Inter,sans-serif",
                fontSize: 9.5,
                fontWeight: 750,
                cursor: "pointer",
              }}
            >
              {item === "quick" ? "Quick submit" : "Review context"}
            </button>
          ))}
        </div>
      </header>

      <div style={{ minHeight: 384, display: "grid", gridTemplateColumns: "minmax(0,1fr) 292px" }}>
        <main style={{ padding: "18px 20px", borderRight: "1px solid #D9E0E8" }}>
          <div
            style={{
              marginBottom: 13,
              fontFamily: "Inter,sans-serif",
              fontSize: 9,
              fontWeight: 750,
              letterSpacing: ".08em",
              color: "#758195",
            }}
          >
            MANUSCRIPT DETAILS
          </div>
          <div
            style={{
              padding: "15px 16px",
              border: "1px solid #D7DEE8",
              borderRadius: 10,
              background: "#FFFFFF",
            }}
          >
            <div style={{ fontFamily: "Georgia,serif", fontSize: 23, color: "#202B3B" }}>
              Designing for legible decisions
            </div>
            <div style={{ marginTop: 6, fontFamily: "Inter,sans-serif", fontSize: 10.5, color: "#6D7889" }}>
              Essay · 1,842 words · Updated 4 minutes ago
            </div>
            <div
              style={{
                marginTop: 16,
                padding: "12px 13px",
                borderLeft: "3px solid #8DA7C5",
                background: "#F4F7FB",
                fontFamily: "Georgia,serif",
                fontSize: 13,
                lineHeight: 1.5,
                color: "#4B586B",
              }}
            >
              The draft argues that recommendation systems should expose the
              frame shaping a decision before asking for commitment.
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginTop: 10 }}>
            <SubmissionFact label="DESTINATION" value="Design Review Board" />
            <SubmissionFact label="ACCESS" value="Editors and reviewers" />
            <SubmissionFact label="REVIEW WINDOW" value="Closes Friday" />
            <SubmissionFact label="VERSION" value="Locks this draft" />
          </div>
        </main>

        <aside style={{ padding: 17, background: mode === "quick" ? "#FFF9F8" : "#F5F9FD" }}>
          {mode === "quick" ? (
            <>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, fontWeight: 800, color: "#A14B44" }}>
                READY TO SEND
              </div>
              <div style={{ marginTop: 9, fontFamily: "Inter,sans-serif", fontSize: 22, fontWeight: 760 }}>
                Submit draft?
              </div>
              <p style={{ margin: "7px 0 20px", fontFamily: "Inter,sans-serif", fontSize: 11, lineHeight: 1.45, color: "#6E7683" }}>
                Your work is ready for the next step.
              </p>
              <button
                type="button"
                onClick={() =>
                  setResult(
                    "The draft was submitted and locked before the interface made recipients, timing, or visibility prominent.",
                  )
                }
                style={{
                  width: "100%",
                  minHeight: 45,
                  border: 0,
                  borderRadius: 8,
                  background: "#C9554D",
                  color: "#FFFFFF",
                  fontFamily: "Inter,sans-serif",
                  fontSize: 12,
                  fontWeight: 750,
                  cursor: "pointer",
                }}
              >
                Submit now
              </button>
              <div style={{ marginTop: 13, fontFamily: "Inter,sans-serif", fontSize: 8.5, lineHeight: 1.4, color: "#A0A5AE" }}>
                Submission locks this version and shares reviewer notes with
                the full board.
              </div>
            </>
          ) : (
            <>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, fontWeight: 800, color: "#315C8F" }}>
                BEFORE YOU SUBMIT
              </div>
              <div style={{ marginTop: 8, fontFamily: "Inter,sans-serif", fontSize: 18, fontWeight: 760 }}>
                Confirm the review context
              </div>
              <div style={{ display: "grid", gap: 7, marginTop: 13 }}>
                {[
                  ["Who receives it", "4 board reviewers"],
                  ["What changes", "This draft becomes read-only"],
                  ["What remains private", "Personal scratch notes"],
                ].map(([label, value]) => (
                  <div key={label} style={{ padding: "8px 9px", borderRadius: 7, background: "#FFFFFF", border: "1px solid #D6E0EA" }}>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 7.5, fontWeight: 800, color: "#7A8798" }}>
                      {label.toUpperCase()}
                    </div>
                    <div style={{ marginTop: 3, fontFamily: "Inter,sans-serif", fontSize: 10.5, color: "#344154" }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 10,
                  fontFamily: "Inter,sans-serif",
                  fontSize: 10,
                  color: "#445267",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={includeNotes}
                  onChange={(event) => {
                    setIncludeNotes(event.target.checked);
                    setResult("");
                  }}
                />
                Share reviewer notes with the board
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() =>
                    setResult(
                      `Submitted with recipients, locking behavior, and note visibility reviewed. Reviewer notes were ${includeNotes ? "included" : "kept private"}.`,
                    )
                  }
                  style={{
                    minHeight: 40,
                    border: 0,
                    borderRadius: 8,
                    background: "#315C8F",
                    color: "#FFFFFF",
                    fontFamily: "Inter,sans-serif",
                    fontSize: 10,
                    fontWeight: 750,
                    cursor: "pointer",
                  }}
                >
                  Confirm submit
                </button>
                <button
                  type="button"
                  onClick={() => setResult("The draft remains editable. No review invitation was sent.")}
                  style={{
                    minHeight: 40,
                    border: "1px solid #BFCBD8",
                    borderRadius: 8,
                    background: "#FFFFFF",
                    color: "#415069",
                    fontFamily: "Inter,sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Keep editing
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
      <ExhibitStatus
        result={result}
        idle={
          mode === "quick"
            ? "The action is prominent; its audience and consequences are visually deferred."
            : "Context appears before commitment, and the person can still revise or leave."
        }
        light
      />
    </section>
  );
}

function SubmissionFact({ label, value }: LabelValueProps) {
  return (
    <div style={{ padding: "9px 10px", border: "1px solid #D9E0E8", borderRadius: 8, background: "#F9FAFC" }}>
      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 7.5, fontWeight: 800, color: "#8290A2" }}>
        {label}
      </div>
      <div style={{ marginTop: 4, fontFamily: "Inter,sans-serif", fontSize: 10.5, color: "#39475B" }}>
        {value}
      </div>
    </div>
  );
}

function PresenceCheckpointEvidenceLab() {
  const [mode, setMode] = useState<"pressure" | "present">("pressure");
  const [result, setResult] = useState("");

  return (
    <section
      aria-label="Interactive sensitive workflow checkpoint"
      style={{
        minHeight: 492,
        overflow: "hidden",
        border: "1px solid rgba(194,168,128,.32)",
        borderRadius: 16,
        background: "#F3EEE6",
        color: "#292822",
        boxShadow: "0 26px 70px rgba(0,0,0,.38)",
      }}
    >
      <header
        style={{
          height: 58,
          padding: "0 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #D9CFC0",
          background: "#FFFCF7",
        }}
      >
        <div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12.5, fontWeight: 750 }}>
            Housing assistance application
          </div>
          <div style={{ marginTop: 3, fontFamily: "Inter,sans-serif", fontSize: 9.5, color: "#7E776D" }}>
            Eligibility details · Step 3 of 5
          </div>
        </div>
        <div role="group" aria-label="Checkpoint behavior" style={{ display: "flex", gap: 5 }}>
          <button
            type="button"
            aria-pressed={mode === "pressure"}
            onClick={() => {
              setMode("pressure");
              setResult("");
            }}
            style={checkpointModeButton(mode === "pressure", "#A64F45")}
          >
            Pressure
          </button>
          <button
            type="button"
            aria-pressed={mode === "present"}
            onClick={() => {
              setMode("present");
              setResult("");
            }}
            style={checkpointModeButton(mode === "present", "#466B5A")}
          >
            Orientation
          </button>
        </div>
      </header>

      <div style={{ padding: "17px 20px 0" }}>
        <div aria-label="Application progress" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6 }}>
          {["Household", "Income", "Documents", "Review", "Submit"].map((step, index) => (
            <div key={step}>
              <div style={{ height: 4, borderRadius: 99, background: index <= 2 ? "#6E8D79" : "#D7CEC1" }} />
              <div style={{ marginTop: 5, fontFamily: "Inter,sans-serif", fontSize: 8, color: index <= 2 ? "#3F5F50" : "#918A80" }}>
                {step}
              </div>
            </div>
          ))}
        </div>
      </div>

      <main
        style={{
          minHeight: 337,
          margin: "15px 20px 0",
          display: "grid",
          gridTemplateColumns: "220px minmax(0,1fr)",
          overflow: "hidden",
          border: "1px solid #D9CFC0",
          borderRadius: "13px 13px 0 0",
          background: "#FFFCF7",
        }}
      >
        <aside style={{ padding: 18, borderRight: "1px solid #DED5C9", background: "#F7F1E8" }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, fontWeight: 800, color: "#7A7167" }}>
            SAVED SO FAR
          </div>
          {[
            ["Household", "Complete"],
            ["Income", "Complete"],
            ["Documents", "2 of 3 added"],
          ].map(([label, value], index) => (
            <div key={label} style={{ display: "flex", gap: 9, padding: "12px 0", borderBottom: "1px solid #DED5C9" }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "50%",
                  background: index < 2 ? "#DDE9E1" : "#EFE3CF",
                  color: index < 2 ? "#476956" : "#8C6840",
                }}
              >
                {index < 2 ? <Check size={12} /> : <Upload size={12} />}
              </div>
              <div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10.5, fontWeight: 700 }}>{label}</div>
                <div style={{ marginTop: 2, fontFamily: "Inter,sans-serif", fontSize: 8.5, color: "#80796F" }}>{value}</div>
              </div>
            </div>
          ))}
        </aside>

        <div style={{ padding: "20px 22px" }}>
          {mode === "pressure" ? (
            <>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 9px",
                  borderRadius: 999,
                  background: "#F8E1DD",
                  color: "#9A433B",
                  fontFamily: "Inter,sans-serif",
                  fontSize: 9,
                  fontWeight: 750,
                }}
              >
                <Clock3 size={12} /> SESSION ENDS IN 02:00
              </div>
              <div style={{ marginTop: 13, fontFamily: "Georgia,serif", fontSize: 25 }}>
                Keep going to avoid losing progress
              </div>
              <p style={{ margin: "8px 0 20px", maxWidth: 460, fontFamily: "Inter,sans-serif", fontSize: 11.5, lineHeight: 1.5, color: "#756E65" }}>
                Upload the final document now. Leaving may delay your application.
              </p>
              <button
                type="button"
                onClick={() =>
                  setResult(
                    "The workflow continued under time and loss pressure without explaining whether progress was actually at risk.",
                  )
                }
                style={{
                  width: "100%",
                  minHeight: 46,
                  border: 0,
                  borderRadius: 8,
                  background: "#B45147",
                  color: "#FFFFFF",
                  fontFamily: "Inter,sans-serif",
                  fontSize: 12,
                  fontWeight: 750,
                  cursor: "pointer",
                }}
              >
                Continue now
              </button>
              <button
                type="button"
                onClick={() => setResult("The person left without a clear statement about saved progress or how to return.")}
                style={{
                  width: "100%",
                  marginTop: 9,
                  border: 0,
                  background: "transparent",
                  color: "#9A9187",
                  fontFamily: "Inter,sans-serif",
                  fontSize: 9,
                  cursor: "pointer",
                }}
              >
                Exit application
              </button>
            </>
          ) : (
            <>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, fontWeight: 800, color: "#466B5A" }}>
                CHECKPOINT · YOUR PROGRESS IS SAVED
              </div>
              <div style={{ marginTop: 9, fontFamily: "Georgia,serif", fontSize: 24 }}>
                Before the document step
              </div>
              <p style={{ margin: "7px 0 13px", fontFamily: "Inter,sans-serif", fontSize: 11, lineHeight: 1.5, color: "#6F6A62" }}>
                Next, you’ll add proof of address. You can continue, pause, or
                leave. Completed information remains saved for 30 days.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                <SubmissionFact label="NEXT STEP" value="One document upload" />
                <SubmissionFact label="ESTIMATED TIME" value="About 4 minutes" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 7 }}>
                <button
                  type="button"
                  onClick={() => setResult("The next step opened after its purpose, duration, and save behavior were made visible.")}
                  style={checkpointAction("#466B5A", "#FFFFFF")}
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={() => setResult("Progress was saved. The person can return to the document step within 30 days.")}
                  style={checkpointAction("#FFFFFF", "#4E5F55", true)}
                >
                  <Pause size={12} /> Pause
                </button>
                <button
                  type="button"
                  onClick={() => setResult("The application closed with completed information preserved.")}
                  style={checkpointAction("#FFFFFF", "#6C635B", true)}
                >
                  Leave
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <ExhibitStatus
        result={result}
        idle={
          mode === "pressure"
            ? "Urgency narrows attention toward continuation."
            : "Presence orients the person without manufacturing urgency or trapping them in the flow."
        }
        light
      />
    </section>
  );
}

function checkpointModeButton(active: boolean, color: string): CSSProperties {
  return {
    minHeight: 31,
    padding: "0 11px",
    border: active ? `1px solid ${color}66` : "1px solid #D5CCC0",
    borderRadius: 8,
    background: active ? `${color}12` : "#FFFFFF",
    color: active ? color : "#817A71",
    fontFamily: "Inter,sans-serif",
    fontSize: 9.5,
    fontWeight: 750,
    cursor: "pointer",
  };
}

function checkpointAction(
  background: string,
  color: string,
  bordered = false,
): CSSProperties {
  return {
    minHeight: 42,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    border: bordered ? "1px solid #CFC5B8" : 0,
    borderRadius: 8,
    background,
    color,
    fontFamily: "Inter,sans-serif",
    fontSize: 10,
    fontWeight: 750,
    cursor: "pointer",
  };
}

function AccountRecoveryEvidenceLab() {
  const [mode, setMode] = useState<"blame" | "recovery">("blame");
  const [route, setRoute] = useState<"email" | "key" | "support" | null>(null);
  const [result, setResult] = useState("");

  const changeMode = (next: "blame" | "recovery") => {
    setMode(next);
    setRoute(null);
    setResult("");
  };

  return (
    <section
      aria-label="Interactive account recovery interface"
      style={{
        minHeight: 492,
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "280px minmax(0,1fr)",
        border: "1px solid rgba(102,141,181,.3)",
        borderRadius: 16,
        background: "#F8FAFD",
        color: "#1C2A3D",
        boxShadow: "0 26px 70px rgba(0,0,0,.4)",
      }}
    >
      <aside
        style={{
          padding: "22px 20px",
          display: "flex",
          flexDirection: "column",
          background:
            "radial-gradient(circle at 20% 14%,rgba(114,172,211,.22),transparent 34%),#102238",
          color: "#EAF3FA",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 31,
              height: 31,
              display: "grid",
              placeItems: "center",
              borderRadius: 9,
              background: "#1C3A58",
              color: "#8FC8E8",
            }}
          >
            <KeyRound size={16} />
          </div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 750 }}>
            Northline ID
          </div>
        </div>
        <div style={{ marginTop: 50, fontFamily: "Georgia,serif", fontSize: 27, lineHeight: 1.15 }}>
          Return to your account.
        </div>
        <p style={{ margin: "12px 0 0", fontFamily: "Inter,sans-serif", fontSize: 11, lineHeight: 1.55, color: "#AFC0D0" }}>
          Recovery should restore access without turning a security boundary
          into a judgment about the person.
        </p>
        <div style={{ marginTop: "auto", paddingTop: 18, borderTop: "1px solid #29415A" }}>
          {["Encrypted recovery", "No password requested", "Account changes logged"].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 8, fontFamily: "Inter,sans-serif", fontSize: 9.5, color: "#AFC0D0" }}>
              <ShieldCheck size={12} color="#7FB69D" /> {item}
            </div>
          ))}
        </div>
      </aside>

      <div style={{ display: "flex", minWidth: 0, flexDirection: "column" }}>
        <header
          style={{
            height: 58,
            padding: "0 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #DCE3EC",
            background: "#FFFFFF",
          }}
        >
          <div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 750 }}>Recover access</div>
            <div style={{ marginTop: 2, fontFamily: "Inter,sans-serif", fontSize: 9, color: "#77869A" }}>
              alex@northline.example
            </div>
          </div>
          <div role="group" aria-label="Recovery language" style={{ display: "flex", gap: 4 }}>
            <button
              type="button"
              aria-pressed={mode === "blame"}
              onClick={() => changeMode("blame")}
              style={recoveryModeButton(mode === "blame", "#A64B46")}
            >
              Blame error
            </button>
            <button
              type="button"
              aria-pressed={mode === "recovery"}
              onClick={() => changeMode("recovery")}
              style={recoveryModeButton(mode === "recovery", "#315F83")}
            >
              Guided recovery
            </button>
          </div>
        </header>

        <main style={{ flex: 1, padding: "22px 24px 16px" }}>
          {mode === "blame" ? (
            <div style={{ maxWidth: 470, margin: "28px auto 0" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "50%",
                  background: "#F8E7E5",
                  color: "#B14D46",
                }}
              >
                <X size={21} />
              </div>
              <div style={{ marginTop: 14, fontFamily: "Inter,sans-serif", fontSize: 23, fontWeight: 780 }}>
                You entered the wrong code too many times
              </div>
              <p style={{ margin: "8px 0 18px", fontFamily: "Inter,sans-serif", fontSize: 11.5, lineHeight: 1.5, color: "#69778A" }}>
                Access is blocked. Try again later.
              </p>
              <div style={{ padding: "11px 12px", borderRadius: 8, background: "#F2F4F7", fontFamily: "Inter,sans-serif", fontSize: 10, color: "#778294" }}>
                Error R-18 · Attempts exceeded
              </div>
              <button
                type="button"
                onClick={() =>
                  setResult(
                    "The person reached the same blocked state again. The interface named fault but offered no viable recovery route.",
                  )
                }
                style={{
                  width: "100%",
                  minHeight: 44,
                  marginTop: 14,
                  border: 0,
                  borderRadius: 8,
                  background: "#B14D46",
                  color: "#FFFFFF",
                  fontFamily: "Inter,sans-serif",
                  fontSize: 11,
                  fontWeight: 750,
                  cursor: "pointer",
                }}
              >
                Try code again
              </button>
            </div>
          ) : (
            <>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 20, fontWeight: 770 }}>
                The verification code expired
              </div>
              <p style={{ margin: "6px 0 15px", fontFamily: "Inter,sans-serif", fontSize: 11, color: "#657489" }}>
                Your account is still secure. Choose a route that works for you.
              </p>
              <div role="group" aria-label="Recovery route" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {[
                  { id: "email" as const, icon: <Mail size={17} />, title: "Email link", note: "Send to verified inbox" },
                  { id: "key" as const, icon: <KeyRound size={17} />, title: "Backup key", note: "Use a saved recovery key" },
                  { id: "support" as const, icon: <Headphones size={17} />, title: "Human support", note: "Keep this context attached" },
                ].map((item) => {
                  const active = route === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setRoute(item.id);
                        setResult("");
                      }}
                      style={{
                        minHeight: 96,
                        padding: 12,
                        textAlign: "left",
                        border: active ? "1px solid #4E789A" : "1px solid #D7E0E9",
                        borderRadius: 9,
                        background: active ? "#EDF5FA" : "#FFFFFF",
                        color: active ? "#315F83" : "#46566A",
                        cursor: "pointer",
                      }}
                    >
                      {item.icon}
                      <span style={{ display: "block", marginTop: 9, fontFamily: "Inter,sans-serif", fontSize: 10.5, fontWeight: 750 }}>
                        {item.title}
                      </span>
                      <span style={{ display: "block", marginTop: 3, fontFamily: "Inter,sans-serif", fontSize: 8.5, lineHeight: 1.3, color: "#77869A" }}>
                        {item.note}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div
                style={{
                  minHeight: 82,
                  marginTop: 11,
                  padding: "12px 13px",
                  border: "1px solid #D7E0E9",
                  borderRadius: 9,
                  background: "#F5F8FB",
                }}
              >
                {route ? (
                  <>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10.5, fontWeight: 750, color: "#33465C" }}>
                      {route === "email"
                        ? "Send a single-use link"
                        : route === "key"
                          ? "Enter your offline recovery key"
                          : "Open a support request"}
                    </div>
                    <div style={{ marginTop: 4, fontFamily: "Inter,sans-serif", fontSize: 9.5, lineHeight: 1.35, color: "#6D7C8E" }}>
                      {route === "support"
                        ? "The expired-code context and account identifier will be included. No password is shared."
                        : "This route restores access without resetting unrelated account preferences."}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setResult(
                          `${route === "email" ? "Email link" : route === "key" ? "Backup key" : "Human support"} selected. The recovery path explains what happens and preserves other account settings.`,
                        )
                      }
                      style={{
                        minHeight: 32,
                        marginTop: 9,
                        padding: "0 12px",
                        border: 0,
                        borderRadius: 7,
                        background: "#315F83",
                        color: "#FFFFFF",
                        fontFamily: "Inter,sans-serif",
                        fontSize: 9.5,
                        fontWeight: 750,
                        cursor: "pointer",
                      }}
                    >
                      Continue with this route
                    </button>
                  </>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, height: "100%", fontFamily: "Inter,sans-serif", fontSize: 10, color: "#7A8798" }}>
                    <CircleHelpIcon /> Select a recovery route to see what it requires.
                  </div>
                )}
              </div>
            </>
          )}
        </main>
        <ExhibitStatus
          result={result}
          idle={
            mode === "blame"
              ? "The error treats a security event as personal failure and withholds a next step."
              : "The system names what happened, keeps the boundary, and offers viable recovery routes."
          }
          light
        />
      </div>
    </section>
  );
}

function CircleHelpIcon() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 18,
        height: 18,
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        border: "1px solid #9AA8B8",
        borderRadius: "50%",
        fontFamily: "Inter,sans-serif",
        fontSize: 10,
      }}
    >
      ?
    </span>
  );
}

function recoveryModeButton(active: boolean, color: string): CSSProperties {
  return {
    minHeight: 30,
    padding: "0 10px",
    border: active ? `1px solid ${color}55` : "1px solid #D7E0E9",
    borderRadius: 7,
    background: active ? `${color}10` : "#FFFFFF",
    color: active ? color : "#758398",
    fontFamily: "Inter,sans-serif",
    fontSize: 9,
    fontWeight: 750,
    cursor: "pointer",
  };
}

function ChoiceAmplificationEvidenceLab() {
  const [mode, setMode] = useState<"automatic" | "editable">("automatic");
  const [priority, setPriority] = useState<"focus" | "team" | "earliest">("focus");
  const [choice, setChoice] = useState("option-a");
  const [result, setResult] = useState("");

  const options = {
    focus: [
      { id: "option-a", time: "Tue · 10:30", note: "Preserves two focus blocks", moved: "Moves 1 meeting" },
      { id: "option-b", time: "Wed · 13:00", note: "Most attendees available", moved: "Moves 0 meetings" },
      { id: "option-c", time: "Mon · 16:00", note: "Earliest open slot", moved: "Moves 2 meetings" },
    ],
    team: [
      { id: "option-b", time: "Wed · 13:00", note: "Most attendees available", moved: "Moves 0 meetings" },
      { id: "option-a", time: "Tue · 10:30", note: "Preserves two focus blocks", moved: "Moves 1 meeting" },
      { id: "option-c", time: "Mon · 16:00", note: "Earliest open slot", moved: "Moves 2 meetings" },
    ],
    earliest: [
      { id: "option-c", time: "Mon · 16:00", note: "Earliest open slot", moved: "Moves 2 meetings" },
      { id: "option-a", time: "Tue · 10:30", note: "Preserves two focus blocks", moved: "Moves 1 meeting" },
      { id: "option-b", time: "Wed · 13:00", note: "Most attendees available", moved: "Moves 0 meetings" },
    ],
  }[priority];

  const changeMode = (next: "automatic" | "editable") => {
    setMode(next);
    setChoice("option-a");
    setResult("");
  };

  return (
    <section
      aria-label="Interactive AI scheduling recommendation"
      style={{
        minHeight: 492,
        overflow: "hidden",
        border: "1px solid rgba(124,151,205,.3)",
        borderRadius: 15,
        background: "#111522",
        color: "#EDF1FA",
        boxShadow: "0 26px 70px rgba(0,0,0,.42)",
      }}
    >
      <header
        style={{
          height: 58,
          padding: "0 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #2A3143",
          background: "#171C2B",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <Sparkles size={16} color="#9AAEED" />
          <div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12.5, fontWeight: 750 }}>Schedule assistant</div>
            <div style={{ marginTop: 2, fontFamily: "Inter,sans-serif", fontSize: 9, color: "#8E99AE" }}>
              Plan a 45-minute project review
            </div>
          </div>
        </div>
        <div role="group" aria-label="Recommendation control" style={{ display: "flex", gap: 4 }}>
          <button
            type="button"
            aria-pressed={mode === "automatic"}
            onClick={() => changeMode("automatic")}
            style={aiModeButton(mode === "automatic", "#D47A70")}
          >
            Auto-decide
          </button>
          <button
            type="button"
            aria-pressed={mode === "editable"}
            onClick={() => changeMode("editable")}
            style={aiModeButton(mode === "editable", "#92A9EF")}
          >
            Editable criteria
          </button>
        </div>
      </header>

      <div style={{ minHeight: 383, display: "grid", gridTemplateColumns: "360px minmax(0,1fr)" }}>
        <aside style={{ padding: 17, borderRight: "1px solid #2A3143", background: "#121724" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, fontWeight: 800, color: "#8E99AE" }}>
              TEAM CALENDAR
            </div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 8.5, color: "#68758D" }}>MON–WED</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 7 }}>
            {["MON 14", "TUE 15", "WED 16"].map((day, dayIndex) => (
              <div key={day} style={{ minHeight: 280, padding: 8, border: "1px solid #283044", borderRadius: 8, background: "#171D2B" }}>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 8, fontWeight: 750, color: "#8995A9", marginBottom: 9 }}>
                  {day}
                </div>
                {[
                  { top: dayIndex === 0 ? 22 : 5, height: 38, label: dayIndex === 0 ? "Planning" : "Focus" },
                  { top: dayIndex === 1 ? 32 : 20, height: dayIndex === 2 ? 54 : 44, label: dayIndex === 2 ? "Team sync" : "Review" },
                  { top: dayIndex === 0 ? 36 : 28, height: 48, label: "Focus" },
                ].map((block, index) => (
                  <div
                    key={`${block.label}-${index}`}
                    style={{
                      height: block.height,
                      marginTop: block.top,
                      padding: "6px 5px",
                      borderLeft: `2px solid ${block.label === "Focus" ? "#6278BD" : "#4F8C83"}`,
                      borderRadius: 4,
                      background: block.label === "Focus" ? "#202943" : "#1C3337",
                      fontFamily: "Inter,sans-serif",
                      fontSize: 7.5,
                      color: "#B7C1D2",
                    }}
                  >
                    {block.label}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </aside>

        <main style={{ padding: "17px 19px 13px" }}>
          {mode === "automatic" ? (
            <>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, fontWeight: 800, color: "#D58A80" }}>
                AI SCHEDULE APPLIED
              </div>
              <div style={{ marginTop: 9, fontFamily: "Inter,sans-serif", fontSize: 22, fontWeight: 760 }}>
                Review scheduled Monday at 16:00
              </div>
              <p style={{ margin: "7px 0 14px", fontFamily: "Inter,sans-serif", fontSize: 11, lineHeight: 1.45, color: "#98A4B8" }}>
                The assistant selected the earliest opening and moved two existing meetings.
              </p>
              <div style={{ padding: "12px 13px", border: "1px solid #49363C", borderRadius: 9, background: "#251D28" }}>
                {["Design critique moved to Tuesday", "Focus block shortened by 45 minutes"].map((item) => (
                  <div key={item} style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 7, fontFamily: "Inter,sans-serif", fontSize: 10, color: "#D2BBC0" }}>
                    <AlertTriangle size={12} color="#D58A80" /> {item}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setResult(
                    "The automatic schedule remained in place. A hidden priority—earliest availability—overrode existing commitments.",
                  )
                }
                style={{
                  width: "100%",
                  minHeight: 44,
                  marginTop: 15,
                  border: 0,
                  borderRadius: 8,
                  background: "#B9655D",
                  color: "#FFFFFF",
                  fontFamily: "Inter,sans-serif",
                  fontSize: 11,
                  fontWeight: 750,
                  cursor: "pointer",
                }}
              >
                Accept applied schedule
              </button>
              <button
                type="button"
                onClick={() => changeMode("editable")}
                style={{
                  width: "100%",
                  minHeight: 34,
                  marginTop: 7,
                  border: 0,
                  background: "transparent",
                  color: "#9EA9BD",
                  fontFamily: "Inter,sans-serif",
                  fontSize: 9.5,
                  cursor: "pointer",
                }}
              >
                Undo and review options
              </button>
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "Inter,sans-serif", fontSize: 9, fontWeight: 800, color: "#9AAEED" }}>
                <SlidersHorizontal size={13} /> WHAT SHOULD THE ASSISTANT PRIORITIZE?
              </div>
              <div role="group" aria-label="Scheduling priority" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginTop: 10 }}>
                {[
                  ["focus", "Protect focus"],
                  ["team", "Team availability"],
                  ["earliest", "Earliest time"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={priority === id}
                    onClick={() => {
                      setPriority(id as typeof priority);
                      setChoice(options[0].id);
                      setResult("");
                    }}
                    style={{
                      minHeight: 35,
                      border: priority === id ? "1px solid #7188CB" : "1px solid #343D52",
                      borderRadius: 7,
                      background: priority === id ? "#222D4B" : "#171D2B",
                      color: priority === id ? "#C8D3F6" : "#909CAF",
                      fontFamily: "Inter,sans-serif",
                      fontSize: 8.5,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div style={{ display: "grid", gap: 6, marginTop: 11 }}>
                {options.map((option, index) => {
                  const active = choice === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setChoice(option.id);
                        setResult("");
                      }}
                      style={{
                        minHeight: 56,
                        padding: "8px 10px",
                        display: "grid",
                        gridTemplateColumns: "23px 1fr auto",
                        alignItems: "center",
                        gap: 9,
                        textAlign: "left",
                        border: active ? "1px solid #7188CB" : "1px solid #30384B",
                        borderRadius: 8,
                        background: active ? "#202A46" : "#171D2B",
                        color: "#E7ECF5",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          width: 19,
                          height: 19,
                          display: "grid",
                          placeItems: "center",
                          borderRadius: "50%",
                          border: active ? "5px solid #92A9EF" : "1px solid #596579",
                        }}
                      />
                      <span>
                        <span style={{ display: "block", fontFamily: "Inter,sans-serif", fontSize: 10.5, fontWeight: 750 }}>
                          {option.time} {index === 0 ? "· Best match" : ""}
                        </span>
                        <span style={{ display: "block", marginTop: 3, fontFamily: "Inter,sans-serif", fontSize: 8.5, color: "#98A4B8" }}>
                          {option.note}
                        </span>
                      </span>
                      <span style={{ fontFamily: "Inter,sans-serif", fontSize: 8, color: "#91A0B5" }}>{option.moved}</span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => {
                  const selected = options.find((option) => option.id === choice) ?? options[0];
                  setResult(
                    `${selected.time} selected. The person chose the priority and option; no other meeting changed without confirmation.`,
                  );
                }}
                style={{
                  width: "100%",
                  minHeight: 39,
                  marginTop: 9,
                  border: 0,
                  borderRadius: 8,
                  background: "#647CC5",
                  color: "#FFFFFF",
                  fontFamily: "Inter,sans-serif",
                  fontSize: 10.5,
                  fontWeight: 750,
                  cursor: "pointer",
                }}
              >
                Confirm selected option
              </button>
            </>
          )}
        </main>
      </div>
      <ExhibitStatus
        result={result}
        idle={
          mode === "automatic"
            ? "The system acted on a hidden priority and changed the calendar before consent."
            : "The assistant narrows possibilities while criteria, alternatives, and final authority stay editable."
        }
      />
    </section>
  );
}

function aiModeButton(active: boolean, color: string): CSSProperties {
  return {
    minHeight: 30,
    padding: "0 10px",
    border: active ? `1px solid ${color}77` : "1px solid #394156",
    borderRadius: 7,
    background: active ? `${color}18` : "#171C2B",
    color: active ? color : "#8D99AE",
    fontFamily: "Inter,sans-serif",
    fontSize: 9,
    fontWeight: 750,
    cursor: "pointer",
  };
}

function MeaningfulClosureEvidenceLab() {
  const [mode, setMode] = useState<"mechanical" | "closure">("mechanical");
  const [receiptSaved, setReceiptSaved] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [result, setResult] = useState("");

  const changeMode = (next: "mechanical" | "closure") => {
    setMode(next);
    setReceiptSaved(false);
    setReminder(false);
    setResult("");
  };

  return (
    <section
      aria-label="Interactive completion and saved-progress interface"
      style={{
        minHeight: 492,
        overflow: "hidden",
        border: "1px solid rgba(107,168,149,.3)",
        borderRadius: 16,
        background: "#F4F8F5",
        color: "#21342D",
        boxShadow: "0 26px 70px rgba(0,0,0,.38)",
      }}
    >
      <header
        style={{
          height: 58,
          padding: "0 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #D5E2DA",
          background: "#FBFDFC",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <Cloud size={16} color="#4D806C" />
          <div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12.5, fontWeight: 750 }}>Community grant portal</div>
            <div style={{ marginTop: 2, fontFamily: "Inter,sans-serif", fontSize: 9, color: "#74877E" }}>
              Neighborhood garden proposal
            </div>
          </div>
        </div>
        <div role="group" aria-label="Completion experience" style={{ display: "flex", gap: 4 }}>
          <button
            type="button"
            aria-pressed={mode === "mechanical"}
            onClick={() => changeMode("mechanical")}
            style={closureModeButton(mode === "mechanical", "#867A71")}
          >
            Mechanical end
          </button>
          <button
            type="button"
            aria-pressed={mode === "closure"}
            onClick={() => changeMode("closure")}
            style={closureModeButton(mode === "closure", "#477A65")}
          >
            Meaningful closure
          </button>
        </div>
      </header>

      <div style={{ minHeight: 383, display: "grid", gridTemplateColumns: "225px minmax(0,1fr)" }}>
        <aside style={{ padding: 17, borderRight: "1px solid #D5E2DA", background: "#EAF2ED" }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, fontWeight: 800, color: "#6C8076" }}>
            APPLICATION
          </div>
          {[
            ["Project details", "Saved"],
            ["Budget", "Saved"],
            ["Documents", "3 attached"],
            ["Submit", "Complete"],
          ].map(([label, state], index) => (
            <div key={label} style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: 8, padding: "11px 0", borderBottom: "1px solid #CFDDD4" }}>
              <div
                style={{
                  width: 21,
                  height: 21,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "50%",
                  background: index === 3 ? "#4F826D" : "#D7E7DD",
                  color: index === 3 ? "#FFFFFF" : "#4F826D",
                }}
              >
                <Check size={12} />
              </div>
              <div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 700 }}>{label}</div>
                <div style={{ marginTop: 2, fontFamily: "Inter,sans-serif", fontSize: 8.5, color: "#74877E" }}>{state}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 14, fontFamily: "Inter,sans-serif", fontSize: 8.5, lineHeight: 1.45, color: "#73867C" }}>
            Last autosave: today at 14:32
          </div>
        </aside>

        <main style={{ padding: "18px 21px 14px" }}>
          {mode === "mechanical" ? (
            <div style={{ height: "100%", display: "grid", placeItems: "center", textAlign: "center" }}>
              <div>
                <div
                  style={{
                    width: 58,
                    height: 58,
                    margin: "0 auto",
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "50%",
                    background: "#DCEBE2",
                    color: "#4D806C",
                  }}
                >
                  <Check size={27} />
                </div>
                <div style={{ marginTop: 14, fontFamily: "Inter,sans-serif", fontSize: 25, fontWeight: 780 }}>
                  Done
                </div>
                <p style={{ margin: "7px auto 17px", maxWidth: 340, fontFamily: "Inter,sans-serif", fontSize: 11, lineHeight: 1.5, color: "#718179" }}>
                  Your task is complete.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setResult(
                      "The flow ended, but the person still does not know what was saved, what happens next, or how to return.",
                    )
                  }
                  style={{
                    minHeight: 42,
                    padding: "0 22px",
                    border: 0,
                    borderRadius: 8,
                    background: "#5A876F",
                    color: "#FFFFFF",
                    fontFamily: "Inter,sans-serif",
                    fontSize: 10.5,
                    fontWeight: 750,
                    cursor: "pointer",
                  }}
                >
                  Return home
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14 }}>
                <div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, fontWeight: 800, color: "#4D806C" }}>
                    SUBMISSION RECEIVED
                  </div>
                  <div style={{ marginTop: 7, fontFamily: "Georgia,serif", fontSize: 24 }}>
                    Your proposal is safely in review
                  </div>
                  <div style={{ marginTop: 5, fontFamily: "Inter,sans-serif", fontSize: 10.5, color: "#708179" }}>
                    Reference CG-2048 · Submitted today at 14:34
                  </div>
                </div>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    borderRadius: 10,
                    background: "#DCEBE2",
                    color: "#4D806C",
                  }}
                >
                  <FileCheck2 size={21} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
                <div style={{ padding: "11px 12px", border: "1px solid #D2E0D7", borderRadius: 9, background: "#FFFFFF" }}>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 8, fontWeight: 800, color: "#7A8D83" }}>WHAT WAS SAVED</div>
                  <div style={{ marginTop: 6, fontFamily: "Inter,sans-serif", fontSize: 10.5, lineHeight: 1.4 }}>
                    Proposal, budget, and 3 attachments
                  </div>
                </div>
                <div style={{ padding: "11px 12px", border: "1px solid #D2E0D7", borderRadius: 9, background: "#FFFFFF" }}>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 8, fontWeight: 800, color: "#7A8D83" }}>WHAT HAPPENS NEXT</div>
                  <div style={{ marginTop: 6, fontFamily: "Inter,sans-serif", fontSize: 10.5, lineHeight: 1.4 }}>
                    Eligibility review by 18 June
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 9, borderLeft: "3px solid #5A8A74", background: "#E8F1EB" }}>
                <Bell size={14} color="#4D806C" />
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, lineHeight: 1.4, color: "#486054" }}>
                  We’ll email alex@example.org when the review status changes.
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, marginTop: 11 }}>
                <button
                  type="button"
                  onClick={() => {
                    setReceiptSaved(true);
                    setResult("A receipt containing the reference, saved materials, and review timeline was downloaded.");
                  }}
                  style={closureAction(receiptSaved)}
                >
                  <Download size={13} /> {receiptSaved ? "Receipt saved" : "Save receipt"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReminder(true);
                    setResult("A private reminder was set for the stated review date.");
                  }}
                  style={closureAction(reminder)}
                >
                  <CalendarDays size={13} /> {reminder ? "Reminder set" : "Set reminder"}
                </button>
                <button
                  type="button"
                  onClick={() => setResult("The person returned home with the submission reference preserved in progress history.")}
                  style={closureAction(false)}
                >
                  Return home
                </button>
              </div>
            </>
          )}
        </main>
      </div>
      <ExhibitStatus
        result={result}
        idle={
          mode === "mechanical"
            ? "Completion is acknowledged, but continuity and memory are left to the person."
            : "Closure confirms what happened, preserves a record, and makes the next moment legible."
        }
        light
      />
    </section>
  );
}

function closureModeButton(active: boolean, color: string): CSSProperties {
  return {
    minHeight: 30,
    padding: "0 10px",
    border: active ? `1px solid ${color}66` : "1px solid #D4E0D8",
    borderRadius: 7,
    background: active ? `${color}12` : "#FFFFFF",
    color: active ? color : "#75877D",
    fontFamily: "Inter,sans-serif",
    fontSize: 9,
    fontWeight: 750,
    cursor: "pointer",
  };
}

function closureAction(active: boolean): CSSProperties {
  return {
    minHeight: 39,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    border: active ? "1px solid #5D8B76" : "1px solid #C8D8CE",
    borderRadius: 8,
    background: active ? "#E0EEE5" : "#FFFFFF",
    color: "#436957",
    fontFamily: "Inter,sans-serif",
    fontSize: 9,
    fontWeight: 700,
    cursor: "pointer",
  };
}

function PrivacyIntegrityEvidenceLab() {
  const [mode, setMode] = useState<"promise" | "integrity">("promise");
  const [analytics, setAnalytics] = useState(true);
  const [personalization, setPersonalization] = useState(true);
  const [location, setLocation] = useState(true);
  const [result, setResult] = useState("");

  const changeMode = (next: "promise" | "integrity") => {
    setMode(next);
    setAnalytics(true);
    setPersonalization(true);
    setLocation(true);
    setResult("");
  };

  const activeCount = [analytics, personalization, location].filter(Boolean).length;

  return (
    <section
      aria-label="Interactive privacy and permissions settings"
      style={{
        minHeight: 492,
        overflow: "hidden",
        border: "1px solid rgba(127,154,159,.3)",
        borderRadius: 16,
        background: "#10171A",
        color: "#EAF0EE",
        boxShadow: "0 26px 70px rgba(0,0,0,.42)",
      }}
    >
      <header
        style={{
          height: 58,
          padding: "0 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #293539",
          background: "#151E21",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <LockKeyhole size={16} color="#8FB7AC" />
          <div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12.5, fontWeight: 750 }}>Harbor privacy center</div>
            <div style={{ marginTop: 2, fontFamily: "Inter,sans-serif", fontSize: 9, color: "#8A9A9B" }}>
              Permissions and data use
            </div>
          </div>
        </div>
        <div role="group" aria-label="Privacy behavior" style={{ display: "flex", gap: 4 }}>
          <button
            type="button"
            aria-pressed={mode === "promise"}
            onClick={() => changeMode("promise")}
            style={privacyModeButton(mode === "promise", "#D48075")}
          >
            Promise only
          </button>
          <button
            type="button"
            aria-pressed={mode === "integrity"}
            onClick={() => changeMode("integrity")}
            style={privacyModeButton(mode === "integrity", "#8FB7AC")}
          >
            Promise + control
          </button>
        </div>
      </header>

      <div style={{ minHeight: 383, display: "grid", gridTemplateColumns: "310px minmax(0,1fr)" }}>
        <aside style={{ padding: 16, display: "grid", placeItems: "center", borderRight: "1px solid #293539", background: "#0D1417" }}>
          <div
            style={{
              width: 218,
              height: 330,
              padding: "13px 12px",
              border: "5px solid #293438",
              borderRadius: 27,
              background: "#F5F8F7",
              color: "#263734",
              boxShadow: "0 18px 40px rgba(0,0,0,.35)",
            }}
          >
            <div style={{ width: 54, height: 5, margin: "0 auto 16px", borderRadius: 99, background: "#C7D0CE" }} />
            <div style={{ textAlign: "center" }}>
              <ShieldCheck size={28} color="#4F8274" />
              <div style={{ marginTop: 8, fontFamily: "Inter,sans-serif", fontSize: 17, fontWeight: 780 }}>
                Your privacy matters
              </div>
              <p style={{ margin: "7px 6px 15px", fontFamily: "Inter,sans-serif", fontSize: 9.5, lineHeight: 1.45, color: "#697875" }}>
                You’re in control of your information.
              </p>
            </div>
            {mode === "promise" ? (
              <>
                <div style={{ padding: "12px", borderRadius: 9, background: "#E8F0ED", fontFamily: "Inter,sans-serif", fontSize: 9.5, lineHeight: 1.45, color: "#52635F" }}>
                  We use data to improve Harbor and provide a personalized
                  experience.
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setResult(
                      "The privacy promise was accepted while analytics, personalization, and background location remained active.",
                    )
                  }
                  style={{
                    width: "100%",
                    minHeight: 38,
                    marginTop: 13,
                    border: 0,
                    borderRadius: 8,
                    background: "#4F8274",
                    color: "#FFFFFF",
                    fontFamily: "Inter,sans-serif",
                    fontSize: 10,
                    fontWeight: 750,
                    cursor: "pointer",
                  }}
                >
                  Sounds good
                </button>
                <button
                  type="button"
                  onClick={() => setResult("The person opened settings only after accepting the broad privacy statement.")}
                  style={{
                    width: "100%",
                    marginTop: 10,
                    border: 0,
                    background: "transparent",
                    color: "#87938F",
                    fontFamily: "Inter,sans-serif",
                    fontSize: 8.5,
                    cursor: "pointer",
                  }}
                >
                  Manage in settings
                </button>
              </>
            ) : (
              <div style={{ display: "grid", gap: 7 }}>
                <PhonePermission label="Usage analytics" enabled={analytics} onChange={setAnalytics} />
                <PhonePermission label="Personalization" enabled={personalization} onChange={setPersonalization} />
                <PhonePermission label="Background location" enabled={location} onChange={setLocation} />
              </div>
            )}
          </div>
        </aside>

        <main style={{ padding: "17px 19px 13px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, fontWeight: 800, color: mode === "promise" ? "#D58A80" : "#8FB7AC" }}>
                {mode === "promise" ? "CLAIM / BEHAVIOR CHECK" : "LIVE DATA FLOW"}
              </div>
              <div style={{ marginTop: 7, fontFamily: "Inter,sans-serif", fontSize: 20, fontWeight: 760 }}>
                {mode === "promise" ? "The promise and controls disagree" : `${activeCount} optional data flows active`}
              </div>
            </div>
            <Settings2 size={20} color={mode === "promise" ? "#D58A80" : "#8FB7AC"} />
          </div>
          <div style={{ display: "grid", gap: 7, marginTop: 14 }}>
            <PrivacyFlow
              label="Usage analytics"
              detail="Feature taps and session events"
              destination="Analytics provider"
              active={analytics}
              disclosed={mode === "integrity"}
            />
            <PrivacyFlow
              label="Personalization"
              detail="Viewed topics and saved items"
              destination="Recommendation service"
              active={personalization}
              disclosed={mode === "integrity"}
            />
            <PrivacyFlow
              label="Background location"
              detail="Location when the app is closed"
              destination="Harbor servers"
              active={location}
              disclosed={mode === "integrity"}
            />
          </div>
          {mode === "promise" ? (
            <div style={{ marginTop: 11, padding: "11px 12px", border: "1px solid #4A3434", borderRadius: 8, background: "#241C1E", fontFamily: "Inter,sans-serif", fontSize: 9.5, lineHeight: 1.45, color: "#D9B7B2" }}>
              “You’re in control” is not supported by the visible interface:
              three optional flows are active, but none can be changed here.
            </div>
          ) : (
            <button
              type="button"
              onClick={() =>
                setResult(
                  `Preferences saved. ${activeCount} optional data ${activeCount === 1 ? "flow remains" : "flows remain"} active, matching the visible controls.`,
                )
              }
              style={{
                width: "100%",
                minHeight: 41,
                marginTop: 11,
                border: 0,
                borderRadius: 8,
                background: "#5B887C",
                color: "#FFFFFF",
                fontFamily: "Inter,sans-serif",
                fontSize: 10.5,
                fontWeight: 750,
                cursor: "pointer",
              }}
            >
              Save these permissions
            </button>
          )}
        </main>
      </div>
      <ExhibitStatus
        result={result}
        idle={
          mode === "promise"
            ? "Trust language cannot compensate for controls that contradict it."
            : "The statement, actual data flows, and available controls now describe the same behavior."
        }
      />
    </section>
  );
}

function privacyModeButton(active: boolean, color: string): CSSProperties {
  return {
    minHeight: 30,
    padding: "0 10px",
    border: active ? `1px solid ${color}77` : "1px solid #374347",
    borderRadius: 7,
    background: active ? `${color}18` : "#151E21",
    color: active ? color : "#8A999B",
    fontFamily: "Inter,sans-serif",
    fontSize: 9,
    fontWeight: 750,
    cursor: "pointer",
  };
}

function PhonePermission({
  label,
  enabled,
  onChange,
}: {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      style={{
        minHeight: 43,
        padding: "0 9px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: "1px solid #D6E0DD",
        borderRadius: 8,
        background: "#FFFFFF",
        color: "#334540",
        fontFamily: "Inter,sans-serif",
        fontSize: 9,
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {label}
      <span
        aria-hidden="true"
        style={{
          width: 30,
          height: 17,
          padding: 2,
          display: "flex",
          justifyContent: enabled ? "flex-end" : "flex-start",
          borderRadius: 99,
          background: enabled ? "#5B887C" : "#C3CECB",
        }}
      >
        <span style={{ width: 13, height: 13, borderRadius: "50%", background: "#FFFFFF" }} />
      </span>
    </button>
  );
}

function PrivacyFlow({
  label,
  detail,
  destination,
  active,
  disclosed,
}: {
  label: string;
  detail: string;
  destination: string;
  active: boolean;
  disclosed: boolean;
}) {
  return (
    <div
      style={{
        minHeight: 58,
        padding: "9px 10px",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: 9,
        border: `1px solid ${active ? (disclosed ? "#3B5C56" : "#52383A") : "#2D383C"}`,
        borderRadius: 8,
        background: active ? (disclosed ? "#172622" : "#241C1E") : "#141B1E",
        opacity: active ? 1 : 0.58,
      }}
    >
      <div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 750 }}>{label}</div>
        <div style={{ marginTop: 3, fontFamily: "Inter,sans-serif", fontSize: 8.5, color: "#8D9B9B" }}>{detail}</div>
      </div>
      <ArrowRight size={14} color={active ? (disclosed ? "#8FB7AC" : "#D58A80") : "#657174"} />
      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9.5, color: "#C4CECC" }}>{active ? destination : "Off"}</div>
        <div style={{ marginTop: 3, fontFamily: "Inter,sans-serif", fontSize: 7.5, color: active ? (disclosed ? "#8FB7AC" : "#D58A80") : "#687477" }}>
          {active ? (disclosed ? "VISIBLE + CONTROLLABLE" : "ACTIVE / CONTROL HIDDEN") : "NO DATA SENT"}
        </div>
      </div>
    </div>
  );
}

function ExhibitStatus({
  result,
  idle,
  light = false,
}: {
  result: string;
  idle: string;
  light?: boolean;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        minHeight: 51,
        padding: "10px 17px",
        display: "flex",
        alignItems: "center",
        gap: 9,
        borderTop: light ? "1px solid rgba(93,112,124,.18)" : "1px solid rgba(143,183,172,.16)",
        background: light
          ? result
            ? "#EAF3ED"
            : "#FFFFFF"
          : result
            ? "#142923"
            : "#111A1D",
        color: light ? (result ? "#315D49" : "#718078") : result ? "#9AC9B8" : "#849598",
        fontFamily: "Inter,sans-serif",
        fontSize: 10.5,
        lineHeight: 1.35,
      }}
    >
      {result ? <Check size={14} /> : <Eye size={14} />}
      {result || idle}
    </div>
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
        border: "1px solid rgba(123,145,163,.3)",
        borderRadius: 15,
        background: "#F4F6F8",
        color: "#26313D",
        boxShadow: "0 26px 70px rgba(0,0,0,.36)",
      }}
    >
      <header
        style={{
          height: 56,
          padding: "0 17px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #D8E0E6",
          background: "#FFFFFF",
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
              background: "#E4EEF3",
              color: "#3E7087",
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
                color: "#758392",
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
            background: "#F6ECD8",
            color: "#8B6428",
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
            borderRight: "1px solid #D8E0E6",
            background: "#FBFCFD",
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
                background: "#E5EBF0",
                color: "#657687",
              }}
            >
              <UserRound size={14} />
            </div>
            <div
              style={{
                maxWidth: 460,
                padding: "11px 13px",
                borderRadius: "5px 13px 13px 13px",
                background: "#EAF0F4",
                fontFamily: "Inter,sans-serif",
                fontSize: 11.5,
                lineHeight: 1.45,
                color: "#354351",
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
                  background: approach === "fast" ? "#FFF1EE" : "#EAF4F5",
                  border:
                    approach === "fast"
                      ? "1px solid #E7C0BA"
                      : "1px solid #B5D3D6",
                  fontFamily: "Inter,sans-serif",
                  fontSize: 11.5,
                  lineHeight: 1.45,
                  color: "#34434D",
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
                  background: approach === "fast" ? "#F5DCD7" : "#D8E9EB",
                  color: approach === "fast" ? "#A75B52" : "#3F7880",
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
                    color: "#748291",
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
                      border: "1px solid #E0C4BF",
                      borderRadius: 9,
                      background: "#FFF4F2",
                      color: "#6D453F",
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
                      border: "1px solid #B8D2D5",
                      borderRadius: 9,
                      background: "#EEF6F6",
                      color: "#315F66",
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

        <aside style={{ padding: 16, background: "#F0F4F6" }}>
          <div
            style={{
              fontFamily: "Inter,sans-serif",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: ".08em",
              color: "#697887",
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
                border: "1px solid #BBC8D1",
                borderRadius: 8,
                background: "#FFFFFF",
                color: "#526576",
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
          borderTop: "1px solid #D8E0E6",
          background: result ? "#EAF3EE" : "#FFFFFF",
          color: result ? "#32624C" : "#71808D",
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
        border: "1px solid #B9CAD4",
        borderRadius: 8,
        background: "#F7FAFB",
        color: "#3E5968",
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
        borderBottom: "1px solid #D8E0E6",
      }}
    >
      <div
        style={{
          fontFamily: "Inter,sans-serif",
          fontSize: 7.5,
          fontWeight: 700,
          color: "#7B8996",
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
          color: "#40505E",
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

type ComparisonCriterion = "price" | "coverage" | "flexibility"

const COMPARISON_PLANS = [
  { id: "harbor", name: "Harbor Basic", price: 34, coverage: "$25k", coverageScore: 1, cancel: "48 hours", flexScore: 2 },
  { id: "summit", name: "Summit Plus", price: 62, coverage: "$100k", coverageScore: 3, cancel: "Any time", flexScore: 3 },
  { id: "field", name: "Field Essential", price: 41, coverage: "$50k", coverageScore: 2, cancel: "7 days", flexScore: 1 },
] as const

function DecisionFramingEvidenceLab() {
  const [mode, setMode] = useState<"hidden" | "visible">("hidden")
  const [criterion, setCriterion] = useState<ComparisonCriterion>("price")
  const [chosen, setChosen] = useState<string | null>(null)
  const [result, setResult] = useState("")

  const ordered = [...COMPARISON_PLANS].sort((a, b) => {
    if (criterion === "price") return a.price - b.price
    if (criterion === "coverage") return b.coverageScore - a.coverageScore
    return b.flexScore - a.flexScore
  })
  const displayed = mode === "hidden"
    ? [COMPARISON_PLANS[1], COMPARISON_PLANS[0], COMPARISON_PLANS[2]]
    : ordered
  const criterionLabel =
    criterion === "price"
      ? "lowest price"
      : criterion === "coverage"
        ? "highest coverage"
        : "most flexible cancellation"

  const changeMode = (next: "hidden" | "visible") => {
    setMode(next)
    setChosen(null)
    setResult("")
  }

  return (
    <section
      aria-label="Interactive ranked travel protection comparison"
      style={{
        minHeight: 492,
        overflow: "hidden",
        border: "1px solid rgba(116,151,177,.3)",
        borderRadius: 15,
        background: "#F5F3EF",
        color: "#252A30",
        boxShadow: "0 26px 70px rgba(0,0,0,.38)",
      }}
    >
      <header
        style={{
          height: 58,
          padding: "0 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #D9D4CC",
          background: "#173247",
          color: "#F4F8FA",
        }}
      >
        <div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12.5, fontWeight: 750 }}>
            Wayfinder travel protection
          </div>
          <div style={{ marginTop: 2, fontFamily: "Inter,sans-serif", fontSize: 9, color: "#A8BBC9" }}>
            Compare coverage for Lisbon · 8 days
          </div>
        </div>
        <div role="group" aria-label="Ranking transparency" style={{ display: "flex", gap: 4 }}>
          <button
            type="button"
            aria-pressed={mode === "hidden"}
            onClick={() => changeMode("hidden")}
            style={rankingModeButton(mode === "hidden", "#E1A276")}
          >
            Default ranking
          </button>
          <button
            type="button"
            aria-pressed={mode === "visible"}
            onClick={() => changeMode("visible")}
            style={rankingModeButton(mode === "visible", "#9FC5D8")}
          >
            Show ranking logic
          </button>
        </div>
      </header>

      <div style={{ minHeight: 383, display: "grid", gridTemplateColumns: "minmax(0,1fr) 235px" }}>
        <main style={{ padding: "16px 17px 13px", borderRight: "1px solid #D9D4CC" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 14, marginBottom: 10 }}>
            <div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, fontWeight: 800, color: mode === "hidden" ? "#A7623D" : "#315F78" }}>
                {mode === "hidden" ? "TOP MATCHES FOR YOU" : "ORDERED BY A VISIBLE CRITERION"}
              </div>
              <div style={{ marginTop: 4, fontFamily: "Georgia,serif", fontSize: 20 }}>
                Three plans, one influential order
              </div>
            </div>
            {mode === "visible" && (
              <div role="group" aria-label="Ranking criterion" style={{ display: "flex", gap: 4 }}>
                {(["price", "coverage", "flexibility"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={criterion === item}
                    onClick={() => {
                      setCriterion(item)
                      setChosen(null)
                      setResult("")
                    }}
                    style={{
                      minHeight: 29,
                      padding: "0 8px",
                      border: criterion === item ? "1px solid #527C93" : "1px solid #CEC8BF",
                      borderRadius: 6,
                      background: criterion === item ? "#E4EEF3" : "#FFFFFF",
                      color: criterion === item ? "#315F78" : "#77736D",
                      fontFamily: "Inter,sans-serif",
                      fontSize: 8,
                      fontWeight: 750,
                      cursor: "pointer",
                    }}
                  >
                    {item === "flexibility" ? "FLEXIBILITY" : item.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            aria-hidden="true"
            style={{
              display: "grid",
              gridTemplateColumns: "30px minmax(130px,1fr) 72px 86px 72px",
              gap: 7,
              padding: "0 9px 6px",
              fontFamily: "Inter,sans-serif",
              fontSize: 7.5,
              fontWeight: 800,
              color: "#8B867E",
            }}
          >
            <span>#</span><span>PLAN</span><span>PRICE</span><span>COVERAGE</span><span>CANCEL</span>
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            {displayed.map((plan, index) => {
              const active = chosen === plan.id
              const recommended = index === 0
              return (
                <button
                  key={plan.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setChosen(plan.id)
                    setResult("")
                  }}
                  style={{
                    minHeight: 66,
                    padding: "8px 9px",
                    display: "grid",
                    gridTemplateColumns: "30px minmax(130px,1fr) 72px 86px 72px",
                    alignItems: "center",
                    gap: 7,
                    textAlign: "left",
                    border: active
                      ? "1px solid #527C93"
                      : recommended
                        ? "1px solid #B99269"
                        : "1px solid #D5CFC6",
                    borderRadius: 8,
                    background: active ? "#E9F1F4" : recommended ? "#FFF8EC" : "#FFFFFF",
                    color: "#292E34",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontFamily: "Georgia,serif", fontSize: 21, color: recommended ? "#A7623D" : "#908A82" }}>
                    {index + 1}
                  </span>
                  <span>
                    <span style={{ display: "block", fontFamily: "Inter,sans-serif", fontSize: 11, fontWeight: 780 }}>{plan.name}</span>
                    {recommended && (
                      <span style={{ display: "block", marginTop: 3, fontFamily: "Inter,sans-serif", fontSize: 7.5, fontWeight: 800, color: mode === "hidden" ? "#A7623D" : "#315F78" }}>
                        {mode === "hidden" ? "RECOMMENDED" : `BEST FOR ${criterionLabel.toUpperCase()}`}
                      </span>
                    )}
                  </span>
                  <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, fontWeight: 700 }}>${plan.price}</span>
                  <span style={{ fontFamily: "Inter,sans-serif", fontSize: 10 }}>{plan.coverage}</span>
                  <span style={{ fontFamily: "Inter,sans-serif", fontSize: 9, lineHeight: 1.25 }}>{plan.cancel}</span>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            disabled={!chosen}
            onClick={() => {
              const plan = COMPARISON_PLANS.find((item) => item.id === chosen)
              if (!plan) return
              setResult(
                mode === "hidden"
                  ? `${plan.name} selected from a ranking whose commercial basis was not visible.`
                  : `${plan.name} selected after ordering by ${criterionLabel}; the trade-offs and ranking basis remained visible.`,
              )
            }}
            style={{
              width: "100%",
              minHeight: 38,
              marginTop: 9,
              border: 0,
              borderRadius: 8,
              background: chosen ? "#315F78" : "#D5D3CF",
              color: chosen ? "#FFFFFF" : "#8E8B86",
              fontFamily: "Inter,sans-serif",
              fontSize: 10,
              fontWeight: 750,
              cursor: chosen ? "pointer" : "not-allowed",
            }}
          >
            Choose selected plan
          </button>
        </main>

        <aside style={{ padding: 16, background: mode === "hidden" ? "#F3EBDF" : "#EAF1F4" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "Inter,sans-serif", fontSize: 9, fontWeight: 800, color: mode === "hidden" ? "#A7623D" : "#315F78" }}>
            {mode === "hidden" ? <AlertTriangle size={13} /> : <Scale size={13} />}
            {mode === "hidden" ? "HIDDEN FRAME" : "WHY THIS ORDER"}
          </div>
          {mode === "hidden" ? (
            <>
              <div style={{ marginTop: 12, fontFamily: "Georgia,serif", fontSize: 21, lineHeight: 1.2 }}>
                “Recommended” appears neutral.
              </div>
              <p style={{ margin: "9px 0 14px", fontFamily: "Inter,sans-serif", fontSize: 10.5, lineHeight: 1.5, color: "#756D63" }}>
                Summit Plus is ranked first because it pays the marketplace a referral fee—not because it best matches the trip.
              </p>
              <div style={{ padding: "9px 10px", border: "1px solid #D8C3AA", borderRadius: 8, background: "#FFF9F1" }}>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 7.5, fontWeight: 800, color: "#9A7653" }}>DISCLOSURE</div>
                <div style={{ marginTop: 4, fontFamily: "Inter,sans-serif", fontSize: 8.5, lineHeight: 1.4, color: "#8D8377" }}>
                  Partners may compensate Wayfinder. Buried in terms.
                </div>
              </div>
              <button
                type="button"
                onClick={() => changeMode("visible")}
                style={{
                  width: "100%",
                  minHeight: 38,
                  marginTop: 13,
                  border: "1px solid #BA9772",
                  borderRadius: 8,
                  background: "#FFF8EC",
                  color: "#875936",
                  fontFamily: "Inter,sans-serif",
                  fontSize: 9.5,
                  fontWeight: 750,
                  cursor: "pointer",
                }}
              >
                Expose ranking logic
              </button>
            </>
          ) : (
            <>
              <div style={{ marginTop: 12, fontFamily: "Georgia,serif", fontSize: 21, lineHeight: 1.2 }}>
                Ordered by {criterionLabel}.
              </div>
              <p style={{ margin: "9px 0 13px", fontFamily: "Inter,sans-serif", fontSize: 10.5, lineHeight: 1.5, color: "#62747D" }}>
                Changing the criterion changes the order. No plan is universally best.
              </p>
              {[
                ["Price", criterion === "price" ? "Primary" : "Visible trade-off"],
                ["Coverage", criterion === "coverage" ? "Primary" : "Visible trade-off"],
                ["Cancellation", criterion === "flexibility" ? "Primary" : "Visible trade-off"],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "8px 0", borderBottom: "1px solid #CCDADF", fontFamily: "Inter,sans-serif", fontSize: 9 }}>
                  <span>{label}</span><span style={{ color: "#52788A" }}>{value}</span>
                </div>
              ))}
              <div style={{ marginTop: 13, fontFamily: "Inter,sans-serif", fontSize: 8.5, lineHeight: 1.45, color: "#6C7E87" }}>
                Commercial relationships do not affect this ordering.
              </div>
            </>
          )}
        </aside>
      </div>
      <ExhibitStatus
        result={result}
        idle={
          mode === "hidden"
            ? "A ranked list shapes behavior even when the reason for the order is concealed."
            : "Criteria, order, commercial influence, and trade-offs are visible before selection."
        }
        light
      />
    </section>
  )
}

function rankingModeButton(active: boolean, color: string): CSSProperties {
  return {
    minHeight: 30,
    padding: "0 10px",
    border: active ? `1px solid ${color}88` : "1px solid #496174",
    borderRadius: 7,
    background: active ? `${color}1A` : "transparent",
    color: active ? color : "#A8BBC9",
    fontFamily: "Inter,sans-serif",
    fontSize: 9,
    fontWeight: 750,
    cursor: "pointer",
  }
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
