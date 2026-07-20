import { motion, useReducedMotion } from "motion/react";

const branches = [
  { d: "M 31 36 C 45 36, 49 16, 66 16", end: [69, 16], delay: 0.0, invalid: false },
  { d: "M 31 36 C 47 36, 51 30, 70 30", end: [73, 30], delay: 0.12, invalid: true },
  { d: "M 31 36 C 47 36, 51 45, 68 46", end: [71, 46], delay: 0.22, invalid: true },
  { d: "M 31 36 C 44 38, 50 58, 72 58", end: [76, 58], delay: 0.34, invalid: false },
] as const;

export default function ExperimentPreview() {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0.01 : 8.6;

  return (
    <svg viewBox="0 0 100 72" aria-hidden="true" style={{ width: "100%", height: "100%" }}>
      <defs>
        <filter id="experiment-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <motion.g animate={{ opacity: [0.25, 1, 0.85, 0], scale: [0.85, 1.08, 1, 0.82] }} transition={{ duration, times: [0.04, 0.2, 0.78, 0.96], repeat: Infinity }} style={{ transformOrigin: "24px 36px" }}>
        <circle cx="24" cy="36" r="10" fill="#B394E8" opacity="0.08" />
        <circle cx="24" cy="36" r="4" fill="#C9B5F4" filter="url(#experiment-glow)" />
        <circle cx="24" cy="36" r="7" fill="none" stroke="#B394E8" strokeOpacity="0.45" strokeWidth="0.45" />
      </motion.g>
      <motion.path d="M 28 36 L 31 36" stroke="#E8DFFF" strokeWidth="0.7" pathLength="1" animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.8, 0.8, 0] }} transition={{ duration, times: [0.12, 0.26, 0.8, 0.94], repeat: Infinity }} />

      {branches.map((branch, index) => (
        <g key={branch.d}>
          <motion.path d={branch.d} fill="none" stroke="#B394E8" strokeWidth="0.48" strokeDasharray="1.5 1.2" pathLength="1"
            animate={{ pathLength: [0, 0, 1, 1, 0], opacity: [0, 0, 0.7, branch.invalid ? 0.18 : 0.65, 0] }}
            transition={{ duration, delay: branch.delay, times: [0, 0.18, 0.45, 0.76, 0.94], repeat: Infinity, ease: "easeInOut" }} />
          <motion.g animate={{ opacity: [0, 0, 1, branch.invalid ? 0.18 : 0.9, 0], scale: [0.5, 0.5, 1, branch.invalid ? 0.75 : 1, 0.5] }} transition={{ duration, delay: branch.delay, times: [0, 0.38, 0.54, 0.78, 0.95], repeat: Infinity }} style={{ transformOrigin: `${branch.end[0]}px ${branch.end[1]}px` }}>
            <circle cx={branch.end[0]} cy={branch.end[1]} r={branch.invalid ? 3.2 : 3.6} fill={branch.invalid ? "#5C4C72" : "#B394E8"} filter={!branch.invalid ? "url(#experiment-glow)" : undefined} />
            {branch.invalid && <path d={`M ${branch.end[0]-1.5} ${branch.end[1]-1.5} L ${branch.end[0]+1.5} ${branch.end[1]+1.5} M ${branch.end[0]+1.5} ${branch.end[1]-1.5} L ${branch.end[0]-1.5} ${branch.end[1]+1.5}`} stroke="#C9B5F4" strokeOpacity="0.55" strokeWidth="0.45" />}
          </motion.g>
          {index === 3 && (
            <motion.path d="M 76 51 L 77.6 56.2 L 83 58 L 77.6 59.8 L 76 65 L 74.4 59.8 L 69 58 L 74.4 56.2 Z" fill="#E8DFFF" filter="url(#experiment-glow)"
              animate={{ opacity: [0, 0, 0.2, 1, 0.2, 0], scale: [0.4, 0.4, 0.7, 1.2, 0.8, 0.4] }} transition={{ duration, times: [0, 0.52, 0.62, 0.72, 0.82, 0.95], repeat: Infinity }} style={{ transformOrigin: "76px 58px" }} />
          )}
        </g>
      ))}
    </svg>
  );
}
