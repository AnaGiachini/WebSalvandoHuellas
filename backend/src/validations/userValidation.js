/**
 * Validación: Usuario
 * --------------------------------------------------------------------------
 * Proporciona reglas de validación para operaciones relacionadas con usuarios.
 *
 *  • Campos validados
 *      nombre      → entre 2-50 caracteres
 *      apellido    → entre 2-50 caracteres
 *      email       → formato válido, normalizado a minúsculas
 *      contrasena  → mínimo 8 caracteres, incluye mayúscula, minúscula y número
 *
 *  • Conjuntos de reglas
 *      register      → validaciones para registro de nuevos usuarios
 *      updateProfile → validaciones para actualización de perfil (campos opcionales)
 *
 *  • Notas
 *      – Se utiliza express-validator para definir las reglas
 *      – La normalización garantiza consistencia en los datos almacenados
 */

const { body, param } = require('express-validator');
const { validateRequest } = require('../middlewares/validateRequest');

/* ─── Reglas de campos reutilizables ──────────────────────────────────── */
const name = body('nombre').isString().isLength({ min: 2, max: 50 });
const lastname = body('apellido').isString().isLength({ min: 2, max: 50 });
const email = body('email')
  .trim() // Eliminar espacios antes y después
  .notEmpty()
  .isEmail()
  .normalizeEmail();
const password = body('contrasena').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/);

// Nuevos campos: direccion y telefono (opcionales en update)
const direccion = body('direccion').optional().trim().isLength({ min: 5 }).withMessage('Dirección muy corta');
const telefono = body('telefono')
  .optional()
  .trim()
  .matches(/^[+\d][\d\s-]{6,}$/)
  .withMessage('Teléfono inválido');

/* ─── Conjuntos de reglas exportados ─────────────────────────────────── */
const registerValidation = [name, lastname, email, password, validateRequest];

const updateProfileValidation = [
  name.optional(),
  lastname.optional(),
  email.optional(),
  direccion,
  telefono,
  validateRequest
];

// Admin: crear usuario manualmente
const adminCreateUserValidation = [
  name,
  lastname,
  email,
  password,
  direccion.optional(),
  telefono,
  body('rol').optional().isIn(['user', 'admin']).withMessage('Rol inválido'),
  validateRequest,
];

// Admin: cambiar rol
const changeRoleValidation = [
  param('id').isInt({ min: 1 }),
  body('rol').notEmpty().isIn(['user', 'admin']).withMessage('Rol inválido'),
  validateRequest,
];

module.exports = { registerValidation, updateProfileValidation, adminCreateUserValidation, changeRoleValidation };