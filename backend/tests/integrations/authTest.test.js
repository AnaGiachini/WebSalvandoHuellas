/**
 * Test: authAPI
 * --------------------------------------------------------------------------
 * Tests de integración para el registro y login de usuarios.
 *
 *  • Pruebas principales
 *      - Registro de usuario y obtención de token
 *      - Login con credenciales válidas
 *      - Login con credenciales inválidas
 */

const request = require('supertest'); 
const app = require('../../app');
const resetDatabase = require('../../src/utils/resetDatabase.helper');

describe('Auth: Registro y Login', () => {
  const userTest = {
    nombre: 'Test',
    apellido: 'User',
    email: 'test@example.com',
    contrasena: 'Test1234'
  };

  // Limpieza total antes de cada test
  beforeEach(async () => {
    await resetDatabase();
  });

  // Test: registro exitoso
  it('Registro exitoso', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(userTest);

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  // Test: login exitoso
  it('Login exitoso', async () => {
    // Registramos al usuario primero
    await request(app)
      .post('/api/v1/auth/register')
      .send(userTest);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: userTest.email,
        contrasena: userTest.contrasena
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  // Test: login con datos incorrectos
  it('Login con datos incorrectos', async () => {
    // Registramos al usuario primero
    await request(app)
      .post('/api/v1/auth/register')
      .send(userTest);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: userTest.email,
        contrasena: 'incorrecta'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Credenciales inválidas');
  });
});
