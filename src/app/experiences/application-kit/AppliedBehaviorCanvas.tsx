import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { BehavioralStageId } from "./behavioralDecisionDesignData";

interface AppliedBehaviorCanvasProps {
  activeStageId: BehavioralStageId;
  onStageChange: (stageId: BehavioralStageId) => void;
}

type Priority = "fewest-conflicts" | "earliest" | "executive";

export default function AppliedBehaviorCanvas({
  activeStageId,
  onStageChange,
}: AppliedBehaviorCanvasProps) {
  const [priority, setPriority] =
    useState<Priority>("fewest-conflicts");
  const reducedMotion = useReducedMotion();

  const decision = useMemo(() => {
    if (priority === "earliest") {
      return {
        info: "Tuesday has one viable opening at 4:30 PM.",
        interpretation:
          "Tuesday is earliest, but two attendees marked late meetings as undesirable.",
        recommendation: "Tuesday at 4:30 PM",
        confidence: "Low–medium",
      };
    }

    if (priority === "executive") {
      return {
        info:
          "The executive sponsor is available Wednesday at 11 AM and Thursday at 3 PM.",
        interpretation:
          "Wednesday preserves the sponsor's preferred morning window but creates one attendee conflict.",
        recommendation: "Wednesday at 11:00 AM",
        confidence: "Medium",
      };
    }

    return {
      info: "3 teammates are unavailable Tuesday.",
      interpretation:
        "Wednesday creates the least scheduling conflict.",
      recommendation: "Wednesday at 2:00 PM",
      confidence: "Medium",
    };
  }, [priority]);

  return (
    <motion.section
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reducedMotion ? 0.16 : 0.48,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "220px minmax(0,1fr)",
        gap: 24,
        minHeight: 560,
      }}
    >
      <aside
        style={{
          padding: 18,
          border: "1px solid rgba(245,235,210,.07)",
          background: "rgba(255,255,255,.012)",
        }}
      >
        <div style={eyebrow}>Scenario</div>
        <div style={title}>Calendar Assistant</div>
        <p style={copy}>
          Change the decision criterion and watch how the system's
          interpretation and recommendation shift.
        </p>

        <div style={{ marginTop: 20 }}>
          <div style={{ ...eyebrow, marginBottom: 9 }}>Priority</div>
          {[
            ["fewest-conflicts", "Fewest conflicts"],
            ["earliest", "Earliest availability"],
            ["executive", "Executive preference"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setPriority(id as Priority)}
              aria-pressed={priority === id}
              style={{
                width: "100%",
                minHeight: 42,
                marginBottom: 6,
                padding: "0 10px",
                border:
                  priority === id
                    ? "1px solid rgba(101,214,154,.34)"
                    : "1px solid rgba(245,235,210,.06)",
                background:
                  priority === id
                    ? "rgba(101,214,154,.05)"
                    : "transparent",
                color:
                  priority === id
                    ? "rgba(245,235,210,.88)"
                    : "rgba(245,235,210,.50)",
                textAlign: "left",
                fontFamily: "'DM Mono',monospace",
                fontSize: 8.5,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </aside>

      <div
        style={{
          position: "relative",
          minWidth: 0,
          padding: "28px",
          border: "1px solid rgba(138,174,200,.09)",
          background:
            "linear-gradient(145deg, rgba(9,12,20,.92), rgba(6,8,15,.78))",
        }}
      >
        <div
          style={{
            marginBottom: 22,
            fontFamily: "'DM Mono',monospace",
            fontSize: 8,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "rgba(138,174,200,.68)",
          }}
        >
          One interface · six inspectable behavioral decisions
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <Layer
            label="Observe context"
            body={decision.info}
            active={activeStageId === "interpret"}
            onClick={() => onStageChange("interpret")}
          />
          <Layer
            label="Separate meaning"
            body={decision.interpretation}
            active={activeStageId === "separate"}
            onClick={() => onStageChange("separate")}
          />
          <Layer
            label="Frame options"
            body={`Priority: ${priority.replace("-", " ")}`}
            active={activeStageId === "frame"}
            onClick={() => onStageChange("frame")}
          />
          <Layer
            label="Recommendation"
            body={decision.recommendation}
            active={activeStageId === "recommend"}
            onClick={() => onStageChange("recommend")}
          />
          <Layer
            label="Confirmation"
            body={`Confidence: ${decision.confidence}. User approval is required before booking.`}
            active={activeStageId === "confirm"}
            onClick={() => onStageChange("confirm")}
          />
          <Layer
            label="Action"
            body="Book meeting only after explicit confirmation."
            active={activeStageId === "act"}
            onClick={() => onStageChange("act")}
          />
        </div>
      </div>
    </motion.section>
  );
}

function Layer({
  label,
  body,
  active,
  onClick,
}: {
  label: string;
  body: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        display: "grid",
        gridTemplateColumns: "140px 1fr",
        gap: 18,
        alignItems: "center",
        minHeight: 62,
        padding: "11px 13px",
        border: active
          ? "1px solid rgba(138,174,200,.34)"
          : "1px solid rgba(245,235,210,.055)",
        background: active
          ? "rgba(138,174,200,.055)"
          : "rgba(255,255,255,.01)",
        color: "#F4EBD0",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <span
        style={{
          fontFamily: "'DM Mono',monospace",
          fontSize: 8,
          letterSpacing: ".13em",
          textTransform: "uppercase",
          color: active
            ? "rgba(138,174,200,.90)"
            : "rgba(245,235,210,.40)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'EB Garamond',serif",
          fontSize: 14,
          lineHeight: 1.45,
          color: active
            ? "rgba(245,235,210,.84)"
            : "rgba(245,235,210,.58)",
        }}
      >
        {body}
      </span>
    </button>
  );
}

const eyebrow = {
  fontFamily: "'DM Mono',monospace",
  fontSize: 8,
  letterSpacing: ".20em",
  textTransform: "uppercase" as const,
  color: "rgba(101,214,154,.68)",
};

const title = {
  marginTop: 8,
  fontFamily: "'EB Garamond',serif",
  fontSize: 22,
  color: "rgba(255,248,230,.94)",
};

const copy = {
  margin: "10px 0 0",
  fontFamily: "'EB Garamond',serif",
  fontSize: 13.5,
  lineHeight: 1.55,
  color: "rgba(245,235,210,.54)",
};
