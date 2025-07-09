/**
 * Test: userService
 * --------------------------------------------------------------------------
 * Tests unitarios para el servicio de usuarios.
 *
 *  • Pruebas principales
 *      - Obtención de usuarios (todos, por ID)
 *      - Actualización de datos
 *      - Eliminación de usuarios
 *      - Normalización de datos de usuario
 */

const { 
  getAllUsersService, 
  getUserByIdService, 
  updateUserService, 
  deleteUserService 
} = require('../../src/services/userService');
const db = require("../../src/configs/db");
const Usuario = require('../../src/models/usuario');
const bcrypt = require('bcryptjs');

describe('userService unit tests', () => {
  const testUser = { 
    nombre: 'Juan', 
    apellido: 'Pérez', 
    direccion: 'Calle Test 123',
    telefono: '123456789',
    email: 'juan@example.com', 
    contrasena: bcrypt.hashSync('Clave1234', 10)
  };
  
  let userId;

  beforeAll(() => db.sync({ force: true }));

  beforeEach(async () => {
    await Usuario.destroy({ where: {} });
    const user = await Usuario.create(testUser);
    userId = user.idUsuario;
  });

  it('getAllUsersService obtiene todos los usuarios', async () => {
    const users = await getAllUsersService();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    expect(users[0].email).toBe(testUser.email);
  });

  it('getUserByIdService obtiene un usuario por ID', async () => {
    const user = await getUserByIdService(userId);
    expect(user.nombre).toBe(testUser.nombre);
    expect(user.apellido).toBe(testUser.apellido);
    expect(user.email).toBe(testUser.email);
  });

  it('getUserByIdService lanza error si el usuario no existe', async () => {
    await expect(
      getUserByIdService(9999)
    ).rejects.toHaveProperty('status', 404);
  });

  it('updateUserService actualiza datos de un usuario', async () => {
    const updatedData = { 
      nombre: 'Pedro', 
      direccion: 'Nueva Dirección 456'
    };
    const user = await updateUserService(userId, updatedData);
    expect(user.nombre).toBe(updatedData.nombre);
    expect(user.direccion).toBe(updatedData.direccion);
    // Verificamos que los campos no actualizados permanecen iguales
    expect(user.apellido).toBe(testUser.apellido);
    expect(user.email).toBe(testUser.email);
  });

  it('deleteUserService elimina un usuario', async () => {
    await deleteUserService(userId);
    
    await expect(
      getUserByIdService(userId)
    ).rejects.toHaveProperty('status', 404);

    const userCount = await Usuario.count();
    expect(userCount).toBe(0);
  });
});
