import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext"; // Tambahan Week 9

export function Navbar() {
  const { user, logout } = useAuth();
  const { onlineCount, isConnected } = useSocket(); // Tambahan Week 9
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/tasks">WAD Task Manager</Link>
      </div>
      <div className="navbar-menu">
        <Link to="/tasks">Tasks</Link>
        <Link to="/profile">Profil</Link>
        
        {/* —— Fitur Indikator Online Tambahan Week 9 —— */}
        <div className="online-indicator" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: isConnected ? "#10b981" : "#ef4444"
          }}></span>
          <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            {isConnected ? `${onlineCount} online` : "Offline"}
          </span>
        </div>

        <span className="navbar-user">Halo, {user?.name}</span>
        <button onClick={handleLogout} className="btn-logout">Keluar</button>
      </div>
    </nav>
  );
}