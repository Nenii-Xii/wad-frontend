import { useEffect } from "react";
import { useSocket } from "../contexts/SocketContext";
import { useNotif } from "../contexts/NotifContext";

/**
 * Custom Hook untuk mendaftarkan event listener Socket.IO terkait perubahan data tasks.
 * @param {Function} setTasks - State setter function dari useState di TasksPage
 */
export function useRealTimeTasks(setTasks) {
    const { socket } = useSocket();
    const { addToast } = useNotif();

    useEffect(() => {
        if (!socket) return;

        const onTaskCreated = ({ task }) => {
            setTasks(prev => {
                const exists = prev.some(t => Number(t.id) === Number(task.id));
                if (exists) return prev;
                return [task, ...prev];
            });
        };

        // ── EVENT: TASK UPDATED ─────────────────────────────────────────────
        const onTaskUpdated = ({ task }) => {
            setTasks(prev => prev.map(t => t.id === task.id ? task : t));
            
            addToast({
                type: "INFO",
                title: "Task Diperbarui",
                message: `"${task.title}" telah diperbarui oleh pengguna lain.`,
            });
        };

        // ── EVENT: TASK DELETED ─────────────────────────────────────────────
        const onTaskDeleted = ({ taskId }) => {
            setTasks(prev => prev.filter(t => t.id !== taskId));
        };

        // ── EVENT: PERSONAL NOTIFICATION ────────────────────────────────────
        const onNotification = (notif) => {
            addToast(notif);
        };

        // ── REGISTRASI LISTENERS KONEKSI ────────────────────────────────────
        socket.on("task:created", onTaskCreated);
        socket.on("task:updated", onTaskUpdated);
        socket.on("task:deleted", onTaskDeleted);
        socket.on("notification", onNotification);

        // ── CLEANUP FUNCTION ────────────────────────────────────────────────
        return () => {
            socket.off("task:created", onTaskCreated);
            socket.off("task:updated", onTaskUpdated);
            socket.off("task:deleted", onTaskDeleted);
            socket.off("notification", onNotification);
        };
    }, [socket, setTasks, addToast]);
}