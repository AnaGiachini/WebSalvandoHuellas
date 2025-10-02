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
};

export default donationService;
