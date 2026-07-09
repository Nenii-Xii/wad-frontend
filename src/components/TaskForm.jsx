import { useForm } from "react-hook-form";
import { useEffect } from "react";

export function TaskForm({ onSubmit, onCancel, initialData = null }) {
  const isEdit = !!initialData;

  const getNormalizedDefaultValues = () => {
    if (!initialData) {
      return {
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        dueDate: "",
      };
    }
    return {
      ...initialData,
      status: initialData.status ? initialData.status.toLowerCase() : "todo",
      priority: initialData.priority ? initialData.priority.toLowerCase() : "medium",
      dueDate: (initialData.dueDate && !initialData.dueDate.includes("Invalid Date")) 
        ? initialData.dueDate.split("T")[0] 
        : "",
    };
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: getNormalizedDefaultValues(),
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        status: initialData.status ? initialData.status.toLowerCase() : "todo",
        priority: initialData.priority ? initialData.priority.toLowerCase() : "medium",
        dueDate: (initialData.dueDate && !initialData.dueDate.includes("Invalid Date")) 
          ? initialData.dueDate.split("T")[0] 
          : "",
      });
    } else {
      reset({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        dueDate: "",
      });
    }
  }, [initialData, reset]);

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>{isEdit ? "Edit Task" : "Buat Task Baru"}</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Judul *</label>
            <input {...register("title", { required: "Judul wajib diisi" })} />
            {errors.title && <span className="error">{errors.title.message}</span>}
          </div>

          <div className="form-group">
            <label>Deskripsi</label>
            <textarea rows={3} {...register("description")} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select {...register("status")}>
                <option value="todo">Belum Dimulai</option>
                <option value="in_progress">Sedang Dikerjakan</option>
                <option value="done">Selesai</option>
              </select>
            </div>

            <div className="form-group">
              <label>Prioritas</label>
              <select {...register("priority")}>
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Tenggat Waktu</label>
            <input type="date" {...register("dueDate")} />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Batal
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}