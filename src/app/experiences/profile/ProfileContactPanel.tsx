import type React from "react";

export default function ProfileContactPanel() {
  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      style={{
        display: "grid",
        alignContent: "start",
        padding: "22px 24px 28px",
        minHeight: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(116,201,155,0.74)",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#74C99B",
            boxShadow: "0 0 14px rgba(116,201,155,0.68)",
          }}
        />
        Channel open
      </div>

      <Field label="Name" name="name" />
      <Field label="Email" name="email" type="email" />
      <label style={labelStyle}>
        Message
        <textarea
          name="message"
          rows={4}
          style={{
            ...inputStyle,
            resize: "vertical",
            minHeight: 110,
            maxHeight: 240,
          }}
        />
      </label>

      <button
        type="submit"
        style={{
          width: "100%",
          marginTop: 14,
          padding: "12px 14px",
          border: "1px solid rgba(116,201,155,0.38)",
          borderRadius: 8,
          background: "rgba(116,201,155,0.08)",
          color: "rgba(232,245,236,0.9)",
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        Transmit message
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <label style={labelStyle}>
      {label}
      <input name={name} type={type} style={inputStyle} />
    </label>
  );
}

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: 7,
  marginTop: 10,
  fontFamily: "'DM Mono', monospace",
  fontSize: 10,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "rgba(245,235,210,0.48)",
};

const inputStyle: React.CSSProperties = {
  boxSizing: "border-box",
  width: "100%",
  padding: "10px 12px",
  border: "1px solid rgba(116,201,155,0.18)",
  borderRadius: 7,
  outline: "none",
  background: "rgba(255,255,255,0.025)",
  color: "#F4EBD0",
  fontFamily: "'EB Garamond', serif",
  fontSize: 16,
};
