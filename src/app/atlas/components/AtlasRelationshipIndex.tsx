import { useEffect, useMemo, useRef, useState } from "react";
import type { AtlasResolvedRelationship } from "../../content/types";
import { SYSTEMS } from "../../data/atlasSystems";
import { useAtlasState } from "../../state";
import AtlasLineageLink, { ATLAS_LINEAGE_COLOR } from "./AtlasLineageLink";

interface AtlasRelationshipIndexProps {
  relationships: AtlasResolvedRelationship[];
  currentLabel: string;
}

type RelationshipGroup = {
  direction: "incoming" | "outgoing";
  items: AtlasResolvedRelationship[];
};

export default function AtlasRelationshipIndex({
  relationships,
  currentLabel,
}: AtlasRelationshipIndexProps) {
  const groups = useMemo<RelationshipGroup[]>(() => {
    const incoming = relationships.filter(
      (relationship) => relationship.direction === "incoming",
    );
    const outgoing = relationships.filter(
      (relationship) => relationship.direction === "outgoing",
    );

    return [
      ...(incoming.length
        ? [{ direction: "incoming" as const, items: incoming }]
        : []),
      ...(outgoing.length
        ? [{ direction: "outgoing" as const, items: outgoing }]
        : []),
    ];
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
            key={group.direction}
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLSpanElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);

  const incoming = group.direction === "incoming";
  const count = group.items.length;
  const groupLabel = incoming
    ? `${count} ORIGINS IN PRACTICE`
    : `${count} FRAMEWORK LINEAGES`;
  const panelTitle = incoming ? "ORIGINS IN PRACTICE" : "FRAMEWORK LINEAGE";
  const arrow = incoming ? "↙" : "↗";

  const close = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) {
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  };

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        close(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    requestAnimationFrame(() => firstItemRef.current?.focus());

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const navigate = (relationship: AtlasResolvedRelationship) => {
    for (const system of SYSTEMS) {
      const planet = system.planets.find(
        (candidate) => candidate.id === relationship.relatedId,
      );

      if (!planet) continue;

      setOpen(false);
      actions.openPlanet(system.id, planet.id);
      requestAnimationFrame(() => actions.openProjectDrawer());
      return;
    }
  };

  return (
    <span
      ref={rootRef}
      style={{ position: "relative", display: "inline-flex" }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${groupLabel}. View connected work.`}
        onClick={() => setOpen((value) => !value)}
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

      {open && (
        <div
          role="dialog"
          aria-label={`${panelTitle} for ${currentLabel}`}
          style={{
            position: "absolute",
            zIndex: 60,
            top: "calc(100% + 10px)",
            right: 0,
            width: 318,
            maxWidth: "calc(100vw - 48px)",
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
              {incoming
                ? `Practice origins that contributed to ${currentLabel}.`
                : `Frameworks later informed by ${currentLabel}.`}
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
      )}
    </span>
  );
}
