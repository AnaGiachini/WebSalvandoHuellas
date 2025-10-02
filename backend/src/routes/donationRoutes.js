const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { createTransferDonation, getMyDonations } = require('../controllers/donationsController');

// Crear donación por transferencia (pendiente)
router.post('/transfer', protect, createTransferDonation);

// Listado de donaciones del usuario
router.get('/mine', protect, getMyDonations);

module.exports = router;
