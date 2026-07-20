import { motion, useReducedMotion } from "motion/react";

const nodes = [
  [22, 22], [50, 14], [78, 22], [84, 42], [72, 60], [28, 60], [16, 42],
] as const;

export default function FrameworkPreview() {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0.01 : 9;

  return (
    <svg viewBox="0 0 100 72" aria-hidden="true" style={{ width: "100%", height: "100%" }}>
      <defs>
        <filter id="framework-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <motion.g
        animate={{ rotate: [0, 0, 3, 0], opacity: [0.3, 1, 1, 0] }}
        transition={{ duration, times: [0.04, 0.28, 0.78, 0.96], repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50px 38px" }}
      >
        {nodes.map(([x, y], index) => (
          <motion.line key={`radial-${index}`} x1="50" y1="38" x2={x} y2={y} stroke="#6ED7A0" strokeWidth="0.42" pathLength="1"
            animate={{ pathLength: [0, 0, 1, 1, 0], opacity: [0, 0, 0.42, 0.42, 0] }}
            transition={{ duration, delay: index * 0.06, times: [0, 0.2, 0.48, 0.8, 0.96], repeat: Infinity }} />
        ))}
        {nodes.map(([x, y], index) => {
          const next = nodes[(index + 1) % nodes.length];
          return <motion.line key={`outer-${index}`} x1={x} y1={y} x2={next[0]} y2={next[1]} stroke="#6ED7A0" strokeWidth="0.32" pathLength="1"
            animate={{ pathLength: [0, 0, 1, 1, 0], opacity: [0, 0, 0.32, 0.32, 0] }}
            transition={{ duration, delay: 0.35 + index * 0.05, times: [0, 0.22, 0.52, 0.82, 0.96], repeat: Infinity }} />;
        })}
        {nodes.map(([x, y], index) => (
          <motion.g key={`node-${index}`} animate={{ opacity: [0.15, 1, 0.85, 0], scale: [0.7, 1.12, 1, 0.7] }} transition={{ duration, delay: index * 0.06, times: [0.05, 0.34, 0.8, 0.96], repeat: Infinity }} style={{ transformOrigin: `${x}px ${y}px` }}>
            <circle cx={x} cy={y} r="5.8" fill="#6ED7A0" opacity="0.06" />
            <circle cx={x} cy={y} r="2.5" fill="#6ED7A0" filter="url(#framework-glow)" />
          </motion.g>
        ))}
      </motion.g>

      <motion.g animate={{ opacity: [0.2, 1, 0.88, 0], scale: [0.78, 1.1, 1, 0.76] }} transition={{ duration, times: [0.04, 0.24, 0.82, 0.97], repeat: Infinity }} style={{ transformOrigin: "50px 38px" }}>
        <circle cx="50" cy="38" r="12" fill="#6ED7A0" opacity="0.06" />
        <circle cx="50" cy="38" r="6.5" fill="none" stroke="#6ED7A0" strokeOpacity="0.4" strokeWidth="0.5" strokeDasharray="2 2" />
        <circle cx="50" cy="38" r="3.5" fill="#A8F0C8" filter="url(#framework-glow)" />
      </motion.g>
    </svg>
  );
}
