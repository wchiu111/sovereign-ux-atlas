import {
  useCallback, useEffect, useMemo, useRef, useState,
  type ChangeEvent, type CSSProperties, type ReactNode, type RefObject,
} from "react";
import { ArrowRight, ChevronRight, Search, ShieldCheck, X } from "lucide-react";
import {
  PROTOCOL_SITUATIONS, SOVEREIGN_PROTOCOLS, SOVEREIGN_PROTOCOLS_BY_ID,
  SOVEREIGN_PROTOCOLS_PROFESSIONAL_BOUNDARY, SOVEREIGN_PROTOCOLS_USAGE_NOTE,
  type ProtocolSituationId, type SovereignProtocol, type SovereignProtocolId,
} from "../../content/frameworks/sovereign-ux-protocols";
import { STELLAR_PALETTE } from "../../atlas/constellation/stellarPalette";
import { readerSemanticColor } from "../shared/readerSemanticPalette";

interface Props { frameworkTitle: string; sectionTitle: string; onClose: () => void }
type SituationFilter = "all" | ProtocolSituationId;
type Phase = "entering" | "open" | "exiting";

const RELATIONAL = STELLAR_PALETTE.relational;
const GOLD = readerSemanticColor.utility.primary;
const IVORY = readerSemanticColor.text.primary;
const SECONDARY = readerSemanticColor.text.secondary;
const META = readerSemanticColor.text.metadata;
const mono: CSSProperties = { fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.15em" };
const prose: CSSProperties = { fontFamily: "'EB Garamond',Georgia,serif", fontSize: 17, lineHeight: 1.65, color: SECONDARY };
const smallButton: CSSProperties = { ...mono, color: GOLD, background: "rgba(200,169,110,.045)", border: "1px solid rgba(200,169,110,.31)", padding: "10px 12px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, fontSize: 9 };

/** A situational reference. The protocol numbers are identifiers, never process stages. */
export default function SovereignProtocolsCanvas({ frameworkTitle, sectionTitle, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>("entering");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SituationFilter>("all");
  const [selectedId, setSelectedId] = useState<SovereignProtocolId | null>(null);
  const [compact, setCompact] = useState(false);
  const phaseRef = useRef<Phase>("entering");
  const selectedRef = useRef<SovereignProtocolId | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef(new Map<SovereignProtocolId, HTMLButtonElement>());
  const exitTimer = useRef<number | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    const timer = window.setTimeout(() => { phaseRef.current = "open"; setPhase("open"); }, reduced ? 20 : 350);
    return () => { window.clearTimeout(timer); if (exitTimer.current !== null) window.clearTimeout(exitTimer.current); };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width:1020px)");
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const results = useMemo(() => SOVEREIGN_PROTOCOLS.filter((protocol) => {
    if (filter !== "all" && !protocol.situations.includes(filter)) return false;
    if (!query.trim()) return true;
    const matching = [protocol.id, protocol.title, protocol.shortDescription,
      protocol.meaning, protocol.whyItMatters, ...protocol.inPractice,
      ...protocol.situations.map((id) => PROTOCOL_SITUATIONS.find((s) => s.id === id)?.label ?? id),
    ].join(" ").toLocaleLowerCase();
    return matching.includes(query.trim().toLocaleLowerCase());
  }), [query, filter]);

  const requestClose = useCallback(() => {
    if (phaseRef.current === "exiting") return;
    phaseRef.current = "exiting";
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) { onClose(); return; }
    setPhase("exiting");
    exitTimer.current = window.setTimeout(onClose, 260);
  }, [onClose]);

  const openProtocol = useCallback((id: SovereignProtocolId) => {
    selectedRef.current = id;
    setSelectedId(id);
    panelRef.current?.scrollTo({ top: 0, behavior: "instant" });
    window.requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
  }, []);

  const closePanel = useCallback(() => {
    const id = selectedRef.current;
    selectedRef.current = null;
    setSelectedId(null);
    window.requestAnimationFrame(() => {
      const source = id ? cardsRef.current.get(id) : null;
      if (source?.isConnected) source.focus();
      else searchRef.current?.focus();
    });
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      // On narrow viewports, the detail panel covers the index and becomes
      // modal for keyboard users. Desktop retains nonmodal side-by-side access.
      if (event.key === "Tab" && compact && selectedRef.current && panelRef.current) {
        const focusable = Array.from(panelRef.current.querySelectorAll<HTMLButtonElement>("button:not([disabled])"));
        if (focusable.length) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          const active = document.activeElement;
          if (!panelRef.current.contains(active)) {
            event.preventDefault();
            first.focus();
          } else if (event.shiftKey && (active === first || active === headingRef.current)) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && active === last) {
            event.preventDefault();
            first.focus();
          }
        }
        return;
      }
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      if (selectedRef.current) closePanel();
      else requestClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closePanel, compact, requestClose]);

  const selected = selectedId ? SOVEREIGN_PROTOCOLS_BY_ID[selectedId] : null;
  const clearFilters = () => { setQuery(""); setFilter("all"); searchRef.current?.focus(); };

  return (
    <div data-protocols-root data-phase={phase} data-selected={selected ? "true" : "false"} style={{
      position: "absolute", inset: 0, zIndex: 80, color: IVORY, overflow: "hidden",
      background: "radial-gradient(ellipse at 65% 14%,rgba(85,65,119,.11),transparent 43%),radial-gradient(ellipse at 13% 81%,rgba(38,72,88,.11),transparent 48%),#05070E",
    }}>
      <style>{`
        @keyframes spEnter{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}
        @keyframes spExit{from{opacity:1}to{opacity:0}}
        @keyframes spPanel{from{opacity:0;transform:translateX(15px)}to{opacity:1;transform:none}}
        [data-protocols-root][data-phase="entering"]{animation:spEnter 340ms cubic-bezier(.16,1,.3,1) both}
        [data-protocols-root][data-phase="exiting"]{animation:spExit 260ms ease both;pointer-events:none}
        [data-protocols-root] button:focus-visible,[data-protocols-root] input:focus-visible{outline:2px solid ${IVORY};outline-offset:3px}
        [data-protocols-root] .sp-field{height:100%;overflow-y:auto;scrollbar-width:thin;scrollbar-color:#353040 transparent}
        [data-protocols-root] .sp-inner{max-width:1520px;box-sizing:border-box;margin:auto;padding:24px 36px 50px;transition:padding-right 220ms ease}
        [data-protocols-root][data-selected="true"] .sp-inner{padding-right:472px}
        [data-protocols-root] .sp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(243px,1fr));gap:12px}
        [data-protocols-root] .sp-card{transition:border-color 220ms ease,background 220ms ease,transform 220ms ease}
        [data-protocols-root] .sp-card:hover{border-color:rgba(166,139,212,.60)!important;background:rgba(31,27,47,.82)!important;transform:translateY(-2px)}
        [data-protocols-root] .sp-detail{position:absolute;right:0;top:0;bottom:0;width:430px;box-sizing:border-box;overflow-y:auto;scrollbar-width:thin;scrollbar-color:#353040 transparent;z-index:15;background:linear-gradient(180deg,#0C0D18,#080912);border-left:1px solid rgba(166,139,212,.24);box-shadow:-20px 0 42px rgba(0,0,0,.38);animation:spPanel 250ms cubic-bezier(.16,1,.3,1) both}
        [data-protocols-root] .sp-backdrop{display:none}
        @media(max-width:1020px){
          [data-protocols-root][data-selected="true"] .sp-inner{padding-right:36px}
          [data-protocols-root] .sp-detail{width:min(470px,100%)}
          [data-protocols-root] .sp-backdrop{display:block;position:absolute;inset:0;z-index:14;background:rgba(2,4,8,.60);border:0;cursor:pointer}
        }
        @media(max-width:680px){
          [data-protocols-root] .sp-inner{padding:20px 18px 38px!important}
          [data-protocols-root] .sp-grid{grid-template-columns:1fr}
          [data-protocols-root] .sp-detail{width:100%}
        }
        @media(prefers-reduced-motion:reduce){
          [data-protocols-root],[data-protocols-root] .sp-detail{animation:none!important}
          [data-protocols-root] .sp-card{transition:none!important}
          [data-protocols-root] .sp-card:hover{transform:none}
        }
      `}</style>

      <main className="sp-field"><div className="sp-inner">
        <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 22, borderBottom: "1px solid rgba(200,180,130,.12)", paddingBottom: 22 }}>
          <div>
            <div style={{ ...mono, color: RELATIONAL, fontSize: 9.5, marginBottom: 11 }}>{frameworkTitle.toUpperCase()} · {sectionTitle.toUpperCase()}</div>
            <h1 style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: "clamp(30px,3.2vw,44px)", fontWeight: 400, lineHeight: 1.08, margin: 0 }}>Protocols for Presence</h1>
            <p style={{ ...prose, fontSize: 16, maxWidth: 670, margin: "9px 0 0" }}>Practical responses for complex moments. Choose the practice the situation calls for, not a sequence to complete.</p>
          </div>
          <button type="button" onClick={requestClose} aria-label="Back to Framework" style={{ ...smallButton, flexShrink: 0 }}>BACK TO FRAMEWORK <X size={13} aria-hidden /></button>
        </header>

        <section aria-label="Find protocols" style={{ paddingTop: 27, paddingBottom: 22 }}>
          <h2 style={{ fontFamily: "'EB Garamond',serif", fontSize: 24, fontWeight: 400, margin: "0 0 4px" }}>What are you observing?</h2>
          <p style={{ ...prose, fontSize: 15, color: META, margin: "0 0 17px" }}>Explore a situation or select any protocol directly.</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, maxWidth: 700, padding: "0 13px", minHeight: 46, background: "rgba(9,11,20,.78)", border: "1px solid rgba(166,139,212,.34)" }}>
            <Search size={16} color={SECONDARY} aria-hidden />
            <label htmlFor="sp-search" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" }}>Search protocols and situations</label>
            <input ref={searchRef} id="sp-search" type="search" value={query} onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)} placeholder="Search protocols, situations, actions…" style={{ flex: 1, minWidth: 0, padding: "13px 0", border: 0, background: "transparent", color: IVORY, fontFamily: "'DM Mono',monospace", fontSize: 12 }} />
            {query && <button type="button" onClick={() => { setQuery(""); searchRef.current?.focus(); }} aria-label="Clear search" style={{ border: 0, background: "none", color: SECONDARY, cursor: "pointer" }}><X size={15} /></button>}
          </div>
          <div role="group" aria-label="Situational filters" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 13 }}>
            <FilterPill label="ALL 12" active={filter === "all"} onClick={() => setFilter("all")} />
            {PROTOCOL_SITUATIONS.map((s) => <FilterPill key={s.id} label={s.label} active={filter === s.id} onClick={() => setFilter(s.id)} />)}
          </div>
        </section>

        <section aria-label="Protocol index">
          <div style={{ ...mono, color: META, fontSize: 9, display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 12 }}><span>PROTOCOL INDEX</span><span role="status" aria-live="polite">{results.length} {results.length === 1 ? "MATCH" : "MATCHES"}</span></div>
          {results.length ? (
            <div className="sp-grid">{results.map((p) => (
              <ProtocolCard key={p.id} protocol={p} selected={selectedId === p.id} onSelect={() => openProtocol(p.id)} register={(node) => { if (node) cardsRef.current.set(p.id, node); else cardsRef.current.delete(p.id); }} />
            ))}</div>
          ) : (
            <div role="status" style={{ padding: 28, border: "1px solid rgba(166,139,212,.28)", background: "rgba(166,139,212,.035)" }}>
              <h3 style={{ fontFamily: "'EB Garamond',serif", fontSize: 23, fontWeight: 400, margin: 0 }}>No matching protocols</h3>
              <p style={{ ...prose, margin: "10px 0 18px" }}>Try a broader term or clear the active situation filter.</p>
              <button type="button" onClick={clearFilters} style={smallButton}>CLEAR SEARCH & FILTERS <ArrowRight size={13} aria-hidden /></button>
            </div>
          )}
        </section>

        <aside aria-label="Professional boundary" style={{ maxWidth: 950, marginTop: 38, paddingTop: 23, borderTop: "1px solid rgba(200,169,110,.19)" }}>
          <div style={{ ...mono, color: GOLD, fontSize: 9, display: "flex", alignItems: "center", gap: 10 }}><ShieldCheck size={16} aria-hidden /> PROFESSIONAL BOUNDARY</div>
          <p style={{ ...prose, margin: "10px 0", fontSize: 15.5 }}>{SOVEREIGN_PROTOCOLS_PROFESSIONAL_BOUNDARY}</p>
          <p style={{ ...mono, fontSize: 9, lineHeight: 1.75, color: META, letterSpacing: "0.06em", margin: 0 }}>{SOVEREIGN_PROTOCOLS_USAGE_NOTE}</p>
        </aside>
      </div></main>

      {selected && <>
        <button type="button" className="sp-backdrop" aria-label="Close protocol details" onClick={closePanel} />
        <ProtocolDetail protocol={selected} onClose={closePanel} onRelated={openProtocol} panelRef={panelRef} headingRef={headingRef} modal={compact} />
      </>}
    </div>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button type="button" aria-pressed={active} onClick={onClick} style={{ ...mono, fontSize: 9, letterSpacing: "0.09em", minHeight: 37, padding: "0 12px", cursor: "pointer", textTransform: "uppercase", border: active ? `1px solid ${RELATIONAL}` : "1px solid rgba(166,139,212,.25)", color: active ? IVORY : SECONDARY, background: active ? "rgba(166,139,212,.24)" : "rgba(8,10,18,.55)" }}>{label}</button>;
}

