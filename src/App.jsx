import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TaskProvider } from "./contexts/TaskContext"; 
import { NotifProvider } from "./contexts/NotifContext";   // Integrasi Week 9
import { SocketProvider } from "./contexts/SocketContext"; // Integrasi Week 9
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { TasksPage } from "./pages/TasksPage";
import { ProfilePage } from "./pages/ProfilePage";

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <NotifProvider>
          <SocketProvider>
            <BrowserRouter>
              <Routes>
                {/* —— Halaman Publik —— */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* —— Halaman yang Memerlukan Login (Protected) —— */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Navigate to="/tasks" replace />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>

                {/* —— Fallback —— */}
                <Route path="*" element={<Navigate to="/tasks" replace />} />
              </Routes>
            </BrowserRouter>
          </SocketProvider>
        </NotifProvider>
      </TaskProvider> {/* ← PEMBETULAN: Ditambahkan tag penutup TaskProvider yang tadi hilang */}
    </AuthProvider>
  );
}