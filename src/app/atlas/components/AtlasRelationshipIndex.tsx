import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type {
  AtlasEntryRelationshipType,
  AtlasResolvedRelationship,
} from "../../content/types";
import { SYSTEMS } from "../../data/atlasSystems";
import { useAtlasState } from "../../state";
import AtlasLineageLink, { ATLAS_LINEAGE_COLOR } from "./AtlasLineageLink";

interface AtlasRelationshipIndexProps {
  relationships: AtlasResolvedRelationship[];
  currentLabel: string;
}

type RelationshipGroup = {
  direction: "incoming" | "outgoing";
  type: AtlasEntryRelationshipType;
  items: AtlasResolvedRelationship[];
};

type FloatingPosition = {
  top: number;
  left: number;
};

const PANEL_WIDTH = 318;
const PANEL_GAP = 10;
const VIEWPORT_PADDING = 18;
const PANEL_ESTIMATED_HEIGHT = 250;
const PORTAL_Z_INDEX = 80;

const GROUP_LANGUAGE: Record<
  AtlasEntryRelationshipType,
  {
    outgoingGroup: (count: number) => string;
    incomingGroup: (count: number) => string;
    outgoingPanel: string;
    incomingPanel: string;
    outgoingDescription: (label: string) => string;
    incomingDescription: (label: string) => string;
  }
> = {
  informed: {
    outgoingGroup: (count) => `${count} FRAMEWORK LINEAGES`,
    incomingGroup: (count) => `${count} ORIGINS IN PRACTICE`,
    outgoingPanel: "FRAMEWORK LINEAGE",
    incomingPanel: "ORIGINS IN PRACTICE",
    outgoingDescription: (label) => `Frameworks later informed by ${label}.`,
    incomingDescription: (label) =>
      `Practice origins that contributed to ${label}.`,
  },
  applies: {
    outgoingGroup: (count) => `${count} APPLIED FRAMEWORKS`,
    incomingGroup: (count) => `${count} APPLICATIONS`,
    outgoingPanel: "APPLIED FRAMEWORKS",
    incomingPanel: "APPLIED IN",
    outgoingDescription: (label) =>
      `Frameworks deliberately applied throughout ${label}.`,
    incomingDescription: (label) =>
      `Projects that apply ${label} in product behavior.`,
  },
  embodies: {
    outgoingGroup: (count) => `${count} EMBODIED FRAMEWORKS`,
    incomingGroup: (count) => `${count} EXPRESSIONS`,
    outgoingPanel: "SYSTEM EXPRESSIONS",
    incomingPanel: "EMBODIED IN",
    outgoingDescription: (label) =>
      `Frameworks expressed broadly through ${label}.`,
    incomingDescription: (label) =>
      `Projects that embody ${label} as a broader product expression.`,
  },
};

export default function AtlasRelationshipIndex({
  relationships,
  currentLabel,
}: AtlasRelationshipIndexProps) {
  const groups = useMemo<RelationshipGroup[]>(() => {
    const map = new Map<string, RelationshipGroup>();

    relationships.forEach((relationship) => {
      const key = `${relationship.direction}:${relationship.type}`;
      const existing = map.get(key);

      if (existing) {
        existing.items.push(relationship);
        return;
      }

      map.set(key, {
        direction: relationship.direction,
        type: relationship.type,
        items: [relationship],
      });
    });

    return Array.from(map.values());
  }, [relationships]);

  return (
    <>
      {groups.map((group) =>
        group.items.length === 1 ? (
          <AtlasLineageLink
            key={group.items[0].id}
            relationship={group.items[0]}
            currentLabel={currentLabel}
            variant="chip"
          />
        ) : (
          <RelationshipGroupIndex
            key={`${group.direction}-${group.type}`}
            group={group}
            currentLabel={currentLabel}
          />
        ),
      )}
    </>
  );
}

