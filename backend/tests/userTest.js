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
const app = require('../app');
const db = require("../src/configs/db");
const Usuario = require('../src/models/usuario');
const bcrypt = require('bcryptjs');
const { generate } = require('../src/utils/jwt');

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
  
  beforeAll(async () => {
    await db.sync();
    
    // Limpiamos la tabla antes de pruebas
    await Usuario.destroy({ where: {} });
    
    // Creamos un admin y un usuario regular para pruebas
    const admin = await Usuario.create(testAdmin);
    adminId = admin.idUsuario;
    adminToken = generate({ id: adminId, rol: 'admin' });
    
    const user = await Usuario.create(testUser);
    testUserId = user.idUsuario;
    userToken = generate({ id: testUserId, rol: 'user' });
  });

  it('GET /users - Obtiene todos los usuarios (solo admin)', async () => {
    // Con token admin
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`);
      
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(1); // Al menos admin y usuario regular
    
    // Sin token debe dar error
    const resNoAuth = await request(app)
      .get('/api/v1/users');
      
    expect(resNoAuth.statusCode).toBe(401);
    
    // Con token de usuario normal debe dar error
    const resUserAuth = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${userToken}`);
      
    expect(resUserAuth.statusCode).toBe(403);
  });
  
  it('GET /users/:id - Obtiene un usuario por ID (solo admin)', async () => {
    // Con token admin
    const res = await request(app)
      .get(`/api/v1/users/${testUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);
      
    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe(testUser.nombre);
    expect(res.body.email).toBe(testUser.email);
    
    // Sin token debe dar error
    const resNoAuth = await request(app)
      .get(`/api/v1/users/${testUserId}`);
      
    expect(resNoAuth.statusCode).toBe(401);
  });
  
  it('PUT /users/:id - Actualiza un usuario (admin o propietario)', async () => {
    const updatedData = { 
      nombre: 'Actualizado', 
      direccion: 'Dirección de prueba' 
    };
    
    // Admin puede actualizar cualquier usuario
    const resAdmin = await request(app)
      .put(`/api/v1/users/${testUserId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updatedData);
      
    expect(resAdmin.statusCode).toBe(200);
    expect(resAdmin.body.nombre).toBe(updatedData.nombre);
    
    // Usuario puede actualizar su propio perfil
    const resUser = await request(app)
      .put(`/api/v1/users/${testUserId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ nombre: 'Auto Actualizado' });
      
    expect(resUser.statusCode).toBe(200);
    expect(resUser.body.nombre).toBe('Auto Actualizado');
    
    // Usuario no puede actualizar otros perfiles
    const resOtherUser = await request(app)
      .put(`/api/v1/users/${adminId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ nombre: 'Hackeo' });
      
    expect(resOtherUser.statusCode).toBe(403);
  });
  
  it('DELETE /users/:id - Elimina un usuario (solo admin)', async () => {
    // Primero creamos un usuario para eliminar
    const userToDelete = await Usuario.create({
      nombre: 'Eliminar',
      apellido: 'Usuario',
      email: 'delete@test.com',
      contrasena: bcrypt.hashSync('Delete123', 10)
    });
    
    // Admin puede eliminar usuarios
    const res = await request(app)
      .delete(`/api/v1/users/${userToDelete.idUsuario}`)
      .set('Authorization', `Bearer ${adminToken}`);
      
    expect(res.statusCode).toBe(204);
    
    // Verificamos que ya no existe
    const checkRes = await request(app)
      .get(`/api/v1/users/${userToDelete.idUsuario}`)
      .set('Authorization', `Bearer ${adminToken}`);
      
    expect(checkRes.statusCode).toBe(404);
    
    // Usuario normal no puede eliminar usuarios
    const resUser = await request(app)
      .delete(`/api/v1/users/${adminId}`)
      .set('Authorization', `Bearer ${userToken}`);
      
    expect(resUser.statusCode).toBe(403);
  });
  
  // Test para verificar la normalización de datos en el registro
  it('POST /auth/register - Normaliza los datos del usuario', async () => {
    const newUser = {
      nombre: 'maría', // minúscula
      apellido: 'GARCÍA', // mayúscula
      email: ' TEST@EXAMPLE.COM ', // con espacios y mayúsculas
      direccion: ' Calle Principal 123 ', // con espacios al inicio y final
      contrasena: 'Password123'
    };
    
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(newUser);
      
    expect(res.statusCode).toBe(201);
    
    // Buscamos el usuario creado en la base de datos
    const createdUser = await Usuario.findOne({ 
      where: { email: 'test@example.com' } 
    });
    
    // Verificamos la normalización de datos
    expect(createdUser).not.toBeNull();
    expect(createdUser.nombre).toBe('María'); // Primera letra mayúscula, resto minúscula
    expect(createdUser.apellido).toBe('García'); // Primera letra mayúscula, resto minúscula
    expect(createdUser.email).toBe('test@example.com'); // Todo en minúsculas
    expect(createdUser.direccion).toBe('Calle Principal 123'); // Sin espacios al inicio/final
  });

  afterAll(() => db.close());
});
