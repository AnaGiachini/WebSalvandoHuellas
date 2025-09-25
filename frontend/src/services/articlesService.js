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
  }
};

export default articlesService;
