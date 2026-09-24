import { useMemo, useState } from "react";
import { ArrowLeft, History, X } from "lucide-react";
import {
  LIVING_CANON_REVISION_STAGES,
  LIVING_CANON_WORKED_EXAMPLE,
  type LivingCanonEntry,
  type LivingCanonRevisionStageId,
} from "../../content/frameworks/sovereign-ux-living-canon";
import { STELLAR_PALETTE } from "../../atlas/constellation/stellarPalette";
import { readerSemanticColor } from "../shared/readerSemanticPalette";

interface Props {
  frameworkTitle: string;
  sectionTitle: string;
  tracedEntry: LivingCanonEntry;
  onBack: () => void;
  onClose: () => void;
}

const STAGE_INDEX = new Map(
  LIVING_CANON_REVISION_STAGES.map((stage, index) => [stage.id, index] as const),
);

function stageEvidence(stageId: LivingCanonRevisionStageId) {
  return LIVING_CANON_WORKED_EXAMPLE.stageEvidence[stageId];
}

export default function LivingCanonRevisionModel({
  frameworkTitle,
  sectionTitle,
  tracedEntry,
  onBack,
  onClose,
}: Props) {
  const [selectedStageId, setSelectedStageId] =
    useState<LivingCanonRevisionStageId>("field-signal");
  const [historyOpen, setHistoryOpen] = useState(false);

  const selectedStage =
    LIVING_CANON_REVISION_STAGES.find(
      (stage) => stage.id === selectedStageId,
    ) ?? LIVING_CANON_REVISION_STAGES[0];

  const selectedIndex = STAGE_INDEX.get(selectedStage.id) ?? 0;
  const isWorkedEntry =
    tracedEntry.id === LIVING_CANON_WORKED_EXAMPLE.entryId;

  const stageColor = STELLAR_PALETTE[selectedStage.stellarType];

  const completionWidth = useMemo(() => {
    if (LIVING_CANON_REVISION_STAGES.length <= 1) return 0;
    return (
      (selectedIndex / (LIVING_CANON_REVISION_STAGES.length - 1)) * 100
    );
  }, [selectedIndex]);

  return (
    <div
      data-canon-revision-root
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 82,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        color: readerSemanticColor.text.primary,
        background:
          "radial-gradient(circle at 26% 40%, rgba(118,199,154,0.04), transparent 30%), " +
          "radial-gradient(circle at 72% 56%, rgba(200,169,110,0.055), transparent 34%), " +
          "#04060B",
        animation: "canonRevisionEnter 360ms cubic-bezier(.16,1,.3,1) both",
      }}
    >
      <style>{`
        @keyframes canonRevisionEnter {
          from { opacity: 0; transform: scale(1.012); filter: blur(5px); }
          to { opacity: 1; transform: scale(1); filter: blur(0); }
        }

        @keyframes canonRevisionDetail {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        [data-canon-revision-root] button:focus-visible {
          outline: 2px solid ${readerSemanticColor.text.primary};
          outline-offset: 3px;
        }

        @media (max-width: 860px) {
          [data-canon-revision-header] {
            padding: 17px 18px 15px !important;
          }

          [data-canon-revision-title] {
            font-size: 30px !important;
          }

          [data-canon-revision-body] {
            padding: 18px !important;
          }

          [data-canon-revision-detail-grid] {
            grid-template-columns: 1fr !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          [data-canon-revision-root],
          [data-canon-stage-detail] {
            animation-duration: 1ms !important;
            animation-delay: 0ms !important;
            transform: none !important;
            filter: none !important;
            transition-duration: 1ms !important;
          }
        }
      `}</style>

      <header
        data-canon-revision-header
        style={{
          minHeight: 132,
          flexShrink: 0,
          padding: "20px 28px 17px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 28,
          flexWrap: "wrap",
          borderBottom: "1px solid rgba(200,180,130,0.10)",
          background:
            "linear-gradient(180deg, rgba(4,6,11,0.99), rgba(4,6,11,0.94))",
        }}
      >
        <div style={{ maxWidth: 900 }}>
          <div
            style={{
              marginBottom: 8,
              color: readerSemanticColor.utility.primary,
              fontFamily: "'DM Mono', monospace",
              fontSize: 9.5,
              letterSpacing: "0.24em",
            }}
          >
            {frameworkTitle.toUpperCase()} · {sectionTitle.toUpperCase()}
          </div>

          <div
            data-canon-revision-title
            style={{
              marginBottom: 6,
              color: readerSemanticColor.text.primary,
              fontFamily: "'EB Garamond', serif",
              fontSize: 38,
              lineHeight: 1.02,
              fontWeight: 500,
            }}
          >
            How the Canon Learns
          </div>

          <div
            style={{
              maxWidth: 780,
              color: readerSemanticColor.text.secondary,
              fontFamily: "'EB Garamond', serif",
              fontSize: 16.5,
              lineHeight: 1.45,
            }}
          >
            Observation becomes precedent. Precedent remains revisable.
          </div>

          <div
            style={{
              marginTop: 11,
              display: "flex",
              flexWrap: "wrap",
              gap: "8px 16px",
              alignItems: "center",
              fontFamily: "'DM Mono', monospace",
              fontSize: 8.8,
              letterSpacing: "0.13em",
            }}
          >
            <span style={{ color: readerSemanticColor.text.metadata }}>
              TRACE ORIGIN
            </span>
            <span style={{ color: readerSemanticColor.text.secondary }}>
              {tracedEntry.title.toUpperCase()}
            </span>
            {!isWorkedEntry && (
              <span
                style={{
                  padding: "4px 7px",
                  border: "1px solid rgba(200,169,110,0.20)",
                  color: readerSemanticColor.utility.primary,
                  background: "rgba(200,169,110,0.04)",
                }}
              >
                WORKED EXAMPLE · FRAME, DON'T STEER
              </span>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <button
            type="button"
            onClick={onBack}
            style={{
              minHeight: 40,
              padding: "0 13px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid rgba(200,180,130,0.28)",
              background: "rgba(7,9,15,0.76)",
              color: readerSemanticColor.text.secondary,
              fontFamily: "'DM Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.14em",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={14} />
            BACK TO CANON FIELD
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Back to framework"
            style={{
              width: 40,
              height: 40,
              display: "grid",
              placeItems: "center",
              border: "1px solid rgba(200,180,130,0.28)",
              background: "rgba(7,9,15,0.76)",
              color: readerSemanticColor.utility.primary,
              cursor: "pointer",
            }}
          >
            <X size={14} />
          </button>
        </div>
      </header>

      <main
        data-canon-revision-body
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          scrollbarWidth: "none",
          padding: "24px 28px 34px",
        }}
      >
        {!isWorkedEntry && (
          <div
            style={{
              maxWidth: 1180,
              margin: "0 auto 18px",
              padding: "11px 13px",
              border: "1px solid rgba(200,169,110,0.14)",
              background: "rgba(200,169,110,0.025)",
              color: readerSemanticColor.text.metadata,
              fontFamily: "'EB Garamond', serif",
              fontSize: 13.5,
              lineHeight: 1.45,
            }}
          >
            Your selection is preserved for return. This first revision model
            uses <strong style={{ color: readerSemanticColor.text.secondary }}>
              Frame, Don't Steer
            </strong>{" "}
            as an illustrative worked trace so the Canon does not invent evidence
            for principles that have not yet been documented at this depth.
          </div>
        )}

        <section
          aria-label="Canon revision stages"
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            overflowX: "auto",
            paddingBottom: 8,
            scrollbarWidth: "thin",
          }}
        >
          <div
            style={{
              position: "relative",
              minWidth: 940,
              padding: "28px 16px 20px",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: 72,
                right: 72,
                top: 59,
                height: 1,
                background: "rgba(200,180,130,0.13)",
              }}
            />

            <div
              aria-hidden
              style={{
                position: "absolute",
                left: 72,
                right: 72,
                top: 59,
                height: 1,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${completionWidth}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg, rgba(118,199,154,0.62), rgba(200,169,110,0.72))",
                  transition: "width 260ms cubic-bezier(.16,1,.3,1)",
                }}
              />
            </div>

            <div
              style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: `repeat(${LIVING_CANON_REVISION_STAGES.length}, minmax(130px, 1fr))`,
                gap: 14,
              }}
            >
              {LIVING_CANON_REVISION_STAGES.map((stage, index) => {
                const active = stage.id === selectedStage.id;
                const complete = index <= selectedIndex;
                const color = STELLAR_PALETTE[stage.stellarType];

                return (
                  <button
                    key={stage.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setSelectedStageId(stage.id);
                      if (stage.id !== "revision") setHistoryOpen(false);
                    }}
                    style={{
                      minHeight: 118,
                      padding: "0 8px 10px",
                      border: "none",
                      background: "transparent",
                      color: readerSemanticColor.text.secondary,
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        width: active ? 58 : 48,
                        height: active ? 58 : 48,
                        margin: "0 auto 13px",
                        display: "grid",
                        placeItems: "center",
                        borderRadius: "50%",
                        border: `${active ? 2 : 1}px solid ${
                          complete ? `${color}C8` : `${color}66`
                        }`,
                        background: active
                          ? `radial-gradient(circle, ${color}30, ${color}0B 66%, transparent 70%)`
                          : "rgba(7,9,15,0.92)",
                        boxShadow: active
                          ? `0 0 0 8px ${color}12, 0 0 34px ${color}42`
                          : complete
                            ? `0 0 20px ${color}1A`
                            : "none",
                        color,
                        fontFamily: "'DM Mono', monospace",
                        fontSize: active ? 11 : 9.5,
                        transition:
                          "width 180ms ease, height 180ms ease, box-shadow 180ms ease",
                      }}
                    >
                      {stage.number}
                    </span>

                    <span
                      style={{
                        display: "block",
                        color: active
                          ? readerSemanticColor.text.primary
                          : readerSemanticColor.text.secondary,
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 9,
                        lineHeight: 1.3,
                        letterSpacing: "0.09em",
                      }}
                    >
                      {stage.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section
          key={selectedStage.id}
          data-canon-stage-detail
          style={{
            maxWidth: 1180,
            margin: "14px auto 0",
            padding: "22px 22px 20px",
            border: `1px solid ${stageColor}28`,
            background:
              `linear-gradient(135deg, ${stageColor}0B, rgba(8,10,17,0.88) 45%, rgba(5,7,12,0.94))`,
            animation: "canonRevisionDetail 220ms cubic-bezier(.16,1,.3,1) both",
          }}
        >
          <div
            data-canon-revision-detail-grid
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 0.78fr) minmax(0, 1.22fr)",
              gap: 28,
            }}
          >
            <div>
              <div
                style={{
                  color: stageColor,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  marginBottom: 9,
                }}
              >
                {selectedStage.number} · {selectedStage.label}
              </div>

              <div
                style={{
                  color: readerSemanticColor.text.primary,
                  fontFamily: "'EB Garamond', serif",
                  fontSize: 26,
                  lineHeight: 1.12,
                  marginBottom: 12,
                }}
              >
                {selectedStage.description}
              </div>

              <div
                style={{
                  marginTop: 18,
                  paddingTop: 15,
                  borderTop: `1px solid ${stageColor}24`,
                }}
              >
                <div
                  style={{
                    color: stageColor,
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 8.5,
                    letterSpacing: "0.16em",
                    marginBottom: 7,
                  }}
                >
                  KEY QUESTION
                </div>
                <div
                  style={{
                    color: readerSemanticColor.text.secondary,
                    fontFamily: "'EB Garamond', serif",
                    fontSize: 17,
                    lineHeight: 1.42,
                    fontStyle: "italic",
                  }}
                >
                  {selectedStage.keyQuestion}
                </div>
              </div>
            </div>

            <div>
              <div
                style={{
                  color: readerSemanticColor.utility.primary,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 8.5,
                  letterSpacing: "0.16em",
                  marginBottom: 9,
                }}
              >
                WORKED TRACE · FRAME, DON'T STEER
              </div>

              <div
                style={{
                  color: readerSemanticColor.text.primary,
                  fontFamily: "'EB Garamond', serif",
                  fontSize: 18,
                  lineHeight: 1.48,
                }}
              >
                {stageEvidence(selectedStage.id)}
              </div>

              {(selectedStage.id === "precedent" ||
                selectedStage.id === "revision") && (
                <div
                  style={{
                    marginTop: 20,
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      padding: "13px 14px",
                      border: "1px solid rgba(216,108,97,0.20)",
                      background: "rgba(216,108,97,0.035)",
                    }}
                  >
                    <div
                      style={{
                        marginBottom: 7,
                        color: STELLAR_PALETTE.risk,
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 8,
                        letterSpacing: "0.14em",
                      }}
                    >
                      {LIVING_CANON_WORKED_EXAMPLE.precedent.previous.label}
                    </div>
                    <div
                      style={{
                        color: readerSemanticColor.text.metadata,
                        fontFamily: "'EB Garamond', serif",
                        fontSize: 14,
                        lineHeight: 1.42,
                      }}
                    >
                      {LIVING_CANON_WORKED_EXAMPLE.precedent.previous.text}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "13px 14px",
                      border: "1px solid rgba(118,199,154,0.22)",
                      background: "rgba(118,199,154,0.04)",
                    }}
                  >
                    <div
                      style={{
                        marginBottom: 7,
                        color: STELLAR_PALETTE.relational,
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 8,
                        letterSpacing: "0.14em",
                      }}
                    >
                      {LIVING_CANON_WORKED_EXAMPLE.precedent.current.label}
                    </div>
                    <div
                      style={{
                        color: readerSemanticColor.text.secondary,
                        fontFamily: "'EB Garamond', serif",
                        fontSize: 14,
                        lineHeight: 1.42,
                      }}
                    >
                      {LIVING_CANON_WORKED_EXAMPLE.precedent.current.text}
                    </div>
                  </div>
                </div>
              )}

              {selectedStage.id === "revision" && (
                <>
                  <div
                    style={{
                      marginTop: 13,
                      padding: "12px 13px",
                      borderLeft: `2px solid ${STELLAR_PALETTE.strategy}88`,
                      background: "rgba(244,235,208,0.025)",
                    }}
                  >
                    <div
                      style={{
                        marginBottom: 6,
                        color: STELLAR_PALETTE.strategy,
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 8,
                        letterSpacing: "0.14em",
                      }}
                    >
                      WHAT CHANGED
                    </div>
                    <div
                      style={{
                        color: readerSemanticColor.text.secondary,
                        fontFamily: "'EB Garamond', serif",
                        fontSize: 14,
                        lineHeight: 1.42,
                      }}
                    >
                      {LIVING_CANON_WORKED_EXAMPLE.precedent.whatChanged}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setHistoryOpen((open) => !open)}
                    aria-expanded={historyOpen}
                    style={{
                      marginTop: 12,
                      minHeight: 38,
                      padding: "0 11px",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      border: "1px solid rgba(200,180,130,0.18)",
                      background: "rgba(255,255,255,0.02)",
                      color: readerSemanticColor.text.secondary,
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 8.5,
                      letterSpacing: "0.11em",
                      cursor: "pointer",
                    }}
                  >
                    <History size={13} />
                    {historyOpen ? "HIDE REVISION HISTORY" : "VIEW REVISION HISTORY"}
                  </button>

                  {historyOpen && (
                    <div
                      style={{
                        marginTop: 12,
                        paddingLeft: 15,
                        borderLeft: "1px solid rgba(200,169,110,0.24)",
                      }}
                    >
                      {LIVING_CANON_WORKED_EXAMPLE.revisionHistory.map(
                        (item, index) => (
                          <div
                            key={item.id}
                            style={{
                              position: "relative",
                              padding: index === 0 ? "0 0 17px 12px" : "0 0 0 12px",
                            }}
                          >
                            <span
                              aria-hidden
                              style={{
                                position: "absolute",
                                left: -19,
                                top: 3,
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                background: readerSemanticColor.utility.primary,
                                boxShadow:
                                  "0 0 10px rgba(197,169,110,0.42)",
                              }}
                            />
                            <div
                              style={{
                                color: readerSemanticColor.utility.primary,
                                fontFamily: "'DM Mono', monospace",
                                fontSize: 8,
                                letterSpacing: "0.13em",
                                marginBottom: 4,
                              }}
                            >
                              {item.label}
                            </div>
                            <div
                              style={{
                                color: readerSemanticColor.text.metadata,
                                fontFamily: "'EB Garamond', serif",
                                fontSize: 13.5,
                                lineHeight: 1.4,
                              }}
                            >
                              {item.summary}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        <div
          style={{
            maxWidth: 1180,
            margin: "14px auto 0",
            color: readerSemanticColor.text.metadata,
            fontFamily: "'DM Mono', monospace",
            fontSize: 8.2,
            lineHeight: 1.5,
            letterSpacing: "0.05em",
          }}
        >
          {LIVING_CANON_WORKED_EXAMPLE.sourceNote}
        </div>
      </main>
    </div>
  );
}
