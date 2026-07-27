import { useState, useEffect, useCallback, useRef } from "react";
import { Share2, X, ZoomIn, Minimize2 } from "lucide-react";
import type { ReadingDocument as CaseStudy, ReadingEvidenceItem as EvidenceItem, ReadingSection as Section } from "./types";
import { EvidenceThumbnail, EvidenceLargeView } from "../../case-study/components/EvidenceArtwork";
import { resolveStellarColor } from "../../atlas/constellation/stellarPalette";
import FrameworkEvidenceCanvas from "../frameworks/FrameworkEvidenceCanvas";

function LeftNav({
  caseStudy, activeSection, onSection, onExit, color,
}: {
  caseStudy: CaseStudy;
  activeSection: Section;
  onSection: (s: Section) => void;
  onExit: () => void;
  color: string;
}) {
  const totalArtifacts = caseStudy.sections.reduce((a, s) => a + s.evidence.length, 0);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  return (
    <nav style={{
      width:"260px",
      flexShrink:0,
      borderRight:"1px solid rgba(200,180,130,0.10)",
      background:"linear-gradient(180deg, rgba(5,6,12,0.99), rgba(4,5,10,0.98))",
      display:"flex",
      flexDirection:"column",
      overflowY:"auto",
      scrollbarWidth:"none",
    }}>
      {/* Back to Atlas */}
      <button onClick={onExit} style={{
        display:"flex",
        alignItems:"center",
        gap:"10px",
        minHeight:"64px",
        width:"100%",
        padding:"0 24px",
        fontFamily:"'DM Mono',monospace",
        fontSize:"9.5px",
        letterSpacing:"0.2em",
        color:"rgba(200,180,130,0.56)",
        background:"rgba(8,10,18,0.28)",
        border:"none",
        borderBottom:"1px solid rgba(200,180,130,0.08)",
        cursor:"pointer",
        textAlign:"left",
      }}>
        <span style={{ color, opacity:0.70 }}>←</span>
        <span>BACK TO OVERVIEW</span>
      </button>

      {/* Case study metadata */}
      <div style={{
        padding:"24px 24px 26px",
        borderBottom:"1px solid rgba(200,180,130,0.08)",
      }}>
        <div style={{
          fontFamily:"'DM Mono',monospace",
          fontSize:"9px",
          letterSpacing:"0.34em",
          color:"rgba(138,174,200,0.78)",
          textTransform:"uppercase",
          marginBottom:"13px",
        }}>
          {caseStudy.categoryLabel}
        </div>
        <div style={{
          fontFamily:"'EB Garamond',serif",
          fontSize:"18px",
          lineHeight:1.16,
          color:"rgba(255,248,230,0.96)",
          marginBottom:"6px",
        }}>
          {caseStudy.title}
        </div>
        <div style={{
          fontFamily:"'DM Mono',monospace",
          fontSize:"10.5px",
          lineHeight:1.6,
          color:"rgba(200,166,96,0.58)",
          letterSpacing:"0.10em",
        }}>
          {caseStudy.meta}
        </div>
      </div>

      {/* Reading time now lives in left navigation */}
      <div style={{
        padding:"15px 24px 17px",
        borderBottom:"1px solid rgba(200,180,130,0.08)",
        background:"rgba(255,255,255,0.008)",
      }}>
        <div style={{
          display:"flex",
          alignItems:"center",
          gap:"10px",
          fontFamily:"'DM Mono',monospace",
          fontSize:"8.5px",
          letterSpacing:"0.24em",
          color:"rgba(200,166,96,0.45)",
          textTransform:"uppercase",
          marginBottom:"10px",
        }}>
          <span style={{ color, opacity:0.72 }}>✦</span>
          <span>Reading Time</span>
        </div>
        <div style={{
          display:"flex",
          alignItems:"center",
          gap:"10px",
          fontFamily:"'DM Mono',monospace",
          fontSize:"10px",
          letterSpacing:"0.18em",
          color:"rgba(200,166,96,0.66)",
          textTransform:"uppercase",
        }}>
          <span style={{ color, opacity:0.70 }}>◷</span>
          <span>{activeSection.readingTime} MIN</span>
        </div>
      </div>

      {/* Section list */}
      <div style={{ flex:1, paddingTop:"20px" }}>
        {caseStudy.sections.map(section => {
          const isActive = section.id === activeSection.id;
          const isHovered = hoveredSection === section.id;
          return (
            <button key={section.id} 
              onClick={() => onSection(section)}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
              
              style={{
                display:"flex",
                alignItems:"center",
                gap:"15px",
                width:"100%",
                minHeight:"40px",
                textAlign:"left",
                padding:"0 24px 0 18px",
                background:
                  isActive
                    ? "rgba(138,174,200,0.10)"
                    : isHovered
                      ? "rgba(138,174,200,0.05)"
                      : "transparent",
                borderLeft:
                  isActive
                    ? `2px solid ${color}`
                    : isHovered
                      ? `2px solid ${color}55`
                      : "2px solid transparent",
                
                borderTop:"none",
                borderRight:"none",
                borderBottom:"none",
                cursor:"pointer",
                transition:"background 0.2s ease, border-color 0.2s ease, color 0.2s ease",
              }}>
              <span style={{
                fontFamily:"'DM Mono',monospace",
                fontSize:"9.5px",
                letterSpacing:"0.18em",
                color:
                  isActive
                    ? color
                    : isHovered
                      ? "rgba(180,210,255,0.72)"
                      : "rgba(200,166,96,0.42)",
                
                minWidth:"25px",
                flexShrink:0,
                transition:"color 0.2s ease",
              }}>
                {section.number}
              </span>
              <span style={{
                fontFamily:"'DM Mono',monospace",
                fontSize:"10px",
                letterSpacing:"0.16em",
                color:
                  isActive
                    ? "rgba(255,248,230,0.94)"
                    : isHovered
                      ? "rgba(245,235,210,0.82)"
                      : "rgba(200,166,96,0.58)",
                
                textTransform:"uppercase",
                transition:
                "background .18s ease, border-color .18s ease, color .18s ease, transform .18s ease",
                whiteSpace:"nowrap",
              }}>
                {section.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom metadata */}
      <div style={{
        padding:"22px 24px",
        borderTop:"1px solid rgba(200,180,130,0.08)",
        background:"rgba(5,5,10,0.72)",
      }}>
        <div style={{
          fontFamily:"'DM Mono',monospace",
          fontSize:"8px",
          letterSpacing:"0.24em",
          color:"rgba(200,166,96,0.54)",
          lineHeight:2.1,
          textTransform:"uppercase",
        }}>
          <div>{caseStudy.sections.length} Sections</div>
          <div>
            {totalArtifacts} {caseStudy.artifactLabel}
            {totalArtifacts === 1 ? "" : "S"}
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─── Center Section Content ────────────────────────────────────────────────

function SectionContent({
  section,
  color,
  sectionCount,
  categoryLabel,
  sequenceLabel,
  askOpen,
  onToggleAsk,
}: {
  section: Section;
  color: string;
  sectionCount: number;
  categoryLabel: string;
  sequenceLabel?: string;
  askOpen: boolean;
  onToggleAsk: () => void;
}) {
  const [askHovered, setAskHovered] = useState(false);

  const askIsActive = askOpen || askHovered;

  return (
    <div style={{
      flex:1, overflowY:"auto", scrollbarWidth:"none",
      padding:"48px 56px 80px",
      maxWidth:"none",
    }}>
      <style>{`@keyframes askIconPulse{0%,100%{opacity:.72;transform:scale(.96)}50%{opacity:1;transform:scale(1.08)}}`}</style>
      {/* Orientation */}
      <div style={{ marginBottom:"40px" }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"9px",
          letterSpacing:"0.28em", color:"rgba(200,180,130,0.40)",
          marginBottom:"3px" }}>
          {sequenceLabel ?? categoryLabel}
        </div>
        <div style={{ display:"flex", alignItems:"baseline", gap:"9px" }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"9px",
            letterSpacing:"0.16em", color:color, opacity:0.80 }}>
            {section.number} {section.title.toUpperCase()}
          </span>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"9px",
            letterSpacing:"0.14em", color:"rgba(200,180,130,0.35)" }}>
            of {String(sectionCount).padStart(2,"0")}
          </span>
        </div>
      </div>

      {/* Section title + contextual Ask action */}
      <div style={{
        display:"flex",
        alignItems:"flex-start",
        justifyContent:"space-between",
        gap:"28px",
        marginBottom:"12px",
      }}>
        <div style={{ minWidth:0 }}>
          <div style={{ fontFamily:"'EB Garamond',serif", fontSize:"40px",
            lineHeight:1.04, color:"rgba(255,252,245,0.97)",
            letterSpacing:"0.01em", marginBottom:"12px", fontWeight:500 }}>
            {section.title}
          </div>
          <div style={{ fontFamily:"'EB Garamond',serif", fontStyle:"regular",
            fontSize:"18px", lineHeight:1.55,
            color:"rgba(200,180,130,0.72)" }}>
            {section.subtitle}
          </div>
        </div>

        <button
          onClick={onToggleAsk}
          onMouseEnter={() => setAskHovered(true)}
          onMouseLeave={() => setAskHovered(false)}
          style={{
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            gap:"8px",
            minWidth:"82px",
            height:"42px",
            marginTop:"4px",
            borderRadius:"999px",
            border:`1px solid ${askIsActive ? color : color + "80"}`,
            background: askOpen
              ? `${color}18`
              : askHovered
                ? `${color}12`
                : "rgba(7,9,16,0.72)",
            color:"rgba(255,248,230,0.94)",
            boxShadow: askHovered
              ? `0 0 14px ${color}35, 0 0 38px ${color}18`
              : askOpen
                ? `0 0 26px ${color}28`
                : `0 0 22px ${color}14`,
            transform: askHovered ? "translateY(-1px) scale(1.025)" : "translateY(0) scale(1)",
            fontFamily:"'DM Mono',monospace",
            fontSize:"11px",
            letterSpacing:"0.02em",
            cursor:"pointer",
            transition:"background 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease",
            flexShrink:0,
          }}
        >
          <span style={{
            color,
            fontSize:"14px",
            lineHeight:1,
            display:"inline-block",
            opacity: askIsActive ? 1 : 0.78,
            transform: askHovered ? "scale(1.12)" : "scale(1)",
            filter: askIsActive ? `drop-shadow(0 0 8px ${color}70)` : "none",
            animation: askOpen || askHovered ? "none" : "askIconPulse 3.4s ease-in-out infinite",
            transition:"opacity 0.22s ease, transform 0.22s ease, filter 0.22s ease",
          }}>
            ✦
          </span>
          <span>Ask</span>
        </button>
      </div>

      <div style={{ borderBottom:"1px solid rgba(200,180,130,0.08)", marginTop:"36px", marginBottom:"36px" }}/>

      {/* Body copy */}
      <div style={{ marginBottom:"40px" }}>
        {section.body.map((para, i) => (
          <p key={i} style={{
            fontFamily:"'EB Garamond',serif",
            fontSize:"17px", lineHeight:1.85,
            color:"rgba(240,232,215,0.88)",
            marginBottom:i < section.body.length - 1 ? "22px" : 0,
          }}>
            {para}
          </p>
        ))}
      </div>

      {/* Key Insight */}
      <div style={{
        borderLeft:`3px solid ${color}`,
        paddingLeft:"20px",
        margin:"40px 0",
      }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"9px",
          letterSpacing:"0.30em", color:color, opacity:0.70,
          marginBottom:"10px", textTransform:"uppercase" }}>
          KEY INSIGHT
        </div>
        <div style={{ fontFamily:"'EB Garamond',serif", fontStyle:"regular",
          fontSize:"18px", lineHeight:1.72, color:"rgba(255,252,245,0.92)" }}>
          {section.keyInsight}
        </div>
      </div>
    </div>
  );
}


// ─── Contextual Ask Panel ─────────────────────────────────────────────────

function AskPanel({ caseStudy, section, color, onClose }: {
  caseStudy: CaseStudy;
  section: Section;
  color: string;
  onClose: () => void;
}) {
  const [question, setQuestion] = useState("");

  const suggestions = [
    "Summarize this section",
    section.id === "context" ? "Why is speed perceived as distrust?" : `What is the core argument in ${section.title}?`,
    section.evidence.length > 0 ? "Show related evidence" : "Connect this to the larger case study",
    "Challenge this perspective",
  ];

  return (
    <div style={{
      margin:"16px 16px 14px",
      border:"1px solid rgba(200,180,130,0.18)",
      borderRadius:"12px",
      background:"linear-gradient(145deg, rgba(12,15,24,0.98), rgba(15,19,28,0.94))",
      boxShadow:"0 18px 48px rgba(0,0,0,0.36)",
      overflow:"hidden",
      flexShrink:0,
      animation:"askPanelIn 0.22s ease-out",
    }}>
      <style>{`@keyframes askPanelIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
        padding:"16px 16px 10px",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"9px" }}>
          <span style={{ color, fontSize:"14px" }}>✦</span>
          <div style={{ fontFamily:"'EB Garamond',serif", fontSize:"16px", color:"rgba(255,248,230,0.92)" }}>
            Ask about this section
          </div>
        </div>
        <button onClick={onClose} aria-label="Close Ask panel" style={{
          width:"24px", height:"24px",
          display:"flex", alignItems:"center", justifyContent:"center",
          background:"transparent",
          border:"none",
          color:"rgba(245,235,210,0.70)",
          cursor:"pointer",
        }}>
          <X size={15}/>
        </button>
      </div>

      <div style={{ padding:"0 16px 16px" }}>
        <div style={{
          fontFamily:"'DM Mono',monospace",
          fontSize:"10.5px",
          letterSpacing:"0.08em",
          color:"rgba(245,235,210,0.58)",
          marginBottom:"10px",
        }}>
          Not sure what to ask? Try one of these:
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginBottom:"14px" }}>
          {suggestions.map(label => (
            <button key={label} style={{
              alignSelf:"flex-start",
              maxWidth:"100%",
              border:"1px solid rgba(245,235,210,0.10)",
              borderRadius:"999px",
              background:"rgba(255,255,255,0.035)",
              color:"rgba(255,248,230,0.82)",
              padding:"7px 11px",
              fontFamily:"Inter, system-ui, sans-serif",
              fontSize:"11px",
              lineHeight:1.2,
              cursor:"pointer",
              textAlign:"left",
              transition:"border-color 0.2s ease, background 0.2s ease",
            }}>
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          // Placeholder hook for future LLM integration.
          // The context object is intentionally section-scoped.
          console.log("Ask context", {
            caseStudy: caseStudy.title,
            section: section.title,
            evidence: section.evidence.map(e => e.title),
            question,
          });
          setQuestion("");
        }} style={{
          display:"flex",
          alignItems:"center",
          gap:"8px",
          background:"rgba(255,255,255,0.07)",
          borderRadius:"999px",
          padding:"4px 6px 4px 12px",
        }}>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            style={{
              flex:1,
              minWidth:0,
              background:"transparent",
              border:"none",
              outline:"none",
              color:"rgba(255,248,230,0.88)",
              fontFamily:"Inter, system-ui, sans-serif",
              fontSize:"11px",
            }}
          />
          <button type="submit" aria-label="Submit question" style={{
            width:"28px", height:"28px",
            display:"flex", alignItems:"center", justifyContent:"center",
            background:"transparent",
            border:"none",
            color:"rgba(255,248,230,0.80)",
            cursor:"pointer",
            fontSize:"16px",
          }}>
            ▷
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Evidence Rail ─────────────────────────────────────────────────────────

function EvidenceRail({
  section,
  color,
  railLabel,
  artifactLabel,
  emptyMessage,
  onOpenEvidence,
}: {
  section: Section;
  color: string;
  railLabel: string;
  artifactLabel: string;
  emptyMessage?: string;
  onOpenEvidence: (item: EvidenceItem) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string|null>(null);
  const portalRef = useRef<HTMLButtonElement>(null);
  const portalItems = section.evidence.filter(
    (item) => item.canvas?.portalImage,
  );
  const portalItem = portalItems[0];
  const portalSignalCount = portalItems.reduce(
    (total, item) => total + (item.canvas?.annotations.length ?? 0),
    0,
  );

  const handlePortalPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const portal = portalRef.current;
    if (!portal) return;
    const rect = portal.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const normalizedX = x / rect.width - 0.5;
    const normalizedY = y / rect.height - 0.5;
    portal.style.setProperty("--portal-x", `${x}px`);
    portal.style.setProperty("--portal-y", `${y}px`);
    portal.style.setProperty("--portal-dx", `${normalizedX * 8}px`);
    portal.style.setProperty("--portal-dy", `${normalizedY * 6}px`);
  };

  const resetPortalPointer = () => {
    const portal = portalRef.current;
    if (!portal) return;
    portal.style.setProperty("--portal-x", "50%");
    portal.style.setProperty("--portal-y", "42%");
    portal.style.setProperty("--portal-dx", "0px");
    portal.style.setProperty("--portal-dy", "0px");
  };

  return (
    <div style={{
      width:"100%",
      flex:1,
      minHeight:0,
      background:"rgba(6,7,12,0.95)",
      overflowY:"auto", scrollbarWidth:"none",
      display:"flex", flexDirection:"column",
    }}>
      {/* Rail header */}
      <div style={{ padding:"24px 20px 16px",
        borderBottom:"1px solid rgba(200,180,130,0.06)" }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"11px",
          letterSpacing:"0.32em", color:"rgba(200,180,130,0.60)",
          textTransform:"uppercase" }}>
          {railLabel}
        </div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"9px",
          letterSpacing:"0.18em", color:"rgba(200,180,130,0.48)", marginTop:"3px" }}>
          {section.evidence.length} {artifactLabel}
          {section.evidence.length !== 1 ? "S" : ""}
        </div>
      </div>

      {/* Evidence cards */}
      <div style={{ padding:"16px 16px", flex:1 }}>
        <style>{`
          @keyframes portalWave {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(.22); }
            22% { opacity: .58; }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(1.9); }
          }
          @keyframes portalOrbit {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }
          [data-cinematic-portal]:hover [data-portal-wave],
          [data-cinematic-portal]:focus-visible [data-portal-wave] {
            animation: portalWave 1.9s cubic-bezier(.16,1,.3,1) infinite;
          }
          [data-cinematic-portal]:hover [data-portal-wave="2"],
          [data-cinematic-portal]:focus-visible [data-portal-wave="2"] {
            animation-delay: .48s;
          }
          [data-cinematic-portal]:hover [data-portal-wave="3"],
          [data-cinematic-portal]:focus-visible [data-portal-wave="3"] {
            animation-delay: .96s;
          }
          [data-cinematic-portal]:hover [data-portal-orbit],
          [data-cinematic-portal]:focus-visible [data-portal-orbit] {
            opacity: .72;
            animation: portalOrbit 8s linear infinite;
          }
          [data-cinematic-portal]:hover [data-portal-image],
          [data-cinematic-portal]:focus-visible [data-portal-image] {
            transform: translate3d(var(--portal-dx), var(--portal-dy), 0) scale(1.035);
            filter: saturate(1.08) contrast(1.04) brightness(1.04);
          }
          [data-cinematic-portal]:hover [data-portal-cta-default],
          [data-cinematic-portal]:focus-visible [data-portal-cta-default] {
            opacity: 0;
            transform: translateY(-5px);
          }
          [data-cinematic-portal]:hover [data-portal-cta-active],
          [data-cinematic-portal]:focus-visible [data-portal-cta-active] {
            opacity: 1;
            transform: translateY(0);
          }
          @media (prefers-reduced-motion: reduce) {
            [data-portal-wave], [data-portal-orbit] { display: none !important; }
            [data-portal-image] { transform: none !important; transition: opacity 180ms ease !important; }
            [data-cinematic-portal]:hover [data-portal-image],
            [data-cinematic-portal]:focus-visible [data-portal-image] {
              filter: brightness(1.05);
            }
          }
        `}</style>
        {section.evidence.length === 0 && emptyMessage && (
          <div style={{
            margin:"8px 2px",
            padding:"18px 16px",
            border:`1px solid ${color}22`,
            background:`${color}08`,
          }}>
            <div style={{
              fontFamily:"'DM Mono',monospace",
              fontSize:"8.5px",
              lineHeight:1.8,
              letterSpacing:"0.14em",
              color:"rgba(200,180,130,0.52)",
              textTransform:"uppercase",
            }}>
              {emptyMessage}
            </div>
          </div>
        )}
        {portalItem && (
          <button
            ref={portalRef}
            type="button"
            data-cinematic-portal
            aria-label={`Enter interactive canvas: ${portalItem.canvas?.title}`}
            onClick={() => onOpenEvidence(portalItem)}
            onPointerMove={handlePortalPointerMove}
            onPointerLeave={resetPortalPointer}
            onBlur={resetPortalPointer}
            style={{
              ["--portal-x" as string]:"50%",
              ["--portal-y" as string]:"42%",
              ["--portal-dx" as string]:"0px",
              ["--portal-dy" as string]:"0px",
              position:"relative",
              display:"block",
              width:"100%",
              marginBottom:"12px",
              padding:0,
              overflow:"hidden",
              textAlign:"left",
              color:"inherit",
              border:`1px solid ${color}42`,
              background:"rgba(6,12,15,0.94)",
              boxShadow:`0 18px 50px rgba(0,0,0,.28), inset 0 0 0 1px ${color}08`,
              cursor:"pointer",
              outline:"none",
              isolation:"isolate",
              transition:
                "border-color 220ms cubic-bezier(.16,1,.3,1), box-shadow 220ms cubic-bezier(.16,1,.3,1), transform 220ms cubic-bezier(.16,1,.3,1)",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.borderColor = `${color}9A`;
              event.currentTarget.style.boxShadow =
                `0 22px 64px rgba(0,0,0,.38), 0 0 32px ${color}20, inset 0 0 0 1px ${color}16`;
              event.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(event) => {
              resetPortalPointer();
              event.currentTarget.style.borderColor = `${color}42`;
              event.currentTarget.style.boxShadow =
                `0 18px 50px rgba(0,0,0,.28), inset 0 0 0 1px ${color}08`;
              event.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{
              position:"relative",
              width:"100%",
              aspectRatio:"4/5",
              maxHeight:"390px",
              overflow:"hidden",
              background:"#05080d",
            }}>
              <img
                data-portal-image
                src={portalItem.canvas?.portalImage}
                alt=""
                aria-hidden="true"
                style={{
                  width:"100%",
                  height:"100%",
                  objectFit:"cover",
                  objectPosition:"center 44%",
                  display:"block",
                  transition:
                    "transform 720ms cubic-bezier(.16,1,.3,1), filter 520ms cubic-bezier(.16,1,.3,1)",
                  willChange:"transform",
                }}
              />
              <div aria-hidden style={{
                position:"absolute",
                inset:0,
                background:
                  "linear-gradient(180deg, transparent 48%, rgba(5,9,12,.42) 72%, rgba(5,9,12,.96) 100%)",
                pointerEvents:"none",
              }}/>
              {[1,2,3].map((wave) => (
                <span
                  key={wave}
                  data-portal-wave={String(wave)}
                  aria-hidden
                  style={{
                    position:"absolute",
                    left:"var(--portal-x)",
                    top:"var(--portal-y)",
                    width:170,
                    height:170,
                    borderRadius:"50%",
                    border:`1px solid ${wave === 2 ? "rgba(225,195,92,.56)" : color + "70"}`,
                    boxShadow:`0 0 32px ${color}18, inset 0 0 30px ${color}10`,
                    opacity:0,
                    pointerEvents:"none",
                  }}
                />
              ))}
              <span
                data-portal-orbit
                aria-hidden
                style={{
                  position:"absolute",
                  left:"var(--portal-x)",
                  top:"var(--portal-y)",
                  width:230,
                  height:118,
                  borderRadius:"50%",
                  border:"1px solid rgba(225,195,92,.34)",
                  borderLeftColor:"transparent",
                  borderBottomColor:`${color}58`,
                  opacity:0,
                  pointerEvents:"none",
                  transition:"opacity 350ms ease",
                }}
              />
            </div>

            <div style={{
              position:"relative",
              zIndex:2,
              padding:"14px 16px 16px",
              background:
                "linear-gradient(180deg, rgba(6,12,15,.92), rgba(5,10,13,.99))",
            }}>
              <div style={{
                fontFamily:"'DM Mono',monospace",
                fontSize:"8.5px",
                letterSpacing:"0.18em",
                color,
                textTransform:"uppercase",
                marginBottom:"8px",
              }}>
                Interactive comparison
              </div>
              <div style={{
                fontFamily:"'EB Garamond',serif",
                fontSize:"19px",
                lineHeight:1.25,
                color:"rgba(255,248,230,.94)",
                marginBottom:"7px",
                fontWeight:500,
              }}>
                {portalItem.canvas?.title}
              </div>
              <div style={{
                fontFamily:"'EB Garamond',serif",
                fontSize:"14px",
                lineHeight:1.5,
                color:"rgba(200,180,130,.62)",
              }}>
                {portalItem.canvas?.description}
              </div>
              <div style={{
                position:"relative",
                minHeight:"18px",
                marginTop:"12px",
                paddingTop:"10px",
                borderTop:"1px solid rgba(200,180,130,.10)",
                fontFamily:"'DM Mono',monospace",
                fontSize:"8.5px",
                letterSpacing:"0.16em",
                color,
                textTransform:"uppercase",
              }}>
                <span data-portal-cta-default style={{
                  position:"absolute",
                  inset:"10px auto auto 0",
                  opacity:.76,
                  transition:"opacity 220ms ease, transform 220ms cubic-bezier(.16,1,.3,1)",
                }}>
                  {portalSignalCount} framework signals · Open canvas
                </span>
                <span data-portal-cta-active style={{
                  position:"absolute",
                  inset:"10px auto auto 0",
                  opacity:0,
                  transform:"translateY(5px)",
                  transition:"opacity 220ms ease, transform 220ms cubic-bezier(.16,1,.3,1)",
                }}>
                  Enter interactive canvas →
                </span>
              </div>
            </div>
          </button>
        )}
        {section.evidence.filter(item => !item.canvas?.portalImage).map(item => {
          const isHov = hoveredId === item.id;
          return (
            <button key={item.id}
              onClick={() => onOpenEvidence(item)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                display:"block", width:"100%", textAlign:"left",
                marginBottom:"12px",
                background: isHov ? `${color}0A` : "rgba(10,12,20,0.6)",
                border:`1px solid ${isHov ? color + "35" : "rgba(200,180,130,0.10)"}`,
                cursor:"pointer", transition:"all 0.25s", padding:0,
                outline:"none",
              }}>
              {/* Thumbnail */}
              <div style={{ width:"100%", aspectRatio:"16/10", overflow:"hidden" }}>
                <EvidenceThumbnail
                  type={item.type}
                  color={color}
                  image={item.image}
                  alt={item.alt}
                  imageFit={item.imageFit}
                />
              </div>
              {/* Card body */}
              <div style={{ padding:"12px 14px 14px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px",
                  marginBottom:"6px" }}>
                  <span style={{
                    fontFamily:"'DM Mono',monospace", fontSize:"9px",
                    color:color, opacity:0.70,
                    border:`1px solid ${color}40`,
                    padding:"2px 6px",
                    letterSpacing:"0.14em",
                  }}>
                    {item.number}
                  </span>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"9.5px",
                    letterSpacing:"0.16em", color:"rgba(200,180,130,0.38)",
                    textTransform:"uppercase" }}>
                    {item.type}
                  </span>
                </div>
                <div style={{ fontFamily:"'EB Garamond',serif", fontSize:"16px",
                  lineHeight:1.3, color:"rgba(245,235,210,0.85)",
                  marginBottom:"6px", fontWeight:500 }}>
                  {item.title}
                </div>
                <div style={{ fontFamily:"'EB Garamond',serif", fontStyle:"regular",
                  fontSize:"14.5px", lineHeight:1.55,
                  color:"rgba(200,180,130,0.55)" }}>
                  {item.description}
                </div>
                {item.canvas && (
                  <div style={{
                    marginTop:"10px",
                    paddingTop:"9px",
                    borderTop:"1px solid rgba(200,180,130,0.08)",
                    fontFamily:"'DM Mono',monospace",
                    fontSize:"8.5px",
                    letterSpacing:"0.16em",
                    color,
                    opacity:0.72,
                    textTransform:"uppercase",
                  }}>
                    {item.canvas.annotations.length} framework signals · Open canvas
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Evidence Viewer Overlay ───────────────────────────────────────────────

function EvidenceViewer({ item, color, section, caseStudyTitle, onClose, onShare }: {
  item: EvidenceItem;
  color: string;
  section: Section;
  caseStudyTitle: string;
  onClose: () => void;
  onShare: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleShare = async () => {
    onShare();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position:"absolute", inset:0, zIndex:50,
      background:"rgba(4,5,10,0.96)",
      display:"flex", flexDirection:"column",
      animation:"fadeIn 0.25s ease-out",
    }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:scale(0.99)}to{opacity:1;transform:scale(1)}}`}</style>

      {/* Viewer header */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"16px 24px",
        borderBottom:"1px solid rgba(200,180,130,0.08)",
        flexShrink:0,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"9px",
            letterSpacing:"0.22em", color:"rgba(200,180,130,0.40)" }}>
            {caseStudyTitle.toUpperCase()}
          </span>
          <span style={{ color:"rgba(200,180,130,0.25)" }}>·</span>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"9px",
            letterSpacing:"0.22em", color:"rgba(200,180,130,0.40)" }}>
            {section.title.toUpperCase()}
          </span>
          <span style={{ color:"rgba(200,180,130,0.25)" }}>·</span>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"9px",
            letterSpacing:"0.22em", color:color, opacity:0.75 }}>
            ARTIFACT {item.number}
          </span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <button onClick={() => setFullscreen(f => !f)} style={{
            display:"flex", alignItems:"center", gap:"5px",
            fontFamily:"'DM Mono',monospace", fontSize:"10px",
            letterSpacing:"0.20em", color:"rgba(200,180,130,0.70)",
            background:"none", border:"1px solid rgba(200,180,130,0.52)",
            padding:"5px 10px", cursor:"pointer", transition:"all 0.2s",
          }}>
            {fullscreen ? <Minimize2 size={10}/> : <ZoomIn size={10}/>}
            {fullscreen ? "EXIT FULLSCREEN" : "FULLSCREEN"}
          </button>
          <button onClick={onClose} style={{
            display:"flex", alignItems:"center", justifyContent:"center",
            color:"rgba(200,180,130,0.75)", background:"none",
            border:"1px solid rgba(200,180,130,0.52)",
            width:"27px", height:"27px", cursor:"pointer",
          }}>
            <X size={14}/>
          </button>
        </div>
      </div>

      {/* Main viewer body */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        {/* Large image area */}
        <div style={{ flex:1, overflow:"hidden", padding:"24px" }}>
          <div style={{
            width:"100%", height:"100%",
            background:"rgba(8,10,18,0.80)",
            border:"1px solid rgba(200,180,130,0.08)",
            overflow:"hidden",
          }}>
            <EvidenceLargeView item={item} color={color}/>
          </div>
        </div>

        {/* Right metadata */}
        {!fullscreen && (
          <div style={{
            width:"300px", flexShrink:0, overflowY:"auto", scrollbarWidth:"none",
            borderLeft:"1px solid rgba(200,180,130,0.08)",
            padding:"28px 24px",
          }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"10px",
              letterSpacing:"0.28em", color:color, opacity:0.65,
              marginBottom:"12px", textTransform:"uppercase" }}>
              {item.type}
            </div>
            <div style={{ fontFamily:"'EB Garamond',serif", fontSize:"22px",
              lineHeight:1.1, color:"rgba(255,252,245,0.95)",
              marginBottom:"20px", fontWeight:500 }}>
              {item.title}
            </div>
            <div style={{ borderBottom:"1px solid rgba(200,180,130,0.07)", marginBottom:"20px" }}/>
            <div style={{ fontFamily:"'EB Garamond',serif", fontSize:"16px",
              lineHeight:1.78, color:"rgba(240,232,215,0.82)", marginBottom:"24px" }}>
              {item.description}
            </div>
            <div style={{ borderBottom:"1px solid rgba(200,180,130,0.07)", marginBottom:"20px" }}/>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"11px",
              letterSpacing:"0.24em", color:"rgba(200,180,130,0.40)",
              marginBottom:"10px", textTransform:"uppercase" }}>
              CAPTION
            </div>
            <div style={{ fontFamily:"'EB Garamond',serif", fontStyle:"regular",
              fontSize:"15px", lineHeight:1.68, color:"rgba(200,180,130,0.62)" }}>
              {item.caption}
            </div>

            <div style={{ marginTop:"32px" }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"11px",
                letterSpacing:"0.24em", color:"rgba(200,180,130,0.40)",
                marginBottom:"10px", textTransform:"uppercase" }}>
                ARTIFACT
              </div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"10px",
                letterSpacing:"0.16em", color:"rgba(200,180,130,0.50)",
                lineHeight:2.2 }}>
                <div>NO. {item.number}</div>
                <div>TYPE · {item.type}</div>
                <div>SECTION · {section.title}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Caption strip */}
      <div style={{
        borderTop:"1px solid rgba(200,180,130,0.06)",
        padding:"12px 24px",
        flexShrink:0,
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        
      </div>
    </div>
  );
}

