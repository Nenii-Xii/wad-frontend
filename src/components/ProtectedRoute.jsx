import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. JANGAN PANDANG BULU SAAT LOADING: Tunggu sampai token selesai di-restore
  if (loading) {
    return (
      <div className="loading-container">
        <p>Memuat data sesi...</p>
      </div>
    );
  }

  // 2. JIKA KAGAK ADA USER: Tendang kembali ke halaman login manual
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. JIKA USER AMAN: Loloskan masuk ke halaman dashboard/tasks
  return children;
}