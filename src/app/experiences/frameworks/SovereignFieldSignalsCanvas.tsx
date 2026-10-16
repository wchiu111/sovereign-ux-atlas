import {
  useCallback, useEffect, useMemo, useRef, useState,
  type CSSProperties, type ReactNode,
} from "react";
import {
  ArrowLeft, ArrowUpRight, BookOpen,
  FileSearch, Info, RotateCcw, Search, ShieldCheck, X,
} from "lucide-react";
import {
  FIELD_SIGNAL_KINDS,
  FIELD_SIGNALS,
  FIELD_SIGNALS_BY_ID,
  FIELD_SIGNALS_INTRO,
  FIELD_SIGNALS_BOUNDARY,
  type FieldSignalId,
  type FieldSignalKind,
  type SovereignFieldSignal,
} from "../../content/frameworks/sovereign-ux-field-signals";
import { STELLAR_PALETTE } from "../../atlas/constellation/stellarPalette";
import { readerSemanticColor } from "../shared/readerSemanticPalette";

type SignalFilter = "all" | FieldSignalKind;
type TraceId = "observe" | "interpret" | "examine" | "revise";
type Phase = "entering" | "open" | "exiting";

interface Props {
  frameworkTitle: string;
  sectionTitle: string;
  onClose: () => void;
}

const BASE = "#05070D";
const STRATEGY = STELLAR_PALETTE.strategy;
const GOLD = readerSemanticColor.utility.primary;
const IVORY = readerSemanticColor.text.primary;
const SECONDARY = readerSemanticColor.text.secondary;
const MUTED = readerSemanticColor.text.metadata;
const BORDER = "rgba(200,180,130,.15)";
const MONO: CSSProperties = { fontFamily: "'DM Mono',monospace", letterSpacing: ".12em" };
const SERIF: CSSProperties = { fontFamily: "'EB Garamond',Georgia,serif" };
const CONTROL: CSSProperties = {
  ...MONO, fontSize: 10, color: SECONDARY, background: "rgba(12,15,23,.85)",
  border: `1px solid ${BORDER}`, minHeight: 42, padding: "9px 13px",
  cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
};
const TRACE_ITEMS: readonly { id: TraceId; title: string; description: string }[] = [
  { id: "observe", title: "Observe", description: "Context and what changed" },
  { id: "interpret", title: "Interpret", description: "Meaning and insight" },
  { id: "examine", title: "Examine", description: "Source and limits" },
  { id: "revise", title: "Revise", description: "What would change the interpretation" },
] as const;

