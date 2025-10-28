// src/services/donationService.js
import api from './api';

const donationService = {
  async createTransfer({ monto }) {
    const { data } = await api.post('/donations/transfer', { monto });
    return data; // Donación creada en pendiente
  },

  async myDonations() {
    const { data } = await api.get('/donations/mine');
    return data; // Lista de donaciones del usuario
  },

  // Admin: Listar todas las donaciones
  async listAll() {
    const { data } = await api.get('/donations');
    return data;
  },

  // Admin: Actualizar estado de donación
  async updateStatus(idDonacion, estadoPago) {
    const { data } = await api.patch(`/donations/${idDonacion}/status`, { estadoPago });
    return data;
  },
};

export default donationService;
