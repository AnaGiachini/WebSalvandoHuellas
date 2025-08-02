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
const purchaseController = require('../controllers/purchaseController');
const { protect } = require('../middlewares/authMiddleware');
const { validateCreatePurchase, validateUpdateStatus } = require('../validations/purchaseValidations');
const { validateRequest } = require('../middlewares/validateRequest');

// Aplicar middleware de autenticación a todas las rutas
router.use(protect);

// Crear una nueva compra
router.post('/', validateCreatePurchase, validateRequest, purchaseController.createPurchase);

// Obtener una compra específica por ID
router.get('/:idCompra', purchaseController.getPurchaseById);

// Obtener todas las compras del usuario actual
router.get('/', purchaseController.getUserPurchases);

// Actualizar estado de pago (solo admin)
router.put('/:idCompra/status', validateUpdateStatus, validateRequest, purchaseController.updatePurchaseStatus);

module.exports = router;
