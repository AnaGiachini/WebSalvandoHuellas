// src/services/adoptionApplicationsService.js
import api from './api';

const base = '/adoptions';

export const adoptionApplicationsService = {
  async create(payload) {
    // payload expected: { animalId, ...formData }
    const { data } = await api.post(`${base}`, payload);
    return data;
  },

  async getByUser(userId) {
    const { data } = await api.get(`${base}/usuario/${userId}`);
    return data;
  },

  async getByAnimal(animalId) {
    const { data } = await api.get(`${base}/animal/${animalId}`);
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`${base}/${id}`);
    return data;
  },

  // Admin only
  async getAll() {
    const { data } = await api.get(`${base}`);
    return data;
  },

  async updateStatus(id, estado) {
    const { data } = await api.put(`${base}/${id}/estado`, { estado });
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`${base}/${id}`);
    return data;
  },
};

export default adoptionApplicationsService;
