import type { CSSProperties, RefObject } from "react";

interface AtlasAssistTriggerProps {
  color: string;
  open: boolean;
  onClick: () => void;
  buttonRef?: RefObject<HTMLButtonElement | null>;
  controls?: string;
  hasPopup?: "dialog";
}

export default function AtlasAssistTrigger({
  color,
  open,
  onClick,
  buttonRef,
  controls,
  hasPopup,
}: AtlasAssistTriggerProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className="atlas-assist-trigger"
      style={{ "--atlas-assist-trigger-color": color } as CSSProperties}
      data-active={open || undefined}
      aria-expanded={open}
      aria-controls={controls}
      aria-haspopup={hasPopup}
      onClick={onClick}
    >
      <span className="atlas-assist-trigger__icon" aria-hidden="true">
        ✦
      </span>
      <span>Ask</span>
    </button>
  );
}
