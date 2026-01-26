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
const name = body('nombre')
  .trim()
  .isString().withMessage('El nombre debe ser un texto')
  .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres');
const lastname = body('apellido')
  .trim()
  .isString().withMessage('El apellido debe ser un texto')
  .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres');
const email = body('email')
  .trim() // Eliminar espacios antes y después
  .isEmail().withMessage('Correo electrónico inválido')
  .normalizeEmail();
const password = body('contrasena')
  .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe incluir mayúscula, minúscula y número');

// Nuevos campos: direccion y telefono (opcionales en update)
const direccion = body('direccion')
  .trim()
  .optional({ checkFalsy: true, nullable: true })
  .isLength({ min: 5 })
  .withMessage('Dirección muy corta');
const telefono = body('telefono')
  .trim()
  .optional({ checkFalsy: true, nullable: true })
  .matches(/^[+\d][\d\s-]{6,}$/)
  .withMessage('Teléfono inválido');

/* ─── Conjuntos de reglas exportados ─────────────────────────────────── */
/**
 * Conjunto de reglas: registerValidation
 * --------------------------------------------------------------------------
 * Valida los campos requeridos para UC01 (registro de usuario).
 * Se asegura de que nombre, apellido, email y contraseña cumplan las
 * restricciones mínimas antes de llegar al controlador.
 */
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