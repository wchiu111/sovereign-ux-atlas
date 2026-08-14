import React, { useMemo } from "react";
import "./atlasStarfieldExploration.css";

const PALETTE = [
  "#F4EBD0","#E8DAB8","#D8C79A","#C8AE78",
  "#E7E6F0","#D0D3DE","#BCC7D2","#B8ADCA","#A79BB9","#F7F4EC"
];

function rng(seed:number){
  let s=seed;
  return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}
}

function stars(count:number,seed:number){
  const r=rng(seed);
  return Array.from({length:count},()=>{
    const d=r();
    const layer=d<.73?"deep":d<.95?"mid":"near";
    const size=layer==="deep"?.35+r()*.55:layer==="mid"?.75+r()*1.15:1.6+r()*2.4;
    const opacity=layer==="deep"?.06+r()*.14:layer==="mid"?.16+r()*.24:.34+r()*.34;
    return {
      x:r()*100,y:r()*100,size,opacity,
      color:PALETTE[Math.floor(r()*PALETTE.length)],
      layer,delay:-r()*24,duration:12+r()*18
    };
  });
}

function StarLayer({items,layer,dim=1}:{items:any[],layer:string,dim?:number}){
  return <div className={`sf-star-layer sf-${layer}`}>
    {items.filter(s=>s.layer===layer).map((s,i)=>
      <span key={i} className="sf-star" style={{
        left:`${s.x}%`,top:`${s.y}%`,width:s.size,height:s.size,
        opacity:s.opacity*dim,background:s.color,
        animationDelay:`${s.delay}s`,animationDuration:`${s.duration}s`
      }}/>
    )}
  </div>;
}

function NebulaField(){
  return <div className="sf-nebula-field">
    <div className="sf-haze sf-haze-frameworks"/>
    <div className="sf-haze sf-haze-cases"/>
    <div className="sf-haze sf-haze-experiments"/>
    <div className="sf-haze sf-haze-sovereign"/>

    <div className="sf-cloud cloud-a"/>
    <div className="sf-cloud cloud-b"/>
    <div className="sf-cloud cloud-c"/>
    <div className="sf-cloud cloud-d"/>
    <div className="sf-cloud cloud-e"/>

    <div className="sf-dust dust-a"/>
    <div className="sf-dust dust-b"/>
    <div className="sf-dust dust-c"/>
    <div className="sf-dust dust-d"/>

    <div className="sf-occ occ-a"/>
    <div className="sf-occ occ-b"/>
    <div className="sf-occ occ-c"/>
  </div>;
}

function Nodes(){
  return <div className="sf-nodes">
    <div className="node center"><i className="core gold"/><b>SOVEREIGN DESIGN</b></div>
    <div className="node left"><i className="core green"/><b>FRAMEWORKS</b></div>
    <div className="node right"><i className="core blue"/><b>CASE STUDIES</b></div>
    <div className="node bottom"><i className="core violet"/><b>EXPERIMENTS</b></div>
  </div>;
}

export default function AtlasStarfieldExploration(){
  const items=useMemo(()=>stars(1280,41759),[]);
  return <main className="sf-page">
    <section className="intro">
      <div>
        <span className="eyebrow">SOVEREIGN ATLAS / ENVIRONMENT STUDY</span>
        <h1>Atlas Deep Field</h1>
      </div>
      <p>
        Stronger environmental pass: denser deep-space texture, irregular gas clouds,
        broken dust lanes and localized atmospheric color while preserving Atlas hierarchy.
      </p>
    </section>

    <section className="study">
      <header>
        <div>
          <span className="eyebrow">05 / DEEP FIELD REFINEMENT</span>
          <h2>Atmosphere without competition</h2>
          <p>Gas and dust should read as structure in the environment, not as decorative gradients.</p>
        </div>
        <em>Recommended stronger pass</em>
      </header>

      <div className="stage">
        <div className="space"/>
        <StarLayer items={items} layer="deep" dim={.74}/>
        <NebulaField/>
        <div className="sf-grain"/>
        <div className="mask"/>
        <StarLayer items={items} layer="mid" dim={.72}/>
        <StarLayer items={items} layer="near" dim={.72}/>
        <Nodes/>
      </div>
    </section>
  </main>;
}