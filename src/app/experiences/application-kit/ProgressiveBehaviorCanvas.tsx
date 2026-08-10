import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import ExperienceAnnotation from "./ExperienceAnnotation";
import type {
  BehavioralStage,
  BehavioralStageId,
} from "./behavioralDecisionDesignData";

interface ProgressiveBehaviorCanvasProps {
  stages: BehavioralStage[];
  revealedCount: number;
  activeStageId: BehavioralStageId;
  onCommitStage: (stageId: BehavioralStageId) => void;
  onAdvance: () => void;
  onRevealAll: () => void;
  onApply: () => void;
  resolveColor: (role: BehavioralStage["colorRole"]) => string;
}

const ORDER: BehavioralStageId[] = [
  "interpret",
  "separate",
  "frame",
  "recommend",
  "confirm",
  "act",
];

/**
 * Geometry is rebuilt from the Figma Make export:
 * source frame: 1155 × 785
 * visual system begins at roughly y=180 after the title / intro area.
 *
 * We keep those spatial relationships, but express x/y as percentages
 * so the composition scales with the current Atlas viewport.
 */
const DESIGN_WIDTH = 1155;
const SYSTEM_TOP = 180;
const SYSTEM_HEIGHT = 605;
const READING_COLUMN_WIDTH = 395;

const NODE_GEOMETRY: Record<
  BehavioralStageId,
  { x: number; y: number; width: number }
> = {
  interpret: { x: 87, y: 207 - SYSTEM_TOP, width: 210.422 },
  separate: { x: 230, y: 274 - SYSTEM_TOP, width: 210.422 },
  frame: { x: 477, y: 325 - SYSTEM_TOP, width: 210.422 },
  recommend: { x: 330, y: 417 - SYSTEM_TOP, width: 220.944 },
  confirm: { x: 495, y: 551 - SYSTEM_TOP, width: 210.422 },
  act: { x: 602, y: 666 - SYSTEM_TOP, width: 210.422 },
};

const pctX = (value: number) => `${(value / DESIGN_WIDTH) * 100}%`;
const pctY = (value: number) => `${(value / SYSTEM_HEIGHT) * 100}%`;

