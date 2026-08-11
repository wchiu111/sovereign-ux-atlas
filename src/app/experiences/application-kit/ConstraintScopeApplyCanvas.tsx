import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import {
  CONSTRAINT_SCOPE_APPLY,
  CONSTRAINT_SCOPE_STAGES,
  type ConstraintScopeStageId,
} from "./constraintScopeDesignData";

type Variant = "without" | "with";

const VARIANTS: Array<{ id: Variant; label: string }> = [
  { id: "without", label: "Without framework" },
  { id: "with", label: "With framework" },
];

export default function ConstraintScopeApplyCanvas() {
  const reducedMotion = useReducedMotion();
  const [variant, setVariant] = useState<Variant>("without");
  const [focusId, setFocusId] =
    useState<ConstraintScopeStageId | null>(null);

  return (
    <div style={styles.canvas}>
      <VariantToggle variant={variant} onChange={setVariant} />

      <div style={styles.contentGrid}>
        <motion.section
          key={variant}
          initial={
            reducedMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 8 }
          }
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: reducedMotion ? 0.16 : 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ ...styles.interfacePanel, opacity: 0 }}
        >
          {variant === "without" ? (
            <WithoutFramework />
          ) : (
            <WithFramework focusId={focusId} />
          )}
        </motion.section>

        <FrameworkPanel
          active={variant === "with"}
          focusId={focusId}
          onFocusChange={setFocusId}
        />
      </div>
    </div>
  );
}

