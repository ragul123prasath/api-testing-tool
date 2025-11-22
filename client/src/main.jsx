import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { AuthProvider } from "./context/AuthContext.jsx";
import { EnvProvider } from "./context/EnvContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <EnvProvider>
        <App />
      </EnvProvider>
    </AuthProvider>
  </React.StrictMode>
);
