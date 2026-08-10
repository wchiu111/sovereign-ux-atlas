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
 * This is the actual 420 × 420 outer ring already present in the experience.
 * The stage nodes now sit directly on this circle.
 */
const ORBIT_SIZE = 420;
const ORBIT_CENTER = ORBIT_SIZE / 2;
const ORBIT_RADIUS = 204;

const ANGLES: Record<BehavioralStageId, number> = {
  interpret: 220,
  separate: 180,
  frame: 135,
  recommend: 55,
  confirm: 15,
  act: -35,
};

type Point = { x: number; y: number };

function pointOnCircle(angleDeg: number): Point {
  const radians = (angleDeg * Math.PI) / 180;

  return {
    x: ORBIT_CENTER + ORBIT_RADIUS * Math.cos(radians),
    y: ORBIT_CENTER + ORBIT_RADIUS * Math.sin(radians),
  };
}

const NODE_POINTS: Record<BehavioralStageId, Point> = ORDER.reduce(
  (acc, id) => {
    acc[id] = pointOnCircle(ANGLES[id]);
    return acc;
  },
  {} as Record<BehavioralStageId, Point>,
);

function describeArc(
  fromAngle: number,
  toAngle: number,
  radius = ORBIT_RADIUS,
) {
  const from = pointOnCircle(fromAngle);
  const to = pointOnCircle(toAngle);

  let delta = fromAngle - toAngle;
  if (delta < 0) delta += 360;

  const largeArcFlag = delta > 180 ? 1 : 0;
  const sweepFlag = 0;

  return [
    "M",
    from.x,
    from.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    sweepFlag,
    to.x,
    to.y,
  ].join(" ");
}

const SEGMENTS = [
  { from: "interpret", to: "separate", fromAngle: 220, toAngle: 180 },
  { from: "separate", to: "frame", fromAngle: 180, toAngle: 135 },
  { from: "frame", to: "recommend", fromAngle: 135, toAngle: 55 },
  { from: "recommend", to: "confirm", fromAngle: 55, toAngle: 15 },
  { from: "confirm", to: "act", fromAngle: 15, toAngle: -35 },
  { from: "act", to: "interpret", fromAngle: -35, toAngle: -140 },
] as const;

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
  const [orbitHovered, setOrbitHovered] = useState(false);
  const [hoveredStageId, setHoveredStageId] =
    useState<BehavioralStageId | null>(null);

  const revealedIds = useMemo(
    () => new Set(ORDER.slice(0, revealedCount)),
    [revealedCount],
  );

  const activeStage =
    stages.find((stage) => stage.id === activeStageId) ?? stages[0];
  const activeIndex = ORDER.indexOf(activeStageId);
  const canAdvance = revealedCount < ORDER.length;
  const complete = revealedCount >= ORDER.length;
  const nextStage = stages[revealedCount];
  const orbitActive = orbitHovered || hoveredStageId !== null;

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
      {/* Actual 420px outer ring + all stage nodes share the same coordinate space. */}
      <div
        style={{
          position: "absolute",
          left: "46%",
          top: "54%",
          width: ORBIT_SIZE,
          height: ORBIT_SIZE,
          transform: "translate(-50%, -50%)",
          overflow: "visible",
        }}
      >
        <svg
          viewBox={`0 0 ${ORBIT_SIZE} ${ORBIT_SIZE}`}
          width={ORBIT_SIZE}
          height={ORBIT_SIZE}
          style={{
            position: "absolute",
            inset: 0,
            overflow: "visible",
            pointerEvents: "none",
          }}
        >
          <defs>
            {SEGMENTS.map((segment, index) => {
              const fromId = segment.from as BehavioralStageId;
              const toId = segment.to as BehavioralStageId;
              const fromStage = getStage(fromId);
              const toStage = getStage(toId);
              const fromPoint = NODE_POINTS[fromId];
              const toPoint = NODE_POINTS[toId];

              return (
                <linearGradient
                  key={`outer-ring-gradient-${index}`}
                  id={`outer-ring-gradient-${index}`}
                  x1={fromPoint.x}
                  y1={fromPoint.y}
                  x2={toPoint.x}
                  y2={toPoint.y}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop
                    offset="0%"
                    stopColor={resolveColor(fromStage.colorRole)}
                    stopOpacity="0.82"
                  />
                  <stop
                    offset="100%"
                    stopColor={resolveColor(toStage.colorRole)}
                    stopOpacity="0.82"
                  />
                </linearGradient>
              );
            })}

            <filter
              id="outer-ring-glow"
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
            >
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="3.5"
                result="ringBlur"
              />
              <feMerge>
                <feMergeNode in="ringBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Quiet structural outer ring. */}
          <circle
            cx={ORBIT_CENTER}
            cy={ORBIT_CENTER}
            r={ORBIT_RADIUS}
            fill="none"
            stroke="rgba(150,166,184,.24)"
            strokeWidth="1"
          />

          {/* Semantic color lives on the same ring, never on a second route. */}
          {SEGMENTS.map((segment, index) => (
            <motion.path
              key={`outer-ring-segment-${index}`}
              d={describeArc(segment.fromAngle, segment.toAngle)}
              fill="none"
              stroke={`url(#outer-ring-gradient-${index})`}
              strokeWidth={orbitActive ? 2.1 : 1}
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: orbitActive ? 0.96 : 0 }}
              transition={{
                duration: reducedMotion ? 0.16 : 0.46,
                ease: [0.16, 1, 0.3, 1],
              }}
              filter={
                orbitActive && !reducedMotion
                  ? "url(#outer-ring-glow)"
                  : undefined
              }
            />
          ))}

          {/* One wide hit target for the ring itself. */}
          <circle
            cx={ORBIT_CENTER}
            cy={ORBIT_CENTER}
            r={ORBIT_RADIUS}
            fill="none"
            stroke="transparent"
            strokeWidth="18"
            pointerEvents="stroke"
            onMouseEnter={() => setOrbitHovered(true)}
            onMouseLeave={() => setOrbitHovered(false)}
            style={{ cursor: "pointer" }}
          />

          {/* Inner guide ring remains atmospheric only. */}
          <circle
            cx={ORBIT_CENTER}
            cy={ORBIT_CENTER}
            r={146}
            fill="none"
            stroke="rgba(138,174,200,.05)"
            strokeWidth="1"
          />
        </svg>

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 112,
            height: 112,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 42% 34%, rgba(229,195,117,.88), rgba(174,140,81,.76) 62%, rgba(123,95,59,.70) 100%)",
            boxShadow:
              "0 0 34px rgba(200,169,110,.17), 0 0 78px rgba(200,169,110,.07)",
            pointerEvents: "none",
          }}
        />

        <AnimatePresence>
          {stages.map((stage) => {
            if (!revealedIds.has(stage.id)) return null;

            const p = NODE_POINTS[stage.id];
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
                    : { opacity: 0, scale: 0.94 }
                }
                animate={{
                  opacity: active ? 1 : hovered ? 0.94 : 0.66,
                  scale: active ? 1.05 : hovered ? 1.025 : 1,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: reducedMotion ? 0.16 : 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  position: "absolute",
                  left: p.x,
                  top: p.y,
                  width: 200,
                  transform: "translate(-22px, -22px)",
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
                      border: `1px solid ${color}${
                        active ? "D8" : hovered ? "B8" : "70"
                      }`,
                      background: `${color}${
                        active ? "1E" : hovered ? "16" : "0C"
                      }`,
                      boxShadow:
                        active || hovered
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
      </div>

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
