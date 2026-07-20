import type { Planet, StarNode, StarSystem } from "../types/atlas";
import { STAR_ORBIT_R } from "../data/atlasSystems";

const ATLAS_PERSPECTIVE = 1280;

export interface ProjectedOrbitPosition {
  x: number;
  y: number;
  scale: number;
  depth: number;
}

export function sysOrbitPos(
  sys: StarSystem,
  elapsed: number,
  nexX: number,
  nexY: number,
): ProjectedOrbitPosition {
  const phase = sys.orbitPhase0 + elapsed * sys.orbitSpeed;
  const ellipseX = Math.cos(phase) * sys.orbitA;
  const ellipseY = Math.sin(phase) * sys.orbitB;

  const cosRotation = Math.cos(sys.orbitRotation);
  const sinRotation = Math.sin(sys.orbitRotation);
  const rotatedX = ellipseX * cosRotation - ellipseY * sinRotation;
  const rotatedY = ellipseX * sinRotation + ellipseY * cosRotation;

  const projectedY = rotatedY * Math.cos(sys.orbitTilt);
  const depth = sys.orbitDepth + rotatedY * Math.sin(sys.orbitTilt);
  const scale = ATLAS_PERSPECTIVE / (ATLAS_PERSPECTIVE - depth);

  return {
    x: nexX + sys.orbitOffsetX + rotatedX * scale,
    y: nexY + sys.orbitOffsetY + projectedY * scale,
    scale,
    depth,
  };
}

export function systemOrbitPath(
  sys: StarSystem,
  nexX: number,
  nexY: number,
  steps = 160,
) {
  const points: string[] = [];

  for (let index = 0; index <= steps; index += 1) {
    const phase = (index / steps) * Math.PI * 2;
    const elapsed = (phase - sys.orbitPhase0) / sys.orbitSpeed;
    const point = sysOrbitPos(sys, elapsed, nexX, nexY);
    points.push(`${index === 0 ? "M" : "L"}${point.x.toFixed(2)},${point.y.toFixed(2)}`);
  }

  return `${points.join(" ")} Z`;
}

export interface ProjectedPlanetPosition {
  x: number;
  y: number;
  scale: number;
  depth: number;
}

const LOCAL_PLANET_PERSPECTIVE = 720;
const LOCAL_ORBIT_TILT = 0.22;

export function planetLocalPos(planet: Planet, elapsed: number): ProjectedPlanetPosition {
  const phase = (planet.angle * Math.PI / 180) + elapsed * planet.orbitSpeed;
  const orbitX = Math.cos(phase) * planet.orbitR;
  const orbitY = Math.sin(phase) * planet.orbitR;

  // A shallow local projection preserves the observatory view while giving
  // neighboring concepts distinct foreground/background planes.
  const orbitalDepth = orbitY * Math.sin(LOCAL_ORBIT_TILT);
  const depth = planet.orbitPlane * 34 + orbitalDepth;
  const scale = LOCAL_PLANET_PERSPECTIVE / (LOCAL_PLANET_PERSPECTIVE - depth);

  return {
    x: planet.orbitOffsetX + orbitX * scale,
    y: planet.orbitOffsetY + orbitY * Math.cos(LOCAL_ORBIT_TILT) * scale,
    scale,
    depth,
  };
}

export function starLocalPos(star: StarNode) {
  const rad = star.angle * Math.PI / 180;
  return { x: Math.cos(rad) * STAR_ORBIT_R, y: Math.sin(rad) * STAR_ORBIT_R };
}
