// ---------------------------------------------------------------------------
// Servicio de frontend para la gestión de usuarios.
//
//  • UC07: Gestión de usuarios (perfil y panel admin)
//      - me()           → POST /users/me
//      - update(id, ..) → PUT /users/:id
//      - listAll()      → GET /users (solo admin)
//      - adminCreate()  → POST /users (solo admin)
//      - changeRole()   → PATCH /users/:id/role (solo admin)
//      - remove()       → DELETE /users/:id (solo admin)
// ---------------------------------------------------------------------------
import api from './api';

const userService = {
  async me() {
    // Backend expone POST /users/me protegido
    const { data } = await api.post('/users/me');
    return data; // esperado: { idUsuario, nombre, apellido, email, rol, direccion?, telefono? }
  },
  async update(id, payload) {
    const { data } = await api.put(`/users/${id}`, payload);
    return data;
  },
  // UC07: Admin
  async listAll() {
    const { data } = await api.get('/users');
    return data;
  },
  async getById(id) {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },
  async adminCreate(payload) {
    const { data } = await api.post('/users', payload);
    return data;
  },
  async changeRole(id, rol) {
    const { data } = await api.patch(`/users/${id}/role`, { rol });
    return data;
  },
  async remove(id) {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },
};

export default userService;
