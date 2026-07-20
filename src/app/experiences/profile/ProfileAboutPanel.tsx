import type { CSSProperties, ReactNode } from "react";
import wilsonProfilePhoto from "../../../imports/profile/wilson-chiu-profile.png";
import AboutFocusRadar from "./AboutFocusRadar";
import AboutPrinciplesGraph from "./AboutPrinciplesGraph";

const BLUE = "#6AA7FF";

const principles = [
  "Clarity over complexity",
  "Systems before screens",
  "Understand before designing",
  "Evidence over opinion",
  "AI augments judgment",
];

const processSteps = [
  { label: "Observe", glyph: "◎" },
  { label: "Understand", glyph: "◇" },
  { label: "Structure", glyph: "▦" },
  { label: "Prototype", glyph: "✎" },
  { label: "Evaluate", glyph: "⌕" },
  { label: "Refine", glyph: "◌" },
];

const focusAreas = [
  "AI-native interfaces",
  "Human–AI collaboration",
  "Design integrity",
  "Knowledge systems",
  "Interaction architecture",
];

export default function ProfileAboutPanel() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "auto auto auto",
        alignContent: "start",
        gap: 12,
        minHeight: "100%",
        padding: "18px 18px 30px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.02fr) minmax(0, 1fr)",
          gap: 12,
          minHeight: 238,
        }}
      >
        <PanelBlock index="1" title="Identity">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "150px minmax(0, 1fr)",
              alignItems: "center",
              gap: 22,
              height: "100%",
            }}
          >
            <BlueprintPortrait />
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: 30,
                  lineHeight: 1.05,
                  color: "rgba(247,242,229,0.98)",
                }}
              >
                Wilson Chiu
              </div>
              <div
                style={{
                  display: "grid",
                  gap: 5,
                  marginTop: 12,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 13,
                  lineHeight: 1.35,
                  color: "rgba(106,167,255,0.94)",
                }}
              >
                <span>Product Designer</span>
                <span>Design Engineer</span>
                <span>Systems Thinker</span>
              </div>
              <div
                style={{
                  height: 1,
                  margin: "16px 0 13px",
                  background:
                    "linear-gradient(90deg, rgba(106,167,255,0.58), transparent)",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "'EB Garamond', serif",
                  fontSize: 15,
                  color: "rgba(235,242,255,0.76)",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    border: "1px solid rgba(106,167,255,0.9)",
                    boxShadow: "0 0 10px rgba(106,167,255,0.38)",
                  }}
                />
                San Francisco Bay Area
              </div>
            </div>
          </div>
        </PanelBlock>

        <PanelBlock index="2" title="Principles">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(210px, 0.72fr)",
              gap: 14,
              alignItems: "center",
              height: "100%",
            }}
          >
            <div style={{ display: "grid", gap: 11 }}>
              {principles.map((principle, index) => (
                <ListItem key={principle} delay={index * 80}>
                  {principle}
                </ListItem>
              ))}
            </div>
            <AboutPrinciplesGraph />
          </div>
        </PanelBlock>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(300px, 1fr)",
          gap: 12,
          minHeight: 224,
        }}
      >
        <PanelBlock index="3" title="Design Process">
          <div
            style={{
              display: "grid",
              alignContent: "center",
              height: "100%",
              minHeight: 0,
              padding: "2px 2px 0",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(11, minmax(0, auto))",
                alignItems: "start",
                justifyContent: "space-between",
                gap: 6,
              }}
            >
              {processSteps.map((step, index) => (
                <ProcessStep
                  key={step.label}
                  label={step.label}
                  glyph={step.glyph}
                  showArrow={index < processSteps.length - 1}
                />
              ))}
            </div>
            <div
              style={{
                position: "relative",
                height: 34,
                margin: "14px 28px 0",
                borderBottom: "1px dashed rgba(106,167,255,0.72)",
                borderLeft: "1px dashed rgba(106,167,255,0.72)",
                borderRight: "1px dashed rgba(106,167,255,0.72)",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: -4,
                  top: -1,
                  width: 7,
                  height: 7,
                  borderLeft: "1px solid rgba(106,167,255,0.85)",
                  borderTop: "1px solid rgba(106,167,255,0.85)",
                  transform: "rotate(45deg)",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: -7,
                  transform: "translateX(-50%)",
                  padding: "0 10px",
                  background: "rgba(5,11,22,0.96)",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(106,167,255,0.78)",
                  whiteSpace: "nowrap",
                }}
              >
                Iterate · Learn · Improve
              </span>
            </div>
          </div>
        </PanelBlock>

        <PanelBlock index="4" title="Areas of Focus">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(210px, 0.9fr)",
              gap: 12,
              alignItems: "center",
              height: "100%",
              paddingTop: 16,
            }}
          >
            <div style={{ display: "grid", gap: 10, paddingBottom: 14, }}>
              {focusAreas.map((area, index) => (
                <ListItem key={area} delay={index * 70}>
                  {area}
                </ListItem>
              ))}
            </div>
            <div
              style={{
                alignSelf: "start",
                marginTop: -4,
              }}
            >
              <AboutFocusRadar />
            </div>
          </div>
        </PanelBlock>
      </div>

      <section
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "42px minmax(0, 1fr)",
          alignItems: "center",
          gap: 16,
          minHeight: 72,
          padding: "13px 20px",
          border: "1px solid rgba(106,167,255,0.26)",
          background:
            "linear-gradient(90deg, rgba(106,167,255,0.055), rgba(106,167,255,0.018) 58%, transparent)",
          overflow: "hidden",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            alignSelf: "start",
            fontFamily: "'EB Garamond', serif",
            fontSize: 38,
            lineHeight: 1,
            color: "rgba(106,167,255,0.72)",
          }}
        >
          “
        </span>
        <div>
          <p
            style={{
              margin: 0,
              fontFamily: "'EB Garamond', serif",
              fontSize: 19,
              lineHeight: 1.35,
              letterSpacing: "0.02em",
              color: "rgba(247,242,229,0.9)",
            }}
          >
            I design systems that help people make better decisions alongside AI.
          </p>
        </div>
      </section>
    </div>
  );
}

