# Sovereign Atlas Go-Live Report

## Executive Summary

Overall status: **NO-GO — PRODUCTION DEPLOYED, ATLAS ASSIST BLOCKED BY PROVIDER 429**

The approved production artifact is deployed and `Ready` at `https://wchiudesign.com`. Canonical routes, indexing output, Search, Share, browser history, Contact provider acceptance, deep-link refresh, and production console checks pass. Contact returned HTTP `202` only after Resend accepted the test message, and Reply-To remains wired to the validated visitor address.

Production launch is currently **NO-GO** because two live Atlas Assist attempts reached `/api/atlas-assist` and returned HTTP `429`. The UI handled the failure safely, but no production grounded answer was produced. Actual arrival at `wchiudesign@gmail.com` and a real Reply-To action also remain owner verification because the available authenticated browser inbox was a different account.

The remaining authored Case Study blockers are resolved. Globality, Oracle, and Sovereign Atlas now use approved role metadata through the canonical content model, and Sovereign Atlas is explicitly documented as an intentional five-section project rather than being forced to render an empty Decisions section.

The audited branch is deployed to production. Production indexing and Contact configuration are active and verified at the request/provider boundary. Launch should remain paused until Atlas Assist returns a successful grounded answer, actual inbox delivery and Reply-To are owner-verified, the remaining browser-zoom/assistive-technology matrix is completed, and the favicon/social-card owner decision is recorded. Analytics and error monitoring remain post-launch recommendations.

## Scorecard

| Category | Score | Status |
| --- | ---: | --- |
| Identity + SEO | 11 / 13 | Live production metadata/crawler output pass; favicon and social image remain owner decisions |
| URLs + Sharing | 9 / 9 | Canonical routes, deployed rewrites, refresh, history, and copied production URLs pass |
| Case Studies | 9 / 9 | Approved roles and the five-section exception are canonical and verified |
| Contact | 9 / 10 | Production provider acceptance and Reply-To wiring pass; destination inbox confirmation remains |
| Atlas Interaction | 12 / 14 | Core paths, Search, retreat, evidence, and history pass; live Ask returns HTTP 429 |
| Responsive | 7 / 9 | 1440, 1024, 768, 390, and 320px baselines pass; zoom and physical-device review remain |
| Accessibility | 11 / 14 | Priority focus, Escape, semantics, and reduced-motion fixes landed |
| Performance | 6 / 9 | Build/runtime pass; bundle and large assets remain |
| Production Infrastructure | 9 / 9 | Production deployment and both functions are Ready; required variable names/scopes are present |
| Analytics / Observability | 0 / 10 | No provider is currently installed |
| Search Engine Launch | 5 / 9 | Metadata artifacts exist; Search Console and migration remain external |

## Production Deployment Verification — 2026-08-21

- Deployment: `dpl_HhjSkw9JNvp29jNRJmGnWjMdr86c`
- Status: `Ready`
- Production URL: `https://sovereign-ux-atlas-staging-k9e02m5rs-wchiudesign-1181s-projects.vercel.app`
- Active aliases: `https://wchiudesign.com`, `https://www.wchiudesign.com`
- Functions compiled: `api/atlas-assist`, `api/contact`
- Production environment names/scopes verified without revealing values: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `VITE_SITE_URL`, `VITE_SITE_INDEXABLE`, and the existing Atlas Assist variables are all scoped to Production.
- Contact test: `POST /api/contact` returned HTTP `202` and `{ "accepted": true }`; Vercel runtime logs independently recorded the `202`.
- Reply-To: server adapter sends `reply_to: message.email`, where `message.email` is the validated visitor address.
- Inbox arrival: not directly verified because the available authenticated Gmail session was not `wchiudesign@gmail.com`; no unrelated inbox content was inspected.
- Atlas Assist: two production requests returned HTTP `429`; the UI rendered a recoverable rate-limit message and did not blank or crash.
- Production metadata: root title, canonical, `index, follow`, Open Graph URL, Twitter card, and JSON-LD pass.
- Crawlers: `/robots.txt` allows `/` and points to the production sitemap; `/sitemap.xml` contains production-domain URLs only.
- Deep links: Case Study, Experiment, Framework, and focused Case Study routes load directly; focused refresh and Back/Forward preserve canonical state.
- Search: Globality, Decision Rights, and Authority Drift navigate to their canonical production routes.
- Share: copied the exact production focused route.
- Console: no warning- or error-level browser logs were observed during the production smoke pass.

