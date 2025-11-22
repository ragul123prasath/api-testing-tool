import { useState } from "react";
import { supabase } from "./supabaseClient";
import HistorySidebar from "./HistorySidebar.jsx";
import Logout from "./auth/Logout";
import JSONViewer from "./components/JSONViewer";

import EnvironmentManager from "./components/EnvironmentManager";
import { useEnv } from "./context/EnvContext";
import { replaceVariables } from "./utils/replaceVariables";
import CollectionsPanel from "./components/CollectionsPanel";

import ErrorMessage from "./components/ErrorMessage";
import Spinner from "./components/Spinner";
import useOnlineStatus from "./hooks/useOnlineStatus";
import { apiRequest } from "./utils/apiClient";

import ThemeToggle from "./components/ThemeToggle"; // 🔥 Day 12 Feature

export default function MainApp() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [jsonError, setJsonError] = useState("");

  const online = useOnlineStatus();
  const { environments, activeEnv } = useEnv();
  const currentEnv = environments[activeEnv] || {};

  const saveHistory = async ({ url, method, body, headers }) => {
    try {
      const { data: userData } = await supabase.auth.getUser();

      await supabase.from("history").insert([
        {
          url,
          method,
          headers,
          body,
          user_id: userData?.user?.id || null,
        },
      ]);
    } catch (error) {
      console.error("History save error:", error);
      setError("Failed to save history.");
    }
  };

  const handleHistorySelect = (item) => {
    setUrl(item.url);
    setMethod(item.method);
    setBody(item.body ? JSON.stringify(item.body, null, 2) : "");
  };

  const handleSend = async () => {
    setError("");
    setJsonError("");
    setResponse(null);
    setLoading(true);

    try {
      const finalUrl = replaceVariables(url, currentEnv);

      let finalBody = null;

      if (method !== "GET" && body.trim() !== "") {
        try {
          const replaced = replaceVariables(body, currentEnv);
          finalBody = JSON.parse(replaced);
        } catch (err) {
          setJsonError("Invalid JSON: " + err.message);
          setLoading(false);
          return;
        }
      } else {
        setBody("");
      }

      const json = await apiRequest("http://localhost:5000/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          url: finalUrl,
          body: finalBody,
        }),
      });

      setResponse(json);

      await saveHistory({
        url: finalUrl,
        method,
        headers: { "Content-Type": "application/json" },
        body: finalBody,
      });
    } catch (err) {
      console.error("Request failed:", err);
      setError(err.message);
    }

    setLoading(false);
  };

  const saveToCollection = async () => {
    const collectionId = prompt("Enter Collection ID:");
    if (!collectionId) return;

    const requestName = prompt("Name for this request:");
    if (!requestName) return;

    setError("");
    setLoading(true);

    try {
      let parsedBody = null;

      if (body.trim() !== "") {
        parsedBody = JSON.parse(body);
      }

      await apiRequest(
        `http://localhost:5000/collections/${collectionId}/items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: requestName,
            method,
            url,
            headers: { "Content-Type": "application/json" },
            body: parsedBody,
          }),
        }
      );

      alert("Saved to collection!");
    } catch (err) {
      console.error("Save collection failed:", err);
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">

      {/* Sidebar */}
      <div className="w-64 border-r dark:border-gray-700 bg-white dark:bg-gray-800">
        <HistorySidebar onSelect={handleHistorySelect} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">

        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <ThemeToggle />
          <Logout />
        </div>

        {/* Offline Warning */}
        {!online && <ErrorMessage message="⚠ You are offline!" />}

        {error && <ErrorMessage message={error} />}
        {jsonError && <ErrorMessage message={jsonError} />}

        {/* Environment Manager */}
        <EnvironmentManager />

        {/* Collections Panel */}
        <CollectionsPanel />

        {/* API Request */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border dark:border-gray-700">
          <h1 className="text-xl font-bold mb-4">API Request</h1>

          <label className="font-semibold">URL</label>
          <input
            className="w-full p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-900 mb-3"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.com/users or {{API_URL}}/users"
          />

          <label className="font-semibold">Method</label>
          <select
            className="w-full p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-900 mb-3"
            value={method}
            onChange={(e) => {
              setMethod(e.target.value);
              if (e.target.value === "GET") {
                setBody("");
                setJsonError("");
              }
            }}
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>

          <label className="font-semibold">Body (JSON)</label>
          <textarea
            className="w-full h-40 p-3 rounded-lg border dark:border-gray-700 dark:bg-gray-900 mb-3"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={method === "GET"}
            placeholder='{"token": "{{TOKEN}}"}'
          />

          <div className="flex gap-4">
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Send
            </button>

            <button
              onClick={saveToCollection}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              Save to Collection
            </button>
          </div>

          {loading && <Spinner />}

          {response && !loading && (
            <div className="mt-5">
              <h3 className="font-semibold mb-2">Response JSON</h3>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border dark:border-gray-700">
                <JSONViewer data={response} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
