import { createContext, useContext, useState, useCallback } from "react";
import api from "../lib/axios";

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // —— FETCH TASKS (Langkah 4 - Halaman 27) ——
  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/tasks", { params });
      setTasks(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil data tugas");
    } finally {
      setLoading(false);
    }
  }, []);

  // —— CREATE TASK (Langkah 5 - Halaman 28) ——
  const createTask = useCallback(async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/tasks", taskData);
      // Masukkan task baru di urutan paling atas list
      setTasks((prev) => [data.data, ...prev]);
      return data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Gagal membuat tugas baru");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, pagination, loading, error, fetchTasks, createTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks harus digunakan di dalam TaskProvider");
  return ctx;
}