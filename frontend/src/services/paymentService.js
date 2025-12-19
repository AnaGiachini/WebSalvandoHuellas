// src/services/paymentService.js
import api from './api';

/**
 * Servicio: paymentService (Mercado Pago)
 * --------------------------------------------------------------------------
 * Encapsula las llamadas del frontend a los endpoints de pagos.
 *
 *  • UC03: Realizar compra con Mercado Pago
 *      - createPreference({ idCarrito }) → POST /payments/mp/preference
 *
 *  • Donaciones
 *      - createDonationPreference({ monto }) → POST /payments/mp/donations/preference
 */
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
