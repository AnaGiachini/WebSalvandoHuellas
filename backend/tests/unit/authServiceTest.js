const { registerService, loginService } = require('../../src/services/authService');
const db = require("../../src/configs/db");
const Usuario = require('../../src/models/usuario');

describe('authService unit tests', () => {
  const data = { nombre: 'Ana', apellido: 'Test', email: 'uni@example.com', contrasena: 'Abc12345' };

  beforeAll(() => db.sync({ force: true }));

  it('registerService crea usuario y devuelve token', async () => {
    const token = await registerService(data);
    expect(typeof token).toBe('string');
    const user = await Usuario.findOne({ where: { email: data.email } });
    expect(user).not.toBeNull();
  });

  it('loginService devuelve token con credenciales válidas', async () => {
    const token = await loginService({ email: data.email, contrasena: data.contrasena });
    expect(typeof token).toBe('string');
  });

  it('loginService lanza error con contraseña incorrecta', async () => {
    await expect(
      loginService({ email: data.email, contrasena: 'mala123' })
    ).rejects.toHaveProperty('status', 401);
  });

  afterAll(async () => {
    await db.close();
  });
});
