# Sovereign Foundations — Spatial Navigation Prototype (Pass 01)

## Objective

Redesign only the existing **Frameworks → Sovereign UX → Foundations → “From Belief to Behavior”** evidence canvas into an immersive desktop spatial environment.

The landing must retain the four canonical commitments and all ten canonical principles, add working free-roaming camera controls, and keep the existing long-form Principle Inspector and reflection content available without replacing the spatial world when a node is selected.

## Confirmed Product Decisions

- The existing evidence entry point and `canvas.id === "sovereign-foundations"` routing remain unchanged.
- Pass 01 is a desktop prototype:
  - At widths above the existing `1120px` breakpoint, use the new spatial world.
  - At or below `1120px`, preserve the current compact commitments/principles list and current compact inspector behavior.
- Selecting a principle:
  - Keeps the spatial world mounted and visible.
  - Animates the camera to frame the selected node in the portion of the viewport not covered by the inspector.
  - Opens the existing detailed Principle Inspector as a fixed right-side overlay.
- The available `.mov` is treated as the camera/interaction reference. The orbital visual treatment will use the repository’s existing Sovereign Atlas language and tokens.
- Do not alter the separate Foundations Focus Mode reading layout, any other Sovereign UX section, the parent Atlas, the evidence rail, or the canonical content registry.
- Do not push or otherwise publish repository changes.

## Existing Architecture to Preserve

- `src/app/content/frameworks/sovereign-ux-foundations.ts` remains the canonical source for:
  - Four commitments.
  - Ten principle titles and statements.
  - Belief, design responsibility, preserved agency, illustration, reflection, realignment, practice, and scope copy.
- `src/app/content/frameworks/sovereign-ux.ts` keeps the current “From Belief to Behavior” evidence metadata and `sovereign-foundations` canvas ID.
- `src/app/experiences/shared/AtlasReadingEngine.tsx` continues opening and closing `SovereignFoundationsCanvas` through the existing route.
- The current inspector content and reflection dialog are preserved semantically and textually; only their desktop presentation changes from a replacement layout to a fixed overlay above the persistent world.

## File-Level Implementation

### 1. Add reusable spatial camera primitives

Create a small shared module under:

`src/app/experiences/shared/spatial/`

#### `spatialTypes.ts`

Define reusable types:

- `SpatialPoint { x: number; y: number }`
- `SpatialSize { width: number; height: number }`
- `SpatialView { x: number; y: number; scale: number }`
- `SpatialBounds { x: number; y: number; width: number; height: number }`
- Camera focus options containing target point/bounds, target scale, viewport padding, and an optional horizontal viewport anchor for panel-aware framing.

#### `useSpatialCamera.ts`

Implement the reusable camera state and coordinate math:

- Inputs:
  - World size/bounds.
  - Minimum and maximum scale.
  - Opening/fitted bounds.
  - Viewport ref.
  - Reduced-motion preference.
- State and refs:
  - Current `{ x, y, scale }`.
  - Dragging state.
  - Pointer drag origin.
  - Current view ref to avoid stale closures.
  - Interaction state so resize only recomputes the opening view when appropriate.
- Public API:
  - `fitBounds` / `resetView`.
  - `focusPoint` or `focusBounds`.
  - `zoomAt` using a cursor or viewport-center anchor.
  - Wheel handler using exponential zoom and scale clamping.
  - Pointer down/move/up/cancel handlers using pointer capture.
  - Keyboard zoom helpers for `+`, `-`, and `0`.
  - `cancelCameraMotion` when direct manipulation starts.
- Behavior:
  - World coordinates never change; only the camera transform changes.
  - Wheel zoom preserves the world point beneath the cursor.
  - Dragging changes translation only.
  - Programmatic focus uses the Atlas-style easing `cubic-bezier(.22,1,.36,1)`.
  - Reduced motion applies the final camera transform immediately.
  - Camera bounds keep a meaningful portion of the world reachable while still allowing deliberate exploration beyond the initial fit.
  - Ignore drag starts originating inside `[data-spatial-control]`.
  - Use a small movement threshold so a drag does not accidentally activate a node on pointer release.

