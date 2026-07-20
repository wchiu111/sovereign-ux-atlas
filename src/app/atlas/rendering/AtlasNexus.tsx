interface AtlasNexusProps {
  x: number;
  y: number;
  level: number;
  hovered: boolean;
  onHoverChange: (hovered: boolean) => void;
}

export default function AtlasNexus({
  x,
  y,
  level,
  hovered,
  onHoverChange,
}: AtlasNexusProps) {
  return (
    <g opacity={level === 0 ? 1 : 0.25} style={{ transition: "opacity 0.5s" }}>
      {[
        { r: 27, dur: "78s", f: "0", t: "360", d: "5 10", op: hovered ? 0.42 : 0.24, sw: 0.6 },
        { r: 68, dur: "112s", f: "360", t: "0", d: "3 14", op: hovered ? 0.26 : 0.16, sw: 0.5 },
        { r: 96, dur: "158s", f: "0", t: "360", d: "8 22", op: hovered ? 0.16 : 0.09, sw: 0.38 },
        { r: 130, dur: "205s", f: "360", t: "0", d: "2 20", op: hovered ? 0.1 : 0.06, sw: 0.28 },
      ].map(({ r, dur, f, t, d, op, sw }, index) => (
        <circle
          key={index}
          cx={x}
          cy={y}
          r={hovered ? r * 1.05 : r}
          fill="none"
          stroke="#E8C86D"
          strokeWidth={sw}
          strokeOpacity={op}
          strokeDasharray={d}
          style={{ transition: "r 0.45s ease-out, stroke-opacity 0.45s ease-out" }}
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from={`${f} ${x} ${y}`}
            to={`${t} ${x} ${y}`}
            dur={dur}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      <circle cx={x} cy={y} r={hovered ? 68 : 36} fill="#E8C86D" opacity={hovered ? 0.16 : 0.08}
        style={{ transition: "r 0.45s ease-out, opacity 0.45s ease-out" }} />
      <circle cx={x} cy={y} r={hovered ? 34 : 19} fill="#E8C86D" opacity={hovered ? 0.34 : 0.25}
        filter="url(#glow-nexus)" style={{ transition: "r 0.42s ease-out, opacity 0.42s ease-out" }} />
      <circle cx={x} cy={y} r={hovered ? 47 : 30} fill="none" stroke="#E8C86D" strokeWidth="0.7"
        strokeDasharray="4 8" strokeOpacity={hovered ? 0.55 : 0}
        style={{ transition: "r 0.35s ease-out, stroke-opacity 0.35s ease-out" }} />
      <circle cx={x} cy={y} r={hovered ? 11 : 8} fill="#E8C86D" filter="url(#glow-nexus)"
        style={{ transition: "r 0.3s ease-out", cursor: "pointer" }} />
      <text x={x} y={y - 42} textAnchor="middle" fontSize="14" fontFamily="'EB Garamond',serif"
        fontWeight={600} fill="#E8C86D" letterSpacing="2.5" opacity={hovered ? 0.95 : 0.52}
        style={{ transition: "opacity 0.3s ease-out", pointerEvents: "none" }}>
        SOVEREIGN DESIGN
      </text>
      <circle cx={x} cy={y} r={70} fill="transparent"
        onMouseEnter={() => onHoverChange(true)} onMouseLeave={() => onHoverChange(false)}
        onClick={(event) => event.stopPropagation()} style={{ cursor: "crosshair" }} />
    </g>
  );
}
