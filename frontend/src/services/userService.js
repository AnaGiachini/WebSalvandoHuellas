import api from './api';

const userService = {
  async me() {
    // Backend expone POST /users/me protegido
    const { data } = await api.post('/users/me');
    return data; // esperado: { idUsuario, nombre, apellido, email, rol, direccion?, telefono? }
  },
};

export default userService;
