// src/services/animalsService.js
import api from './api';

const base = '/animals';

const animalsService = {
  async list() {
    const { data } = await api.get(`${base}`);
    return data; // array de animales
  },

  async getById(id) {
    const { data } = await api.get(`${base}/${id}`);
    return data; // objeto animal
  },

  async getByStatus(estadoAdopcion) {
    // Backend espera query param 'estadoAdopcion' en /animals/status
    const { data } = await api.get(`${base}/status`, { params: { estadoAdopcion } });
    return data;
  },

  // Admin only
  async create(payload) {
    // payload: { nombre, sexo, edad?, tamano?, historia?, estadoAdopcion?, foto? }
    const { data } = await api.post(`${base}`, payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.put(`${base}/${id}`, payload);
    return data;
  },

  async remove(id) {
    await api.delete(`${base}/${id}`);
    return true;
  }
};

export default animalsService;
