import aiEvaluation from "./ai-evaluation";
import atlasPrototypes from "./atlas-prototypes";
import authorityDrift from "./authority-drift";
import emotionalHeatmapping from "./emotional-heatmapping";
import gestaltPrinciples from "./gestalt-principles";
import postFilterShopping from "./post-filter-shopping";
import thinkLikeADesigner from "./think-like-a-designer";

export const entries = [
  aiEvaluation,
  atlasPrototypes,
  authorityDrift,
  emotionalHeatmapping,
  gestaltPrinciples,
  postFilterShopping,
  thinkLikeADesigner,
] as const;
