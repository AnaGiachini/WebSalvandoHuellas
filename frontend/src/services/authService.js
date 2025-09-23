// src/services/authService.js
import api from './api';

const base = '/auth'; // Mounted under /api/v1 in backend app.js

export const authService = {
  async login({ email, password }) {
    // Backend espera 'contrasena'
    const body = { email, contrasena: password };
    const { data } = await api.post(`${base}/login`, body);
    return data; // expected: { token, user } or similar
  },

  async register(payload) {
    // Backend espera: { nombre, apellido, email, contrasena }
    const body = {
      nombre: payload.name ?? payload.nombre,
      apellido: payload.lastName ?? payload.apellido,
      email: payload.email,
      contrasena: payload.password ?? payload.contrasena,
    };
    const { data } = await api.post(`${base}/register`, body);
    return data; // expected: { token, user } or similar
  },

  async refresh() {
    const { data } = await api.post(`${base}/refresh`);
    return data;
  },

  async me() {
    const { data } = await api.get(`${base}/me`);
    return data;
  },

  async forgotPassword(email) {
    const { data } = await api.post(`${base}/forgot-password`, { email });
    return data; // { message, resetLink? }
  },

  async resetPassword({ token, nuevaContrasena }) {
    const { data } = await api.post(`${base}/reset-password`, { token, nuevaContrasena });
    return data; // { message }
  }
};

export default authService;
