import api from "../lib/axios";

export const taskService = {
  getAll: async (params = {}) => {
    const { data } = await api.get("/tasks", { params });
    return data; 
  },

  getById: async (id) => {
    const { data } = await api.get(`/tasks/${id}`);
    return data.data;
  },

  create: async (taskData) => {
    const { data } = await api.post("/tasks", taskData);
    return data.data;
  },

  update: async (id, taskData) => {
    const { data } = await api.patch(`/tasks/${id}`, taskData);
    return data.data;
  },

  remove: async (id) => {
    await api.delete(`/tasks/${id}`);
  },
};