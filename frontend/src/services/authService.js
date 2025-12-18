// src/services/authService.js
import api from './api';

const base = '/auth'; // Mounted under /api/v1 in backend app.js

export const authService = {
  /**
   * UC02: Inicio de sesión (cliente → API)
   * --------------------------------------------------------------------------
   * Envía las credenciales al endpoint /auth/login adaptando el nombre de
   * campo 'password' del frontend al 'contrasena' esperado por el backend.
   *
   * @param {{ email: string, password: string }} payload
   * @returns {Promise<{ token: string, user?: Object }>} Respuesta del backend
   */
  async login({ email, password }) {
    // Backend espera 'contrasena'
    const body = { email, contrasena: password };
    const { data } = await api.post(`${base}/login`, body);
    return data; // expected: { token, user } or similar
  },

  /**
   * UC01: Registro de usuario (cliente → API)
   * --------------------------------------------------------------------------
   * Adapta la estructura de datos del formulario de frontend al formato
   * esperado por el backend.
   *
   *  • Entrada (desde RegisterPage)
   *      { name, lastName, email, password }
   *
   *  • Request al backend
   *      { nombre, apellido, email, contrasena }
   */
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
