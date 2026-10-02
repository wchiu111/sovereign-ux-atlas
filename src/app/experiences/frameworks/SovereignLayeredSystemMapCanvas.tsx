import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { Minus, Plus, Scan, X } from "lucide-react";
import {
  SOVEREIGN_UX_LAYERS,
  SOVEREIGN_UX_LAYER_PROFESSIONAL_BOUNDARY,
  type SovereignLayer,
  type SovereignLayerId,
  type SovereignThresholdLayer,
} from "../../content/frameworks/sovereign-ux-layers";
import { readerSemanticColor } from "../shared/readerSemanticPalette";

// ─── Constants ────────────────────────────────────────────────────────────────

const WORLD_W = 2100;
const WORLD_H = 1340;
const CENTER_X = 950;
const CENTER_Y = 660;
const OPENING_SCALE = 1;
const MIN_SCALE = 0.1;
const MAX_SCALE = 2.8;
const DETAIL_PANEL_W = 380;

// ─── Types ────────────────────────────────────────────────────────────────────

type LayerGroup =
  | "surface"
  | "reflective"
  | "interaction"
  | "temporal"
  | "systemic"
  | "threshold";

interface LayerVisualDef {
  id: SovereignLayerId;
  group: LayerGroup;
  x: number;
  y: number;
}

type LayerDef = SovereignLayer & LayerVisualDef & { label: string };

interface EdgeDef {
  from: "center" | SovereignLayerId;
  to: SovereignLayerId;
  strength: "primary" | "secondary";
}

interface ViewState {
  x: number;
  y: number;
  scale: number;
}

type TransitionPhase = "entering" | "open" | "exiting";

// ─── Visual map regions ───────────────────────────────────────────────────────
// These groups organize the spatial field. They are not the framework taxonomy.
// Canonical taxonomy lives in sovereign-ux-layers.ts as General Practice / Threshold.

const GROUP_COLOR: Record<LayerGroup, string> = {
  surface:     "#7CB4D5",
  reflective:  "#C8826E",
  interaction: "#76C79A",
  temporal:    "#A78BDB",
  systemic:    "#9B8AC8",
  threshold:   "#E1C35C",
};

const MAP_REGION_LABEL: Record<LayerGroup, string> = {
  surface:     "Surface",
  reflective:  "Reflective",
  interaction: "Interaction",
  temporal:    "Temporal",
  systemic:    "Systemic",
  threshold:   "Threshold",
};

// Spatial coordinates remain intentionally separate from canonical layer content.
const LAYER_VISUALS: readonly LayerVisualDef[] = [
  { id: "interface",               group: "surface",     x: 648,  y: 354 },
  { id: "emotion",                 group: "surface",     x: 868,  y: 268 },
  { id: "memory",                  group: "surface",     x: 1098, y: 268 },
  { id: "reflection",              group: "reflective",  x: 694,  y: 534 },
  { id: "reciprocity",             group: "interaction", x: 1238, y: 444 },
  { id: "friction",                group: "interaction", x: 542,  y: 658 },
  { id: "imprint",                 group: "interaction", x: 1338, y: 590 },
  { id: "future-signal",           group: "temporal",    x: 754,  y: 874 },
  { id: "relational-field",        group: "temporal",    x: 1138, y: 898 },
  { id: "cultural-context",        group: "systemic",    x: 418,  y: 468 },
  { id: "transformation",          group: "systemic",    x: 1528, y: 378 },
  { id: "sustainability",          group: "systemic",    x: 448,  y: 798 },
  { id: "pattern-mirror",          group: "systemic",    x: 1468, y: 592 },
  { id: "atmosphere",              group: "systemic",    x: 954,  y: 1028 },
  { id: "distortion-detection",    group: "threshold",   x: 1328, y: 254 },
  { id: "hidden-influence",        group: "threshold",   x: 1538, y: 290 },
  { id: "longitudinal-reflection", group: "threshold",   x: 1688, y: 418 },
  { id: "flow-state",              group: "threshold",   x: 1678, y: 568 },
  { id: "coherence-alignment",     group: "threshold",   x: 1568, y: 688 },
] as const;

const VISUAL_BY_ID = new Map(LAYER_VISUALS.map((layer) => [layer.id, layer] as const));

const LAYERS: LayerDef[] = SOVEREIGN_UX_LAYERS.map((layer) => {
  const visual = VISUAL_BY_ID.get(layer.id);
  if (!visual) throw new Error(`Missing visual definition for Sovereign UX layer: ${layer.id}`);
  return { ...layer, ...visual, label: layer.title };
});

const LAYER_BY_ID = Object.fromEntries(
  LAYERS.map((layer) => [layer.id, layer]),
) as Partial<Record<SovereignLayerId, LayerDef>>;

