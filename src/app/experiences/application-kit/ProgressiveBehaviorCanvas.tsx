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

const POSITIONS: Record<BehavioralStageId, { x: number; y: number }> = {
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

type Connection = {
  from: BehavioralStageId;
  to: BehavioralStageId;
  d: string;
};

const CONNECTIONS: Connection[] = [
  {
    from: "interpret",
    to: "separate",
    d: "M 34 36 C 27 39, 25 46, 29 53",
  },
  {
    from: "separate",
    to: "frame",
    d: "M 29 53 C 27 62, 29 69, 36 72",
  },
  {
    from: "frame",
    to: "recommend",
    d: "M 36 72 C 43 80, 51 83, 58 80",
  },
  {
    from: "recommend",
    to: "confirm",
    d: "M 58 80 C 68 81, 76 75, 78 67",
  },
  {
    from: "confirm",
    to: "act",
    d: "M 78 67 C 83 58, 82 46, 76 37",
  },
  {
    from: "act",
    to: "interpret",
    d: "M 76 37 C 65 24, 46 23, 34 36",
  },
];

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
  const [hoveredConnection, setHoveredConnection] =
    useState<string | null>(null);

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

  const visibleConnections = CONNECTIONS.filter((connection) => {
    if (
      connection.from === "act" &&
      connection.to === "interpret"
    ) {
      return complete;
    }

    return (
      revealedIds.has(connection.from) &&
      revealedIds.has(connection.to)
    );
  });

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
          {visibleConnections.map((connection, index) => {
            const from = getStage(connection.from);
            const to = getStage(connection.to);
            const fromColor = resolveColor(from.colorRole);
            const toColor = resolveColor(to.colorRole);

            return (
              <linearGradient
                key={`gradient-${connection.from}-${connection.to}`}
                id={`connection-gradient-${index}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={fromColor} />
                <stop offset="100%" stopColor={toColor} />
              </linearGradient>
            );
          })}
        </defs>

        {visibleConnections.map((connection, index) => {
          const key = `${connection.from}-${connection.to}`;
          const hovered = hoveredConnection === key;

          return (
            <g key={key}>
              <motion.path
                d={connection.d}
                fill="none"
                stroke={
                  hovered
                    ? `url(#connection-gradient-${index})`
                    : "rgba(150,166,184,.34)"
                }
                strokeWidth={hovered ? 0.42 : 0.18}
                strokeLinecap="round"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{
                  opacity: hovered ? 1 : 0.92,
                  pathLength: 1,
                }}
                transition={{
                  duration: reducedMotion ? 0.16 : 0.72,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  filter: hovered
                    ? "drop-shadow(0 0 4px rgba(120,165,220,.45)) drop-shadow(0 0 9px rgba(190,120,220,.22))"
                    : "none",
                }}
              />

              <path
                d={connection.d}
                fill="none"
                stroke="transparent"
                strokeWidth="2.4"
                strokeLinecap="round"
                pointerEvents="stroke"
                onMouseEnter={() => setHoveredConnection(key)}
                onMouseLeave={() => setHoveredConnection(null)}
                style={{ cursor: "pointer" }}
              />
            </g>
          );
        })}
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
