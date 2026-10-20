import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import type {
  SpatialBounds,
  SpatialFocusOptions,
  SpatialPadding,
  SpatialView,
} from "./spatialTypes";

interface DragState {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  moved: boolean;
}

interface Options {
  worldBounds: SpatialBounds;
  openingBounds?: SpatialBounds;
  padding?: Partial<SpatialPadding>;
  minScale?: number;
  maxScale?: number;
  maxOpeningScale?: number;
}

const DEFAULT_PADDING: SpatialPadding = {
  top: 112,
  right: 88,
  bottom: 92,
  left: 88,
};

const CAMERA_EASING = "transform 780ms cubic-bezier(.22,1,.36,1)";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function useSpatialCamera({
  worldBounds,
  openingBounds = worldBounds,
  padding,
  minScale = 0.42,
  maxScale = 2.2,
  maxOpeningScale = 0.92,
}: Options) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<SpatialView>({ x: 0, y: 0, scale: 1 });
  const dragRef = useRef<DragState | null>(null);
  const hasInteractedRef = useRef(false);
  const suppressClickRef = useRef(false);
  const motionTimerRef = useRef<number | null>(null);
  const [view, setViewState] = useState<SpatialView>(viewRef.current);
  const [dragging, setDragging] = useState(false);
  const [cameraTransition, setCameraTransition] = useState("none");
  const [reducedMotion, setReducedMotion] = useState(false);

  const resolvedPadding = {
    ...DEFAULT_PADDING,
    ...padding,
  };

  const setView = useCallback(
    (next: SpatialView | ((current: SpatialView) => SpatialView)) => {
      setViewState((current) => {
        const resolved = typeof next === "function" ? next(current) : next;
        viewRef.current = resolved;
        return resolved;
      });
    },
    [],
  );

  const stopCameraMotion = useCallback(() => {
    if (motionTimerRef.current !== null) {
      window.clearTimeout(motionTimerRef.current);
      motionTimerRef.current = null;
    }
    setCameraTransition("none");
  }, []);

  const beginCameraMotion = useCallback(() => {
    stopCameraMotion();
    if (reducedMotion) return;
    setCameraTransition(CAMERA_EASING);
    motionTimerRef.current = window.setTimeout(() => {
      setCameraTransition("none");
      motionTimerRef.current = null;
    }, 820);
  }, [reducedMotion, stopCameraMotion]);

  const fitBounds = useCallback(
    (bounds: SpatialBounds = openingBounds, markInteracted = true) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const rect = viewport.getBoundingClientRect();
      const availableWidth =
        rect.width - resolvedPadding.left - resolvedPadding.right;
      const availableHeight =
        rect.height - resolvedPadding.top - resolvedPadding.bottom;
      if (availableWidth <= 0 || availableHeight <= 0) return;

      const scale = clamp(
        Math.min(availableWidth / bounds.width, availableHeight / bounds.height),
        minScale,
        maxOpeningScale,
      );
      const x =
        resolvedPadding.left +
        (availableWidth - bounds.width * scale) / 2 -
        bounds.x * scale;
      const y =
        resolvedPadding.top +
        (availableHeight - bounds.height * scale) / 2 -
        bounds.y * scale;

      if (markInteracted) hasInteractedRef.current = true;
      beginCameraMotion();
      setView({ x, y, scale });
    },
    [
      beginCameraMotion,
      maxOpeningScale,
      minScale,
      openingBounds,
      resolvedPadding.bottom,
      resolvedPadding.left,
      resolvedPadding.right,
      resolvedPadding.top,
      setView,
    ],
  );

  const resetView = useCallback(() => {
    hasInteractedRef.current = false;
    fitBounds(openingBounds, false);
  }, [fitBounds, openingBounds]);

  const moveToView = useCallback(
    (nextView: SpatialView, markInteracted = true) => {
      if (markInteracted) hasInteractedRef.current = true;
      beginCameraMotion();
      setView({
        x: nextView.x,
        y: nextView.y,
        scale: clamp(nextView.scale, minScale, maxScale),
      });
    },
    [beginCameraMotion, maxScale, minScale, setView],
  );

  const focusPoint = useCallback(
    (
      point: { x: number; y: number },
      { scale = 1.24, anchorX = 0.5, anchorY = 0.52 }: SpatialFocusOptions = {},
    ) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const rect = viewport.getBoundingClientRect();
      const nextScale = clamp(scale, minScale, maxScale);
      hasInteractedRef.current = true;
      beginCameraMotion();
      setView({
        scale: nextScale,
        x: rect.width * anchorX - point.x * nextScale,
        y: rect.height * anchorY - point.y * nextScale,
      });
    },
    [beginCameraMotion, maxScale, minScale, setView],
  );

  const zoomAt = useCallback(
    (nextScale: number, clientX?: number, clientY?: number) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const rect = viewport.getBoundingClientRect();
      stopCameraMotion();
      hasInteractedRef.current = true;
      setView((current) => {
        const scale = clamp(nextScale, minScale, maxScale);
        const anchorX =
          typeof clientX === "number" ? clientX - rect.left : rect.width / 2;
        const anchorY =
          typeof clientY === "number" ? clientY - rect.top : rect.height / 2;
        const worldX = (anchorX - current.x) / current.scale;
        const worldY = (anchorY - current.y) / current.scale;
        return {
          scale,
          x: anchorX - worldX * scale,
          y: anchorY - worldY * scale,
        };
      });
    },
    [maxScale, minScale, setView, stopCameraMotion],
  );

  const handleWheel = useCallback(
    (event: ReactWheelEvent<HTMLDivElement>) => {
      event.preventDefault();
      zoomAt(
        viewRef.current.scale * Math.exp(-event.deltaY * 0.0013),
        event.clientX,
        event.clientY,
      );
    },
    [zoomAt],
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if ((event.target as HTMLElement).closest("[data-spatial-control]")) return;
      stopCameraMotion();
      hasInteractedRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      const current = viewRef.current;
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: current.x,
        originY: current.y,
        moved: false,
      };
      setDragging(true);
    },
    [stopCameraMotion],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (Math.hypot(dx, dy) > 5) drag.moved = true;
      setView((current) => ({
        ...current,
        x: drag.originX + dx,
        y: drag.originY + dy,
      }));
    },
    [setView],
  );

  const handlePointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      suppressClickRef.current = drag.moved;
      dragRef.current = null;
      setDragging(false);
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    },
    [],
  );

  const shouldSuppressClick = useCallback(() => suppressClickRef.current, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    fitBounds(openingBounds, false);
    const handleResize = () => {
      if (!hasInteractedRef.current) fitBounds(openingBounds, false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fitBounds, openingBounds]);

  useEffect(
    () => () => {
      if (motionTimerRef.current !== null) {
        window.clearTimeout(motionTimerRef.current);
      }
    },
    [],
  );

  return {
    viewportRef,
    view,
    viewRef,
    dragging,
    cameraTransition,
    reducedMotion,
    fitBounds,
    resetView,
    moveToView,
    focusPoint,
    zoomAt,
    zoomIn: () => zoomAt(viewRef.current.scale * 1.18),
    zoomOut: () => zoomAt(viewRef.current.scale / 1.18),
    handleWheel,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd,
    shouldSuppressClick,
    stopCameraMotion,
  };
}

export type SpatialCamera = ReturnType<typeof useSpatialCamera>;
