import aiEvaluation from "./ai-evaluation";
import atlasPrototypes from "./atlas-prototypes";
import authorityDrift from "./authority-drift";
import emotionalHeatmapping from "./emotional-heatmapping";
import futureConcepts from "./future-concepts";
import mirrorTest from "./mirror-test";
import postFilterShopping from "./post-filter-shopping";

export const entries = [
  aiEvaluation,
  atlasPrototypes,
  authorityDrift,
  emotionalHeatmapping,
  futureConcepts,
  mirrorTest,
  postFilterShopping,
] as const;
