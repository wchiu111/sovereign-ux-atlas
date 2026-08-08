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
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reducedMotion ? 0.16 : 0.42,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        width: compact ? 280 : 330,
        maxWidth: "min(330px, 82vw)",
        padding: compact ? "14px 15px" : "17px 18px",
        border: "1px solid rgba(245,235,210,.10)",
        background:
          "linear-gradient(145deg, rgba(12,15,24,.94), rgba(7,9,16,.90))",
        boxShadow: "0 18px 60px rgba(0,0,0,.32)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          marginBottom: 9,
          fontFamily: "'DM Mono',monospace",
          fontSize: 8,
          letterSpacing: ".20em",
          textTransform: "uppercase",
          color,
        }}
      >
        {stage.title}
      </div>

      <div style={{ display: "grid", gap: compact ? 10 : 12 }}>
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
          marginBottom: 4,
          fontFamily: "'DM Mono',monospace",
          fontSize: 7,
          letterSpacing: ".17em",
          textTransform: "uppercase",
          color: "rgba(200,180,130,.48)",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'EB Garamond',serif",
          fontSize: 13,
          lineHeight: 1.48,
          color: "rgba(245,235,210,.72)",
        }}
      >
        {value}
      </div>
    </div>
  );
}
