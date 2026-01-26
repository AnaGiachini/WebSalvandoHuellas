/**
 * Validaciones: Articulo
 * --------------------------------------------------------------------------
 * Define las reglas de validación para operaciones relacionadas con los artículos.
 * Utiliza express-validator para validar datos de entrada.
 */

const { body, param, query } = require('express-validator');
const { validateRequest } = require('../middlewares/validateRequest');

/**
 * Valida los datos al crear un nuevo artículo
 */
const validateCreateArticle = [
  body('nombre')
    .notEmpty().withMessage('El nombre del artículo es obligatorio')
    .isString().withMessage('El nombre debe ser texto')
    .isLength({ min: 2, max: 80 }).withMessage('El nombre debe tener entre 2 y 80 caracteres'),
  
  body('descripcion')
    .optional()
    .isString().withMessage('La descripción debe ser texto'),
  
  body('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ min: 0.01 }).withMessage('El precio debe ser un número mayor que cero'),
  
  body('stock')
    .notEmpty().withMessage('El stock es obligatorio')
    .isInt({ min: 0 }).withMessage('El stock debe ser un número entero mayor o igual a cero'),
  
  body('foto')
    .optional()
    .isString().withMessage('La URL de la foto debe ser texto'),
  body('categoria')
    .optional()
    .isString().withMessage('La categoría debe ser texto')
    .isLength({ max: 50 }).withMessage('La categoría debe tener hasta 50 caracteres'),
  body('descuento')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('El descuento debe estar entre 0 y 100'),
  body('variantes')
    .optional()
    .isString().withMessage('Las variantes deben venir como JSON string'),
  body('activo')
    .optional()
    .isBoolean().withMessage('Activo debe ser booleano'),
  
  validateRequest
];

/**
 * Valida los datos al actualizar un artículo existente
 */
const validateUpdateArticle = [
  param('id')
    .notEmpty().withMessage('El ID del artículo es obligatorio')
    .isInt({ min: 1 }).withMessage('El ID del artículo debe ser un número entero positivo'),
  
  body('nombre')
    .optional()
    .isString().withMessage('El nombre debe ser texto')
    .isLength({ min: 2, max: 80 }).withMessage('El nombre debe tener entre 2 y 80 caracteres'),
  
  body('descripcion')
    .optional()
    .isString().withMessage('La descripción debe ser texto'),
  
  body('precio')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('El precio debe ser un número mayor que cero'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('El stock debe ser un número entero mayor o igual a cero'),
  
  body('foto')
    .optional()
    .isString().withMessage('La URL de la foto debe ser texto'),
  
  body('categoria')
    .optional()
    .isString().withMessage('La categoría debe ser texto')
    .isLength({ max: 50 }).withMessage('La categoría debe tener hasta 50 caracteres'),
  
  body('descuento')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('El descuento debe estar entre 0 y 100'),
  
  body('variantes')
    .optional()
    .isString().withMessage('Las variantes deben venir como JSON string'),
  
  body('activo')
    .optional()
    .isBoolean().withMessage('Activo debe ser booleano'),
  
  validateRequest
];

/**
 * Valida el ID al buscar o eliminar un artículo
 */
const validateArticleId = [
  param('id')
    .notEmpty().withMessage('El ID del artículo es obligatorio')
    .isInt({ min: 1 }).withMessage('El ID del artículo debe ser un número entero positivo'),
  
  validateRequest
];

/**
 * Valida el término de búsqueda
 */
const validateSearchQuery = [
  query('query')
    .notEmpty().withMessage('El término de búsqueda es obligatorio')
    .isString().withMessage('El término de búsqueda debe ser texto')
    .isLength({ min: 1 }).withMessage('El término de búsqueda no puede estar vacío'),
  
  validateRequest
];

module.exports = {
  validateCreateArticle,
  validateUpdateArticle,
  validateArticleId,
  validateSearchQuery
};
