export interface SpatialPoint {
  x: number;
  y: number;
}

export interface SpatialSize {
  width: number;
  height: number;
}

export interface SpatialView extends SpatialPoint {
  scale: number;
}

export interface SpatialBounds extends SpatialPoint, SpatialSize {}

export interface SpatialPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface SpatialFocusOptions {
  scale?: number;
  anchorX?: number;
  anchorY?: number;
}
