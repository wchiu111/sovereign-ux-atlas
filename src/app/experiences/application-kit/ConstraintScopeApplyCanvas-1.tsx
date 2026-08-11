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
        opacity: active ? 1 : 0.2,
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
              onClick={() => onFocusChange(focused ? null : stage.id)}
              style={{
                ...styles.stageButton,
                background: focused ? `${stage.color}08` : "transparent",
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

              <span
                style={{
                  ...styles.stageSummary,
                  opacity: focused ? 1 : 0,
                  maxHeight: focused ? 48 : 0,
                  marginTop: focused ? 6 : 0,
                }}
              >
                {stage.summary}
              </span>
            </button>
          );
        })}
      </div>

      <div style={styles.frameworkPanelFooter}>
        Hover a principle to see how it changes this interface.
      </div>
    </aside>
  );
}

function WithoutFramework() {
  return (
    <>
      <InterfaceHeader />

      <div style={styles.requestLabel}>You asked</div>
      <div style={styles.userQuestion}>
        Is this procedure covered by my health plan?
      </div>

      <div style={styles.sectionLabel}>Coverage result</div>
      <div style={styles.resultPanel}>
        <h3 style={styles.headline}>
          Yes, this procedure is covered.
        </h3>

        <div style={styles.body}>
          Based on your current plan benefits.
        </div>

        <div style={styles.inlineMeta}>
          <span>In-network benefit</span>
          <span aria-hidden="true">·</span>
          <span>Specialist referral may apply</span>
        </div>
      </div>

      <button
        type="button"
        style={{
          ...styles.primaryButton,
          marginTop: 22,
          background: "#DDB85A",
          color: "#0A0906",
        }}
      >
        Continue to authorization →
      </button>

      <button
        type="button"
        style={{
          ...styles.secondaryButton,
          marginTop: 10,
        }}
      >
        View coverage details
      </button>

      <div style={styles.footnote}>
        Final coverage may still depend on coding, network status, and prior
        authorization requirements.
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

      <div style={styles.requestLabel}>You asked</div>
      <div style={styles.userQuestion}>
        Is this procedure covered by my health plan?
      </div>

      <FocusSection
        dim={!visible(["capability", "boundary", "disclosure"])}
      >
        <div style={styles.sectionLabel}>Coverage result</div>

        <div
          style={{
            ...styles.resultPanel,
            borderColor: "rgba(221,184,90,.46)",
            background:
              "linear-gradient(180deg,rgba(221,184,90,.06),rgba(9,13,20,.42))",
          }}
        >
          <h3
            style={{
              ...styles.headline,
              color: "#E2BE62",
            }}
          >
            Likely covered.
          </h3>

          <div style={styles.boundaryCopy}>
            This is guidance, not a final coverage determination.
          </div>
        </div>
      </FocusSection>

      <FocusSection dim={!visible(["capability", "disclosure"])}>
        <div style={{ ...styles.sectionLabel, color: "#79C98E" }}>
          What I can verify
        </div>

        <EvidenceList
          items={[
            "This category of service appears in your plan benefits.",
            "Your current plan is active.",
          ]}
          color="#79C98E"
          icon="✓"
        />
      </FocusSection>

      <FocusSection
        dim={!visible(["boundary", "limitation", "non-action"])}
      >
        <div style={{ ...styles.sectionLabel, color: "#D98A42" }}>
          Still needs verification
        </div>

        <EvidenceList
          items={[
            "Final procedure code",
            "Provider network status",
            "Prior authorization requirements",
            "Eligibility at time of service",
          ]}
          color="#D98A42"
          icon="◇"
        />
      </FocusSection>

      <FocusSection
        dim={!visible(["escalation", "handoff", "non-action"])}
      >
        <div style={styles.divider} />

        <div style={{ ...styles.sectionLabel, color: "#B99AE5" }}>
          Next step
        </div>

        <div style={styles.handoffCopy}>
          A benefits specialist can confirm final coverage. Your plan details
          and this request will be included automatically.
        </div>

        <button
          type="button"
          style={{
            ...styles.secondaryButton,
            marginTop: 16,
            borderColor: "rgba(185,154,229,.42)",
            color: "#C8A8EE",
          }}
        >
          Review with specialist →
        </button>
      </FocusSection>
    </>
  );
}

function EvidenceList({
  items,
  color,
  icon,
}: {
  items: string[];
  color: string;
  icon: string;
}) {
  return (
    <div style={styles.evidenceList}>
      {items.map((item) => (
        <div key={item} style={styles.evidenceRow}>
          <span
            aria-hidden="true"
            style={{
              color,
              fontFamily: "'DM Mono',monospace",
            }}
          >
            {icon}
          </span>

          <span style={styles.body}>{item}</span>
        </div>
      ))}
    </div>
  );
}

function FocusSection({
  dim,
  children,
}: {
  dim: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        marginTop: 22,
        opacity: dim ? 0.18 : 1,
        transition: "opacity .28s ease",
      }}
    >
      {children}
    </section>
  );
}

function InterfaceHeader() {
  return (
    <div style={styles.interfaceHeader}>
      <div style={styles.interfaceIdentity}>
        <div style={styles.assistantIcon}>✦</div>

        <div>
          <div style={styles.productName}>Benefits Assistant</div>
          <div style={styles.productSubcopy}>Coverage guidance</div>
        </div>
      </div>

      <div style={styles.planLabel}>PPO Gold</div>
    </div>
  );
}