export default function ProgressiveBehaviorCanvas({
  stages,
  revealedCount,
  activeStageId,
  onCommitStage,
  onAdvance,
  onRevealAll,
  onApply,
  resolveColor,
}: ProgressiveBehaviorCanvasProps) {
  const reducedMotion = useReducedMotion();
  const [hoveredStageId, setHoveredStageId] =
    useState<BehavioralStageId | null>(null);
  const [orbitHovered, setOrbitHovered] = useState<"outer" | "inner" | null>(
    null,
  );

  const revealedIds = useMemo(
    () => new Set(ORDER.slice(0, revealedCount)),
    [revealedCount],
  );

  const activeStage =
    stages.find((stage) => stage.id === activeStageId) ?? stages[0];

  const canAdvance = revealedCount < ORDER.length;
  const complete = revealedCount >= ORDER.length;
  const nextStage = stages[revealedCount];

  const getStage = (id: BehavioralStageId) =>
    stages.find((stage) => stage.id === id)!;

  const coreColor = resolveColor(getStage("interpret").colorRole);

  const outerActive =
    orbitHovered === "outer" ||
    hoveredStageId === "interpret" ||
    hoveredStageId === "separate" ||
    hoveredStageId === "frame";

  const innerActive =
    orbitHovered === "inner" ||
    hoveredStageId === "recommend" ||
    hoveredStageId === "confirm" ||
    hoveredStageId === "act";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "clamp(560px, 62vw, 680px)",
        minHeight: 560,
        overflow: "hidden",
      }}
    >
      {/* Gold body: exact Figma Make relationship, scaled with the viewport. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: pctX(-88),
          top: pctY(500 - SYSTEM_TOP),
          width: "43.72%",
          aspectRatio: "1 / 1",
          borderRadius: "50%",
          background: `radial-gradient(
            circle at 42% 34%,
            ${coreColor}E6 0%,
            ${coreColor}C2 31%,
            ${coreColor}94 62%,
            ${coreColor}66 100%
          )`,
          boxShadow: `
            0 0 156px ${coreColor}24,
            0 0 358px ${coreColor}12
          `,
          pointerEvents: "none",
        }}
      />

      {/* Large orbital field. The circles, not custom Bézier paths, create the arcs. */}
      <svg
        viewBox={`0 0 ${DESIGN_WIDTH} ${SYSTEM_HEIGHT}`}
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <defs>
          <linearGradient
            id="figma-outer-gradient"
            x1="87"
            y1={207 - SYSTEM_TOP}
            x2="477"
            y2={325 - SYSTEM_TOP}
            gradientUnits="userSpaceOnUse"
          >
            <stop
              offset="0%"
              stopColor={resolveColor(getStage("interpret").colorRole)}
              stopOpacity=".82"
            />
            <stop
              offset="50%"
              stopColor={resolveColor(getStage("separate").colorRole)}
              stopOpacity=".82"
            />
            <stop
              offset="100%"
              stopColor={resolveColor(getStage("frame").colorRole)}
              stopOpacity=".82"
            />
          </linearGradient>

          <linearGradient
            id="figma-inner-gradient"
            x1="330"
            y1={417 - SYSTEM_TOP}
            x2="602"
            y2={666 - SYSTEM_TOP}
            gradientUnits="userSpaceOnUse"
          >
            <stop
              offset="0%"
              stopColor={resolveColor(getStage("recommend").colorRole)}
              stopOpacity=".82"
            />
            <stop
              offset="50%"
              stopColor={resolveColor(getStage("confirm").colorRole)}
              stopOpacity=".82"
            />
            <stop
              offset="100%"
              stopColor={resolveColor(getStage("act").colorRole)}
              stopOpacity=".82"
            />
          </linearGradient>

          <filter
            id="figma-orbit-glow"
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="3.5"
              result="orbitBlur"
            />
            <feMerge>
              <feMergeNode in="orbitBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer: Figma Make circle x=-384, y=219, size=1090.982. */}
        <circle
          cx={-384 + 1090.982 / 2}
          cy={219 - SYSTEM_TOP + 1090.982 / 2}
          r={1090.982 / 2}
          fill="none"
          stroke="rgba(255,255,255,.29)"
          strokeWidth="2.6"
        />

        <motion.circle
          cx={-384 + 1090.982 / 2}
          cy={219 - SYSTEM_TOP + 1090.982 / 2}
          r={1090.982 / 2}
          fill="none"
          stroke="url(#figma-outer-gradient)"
          strokeWidth={outerActive ? 3.4 : 2.6}
          initial={{ opacity: 0 }}
          animate={{ opacity: outerActive ? 0.96 : 0 }}
          transition={{
            duration: reducedMotion ? 0.16 : 0.46,
            ease: [0.16, 1, 0.3, 1],
          }}
          filter={
            outerActive && !reducedMotion ? "url(#figma-orbit-glow)" : undefined
          }
        />

        {/* Inner: Figma Make nested circle at +161.04, size=763.688. */}
        <circle
          cx={-384 + 161.04 + 763.688 / 2}
          cy={219 - SYSTEM_TOP + 161.05 + 763.688 / 2}
          r={763.688 / 2}
          fill="none"
          stroke="rgba(138,174,200,.35)"
          strokeWidth="2.6"
        />

        <motion.circle
          cx={-384 + 161.04 + 763.688 / 2}
          cy={219 - SYSTEM_TOP + 161.05 + 763.688 / 2}
          r={763.688 / 2}
          fill="none"
          stroke="url(#figma-inner-gradient)"
          strokeWidth={innerActive ? 3.4 : 2.6}
          initial={{ opacity: 0 }}
          animate={{ opacity: innerActive ? 0.96 : 0 }}
          transition={{
            duration: reducedMotion ? 0.16 : 0.46,
            ease: [0.16, 1, 0.3, 1],
          }}
          filter={
            innerActive && !reducedMotion ? "url(#figma-orbit-glow)" : undefined
          }
        />

        {/* Generous invisible hit targets preserve the established hover behavior. */}
        <circle
          cx={-384 + 1090.982 / 2}
          cy={219 - SYSTEM_TOP + 1090.982 / 2}
          r={1090.982 / 2}
          fill="none"
          stroke="transparent"
          strokeWidth="22"
          pointerEvents="stroke"
          onMouseEnter={() => setOrbitHovered("outer")}
          onMouseLeave={() => setOrbitHovered(null)}
          style={{ cursor: "pointer" }}
        />

        <circle
          cx={-384 + 161.04 + 763.688 / 2}
          cy={219 - SYSTEM_TOP + 161.05 + 763.688 / 2}
          r={763.688 / 2}
          fill="none"
          stroke="transparent"
          strokeWidth="22"
          pointerEvents="stroke"
          onMouseEnter={() => setOrbitHovered("inner")}
          onMouseLeave={() => setOrbitHovered(null)}
          style={{ cursor: "pointer" }}
        />
      </svg>

      <AnimatePresence>
        {stages.map((stage) => {
          if (!revealedIds.has(stage.id)) return null;

          const geometry = NODE_GEOMETRY[stage.id];
          const color = resolveColor(stage.colorRole);
          const active = stage.id === activeStageId;
          const hovered = stage.id === hoveredStageId;

          return (
            <motion.button
              key={stage.id}
              type="button"
              onClick={() => onCommitStage(stage.id)}
              onMouseEnter={() => setHoveredStageId(stage.id)}
              onMouseLeave={() => setHoveredStageId(null)}
              initial={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.96 }
              }
              animate={{
                opacity: active ? 1 : hovered ? 0.94 : 0.64,
                scale: active ? 1.05 : hovered ? 1.025 : 1,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: reducedMotion ? 0.16 : 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                position: "absolute",
                left: pctX(geometry.x),
                top: pctY(geometry.y),
                width: `${(geometry.width / DESIGN_WIDTH) * 100}%`,
                minWidth: active ? 210 : 180,
                maxWidth: active ? 255 : 220,
                padding: 0,
                border: 0,
                background: "transparent",
                textAlign: "left",
                cursor: "pointer",
                color: "#F4EBD0",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: active ? "49px 1fr" : "46px 1fr",
                  gap: active ? 14 : 13,
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: active ? 49 : 46,
                    height: active ? 49 : 46,
                    borderRadius: "50%",
                    border: `1px solid ${color}${
                      active ? "D9" : hovered ? "B8" : "70"
                    }`,
                    background: `${color}${
                      active ? "1F" : hovered ? "16" : "0D"
                    }`,
                    boxShadow:
                      active || hovered
                        ? `0 0 31px ${color}38`
                        : `0 0 15px ${color}17`,
                  }}
                >
                  <span
                    style={{
                      width: active ? 9 : 8,
                      height: active ? 9 : 8,
                      borderRadius: "50%",
                      background: color,
                      boxShadow: `0 0 13px ${color}`,
                    }}
                  />
                </span>

                <span>
                  <span
                    style={{
                      display: "block",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: active ? 12.7 : 12.1,
                      lineHeight: 1.5,
                      letterSpacing: ".115em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      color: active
                        ? "rgba(255,248,230,.98)"
                        : "rgba(245,235,210,.74)",
                    }}
                  >
                    {stage.title}
                  </span>

                  {active && (
                    <span
                      style={{
                        display: "block",
                        marginTop: 5.5,
                        maxWidth: 160,
                        fontFamily: "'EB Garamond', serif",
                        fontSize: 15.5,
                        lineHeight: 1.4,
                        fontWeight: 500,
                        color: "rgba(245,235,210,.66)",
                      }}
                    >
                      {stage.summary}
                    </span>
                  )}
                </span>
              </div>
            </motion.button>
          );
        })}
      </AnimatePresence>

      {/* Exact Figma Make reading column: x≈691 / width≈395. */}
      <div
        style={{
          position: "absolute",
          left: pctX(691),
          top: pctY(229 - SYSTEM_TOP),
          width: READING_COLUMN_WIDTH,
          maxWidth: "34.21vw",
        }}
      >
        <div style={{ pointerEvents: "none" }}>
          <ExperienceAnnotation
            stage={activeStage}
            color={resolveColor(activeStage.colorRole)}
            compact
          />
        </div>

        {canAdvance && (
          <motion.div
            initial={
              reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reducedMotion ? 0 : 0.18,
              duration: reducedMotion ? 0.16 : 0.42,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ marginTop: 16 }}
          >
            <button
              type="button"
              onClick={onAdvance}
              style={{
                width: "100%",
                minHeight: 54,
                padding: "0 18px",
                border: "1.3px solid rgba(138,174,200,.34)",
                background: "rgba(7,9,16,.78)",
                color: "rgba(190,220,245,.90)",
                fontFamily: "'DM Mono', monospace",
                fontSize: 11.5,
                letterSpacing: ".145em",
                textTransform: "uppercase",
                textAlign: "left",
                cursor: "pointer",
                backdropFilter: "blur(10px)",
              }}
            >
              Next step
              <span
                aria-hidden="true"
                style={{ margin: "0 12px", opacity: 0.72 }}
              >
                →
              </span>
              {nextStage?.title ?? "Continue"}
            </button>
          </motion.div>
        )}

        {complete && activeStageId === "act" && (
          <motion.div
            initial={
              reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reducedMotion ? 0 : 0.22,
              duration: reducedMotion ? 0.16 : 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              marginTop: 16,
              width: "100%",
              boxSizing: "border-box",
              padding: "20px 20px",
              border: "1px solid rgba(200,169,110,.26)",
              background:
                "linear-gradient(145deg, rgba(18,14,8,.80), rgba(8,9,14,.92))",
              boxShadow:
                "0 18px 60px rgba(0,0,0,.28), 0 0 34px rgba(200,169,110,.05)",
              backdropFilter: "blur(14px)",
            }}
          >
            <div
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 18,
                color: "rgba(239,203,126,.96)",
                marginBottom: 6,
              }}
            >
              Ready to put it into practice?
            </div>

            <div
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 14,
                lineHeight: 1.5,
                color: "rgba(245,235,210,.64)",
                marginBottom: 13,
              }}
            >
              Move into a real example and see how the framework changes the
              interface.
            </div>

            <button
              type="button"
              onClick={onApply}
              style={{
                width: "100%",
                minHeight: 50,
                padding: "0 16px",
                border: "1px solid rgba(218,179,98,.54)",
                background:
                  "linear-gradient(180deg, rgba(218,179,98,.96), rgba(179,139,68,.92))",
                color: "rgba(18,13,7,.96)",
                fontFamily: "'DM Mono', monospace",
                fontSize: 9.5,
                fontWeight: 600,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: "0 0 24px rgba(218,179,98,.17)",
              }}
            >
              Learn how to apply this framework
              <span aria-hidden="true" style={{ marginLeft: 10 }}>
                →
              </span>
            </button>
          </motion.div>
        )}
      </div>

      {!complete && (
        <div
          style={{
            position: "absolute",
            left: "47%",
            bottom: 14,
            transform: "translateX(-50%)",
            display: "grid",
            justifyItems: "center",
            gap: 12,
          }}
        >
          <div
            aria-label={`${revealedCount} of ${ORDER.length} stages revealed`}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            {ORDER.map((id, index) => (
              <span
                key={id}
                aria-hidden="true"
                style={{
                  width: index < revealedCount ? 7 : 5,
                  height: index < revealedCount ? 7 : 5,
                  borderRadius: "50%",
                  background:
                    index < revealedCount
                      ? "rgba(200,169,110,.72)"
                      : "rgba(245,235,210,.14)",
                }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onRevealAll}
            aria-label="Reveal all behavioral stages"
            style={{
              minHeight: 44,
              padding: "0 14px",
              border: "1px solid rgba(245,235,210,.10)",
              background: "rgba(3,4,9,.24)",
              color: "rgba(245,235,210,.50)",
              fontFamily: "'DM Mono', monospace",
              fontSize: 9,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
            }}
          >
            Reveal all
          </button>
        </div>
      )}
    </div>
  );
}
