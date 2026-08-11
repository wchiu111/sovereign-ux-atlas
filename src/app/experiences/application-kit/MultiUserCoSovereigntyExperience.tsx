import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import ApplicationKitModuleFocusShell from "./ApplicationKitModuleFocusShell";

interface Props {
  color: string;
  onExit: () => void;
}

type StoryStep = 1 | 2 | 3;

const people = [
  {
    name: "Maya Chen",
    role: "Project Lead",
    color: "#72BFF1",
    need: "Needs the review completed before Wednesday.",
    authority: "Can propose a new time and set the agenda.",
  },
  {
    name: "Alex Rivera",
    role: "Designer",
    color: "#72D890",
    need: "Has a customer interview ending at 1:45 PM and needs prep time.",
    authority: "Can accept or decline. Not a required approver.",
  },
  {
    name: "Jordan Lee",
    role: "Executive",
    color: "#D9A53C",
    need: "Can only attend Tuesday afternoon. Attendance is required.",
    authority: "Availability is a hard requirement.",
  },
];

export default function MultiUserCoSovereigntyExperience({ color, onExit }: Props) {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState<StoryStep>(1);

  return (
    <ApplicationKitModuleFocusShell
      eyebrow="Application Kit · Module"
      title="Multi-User & Co-Sovereignty"
      summary="Design shared systems where multiple people or roles hold legitimate needs, authority, and decision rights."
      question="How should a system negotiate competing needs without pretending every participant has equal power or authority?"
      color={color}
      onExit={onExit}
      inspector={<ScenarioInspector color={color} step={step} />}
    >
      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0.16 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div style={{ marginBottom: 24 }}>
          <div style={{ ...mono, color, marginBottom: 9 }}>Real scenario</div>
          <h2 style={{
            margin: 0, fontFamily: "'EB Garamond',serif",
            fontSize: "clamp(31px, 2.35vw, 40px)", lineHeight: 1.08,
            fontWeight: 500, color: "rgba(255,248,230,.97)",
          }}>
            It starts with a simple request.
          </h2>
          <p style={{
            margin: "9px 0 0", maxWidth: 780,
            fontFamily: "'EB Garamond',serif", fontSize: 15.5,
            lineHeight: 1.5, color: "rgba(245,235,210,.58)",
          }}>
            Follow how one scheduling request reveals multiple legitimate needs—and why who decides matters.
          </p>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))",
          gap: 16, alignItems: "start",
        }}>
          <StoryColumn number="01" title="The request" subtitle="The project lead initiates the request." active={step === 1}>
            <RequestCard onContinue={() => setStep(2)} />
          </StoryColumn>

          <StoryColumn number="02" title="The AI recommendation" subtitle="The assistant finds a time that fits—on paper." active={step === 2}>
            <RecommendationCard enabled={step >= 2} onContinue={() => setStep(3)} />
          </StoryColumn>

          <StoryColumn number="03" title="Reveal the context" subtitle='We surface what “available” doesn’t show.' active={step === 3}>
            <ContextCard visible={step >= 3} />
          </StoryColumn>
        </div>

        {step >= 3 && (
          <motion.section
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0.14 : 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              marginTop: 18, padding: "15px 18px",
              display: "grid", gridTemplateColumns: "42px minmax(0,1fr) auto",
              gap: 14, alignItems: "center",
              border: `1px solid ${color}55`,
              background: "linear-gradient(90deg, rgba(178,144,231,.075), rgba(6,8,14,.42))",
            }}
          >
            <div aria-hidden="true" style={{
              width: 38, height: 38, borderRadius: "50%",
              display: "grid", placeItems: "center",
              border: `1px solid ${color}66`, color,
              fontFamily: "'DM Mono',monospace", fontSize: 15,
            }}>?</div>

            <div>
              <div style={{
                fontFamily: "'EB Garamond',serif", fontSize: 20,
                color, marginBottom: 3,
              }}>
                This is the Co-Sovereignty problem.
              </div>
              <div style={{
                fontFamily: "'EB Garamond',serif", fontSize: 14,
                color: "rgba(245,235,210,.58)",
              }}>
                Multiple legitimate needs. Different authority. No single “right” answer.
              </div>
            </div>

            <button type="button" style={{
              minHeight: 44, padding: "0 18px",
              border: `1px solid ${color}55`,
              background: `${color}18`,
              color: "rgba(255,248,230,.88)",
              fontFamily: "'EB Garamond',serif", fontSize: 14.5,
              cursor: "pointer",
            }}>
              Explore the framework →
            </button>
          </motion.section>
        )}
      </motion.div>
    </ApplicationKitModuleFocusShell>
  );
}

