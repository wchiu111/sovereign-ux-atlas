interface FirstContactExperienceProps {
  onExit: () => void;
  onProfile: () => void;
  onEnterAtlas: () => void;
}

export default function FirstContactExperience({
  onExit,
  onProfile,
  onEnterAtlas,
}: FirstContactExperienceProps) {
  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 50% 44%, rgba(76,160,121,0.11), transparent 34%), #05050A",
        color: "#F4EBD0",
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, opacity: 0.55 }}>
        {Array.from({ length: 80 }, (_, index) => (
          <span
            key={index}
            style={{
              position: "absolute",
              left: `${(index * 37) % 100}%`,
              top: `${(index * 61) % 100}%`,
              width: index % 11 === 0 ? 2 : 1,
              height: index % 11 === 0 ? 2 : 1,
              borderRadius: "50%",
              background: "rgba(205,233,218,0.55)",
            }}
          />
        ))}
      </div>

      <section
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(620px, calc(100vw - 40px))",
          padding: "34px 36px",
          background: "rgba(5,10,12,0.86)",
          border: "1px solid rgba(111,205,159,0.24)",
          borderRadius: 16,
          backdropFilter: "blur(22px)",
          boxShadow: "0 28px 100px rgba(0,0,0,0.58), 0 0 64px rgba(76,160,121,0.08)",
        }}
      >
        <div style={eyebrowStyle}>03 — First Contact</div>
        <h1 style={{ margin: "0 0 10px", fontFamily: "'EB Garamond', serif", fontSize: 34, fontWeight: 400 }}>
          Open a communication channel.
        </h1>
        <p style={{ margin: "0 0 28px", color: "rgba(245,235,210,0.56)", lineHeight: 1.6 }}>
          This is the Pass 1 placeholder. The production form and delivery behavior come next.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Name" placeholder="Your name" />
          <Field label="Email" placeholder="you@example.com" />
        </div>
        <Field label="Message" placeholder="What would you like to build together?" multiline />

        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 22 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <SecondaryButton onClick={onProfile}>Profile</SecondaryButton>
            <SecondaryButton onClick={onEnterAtlas}>Enter Atlas</SecondaryButton>
          </div>
          <button type="button" style={primaryButtonStyle}>
            Establish Connection →
          </button>
        </div>
      </section>

      <button type="button" onClick={onExit} style={exitButtonStyle}>
        ← Return to interface
      </button>
    </main>
  );
}

function Field({ label, placeholder, multiline = false }: { label: string; placeholder: string; multiline?: boolean }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <span style={eyebrowStyle}>{label}</span>
      {multiline ? (
        <textarea placeholder={placeholder} rows={5} style={fieldStyle} />
      ) : (
        <input placeholder={placeholder} style={fieldStyle} />
      )}
    </label>
  );
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={secondaryButtonStyle}>
      {children}
    </button>
  );
}

const eyebrowStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontFamily: "'DM Mono', monospace",
  fontSize: 8,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "rgba(111,205,159,0.72)",
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 14px",
  border: "1px solid rgba(111,205,159,0.16)",
  borderRadius: 9,
  outline: "none",
  resize: "vertical",
  background: "rgba(255,255,255,0.025)",
  color: "#F4EBD0",
  fontFamily: "'EB Garamond', serif",
  fontSize: 15,
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: "11px 14px",
  border: "1px solid rgba(111,205,159,0.16)",
  borderRadius: 8,
  background: "transparent",
  color: "rgba(245,235,210,0.64)",
  fontFamily: "'DM Mono', monospace",
  fontSize: 8,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  cursor: "pointer",
};

const primaryButtonStyle: React.CSSProperties = {
  ...secondaryButtonStyle,
  border: "1px solid rgba(111,205,159,0.36)",
  background: "rgba(76,160,121,0.1)",
  color: "rgba(175,235,205,0.9)",
};

const exitButtonStyle: React.CSSProperties = {
  position: "absolute",
  left: 28,
  bottom: 24,
  border: 0,
  background: "transparent",
  color: "rgba(245,235,210,0.42)",
  fontFamily: "'DM Mono', monospace",
  fontSize: 8,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  cursor: "pointer",
};
