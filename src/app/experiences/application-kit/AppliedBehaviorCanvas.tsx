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
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 28% 38%, rgba(91,116,145,.07), transparent 32%), radial-gradient(circle at 72% 28%, rgba(92,69,128,.06), transparent 28%), radial-gradient(circle at 58% 72%, rgba(145,104,73,.045), transparent 30%)",
          filter: "blur(18px)",
          opacity: 0.9,
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.24,
          backgroundImage:
            "radial-gradient(circle at 12% 18%, rgba(255,255,255,.10) 0 1px, transparent 1.5px), radial-gradient(circle at 78% 24%, rgba(255,255,255,.08) 0 1px, transparent 1.5px), radial-gradient(circle at 43% 67%, rgba(255,255,255,.07) 0 1px, transparent 1.5px), radial-gradient(circle at 88% 78%, rgba(255,255,255,.06) 0 1px, transparent 1.5px)",
          backgroundSize: "220px 220px, 280px 280px, 320px 320px, 360px 360px",
        }}
      />

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
          border: "1px solid rgba(200,169,110,.07)",
          boxShadow: "0 0 90px rgba(200,169,110,.025)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 62,
            borderRadius: "50%",
            border: "1px solid rgba(138,174,200,.055)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 154,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 42% 36%, rgba(240,205,126,.82), rgba(177,143,84,.72) 58%, rgba(130,102,65,.68) 100%)",
            boxShadow:
              "0 0 26px rgba(200,169,110,.14), 0 0 64px rgba(200,169,110,.07)",
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
                stroke="rgba(138,174,200,.30)"
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
                opacity: active ? 1 : 0.64,
                scale: active ? 1.05 : 1,
              }}
              exit={{ opacity: 0 }}
              whileHover={
                reducedMotion
                  ? undefined
                  : { scale: active ? 1.05 : 1.025, opacity: 0.9 }
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
                background: "rgba(7,9,16,.76)",
                color: "rgba(190,220,245,.90)",
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

        {complete && activeStageId === "act" && (
          <motion.div
            initial={
              reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reducedMotion ? 0 : 0.24,
              duration: reducedMotion ? 0.16 : 0.52,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              marginTop: 14,
              width: 330,
              padding: "16px 17px",
              border: "1px solid rgba(200,169,110,.24)",
              background:
                "linear-gradient(145deg, rgba(18,14,8,.70), rgba(8,9,14,.88))",
              boxShadow: "0 18px 58px rgba(0,0,0,.28)",
            }}
          >
            <div
              style={{
                fontFamily: "'EB Garamond',serif",
                fontSize: 18,
                color: "rgba(239,203,126,.94)",
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
                color: "rgba(245,235,210,.62)",
                marginBottom: 12,
              }}
            >
              Explore a real example and apply these principles in context.
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
                letterSpacing: ".13em",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: "0 0 24px rgba(218,179,98,.16)",
              }}
            >
              Apply framework
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
        </div>
      )}
    </div>
  );
}
