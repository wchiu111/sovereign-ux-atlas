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

export type AtlasSemanticRelationshipType =
  | "extends"
  | "applies"
  | "guards"
  | "contrasts"
  | "evidences"
  | "related";

export interface AtlasConceptSemantics {
  keywords: string[];
  aliases?: string[];
  summary?: string;
}

export interface AtlasConstellationConnection {
  from: string;
  to: string;
  strength?: AtlasConnectionStrength;
  type?: AtlasSemanticRelationshipType;
  rationale?: string;
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

export type AtlasEvidenceAnnotationCategory =
  | "ai-delegation"
  | "human-authority"
  | "visible-reasoning"
  | "authority-problem";

export type AtlasDecisionRightHolder = "Human" | "AI" | "Shared";

export interface AtlasEvidenceAnnotation {
  id: string;
  number: string;
  x: number;
  y: number;
  category: AtlasEvidenceAnnotationCategory;
  title: string;
  observation: string;
  meaning: string;
  rightHolder: AtlasDecisionRightHolder;
  cardSide?: "left" | "right";
}

export interface AtlasEvidenceCanvas {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  boardLabel: string;
  boardSubtitle: string;
  annotations: AtlasEvidenceAnnotation[];
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
  canvas?: AtlasEvidenceCanvas;
}

export interface AtlasEntrySection {
  id: string;
  label: string;
  content: string;
  accentStellarType?: AtlasStellarType;
  semantics?: AtlasConceptSemantics;
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
  semantics?: AtlasConceptSemantics;
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
