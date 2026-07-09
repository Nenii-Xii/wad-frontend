import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../lib/axios";
import { TokenStore } from "../lib/tokenStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      if (!TokenStore.isLoggedIn()) {
        setLoading(false);
        return;
      }
      try {
        const rfToken = TokenStore.getRefreshToken();
        const { data } = await api.post("/auth/refresh", { refreshToken: rfToken });
        TokenStore.setAccessToken(data.data.accessToken);
        const { data: me } = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${data.data.accessToken}` },
        });
        setUser(me.data);
      } catch {
        TokenStore.clear();
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const result = response.data.data || response.data;

    TokenStore.setAccessToken(result.accessToken);
    TokenStore.setRefreshToken(result.refreshToken);

    const { data: me } = await api.get("/auth/me");
    setUser(me.data || me);

    window.dispatchEvent(new Event("login-success"));
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
    } catch {}
    TokenStore.clear();
    setUser(null);
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