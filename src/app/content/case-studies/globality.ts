import { defineAtlasEntry } from "../defineAtlasEntry";
import type { AtlasEntrySection } from "../types";

import oldHomeDashboard from "../../../imports/case-studies/globality/01-context/1-old-home-dashboard.png";
import oldProjectDashboard from "../../../imports/case-studies/globality/01-context/2-old-project-dashboard.png";
import navNoMentalModel from "../../../imports/case-studies/globality/01-context/3-nav-no-mental-model.png";

import homepageAllUsers from "../../../imports/case-studies/globality/02-problem/1-homepage-all-users.png";
import cardsScanning from "../../../imports/case-studies/globality/02-problem/2-cards-scanning.png";
import dashboardNoOrientation from "../../../imports/case-studies/globality/02-problem/3-dashboard-no-orientation.png";

import navExploreTop from "../../../imports/case-studies/globality/03-approach/1-nav-explore-top.png";
import navExploreTopOpen from "../../../imports/case-studies/globality/03-approach/2-nav-explore-top-open.png";
import navExploreSide from "../../../imports/case-studies/globality/03-approach/3-nav-explore-side.png";
import navExploreSideOpen from "../../../imports/case-studies/globality/03-approach/4-nav-explore-side-open.png";
import navRespondsContext from "../../../imports/case-studies/globality/03-approach/5-nav-responds-context.png";

import projectCardsToOperationalAwareness from "../../../imports/case-studies/globality/04-decisions/1-project-cards-to-operational-awareness.png";
import designAroundDecisionsHome from "../../../imports/case-studies/globality/04-decisions/2-design-around-decisions-home.png";
import designAroundDecisionsProject from "../../../imports/case-studies/globality/04-decisions/3-design-around-decisions-project.png";
import stateAwareJourney from "../../../imports/case-studies/globality/04-decisions/4-state-aware-journey.png";

import beforeAfterHome from "../../../imports/case-studies/globality/05-outcomes/1-before-after-home.png";
import beforeAfterProjectWorkspace from "../../../imports/case-studies/globality/05-outcomes/2-before-after-project-workspace.png";
import beforeAfterProjectList from "../../../imports/case-studies/globality/05-outcomes/3-before-after-project-list.png";

import questionsEnterpriseProducts from "../../../imports/case-studies/globality/06-lessons/1-questions-enterprise-products.png";