#### `SpatialViewport.tsx`

Create a reusable viewport/world renderer that:

- Owns the interactive viewport element and receives the camera API.
- Applies one transform to a stable, absolutely positioned world:
  - `translate3d(view.x, view.y, 0) scale(view.scale)`
  - `transform-origin: 0 0`
- Exposes fixed screen-space slots for:
  - Header/HUD.
  - Bottom-left interaction hint.
  - Bottom-center zoom/reset controls.
  - Overlay panels.
- Uses `role="application"` with a specific accessible label supplied by the caller.
- Uses `touch-action: none`, `grab`/`grabbing` cursors, and pointer capture.
- Does not encode Foundations-specific colors, labels, nodes, or inspector behavior.

#### `SpatialNode.tsx`

Create a reusable accessible node primitive:

- Stable `x`/`y` world position.
- Native button semantics.
- Selected, hovered/focused, dimmed, and disabled/noninteractive visual states supplied by the caller.
- Label and optional metadata slots.
- Uses an inverse-scale inner wrapper where needed to prevent labels and hit targets from becoming unreadably small or oversized at camera extremes.
- Supports hover/focus preview and Enter/Space activation.
- Contains no Foundations-specific content.

Do not refactor the existing `FrameworkEvidenceCanvas`, `SovereignLayeredSystemMapCanvas`, or `AtlasExplorer` to consume these primitives in Pass 01. They are reference implementations only; changing them would exceed scope.

### 2. Rebuild the desktop Foundations world

Update:

`src/app/experiences/frameworks/SovereignFoundationsCanvas.tsx`

Replace only the wide-screen fixed diagram branch with the shared spatial viewport.

#### Stable world model

Create a Foundations-specific layout configuration near the component or in a colocated helper file if the component becomes unwieldy:

- World: approximately `2400 × 1600` world units.
- Center/core: approximately `(1200, 800)`.
- Commitments form a restrained inner orbital system:
  - Clarity: north.
  - Consent: east.
  - Judgment: south.
  - Agency: west.
- Ten principles occupy an irregular outer ellipse in canonical numeric order, using explicit coordinates rather than computed positions.
- Keep coordinates in data constants so rendering and camera focus use the same source of truth.
- Do not imply undocumented principle-to-commitment mappings:
  - Commitment orbits and center-to-principle traces are atmospheric/navigation structure.
  - No line, grouping, or label should claim a canonical dependency not present in the content registry.

#### World composition

Render:

- A dark deep-space field consistent with `STELLAR_PALETTE`, `readerSemanticColor`, and the current Atlas typography.
- A central “Foundations / People at the center” core.
- Four larger commitment bodies with title and canonical meaning.
- Ten selectable principle stars/nodes with:
  - Canonical number.
  - Concise display label.
  - Full title available to assistive technology and in preview/inspector.
- Quiet orbital ellipses, sparse star particles, nebula glows, and restrained animated traces.
- Decorative motion must remain subordinate to navigation and be disabled under `prefers-reduced-motion`.
- Screen-stable SVG strokes via `vector-effect="non-scaling-stroke"` where appropriate.
- Semantic zoom:
  - Far view prioritizes the central system and commitment labels.
  - Mid view makes all principle labels legible.
  - Close view suppresses oversized region/orbit labeling while preserving node identity.

#### Opening view

- On mount, fit the complete orbital system within the desktop viewport while leaving room for the fixed top HUD and bottom controls.
- Recompute this fit on resize only before the user has manually moved the camera.
- Preserve the current entry/exit fade behavior, adapting it to the new world rather than changing the parent evidence transition.

### 3. Implement fixed navigation HUD and camera controls

Keep all controls outside the transformed world.

