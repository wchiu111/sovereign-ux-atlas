import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { APPLY_COMPARISON, type BehavioralStageId } from "./behavioralDecisionDesignData";
interface Props { mode:"without"|"with"; active:BehavioralStageId|null; }
const hi=(active:BehavioralStageId|null,id:BehavioralStageId)=>active===null||active===id?1:.32;
export default function RecommendationComparison({mode,active}:Props){
 const reduced=useReducedMotion(); const withFramework=mode==="with"; const t={duration:reduced?.12:.46,ease:[0.16,1,0.3,1] as [number,number,number,number]};
 return <section style={{minHeight:500,padding:24,border:"1px solid rgba(245,235,210,.09)",background:"rgba(6,8,14,.78)",backdropFilter:"blur(14px)"}}>
  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".16em",textTransform:"uppercase",color:"rgba(200,180,130,.60)"}}>Example · meeting recommendation</div>
  <h2 style={{margin:"16px 0 0",fontFamily:"'EB Garamond',serif",fontSize:26,lineHeight:1.25,fontWeight:400,color:"rgba(255,248,230,.94)"}}>{APPLY_COMPARISON.scenario}</h2>
  <div style={{marginTop:22,display:"grid",gap:10}}>
   <AnimatePresence initial={false}>
    {withFramework&&<motion.div key="context" initial={{opacity:0,y:-8}} animate={{opacity:hi(active,"interpret"),y:0}} exit={{opacity:0,y:-6}} transition={t} style={{padding:16,border:"1px solid rgba(160,195,218,.18)",background:"rgba(160,195,218,.035)"}}>
      <Label>Observed context</Label><Body>{APPLY_COMPARISON.with.observed}</Body>
    </motion.div>}
    {withFramework&&<motion.div key="inference" initial={{opacity:0,y:-8}} animate={{opacity:hi(active,"separate"),y:0}} exit={{opacity:0,y:-6}} transition={{...t,delay:.05}} style={{padding:16,border:"1px solid rgba(205,180,90,.14)"}}>
      <Label>System inference</Label><Body>{APPLY_COMPARISON.with.inferred}</Body>
    </motion.div>}
    {withFramework&&<motion.div key="options" initial={{opacity:0,y:-8}} animate={{opacity:hi(active,"frame"),y:0}} exit={{opacity:0,y:-6}} transition={{...t,delay:.1}} style={{display:"grid",gap:7}}>
      <Label>Available paths</Label>{APPLY_COMPARISON.with.alternatives.map(o=><div key={o.time} style={{display:"grid",gridTemplateColumns:"150px 1fr",gap:12,padding:"11px 13px",border:o.recommended?"1px solid rgba(210,151,104,.34)":"1px solid rgba(245,235,210,.07)",background:o.recommended?"rgba(210,151,104,.05)":"rgba(3,4,9,.20)"}}><strong style={{fontFamily:"'EB Garamond',serif",fontSize:15.5,fontWeight:500}}>{o.time}</strong><span style={{fontFamily:"'EB Garamond',serif",fontSize:14.5,color:"rgba(245,235,210,.56)"}}>{o.tradeoff}</span></div>)}
    </motion.div>}
   </AnimatePresence>
   <motion.div layout transition={t} animate={{opacity:hi(active,"recommend")}} style={{padding:18,border:"1px solid rgba(210,151,104,.28)",background:"rgba(210,151,104,.055)"}}>
    <Label>Recommendation</Label><div style={{marginTop:7,fontFamily:"'EB Garamond',serif",fontSize:23,lineHeight:1.25,color:"rgba(255,248,230,.94)"}}>{APPLY_COMPARISON.recommendation}</div>
    {!withFramework&&<Body>{APPLY_COMPARISON.without.rationale}</Body>}
   </motion.div>
   <AnimatePresence initial={false}>
    {withFramework&&<motion.div key="confirm" initial={{opacity:0,y:8}} animate={{opacity:hi(active,"confirm"),y:0}} exit={{opacity:0,y:6}} transition={{...t,delay:.15}} style={{padding:16,border:"1px solid rgba(195,91,80,.18)"}}><Label>Confirm</Label><Body>{APPLY_COMPARISON.with.confirm}</Body></motion.div>}
   </AnimatePresence>
   <motion.div layout animate={{opacity:withFramework?hi(active,"act"):1}} transition={t} style={{display:"flex",gap:9,flexWrap:"wrap",paddingTop:4}}>
    <button style={primary}>{withFramework?APPLY_COMPARISON.with.primaryAction:APPLY_COMPARISON.without.primaryAction} →</button>
    <button style={secondary}>{withFramework?APPLY_COMPARISON.with.secondaryAction:APPLY_COMPARISON.without.secondaryAction}</button>
   </motion.div>
  </div>
 </section>
}
function Label({children}:{children:React.ReactNode}){return <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:".15em",textTransform:"uppercase",color:"rgba(200,180,130,.62)"}}>{children}</div>}
function Body({children}:{children:React.ReactNode}){return <div style={{marginTop:7,fontFamily:"'EB Garamond',serif",fontSize:16,lineHeight:1.45,color:"rgba(245,235,210,.68)"}}>{children}</div>}
const primary={minHeight:44,padding:"0 16px",border:"1px solid rgba(210,174,96,.72)",background:"rgba(210,174,96,.88)",color:"#090A0D",fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".12em",textTransform:"uppercase" as const,cursor:"pointer"};
const secondary={...primary,border:"1px solid rgba(245,235,210,.14)",background:"transparent",color:"rgba(245,235,210,.66)"};