const focus: { headline: string; subheadline: string; sections: AtlasEntrySection[] } = {
  headline: "Globality",
  subheadline:
    "Redesigning an AI-assisted procurement platform around orientation, work states, and the decisions users needed to make next.",
  sections: [
    {
      id: "context",
      label: "Context",
      accentStellarType: "relational",
      subtitle: "A powerful platform that did not always communicate where users were",
      readingTime: 3,
      content: `Globality was an AI-assisted procurement platform designed to help enterprise teams create sourcing projects, develop briefs, discover providers, evaluate proposals, and move work toward launch.

The platform already supported a complex procurement journey. The problem was not a lack of capability. It was that users could not always tell where they were, what required attention, or what they should do next.

This was not a new problem.

When I joined the team, I noticed that the logged-in home experience and the project workspace looked structurally similar even though they served very different purposes. Customer-facing teams were hearing the same confusion from users: people could enter a project and lose their sense of whether they were still at the platform level or working inside a specific piece of work.

The problem persisted until a new VP of Design made the navigation experience a priority roughly two years into my time at Globality.

What began as an exploration of navigation patterns exposed something larger.

Global actions, account tools, project-specific destinations, onboarding, and AI assistance were competing inside an experience that did not clearly communicate changes in context.

The navigation existed, but it did not guide.

What initially appeared to be a navigation redesign became a broader effort to rethink how the product oriented users throughout the procurement journey.`,
      insight:
        "The system knew whether someone was browsing the platform or working inside a project. The interface needed to make that distinction just as clear to the user.",
      evidence: [
        {
          id: "old-home-dashboard",
          image: oldHomeDashboard,
          alt: "Original Globality home dashboard",
          imageFit: "contain",
          number: "01",
          title: "The Original Home Experience",
          type: "Existing Experience",
          description:
            "The logged-in home combined broad onboarding guidance, active-project prompts, and persistent AI assistance inside one shared workspace.",
          caption:
            "The experience attempted to support new and returning users at the same time, but it did not establish a clear hierarchy between learning, starting, and resuming work.",
        },
        {
          id: "old-project-dashboard",
          image: oldProjectDashboard,
          alt: "Original Globality project dashboard",
          imageFit: "contain",
          number: "02",
          title: "The Original Project Workspace",
          type: "Existing Experience",
          description:
            "The project-level experience used much of the same visual and behavioral structure as the home experience, despite representing a different level of work.",
          caption:
            "Moving into a project did not create a strong enough shift in context, so users had to reconstruct where they were after the transition.",
        },
        {
          id: "navigation-without-mental-model",
          image: navNoMentalModel,
          alt: "Original Globality navigation structure",
          imageFit: "contain",
          number: "03",
          title: "Navigation Without a Clear Mental Model",
          type: "Information Architecture",
          description:
            "Global destinations, account tools, project actions, and support entry points were distributed across several navigation surfaces without one clear organizing principle.",
          caption:
            "The navigation provided access, but it did not consistently explain whether an action belonged to the platform, the account, or the active project.",
        },
      ],
    },
    {
      id: "problem",
      label: "The Problem",
      accentStellarType: "risk",
      subtitle: "Small orientation failures accumulated across a collaborative workflow",
      readingTime: 4,
      content: `The usability issues were not isolated to a single screen. They appeared across the path from login to active project work.

New users needed a clear place to begin, but the primary create-project action was treated like another navigation item. Returning users needed to scan active work, compare project states, and identify what required attention, but the card-based project view made cross-project comparison difficult.

But procurement introduced another complication. Projects rarely belonged to one person from beginning to end.

A project manager might create an RFP or RFQ. Another team member could review it later. Someone else might add requirements, evaluate providers, or enter the project at another stage entirely. That meant the project could have continuity even when the person entering it did not. Someone could be familiar with procurement—and even with Globality—while still arriving inside a project state they had never seen before.

The homepage and project dashboard did little to resolve that uncertainty. Both relied on similar structures, broad prompts, and persistent AI assistance while giving less emphasis to project state, recent changes, and the actions most likely to move the work forward.

The product contained the information users needed. The difficulty was recognizing what mattered now. Every transition forced users to reconstruct their context:

Am I at the platform level or inside a project? What stage is this project in? What changed since I was last here? Which action should I take next?

This changed how I understood the problem.

The goal was not simply to make navigation easier to use.

The interface needed to orient users before asking them to act.`,
      insight:
        "In collaborative workflows, orientation is continuous. A user may enter an existing project without sharing the context of the people who worked on it before them.",
      evidence: [
        {
          id: "homepage-serving-everyone",
          image: homepageAllUsers,
          alt: "Original Globality homepage serving new and returning users",
          imageFit: "contain",
          number: "01",
          title: "A Homepage Trying to Serve Everyone",
          type: "Usability Problem",
          description:
            "The homepage combined onboarding, project entry points, assistant messaging, and returning-user tasks without making one intent dominant.",
          caption:
            "New users needed orientation while returning users needed operational awareness, but both groups were given nearly the same experience.",
        },
        {
          id: "cards-against-scanning",
          image: cardsScanning,
          alt: "Globality project card layout",
          imageFit: "contain",
          number: "02",
          title: "When Cards Worked Against Scanning",
          type: "Content Structure",
          description:
            "The project-card layout presented each project cleanly in isolation but made it harder to compare status, ownership, deadlines, and next steps across a portfolio.",
          caption:
            "The format optimized individual presentation at the expense of the cross-project awareness returning users needed.",
        },
        {
          id: "dashboard-without-orientation",
          image: dashboardNoOrientation,
          alt: "Original Globality project dashboard without strong orientation",
          imageFit: "contain",
          number: "03",
          title: "A Dashboard Without Strong Orientation",
          type: "Workflow Problem",
          description:
            "The project workspace surfaced broad assistant guidance but gave less emphasis to project state, recent activity, and the actions most likely to move the work forward.",
          caption:
            "The dashboard contained useful tools, but it did not answer the user’s most immediate question: what matters in this project right now?",
        },
      ],
    },
    {
      id: "approach",
      label: "Approach",
      accentStellarType: "strategy",
      subtitle: "Turning a navigation exploration into an experience architecture",
      readingTime: 5,
      content: `The initial assignment from the VP of Design was relatively focused:

Explore whether Globality should use a top navigation or a left navigation.

I was the design lead for the initiative, working closely with a PM and Engineering Director through weekly reviews. UX Research supported moderated testing, Customer Success helped surface recurring customer problems, internal procurement users provided domain context, and the evolving vision was reviewed with product and executive leadership.

My role was to synthesize those inputs into the experience direction.

The navigation exploration quickly exposed decisions that extended far beyond navigation.

If we changed how users moved through Globality, we also had to decide what belonged on Home, what belonged inside a project, how new and returning users should enter the experience, how active projects should be represented, where persistent project context should live, and how Glo—the AI assistant—should behave within that system.

I explored both top and left-navigation models.

A compact top navigation created more horizontal workspace during focused work, but its advantages weakened when expanded. The navigation still needed a container large enough to expose deeper destinations, reduced space for Globality and customer branding, and occupied an area I believed should eventually communicate persistent project context.

The left-navigation model stayed closer to existing interaction patterns while preserving the top of the workspace for something more valuable: the active project’s identity, status, and eventual next action.

From there, I mapped the experience around the procurement journey:

Create a project, develop the brief, match with providers, review providers and proposals, collaborate and decide, award and launch the work.

The exploration ultimately produced a two-level architecture:

• Home-level navigation for creating work, reviewing the portfolio, accessing resources, and managing the account

• In-project navigation for the brief, providers, proposals, collaborators, and project-specific actions

What started as a question about navigation placement became a model for distinguishing managing work from progressing work.`,
      insight:
        "My role was not simply to choose a navigation pattern. It was to define the experience architecture that navigation needed to support.",
      evidence: [
        {
          id: "top-navigation-closed",
          image: navExploreTop,
          alt: "Collapsed top-navigation exploration for Globality",
          imageFit: "contain",
          number: "01",
          title: "Top Navigation: Quiet State",
          type: "Navigation Exploration",
          description:
            "A compact top-navigation direction tested whether global destinations could remain discoverable without permanently reducing the horizontal workspace.",
          caption:
            "The closed state preserved screen space and kept the current task dominant while maintaining a visible entry point into the broader platform.",
        },
        {
          id: "top-navigation-open",
          image: navExploreTopOpen,
          alt: "Expanded top-navigation exploration for Globality",
          imageFit: "contain",
          number: "02",
          title: "Top Navigation: Revealed State",
          type: "Interaction State",
          description:
            "The expanded state exposed destination labels and account actions only when the user intentionally opened the navigation.",
          caption:
            "Paired with the quiet state, this direction explored progressive disclosure: orientation remained available without requiring every destination to stay visible.",
        },
        {
          id: "side-navigation-closed",
          image: navExploreSide,
          alt: "Collapsed side-navigation exploration for Globality",
          imageFit: "contain",
          number: "03",
          title: "Side Navigation: Quiet State",
          type: "Navigation Exploration",
          description:
            "A collapsed side-navigation direction tested whether persistent icons could communicate location and preserve more vertical continuity across the product.",
          caption:
            "The compact rail supported focused work, but depended on strong icon recognition and a clear active-state treatment.",
        },
        {
          id: "side-navigation-open",
          image: navExploreSideOpen,
          alt: "Expanded side-navigation exploration for Globality",
          imageFit: "contain",
          number: "04",
          title: "Side Navigation: Revealed State",
          type: "Interaction State",
          description:
            "The expanded state paired labels with the persistent icon rail, revealing the full navigation model when users needed additional certainty.",
          caption:
            "The open and closed states worked as one system: compact during routine work, explicit during navigation or reorientation.",
        },
        {
          id: "navigation-responds-to-context",
          image: navRespondsContext,
          alt: "Globality home-level and in-project navigation comparison",
          imageFit: "contain",
          number: "05",
          title: "Navigation That Responds to Context",
          type: "Information Architecture",
          description:
            "The final architecture distinguished platform-level destinations from the tools and stages associated with an active project.",
          caption:
            "The navigation no longer treated every destination as universally relevant. It changed to reflect whether the user was managing the portfolio or progressing through a project.",
        },
      ],
    },
    {
      id: "decisions",
      label: "Key Decisions",
      accentStellarType: "judgment",
      subtitle: "Designing the interface around the next decision",
      readingTime: 6,
      content: `Several decisions extended the architecture beyond navigation.

The first was to elevate “Create Project” from a navigation destination into a contextual action on Home. Starting new work should not require users to interpret a menu before they could begin.

The second was to replace project cards with a table.

Returning procurement users often managed several projects simultaneously. They needed to compare stage, ownership, recent activity, status, deadlines, and next steps. A table treated the portfolio as operational work rather than a gallery of individual projects.

The third was to give Home and Project different responsibilities.

Home answered:

What work is active? What changed? Where should I resume? How do I start something new?

The Project Dashboard answered:

What stage is this project in? What requires attention? Who is involved? What action will move the project forward?

That led to another important decision: persistent project context.

I wanted status and the next action to sit high in the project hierarchy, but the complete vision required several engineering sprints. Rather than replace the direction with an easier short-term solution, the PM and I broke the experience into milestones that could progressively move toward the intended architecture.

That also meant avoiding temporary components when we already knew they would be discarded in a later milestone.

Engineering constraints became part of the design system rather than something addressed after the interface was complete. Legacy decision points had to transition safely into the new architecture. A persistent project title bar consumed additional vertical space on smaller screens. Existing components had to accommodate new positioning. Each decision created consequences elsewhere in the product.

Glo followed the same principle.

The question was no longer simply where the AI assistant should live.

It became:

When is AI assistance useful enough to interrupt the user?

Instead of maintaining a large persistent presence, Glo could remain quiet during routine work and surface when context made its assistance useful—after completing a brief, when provider matches became available, or when a stalled decision could be unblocked.

Its value came from timing and context, not constant visibility.`,
      insight:
        "Every surface needed to answer the same question: what does the user need to understand before making the next decision?",
      evidence: [
        {
          id: "project-cards-to-operational-awareness",
          image: projectCardsToOperationalAwareness,
          alt: "Globality project table replacing project cards",
          imageFit: "contain",
          number: "01",
          title: "From Project Cards to Operational Awareness",
          type: "Content Architecture",
          description:
            "The redesigned project list used a table to make stage, ownership, activity, status, and next actions easier to compare across several projects.",
          caption:
            "The shift was not stylistic. It changed the portfolio from a set of isolated cards into a workspace for scanning and prioritization.",
        },
        {
          id: "design-around-decisions-home",
          image: designAroundDecisionsHome,
          alt: "Redesigned Globality home dashboard",
          imageFit: "contain",
          number: "02",
          title: "Designing Around the Next Decision: Home",
          type: "Dashboard Design",
          description:
            "The redesigned home separated suggested actions, recent projects, learning resources, and project creation into a clearer hierarchy for new and returning users.",
          caption:
            "The home experience became an orientation layer: start new work, recognize what changed, or return to something already in progress.",
        },
        {
          id: "design-around-decisions-project",
          image: designAroundDecisionsProject,
          alt: "Redesigned Globality project dashboard",
          imageFit: "contain",
          number: "03",
          title: "Designing Around the Next Decision: Project",
          type: "Workflow Dashboard",
          description:
            "The project workspace consolidated stage, progress, team, brief status, provider activity, and proposals around the active project.",
          caption:
            "The dashboard stopped behaving like a generic landing page and began answering the specific questions required to move the project forward.",
        },
        {
          id: "state-aware-journey",
          image: stateAwareJourney,
          alt: "State-aware procurement journey from home to award and launch",
          imageFit: "contain",
          number: "04",
          title: "Designing the Product Around Work States",
          type: "System Model",
          description:
            "A retrospective model showing the progression from Home to Create Project, Brief, Provider Match, Proposal Review, and Award or Launch.",
          caption:
            "Each stage creates a different question, so navigation, information, and available actions should evolve instead of remaining static throughout the journey.",
        },
      ],
    },
    {
      id: "outcomes",
      label: "Outcomes",
      accentStellarType: "agentic",
      subtitle: "From usability improvement to a new product standard",
      readingTime: 5,
      content: `We tested the redesigned experience through moderated usability sessions with approximately 20 new users.

UX Research conducted the sessions while I observed. Participants were first interviewed about their professional responsibilities and familiarity with procurement workflows such as RFPs and RFQs, then asked to perform representative tasks using prototypes I designed and assembled.

The difference was visible in behavior.

New users were able to identify where to begin, distinguish Home from Project, navigate the proposal-creation journey, and recognize the next available action with less searching and hesitation.

For the target proposal-creation task, the redesigned experience produced approximately 40% faster task completion during usability testing.

The table also improved scanning across active work, while the redesigned Project Dashboard gave users stronger orientation around stage, status, collaborators, and next actions.

But the most important outcome was not limited to the test.

The architecture shipped.

The new navigation, Home experience, project portfolio, Project Dashboard, interface hierarchy, and repositioned AI assistant became part of the product.

And once they shipped, they became constraints for what came next.

New product work had to account for the persistent project title layer. Components previously occupying the top-right workspace had to adapt to Glo’s new position. Future features had to consider whether they belonged at the platform or project level and how they behaved across different states of work.

The redesign also influenced the design system. I worked with another designer on the team to establish enough of the new architectural rules and constraints for the system to support subsequent product work.

The redesign did not make procurement less complex.

It gave users—and eventually the organization—a clearer model for deciding which part of that complexity mattered now.`,
      insight:
        "The strongest outcome was not a single screen. The redesign became the product architecture that subsequent work had to build within.",
      evidence: [
        {
          id: "before-after-home",
          image: beforeAfterHome,
          alt: "Before-and-after comparison of the Globality home experience",
          imageFit: "contain",
          number: "01",
          title: "Before and After: Home",
          type: "Experience Comparison",
          description:
            "The comparison shows the shift from a broad assistant-led homepage toward a clearer hierarchy of active work, suggested actions, and project entry points.",
          caption:
            "The redesigned home makes a stronger distinction between orientation, resuming work, and creating something new.",
        },
        {
          id: "before-after-project-workspace",
          image: beforeAfterProjectWorkspace,
          alt: "Before-and-after comparison of the Globality project workspace",
          imageFit: "contain",
          number: "02",
          title: "Before and After: Project Workspace",
          type: "Experience Comparison",
          description:
            "The project workspace moved from generic guidance toward a state-specific view of progress, team activity, providers, proposals, and next steps.",
          caption:
            "The new dashboard reduces the need to search across the project by bringing the current state and relevant decisions into one view.",
        },
        {
          id: "before-after-project-list",
          image: beforeAfterProjectList,
          alt: "Before-and-after comparison of Globality project cards and project table",
          imageFit: "contain",
          number: "03",
          title: "Before and After: Project Portfolio",
          type: "Content Comparison",
          description:
            "The portfolio shifted from individually presented project cards to a table optimized for comparison, prioritization, and return visits.",
          caption:
            "The new structure helps users scan across projects rather than opening each one to reconstruct its status.",
        },
      ],
    },
    {
      id: "lessons",
      label: "Lessons",
      accentStellarType: "purpose",
      subtitle: "What navigation work taught me about orientation",
      readingTime: 4,
      content: `At the time, I thought I was redesigning navigation.

Looking back, I was designing orientation. Users do not experience enterprise products as a sequence of pages. They experience changing states of work:

Entering, learning, starting, planning, reviewing, deciding, completing and returning.

And in collaborative systems, those states do not necessarily belong to one continuous user journey. People enter work started by others. They return after context has changed. They inherit decisions they did not make. A product becomes easier to use when its structure continuously helps people reconstruct that context. The project gave me a model I continued to use in later work.

Every product should continuously answer five questions:

Where am I? What changed? What matters now? What can I do next? How do I return?

But Globality taught me something else. Once the architecture shipped, those questions stopped being useful only to designers.

They became constraints for future product decisions.

New features had to establish where they belonged. New components had to respect persistent project context. AI behavior had to respond to the user’s state rather than simply remain visible. The design system had to accommodate the architecture the product had adopted.

A useful design principle can therefore do more than improve an interface. It can give an organization a shared way to decide where future product behavior belongs. The project also changed how I thought about AI assistance.

An intelligent system should not speak merely because it can. It should understand the user’s state, recognize when uncertainty has crossed a meaningful threshold, and offer support without taking over the experience.

That thinking later became part of how I approached presence, context, and spatial continuity in Sovereign Atlas.`,
      insight:
        "Orientation is not a navigation feature. It is a system for preserving enough context that people—and the products supporting them—can make coherent decisions.",
      evidence: [
        {
          id: "questions-every-product-must-answer",
          image: questionsEnterpriseProducts,
          alt: "Orientation model showing five questions every product must answer",
          imageFit: "contain",
          number: "01",
          title: "The Questions Every Product Must Answer",
          type: "Orientation Model",
          description:
            "A reflective system model organized around five questions that help users understand their current situation before taking action.",
          caption:
            "Orientation is not one navigation feature. It is the continuous reinforcement of location, change, priority, action, and return.",
        },
      ],
    },
  ],
};

