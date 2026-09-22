import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [selectedLaw, setSelectedLaw] = useState<SovereignLaw | null>(null);

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

  const requestClose = useCallback(() => {
    if (transitionPhase === "exiting") return;
    if (reducedMotion) {
      onClose();
      return;
    }

    setTransitionPhase("exiting");
    window.setTimeout(onClose, 240);
  }, [onClose, reducedMotion, transitionPhase]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (selectedLaw) {
        setSelectedLaw(null);
        return;
      }

      requestClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [requestClose, selectedLaw]);

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
        @keyframes lawsPanelEnter {
          from { opacity: 0; transform: translateX(18px); }
          to { opacity: 1; transform: translateX(0); }
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

        [data-laws-index-root] button:focus-visible {
          outline: 2px solid ${readerSemanticColor.text.primary};
          outline-offset: 3px;
        }

        @media (prefers-reduced-motion: reduce) {
          [data-laws-index-root],
          [data-laws-index-content],
          [data-laws-detail-panel] {
            animation-duration: 1ms !important;
            animation-delay: 0ms !important;
            filter: none !important;
            transform: none !important;
            transition-duration: 1ms !important;
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

        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            overflow: "hidden",
          }}
        >
          <main
            style={{
              flex: 1,
              minWidth: 0,
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
              selectedLawId={selectedLaw?.id ?? null}
              onSelectLaw={setSelectedLaw}
            />

            <LawBand
              eyebrow="RELATIONAL LAWS"
              count={SOVEREIGN_LAW_COUNTS.relational}
              description="Principles for emotionally sensitive, uncertain, vulnerable, or high-pressure moments."
              laws={RELATIONAL_SOVEREIGN_LAWS}
              color={RELATIONAL_COLOR}
              columns="repeat(auto-fit, minmax(196px, 1fr))"
              selectedLawId={selectedLaw?.id ?? null}
              onSelectLaw={setSelectedLaw}
            />

            <LawBand
              eyebrow="ADVANCED ALIGNMENT SIGNALS"
              count={SOVEREIGN_LAW_COUNTS.signals}
              description={SOVEREIGN_LAWS_SIGNAL_CAUTION}
              laws={SOVEREIGN_ALIGNMENT_SIGNALS}
              color={SIGNAL_COLOR}
              columns="repeat(3, minmax(0, 1fr))"
              selectedLawId={selectedLaw?.id ?? null}
              onSelectLaw={setSelectedLaw}
              signal
              last
            />
          </main>

          {selectedLaw && (
            <LawDetailPanel
              law={selectedLaw}
              reducedMotion={reducedMotion}
              onClose={() => setSelectedLaw(null)}
            />
          )}
        </div>
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
  selectedLawId,
  onSelectLaw,
  signal = false,
  last = false,
}: {
  eyebrow: string;
  count: number;
  description: string;
  laws: SovereignLaw[];
  color: string;
  columns: string;
  selectedLawId: string | null;
  onSelectLaw: (law: SovereignLaw) => void;
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
          <LawCard
            key={law.id}
            law={law}
            color={color}
            signal={signal}
            selected={law.id === selectedLawId}
            onSelect={() => onSelectLaw(law)}
          />
        ))}
      </div>
    </section>
  );
}

