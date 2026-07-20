import ProfileHudFrame from "./ProfileHudFrame";
import ProfileProjectionLine from "./ProfileProjectionLine";
import ProfileTimelinePanel from "./ProfileTimelinePanel";
import ProfileContactPanel from "./ProfileContactPanel";
import ProfileAboutPanel from "./ProfileAboutPanel";
import ProfilePhilosophyPanel from "./ProfilePhilosophyPanel";
import type { ProfileHotspotDefinition, ProfileHotspotId } from "./profileHotspots";

interface ProfileFocusLayerProps {
  focus: ProfileHotspotId | null;
  hotspot: ProfileHotspotDefinition | null;
  closing?: boolean;
  onClose: () => void;
}

export default function ProfileFocusLayer({ focus, hotspot, closing = false, onClose }: ProfileFocusLayerProps) {
  if (!focus || !hotspot || focus === "atlas") return null;

  const veil =
    focus === "timeline"
      ? "linear-gradient(180deg, rgba(7,5,3,0.18), rgba(20,10,2,0.34))"
      : focus === "contact"
        ? "linear-gradient(180deg, rgba(3,7,8,0.16), rgba(2,12,9,0.34))"
        : focus === "about"
          ? "linear-gradient(180deg, rgba(4,7,14,0.16), rgba(5,12,28,0.34))"
          : "linear-gradient(180deg, rgba(9,5,16,0.16), rgba(18,8,30,0.34))";

  return (
    <div role="dialog" aria-modal="true" aria-label={hotspot.label} style={{ position: "absolute", inset: 0, zIndex: 20, pointerEvents: "auto" }}>
      <button type="button" aria-label="Close profile panel" onClick={onClose} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, padding: 0, background: veil, cursor: "default", opacity: closing ? 0 : 1, transition: "opacity 340ms ease", animation: closing ? "none" : "profileFocusVeilIn 420ms ease-out forwards" }} />

      {focus === "contact" && <ProfileProjectionLine hotspot={hotspot} closing={closing} />}

      <ProfileHudFrame hotspot={hotspot} closing={closing} onClose={onClose}>
        {focus === "timeline" && <ProfileTimelinePanel />}
        {focus === "contact" && <ProfileContactPanel />}
        {focus === "about" && <ProfileAboutPanel />}
        {focus === "philosophy" && <ProfilePhilosophyPanel />}
      </ProfileHudFrame>
    </div>
  );
}
