import { useEffect, type RefObject } from "react";

const LABEL_SELECTOR = "[data-atlas-attention-label]";

const RESTING_OPACITY = 0.08;
const MAX_POINTER_DISTANCE = 300;
const SIGMA = 118;
const MAX_LIFT = 3;
const MAX_SCALE = 1.08;

interface UseAtlasCursorAttentionOptions {
  rootRef: RefObject<SVGSVGElement | null>;
  enabled: boolean;
}

interface LabelSnapshot {
  element: SVGTextElement;
  centerX: number;
  centerY: number;
  relationId: string;
}

function gaussianFalloff(distance: number) {
  return Math.exp(-(distance * distance) / (2 * SIGMA * SIGMA));
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function resetLabel(element: SVGTextElement) {
  element.style.opacity = "";
  element.style.filter = "";
  element.style.transform = "";
  element.style.transformBox = "";
  element.style.transformOrigin = "";
}

export default function useAtlasCursorAttention({
  rootRef,
  enabled,
}: UseAtlasCursorAttentionOptions) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;

    const pointer = {
      x: 0,
      y: 0,
      inside: false,
      dirty: true,
    };

    let frameId = 0;
    let snapshots: LabelSnapshot[] = [];

    const collectLabels = () => {
      snapshots = Array.from(
        root.querySelectorAll<SVGTextElement>(LABEL_SELECTOR),
      ).map((element) => {
        const rect = element.getBoundingClientRect();

        return {
          element,
          centerX: rect.left + rect.width / 2,
          centerY: rect.top + rect.height / 2,
          relationId: element.dataset.atlasRelation ?? "",
        };
      });
    };

    const render = () => {
      frameId = window.requestAnimationFrame(render);

      if (!pointer.dirty) return;
      pointer.dirty = false;

      collectLabels();

      if (!pointer.inside) {
        snapshots.forEach(({ element }) => resetLabel(element));
        return;
      }

      const hoveredRelationIds = new Set(
        snapshots
          .filter(({ element }) => element.matches(":hover"))
          .map(({ relationId }) => relationId)
          .filter(Boolean),
      );

      snapshots.forEach(({ element, centerX, centerY, relationId }) => {
        const dx = pointer.x - centerX;
        const dy = pointer.y - centerY;
        const distance = Math.hypot(dx, dy);
        const proximity = clamp01(gaussianFalloff(distance));
        const insideField = distance <= MAX_POINTER_DISTANCE;
        const hovered = element.matches(":hover");
        const related =
          !hovered &&
          relationId.length > 0 &&
          hoveredRelationIds.has(relationId);

        let opacity = insideField
          ? RESTING_OPACITY + proximity * (1 - RESTING_OPACITY)
          : RESTING_OPACITY;

        if (related) opacity = Math.max(opacity, 0.42);
        if (hovered) opacity = 1;

        const safeDistance = Math.max(distance, 1);
        const liftStrength = hovered
          ? 1
          : insideField
            ? proximity
            : 0;
        const liftX = (dx / safeDistance) * MAX_LIFT * liftStrength;
        const liftY = (dy / safeDistance) * MAX_LIFT * liftStrength;
        const scale = hovered
          ? MAX_SCALE
          : 0.96 + proximity * 0.06;

        const blur = hovered
          ? 0
          : Math.max(0, 0.6 - proximity * 0.9);
        const glow = hovered
          ? "drop-shadow(0 0 5px currentColor)"
          : related
            ? "drop-shadow(0 0 2px currentColor)"
            : "none";

        element.style.opacity = opacity.toFixed(3);
        element.style.filter =
          blur > 0.01
            ? `blur(${blur.toFixed(2)}px) ${glow}`
            : glow;
        element.style.transformBox = "fill-box";
        element.style.transformOrigin = "center";
        element.style.transform =
          `translate(${liftX.toFixed(2)}px, ${liftY.toFixed(2)}px) scale(${scale.toFixed(3)})`;
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.inside = true;
      pointer.dirty = true;
    };

    const handlePointerLeave = () => {
      pointer.inside = false;
      pointer.dirty = true;
    };

    const handleLayoutChange = () => {
      pointer.dirty = true;
    };

    root.addEventListener("pointermove", handlePointerMove, { passive: true });
    root.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", handleLayoutChange);
    window.addEventListener("scroll", handleLayoutChange, { passive: true });

    frameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameId);
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", handleLayoutChange);
      window.removeEventListener("scroll", handleLayoutChange);
      snapshots.forEach(({ element }) => resetLabel(element));
    };
  }, [enabled, rootRef]);
}