/** An evidence ledger, not a performance dashboard or validation score. */
export default function SovereignFieldSignalsCanvas({ frameworkTitle, sectionTitle, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>("entering");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SignalFilter>("all");
  const [selectedId, setSelectedId] = useState<FieldSignalId | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lastInvokerRef = useRef<HTMLButtonElement | null>(null);
  const listScrollPosition = useRef(0);
  const exitTimer = useRef<number | null>(null);
  const phaseRef = useRef<Phase>("entering");
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      phaseRef.current = "open";
      setPhase("open");
    }, reducedRef.current ? 15 : 230);
    return () => {
      window.clearTimeout(timer);
      if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
    };
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return FIELD_SIGNALS.filter((signal) => {
      if (filter !== "all" && signal.kind !== filter) return false;
      if (!q) return true;
      const searchText = [
        signal.id, signal.title, signal.shortDescription, signal.context ?? "",
        ...signal.whatChanged, signal.whatItSignaled, signal.designInsight,
        signal.sourceDescription, ...signal.keywords,
        FIELD_SIGNAL_KINDS.find((kind) => kind.id === signal.kind)?.label ?? "",
      ].join(" ").toLocaleLowerCase();
      return searchText.includes(q);
    });
  }, [query, filter]);
  const selected = selectedId ? FIELD_SIGNALS_BY_ID[selectedId] : null;

  const requestClose = useCallback(() => {
    if (phaseRef.current === "exiting") return;
    phaseRef.current = "exiting";
    if (reducedRef.current) { onClose(); return; }
    setPhase("exiting");
    exitTimer.current = window.setTimeout(onClose, 210);
  }, [onClose]);

  const selectSignal = useCallback((id: FieldSignalId, invoker?: HTMLButtonElement | null) => {
    if (invoker) lastInvokerRef.current = invoker;
    if (selectedId === null) listScrollPosition.current = listRef.current?.scrollTop ?? 0;
    setSelectedId(id);
    window.requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
      headingRef.current?.focus({ preventScroll: true });
    });
  }, [selectedId]);

  const returnToLedger = useCallback(() => {
    setSelectedId(null);
    window.requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listScrollPosition.current, behavior: "auto" });
      if (lastInvokerRef.current?.isConnected) {
        lastInvokerRef.current.focus({ preventScroll: true });
      } else {
        searchRef.current?.focus({ preventScroll: true });
      }
    });
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      event.preventDefault();
      if (selectedId !== null) returnToLedger();
      else requestClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [requestClose, returnToLedger, selectedId]);

  const resetSearch = () => {
    setQuery("");
    setFilter("all");
    searchRef.current?.focus();
  };
  const traceTo = (id: TraceId) => {
    const target = scrollRef.current?.querySelector<HTMLElement>(`[data-field-trace="${id}"]`);
    if (!target) return;
    target.scrollIntoView({ block: "start", behavior: reducedRef.current ? "auto" : "smooth" });
    target.focus({ preventScroll: true });
  };

  return (
    <div ref={rootRef} data-field-signals-root data-transition-phase={phase}
      role="region" aria-label="Signals in the Field observational archive"
      style={{ position: "absolute", inset: 0, zIndex: 85, color: IVORY, background: BASE,
        display: "flex", flexDirection: "column", overflow: "hidden", opacity: phase === "exiting" ? 0 : 1,
        transition: reducedRef.current ? "none" : "opacity 210ms ease" }}>
      <style>{`
        [data-field-signals-root] *,[data-field-signals-root] *::before,[data-field-signals-root] *::after{box-sizing:border-box}
        [data-field-signals-root] button,[data-field-signals-root] input{font:inherit}
        [data-field-signals-root] button:focus-visible,[data-field-signals-root] input:focus-visible,[data-field-signals-root] [data-field-trace]:focus-visible{outline:2px solid ${GOLD};outline-offset:3px}
        [data-field-signals-root] button{transition:background 180ms ease,border-color 180ms ease,color 180ms ease}
        [data-field-signals-root] button:hover{border-color:rgba(200,169,110,.52)!important}
        [data-field-signals-root] [data-field-row]:hover{background:rgba(244,235,208,.045)!important}
        [data-field-signals-root] [data-field-trace]{scroll-margin-top:22px}
        .field-main{flex:1;min-height:0;overflow:hidden}
        .field-index-scroll{overflow-y:auto;height:100%;padding:34px max(28px,5vw) 44px;scrollbar-color:rgba(200,169,110,.3) transparent}
        .field-ledger{margin:10px auto 0;max-width:1180px;border-top:1px solid ${BORDER}}
        .field-selected{display:grid;grid-template-columns:minmax(270px,320px) minmax(0,1fr);height:100%}
        .field-rail{padding:26px 18px 36px 24px;overflow-y:auto;border-right:1px solid ${BORDER};background:rgba(8,10,17,.72)}
        .field-record{overflow-y:auto;min-width:0;padding:34px clamp(26px,5vw,92px) 70px;scrollbar-color:rgba(200,169,110,.3) transparent}
        .field-record-inner{max-width:940px;margin:0 auto}
        .field-record-columns{display:grid;grid-template-columns:1fr 1fr;gap:22px}
        .field-trace{display:grid;grid-template-columns:repeat(4, minmax(0,1fr));gap:8px}
        .field-header{min-height:62px;display:flex;justify-content:space-between;align-items:center;padding:10px 25px;border-bottom:1px solid ${BORDER};gap:16px;background:rgba(4,6,11,.96)}
        @media (max-width:1060px){.field-selected{grid-template-columns:minmax(220px,260px) minmax(0,1fr)}.field-record{padding:28px 28px 55px}.field-rail{padding:24px 11px}.field-record-columns{grid-template-columns:1fr}.field-trace{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media (max-width:700px){.field-header{padding:9px 14px}.field-index-scroll{padding:24px 17px 45px}.field-selected{display:block;overflow-y:auto}.field-rail{overflow:visible;border-right:0;border-bottom:1px solid ${BORDER};padding:14px 16px}.field-rail-list{display:none!important}.field-record{overflow:visible;padding:24px 18px 60px}.field-record-columns{gap:12px}}
        @media (prefers-reduced-motion:reduce){[data-field-signals-root] button{transition:none!important}}
      `}</style>
      <header className="field-header">
        <div style={{ ...MONO, fontSize: 10, letterSpacing: ".14em", lineHeight: 1.6 }}>
          <span style={{ color: GOLD }}>{frameworkTitle.toUpperCase()}</span>
          <span style={{ color: MUTED }}> / {sectionTitle.toUpperCase()} / </span>
          <span style={{ color: STRATEGY }}>OBSERVATIONAL EVIDENCE</span>
        </div>
        <button type="button" onClick={requestClose} style={CONTROL} aria-label="Close field signals and return to framework">
          BACK TO FRAMEWORK <X size={15} aria-hidden />
        </button>
      </header>

      <div className="field-main" id="field-main-content">
        {!selected ? (
          <div className="field-index-scroll" ref={listRef}>
            <div style={{ maxWidth: 1180, margin: "0 auto" }}>
              <div style={{ ...MONO, color: GOLD, fontSize: 10, marginBottom: 14 }}>FIELD OBSERVATIONS · 11 SIGNALS</div>
              <h1 style={{ ...SERIF, fontSize: "clamp(36px,4.8vw,60px)", fontWeight: 400, lineHeight: 1.05, margin: "0 0 17px", letterSpacing: "-.025em" }}>Signals in the Field</h1>
              <p style={{ ...SERIF, fontSize: "clamp(18px,1.7vw,23px)", lineHeight: 1.43, color: SECONDARY, maxWidth: 770, margin: "0 0 28px" }}>{FIELD_SIGNALS_INTRO}</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "stretch", marginBottom: 20 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, border: `1px solid ${BORDER}`, background: "rgba(13,16,24,.8)", minHeight: 44, padding: "0 12px", flex: "1 1 270px", maxWidth: 480 }}>
                  <Search size={16} color={SECONDARY} aria-hidden />
                  <input ref={searchRef} aria-label="Search field signals" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search observations or contexts..."
                    style={{ color: IVORY, background: "transparent", outline: 0, border: 0, minHeight: 42, fontFamily: "'DM Mono',monospace", fontSize: 11, flex: 1, minWidth: 0, letterSpacing: 0 }} />
                </label>
                <span aria-live="polite" style={{ ...MONO, fontSize: 10, color: MUTED, display: "inline-flex", alignItems: "center", padding: "0 9px" }}>{results.length} / {FIELD_SIGNALS.length} OBSERVATIONS</span>
              </div>
              <div role="group" aria-label="Filter by source type" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 21 }}>
                <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>ALL 11</FilterButton>
                {FIELD_SIGNAL_KINDS.map((kind) => <FilterButton key={kind.id} active={filter === kind.id} onClick={() => setFilter(kind.id)}>{kind.label.toUpperCase()}</FilterButton>)}
              </div>
              <div className="field-ledger" aria-label="Field observations index">
                {results.map((signal) => <LedgerRow key={signal.id} signal={signal} onSelect={(button) => selectSignal(signal.id, button)} />)}
                {results.length === 0 && <div style={{ padding: "46px 10px", color: SECONDARY }}>
                  <h2 style={{ ...SERIF, fontSize: 27, fontWeight: 400, margin: "0 0 8px" }}>No matching observations</h2>
                  <p style={{ ...SERIF, fontSize: 17, marginBottom: 17 }}>Try a different search, or restore the full ledger.</p>
                  <button type="button" style={CONTROL} onClick={resetSearch}><RotateCcw size={14} aria-hidden /> RESET SEARCH & FILTERS</button>
                </div>}
              </div>
              <div style={{ paddingTop: 35, maxWidth: 860 }}><BoundaryNote /></div>
            </div>
          </div>
        ) : (
          <div className="field-selected">
            <nav className="field-rail" aria-label="Field signal navigation">
              <button type="button" style={{ ...CONTROL, width: "100%", justifyContent: "flex-start", marginBottom: 14 }} onClick={returnToLedger}><ArrowLeft size={15} aria-hidden /> ALL OBSERVATIONS</button>
              <div className="field-rail-list" style={{ display: "grid", gap: 5 }}>
                <div style={{ ...MONO, fontSize: 10, color: MUTED, margin: "12px 0 9px" }}>{results.length} IN CURRENT SEARCH</div>
                {results.map((signal) => <button key={signal.id} type="button" aria-current={signal.id === selectedId ? "true" : undefined}
                  onClick={() => selectSignal(signal.id)}
                  style={{ display: "flex", alignItems: "flex-start", gap: 10, background: selectedId === signal.id ? "rgba(244,235,208,.075)" : "transparent",
                    border: selectedId === signal.id ? "1px solid rgba(244,235,208,.32)" : "1px solid transparent", color: selectedId === signal.id ? IVORY : SECONDARY,
                    padding: "12px 9px", cursor: "pointer", textAlign: "left", fontSize: 15, lineHeight: 1.22, fontFamily: "'EB Garamond',Georgia,serif" }}>
                  <span style={{ ...MONO, fontSize: 10, minWidth: 22, paddingTop: 2, color: selectedId === signal.id ? GOLD : MUTED }}>{signal.id}</span>{signal.title}
                </button>)}
              </div>
              <div style={{ ...MONO, fontSize: 10, color: MUTED, marginTop: 22 }}>
                {FIELD_SIGNAL_KINDS.find((kind) => kind.id === selected.kind)?.label.toUpperCase()}<br />NOT A VALIDATION SCORE
              </div>
            </nav>
            <div className="field-record" ref={scrollRef}>
              <div className="field-record-inner">
                <p style={{ ...MONO, fontSize: 10, color: GOLD, margin: "0 0 12px" }}>FIELD NOTE {selected.id} OF 11 · OBSERVATION RECORD</p>
                <h1 ref={headingRef} tabIndex={-1} style={{ ...SERIF, fontWeight: 400, letterSpacing: "-.02em", fontSize: "clamp(34px,4vw,53px)", lineHeight: 1.08, margin: "0 0 16px" }}>{selected.title}</h1>
                <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap", marginBottom: 15 }}>
                  <span style={{ ...MONO, fontSize: 10, color: STRATEGY, border: `1px solid ${BORDER}`, padding: "8px 10px" }}>
                    {FIELD_SIGNAL_KINDS.find((kind) => kind.id === selected.kind)?.label.toUpperCase()}
                  </span>
                  <span style={{ ...MONO, fontSize: 10, color: MUTED }}>SOURCE ARTIFACT NOT ATTACHED</span>
                </div>
                <p style={{ ...SERIF, fontSize: 19, lineHeight: 1.52, color: SECONDARY, margin: "0 0 25px" }}>{selected.shortDescription}</p>
                <div style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "15px 0", marginBottom: 26 }}>
                  <div style={{ ...MONO, color: MUTED, fontSize: 10, marginBottom: 10 }}>EVIDENCE TRACE · JUMP TO</div>
                  <div className="field-trace" aria-label="Evidence trace navigation">
                    {TRACE_ITEMS.map((item, idx) => <button key={item.id} type="button" style={{ ...CONTROL, width: "100%", padding: "11px 6px", minHeight: 44, fontSize: 10, flexWrap: "wrap", textAlign: "center" }} onClick={() => traceTo(item.id)}
                      title={item.description}>{`0${idx + 1} ${item.title.toUpperCase()}`}</button>)}
                  </div>
                  <p style={{ ...SERIF, color: MUTED, fontSize: 15, margin: "11px 0 0", lineHeight: 1.4 }}>A reading path through an interpretation, not a required sequence or proof of revision.</p>
                </div>
                <ObservationRecord signal={selected} />
                <div style={{ marginTop: 36 }}><BoundaryNote /></div>
                <button type="button" style={{ ...CONTROL, marginTop: 24 }} onClick={returnToLedger}><ArrowLeft size={14} aria-hidden /> RETURN TO SIGNAL LEDGER</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return <button type="button" aria-pressed={active} onClick={onClick}
    style={{ ...MONO, fontSize: 10, minHeight: 40, padding: "8px 12px", cursor: "pointer",
      color: active ? IVORY : SECONDARY, border: active ? `1px solid ${GOLD}` : `1px solid ${BORDER}`,
      background: active ? "rgba(197,169,110,.14)" : "rgba(13,15,23,.6)" }}>{children}</button>;
}

