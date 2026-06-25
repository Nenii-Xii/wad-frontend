// File: src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
// ── TAMBAHKAN IMPOR HOOK SOCKET ───────────────────────────────────
import { useSocket } from "../contexts/SocketContext"; 

export function Navbar() {
  const { user, logout } = useAuth();
  // ── AMBIL STATUS KONEKSI DAN COUNT USER ONLINE ──────────────────
  const { isConnected, onlineCount } = useSocket(); 
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link App={Link} to="/tasks">WAD Task Manager</Link>
      </div>
      
      <div className="navbar-menu">
        {/* ── INDIKATOR REAL-TIME (Langkah 13) ────────────────────── */}
        <div className="rt-indicator">
          <span 
            className="rt-dot" 
            style={{ background: isConnected ? "#4ade80" : "#f87171" }}
            title={isConnected ? "Real-time aktif" : "Tidak terhubung"}
          />
          <span className="rt-label">
            {isConnected ? `${onlineCount} online` : "Offline"}
          </span>
        </div>

        <Link to="/tasks">Tasks</Link>
        <Link to="/profile">Profil</Link>
        <span className="navbar-user">Halo, {user?.name}</span>
        <button onClick={handleLogout} className="btn-logout">Keluar</button>
      </div>
    </nav>
  );
}