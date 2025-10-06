// src/services/eventsService.js
import api from './api';

export const getEvents = async () => {
  const { data } = await api.get('/events');
  return data?.data || [];
};

export const getEventById = async (id) => {
  const { data } = await api.get(`/events/${id}`);
  return data?.data;
};

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