// ─── AtlasReadingEngine ───────────────────────────────────────────────────

interface AtlasReadingEngineProps {
  document: CaseStudy;
  system: { color: string; label: string };
  onExit: () => void;
  onAtlas?: () => void;
  onSystem?: () => void;
  initialSectionIndex?: number;
  routeSegment?: string;
}

export default function AtlasReadingEngine({
  document,
  system,
  onExit,
  onAtlas,
  onSystem,
  initialSectionIndex = 0,
  routeSegment = "entry",
}: AtlasReadingEngineProps) {
  const caseStudy = document;
  const color = system.color;

  // Restore section from URL on mount
  const getInitialSection = (): Section => {
  if (typeof initialSectionIndex === "number") {
    return caseStudy.sections[initialSectionIndex] ?? caseStudy.sections[0];
  }

  try {
    const path = window.location.pathname;
    const match = path.match(new RegExp(`/${routeSegment}/[^/]+/([^/#?]+)`));
    if (match) {
      const found = caseStudy.sections.find(s => s.slug === match[1]);
      if (found) return found;
    }
  } catch {}

  return caseStudy.sections[0];
};

  const [activeSection, setActiveSection] = useState<Section>(getInitialSection);
  const [activeEvidence, setActiveEvidence] = useState<EvidenceItem|null>(
    () => activeSection.evidence.find((item) => item.canvas) ?? null,
  );
  const [shareConfirm, setShareConfirm] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const sectionColor = resolveStellarColor(
    activeSection.accentStellarType,
    color,
  );

  // Browser back/forward support
  useEffect(() => {
    const handler = () => {
      const path = window.location.pathname;
      const match = path.match(new RegExp(`/${routeSegment}/[^/]+/([^/#?]+)`));
      if (match) {
        const found = caseStudy.sections.find(s => s.slug === match[1]);
        if (found) setActiveSection(found);
      }
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [caseStudy, routeSegment]);

  // Deep-link to evidence on mount via URL hash
  useEffect(() => {
    try {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const allEvidence = caseStudy.sections.flatMap(s => s.evidence);
        const item = allEvidence.find(e => e.id === hash);
        if (item) {
          const sec = caseStudy.sections.find(s => s.evidence.some(e => e.id === hash));
          if (sec) setActiveSection(sec);
          setActiveEvidence(item);
        }
      }
    } catch {}
  }, [caseStudy, routeSegment]);

  const handleSection = useCallback((section: Section) => {
    setActiveSection(section);
    setActiveEvidence(section.evidence.find((item) => item.canvas) ?? null);
    setAskOpen(false);
    try {
      const url = `/${routeSegment}/${caseStudy.id}/${section.slug}`;
      history.pushState({}, "", url);
    } catch {}
  }, [caseStudy.id, routeSegment]);

  const handleOpenEvidence = useCallback((item: EvidenceItem) => {
    setActiveEvidence(item);
    setAskOpen(false);
    try {
      const url = `/${routeSegment}/${caseStudy.id}/${activeSection.slug}#${item.id}`;
      history.pushState({}, "", url);
    } catch {}
  }, [caseStudy.id, activeSection.slug, routeSegment]);

  const handleCloseEvidence = useCallback(() => {
    setActiveEvidence(null);
    try {
      const url = `/${routeSegment}/${caseStudy.id}/${activeSection.slug}`;
      history.pushState({}, "", url);
    } catch {}
  }, [caseStudy.id, activeSection.slug, routeSegment]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // clipboard not available in sandbox
    }
    setShareConfirm(true);
    setTimeout(() => setShareConfirm(false), 2000);
  }, []);

  const breadcrumbButtonStyle = {
    fontFamily:"'DM Mono',monospace",
    fontSize:"9px",
    letterSpacing:"0.28em",
    background:"none",
    border:"none",
    padding:"8px 2px",
    cursor:"pointer",
    textTransform:"uppercase" as const,
    transition:"color 0.18s ease, opacity 0.18s ease",
  };

  return (
    <div style={{
      position:"absolute", inset:0, zIndex:40,
      background:"#05060C",
      display:"flex", flexDirection:"column",
      fontFamily:"'DM Mono',monospace",
    }}>
      {/* Top header bar */}
      <div style={{
        height:"44px", flexShrink:0,
        borderBottom:"1px solid rgba(200,180,130,0.08)",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 24px",
        background:"rgba(4,5,10,0.98)",
      }}>
        <div aria-label="Breadcrumb" style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <button
            type="button"
            onClick={onAtlas ?? onExit}
            title="Back to Atlas"
            style={{
              ...breadcrumbButtonStyle,
              color:"rgba(200,180,130,0.42)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(245,235,210,0.82)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(200,180,130,0.42)"; }}
          >
            ATLAS
          </button>
          <span style={{ color:"rgba(200,180,130,0.22)", fontSize:"10px" }}>·</span>
          <button
            type="button"
            onClick={onSystem ?? onExit}
            title={`Back to ${system.label}`}
            style={{
              ...breadcrumbButtonStyle,
              color,
              opacity:0.72,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.72"; }}
          >
            {system.label}
          </button>
          <span style={{ color:"rgba(200,180,130,0.22)", fontSize:"10px" }}>·</span>
          <button
            type="button"
            onClick={onExit}
            title={`Back to ${caseStudy.title} overview`}
            style={{
              ...breadcrumbButtonStyle,
              color:"rgba(245,235,210,0.66)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(245,235,210,0.92)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(245,235,210,0.66)"; }}
          >
            {caseStudy.title}
          </button>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <button onClick={handleShare} style={{
            display:"flex", alignItems:"center", gap:"5px",
            fontSize:"10px", letterSpacing:"0.20em",
            color: shareConfirm ? color : "rgba(200,180,130,0.70)",
            background:"none", border:"1px solid rgba(200,180,130,0.42)",
            padding:"5px 10px", cursor:"pointer", transition:"color 0.2s",
          }}>
            <Share2 size={10}/>
            {shareConfirm ? "COPIED" : "SHARE"}
          </button>
         
        </div>
      </div>

      {/* Main three-column body */}
      <div style={{ flex:1, display:"flex", overflow:"hidden", position:"relative" }}>
        <LeftNav
          caseStudy={caseStudy}
          activeSection={activeSection}
          onSection={handleSection}
          onExit={onExit}
          color={color}
        />
        <SectionContent
          section={activeSection}
        color={sectionColor}
        sectionCount={caseStudy.sections.length}
        categoryLabel={caseStudy.categoryLabel}
        sequenceLabel={caseStudy.sequenceLabel}
        askOpen={askOpen}
        onToggleAsk={() => setAskOpen(open => !open)}
        />

        <aside style={{
          width:"340px",
          flexShrink:0,
          borderLeft:"1px solid rgba(200,180,130,0.07)",
          background:"rgba(6,7,12,0.95)",
          display:"flex",
          flexDirection:"column",
          overflow:"hidden",
        }}>
          {askOpen && (
            <AskPanel
              caseStudy={caseStudy}
              section={activeSection}
              color={sectionColor}
              onClose={() => setAskOpen(false)}
            />
          )}
          <EvidenceRail
            section={activeSection}
            color={color}
            railLabel={caseStudy.railLabel}
            artifactLabel={caseStudy.artifactLabel}
            emptyMessage={caseStudy.emptyRailMessage}
            onOpenEvidence={handleOpenEvidence}
          />
        </aside>

        {/* Evidence Viewer overlay */}
        {activeEvidence?.canvas ? (
          <FrameworkEvidenceCanvas
            items={activeSection.evidence.filter(
              (item) => item.canvas?.id === activeEvidence.canvas?.id,
            )}
            frameworkTitle={caseStudy.title}
            sectionTitle={activeSection.title}
            onClose={handleCloseEvidence}
          />
        ) : activeEvidence ? (
          <EvidenceViewer
            item={activeEvidence}
            color={color}
            section={activeSection}
            caseStudyTitle={caseStudy.title}
            onClose={handleCloseEvidence}
            onShare={handleShare}
          />
        ) : null}
      </div>
    </div>
  );
}
