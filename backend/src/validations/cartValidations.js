/**
 * Validaciones: Carrito
 * --------------------------------------------------------------------------
 * Define las reglas de validación para operaciones relacionadas con el carrito.
 * Utiliza express-validator para validar datos de entrada.
 */

const { body, param } = require('express-validator');
const { validateRequest } = require('../middlewares/validateRequest');

/**
 * Valida los datos al añadir un artículo al carrito
 */
const validateAddItem = [
  body('idArticulo')
    .notEmpty().withMessage('El ID del artículo es obligatorio')
    .isInt({ min: 1 }).withMessage('El ID del artículo debe ser un número entero positivo'),
  
  body('cantidad')
    .notEmpty().withMessage('La cantidad es obligatoria')
    .isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor a cero'),
  
  validateRequest
];

/**
 * Valida los datos al actualizar la cantidad de un artículo en el carrito
 */
const validateUpdateItem = [
  param('idItemCarrito')
    .notEmpty().withMessage('El ID del ítem es obligatorio')
    .isInt({ min: 1 }).withMessage('El ID del ítem debe ser un número entero positivo'),
  
  body('cantidad')
    .notEmpty().withMessage('La cantidad es obligatoria')
    .isInt({ min: 0 }).withMessage('La cantidad debe ser un número entero no negativo'),
  
  validateRequest
];

module.exports = {
  validateAddItem,
  validateUpdateItem
};