function LedgerRow({ signal, onSelect }: { signal: SovereignFieldSignal; onSelect: (button: HTMLButtonElement) => void }) {
  const kind = FIELD_SIGNAL_KINDS.find((item) => item.id === signal.kind);
  return <button data-field-row type="button" aria-label={`Read observation ${signal.id}: ${signal.title}`}
    onClick={(event) => onSelect(event.currentTarget)}
    style={{ width: "100%", display: "grid", gridTemplateColumns: "46px minmax(0,1fr) 22px", alignItems: "center", gap: 15,
      border: 0, borderBottom: `1px solid ${BORDER}`, padding: "20px 8px 19px", background: "transparent", cursor: "pointer", color: IVORY, textAlign: "left" }}>
    <span style={{ ...MONO, color: GOLD, fontSize: 12, alignSelf: "start", paddingTop: 5 }}>{signal.id}</span>
    <span style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <span style={{ ...SERIF, fontSize: "clamp(21px,2vw,26px)", lineHeight: 1.15 }}>{signal.title}</span>
      <span style={{ ...SERIF, fontSize: 16, lineHeight: 1.35, color: SECONDARY }}>{signal.shortDescription}</span>
      <span style={{ ...MONO, color: MUTED, fontSize: 9, letterSpacing: ".12em" }}>{kind?.label.toUpperCase()} · SOURCE NOT ATTACHED</span>
    </span>
    <ArrowUpRight size={17} color={GOLD} aria-hidden />
  </button>;
}

