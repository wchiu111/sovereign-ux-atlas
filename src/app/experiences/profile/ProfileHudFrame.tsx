import type { ReactNode } from "react";
import type { ProfileHotspotDefinition } from "./profileHotspots";
import {
  getNearestHudEdgePoint,
  getProfileHudAttachment,
  getProfileHudRect,
  isPointInsideHud,
} from "./profileHudLayout";
import { useProfileStage } from "./useProfileStage";

interface ProfileHudFrameProps {
  hotspot: ProfileHotspotDefinition;
  closing?: boolean;
  children: ReactNode;
  onClose: () => void;
}

export default function ProfileHudFrame({
  hotspot,
  closing = false,
  children,
  onClose,
}: ProfileHudFrameProps) {
  const { stageToScreen, viewportWidth, viewportHeight } = useProfileStage();
  const rect = getProfileHudRect(
    hotspot.id,
    viewportWidth,
    viewportHeight,
  );
  const origin = stageToScreen(hotspot);
  const originInsideHud = isPointInsideHud(origin, rect, 4);
  const attachment = originInsideHud
    ? getNearestHudEdgePoint(rect, origin, 54)
    : getProfileHudAttachment(hotspot.id, rect, origin);

  const localAttachment = {
    x: attachment.x - rect.left,
    y: attachment.y - rect.top,
  };
  const timeline = hotspot.id === "timeline";
  const contact = hotspot.id === "contact";
  const about = hotspot.id === "about";
  const philosophy = hotspot.id === "philosophy";

  return (
    <section
      style={{
        position: "absolute",
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        transform: `translateY(${closing ? "20px" : "0"}) scale(${
          closing ? 0.985 : 1
        })`,
        opacity: closing ? 0 : 1,
        color: "#F4EBD0",
        background: timeline
          ? "linear-gradient(180deg, rgba(18,10,4,0.84), rgba(7,5,4,0.91))"
          : contact
            ? "linear-gradient(180deg, rgba(5,15,14,0.82), rgba(3,8,9,0.90))"
            : about
              ? "linear-gradient(180deg, rgba(5,11,22,0.84), rgba(3,7,14,0.92))"
              : philosophy
                ? "linear-gradient(180deg, rgba(14,7,24,0.84), rgba(7,4,13,0.92))"
                : "linear-gradient(180deg, rgba(13,12,10,0.82), rgba(6,7,9,0.88))",
        boxShadow: `0 24px 72px rgba(0,0,0,0.36), 0 0 52px ${hotspot.color}16, inset 0 0 32px ${hotspot.color}08`,
        overflow: "hidden",
        clipPath:
          "polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)",
        transition:
          "opacity 300ms ease, transform 420ms cubic-bezier(0.22,1,0.36,1)",
        transformOrigin: timeline ? "22% 100%" : philosophy ? "100% 52%" : about ? "50% 65%" : "0 58%",
        animation: closing
          ? "none"
          : timeline
            ? "profileArchiveHudUnfold 820ms cubic-bezier(0.22,1,0.36,1) 280ms both"
            : contact
              ? "profileContactHudPowerOn 760ms cubic-bezier(0.22,1,0.36,1) 300ms both"
              : about
                ? "profileAboutHudAssemble 800ms cubic-bezier(0.22,1,0.36,1) 280ms both"
                : "profilePhilosophyHudStack 840ms cubic-bezier(0.22,1,0.36,1) 280ms both",
      }}
    >
      <FrameGeometry
        hotspot={hotspot}
        closing={closing}
        attachment={localAttachment}
        originInsideHud={originInsideHud}
      />

      <div
        style={{
          position: "relative",
          zIndex: 3,
          display: "grid",
          gridTemplateRows: "auto minmax(0, 1fr)",
          height: "100%",
          minHeight: 0,
          opacity: closing ? 0 : 1,
          transform: `translateY(${closing ? 8 : 0}px)`,
          transition:
            "opacity 220ms ease, transform 320ms cubic-bezier(0.22,1,0.36,1)",
          animation: closing
            ? "none"
            : "profileHudContentIn 540ms ease-out 900ms both",
        }}
      >
        <PanelHeader hotspot={hotspot} onClose={onClose} />

        <div
          style={{
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            overscrollBehavior: "contain",
            scrollbarWidth: "thin",
            scrollbarColor: `${hotspot.color}66 transparent`,
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

function FrameGeometry({
  hotspot,
  closing,
  attachment,
  originInsideHud,
}: {
  hotspot: ProfileHotspotDefinition;
  closing: boolean;
  attachment: { x: number; y: number };
  originInsideHud: boolean;
}) {
  const timeline = hotspot.id === "timeline";
  const line = `${hotspot.color}A0`;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        pointerEvents: "none",
        opacity: closing ? 0 : 1,
        transition: "opacity 220ms ease",
      }}
    >
      <span style={{ ...corner, left: 0, top: 0, borderLeft: `1px solid ${line}`, borderTop: `1px solid ${line}` }} />
      <span style={{ ...corner, right: 0, top: 0, borderRight: `1px solid ${line}`, borderTop: `1px solid ${line}` }} />
      <span style={{ ...corner, left: 0, bottom: 0, borderLeft: `1px solid ${line}`, borderBottom: `1px solid ${line}` }} />
      <span style={{ ...corner, right: 0, bottom: 0, borderRight: `1px solid ${line}`, borderBottom: `1px solid ${line}` }} />

      <span style={{ ...edgeHorizontal, top: 0, left: 14, background: `linear-gradient(90deg, ${line}, ${hotspot.color}30)` }} />
      <span style={{ ...edgeHorizontal, bottom: 0, right: 14, background: `linear-gradient(270deg, ${line}, ${hotspot.color}30)` }} />
      <span style={{ ...edgeVertical, left: 0, top: 14, background: `linear-gradient(180deg, ${line}, ${hotspot.color}28)` }} />
      <span style={{ ...edgeVertical, right: 0, bottom: 14, background: `linear-gradient(0deg, ${line}, ${hotspot.color}28)` }} />

      {hotspot.id === "contact" && !originInsideHud && (
        <span
          style={{
            position: "absolute",
            left: attachment.x,
            top: attachment.y,
            width: 12,
            height: 12,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: hotspot.color,
            border: `2px solid rgba(4,7,9,0.92)`,
            boxShadow: `0 0 18px ${hotspot.color}D8, 0 0 38px ${hotspot.color}68`,
            animation: "profileProjectionTargetIn 360ms ease-out 480ms both",
          }}
        />
      )}

      {hotspot.id === "contact" && originInsideHud && (
        <ContactEdgeTrace
          color={hotspot.color}
          attachment={attachment}
        />
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          backgroundImage:
            `linear-gradient(${hotspot.color}20 1px, transparent 1px), linear-gradient(90deg, ${hotspot.color}16 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.86), rgba(0,0,0,0.24))",
          animation: "profileHudGridIn 640ms ease-out 620ms both",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: -18,
          height: 38,
          opacity: timeline ? 0.24 : 0.42,
          background: timeline
            ? "linear-gradient(180deg, transparent, rgba(232,200,109,0.24), transparent)"
            : `linear-gradient(180deg, transparent, ${hotspot.color}3E, transparent)`,
          animation: timeline
            ? "profileArchiveScan 8200ms linear 1200ms infinite"
            : "profileHudScan 5200ms linear 1000ms infinite",
        }}
      />
    </div>
  );
}


function ContactEdgeTrace({
  color,
  attachment,
}: {
  color: string;
  attachment: { x: number; y: number };
}) {
  return (
    <>
      <span
        style={{
          position: "absolute",
          left: 0,
          top: attachment.y,
          width: 82,
          height: 1,
          transform: "translateY(-50%)",
          background: `linear-gradient(90deg, ${color}E8, ${color}58, transparent)`,
          boxShadow: `0 0 10px ${color}88`,
          animation: "profileProjectionTargetIn 360ms ease-out 280ms both",
        }}
      />

      <span
        style={{
          position: "absolute",
          left: 0,
          top: attachment.y,
          width: 10,
          height: 10,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: `1px solid ${color}C8`,
          background: "rgba(3,8,9,0.94)",
          boxShadow: `0 0 16px ${color}A8`,
          animation: "profileProjectionTargetIn 360ms ease-out 320ms both",
        }}
      />
    </>
  );
}

function PanelHeader({
  hotspot,
  onClose,
}: {
  hotspot: ProfileHotspotDefinition;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 18,
        padding: "17px 20px",
        borderBottom: `1px solid ${hotspot.color}2E`,
        background: `linear-gradient(90deg, ${hotspot.color}12, transparent 44%)`,
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: `${hotspot.color}D0`,
          }}
        >
          {hotspot.eyebrow}
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: "'DM Mono', monospace",
            fontSize: 22,
            lineHeight: 1.2,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(255,248,229,0.96)",
          }}
        >
          {hotspot.id === "about" ? "About" : hotspot.label}
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label={`Close ${hotspot.label}`}
        style={{
          width: 42,
          height: 42,
          borderRadius: 7,
          border: `1px solid ${hotspot.color}52`,
          background: `${hotspot.color}08`,
          color: "rgba(245,235,210,0.84)",
          fontFamily: "'DM Mono', monospace",
          fontSize: 20,
          cursor: "pointer",
        }}
      >
        ×
      </button>
    </div>
  );
}

const corner: React.CSSProperties = {
  position: "absolute",
  width: 30,
  height: 30,
  animation:
    "profileHudCornerIn 360ms cubic-bezier(0.22,1,0.36,1) 410ms both",
};

const edgeHorizontal: React.CSSProperties = {
  position: "absolute",
  width: "calc(100% - 28px)",
  height: 1,
  transformOrigin: "left center",
  animation:
    "profileHudEdgeXIn 520ms cubic-bezier(0.22,1,0.36,1) 520ms both",
};

const edgeVertical: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: "calc(100% - 28px)",
  transformOrigin: "center top",
  animation:
    "profileHudEdgeYIn 520ms cubic-bezier(0.22,1,0.36,1) 560ms both",
};
