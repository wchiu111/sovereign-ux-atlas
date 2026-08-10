import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { BehavioralStageId } from "./behavioralDecisionDesignData";
import BehaviorChangeRail from "./BehaviorChangeRail";
import RecommendationComparison from "./RecommendationComparison";
type ComparisonMode="without"|"with";
export default function AppliedBehaviorCanvas(){
 const [mode,setMode]=useState<ComparisonMode>("without");
 const [active,setActive]=useState<BehavioralStageId|null>(null);
 const reduced=useReducedMotion();
 return <motion.div initial={reduced?{opacity:0}:{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:reduced?.16:.52,ease:[0.16,1,0.3,1]}} style={{width:"min(1180px,100%)",margin:"0 auto"}}>
  <div style={{display:"flex",justifyContent:"center",marginBottom:18}}>
   <div role="group" aria-label="Framework comparison" style={{display:"inline-grid",gridTemplateColumns:"1fr 1fr",padding:3,border:"1px solid rgba(245,235,210,.10)",background:"rgba(3,4,9,.54)"}}>
    {(["without","with"] as ComparisonMode[]).map(id=><button key={id} type="button" onClick={()=>setMode(id)} aria-pressed={mode===id} style={{minHeight:40,padding:"0 18px",border:mode===id?"1px solid rgba(160,195,218,.30)":"1px solid transparent",background:mode===id?"rgba(160,195,218,.07)":"transparent",color:mode===id?"rgba(255,248,230,.92)":"rgba(245,235,210,.46)",fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".13em",textTransform:"uppercase",cursor:"pointer"}}>{id==="without"?"Without framework":"With framework"}</button>)}
   </div>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(280px,340px)",gap:18,alignItems:"start"}}>
   <RecommendationComparison mode={mode} active={mode==="with"?active:null}/>
   <div style={{opacity:mode==="with"?1:.34,transition:"opacity .35s ease",pointerEvents:mode==="with"?"auto":"none"}}><BehaviorChangeRail active={active} onActiveChange={setActive}/></div>
  </div>
 </motion.div>
}