function StoryColumn({ number, title, subtitle, active, children }: {
  number: string; title: string; subtitle: string; active: boolean; children: React.ReactNode;
}) {
  return (
    <section style={{ minWidth: 0 }}>
      <div style={{
        display: "grid", gridTemplateColumns: "32px 1fr", gap: 10,
        alignItems: "start", marginBottom: 10, opacity: active ? 1 : 0.78,
      }}>
        <div style={{
          fontFamily: "'DM Mono',monospace", fontSize: 15,
          color: "rgba(184,140,235,.92)",
        }}>{number}</div>

        <div>
          <div style={{
            fontFamily: "'EB Garamond',serif", fontSize: 18,
            color: "rgba(255,248,230,.90)",
          }}>{title}</div>
          <div style={{
            marginTop: 3, fontFamily: "'EB Garamond',serif",
            fontSize: 13.5, lineHeight: 1.4,
            color: "rgba(245,235,210,.48)",
          }}>{subtitle}</div>
        </div>
      </div>
      {children}
    </section>
  );
}

function RequestCard({ onContinue }: { onContinue: () => void }) {
  return (
    <div style={card}>
      <div style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: 11, alignItems: "center" }}>
        <div style={iconBox}>▣</div>
        <div style={{ fontFamily: "'EB Garamond',serif", fontSize: 20, color: "rgba(255,248,230,.94)" }}>
          Schedule design review
        </div>
      </div>

      <p style={copy}>Final approval is needed before Wednesday’s client presentation.</p>
      <div style={divider} />
      <div style={{ ...mono, color: "rgba(184,140,235,.80)", marginBottom: 10 }}>Required attendees</div>

      <div style={{ display: "grid", gap: 9 }}>
        {people.map((person) => (
          <div key={person.name} style={{
            display: "grid", gridTemplateColumns: "34px 1fr auto",
            gap: 10, alignItems: "center",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              display: "grid", placeItems: "center",
              border: `1px solid ${person.color}88`, color: person.color,
              fontFamily: "'DM Mono',monospace", fontSize: 11,
            }}>
              {person.name.split(" ").map((part) => part[0]).join("")}
            </div>

            <div>
              <div style={{ fontFamily: "'EB Garamond',serif", fontSize: 14.5, color: "rgba(255,248,230,.84)" }}>
                {person.name}
              </div>
              <div style={{ marginTop: 1, fontFamily: "'EB Garamond',serif", fontSize: 12.5, color: "rgba(245,235,210,.46)" }}>
                {person.role}
              </div>
            </div>

            <span style={{
              padding: "4px 6px",
              border: "1px solid rgba(184,140,235,.20)",
              background: "rgba(184,140,235,.07)",
              fontFamily: "'DM Mono',monospace",
              fontSize: 7.5, letterSpacing: ".08em",
              textTransform: "uppercase", color: "rgba(184,140,235,.76)",
            }}>Required</span>
          </div>
        ))}
      </div>

      <div style={divider} />
      <div style={{ ...mono, color: "rgba(245,235,210,.38)", marginBottom: 5 }}>Constraint</div>
      <div style={{ fontFamily: "'EB Garamond',serif", fontSize: 14, color: "rgba(245,235,210,.64)" }}>
        All three people must participate.
      </div>

      <button type="button" onClick={onContinue} style={{
        width: "100%", marginTop: 18, minHeight: 44,
        border: "1px solid rgba(184,140,235,.40)",
        background: "linear-gradient(180deg, rgba(118,76,170,.92), rgba(91,58,137,.92))",
        color: "rgba(255,255,255,.94)",
        fontFamily: "'EB Garamond',serif", fontSize: 15, cursor: "pointer",
      }}>
        ✦ &nbsp; Find a time
      </button>
    </div>
  );
}

