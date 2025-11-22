import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function HistorySidebar({ onSelect }) {
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    const { data } = await supabase.from("history").select("*").order("id", { ascending: false });
    setHistory(data || []);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div
      style={{
        width: "250px",
        borderRight: "1px solid #ccc",
        height: "100vh",
        overflowY: "auto",
        padding: "1rem",
      }}
    >
      <h3>History</h3>
      {history.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelect(item)}
          style={{
            padding: "0.5rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            marginBottom: "0.5rem",
            cursor: "pointer",
          }}
        >
          <strong>{item.method}</strong>
          <br />
          <small>{item.url}</small>
        </div>
      ))}
    </div>
  );
}
