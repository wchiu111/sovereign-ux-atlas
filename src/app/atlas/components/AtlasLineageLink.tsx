import { useState } from "react";
import type { AtlasResolvedRelationship } from "../../content/types";
import { SYSTEMS } from "../../data/atlasSystems";
import { atlasEntryBasePath, pushAtlasPath } from "../../routing/atlasRoutes";
import { useAtlasState } from "../../state";

export const ATLAS_LINEAGE_COLOR = "#D78368";

type AtlasLineageVariant = "chip" | "inline" | "block";

interface AtlasLineageLinkProps {
  relationship: AtlasResolvedRelationship;
  currentLabel?: string;
  variant?: AtlasLineageVariant;
}

export default function AtlasLineageLink({
  relationship,
  currentLabel,
  variant = "chip",
}: AtlasLineageLinkProps) {
  const { actions } = useAtlasState();
  const [active, setActive] = useState(false);
  const outgoing = relationship.direction === "outgoing";
  const arrow = outgoing ? "↗" : "↙";

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

  const interactionProps = {
    onMouseEnter: () => setActive(true),
    onMouseLeave: () => setActive(false),
    onFocus: () => setActive(true),
    onBlur: () => setActive(false),
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
        aria-label="Idea lineage"
        style={{
          marginTop: "46px",
          padding: "22px 22px 21px",
          border: `1px solid ${ATLAS_LINEAGE_COLOR}55`,
          background:
            "linear-gradient(135deg, rgba(215,131,104,0.055), rgba(8,10,18,0.30))",
        }}
      >
        <div style={lineageLabelStyle}>
          {outgoing ? "IDEA LINEAGE" : "ORIGIN IN PRACTICE"}
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
          <span style={{ color: "rgba(245,235,210,0.62)" }}>{sourceLabel}</span>
          <span aria-hidden="true" style={{ color: ATLAS_LINEAGE_COLOR, padding: "0 9px" }}>→</span>
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
          {...interactionProps}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            marginTop: "16px",
            padding: "8px 0",
            border: "none",
            background: "transparent",
            color: active ? "rgba(245,235,210,0.94)" : ATLAS_LINEAGE_COLOR,
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
    return (
      <button
        type="button"
        onClick={navigate}
        {...interactionProps}
        aria-label={`${outgoing ? "This idea later informed" : "Origin in practice"}: ${relationship.relatedLabel}`}
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
        <span aria-hidden="true" style={{ color: ATLAS_LINEAGE_COLOR, fontFamily: "'DM Mono',monospace", fontSize: "12px" }}>
          {arrow}
        </span>
        <span style={inlineLabelStyle}>
          {outgoing ? "This idea later informed" : "Origin in practice"}
        </span>
        <span
          style={{
            ...inlineLabelStyle,
            letterSpacing: "0.18em",
            color: active ? "rgba(245,235,210,0.92)" : ATLAS_LINEAGE_COLOR,
            transition: "color 180ms ease",
          }}
        >
          {relationship.relatedLabel}
        </span>
      </button>
    );
  }

  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <button
        type="button"
        onClick={navigate}
        {...interactionProps}
        aria-label={`${outgoing ? "Framework lineage" : "Origin in practice"}: ${relationship.relatedLabel}. ${relationship.summary}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "7px",
          minHeight: 25,
          padding: "5px 9px",
          borderRadius: 999,
          border: `1px solid ${active ? ATLAS_LINEAGE_COLOR : `${ATLAS_LINEAGE_COLOR}70`}`,
          background: active ? `${ATLAS_LINEAGE_COLOR}18` : `${ATLAS_LINEAGE_COLOR}08`,
          color: active ? "rgba(245,235,210,0.94)" : ATLAS_LINEAGE_COLOR,
          fontFamily: "'DM Mono',monospace",
          fontSize: "8px",
          lineHeight: 1,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "background 180ms ease, border-color 180ms ease, color 180ms ease",
        }}
      >
        <span aria-hidden="true">{arrow}</span>
        {relationship.relatedLabel}
      </button>
      {active && (
        <div
          role="tooltip"
          style={{
            position: "absolute",
            zIndex: 40,
            top: "calc(100% + 10px)",
            left: 0,
            width: 270,
            padding: "14px 15px 15px",
            border: `1px solid ${ATLAS_LINEAGE_COLOR}55`,
            background: "rgba(7,8,14,0.985)",
            boxShadow: "0 18px 48px rgba(0,0,0,0.42)",
            pointerEvents: "none",
          }}
        >
          <div style={{ ...lineageLabelStyle, fontSize: "8px", marginBottom: "8px" }}>
            {outgoing ? "Framework Lineage" : "Origin in Practice"}
          </div>
          <div style={{ fontFamily: "'EB Garamond',serif", fontSize: "14px", lineHeight: 1.55, color: "rgba(245,235,210,0.76)" }}>
            {relationship.summary}
          </div>
          <div style={{ marginTop: "10px", fontFamily: "'DM Mono',monospace", fontSize: "8px", letterSpacing: "0.16em", color: "rgba(200,180,130,0.42)", textTransform: "uppercase" }}>
            Open in Atlas {arrow}
          </div>
        </div>
      )}
    </span>
  );
}

const lineageLabelStyle = {
  fontFamily: "'DM Mono',monospace",
  fontSize: "9px",
  letterSpacing: "0.28em",
  color: ATLAS_LINEAGE_COLOR,
  opacity: 0.78,
  textTransform: "uppercase" as const,
  marginBottom: "12px",
};

const inlineLabelStyle = {
  fontFamily: "'DM Mono',monospace",
  fontSize: "8.5px",
  letterSpacing: "0.20em",
  color: "rgba(200,180,130,0.46)",
  textTransform: "uppercase" as const,
};
