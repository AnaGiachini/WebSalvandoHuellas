// src/services/articlesService.js
import api from './api';

const articlesService = {
  async getAll() {
    const { data } = await api.get('/articles');
    return data?.data ?? [];
  },
  async getById(id) {
    const { data } = await api.get(`/articles/${id}`);
    return data?.data ?? null;
  },
  async search(query) {
    const { data } = await api.get('/articles/search', { params: { query } });
    return data?.data ?? [];
  },
  async create(payload) {
    const { data } = await api.post('/articles', payload);
    return data?.data ?? null;
  },
  async update(id, payload) {
    const { data } = await api.put(`/articles/${id}`, payload);
    return data?.data ?? null;
  },
  async remove(id) {
    const { data } = await api.delete(`/articles/${id}`);
    return data;
  },
};

export default articlesService;
