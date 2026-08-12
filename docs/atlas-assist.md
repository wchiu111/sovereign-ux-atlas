# Atlas AI Assist

Atlas AI Assist is a grounded interpretation layer over the canonical Atlas content registry. Search remains responsible for navigation; consultation helps readers interpret the project or section they are already exploring.

## Architecture

- `buildAtlasAssistContext` assembles an allowlisted context from `ATLAS_ENTRIES` for the explicit `section`, `project`, or `atlas` scope.
- `useAtlasAssistContext` derives grounding counts and adaptive prompts from that context.
- `useAtlasAssist` manages requests, loading, failure, analytics, and current-session restoration.
- `AtlasAssistProvider` isolates response generation from React. Development without an endpoint uses the deterministic provider; production without an endpoint is explicitly unavailable.
- `groundAtlasAssistAnswer` rejects provider sources and limitations that are not present in the assembled context.
- `AtlasAssistPanel` is shared by project overview drawers and the focused reading rail. Source actions delegate to existing Atlas navigation.
- `server/atlas-assist/instructions.ts` contains the versioned Sovereign Atlas behavioral contract, separate from content assembly.
- `server/atlas-assist/handler.ts` validates requests and maps safe timeout, rate-limit, malformed-output, and provider failures.
- `api/atlas-assist.ts` is the thin Vercel-compatible Node function that owns server environment access.

Authored constellation connections and Application Kit `relatedFrameworks` are the only related-work inputs. The consultation layer does not infer relationships from keyword similarity.

## Knowledge Coverage

The deterministic context builder reads only canonical `ATLAS_ENTRIES` fields. Completed projects and frameworks include their full section narratives, decisions, outcomes, evidence descriptions, evidence-canvas annotations, and documented limitations. Application Kit modules are assembled from their authored `purpose`, `includes`, `useWhen`, and `watchFor` fields. Overview-only planned content remains overview-only rather than being filled with generated material.

Section scope includes only the selected section, its evidence, and explicitly authored relationships. Project scope includes the complete selected entry. Atlas scope includes the complete authored registry. No external retrieval is enabled.

## Provider Configuration

The repository previously had no server runtime convention. The live layer assumes a Vercel-compatible Node function at `/api/atlas-assist`; the core handler is platform-neutral and can be wrapped by another Node deployment adapter later.

Client build setting:

```bash
VITE_ATLAS_ASSIST_ENDPOINT=/api/atlas-assist
```

`VITE_ATLAS_ASSIST_ENDPOINT` is public and must never contain a credential. It may also be an absolute public API URL when the client and function are deployed separately.

Server runtime settings:

```bash
OPENAI_API_KEY=your-server-side-key
OPENAI_ATLAS_ASSIST_MODEL=gpt-5.6-luna
ATLAS_ASSIST_TIMEOUT_MS=12000
ATLAS_ASSIST_REQUESTS_PER_MINUTE=12
ATLAS_ASSIST_ALLOWED_ORIGINS=https://your-atlas.example.com
```

Only `OPENAI_API_KEY` is required by the server. The model defaults to `gpt-5.6-luna` and remains configurable without a client rebuild. `ATLAS_ASSIST_ALLOWED_ORIGINS` is optional for same-origin deployment and accepts a comma-separated list for cross-origin clients. The in-memory request limit is a per-instance safety boundary; production deployments should add their platform’s distributed rate limiter when traffic requires a global limit.

The endpoint uses the OpenAI Responses API with `store: false`, no tools or retrieval, and strict JSON Schema output. It sends the versioned instruction layer and the current `buildAtlasAssistContext` output. One prior grounded turn may be sent for continuity within the same scope, but it is explicitly marked as non-evidence.

## Provider Modes

- Development without `VITE_ATLAS_ASSIST_ENDPOINT`: deterministic provider.
- Any environment with `VITE_ATLAS_ASSIST_ENDPOINT`: live HTTP provider.
- Production without `VITE_ATLAS_ASSIST_ENDPOINT`: clear unavailable state; deterministic answers are not used.

The browser sends `{ query, context, history? }` as JSON and expects the existing `AtlasAssistAnswer`. The server validates scope, project and section identifiers, question length, context size, source declarations, response shape, cited source IDs, and limitations. Returned sources are replaced with canonical metadata from the submitted context before the answer leaves the server, then filtered a second time by the existing client grounding function.

## Local Development

For deterministic UI development, run `npm run dev` with `VITE_ATLAS_ASSIST_ENDPOINT` unset.

To exercise the server function locally, configure the environment values above and run the project through Vercel’s local runtime so both Vite and `/api/atlas-assist` are available:

```bash
npx vercel dev --listen 4173
```

Use `/api/atlas-assist` for `VITE_ATLAS_ASSIST_ENDPOINT`. Do not put `OPENAI_API_KEY` in browser code, a `VITE_` variable, or a committed environment file.

When the endpoint fails, times out, is rate-limited, or returns an invalid contract, the current UI presents a recoverable and safe client-facing failure state.

## Manual Regression

1. Open a case-study overview and confirm `Consult this project` remains visually subordinate to the overview.
2. Run each overview suggestion and confirm project scope, source counts, limitations, and source links.
3. Submit an unrelated question and confirm Atlas refuses it without external knowledge.
4. Submit a comparison in project scope and confirm Atlas asks for an intentional switch to Entire Atlas.
5. Open a documented source and confirm the existing focused route, section, and evidence artifact are selected.
6. Open `Consult this section` and confirm section scope, section-aware prompts, and section-only evidence.
7. Switch among section, project, and Atlas scopes and confirm every change is visible and clears the prior answer.
8. Open and close an evidence source and confirm the consultation answer remains available for the session.
9. Verify Escape closes evidence before consultation, then closes consultation and restores focus to its trigger.
10. Verify keyboard focus, screen-reader labels, 44px controls, high contrast, and reduced motion.
11. Repeat overview and focused flows at desktop and 390px mobile widths.
12. Test with a failing endpoint and confirm the recoverable error state and retry action.
13. Run `npm run test:assist` to verify all three scopes, unsupported claims, invented metrics, malformed-output recovery, source allowlisting, missing credentials, timeout, and provider selection.
14. Run `npm run build`, then confirm `OPENAI_API_KEY` and any real credential value do not appear under `dist/`.
