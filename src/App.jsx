import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext"; 
import { NotifProvider } from "./contexts/NotifContext"; 
import { ToastContainer } from "./components/ToastContainer"; 

// Halaman placeholder sebelum kamu salin halaman asli capstone kamu
const TasksPage = () => <h2 style={{ padding: "2rem" }}>Halaman Utama Tugas (Real-time Terhubung)</h2>;

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotifProvider>
          <BrowserRouter>
            <Routes>
              {/* Sesuaikan rute ini dengan rute asli proyek capstone-mu */}
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="*" element={<Navigate to="/tasks" replace />} />
            </Routes>
          </BrowserRouter>
          
          {/* Komponen Toast diletakkan di luar router agar melayang global */}
          <ToastContainer /> 
        </NotifProvider>
      </SocketProvider>
    </AuthProvider>
  );
}