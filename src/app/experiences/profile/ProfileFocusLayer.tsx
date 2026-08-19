import { useEffect, useRef } from "react";
import ProfileHudFrame from "./ProfileHudFrame";
import ProfileProjectionLine from "./ProfileProjectionLine";
import ProfileTimelinePanel from "./ProfileTimelinePanel";
import ProfileContactPanel from "./ProfileContactPanel";
import ProfileAboutPanel from "./ProfileAboutPanel";
import ProfilePhilosophyPanel from "./ProfilePhilosophyPanel";
import type {
  ProfileHotspotDefinition,
  ProfileHotspotId,
} from "./profileHotspots";

interface ProfileFocusLayerProps {
  focus: ProfileHotspotId | null;
  hotspot: ProfileHotspotDefinition | null;
  closing?: boolean;
  onClose: () => void;
}

export default function ProfileFocusLayer({
  focus,
  hotspot,
  closing = false,
  onClose,
}: ProfileFocusLayerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!focus || focus === "atlas") return;

    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    dialogRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && dialogRef.current) {
        const controls = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (!controls.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus({ preventScroll: true });
    };
  }, [focus, onClose]);

  if (!focus || !hotspot || focus === "atlas") return null;

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={hotspot.label}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        pointerEvents: "auto",
      }}
    >
      <button
        type="button"
        aria-label="Close profile panel"
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0,
          padding: 0,
          background:
            "radial-gradient(circle at 50% 40%, rgba(0,0,0,0.18), rgba(0,0,0,0.58))",
          cursor: "default",
          opacity: closing ? 0 : 1,
          transition: "opacity 360ms ease",
          animation: closing
            ? "none"
            : "profileFocusVeilIn 460ms ease-out forwards",
        }}
      />

      {focus === "contact" && (
        <ProfileProjectionLine hotspot={hotspot} closing={closing} />
      )}

      <ProfileHudFrame
        hotspot={hotspot}
        closing={closing}
        onClose={onClose}
      >
        {focus === "timeline" && <ProfileTimelinePanel />}
        {focus === "contact" && <ProfileContactPanel />}
        {focus === "about" && <ProfileAboutPanel />}
        {focus === "philosophy" && <ProfilePhilosophyPanel />}
      </ProfileHudFrame>
    </div>
  );
}
