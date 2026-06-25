// File: src/pages/TasksPage.jsx
import { useState, useEffect, useCallback } from "react";
import { Navbar } from "../components/Navbar";
import { TaskCard } from "../components/TaskCard";
import { TaskForm } from "../components/TaskForm";
import { taskService } from "../services/task.service";
// ── TAMBAHKAN IMPOR HOOK INI ──────────────────────────────────────
import { useRealTimeTasks } from "../hooks/useRealTimeTasks"; 

export function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [filter, setFilter] = useState("ALL");

  // ── TAMBAHKAN SATU BARIS INI (Menangani update live otomatis) ───
  useRealTimeTasks(setTasks); 

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = filter !== "ALL" ? { status: filter } : {};
      const res = await taskService.getAll(params);
      setTasks(res.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Gagal memuat task");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ... sisa fungsi handleCreate, handleUpdate, handleDelete bawaan berkas lama kamu