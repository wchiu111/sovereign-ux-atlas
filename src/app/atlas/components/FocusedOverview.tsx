import { useEffect, useState } from "react";
import AtlasProjectIntelligenceDrawer, { PROJECT_DRAWER_WIDTH } from "../../components/AtlasProjectIntelligenceDrawer";
import applicationKitEntry from "../../content/frameworks/application-kit";
import type { Planet, StarSystem } from "../../types/atlas";

function wrapModuleTitle(title: string, maxCharacters = 18) {
  const words = title.split(" ");
  const lines: string[] = [];

  words.forEach(word => {
    const current = lines[lines.length - 1];
    if (!current || current.length + word.length + 1 > maxCharacters) {
      lines.push(word);
    } else {
      lines[lines.length - 1] = `${current} ${word}`;
    }
  });

  return lines.slice(0, 3);
}

interface FocusedOverviewProps {
  system: StarSystem;
  planet: Planet;
  onBack: () => void;
  onOpenStar: (index: number, anchor: { x: number; y: number }) => void;
  transitioning?: boolean;
}

export default function FocusedOverview({ system, planet, onBack, onOpenStar, transitioning = false }: FocusedOverviewProps) {
  const [visible, setVisible] = useState(false);
  const [hoveredStarId, setHoveredStarId] = useState<string | null>(null);
  const [dims, setDims] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    const resize = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", resize);
    return () => { clearTimeout(t); window.removeEventListener("resize", resize); };
  }, []);

  // Keep the constellation centered within the canvas that remains beside the project drawer.
  const drawerW = PROJECT_DRAWER_WIDTH;
  const availW = dims.w - drawerW;
  const cx = availW * 0.46;
  const cy = dims.h * 0.50;
  // Preserve generous spacing while preventing the outer nodes from colliding with the drawer.
  const orbitR = Math.min(availW * 0.25, dims.h * 0.30, 215);
  const applicationKitFamilies =
    planet.id === "application-kit" ? applicationKitEntry.collection?.families ?? [] : [];

  const starPositions = planet.stars.map((star, i) => {
    const angle = (i / planet.stars.length) * Math.PI * 2 - Math.PI / 2;
    return { star, x: cx + Math.cos(angle) * orbitR, y: cy + Math.sin(angle) * orbitR, angle };
  });

  return (
    <div
      className="absolute inset-0"
      style={{
        zIndex: 18,
        opacity: transitioning ? 0.16 : visible ? 1 : 0,
        transform: transitioning ? "scale(1.025)" : "scale(1)",
        transformOrigin: "center center",
        transition: transitioning
          ? "opacity 0.34s ease-out, transform 0.76s cubic-bezier(0.22,1,0.36,1)"
          : "opacity 0.55s ease-out, transform 0.55s ease-out",
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${dims.w} ${dims.h}`}
        onClick={onBack}
        style={{ cursor: "crosshair" }}
      >
        <defs>
          <filter id="fo-glow-lg" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="fo-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="fo-glow-sm" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Faint radial grid */}
        <g opacity="0.022" stroke={system.color} fill="none" strokeWidth="0.5">
          {[orbitR * 0.42, orbitR * 0.75, orbitR * 1.12, orbitR * 1.55, orbitR * 2.0].map((r, i) => (
            <circle key={i} cx={cx} cy={cy} r={r} />
          ))}
          {[0, 36, 72, 108, 144].map(d => {
            const rad = d * Math.PI / 180;
            return (
              <line key={d}
                x1={cx + Math.cos(rad) * orbitR * 2.2} y1={cy + Math.sin(rad) * orbitR * 2.2}
                x2={cx - Math.cos(rad) * orbitR * 2.2} y2={cy - Math.sin(rad) * orbitR * 2.2} />
            );
          })}
        </g>

        {/* Rotating orbital rings around planet center */}
        {[
          { r: orbitR * 0.30, dur: "65s",  f: "0",   t: "360", d: "5 11",  op: 0.28, sw: 0.70 },
          { r: orbitR * 0.46, dur: "95s",  f: "360", t: "0",   d: "3 15",  op: 0.16, sw: 0.52 },
          { r: orbitR * 0.62, dur: "125s", f: "0",   t: "360", d: "9 24",  op: 0.10, sw: 0.40 },
        ].map(({ r, dur, f, t, d, op, sw }, i) => (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={system.color}
            strokeWidth={sw} strokeOpacity={op} strokeDasharray={d}>
            <animateTransform attributeName="transform" attributeType="XML" type="rotate"
              from={`${f} ${cx} ${cy}`} to={`${t} ${cx} ${cy}`}
              dur={dur} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Orbit path ring — static guide showing where child nodes live */}
        <circle cx={cx} cy={cy} r={orbitR}
          fill="none" stroke={system.color}
          strokeWidth="0.5" strokeOpacity="0.10" strokeDasharray="5 12" />

        {/* Structural connectors make the section nodes read as one project system. */}
        <g stroke={system.color} fill="none" pointerEvents="none">
          {starPositions.map(({ star, x, y }) => (
            <line
              key={`connector-${star.id}`}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              strokeWidth="0.55"
              strokeOpacity="0.075"
              strokeDasharray="2 9"
            />
          ))}
        </g>

        {/* Central planet — layered glow, larger and more authoritative */}
        <circle cx={cx} cy={cy} r={orbitR * 0.42} fill={system.color} opacity="0.035" />
        <circle cx={cx} cy={cy} r={orbitR * 0.28} fill={system.color} opacity="0.08"  filter="url(#fo-glow-lg)" />
        <circle cx={cx} cy={cy} r={orbitR * 0.16} fill={system.color} opacity="0.20"  filter="url(#fo-glow-lg)" />
        <circle cx={cx} cy={cy} r={orbitR * 0.08} fill={system.color} opacity="0.55"  filter="url(#fo-glow)" />
        <circle cx={cx} cy={cy} r={orbitR * 0.04} fill={system.color} opacity="0.92"  filter="url(#fo-glow)" />

        {/* Planet name — below the node, readable and bright */}
        <text
          x={cx} y={cy + orbitR * 0.48 + 22}
          textAnchor="middle"
          fontSize="16" fontFamily="'DM Mono',monospace"
          fill={system.color} letterSpacing="2.8" opacity="0.76"
        >
          {planet.label}
        </text>

        {/* Star child nodes */}
        {starPositions.map(({ star, x, y, angle }, index) => {
          const isHov = hoveredStarId === star.id;
          const applicationKitFamily = applicationKitFamilies.find(
            family => star.id === family.id || star.id.endsWith(`-${family.id}`),
          );
          const pulseDelay = `${index * 0.32}s`;

          // Label placed radially outside, pushed further from node center
          const labelDist = 30;
          const lx = x + Math.cos(angle) * labelDist;
          const ly = y + Math.sin(angle) * labelDist;
          const anchor =
            Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle)) * 1.1
              ? (x > cx ? "start" : "end")
              : "middle";
          const lyFinal = ly + (y < cy ? -6 : 8);

          return (
            <g
              key={star.id}
              onClick={e => {
                e.stopPropagation();
                onOpenStar(index, { x, y });
              }}
              onMouseEnter={e => { e.stopPropagation(); setHoveredStarId(star.id); }}
              onMouseLeave={e => { e.stopPropagation(); setHoveredStarId(null); }}
              style={{ cursor: "crosshair" }}
            >
              {/* Idle breathing halo — always present so nodes read as interactive */}
              <circle
                cx={x}
                cy={y}
                r={20}
                fill={system.color}
                opacity={isHov ? 0 : 0.055}
                filter="url(#fo-glow-sm)"
                style={{ transition: "opacity 0.25s ease-out" }}
              >
                {!isHov && (
                  <>
                    <animate
                      attributeName="r"
                      values="18;24;18"
                      dur="3.8s"
                      begin={pulseDelay}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.045;0.12;0.045"
                      dur="3.8s"
                      begin={pulseDelay}
                      repeatCount="indefinite"
                    />
                  </>
                )}
              </circle>

              {/* Hover outer halo */}
              <circle
                cx={x}
                cy={y}
                r={isHov ? 42 : 26}
                fill={system.color}
                opacity={isHov ? 0.15 : 0}
                style={{ transition: "r 0.35s ease-out, opacity 0.35s ease-out" }}
              />

              {/* Hover mid glow */}
              <circle
                cx={x}
                cy={y}
                r={isHov ? 25 : 12}
                fill={system.color}
                opacity={isHov ? 0.34 : 0}
                filter="url(#fo-glow-sm)"
                style={{ transition: "r 0.30s ease-out, opacity 0.30s ease-out" }}
              />

              {/* Dashed accent ring — breathing at rest, brighter on hover */}
              <circle
                cx={x}
                cy={y}
                r={isHov ? 18 : 14}
                fill="none"
                stroke={system.color}
                strokeWidth="0.8"
                strokeDasharray="3 6"
                strokeOpacity={isHov ? 0.68 : 0.32}
                style={{ transition: "r 0.30s ease-out, stroke-opacity 0.30s ease-out" }}
              >
                {!isHov && (
                  <animate
                    attributeName="stroke-opacity"
                    values="0.24;0.48;0.24"
                    dur="3.8s"
                    begin={pulseDelay}
                    repeatCount="indefinite"
                  />
                )}
              </circle>

              {/* Core glow — breathing at rest */}
              <circle
                cx={x}
                cy={y}
                r={isHov ? 10 : 9}
                fill={system.color}
                opacity={isHov ? 0.26 : 0.18}
                filter="url(#fo-glow-sm)"
                style={{ transition: "r 0.30s ease-out, opacity 0.30s ease-out" }}
              >
                {!isHov && (
                  <>
                    <animate
                      attributeName="r"
                      values="8;11;8"
                      dur="3.8s"
                      begin={pulseDelay}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.14;0.25;0.14"
                      dur="3.8s"
                      begin={pulseDelay}
                      repeatCount="indefinite"
                    />
                  </>
                )}
              </circle>

              {/* Core */}
              <circle
                cx={x}
                cy={y}
                r={isHov ? 6.2 : 4.7}
                fill={system.color}
                opacity={isHov ? 0.98 : 0.86}
                filter="url(#fo-glow-sm)"
                style={{ transition: "r 0.25s ease-out, opacity 0.25s ease-out" }}
              >
                {!isHov && (
                  <>
                    <animate
                      attributeName="r"
                      values="4.3;5.4;4.3"
                      dur="3.8s"
                      begin={pulseDelay}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.72;0.96;0.72"
                      dur="3.8s"
                      begin={pulseDelay}
                      repeatCount="indefinite"
                    />
                  </>
                )}
              </circle>

              {/* Hit area */}
              <circle
                cx={x}
                cy={y}
                r={34}
                fill="transparent"
                style={{ cursor: "crosshair" }}
              />

              {/* Label */}
              <text
                x={lx}
                y={lyFinal}
                textAnchor={anchor}
                fontSize={isHov ? "10" : "9.5"}
                fontFamily="'DM Mono',monospace"
                letterSpacing="1.6"
                fill={system.color}
                opacity={isHov ? 0.98 : 0.74}
                style={{ transition: "opacity 0.30s ease-out, font-size 0.30s ease-out", pointerEvents: "none" }}
              >
                {star.label}
              </text>

              {/* Application Kit families preview their modules as a local outward arc. */}
              {isHov && applicationKitFamily && (
                <g
                  onClick={event => event.stopPropagation()}
                  style={{ cursor: "default" }}
                >
                  {applicationKitFamily.modules.map((module, moduleIndex) => {
                    const moduleCount = applicationKitFamily.modules.length;
                    const arcSweep = moduleCount > 3 ? Math.PI * 0.82 : Math.PI * 0.68;
                    const moduleAngle =
                      angle +
                      (moduleCount === 1
                        ? 0
                        : -arcSweep / 2 + (moduleIndex / (moduleCount - 1)) * arcSweep);
                    const arcRadius = Math.min(82, orbitR * 0.43);
                    const moduleX = x + Math.cos(moduleAngle) * arcRadius;
                    const moduleY = y + Math.sin(moduleAngle) * arcRadius;
                    const labelX = moduleX + Math.cos(moduleAngle) * 15;
                    const labelY = moduleY + Math.sin(moduleAngle) * 15;
                    const labelAnchor =
                      Math.cos(moduleAngle) > 0.25
                        ? "start"
                        : Math.cos(moduleAngle) < -0.25
                          ? "end"
                          : "middle";
                    const labelLines = wrapModuleTitle(module.title);

                    return (
                      <g key={module.id}>
                        <path
                          d={`M ${x + Math.cos(moduleAngle) * 25} ${y + Math.sin(moduleAngle) * 25} L ${moduleX} ${moduleY}`}
                          fill="none"
                          stroke={system.color}
                          strokeWidth="0.55"
                          strokeOpacity="0.28"
                          strokeDasharray="2 5"
                          style={{ pointerEvents: "none" }}
                        />
                        <circle
                          cx={moduleX}
                          cy={moduleY}
                          r="13"
                          fill={system.color}
                          opacity="0.055"
                          filter="url(#fo-glow-sm)"
                        />
                        <circle
                          cx={moduleX}
                          cy={moduleY}
                          r="7.5"
                          fill="none"
                          stroke={system.color}
                          strokeWidth="0.65"
                          strokeOpacity="0.42"
                          strokeDasharray="2 4"
                        />
                        <circle
                          cx={moduleX}
                          cy={moduleY}
                          r="3.2"
                          fill={system.color}
                          opacity="0.94"
                          filter="url(#fo-glow-sm)"
                        />
                        <circle cx={moduleX} cy={moduleY} r="14" fill="transparent" />
                        <text
                          x={labelX}
                          y={labelY - ((labelLines.length - 1) * 4)}
                          textAnchor={labelAnchor}
                          fontSize="6.2"
                          fontFamily="'DM Mono',monospace"
                          letterSpacing="0.65"
                          fill={system.color}
                          opacity="0.78"
                          style={{ pointerEvents: "none" }}
                        >
                          {labelLines.map((line, lineIndex) => (
                            <tspan key={line} x={labelX} dy={lineIndex === 0 ? 0 : 8}>
                              {line}
                            </tspan>
                          ))}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Tiny hover cue */}
              {isHov && !applicationKitFamily && (
                <g opacity="0.82" style={{ pointerEvents: "none" }}>
                  <rect
                    x={x - 18}
                    y={y + 22}
                    width="36"
                    height="15"
                    rx="7.5"
                    fill="rgba(5,6,12,0.78)"
                    stroke={system.color}
                    strokeOpacity="0.35"
                    strokeWidth="0.6"
                  />
                  <text
                    x={x}
                    y={y + 32.5}
                    textAnchor="middle"
                    fontSize="5.5"
                    fontFamily="'DM Mono',monospace"
                    letterSpacing="0.9"
                    fill={system.color}
                    opacity="0.86"
                  >
                    OPEN
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Focus Mode ────────────────────────────────────────────────────────────
