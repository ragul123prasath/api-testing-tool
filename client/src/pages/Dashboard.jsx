import { useAuth } from "../context/AuthContext";
import Logout from "../auth/Logout";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div style={{ padding: "30px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Logout />
      </div>

      <h1>Welcome, {user?.email}</h1>

      <p>This is your dashboard.</p>

      <button onClick={() => (window.location.href = "/app")}>
        Open API Tool
      </button>
    </div>
  );
}
