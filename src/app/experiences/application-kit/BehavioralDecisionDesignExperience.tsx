import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { resolveStellarColor } from "../../atlas/constellation/stellarPalette";
import ProgressiveBehaviorCanvas from "./ProgressiveBehaviorCanvas";
import AppliedBehaviorCanvas from "./AppliedBehaviorCanvas";
import ExperienceAnnotation from "./ExperienceAnnotation";
import behavioralFrameworkSpaceBg from "./assets/behavioral-framework-space-bg.png";
import {
  BEHAVIORAL_STAGES,
  CHECKLIST,
  type BehavioralStageId,
} from "./behavioralDecisionDesignData";

interface BehavioralDecisionDesignExperienceProps {
  systemColor: string;
  onExit: () => void;
}
type ExperienceMode = "learn" | "apply" | "explore";

export default function BehavioralDecisionDesignExperience({ systemColor, onExit }: BehavioralDecisionDesignExperienceProps) {
  const [revealedCount, setRevealedCount] = useState(1);
  const [activeStageId, setActiveStageId] = useState<BehavioralStageId>("interpret");
  const [mode, setMode] = useState<ExperienceMode>("learn");
  const reducedMotion = useReducedMotion();
  const activeStage = BEHAVIORAL_STAGES.find((stage) => stage.id === activeStageId) ?? BEHAVIORAL_STAGES[0];
  const moduleColor = resolveStellarColor("agentic", systemColor);
  const stageColor = resolveStellarColor(activeStage.colorRole, systemColor);
  const resolveColor = useMemo(() => (role: (typeof BEHAVIORAL_STAGES)[number]["colorRole"]) => resolveStellarColor(role, systemColor), [systemColor]);
  const complete = revealedCount >= BEHAVIORAL_STAGES.length;
  const advance = () => {
    if (complete) return;
    const nextCount = Math.min(BEHAVIORAL_STAGES.length, revealedCount + 1);
    setRevealedCount(nextCount);
    setActiveStageId(BEHAVIORAL_STAGES[nextCount - 1].id);
  };

  return (
    <motion.section role="dialog" aria-modal="true" aria-labelledby="behavioral-design-title"
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.996 }} animate={{ opacity: 1, scale: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.998 }}
      transition={{ duration: reducedMotion ? 0.18 : 0.56, ease: [0.16, 1, 0.3, 1] }}
      style={{ position:"absolute", inset:0, zIndex:64, display:"grid", gridTemplateRows:"64px minmax(0,1fr)", overflow:"hidden", color:"#F4EBD0", background:"#030409" }}>
      <div aria-hidden="true" style={{ position:"absolute", inset:"-7%", zIndex:0, pointerEvents:"none", backgroundImage:`url(${behavioralFrameworkSpaceBg})`, backgroundSize:"cover", backgroundPosition:"center center", transform:"scale(1.03)", filter:"saturate(.78) brightness(.62) contrast(1.04)" }} />
      <div aria-hidden="true" style={{ position:"absolute", inset:0, zIndex:1, pointerEvents:"none", background:"radial-gradient(circle at 48% 46%, rgba(3,4,9,.04) 0%, rgba(3,4,9,.18) 46%, rgba(3,4,9,.42) 100%), linear-gradient(180deg, rgba(3,4,9,.08), rgba(3,4,9,.30))" }} />
      <header style={{ position:"relative", zIndex:3, display:"flex", alignItems:"center", justifyContent:"space-between", gap:20, padding:"0 24px", borderBottom:"1px solid rgba(245,235,210,.08)", background:"rgba(3,4,9,.20)", backdropFilter:"blur(6px)" }}>
        <button type="button" onClick={onExit} style={{ minHeight:44, padding:"0 10px 0 0", border:0, background:"transparent", color:"rgba(200,180,130,.78)", fontFamily:"'DM Mono',monospace", fontSize:9.5, letterSpacing:".14em", textTransform:"uppercase", cursor:"pointer" }}>
          <span style={{ color:moduleColor, marginRight:9 }}>←</span>Behavior &amp; Authority
        </button>
        <div style={{ minWidth:0, textAlign:"center" }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8.5, letterSpacing:".18em", textTransform:"uppercase", color:"rgba(200,180,130,.62)" }}>Behavioral &amp; Decision Design</div>
          <div id="behavioral-design-title" style={{ marginTop:3, fontFamily:"'EB Garamond',serif", fontSize:18, color:"rgba(255,248,230,.94)" }}>Experience the framework</div>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {([["learn","Learn"],["apply","Apply"],["explore","Explore"]] as [ExperienceMode,string][]).map(([id,label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              aria-pressed={mode === id}
              style={{
                minHeight: 42,
                padding: "0 12px",
                border: mode === id
                  ? `1px solid ${moduleColor}55`
                  : "1px solid transparent",
                background: mode === id
                  ? `${moduleColor}0B`
                  : "transparent",
                color: mode === id
                  ? "rgba(245,235,210,.90)"
                  : "rgba(245,235,210,.50)",
                fontFamily: "'DM Mono',monospace",
                fontSize: 9,
                letterSpacing: ".115em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </header>
      <main style={{ position:"relative", zIndex:2, minWidth:0, minHeight:"calc(100dvh - 64px)", overflow:mode==="learn"?"visible":"auto", scrollbarWidth:"none", padding:mode==="learn"?"22px 28px 0":"22px 28px 44px" }}>
        <AnimatePresence mode="wait">
          {mode==="learn" && <motion.div key="learn" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:"relative",minHeight:"calc(100dvh - 86px)",overflow:"visible"}}>
            <div style={{maxWidth:1120,margin:"12px auto 0",padding:"0 24px",textAlign:"center"}}>
              <div style={{fontFamily:"'EB Garamond',serif",fontSize:"clamp(30px, 2.2vw, 36px)",lineHeight:1.28,color:"rgba(255,248,230,.95)",textShadow:"0 2px 18px rgba(0,0,0,.34)"}}>Complex systems reveal themselves at the pace understanding is formed.</div>
              <div style={{marginTop:12,fontFamily:"'EB Garamond',serif",fontSize:"clamp(16.5px, 1.1vw, 18px)",lineHeight:1.55,color:"rgba(245,235,210,.64)"}}>Begin with one point of attention. Commit when it makes sense. The next relationship appears only after context exists.</div>
            </div>
            <ProgressiveBehaviorCanvas stages={BEHAVIORAL_STAGES} revealedCount={revealedCount} activeStageId={activeStageId} onCommitStage={setActiveStageId} onAdvance={advance} onRevealAll={()=>setRevealedCount(BEHAVIORAL_STAGES.length)} onApply={()=>setMode("apply")} resolveColor={resolveColor}/>
          </motion.div>}
          {mode==="apply" && <motion.div key="apply" initial={reducedMotion?{opacity:0}:{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:reducedMotion?0.16:0.5,ease:[0.16,1,0.3,1]}}>
            <div style={{maxWidth:800,margin:"12px auto 24px",textAlign:"center"}}>
              <div style={{fontFamily:"'EB Garamond',serif",fontSize:"clamp(27px, 1.8vw, 32px)",color:"rgba(255,248,230,.92)"}}>See what changes when the framework is applied.</div>
              <div style={{marginTop:8,fontFamily:"'EB Garamond',serif",fontSize:"clamp(16px, 1vw, 17.5px)",lineHeight:1.55,color:"rgba(245,235,210,.58)"}}>Same scenario. Same recommendation engine. Different behavioral design.</div>
            </div>
            <AppliedBehaviorCanvas />
          </motion.div>}
          {mode==="explore" && <motion.div key="explore" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) 350px",gap:22,maxWidth:1180,margin:"18px auto 0"}}>
            <section style={{padding:22,border:"1px solid rgba(245,235,210,.07)",background:"rgba(3,4,9,.72)",backdropFilter:"blur(12px)"}}>
              <div style={{marginBottom:16,fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".17em",textTransform:"uppercase",color:"rgba(101,214,154,.68)"}}>Implementation reflection</div>
              <div style={{display:"grid",gap:10}}>{CHECKLIST.map(item=><div key={item} style={{display:"grid",gridTemplateColumns:"16px 1fr",gap:9,fontFamily:"'EB Garamond',serif",fontSize:15,lineHeight:1.52,color:"rgba(245,235,210,.66)"}}><span style={{color:"rgba(101,214,154,.68)"}}>◇</span><span>{item}</span></div>)}</div>
            </section>
            <ExperienceAnnotation stage={activeStage} color={stageColor}/>
          </motion.div>}
        </AnimatePresence>
      </main>
    </motion.section>
  );
}
