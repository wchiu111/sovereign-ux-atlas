import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { resolveStellarColor } from "../../atlas/constellation/stellarPalette";
import BehavioralPipeline from "./BehavioralPipeline";
import BehavioralStageInspector from "./BehavioralStageInspector";
import BehavioralDecisionExample from "./BehavioralDecisionExample";
import BehavioralToolkit from "./BehavioralToolkit";
import BehavioralAskPanel from "./BehavioralAskPanel";
import {
  BEHAVIORAL_STAGES,
  type BehavioralStageId,
} from "./behavioralDecisionDesignData";

interface BehavioralDecisionDesignExperienceProps {
  systemColor: string;
  onExit: () => void;
}

type WorkspaceTab = "pipeline" | "example" | "toolkit";

export default function BehavioralDecisionDesignExperience({
  systemColor,
  onExit,
}: BehavioralDecisionDesignExperienceProps) {
  const [activeStageId, setActiveStageId] =
    useState<BehavioralStageId>("separate");
  const [tab, setTab] = useState<WorkspaceTab>("pipeline");
  const [askOpen, setAskOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  const activeStage =
    BEHAVIORAL_STAGES.find((stage) => stage.id === activeStageId) ??
    BEHAVIORAL_STAGES[1];

  const moduleColor = resolveStellarColor("agentic", systemColor);
  const stageColor = resolveStellarColor(
    activeStage.colorRole,
    systemColor,
  );

  const resolveColor = useMemo(
    () => (role: (typeof BEHAVIORAL_STAGES)[number]["colorRole"]) =>
      resolveStellarColor(role, systemColor),
    [systemColor],
  );

  return (
    <motion.section
      role="dialog"
      aria-modal="true"
      aria-labelledby="behavioral-design-title"
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.994 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.997 }}
      transition={{ duration: reducedMotion ? 0.18 : 0.52, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 64,
        display: "grid",
        gridTemplateColumns: "286px minmax(0, 1fr) 318px",
        overflow: "hidden",
        color: "#F4EBD0",
        background:
          "radial-gradient(circle at 51% 42%, rgba(138,174,200,0.05), transparent 28%), linear-gradient(180deg, rgba(4,5,11,0.997), rgba(3,4,9,0.997))",
      }}
    >
      <aside style={{ minWidth: 0, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(200,180,130,.09)", background: "rgba(4,5,11,.78)" }}>
        <button type="button" onClick={onExit} style={backButton}>
          <span style={{ color: moduleColor, marginRight: 10 }}>←</span>
          Behavior &amp; Authority
        </button>

        <div style={{ padding: "26px 24px 22px" }}>
          <div style={{ ...eyebrow, color: moduleColor, marginBottom: 12 }}>Application Kit · Module</div>
          <h1 id="behavioral-design-title" style={{ margin: 0, fontFamily: "'EB Garamond',serif", fontSize: 27, lineHeight: 1.04, fontWeight: 500, color: "rgba(255,248,230,.97)" }}>
            Behavioral &amp;<br />Decision Design
          </h1>
          <p style={{ margin: "17px 0 0", fontFamily: "'EB Garamond',serif", fontSize: 14.5, lineHeight: 1.58, color: "rgba(240,232,215,.64)" }}>
            Design how AI interprets context, separates observation from inference, frames decisions, communicates uncertainty, and confirms intent before acting.
          </p>
        </div>

        <div style={{ height: 1, margin: "0 24px", background: "rgba(245,235,210,.08)" }} />

        <div style={{ padding: "22px 24px" }}>
          <div style={{ ...eyebrow, color: "rgba(101,214,154,.72)", marginBottom: 10 }}>Question it answers</div>
          <p style={{ margin: 0, fontFamily: "'EB Garamond',serif", fontSize: 13.5, lineHeight: 1.55, color: "rgba(245,235,210,.72)" }}>
            How can a system support judgment without quietly becoming the decision maker?
          </p>
        </div>

        <div style={{ height: 1, margin: "0 24px", background: "rgba(245,235,210,.08)" }} />

        <nav aria-label="Module workspace" style={{ padding: "20px 16px", display: "grid", gap: 6 }}>
          {([
            ["pipeline", "Behavioral Pipeline"],
            ["example", "Interactive Example"],
            ["toolkit", "Patterns & Checklist"],
          ] as [WorkspaceTab, string][]).map(([id, label]) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                aria-pressed={active}
                style={{
                  minHeight: 40,
                  padding: "0 12px",
                  border: active ? `1px solid ${moduleColor}55` : "1px solid transparent",
                  borderLeft: active ? `2px solid ${moduleColor}` : "2px solid transparent",
                  background: active ? `${moduleColor}0C` : "transparent",
                  color: active ? "rgba(245,235,210,.92)" : "rgba(245,235,210,.50)",
                  textAlign: "left",
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 9,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            );
          })}
        </nav>

        <div style={{ marginTop: "auto", padding: "18px 24px", borderTop: "1px solid rgba(245,235,210,.07)", fontFamily: "'DM Mono',monospace", fontSize: 7.5, lineHeight: 1.8, letterSpacing: ".16em", color: "rgba(245,235,210,.34)", textTransform: "uppercase" }}>
          Esc · Return to family<br />
          Hover · Reveal possibility<br />
          Click · Commit
        </div>
      </aside>

      <main style={{ minWidth: 0, overflowY: "auto", scrollbarWidth: "none" }}>
        <div style={{ padding: "28px 34px 60px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, marginBottom: 20 }}>
            <div>
              <div style={{ ...eyebrow, color: "rgba(200,180,130,.44)", marginBottom: 6 }}>
                Behavioral &amp; Decision Design
              </div>
              <div style={{ fontFamily: "'EB Garamond',serif", fontSize: 23, color: "rgba(255,248,230,.92)" }}>
                {tab === "pipeline" ? "Behavioral Pipeline" : tab === "example" ? "Interactive Example" : "Practical Toolkit"}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAskOpen((current) => !current)}
              aria-expanded={askOpen}
              style={{
                minWidth: 78,
                height: 40,
                borderRadius: 999,
                border: `1px solid ${moduleColor}80`,
                background: askOpen ? `${moduleColor}18` : "rgba(7,9,16,.72)",
                color: "rgba(255,248,230,.92)",
                fontFamily: "'DM Mono',monospace",
                fontSize: 10,
                cursor: "pointer",
              }}
            >
              <span style={{ color: moduleColor, marginRight: 7 }}>✦</span>
              Ask
            </button>
          </div>

          <AnimatePresence mode="wait">
            {tab === "pipeline" && (
              <motion.div key="pipeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <BehavioralPipeline
                  stages={BEHAVIORAL_STAGES}
                  activeStageId={activeStageId}
                  onStageChange={setActiveStageId}
                  resolveColor={resolveColor}
                />
              </motion.div>
            )}
            {tab === "example" && (
              <motion.div key="example" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <BehavioralDecisionExample />
              </motion.div>
            )}
            {tab === "toolkit" && (
              <motion.div key="toolkit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <BehavioralToolkit />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <aside style={{ minWidth: 0, overflowY: "auto", borderLeft: "1px solid rgba(200,180,130,.09)", background: "rgba(4,5,11,.70)", padding: "26px 22px 50px" }}>
        <div style={{ ...eyebrow, color: "rgba(101,214,154,.70)", marginBottom: 18 }}>Inspector</div>

        {tab === "pipeline" ? (
          <BehavioralStageInspector stage={activeStage} color={stageColor} />
        ) : tab === "example" ? (
          <div>
            <div style={{ fontFamily: "'EB Garamond',serif", fontSize: 19, color: "rgba(255,248,230,.90)", marginBottom: 12 }}>What to notice</div>
            <p style={inspectorCopy}>Changing criteria changes interpretation and therefore the recommendation. The interface should expose that dependency rather than present the result as objective fact.</p>
            <p style={inspectorCopy}>Use the Traditional / Behavioral toggle to compare the same decision with and without visible reasoning layers.</p>
          </div>
        ) : (
          <div>
            <div style={{ fontFamily: "'EB Garamond',serif", fontSize: 19, color: "rgba(255,248,230,.90)", marginBottom: 12 }}>Use as scaffolding</div>
            <p style={inspectorCopy}>Patterns and checklists are optional supports. They should improve clarity and decision quality, not become a compliance ritual.</p>
            <div style={{ marginTop: 18, padding: "12px 13px", borderLeft: `2px solid ${moduleColor}`, fontFamily: "'EB Garamond',serif", fontSize: 13, lineHeight: 1.5, color: "rgba(245,235,210,.68)" }}>
              If a pattern increases confidence while reducing clarity, remove it.
            </div>
          </div>
        )}
      </aside>

      <AnimatePresence>
        {askOpen && (
          <BehavioralAskPanel
            open={askOpen}
            stage={activeStage}
            color={stageColor}
            onClose={() => setAskOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
}

const backButton = {
  minHeight: 62,
  padding: "0 22px",
  border: 0,
  borderBottom: "1px solid rgba(200,180,130,.09)",
  background: "transparent",
  color: "rgba(200,180,130,.68)",
  textAlign: "left" as const,
  fontFamily: "'DM Mono',monospace",
  fontSize: 8.5,
  letterSpacing: ".17em",
  textTransform: "uppercase" as const,
  cursor: "pointer",
};

const eyebrow = {
  fontFamily: "'DM Mono',monospace",
  fontSize: 8,
  letterSpacing: ".22em",
  textTransform: "uppercase" as const,
};

const inspectorCopy = {
  margin: "0 0 14px",
  fontFamily: "'EB Garamond',serif",
  fontSize: 13.5,
  lineHeight: 1.6,
  color: "rgba(245,235,210,.58)",
};