export default defineAtlasEntry({
  id: "globality",
  routeSlug: "globality",
  category: "case-study",
  signatureStellarType: "strategy",
  title: "GLOBALITY",
  subtitle:
    "Redesigning an AI-assisted procurement platform around orientation, work states, and the decisions users needed to make next.",
  tags: ["ENTERPRISE SYSTEMS", "WORKFLOW"],
  overview: {
    what:
      "A navigation and workflow redesign spanning Globality’s home experience, project portfolio, and in-project workspace.",
    why:
      "The platform contained powerful procurement and AI capabilities, but users repeatedly had to reconstruct where they were, what had changed, and what action mattered next.",
    researchFocus:
      "How navigation, dashboards, and contextual AI could respond to the user’s current work state while preserving clarity across a complex procurement journey.",
    keyDiscovery:
      "Users do not experience enterprise products as a collection of pages. They experience changing states of work—and the interface must preserve orientation between them.",
  },
  orbit: {
    angle: 50,
    radius: 115,
    speed: 1.05e-4,
    starPrefix: "glob",
  },
  overviewStars: [
    {
      id: "context",
      label: "CONTEXT",
      angle: 165,
      x: -1.35,
      y: 0.52,
      scale: 0.94,
      stellarType: "relational",
      intensity: "balanced",
      labelPosition: { side: "left", offset: 28 },
    },
    {
      id: "problem",
      label: "PROBLEM",
      angle: -150,
      x: -0.88,
      y: 0.12,
      scale: 1.02,
      stellarType: "risk",
      intensity: "bright",
      labelPosition: { side: "top", offset: 30 },
    },
    {
      id: "approach",
      label: "APPROACH",
      angle: -105,
      x: -0.3,
      y: 0.34,
      scale: 1.08,
      stellarType: "strategy",
      intensity: "bright",
      labelPosition: { side: "left", offset: 30 },
    },
    {
      id: "decisions",
      label: "DECISIONS",
      angle: -50,
      x: 0.3,
      y: -0.18,
      scale: 1.18,
      stellarType: "judgment",
      intensity: "bright",
      labelPosition: { side: "top", offset: 32 },
    },
    {
      id: "outcomes",
      label: "OUTCOMES",
      angle: -5,
      x: 0.88,
      y: -0.02,
      scale: 1.1,
      stellarType: "agentic",
      intensity: "bright",
      labelPosition: { side: "bottom", offset: 30 },
    },
    {
      id: "lessons",
      label: "LESSONS",
      angle: 32,
      x: 1.34,
      y: -0.58,
      scale: 0.96,
      stellarType: "purpose",
      intensity: "balanced",
      labelPosition: { side: "right", offset: 28 },
    },
  ],
  constellation: {
    showCenterConnections: false,
    connections: [
      { from: "context", to: "problem", strength: "primary" },
      { from: "problem", to: "approach", strength: "primary" },
      { from: "approach", to: "decisions", strength: "primary" },
      { from: "decisions", to: "outcomes", strength: "primary" },
      { from: "outcomes", to: "lessons", strength: "primary" },
    ],
  },
  caseStudyId: "globality",
  role: "Senior Product Designer II",
  focus,
  sections: focus.sections,
});