## Changes Implemented

### Canonical Case Study roles and authored section structure

- **Issue:** Three Case Studies lacked approved role metadata, and the launch audit treated Sovereign Atlas's five authored sections as an unresolved missing Decisions section.
- **Root cause:** The canonical entry model already supported roles and variable section arrays, but the approved role values and an explicit authored-exception marker were absent.
- **Fix:** Added the approved Globality, Oracle, and Sovereign Atlas roles through the existing `AtlasEntry.role` field; added a typed section-structure marker; and documented Sovereign Atlas as an intentional five-section exception without creating placeholder content or changing the reading engine.
- **Files:** `src/app/content/types.ts`, the three affected Case Study content files, `tests/case-study-metadata.test.mjs`, and `package.json`.
- **Verification:** All four Focus Mode roles rendered locally. Sovereign Atlas reported five sections, exposed its five authored nodes, and rendered no Decisions node or section. Three focused metadata tests, route tests, Search tests, TypeScript, and the production build pass.

### Environment-safe site identity and SEO

- **Issue:** The document used an outdated title, unconditional `noindex`, and lacked canonical, Open Graph, Twitter, sitemap, robots, and structured-data support.
- **Root cause:** The Figma export had only static placeholder metadata and no environment-aware production path.
- **Fix:** Set the exact site name `Sovereign Atlas | wchiudesign`; added useful default metadata; added route-aware title, description, canonical, Open Graph, Twitter, and JSON-LD updates; emitted `robots.txt` and a 20-URL overview sitemap from canonical content files; made indexing opt-in with `VITE_SITE_INDEXABLE=true`.
- **Files:** `index.html`, `vite.config.ts`, `.env.example`, `src/app/App.tsx`, `src/app/seo/AtlasSeo.tsx`.
- **Verification:** Default build emits `noindex, nofollow` and `Disallow: /`. A production-configured build emits `index, follow`, `Allow: /`, the production sitemap reference, the canonical `https://wchiudesign.com/`, and 20 canonical URLs.

### Canonical routes and truthful Share feedback

- **Issue:** Frameworks did not have first-class canonical routes, several direct Experiment/legacy paths were not covered by Vercel rewrites, query strings were discarded during canonicalization, and Share reported success even if the clipboard failed.
- **Root cause:** Routing support had been added category by category, while Share assumed clipboard success.
- **Fix:** Added `/frameworks` route support through the shared route model, retained legacy aliases, expanded SPA rewrites, preserved search parameters, normalized unknown routes to `/`, and introduced distinct copied/failed Share states.
- **Files:** `src/app/routing/atlasRoutes.ts`, `src/app/state/AtlasStateProvider.tsx`, `src/app/experiences/frameworks/FrameworkEngine.tsx`, `src/app/experiences/shared/AtlasReadingEngine.tsx`, `vercel.json`, `tests/atlas-routes.test.mjs`.
- **Verification:** Seven route tests pass. Fresh-load and reload checks passed for Case Study, Experiment, and Framework deep links. Browser Back/Forward restored `Globality / Problem` and `Globality / Approach`. Share copied the active canonical route and displayed `COPIED` only after success.

### Real, fail-closed Contact delivery boundary

- **Issue:** The form always displayed `Message delivered` after a timer and never sent a request.
- **Root cause:** The exported UI had a simulated success path and no provider or server endpoint.
- **Fix:** Added a same-origin `/api/contact` Vercel function, server validation, honeypot, request limits, timeout handling, a Resend adapter, Reply-To support, provider-response validation, and safe error mapping. The client now says `Transmission accepted` only after provider acceptance, does not claim inbox delivery, and preserves the visitor's draft after a failed attempt.
- **Files:** `api/contact.ts`, `server/contact/contracts.ts`, `server/contact/handler.ts`, `server/contact/resendProvider.ts`, `src/app/experiences/profile/contactClient.ts`, `src/app/experiences/profile/ProfileContactPanel.tsx`, `.env.example`, `package.json`, `tests/contact.test.mjs`.
- **Verification:** Four Contact contract tests pass, including missing configuration, invalid/honeypot input, and provider rejection. Plain Vite correctly rendered `Message not delivered` rather than a false success; `Try again` restored the entered draft. Actual email delivery is not claimed.

