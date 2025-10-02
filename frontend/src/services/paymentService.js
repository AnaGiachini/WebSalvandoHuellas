// src/services/paymentService.js
import api from './api';

const paymentService = {
  async createPreference({ idCarrito }) {
    const { data } = await api.post('/payments/mp/preference', { idCarrito });
    return data; // { init_point, preference_id, compra }
  },

  async createDonationPreference({ monto }) {
    const { data } = await api.post('/payments/mp/donations/preference', { monto });
    return data; // { init_point, preference_id, donacion }
  },
};

export default paymentService;
