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
const jwtUtil = require('../utils/jwt');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const mailService = require('../services/mailService');

// Tiempo de expiración del token de reseteo
const RESET_TOKEN_TTL = process.env.RESET_TOKEN_TTL || '15m';

/**
 * UC01: Registrar usuario
 * --------------------------------------------------------------------------
 * Recibe los datos del formulario de registro, delega la lógica de creación
 * al servicio de autenticación y devuelve un token JWT.
 *
 *  • Request body esperado
 *      { nombre, apellido, email, contrasena }
 *
 *  • Respuestas
 *      201 → Usuario creado y token de acceso generado
 *      4xx/5xx → Errores manejados por middlewares de validación y error global
 *
 * @param {Object} req - Objeto de solicitud Express con datos en body
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const register = async (req, res, next) => {
  try {
    const { token, user } = await registerService(req.body);
    res.status(201).json({ token, user });
  } catch (err) { next(err); }
};

/**
 * UC02: Iniciar sesión
 * --------------------------------------------------------------------------
 * Verifica las credenciales del usuario y, si son válidas, devuelve un
 * token JWT de acceso junto con datos básicos del usuario.
 *
 *  • Request body esperado
 *      { email, contrasena }
 *
 *  • Respuestas
 *      200 → Credenciales válidas, se devuelve { token, user }
 *      401 → Credenciales inválidas (mensaje genérico)
 *      4xx/5xx → Otros errores manejados por middlewares
 *
 * @param {Object} req - Objeto de solicitud Express con credenciales en body
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const login = async (req, res, next) => {
  try {
    const { token, user } = await loginService(req.body);
    res.json({ token, user });
  } catch (err) { next(err); }
};

/**
 * Callback para OAuth (Google/Facebook)
 * - Genera un JWT a partir del usuario autenticado por Passport
 * - Redirige al FRONT_URL con el token como query param
 */
const socialCallback = async (req, res) => {
  try {
    const FRONT_URL = process.env.FRONT_URL || 'http://localhost:3000';
    const user = req.user;
    if (!user) {
      return res.redirect(302, `${FRONT_URL}/login?error=oauth`);
    }

    const token = jwtUtil.generate({ idUsuario: user.idUsuario, rol: user.rol });
    const redirectUrl = `${FRONT_URL}/auth/callback?token=${encodeURIComponent(token)}`;
    return res.redirect(302, redirectUrl);
  } catch (err) {
    const FRONT_URL = process.env.FRONT_URL || 'http://localhost:3000';
    return res.redirect(302, `${FRONT_URL}/login?error=oauth`);
  }
};

/**
 * Inicia el flujo de "Olvidaste tu contraseña"
 * Refactor: estructura con early-returns y ramas explícitas para SMTP/no SMTP.
 * - Justificación: reduce nesting, facilita lectura y pruebas guiadas por los tests de integración.
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const FRONT_URL = process.env.FRONT_URL || 'http://localhost:3000';

    // Buscamos usuario; respuesta es la misma exista o no para no filtrar información
    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      // Seguridad: mismo mensaje para evitar enumeración de usuarios
      return res.json({ message: 'Si el email existe, se envió un enlace para restablecer la contraseña.' });
    }

    // Generamos token corto y link de reseteo
    const token = jwtUtil.generateWithExpiry(
      { idUsuario: user.idUsuario, rol: user.rol, purpose: 'reset' },
      RESET_TOKEN_TTL
    );
    const resetLink = `${FRONT_URL}/auth/reset?token=${encodeURIComponent(token)}`;

    const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
    const smtpEnabled = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

    if (smtpEnabled) {
      // Camino principal en prod: enviamos email y no devolvemos el link
      await mailService.sendPasswordReset(email, resetLink);
      return res.json({ message: 'Si el email existe, se envió un enlace para restablecer la contraseña.' });
    }

    // Camino de desarrollo: devolvemos el link para facilitar pruebas E2E
    console.log(`[Password Reset][DEV] Enviar a ${email}: ${resetLink}`);
    return res.json({ message: 'Enlace de restablecimiento generado (modo desarrollo).', resetLink });
  } catch (err) {
    // Delegamos manejo a middleware centralizado
    return next(err);
  }
};

/**
 * Completa el reseteo de contraseña
 * - Recibe token y nueva contraseña
 * - Verifica token y actualiza el hash de la contraseña
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, nuevaContrasena } = req.body;
    if (!token || !nuevaContrasena) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    const decoded = jwtUtil.verify(token);
    if (!decoded || decoded.purpose !== 'reset') {
      return res.status(400).json({ message: 'Token inválido' });
    }

    const user = await Usuario.findByPk(decoded.idUsuario);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const hash = await bcrypt.hash(nuevaContrasena, 10);
    user.contrasena = hash;
    await user.save();

    return res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (err) {
    // Si el token expiró o es inválido, caerá aquí
    return res.status(400).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = { register, login, socialCallback, forgotPassword, resetPassword };