function RecordSection({ id, number, title, children }: { id: TraceId; number: string; title: string; children: ReactNode }) {
  return <section data-field-trace={id} tabIndex={-1} aria-labelledby={`field-section-${id}`}
    style={{ borderTop: `1px solid ${BORDER}`, padding: "31px 0 34px", outlineOffset: 5 }}>
    <h2 id={`field-section-${id}`} style={{ ...MONO, color: GOLD, fontSize: 11, fontWeight: 400, margin: "0 0 20px" }}>{number} · {title.toUpperCase()}</h2>
    {children}
  </section>;
}

function ObservationRecord({ signal }: { signal: SovereignFieldSignal }) {
  return <div>
    <RecordSection id="observe" number="01" title="Context & observation">
      {signal.context ? <TextBlock label="CONTEXT">{signal.context}</TextBlock> : <TextBlock label="CONTEXT NOT SUPPLIED">The original entry does not name a specific context. The source must be identified before this can be treated as a documented field observation.</TextBlock>}
      <div style={{ marginTop: 25 }}>
        <div style={{ ...MONO, color: MUTED, fontSize: 10, marginBottom: 12 }}>WHAT CHANGED · AUTHOR'S ACCOUNT</div>
        {signal.whatChanged.map((item, i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "20px minmax(0,1fr)", gap: 9, margin: "10px 0", alignItems: "start" }}>
          <span style={{ color: GOLD, fontSize: 16 }}>—</span>
          <p style={{ ...SERIF, color: SECONDARY, fontSize: 19, lineHeight: 1.45, margin: 0 }}>{item}</p>
        </div>)}
      </div>
    </RecordSection>
    <RecordSection id="interpret" number="02" title="Interpretation & insight">
      <TextBlock label="WHAT IT SIGNALED">{signal.whatItSignaled}</TextBlock>
      <div style={{ borderLeft: `2px solid ${GOLD}`, padding: "17px 22px", background: "rgba(197,169,110,.065)", marginTop: 23 }}>
        <div style={{ ...MONO, color: GOLD, fontSize: 10, marginBottom: 11 }}>DESIGN INSIGHT · AUTHOR'S INTERPRETATION</div>
        <p style={{ ...SERIF, color: IVORY, fontSize: "clamp(23px,2.4vw,29px)", lineHeight: 1.34, margin: 0 }}>{signal.designInsight}</p>
      </div>
    </RecordSection>
    <RecordSection id="examine" number="03" title="Source & evidence boundary">
      <div className="field-record-columns">
        <div style={{ border: `1px solid ${BORDER}`, background: "rgba(13,17,24,.58)", padding: "23px 22px" }}>
          <div style={{ ...MONO, fontSize: 10, color: MUTED, marginBottom: 12, display: "flex", alignItems: "center", gap: 7 }}><FileSearch size={14} aria-hidden /> SOURCE RECORD</div>
          <p style={{ ...SERIF, fontSize: 18, lineHeight: 1.46, color: SECONDARY, margin: "0 0 18px" }}>{signal.sourceDescription}</p>
          <div style={{ ...MONO, color: GOLD, fontSize: 10, lineHeight: 1.65 }}>SOURCE STATUS: {signal.sourceStatus === "source-not-attached" ? "NOT ATTACHED" : "ATTACHED"}</div>
        </div>
        <div style={{ border: `1px solid ${BORDER}`, background: "rgba(13,17,24,.58)", padding: "23px 22px" }}>
          <div style={{ ...MONO, color: MUTED, fontSize: 10, display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}><ShieldCheck size={14} aria-hidden /> EVIDENCE BOUNDARY</div>
          <p style={{ ...SERIF, fontSize: 18, lineHeight: 1.46, color: SECONDARY, margin: 0 }}>{signal.evidenceBoundary}</p>
        </div>
      </div>
      <div style={{ marginTop: 22 }}>
        <div style={{ ...MONO, color: MUTED, fontSize: 10, marginBottom: 9 }}>RELATED ATLAS WORK · CONTEXT, NOT PROOF</div>
        {signal.relatedWork.length === 0 ? (
          <p style={{ ...SERIF, fontSize: 17, color: SECONDARY, lineHeight: 1.4, margin: 0 }}>No verified matching source or related Atlas entry is linked for this record.</p>
        ) : signal.relatedWork.map((item) => <div key={item.entryId} style={{ display: "grid", gridTemplateColumns: "22px minmax(0,1fr)", gap: 10, margin: "13px 0", padding: "13px 14px", border: `1px solid ${BORDER}` }}>
          <BookOpen size={17} color={GOLD} aria-hidden />
          <div><div style={{ ...SERIF, color: IVORY, fontSize: 19 }}>{item.title}</div><div style={{ ...SERIF, fontSize: 15, lineHeight: 1.4, color: SECONDARY, marginTop: 5 }}>{item.relationship}</div></div>
        </div>)}
      </div>
      <p style={{ ...SERIF, color: MUTED, fontSize: 15, lineHeight: 1.4, marginTop: 18 }}>Related work is identified by its registered Atlas entry. It is intentionally not a source link or validation claim; attach a direct source only after verifying the artifact and destination.</p>
    </RecordSection>
    <RecordSection id="revise" number="04" title="What could change this interpretation?">
      <div style={{ display: "grid", gridTemplateColumns: "21px minmax(0,1fr)", gap: 11, alignItems: "start" }}>
        <Info size={18} color={GOLD} aria-hidden style={{ marginTop: 4 }}/>
        <p style={{ ...SERIF, fontSize: 20, lineHeight: 1.5, color: SECONDARY, margin: 0 }}>{signal.furtherValidation}</p>
      </div>
      <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 18, marginTop: 26 }}>
        <div style={{ ...MONO, fontSize: 10, color: MUTED, marginBottom: 12 }}>RELATIONSHIP TO THE LIVING CANON</div>
        <p style={{ ...SERIF, fontSize: 17, lineHeight: 1.5, color: SECONDARY, margin: 0 }}>An observation can inform a later revision only after its evidence and limitations are examined. This record does not promote itself into precedent.</p>
      </div>
    </RecordSection>
  </div>;
}

function TextBlock({ label, children }: { label: string; children: ReactNode }) {
  return <div>
    <div style={{ ...MONO, color: MUTED, fontSize: 10, marginBottom: 9 }}>{label}</div>
    <p style={{ ...SERIF, color: SECONDARY, fontSize: 19, lineHeight: 1.53, margin: 0 }}>{children}</p>
  </div>;
}

function BoundaryNote() {
  return <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
    <div style={{ ...MONO, color: GOLD, fontSize: 10, display: "flex", alignItems: "center", gap: 8, marginBottom: 11 }}><ShieldCheck size={15} aria-hidden /> EVIDENCE INTEGRITY</div>
    <p style={{ ...SERIF, fontSize: 16, lineHeight: 1.48, color: SECONDARY, margin: 0 }}>{FIELD_SIGNALS_BOUNDARY}</p>
    <div style={{ ...MONO, fontSize: 9, color: MUTED, letterSpacing: ".2em", marginTop: 22 }}>OBSERVE CAREFULLY · INTERPRET PROVISIONALLY · PRESERVE AGENCY</div>
  </div>;
}
