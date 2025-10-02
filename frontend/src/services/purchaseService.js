// src/services/purchaseService.js
import api from './api';

const purchaseService = {
  async createFromCart({ idCarrito, metodoPago } = {}) {
    const { data } = await api.post('/purchases', { idCarrito, metodoPago });
    return data; // purchase object
  },

  async getById(idCompra) {
    const { data } = await api.get(`/purchases/${idCompra}`);
    return data;
  },

  async getMine() {
    const { data } = await api.get('/purchases');
    return data; // list of purchases
  },

  async updateStatus(idCompra, estadoPago) {
    const { data } = await api.put(`/purchases/${idCompra}/status`, { estadoPago });
    return data;
  }
};

export default purchaseService;