function ProtocolCard({ protocol, selected, onSelect, register }: {
  protocol: SovereignProtocol; selected: boolean; onSelect: () => void;
  register: (node: HTMLButtonElement | null) => void;
}) {
  return <button type="button" ref={register} className="sp-card" aria-pressed={selected} aria-label={`Protocol ${protocol.id}: ${protocol.title}`} onClick={onSelect} style={{
    minHeight: 166, width: "100%", textAlign: "left", cursor: "pointer", position: "relative", display: "flex", flexDirection: "column", padding: "19px 19px 18px", color: IVORY,
    background: selected ? "rgba(166,139,212,.13)" : "rgba(12,15,25,.75)", border: selected ? `1px solid ${RELATIONAL}` : "1px solid rgba(166,139,212,.18)",
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <span style={{ ...mono, color: RELATIONAL, fontSize: 10 }}>{protocol.id}</span>
      <span aria-hidden style={{ width: 19, height: 19, border: "1px solid rgba(166,139,212,.43)", borderRadius: "50%", color: RELATIONAL, display: "grid", placeItems: "center" }}>·</span>
    </div>
    <div style={{ fontFamily: "'EB Garamond',serif", fontSize: 21, lineHeight: 1.15, fontWeight: 400, marginBottom: 11 }}>{protocol.title}</div>
    <div style={{ ...prose, fontSize: 14.5, lineHeight: 1.3, paddingRight: 12, marginTop: "auto" }}>{protocol.shortDescription}</div>
    <span aria-hidden style={{ position: "absolute", right: 12, bottom: 14, color: RELATIONAL }}><ChevronRight size={13} /></span>
  </button>;
}

function DetailSection({ label, children }: { label: string; children: ReactNode }) {
  return <section style={{ borderTop: "1px solid rgba(166,139,212,.15)", padding: "20px 0" }}>
    <h3 style={{ ...mono, fontSize: 9, color: RELATIONAL, fontWeight: 400, margin: "0 0 11px" }}>{label}</h3>
    <div style={{ ...prose, fontSize: 16.5 }}>{children}</div>
  </section>;
}

function ProtocolDetail({ protocol, onClose, onRelated, panelRef, headingRef, modal }: {
  protocol: SovereignProtocol; onClose: () => void; onRelated: (id: SovereignProtocolId) => void;
  panelRef: RefObject<HTMLElement | null>; headingRef: RefObject<HTMLHeadingElement | null>; modal: boolean;
}) {
  return <aside ref={panelRef} className="sp-detail" role="dialog" aria-modal={modal} aria-labelledby="sp-detail-title">
    <div style={{ position: "sticky", top: 0, background: "#0B0C16", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "19px 24px", borderBottom: "1px solid rgba(166,139,212,.18)" }}>
      <div style={{ ...mono, color: RELATIONAL, fontSize: 9 }}>SELECTED PROTOCOL · {protocol.id} OF 12</div>
      <button type="button" aria-label="Close protocol details" onClick={onClose} style={{ color: SECONDARY, background: "rgba(255,255,255,.02)", border: "1px solid rgba(200,180,130,.26)", height: 34, width: 34, cursor: "pointer", display: "grid", placeItems: "center" }}><X size={14} aria-hidden /></button>
    </div>
    <div style={{ padding: "26px 25px 42px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 17, marginBottom: 20 }}>
        <div aria-hidden style={{ flexShrink: 0, width: 57, height: 57, borderRadius: "50%", border: `1px solid ${RELATIONAL}`, background: "radial-gradient(circle,rgba(166,139,212,.20),transparent 74%)", display: "grid", placeItems: "center", color: RELATIONAL, fontFamily: "'DM Mono',monospace" }}>{protocol.id}</div>
        <div>
          <h2 id="sp-detail-title" ref={headingRef} tabIndex={-1} style={{ color: IVORY, outline: "none", fontWeight: 400, lineHeight: 1.07, fontFamily: "'EB Garamond',serif", fontSize: 30, margin: 0 }}>{protocol.title}</h2>
          <div style={{ ...mono, color: RELATIONAL, marginTop: 9, fontSize: 8.5 }}>SITUATIONAL PRACTICE · NOT A SCRIPT</div>
        </div>
      </div>
      <p style={{ ...prose, fontStyle: "italic", fontSize: 16, paddingLeft: 14, borderLeft: `2px solid ${RELATIONAL}`, margin: "0 0 22px" }}>{protocol.shortDescription}</p>
      <DetailSection label="WHAT IT MEANS">{protocol.meaning}</DetailSection>
      <DetailSection label="IN PRACTICE">
        <div style={{ display: "grid", gap: 8 }}>{protocol.inPractice.map((example, i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "10px 1fr", gap: 9, padding: "11px 13px", background: "rgba(166,139,212,.04)", border: "1px solid rgba(166,139,212,.14)" }}>
          <span style={{ color: RELATIONAL }} aria-hidden>·</span><span style={{ ...prose, fontSize: 15.5 }}>{example}</span>
        </div>)}</div>
      </DetailSection>
      <DetailSection label="WHY IT MATTERS">{protocol.whyItMatters}</DetailSection>
      <div style={{ marginBottom: 27, padding: "16px 17px", background: "rgba(200,169,110,.035)", border: "1px solid rgba(200,169,110,.27)" }}>
        <div style={{ ...mono, color: GOLD, display: "flex", alignItems: "center", gap: 10, marginBottom: 12, fontSize: 9 }}><ShieldCheck size={15} aria-hidden /> CONTEXTUAL BOUNDARY</div>
        <div style={{ ...prose, fontSize: 15.5 }}>{protocol.boundary}</div>
      </div>
      <div style={{ borderTop: "1px solid rgba(166,139,212,.18)", paddingTop: 21 }}>
        <div style={{ ...mono, color: RELATIONAL, fontSize: 9 }}>RELATED PRACTICES</div>
        <p style={{ ...prose, color: META, fontSize: 14, margin: "7px 0 15px" }}>Optional connections, not required next steps.</p>
        <div style={{ display: "grid", gap: 7 }}>{protocol.relatedIds.map((id) => {
          const related = SOVEREIGN_PROTOCOLS_BY_ID[id];
          return <button key={id} type="button" aria-label={`Inspect protocol ${id}: ${related.title}`} onClick={() => onRelated(id)} style={{ display: "grid", gridTemplateColumns: "28px 1fr 16px", alignItems: "center", textAlign: "left", gap: 12, cursor: "pointer", color: IVORY, background: "rgba(166,139,212,.035)", border: "1px solid rgba(166,139,212,.18)", padding: "12px 11px" }}>
            <span style={{ ...mono, color: RELATIONAL }}>{id}</span><span style={{ fontFamily: "'EB Garamond',serif", fontSize: 17, lineHeight: 1.2 }}>{related.title}</span><ChevronRight size={14} color={RELATIONAL} aria-hidden />
          </button>;
        })}</div>
      </div>
      <div style={{ ...mono, fontSize: 9, color: META, marginTop: 30, paddingTop: 18, borderTop: "1px solid rgba(200,180,130,.12)" }}>RESPOND WITH INTEGRITY · PRESERVE AGENCY</div>
    </div>
  </aside>;
}
