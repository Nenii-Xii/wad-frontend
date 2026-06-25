import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext'; // Sesuaikan jika nama auth context-mu berbeda

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const { token } = useAuth(); // Mengambil token login user

  useEffect(() => {
    if (!token) return;

    // Langkah 7: Inisialisasi koneksi Socket.IO dengan handshake auth token
    const socketInstance = io('http://localhost:3000', {
      auth: { token }
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected:', socketInstance.id);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    // Mendengarkan event custom untuk jumlah user online sesuai modul
    socketInstance.on('users:online', (count) => {
      setOnlineCount(count);
    });

    setSocket(socketInstance);
// Di dalam SocketProvider (src/contexts/SocketContext.jsx)
useEffect(() => {
  const handleTokenRefresh = (e) => {
    if (socketRef.current) {
      // Update token otentikasi baru di socket yang sedang menempel
      socketRef.current.auth = { token: e.detail.token };
      // Putuskan dan sambung ulang instan agar server memverifikasi ulang
      socketRef.current.disconnect().connect();
    }
  };

  window.addEventListener("token:refreshed", handleTokenRefresh);
  return () => {
    window.removeEventListener("token:refreshed", handleTokenRefresh);
  };
}, []);
    // Cleanup function: memutus koneksi jika komponen unmount / logout
    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineCount }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook agar gampang dipanggil di komponen lain (misal: useSocket())
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};