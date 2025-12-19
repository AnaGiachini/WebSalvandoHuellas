/**
 * Rutas: Payments (Mercado Pago)
 * --------------------------------------------------------------------------
 * Expone los endpoints relacionados con pagos mediante Mercado Pago.
 *
 *  • Casos de uso
 *      - UC03: Realizar compra con Mercado Pago
 *      - UC Donaciones: Donar mediante Mercado Pago
 *
 *  • Rutas principales
 *      POST /api/payments/mp/preference             → crea preferencia para un carrito
 *      POST /api/payments/mp/donations/preference   → crea preferencia para una donación
 *      POST /api/payments/mp/webhook                → recibe notificaciones de pago (webhook)
 */
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { createMpPreference, mpWebhook, createMpDonationPreference } = require('../controllers/paymentsController');

// Crear preferencia de MP para un carrito (requiere autenticación)
router.post('/mp/preference', protect, createMpPreference);

// Crear preferencia de MP para una donación (requiere autenticación)
router.post('/mp/donations/preference', protect, createMpDonationPreference);

// Webhook de MP (público; en producción validar firma)
router.post('/mp/webhook', mpWebhook);

module.exports = router;
