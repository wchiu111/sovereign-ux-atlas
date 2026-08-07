import ApplicationKitModuleFocusShell from "./ApplicationKitModuleFocusShell";

interface Props { color: string; onExit: () => void; }

const STAGES = [
  ["01", "Roles", "Identify the people, roles, or institutions with legitimate standing."],
  ["02", "Needs", "Surface what each participant actually needs from the shared system."],
  ["03", "Decision Rights", "Make explicit who may decide, approve, override, or decline."],
  ["04", "Conflict", "Reveal where legitimate needs or authorities collide."],
  ["05", "Negotiation", "Present choices without quietly privileging one role."],
  ["06", "Trade-offs", "Keep the cost of each resolution visible to everyone affected."],
  ["07", "Resolution", "Record what was decided, by whom, and what remains contestable."],
];

export default function MultiUserCoSovereigntyExperience({ color, onExit }: Props) {
  return (
    <ApplicationKitModuleFocusShell
      eyebrow="Application Kit · Module"
      title="Multi-User & Co-Sovereignty"
      summary="Design shared systems where multiple people or roles hold legitimate needs, authority, and decision rights."
      question="How should a system negotiate competing needs without pretending every participant has equal power or authority?"
      color={color}
      onExit={onExit}
    >
      <div style={{ marginBottom: 26 }}>
        <div style={eyebrow}>Co-sovereignty model</div>
        <div style={heading}>Shared authority is designed, not assumed.</div>
        <p style={copy}>
          This focus mode makes the relationships between roles, needs, decision
          rights, conflicts, and trade-offs inspectable before a shared system
          attempts to resolve them.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 12 }}>
        {STAGES.map(([number, title, body]) => (
          <div key={title} style={{
            minHeight: 128, padding: "16px 17px",
            border: "1px solid rgba(170,140,230,.14)",
            background: "rgba(170,140,230,.025)",
          }}>
            <div style={{ ...eyebrow, color, marginBottom: 8 }}>{number}</div>
            <div style={{
              fontFamily: "'EB Garamond',serif", fontSize: 18,
              color: "rgba(255,248,230,.90)", marginBottom: 7,
            }}>{title}</div>
            <div style={smallCopy}>{body}</div>
          </div>
        ))}
      </div>
    </ApplicationKitModuleFocusShell>
  );
}

const eyebrow = {
  fontFamily: "'DM Mono',monospace",
  fontSize: 8, letterSpacing: ".22em",
  textTransform: "uppercase" as const,
  color: "rgba(170,140,230,.74)", marginBottom: 9,
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
