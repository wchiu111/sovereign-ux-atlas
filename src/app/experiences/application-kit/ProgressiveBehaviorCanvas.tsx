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

type Point = { x: number; y: number };

const POSITIONS: Record<BehavioralStageId, Point> = {
  interpret: { x: 34, y: 36 },
  separate: { x: 29, y: 53 },
  frame: { x: 36, y: 72 },
  recommend: { x: 58, y: 80 },
  confirm: { x: 78, y: 67 },
  act: { x: 76, y: 37 },
};

const ORDER: BehavioralStageId[] = [
  "interpret",
  "separate",
  "frame",
  "recommend",
  "confirm",
  "act",
];

/**
 * Normalized ranges along the single master trajectory.
 * These correspond to the six stage-to-stage arcs:
 *
 * Interpret→Separate→Frame→Recommend→Confirm→Act→Interpret
 *
 * The geometry is one continuous path. These ranges are used only for
 * progressive reveal and semantic hover color—not to construct separate
 * connector geometry.
 */
const PATH_STOPS = [0, 0.145, 0.305, 0.49, 0.665, 0.835, 1];

function buildClosedCatmullRomPath(
  points: Point[],
  tension = 0.92,
) {
  if (points.length < 3) return "";

  const count = points.length;
  let d = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < count; index += 1) {
    const p0 = points[(index - 1 + count) % count];
    const p1 = points[index];
    const p2 = points[(index + 1) % count];
    const p3 = points[(index + 2) % count];

    const cp1 = {
      x: p1.x + ((p2.x - p0.x) / 6) * tension,
      y: p1.y + ((p2.y - p0.y) / 6) * tension,
    };

    const cp2 = {
      x: p2.x - ((p3.x - p1.x) / 6) * tension,
      y: p2.y - ((p3.y - p1.y) / 6) * tension,
    };

    d += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p2.x} ${p2.y}`;
  }

  d += " Z";
  return d;
}

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
  const [trajectoryHovered, setTrajectoryHovered] = useState(false);

  const revealedIds = useMemo(
    () => new Set(ORDER.slice(0, revealedCount)),
    [revealedCount],
  );

  const masterPath = useMemo(
    () => buildClosedCatmullRomPath(ORDER.map((id) => POSITIONS[id])),
    [],
  );

  const activeStage =
    stages.find((stage) => stage.id === activeStageId) ?? stages[0];
  const activeIndex = ORDER.indexOf(activeStageId);
  const canAdvance = revealedCount < ORDER.length;
  const complete = revealedCount >= ORDER.length;
  const nextStage = stages[revealedCount];

  const revealedProgress =
    revealedCount <= 1
      ? 0
      : complete
        ? 1
        : PATH_STOPS[revealedCount - 1];

  const getStage = (id: BehavioralStageId) =>
    stages.find((stage) => stage.id === id)!;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: 660,
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "46%",
          top: "54%",
          width: 420,
          height: 420,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: "1px solid rgba(200,169,110,.08)",
          boxShadow: "0 0 100px rgba(0,0,0,.18)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 62,
            borderRadius: "50%",
            border: "1px solid rgba(138,174,200,.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 154,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 42% 34%, rgba(229,195,117,.88), rgba(174,140,81,.76) 62%, rgba(123,95,59,.70) 100%)",
            boxShadow:
              "0 0 34px rgba(200,169,110,.17), 0 0 78px rgba(200,169,110,.07)",
          }}
        />
      </div>

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <defs>
          {ORDER.map((fromId, index) => {
            const toId = ORDER[(index + 1) % ORDER.length];
            const from = POSITIONS[fromId];
            const to = POSITIONS[toId];
            const fromStage = getStage(fromId);
            const toStage = getStage(toId);

            return (
              <linearGradient
                key={`trajectory-gradient-${fromId}-${toId}`}
                id={`trajectory-gradient-${index}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  offset="0%"
                  stopColor={resolveColor(fromStage.colorRole)}
                  stopOpacity="0.8"
                />
                <stop
                  offset="100%"
                  stopColor={resolveColor(toStage.colorRole)}
                  stopOpacity="0.8"
                />
              </linearGradient>
            );
          })}

          <filter
            id="trajectory-glow"
            x="-60%"
            y="-60%"
            width="220%"
            height="220%"
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="3.5"
              result="blurred"
            />
            <feMerge>
              <feMergeNode in="blurred" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* One structural trajectory. Progressive disclosure changes only
            how much of the same path is visible. */}
        <motion.path
          d={masterPath}
          pathLength={1}
          fill="none"
          stroke="rgba(150,166,184,.34)"
          strokeWidth="0.18"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`${revealedProgress} ${1 - revealedProgress}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: revealedProgress > 0 ? 0.92 : 0 }}
          transition={{
            duration: reducedMotion ? 0.16 : 0.72,
            ease: [0.16, 1, 0.3, 1],
          }}
        />

        {/* Hover treatment uses the exact same master path. Each semantic
            color band is a dash-range overlay, so the geometry remains
            visually continuous rather than becoming six connector curves. */}
        {ORDER.map((fromId, index) => {
          const start = PATH_STOPS[index];
          const end = PATH_STOPS[index + 1];
          const range = end - start;
          const rangeVisible = revealedProgress >= end - 0.001;

          if (!rangeVisible) return null;

          return (
            <motion.path
              key={`trajectory-hover-${fromId}`}
              d={masterPath}
              pathLength={1}
              fill="none"
              stroke={`url(#trajectory-gradient-${index})`}
              strokeWidth={trajectoryHovered ? 0.34 : 0.18}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={`${range} ${1 - range}`}
              strokeDashoffset={-start}
              initial={{ opacity: 0 }}
              animate={{
                opacity: trajectoryHovered ? 0.92 : 0,
              }}
              transition={{
                duration: reducedMotion ? 0.16 : 0.45,
                ease: [0.16, 1, 0.3, 1],
              }}
              filter={
                trajectoryHovered && !reducedMotion
                  ? "url(#trajectory-glow)"
                  : undefined
              }
            />
          );
        })}

        {/* Wide invisible hit target over only the revealed portion. */}
        {revealedProgress > 0 && (
          <path
            d={masterPath}
            pathLength={1}
            fill="none"
            stroke="transparent"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${revealedProgress} ${1 - revealedProgress}`}
            pointerEvents="stroke"
            onMouseEnter={() => setTrajectoryHovered(true)}
            onMouseLeave={() => setTrajectoryHovered(false)}
            style={{ cursor: "pointer" }}
          />
        )}
      </svg>

      <AnimatePresence>
        {stages.map((stage) => {
          if (!revealedIds.has(stage.id)) return null;

          const p = POSITIONS[stage.id];
          const color = resolveColor(stage.colorRole);
          const active = stage.id === activeStageId;

          return (
            <motion.button
              key={stage.id}
              type="button"
              onClick={() => onCommitStage(stage.id)}
              initial={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.94 }
              }
              animate={{
                opacity: active ? 1 : 0.64,
                scale: active ? 1.05 : 1,
              }}
              exit={{ opacity: 0 }}
              whileHover={
                reducedMotion
                  ? undefined
                  : {
                      scale: active ? 1.05 : 1.025,
                      opacity: 0.9,
                    }
              }
              transition={{
                duration: reducedMotion ? 0.16 : 0.56,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                position: "absolute",
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: 200,
                transform: "translate(-50%, -50%)",
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
                  gridTemplateColumns: "44px 1fr",
                  gap: 13,
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: `1px solid ${color}${active ? "D8" : "70"}`,
                    background: `${color}${active ? "1E" : "0C"}`,
                    boxShadow: active
                      ? `0 0 28px ${color}38`
                      : `0 0 14px ${color}18`,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: color,
                      boxShadow: `0 0 12px ${color}`,
                    }}
                  />
                </span>

                <span>
                  <span
                    style={{
                      display: "block",
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 11.5,
                      letterSpacing: ".115em",
                      textTransform: "uppercase",
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
                        marginTop: 5,
                        fontFamily: "'EB Garamond',serif",
                        fontSize: 14,
                        lineHeight: 1.4,
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

      <div
        style={{
          position: "absolute",
          left:
            activeIndex <= 1
              ? "62%"
              : activeIndex >= 4
                ? "43%"
                : "63%",
          top: activeIndex <= 1 ? "8%" : "10%",
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
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 8 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reducedMotion ? 0 : 0.18,
              duration: reducedMotion ? 0.16 : 0.42,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              marginTop: 12,
              width: 300,
            }}
          >
            <button
              type="button"
              onClick={onAdvance}
              style={{
                width: "100%",
                minHeight: 48,
                padding: "0 15px",
                border: "1px solid rgba(138,174,200,.34)",
                background: "rgba(7,9,16,.78)",
                color: "rgba(190,220,245,.90)",
                fontFamily: "'DM Mono',monospace",
                fontSize: 9.5,
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
                style={{ margin: "0 10px", opacity: 0.72 }}
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
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 10 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reducedMotion ? 0 : 0.22,
              duration: reducedMotion ? 0.16 : 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              marginTop: 14,
              width: 350,
              padding: "17px 18px",
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
                fontFamily: "'EB Garamond',serif",
                fontSize: 18,
                color: "rgba(239,203,126,.96)",
                marginBottom: 6,
              }}
            >
              Ready to put it into practice?
            </div>

            <div
              style={{
                fontFamily: "'EB Garamond',serif",
                fontSize: 14,
                lineHeight: 1.5,
                color: "rgba(245,235,210,.64)",
                marginBottom: 13,
              }}
            >
              Move into a real example and see how the framework changes
              the interface.
            </div>

            <button
              type="button"
              onClick={onApply}
              style={{
                minHeight: 46,
                padding: "0 16px",
                border: "1px solid rgba(218,179,98,.54)",
                background:
                  "linear-gradient(180deg, rgba(218,179,98,.96), rgba(179,139,68,.92))",
                color: "rgba(18,13,7,.96)",
                fontFamily: "'DM Mono',monospace",
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
            left: "46%",
            bottom: 20,
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
              fontFamily: "'DM Mono',monospace",
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
