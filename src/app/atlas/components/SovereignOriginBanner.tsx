import { motion, useReducedMotion } from "motion/react";

const particles = [
  { x: 10, y: 48, r: 1.4, delay: 0.00, drift: -6 },
  { x: 17, y: 35, r: 1.0, delay: 0.12, drift: -14 },
  { x: 22, y: 61, r: 1.3, delay: 0.18, drift: 12 },
  { x: 29, y: 45, r: 0.9, delay: 0.28, drift: -8 },
  { x: 35, y: 26, r: 1.1, delay: 0.34, drift: -18 },
  { x: 41, y: 68, r: 1.0, delay: 0.40, drift: 15 },
  { x: 47, y: 39, r: 1.5, delay: 0.48, drift: -10 },
  { x: 54, y: 56, r: 1.1, delay: 0.58, drift: 9 },
  { x: 61, y: 30, r: 0.9, delay: 0.66, drift: -12 },
  { x: 67, y: 65, r: 1.2, delay: 0.74, drift: 14 },
  { x: 74, y: 45, r: 1.0, delay: 0.84, drift: -6 },
  { x: 81, y: 24, r: 1.3, delay: 0.92, drift: -15 },
  { x: 87, y: 59, r: 0.9, delay: 1.02, drift: 10 },
  { x: 93, y: 39, r: 1.1, delay: 1.10, drift: -8 },
];

const constellations = [
  "M42 31 L50 42 L58 30 L66 46",
  "M61 61 L70 50 L78 59 L87 42",
  "M28 53 L37 44 L46 60",
];

export default function SovereignOriginBanner() {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0.01 : 8;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        height: 112,
        margin: "-4px -8px 22px",
        overflow: "hidden",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 7%, black 93%, transparent 100%)",
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 7%, black 93%, transparent 100%)",
      }}
    >
      <svg
        viewBox="0 0 100 80"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <radialGradient id="origin-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF7D0" stopOpacity="1" />
            <stop offset="36%" stopColor="#E8C86D" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#E8C86D" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="energy-streak" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E8C86D" stopOpacity="0" />
            <stop offset="25%" stopColor="#F6E2A0" stopOpacity="0.86" />
            <stop offset="70%" stopColor="#E8C86D" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#E8C86D" stopOpacity="0" />
          </linearGradient>
          <filter id="origin-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration, times: [0, 0.08, 0.76, 0.9], repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.circle
            cx="5"
            cy="40"
            r="1"
            fill="url(#origin-core)"
            filter="url(#origin-glow)"
            animate={{ r: [1, 10, 5, 0], opacity: [0, 1, 0.42, 0] }}
            transition={{ duration, times: [0, 0.1, 0.28, 0.42], repeat: Infinity, ease: "easeOut" }}
          />

          {[0, 1, 2].map((ring) => (
            <motion.ellipse
              key={ring}
              cx="7"
              cy="40"
              rx="2"
              ry="2"
              fill="none"
              stroke="#E8C86D"
              strokeWidth={ring === 0 ? 0.5 : 0.25}
              animate={{
                rx: [2, 10 + ring * 6, 22 + ring * 12],
                ry: [2, 8 + ring * 4, 17 + ring * 7],
                opacity: [0, 0.62 - ring * 0.12, 0],
              }}
              transition={{
                duration,
                delay: ring * 0.12,
                times: [0.02, 0.18, 0.46],
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}

          <motion.path
            d="M 4 40 C 24 27, 48 54, 100 39"
            fill="none"
            stroke="url(#energy-streak)"
            strokeWidth="0.8"
            strokeLinecap="round"
            pathLength="1"
            animate={{ pathLength: [0, 1, 1], pathOffset: [0, 0, 1], opacity: [0, 0.85, 0] }}
            transition={{ duration, times: [0.04, 0.42, 0.78], repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.path
            d="M 3 43 C 28 56, 51 21, 100 48"
            fill="none"
            stroke="url(#energy-streak)"
            strokeWidth="0.42"
            strokeLinecap="round"
            pathLength="1"
            animate={{ pathLength: [0, 1, 1], pathOffset: [0, 0, 1], opacity: [0, 0.46, 0] }}
            transition={{ duration, delay: 0.25, times: [0.04, 0.4, 0.78], repeat: Infinity, ease: "easeInOut" }}
          />

          {particles.map((particle, index) => (
            <motion.circle
              key={index}
              cx={particle.x}
              cy={particle.y}
              r={particle.r}
              fill={index % 4 === 0 ? "#FFF1B8" : "#E8C86D"}
              filter={index % 3 === 0 ? "url(#origin-glow)" : undefined}
              animate={{
                x: [-14, 8, 28],
                y: [0, particle.drift * 0.28, particle.drift],
                opacity: [0, 0.95, 0.62, 0],
                scale: [0.4, 1.2, 0.9, 0.2],
              }}
              transition={{
                duration,
                delay: particle.delay,
                times: [0.04, 0.22, 0.58, 0.82],
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}

          {constellations.map((path, index) => (
            <motion.path
              key={path}
              d={path}
              fill="none"
              stroke="#E8C86D"
              strokeWidth="0.26"
              strokeDasharray="1.5 1.5"
              pathLength="1"
              animate={{ pathLength: [0, 1, 1], opacity: [0, 0.4, 0.4, 0] }}
              transition={{
                duration,
                delay: 1.4 + index * 0.2,
                times: [0.2, 0.38, 0.58, 0.72],
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.g>
      </svg>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(232,200,109,0.025), transparent 55%, rgba(232,200,109,0.035))",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
