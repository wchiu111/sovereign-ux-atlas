import { useMemo } from "react";
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

export default function ProgressiveBehaviorCanvas({
  stages,
  revealedCount,
  activeStageId,
  onCommitStage,
  onAdvance,
  onRevealAll,
  resolveColor,
}: ProgressiveBehaviorCanvasProps) {
  const reducedMotion = useReducedMotion();
  const revealedIds = useMemo(
    () => new Set(ORDER.slice(0, revealedCount)),
    [revealedCount],
  );

  const activeStage =
    stages.find((stage) => stage.id === activeStageId) ?? stages[0];
  const activeIndex = ORDER.indexOf(activeStageId);
  const canAdvance = revealedCount < ORDER.length;
  const nextStage = stages[revealedCount];

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
          border: "1px solid rgba(200,169,110,.06)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 62,
            borderRadius: "50%",
            border: "1px solid rgba(138,174,200,.045)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 154,
            borderRadius: "50%",
            background: "rgba(200,169,110,.66)",
            boxShadow: "0 0 38px rgba(200,169,110,.20)",
          }}
        />
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {ORDER.slice(0, Math.max(0, revealedCount - 1)).map(
          (fromId, index) => {
            const toId = ORDER[index + 1];
            const a = POSITIONS[fromId];
            const b = POSITIONS[toId];

            return (
              <motion.line
                key={`${fromId}-${toId}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="rgba(138,174,200,.28)"
                strokeWidth=".18"
                strokeDasharray="1.2 1.8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: reducedMotion ? 0.16 : 0.82,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            );
          },
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
                opacity: active ? 1 : 0.56,
                scale: active ? 1.05 : 1,
              }}
              exit={{ opacity: 0 }}
              whileHover={
                reducedMotion
                  ? undefined
                  : { scale: active ? 1.05 : 1.025, opacity: 0.86 }
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
                    border: `1px solid ${color}${active ? "C0" : "58"}`,
                    background: `${color}${active ? "18" : "08"}`,
                    boxShadow: active
                      ? `0 0 28px ${color}30`
                      : `0 0 12px ${color}12`,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: color,
                      boxShadow: `0 0 10px ${color}`,
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
                        ? "rgba(255,248,230,.96)"
                        : "rgba(245,235,210,.70)",
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
                        color: "rgba(245,235,210,.62)",
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
              reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }
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
                background: "rgba(7,9,16,.72)",
                color: "rgba(190,220,245,.86)",
                fontFamily: "'DM Mono',monospace",
                fontSize: 9.5,
                letterSpacing: ".145em",
                textTransform: "uppercase",
                textAlign: "left",
                cursor: "pointer",
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
      </div>

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

        {canAdvance && (
          <button
            type="button"
            onClick={onRevealAll}
            aria-label="Reveal all behavioral stages"
            style={{
              minHeight: 44,
              padding: "0 14px",
              border: "1px solid rgba(245,235,210,.10)",
              background: "transparent",
              color: "rgba(245,235,210,.48)",
              fontFamily: "'DM Mono',monospace",
              fontSize: 9,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Reveal all
          </button>
        )}
      </div>
    </div>
  );
}
