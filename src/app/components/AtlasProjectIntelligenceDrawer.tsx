import { useEffect, useRef, useState } from "react";
import type {
  AtlasResolvedRelationship,
  AtlasStellarType,
} from "../content/types";
import { resolveStellarColor } from "../atlas/constellation/stellarPalette";
import AtlasLineageLink from "../atlas/components/AtlasLineageLink";
import AtlasAssistEntry from "./atlas-assist/AtlasAssistEntry";
import AtlasAssistPanel from "./atlas-assist/AtlasAssistPanel";
import AtlasAssistTrigger from "./atlas-assist/AtlasAssistTrigger";
import type {
  AtlasAssistInteractionMethod,
  AtlasAssistPromptCategory,
  AtlasAssistSource,
} from "../types/atlasAssist";

export const PROJECT_DRAWER_WIDTH = 420;

interface SystemLike {
  id: string;
  label: string;
  color: string;
}

interface PlanetLike {
  id: string;
  label: string;
  what: string;
  why: string;
  researchFocus: string;
  keyDiscovery: string;
  signatureStellarType?: AtlasStellarType;
  tags?: string[];
  relationships?: AtlasResolvedRelationship[];
}

interface AtlasProjectIntelligenceDrawerProps {
  open: boolean;
  system: SystemLike;
  planet: PlanetLike;
  onClose: () => void;
  onOpenAssistSource: (source: AtlasAssistSource) => void;
}

interface AssistRequest {
  query: string;
  promptCategory?: AtlasAssistPromptCategory;
  interactionMethod?: AtlasAssistInteractionMethod;
}

export default function AtlasProjectIntelligenceDrawer({
  open,
  system,
  planet,
  onClose,
  onOpenAssistSource,
}: AtlasProjectIntelligenceDrawerProps) {
  const [mode, setMode] = useState<"overview" | "assist">("overview");
  const [assistRequest, setAssistRequest] = useState<AssistRequest | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMode("overview");
    setAssistRequest(null);
  }, [planet.id]);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    drawerRef.current?.focus({ preventScroll: true });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus({ preventScroll: true });
    };
  }, [onClose, open]);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    console.debug("[Atlas Assist] overview.drawer", JSON.stringify({
      open,
      mode,
      projectId: planet.id,
      hasOverviewContent: Boolean(
        planet.what && planet.why && planet.researchFocus && planet.keyDiscovery,
      ),
    }));
  }, [mode, open, planet.id, planet.keyDiscovery, planet.researchFocus, planet.what, planet.why]);

  const handleConsult = (
    query: string,
    trigger: HTMLElement,
    promptCategory?: AtlasAssistPromptCategory,
    interactionMethod?: AtlasAssistInteractionMethod,
  ) => {
    returnFocusRef.current = trigger;
    setAssistRequest({ query, promptCategory, interactionMethod });
    setMode("assist");
  };

  return (
    <aside
      ref={drawerRef}
      tabIndex={-1}
      aria-label={`${planet.label} project overview`}
      className="absolute top-0 right-0 bottom-0 z-30 overflow-hidden"
      style={{
        width: `min(${PROJECT_DRAWER_WIDTH}px, 100vw)`,
        background:
          "linear-gradient(180deg, rgba(4,4,10,0.985) 0%, rgba(4,5,11,0.97) 100%)",
        borderLeft: "1px solid rgba(138,174,200,0.14)",
        boxShadow: "-24px 0 80px rgba(0,0,0,0.38)",
        backdropFilter: "blur(36px)",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
        color: "#F4EBD0",
      }}
    >
      <style>{`
        .atlas-project-drawer-close { display: none; }
        @media (max-width: 767px) {
          .atlas-project-drawer-close { display: grid; }
        }
      `}</style>
      <button
        type="button"
        className="atlas-project-drawer-close"
        aria-label="Return to constellation"
        onClick={onClose}
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 10,
          width: 44,
          height: 44,
          placeItems: "center",
          border: "1px solid rgba(138,174,200,0.28)",
          background: "rgba(4,5,11,0.92)",
          color: "rgba(244,235,208,0.82)",
          fontFamily: "'DM Mono', monospace",
          cursor: "pointer",
        }}
      >
        ←
      </button>
      <div
        style={{
          display: "flex",
          width: "200%",
          height: "100%",
          transform:
            mode === "assist"
              ? "translateX(-50%)"
              : "translateX(0)",
          transition: "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <OverviewLayer
          system={system}
          planet={planet}
          onConsult={handleConsult}
          inactive={mode === "assist"}
        />

        <div style={layerStyle}>
          {mode === "assist" && (
            <AtlasAssistPanel
              mode="overview"
              projectId={planet.id}
              color={system.color}
              initialQuery={assistRequest?.query}
              initialPromptCategory={assistRequest?.promptCategory}
              initialInteractionMethod={assistRequest?.interactionMethod}
              returnFocusRef={returnFocusRef}
              onClose={() => setMode("overview")}
              onOpenSource={(source) => {
                if (!source.sectionId) {
                  setMode("overview");
                  requestAnimationFrame(() => returnFocusRef.current?.focus());
                  return;
                }
                onOpenAssistSource(source);
              }}
            />
          )}
        </div>
      </div>
    </aside>
  );
}

