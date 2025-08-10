/**
 * Test: authService
 * --------------------------------------------------------------------------
 * Tests unitarios para el servicio de autenticación.
 *
 *  • Pruebas principales
 *      - Registro de usuario y generación de token
 *      - Login con credenciales válidas
 *      - Manejo de login con contraseña incorrecta
 */

const { registerService, loginService } = require('../../src/services/authService');
const Usuario = require('../../src/models/usuario');
const resetDatabase = require('../../src/utils/resetDatabase.helper');

describe('authService unit tests', () => {
  // Datos de prueba
  const data = { 
    nombre: 'Ana', 
    apellido: 'Test', 
    email: 'uni@example.com', 
    contrasena: 'Abc12345' 
  };

  // Limpieza total antes de cada test
  beforeEach(async () => {
    await resetDatabase();
  });

  // Test: Registro de usuario
  it('registerService crea usuario y devuelve token', async () => {
    const token = await registerService(data);
    expect(typeof token).toBe('string');

    const user = await Usuario.findOne({ where: { email: data.email } });
    expect(user).not.toBeNull();
    expect(user.email).toBe(data.email);
  });

  // Test: Login correcto
  it('loginService devuelve token con credenciales válidas', async () => {
    await registerService(data);
    const token = await loginService({ email: data.email, contrasena: data.contrasena });
    expect(typeof token).toBe('string');
  });

  // Test: Login con contraseña incorrecta
  it('loginService lanza error con contraseña incorrecta', async () => {
    await registerService(data);
    await expect(
      loginService({ email: data.email, contrasena: 'mala123' })
    ).rejects.toHaveProperty('status', 401);
  });
});