### Accessibility and responsive safeguards

- **Issue:** Project overview drawers could trap mobile users, profile and evidence overlays lacked complete focus management, Search Escape focus was inconsistent, focused pages lacked a page heading, overview pages could expose duplicate page headings, and reduced-motion still ran canvas/transition animation work.
- **Root cause:** Visual overlays had been implemented before dialog, history, mobile-retreat, and reduced-motion behavior was normalized.
- **Fix:** Added a mobile overview retreat, Escape handling and focus restoration; named the evidence dialog and added initial focus, focus containment, and restoration; added profile dialog focus containment, DOM-property-backed inert background content, and mobile stacking; contained root Atlas system/project centers at sub-760px widths without changing desktop geometry; corrected heading/landmark semantics without changing visual styles; preserved Search focus according to invocation method; and stopped animation loops/long transitions under reduced motion.
- **Files:** `src/app/atlas/AtlasExplorer.tsx`, `src/app/atlas/hooks/useAtlasAnimation.ts`, `src/app/atlas/rendering/AtlasCanvas.tsx`, `src/app/utils/atlasGeometry.ts`, `src/app/components/AtlasCommandPalette.tsx`, `src/app/components/AtlasProjectIntelligenceDrawer.tsx`, `src/app/components/atlas-assist/AtlasAssistEntry.tsx`, `src/app/experiences/ProfileExperience.tsx`, `src/app/experiences/SovereignExperience.tsx`, `src/app/experiences/profile/ProfileAboutPanel.tsx`, `src/app/experiences/profile/ProfileFocusLayer.tsx`, `src/app/experiences/shared/AtlasReadingEngine.tsx`.
- **Verification:** Mobile project retreat is visible and returns to `/case-studies`; the About panel had equal client/scroll width with no horizontal clipping; Escape closed it and restored hotspot focus; evidence Escape restored source-card focus; hidden Assist content receives a real `inert` DOM attribute with no React warning; overview and focused routes each expose one level-one heading; a fresh browser session reported no warnings or errors. Physical-device viewport verification remains required for the new constellation containment.

### Full client/server TypeScript enforcement

- **Issue:** `npm run typecheck` checked only the serverless code, leaving client errors in stale exports, ref types, authored content literals, and Vite plugin typing invisible.
- **Root cause:** The Vercel-oriented server check had replaced rather than complemented the frontend check.
- **Fix:** The command now checks both configurations; corrected the real errors without suppression, typed canonical content sections, normalized React 18 refs, removed a stale barrel export, and added explicit React DOM type dependencies.
- **Files:** `package.json`, `package-lock.json`, `src/main.tsx`, `src/app/components/index.ts`, `src/app/atlas/rendering/AtlasBackground.tsx`, `src/app/atlas/rendering/AtlasCanvas.tsx`, `src/app/atlas/hooks/useAtlasAnimation.ts`, `src/app/atlas/hooks/useAtlasCursorAttention.ts`, `src/app/components/atlas-assist/AtlasAssistPanel.tsx`, `src/app/components/atlas-assist/AtlasAssistTrigger.tsx`, `src/app/experiences/profile/ProfileHotspot.tsx`, `src/app/experiences/shared/AtlasReadingEngine.tsx`, and the eight canonical Case Study/Experiment content files listed below.
- **Verification:** `npm run typecheck` now completes both `tsconfig.json` and `tsconfig.server.json` with no errors.

### Dependency and development-server hygiene

- **Issue:** Unused `react-router` added package weight, and Vite 6.3.5 was within published development-server file-read advisory ranges.
- **Root cause:** Residual dependency plus an outdated pinned Vite patch level.
- **Fix:** Removed the unused router and upgraded Vite to the non-major patched 6.4.3 release; no application routing or UI architecture changed.
- **Files:** `package.json`, `package-lock.json`.
- **Verification:** Full build and all route tests pass; `npm install` and `npm audit` report zero vulnerabilities.

## Remaining Issues

### P1 — Must fix before launch

