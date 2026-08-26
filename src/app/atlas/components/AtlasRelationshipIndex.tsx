import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type {
  AtlasEntryRelationshipType,
  AtlasResolvedRelationship,
} from "../../content/types";
import { SYSTEMS } from "../../data/atlasSystems";
import {
  atlasEntryBasePath,
  pushAtlasPath,
} from "../../routing/atlasRoutes";
import { useAtlasState } from "../../state";
import AtlasLineageLink, { ATLAS_LINEAGE_COLOR } from "./AtlasLineageLink";

interface AtlasRelationshipIndexProps {
  relationships: AtlasResolvedRelationship[];
  currentLabel: string;
}

interface RelationshipGroup {
  direction: "incoming" | "outgoing";
  type: AtlasEntryRelationshipType;
  items: AtlasResolvedRelationship[];
}

const PANEL_WIDTH = 318;
const PANEL_GAP = 10;
const VIEWPORT_PADDING = 18;

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
    const grouped = new Map<string, RelationshipGroup>();

    relationships.forEach((relationship) => {
      const key = `${relationship.direction}:${relationship.type}`;
      const existing = grouped.get(key);
      if (existing) {
        existing.items.push(relationship);
      } else {
        grouped.set(key, {
          direction: relationship.direction,
          type: relationship.type,
          items: [relationship],
        });
      }
    });

    return Array.from(grouped.values());
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
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null,
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);

  const incoming = group.direction === "incoming";
  const language = GROUP_LANGUAGE[group.type];
  const groupLabel = incoming
    ? language.incomingGroup(group.items.length)
    : language.outgoingGroup(group.items.length);
  const panelTitle = incoming
    ? language.incomingPanel
    : language.outgoingPanel;
  const panelDescription = incoming
    ? language.incomingDescription(currentLabel)
    : language.outgoingDescription(currentLabel);
  const arrow = incoming ? "↙" : "↗";
  const panelId = `atlas-relationship-index-${group.direction}-${group.type}`;

  const updatePosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const left = Math.min(
      Math.max(rect.right - PANEL_WIDTH, VIEWPORT_PADDING),
      Math.max(
        VIEWPORT_PADDING,
        window.innerWidth - PANEL_WIDTH - VIEWPORT_PADDING,
      ),
    );
    const estimatedHeight = 250;
    const roomBelow = window.innerHeight - rect.bottom - VIEWPORT_PADDING;
    const top =
      roomBelow < estimatedHeight
        ? Math.max(
            VIEWPORT_PADDING,
            rect.top - estimatedHeight - PANEL_GAP,
          )
        : rect.bottom + PANEL_GAP;

    setPosition({ top, left });
  };

  const close = (restoreFocus = false) => {
    setOpen(false);
    setPosition(null);
    if (restoreFocus) {
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  };

  useEffect(() => {
    if (!open) return;

    updatePosition();
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      close();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      close(true);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    requestAnimationFrame(() => firstItemRef.current?.focus());

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  const navigate = (relationship: AtlasResolvedRelationship) => {
    for (const system of SYSTEMS) {
      const planet = system.planets.find(
        (candidate) => candidate.id === relationship.relatedId,
      );
      if (!planet) continue;

      close();
      const entryPath = atlasEntryBasePath(planet.id);
      if (entryPath) pushAtlasPath(entryPath);
      actions.openPlanet(system.id, planet.id);
      requestAnimationFrame(() => actions.openProjectDrawer());
      return;
    }
  };

  const panel =
    open && position ? (
      <div
        ref={panelRef}
        id={panelId}
        role="region"
        aria-label={`${panelTitle} for ${currentLabel}`}
        style={{
          position: "fixed",
          zIndex: 80,
          top: position.top,
          left: position.left,
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
          <div style={panelLabelStyle}>{panelTitle}</div>
          <div style={panelDescriptionStyle}>{panelDescription}</div>
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
              <div style={itemTitleStyle}>
                <span>{relationship.relatedLabel}</span>
                <span aria-hidden="true" style={{ color: ATLAS_LINEAGE_COLOR }}>
                  {arrow}
                </span>
              </div>
              <div style={itemSummaryStyle}>{relationship.summary}</div>
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
          color: open ? "rgba(245,235,210,0.94)" : ATLAS_LINEAGE_COLOR,
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

const panelLabelStyle = {
  fontFamily: "'DM Mono',monospace",
  fontSize: "8px",
  letterSpacing: "0.24em",
  color: ATLAS_LINEAGE_COLOR,
  textTransform: "uppercase" as const,
};

const panelDescriptionStyle = {
  marginTop: "6px",
  fontFamily: "'EB Garamond',serif",
  fontSize: "13px",
  lineHeight: 1.45,
  color: "rgba(245,235,210,0.52)",
};

const itemTitleStyle = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: "12px",
  fontFamily: "'DM Mono',monospace",
  fontSize: "8.5px",
  letterSpacing: "0.14em",
  color: "rgba(245,235,210,0.86)",
  textTransform: "uppercase" as const,
};

const itemSummaryStyle = {
  marginTop: "6px",
  fontFamily: "'EB Garamond',serif",
  fontSize: "13.5px",
  lineHeight: 1.48,
  color: "rgba(245,235,210,0.58)",
};