function RecommendationCard({ enabled, onContinue }: { enabled: boolean; onContinue: () => void }) {
  return (
    <div style={{
      ...card,
      opacity: enabled ? 1 : 0.28,
      pointerEvents: enabled ? "auto" : "none",
      transition: "opacity .3s ease",
    }}>
      <div style={{ ...mono, color: "rgba(184,140,235,.84)", marginBottom: 10 }}>✦ &nbsp; AI assistant</div>

      <div style={{ fontFamily: "'EB Garamond',serif", fontSize: 18, color: "rgba(245,235,210,.74)" }}>
        Here’s a time that works.
      </div>

      <div style={{
        marginTop: 16, padding: "16px 15px",
        border: "1px solid rgba(101,214,154,.18)",
        background: "rgba(101,214,154,.035)",
      }}>
        <div style={{
          fontFamily: "'DM Mono',monospace", fontSize: 8,
          letterSpacing: ".13em", textTransform: "uppercase",
          color: "rgba(101,214,154,.86)",
        }}>✓ &nbsp; Recommended</div>

        <div style={{
          marginTop: 9, fontFamily: "'EB Garamond',serif",
          fontSize: 25, lineHeight: 1.15, color: "rgba(255,248,230,.94)",
        }}>
          Tuesday · 2:00 PM
        </div>

        <div style={{
          marginTop: 8, fontFamily: "'EB Garamond',serif",
          fontSize: 13.5, color: "rgba(245,235,210,.58)",
        }}>
          All required attendees are available.
        </div>
      </div>

      <button type="button" style={{
        width: "100%", marginTop: 14, minHeight: 42,
        border: "1px solid rgba(245,235,210,.14)",
        background: "rgba(3,4,9,.20)",
        color: "rgba(245,235,210,.78)",
        fontFamily: "'EB Garamond',serif", fontSize: 14.5, cursor: "pointer",
      }}>
        Propose this time
      </button>

      <div style={{
        marginTop: 16, paddingTop: 14,
        borderTop: "1px solid rgba(245,235,210,.07)",
        fontFamily: "'EB Garamond',serif",
        fontSize: 13.5, lineHeight: 1.45,
        color: "rgba(245,235,210,.42)",
      }}>
        Based on calendar availability and scheduling rules.
      </div>

      <button type="button" onClick={onContinue} style={{
        width: "100%", marginTop: 16, padding: 0,
        border: 0, background: "transparent", textAlign: "left",
        fontFamily: "'EB Garamond',serif", fontSize: 15.5,
        lineHeight: 1.4, color: "rgba(184,140,235,.92)",
        cursor: "pointer",
      }}>
        But does available mean this works for everyone? →
      </button>
    </div>
  );
}