function RelationshipGroupIndex({
  group,
  currentLabel,
}: {
  group: RelationshipGroup;
  currentLabel: string;
}) {
  const { actions } = useAtlasState();
  const [open, setOpen] = useState(false);
  const [floatingPosition, setFloatingPosition] =
    useState<FloatingPosition | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);

  const incoming = group.direction === "incoming";
  const count = group.items.length;
  const language = GROUP_LANGUAGE[group.type];
  const groupLabel = incoming
    ? language.incomingGroup(count)
    : language.outgoingGroup(count);
  const panelTitle = incoming
    ? language.incomingPanel
    : language.outgoingPanel;
  const panelDescription = incoming
    ? language.incomingDescription(currentLabel)
    : language.outgoingDescription(currentLabel);
  const arrow = incoming ? "↙" : "↗";
  const panelId = `atlas-relationship-index-${group.direction}-${group.type}`;

  const close = (restoreFocus = false) => {
    setOpen(false);
    setFloatingPosition(null);

    if (restoreFocus) {
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  };

  const updatePosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const desiredLeft = rect.right - PANEL_WIDTH;
    const minLeft = VIEWPORT_PADDING;
    const maxLeft = Math.max(
      VIEWPORT_PADDING,
      viewportWidth - PANEL_WIDTH - VIEWPORT_PADDING,
    );

    const left = Math.min(Math.max(desiredLeft, minLeft), maxLeft);

    const roomBelow = viewportHeight - rect.bottom - VIEWPORT_PADDING;
    const shouldOpenAbove = roomBelow < PANEL_ESTIMATED_HEIGHT;

    const top = shouldOpenAbove
      ? Math.max(
          VIEWPORT_PADDING,
          rect.top - PANEL_ESTIMATED_HEIGHT - PANEL_GAP,
        )
      : rect.bottom + PANEL_GAP;

    setFloatingPosition({ top, left });
  };

  useEffect(() => {
    if (!open) return;

    updatePosition();

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (triggerRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;

      close(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
      }
    };

    const handleReposition = () => updatePosition();

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    requestAnimationFrame(() => firstItemRef.current?.focus());

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open]);

  const navigate = (relationship: AtlasResolvedRelationship) => {
    for (const system of SYSTEMS) {
      const planet = system.planets.find(
        (candidate) => candidate.id === relationship.relatedId,
      );

      if (!planet) continue;

      setOpen(false);
      setFloatingPosition(null);
      actions.openPlanet(system.id, planet.id);
      requestAnimationFrame(() => actions.openProjectDrawer());
      return;
    }
  };

  const panel =
    open && floatingPosition ? (
      <div
        ref={panelRef}
        id={panelId}
        role="region"
        aria-label={`${panelTitle} for ${currentLabel}`}
        style={{
          position: "fixed",
          zIndex: PORTAL_Z_INDEX,
          top: floatingPosition.top,
          left: floatingPosition.left,
          width: PANEL_WIDTH,
          maxWidth: `calc(100vw - ${VIEWPORT_PADDING * 2}px)`,
          border: `1px solid ${ATLAS_LINEAGE_COLOR}50`,
          background: "rgba(7,8,14,0.99)",
          boxShadow: "0 22px 60px rgba(0,0,0,0.48)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 15px 12px",
            borderBottom: "1px solid rgba(215,131,104,0.14)",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: "8px",
              letterSpacing: "0.24em",
              color: ATLAS_LINEAGE_COLOR,
              textTransform: "uppercase",
            }}
          >
            {panelTitle}
          </div>
          <div
            style={{
              marginTop: "6px",
              fontFamily: "'EB Garamond',serif",
              fontSize: "13px",
              lineHeight: 1.45,
              color: "rgba(245,235,210,0.52)",
            }}
          >
            {panelDescription}
          </div>
        </div>

        <div style={{ padding: "6px" }}>
          {group.items.map((relationship, index) => (
            <button
              key={relationship.id}
              ref={index === 0 ? firstItemRef : undefined}
              type="button"
              onClick={() => navigate(relationship)}
              style={{
                display: "block",
                width: "100%",
                padding: "11px 10px 12px",
                border: "none",
                borderBottom:
                  index < group.items.length - 1
                    ? "1px solid rgba(245,235,210,0.055)"
                    : "none",
                background: "transparent",
                textAlign: "left",
                cursor: "pointer",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.background =
                  `${ATLAS_LINEAGE_COLOR}0D`;
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background = "transparent";
              }}
              onFocus={(event) => {
                event.currentTarget.style.background =
                  `${ATLAS_LINEAGE_COLOR}0D`;
              }}
              onBlur={(event) => {
                event.currentTarget.style.background = "transparent";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: "12px",
                  fontFamily: "'DM Mono',monospace",
                  fontSize: "8.5px",
                  letterSpacing: "0.14em",
                  color: "rgba(245,235,210,0.86)",
                  textTransform: "uppercase",
                }}
              >
                <span>{relationship.relatedLabel}</span>
                <span
                  aria-hidden="true"
                  style={{ color: ATLAS_LINEAGE_COLOR, flexShrink: 0 }}
                >
                  {arrow}
                </span>
              </div>
              <div
                style={{
                  marginTop: "6px",
                  fontFamily: "'EB Garamond',serif",
                  fontSize: "13.5px",
                  lineHeight: 1.48,
                  color: "rgba(245,235,210,0.58)",
                }}
              >
                {relationship.summary}
              </div>
            </button>
          ))}
        </div>
      </div>
    ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${groupLabel}. View connected work.`}
        onClick={() => {
          setOpen((value) => {
            const next = !value;
            if (next) requestAnimationFrame(updatePosition);
            return next;
          });
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "7px",
          minHeight: 25,
          padding: "5px 9px",
          borderRadius: 999,
          border: `1px solid ${
            open ? ATLAS_LINEAGE_COLOR : `${ATLAS_LINEAGE_COLOR}70`
          }`,
          background: open
            ? `${ATLAS_LINEAGE_COLOR}18`
            : `${ATLAS_LINEAGE_COLOR}08`,
          color: open
            ? "rgba(245,235,210,0.94)"
            : ATLAS_LINEAGE_COLOR,
          fontFamily: "'DM Mono',monospace",
          fontSize: "8px",
          lineHeight: 1,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        <span aria-hidden="true">{arrow}</span>
        {groupLabel}
      </button>

      {typeof document !== "undefined" && panel
        ? createPortal(panel, document.body)
        : null}
    </>
  );
}
