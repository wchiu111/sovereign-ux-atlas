import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence } from "motion/react";
import AtlasExperienceRouter from "../experiences/AtlasExperienceRouter";
import AtlasCommandPalette from "../components/AtlasCommandPalette";
import AtlasIntelligenceDrawer from "../components/AtlasIntelligenceDrawer";
import AtlasProjectIntelligenceDrawer from "../components/AtlasProjectIntelligenceDrawer";
import FocusPullTransition from "./components/FocusPullTransition";
import FocusedOverview from "./components/FocusedOverview";
import AtlasSystemPreview from "./components/AtlasSystemPreview";
import type { AtlasPreviewId } from "./components/AtlasPreviewContent";
import { SYSTEMS, SYSTEM_MAP } from "../data/atlasSystems";
import { sysOrbitPos } from "../utils/atlasGeometry";
import { mkParticles, type Particle } from "../utils/atlasParticles";
import AtlasBackground from "./rendering/AtlasBackground";
import AtlasCanvas from "./rendering/AtlasCanvas";
import {
  SYSTEM_FOCUS_SCALE,
  useAtlasAnimation,
} from "./hooks/useAtlasAnimation";
import type { Planet, StarSystem, ViewLevel } from "../types/atlas";
import { useAtlasState } from "../state";

interface AtlasExplorerProps {
  active?: boolean;
  onEnterObservatory?: () => void;
}

