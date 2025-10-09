const express = require('express');
const router = express.Router();

// Controlador
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Validaciones
const { updateProfileValidation, adminCreateUserValidation, changeRoleValidation } = require('../validations/userValidation');
const { validateRequest } = require('../middlewares/validateRequest');


// Obtener datos del usuario autenticado
router.post("/me", protect, userController.getMe);

// Rutas protegidas
// Obtener todos los usuarios (solo admin)
router.get('/', protect, restrictTo('admin'), validateRequest, userController.getAllUsers);
// Obtener un usuario específico (solo admin)
router.get('/:id', protect, restrictTo('admin'), validateRequest, userController.getUserById);
// Crear usuario manualmente (solo admin)
router.post('/', protect, restrictTo('admin'), adminCreateUserValidation, userController.adminCreateUser);
// Actualizar perfil (solo el usuario mismo)
router.put('/:id', protect, updateProfileValidation, validateRequest, userController.updateUser);
// Cambiar rol (solo admin)
router.patch('/:id/role', protect, restrictTo('admin'), changeRoleValidation, userController.changeUserRole);
// Eliminar usuario (solo admin)
router.delete('/:id', protect, restrictTo('admin'), validateRequest, userController.deleteUser);

module.exports = router;
