import { useEffect, useMemo, useRef, useState } from "react";
import type { SovereignMode } from "../experiences/sovereignExperience.types";

interface AtlasArrivalProps {
  onSelect: (selection: ArrivalSelection) => void;
  transitioning?: boolean;
}

type Phase = "breathe" | "stars" | "ready" | "entering";
type EntryId = "profile" | "atlas" | "contact";

export interface ArrivalSelection {
  target: Exclude<SovereignMode, "arrival">;
  x: number;
  y: number;
  color: string;
  label: string;
}

interface ArrivalStar {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
}

interface EntryPoint {
  id: EntryId;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  target: Exclude<SovereignMode, "arrival">;
}

export default function AtlasArrival({
  onSelect,
  transitioning = false,
}: AtlasArrivalProps) {
  const [phase, setPhase] = useState<Phase>("breathe");
  const [hovered, setHovered] = useState<EntryId | null>(null);
  const [pressed, setPressed] = useState<EntryId | null>(null);
  const [selected, setSelected] = useState<EntryId | null>(null);
  const timersRef = useRef<number[]>([]);
  const entryRefs = useRef<Record<EntryId, HTMLButtonElement | null>>({
    profile: null,
    atlas: null,
    contact: null,
  });

  const stars = useMemo<ArrivalStar[]>(() => {
    return Array.from({ length: 170 }, (_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size:
        index % 13 === 0
          ? 2.1 + Math.random() * 1.3
          : 0.45 + Math.random() * 1.05,
      opacity: 0.16 + Math.random() * 0.54,
      delay: Math.random() * 900,
      duration: 2200 + Math.random() * 3800,
    }));
  }, []);

  const entries = useMemo<EntryPoint[]>(
    () => [
      {
        id: "profile",
        title: "Wilson Chiu",
        subtitle: "Designer Profile",
        description:
          "Background, experience, philosophy, and the human behind the system.",
        color: "#9FC6E8",
        target: "profile",
      },
      {
        id: "atlas",
        title: "Sovereign Atlas",
        subtitle: "Knowledge System",
        description:
          "Explore case studies, experiments, and frameworks.",
        color: "#E8C86D",
        target: "atlas",
      },
      {
        id: "contact",
        title: "Contact",
        subtitle: "Communication Channel",
        description:
          "Open a channel and begin a conversation.",
        color: "#74C99B",
        target: "contact",
      },
    ],
    [],
  );

  useEffect(() => {
    timersRef.current = [
      window.setTimeout(() => setPhase("stars"), 900),
      window.setTimeout(() => setPhase("ready"), 2100),
    ];

    return () => {
      timersRef.current.forEach(window.clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const selectEntry = (entry: EntryPoint) => {
    if (phase !== "ready" || selected || transitioning) return;

    const node = entryRefs.current[entry.id];
    const rect = node?.getBoundingClientRect();

    setSelected(entry.id);
    setPhase("entering");
    setPressed(null);

    onSelect({
      target: entry.target,
      x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
      y:
        rect
          ? rect.top + (entry.id === "atlas" ? 158 : 138) / 2
          : window.innerHeight / 2,
      color: entry.color,
      label: entry.title,
    });
  };

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (phase !== "ready" || selected || transitioning) return;

      if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight"
      ) {
        event.preventDefault();

        const currentIndex = entries.findIndex(
          (entry) => entry.id === hovered,
        );
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const nextIndex =
          currentIndex < 0
            ? 1
            : (currentIndex + direction + entries.length) %
              entries.length;

        setHovered(entries[nextIndex].id);
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();

        const target =
          entries.find((entry) => entry.id === hovered) ??
          entries[1];

        selectEntry(target);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [
    entries,
    hovered,
    phase,
    selected,
    transitioning,
  ]);

  const showStars = phase !== "breathe";
  const ready = phase === "ready";
  const entering = phase === "entering";

  return (
    <main
      aria-label="Select an entry point"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
        background: "#05050A",
        color: "#F4EBD0",
        pointerEvents: entering ? "none" : "auto",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: showStars ? 1 : 0,
          transform: entering ? "scale(1.08)" : "scale(1)",
          transition:
            "opacity 900ms ease-out, transform 760ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {stars.map((star) => (
          <span
            key={star.id}
            style={{
              position: "absolute",
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              borderRadius: "50%",
              background: `rgba(244,235,208,${star.opacity})`,
              boxShadow:
                star.size > 1.8
                  ? `0 0 ${star.size * 7}px rgba(244,235,208,${star.opacity * 0.42})`
                  : "none",
              opacity: 0,
              animation: showStars
                ? `arrivalStarIn 850ms ease-out ${star.delay}ms forwards, arrivalTwinkle ${star.duration}ms ease-in-out ${star.delay + 900}ms infinite`
                : "none",
            }}
          />
        ))}
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 48%, rgba(232,200,109,0.045), transparent 38%), radial-gradient(circle at 50% 50%, transparent 35%, rgba(5,5,10,0.84) 100%)",
        }}
      />

      <header
        style={{
          position: "absolute",
          top: "12vh",
          left: "50%",
          width: "min(760px, calc(100vw - 48px))",
          transform:
            ready && !entering
              ? "translate(-50%, 0)"
              : "translate(-50%, 10px)",
          opacity: ready && !entering ? 1 : 0,
          textAlign: "center",
          transition:
            "opacity 360ms ease-out, transform 650ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div style={kickerStyle}>The Sovereign Atlas</div>

        <p
          style={{
            margin: 0,
            fontFamily: "'EB Garamond', serif",
            fontSize: 16,
            letterSpacing: "0.04em",
            color: "rgba(245,235,210,0.46)",
          }}
        >
          Select an entry point to begin.
        </p>
      </header>

      <section
        style={{
          position: "absolute",
          left: "50%",
          top: "52%",
          width: "min(1120px, calc(100vw - 64px))",
          transform: entering
            ? `translate(-50%, -50%) scale(${
                selected === "atlas" ? 1.08 : 1.035
              })`
            : "translate(-50%, -50%) scale(1)",
          opacity: ready ? 1 : 0,
          transition:
            "opacity 720ms ease-out, transform 760ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, minmax(0, 1fr))",
            gap: 28,
          }}
        >
          {entries.map((entry, index) => {
            const active =
              hovered === entry.id || selected === entry.id;
            const muted =
              entering && selected !== entry.id;

            return (
              <button
                ref={(node) => {
                  entryRefs.current[entry.id] = node;
                }}
                key={entry.id}
                type="button"
                aria-label={`${entry.title}: ${entry.subtitle}`}
                disabled={!ready || entering || transitioning}
                onClick={() => selectEntry(entry)}
                onFocus={() => setHovered(entry.id)}
                onBlur={() => setHovered(null)}
                onMouseEnter={() => setHovered(entry.id)}
                onMouseLeave={() => {
                  setHovered(null);
                  setPressed(null);
                }}
                onMouseDown={() => setPressed(entry.id)}
                onMouseUp={() => setPressed(null)}
                style={{
                  position: "relative",
                  minWidth: 0,
                  padding: 0,
                  border: 0,
                  background: "transparent",
                  color: "inherit",
                  cursor:
                    ready && !entering
                      ? "pointer"
                      : "default",
                  opacity: muted ? 0 : ready ? 1 : 0,
                  transform: muted
                    ? `translateX(${
                        index === 0
                          ? -52
                          : index === 2
                            ? 52
                            : 0
                      }px) scale(0.86)`
                    : pressed === entry.id
                      ? "scale(0.96)"
                      : active
                        ? "translateY(-6px) scale(1.025)"
                        : "translateY(0) scale(1)",
                  transition:
                    "opacity 320ms ease-out, transform 520ms cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                <Node
                  active={active}
                  color={entry.color}
                  central={entry.id === "atlas"}
                  entering={selected === entry.id}
                />

                <div style={{ marginTop: 25 }}>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize:
                        "clamp(15px, 1.55vw, 23px)",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: active
                        ? entry.color
                        : "rgba(245,235,210,0.74)",
                      transition: "color 260ms ease-out",
                    }}
                  >
                    {entry.title}
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(245,235,210,0.38)",
                    }}
                  >
                    {entry.subtitle}
                  </div>

                  <p
                    style={{
                      maxWidth: 260,
                      minHeight: 44,
                      margin: "16px auto 0",
                      fontFamily: "'EB Garamond', serif",
                      fontSize: 16,
                      lineHeight: 1.5,
                      color: active
                        ? "rgba(245,235,210,0.68)"
                        : "rgba(245,235,210,0.36)",
                      transition: "color 260ms ease-out",
                    }}
                  >
                    {entry.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <footer
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: ready && !entering ? 1 : 0,
          fontFamily: "'DM Mono', monospace",
          fontSize: 8,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(232,200,109,0.4)",
          transition: "opacity 320ms ease-out",
        }}
      >
        Select a node · Arrow keys to browse · Enter to
        initialize
      </footer>

      <style>{`
        @keyframes arrivalStarIn {
          from {
            opacity: 0;
            transform: scale(0.35);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes arrivalTwinkle {
          0%, 100% {
            filter: brightness(0.72);
          }
          50% {
            filter: brightness(1.42);
          }
        }

        @keyframes arrivalNodePulse {
          0%, 100% {
            transform: scale(0.96);
            opacity: 0.72;
          }
          50% {
            transform: scale(1.04);
            opacity: 0.96;
          }
        }

        @media (max-width: 760px) {
          section > div:last-child {
            gap: 8px !important;
          }
        }
      `}</style>
    </main>
  );
}

function Node({
  active,
  color,
  central,
  entering,
}: {
  active: boolean;
  color: string;
  central: boolean;
  entering: boolean;
}) {
  const size = central ? 158 : 138;

  return (
    <span
      aria-hidden="true"
      style={{
        position: "relative",
        display: "block",
        width: size,
        height: size,
        margin: "0 auto",
        borderRadius: "50%",
        border: `1px solid ${color}${
          active ? "70" : "30"
        }`,
        boxShadow: active
          ? `0 0 76px ${color}35`
          : `0 0 38px ${color}16`,
        transition:
          "border-color 280ms ease-out, box-shadow 280ms ease-out",
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 14,
          borderRadius: "50%",
          border: `1px dashed ${color}${
            active ? "70" : "28"
          }`,
          animation:
            "arrivalNodePulse 3100ms ease-in-out infinite",
        }}
      />

      <span
        style={{
          position: "absolute",
          inset: central ? 47 : 42,
          borderRadius: "50%",
          background: `${color}${active ? "3D" : "25"}`,
          boxShadow: active
            ? `0 0 48px ${color}65`
            : `0 0 28px ${color}3B`,
          transition:
            "background 280ms ease-out, box-shadow 280ms ease-out",
        }}
      />

      <span
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: central ? 20 : 14,
          height: central ? 20 : 14,
          transform: `translate(-50%, -50%) rotate(${
            central ? 45 : 0
          }deg) scale(${entering ? 2.2 : 1})`,
          borderRadius: central ? 2 : "50%",
          background: color,
          boxShadow: `0 0 30px ${color}D0, 0 0 72px ${color}70`,
          opacity: entering ? 0 : 1,
          transition:
            "opacity 420ms ease-out, transform 520ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </span>
  );
}

const kickerStyle: React.CSSProperties = {
  fontFamily: "'DM Mono', monospace",
  fontSize: 9,
  letterSpacing: "0.3em",
  textTransform: "uppercase",
  color: "rgba(232,200,109,0.62)",
};