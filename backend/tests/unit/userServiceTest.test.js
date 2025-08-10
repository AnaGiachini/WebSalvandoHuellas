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

const Usuario = require('../../src/models/usuario');
const bcrypt = require('bcryptjs');
const resetDatabase = require('../../src/utils/resetDatabase.helper');

describe('userService unit tests', () => {
  // Datos base del usuario
  const testUser = { 
    nombre: 'Juan', 
    apellido: 'Pérez', 
    direccion: 'Calle Test 123',
    telefono: '123456789',
    email: 'juan@example.com', 
    contrasena: bcrypt.hashSync('Clave1234', 10)
  };
  
  let userId;

  // Limpieza total antes de cada test
  beforeEach(async () => {
    await resetDatabase();
    const user = await Usuario.create(testUser);
    userId = user.idUsuario;
  });

  // Test: obtener todos los usuarios
  it('getAllUsersService obtiene todos los usuarios', async () => {
    const users = await getAllUsersService();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    expect(users.some(user => user.email === testUser.email)).toBe(true);
  });

  // Test: obtener usuario por ID
  it('getUserByIdService obtiene un usuario por ID', async () => {
    const user = await getUserByIdService(userId);
    expect(user.nombre).toBe(testUser.nombre);
    expect(user.apellido).toBe(testUser.apellido);
    expect(user.email).toBe(testUser.email);
  });

  // Test: error si el usuario no existe
  it('getUserByIdService lanza error si el usuario no existe', async () => {
    await expect(
      getUserByIdService(9999)
    ).rejects.toHaveProperty('status', 404);
  });

  // Test: actualizar usuario
  it('updateUserService actualiza datos de un usuario', async () => {
    const updatedData = { 
      nombre: 'Pedro', 
      direccion: 'Nueva Dirección 456'
    };
    const user = await updateUserService(userId, updatedData);
    expect(user.nombre).toBe(updatedData.nombre);
    expect(user.direccion).toBe(updatedData.direccion);
    expect(user.apellido).toBe(testUser.apellido); // no fue actualizado
    expect(user.email).toBe(testUser.email); // no fue actualizado
  });

  // Test: eliminar usuario
  it('deleteUserService elimina un usuario', async () => {
    await deleteUserService(userId);
    
    await expect(
      getUserByIdService(userId)
    ).rejects.toHaveProperty('status', 404);

    const deletedUser = await Usuario.findByPk(userId);
    expect(deletedUser).toBeNull();
  });
});
