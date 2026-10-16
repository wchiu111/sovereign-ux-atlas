import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties, type ReactNode, type RefObject, type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  AlertCircle, ArrowLeft, ArrowRight, Check, ChevronRight,
  RotateCcw, Search, ShieldAlert, X,
} from "lucide-react";
import {
  FAILURE_SITUATIONS,
  FAILURE_PATTERNS,
  FAILURE_PATTERNS_BY_ID,
  FAILURE_DIAGNOSTIC_QUESTIONS,
  FAILURE_REPAIR_LOOP,
  FAILURE_FIELD_GUIDANCE,
  FAILURE_PROFESSIONAL_BOUNDARY,
  type FailurePatternId,
  type FailureSituationId,
  type IllustrativeSurface,
  type SovereignFailurePattern,
} from "../../content/frameworks/sovereign-ux-failure-patterns";
import { STELLAR_PALETTE } from "../../atlas/constellation/stellarPalette";
import { readerSemanticColor } from "../shared/readerSemanticPalette";

interface Props {
  frameworkTitle: string;
  sectionTitle: string;
  onClose: () => void;
}

type SituationFilter = "all" | FailureSituationId;
type Phase = "entering" | "open" | "exiting";

const RISK = STELLAR_PALETTE.risk;
const GOLD = readerSemanticColor.utility.primary;
const IVORY = readerSemanticColor.text.primary;
const SECONDARY = readerSemanticColor.text.secondary;
const META = readerSemanticColor.text.metadata;
const mono: CSSProperties = { fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.13em" };
const prose: CSSProperties = { fontFamily: "'EB Garamond',Georgia,serif", fontSize: 17, lineHeight: 1.58 };
const control: CSSProperties = {
  ...mono, display: "inline-flex", justifyContent: "center", alignItems: "center",
  gap: 8, minHeight: 44, padding: "9px 14px", border: "1px solid rgba(200,169,110,0.30)",
  background: "rgba(200,169,110,0.045)", color: GOLD, cursor: "pointer",
};

// Contextual reading references only. Labels should never suggest official
// one-to-one mappings or navigable links that the Atlas cannot yet provide.
const PROTOCOL_NAMES: Record<string, string> = {
  "01": "Presence Before Output", "02": "Mirror First, Then Move",
  "03": "Check for Unresolved Weight", "04": "Always Offer an Exit",
  "05": "Match the Depth", "06": "Stop Optimizing During Reflection",
  "07": "Pause When Something Feels Off", "08": "Check System Bias First",
  "09": "Make Entry Signals Clear", "10": "Signal Fidelity Check",
  "11": "Interpret Before Acting", "12": "Frame, Then Confirm",
};
const LAW_NAMES: Record<string, string> = {
  sovereignty: "Sovereignty", reflection: "Reflection", clarity: "Clarity",
  completion: "Completion", integrity: "Integrity", presence: "Presence",
  "signal-fidelity": "Signal Fidelity", "decision-framing": "Decision Framing",
  "transparent-uncertainty": "Transparent Uncertainty",
  "visible-trade-offs": "Visible Trade-Offs",
  "agency-in-vulnerability": "Agency in Vulnerability",
  "silence-as-signal": "Silence as Signal",
  "error-recovery-as-trust-building": "Error Recovery as Trust-Building",
};

export default function SovereignFailurePatternsCanvas({ frameworkTitle, sectionTitle, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>("entering");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SituationFilter>("all");
  const [selectedId, setSelectedId] = useState<FailurePatternId | null>(null);
  const [quickCheckOpen, setQuickCheckOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const quickCheckRef = useRef<HTMLDivElement>(null);
  const diagnosticTriggerRef = useRef<HTMLButtonElement>(null);
  const cardsRef = useRef(new Map<FailurePatternId, HTMLButtonElement>());
  const lastCardRef = useRef<FailurePatternId | null>(null);
  const wasQuickCheckOpenRef = useRef(false);
  const closeTimerRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);
  const selected = selectedId ? FAILURE_PATTERNS_BY_ID[selectedId] ?? null : null;

  const visiblePatterns = useMemo(() => FAILURE_PATTERNS.filter((pattern) => {
    if (filter !== "all" && !pattern.situations.includes(filter)) return false;
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return true;
    const terms = [
      pattern.id, pattern.title, pattern.shortDescription, pattern.whatItLooksLike,
      pattern.whyItBreaksTrust, pattern.repair, pattern.failureExample.headline,
      pattern.repairExample.headline, ...pattern.situations.map((id) =>
        FAILURE_SITUATIONS.find((item) => item.id === id)?.label ?? id),
    ];
    return terms.join(" ").toLocaleLowerCase().includes(needle);
  }), [query, filter]);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setPhase("open"), reducedMotionRef.current ? 1 : 350);
    return () => {
      window.clearTimeout(timer);
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  const requestClose = useCallback(() => {
    if (phase === "exiting") return;
    if (reducedMotionRef.current) { onClose(); return; }
    setPhase("exiting");
    closeTimerRef.current = window.setTimeout(onClose, 280);
  }, [onClose, phase]);

  const selectPattern = useCallback((id: FailurePatternId) => {
    lastCardRef.current = id;
    setSelectedId(id);
    setQuickCheckOpen(false);
  }, []);

  const returnToIndex = useCallback(() => {
    const id = lastCardRef.current;
    setSelectedId(null);
    window.requestAnimationFrame(() => {
      const target = id ? cardsRef.current.get(id) : null;
      (target ?? searchRef.current)?.focus();
    });
  }, []);

  useEffect(() => {
    if (quickCheckOpen) {
      wasQuickCheckOpenRef.current = true;
      quickCheckRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    } else if (wasQuickCheckOpenRef.current) {
      wasQuickCheckOpenRef.current = false;
      diagnosticTriggerRef.current?.focus({ preventScroll: true });
    }
  }, [quickCheckOpen]);

  const closeQuickCheck = useCallback(() => setQuickCheckOpen(false), []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (quickCheckOpen) { closeQuickCheck(); return; }
      if (selectedId) { returnToIndex(); return; }
      requestClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quickCheckOpen, selectedId, closeQuickCheck, returnToIndex, requestClose]);

  const resetFilters = useCallback(() => { setQuery(""); setFilter("all"); searchRef.current?.focus(); }, []);

  return (
    <div data-failure-field data-phase={phase} style={{ position: "absolute", inset: 0, zIndex: 80, color: IVORY, background: "#04060B", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes failureFieldEnter { from { opacity:0 } to { opacity:1 } }
        @keyframes failureFieldExit { from { opacity:1 } to { opacity:0 } }
        [data-failure-field][data-phase="entering"] { animation: failureFieldEnter 340ms ease-out both; }
        [data-failure-field][data-phase="exiting"] { animation: failureFieldExit 280ms ease-in both; pointer-events:none; }
        [data-failure-field] * { box-sizing:border-box; }
        [data-failure-field] button:focus-visible, [data-failure-field] input:focus-visible,
        [data-failure-field] [tabindex="-1"]:focus-visible { outline:2px solid #E8C86D; outline-offset:3px; }
        [data-failure-field] button:hover:not(:disabled) { filter:brightness(1.16); }
        [data-failure-field] button { transition:filter 200ms ease, border-color 200ms ease, background 200ms ease; }
        .failure-main { padding: 26px 34px 56px; }
        .failure-header { padding: 24px 34px 20px; }
        .failure-index-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:13px; }
        .failure-index-card { min-height:164px; }
        .failure-inspector { display:grid; grid-template-columns:minmax(240px,300px) minmax(0,1fr); min-height:0; flex:1; }
        .failure-aside { overflow-y:auto; border-right:1px solid rgba(200,169,110,.13); padding:18px 18px 30px 28px; scrollbar-width:thin; }
        .failure-inspector-content { overflow-y:auto; padding:25px 34px 54px; min-width:0; scrollbar-width:thin; }
        .failure-comparison { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }
        .failure-inspection-subcols { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }
        .failure-filter-row { display:flex; flex-wrap:wrap; gap:8px; }
        @media(max-width:1080px) {
          .failure-index-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
          .failure-inspector { grid-template-columns:minmax(215px,250px) minmax(0,1fr); }
          .failure-inspector-content { padding:22px 24px 45px; }
        }
        @media(max-width:750px) {
          .failure-header { padding:16px 18px; }
          .failure-main { padding:20px 18px 40px; }
          .failure-index-grid { grid-template-columns:1fr; }
          .failure-index-card { min-height:126px; }
          .failure-inspector { display:flex; flex-direction:column; overflow-y:auto; }
          .failure-aside { overflow:visible; border-right:0; border-bottom:1px solid rgba(200,169,110,.13); padding:14px 18px; flex-shrink:0; }
          .failure-aside-list { display:none !important; }
          .failure-inspector-content { overflow:visible; padding:22px 18px 42px; }
          .failure-comparison, .failure-inspection-subcols { grid-template-columns:1fr; }
        }
        @media (prefers-reduced-motion:reduce) {
          [data-failure-field][data-phase] { animation:none !important; }
          [data-failure-field] button { transition:none !important; }
        }
      `}</style>

      {/* The header remains part of the same field during index → inspection. */}
      <header className="failure-header" style={{ position: "relative", flexShrink: 0, borderBottom: "1px solid rgba(200,169,110,.16)", background: "linear-gradient(110deg,rgba(24,13,25,.75),rgba(4,6,11,.97) 70%)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ ...mono, color: RISK, fontSize: 10, marginBottom: 10 }}>{frameworkTitle.toUpperCase()} · {sectionTitle.toUpperCase()}</div>
            <h1 style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: "clamp(27px,3.1vw,41px)", fontWeight: 500, lineHeight: 1.06, margin: "0 0 7px" }}>When Reflection Fails</h1>
            <p style={{ ...prose, fontSize: 16, margin: 0, maxWidth: 800, color: SECONDARY }}>Recognize the breakdown. Examine the repair. Restore the person's ability to choose.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button ref={diagnosticTriggerRef} type="button" style={control} onClick={() => setQuickCheckOpen(true)} aria-haspopup="dialog" aria-expanded={quickCheckOpen}>
              <ShieldAlert size={14} aria-hidden /> 90-SECOND CHECK
            </button>
            <button type="button" style={control} onClick={requestClose} aria-label="Back to framework">
              BACK TO FRAMEWORK <X size={14} aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {!selected ? (
        <main className="failure-main" style={{ overflowY: "auto", minHeight: 0, flex: 1, background: "radial-gradient(ellipse at 17% 10%,rgba(117,38,46,.075),transparent 46%)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
            <div>
              <h2 style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 26, fontWeight: 500, margin: "0 0 5px" }}>What feels misaligned?</h2>
              <p style={{ ...prose, color: SECONDARY, fontSize: 15.5, margin: 0 }}>Search a symptom or select any failure pattern. No fixed sequence.</p>
            </div>
            <span style={{ ...mono, color: META }}>{visiblePatterns.length} OF {FAILURE_PATTERNS.length} PATTERNS</span>
          </div>
          <SearchAndFilters query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} searchRef={searchRef} />
          <div style={{ ...mono, display: "flex", justifyContent: "space-between", margin: "25px 0 12px", color: META, fontSize: 10 }}>
            <span>FAILURE PATTERN INDEX</span><span>SELECT TO INSPECT <ArrowRight aria-hidden size={11} style={{ verticalAlign: "middle" }} /></span>
          </div>
          {visiblePatterns.length ? (
            <div className="failure-index-grid">
              {visiblePatterns.map((pattern) => (
                <PatternCard key={pattern.id} pattern={pattern} onSelect={selectPattern} refCallback={(node) => { if(node)cardsRef.current.set(pattern.id,node); else cardsRef.current.delete(pattern.id); }} />
              ))}
            </div>
          ) : <EmptyResults onReset={resetFilters} />}
          <RepairReference />
          <BoundaryNote />
        </main>
      ) : (
        <div className="failure-inspector" role="region" aria-label={`Inspect failure pattern ${selected.id}: ${selected.title}`}>
          <aside className="failure-aside">
            <button type="button" onClick={returnToIndex} style={{ ...control, marginBottom: 17, width: "100%", justifyContent: "flex-start" }}><ArrowLeft size={14} aria-hidden /> ALL PATTERNS</button>
            <SearchAndFilters query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} searchRef={searchRef} compact />
            <div className="failure-aside-list" style={{ display: "grid", gap: 5, marginTop: 18 }}>
              {visiblePatterns.length ? visiblePatterns.map((pattern) => (
                <button key={pattern.id} type="button" aria-pressed={pattern.id === selected.id} onClick={() => selectPattern(pattern.id)} style={{ border: pattern.id === selected.id ? `1px solid ${RISK}A8` : "1px solid rgba(200,169,110,.09)", background: pattern.id === selected.id ? "rgba(216,108,97,.085)" : "transparent", color: pattern.id === selected.id ? IVORY : SECONDARY, cursor: "pointer", textAlign: "left", padding: "11px 10px", fontFamily: "'EB Garamond',Georgia,serif", fontSize: 15, lineHeight: 1.2, display: "flex", alignItems: "flex-start", gap: 9 }}>
                  <span style={{ ...mono, fontSize: 10, flexShrink: 0, color: pattern.id === selected.id ? RISK : META }}>{pattern.id}</span>
                  <span>{pattern.title}</span>
                </button>
              )) : <EmptyResults onReset={resetFilters} compact />}
            </div>
            <div style={{ ...mono, fontSize: 9, marginTop: 18, lineHeight: 1.5, color: META }}>SEARCH AND FILTERS ARE NAVIGATION AIDS, NOT DIAGNOSTIC SCORES.</div>
          </aside>
          <main className="failure-inspector-content" key={selected.id}>
            <PatternInspection pattern={selected} />
          </main>
        </div>
      )}

      {quickCheckOpen && <QuickDiagnostic onClose={closeQuickCheck} modalRef={quickCheckRef} />}
    </div>
  );
}

function SearchAndFilters({ query, setQuery, filter, setFilter, searchRef, compact = false }: {
  query: string;
  setQuery: (value: string) => void;
  filter: SituationFilter;
  setFilter: (filter: SituationFilter) => void;
  searchRef: RefObject<HTMLInputElement | null>;
  compact?: boolean;
}) {
  return <div>
    <label style={{ position: "relative", display: "block", maxWidth: compact ? "100%" : 760 }}>
      <span className="sr-only" style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>Search failure patterns</span>
      <Search aria-hidden size={17} style={{ position: "absolute", top: 15, left: 14, color: GOLD, pointerEvents: "none" }} />
      <input ref={searchRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search patterns, symptoms, decisions..." style={{ ...mono, width: "100%", minHeight: 46, padding: "12px 12px 12px 42px", color: IVORY, background: "rgba(10,13,23,.83)", border: "1px solid rgba(166,139,212,.38)", borderRadius: 0, outlineOffset: 3, fontSize: compact ? 10 : 11, letterSpacing: ".02em" }} />
    </label>
    <div className="failure-filter-row" role="group" aria-label="Filter by situation" style={{ marginTop: 12 }}>
      <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>ALL 17</FilterButton>
      {FAILURE_SITUATIONS.map((situation) => <FilterButton key={situation.id} active={filter === situation.id} onClick={() => setFilter(situation.id)}>{situation.label.toUpperCase()}</FilterButton>)}
    </div>
  </div>;
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return <button type="button" aria-pressed={active} onClick={onClick} style={{ ...mono, fontSize: 9, minHeight: 40, padding: "8px 11px", color: active ? IVORY : SECONDARY, background: active ? "rgba(216,108,97,.19)" : "rgba(9,11,19,.56)", border: active ? `1px solid ${RISK}B0` : "1px solid rgba(166,139,212,.24)", cursor: "pointer" }}>{children}</button>;
}

function PatternCard({ pattern, onSelect, refCallback }: { pattern: SovereignFailurePattern; onSelect: (id: FailurePatternId) => void; refCallback: (node: HTMLButtonElement | null) => void }) {
  return <button ref={refCallback} type="button" className="failure-index-card" onClick={() => onSelect(pattern.id)} aria-label={`Inspect pattern ${pattern.id}: ${pattern.title}`} style={{ display: "flex", flexDirection: "column", alignItems: "stretch", textAlign: "left", padding: "19px 19px 17px", color: IVORY, background: "linear-gradient(135deg,rgba(21,17,27,.82),rgba(9,12,21,.92))", border: "1px solid rgba(216,108,97,.22)", cursor: "pointer", gap: 12 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", ...mono, color: RISK, fontSize: 11 }}><span>{pattern.id}</span><AlertCircle size={15} strokeWidth={1} aria-hidden /></div>
    <div style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 21, lineHeight: 1.13, fontWeight: 500 }}>{pattern.title}</div>
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10, marginTop: "auto" }}>
      <span style={{ fontFamily: "'EB Garamond',Georgia,serif", color: SECONDARY, lineHeight: 1.32, fontSize: 15 }}>{pattern.shortDescription}</span>
      <ChevronRight size={15} color={RISK} aria-hidden style={{ flexShrink: 0 }} />
    </div>
  </button>;
}

function EmptyResults({ onReset, compact = false }: { onReset: () => void; compact?: boolean }) {
  return <div role="status" style={{ padding: compact ? "18px 6px" : "35px 20px", border: "1px solid rgba(200,169,110,.13)", color: SECONDARY }}>
    <div style={{ ...prose, fontSize: compact ? 16 : 19 }}>No patterns match the current search and filters.</div>
    <button type="button" onClick={onReset} style={{ ...control, marginTop: 14 }}><RotateCcw size={13} aria-hidden /> RESET FILTERS</button>
  </div>;
}

function PatternInspection({ pattern }: { pattern: SovereignFailurePattern }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { titleRef.current?.focus({ preventScroll: true }); }, [pattern.id]);
  return <>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 15, flexWrap: "wrap" }}>
      <div style={{ maxWidth: 780 }}>
        <div style={{ ...mono, color: RISK, marginBottom: 9 }}>PATTERN {pattern.id} · DIAGNOSTIC INSPECTION</div>
        <h2 tabIndex={-1} ref={titleRef} style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: "clamp(27px,2.7vw,38px)", lineHeight: 1.12, fontWeight: 500, margin: "0 0 9px", outlineOffset: 4 }}>{pattern.title}</h2>
        <p style={{ ...prose, color: SECONDARY, margin: 0, fontSize: 17.5 }}>{pattern.shortDescription}</p>
      </div>
      <span style={{ ...mono, color: META, paddingTop: 4 }}>{pattern.id} / 17</span>
    </div>

    <div className="failure-inspection-subcols" style={{ marginTop: 27, marginBottom: 26 }}>
      <NarrativeBlock label="WHAT IT LOOKS LIKE" text={pattern.whatItLooksLike} color={RISK} />
      <NarrativeBlock label="WHY TRUST BREAKS" text={pattern.whyItBreaksTrust} color={GOLD} />
    </div>

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, flexWrap: "wrap", paddingBottom: 11, borderBottom: "1px solid rgba(200,169,110,.15)", marginBottom: 16 }}>
      <h3 style={{ ...mono, fontSize: 11, color: IVORY, margin: 0 }}>FAILURE → REPAIR</h3>
      <span style={{ ...mono, fontSize: 9, color: META }}>ILLUSTRATIVE COMPARISON · NOT VALIDATED USER EVIDENCE</span>
    </div>
    <div className="failure-comparison">
      <ExampleCard mode="failure" example={pattern.failureExample} />
      <ExampleCard mode="repair" example={pattern.repairExample} />
    </div>

    <div style={{ marginTop: 25, padding: "17px 20px", background: "rgba(200,169,110,.04)", borderLeft: `2px solid ${GOLD}`, borderTop: "1px solid rgba(200,169,110,.12)", borderRight: "1px solid rgba(200,169,110,.12)", borderBottom: "1px solid rgba(200,169,110,.12)" }}>
      <div style={{ ...mono, color: GOLD, marginBottom: 8 }}>REPAIR DIRECTION</div>
      <p style={{ ...prose, margin: 0, color: IVORY }}>{pattern.repair}</p>
    </div>
    <div style={{ marginTop: 24, borderTop: "1px solid rgba(200,169,110,.10)", paddingTop: 17 }}>
      <div style={{ ...mono, color: GOLD, marginBottom: 9 }}>HOW WOULD WE VALIDATE THIS REPAIR?</div>
      <p style={{ ...prose, margin: "0 0 8px", color: IVORY }}>{pattern.validationQuestion}</p>
      <p style={{ ...prose, fontSize: 14.5, color: SECONDARY, margin: 0 }}>{FAILURE_FIELD_GUIDANCE}</p>
    </div>
    <RepairReference compact />
    <RelatedReferences pattern={pattern} />
    <BoundaryNote compact />
  </>;
}

function NarrativeBlock({ label, text, color }: { label: string; text: string; color: string }) {
  return <section style={{ padding: "0 3px 0 0" }}>
    <div style={{ ...mono, fontSize: 10, color, marginBottom: 9 }}>{label}</div>
    <p style={{ ...prose, fontSize: 17, color: SECONDARY, margin: 0 }}>{text}</p>
  </section>;
}

function ExampleCard({ mode, example }: { mode: "failure" | "repair"; example: IllustrativeSurface }) {
  const failure = mode === "failure";
  const highlight = failure ? RISK : GOLD;
  return <section aria-label={failure ? "Illustrative failure" : "Illustrative repair"} style={{ minWidth: 0, padding: 17, border: `1px solid ${failure ? "rgba(216,108,97,.35)" : "rgba(200,169,110,.31)"}`, background: failure ? "rgba(40,18,29,.33)" : "rgba(14,17,24,.83)" }}>
    <div style={{ ...mono, color: highlight, fontSize: 10, display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
      {failure ? <AlertCircle size={16} aria-hidden /> : <Check size={16} aria-hidden />}
      {failure ? "FAILURE · BEFORE" : "REPAIR · AFTER"}
    </div>
    <div style={{ minHeight: 176, background: "#080D16", border: `1px solid ${highlight}3D`, padding: "17px 17px 15px" }}>
      <div style={{ ...mono, color: META, fontSize: 9, letterSpacing: ".10em", marginBottom: 17 }}>{example.context}</div>
      <div style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: 23, lineHeight: 1.1, color: IVORY, marginBottom: 12 }}>{example.headline}</div>
      <div style={{ ...prose, fontSize: 16, lineHeight: 1.48, color: SECONDARY }}>{example.message}</div>
    </div>
    <div style={{ marginTop: 15, display: "grid", gap: 8 }}>
      {example.details.map((detail) => <div key={detail} style={{ display: "flex", alignItems: "flex-start", gap: 10, color: SECONDARY, fontFamily: "'EB Garamond',Georgia,serif", fontSize: 15.5, lineHeight: 1.35 }}><span aria-hidden style={{ color: highlight, flexShrink: 0, fontFamily: "'DM Mono',monospace" }}>{failure ? "×" : "·"}</span>{detail}</div>)}
    </div>
  </section>;
}

function RepairReference({ compact = false }: { compact?: boolean }) {
  return <section aria-label="Repair loop" style={{ marginTop: compact ? 28 : 42, borderTop: "1px solid rgba(200,169,110,.15)", paddingTop: 19 }}>
    <div style={{ ...mono, color: GOLD, marginBottom: 14 }}>REPAIR LOOP · WHEN REFLECTION BREAKS</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 8 }}>
      {FAILURE_REPAIR_LOOP.map((step, index) => <div key={step.label} style={{ padding: compact ? "10px 6px" : "14px 10px", border: "1px solid rgba(200,169,110,.15)", background: "rgba(200,169,110,.028)", textAlign: "center" }}>
        <div style={{ ...mono, color: META, fontSize: 9, marginBottom: 6 }}>0{index+1}</div>
        <div style={{ ...mono, color: IVORY, fontSize: 10, marginBottom: 7 }}>{step.label}</div>
        <div style={{ fontFamily: "'EB Garamond',Georgia,serif", color: SECONDARY, fontSize: 14.5 }}>{step.action}</div>
      </div>)}
    </div>
    <p style={{ ...prose, fontSize: 15.5, color: SECONDARY, fontStyle: "italic", margin: "14px 0 0" }}>The fix isn't the feature. The fix is the relationship.</p>
  </section>;
}

function RelatedReferences({ pattern }: { pattern: SovereignFailurePattern }) {
  return <section style={{ marginTop: 28, paddingTop: 17, borderTop: "1px solid rgba(200,169,110,.12)" }}>
    <div style={{ ...mono, color: META, fontSize: 9, marginBottom: 12 }}>RELATED READING · CONTEXTUAL REFERENCES (NOT REQUIRED STEPS)</div>
    <div className="failure-inspection-subcols">
      <div>
        <div style={{ ...mono, color: GOLD, fontSize: 9, marginBottom: 8 }}>PROTOCOLS</div>
        {pattern.relatedProtocolIds.map(id => <div key={id} style={{ ...prose, color: SECONDARY, fontSize: 15, marginBottom: 4 }}>{id} · {PROTOCOL_NAMES[id] ?? "Protocol"}</div>)}
      </div>
      <div>
        <div style={{ ...mono, color: GOLD, fontSize: 9, marginBottom: 8 }}>LAWS</div>
        {pattern.relatedLawIds.map(id => <div key={id} style={{ ...prose, color: SECONDARY, fontSize: 15, marginBottom: 4 }}>{LAW_NAMES[id] ?? id}</div>)}
      </div>
    </div>
  </section>;
}

function BoundaryNote({ compact = false }: { compact?: boolean }) {
  return <aside style={{ marginTop: compact ? 28 : 35, borderTop: "1px solid rgba(200,169,110,.14)", paddingTop: 18, maxWidth: compact ? 850 : 1040 }}>
    <div style={{ ...mono, color: GOLD, marginBottom: 9, fontSize: 10 }}>PROFESSIONAL BOUNDARY</div>
    <p style={{ ...prose, fontSize: 15.5, color: SECONDARY, margin: 0 }}>{FAILURE_PROFESSIONAL_BOUNDARY}</p>
    <div style={{ ...mono, color: META, fontSize: 9, marginTop: 17 }}>RECOGNIZE · REPAIR · VALIDATE</div>
  </aside>;
}

function QuickDiagnostic({ onClose, modalRef }: { onClose: () => void; modalRef: RefObject<HTMLDivElement | null> }) {
  const trapFocus = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const controls = Array.from(modalRef.current?.querySelectorAll<HTMLElement>('button, [tabindex="0"]') ?? []).filter((el) => !el.hasAttribute("disabled"));
    if (!controls.length) return;
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  return <div style={{ position: "absolute", inset: 0, zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", padding: 18, background: "rgba(0,0,0,.80)" }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="failure-quick-check-title" onKeyDown={trapFocus} style={{ width: "min(680px,100%)", maxHeight: "min(780px,92vh)", overflowY: "auto", padding: "26px clamp(18px,4vw,36px) 32px", background: "#0A0D16", border: "1px solid rgba(200,169,110,.32)", boxShadow: "0 25px 95px rgba(0,0,0,.7)" }}>
      <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 15 }}>
        <div>
          <div style={{ ...mono, color: RISK, marginBottom: 8 }}>OPTIONAL TEAM DIAGNOSTIC</div>
          <h2 id="failure-quick-check-title" style={{ fontFamily: "'EB Garamond',Georgia,serif", fontWeight: 500, fontSize: 32, lineHeight: 1.1, margin: "0 0 8px" }}>90-Second Team Check</h2>
          <p style={{ ...prose, color: SECONDARY, margin: 0 }}>Use these questions for discussion, not a score or ship certification.</p>
        </div>
        <button type="button" aria-label="Close quick diagnostic" onClick={onClose} style={{ ...control, minWidth: 44, padding: 8 }}><X size={17} aria-hidden /></button>
      </div>
      <div style={{ marginTop: 26, borderTop: "1px solid rgba(200,169,110,.14)" }}>
        {FAILURE_DIAGNOSTIC_QUESTIONS.map((question, i) => <div key={question} style={{ display: "flex", gap: 16, padding: "13px 0", borderBottom: "1px solid rgba(200,169,110,.10)" }}>
          <span style={{ ...mono, color: RISK, fontSize: 11 }}>{String(i+1).padStart(2,"0")}</span>
          <span style={{ ...prose, color: IVORY, fontSize: 18 }}>{question}</span>
        </div>)}
      </div>
      <p style={{ ...prose, color: SECONDARY, fontStyle: "italic", margin: "22px 0 0" }}>If a material issue remains, don't ship through it. Pause, name the misalignment, and test a repair that restores agency.</p>
      <button type="button" onClick={onClose} style={{ ...control, marginTop: 20 }}>RETURN TO FIELD <ArrowRight size={14} aria-hidden /></button>
    </div>
  </div>;
}
