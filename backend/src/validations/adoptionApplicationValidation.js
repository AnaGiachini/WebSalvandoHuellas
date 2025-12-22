/**
 * Validación: adoptionApplication
 * --------------------------------------------------------------------------
 * Proporciona reglas de validación para operaciones relacionadas con solicitudes de adopción.
 *
 *  • Campos validados
 *      idAnimal          → debe ser un entero positivo
 *      nombre, apellido  → requeridos, entre 2-50 caracteres
 *      email             → requerido, formato válido
 *      telefono          → requerido, mínimo 7 caracteres
 *      direccion         → requerida, mínimo 5 caracteres
 *      experienciaPrevia → opcional
 *      motivacion        → opcional
 *      estado            → debe ser 'pendiente', 'aprobada' o 'rechazada'
 *
 *  • Conjuntos de reglas
 *      createAdoptionApplicationValidation → validaciones para crear solicitudes de adopción
 *      updateAdoptionApplicationValidation    → validaciones para actualizar el estado de una solicitud
 *
 *  • Notas
 *      – Se utiliza express-validator para definir las reglas
 *      – Las validaciones aseguran la integridad de los datos
 */

const { body } = require('express-validator');
const { validateRequest } = require('../middlewares/validateRequest');

/* ─── Reglas de campos reutilizables ──────────────────────────── */
const idAnimal = body('idAnimal')
  .isInt({ min: 1 })
  .withMessage('El ID de animal debe ser un número entero positivo');

const nombre = body('nombre')
  .trim()
  .isLength({ min: 2, max: 50 })
  .withMessage('El nombre debe tener entre 2 y 50 caracteres');

const apellido = body('apellido')
  .trim()
  .isLength({ min: 2, max: 50 })
  .withMessage('El apellido debe tener entre 2 y 50 caracteres');

const email = body('email')
  .trim()
  .isEmail()
  .withMessage('Debe proporcionar un email válido')
  .isLength({ max: 100 })
  .withMessage('El email no puede exceder 100 caracteres');

const telefono = body('telefono')
  .trim()
  .isLength({ min: 7, max: 20 })
  .withMessage('El teléfono debe tener entre 7 y 20 caracteres');

const direccion = body('direccion')
  .trim()
  .isLength({ min: 5, max: 200 })
  .withMessage('La dirección debe tener entre 5 y 200 caracteres');

const experienciaPrevia = body('experienciaPrevia')
  .optional()
  .trim();

const motivacion = body('motivacion')
  .optional()
  .trim();

const estado = body('estado')
  .isIn(['pendiente', 'aprobada', 'rechazada'])
  .withMessage('El estado debe ser uno de los siguientes valores: pendiente, aprobada, rechazada');

/* ─── Conjuntos de reglas exportados ─────────────────────── */
// UC05: completar formulario de adopción
// Estas reglas se aplican al endpoint POST /adoptions antes de crear la solicitud.
const createAdoptionApplicationValidation = [
  idAnimal,
  nombre,
  apellido,
  email,
  telefono,
  direccion,
  experienciaPrevia,
  motivacion,
  validateRequest
];

const updateAdoptionApplicationValidation = [
  estado,
  validateRequest
];

module.exports = { createAdoptionApplicationValidation, updateAdoptionApplicationValidation };