| Issue | Why unresolved | Recommended next action |
| --- | --- | --- |
| Atlas Assist returns HTTP `429` in production | The request reaches the deployed function, but the live provider does not produce an answer. | Resolve OpenAI project quota/rate limits or model access, then repeat a production grounded-answer test. |
| Contact inbox arrival and Reply-To action are not owner-verified | Resend accepted the message, but the authorized destination inbox was not accessible in the available browser account. | Confirm the `Production QA` message arrived at `wchiudesign@gmail.com`, then reply and verify the recipient is the submitted visitor address. |
| Browser zoom and assistive-technology checks remain | Deployed semantic checks passed at five widths, but browser zoom and VoiceOver/NVDA were not available in this automated session. | Complete 125%, 150%, and 200% zoom plus basic screen-reader checks on staging. |
| Favicon decision: `BLOCKING BY OWNER DECISION` | No approved redistributable favicon was supplied during the audit. | Supply an approved asset or explicitly mark it `APPROVED TO DEFER`. |
| Social-card decision: `BLOCKING BY OWNER DECISION` | No approved 1200×630 social-card asset was supplied during the audit. | Supply an approved asset or explicitly mark it `APPROVED TO DEFER`. |

### P2 — Strongly recommended

| Issue | Why unresolved | Recommended next action |
| --- | --- | --- |
| No approved favicon/app icon | Neither source-of-truth repository contains a redistributable approved icon. | Export an approved Atlas mark and add favicon/app metadata. |
| No Open Graph/Twitter image | No approved social-card asset was available; inventing one would be a design change. | Supply a 1200×630 approved asset, then add `og:image` and `twitter:image`. |
| Route-specific social crawler metadata is client-rendered | The SPA updates metadata after hydration; many social crawlers do not execute JavaScript. | Add prerendering or edge-generated route HTML before expecting per-project cards. |
| No analytics or runtime error monitoring | No vendor exists and the audit was instructed not to add one automatically. | Select a privacy policy/vendor, then instrument the points below. |
| Contact rate limiting is process-local | Serverless instances do not share the in-memory counter. | Use a shared rate-limit store if abuse appears or before a high-traffic launch. |
| Bundle remains large | Main JavaScript is about 792kB minified / 228kB gzip; the application has many content images. | Profile route-level lazy loading after launch-critical work is complete. |
| Four assets exceed 500kB | Largest observed assets are about 530kB, 1.52MB, 1.63MB, and 1.92MB. | Re-encode only after visual comparison and approval. |
| Full accessibility/device matrix is incomplete | Live staging passed 1440×900, 1024×768, 768×1024, 390×844, and 320×700 semantic baselines, but not physical touch hardware or every browser zoom level. | Complete the manual matrix below with keyboard, zoom, screen reader, and touch hardware. |
| Legacy routes are canonicalized client-side, not server-redirected | SPA rewrites preserve compatibility but do not emit SEO-grade 301/308 responses. | Add explicit permanent redirects after confirming every old production URL. |

### P3 — Post-launch polish

- Review small, subdued labels and noncritical touch targets in the spatial canvas at 200% zoom.
- Revisit image lazy loading and duplicate asset opportunities only after a visual-regression baseline exists.
- The unused legacy case-study data file still contains obsolete cloned content; remove it in a dedicated residue pass, not this launch fix.

## Manual Production Checks

### Verified staging configuration

| Variable | Scope | Verified value |
| --- | --- | --- |
| `VITE_SITE_URL` | Preview/public | `https://staging.wchiudesign.com` |
| `VITE_SITE_INDEXABLE` | Preview/public | `false` |

Deployment `dpl_7w17MQKxSQbLViPhkazpyNxEqxv6` reached Ready. Live root and Case Study, Experiment, and Framework metadata use the staging domain for canonical and Open Graph URLs; Twitter metadata and JSON-LD remain present; every checked route renders `noindex, nofollow`; `robots.txt` returns `Disallow: /`; and the generated sitemap contains only `https://staging.wchiudesign.com` URLs. No environment-aware metadata checked in this pass leaked `https://wchiudesign.com`.

### Production variables required

Do not set these until production deployment is explicitly approved.

| Variable | Visibility | Required production value or requirement |
| --- | --- | --- |
| `VITE_SITE_URL` | Public/client-visible | `https://wchiudesign.com` |
| `VITE_SITE_INDEXABLE` | Public/client-visible | `true` |
| `RESEND_API_KEY` | Server-only secret | Required; never prefix with `VITE_` |
| `CONTACT_FROM_EMAIL` | Server-only configuration | Required; must use a verified Resend domain or subdomain |
| `CONTACT_TO_EMAIL` | Server-only configuration | `wchiudesign@gmail.com` |
| `CONTACT_TIMEOUT_MS` | Server-only configuration | Optional |
| `CONTACT_REQUESTS_PER_MINUTE` | Server-only configuration | Optional |

