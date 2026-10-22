import type { CSSProperties, ReactNode } from "react";
import type { SpatialCamera } from "./useSpatialCamera";
import type { SpatialSize } from "./spatialTypes";

interface Props {
  camera: SpatialCamera;
  worldSize: SpatialSize;
  ariaLabel: string;
  children: ReactNode;
  background?: CSSProperties["background"];
  backgroundImage?: CSSProperties["backgroundImage"];
  backgroundLayer?: ReactNode;
  bottomLeft?: ReactNode;
  bottomCenter?: ReactNode;
  overlay?: ReactNode;
}

export function SpatialViewport({
  camera,
  worldSize,
  ariaLabel,
  children,
  background,
  backgroundImage,
  backgroundLayer,
  bottomLeft,
  bottomCenter,
  overlay,
}: Props) {
  return (
    <div
      ref={camera.viewportRef}
      role="application"
      aria-label={ariaLabel}
      onWheel={camera.handleWheel}
      onPointerDown={camera.handlePointerDown}
      onPointerMove={camera.handlePointerMove}
      onPointerUp={camera.handlePointerEnd}
      onPointerCancel={camera.handlePointerEnd}
      style={{
        position: "relative",
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
        cursor: camera.dragging ? "grabbing" : "grab",
        touchAction: "none",
        background,
        backgroundImage,
      }}
    >
      {backgroundLayer}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: worldSize.width,
          height: worldSize.height,
          transformOrigin: "0 0",
          transform: `translate3d(${camera.view.x}px,${camera.view.y}px,0) scale(${camera.view.scale})`,
          transition: camera.cameraTransition,
          willChange: "transform",
        }}
      >
        {children}
      </div>
      {bottomLeft}
      {bottomCenter}
      {overlay}
    </div>
  );
}
