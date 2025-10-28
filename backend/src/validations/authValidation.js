/**
 * Validación: Autenticación
 * --------------------------------------------------------------------------
 * Proporciona reglas de validación para operaciones de autenticación.
 *
 *  • Campos validados
 *      email       → formato válido, normalizado a minúsculas
 *      contrasena  → mínimo 8 caracteres
 *
 *  • Conjuntos de reglas
 *      login → validaciones para inicio de sesión
 */

const { body } = require('express-validator');

/**
 * Validación de email: no vacío, formato correcto y normalizado
 */
const email = body('email')
  .notEmpty().withMessage('El correo electrónico es requerido')
  .isEmail().withMessage('Correo electrónico inválido')
  .normalizeEmail();

/**
 * Validación de contraseña: mínimo 8 caracteres
 */
const password = body('contrasena')
  .notEmpty().withMessage('La contraseña es requerida')
  .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres');

/**
 * Reglas de validación para inicio de sesión
 * (El middleware validateRequest se agrega en las rutas)
 */
const loginValidation = [email, password];

/**
 * Validación para "olvidaste tu contraseña"
 */
const forgotPasswordValidation = [email];

/**
 * Validación para "resetear contraseña"
 */
const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Token requerido'),
  body('nuevaContrasena').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
];

module.exports = { loginValidation, forgotPasswordValidation, resetPasswordValidation };