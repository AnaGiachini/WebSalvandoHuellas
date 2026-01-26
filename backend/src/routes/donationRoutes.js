const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { createTransferDonation, getMyDonations, getAllDonations, updateDonationStatus } = require('../controllers/donationsController');

// Crear donación por transferencia (UC06 – opción transferencia)
router.post('/transfer', protect, createTransferDonation);

// Listado de donaciones del usuario
router.get('/mine', protect, getMyDonations);

// Admin: Listar todas las donaciones
router.get('/', protect, restrictTo('admin'), getAllDonations);

// Admin: Actualizar estado de donación
router.patch('/:id/status', protect, restrictTo('admin'), updateDonationStatus);

module.exports = router;