function DrawerHeader({
  system,
  askColor,
  askOpen,
  onAsk,
  askButtonRef,
}: {
  system: SystemLike;
  askColor: string;
  askOpen: boolean;
  onAsk: () => void;
  askButtonRef: React.RefObject<HTMLButtonElement>;
}) {
  return (
    <div style={drawerHeaderStyle}>
      <div>
        <div style={labelStyle(system.color)}>Overview</div>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.34em",
            color: system.color,
            textTransform: "uppercase",
            marginTop: 6,
          }}
        >
          {system.label}
        </div>
      </div>
      <AtlasAssistTrigger
        buttonRef={askButtonRef}
        color={askColor}
        open={askOpen}
        onClick={onAsk}
        hasPopup="dialog"
      />
    </div>
  );
}

const STELLAR_TYPE_LABELS: Record<AtlasStellarType, string> = {
  purpose: "Purpose",
  strategy: "Strategy",
  agentic: "Agentic",
  judgment: "Judgment",
  risk: "Risk",
  relational: "Relational",
};

const STELLAR_TYPE_EXPLANATIONS: Record<AtlasStellarType, string> = {
  purpose:
    "Gold marks purpose: ideas concerned with intent, direction, and the conditions governing downstream decisions.",
  strategy:
    "Ivory marks strategy: ideas that translate intent into policy, constraints, and operating logic.",
  agentic:
    "Blue marks agentic behavior: ideas concerned with delegated action, execution, and machine decision-making.",
  judgment:
    "Orange marks judgment: ideas concerned with human interpretation, oversight, and consequential review.",
  risk:
    "Red marks risk: ideas concerned with harm, drift, failure, and protective intervention.",
  relational:
    "Purple marks relational context: ideas concerned with interaction, interpretation, and shared meaning.",
};

function SemanticTags({
  system,
  planet,
}: {
  system: SystemLike;
  planet: PlanetLike;
}) {
  const stellarType = planet.signatureStellarType;
  const relationships = planet.relationships ?? [];
  if (!stellarType && !planet.tags?.length && !relationships.length) return null;

  const stellarColor = resolveStellarColor(stellarType, system.color);

  return (
    <div
      aria-label="Project characteristics and lineage"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 7,
        marginTop: -10,
        marginBottom: 27,
      }}
    >
      {stellarType && (
        <span
          title={STELLAR_TYPE_EXPLANATIONS[stellarType]}
          aria-label={STELLAR_TYPE_EXPLANATIONS[stellarType]}
          style={semanticChipStyle(stellarColor)}
        >
          <span
            aria-hidden="true"
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: stellarColor,
              boxShadow: `0 0 9px ${stellarColor}`,
            }}
          />
          {STELLAR_TYPE_LABELS[stellarType]}
        </span>
      )}

      {planet.tags?.slice(0, 3).map((tag) => (
        <span key={tag} style={facetChipStyle}>
          {tag}
        </span>
      ))}

      {relationships.map((relationship) => (
        <AtlasLineageLink
          key={relationship.id}
          relationship={relationship}
          currentLabel={planet.label}
          variant="chip"
        />
      ))}
    </div>
  );
}

function InfoBlock({
  label,
  text,
  accent = "#C8A96E",
}: {
  label: string;
  text: string;
  accent?: string;
}) {
  return (
    <section style={infoBlockStyle}>
      <div style={labelStyle(accent)}>{label}</div>
      <div style={bodyStyle}>{text}</div>
    </section>
  );
}

