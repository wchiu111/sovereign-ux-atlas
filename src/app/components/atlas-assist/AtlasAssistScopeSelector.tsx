import type { AtlasAssistMode, AtlasAssistScope } from "../../types/atlasAssist";

const SCOPE_LABELS: Record<AtlasAssistScope, string> = {
  section: "This section",
  project: "This project",
  atlas: "Entire Atlas",
};

function ScopeOptions({
  mode,
  scope,
  scopes,
  onChange,
}: {
  mode: AtlasAssistMode;
  scope: AtlasAssistScope;
  scopes: AtlasAssistScope[];
  onChange: (scope: AtlasAssistScope) => void;
}) {
  return (
    <div className="atlas-assist-scope__options">
      {scopes.map((item) => (
        <label key={item} data-active={scope === item || undefined}>
          <input
            type="radio"
            name={`atlas-assist-scope-${mode}`}
            value={item}
            checked={scope === item}
            onChange={() => onChange(item)}
          />
          <span aria-hidden="true" className="atlas-assist-scope__marker" />
          <span>{SCOPE_LABELS[item]}</span>
        </label>
      ))}
    </div>
  );
}

export default function AtlasAssistScopeSelector({
  mode,
  scope,
  compact = false,
  onChange,
}: {
  mode: AtlasAssistMode;
  scope: AtlasAssistScope;
  compact?: boolean;
  onChange: (scope: AtlasAssistScope) => void;
}) {
  const scopes: AtlasAssistScope[] = mode === "focused"
    ? ["section", "project", "atlas"]
    : ["project", "atlas"];

  if (compact) {
    return (
      <details className="atlas-assist-scope atlas-assist-scope--compact">
        <summary>
          <span>Grounded in</span>
          <strong>{SCOPE_LABELS[scope]}</strong>
        </summary>
        <ScopeOptions
          mode={mode}
          scope={scope}
          scopes={scopes}
          onChange={onChange}
        />
      </details>
    );
  }

  return (
    <fieldset className="atlas-assist-scope">
      <legend>CURRENT SCOPE</legend>
      <ScopeOptions mode={mode} scope={scope} scopes={scopes} onChange={onChange} />
    </fieldset>
  );
}
