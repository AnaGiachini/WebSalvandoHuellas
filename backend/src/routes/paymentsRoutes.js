/**
 * Rutas: Payments (Mercado Pago)
 * --------------------------------------------------------------------------
 */
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { createMpPreference, mpWebhook } = require('../controllers/paymentsController');

// Crear preferencia de MP para un carrito (requiere autenticación)
router.post('/mp/preference', protect, createMpPreference);

// Webhook de MP (público; en producción validar firma)
router.post('/mp/webhook', mpWebhook);

module.exports = router;
