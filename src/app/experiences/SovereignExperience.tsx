import { useEffect, useRef, useState } from "react";
import AtlasExplorer from "../atlas/AtlasExplorer";
import AtlasArrival, {
  type ArrivalSelection,
} from "../components/AtlasArrival";
import FirstContactExperience from "./FirstContactExperience";
import ProfileExperience from "./ProfileExperience";
import type { SovereignMode } from "./sovereignExperience.types";

type TransitionStage = "cover" | "reveal";

interface ExperienceTransitionState extends ArrivalSelection {
  stage: TransitionStage;
}

const COVER_DURATION = 460;
const REVEAL_DURATION = 520;

export default function SovereignExperience() {
  const [mode, setMode] = useState<SovereignMode>("arrival");
  const [transition, setTransition] =
    useState<ExperienceTransitionState | null>(null);
  const [spatialTransition, setSpatialTransition] = useState<
    "toObservatory" | "toAtlas" | null
  >(null);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(window.clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const clearTransitionTimers = () => {
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];
  };

  const beginExperienceTransition = (selection: ArrivalSelection) => {
    if (transition) return;

    clearTransitionTimers();

    setTransition({
      ...selection,
      stage: "cover",
    });

    timersRef.current = [
      window.setTimeout(() => {
        setMode(selection.target);
        setTransition((current) =>
          current
            ? {
                ...current,
                stage: "reveal",
              }
            : null,
        );
      }, COVER_DURATION),

      window.setTimeout(() => {
        setTransition(null);
        timersRef.current = [];
      }, COVER_DURATION + REVEAL_DURATION),
    ];
  };

  const returnToArrival = () => {
    clearTransitionTimers();
    setTransition(null);
    setMode("arrival");
  };

  const enterObservatory = () => {
    if (spatialTransition || transition) return;

    clearTransitionTimers();
    setTransition(null);
    setSpatialTransition("toObservatory");
    setMode("profile");

    timersRef.current = [
      window.setTimeout(() => {
        setSpatialTransition(null);
        timersRef.current = [];
      }, 1420),
    ];
  };

  const enterAtlasFromObservatory = () => {
    if (spatialTransition || transition) return;

    clearTransitionTimers();
    setTransition(null);
    setSpatialTransition("toAtlas");
    setMode("atlas");

    timersRef.current = [
      window.setTimeout(() => {
        setSpatialTransition(null);
        timersRef.current = [];
      }, 1420),
    ];
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background: "#05050A",
      }}
    >
      {(mode === "profile" || spatialTransition !== null) && (
        <div
          aria-hidden={mode !== "profile"}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: spatialTransition === "toAtlas" ? 3 : 1,
            pointerEvents:
              mode === "profile" && !spatialTransition ? "auto" : "none",
            transformOrigin: "50% 44%",
            willChange: "transform, filter, opacity",
            animation:
              spatialTransition === "toObservatory"
                ? "observatoryRoomResolve 1420ms cubic-bezier(0.16,1,0.3,1) both"
                : spatialTransition === "toAtlas"
                  ? "observatoryRoomPushAway 1420ms cubic-bezier(0.16,1,0.3,1) both"
                  : undefined,
          }}
        >
          <ProfileExperience
            onExit={returnToArrival}
            onEnterAtlas={enterAtlasFromObservatory}
            onContact={() => setMode("contact")}
          />
        </div>
      )}

      <div
        aria-hidden={mode !== "atlas"}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: spatialTransition === "toAtlas" ? 2 : 3,
          visibility:
            mode === "atlas" || spatialTransition !== null ? "visible" : "hidden",
          pointerEvents:
            mode === "atlas" && !spatialTransition ? "auto" : "none",
          transformOrigin: "50% 44%",
          willChange: "transform, clip-path, filter, opacity",
          animation:
            spatialTransition === "toObservatory"
              ? "atlasPullIntoObservatory 1420ms cubic-bezier(0.16,1,0.3,1) both"
              : spatialTransition === "toAtlas"
                ? "atlasPushFromObservatory 1420ms cubic-bezier(0.16,1,0.3,1) both"
                : undefined,
        }}
      >
        <AtlasExplorer
          active={mode === "atlas" && !spatialTransition}
          onEnterObservatory={enterObservatory}
        />
      </div>

      {spatialTransition === "toObservatory" && (
        <ObservatoryPullbackOverlay />
      )}

      {spatialTransition === "toAtlas" && (
        <AtlasPushInOverlay />
      )}

      {mode === "arrival" && (
        <AtlasArrival
          transitioning={Boolean(transition)}
          onSelect={beginExperienceTransition}
        />
      )}

      {mode === "contact" && (
        <FirstContactExperience
          onExit={returnToArrival}
          onProfile={() => setMode("profile")}
          onEnterAtlas={enterAtlasFromObservatory}
        />
      )}

      {transition && (
        <ExperiencePullTransition transition={transition} />
      )}

      <style>{`
        @keyframes atlasPullIntoObservatory {
          0% {
            transform: scale(1);
            clip-path: circle(150% at 50% 44%);
            filter: blur(0px) saturate(1);
            opacity: 1;
          }

          100% {
            transform: scale(0.6);
            clip-path: circle(29% at 50% 44%);
            filter: blur(4px) saturate(0.76);
            opacity: 0;
          }
        }

        @keyframes observatoryRoomResolve {
          0% {
            transform: scale(1.04);
            filter: blur(7px);
            opacity: 0;
          }

          100% {
            transform: scale(1);
            filter: blur(0px);
            opacity: 1;
          }
        }

        @keyframes atlasPushFromObservatory {
          0% {
            transform: scale(0.6);
            clip-path: circle(29% at 50% 44%);
            filter: blur(4px) saturate(0.76);
            opacity: 0;
          }

          18% {
            opacity: 0.08;
          }

          100% {
            transform: scale(1);
            clip-path: circle(150% at 50% 44%);
            filter: blur(0px) saturate(1);
            opacity: 1;
          }
        }

        @keyframes observatoryRoomPushAway {
          0% {
            transform: scale(1);
            filter: blur(0px);
            opacity: 1;
          }

          100% {
            transform: scale(1.085);
            filter: blur(7px);
            opacity: 0;
          }
        }

        @keyframes atlasWindowPush {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.94);
          }

          18% {
            opacity: 0.72;
          }

          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2.45);
          }
        }

        @keyframes atlasSelectionPulse {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.62);
          }

          10% {
            opacity: 0.88;
          }

          28% {
            opacity: 0.48;
            transform: translate(-50%, -50%) scale(1.15);
          }

          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2.6);
          }
        }

        @keyframes atlasPushEdgeFade {
          0% {
            opacity: 0;
          }

          24% {
            opacity: 0.38;
          }

          100% {
            opacity: 0;
          }
        }

        @keyframes observatoryLensResolve {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.28);
          }

          55% {
            opacity: 0.34;
          }

          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.96);
          }
        }

        @keyframes observatoryEdgeResolve {
          0% {
            opacity: 0;
          }

          52% {
            opacity: 0.32;
          }

          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

function ObservatoryPullbackOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 4,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "44%",
          width: "68vmin",
          height: "68vmin",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          border: "1px solid rgba(232,200,109,0.2)",
          boxShadow:
            "0 0 0 3px rgba(2,4,8,0.22), 0 0 90px rgba(2,4,8,0.74), inset 0 0 90px rgba(2,4,8,0.18)",
          background:
            "radial-gradient(circle, transparent 58%, rgba(2,4,8,0.2) 76%, rgba(2,4,8,0.58) 100%)",
          animation:
            "observatoryLensResolve 1420ms cubic-bezier(0.16,1,0.3,1) both",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 44%, transparent 20%, rgba(2,3,8,0.08) 45%, rgba(2,3,8,0.56) 100%)",
          animation: "observatoryEdgeResolve 1420ms ease-out both",
        }}
      />
    </div>
  );
}

function AtlasPushInOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 4,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "44%",
          width: "68vmin",
          height: "68vmin",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          border: "1px solid rgba(232,200,109,0.24)",
          boxShadow:
            "0 0 0 3px rgba(2,4,8,0.2), 0 0 110px rgba(232,200,109,0.12), inset 0 0 90px rgba(2,4,8,0.16)",
          background:
            "radial-gradient(circle, transparent 55%, rgba(2,4,8,0.16) 74%, rgba(2,4,8,0.5) 100%)",
          animation:
            "atlasWindowPush 1420ms cubic-bezier(0.16,1,0.3,1) both",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "44%",
          width: "112px",
          height: "112px",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(245,208,84,0.52) 0%, rgba(245,208,84,0.18) 32%, rgba(245,208,84,0) 72%)",
          boxShadow:
            "0 0 42px rgba(245,208,84,0.24), 0 0 120px rgba(245,208,84,0.12)",
          animation:
            "atlasSelectionPulse 520ms cubic-bezier(0.16,1,0.3,1) both",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 44%, transparent 18%, rgba(2,3,8,0.06) 44%, rgba(2,3,8,0.5) 100%)",
          animation: "atlasPushEdgeFade 1420ms ease-out both",
        }}
      />
    </div>
  );
}

function ExperiencePullTransition({
  transition,
}: {
  transition: ExperienceTransitionState;
}) {
  const revealing = transition.stage === "reveal";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 12000,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <style>{`
        @keyframes experienceVeilCover {
          0% {
            background: rgba(3,4,10,0);
            backdrop-filter: blur(0px);
            opacity: 0;
          }
          42% {
            background: rgba(3,4,10,0.28);
            backdrop-filter: blur(2px);
            opacity: 1;
          }
          100% {
            background: rgba(3,4,10,0.985);
            backdrop-filter: blur(11px);
            opacity: 1;
          }
        }

        @keyframes experienceVeilReveal {
          0% {
            background: rgba(3,4,10,0.985);
            backdrop-filter: blur(11px);
            opacity: 1;
          }
          100% {
            background: rgba(3,4,10,0);
            backdrop-filter: blur(0px);
            opacity: 0;
          }
        }

        @keyframes experienceBloomPull {
          0% {
            width: 42px;
            height: 42px;
            opacity: 0.78;
            transform: translate(-50%, -50%) scale(1);
          }
          42% {
            width: 250px;
            height: 250px;
            opacity: 0.92;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            width: 260vmax;
            height: 260vmax;
            opacity: 0.34;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes experienceCorePull {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          54% {
            opacity: 0.94;
            transform: translate(-50%, -50%) scale(2.35);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(6.4);
          }
        }

        @keyframes experienceDiamondPull {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(45deg) scale(1);
          }
          54% {
            opacity: 0.94;
            transform: translate(-50%, -50%) rotate(45deg) scale(2.35);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(45deg) scale(6.4);
          }
        }

        @keyframes experienceLabelPull {
          0% {
            opacity: 0;
            transform: translate(-50%, 12px);
            letter-spacing: 0.24em;
          }
          24% {
            opacity: 0.82;
            transform: translate(-50%, 0);
          }
          68% {
            opacity: 0.66;
            transform: translate(-50%, -7px);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -20px);
            letter-spacing: 0.40em;
          }
        }
      `}</style>

      <div
        key={`veil-${transition.stage}`}
        style={{
          position: "absolute",
          inset: 0,
          animation: revealing
            ? `experienceVeilReveal ${REVEAL_DURATION}ms cubic-bezier(0.22,1,0.36,1) forwards`
            : `experienceVeilCover ${COVER_DURATION}ms cubic-bezier(0.22,1,0.36,1) forwards`,
        }}
      />

      {!revealing && (
        <>
          <div
            style={{
              position: "absolute",
              left: transition.x,
              top: transition.y,
              borderRadius: "9999px",
              background: `radial-gradient(
                circle,
                ${transition.color}D8 0%,
                ${transition.color}66 26%,
                ${transition.color}22 52%,
                rgba(3,4,10,0) 72%
              )`,
              boxShadow: `0 0 42px ${transition.color}66, 0 0 130px ${transition.color}2A`,
              animation:
                "experienceBloomPull 760ms cubic-bezier(0.22,1,0.36,1) forwards",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: transition.x,
              top: transition.y,
              width: 16,
              height: 16,
              borderRadius:
                transition.target === "atlas" ? "2px" : "9999px",
              background: transition.color,
              boxShadow: `0 0 26px ${transition.color}CC, 0 0 86px ${transition.color}66`,
              animation:
                transition.target === "atlas"
                  ? "experienceDiamondPull 620ms cubic-bezier(0.22,1,0.36,1) forwards"
                  : "experienceCorePull 620ms cubic-bezier(0.22,1,0.36,1) forwards",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: transition.x,
              top: transition.y + 54,
              fontFamily: "'DM Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.30em",
              color: transition.color,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              textShadow: `0 0 22px ${transition.color}55`,
              animation:
                "experienceLabelPull 620ms cubic-bezier(0.22,1,0.36,1) forwards",
            }}
          >
            Entering {transition.label}
          </div>
        </>
      )}
    </div>
  );
}