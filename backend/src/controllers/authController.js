/**
 * Controlador: Autenticación
 * --------------------------------------------------------------------------
 * Gestiona las rutas de la API relacionadas con registro e inicio de sesión.
 *
 *  • Operaciones principales
 *      register → registro de nuevos usuarios en el sistema
 *      login    → inicio de sesión con email y contraseña
 *
 *  • Respuestas HTTP
 *      201 → Usuario creado exitosamente (Created)
 *      200 → Inicio de sesión exitoso (OK)
 *      401 → Credenciales inválidas (Unauthorized)
 *      4xx/5xx → Otros errores (manejados por errorMiddleware)
 *
 *  • Estructura de respuesta
 *      { token } → Token JWT para autenticación posterior
 */

const { registerService, loginService } = require('../services/authService');

/**
 * Registra un nuevo usuario en el sistema
 * @param {Object} req - Objeto de solicitud Express con datos en body
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const register = async (req, res, next) => {
  try {
    const token = await registerService(req.body);
    res.status(201).json({ token });
  } catch (err) { next(err); }
};

/**
 * Valida credenciales y genera token de acceso
 * @param {Object} req - Objeto de solicitud Express con credenciales en body
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const login = async (req, res, next) => {
  try {
    const token = await loginService(req.body);
    res.json({ token });
  } catch (err) { next(err); }
};

module.exports = { register, login };
