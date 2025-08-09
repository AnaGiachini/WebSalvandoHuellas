const express = require('express');
const router = express.Router();

// Controlador
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Validaciones
const { updateProfileValidation } = require('../validations/userValidation');
const { validateRequest } = require('../middlewares/validateRequest');

// Rutas protegidas
// Obtener todos los usuarios (solo admin)
router.get('/', protect, restrictTo('admin'), validateRequest, userController.getAllUsers);
// Obtener un usuario específico (solo admin)
router.get('/:id', protect, restrictTo('admin'), validateRequest, userController.getUserById);
// Actualizar perfil (solo el usuario mismo)
router.put('/:id', protect, updateProfileValidation, validateRequest, userController.updateUser);
// Eliminar usuario (solo admin)
router.delete('/:id', protect, restrictTo('admin'), validateRequest, userController.deleteUser);

module.exports = router;
