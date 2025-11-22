import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function HistorySidebar({ onSelect }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    // Get logged-in user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      console.log("User not logged in.");
      return;
    }

    const userId = userData.user.id;

    // Fetch only the current user's history
    const { data, error } = await supabase
      .from("history")
      .select("*")
      .eq("user_id", userId)
      .order("id", { ascending: false });

    if (error) {
      console.error("History load error:", error);
      return;
    }

    setItems(data || []);
  };

  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        overflowY: "scroll",
        borderRight: "1px solid #ddd",
        padding: "10px",
      }}
    >
      <h3>History</h3>

      {items.map((item) => (
        <div
          key={item.id}
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            marginBottom: "5px",
            cursor: "pointer",
          }}
          onClick={() => onSelect(item)}
        >
          <strong>{item.method}</strong>
          <p style={{ fontSize: "12px" }}>{item.url}</p>
        </div>
      ))}
    </div>
  );
}