function LawCard({
  law,
  color,
  signal,
  selected,
  onSelect,
}: {
  law: SovereignLaw;
  color: string;
  signal: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const elevated = selected || hovered;

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${law.number}. ${law.title}. ${law.shortDescription}`}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        minHeight: signal ? 108 : 94,
        padding: signal ? "16px 17px" : "14px 15px",
        border: `1px solid ${color}${selected ? "B8" : elevated ? "72" : signal ? "55" : "34"}`,
        background: selected
          ? `linear-gradient(145deg, ${color}1A, rgba(8,10,18,0.92))`
          : signal
            ? `linear-gradient(145deg, ${color}0D, rgba(8,10,18,0.72))`
            : elevated
              ? `linear-gradient(145deg, ${color}0B, rgba(8,10,18,0.76))`
              : "rgba(8,10,18,0.58)",
        boxShadow: selected
          ? `inset 0 0 42px ${color}0C, 0 0 24px ${color}12`
          : signal
            ? `inset 0 0 36px ${color}08`
            : "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 10,
        width: "100%",
        color: "inherit",
        textAlign: "left",
        cursor: "pointer",
        transition:
          "border-color 180ms ease, background 180ms ease, box-shadow 180ms ease, transform 180ms ease",
        transform: elevated ? "translateY(-1px)" : "translateY(0)",
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
    </button>
  );
}

function LawDetailPanel({
  law,
  reducedMotion,
  onClose,
}: {
  law: SovereignLaw;
  reducedMotion: boolean;
  onClose: () => void;
}) {
  const color = resolveLawColor(law);
  const bandLabel =
    law.band === "core"
      ? "CORE LAW"
      : law.band === "relational"
        ? "RELATIONAL LAW"
        : "ADVANCED ALIGNMENT SIGNAL";

  return (
    <aside
      data-laws-detail-panel
      aria-label={`${law.title} detail`}
      style={{
        width: 390,
        flexShrink: 0,
        borderLeft: "1px solid rgba(200,180,130,0.10)",
        background:
          "linear-gradient(180deg, rgba(6,8,14,0.99), rgba(4,6,11,0.99))",
        overflowY: "auto",
        scrollbarWidth: "none",
        animation: reducedMotion
          ? "none"
          : "lawsPanelEnter 300ms cubic-bezier(.16,1,.3,1) both",
      }}
    >
      <div
        style={{
          minHeight: 96,
          padding: "22px 22px 18px",
          borderBottom: "1px solid rgba(200,180,130,0.09)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 18,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 9,
            }}
          >
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.14em",
                color,
              }}
            >
              {law.band === "signal" ? "SIGNAL" : "LAW"} {law.number}
            </span>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 8.5,
                letterSpacing: "0.20em",
                color: readerSemanticColor.text.metadata,
              }}
            >
              {bandLabel}
            </span>
          </div>

          <div
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: 28,
              lineHeight: 1.04,
              fontWeight: 500,
              color: readerSemanticColor.text.primary,
            }}
          >
            {law.title}
          </div>
        </div>

        <button
          type="button"
          aria-label="Close law detail"
          onClick={onClose}
          style={{
            width: 30,
            height: 30,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(200,180,130,0.18)",
            background: "rgba(255,255,255,0.02)",
            color: readerSemanticColor.text.metadata,
            cursor: "pointer",
          }}
        >
          <X size={14} />
        </button>
      </div>

      <div style={{ padding: "22px 22px 38px" }}>
        {law.band === "core" ? (
          <CoreLawDetail law={law} color={color} />
        ) : law.band === "relational" ? (
          <RelationalLawDetail law={law} color={color} />
        ) : (
          <SignalDetail law={law} color={color} />
        )}

        <div
          style={{
            marginTop: 28,
            paddingTop: 18,
            borderTop: "1px solid rgba(200,180,130,0.08)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          <MetaValue label="TYPE" value={bandLabel} color={color} />
          <MetaValue
            label={law.band === "signal" ? "SIGNAL" : "LAW"}
            value={`${law.number} OF ${String(SOVEREIGN_LAW_COUNTS.total).padStart(2, "0")}`}
            color={color}
          />
        </div>
      </div>
    </aside>
  );
}

function CoreLawDetail({
  law,
  color,
}: {
  law: SovereignLaw;
  color: string;
}) {
  return (
    <>
      <DetailSection
        label="PRINCIPLE"
        value={law.principle ?? law.shortDescription}
        color={color}
      />

      {law.example && (
        <DetailSection label="IN PRACTICE" value={law.example} color={color} />
      )}

      {law.broken && (
        <DetailSection
          label="WHEN IT BREAKS"
          value={law.broken}
          color={STELLAR_PALETTE.risk}
          last
        />
      )}
    </>
  );
}

function RelationalLawDetail({
  law,
  color,
}: {
  law: SovereignLaw;
  color: string;
}) {
  return (
    <>
      <DetailSection
        label="PRINCIPLE"
        value={law.principle ?? law.shortDescription}
        color={color}
      />

      <DetailSection
        label="USE WHEN"
        value="The interaction involves stress, uncertainty, vulnerability, or heightened stakes where system behavior can amplify or reduce pressure."
        color={color}
        last
      />
    </>
  );
}

function SignalDetail({
  law,
  color,
}: {
  law: SovereignLaw;
  color: string;
}) {
  return (
    <>
      <div
        style={{
          marginBottom: 24,
          padding: "14px 15px",
          border: `1px solid ${color}55`,
          background: `${color}0B`,
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.22em",
            color,
            marginBottom: 8,
          }}
        >
          SIGNAL — NOT A TARGET
        </div>
        <div
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 16,
            lineHeight: 1.6,
            color: readerSemanticColor.text.secondary,
          }}
        >
          {SOVEREIGN_LAWS_SIGNAL_CAUTION}
        </div>
      </div>

      <DetailSection
        label="SIGNAL"
        value={law.title}
        color={color}
      />

      <DetailSection
        label="RESPONSE"
        value="Pause. Document what is occurring. Do not optimize directly for the condition."
        color={color}
        last
      />
    </>
  );
}

function DetailSection({
  label,
  value,
  color,
  last = false,
}: {
  label: string;
  value: string;
  color: string;
  last?: boolean;
}) {
  return (
    <section
      style={{
        paddingBottom: last ? 0 : 22,
        marginBottom: last ? 0 : 22,
        borderBottom: last
          ? "none"
          : "1px solid rgba(200,180,130,0.08)",
      }}
    >
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.22em",
          color,
          marginBottom: 10,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: 16.5,
          lineHeight: 1.68,
          color: readerSemanticColor.text.secondary,
        }}
      >
        {value}
      </div>
    </section>
  );
}

function MetaValue({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 8.5,
          letterSpacing: "0.20em",
          color: readerSemanticColor.text.metadata,
          marginBottom: 7,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9.5,
          lineHeight: 1.5,
          letterSpacing: "0.12em",
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function resolveLawColor(law: SovereignLaw) {
  if (law.band === "core") return CORE_COLOR;
  if (law.band === "relational") return RELATIONAL_COLOR;
  return SIGNAL_COLOR;
}
