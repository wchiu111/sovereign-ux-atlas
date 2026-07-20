import { defineAtlasEntry } from "../defineAtlasEntry";

const focus = {
    headline: "Authority Drift",
    subheadline: "How AI systems accumulate decision-making power that was never explicitly granted",
    sections: [
      { id: "overview", label: "Overview",
        content: `Authority drift is not a bug — it is a gravitational tendency. Every helpful AI feature contains within it the potential to become a system that makes choices on the user's behalf without their awareness.\n\nThis experiment emerged from a consistent observation across multiple AI product interactions: users were accepting recommendations without examining them, and then forgetting the AI had made a decision at all. The locus of control had shifted without announcement.\n\nUnderstanding where this shift begins, how it accelerates, and what structural choices resist it became the central question of this research.`,
        insight: "The system that does more for users gradually becomes the system that decides for users. The transition happens in the margin between helpful and automatic." },
      { id: "question", label: "The Question",
        content: `What are the specific mechanisms through which an AI system transitions from assistant to decision-maker? And how can those mechanisms be named, categorized, and designed against?\n\nThe existing discourse around AI autonomy focuses primarily on extreme scenarios — fully autonomous systems, AGI safety, existential risk. This experiment focuses on the unglamorous middle ground: the everyday micro-delegations that accumulate into significant authority transfer over months of use.\n\nThe research question is practical: can we build a taxonomy specific enough to be used as a design checklist before shipping any AI feature?`,
        insight: "The question is not whether AI should have authority. It's whether every specific delegation of authority was chosen — or whether it drifted into place." },
      { id: "evidence", label: "Mutation Evidence",
        content: `Across six AI product interactions over eight weeks, we tracked each moment when the system made a choice that the user could have made — noting whether the user was aware of the delegation.\n\nKey metrics:\n— 73% of AI suggestions accepted without examining the underlying reasoning\n— 41% of users could not recall the specific AI recommendation after the interaction ended\n— In 28% of cases, users believed they had made a decision that was actually made by the system\n— Users who experienced a system failure were 3× more likely to notice delegation patterns in retrospect`,
        insight: "What users don't notice is what the system has taken over. The smoothest experiences may have the highest authority drift." },
      { id: "taxonomy", label: "Taxonomy",
        content: `Three primary categories of authority drift were identified:\n\nPRESENTATION DRIFT — The system decides what to show and what to hide. The most common and most invisible form. Algorithmic feeds, priority inboxes, and smart suggestions all involve presentation drift. Users see a curated subset of reality and treat it as the whole.\n\nFRAMING DRIFT — The system decides how to contextualize information. Occurs when AI summarization or interpretation shapes how users understand their own data. Users receive meaning, not information.\n\nDECISION DRIFT — The system makes choices users intended to make themselves. Auto-scheduling, auto-reply, smart-compose, and agentic actions all create decision drift when they operate without explicit per-instance authorization.`,
        insight: "Each category is invisible by design. The value proposition of each is its seamlessness. That seamlessness is exactly the problem." },
      { id: "framework", label: "Solution Framework",
        content: `The Mirror Test Protocol provides a practical checkpoint for AI feature development.\n\nBefore shipping any AI feature that takes action or filters information, ask:\n1. Did the user explicitly choose to delegate this specific decision?\n2. Does the user know this delegation is occurring right now?\n3. Can the user reverse the delegation — not the decision, but the delegation itself?\n4. What happens to the user's judgment if they never see this decision being made?\n\nIf any answer reveals a gap, the feature requires: EXPLICIT DELEGATION, REVERSIBLE AUTOMATION, or DELEGATION REMOVAL.`,
        insight: "Authority delegation is only sovereign when it is chosen. If the user didn't choose it, the system chose it for them." },
      { id: "implications", label: "Implications",
        content: `The implications extend beyond AI product design into the question of what kind of intelligence relationship we are building at scale.\n\nAuthority drift, unchecked, produces users who are increasingly dependent — not on specific features, but on the system's judgment itself. Over time, the capacity to make the delegated decisions atrophies.\n\nSovereign design names this side effect and builds structural resistance to it. Not because AI assistance is bad — it is often genuinely valuable. But because assistance the user cannot see, reclaim, or redirect is not assistance. It is oversight.`,
        insight: "We are not designing tools. We are designing the terms of a relationship between human judgment and machine judgment. Those terms deserve explicit authorship." },
    ],
  };

export default defineAtlasEntry({
  id: "authority-drift",
  category: "experiment",
  title: "AUTHORITY DRIFT",
  subtitle: focus.subheadline,
  overview: {
    what: "Research into how AI systems gradually accumulate decision-making authority that was never explicitly granted.",
    why: "Most AI safety discourse focuses on extreme scenarios. This investigates the unglamorous middle ground: everyday micro-delegations that accumulate into significant authority transfer.",
    researchFocus: "Mechanisms of implicit authority transfer in AI product interactions.",
    keyDiscovery: "73% of AI suggestions accepted without examining reasoning. The transition from assistant to decision-maker is invisible by design.",
  },
  orbit: {
    angle: 15,
    radius: 122,
    speed: 0.95e-4,
    starPrefix: "ad",
  },
  sections: focus.sections,
});
