/**
 * Test: userAPI
 * --------------------------------------------------------------------------
 * Tests de integración para las rutas de API relacionadas con usuarios.
 *
 *  • Pruebas principales
 *      - Obtención de listado de usuarios (requiere autenticación de admin)
 *      - Obtención de usuario por ID (requiere autenticación de admin)
 *      - Actualización de usuarios (requiere autenticación apropiada)
 *      - Eliminación de usuarios (requiere autenticación de admin)
 *      - Verificación de normalización de datos
 */

const request = require('supertest');
const app = require('../../app');
const Usuario = require('../../src/models/usuario');
const bcrypt = require('bcryptjs');
const { generate } = require('../../src/utils/jwt');
const resetDatabase = require('../../src/utils/resetDatabase.helper');

describe('API de Usuarios', () => {
  let adminToken;
  let userToken;
  let testUserId;
  let adminId;

  const testAdmin = { 
    nombre: 'Admin', 
    apellido: 'Test', 
    email: 'admin@test.com', 
    contrasena: bcrypt.hashSync('Admin1234', 10),
    rol: 'admin'
  };

  const testUser = { 
    nombre: 'Usuario', 
    apellido: 'Test', 
    email: 'usuario@test.com', 
    contrasena: bcrypt.hashSync('User1234', 10)
  };

  // Limpieza y creación de datos antes de cada test
  beforeEach(async () => {
    await resetDatabase();

    const admin = await Usuario.create(testAdmin);
    adminId = admin.idUsuario;
    adminToken = generate({ id: adminId, rol: 'admin' });

    const user = await Usuario.create(testUser);
    testUserId = user.idUsuario;
    userToken = generate({ id: testUserId, rol: 'user' });
  });

  // Test: obtener todos los usuarios
  it('GET /users - Obtiene todos los usuarios (solo admin)', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(1);

    const resNoAuth = await request(app).get('/api/v1/users');
    expect(resNoAuth.statusCode).toBe(401);

    const resUserAuth = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${userToken}`);
    expect(resUserAuth.statusCode).toBe(403);
  });

  // Test: obtener usuario por ID
  it('GET /users/:id - Obtiene un usuario por ID (solo admin)', async () => {
    const res = await request(app)
      .get(`/api/v1/users/${testUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe(testUser.nombre);
    expect(res.body.email).toBe(testUser.email);

    const resNoAuth = await request(app).get(`/api/v1/users/${testUserId}`);
    expect(resNoAuth.statusCode).toBe(401);
  });

  // Test: actualizar usuario (admin o propietario)
  it('PUT /users/:id - Actualiza un usuario (admin o propietario)', async () => {
    const updatedData = {
      nombre: 'Actualizado',
      direccion: 'Dirección de prueba'
    };

    const resAdmin = await request(app)
      .put(`/api/v1/users/${testUserId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updatedData);
    expect(resAdmin.statusCode).toBe(200);
    expect(resAdmin.body.nombre).toBe(updatedData.nombre);

    const resUser = await request(app)
      .put(`/api/v1/users/${testUserId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ nombre: 'Auto Actualizado' });
    expect(resUser.statusCode).toBe(200);
    expect(resUser.body.nombre).toBe('Auto Actualizado');

    const resOtherUser = await request(app)
      .put(`/api/v1/users/${adminId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ nombre: 'Hackeo' });
    expect(resOtherUser.statusCode).toBe(403);
  });

  // Test: eliminar usuario (solo admin)
  it('DELETE /users/:id - Elimina un usuario (solo admin)', async () => {
    const userToDelete = await Usuario.create({
      nombre: 'Eliminar',
      apellido: 'Usuario',
      email: 'delete@test.com',
      contrasena: bcrypt.hashSync('Delete123', 10)
    });

    const res = await request(app)
      .delete(`/api/v1/users/${userToDelete.idUsuario}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(204);

    const checkRes = await request(app)
      .get(`/api/v1/users/${userToDelete.idUsuario}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(checkRes.statusCode).toBe(404);

    const resUser = await request(app)
      .delete(`/api/v1/users/${adminId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(resUser.statusCode).toBe(403);
  });

  // Test: normalización de datos en registro
  it('POST /auth/register - Normaliza los datos del usuario', async () => {
    const newUser = {
      nombre: 'maría',
      apellido: 'GARCÍA',
      email: ' TEST@EXAMPLE.COM ',
      direccion: ' Calle Principal 123 ',
      contrasena: 'Password123'
    };

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(newUser);
    expect(res.statusCode).toBe(201);

    const createdUser = await Usuario.findOne({ where: { email: 'test@example.com' } });
    expect(createdUser).not.toBeNull();
    expect(createdUser.nombre).toBe('María');
    expect(createdUser.apellido).toBe('García');
    expect(createdUser.email).toBe('test@example.com');
    expect(createdUser.direccion).toBe('Calle Principal 123');
  });
});
