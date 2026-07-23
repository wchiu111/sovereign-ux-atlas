import { useState } from "react";
import { STAR_ORBIT_R } from "../../data/atlasSystems";
import { planetLocalPos, starLocalPos } from "../../utils/atlasGeometry";
import type { Planet, StarSystem, ViewLevel } from "../../types/atlas";

interface AtlasPlanetProps {
  system: StarSystem;
  planet: Planet;
  level: ViewLevel;
  activeSystemId: string | null;
  activePlanetId: string | null;
  planetGroupRefs: React.MutableRefObject<Map<string, SVGGElement>>;
  planetLineRefs: React.MutableRefObject<Map<string, SVGLineElement>>;
  onSelect: (system: StarSystem, planet: Planet) => void;
}

export default function AtlasPlanet({
  system,
  planet,
  level,
  activeSystemId,
  activePlanetId,
  planetGroupRefs,
  planetLineRefs,
  onSelect,
}: AtlasPlanetProps) {
  const [hovered, setHovered] = useState(false);
  const active = activePlanetId === planet.id;
  const enabled = level >= 1 && activeSystemId === system.id;
  const initial = planetLocalPos(planet, 0);
  const foregroundBoost = Math.max(
    -0.08,
    Math.min(0.12, planet.orbitPlane * 0.045),
  );

  const opacity =
    level === 0
      ? 0.48 + foregroundBoost
      : activeSystemId !== system.id
        ? 0
        : level === 1
          ? 0.86 + foregroundBoost
          : active
            ? 1
            : 0.46 + foregroundBoost;

  const labelY = planet.orbitPlane > 0 ? -19 : -17;
  const labelOpacity = active
    ? 0.98
    : hovered && enabled
      ? 1
      : level === 0
        ? 0.7 + foregroundBoost
        : 0.58 + foregroundBoost;

  return (
    <g>
      <line
        ref={(element) => {
          if (element) planetLineRefs.current.set(planet.id, element);
          else planetLineRefs.current.delete(planet.id);
        }}
        x1={0}
        y1={0}
        x2={initial.x}
        y2={initial.y}
        stroke={system.color}
        strokeWidth="0.45"
        strokeOpacity={level === 0 ? 0.045 : 0}
        style={{
          transition: "stroke-opacity 0.5s",
          pointerEvents: "none",
        }}
      />

      <g
        ref={(element) => {
          if (element) planetGroupRefs.current.set(planet.id, element);
          else planetGroupRefs.current.delete(planet.id);
        }}
        transform={`translate(${initial.x},${initial.y}) scale(${initial.scale})`}
        opacity={opacity}
        style={{ transition: "opacity 0.5s" }}
      >
        <circle
          cx={0}
          cy={0}
          r={active ? 32 : hovered && enabled ? 42 : 27}
          fill={system.color}
          opacity={active ? 0.08 : hovered && enabled ? 0.12 : 0.018}
          style={{
            transition: "r 0.45s ease-out, opacity 0.45s ease-out",
          }}
        />

        <circle
          cx={0}
          cy={0}
          r={active ? 19 : hovered && enabled ? 25 : 14}
          fill={system.color}
          opacity={active ? 0.3 : hovered && enabled ? 0.58 : 0.25}
          filter={
            hovered || active
              ? `url(#glow-${system.id})`
              : "url(#glow-sm)"
          }
          style={{
            transition: "r 0.45s ease-out, opacity 0.45s ease-out",
          }}
        />

        <circle
          cx={0}
          cy={0}
          r={active ? 6.4 : hovered && enabled ? 5.8 : 4.2}
          fill={system.color}
          opacity="0.98"
          filter={
            hovered || active
              ? `url(#glow-${system.id})`
              : "url(#glow-sm)"
          }
          style={{ transition: "r 0.3s ease-out" }}
        />

        <circle
          cx={0}
          cy={0}
          r={hovered && enabled ? 20 : 0}
          fill="none"
          stroke={system.color}
          strokeWidth="0.65"
          strokeOpacity={hovered && enabled ? 0.62 : 0}
          strokeDasharray="3 6"
          style={{
            transition: "r 0.3s ease-out, stroke-opacity 0.3s ease-out",
          }}
        />

        <circle
          cx={0}
          cy={0}
          r={30}
          fill="transparent"
          onClick={(event) => {
            event.stopPropagation();
            if (enabled) onSelect(system, planet);
          }}
          onMouseEnter={(event) => {
            event.stopPropagation();
            setHovered(true);
          }}
          onMouseLeave={(event) => {
            event.stopPropagation();
            setHovered(false);
          }}
          style={{ cursor: enabled ? "crosshair" : "default" }}
        />

        <text
          data-atlas-attention-label
          data-atlas-relation={system.id}
          x={planet.orbitPlane * 1.5}
          y={labelY}
          textAnchor="middle"
          fontSize="7.2"
          fontFamily="'DM Mono',monospace"
          fontWeight="500"
          letterSpacing="1.45"
          fill={system.color}
          opacity={labelOpacity}
          paintOrder="stroke"
          stroke="#070811"
          strokeWidth="1.8"
          strokeOpacity="0.88"
          style={{
            transition:
              "opacity 180ms ease-out, filter 180ms ease-out, transform 180ms ease-out",
            pointerEvents: "none",
            willChange: "opacity, filter, transform",
          }}
        >
          {planet.label}
        </text>

        {active && level === 2 && (
          <g>
            <circle
              cx={0}
              cy={0}
              r={STAR_ORBIT_R}
              fill="none"
              stroke={system.color}
              strokeWidth="0.35"
              strokeOpacity="0.08"
              strokeDasharray="3 7"
            />

            {planet.stars.map((star) => {
              const position = starLocalPos(star);

              return (
                <g key={star.id}>
                  <line
                    x1={0}
                    y1={0}
                    x2={position.x}
                    y2={position.y}
                    stroke={system.color}
                    strokeWidth="0.35"
                    strokeOpacity="0.15"
                    style={{ pointerEvents: "none" }}
                  />

                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={8}
                    fill={system.color}
                    opacity="0.05"
                  />

                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={2.5}
                    fill={system.color}
                    opacity="0.62"
                    filter="url(#glow-sm)"
                  />

                  <text
                    x={position.x}
                    y={position.y - 8}
                    textAnchor="middle"
                    fontSize="4.8"
                    fontFamily="'DM Mono',monospace"
                    letterSpacing="1.1"
                    fill={system.color}
                    opacity="0.62"
                    paintOrder="stroke"
                    stroke="#070811"
                    strokeWidth="1.2"
                    style={{ pointerEvents: "none" }}
                  >
                    {star.label}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </g>
    </g>
  );
}
