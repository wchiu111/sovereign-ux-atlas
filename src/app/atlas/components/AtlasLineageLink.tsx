import { useEffect, useRef, useState } from "react";
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

export const ATLAS_LINEAGE_COLOR = "#D78368";

type AtlasLineageVariant = "chip" | "inline" | "block";

interface AtlasLineageLinkProps {
  relationship: AtlasResolvedRelationship;
  currentLabel?: string;
  variant?: AtlasLineageVariant;
}

const RELATIONSHIP_LANGUAGE: Record<
  AtlasEntryRelationshipType,
  {
    outgoingChipPrefix: string | null;
    incomingChipPrefix: string | null;
    outgoingTooltip: string;
    incomingTooltip: string;
    outgoingInline: string;
    incomingInline: string;
    outgoingBlock: string;
    incomingBlock: string;
  }
> = {
  informed: {
    outgoingChipPrefix: null,
    incomingChipPrefix: null,
    outgoingTooltip: "Framework Lineage",
    incomingTooltip: "Origin in Practice",
    outgoingInline: "This idea later informed",
    incomingInline: "Origin in practice",
    outgoingBlock: "Idea Lineage",
    incomingBlock: "Origin in Practice",
  },
  applies: {
    outgoingChipPrefix: "Applies",
    incomingChipPrefix: "Applied In",
    outgoingTooltip: "Framework Application",
    incomingTooltip: "Applied In",
    outgoingInline: "This project applies",
    incomingInline: "Applied in",
    outgoingBlock: "Framework Application",
    incomingBlock: "Applied In",
  },
  embodies: {
    outgoingChipPrefix: "Embodies",
    incomingChipPrefix: "Embodied In",
    outgoingTooltip: "System Expression",
    incomingTooltip: "Embodied In",
    outgoingInline: "This experience embodies",
    incomingInline: "Embodied in",
    outgoingBlock: "System Expression",
    incomingBlock: "Embodied In",
  },
};