function BlueprintPortrait() {
  return (
    <div
      style={{
        position: "relative",
        width: 146,
        height: 146,
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 3,
          borderRadius: "50%",
          border: "1px dashed rgba(106,167,255,0.32)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: 1,
          background:
            "linear-gradient(180deg, transparent, rgba(106,167,255,0.32), transparent)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(106,167,255,0.32), transparent)",
        }}
      />
      <div
        style={{
          position: "relative",
          width: 118,
          height: 118,
          borderRadius: "50%",
          overflow: "hidden",
          border: "1px solid rgba(106,167,255,0.82)",
          boxShadow:
            "0 0 24px rgba(106,167,255,0.22), inset 0 0 24px rgba(106,167,255,0.08)",
        }}
      >
        <img
          src={wilsonProfilePhoto}
          alt="Wilson Chiu"
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            userSelect: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(106,167,255,0.02), rgba(7,14,28,0.14))",
            pointerEvents: "none",
          }}
        />
      </div>
      {[
        { left: 0, top: 0, borderLeft: true, borderTop: true },
        { right: 0, top: 0, borderRight: true, borderTop: true },
        { left: 0, bottom: 0, borderLeft: true, borderBottom: true },
        { right: 0, bottom: 0, borderRight: true, borderBottom: true },
      ].map((mark, index) => (
        <span
          key={index}
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 12,
            height: 12,
            left: mark.left,
            right: mark.right,
            top: mark.top,
            bottom: mark.bottom,
            borderLeft: mark.borderLeft
              ? "1px solid rgba(106,167,255,0.82)"
              : undefined,
            borderRight: mark.borderRight
              ? "1px solid rgba(106,167,255,0.82)"
              : undefined,
            borderTop: mark.borderTop
              ? "1px solid rgba(106,167,255,0.82)"
              : undefined,
            borderBottom: mark.borderBottom
              ? "1px solid rgba(106,167,255,0.82)"
              : undefined,
          }}
        />
      ))}
    </div>
  );
}

function PanelBlock({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      style={{
        minHeight: 0,
        padding: 16,
        border: "1px solid rgba(106,167,255,0.22)",
        background:
          "linear-gradient(145deg, rgba(106,167,255,0.035), rgba(106,167,255,0.012))",
        overflow: "visible",
      }}
    >
      <h3 style={sectionStyle}>
        <span style={{ opacity: 0.82 }}>{index}.</span> {title}
      </h3>
      {children}
    </section>
  );
}

function ListItem({
  children,
  delay,
}: {
  children: ReactNode;
  delay: number;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "12px minmax(0, 1fr)",
        alignItems: "center",
        gap: 9,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 6,
          height: 6,
          transform: "rotate(45deg)",
          background: "rgba(106,167,255,0.94)",
          boxShadow: "0 0 11px rgba(106,167,255,0.68)",
          animation: `profileAboutPrinciplePulse 3200ms ease-in-out ${delay}ms infinite`,
        }}
      />
      <span style={bodyStyle}>{children}</span>
    </div>
  );
}

function ProcessStep({
  label,
  glyph,
  showArrow,
}: {
  label: string;
  glyph: string;
  showArrow: boolean;
}) {
  return (
    <>
      <div
        style={{
          display: "grid",
          justifyItems: "center",
          gap: 7,
          minWidth: 54,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: "grid",
            placeItems: "center",
            width: 42,
            height: 42,
            borderRadius: "50%",
            border: "1px solid rgba(106,167,255,0.72)",
            background: "rgba(106,167,255,0.035)",
            color: "rgba(205,226,255,0.9)",
            fontFamily: "'DM Mono', monospace",
            fontSize: 17,
            boxShadow: "0 0 14px rgba(106,167,255,0.08)",
          }}
        >
          {glyph}
        </span>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(235,242,255,0.7)",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </div>
      {showArrow && (
        <span
          aria-hidden="true"
          style={{
            alignSelf: "center",
            marginTop: -18,
            color: "rgba(106,167,255,0.78)",
            fontFamily: "'DM Mono', monospace",
            fontSize: 15,
          }}
        >
          →
        </span>
      )}
    </>
  );
}

const sectionStyle: CSSProperties = {
  margin: "0 0 2px",
  fontFamily: "'DM Mono', monospace",
  fontSize: 10,
  lineHeight: 1.3,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "rgba(106,167,255,0.9)",
};

const bodyStyle: CSSProperties = {
  fontFamily: "'EB Garamond', serif",
  fontSize: 15,
  lineHeight: 1.35,
  color: "rgba(235,242,255,0.8)",
};

const missionLine: CSSProperties = {
  flex: 1,
  height: 1,
  background:
    "linear-gradient(90deg, transparent, rgba(106,167,255,0.48), transparent)",
};
