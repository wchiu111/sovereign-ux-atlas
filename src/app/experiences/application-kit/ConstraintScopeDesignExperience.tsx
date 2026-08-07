import ApplicationKitModuleFocusShell from "./ApplicationKitModuleFocusShell";

interface Props { color: string; onExit: () => void; }

const STAGES = [
  ["01", "Capability", "What can the system reliably do in this context?"],
  ["02", "Boundary", "Where does its legitimate operating space stop?"],
  ["03", "Limitation", "What conditions make its output unreliable, partial, or unavailable?"],
  ["04", "Disclosure", "How are those limits made visible before they matter?"],
  ["05", "Escalation", "When should the system involve another person, service, or authority?"],
  ["06", "Handoff", "How does context travel when responsibility changes?"],
  ["07", "Non-Action", "When is refusal, deferral, or doing nothing the correct behavior?"],
];

export default function ConstraintScopeDesignExperience({ color, onExit }: Props) {
  return (
    <ApplicationKitModuleFocusShell
      eyebrow="Application Kit · Module"
      title="Constraint & Scope Design"
      summary="Make system capabilities, limitations, and non-capabilities understandable before users are forced to discover them through failure."
      question="Where does this system's authority and capability end, and how will the user know before acting on it?"
      color={color}
      onExit={onExit}
    >
      <div style={{ marginBottom: 26 }}>
        <div style={eyebrow}>Scope model</div>
        <div style={heading}>A boundary is useful only when the user can perceive it.</div>
        <p style={copy}>
          This focus mode turns capability, limitation, disclosure, escalation,
          handoff, and non-action into explicit parts of the experience rather
          than legal copy hidden at the edge of the interface.
        </p>
      </div>

      <div style={{ display: "grid", gap: 9 }}>
        {STAGES.map(([number, title, body]) => (
          <div key={title} style={{
            display: "grid", gridTemplateColumns: "46px 150px minmax(0,1fr)",
            alignItems: "center", gap: 14, minHeight: 66, padding: "11px 15px",
            border: "1px solid rgba(235,224,190,.11)",
            background: "rgba(235,224,190,.018)",
          }}>
            <div style={{ ...eyebrow, color, margin: 0 }}>{number}</div>
            <div style={{
              fontFamily: "'DM Mono',monospace", fontSize: 9.5,
              letterSpacing: ".10em", color: "rgba(255,248,230,.84)",
              textTransform: "uppercase",
            }}>{title}</div>
            <div style={smallCopy}>{body}</div>
          </div>
        ))}
      </div>
    </ApplicationKitModuleFocusShell>
  );
}

const eyebrow = {
  fontFamily: "'DM Mono',monospace", fontSize: 8,
  letterSpacing: ".22em", textTransform: "uppercase" as const,
  color: "rgba(235,224,190,.70)", marginBottom: 9,
};
const heading = {
  fontFamily: "'EB Garamond',serif", fontSize: 25,
  color: "rgba(255,248,230,.94)", marginBottom: 10,
};
const copy = {
  maxWidth: 640, margin: 0, fontFamily: "'EB Garamond',serif",
  fontSize: 14.5, lineHeight: 1.6, color: "rgba(245,235,210,.56)",
};
const smallCopy = {
  fontFamily: "'EB Garamond',serif", fontSize: 13,
  lineHeight: 1.5, color: "rgba(245,235,210,.54)",
};
