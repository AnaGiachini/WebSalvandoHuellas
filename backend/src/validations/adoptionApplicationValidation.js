/**
 * Validación: adoptionApplication
 * --------------------------------------------------------------------------
 * Proporciona reglas de validación para operaciones relacionadas con solicitudes de adopción.
 *
 *  • Campos validados
 *      idAnimal      → debe ser un entero positivo
 *      estado        → debe ser 'pendiente', 'aprobada' o 'rechazada'
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

/* ─── Reglas de campos reutilizables ──────────────────────────────────── */
const idAnimal = body('idAnimal')
  .isInt({ min: 1 })
  .withMessage('El ID de animal debe ser un número entero positivo');

const estado = body('estado')
  .isIn(['pendiente', 'aprobada', 'rechazada'])
  .withMessage('El estado debe ser uno de los siguientes valores: pendiente, aprobada, rechazada');

/* ─── Conjuntos de reglas exportados ─────────────────────────────────── */
const createAdoptionApplicationValidation = [
  idAnimal,
  validateRequest
];

const updateAdoptionApplicationValidation = [
  estado,
  validateRequest
];

module.exports = { createAdoptionApplicationValidation, updateAdoptionApplicationValidation };
