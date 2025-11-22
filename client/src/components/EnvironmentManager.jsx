import { useEnv } from "../context/EnvContext";

export default function EnvironmentManager() {
  const {
    environments,
    activeEnv,
    setActiveEnv,
    addEnvironment,
    addVariable,
  } = useEnv();

  const handleAddVariable = () => {
    const key = prompt("Variable Key:");
    const value = prompt("Variable Value:");

    if (key && value) {
      addVariable(key, value);
    }
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", marginBottom: "1rem" }}>
      <h3>Environment Manager</h3>

      {/* Select Environment */}
      <select
        value={activeEnv}
        onChange={(e) => setActiveEnv(e.target.value)}
        style={{ padding: "5px", marginRight: "10px" }}
      >
        {Object.keys(environments).map((env) => (
          <option key={env}>{env}</option>
        ))}
      </select>

      <button onClick={addEnvironment}>+ Add Environment</button>

      <h4 style={{ marginTop: "10px" }}>Variables</h4>

      {Object.entries(environments[activeEnv]).map(([key, value]) => (
        <div
          key={key}
          style={{ display: "flex", gap: "10px", marginBottom: "5px" }}
        >
          <input value={key} disabled style={{ width: "150px" }} />
          <input value={value} disabled style={{ width: "200px" }} />
        </div>
      ))}

      <button onClick={handleAddVariable}>+ Add Variable</button>
    </div>
  );
}