The Contact provider is isolated to the server handler, and the visitor's submitted email is used as Reply-To. No Contact secret is referenced through a `VITE_` variable or included in the client bundle.

### Production deployment preflight

Do not execute this sequence until production deployment is explicitly approved.

1. Configure production Vercel variables.
2. Verify the Resend sending domain.
3. Deploy production.
4. Verify the production build reaches Ready.
5. Verify the root URL.
6. Verify one Case Study deep link.
7. Verify one Experiment deep link.
8. Verify one Framework deep link.
9. Verify `robots.txt`.
10. Verify production is `index, follow`.
11. Verify canonical URLs use `https://wchiudesign.com`.
12. Verify the sitemap uses production URLs.
13. Send one real Contact message.
14. Confirm arrival at `wchiudesign@gmail.com`.
15. Confirm Reply-To returns to the visitor.
16. Check provider logs for acceptance.
17. Run a final Share test.
18. Run a final Search test.
19. Run a final Ask test.
20. Inspect the browser console and network panel.
21. Complete priority mobile, zoom, and keyboard QA.
22. Submit the sitemap to Google Search Console after launch.

### Vercel environments

1. Staging is complete: `VITE_SITE_URL=https://staging.wchiudesign.com` and `VITE_SITE_INDEXABLE=false` are set for Preview.
2. In the **production** project, set `VITE_SITE_URL=https://wchiudesign.com` and `VITE_SITE_INDEXABLE=true` only after approval.
3. Confirm Preview variables cannot use production mail/OpenAI credentials unless intentionally scoped.
4. Deploy production, then fetch `/`, `/robots.txt`, `/sitemap.xml`, `/case-studies/sovereign-atlas`, `/experiments/authority-drift`, and `/frameworks/authority-gradient` in a private browser.
5. Confirm all deep links return 200, restore the expected state, and retain HTTPS and the production domain.

### Contact provider

1. Verify `wchiudesign.com` (or the chosen sending subdomain) in Resend.
2. Set server-only `RESEND_API_KEY`; never prefix it with `VITE_`.
3. Set `CONTACT_FROM_EMAIL` to an address on the verified sending domain.
4. Set `CONTACT_TO_EMAIL=wchiudesign@gmail.com`.
5. Optionally tune `CONTACT_TIMEOUT_MS` and `CONTACT_REQUESTS_PER_MINUTE`.
6. Submit one production message with a real Reply-To address.
7. Confirm the UI reports success only after a `202`, the message arrives at `wchiudesign@gmail.com`, Reply sends to the visitor, and provider logs show acceptance.
8. Repeat with an invalid address and temporarily unavailable provider to verify useful failure states.

### Search and social launch

1. Create/verify the `wchiudesign.com` Google Search Console property.
2. Submit `https://wchiudesign.com/sitemap.xml` and request indexing for `/` plus the three system routes.
3. Inspect the deployed canonical and robots output with Search Console URL Inspection.
4. Inventory old `w. designs`/legacy Atlas URLs and add approved permanent redirects before migration.
5. After an approved social image is added, validate links in LinkedIn Post Inspector and the Facebook/Meta Sharing Debugger; clear stale caches.
6. Confirm the branded title transitions to `Sovereign Atlas | wchiudesign` in live search results over time; this cannot be forced by code.

### Responsive and accessibility matrix

Test large desktop, laptop, small laptop, tablet, mobile, narrow mobile, and a short viewport at 100%, 125%, 150%, and 200% zoom. For each, verify constellation labels, Search, project drawers, Ask, Focus Mode, evidence, profile panels, breadcrumbs, Escape, keyboard focus order, touch activation, and return controls. Include VoiceOver/NVDA basics and `prefers-reduced-motion`.

### Analytics / observability

No analytics or error-monitoring vendor is installed. Clean instrumentation points are:

- Atlas entry/system/project transitions in `src/app/state/AtlasStateProvider.tsx`.
- Search open, intent, no-results, and selection in the existing Search analytics callback.
- Atlas Assist events through its existing optional analytics boundary.
- Contact accepted/rejected events in `api/contact.ts`, without raw message/email content.
- Global runtime errors at the application entry boundary and server handler errors with request IDs.
- Resume/LinkedIn actions in the profile components that own those controls.

