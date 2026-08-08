import { motion, useReducedMotion } from "motion/react";
import type { BehavioralStage } from "./behavioralDecisionDesignData";

interface ExperienceAnnotationProps {
  stage: BehavioralStage;
  color: string;
  compact?: boolean;
}

export default function ExperienceAnnotation({
  stage,
  color,
  compact = false,
}: ExperienceAnnotationProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.aside
      key={stage.id}
      initial={
        reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }
      }
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reducedMotion ? 0.16 : 0.42,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        width: compact ? 300 : 350,
        maxWidth: "min(350px, 84vw)",
        padding: compact ? "16px 17px" : "19px 20px",
        border: "1px solid rgba(245,235,210,.10)",
        background:
          "linear-gradient(145deg, rgba(12,15,24,.94), rgba(7,9,16,.90))",
        boxShadow: "0 18px 60px rgba(0,0,0,.32)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          marginBottom: 11,
          fontFamily: "'DM Mono',monospace",
          fontSize: 9.5,
          letterSpacing: ".18em",
          textTransform: "uppercase",
          color,
        }}
      >
        {stage.title}
      </div>

      <div style={{ display: "grid", gap: compact ? 13 : 15 }}>
        <Block label="What you're seeing" value={stage.annotation.what} />
        <Block label="Why it matters" value={stage.annotation.why} />
        {!compact && (
          <>
            <Block
              label="Sovereign principle"
              value={stage.annotation.principle}
            />
            <Block
              label="Question to consider"
              value={stage.annotation.question}
            />
          </>
        )}
      </div>
    </motion.aside>
  );
}

function Block({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div
        style={{
          marginBottom: 6,
          fontFamily: "'DM Mono',monospace",
          fontSize: 8,
          letterSpacing: ".16em",
          textTransform: "uppercase",
          color: "rgba(200,180,130,.54)",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontFamily: "'EB Garamond',serif",
          fontSize: 14.5,
          lineHeight: 1.55,
          color: "rgba(245,235,210,.76)",
        }}
      >
        {value}
      </div>
    </div>
  );
}