#### Top HUD

- Left:
  - Existing section title.
  - “Beliefs behind the interface” orientation label.
- Right:
  - Existing `BACK TO FRAMEWORK` action wired to the unchanged `onClose`.
- The header remains fixed while the world moves beneath it.

#### Bottom HUD

- Bottom-left:
  - “DRAG TO EXPLORE · SCROLL TO ZOOM · SELECT A PRINCIPLE”
  - Decorative pointer icon must use the existing Lucide icon set rather than an emoji.
- Bottom-center:
  - Zoom out.
  - Current zoom percentage.
  - Zoom in.
  - `RESET VIEW`.
- `RESET VIEW`:
  - Clears hover and selected-principle state.
  - Closes the inspector if open.
  - Animates back to the opening fit, or jumps immediately under reduced motion.
- Add keyboard equivalents:
  - `+` / `=` zoom in.
  - `-` zoom out.
  - `0` reset view.

### 4. Add node focus without replacing the world

When a principle is activated:

1. Clear transient hover preview.
2. Set the selected principle ID.
3. Compute a panel-aware camera target from the principle’s stable world coordinates.
4. Animate to a close but readable scale, framing the node around 40–42% of the usable viewport width so the right inspector does not cover it.
5. Open the inspector overlay while leaving the world mounted.
6. Highlight the selected node and its center trace; softly dim unrelated nodes without removing them.
7. Move keyboard focus to the inspector heading after the panel is mounted.

Direct manipulation after focus remains available:

- Dragging pans the same selected world.
- Wheel zoom continues around the cursor.
- The inspector remains fixed and readable.
- Selecting a different visible node updates the selected content and refocuses the camera instead of remounting the environment.

Hover/focus on an unselected principle should show a small screen-stable preview with principle number, title, and belief. The preview must not intercept pointer events.

### 5. Convert the desktop Principle Inspector to an overlay

Preserve all existing detail sections:

- Original principle statement.
- What we believe.
- What design must do.
- What the person retains.
- Applied illustration and disclaimer.
- Practice note.
- Reflection action.
- Ten-principle navigation.

Desktop presentation:

- Fixed right-side panel above the world, approximately `430–480px` wide depending on available viewport width.
- Opaque/translucent dark surface with enough contrast that world motion does not compromise reading.
- Independent vertical scrolling.
- Existing principle navigation remains available, either as a compact numbered list within the panel or a collapsible top section; it must not create a second page-level rail.
- “ALL PRINCIPLES” becomes a `BACK TO FIELD` action:
  - Closes the overlay.
  - Clears selection.
  - Returns the camera to the opening fit.
- Previous/next principle navigation may be retained if it is already easy to express through the existing list, but no new canonical sequence language should be introduced.

Responsive presentation:

- At or below `1120px`, do not use the overlay.
- Preserve the existing compact overview and replacement inspector layout, including its existing focus restoration.

If extracting the inspector reduces risk and file size, create:

`src/app/experiences/frameworks/SovereignFoundationsInspector.tsx`

The extracted component must remain presentation-only and receive the selected principle plus navigation/reflection callbacks; it must continue reading canonical copy from the existing content module.

### 6. Preserve and layer the reflection dialog

- Keep all five reflection questions, the realignment sequence, return-to-fundamentals copy, and scope boundary unchanged.
- Render the dialog above both the inspector and world.
- Retain:
  - Focus trap.
  - Initial focus.
  - Focus restoration to the reflection trigger.
  - Backdrop close.
  - Escape close.
- Escape priority:
  1. Close reflection dialog.
  2. Close inspector and return to the opening field.
  3. Exit the evidence canvas back to the framework.

## Interaction and State Model

Use explicit state rather than replacing layout branches on desktop:

- `phase`: entering/open/exiting.
- `selectedId`: active principle or `null`.
- `previewId`: hovered/focused principle or `null`.
- `reflectionOpen`.
- `compactField`: existing breakpoint behavior.
- Camera state from `useSpatialCamera`.
- Reduced-motion state.

