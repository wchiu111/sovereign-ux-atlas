import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import {
  CORE_SOVEREIGN_LAWS,
  RELATIONAL_SOVEREIGN_LAWS,
  SOVEREIGN_ALIGNMENT_SIGNALS,
  SOVEREIGN_LAW_COUNTS,
  SOVEREIGN_LAWS_SIGNAL_CAUTION,
  type SovereignLaw,
} from "../../content/frameworks/sovereign-ux-laws";
import { STELLAR_PALETTE } from "../../atlas/constellation/stellarPalette";
import { readerSemanticColor } from "../shared/readerSemanticPalette";

interface Props {
  frameworkTitle: string;
  sectionTitle: string;
  onClose: () => void;
}

type TransitionPhase = "entering" | "open" | "exiting";

const CORE_COLOR = STELLAR_PALETTE.judgment;
const RELATIONAL_COLOR = STELLAR_PALETTE.relational;
const SIGNAL_COLOR = STELLAR_PALETTE.purpose;

export default function SovereignLawsIndexCanvas({
  frameworkTitle,
  sectionTitle,
  onClose,
}: Props) {
  const [transitionPhase, setTransitionPhase] =
    useState<TransitionPhase>("entering");

  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    const timer = window.setTimeout(
      () => setTransitionPhase("open"),
      reducedMotion ? 40 : 360,
    );
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  const requestClose = () => {
    if (transitionPhase === "exiting") return;
    if (reducedMotion) {
      onClose();
      return;
    }

    setTransitionPhase("exiting");
    window.setTimeout(onClose, 240);
  };

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  return (
    <div
      data-laws-index-root
      data-transition-phase={transitionPhase}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 80,
        background: "#04060B",
        color: readerSemanticColor.text.primary,
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes lawsIndexEnter {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes lawsIndexReveal {
          from { opacity: 0; transform: translateY(10px); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes lawsIndexExit {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        [data-laws-index-root][data-transition-phase="entering"] {
          animation: lawsIndexEnter 220ms ease-out both;
        }
        [data-laws-index-root][data-transition-phase="entering"] [data-laws-index-content] {
          animation: lawsIndexReveal 520ms 80ms cubic-bezier(.16,1,.3,1) both;
        }
        [data-laws-index-root][data-transition-phase="exiting"] {
          animation: lawsIndexExit 220ms ease-in both;
          pointer-events: none;
        }

        @media (prefers-reduced-motion: reduce) {
          [data-laws-index-root],
          [data-laws-index-content] {
            animation-duration: 1ms !important;
            animation-delay: 0ms !important;
            filter: none !important;
            transform: none !important;
          }
        }
      `}</style>

      <div
        data-laws-index-content
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          background:
            "radial-gradient(circle at 78% 22%, rgba(212,145,106,0.055), transparent 30%), " +
            "radial-gradient(circle at 18% 70%, rgba(166,139,212,0.045), transparent 34%), " +
            "#04060B",
        }}
      >
        <header
          style={{
            minHeight: 136,
            flexShrink: 0,
            padding: "22px 28px 18px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 32,
            borderBottom: "1px solid rgba(200,180,130,0.10)",
            background:
              "linear-gradient(180deg, rgba(4,6,11,0.99), rgba(4,6,11,0.94))",
          }}
        >
          <div style={{ maxWidth: 860 }}>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.24em",
                color: readerSemanticColor.utility.primary,
                marginBottom: 9,
              }}
            >
              {frameworkTitle.toUpperCase()} · {sectionTitle.toUpperCase()}
            </div>

            <div
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 38,
                lineHeight: 1.02,
                fontWeight: 500,
                letterSpacing: "0.01em",
                color: readerSemanticColor.text.primary,
                marginBottom: 8,
              }}
            >
              Laws of the Interface
            </div>

            <div
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 17,
                lineHeight: 1.5,
                color: readerSemanticColor.text.secondary,
                maxWidth: 760,
              }}
            >
              Diagnostic principles for understanding how systems affect trust,
              agency, and human judgment.
            </div>

            <div
              style={{
                marginTop: 13,
                display: "flex",
                flexWrap: "wrap",
                gap: "8px 18px",
                fontFamily: "'DM Mono', monospace",
                fontSize: 9.5,
                letterSpacing: "0.14em",
                color: readerSemanticColor.text.metadata,
                textTransform: "uppercase",
              }}
            >
              <span>{SOVEREIGN_LAW_COUNTS.total} principles</span>
              <span style={{ color: CORE_COLOR }}>
                Core {SOVEREIGN_LAW_COUNTS.core}
              </span>
              <span style={{ color: RELATIONAL_COLOR }}>
                Relational {SOVEREIGN_LAW_COUNTS.relational}
              </span>
              <span style={{ color: SIGNAL_COLOR }}>
                Signals {SOVEREIGN_LAW_COUNTS.signals}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={requestClose}
            style={{
              minHeight: 40,
              padding: "0 14px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
              border: "1px solid rgba(200,180,130,0.42)",
              background: "rgba(7,9,15,0.78)",
              color: readerSemanticColor.utility.primary,
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.18em",
              cursor: "pointer",
            }}
          >
            BACK TO FRAMEWORK
            <X size={13} />
          </button>
        </header>

        <main
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            scrollbarWidth: "none",
            padding: "26px 28px 44px",
          }}
        >
          <LawBand
            eyebrow="CORE LAWS"
            count={SOVEREIGN_LAW_COUNTS.core}
            description="Foundational principles that apply across interfaces, regardless of domain."
            laws={CORE_SOVEREIGN_LAWS}
            color={CORE_COLOR}
            columns="repeat(auto-fit, minmax(210px, 1fr))"
          />

          <LawBand
            eyebrow="RELATIONAL LAWS"
            count={SOVEREIGN_LAW_COUNTS.relational}
            description="Principles for emotionally sensitive, uncertain, vulnerable, or high-pressure moments."
            laws={RELATIONAL_SOVEREIGN_LAWS}
            color={RELATIONAL_COLOR}
            columns="repeat(auto-fit, minmax(196px, 1fr))"
          />

          <LawBand
            eyebrow="ADVANCED ALIGNMENT SIGNALS"
            count={SOVEREIGN_LAW_COUNTS.signals}
            description={SOVEREIGN_LAWS_SIGNAL_CAUTION}
            laws={SOVEREIGN_ALIGNMENT_SIGNALS}
            color={SIGNAL_COLOR}
            columns="repeat(3, minmax(0, 1fr))"
            signal
            last
          />
        </main>
      </div>
    </div>
  );
}

function LawBand({
  eyebrow,
  count,
  description,
  laws,
  color,
  columns,
  signal = false,
  last = false,
}: {
  eyebrow: string;
  count: number;
  description: string;
  laws: SovereignLaw[];
  color: string;
  columns: string;
  signal?: boolean;
  last?: boolean;
}) {
  return (
    <section
      aria-labelledby={`laws-band-${eyebrow.toLowerCase().replace(/\s+/g, "-")}`}
      style={{
        paddingBottom: last ? 0 : 34,
        marginBottom: last ? 0 : 32,
        borderBottom: last
          ? "none"
          : "1px solid rgba(200,180,130,0.08)",
      }}
    >
      <div style={{ marginBottom: 15 }}>
        <div
          id={`laws-band-${eyebrow.toLowerCase().replace(/\s+/g, "-")}`}
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            fontFamily: "'DM Mono', monospace",
            color,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: 12,
              letterSpacing: "0.24em",
            }}
          >
            {eyebrow}
          </span>
          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.16em",
              opacity: 0.72,
            }}
          >
            {String(count).padStart(2, "0")}
          </span>
        </div>

        <div
          style={{
            maxWidth: 820,
            fontFamily: "'EB Garamond', serif",
            fontSize: signal ? 15.5 : 15,
            lineHeight: 1.5,
            color: signal
              ? readerSemanticColor.text.caption
              : readerSemanticColor.text.metadata,
          }}
        >
          {description}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: columns,
          gap: 9,
        }}
      >
        {laws.map((law) => (
          <LawCard key={law.id} law={law} color={color} signal={signal} />
        ))}
      </div>
    </section>
  );
}

function LawCard({
  law,
  color,
  signal,
}: {
  law: SovereignLaw;
  color: string;
  signal: boolean;
}) {
  return (
    <article
      aria-label={`${law.number}. ${law.title}. ${law.shortDescription}`}
      style={{
        minHeight: signal ? 108 : 94,
        padding: signal ? "16px 17px" : "14px 15px",
        border: `1px solid ${color}${signal ? "55" : "34"}`,
        background: signal
          ? `linear-gradient(145deg, ${color}0D, rgba(8,10,18,0.72))`
          : "rgba(8,10,18,0.58)",
        boxShadow: signal ? `inset 0 0 36px ${color}08` : "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          minWidth: 0,
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.12em",
            color,
            flexShrink: 0,
            paddingTop: 2,
          }}
        >
          {law.number}
        </div>

        <div
          style={{
            minWidth: 0,
            fontFamily: "'EB Garamond', serif",
            fontSize: signal ? 18 : 17,
            lineHeight: 1.16,
            fontWeight: 500,
            color: readerSemanticColor.text.primary,
          }}
        >
          {law.title}
        </div>
      </div>

      <div
        style={{
          paddingLeft: 30,
          fontFamily: "'EB Garamond', serif",
          fontSize: 14,
          lineHeight: 1.45,
          color: signal
            ? readerSemanticColor.text.caption
            : readerSemanticColor.text.secondary,
        }}
      >
        {law.shortDescription}
      </div>
    </article>
  );
}
