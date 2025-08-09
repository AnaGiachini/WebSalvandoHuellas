/**
 * Rutas: Cart
 * --------------------------------------------------------------------------
 * Define los endpoints de la API relacionados con el carrito de compras.
 *
 *  • Rutas principales
 *      GET /api/cart         → obtiene el carrito del usuario actual
 *      POST /api/cart/items  → añade un artículo al carrito
 *      PUT /api/cart/items/:idItemCarrito  → actualiza la cantidad de un artículo
 *      DELETE /api/cart/items/:idItemCarrito  → elimina un artículo del carrito
 *      DELETE /api/cart  → vacía el carrito completamente
 *
 *  • Características
 *      - Todas las rutas requieren autenticación (authMiddleware)
 *      - Se validan los datos de entrada donde es necesario
 */


const express = require('express');
const router = express.Router();

// Controlador
const cartController = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

// Validaciones
const { validateAddItem, validateUpdateItem } = require('../validations/cartValidations');
const { validateRequest } = require('../middlewares/validateRequest');

// Rutas protegidas
// Obtener el carrito del usuario actual
router.get('/', protect, cartController.getCart);

// Añadir un artículo al carrito
router.post('/items', protect, validateAddItem, validateRequest, cartController.addItemToCart);

// Actualizar la cantidad de un artículo
router.put('/items/:idItemCarrito', protect, validateUpdateItem, validateRequest, cartController.updateCartItem);

// Eliminar un artículo del carrito
router.delete('/items/:idItemCarrito', protect, validateRequest, cartController.removeCartItem);

// Vaciar el carrito
router.delete('/', protect, validateRequest, cartController.clearCart);

module.exports = router;
