import { motion, useReducedMotion } from "motion/react";

const evidence = [
  { x: 12, y: 20, delay: 0.2 },
  { x: 8, y: 38, delay: 0.45 },
  { x: 16, y: 56, delay: 0.7 },
];

export default function CaseStudyPreview() {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0.01 : 8.4;

  return (
    <svg viewBox="0 0 100 72" aria-hidden="true" style={{ width: "100%", height: "100%" }}>
      <defs>
        <filter id="case-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {evidence.map((item, index) => (
        <motion.g
          key={index}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: [0, 0.8, 0.8, 0], x: [-4, 0, 5, 9] }}
          transition={{ duration, delay: item.delay, times: [0.05, 0.2, 0.68, 0.9], repeat: Infinity, ease: "easeInOut" }}
        >
          <rect x={item.x} y={item.y} width="9" height="7" rx="1.2" fill="rgba(140,200,238,0.08)" stroke="#8CC8EE" strokeOpacity="0.55" strokeWidth="0.45" />
          <line x1={item.x + 2} y1={item.y + 2.4} x2={item.x + 7} y2={item.y + 2.4} stroke="#D9F0FF" strokeOpacity="0.5" strokeWidth="0.35" />
          <line x1={item.x + 2} y1={item.y + 4.5} x2={item.x + 6} y2={item.y + 4.5} stroke="#8CC8EE" strokeOpacity="0.32" strokeWidth="0.3" />
        </motion.g>
      ))}

      <motion.path
        d="M 23 23 C 34 23, 34 34, 44 34 M 19 41 C 31 41, 33 36, 44 34 M 27 59 C 36 55, 38 43, 44 34"
        fill="none" stroke="#8CC8EE" strokeWidth="0.45" strokeOpacity="0.55"
        pathLength="1"
        animate={{ pathLength: [0, 0, 1, 1, 0], opacity: [0, 0, 0.62, 0.62, 0] }}
        transition={{ duration, times: [0, 0.18, 0.42, 0.74, 0.92], repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.g animate={{ opacity: [0.2, 1, 0.75, 0], scale: [0.82, 1.12, 1, 0.8] }} transition={{ duration, times: [0.18, 0.46, 0.76, 0.93], repeat: Infinity }} style={{ transformOrigin: "48px 34px" }}>
        <circle cx="48" cy="34" r="8" fill="#8CC8EE" opacity="0.08" />
        <circle cx="48" cy="34" r="3.4" fill="#8CC8EE" filter="url(#case-glow)" />
      </motion.g>

      <motion.path d="M 52 34 C 62 34, 68 34, 76 34" fill="none" stroke="#D9F0FF" strokeWidth="0.55" pathLength="1"
        animate={{ pathLength: [0, 0, 1, 1, 0], opacity: [0, 0, 0.8, 0.8, 0] }}
        transition={{ duration, times: [0, 0.42, 0.62, 0.8, 0.95], repeat: Infinity }} />
      <motion.g animate={{ opacity: [0, 0, 1, 0.8, 0], scale: [0.7, 0.7, 1.12, 1, 0.7] }} transition={{ duration, times: [0, 0.48, 0.68, 0.82, 0.96], repeat: Infinity }} style={{ transformOrigin: "82px 34px" }}>
        <circle cx="82" cy="34" r="8" fill="#8CC8EE" opacity="0.07" />
        <circle cx="82" cy="34" r="3" fill="#D9F0FF" filter="url(#case-glow)" />
        <circle cx="82" cy="34" r="6" fill="none" stroke="#8CC8EE" strokeOpacity="0.48" strokeWidth="0.45" />
      </motion.g>
    </svg>
  );
}
