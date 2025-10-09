// src/services/ordersService.js
import api from './api';

const ordersService = {
  // Admin: lista todas las compras con ?all=1 (requiere rol admin)
  async listAll() {
    const { data } = await api.get('/purchases', { params: { all: 1 } });
    return data;
  },
  async getById(idCompra) {
    const { data } = await api.get(`/purchases/${idCompra}`);
    return data;
  },
  async updateStatus(idCompra, estadoPago) {
    const { data } = await api.put(`/purchases/${idCompra}/status`, { estadoPago });
    return data;
  },
};

export default ordersService;