export default function AtlasLineageLink({
  relationship,
  currentLabel,
  variant = "chip",
}: AtlasLineageLinkProps) {
  const { actions } = useAtlasState();
  const [active, setActive] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const chipRef = useRef<HTMLButtonElement>(null);

  const outgoing = relationship.direction === "outgoing";
  const arrow = outgoing ? "↗" : "↙";
  const language = RELATIONSHIP_LANGUAGE[relationship.type];

  const updateTooltipPosition = () => {
    const trigger = chipRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const width = 270;
    const gap = 10;
    const viewportPadding = 18;
    const desiredLeft = rect.right - width;
    const maxLeft = Math.max(
      viewportPadding,
      window.innerWidth - width - viewportPadding,
    );

    setTooltipPosition({
      top: rect.bottom + gap,
      left: Math.min(Math.max(desiredLeft, viewportPadding), maxLeft),
    });
  };

  useEffect(() => {
    if (!active || variant !== "chip") {
      setTooltipPosition(null);
      return;
    }

    updateTooltipPosition();

    const reposition = () => updateTooltipPosition();
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);

    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [active, variant]);

  const navigate = () => {
    for (const system of SYSTEMS) {
      const planet = system.planets.find(
        (candidate) => candidate.id === relationship.relatedId,
      );

      if (!planet) continue;

      const entryPath = atlasEntryBasePath(planet.id);
      if (entryPath) pushAtlasPath(entryPath);
      actions.openPlanet(system.id, planet.id);
      requestAnimationFrame(() => actions.openProjectDrawer());
      return;
    }
  };

  if (variant === "block") {
    const sourceLabel = outgoing
      ? currentLabel ?? "THIS WORK"
      : relationship.relatedLabel;
    const targetLabel = outgoing
      ? relationship.relatedLabel
      : currentLabel ?? "THIS FRAMEWORK";

    return (
      <section
        aria-label={
          outgoing ? language.outgoingBlock : language.incomingBlock
        }
        style={{
          marginTop: "46px",
          padding: "22px 22px 21px",
          border: `1px solid ${ATLAS_LINEAGE_COLOR}55`,
          background:
            "linear-gradient(135deg, rgba(215,131,104,0.055), rgba(8,10,18,0.30))",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: "9px",
            letterSpacing: "0.28em",
            color: ATLAS_LINEAGE_COLOR,
            opacity: 0.78,
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          {outgoing ? language.outgoingBlock : language.incomingBlock}
        </div>

        <div
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: "10.5px",
            lineHeight: 1.5,
            letterSpacing: "0.12em",
            color: "rgba(245,235,210,0.82)",
            textTransform: "uppercase",
            marginBottom: "13px",
          }}
        >
          <span style={{ color: "rgba(245,235,210,0.62)" }}>
            {sourceLabel}
          </span>
          <span
            aria-hidden="true"
            style={{
              color: ATLAS_LINEAGE_COLOR,
              padding: "0 9px",
            }}
          >
            →
          </span>
          <span style={{ color: ATLAS_LINEAGE_COLOR }}>{targetLabel}</span>
        </div>

        <p
          style={{
            margin: 0,
            maxWidth: "620px",
            fontFamily: "'EB Garamond',serif",
            fontSize: "15.5px",
            lineHeight: 1.68,
            color: "rgba(240,232,215,0.72)",
          }}
        >
          {relationship.lineageSummary}
        </p>

        <button
          type="button"
          onClick={navigate}
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            marginTop: "16px",
            padding: "8px 0",
            border: "none",
            background: "transparent",
            color: active
              ? "rgba(245,235,210,0.94)"
              : ATLAS_LINEAGE_COLOR,
            fontFamily: "'DM Mono',monospace",
            fontSize: "9.5px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "color 180ms ease",
          }}
        >
          {outgoing ? "Explore" : "Open"} {relationship.relatedLabel}
          <span aria-hidden="true">{arrow}</span>
        </button>
      </section>
    );
  }

  if (variant === "inline") {
    const inlineLabel = outgoing
      ? language.outgoingInline
      : language.incomingInline;

    return (
      <button
        ref={chipRef}
        type="button"
        onClick={navigate}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        aria-label={`${inlineLabel}: ${relationship.relatedLabel}`}
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
          width: "100%",
          marginTop: "-18px",
          marginBottom: "40px",
          padding: "11px 0 10px",
          border: "none",
          borderTop: `1px solid ${ATLAS_LINEAGE_COLOR}24`,
          borderBottom: `1px solid ${ATLAS_LINEAGE_COLOR}18`,
          background: active ? `${ATLAS_LINEAGE_COLOR}08` : "transparent",
          color: "inherit",
          textAlign: "left",
          cursor: "pointer",
          transition: "background 180ms ease, border-color 180ms ease",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            color: ATLAS_LINEAGE_COLOR,
            fontFamily: "'DM Mono',monospace",
            fontSize: "12px",
          }}
        >
          {arrow}
        </span>
        <span
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: "8.5px",
            letterSpacing: "0.20em",
            color: "rgba(200,180,130,0.46)",
            textTransform: "uppercase",
          }}
        >
          {inlineLabel}
        </span>
        <span
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: "8.5px",
            letterSpacing: "0.18em",
            color: active
              ? "rgba(245,235,210,0.92)"
              : ATLAS_LINEAGE_COLOR,
            textTransform: "uppercase",
            transition: "color 180ms ease",
          }}
        >
          {relationship.relatedLabel}
        </span>
      </button>
    );
  }

  const chipPrefix = outgoing
    ? language.outgoingChipPrefix
    : language.incomingChipPrefix;
  const tooltipLabel = outgoing
    ? language.outgoingTooltip
    : language.incomingTooltip;

  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <button
        ref={chipRef}
        type="button"
        onClick={navigate}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        aria-label={`${tooltipLabel}: ${relationship.relatedLabel}. ${relationship.summary}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "7px",
          minHeight: 25,
          padding: "5px 9px",
          borderRadius: 999,
          border: `1px solid ${
            active ? ATLAS_LINEAGE_COLOR : `${ATLAS_LINEAGE_COLOR}70`
          }`,
          background: active
            ? `${ATLAS_LINEAGE_COLOR}18`
            : `${ATLAS_LINEAGE_COLOR}08`,
          color: active
            ? "rgba(245,235,210,0.94)"
            : ATLAS_LINEAGE_COLOR,
          fontFamily: "'DM Mono',monospace",
          fontSize: "8px",
          lineHeight: 1,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition:
            "background 180ms ease, border-color 180ms ease, color 180ms ease",
        }}
      >
        <span aria-hidden="true">{arrow}</span>
        {chipPrefix ? `${chipPrefix} · ` : ""}
        {relationship.relatedLabel}
      </button>

      {active &&
        tooltipPosition &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: "fixed",
              zIndex: 80,
              top: tooltipPosition.top,
              left: tooltipPosition.left,
              width: 270,
              padding: "14px 15px 15px",
              border: `1px solid ${ATLAS_LINEAGE_COLOR}55`,
              background: "rgba(7,8,14,0.985)",
              boxShadow: "0 18px 48px rgba(0,0,0,0.42)",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: "8px",
                letterSpacing: "0.22em",
                color: ATLAS_LINEAGE_COLOR,
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              {tooltipLabel}
            </div>
            <div
              style={{
                fontFamily: "'EB Garamond',serif",
                fontSize: "14px",
                lineHeight: 1.55,
                color: "rgba(245,235,210,0.76)",
              }}
            >
              {relationship.summary}
            </div>
            <div
              style={{
                marginTop: "10px",
                fontFamily: "'DM Mono',monospace",
                fontSize: "8px",
                letterSpacing: "0.12em",
                color: ATLAS_LINEAGE_COLOR,
                textTransform: "uppercase",
              }}
            >
              {outgoing ? "View" : "Open"} {relationship.relatedLabel} {arrow}
            </div>
          </div>,
          document.body,
        )}
    </span>
  );
}
