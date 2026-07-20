export type AtlasCategory = "case-study" | "experiment" | "framework";

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
  category: AtlasCategory;
  title: string;
  subtitle: string;
  overview: AtlasEntryOverview;
  orbit: AtlasEntryOrbit;
  sections?: AtlasEntrySection[];
  caseStudyId?: string;
  tags?: string[];
  meta?: string;
  role?: string;
  year?: number;
  status?: string;
}