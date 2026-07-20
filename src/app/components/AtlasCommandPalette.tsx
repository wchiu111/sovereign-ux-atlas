import { useMemo, useRef, useState } from "react";

interface AtlasCommandPaletteProps {
  onOpen?: () => void;
  onSubmit?: (query: string) => void;
}

const COMMANDS = [
  {
    section: "Learn",
    items: [
      "Explain Authority Drift",
      "Explain Mirror Test",
      "Explain Trust Signals",
    ],
  },
  {
    section: "Explore",
    items: [
      "Browse Case Studies",
      "Browse Experiments",
      "Browse Frameworks",
    ],
  },
  {
    section: "Compare",
    items: [
      "Compare two case studies",
      "Compare two frameworks",
    ],
  },
  {
    section: "Critique",
    items: [
      "Critique this interface",
      "Review this case study",
      "Evaluate trust risks",
    ],
  },
];

export default function AtlasCommandPalette({ onOpen, onSubmit, }: AtlasCommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const blurTimer = useRef<number | null>(null);

  const results = useMemo(() => {
  const clean = query.trim().toLowerCase();
  
    return COMMANDS
      .map((group) => ({
        section: group.section,
        items: clean
          ? group.items.filter((item) =>
              item.toLowerCase().includes(clean)
            )
          : group.items,
      }))
      .filter((group) => group.items.length > 0);
  }, [query]);

  const submitQuery = (value: string) => {
    const clean = value.trim();
    if (!clean) return;

    setQuery(clean);
    setIsOpen(false);
    onSubmit?.(clean);
  };

  const flatResults = useMemo(
  () =>
    results.flatMap((group) =>
      group.items.map((item) => ({
        section: group.section,
        item,
      }))
    ),
  [results]
);

  const hasResults = flatResults.length > 0;
  const visibleResults = flatResults.slice(0, 4);

  return (
    <div
      style={{
        position: "absolute",
        top: 28,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        pointerEvents: "auto",
        width: "min(420px, calc(100vw - 48px))",
      }}
    >
      <div
        style={{
          width: "100%",
          background: "rgba(12,12,18,0.88)",
          border: `1px solid ${
            isOpen ? "rgba(232,200,109,0.58)" : "rgba(232,200,109,0.34)"
          }`,
          borderRadius: isOpen ? "18px" : "16px",
          backdropFilter: "blur(22px)",
          boxShadow: isOpen
            ? "0 22px 80px rgba(0,0,0,0.48), 0 0 42px rgba(232,200,109,0.16)"
            : "0 18px 60px rgba(0,0,0,0.38), 0 0 32px rgba(232,200,109,0.10)",
          overflow: "hidden",
          transition:
            "border-color 0.25s ease-out, border-radius 0.25s ease-out, box-shadow 0.25s ease-out",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "44px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "0 18px 0 22px",
          }}
        >
          <div
            style={{
              color: "#E8C86D",
              fontSize: "18px",
              lineHeight: 1,
              opacity: isOpen || query.trim() ? 0.95 : 0.72,
              transition: "opacity 0.25s ease",
              flexShrink: 0,
            }}
          >
            ✦
          </div>

          <input
            value={query}
            placeholder="What would you like to explore today?"
            onFocus={() => {
              if (blurTimer.current) window.clearTimeout(blurTimer.current);
            
              setIsOpen(true);
              setActiveIndex(0);
            
              onOpen?.();
            }}
            onClick={() => {
              setIsOpen(true);
              setActiveIndex(0);
            
              onOpen?.();
            }}
            onBlur={() => {
              blurTimer.current = window.setTimeout(() => {
                setIsOpen(false);
              }, 120);
            }}
            onChange={(e) => {
              setQuery(e.currentTarget.value);
              setIsOpen(true);
              setActiveIndex(0);
              onOpen?.();
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                if (!hasResults) return;
                setIsOpen(true);
                setActiveIndex((prev) => (prev + 1) % flatResults.length);
              }

              if (e.key === "ArrowUp") {
                e.preventDefault();
                if (!hasResults) return;
                setIsOpen(true);
                setActiveIndex((prev) =>
                  prev === 0 ? flatResults.length - 1 : prev - 1
                );
              }

              if (e.key === "Enter") {
                e.preventDefault();
                if (isOpen && hasResults) {
                  submitQuery(flatResults[activeIndex]?.item ?? query);
                } else {
                  submitQuery(query);
                }
              }

              if (e.key === "Escape") {
                setIsOpen(false);
                e.currentTarget.blur();
              }
            }}
            style={{
              flex: 1,
              height: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#F4EBD0",
              fontFamily: "'EB Garamond', serif",
              fontSize: "15px",
              letterSpacing: "0.01em",
              minWidth: 0,
            }}
          />

          <div
            style={{
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {query.trim() && (
              <button
                aria-label="Submit Atlas query"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => submitQuery(query)}
                style={{
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#E8C86D",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "14px",
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                →
              </button>
            )}
          </div>
        </div>

        {isOpen && (
          <div
            style={{
              borderTop: "1px solid rgba(232,200,109,0.12)",
              padding: "12px 8px 10px",
              opacity: 1,
              transform: "translateY(0)",
              animation: "atlasPaletteIn 180ms ease-out",
            }}
          >
            <div
              style={{
                padding: "0 14px 9px",
                fontFamily: '"DM Mono", monospace',
                fontSize: "8px",
                letterSpacing: "0.26em",
                color: "rgba(232,200,109,0.45)",
                textTransform: "uppercase",
              }}
            >
            </div>

           {hasResults ? (
  visibleResults.map(({ item }, index) => {
    const isActive = index === activeIndex;

    return (
      <button
        key={item}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => submitQuery(item)}
        onMouseEnter={() => setActiveIndex(index)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "10px 14px",
          background: isActive ? "rgba(232,200,109,0.14)" : "transparent",
          border: "none",
          borderRadius: "10px",
          color: isActive ? "#FFE9A8" : "rgba(245,235,210,0.82)",
          fontFamily: "'EB Garamond', serif",
          fontSize: "14px",
          lineHeight: 1.25,
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <span>{item}</span>
        <span style={{ color: "#E8C86D", opacity: isActive ? 1 : 0.55 }}>
          →
        </span>
      </button>
    );
  })
) : (
              <div
                style={{
                  padding: "10px 14px 12px",
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "14px",
                  color: "rgba(245,235,210,0.48)",
                }}
              >
                No matching starts. Press Enter to ask Sovereign Design.
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes atlasPaletteIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}