const styles = {
  canvas: {
    maxWidth: 1110,
    margin: "0 auto",
  },

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
    gridTemplateColumns: "minmax(0,1fr) 300px",
    gap: 24,
    alignItems: "start",
  },

  interfacePanel: {
    padding: "22px 24px 26px",
    border: "1px solid rgba(245,235,210,.10)",
    background:
      "linear-gradient(180deg,rgba(8,11,18,.93),rgba(4,7,12,.89))",
  },

  frameworkPanel: {
    padding: "18px 16px",
    border: "1px solid rgba(245,235,210,.09)",
    background: "rgba(4,7,12,.74)",
    transition: "opacity .35s cubic-bezier(.16,1,.3,1)",
  },

  frameworkPanelTitle: {
    marginBottom: 14,
    paddingBottom: 12,
    borderBottom: "1px solid rgba(245,235,210,.08)",
    fontFamily: "'DM Mono',monospace",
    fontSize: 8,
    letterSpacing: ".16em",
    textTransform: "uppercase" as const,
    color: "rgba(200,180,130,.66)",
  },

  stageList: {
    display: "grid",
  },

  stageButton: {
    display: "grid",
    gridTemplateColumns: "34px 1fr",
    columnGap: 10,
    minHeight: 50,
    padding: "10px 8px",
    border: 0,
    background: "transparent",
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
    color: "rgba(245,235,210,.78)",
  },

  stageSummary: {
    gridColumn: "2",
    overflow: "hidden",
    fontFamily: "'EB Garamond',serif",
    fontSize: 13.5,
    lineHeight: 1.35,
    color: "rgba(245,235,210,.58)",
    transition:
      "opacity .22s ease, max-height .22s ease, margin-top .22s ease",
  },

  frameworkPanelFooter: {
    marginTop: 12,
    paddingTop: 14,
    borderTop: "1px solid rgba(245,235,210,.08)",
    fontFamily: "'EB Garamond',serif",
    fontSize: 13,
    lineHeight: 1.45,
    color: "rgba(245,235,210,.38)",
  },

  interfaceHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 18,
    marginBottom: 22,
    borderBottom: "1px solid rgba(245,235,210,.08)",
  },

  interfaceIdentity: {
    display: "flex",
    alignItems: "center",
    gap: 11,
  },

  assistantIcon: {
    width: 32,
    height: 32,
    borderRadius: 7,
    display: "grid",
    placeItems: "center",
    background: "#DDB85A",
    color: "#0B0905",
  },

  productName: {
    fontFamily: "'EB Garamond',serif",
    fontSize: 16.5,
    color: "rgba(255,248,230,.92)",
  },

  productSubcopy: {
    marginTop: 1,
    fontFamily: "'EB Garamond',serif",
    fontSize: 13.5,
    color: "rgba(245,235,210,.46)",
  },

  planLabel: {
    fontFamily: "'DM Mono',monospace",
    fontSize: 8.5,
    letterSpacing: ".12em",
    textTransform: "uppercase" as const,
    color: "rgba(221,184,90,.78)",
  },

  requestLabel: {
    fontFamily: "'DM Mono',monospace",
    fontSize: 8.5,
    letterSpacing: ".14em",
    textTransform: "uppercase" as const,
    color: "rgba(221,184,90,.72)",
  },

  userQuestion: {
    marginTop: 8,
    fontFamily: "'EB Garamond',serif",
    fontSize: 20,
    lineHeight: 1.35,
    color: "rgba(255,248,230,.88)",
  },

  sectionLabel: {
    marginTop: 22,
    fontFamily: "'DM Mono',monospace",
    fontSize: 8.5,
    letterSpacing: ".14em",
    textTransform: "uppercase" as const,
    color: "rgba(221,184,90,.68)",
  },

  resultPanel: {
    marginTop: 10,
    padding: "19px 20px",
    border: "1px solid rgba(245,235,210,.14)",
    background: "rgba(9,13,20,.46)",
  },

  headline: {
    margin: 0,
    fontFamily: "'EB Garamond',serif",
    fontSize: 27,
    lineHeight: 1.18,
    fontWeight: 500,
    color: "rgba(255,248,230,.96)",
  },

  body: {
    marginTop: 6,
    fontFamily: "'EB Garamond',serif",
    fontSize: 14.5,
    lineHeight: 1.45,
    color: "rgba(245,235,210,.66)",
  },

  inlineMeta: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 10,
    marginTop: 18,
    fontFamily: "'EB Garamond',serif",
    fontSize: 13.5,
    color: "rgba(245,235,210,.48)",
  },

  boundaryCopy: {
    marginTop: 6,
    fontFamily: "'EB Garamond',serif",
    fontSize: 14.5,
    lineHeight: 1.45,
    color: "rgba(221,184,90,.80)",
  },

  evidenceList: {
    display: "grid",
    gap: 8,
    marginTop: 10,
  },

  evidenceRow: {
    display: "grid",
    gridTemplateColumns: "22px 1fr",
    gap: 8,
    alignItems: "start",
    padding: "2px 0",
  },

  divider: {
    height: 1,
    background: "rgba(245,235,210,.10)",
  },

  handoffCopy: {
    marginTop: 9,
    maxWidth: 610,
    fontFamily: "'EB Garamond',serif",
    fontSize: 15,
    lineHeight: 1.48,
    color: "rgba(245,235,210,.70)",
  },

  primaryButton: {
    width: "100%",
    minHeight: 48,
    border: 0,
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
    marginTop: 34,
    paddingTop: 18,
    borderTop: "1px solid rgba(245,235,210,.08)",
    fontFamily: "'EB Garamond',serif",
    fontSize: 13.5,
    lineHeight: 1.45,
    color: "rgba(245,235,210,.38)",
  },
};