export default function AtlasExplorer({
  active = true,
  onEnterObservatory,
}: AtlasExplorerProps) {
  const { state, actions } = useAtlasState();
  const {
    level,
    activeSystemId,
    activePlanetId,
    drawerOpen,
    searchMode,
    focusSection,
    focusTransition,
  } = state;

  // Canvas
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const particlesRef   = useRef<Particle[]>([]);

  // Zoom container — direct DOM for smooth camera follow
  const zoomableRef    = useRef<HTMLDivElement>(null);

  // Mouse scroll zoom
  const cameraRef      = useRef({ scale: 1, tx: 0, ty: 0 });
  const applyCamera    = useCallback((scale: number, tx: number, ty: number) => {
  const el = zoomableRef.current;
  if (!el) return;

  cameraRef.current    = { scale, tx, ty };
  el.style.transition  = "transform 0.12s ease-out";
  el.style.transform   = `translate(${tx}px, ${ty}px) scale(${scale})`;}, []);
  
  // State mirrors for animation loop (avoid closure stale refs)
  const levelRef         = useRef<ViewLevel>(0);
  const activeSysRef     = useRef<string|null>(null);
  const activePlanetRef  = useRef<string|null>(null);
  const dimsRef          = useRef({ w: window.innerWidth, h: window.innerHeight });
  const isFollowingRef   = useRef(false);
  const followTimerRef   = useRef<ReturnType<typeof setTimeout>|null>(null);

  // Local render-only state. Navigation and overlays live in the Atlas state engine.
  const [dims, setDims] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const [hoveredNexus, setHoveredNexus] = useState(false);
  const [hoveredSystemPreview, setHoveredSystemPreview] = useState<{
    id: AtlasPreviewId;
    x: number;
    y: number;
  } | null>(null);

  // Cinematic reveal. This restarts whenever Atlas becomes active, including
  // returns from the Observatory.
  const [revealStage, setRevealStage] = useState(0);
  const revealTimersRef = useRef<number[]>([]);

  // Keep refs in sync with state
  useEffect(() => { levelRef.current = level; }, [level]);
  useEffect(() => { activeSysRef.current = activeSystemId; }, [activeSystemId]);
  useEffect(() => { activePlanetRef.current = activePlanetId; }, [activePlanetId]);
  useEffect(() => { dimsRef.current = dims; }, [dims]);

  useEffect(() => {
    revealTimersRef.current.forEach(window.clearTimeout);
    revealTimersRef.current = [];

    if (!active) {
      setRevealStage(0);
      return;
    }

    // Reset first so every Atlas entry begins from the same cinematic state.
    setRevealStage(0);

    const startTimer = window.setTimeout(() => {
      setRevealStage(1);

      revealTimersRef.current = [
        window.setTimeout(() => setRevealStage(2), 320),
        window.setTimeout(() => setRevealStage(3), 820),
        window.setTimeout(() => setRevealStage(4), 1120),
        window.setTimeout(() => setRevealStage(5), 1420),
        window.setTimeout(() => setRevealStage(6), 1740),
      ];
    }, 40);

    revealTimersRef.current = [startTimer];

    return () => {
      revealTimersRef.current.forEach(window.clearTimeout);
      revealTimersRef.current = [];
    };
  }, [active]);

  useEffect(() => {
  if (!active) {
    document.body.style.overflow = "";
    return;
  }

  document.body.style.overflow = searchMode === "results" ? "hidden" : "";

  return () => {
    document.body.style.overflow = "";
  };
}, [active, searchMode]);

useEffect(() => {
  if (!active) return;

  const handleWheel = (e: WheelEvent) => {
    if (searchMode === "results") {
      e.preventDefault();
      return;
    }

    if (levelRef.current >= 2) return;

    e.preventDefault();

    isFollowingRef.current = false;
    if (followTimerRef.current) clearTimeout(followTimerRef.current);

    const { scale, tx, ty } = cameraRef.current;

    const zoomIntensity = 0.0012;
    const nextScale = Math.min(
      4,
      Math.max(0.65, scale * (1 - e.deltaY * zoomIntensity))
    );

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const worldX = (mouseX - tx) / scale;
    const worldY = (mouseY - ty) / scale;

    const nextTx = mouseX - worldX * nextScale;
    const nextTy = mouseY - worldY * nextScale;

    applyCamera(nextScale, nextTx, nextTy);
  };

  window.addEventListener("wheel", handleWheel, { passive: false });

  return () => {
    window.removeEventListener("wheel", handleWheel);
  };
}, [active, applyCamera, searchMode]);

  const activeSystem = activeSystemId ? SYSTEM_MAP[activeSystemId] : null;
  const activePlanet = activeSystem?.planets.find(p => p.id === activePlanetId) ?? null;

  // ── Resize ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!active) return;

    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      if (canvasRef.current) { canvasRef.current.width = w; canvasRef.current.height = h; }
      setDims({ w, h });
      particlesRef.current = mkParticles(w, h);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [active]);

  const {
    systemGroupRefs,
    planetGroupRefs,
    outerGlowRefs,
    planetLineRefs,
    elapsedRef,
  } = useAtlasAnimation({
    canvasRef,
    zoomableRef,
    particlesRef,
    dimsRef,
    levelRef,
    activeSystemRef: activeSysRef,
    activePlanetRef,
    isFollowingRef,
    cameraRef,
    active,
  });

  // ── Navigation helpers ────────────────────────────────────────────────

  const zoomWithTransition = useCallback((scale: number, targetX: number, targetY: number) => {
    isFollowingRef.current = false;
    if (followTimerRef.current) clearTimeout(followTimerRef.current);
    const el = zoomableRef.current;
    if (!el) return;
    const { w, h } = dimsRef.current;
    el.style.transition = "transform 0.85s cubic-bezier(0.22,1,0.36,1)";
    el.style.transform = `translate(${w/2 - targetX*scale}px,${h/2 - targetY*scale}px) scale(${scale})`;
    cameraRef.current = {
  scale,
  tx: w / 2 - targetX * scale,
  ty: h / 2 - targetY * scale,
};
    followTimerRef.current = setTimeout(() => {
      if (el) el.style.transition = "none";
      isFollowingRef.current = true;
    }, 920);
  }, []);

  const goToSystem = useCallback((sys: StarSystem) => {
    const { w, h } = dimsRef.current;
    const nexX = w * 0.5;
    const nexY = h * 0.48;

    // Use the system's current orbital position, then frame each system
    // according to the footprint of its child constellation.
    const sp = sysOrbitPos(sys, elapsedRef.current, nexX, nexY);
    const focusScale = SYSTEM_FOCUS_SCALE[sys.id] ?? 1.35;

    actions.enterSystem(sys.id);
    zoomWithTransition(focusScale, sp.x, sp.y);
  }, [actions, zoomWithTransition]);

  const goToPlanet = useCallback((sys: StarSystem, planet: Planet) => {
  // Enter Focused Overview — no camera zoom; atlas fades, isolated view overlays
  isFollowingRef.current = false;
  if (followTimerRef.current) clearTimeout(followTimerRef.current);

  actions.openPlanet(sys.id, planet.id);

  requestAnimationFrame(() => {
    actions.openProjectDrawer();
  });
}, [actions]);

  const goToAtlas = useCallback(() => {
    isFollowingRef.current = false;
    if (followTimerRef.current) clearTimeout(followTimerRef.current);
    actions.returnToAtlas();
    const el = zoomableRef.current;
    if (el) {
      el.style.transition = "transform 0.85s cubic-bezier(0.22,1,0.36,1)";
      el.style.transform = "translate(0px,0px) scale(1)";
      cameraRef.current = { scale: 1, tx: 0, ty: 0 };
    }
  }, []);

  const backToSystem = useCallback(() => {
    if (!activeSystem) return;

    const { w, h } = dimsRef.current;
    const nexX = w * 0.5;
    const nexY = h * 0.48;
    const sp = sysOrbitPos(activeSystem, elapsedRef.current, nexX, nexY);
    const focusScale = SYSTEM_FOCUS_SCALE[activeSystem.id] ?? 1.35;

    actions.returnToSystem();
    zoomWithTransition(focusScale, sp.x, sp.y);
  }, [actions, activeSystem, zoomWithTransition]);

  const exitFocus  = useCallback(() => {
    actions.exitFocusMode();
    requestAnimationFrame(() => {
      actions.openProjectDrawer();
    });
  }, []);

  // Click-space-to-go-back
  const handleBgClick = useCallback(() => {
    if (level === 3) return;
    if (level === 2) backToSystem();
    else if (level === 1) goToAtlas();
  }, [level, backToSystem, goToAtlas]);

  const { w, h } = dims;
  const nexX = w * 0.5;
  const nexY = h * 0.48;

  return (
    <>
    <div className="relative w-full h-screen overflow-hidden" style={{ background:"#05050A" }}>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: revealStage >= 2 ? 1 : 0,
          filter: revealStage >= 2 ? "blur(0px)" : "blur(7px)",
          transform: revealStage >= 2 ? "scale(1)" : "scale(1.018)",
          transition:
            "opacity 900ms cubic-bezier(0.16,1,0.3,1), filter 1100ms cubic-bezier(0.16,1,0.3,1), transform 1100ms cubic-bezier(0.16,1,0.3,1)",
          pointerEvents: "none",
        }}
      >
        <AtlasBackground canvasRef={canvasRef} />
      </div>

      {level === 0 && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            isolation: "isolate",
            opacity: revealStage >= 6 ? 1 : 0,
            filter: revealStage >= 6 ? "blur(0px)" : "blur(4px)",
            transform: revealStage >= 6 ? "translateY(0)" : "translateY(-6px)",
            transition:
              "opacity 620ms cubic-bezier(0.16,1,0.3,1), filter 720ms cubic-bezier(0.16,1,0.3,1), transform 720ms cubic-bezier(0.16,1,0.3,1)",
            pointerEvents: "none",
          }}
        >
          {searchMode === "results" && (
            <div
              role="button"
              tabIndex={-1}
              aria-label="Close search results"
              onPointerDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                actions.setSearchMode(null);
              }}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 850,
                pointerEvents: "auto",
                background: "rgba(0,0,0,0.42)",
                backdropFilter: "blur(2px)",
                cursor: "default",
              }}
            />
          )}
          <div style={{ pointerEvents: "auto" }}>
            <AtlasCommandPalette
              onOpen={() => actions.setSearchMode("suggestions")}
            onSubmit={(query) => {
              console.log("Atlas query:", query);
              actions.setSearchMode("results");
            }}
            />
          </div>

          <div style={{ pointerEvents: "auto" }}>
            <AtlasIntelligenceDrawer open={searchMode === "results"} />
          </div>
        </div>
      )}

      <AtlasCanvas
        width={w}
        height={h}
        level={level}
        activeSystemId={activeSystemId}
        activePlanetId={activePlanetId}
        zoomableRef={zoomableRef}
        systemGroupRefs={systemGroupRefs}
        planetGroupRefs={planetGroupRefs}
        outerGlowRefs={outerGlowRefs}
        planetLineRefs={planetLineRefs}
        hoveredNexus={hoveredNexus}
        onNexusHoverChange={(hovered) => {
          setHoveredNexus(hovered);
          if (hovered) setHoveredSystemPreview(null);
        }}
        onBackgroundClick={handleBgClick}
        onSelectSystem={goToSystem}
        onSelectPlanet={goToPlanet}
        onSystemHoverChange={(system, anchor) => {
          if (!system || !anchor) {
            setHoveredSystemPreview(null);
            return;
          }
          setHoveredNexus(false);
          setHoveredSystemPreview({ id: system.id as AtlasPreviewId, x: anchor.x, y: anchor.y });
        }}
        revealStage={revealStage}
      />

      <AnimatePresence mode="wait">
        {level === 0 && hoveredNexus && (
          <AtlasSystemPreview
            key="sovereign-design"
            previewId="sovereign-design"
            x={nexX}
            y={nexY}
            viewportWidth={w}
            viewportHeight={h}
          />
        )}
        {level === 0 && hoveredSystemPreview && (
          <AtlasSystemPreview
            key={hoveredSystemPreview.id}
            previewId={hoveredSystemPreview.id}
            x={hoveredSystemPreview.x}
            y={hoveredSystemPreview.y}
            viewportWidth={w}
            viewportHeight={h}
          />
        )}
      </AnimatePresence>

      {/* ── Focused Overview ─────────────────────────────────────────── */}
      {level === 2 && activePlanet && activeSystem && (
        <FocusedOverview
          system={activeSystem}
          planet={activePlanet}
          onBack={backToSystem}
          transitioning={!!focusTransition}
          onOpenStar={(index, anchor) => {
            const selectedStar = activePlanet.stars[index];

            actions.beginFocusTransition({
              index,
              label: selectedStar?.label ?? "Section",
              x: anchor.x,
              y: anchor.y,
              color: activeSystem.color,
            });

            window.setTimeout(() => {
              actions.enterFocusMode(index);
            }, 760);
          }}
        />
      )}

      {focusTransition && level === 2 && (
        <FocusPullTransition transition={focusTransition} />
      )}

      {/* ── Fixed UI ─────────────────────────────────────────────────── */}

      {/* Header */}
      {level < 3 && (
        <header className="absolute top-0 left-0 right-0 z-20 flex justify-between items-start pointer-events-none"
          style={{
            padding:"22px 28px",
            opacity: level === 0 ? (revealStage >= 6 ? 1 : 0) : 1,
            filter: level === 0 && revealStage < 6 ? "blur(4px)" : "blur(0px)",
            transform: level === 0 && revealStage < 6 ? "translateY(-6px)" : "translateY(0)",
            transition:
              "opacity 620ms cubic-bezier(0.16,1,0.3,1), filter 720ms cubic-bezier(0.16,1,0.3,1), transform 720ms cubic-bezier(0.16,1,0.3,1)",
          }}>
          <div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"11px",
              letterSpacing:"0.34em", color:"rgba(200,169,110,0.65)", textTransform:"uppercase" }}>
              The Sovereign Atlas</div>
            <div style={{ fontFamily:"'EB Garamond',serif", fontSize:"14px",
              letterSpacing:"0.06em", color:"rgba(200,169,110,0.52)",
              marginTop:"3px", fontStyle:"regular" }}>
              {level === 0 ? "Three systems in orbit" :
               level === 1 ? (activeSystem?.subtitle ?? "") :
               activePlanet?.label ?? ""}
            </div>
          </div>
          {level === 0 && (
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"9px",
              letterSpacing:"0.18em", color:"rgba(200,169,110,0.5)",
              textAlign:"right", lineHeight:"2.2" }}>
              <div>3 SYSTEMS</div>
              <div>{SYSTEMS.reduce((a,s)=>a+s.planets.length,0)} CONCEPTS</div>
            </div>
          )}
        </header>
      )}

      {/* Breadcrumb */}
      {level >= 1 && level < 3 && (
        <nav className="absolute z-20 flex items-center gap-2"
          style={{ bottom:"28px", left:"28px",
            fontFamily:"'DM Mono',monospace", fontSize:"8px", letterSpacing:"0.22em" }}>
          <button onClick={goToAtlas} style={{
            color:"rgba(220,185,110,0.75)", background:"none", border:"none",
            cursor:"pointer", padding:0, fontFamily:"'DM Mono',monospace",
            fontSize:"8px", letterSpacing:"0.22em",
          }}>← ATLAS</button>
          {activeSystem && (
            <>
              <span style={{color:"rgba(220,185,110,0.35)"}}>·</span>
              <button onClick={level===1?undefined:backToSystem} style={{
                color: level===1 ? activeSystem.color : "rgba(220,185,110,0.75)",
                background:"none", border:"none",
                cursor: level===1 ? "default":"pointer",
                padding:0, fontFamily:"'DM Mono',monospace",
                fontSize:"8px", letterSpacing:"0.22em",
              }}>{activeSystem.label}</button>
            </>
          )}
          {level >= 2 && activePlanet && (
            <>
              <span style={{color:"rgba(220,185,110,0.35)"}}>·</span>
              <span style={{
                color: activeSystem?.color ?? "",
                opacity: 1,
                fontFamily:"'DM Mono',monospace",
                fontSize:"8px", letterSpacing:"0.22em",
              }}>{activePlanet.label}</span>
            </>
          )}
        </nav>
      )}

      {/* Idle hints */}
      {level === 0 && onEnterObservatory && (
        <>
          <style>{`
            .atlas-observatory-nav {
              opacity: 0.58;
              transform: translateX(-50%) translateY(0);
              transition:
                opacity 220ms ease,
                transform 220ms ease,
                letter-spacing 220ms ease;
            }

            .atlas-observatory-nav:hover,
            .atlas-observatory-nav:focus-visible {
              opacity: 1;
              transform: translateX(-50%) translateY(-2px);
              letter-spacing: 0.34em;
            }

            .atlas-observatory-nav__caret {
              transform: translateY(0);
              transition: transform 220ms ease, opacity 220ms ease;
            }

            .atlas-observatory-nav:hover .atlas-observatory-nav__caret,
            .atlas-observatory-nav:focus-visible .atlas-observatory-nav__caret {
              transform: translateY(3px);
              opacity: 1;
            }
          `}</style>

          <button
            type="button"
            className="atlas-observatory-nav absolute bottom-6 left-1/2 z-30"
            onClick={onEnterObservatory}
            disabled={revealStage < 6}
            aria-label="Enter Observatory"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "7px",
              padding: "8px 12px 4px",
              border: "none",
              background: "transparent",
              color: "rgba(200,169,110,0.82)",
              fontFamily: "'DM Mono',monospace",
              fontSize: "10px",
              letterSpacing: "0.30em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              cursor: revealStage >= 6 ? "pointer" : "default",
              opacity: revealStage >= 6 ? undefined : 0,
              filter: revealStage >= 6 ? "blur(0px)" : "blur(4px)",
              transform:
                revealStage >= 6
                  ? "translateX(-50%) translateY(0)"
                  : "translateX(-50%) translateY(6px)",
              transition:
                "opacity 620ms cubic-bezier(0.16,1,0.3,1), filter 720ms cubic-bezier(0.16,1,0.3,1), transform 720ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <span>Enter Observatory</span>
            <span
              aria-hidden="true"
              className="atlas-observatory-nav__caret"
              style={{
                display: "block",
                width: "10px",
                height: "10px",
                borderRight: "1px solid currentColor",
                borderBottom: "1px solid currentColor",
                transform: "rotate(45deg)",
                opacity: 0.82,
              }}
            />
          </button>
        </>
      )}
      {level === 1 && (
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          style={{ fontFamily:"'DM Mono',monospace", fontSize:"10px",
            letterSpacing:"0.26em", color:"rgba(200,169,110,0.42)", textTransform:"uppercase" }}>
          Select a concept · Click space to zoom out
        </div>
      )}
      {level === 2 && (
        <div
          className="absolute bottom-7 left-1/2 -translate-x-1/2 z-25 pointer-events-none"
          style={{
            fontFamily:"'DM Mono',monospace",
            fontSize:"10px",
            letterSpacing:"0.26em",
            color:"rgba(200,169,110,0.42)",
            textTransform:"uppercase",
            textAlign:"center",
            whiteSpace:"nowrap",
          }}
        >
          <div
            style={{
              display:"flex",
              flexDirection:"column",
              alignItems:"center",
              gap:"6px",
            }}
          >
            <span>SELECT A NODE TO READ</span>
            <span style={{ opacity:0.75 }}>
              CLICK SPACE TO RETURN
            </span>
          </div>
        </div>
)}

      {/* ── Right drawer ─────────────────────────────────────────────── */}
      {level === 2 && activeSystem && activePlanet && (
        <AtlasProjectIntelligenceDrawer
          open={drawerOpen}
          system={activeSystem}
          planet={activePlanet}
        />
      )}

      {/* ── Focus Mode / Case Study Engine ─────────────────────────── */}
      {level === 3 && activeSystem && activePlanet && (
        <AtlasExperienceRouter
          planetId={activePlanet.id}
          system={activeSystem}
          onExit={exitFocus}
          onAtlas={goToAtlas}
          onSystem={backToSystem}
          initialSectionIndex={focusSection}
        />
      )}
    </div>
      </>
  );
}


// ─── Focus Pull Transition ─────────────────────────────────────────────────