// Relationships indicate diagnostically meaningful adjacency, not causal progression.
// Threshold Layers connect to the General Practice conditions that may surface them;
// they do not form an implied maturity or escalation ladder.
const EDGES: EdgeDef[] = [
  { from: "center", to: "reflection", strength: "primary" },
  { from: "center", to: "interface", strength: "secondary" },
  { from: "center", to: "reciprocity", strength: "secondary" },
  { from: "center", to: "future-signal", strength: "secondary" },
  { from: "center", to: "atmosphere", strength: "secondary" },

  { from: "interface", to: "emotion", strength: "secondary" },
  { from: "interface", to: "friction", strength: "secondary" },
  { from: "interface", to: "pattern-mirror", strength: "secondary" },
  { from: "emotion", to: "imprint", strength: "primary" },
  { from: "emotion", to: "atmosphere", strength: "secondary" },
  { from: "memory", to: "reflection", strength: "primary" },
  { from: "memory", to: "future-signal", strength: "secondary" },
  { from: "reflection", to: "reciprocity", strength: "primary" },
  { from: "reflection", to: "future-signal", strength: "secondary" },
  { from: "reciprocity", to: "relational-field", strength: "primary" },
  { from: "friction", to: "imprint", strength: "secondary" },
  { from: "future-signal", to: "relational-field", strength: "secondary" },
  { from: "cultural-context", to: "interface", strength: "secondary" },
  { from: "cultural-context", to: "relational-field", strength: "secondary" },
  { from: "cultural-context", to: "atmosphere", strength: "secondary" },
  { from: "transformation", to: "imprint", strength: "secondary" },
  { from: "transformation", to: "sustainability", strength: "primary" },
  { from: "pattern-mirror", to: "atmosphere", strength: "secondary" },

  // Threshold activations — independent diagnostic hazard lights.
  { from: "emotion", to: "distortion-detection", strength: "secondary" },
  { from: "reflection", to: "distortion-detection", strength: "primary" },
  { from: "friction", to: "distortion-detection", strength: "secondary" },
  { from: "future-signal", to: "distortion-detection", strength: "secondary" },

  { from: "interface", to: "hidden-influence", strength: "secondary" },
  { from: "future-signal", to: "hidden-influence", strength: "primary" },
  { from: "relational-field", to: "hidden-influence", strength: "secondary" },
  { from: "pattern-mirror", to: "hidden-influence", strength: "secondary" },

  { from: "memory", to: "longitudinal-reflection", strength: "primary" },
  { from: "imprint", to: "longitudinal-reflection", strength: "primary" },
  { from: "transformation", to: "longitudinal-reflection", strength: "secondary" },
  { from: "sustainability", to: "longitudinal-reflection", strength: "secondary" },

  { from: "friction", to: "flow-state", strength: "secondary" },
  { from: "atmosphere", to: "flow-state", strength: "primary" },
  { from: "emotion", to: "flow-state", strength: "secondary" },

  { from: "reflection", to: "coherence-alignment", strength: "primary" },
  { from: "reciprocity", to: "coherence-alignment", strength: "secondary" },
  { from: "relational-field", to: "coherence-alignment", strength: "secondary" },
  { from: "atmosphere", to: "coherence-alignment", strength: "secondary" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

// Screen-space stable world-coordinate font size.
// Computes world-space size that yields ~target screen pixels at current scale,
// clamped to [lo, hi] world units so labels remain readable at extreme zoom levels.
function ssFontSize(target: number, scale: number, lo: number, hi: number): number {
  return clamp(target / scale, lo, hi);
}

function edgePos(id: "center" | SovereignLayerId): { x: number; y: number } {
  if (id === "center") return { x: CENTER_X, y: CENTER_Y };
  const layer = LAYER_BY_ID[id];
  return layer ? { x: layer.x, y: layer.y } : { x: CENTER_X, y: CENTER_Y };
}

function edgeColor(id: "center" | SovereignLayerId): string {
  if (id === "center") return "#C8A96E";
  return GROUP_COLOR[LAYER_BY_ID[id]?.group ?? "surface"];
}

const LAYER_CONNECTION_DEGREE = EDGES.reduce<Record<string, number>>((degree, edge) => {
  if (edge.from !== "center") degree[edge.from] = (degree[edge.from] ?? 0) + 1;
  degree[edge.to] = (degree[edge.to] ?? 0) + 1;
  return degree;
}, {});

function resolveLayerNodeSize(layer: LayerDef): number {
  const degree = LAYER_CONNECTION_DEGREE[layer.id] ?? 1;
  const sizeByDegree: Record<number, number> = {
    1: 36,
    2: 44,
    3: 52,
    4: 62,
    5: 72,
    6: 80,
    7: 82,
    8: 82,
  };

  const groupAdjustment: Record<LayerGroup, number> = {
    surface: 0,
    reflective: 8,
    interaction: 2,
    temporal: 0,
    systemic: -2,
    threshold: -4,
  };

  return clamp((sizeByDegree[degree] ?? 82) + groupAdjustment[layer.group], 34, 82);
}

// ─── LayerNode ────────────────────────────────────────────────────────────────

function LayerNode({
  layer,
  isActive,
  isHovered,
  isNeighbor,
  isDimmed,
  viewScale,
  onActivate,
  onPreview,
}: {
  layer: LayerDef;
  isActive: boolean;
  isHovered: boolean;
  isNeighbor: boolean;
  isDimmed: boolean;
  viewScale: number;
  onActivate: (layer: LayerDef) => void;
  onPreview: (layer: LayerDef | null) => void;
}) {
  const color = GROUP_COLOR[layer.group];
  const isReflection = layer.id === "reflection";
  const isThreshold = layer.band === "threshold";
  const size = resolveLayerNodeSize(layer);
  const nodeNumberFontSize = clamp(
    size * (isThreshold ? 0.34 : 0.24),
    11,
    isThreshold ? 18 : 17,
  );
  const labelFontSize = ssFontSize(
    isReflection ? 10 : 9.5,
    viewScale,
    7.5,
    isReflection ? 14 : 13,
  );

  return (
    <div
      style={{
        position: "absolute",
        left: layer.x,
        top: layer.y,
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 9,
        zIndex: isActive ? 10 : isHovered ? 8 : 4,
        opacity: isDimmed ? 0.2 : isNeighbor ? 0.92 : 1,
        transition: "opacity 280ms ease, filter 280ms ease",
        filter: isActive || isHovered ? "brightness(1.08)" : "none",
      }}
    >
      {isActive && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            width: size + 44,
            height: size + 44,
            transform: "translate(-50%, calc(-50% + 3px))",
            borderRadius: "50%",
            border: `1px solid ${color}54`,
            background: `${color}0C`,
            boxShadow: `0 0 56px ${color}38, 0 0 110px ${color}15`,
            pointerEvents: "none",
          }}
        />
      )}

      <button
        type="button"
        data-canvas-control
        data-layer-node
        onClick={() => onActivate(layer)}
        onMouseEnter={() => onPreview(layer)}
        onMouseLeave={() => onPreview(null)}
        onFocus={() => onPreview(layer)}
        onBlur={() => onPreview(null)}
        aria-label={`Layer ${layer.number}: ${layer.label}`}
        aria-pressed={isActive}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `${isReflection ? 2 : 1.5}px solid ${
            isActive ? color : isNeighbor ? color + "B0" : color + "90"
          }`,
          background: isActive
            ? `radial-gradient(circle at 38% 32%, ${color}2C, ${color}12 48%, ${color}06 72%)`
            : isHovered || isNeighbor
              ? `radial-gradient(circle at 38% 32%, ${color}1F, ${color}0D 50%, ${color}05 74%)`
              : `radial-gradient(circle at 38% 32%, ${color}15, ${color}08 52%, ${color}03 76%)`,
          boxShadow: isActive
            ? `0 0 0 6px ${color}1E, 0 0 34px ${color}50, 0 0 72px ${color}1D, 0 14px 32px rgba(0,0,0,0.4)`
            : isHovered
              ? `0 0 0 4px ${color}13, 0 0 28px ${color}3D, 0 10px 24px rgba(0,0,0,0.30)`
              : isReflection
                ? `0 0 22px ${color}2E, 0 8px 20px rgba(0,0,0,0.28)`
                : `0 0 18px ${color}16, 0 6px 14px rgba(0,0,0,0.22)`,
          color: isActive
            ? color
            : isHovered
              ? color
              : isNeighbor
                ? color + "D4"
                : color + "C0",
          fontFamily: "'DM Mono', monospace",
          fontSize: nodeNumberFontSize,
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 200ms cubic-bezier(0.16,1,0.3,1)",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: isThreshold ? 8 : 6,
            borderRadius: "50%",
            background: `radial-gradient(circle at 38% 34%, ${color}2A 0%, ${color}12 42%, transparent 72%)`,
            boxShadow: `inset 0 0 0 1px ${color}18`,
            pointerEvents: "none",
          }}
        />
        <span style={{ position: "relative", zIndex: 1 }}>
          {isThreshold ? "◆" : layer.number}
        </span>
        {isReflection && (
          <span
            aria-hidden
            data-echo-ring
            style={{
              position: "absolute",
              inset: -10,
              borderRadius: "50%",
              border: `1px solid ${color}38`,
              animation: "echoRingPulse 3.2s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
        )}
      </button>

      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: labelFontSize,
          letterSpacing: "0.15em",
          color: isActive
            ? readerSemanticColor.text.primary
            : isHovered || isNeighbor
              ? readerSemanticColor.text.secondary
              : readerSemanticColor.text.inactive,
          textAlign: "center",
          lineHeight: 1.35,
          maxWidth: isReflection ? 104 : 92,
          transition: "color 200ms ease",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {layer.label.toUpperCase()}
        {isReflection && (
          <div
            style={{
              marginTop: 2,
              color,
              fontSize: ssFontSize(7.5, viewScale, 6.5, 10),
              letterSpacing: "0.12em",
            }}
          >
            HISTORICAL · ECHO
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LayerDetailPanel ─────────────────────────────────────────────────────────

function LayerDetailPanel({
  layer,
  onClose,
}: {
  layer: LayerDef;
  onClose: () => void;
}) {
  const color = GROUP_COLOR[layer.group];
  const isThreshold = layer.band === "threshold";

  return (
    <div
      data-canvas-control
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: DETAIL_PANEL_W,
        zIndex: 30,
        background:
          "linear-gradient(180deg, rgba(8,11,20,0.99), rgba(5,8,16,0.99))",
        borderLeft: `1px solid ${color}28`,
        overflowY: "auto",
        scrollbarWidth: "none",
        display: "flex",
        flexDirection: "column",
        animation: "detailSlideIn 240ms cubic-bezier(0.16,1,0.3,1) both",
      }}
    >
      <div
        style={{
          padding: "22px 22px 18px",
          borderBottom: `1px solid ${color}1A`,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 14,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              border: `2px solid ${color}`,
              background: `${color}14`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'DM Mono', monospace",
              fontSize: isThreshold ? 18 : 13,
              color,
              flexShrink: 0,
              boxShadow: `0 0 18px ${color}28`,
            }}
          >
            {isThreshold ? "◆" : layer.number}
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 9,
                letterSpacing: "0.24em",
                color,
                marginBottom: 5,
                opacity: 0.82,
              }}
            >
              {isThreshold ? "THRESHOLD LAYER" : "GENERAL PRACTICE LAYER"}
            </div>
            <div
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 24,
                lineHeight: 1.08,
                color: readerSemanticColor.text.primary,
                fontWeight: 500,
              }}
            >
              {layer.label}
            </div>
          </div>
        </div>

        <button
          type="button"
          data-canvas-control
          onClick={onClose}
          aria-label="Close layer detail"
          style={{
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "1px solid rgba(200,180,130,0.22)",
            color: readerSemanticColor.text.metadata,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <X size={12} />
        </button>
      </div>

      <div style={{ flex: 1, padding: "20px 22px 32px" }}>
        {layer.band === "threshold" ? (
          <ThresholdLayerDetail layer={layer} color={color} />
        ) : (
          <GeneralPracticeLayerDetail layer={layer} color={color} />
        )}

        <div
          style={{
            marginTop: 32,
            paddingTop: 16,
            borderTop: "1px solid rgba(200,180,130,0.08)",
            display: "grid",
            gridTemplateColumns: "1.15fr .72fr 1fr",
            gap: 18,
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.16em",
          }}
        >
          <MetaValue
            label="TYPE"
            value={isThreshold ? "Threshold Layer" : "General Practice"}
            color={isThreshold ? color : readerSemanticColor.text.secondary}
          />
          <MetaValue label="LAYER" value={`${layer.number} of 19`} color={color} />
          <MetaValue
            label="MAP REGION"
            value={MAP_REGION_LABEL[layer.group]}
            color={readerSemanticColor.text.secondary}
          />
        </div>
      </div>
    </div>
  );
}