function OverviewLayer({
  system,
  planet,
  onConsult,
  inactive,
}: {
  system: SystemLike;
  planet: PlanetLike;
  onConsult: (
    query: string,
    trigger: HTMLElement,
    promptCategory?: AtlasAssistPromptCategory,
    interactionMethod?: AtlasAssistInteractionMethod,
  ) => void;
  inactive: boolean;
}) {
  const [askOpen, setAskOpen] = useState(false);
  const askButtonRef = useRef<HTMLButtonElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const askColor = resolveStellarColor(
    planet.signatureStellarType,
    system.color,
  );

  useEffect(() => {
    setAskOpen(false);
  }, [planet.id]);

  useEffect(() => {
    if (overviewRef.current) overviewRef.current.inert = inactive;
  }, [inactive]);

  const closeAsk = () => {
    setAskOpen(false);
    requestAnimationFrame(() => askButtonRef.current?.focus({ preventScroll: true }));
  };

  return (
    <div
      ref={overviewRef}
      style={overviewLayerStyle}
      aria-hidden={inactive || undefined}
    >
      <div style={scrollLayerStyle}>
        <DrawerHeader
          system={system}
          askColor={askColor}
          askOpen={askOpen}
          askButtonRef={askButtonRef}
          onAsk={() => setAskOpen(true)}
        />
        <SemanticTags system={system} planet={planet} />

        <h1 style={titleStyle}>{planet.label}</h1>
        <p style={introStyle}>{planet.what}</p>

        <div style={sectionDividerStyle} />

        <InfoBlock label="Why It Started" text={planet.why} />
        <InfoBlock label="Research Focus" text={planet.researchFocus} />

        <div style={keyDiscoveryStyle(system.color)}>
          <div style={labelStyle(system.color)}>Key Discovery</div>
          <div>{planet.keyDiscovery}</div>
        </div>
      </div>

      <AtlasAssistEntry
        open={askOpen}
        projectId={planet.id}
        color={system.color}
        onClose={closeAsk}
        onConsult={(query, trigger, promptCategory, interactionMethod) => {
          setAskOpen(false);
          onConsult(query, trigger, promptCategory, interactionMethod);
        }}
      />
    </div>
  );
}

const titleStyle = {
  fontFamily: "'EB Garamond', serif",
  fontSize: 40,
  lineHeight: 0.98,
  color: "#F4EBD0",
  margin: "0 0 16px",
  maxWidth: 330,
};

const introStyle = {
  fontFamily: "'EB Garamond', serif",
  fontSize: 17,
  lineHeight: 1.58,
  color: "rgba(214,181,112,0.9)",
  margin: 0,
};

const bodyStyle = {
  fontFamily: "'EB Garamond', serif",
  fontSize: 15.5,
  lineHeight: 1.75,
  color: "rgba(245,235,210,0.86)",
};

const labelStyle = (color: string) => ({
  fontFamily: "'DM Mono', monospace",
  fontSize: 9,
  letterSpacing: "0.32em",
  color,
  opacity: 0.78,
  textTransform: "uppercase" as const,
  marginBottom: 10,
});

const infoBlockStyle = {
  marginTop: 27,
  paddingTop: 2,
};

const keyDiscoveryStyle = (color: string) => ({
  marginTop: 30,
  padding: "19px 20px 20px",
  background: "linear-gradient(90deg, rgba(255,255,255,0.045), rgba(255,255,255,0.018))",
  borderLeft: `2px solid ${color}`,
  borderTop: "1px solid rgba(255,255,255,0.045)",
  borderBottom: "1px solid rgba(255,255,255,0.035)",
  fontFamily: "'EB Garamond', serif",
  fontSize: 15.5,
  lineHeight: 1.72,
  color: "rgba(245,235,210,0.9)",
});

const sectionDividerStyle = {
  width: 52,
  height: 1,
  marginTop: 25,
  background: "linear-gradient(90deg, rgba(200,169,110,0.7), transparent)",
};

const semanticChipStyle = (color: string) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  minHeight: 25,
  padding: "5px 9px",
  borderRadius: 999,
  border: `1px solid ${color}66`,
  background: `${color}12`,
  color,
  fontFamily: "'DM Mono', monospace",
  fontSize: 8,
  lineHeight: 1,
  letterSpacing: "0.18em",
  textTransform: "uppercase" as const,
  cursor: "help",
});

const facetChipStyle = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 25,
  padding: "5px 9px",
  borderRadius: 999,
  border: "1px solid rgba(245,235,210,0.12)",
  background: "rgba(255,255,255,0.025)",
  color: "rgba(245,235,210,0.56)",
  fontFamily: "'DM Mono', monospace",
  fontSize: 8,
  lineHeight: 1,
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
};

const layerStyle = {
  width: "50%",
  height: "100%",
  display: "flex",
  flexDirection: "column" as const,
  flexShrink: 0,
};

const overviewLayerStyle = {
  ...layerStyle,
  position: "relative" as const,
  overflow: "hidden",
};

const drawerHeaderStyle = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 16,
  marginBottom: 26,
};

const scrollLayerStyle = {
  padding: "29px 30px 34px",
  overflowY: "auto" as const,
  flex: 1,
  scrollbarWidth: "thin" as const,
  scrollbarColor: "rgba(200,169,110,0.22) transparent",
};