Choose consent, retention, and query/message-redaction rules before connecting a vendor.

## File Change Summary

- `.env.example` — documents public indexing metadata and server-only Contact variables.
- `index.html` — normalizes the site title and base search/social metadata.
- `package.json` — runs full client/server typechecks, adds Case Study and Contact test commands/types, removes unused `react-router`, and pins patched Vite 6.4.3.
- `package-lock.json` — records dependency/type updates and the patched Vite release.
- `vite.config.ts` — injects environment-safe metadata and emits sitemap/robots assets.
- `vercel.json` — restores direct navigation for all canonical and legacy Atlas route families.
- `api/contact.ts` — exposes the Vercel-compatible, same-origin Contact endpoint.
- `server/contact/contracts.ts` — validates and normalizes Contact input.
- `server/contact/handler.ts` — coordinates configuration, throttling, provider calls, and safe responses.
- `server/contact/resendProvider.ts` — isolates Resend delivery and provider error handling.
- `src/app/App.tsx` — mounts route-aware SEO inside Atlas state.
- `src/app/seo/AtlasSeo.tsx` — owns hydrated canonical, title, social, and JSON-LD metadata.
- `src/app/routing/atlasRoutes.ts` — adds canonical Framework route support.
- `src/app/state/AtlasStateProvider.tsx` — preserves query strings and recovers unknown routes safely.
- `src/app/atlas/AtlasExplorer.tsx` — improves landmarks/headings and wires project-drawer retreat/reduced motion.
- `src/app/atlas/hooks/useAtlasAnimation.ts` — avoids continuous canvas work under reduced motion.
- `src/app/atlas/hooks/useAtlasCursorAttention.ts` — normalizes the React 18 SVG ref contract.
- `src/app/atlas/rendering/AtlasBackground.tsx` — normalizes the React 18 canvas ref contract.
- `src/app/atlas/rendering/AtlasCanvas.tsx` — normalizes the React 18 zoom-surface ref contract.
- `src/app/utils/atlasGeometry.ts` — contains Atlas system and project centers within narrow viewports while preserving desktop coordinates.
- `src/app/components/AtlasCommandPalette.tsx` — restores Search focus according to interaction origin.
- `src/app/components/AtlasProjectIntelligenceDrawer.tsx` — adds mobile close, Escape, labeling, and focus restoration.
- `src/app/components/atlas-assist/AtlasAssistEntry.tsx` — applies runtime inert behavior without passing an unsupported React 18 prop.
- `src/app/components/atlas-assist/AtlasAssistPanel.tsx` — normalizes the React 18 focus-return ref contract.
- `src/app/components/atlas-assist/AtlasAssistTrigger.tsx` — normalizes the React 18 trigger ref contract.
- `src/app/components/index.ts` — removes a stale export for the deleted Arrival component.
- `src/app/content/case-studies/agentic-insurance.ts` — explicitly types canonical focused sections without changing content.
- `src/app/content/case-studies/globality.ts` — explicitly types canonical focused sections and authors `Senior Product Designer II` through the shared role field.
- `src/app/content/case-studies/oracle.ts` — explicitly types canonical focused sections and authors `Interactive Designer` through the shared role field.
- `src/app/content/case-studies/sovereign-atlas.ts` — authors `Product Designer · Design Engineer` and documents the intentional five-section exception.
- `src/app/content/types.ts` — supports typed standard and intentionally exceptional authored section structures.
- `src/app/content/experiments/authority-drift.ts` — explicitly types canonical focused sections without changing content.
- `src/app/content/experiments/design-philosophy.ts` — explicitly types canonical focused sections without changing content.
- `src/app/content/experiments/gestalt-principles.ts` — explicitly types canonical focused sections without changing content.
- `src/app/content/experiments/think-like-a-designer.ts` — explicitly types canonical focused sections without changing content.
- `src/app/experiences/SovereignExperience.tsx` — short-circuits cinematic transitions under reduced motion.
- `src/app/experiences/frameworks/FrameworkEngine.tsx` — supplies the canonical Framework route base.
- `src/app/experiences/ProfileExperience.tsx` — adds a profile landmark/heading and makes covered content inert.
- `src/app/experiences/profile/ProfileAboutPanel.tsx` — prevents mobile column/grid clipping.
- `src/app/experiences/profile/ProfileContactPanel.tsx` — replaces simulated delivery with real state and draft recovery.
- `src/app/experiences/profile/ProfileFocusLayer.tsx` — adds dialog focus containment, Escape, and restoration.
- `src/app/experiences/profile/ProfileHotspot.tsx` — makes authored Philosophy node typing explicit.
- `src/app/experiences/profile/contactClient.ts` — calls the Contact API and surfaces safe failures.
- `src/app/experiences/shared/AtlasReadingEngine.tsx` — fixes Share feedback, focused headings, and evidence-dialog accessibility.
- `src/main.tsx` — uses the Bundler-compatible extensionless application import.
- `tests/atlas-routes.test.mjs` — covers canonical and legacy Framework routing.
- `tests/case-study-metadata.test.mjs` — verifies all four roles, standard six-section projects, and the Sovereign Atlas five-section exception.
- `tests/contact.test.mjs` — covers Contact validation, configuration, success, and provider rejection.

