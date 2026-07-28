import { useState } from "react";
import type { Planet, StarSystem, ViewLevel } from "../../types/atlas";
import AtlasPlanet from "./AtlasPlanet";

interface AtlasSystemProps {
  system: StarSystem;
  initialPosition: { x: number; y: number; scale?: number };
  level: ViewLevel;
  activeSystemId: string | null;
  activePlanetId: string | null;
  systemGroupRefs: React.MutableRefObject<Map<string, SVGGElement>>;
  planetGroupRefs: React.MutableRefObject<Map<string, SVGGElement>>;
  outerGlowRefs: React.MutableRefObject<Map<string, SVGCircleElement>>;
  planetLineRefs: React.MutableRefObject<Map<string, SVGLineElement>>;
  onSelectSystem: (system: StarSystem) => void;
  onSelectPlanet: (system: StarSystem, planet: Planet) => void;
  onSystemHoverChange?: (
    system: StarSystem | null,
    anchor?: { x: number; y: number },
  ) => void;
}

export default function AtlasSystem({
  system,
  initialPosition,
  level,
  activeSystemId,
  activePlanetId,
  systemGroupRefs,
  planetGroupRefs,
  outerGlowRefs,
  planetLineRefs,
  onSelectSystem,
  onSelectPlanet,
  onSystemHoverChange,
}: AtlasSystemProps) {
  const [hovered, setHovered] = useState(false);
  const active = activeSystemId === system.id;
  const baseRadius = system.size * 4;
  const opacity = level === 0 ? 1 : active ? 1 : 0.08;
  const interactive = level === 0;
  const depthSortedPlanets = [...system.planets].sort(
    (a, b) => a.orbitPlane - b.orbitPlane,
  );

  return (
    <g
      ref={element => {
        if (element) systemGroupRefs.current.set(system.id, element);
        else systemGroupRefs.current.delete(system.id);
      }}
      transform={`translate(${initialPosition.x},${initialPosition.y}) scale(${initialPosition.scale ?? 1})`}
      opacity={opacity}
      style={{ transition: "opacity 0.5s" }}
    >
      <circle
        cx={0}
        cy={0}
        r={system.planets[0].orbitR}
        fill="none"
        stroke={system.color}
        strokeWidth="0.35"
        strokeOpacity={level >= 1 && active ? 0.08 : 0.014}
        strokeDasharray="3 10"
        style={{ transition: "stroke-opacity 0.5s" }}
      />

      {[
        { r: 28, dur: "74s", f: "0", t: "360", d: "4 11", op: 0.13, sw: 0.48 },
        { r: 42, dur: "108s", f: "360", t: "0", d: "2 14", op: 0.07, sw: 0.36 },
      ].map((ring, index) => (
        <circle
          key={index}
          cx={0}
          cy={0}
          r={ring.r}
          fill="none"
          stroke={system.color}
          strokeWidth={ring.sw}
          strokeOpacity={hovered && interactive ? ring.op * 1.8 : ring.op}
          strokeDasharray={ring.d}
          style={{
            transition:
              "stroke-opacity 360ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from={`${ring.f} 0 0`}
            to={`${ring.t} 0 0`}
            dur={ring.dur}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      <circle
        ref={element => {
          if (element) outerGlowRefs.current.set(system.id, element);
          else outerGlowRefs.current.delete(system.id);
        }}
        cx={0}
        cy={0}
        r={hovered && interactive ? baseRadius * 3.2 : baseRadius * 2.05}
        fill={system.color}
        opacity={hovered && interactive ? 0.1 : 0.032}
        style={{
          transition:
            "r 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      />

      <circle
        cx={0}
        cy={0}
        r={hovered && interactive ? baseRadius * 1.7 : baseRadius * 0.92}
        fill={system.color}
        opacity={hovered && interactive ? 0.34 : 0.14}
        filter={`url(#glow-${system.id})`}
        style={{
          transition:
            "r 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      />

      <circle
        cx={0}
        cy={0}
        r={hovered && interactive ? baseRadius * 2 : baseRadius * 1.45}
        fill="none"
        stroke={system.color}
        strokeWidth="0.6"
        strokeDasharray="4 8"
        strokeOpacity={hovered && interactive ? 0.42 : 0}
        style={{
          transition:
            "r 0.35s cubic-bezier(0.16,1,0.3,1), stroke-opacity 0.35s cubic-bezier(0.16,1,0.3,1)",
        }}
      />

      <circle
        cx={0}
        cy={0}
        r={hovered && interactive ? system.size * 1.28 : system.size}
        fill={system.color}
        filter={`url(#glow-${system.id})`}
        style={{
          cursor: "pointer",
          transition: "r 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}
      />

      <circle
        cx={0}
        cy={0}
        r={baseRadius * 2.5}
        fill="transparent"
        onClick={event => {
          event.stopPropagation();
          if (interactive) onSelectSystem(system);
        }}
        onMouseEnter={event => {
          event.stopPropagation();
          if (!interactive) return;

          setHovered(true);
          const rect = event.currentTarget.getBoundingClientRect();
          onSystemHoverChange?.(system, {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          });
        }}
        onMouseLeave={event => {
          event.stopPropagation();
          setHovered(false);
          onSystemHoverChange?.(null);
        }}
        style={{ cursor: "crosshair" }}
      />

      <text
        data-atlas-attention-label
        data-atlas-relation={system.id}
        x={0}
        y={baseRadius * 2.2 + 14}
        textAnchor="middle"
        fontSize="12"
        fontFamily="'DM Mono',monospace"
        letterSpacing="1.8"
        fill={system.color}
        opacity={
          active
            ? 0.72
            : hovered && interactive
              ? 0.82
              : level === 0
                ? 0.42
                : 0.22
        }
        style={{
          transition:
            "opacity 180ms ease-out, filter 180ms ease-out, transform 180ms ease-out",
          pointerEvents: "none",
          willChange: "opacity, filter, transform",
        }}
      >
        {system.label}
      </text>

      {depthSortedPlanets.map(planet => (
        <AtlasPlanet
          key={planet.id}
          system={system}
          planet={planet}
          level={level}
          activeSystemId={activeSystemId}
          activePlanetId={activePlanetId}
          planetGroupRefs={planetGroupRefs}
          planetLineRefs={planetLineRefs}
          onSelect={onSelectPlanet}
        />
      ))}
    </g>
  );
}
