export interface StarNode { id: string; label: string; angle: number; }

export interface Planet {
  id: string; label: string;
  angle: number;       // initial orbit angle (degrees)
  orbitR: number;      // orbit radius around system hub (px in SVG coords)
  orbitSpeed: number;  // rad/ms
  orbitPlane: number;  // local 2.5D plane: negative recedes, positive advances
  orbitOffsetX: number;
  orbitOffsetY: number;
  stars: StarNode[];
  what: string; why: string; researchFocus: string; keyDiscovery: string;
}

export interface StarSystem {
  id: string; label: string; subtitle: string; color: string;
  size: number;
  // Orbital params — system orbits Atlas nexus
  orbitA: number; orbitB: number;
  orbitOffsetX: number; orbitOffsetY: number;
  orbitRotation: number; // radians around the screen-facing axis
  orbitTilt: number;     // radians away from the viewer
  orbitDepth: number;    // px depth offset used by the perspective projection
  orbitPhase0: number; // radians
  orbitSpeed: number;  // rad/ms
  pulseSpeed: number; pulsePhase: number;
  planets: Planet[];
}

export interface FocusSection { id: string; label: string; content: string; insight?: string; }
export interface FocusContent { headline: string; subheadline: string; sections: FocusSection[]; }
export interface ZoomState { scale: number; tx: number; ty: number; }
export type ViewLevel = 0 | 1 | 2 | 3;

export interface FocusTransition {
  index: number;
  label: string;
  x: number;
  y: number;
  color: string;
}
