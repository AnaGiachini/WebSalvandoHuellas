// src/services/eventsService.js
// ---------------------------------------------------------------------------
// Servicio de frontend para consumir la API de eventos.
//
//  • Casos de uso
//      - UC04: Crear evento (alta desde el panel de administración)
//      - Listar y consultar eventos públicos para mostrarlos en la web.
import api from './api';

export const getEvents = async () => {
  const { data } = await api.get('/events');
  return data?.data || [];
};

export const getEventById = async (id) => {
  const { data } = await api.get(`/events/${id}`);
  return data?.data;
};

/**
 * Crea un evento (UC04)
 * ---------------------------------------------------------------------------
 * Envía al backend los datos completos del formulario de evento. Se espera
 * que el usuario actual tenga rol de administrador, ya que la ruta está
 * protegida en el backend.
 */
export const createEvent = async (payload) => {
  const { data } = await api.post('/events', payload);
  return data?.data;
};

export const updateEvent = async (id, payload) => {
  const { data } = await api.put(`/events/${id}`, payload);
  return data?.data;
};

export const deleteEvent = async (id) => {
  const { data } = await api.delete(`/events/${id}`);
  return data;
};
