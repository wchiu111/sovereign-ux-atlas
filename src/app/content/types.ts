export type AtlasCategory = "case-study" | "experiment" | "framework";

export type AtlasFrameworkKind = "core" | "collection";

export type AtlasStellarType =
  | "purpose"
  | "strategy"
  | "agentic"
  | "judgment"
  | "risk"
  | "relational";

export type AtlasStarIntensity = "dim" | "balanced" | "bright";

export type AtlasLabelSide = "auto" | "top" | "right" | "bottom" | "left";

export interface AtlasStarLabelPosition {
  side?: AtlasLabelSide;
  offset?: number;
}

export type AtlasConnectionStrength = "primary" | "secondary";

export interface AtlasConstellationConnection {
  from: string;
  to: string;
  strength?: AtlasConnectionStrength;
}

export interface AtlasConstellation {
  connections?: AtlasConstellationConnection[];
  showCenterConnections?: boolean;
}

export type AtlasFrameworkPresentationMode =
  | "map-led"
  | "example-led"
  | "practice-led"
  | "speculative"
  | "collection";

export interface AtlasEntryPresentation {
  mode: AtlasFrameworkPresentationMode;
  sequenceLabel?: string;
  railLabel?: string;
  artifactLabel?: string;
  emptyRailMessage?: string;
}

export interface AtlasApplicationModule {
  id: string;
  title: string;
  purpose: string;
  includes: string[];
  useWhen: string;
  watchFor?: string;
  relatedFrameworks?: string[];
}

export interface AtlasModuleFamily {
  id: string;
  title: string;
  description: string;
  modules: AtlasApplicationModule[];
}

export interface AtlasFrameworkCollection {
  moduleCount: number;
  families: AtlasModuleFamily[];
}

export interface AtlasEntryOverview {
  what: string;
  why: string;
  researchFocus: string;
  keyDiscovery: string;
}

export interface AtlasEntryEvidence {
  id: string;
  number: string;
  title: string;
  type: string;
  description: string;
  caption: string;
  image?: string;
  alt?: string;
  imageFit?: "contain" | "cover";
}

export interface AtlasEntrySection {
  id: string;
  label: string;
  content: string;
  subtitle?: string;
  insight?: string;
  readingTime?: number;
  evidence?: AtlasEntryEvidence[];
}

export interface AtlasEntryOrbit {
  angle: number;
  radius: number;
  speed: number;
  starPrefix: string;
}

export interface AtlasEntry {
  id: string;
  aliases?: string[];
  category: AtlasCategory;
  title: string;
  subtitle: string;
  overview: AtlasEntryOverview;
  orbit: AtlasEntryOrbit;
  overviewStars?: AtlasOverviewStar[];
  sections?: AtlasEntrySection[];
  caseStudyId?: string;
  tags?: string[];
  meta?: string;
  role?: string;
  year?: number;
  status?: string;
  frameworkKind?: AtlasFrameworkKind;
  signatureStellarType?: AtlasStellarType;
  constellation?: AtlasConstellation;
  presentation?: AtlasEntryPresentation;
  collection?: AtlasFrameworkCollection;
}

export interface AtlasOverviewStar {
  id: string;
  label: string;
  angle: number;
  /** Authored offsets from the focused constellation center, measured in orbit radii. */
  x?: number;
  y?: number;
  /** Relative conceptual gravity. The renderer preserves the interaction hit target. */
  scale?: number;
  stellarType?: AtlasStellarType;
  intensity?: AtlasStarIntensity;
  labelPosition?: AtlasStarLabelPosition;
}
