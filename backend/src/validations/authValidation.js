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
 *
 *  • Notas
 *      – La normalización del email garantiza consistencia en la autenticación
 *      – Para el login solo se verifica la longitud mínima de la contraseña
 */

const { body } = require('express-validator');
const { validateRequest } = require('../middlewares/validateRequest');

/**
 * Validación de email: no vacío, formato correcto y normalizado
 */
const email = body('email').notEmpty().isEmail().normalizeEmail();

/**
 * Validación de contraseña: mínimo 8 caracteres
 */
const password = body('contrasena').isLength({ min: 8 });

/**
 * Reglas de validación para inicio de sesión
 */
const loginValidation = [email, password, validateRequest];

module.exports = { loginValidation };