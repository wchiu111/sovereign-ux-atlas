export const NEBULAE = [
  { cx:18,cy:24,w:55,h:44,color:"rgba(80,40,120,0.22)",blur:90 },
  { cx:64,cy:11,w:44,h:36,color:"rgba(20,80,100,0.18)",blur:75 },
  { cx:88,cy:47,w:34,h:46,color:"rgba(110,65,20,0.16)",blur:80 },
  { cx:28,cy:73,w:42,h:34,color:"rgba(40,90,65,0.16)",blur:75 },
  { cx:73,cy:80,w:38,h:30,color:"rgba(80,40,120,0.16)",blur:80 },
  { cx:50,cy:50,w:70,h:58,color:"rgba(120,90,20,0.08)",blur:130 },
];

export const STAR_COLORS_ARR = [
  "#F4EBD0","#EAD9B0","#D8C48A","#C8A96E","#E8E8F8",
  "#D0D0E8","#B8C4D8","#B8A8D0","#A090C0","#FFFFFF","#F8F4E8",
];

export interface Particle { x:number;y:number;vx:number;vy:number;size:number;baseOp:number;phase:number;speed:number;ci:number; }

export function mkParticles(w:number,h:number):Particle[] {
  return Array.from({length:1700},()=>{
    const r=Math.random();
    const size=r<0.75?0.28+Math.random()*0.5:r<0.93?0.78+Math.random()*0.8:1.6+Math.random()*1.4;
    return {x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.02,vy:(Math.random()-.5)*.02,
      size,baseOp:size<.85?.07+Math.random()*.28:.28+Math.random()*.55,
      phase:Math.random()*Math.PI*2,speed:.0003+Math.random()*.0007,ci:Math.floor(Math.random()*STAR_COLORS_ARR.length)};
  });
}
export const STAR_RGB_ARR = STAR_COLORS_ARR.map(h=>([parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)] as [number,number,number]));
