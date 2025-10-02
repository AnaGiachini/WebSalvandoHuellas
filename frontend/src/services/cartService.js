// src/services/cartService.js
import api from './api';

const cartService = {
  async getMyCart() {
    const { data } = await api.get('/carts');
    return data; // { idCarrito, idUsuario, items: [...] }
  },

  async addItem({ idArticulo, cantidad }) {
    const { data } = await api.post('/carts/items', { idArticulo, cantidad });
    window.dispatchEvent(new CustomEvent('cart:updated'));
    return data; // item created/updated
  },

  async updateItem(idItemCarrito, cantidad) {
    const { data } = await api.put(`/carts/items/${idItemCarrito}`, { cantidad });
    window.dispatchEvent(new CustomEvent('cart:updated'));
    return data; // updated item
  },

  async removeItem(idItemCarrito) {
    await api.delete(`/carts/items/${idItemCarrito}`);
    window.dispatchEvent(new CustomEvent('cart:updated'));
  },

  async clearCart() {
    await api.delete('/carts');
    window.dispatchEvent(new CustomEvent('cart:updated'));
  },
};

export default cartService;
