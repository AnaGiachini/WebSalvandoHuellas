// src/services/paymentService.js
import api from './api';

const paymentService = {
  async createPreference({ idCarrito }) {
    const { data } = await api.post('/payments/mp/preference', { idCarrito });
    return data; // { init_point, preference_id, compra }
  },
};

export default paymentService;
