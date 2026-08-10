import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  APPLY_COMPARISON,
  type BehavioralStageId,
} from "./behavioralDecisionDesignData";

interface Props {
  mode: "without" | "with";
  active: BehavioralStageId | null;
}

const hi = (
  active: BehavioralStageId | null,
  id: BehavioralStageId,
) => (active === null || active === id ? 1 : 0.32);

const assistantIcon = {
  width: 26,
  height: 26,
  borderRadius: 7,
  display: "grid",
  placeItems: "center",
  background:
    "linear-gradient(145deg, rgba(133,100,205,.95), rgba(96,73,160,.88))",
  color: "rgba(255,255,255,.95)",
  fontFamily: "'DM Mono',monospace",
  fontSize: 12,
  boxShadow: "0 0 22px rgba(123,95,190,.14)",
};

export default function RecommendationComparison({
  mode,
  active,
}: Props) {
  const reduced = useReducedMotion();
  const withFramework = mode === "with";
  const t = {
    duration: reduced ? 0.12 : 0.46,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  };

  return (
    <section
      style={{
        width: "100%",
        minHeight: withFramework ? 620 : 540,
        border: "1px solid rgba(245,235,210,.10)",
        background:
          "linear-gradient(180deg, rgba(9,12,19,.96), rgba(5,8,14,.94))",
        backdropFilter: "blur(16px)",
        boxShadow:
          "0 28px 80px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.015)",
        transition:
          "min-height .46s cubic-bezier(.16,1,.3,1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 56,
          padding: "0 18px",
          borderBottom: "1px solid rgba(245,235,210,.07)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={assistantIcon}>⌘</span>
          <span
            style={{
              fontFamily: "'EB Garamond',serif",
              fontSize: 16,
              fontWeight: 600,
              color: "rgba(255,248,230,.90)",
            }}
          >
            AI Assistant
          </span>
        </div>

        <button
          type="button"
          aria-label="More options"
          style={{
            minWidth: 32,
            minHeight: 32,
            border: 0,
            background: "transparent",
            color: "rgba(245,235,210,.45)",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          ⋮
        </button>
      </div>

      <div
        style={{
          padding: "26px 22px 24px",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: 8.5,
            letterSpacing: ".16em",
            textTransform: "uppercase",
            color: withFramework
              ? "rgba(200,180,130,.60)"
              : "rgba(230,93,93,.82)",
          }}
        >
          {withFramework ? "Recommendation interface" : "AI recommends"}
        </div>

        <div
          style={{
            marginTop: 10,
            fontFamily: "'EB Garamond',serif",
            fontSize: 27,
            lineHeight: 1.2,
            color: "rgba(255,248,230,.94)",
          }}
        >
          {withFramework
            ? "Find a better time for the project review."
            : "Reschedule the meeting to Tuesday at 2:00 PM."}
        </div>

        {!withFramework && (
          <>
            <div
              style={{
                marginTop: 22,
                padding: "14px 16px",
                border: "1px solid rgba(160,195,218,.11)",
                background:
                  "linear-gradient(180deg, rgba(15,20,30,.72), rgba(8,12,19,.62))",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "34px 1fr",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    display: "grid",
                    placeItems: "center",
                    border: "1px solid rgba(160,195,218,.32)",
                    color: "rgba(160,195,218,.82)",
                    fontSize: 16,
                  }}
                >
                  ◫
                </div>

                <div>
                  <div
                    style={{
                      fontFamily: "'EB Garamond',serif",
                      fontSize: 14,
                      color: "rgba(245,235,210,.66)",
                    }}
                  >
                    Current meeting
                  </div>
                  <div
                    style={{
                      marginTop: 2,
                      fontFamily: "'EB Garamond',serif",
                      fontSize: 13.5,
                      color: "rgba(245,235,210,.45)",
                    }}
                  >
                    Mon, May 12 · 2:00 PM – 3:00 PM
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 24,
                display: "grid",
                gap: 10,
              }}
            >
              <button
                type="button"
                style={{
                  minHeight: 48,
                  border: "1px solid rgba(239,84,84,.80)",
                  background:
                    "linear-gradient(180deg, rgba(245,91,91,.98), rgba(229,72,72,.96))",
                  color: "#fff",
                  fontFamily: "'EB Garamond',serif",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 8px 22px rgba(230,70,70,.08)",
                }}
              >
                Accept recommendation
              </button>

              <button
                type="button"
                style={{
                  minHeight: 46,
                  border: "1px solid rgba(245,235,210,.13)",
                  background: "rgba(3,4,9,.18)",
                  color: "rgba(245,235,210,.78)",
                  fontFamily: "'EB Garamond',serif",
                  fontSize: 15.5,
                  cursor: "pointer",
                }}
              >
                Choose another time
              </button>
            </div>

            <div
              style={{
                marginTop: 62,
                textAlign: "center",
                fontFamily: "'EB Garamond',serif",
                fontSize: 13.5,
                lineHeight: 1.5,
                color: "rgba(245,235,210,.34)",
              }}
            >
              The recommendation appears immediately.
              <br />
              Context, reasoning, and trade-offs are hidden.
            </div>
          </>
        )}

        {withFramework && (
          <div
            style={{
              marginTop: 22,
              display: "grid",
              gap: 10,
            }}
          >
            <AnimatePresence initial={false}>
              <motion.div
                key="context"
                initial={{ opacity: 0, y: -8 }}
                animate={{
                  opacity: hi(active, "interpret"),
                  y: 0,
                }}
                exit={{ opacity: 0, y: -6 }}
                transition={t}
                style={{
                  padding: 14,
                  border: "1px solid rgba(160,195,218,.18)",
                  background: "rgba(160,195,218,.035)",
                }}
              >
                <Label>01 · Interpret</Label>
                <Body>{APPLY_COMPARISON.with.observed}</Body>
              </motion.div>

              <motion.div
                key="inference"
                initial={{ opacity: 0, y: -8 }}
                animate={{
                  opacity: hi(active, "separate"),
                  y: 0,
                }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ ...t, delay: 0.05 }}
                style={{
                  padding: 14,
                  border: "1px solid rgba(205,180,90,.14)",
                }}
              >
                <Label>02 · Separate</Label>
                <Body>{APPLY_COMPARISON.with.inferred}</Body>
              </motion.div>

              <motion.div
                key="options"
                initial={{ opacity: 0, y: -8 }}
                animate={{
                  opacity: hi(active, "frame"),
                  y: 0,
                }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ ...t, delay: 0.1 }}
                style={{
                  display: "grid",
                  gap: 7,
                }}
              >
                <Label>03 · Frame</Label>
                {APPLY_COMPARISON.with.alternatives.map((option) => (
                  <div
                    key={option.time}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "136px 1fr",
                      gap: 10,
                      padding: "10px 12px",
                      border: option.recommended
                        ? "1px solid rgba(210,151,104,.34)"
                        : "1px solid rgba(245,235,210,.07)",
                      background: option.recommended
                        ? "rgba(210,151,104,.05)"
                        : "rgba(3,4,9,.20)",
                    }}
                  >
                    <strong
                      style={{
                        fontFamily: "'EB Garamond',serif",
                        fontSize: 14.5,
                        fontWeight: 500,
                      }}
                    >
                      {option.time}
                    </strong>
                    <span
                      style={{
                        fontFamily: "'EB Garamond',serif",
                        fontSize: 13.5,
                        color: "rgba(245,235,210,.56)",
                      }}
                    >
                      {option.tradeoff}
                    </span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            <motion.div
              layout
              transition={t}
              animate={{
                opacity: hi(active, "recommend"),
              }}
              style={{
                padding: 16,
                border: "1px solid rgba(210,151,104,.28)",
                background: "rgba(210,151,104,.055)",
              }}
            >
              <Label>04 · Recommend</Label>
              <div
                style={{
                  marginTop: 7,
                  fontFamily: "'EB Garamond',serif",
                  fontSize: 22,
                  lineHeight: 1.25,
                  color: "rgba(255,248,230,.94)",
                }}
              >
                {APPLY_COMPARISON.recommendation}
              </div>
            </motion.div>

            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 8 }}
              animate={{
                opacity: hi(active, "confirm"),
                y: 0,
              }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ ...t, delay: 0.15 }}
              style={{
                padding: 14,
                border: "1px solid rgba(195,91,80,.18)",
              }}
            >
              <Label>05 · Confirm</Label>
              <Body>{APPLY_COMPARISON.with.confirm}</Body>
            </motion.div>

            <motion.div
              layout
              animate={{
                opacity: hi(active, "act"),
              }}
              transition={t}
              style={{
                display: "grid",
                gap: 9,
                paddingTop: 4,
              }}
            >
              <Label>06 · Act</Label>

              <button
                type="button"
                style={{
                  minHeight: 46,
                  border: "1px solid rgba(92,179,114,.72)",
                  background:
                    "linear-gradient(180deg, rgba(84,183,109,.92), rgba(68,154,91,.90))",
                  color: "#071009",
                  fontFamily: "'EB Garamond',serif",
                  fontSize: 15.5,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {APPLY_COMPARISON.with.primaryAction}
              </button>

              <button
                type="button"
                style={{
                  minHeight: 44,
                  border: "1px solid rgba(245,235,210,.13)",
                  background: "transparent",
                  color: "rgba(245,235,210,.70)",
                  fontFamily: "'EB Garamond',serif",
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                {APPLY_COMPARISON.with.secondaryAction}
              </button>

              <div
                style={{
                  marginTop: 4,
                  textAlign: "center",
                  fontFamily: "'EB Garamond',serif",
                  fontSize: 13,
                  color: "rgba(92,179,114,.72)",
                }}
              >
                Action only happens after confirmation.
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "'DM Mono',monospace",
        fontSize: 8.5,
        letterSpacing: ".15em",
        textTransform: "uppercase",
        color: "rgba(200,180,130,.62)",
      }}
    >
      {children}
    </div>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: 7,
        fontFamily: "'EB Garamond',serif",
        fontSize: 15.5,
        lineHeight: 1.45,
        color: "rgba(245,235,210,.68)",
      }}
    >
      {children}
    </div>
  );
}