## Final Smoke Test

| Test | Result | Evidence / limitation |
| --- | --- | --- |
| Vercel deployment | PASS | Production deployment `dpl_HhjSkw9JNvp29jNRJmGnWjMdr86c` is Ready; `api/atlas-assist` and `api/contact` compiled as functions. |
| Load Atlas | PASS | Production root rendered with the expected title, H1, Search, and system counts. |
| Enter main experience | PASS | Atlas → Observatory transition completed on production. |
| Open Case Study | PASS | Deployed Agentic Insurance and Globality overview/focused routes restored correctly. |
| Verify role metadata | PASS | Agentic Insurance, Globality, Oracle, and Sovereign Atlas expose their approved roles through the canonical entry model. |
| Verify Sovereign Atlas structure | PASS | Exactly Context, Problem, Approach, Outcomes, and Lessons render; no Decisions node, tab, or empty state is authored. |
| Exit Focus Mode | PASS | Overview return and mobile drawer retreat restored canonical state. |
| Open Framework | PASS | Deployed `/frameworks`, Decision Rights overview, and `/frameworks/authority-gradient/system-purpose` loaded directly. |
| Open Experiment | PASS | Deployed `/experiments`, Authority Drift overview, and `/experiments/authority-drift/drift` loaded directly; focused refresh restored Drift. |
| Search | PASS | Production Globality, Decision Rights, and Authority Drift queries returned curated results and navigated to canonical routes. |
| Ask | FAIL | Two production requests reached `/api/atlas-assist` and returned HTTP `429`; no grounded answer rendered. |
| Ask dialog keyboard retreat | PASS | Production focused Ask opened with an accessible heading; Escape closed it and restored focus to the Ask trigger. |
| Evidence dialog | PASS | Live evidence viewer exposed an accessible dialog name; Escape closed it and restored source-card focus. |
| Share action | PASS | Production Share copied the exact `https://wchiudesign.com/...` focused route. |
| Fresh shared URL | PASS | Production Case Study, Experiment, Framework, and focused routes restored; focused refresh preserved state. |
| Submit Contact | PASS | Production `POST /api/contact` returned HTTP `202` and provider acceptance. |
| Actual email arrival | OWNER VERIFICATION REQUIRED | The authenticated browser inbox was a different Gmail account; the destination inbox was not inspected. |
| Reply-To | PARTIAL PASS | Server payload uses the validated visitor email as `reply_to`; an actual reply remains owner verification. |
| Browser Back/Forward | PASS | Production history restored exact canonical Framework and focused Case Study URLs. |
| Console errors | PASS | No error-level browser logs appeared across root, routes, Ask, Contact, or responsive checks. |
| Network behavior | FAIL | Contact returned HTTP `202`; Atlas Assist returned HTTP `429` twice. |
| Mobile/narrow viewport | PASS | Focused Globality retained main content, breadcrumbs, return, Ask, and Evidence at 390×844 and 320×700. |
| Responsive viewport baseline | PASS | 1440×900, 1024×768, 768×1024, 390×844, and 320×700 checks passed on staging. |
| Full responsive/zoom matrix | MANUAL TEST REQUIRED | 125%, 150%, 200%, physical touch hardware, and VoiceOver/NVDA remain. |
| Production SEO metadata | PASS | Root and deep routes use the production canonical domain, render `index, follow`, retain Open Graph, Twitter, and JSON-LD metadata; robots allows `/` and the sitemap is production-only. |
| Production build | PASS | Vite transformed 2,225 modules and completed successfully. |
| TypeScript client/server checks | PASS | `npm run typecheck` completed both TypeScript configurations successfully. |
| Search tests | PASS | 13 / 13. |
| Route tests | PASS | 7 / 7. |
| Case Study metadata tests | PASS | 3 / 3, including all roles and the five-section exception. |
| Atlas Assist tests | PASS | 18 / 18. |
| Contact tests | PASS | 4 / 4. |

