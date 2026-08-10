import { motion, useReducedMotion } from "motion/react";
import { resolveStellarColor } from "../../atlas/constellation/stellarPalette";
import {
  BEHAVIORAL_STAGES,
  type BehavioralStageId,
} from "./behavioralDecisionDesignData";

interface AppliedBehaviorCanvasProps {
  activeStageId: BehavioralStageId;
  onStageChange: (stageId: BehavioralStageId) => void;
}

export default function AppliedBehaviorCanvas({
  activeStageId,
  onStageChange,
}: AppliedBehaviorCanvasProps) {
  const reducedMotion = useReducedMotion();
  const activeStage =
    BEHAVIORAL_STAGES.find((stage) => stage.id === activeStageId) ??
    BEHAVIORAL_STAGES[0];

  const stageColor = resolveStellarColor(activeStage.colorRole, "#C8A96E");

  return (
    <motion.div
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reducedMotion ? 0.16 : 0.52,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,1.15fr) minmax(330px,.85fr)",
        gap: 22,
        width: "min(1180px, 100%)",
        margin: "0 auto",
      }}
    >
      <section
        style={{
          minHeight: 470,
          padding: 24,
          border: "1px solid rgba(245,235,210,.09)",
          background: "rgba(6,8,14,.76)",
          backdropFilter: "blur(14px)",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: 10,
            letterSpacing: ".16em",
            textTransform: "uppercase",
            color: "rgba(200,180,130,.62)",
          }}
        >
          Example · recommendation interface
        </div>

        <div
          style={{
            marginTop: 20,
            maxWidth: 620,
            fontFamily: "'EB Garamond',serif",
            fontSize: 26,
            lineHeight: 1.32,
            color: "rgba(255,248,230,.94)",
          }}
        >
          Should the system recommend a next step—or leave the decision open?
        </div>

        <div
          style={{
            marginTop: 24,
            display: "grid",
            gap: 10,
          }}
        >
          {BEHAVIORAL_STAGES.map((stage, index) => {
            const active = stage.id === activeStageId;
            const color = resolveStellarColor(stage.colorRole, "#C8A96E");

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => onStageChange(stage.id)}
                aria-pressed={active}
                style={{
                  display: "grid",
                  gridTemplateColumns: "30px 118px 1fr",
                  gap: 12,
                  alignItems: "center",
                  minHeight: 54,
                  padding: "8px 12px",
                  border: active
                    ? `1px solid ${color}66`
                    : "1px solid rgba(245,235,210,.07)",
                  background: active ? `${color}0E` : "rgba(3,4,9,.26)",
                  color: "inherit",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: `1px solid ${color}${active ? "C0" : "66"}`,
                    color,
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 9,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span
                  style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 10.5,
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: active
                      ? "rgba(255,248,230,.95)"
                      : "rgba(245,235,210,.60)",
                  }}
                >
                  {stage.title}
                </span>

                <span
                  style={{
                    fontFamily: "'EB Garamond',serif",
                    fontSize: 16,
                    lineHeight: 1.4,
                    color: active
                      ? "rgba(245,235,210,.80)"
                      : "rgba(245,235,210,.50)",
                  }}
                >
                  {stage.summary}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <aside
        style={{
          alignSelf: "start",
          padding: 24,
          border: `1px solid ${stageColor}44`,
          background:
            "linear-gradient(145deg, rgba(12,15,24,.92), rgba(7,9,16,.88))",
          boxShadow: `0 20px 70px rgba(0,0,0,.28), 0 0 34px ${stageColor}0C`,
          backdropFilter: "blur(16px)",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: 10,
            letterSpacing: ".17em",
            textTransform: "uppercase",
            color: stageColor,
          }}
        >
          {activeStage.title}
        </div>

        <div
          style={{
            marginTop: 16,
            fontFamily: "'EB Garamond',serif",
            fontSize: 22,
            lineHeight: 1.35,
            color: "rgba(255,248,230,.92)",
          }}
        >
          {activeStage.detail}
        </div>

        <div
          style={{
            marginTop: 24,
            paddingTop: 18,
            borderTop: "1px solid rgba(245,235,210,.08)",
          }}
        >
          <div
            style={{
              marginBottom: 12,
              fontFamily: "'DM Mono',monospace",
              fontSize: 9.5,
              letterSpacing: ".15em",
              textTransform: "uppercase",
              color: "rgba(200,180,130,.58)",
            }}
          >
            Questions to inspect
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {activeStage.prompts.map((prompt) => (
              <div
                key={prompt}
                style={{
                  display: "grid",
                  gridTemplateColumns: "14px 1fr",
                  gap: 9,
                  fontFamily: "'EB Garamond',serif",
                  fontSize: 16,
                  lineHeight: 1.45,
                  color: "rgba(245,235,210,.68)",
                }}
              >
                <span style={{ color: stageColor }}>◇</span>
                <span>{prompt}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </motion.div>
  );
}
