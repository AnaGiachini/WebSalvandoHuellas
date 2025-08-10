/**
 * Validaciones: Compra
 * --------------------------------------------------------------------------
 * Define las reglas de validación para operaciones relacionadas con las compras.
 * Utiliza express-validator para validar datos de entrada.
 */

const { body, param } = require('express-validator');
const { validateRequest } = require('../middlewares/validateRequest');

/**
 * Valida los datos al crear una nueva compra
 */
const validateCreatePurchase = [
  body('idCarrito')
    .notEmpty().withMessage('El ID del carrito es obligatorio')
    .isInt({ min: 1 }).withMessage('El ID del carrito debe ser un número entero positivo'),
  
  validateRequest
];

/**
 * Valida los datos al actualizar el estado de pago de una compra
 */
const validateUpdateStatus = [
  param('idCompra')
    .notEmpty().withMessage('El ID de la compra es obligatorio')
    .isInt({ min: 1 }).withMessage('El ID de la compra debe ser un número entero positivo'),
  
  body('estadoPago')
    .notEmpty().withMessage('El estado de pago es obligatorio')
    .isIn(['pendiente', 'pagado', 'cancelado']).withMessage('El estado debe ser pendiente, pagado o cancelado'),
  
  validateRequest
];

module.exports = {
  validateCreatePurchase,
  validateUpdateStatus
};