function GeneralPracticeLayerDetail({
  layer,
  color,
}: {
  layer: Extract<LayerDef, { band: "general-practice" }>;
  color: string;
}) {
  return (
    <>
      <Section label="WHAT IT IS" color={color}>
        {layer.definition}
      </Section>

      <Divider />

      <Section label="IN PRACTICE" color={color}>
        {layer.inPractice}
      </Section>

      <Divider />

      <div style={{ marginBottom: 24 }}>
        <SectionLabel color={readerSemanticColor.text.metadata}>
          DIAGNOSTIC QUESTION
        </SectionLabel>
        <div
          style={{
            padding: "13px 15px",
            border: `1px solid ${color}24`,
            background: `${color}06`,
            fontFamily: "'EB Garamond', serif",
            fontSize: 16,
            lineHeight: 1.68,
            color: readerSemanticColor.text.secondary,
          }}
        >
          {layer.diagnosticQuestion}
        </div>
      </div>

      {layer.historicalAlias && layer.lineage && (
        <>
          <Divider />
          <div>
            <SectionLabel color={readerSemanticColor.text.metadata}>
              HISTORICAL NAME · {layer.historicalAlias.toUpperCase()}
            </SectionLabel>
            <div
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 15,
                lineHeight: 1.7,
                color: readerSemanticColor.text.caption,
                fontStyle: "italic",
              }}
            >
              {layer.lineage}
            </div>
          </div>
        </>
      )}
    </>
  );
}