The independent final verifier re-ran the build/typecheck and reviewed the finished diff without editing it. Its initial findings on React 18 inert behavior, acceptance-vs-delivery wording, and narrow constellation containment were corrected; its final delta verdict marked all three code fixes as PASS and retained physical narrow-device confirmation as manual QA.

## Launch Recommendation

**NO-GO**

The smallest path from the current production deployment to **GO** is:

1. Resolve the Atlas Assist provider `429` and complete one successful grounded production answer.
2. Confirm the accepted Contact message arrived at `wchiudesign@gmail.com` and that Reply-To targets the submitted visitor address.
3. Complete the remaining zoom, touch-device, and screen-reader checks.
4. Resolve the favicon and social-card owner decisions by supplying approved assets or explicitly marking each `APPROVED TO DEFER`.

No merge, PR, or source-of-truth `main` modification was performed by this production pass.

## SEO Pass 1 Staging Promotion — 2026-08-22

### Promotion and deployment

- Source: `seo/pass-1-primary-pages` at `0b0a7ce`.
- Target: `staging`; merged with a non-fast-forward merge because staging already contained its documentation-only launch record.
- Staging merge: `7ea654a`.
- Staging-only app-shell canonical correction: `403da4f`.
- Verified preview deployment: `dpl_AfUku7vHexXv5xx2AZfb5n1gEZXj` (`Ready`, Preview), aliased to `https://staging.wchiudesign.com`.
- Production safety: `origin/main` remained at `0dc59b5`; no production deployment or production environment change was made.

### Raw HTML and indexing QA

All nine approved Pass 1 pages returned their approved unique title, description, staging canonical, Open Graph URL, Twitter metadata, and valid JSON-LD. Every staging page returned `noindex, nofollow`; no `Sovereign UX Atlas 2.0` branding remained.

| Route | Result |
| --- | --- |
| `/` | PASS |
| `/case-studies/agentic-insurance` | PASS |
| `/case-studies/globality` | PASS |
| `/case-studies/oracle` | PASS |
| `/case-studies/sovereign-atlas` | PASS |
| `/frameworks/authority-gradient` | PASS |
| `/frameworks/relational-ai-literacy` | PASS |
| `/frameworks/regenerative-systems` | PASS |
| `/frameworks/presence-navigation` | PASS |

- `robots.txt`: PASS — disallows all staging crawling.
- `sitemap.xml`: PASS — exactly nine staging URLs; no production-domain, Experiment, or Application Kit URLs.
- App-state-only routes: PASS — `/case-studies`, `/experiments/authority-drift`, `/frameworks/application-kit`, and `/case-studies/globality/problem` resolve through the SPA shell with `noindex, nofollow` and no server-rendered canonical. `AtlasSeo` supplies route-aware metadata after hydration without making these states indexable.

### Runtime regression QA

- Search: PASS — `Globality` returned the canonical Case Study result and navigated to `/case-studies/globality`.
- Focused deep link and refresh: PASS — `/case-studies/globality/problem` restored `The Problem` directly and survived refresh.
- Share: PASS — focused Share reported `COPIED` while retaining the exact staging route.
- Retreat and history: PASS — Focused → Overview, Back, and Forward restored the expected URLs.
- Hydration and console: PASS — no error-level browser logs appeared during the tested flows.
- Build verification: PASS — TypeScript, production build, staging build, SEO tests (12/12), route tests (7/7), Search tests (13/13), Contact tests (4/4), Atlas Assist tests (18/18), and Case Study metadata tests (3/3).

### Staging recommendation

**READY FOR PRODUCTION SEO PROMOTION**

This recommendation covers the reviewed SEO Pass 1 promotion only. Production remains unchanged and requires its separately approved promotion workflow.
