import axios from "axios";

const axiosInstance = axios.create({
  // Menghubungkan ke port backend capstone kamu
  baseURL: "http://localhost:3000/api/v1", 
  withCredentials: true, // Supaya cookie/session aman ikut terkirim
});

// Response Interceptor untuk handle refresh token otomatis (Langkah 14 Handbook)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika error 401 (Unauthorized) dan belum pernah melakukan retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Panggil endpoint refresh token di backend
        const response = await axiosInstance.post("/auth/refresh");
        const newToken = response.data.accessToken;

        // Kirim sinyal ke SocketContext agar ikut reconnect (Langkah 14 Handbook)
        window.dispatchEvent(new CustomEvent("token:refreshed", {
          detail: { token: newToken }
        }));

        // Jalankan kembali request yang tadi sempat gagal
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;