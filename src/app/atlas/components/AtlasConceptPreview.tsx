import { motion } from "motion/react";
import type { Planet, StarSystem } from "../../types/atlas";
import { buildAtlasConceptPreview } from "./AtlasConceptPreviewContent";

interface AtlasConceptPreviewProps {
  system: StarSystem;
  planet: Planet;
  x: number;
  y: number;
  viewportWidth: number;
  viewportHeight: number;
}

const CARD_WIDTH = 430;
const CARD_GUTTER = 28;
const ANCHOR_GAP = 82;
const ESTIMATED_CARD_HEIGHT = 360;

function sentenceCase(value: string) {
  return value
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function AtlasConceptPreview({
  system,
  planet,
  x,
  y,
  viewportWidth,
  viewportHeight,
}: AtlasConceptPreviewProps) {
  const content = buildAtlasConceptPreview(system, planet);
  const compact = viewportWidth < 760;

  const placeLeft = x + ANCHOR_GAP + CARD_WIDTH > viewportWidth - CARD_GUTTER;
  const left = compact
    ? Math.max(CARD_GUTTER, (viewportWidth - Math.min(CARD_WIDTH, viewportWidth - CARD_GUTTER * 2)) / 2)
    : placeLeft
      ? Math.max(CARD_GUTTER, x - CARD_WIDTH - ANCHOR_GAP)
      : x + ANCHOR_GAP;

  const top = compact
    ? Math.max(CARD_GUTTER, viewportHeight - ESTIMATED_CARD_HEIGHT - 72)
    : Math.min(
        Math.max(y - ESTIMATED_CARD_HEIGHT * 0.46, CARD_GUTTER),
        Math.max(CARD_GUTTER, viewportHeight - ESTIMATED_CARD_HEIGHT - 64),
      );

  return (
    <motion.aside
      key={content.id}
      initial={{ opacity: 0, y: 10, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.99 }}
      transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
      className="fixed z-30 pointer-events-none"
      style={{
        left,
        top,
        width: compact ? `calc(100vw - ${CARD_GUTTER * 2}px)` : CARD_WIDTH,
        maxWidth: CARD_WIDTH,
        padding: "30px 34px 32px",
        background: "rgba(6,7,12,0.955)",
        border: `1px solid color-mix(in srgb, ${content.color} 34%, transparent)`,
        borderRadius: 16,
        backdropFilter: "blur(26px)",
        boxShadow:
          `0 28px 96px rgba(0,0,0,0.54), 0 0 54px color-mix(in srgb, ${content.color} 9%, transparent), inset 0 1px 0 rgba(255,255,255,0.025)`,
        color: "#F4EBD0",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          backgroundImage:
            `linear-gradient(${content.color}14 1px, transparent 1px), linear-gradient(90deg, ${content.color}0D 1px, transparent 1px)`,
          backgroundSize: "42px 42px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.78), rgba(0,0,0,0.08) 70%, transparent)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: content.color,
            marginBottom: 15,
          }}
        >
          {content.eyebrow}
        </div>

        <div
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 27,
            lineHeight: 1.08,
            fontWeight: 400,
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            color: content.color,
            marginBottom: 18,
          }}
        >
          {content.title}
        </div>

        <div
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 15,
            lineHeight: 1.58,
            fontWeight: 400,
            color: "rgba(245,235,210,0.84)",
          }}
        >
          {content.description}
        </div>

        {content.metaItems.length > 0 && (
          <>
            <div
              style={{
                height: 1,
                margin: "26px 0 20px",
                background: "linear-gradient(90deg, rgba(255,255,255,0.12), transparent)",
              }}
            />

            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 8,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: `color-mix(in srgb, ${content.color} 82%, white 18%)`,
                marginBottom: 13,
              }}
            >
              {content.metaLabel}
            </div>

            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              {content.metaItems.map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 9,
                      height: 9,
                      flex: "0 0 auto",
                      borderRadius: "50%",
                      background: content.color,
                      border: "1px solid rgba(255,255,255,0.24)",
                      boxShadow: `0 0 8px ${content.color}`,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: 14,
                      lineHeight: 1.3,
                      color: "rgba(245,235,210,0.82)",
                    }}
                  >
                    {sentenceCase(item)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.aside>
  );
}