function ThresholdLayerDetail({
  layer,
  color,
}: {
  layer: SovereignThresholdLayer & LayerVisualDef & { label: string };
  color: string;
}) {
  return (
    <>
      <div
        style={{
          marginBottom: 22,
          padding: "12px 13px",
          border: `1px solid ${color}48`,
          background: `${color}0A`,
          color,
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          lineHeight: 1.45,
          letterSpacing: "0.18em",
        }}
      >
        DIAGNOSTIC SIGNAL · NOT A DESIGN TOOL
      </div>

      <Section label="SIGNAL" color={color}>
        {layer.signal}
      </Section>

      <Divider />

      <Section label="WHY IT MATTERS" color={color}>
        {layer.whyItMatters}
      </Section>

      <Divider />

      <div style={{ marginBottom: 24 }}>
        <SectionLabel color={color}>RESPONSE</SectionLabel>
        <div style={{ display: "grid", gap: 8 }}>
          {layer.response.map((item) => (
            <div
              key={item}
              style={{
                display: "grid",
                gridTemplateColumns: "12px 1fr",
                gap: 8,
                alignItems: "start",
                color: readerSemanticColor.text.secondary,
                fontFamily: "'EB Garamond', serif",
                fontSize: 15.5,
                lineHeight: 1.48,
              }}
            >
              <span aria-hidden style={{ color, transform: "translateY(1px)" }}>·</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      <div style={{ marginBottom: 24 }}>
        <SectionLabel color={readerSemanticColor.text.metadata}>DO NOT</SectionLabel>
        <div
          style={{
            padding: "13px 15px",
            border: "1px solid rgba(216,108,97,0.18)",
            background: "rgba(216,108,97,0.035)",
            color: readerSemanticColor.text.secondary,
            fontFamily: "'EB Garamond', serif",
            fontSize: 15.5,
            lineHeight: 1.6,
          }}
        >
          {layer.doNot}
        </div>
      </div>

      <div
        style={{
          marginTop: 26,
          paddingTop: 14,
          borderTop: `1px solid ${color}1A`,
          color: color,
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          lineHeight: 1.6,
          letterSpacing: "0.16em",
        }}
      >
        PAUSE · DOCUMENT · ESCALATE
      </div>
    </>
  );
}

function SectionLabel({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <div
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 9,
        letterSpacing: "0.24em",
        color,
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

function Section({
  label,
  color,
  children,
}: {
  label: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 22 }}>
      <SectionLabel color={color}>{label}</SectionLabel>
      <div
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: 16,
          lineHeight: 1.72,
          color: readerSemanticColor.text.secondary,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function MetaValue({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div>
      <div style={{ color: readerSemanticColor.text.metadata, marginBottom: 5 }}>
        {label}
      </div>
      <div style={{ color, fontSize: 10, lineHeight: 1.45 }}>{value}</div>
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: 1,
        background: "rgba(200,180,130,0.07)",
        marginBottom: 22,
      }}
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  frameworkTitle: string;
  sectionTitle: string;
  onClose: () => void;
}

export default function SovereignLayeredSystemMapCanvas({
  frameworkTitle,
  sectionTitle,
  onClose,
}: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const hasInteractedRef = useRef(false);
  const closeTimerRef = useRef<number | null>(null);
  const resolveTimerRef = useRef<number | null>(null);
  // Refs for use in stable callbacks — avoids stale closure issues
  const activeLayerRef = useRef<LayerDef | null>(null);
  const viewRef = useRef<ViewState>({ x: 0, y: 0, scale: OPENING_SCALE });
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const [view, setView] = useState<ViewState>({ x: 0, y: 0, scale: OPENING_SCALE });
  const [dragging, setDragging] = useState(false);
  const [activeLayer, setActiveLayer] = useState<LayerDef | null>(null);
  const [hoverLayer, setHoverLayer] = useState<LayerDef | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [transitionPhase, setTransitionPhase] =
    useState<TransitionPhase>("entering");

  // Keep refs current on every render
  activeLayerRef.current = activeLayer;
  viewRef.current = view;

  // Hover previews the local neighborhood; a locked selection takes priority.
  const focusLayer = activeLayer ?? hoverLayer;

  const connectedIds = useMemo(() => {
    if (!focusLayer) return null;
    const ids = new Set<string>();
    EDGES.forEach((edge) => {
      if (edge.from === focusLayer.id) ids.add(edge.to);
      if (edge.to === focusLayer.id) ids.add(edge.from);
    });
    return ids;
  }, [focusLayer]);

  const handlePreviewLayer = useCallback((layer: LayerDef | null) => {
    if (activeLayerRef.current) return;
    setHoverLayer(layer);
  }, []);

  // Semantic zoom tier: drives opacity hierarchy across far / mid / close views
  const zoomTier = view.scale < 0.38 ? "far" : view.scale < 0.88 ? "mid" : "close";
  const zoomOpacity =
    zoomTier === "far"
      ? { nodeLabel: 0.44, regionLabel: 0.80, edgeMult: 0.70 }
      : zoomTier === "close"
      ? { nodeLabel: 1.00, regionLabel: 0.24, edgeMult: 0.88 }
      : { nodeLabel: 1.00, regionLabel: 0.82, edgeMult: 1.00 };

  const setOpeningView = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const rect = vp.getBoundingClientRect();

    // Enter at 1:1 with the Sovereign UX core centered. The wider diagnostic
    // field intentionally extends beyond the frame and remains explorable.
    setView({
      scale: OPENING_SCALE,
      x: rect.width / 2 - CENTER_X * OPENING_SCALE,
      y: rect.height / 2 - CENTER_Y * OPENING_SCALE,
    });
  }, []);

  // Panel-aware Fit All: excludes panel width from available area when open,
  // uses tighter padding so the graph fills more of the viewport.
  const fitAll = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const rect = vp.getBoundingClientRect();
    const panelOpen = activeLayerRef.current !== null;
    const availW = panelOpen ? rect.width - DETAIL_PANEL_W : rect.width;
    const hPad = 48;
    const vPad = 68;
    const scale = clamp(
      Math.min(
        (availW - hPad * 2) / WORLD_W,
        (rect.height - vPad * 2) / WORLD_H,
      ),
      MIN_SCALE,
      0.88,
    );
    hasInteractedRef.current = true;
    setHasInteracted(true);
    setView({
      scale,
      x: hPad + (availW - hPad * 2 - WORLD_W * scale) / 2,
      y: vPad + (rect.height - vPad * 2 - WORLD_H * scale) / 2,
    });
  }, []);

  useEffect(() => {
    setOpeningView();
    const handleResize = () => {
      if (!hasInteractedRef.current) setOpeningView();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setOpeningView]);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    resolveTimerRef.current = window.setTimeout(
      () => setTransitionPhase("open"),
      reducedMotion ? 240 : 1260,
    );
    return () => {
      if (resolveTimerRef.current != null) clearTimeout(resolveTimerRef.current);
      if (closeTimerRef.current != null) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const requestClose = useCallback(() => {
    if (transitionPhase === "exiting") return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setActiveLayer(null);
    setTransitionPhase("exiting");
    closeTimerRef.current = window.setTimeout(
      onClose,
      reducedMotion ? 240 : 920,
    );
  }, [onClose, transitionPhase]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeLayer) { setActiveLayer(null); return; }
        requestClose();
        return;
      }
      if (e.key === "0") { e.preventDefault(); fitAll(); }
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        hasInteractedRef.current = true;
        setView((v) => ({ ...v, scale: clamp(v.scale * 1.18, MIN_SCALE, MAX_SCALE) }));
      }
      if (e.key === "-") {
        e.preventDefault();
        hasInteractedRef.current = true;
        setView((v) => ({ ...v, scale: clamp(v.scale / 1.18, MIN_SCALE, MAX_SCALE) }));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeLayer, fitAll, requestClose]);

  const zoomAt = useCallback(
    (nextScale: number, clientX?: number, clientY?: number) => {
      const vp = viewportRef.current;
      if (!vp) return;
      const rect = vp.getBoundingClientRect();
      hasInteractedRef.current = true;
      setView((cur) => {
        const scale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
        const ax = clientX != null ? clientX - rect.left : rect.width / 2;
        const ay = clientY != null ? clientY - rect.top : rect.height / 2;
        const wx = (ax - cur.x) / cur.scale;
        const wy = (ay - cur.y) / cur.scale;
        return { scale, x: ax - wx * scale, y: ay - wy * scale };
      });
    },
    [],
  );

  const handleWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      setHasInteracted(true);
    }
    zoomAt(view.scale * Math.exp(-e.deltaY * 0.0013), e.clientX, e.clientY);
  };

  // Node activation: preserves camera position, only nudges when the node would
  // be hidden behind the detail panel or clipped by a viewport edge.
  const handleActivateLayer = useCallback((layer: LayerDef) => {
    setHoverLayer(null);
    setActiveLayer(layer);

    const vp = viewportRef.current;
    if (!vp) return;
    const rect = vp.getBoundingClientRect();
    const v = viewRef.current;

    const sx = v.x + layer.x * v.scale;
    const sy = v.y + layer.y * v.scale;

    const headerH = 88;
    const margin = 60;
    const bottomMargin = 74;
    const rightBound = rect.width - DETAIL_PANEL_W - margin;

    let dx = 0;
    let dy = 0;

    if (sx > rightBound)      dx = -(sx - rightBound + 36);
    else if (sx < margin)     dx = margin - sx + 24;

    if (sy < headerH + margin)            dy = headerH + margin - sy + 24;
    else if (sy > rect.height - bottomMargin) dy = -(sy - rect.height + bottomMargin + 24);

    if (dx !== 0 || dy !== 0) {
      setView((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    }
  }, []);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("[data-canvas-control]")) return;
    hasInteractedRef.current = true;
    setHasInteracted(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: view.x,
      originY: view.y,
    };
    setDragging(true);
    setActiveLayer(null);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    setView((v) => ({
      ...v,
      x: drag.originX + e.clientX - drag.startX,
      y: drag.originY + e.clientY - drag.startY,
    }));
  };

  const handlePointerEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== e.pointerId) return;
    dragRef.current = null;
    setDragging(false);
  };

  // Precompute screen-stable font sizes for SVG region labels
  const regionFs = ssFontSize(21, view.scale, 13, 30);
  const regionFsSub = ssFontSize(10, view.scale, 8.5, 12);

  return (
    <div
      data-lsc-root
      data-transition-phase={transitionPhase}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 80,
        background: "#000",
        color: readerSemanticColor.text.primary,
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes lscEnter { from { opacity:0 } to { opacity:1 } }
        @keyframes lscReveal {
          0%,18% { opacity:0; transform:scale(.972); filter:blur(9px) brightness(.34); }
          62% { opacity:.72; filter:blur(2px) brightness(.72); }
          100% { opacity:1; transform:scale(1); filter:blur(0) brightness(1); }
        }
        @keyframes lscRecede {
          from { opacity:1; transform:scale(1); filter:blur(0) brightness(1); }
          to { opacity:0; transform:scale(.974); filter:blur(8px) brightness(.32); }
        }
        @keyframes lscExit { from { opacity:1 } to { opacity:0 } }
        @keyframes echoRingPulse {
          0%,100% { opacity:0.26; transform:scale(1); }
          50% { opacity:0.58; transform:scale(1.22); }
        }
        @keyframes centralPulse {
          0%,100% { opacity:0.72; transform:translate(-50%,-50%) scale(1); }
          50% { opacity:1; transform:translate(-50%,-50%) scale(1.05); }
        }
        @keyframes detailSlideIn {
          from { opacity:0; transform:translateX(18px) }
          to { opacity:1; transform:none }
        }
        [data-lsc-root][data-transition-phase="entering"] {
          animation: lscEnter 320ms ease-out both;
        }
        [data-lsc-root][data-transition-phase="entering"] [data-portal-content] {
          animation: lscReveal 900ms 320ms cubic-bezier(.16,1,.3,1) both;
        }
        [data-lsc-root][data-transition-phase="exiting"] {
          animation: lscExit 300ms 590ms ease-in both;
          pointer-events:none;
        }
        [data-lsc-root][data-transition-phase="exiting"] [data-portal-content] {
          animation: lscRecede 560ms cubic-bezier(.4,0,.7,.2) both;
        }
        [data-layer-node]:focus-visible {
          outline: 1px solid rgba(255,248,230,0.86);
          outline-offset: 5px;
        }
        @media (prefers-reduced-motion:reduce) {
          [data-lsc-root],[data-portal-content] {
            animation-duration:220ms!important;
            animation-delay:0ms!important;
            filter:none!important;
            transform:none!important;
          }
          [data-echo-ring],[data-central-pulse] {
            animation:none!important;
          }
        }
      `}</style>

      <div
        data-portal-content
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          background:
            "radial-gradient(circle at 18% 22%, rgba(45,33,68,0.18), transparent 34%), " +
            "radial-gradient(circle at 78% 30%, rgba(20,65,68,0.12), transparent 35%), #04060B",
          transformOrigin: "50% 46%",
          willChange: "opacity, transform, filter",
        }}
      >
        {/* ── Header ── */}
        <header
          data-canvas-control
          style={{
            position: "absolute",
            inset: "0 0 auto 0",
            zIndex: 20,
            minHeight: 100,
            padding: "18px 28px 20px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 32,
            background:
              "linear-gradient(180deg, rgba(4,6,11,0.98), rgba(4,6,11,0.84), transparent)",
            pointerEvents: "none",
          }}
        >
          <div>
            {/* Eyebrow dims once the user begins exploring — map field becomes primary */}
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.22em",
                color: readerSemanticColor.utility.primary,
                marginBottom: 7,
                opacity: hasInteracted ? 0.72 : 1,
                transition: "opacity 1000ms ease",
              }}
            >
              {frameworkTitle.toUpperCase()} · {sectionTitle.toUpperCase()}
            </div>
            <div
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 28,
                lineHeight: 1.08,
                color: readerSemanticColor.text.primary,
                marginBottom: 5,
              }}
            >
              Layered System Diagnostic Map
            </div>
            {/* Subtitle fades more strongly after first interaction */}
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.14em",
                color: readerSemanticColor.text.metadata,
                opacity: hasInteracted ? 0.72 : 1,
                transition: "opacity 1000ms ease",
              }}
            >
              14 General Practice Layers · 5 Threshold Layers · Click any node to read
            </div>
          </div>

          <button
            type="button"
            data-canvas-control
            onClick={requestClose}
            style={{
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              gap: 10,
              minHeight: 40,
              padding: "0 14px",
              color: readerSemanticColor.utility.primary,
              border: "1px solid rgba(200,180,130,0.42)",
              background: "rgba(7,9,15,0.72)",
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.18em",
              cursor: "pointer",
            }}
          >
            <span style={{ lineHeight: 1, transform: "translateY(1px)" }}>
              BACK TO FRAMEWORK
            </span>
            <X size={13} />
          </button>
        </header>

        {/* ── Canvas viewport ── */}
        <div
          ref={viewportRef}
          role="application"
          aria-label="Sovereign UX Layered System — free-roaming diagnostic map"
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            cursor: dragging ? "grabbing" : "grab",
            touchAction: "none",
            backgroundImage:
              "linear-gradient(rgba(130,160,155,0.026) 1px, transparent 1px), " +
              "linear-gradient(90deg, rgba(130,160,155,0.026) 1px, transparent 1px), " +
              "radial-gradient(circle, rgba(255,248,230,0.20) 0 1px, transparent 1.5px)",
            backgroundSize: "160px 160px, 160px 160px, 112px 112px",
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
              transform: `translate3d(${view.x}px,${view.y}px,0) scale(${view.scale})`,
              willChange: "transform",
            }}
          >
            {/* ── Territorial atmosphere — spatial organization, not taxonomy ── */}
            <div aria-hidden style={{
              position: "absolute", left: 430, top: 118, width: 820, height: 470,
              borderRadius: "50%", transform: "rotate(-7deg)",
              background: "radial-gradient(ellipse at center, rgba(124,180,213,0.075) 0%, rgba(124,180,213,0.030) 42%, transparent 72%)",
              filter: "blur(2px)", pointerEvents: "none"
            }} />
            <div aria-hidden style={{
              position: "absolute", left: 220, top: 330, width: 640, height: 690,
              borderRadius: "48%", transform: "rotate(8deg)",
              background: "radial-gradient(ellipse at center, rgba(155,138,200,0.065) 0%, rgba(155,138,200,0.024) 44%, transparent 72%)",
              filter: "blur(3px)", pointerEvents: "none"
            }} />
            <div aria-hidden style={{
              position: "absolute", left: 590, top: 700, width: 760, height: 430,
              borderRadius: "50%", transform: "rotate(4deg)",
              background: "radial-gradient(ellipse at center, rgba(167,139,219,0.060) 0%, rgba(167,139,219,0.022) 46%, transparent 74%)",
              filter: "blur(3px)", pointerEvents: "none"
            }} />
            <div aria-hidden style={{
              position: "absolute", left: 1165, top: 100, width: 690, height: 720,
              borderRadius: "44%", transform: "rotate(-2deg)",
              background: "radial-gradient(ellipse at center, rgba(225,195,92,0.052) 0%, rgba(225,195,92,0.020) 48%, transparent 76%)",
              filter: "blur(2px)", pointerEvents: "none"
            }} />

            {/* ── Nebula glows ── */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: CENTER_X - 340,
                top: CENTER_Y - 340,
                width: 680,
                height: 680,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(200,169,110,0.08) 0%, rgba(200,169,110,0.03) 38%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: 530,
                top: 320,
                width: 360,
                height: 360,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(200,130,110,0.05) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: 1220,
                top: 150,
                width: 540,
                height: 540,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(225,195,92,0.04) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: 360,
                top: 580,
                width: 280,
                height: 280,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(155,138,200,0.04) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            {/* ── SVG: connections + region labels ── */}
            <svg
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                overflow: "visible",
              }}
              width={WORLD_W}
              height={WORLD_H}
            >
              <defs>
                {EDGES.map((edge, i) => {
                  const from = edgePos(edge.from);
                  const to = edgePos(edge.to);
                  return (
                    <linearGradient
                      key={`gradient-${i}`}
                      id={`sux-edge-gradient-${i}`}
                      gradientUnits="userSpaceOnUse"
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                    >
                      <stop offset="0%" stopColor={edgeColor(edge.from)} stopOpacity="0.95" />
                      <stop offset="100%" stopColor={edgeColor(edge.to)} stopOpacity="0.95" />
                    </linearGradient>
                  );
                })}
              </defs>

              {/* Gravity field: quiet orbital structure around the Sovereign UX core */}
              <g
                fill="none"
                stroke="rgba(200,169,110,0.12)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
                opacity={focusLayer ? 0.18 : zoomTier === "close" ? 0.22 : 0.42}
                style={{ transition: "opacity 280ms ease" }}
              >
                <circle cx={CENTER_X} cy={CENTER_Y} r={190} strokeDasharray="2 10" />
                <circle cx={CENTER_X} cy={CENTER_Y} r={330} strokeDasharray="1 15" />
                <circle cx={CENTER_X} cy={CENTER_Y} r={505} strokeDasharray="2 18" opacity="0.68" />
                <line x1={CENTER_X} y1={CENTER_Y} x2={690} y2={250} opacity="0.28" />
                <line x1={CENTER_X} y1={CENTER_Y} x2={430} y2={610} opacity="0.22" />
                <line x1={CENTER_X} y1={CENTER_Y} x2={930} y2={1060} opacity="0.22" />
                <line x1={CENTER_X} y1={CENTER_Y} x2={1510} y2={430} opacity="0.26" />
              </g>

              {/* Threshold Layers boundary.
                  vectorEffect keeps stroke at 1px screen-space regardless of zoom.
                  Opacity reduces at very close zoom when individual nodes are primary. */}
              <rect
                x={1248}
                y={102}
                width={536}
                height={650}
                rx={18}
                fill={`rgba(225,195,92,${view.scale > 1.4 ? 0.012 : 0.022})`}
                stroke="rgba(225,195,92,0.11)"
                strokeWidth={1}
                strokeDasharray="6 5"
                vectorEffect="non-scaling-stroke"
                style={{
                  opacity: view.scale > 1.8 ? 0.30 : 1,
                  transition: "opacity 300ms ease",
                }}
              />

              {/* Region labels describe spatial neighborhoods, not canonical bands. */}
              <text
                x={520}
                y={260}
                fontFamily="'EB Garamond', Georgia, serif"
                fontStyle="italic"
                fontSize={regionFs}
                letterSpacing="0.10em"
                fill="rgba(124,180,213,0.42)"
                opacity={zoomOpacity.regionLabel}
                style={{ transition: "opacity 300ms ease" }}
              >
                SURFACE
              </text>
              <text
                x={320}
                y={400}
                fontFamily="'EB Garamond', Georgia, serif"
                fontStyle="italic"
                fontSize={regionFs}
                letterSpacing="0.10em"
                fill="rgba(155,138,200,0.38)"
                opacity={zoomOpacity.regionLabel}
                style={{ transition: "opacity 300ms ease" }}
              >
                SYSTEMIC
              </text>
              <text
                x={560}
                y={965}
                fontFamily="'EB Garamond', Georgia, serif"
                fontStyle="italic"
                fontSize={regionFs}
                letterSpacing="0.10em"
                fill="rgba(167,139,219,0.38)"
                opacity={zoomOpacity.regionLabel}
                style={{ transition: "opacity 300ms ease" }}
              >
                TEMPORAL · RELATIONAL
              </text>
              <text
                x={1278}
                y={148}
                fontFamily="'EB Garamond', Georgia, serif"
                fontStyle="italic"
                fontSize={regionFs}
                letterSpacing="0.10em"
                fill="rgba(225,195,92,0.44)"
                opacity={zoomOpacity.regionLabel}
                style={{ transition: "opacity 300ms ease" }}
              >
                THRESHOLD LAYERS
              </text>
              <text
                x={1278}
                y={176}
                fontFamily="'DM Mono', monospace"
                fontSize={regionFsSub}
                letterSpacing="0.06em"
                fill={readerSemanticColor.text.metadata}
                opacity={view.scale > 1.6 ? 0.68 : 0.92}
                style={{ transition: "opacity 300ms ease" }}
              >
                DIAGNOSTIC SIGNALS · NOT DESIGN TOOLS
              </text>
              <text
                x={1278}
                y={730}
                fontFamily="'DM Mono', monospace"
                fontSize={regionFsSub}
                letterSpacing="0.08em"
                fill={readerSemanticColor.utility.primary}
                opacity={view.scale > 1.6 ? 0.54 : 0.82}
                style={{ transition: "opacity 300ms ease" }}
              >
                PROFESSIONAL BOUNDARY · PAUSE · CONSENT · REFER
              </text>

              {/* Connections.
                  vectorEffect="non-scaling-stroke" keeps line thickness in screen pixels
                  so strokes stay restrained at all zoom levels.
                  Neighborhood-aware opacity: direct connections strengthen on selection,
                  unrelated edges dim without disappearing. */}
              {EDGES.map((edge, i) => {
                const from = edgePos(edge.from);
                const to = edgePos(edge.to);
                const baseOpacity =
                  edge.strength === "primary" ? 0.28 : 0.10;

                let strokeOpacity: number;
                if (focusLayer) {
                  const isDirect =
                    edge.from === focusLayer.id || edge.to === focusLayer.id;
                  strokeOpacity = isDirect
                    ? edge.strength === "primary" ? 0.66 : 0.44
                    : baseOpacity * 0.22;
                } else {
                  strokeOpacity = baseOpacity * zoomOpacity.edgeMult;
                }

                const screenWidth = edge.strength === "primary" ? 1.2 : 0.7;

                return (
                  <line
                    key={i}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={`url(#sux-edge-gradient-${i})`}
                    strokeWidth={screenWidth}
                    strokeOpacity={strokeOpacity}
                    vectorEffect="non-scaling-stroke"
                    style={{ transition: "stroke-opacity 240ms ease" }}
                  />
                );
              })}
            </svg>

            {/* ── Central SOVEREIGN UX orb ── */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: CENTER_X,
                top: CENTER_Y,
                pointerEvents: "none",
                zIndex: 2,
              }}
            >
              {/* Pulsing outer glow */}
              <div
                data-central-pulse
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 520,
                  height: 520,
                  transform: "translate(-50%, -50%)",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(200,169,110,0.08) 0%, rgba(200,169,110,0.03) 42%, transparent 70%)",
                  animation: "centralPulse 4.5s ease-in-out infinite",
                }}
              />
              {/* Orbital ring large */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 196,
                  height: 196,
                  transform: "translate(-50%, -50%)",
                  borderRadius: "50%",
                  border: "1px solid rgba(200,169,110,0.13)",
                }}
              />
              {/* Orbital ring medium (tilted ellipse) */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 280,
                  height: 144,
                  transform: "translate(-50%, -50%) rotateX(60deg)",
                  borderRadius: "50%",
                  border: "1px solid rgba(200,169,110,0.08)",
                  borderLeftColor: "transparent",
                  borderRightColor: "transparent",
                }}
              />
              {/* Main orb */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 88,
                  height: 88,
                  transform: "translate(-50%, -50%)",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 38% 34%, rgba(255,232,155,0.92) 0%, rgba(200,169,110,0.74) 28%, rgba(180,130,68,0.38) 58%, transparent 80%)",
                  boxShadow:
                    "0 0 0 1px rgba(200,169,110,0.34), " +
                    "0 0 30px rgba(200,169,110,0.34), " +
                    "0 0 64px rgba(200,169,110,0.16), " +
                    "0 0 120px rgba(200,169,110,0.07)",
                }}
              />
              {/* Label — screen-stable font size */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "calc(50% + 56px)",
                  transform: "translateX(-50%)",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: ssFontSize(10, view.scale, 7.5, 14),
                  letterSpacing: "0.30em",
                  color: readerSemanticColor.utility.primary,
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                SOVEREIGN UX
              </div>
            </div>

            {/* ── Layer nodes ── */}
            {LAYERS.map((layer) => {
              const isActive = activeLayer?.id === layer.id;
              const isHovered = !activeLayer && hoverLayer?.id === layer.id;
              const isNeighbor =
                !isActive &&
                !isHovered &&
                (connectedIds?.has(layer.id) ?? false);
              const isDimmed =
                focusLayer !== null &&
                focusLayer !== undefined &&
                !isActive &&
                !isHovered &&
                !isNeighbor;
              return (
                <LayerNode
                  key={layer.id}
                  layer={layer}
                  isActive={isActive}
                  isHovered={isHovered}
                  isNeighbor={isNeighbor}
                  isDimmed={isDimmed}
                  viewScale={view.scale}
                  onActivate={handleActivateLayer}
                  onPreview={handlePreviewLayer}
                />
              );
            })}
          </div>
        </div>

        <div
          aria-live="off"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0,0,0,0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          {SOVEREIGN_UX_LAYER_PROFESSIONAL_BOUNDARY}
        </div>

        {/* ── Detail panel ── */}
        {activeLayer && (
          <LayerDetailPanel
            layer={activeLayer}
            onClose={() => setActiveLayer(null)}
          />
        )}

        {/* ── Drag hint — fades after first interaction ── */}
        <div
          data-canvas-control
          style={{
            position: "absolute",
            left: 26,
            bottom: 22,
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            gap: 9,
            color: readerSemanticColor.text.metadata,
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.16em",
            pointerEvents: "none",
            opacity: hasInteracted ? 0 : 1,
            transition: "opacity 1200ms ease",
          }}
        >
          <span style={{ fontSize: 14 }}>☝</span>
          DRAG TO EXPLORE · SCROLL TO ZOOM · CLICK A LAYER TO READ
        </div>

        {/* ── Zoom controls — panel-aware centering ──
            When the detail panel is open, shift left by half its width so the toolbar
            centers within the remaining map viewport rather than the full browser window. */}
        <div
          data-canvas-control
          aria-label="Canvas zoom controls"
          style={{
            position: "absolute",
            left: activeLayer ? `calc(50% - ${DETAIL_PANEL_W / 2}px)` : "50%",
            bottom: 18,
            zIndex: 20,
            transform: "translateX(-50%)",
            transition: "left 260ms cubic-bezier(0.16,1,0.3,1)",
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: 5,
            border: "1px solid rgba(200,180,130,0.20)",
            background: "rgba(8,10,17,0.90)",
            boxShadow: "0 12px 36px rgba(0,0,0,0.34)",
          }}
        >
          <button
            type="button"
            data-canvas-control
            aria-label="Zoom out"
            onClick={() => zoomAt(view.scale / 1.18)}
            style={zoomBtnStyle}
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
            style={zoomBtnStyle}
          >
            <Plus size={14} />
          </button>
          <button
            type="button"
            data-canvas-control
            onClick={fitAll}
            style={{ ...zoomBtnStyle, width: "auto", padding: "0 13px" }}
          >
            <Scan size={13} />
            FIT ALL
          </button>
          <button
            type="button"
            data-canvas-control
            onClick={() => zoomAt(1)}
            style={{ ...zoomBtnStyle, width: "auto", padding: "0 13px" }}
          >
            1:1
          </button>
        </div>
      </div>
    </div>
  );
}

const zoomBtnStyle = {
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
