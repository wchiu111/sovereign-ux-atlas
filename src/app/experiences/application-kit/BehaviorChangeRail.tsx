import type { BehavioralStageId } from "./behavioralDecisionDesignData";
import { APPLY_CHANGE_NOTES } from "./behavioralDecisionDesignData";
interface Props { active: BehavioralStageId | null; onActiveChange:(id:BehavioralStageId|null)=>void; }
export default function BehaviorChangeRail({active,onActiveChange}:Props) {
 return <aside style={{alignSelf:"start",padding:"20px 18px",border:"1px solid rgba(245,235,210,.08)",background:"rgba(5,7,13,.66)",backdropFilter:"blur(12px)"}}>
  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".17em",textTransform:"uppercase",color:"rgba(200,180,130,.62)",marginBottom:14}}>What changed?</div>
  <div style={{display:"grid",gap:6}}>{APPLY_CHANGE_NOTES.map((item,index)=><button key={item.id} type="button"
    onMouseEnter={()=>onActiveChange(item.id)} onMouseLeave={()=>onActiveChange(null)} onFocus={()=>onActiveChange(item.id)} onBlur={()=>onActiveChange(null)}
    style={{display:"grid",gridTemplateColumns:"28px 88px 1fr",gap:8,alignItems:"start",padding:"10px 8px",border:"1px solid transparent",background:active===item.id?"rgba(245,235,210,.045)":"transparent",color:"inherit",textAlign:"left",cursor:"default"}}>
    <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"rgba(160,195,218,.72)"}}>{String(index+1).padStart(2,"0")}</span>
    <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(245,235,210,.72)"}}>{item.id}</span>
    <span style={{fontFamily:"'EB Garamond',serif",fontSize:14.5,lineHeight:1.35,color:"rgba(245,235,210,.58)"}}>{item.label}</span>
  </button>)}</div>
 </aside>
}
