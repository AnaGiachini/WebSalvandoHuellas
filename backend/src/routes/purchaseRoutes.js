/**
 * Rutas: Purchase
 * --------------------------------------------------------------------------
 * Define los endpoints de la API relacionados con las compras.
 *
 *  • Rutas principales
 *      POST /api/purchases         → crea una nueva compra a partir de un carrito
 *      GET /api/purchases/:idCompra → obtiene los detalles de una compra específica
 *      GET /api/purchases          → lista todas las compras del usuario actual
 *      PUT /api/purchases/:idCompra/status → actualiza el estado de pago (solo admin)
 *
 *  • Características
 *      - Todas las rutas requieren autenticación (authMiddleware)
 *      - Se validan los datos de entrada donde es necesario
 *      - Algunas operaciones requieren permisos de administrador
 */

const express = require('express');
const router = express.Router();

// Controlador
const purchaseController = require('../controllers/purchaseController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Validaciones
const { validateCreatePurchase, validateUpdateStatus } = require('../validations/purchaseValidations');
const { validateRequest } = require('../middlewares/validateRequest');

// Rutas protegidas
// Crear una nueva compra
router.post('/', protect, validateCreatePurchase, validateRequest, purchaseController.createPurchase);
// Obtener los detalles de una compra específica
router.get('/:idCompra', protect, validateRequest, purchaseController.getPurchaseById);
// Listar todas las compras del usuario actual
router.get('/', protect, validateRequest, purchaseController.getUserPurchases);
// Actualizar el estado de pago (solo admin)
router.put('/:idCompra/status', protect, restrictTo('admin'), validateUpdateStatus, validateRequest, purchaseController.updatePurchaseStatus);
// Métricas de ventas (solo admin)
router.get('/metrics', protect, restrictTo('admin'), purchaseController.getSalesMetrics);

module.exports = router;

