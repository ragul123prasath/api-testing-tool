import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      style={{ background: "red", color: "white", padding: "8px 15px" }}
    >
      Logout
    </button>
  );
}
