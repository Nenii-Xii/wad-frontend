import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../lib/axios"; // Memakai axios instance yang sudah kita buat
import { TokenStore } from "../lib/tokenStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cek apakah ada sesi aktif saat aplikasi pertama kali dibuka
  useEffect(() => {
    const restore = async () => {
      if (!TokenStore.isLoggedIn()) {
        setLoading(false);
        return;
      }
      try {
        const rfToken = TokenStore.getRefreshToken();
        const response = await api.post("/auth/refresh", { refreshToken: rfToken });
        TokenStore.setAccessToken(response.data.accessToken);
        
        // Ambil data user profil
        const me = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${response.data.accessToken}` },
        });
        setUser(me.data);
      } catch (err) {
        TokenStore.clear();
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { accessToken, refreshToken, user: userData } = response.data;
    
    TokenStore.setAccessToken(accessToken);
    TokenStore.setRefreshToken(refreshToken);
    setUser(userData);
  }, []);

  const register = useCallback(async (name, email, password) => {
    await api.post("/auth/register", { name, email, password });
  }, []);

  const logout = useCallback(async () => {
    try {
      const rfToken = TokenStore.getRefreshToken();
      await api.post("/auth/logout", { refreshToken: rfToken }, {
        headers: { Authorization: `Bearer ${TokenStore.getAccessToken()}` },
      });
    } catch (/* abaikan error logout */) {
    } finally {
      TokenStore.clear();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus digunakan di dalam AuthProvider");
  return ctx;
}