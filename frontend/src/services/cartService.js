// src/services/cartService.js
import api from './api';

const cartService = {
  async getMyCart() {
    const { data } = await api.get('/carts');
    return data; // { idCarrito, idUsuario, items: [...] }
  },

  async addItem({ idArticulo, cantidad }) {
    const { data } = await api.post('/carts/items', { idArticulo, cantidad });
    return data; // item created/updated
  },

  async updateItem(idItemCarrito, cantidad) {
    const { data } = await api.put(`/carts/items/${idItemCarrito}`, { cantidad });
    return data; // updated item
  },

  async removeItem(idItemCarrito) {
    await api.delete(`/carts/items/${idItemCarrito}`);
  },

  async clearCart() {
    await api.delete('/carts');
  },
};

export default cartService;
