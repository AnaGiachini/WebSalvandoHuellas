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

// Rutas públicas para visualizar la tienda
// Obtener todos los artículos (público)
router.get('/', articleController.getAllArticles);
// Buscar artículos por nombre o descripción (público)
router.get('/search', validateSearchQuery, validateRequest, articleController.searchArticles);
// Obtener un artículo específico (público)
router.get('/:id', validateArticleId, validateRequest, articleController.getArticleById);
// Crear un artículo (solo admin)
router.post('/', protect, restrictTo('admin'), validateCreateArticle, validateRequest, articleController.createArticle);
// Actualizar un artículo (solo admin)
router.put('/:id', protect, restrictTo('admin'), validateUpdateArticle, validateRequest, articleController.updateArticle);
// Eliminar un artículo (solo admin)
router.delete('/:id', protect, restrictTo('admin'), validateArticleId, validateRequest, articleController.deleteArticle);
// (nota) La ruta de búsqueda debe declararse antes de ":id" para evitar colisiones

module.exports = router;
