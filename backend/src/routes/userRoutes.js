const express = require('express');
const router = express.Router();

// Controlador
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Validaciones
const { updateProfileValidation } = require('../validations/userValidation');
const { validateRequest } = require('../middlewares/validateRequest');

// Rutas
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', updateProfileValidation, validateRequest, userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Rutas protegidas
router.get('/', protect, restrictTo('admin'), userController.getAllUsers);
router.get('/:id', protect, restrictTo('admin'), userController.getUserById);
router.put('/:id', protect, restrictTo('admin'), updateProfileValidation, validateRequest, userController.updateUser);
router.delete('/:id', protect, restrictTo('admin'), userController.deleteUser);

module.exports = router;