function ContextCard({ visible }: { visible: boolean }) {
  return (
    <div style={{ ...card, opacity: visible ? 1 : 0.24, transition: "opacity .3s ease" }}>
      <div style={{
        fontFamily: "'EB Garamond',serif", fontSize: 18,
        color: "rgba(184,140,235,.94)", marginBottom: 12,
      }}>
        What the calendar doesn’t capture
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {people.map((person) => (
          <div key={person.name} style={{
            paddingTop: 12, borderTop: "1px solid rgba(245,235,210,.07)",
          }}>
            <div style={{
              display: "grid", gridTemplateColumns: "34px 1fr",
              gap: 10, alignItems: "start",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                display: "grid", placeItems: "center",
                border: `1px solid ${person.color}88`,
                color: person.color,
                fontFamily: "'DM Mono',monospace", fontSize: 11,
              }}>
                {person.name.split(" ").map((part) => part[0]).join("")}
              </div>

              <div>
                <div style={{ fontFamily: "'EB Garamond',serif", fontSize: 14.5, color: "rgba(255,248,230,.84)" }}>
                  {person.name}
                </div>
                <div style={{ marginTop: 2, fontFamily: "'EB Garamond',serif", fontSize: 12.5, color: person.color }}>
                  {person.role}
                </div>
                <div style={{
                  marginTop: 7, fontFamily: "'EB Garamond',serif",
                  fontSize: 13.5, lineHeight: 1.42,
                  color: "rgba(245,235,210,.62)",
                }}>
                  {person.need}
                </div>
                <div style={{
                  marginTop: 7, fontFamily: "'EB Garamond',serif",
                  fontSize: 12.5, lineHeight: 1.4,
                  color: "rgba(245,235,210,.42)",
                }}>
                  {person.authority}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 14, padding: "11px 12px",
        border: "1px solid rgba(184,140,235,.20)",
        background: "rgba(184,140,235,.045)",
        fontFamily: "'EB Garamond',serif", fontSize: 13.5,
        lineHeight: 1.45, color: "rgba(245,235,210,.60)",
      }}>
        Different needs. Different constraints. Different authority.
      </div>
    </div>
  );
}

function ScenarioInspector({ color, step }: { color: string; step: StoryStep }) {
  return (
    <>
      <div style={{
        marginBottom: 18, fontFamily: "'DM Mono',monospace",
        fontSize: 8, letterSpacing: ".22em",
        textTransform: "uppercase", color: "rgba(101,214,154,.70)",
      }}>
        Inspector
      </div>

      <section style={{
        padding: "18px 17px",
        border: "1px solid rgba(245,235,210,.10)",
        background: "linear-gradient(145deg, rgba(12,15,24,.86), rgba(7,9,16,.80))",
      }}>
        <div style={{ ...mono, color, marginBottom: 16 }}>Scenario</div>

        <InspectorRow label="Goal">Complete the design review before Wednesday.</InspectorRow>
        <InspectorDivider />
        <InspectorRow label="Constraint">All three people must participate.</InspectorRow>
        <InspectorDivider />
        <InspectorRow label="System assumption">
          {step === 1
            ? "The system has not made a recommendation yet."
            : step === 2
              ? "Availability is being treated as sufficient evidence."
              : "Availability does not capture impact, need, or decision authority."}
        </InspectorRow>
      </section>

      <section style={{
        marginTop: 16, padding: "16px 17px",
        border: `1px solid ${color}3A`, background: `${color}08`,
      }}>
        <div style={{ ...mono, color, marginBottom: 8 }}>Next</div>
        <div style={{
          fontFamily: "'EB Garamond',serif", fontSize: 14,
          lineHeight: 1.45, color: "rgba(245,235,210,.58)",
        }}>
          {step === 1 && "Let the assistant propose a time."}
          {step === 2 && "Inspect what calendar availability hides."}
          {step === 3 && "Explore the framework that makes shared authority explicit."}
        </div>
      </section>
    </>
  );
}

function InspectorRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{
        fontFamily: "'EB Garamond',serif", fontSize: 14.5,
        color: "rgba(255,248,230,.82)", marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "'EB Garamond',serif", fontSize: 13.5,
        lineHeight: 1.45, color: "rgba(245,235,210,.54)",
      }}>
        {children}
      </div>
    </div>
  );
}

function InspectorDivider() {
  return <div style={{ height: 1, margin: "16px 0", background: "rgba(245,235,210,.08)" }} />;
}

const mono = {
  fontFamily: "'DM Mono',monospace",
  fontSize: 8,
  letterSpacing: ".17em",
  textTransform: "uppercase" as const,
};

const copy = {
  margin: "14px 0 0",
  fontFamily: "'EB Garamond',serif",
  fontSize: 14.5,
  lineHeight: 1.45,
  color: "rgba(245,235,210,.60)",
};

const divider = {
  height: 1,
  margin: "16px 0",
  background: "rgba(245,235,210,.07)",
};

const iconBox = {
  width: 34,
  height: 34,
  display: "grid",
  placeItems: "center",
  border: "1px solid rgba(184,140,235,.34)",
  color: "rgba(184,140,235,.90)",
  fontSize: 16,
};

const card = {
  minHeight: 430,
  padding: "18px 18px 17px",
  border: "1px solid rgba(245,235,210,.10)",
  background: "linear-gradient(180deg, rgba(9,12,19,.86), rgba(5,8,14,.78))",
  backdropFilter: "blur(12px)",
};
