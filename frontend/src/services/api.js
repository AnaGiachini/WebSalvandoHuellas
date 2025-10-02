// src/services/api.js
import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir token de autorización en las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores comunes (401, 403, etc)
let isRedirecting401 = false;
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si hay error 401 (no autorizado), redirigir al login
    if (error.response && error.response.status === 401) {
      const url = error?.config?.url || '';
      // Si el 401 viene de endpoints de pagos (ej: MP sin credenciales), no forzar login
      if (url.includes('/payments/mp/')) {
        return Promise.reject(error);
      }
      try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      } catch {}
      if (!isRedirecting401) {
        isRedirecting401 = true;
        const next = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login?next=${next}`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;