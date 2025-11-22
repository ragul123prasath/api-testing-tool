import { createContext, useContext, useState } from "react";

const EnvContext = createContext();

export function EnvProvider({ children }) {
  const [environments, setEnvironments] = useState({
    Development: { API_URL: "http://localhost:5000" },
  });

  const [activeEnv, setActiveEnv] = useState("Development");

  const addEnvironment = () => {
    const name = prompt("Environment name:");
    if (!name) return;

    setEnvironments({ ...environments, [name]: {} });
    setActiveEnv(name);
  };

  const addVariable = (key, value) => {
    setEnvironments({
      ...environments,
      [activeEnv]: {
        ...environments[activeEnv],
        [key]: value,
      },
    });
  };

  return (
    <EnvContext.Provider
      value={{
        environments,
        activeEnv,
        setActiveEnv,
        addEnvironment,
        addVariable,
      }}
    >
      {children}
    </EnvContext.Provider>
  );
}

export const useEnv = () => useContext(EnvContext);
