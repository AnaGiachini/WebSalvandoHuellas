/**
 * Rutas: Articulo
 * --------------------------------------------------------------------------
 * Define las rutas de la API para gestionar artículos.
 * Aplica los middlewares de validación y autenticación correspondientes.
 */

const express = require('express');
const router = express.Router();

// Controlador
const articleController = require('../controllers/articleController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Validaciones
const { 
  validateCreateArticle,
  validateUpdateArticle,
  validateArticleId,
  validateSearchQuery
} = require('../validations/articleValidations');
const { validateRequest } = require('../middlewares/validateRequest');

// Rutas protegidas
// Obtener todos los artículos
router.get('/', protect, validateRequest, articleController.getAllArticles);
// Obtener un artículo específico
router.get('/:id', protect, validateArticleId, validateRequest, articleController.getArticleById);
// Crear un artículo (solo admin)
router.post('/', protect, restrictTo('admin'), validateCreateArticle, validateRequest, articleController.createArticle);
// Actualizar un artículo (solo admin)
router.put('/:id', protect, restrictTo('admin'), validateUpdateArticle, validateRequest, articleController.updateArticle);
// Eliminar un artículo (solo admin)
router.delete('/:id', protect, restrictTo('admin'), validateArticleId, validateRequest, articleController.deleteArticle);
// Buscar artículos por nombre o descripción
router.get('/search', protect, validateSearchQuery, validateRequest, articleController.searchArticles);

module.exports = router;