function VariantToggle({
  variant,
  onChange,
}: {
  variant: Variant;
  onChange: (variant: Variant) => void;
}) {
  return (
    <div style={styles.toggleWrapper}>
      <div style={styles.toggle}>
        {VARIANTS.map(({ id, label }) => {
          const active = variant === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-pressed={active}
              style={{
                ...styles.toggleButton,
                borderRight:
                  id === "without"
                    ? "1px solid rgba(245,235,210,.10)"
                    : 0,
                background: active
                  ? "rgba(221,180,90,.08)"
                  : "transparent",
                color: active
                  ? "rgba(255,248,230,.92)"
                  : "rgba(245,235,210,.48)",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FrameworkPanel({
  active,
  focusId,
  onFocusChange,
}: {
  active: boolean;
  focusId: ConstraintScopeStageId | null;
  onFocusChange: (id: ConstraintScopeStageId | null) => void;
}) {
  return (
    <aside
      style={{
        ...styles.frameworkPanel,
        opacity: active ? 1 : 0.22,
        pointerEvents: active ? "auto" : "none",
      }}
    >
      <div style={styles.frameworkPanelTitle}>What changed?</div>

      <div style={styles.stageList}>
        {CONSTRAINT_SCOPE_STAGES.map((stage, index) => {
          const focused = stage.id === focusId;

          return (
            <button
              key={stage.id}
              type="button"
              onMouseEnter={() => onFocusChange(stage.id)}
              onMouseLeave={() => onFocusChange(null)}
              onFocus={() => onFocusChange(stage.id)}
              onBlur={() => onFocusChange(null)}
              onClick={() =>
                onFocusChange(focused ? null : stage.id)
              }
              style={{
                ...styles.stageButton,
                background: focused
                  ? `${stage.color}0A`
                  : "transparent",
              }}
            >
              <span
                style={{
                  ...styles.stageNumber,
                  color: stage.color,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <span style={styles.stageName}>{stage.title}</span>
              <span style={styles.stageSummary}>{stage.summary}</span>
            </button>
          );
        })}
      </div>

      <div style={styles.frameworkPanelFooter}>
        Hover a principle to focus on how it changes the interface.
      </div>
    </aside>
  );
}

function WithoutFramework() {
  return (
    <>
      <InterfaceHeader />

      <div style={eyebrow("#EF6B63")}>AI coverage answer</div>

      <div style={styles.userQuestion}>
        “{CONSTRAINT_SCOPE_APPLY.question}”
      </div>

      <div
        style={{
          ...styles.answerPanel,
          marginTop: 18,
          borderColor: "rgba(239,84,84,.34)",
        }}
      >
        <div style={styles.smallLabel}>Coverage determination</div>
        <h3 style={styles.headline}>
          {CONSTRAINT_SCOPE_APPLY.without.answer}
        </h3>
        <div style={{ ...styles.body, marginTop: 7 }}>
          {CONSTRAINT_SCOPE_APPLY.without.rationale}
        </div>
      </div>

      <button
        type="button"
        style={{
          ...styles.primaryButton,
          marginTop: 18,
          background: "#EF5454",
        }}
      >
        {CONSTRAINT_SCOPE_APPLY.without.primaryAction}
      </button>

      <button
        type="button"
        style={{
          ...styles.secondaryButton,
          marginTop: 10,
        }}
      >
        {CONSTRAINT_SCOPE_APPLY.without.secondaryAction}
      </button>

      <div style={styles.footnote}>
        The answer appears definitive even though final coverage depends on
        information the assistant cannot verify.
      </div>
    </>
  );
}

function WithFramework({
  focusId,
}: {
  focusId: ConstraintScopeStageId | null;
}) {
  const visible = (ids: ConstraintScopeStageId[]) =>
    focusId === null || ids.includes(focusId);

  return (
    <>
      <InterfaceHeader />

      <div style={eyebrow("#D9B759")}>Coverage guidance</div>

      <div style={styles.userQuestion}>
        “{CONSTRAINT_SCOPE_APPLY.question}”
      </div>

      <FocusSection
        label="Capability & boundary"
        dim={!visible(["capability", "boundary", "disclosure"])}
      >
        <div
          style={{
            ...styles.answerPanel,
            borderColor: "rgba(221,180,90,.34)",
          }}
        >
          <div style={styles.smallLabel}>Guidance, not final determination</div>
          <h3 style={styles.headline}>
            {CONSTRAINT_SCOPE_APPLY.with.answer}
          </h3>
        </div>
      </FocusSection>

      <FocusSection
        label="What I can verify"
        dim={!visible(["capability", "disclosure"])}
      >
        <BulletList
          items={CONSTRAINT_SCOPE_APPLY.with.verified}
          color="#78C88E"
        />
      </FocusSection>

      <FocusSection
        label="What I can't verify"
        dim={!visible(["boundary", "limitation", "non-action"])}
      >
        <BulletList
          items={CONSTRAINT_SCOPE_APPLY.with.cannotVerify}
          color="#D88C46"
        />
      </FocusSection>

      <FocusSection
        label="Next best action"
        dim={!visible(["escalation", "handoff", "non-action"])}
      >
        <div style={styles.handoffPanel}>
          <div style={styles.body}>
            {CONSTRAINT_SCOPE_APPLY.with.nextAction}
          </div>

          <button
            type="button"
            style={{
              ...styles.primaryButton,
              marginTop: 14,
              background: "#D9B759",
              color: "#0B0905",
            }}
          >
            {CONSTRAINT_SCOPE_APPLY.with.primaryAction}
          </button>
        </div>
      </FocusSection>
    </>
  );
}

function BulletList({
  items,
  color,
}: {
  items: readonly string[];
  color: string;
}) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {items.map((item) => (
        <div key={item} style={styles.bulletRow}>
          <span
            aria-hidden="true"
            style={{
              color,
              fontFamily: "'DM Mono',monospace",
            }}
          >
            ◇
          </span>

          <span style={styles.body}>{item}</span>
        </div>
      ))}
    </div>
  );
}

function FocusSection({
  label,
  dim,
  children,
}: {
  label: string;
  dim: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        marginTop: 16,
        opacity: dim ? 0.18 : 1,
        transition: "opacity .28s ease",
      }}
    >
      <div style={{ ...styles.smallLabel, marginBottom: 8 }}>
        {label}
      </div>
      {children}
    </section>
  );
}

function InterfaceHeader() {
  return (
    <div style={styles.interfaceHeader}>
      <div style={styles.interfaceIdentity}>
        <div style={styles.assistantIcon}>✦</div>
        <div
          style={{
            ...styles.body,
            fontSize: 16,
            color: "rgba(255,248,230,.90)",
          }}
        >
          Benefits Assistant
        </div>
      </div>

      <div style={{ color: "rgba(245,235,210,.38)" }}>⋮</div>
    </div>
  );
}

function eyebrow(color: string) {
  return {
    fontFamily: "'DM Mono',monospace",
    fontSize: 8,
    letterSpacing: ".14em",
    textTransform: "uppercase" as const,
    color,
  };
}

const styles = {
  canvas: { maxWidth: 1030, margin: "0 auto" },
  toggleWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 22,
  },
  toggle: {
    display: "inline-flex",
    border: "1px solid rgba(245,235,210,.10)",
  },
  toggleButton: {
    minWidth: 158,
    minHeight: 46,
    padding: "0 16px",
    border: 0,
    fontFamily: "'DM Mono',monospace",
    fontSize: 9,
    letterSpacing: ".13em",
    textTransform: "uppercase" as const,
    cursor: "pointer",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0,1fr) 330px",
    gap: 24,
    alignItems: "start",
  },
  interfacePanel: {
    padding: 22,
    border: "1px solid rgba(245,235,210,.10)",
    background:
      "linear-gradient(180deg,rgba(8,11,18,.91),rgba(4,7,12,.88))",
  },
  frameworkPanel: {
    padding: "18px 17px",
    border: "1px solid rgba(245,235,210,.09)",
    background: "rgba(4,7,12,.74)",
    transition: "opacity .35s cubic-bezier(.16,1,.3,1)",
  },
  frameworkPanelTitle: {
    marginBottom: 14,
    fontFamily: "'DM Mono',monospace",
    fontSize: 8,
    letterSpacing: ".16em",
    textTransform: "uppercase" as const,
    color: "rgba(200,180,130,.66)",
  },
  stageList: { display: "grid", gap: 4 },
  stageButton: {
    display: "grid",
    gridTemplateColumns: "34px 110px 1fr",
    gap: 10,
    minHeight: 55,
    padding: "9px 8px",
    border: 0,
    color: "inherit",
    textAlign: "left" as const,
    cursor: "pointer",
  },
  stageNumber: {
    fontFamily: "'DM Mono',monospace",
    fontSize: 9,
  },
  stageName: {
    fontFamily: "'DM Mono',monospace",
    fontSize: 8.5,
    letterSpacing: ".10em",
    textTransform: "uppercase" as const,
    color: "rgba(245,235,210,.72)",
  },
  stageSummary: {
    fontFamily: "'EB Garamond',serif",
    fontSize: 14,
    lineHeight: 1.3,
    color: "rgba(245,235,210,.58)",
  },
  frameworkPanelFooter: {
    marginTop: 16,
    paddingTop: 14,
    borderTop: "1px solid rgba(245,235,210,.08)",
    fontFamily: "'EB Garamond',serif",
    fontSize: 13.5,
    lineHeight: 1.45,
    color: "rgba(245,235,210,.42)",
  },
  interfaceHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    marginBottom: 18,
    borderBottom: "1px solid rgba(245,235,210,.08)",
  },
  interfaceIdentity: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  assistantIcon: {
    width: 30,
    height: 30,
    borderRadius: 7,
    display: "grid",
    placeItems: "center",
    background: "rgba(217,183,89,.78)",
    color: "#0B0905",
  },
  userQuestion: {
    marginTop: 10,
    fontFamily: "'EB Garamond',serif",
    fontSize: 20,
    lineHeight: 1.35,
    color: "rgba(245,235,210,.72)",
  },
  answerPanel: {
    padding: "15px 16px",
    border: "1px solid rgba(245,235,210,.12)",
    background: "rgba(9,13,20,.54)",
  },
  headline: {
    margin: "8px 0 0",
    fontFamily: "'EB Garamond',serif",
    fontSize: 28,
    lineHeight: 1.16,
    fontWeight: 500,
    color: "rgba(255,248,230,.95)",
  },
  body: {
    fontFamily: "'EB Garamond',serif",
    fontSize: 14.5,
    lineHeight: 1.42,
    color: "rgba(245,235,210,.62)",
  },
  smallLabel: {
    fontFamily: "'DM Mono',monospace",
    fontSize: 8,
    letterSpacing: ".13em",
    textTransform: "uppercase" as const,
    color: "rgba(200,180,130,.56)",
  },
  primaryButton: {
    width: "100%",
    minHeight: 48,
    border: 0,
    color: "rgba(255,255,255,.96)",
    fontFamily: "'EB Garamond',serif",
    fontSize: 15.5,
    cursor: "pointer",
  },
  secondaryButton: {
    width: "100%",
    minHeight: 46,
    border: "1px solid rgba(245,235,210,.14)",
    background: "transparent",
    color: "rgba(245,235,210,.82)",
    fontFamily: "'EB Garamond',serif",
    fontSize: 15,
    cursor: "pointer",
  },
  footnote: {
    marginTop: 40,
    textAlign: "center" as const,
    fontFamily: "'EB Garamond',serif",
    fontSize: 13.5,
    lineHeight: 1.45,
    color: "rgba(245,235,210,.40)",
  },
  bulletRow: {
    display: "grid",
    gridTemplateColumns: "20px 1fr",
    gap: 8,
    alignItems: "start",
    padding: "9px 10px",
    border: "1px solid rgba(245,235,210,.07)",
  },
  handoffPanel: {
    padding: "14px 15px",
    border: "1px solid rgba(221,180,90,.22)",
    background: "rgba(221,180,90,.035)",
  },
};
