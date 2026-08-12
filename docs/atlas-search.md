# Atlas Search Functionality v2

Atlas Search is a deterministic navigation layer over the documented Atlas. It does not generate answers, use external knowledge, or maintain a second UI-owned content catalog.

## Architecture

1. `atlasSearchIndex.ts` derives systems and entries from `ATLAS_SYSTEM_CONFIGS` and `ATLAS_ENTRIES`, then adds search-only metadata such as aliases, topics, availability, and priority.
2. `normalizeSearchQuery.ts` removes punctuation, normalizes casing and plurals, and strips common navigation phrases without removing meaningful terms such as `AI`, `trust`, or `design`.
3. `searchAtlas.ts` applies deterministic match tiers and intent boosts, hides non-explicit planned content, sorts ties alphabetically, and enforces a hard maximum of four results.
4. `resolveAtlasSearchDestination.ts` validates and converts result IDs into typed system, entry, or Observatory destinations.
5. `useAtlasSearch.ts` keeps query state and matching separate from the palette presentation.
6. `AtlasCommandPalette.tsx` renders the existing hairline input and contained result panel, manages accessible interaction, and hands resolved destinations to `AtlasExplorer.tsx`.
7. `AtlasExplorer.tsx` remains the owner of Atlas transitions, focused-overview state, drawers, and Observatory entry.

## Index Audit

| Area | Canonical source | Search behavior |
| --- | --- | --- |
| Systems | `ATLAS_SYSTEM_CONFIGS` | Case Studies, Frameworks, and Experiments are available destinations. |
| Case studies | `ATLAS_ENTRIES` | Four case studies are available. `sovereign-atlas-cs` is the canonical ID; `sovereign-atlas` remains an alias. |
| Frameworks | `ATLAS_ENTRIES` | Decision Rights, Behavioral Architecture, and Application Kit are available. Sectionless entries are planned and hidden from broad queries. |
| Sovereign UX | Existing framework content file | Preview in V1.1. It resolves to the Frameworks system because it is not currently exported into the live constellation. |
| Experiments | `ATLAS_ENTRIES` | Authority Drift is available. Mirror Test is preview in V1.1. Other sectionless experiments are planned and hidden from broad queries. |
| Profile | Observatory experience | One available `about-wilson` entry covers Wilson, background, journey, experience, and philosophy. Observatory hotspots do not currently expose stable direct routes. |

Search metadata extends canonical content rather than replacing it. Existing content aliases and semantic keywords are merged into the index. Curated overrides are limited to display corrections, priority, availability, release version, and cross-content topics.

## Ranking Contract

Ranking is stable and explainable:

1. Exact title
2. Exact alias
3. Title prefix or title phrase
4. Exact or phrase keyword
5. Exact or phrase topic
6. Matched field terms
7. Description terms
8. Explicit intent boosts
9. Small content-priority tie adjustment
10. Alphabetical ordering for equal scores

Intent rules cover strongest work and case studies, AI frameworks and design methods, Wilson and profile queries, and the cross-content topics AI trust, human authority, governance, and AI behavior. Intent boosts influence ranking without forcing every thematic query to a system landing page.

Planned entries appear only when their exact title or alias is requested. Available and preview entries can appear in broad discovery queries. Every query returns at most four results.

## Guided And Empty States

The empty state exposes exactly four guided prompts:

- Show me the strongest case studies
- Explain Authority Drift
- Explore AI Design Frameworks
- Tell me about Wilson

Selecting a prompt populates and runs the query; it does not skip the result list. A no-results state offers four documented alternative queries and never fabricates a destination.

## Navigation And Preview

- System results use the existing Atlas system-entry action and camera framing.
- Entry results use the existing focused-overview action and project drawer opening.
- About Wilson uses the existing Observatory transition.
- Result hover and keyboard selection preview only the parent constellation or Observatory nexus. Leaving selection, clearing, closing, or activating a result clears preview state.
- Activation is immediate. Search adds no interstitial, animation sequence, or navigation delay.

## Accessibility

- The input uses combobox semantics with `aria-expanded`, `aria-controls`, `aria-autocomplete`, and `aria-activedescendant`.
- Result rows use listbox and option semantics with one active result.
- Arrow Up, Arrow Down, Home, End, Enter, Escape, `/`, and Command/Ctrl+K are supported.
- Escape restores focus to the element active before search when practical. Tab remains free to leave the palette.
- Rows and controls meet the existing 44px touch-target baseline.
- Existing reduced-motion behavior is preserved, and forced-colors mode receives explicit borders and focus outlines.

## Analytics

`onAnalyticsEvent` is optional and provider-neutral. Events include:

- `atlas_search_opened`
- `atlas_query_changed`
- `atlas_query_submitted`
- `atlas_result_selected`
- `atlas_no_results`
- `atlas_guided_prompt_selected`

Properties are limited to query length, result count, selected type and position, interaction method, topic classification, match tier, and prompt ID. Raw query text is never emitted.

## Verification

Automated coverage lives in `tests/atlas-search.test.mjs` and runs with `npm run test:search`. It verifies normalization, aliases, multi-term matching, visitor intents, stable ordering, the four-result cap, availability rules, no-results behavior, destination validation, and the acceptance-query set.

Manual regression checklist:

- Open from pointer focus, `/`, and Command/Ctrl+K.
- Confirm the four guided prompts populate ranked results rather than navigating immediately.
- Verify exact and alias queries for Globality, Oracle, Sovereign Atlas, Model Design, and Authority Gradient.
- Verify broad queries for strongest work, AI frameworks, AI trust, human authority, and Wilson.
- Verify preview content shows release metadata and planned content appears only when explicitly requested.
- Move selection with Arrow keys, Home, and End; activate with Enter.
- Close with Escape and click outside; confirm focus return and cleared preview state.
- Activate one system, one case study, one framework, one experiment, and About Wilson.
- Verify no-results alternatives and clear-query behavior.
- Repeat at desktop and mobile widths, with reduced motion and forced colors where available.

## Known Constraints

- Search is intentionally client-side because the current registry is small and ships with the Atlas. The index is normalized once at module load.
- Search does not provide typo correction, fuzzy edit distance, history, personalization, semantic retrieval, or generated answers.
- Direct routing to Observatory hotspots is deferred until those destinations have stable IDs and navigation actions.
- Sovereign UX can become a direct framework destination when it is intentionally added to the live framework registry and constellation; search currently avoids changing constellation geometry to create that route.
