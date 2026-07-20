import { defineAtlasEntry } from "../defineAtlasEntry";

export default defineAtlasEntry({
  id: "mirror-test",
  category: "experiment",
  title: "MIRROR TEST",
  subtitle: "A protocol for testing whether an AI system genuinely reflects user reality or returns optimized agreement.",
  overview: {
    what: "A protocol for testing whether an AI system genuinely reflects user reality or returns optimized agreement.",
    why: "Systems designed for satisfaction metrics will systematically show users what they want to see.",
    researchFocus: "Distinguishing reflective from mimetic AI behavior in product interactions.",
    keyDiscovery: "Users rated satisfying outputs as more accurate — even when accuracy was lower. Felt understanding and actual understanding diverge.",
  },
  orbit: {
    angle: 67,
    radius: 122,
    speed: 1.10e-4,
    starPrefix: "mt",
  },
  sections: undefined,
});
