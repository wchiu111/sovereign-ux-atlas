import { useEffect, useState } from "react";
import { PROJECT_DRAWER_WIDTH } from "../../components/AtlasProjectIntelligenceDrawer";
import applicationKitEntry from "../../content/frameworks/application-kit";
import type { Planet, StarSystem } from "../../types/atlas";
import {
  resolveConstellationNodes,
} from "../constellation/constellationGeometry";
import { resolveStellarColor } from "../constellation/stellarPalette";
import ApplicationKitModuleArc from "./ApplicationKitModuleArc";
import ConstellationConnections from "./ConstellationConnections";
import ConstellationNode from "./ConstellationNode";

interface FocusedOverviewProps {
  system: StarSystem;
  planet: Planet;
  onBack: () => void;
  onOpenStar: (index: number, anchor: { x: number; y: number }) => void;
  transitioning?: boolean;
}

export default function FocusedOverview({
  system,
  planet,
  onBack,
  onOpenStar,
  transitioning = false,
}: FocusedOverviewProps) {
  const [visible, setVisible] = useState(false);
  const [hoveredStarId, setHoveredStarId] = useState<string | null>(null);
  const [dims, setDims] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const revealTimer = window.setTimeout(() => setVisible(true), 20);
    const resize = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(motionQuery.matches);

    updateMotionPreference();
    window.addEventListener("resize", resize);
    motionQuery.addEventListener?.("change", updateMotionPreference);

    return () => {
      window.clearTimeout(revealTimer);
      window.removeEventListener("resize", resize);
      motionQuery.removeEventListener?.("change", updateMotionPreference);
    };
  }, []);

  // Keep the constellation centered within the canvas that remains beside the project drawer.
  const availableWidth = dims.w - PROJECT_DRAWER_WIDTH;
  const centerX = availableWidth * 0.46;
  const centerY = dims.h * 0.5;
  const orbitRadius = Math.min(availableWidth * 0.25, dims.h * 0.3, 215);
  const planetColor = resolveStellarColor(
    planet.signatureStellarType,
    system.color,
  );
  const applicationKitFamilies =
    planet.id === "application-kit"
      ? applicationKitEntry.collection?.families ?? []
      : [];

  const nodes = resolveConstellationNodes({
    stars: planet.stars,
    centerX,
    centerY,
    orbitRadius,
    domainColor: system.color,
    bounds: {
      width: availableWidth,
      height: dims.h,
      minX: 72,
      maxX: availableWidth - 82,
      minY: 76,
      maxY: dims.h - 88,
    },
  });

  return (
    <div
      className="absolute inset-0"
      style={{
        zIndex: 18,
        opacity: transitioning ? 0.16 : visible ? 1 : 0,
        transform: transitioning ? "scale(1.025)" : "scale(1)",
        transformOrigin: "center center",
        transition: reducedMotion
          ? "opacity 0.18s ease-out"
          : transitioning
            ? "opacity 0.34s ease-out, transform 0.76s cubic-bezier(0.16,1,0.3,1)"
            : "opacity 0.55s ease-out, transform 0.55s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${dims.w} ${dims.h}`}
        onClick={onBack}
        style={{ cursor: "crosshair" }}
      >
        <defs>
          <filter id="fo-glow-lg" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="fo-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="fo-glow-sm" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g opacity="0.022" stroke={system.color} fill="none" strokeWidth="0.5">
          {[
            orbitRadius * 0.42,
            orbitRadius * 0.75,
            orbitRadius * 1.12,
            orbitRadius * 1.55,
            orbitRadius * 2,
          ].map((radius, index) => (
            <circle key={index} cx={centerX} cy={centerY} r={radius} />
          ))}
          {[0, 36, 72, 108, 144].map((degrees) => {
            const radians = (degrees * Math.PI) / 180;
            return (
              <line
                key={degrees}
                x1={centerX + Math.cos(radians) * orbitRadius * 2.2}
                y1={centerY + Math.sin(radians) * orbitRadius * 2.2}
                x2={centerX - Math.cos(radians) * orbitRadius * 2.2}
                y2={centerY - Math.sin(radians) * orbitRadius * 2.2}
              />
            );
          })}
        </g>

        {[
          {
            radius: orbitRadius * 0.3,
            duration: "65s",
            from: "0",
            to: "360",
            dash: "5 11",
            opacity: 0.28,
            width: 0.7,
          },
          {
            radius: orbitRadius * 0.46,
            duration: "95s",
            from: "360",
            to: "0",
            dash: "3 15",
            opacity: 0.16,
            width: 0.52,
          },
          {
            radius: orbitRadius * 0.62,
            duration: "125s",
            from: "0",
            to: "360",
            dash: "9 24",
            opacity: 0.1,
            width: 0.4,
          },
        ].map(
          (
            {
              radius,
              duration,
              from,
              to,
              dash,
              opacity,
              width,
            },
            index,
          ) => (
            <circle
              key={index}
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke={system.color}
              strokeWidth={width}
              strokeOpacity={opacity}
              strokeDasharray={dash}
            >
              {!reducedMotion && (
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  from={`${from} ${centerX} ${centerY}`}
                  to={`${to} ${centerX} ${centerY}`}
                  dur={duration}
                  repeatCount="indefinite"
                />
              )}
            </circle>
          ),
        )}

        <circle
          cx={centerX}
          cy={centerY}
          r={orbitRadius}
          fill="none"
          stroke={system.color}
          strokeWidth="0.5"
          strokeOpacity="0.1"
          strokeDasharray="5 12"
        />

        <ConstellationConnections
          nodes={nodes}
          connections={planet.constellationConnections}
          centerX={centerX}
          centerY={centerY}
          domainColor={system.color}
          showCenterConnections={planet.showCenterConnections ?? true}
        />

        <circle
          cx={centerX}
          cy={centerY}
          r={orbitRadius * 0.42}
          fill={planetColor}
          opacity="0.035"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={orbitRadius * 0.28}
          fill={planetColor}
          opacity="0.08"
          filter="url(#fo-glow-lg)"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={orbitRadius * 0.16}
          fill={planetColor}
          opacity="0.2"
          filter="url(#fo-glow-lg)"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={orbitRadius * 0.08}
          fill={planetColor}
          opacity="0.55"
          filter="url(#fo-glow)"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={orbitRadius * 0.04}
          fill={planetColor}
          opacity="0.92"
          filter="url(#fo-glow)"
        />

        <text
          x={centerX}
          y={centerY + orbitRadius * 0.48 + 22}
          textAnchor="middle"
          fontSize="16"
          fontFamily="'DM Mono',monospace"
          fill={system.color}
          letterSpacing="2.8"
          opacity="0.76"
        >
          {planet.label}
        </text>

        {nodes.map((node, index) => {
          const { star, x, y, angle } = node;
          const active = hoveredStarId === star.id;
          const applicationKitFamily = applicationKitFamilies.find(
            (family) =>
              star.id === family.id || star.id.endsWith(`-${family.id}`),
          );

          return (
            <ConstellationNode
              key={star.id}
              node={node}
              domainColor={system.color}
              active={active}
              pulseDelay={`${index * 0.32}s`}
              reducedMotion={reducedMotion}
              showOpenCue={!applicationKitFamily}
              onActivate={() => onOpenStar(index, { x, y })}
              onAwaken={() => setHoveredStarId(star.id)}
              onRest={() =>
                setHoveredStarId((current) =>
                  current === star.id ? null : current,
                )
              }
            >
              {active && applicationKitFamily && (
                <ApplicationKitModuleArc
                  family={applicationKitFamily}
                  x={x}
                  y={y}
                  angle={angle}
                  orbitRadius={orbitRadius}
                  color={system.color}
                />
              )}
            </ConstellationNode>
          );
        })}
      </svg>
    </div>
  );
}
