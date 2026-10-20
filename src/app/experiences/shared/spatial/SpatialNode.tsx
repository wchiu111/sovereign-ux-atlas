import type { CSSProperties, ReactNode } from "react";

interface Props {
  x: number;
  y: number;
  ariaLabel: string;
  selected?: boolean;
  dimmed?: boolean;
  className?: string;
  children: ReactNode;
  onClick: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  style?: CSSProperties;
}

export function SpatialNode({
  x,
  y,
  ariaLabel,
  selected = false,
  dimmed = false,
  className,
  children,
  onClick,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
  style,
}: Props) {
  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      aria-pressed={selected}
      data-spatial-node
      data-selected={selected ? "true" : "false"}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%,-50%)",
        opacity: dimmed ? 0.3 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
