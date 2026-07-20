import { defineAtlasEntry } from "../defineAtlasEntry";

export default defineAtlasEntry({
  id: "model-design",
  category: "framework",
  title: "MODEL DESIGN",
  subtitle: "A framework for designing the governance, constraints, and recovery mechanisms that give AI systems stable, trustworthy character.",
  overview: {
    what: "A framework for designing the governance, constraints, and recovery mechanisms that give AI systems stable, trustworthy character.",
    why: "AI models are increasingly designed for capability without being designed for character.",
    researchFocus: "What structural choices determine whether an AI system remains aligned with user interests over extended deployment?",
    keyDiscovery: "Four predictive factors for alignment: explicit governance, named constraints, regenerative capacity, behavioral integrity.",
  },
  orbit: {
    angle: 65,
    radius: 112,
    speed: 0.92e-4,
    starPrefix: "md",
  },
  sections: undefined,
});