Avoid coupling camera coordinates to React content routing. The content selection state identifies what is being inspected; the camera independently determines how that world location is framed.

## Accessibility Requirements

- All ten principle nodes are keyboard reachable in canonical order.
- Node buttons expose full principle titles even when the visual label is shortened.
- Selected node uses `aria-current` or `aria-pressed` consistently.
- Commitment bodies remain semantic groups unless they gain an action; do not style noninteractive commitments like clickable controls.
- The viewport label explains that it is an interactive Foundations field.
- Fixed controls have explicit accessible names.
- Focus styling remains visible at every camera scale.
- Camera animation and decorative orbital motion honor `prefers-reduced-motion`.
- Compact/mobile behavior remains a complete non-spatial fallback.

## Guardrails

- Do not edit canonical copy in `sovereign-ux-foundations.ts`.
- Do not add hardcoded duplicate principle content to rendering components.
- Do not change `sovereign-ux.ts` evidence IDs or routing.
- Do not modify `AtlasReadingEngine` unless a type-only adjustment becomes strictly necessary; no navigation behavior change is expected.
- Do not edit other Sovereign UX canvases.
- Do not alter the general Atlas camera or main star map.
- Do not add a new route or standalone page.
- Do not introduce a new UI or animation dependency.
- Use existing Lucide icons, palette modules, EB Garamond, and DM Mono conventions.

## Verification

### Automated

- Run the repository’s production build:
  - `pnpm build`
- Repair only failures caused by this work.

### Manual in the existing supervised preview

Verify at a wide desktop viewport:

1. Navigate through the unchanged route to “From Belief to Behavior.”
2. Confirm all four commitments and ten canonical principles are visible in the opening field.
3. Drag to pan; release outside the viewport without stuck pointer capture.
4. Scroll at multiple cursor positions and confirm zoom anchors beneath the cursor.
5. Use zoom buttons and keyboard `+`, `-`, and `0`.
6. Select several principle nodes:
   - Camera moves to each node.
   - World stays mounted.
   - Inspector overlays the right side.
   - Inspector content matches the selected canonical principle.
   - Focus moves to the inspector heading.
7. Pan and zoom while the inspector is open.
8. Use `BACK TO FIELD` and confirm the opening view returns.
9. Use `RESET VIEW` from an arbitrary camera state and from a selected state.
10. Open and close the reflection dialog by button, backdrop, and Escape; confirm focus restoration.
11. Confirm Escape follows the reflection → inspector → evidence hierarchy.
12. Confirm `BACK TO FRAMEWORK` closes through the existing evidence route.
13. Enable reduced motion and confirm camera focus jumps without cinematic interpolation and decorative pulses stop.

Verify at and below `1120px`:

1. The existing compact overview remains available.
2. Selecting a principle opens the existing compact inspector rather than the desktop overlay.
3. All canonical content and reflection behavior remain accessible.

### Regression checks

- Foundations Focus Mode reading layout is unchanged.
- Other Sovereign UX evidence canvases are unchanged.
- The evidence rail title, description, and entry behavior are unchanged.
- No GitHub operation, commit, or push is performed.

## Acceptance Criteria

- The existing Foundations evidence entry opens a spatial desktop world rather than a fixed fitted diagram.
- Drag-to-pan, scroll-to-zoom, zoom controls, Reset View, Back to Field, and Back to Framework all work.
- World coordinates remain stable across pan, zoom, focus, inspector open/close, and resize.
- Selecting a principle moves the camera and opens the existing inspector over the persistent world.
- Four commitments and ten canonical principles remain intact and data-driven.
- Reflection content remains intact and accessible.
- Compact/mobile behavior remains functionally unchanged.
- Shared camera, viewport, and node primitives are reusable by a future evidence collection without importing Foundations-specific content.
