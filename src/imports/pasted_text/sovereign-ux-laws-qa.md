You are performing Pass 6 on the Sovereign UX Laws artifact.

Repository:
wchiu111/sovereign-ux-atlas

Source of truth:
Use the current implementation on the latest main branch.

Primary file:
src/app/experiences/frameworks/SovereignLawsIndexCanvas.tsx

Related files for reference only:
src/app/experiences/shared/AtlasReadingEngine.tsx
src/app/experiences/shared/readerSemanticPalette.ts
src/app/atlas/components/FocusedOverview.tsx
src/app/atlas/components/ConstellationNode.tsx
src/app/content/frameworks/sovereign-ux-laws.ts

This is a VISUAL QA + POLISH pass.

Do not redesign the Laws experience.
Do not introduce new features.
Do not change the Laws taxonomy or authored content.
Do not change the evidence architecture.
Do not change routing.
Do not touch other frameworks.
Do not modify the Layered System map.

The interaction model is already approved:

Laws reader
→ Laws evidence card
→ full-screen Laws Index
→ select a law
→ right-side diagnostic panel

Search, filtering, the Professional Boundary, keyboard behavior, and reduced-motion support are already implemented.

Your job is to make the existing experience visually consistent with the rest of Sovereign Atlas.

-----------------------------------
1. TYPOGRAPHY AUDIT
-----------------------------------

Compare the Laws Index against the existing Atlas reader and framework screens.

Use the existing typography system as source of truth:

DM Mono:
- metadata
- numbers
- labels
- filters
- search
- utility controls

EB Garamond:
- artifact title
- law titles
- explanatory copy
- detail-panel reading content

Check:
- title scale
- law-card title scale
- band headings
- metadata scale
- body copy
- panel typography
- Professional Boundary typography

Do not create arbitrary new font sizes.

Normalize anything that feels too small, too large, or inconsistent with the rest of Atlas.

-----------------------------------
2. COLOR + CONTRAST AUDIT
-----------------------------------

Use readerSemanticPalette.ts for readable interface text.

Functional text should use:
- primary
- secondary
- metadata
- inactive
- caption
- utility colors

Keep conceptual colors only for meaning:

Core Laws → judgment
Relational Laws → relational
Advanced Signals → purpose

Do not use low-opacity text if it becomes difficult to read.

Pay particular attention to:
- card descriptions
- band descriptions
- search placeholder
- result count
- detail-panel metadata
- Professional Boundary
- inactive filters

Atmosphere can remain subtle.
Functional text cannot.

-----------------------------------
3. SPACING + DENSITY
-----------------------------------

Audit the entire Laws Index for rhythm.

Check:
- header height
- title-to-description spacing
- search/filter spacing
- spacing between bands
- card padding
- card gaps
- card height consistency
- detail-panel spacing
- section dividers
- Professional Boundary spacing

The experience should feel dense enough to function as a reference system, but not compressed.

Avoid excessive vertical whitespace.

-----------------------------------
4. CARD HIERARCHY
-----------------------------------

Refine the Laws cards without changing their structure.

Make sure:
- law number is clearly secondary
- law title is dominant
- description is readable
- selected state is obvious
- hover state is restrained
- Core / Relational / Signal cards feel related but distinct

Do not make every card equally bright.

Advanced Alignment Signals should still read as cautionary signals, not elevated achievements.

-----------------------------------
5. SELECTED DETAIL PANEL
-----------------------------------

Audit the right-side diagnostic panel.

Core Laws:
PRINCIPLE
IN PRACTICE
WHEN IT BREAKS

Relational Laws:
PRINCIPLE
USE WHEN

Advanced Signals:
SIGNAL — NOT A TARGET
SIGNAL
RESPONSE

Check:
- hierarchy
- readability
- divider spacing
- close control
- panel width
- selected accent color
- TYPE / LAW metadata
- long titles
- long body text

The panel should feel like part of the same family as the Layered System detail panel without copying it literally.

-----------------------------------
6. SEARCH + FILTER POLISH
-----------------------------------

Preserve current behavior.

Audit:
- search field height
- icon alignment
- placeholder readability
- clear button
- filter button sizes
- selected vs unselected filter states
- live result count
- empty state

Do not add ranking, fuzzy search, tags, or new controls.

Search should remain a lightweight retrieval tool.

-----------------------------------
7. PROFESSIONAL BOUNDARY
-----------------------------------

Keep it visible and clearly outside the 25-principle hierarchy.

It should read as a framework guardrail, not another card.

Preserve:

PAUSE · CONSENT · REFER

Make sure it is visually distinct without becoming overly prominent.

-----------------------------------
8. RESPONSIVE / REFLOW QA
-----------------------------------

Test:

100%
125%
150%
200%

Also test a narrower desktop window.

Verify:
- no horizontal clipping
- no cards cut off
- no labels overlap
- search/filter toolbar reflows cleanly
- Advanced Signals reflow correctly
- detail panel does not crush the index
- detail panel overlay works at narrower widths
- Back to Framework remains reachable
- Professional Boundary remains readable

Do not redesign mobile behavior.
This pass is desktop/reflow stabilization only.

-----------------------------------
9. INTERACTION QA
-----------------------------------

Verify:

- clicking a law opens the correct detail
- clicking another law updates the panel
- Escape closes detail first
- Escape again exits Laws Index
- Back to Framework works
- search updates results
- filters compose with search
- empty state resets correctly
- selected law closes if filtering hides it
- keyboard tab reaches search, filters, law cards, panel close, and Back
- Enter/Space activates law cards
- visible focus treatment is always present

-----------------------------------
10. REDUCED MOTION
-----------------------------------

With prefers-reduced-motion enabled:

- no unnecessary entrance movement
- no detail-panel sliding animation
- no important state depends on animation

Do not remove useful state changes.

-----------------------------------
11. FINAL VISUAL BALANCE
-----------------------------------

After the functional audit, do one final visual pass.

The target feeling is:

Atlas-like
quiet
precise
editorial
diagnostic
not dashboard-like
not documentation-heavy
not decorative for decoration’s sake

The Laws Index should feel like a specialized reference instrument inside Sovereign UX.

It should visually belong next to the Layered System Diagnostic Map while clearly serving a different cognitive task.

-----------------------------------
OUTPUT
-----------------------------------

Make only necessary visual/styling corrections.

Do not add new capabilities.

At the end, report:

1. files changed
2. typography changes
3. color/contrast changes
4. spacing/layout changes
5. reflow fixes
6. interaction/accessibility fixes
7. anything intentionally left unchanged

Run TypeScript/build validation if available.

Do not modify unrelated files.