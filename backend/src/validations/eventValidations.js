/**
 * Validaciones: Evento
 * --------------------------------------------------------------------------
 * Reglas de validación para creación y consulta de eventos.
 */

const { body, param } = require('express-validator');
const { validateRequest } = require('../middlewares/validateRequest');

// Crear evento
const validateCreateEvent = [
  body('titulo')
    .notEmpty().withMessage('El título es obligatorio')
    .isString().withMessage('El título debe ser texto')
    .isLength({ min: 2, max: 100 }).withMessage('El título debe tener entre 2 y 100 caracteres'),

  body('descripcion')
    .optional()
    .isString().withMessage('La descripción debe ser texto'),

  body('fecha')
    .notEmpty().withMessage('La fecha es obligatoria')
    .isISO8601().withMessage('La fecha debe tener formato válido'),

  body('lugar')
    .optional()
    .isString().withMessage('El lugar debe ser texto')
    .isLength({ max: 120 }).withMessage('El lugar no puede superar 120 caracteres'),

  body('foto')
    .optional()
    .isString().withMessage('La ruta de la foto debe ser texto'),

  validateRequest
];

// Validar ID
const validateEventId = [
  param('id')
    .notEmpty().withMessage('El ID del evento es obligatorio')
    .isInt({ min: 1 }).withMessage('El ID del evento debe ser un entero positivo'),
  validateRequest
];

// Actualizar evento (ID + body opcionalmente parcial)
const validateUpdateEvent = [
  param('id')
    .notEmpty().withMessage('El ID del evento es obligatorio')
    .isInt({ min: 1 }).withMessage('El ID del evento debe ser un entero positivo'),

  body('titulo').optional().isString().isLength({ min: 2, max: 100 }),
  body('descripcion').optional().isString(),
  body('fecha').optional().isISO8601(),
  body('lugar').optional().isString().isLength({ max: 120 }),
  body('foto').optional().isString(),

  validateRequest
];

// Eliminar evento por ID
const validateDeleteEvent = [
  param('id')
    .notEmpty().withMessage('El ID del evento es obligatorio')
    .isInt({ min: 1 }).withMessage('El ID del evento debe ser un entero positivo'),
  validateRequest
];

module.exports = { validateCreateEvent, validateEventId, validateUpdateEvent, validateDeleteEvent };
