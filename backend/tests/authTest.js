const request = require('supertest');
const app = require('../app');
const db = require("../src/configs/db");

describe('Auth: Registro y Login', () => {
  const userTest = {
    nombre: 'Test',
    apellido: 'User',
    email: 'test@example.com',
    contrasena: 'Test1234'
  };

  beforeAll(() => db.sync());

  // beforeAll(async () => {
  //   // Conectamos y limpiamos la tabla de usuarios antes del test
  //   await db.sync({ force: true }); // ¡Atención! borra todo
  // });

  it('Registro exitoso', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(userTest);

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it('Login exitoso', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: userTest.email,
        contrasena: userTest.contrasena
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('Login con datos incorrectos', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: userTest.email,
        contrasena: 'incorrecta'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Credenciales inválidas');
  });

  afterAll(() => db.close());
});
