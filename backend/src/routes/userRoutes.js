/**
 * Rutas: Usuario (UC07 - Gestión de usuarios)
 * --------------------------------------------------------------------------
 * Expone los endpoints HTTP relacionados con la gestión de usuarios.
 *
 *  • Casos de uso
 *      - UC07: Perfil del usuario autenticado (/users/me)
 *      - UC07: Panel de administración de usuarios (alta, baja, cambios de rol)
 *
 *  • Resumen de endpoints
 *      POST   /users/me        → devuelve el perfil del usuario autenticado
 *      GET    /users           → lista todos los usuarios (solo admin)
 *      GET    /users/:id       → detalle de un usuario (solo admin)
 *      POST   /users           → crear usuario manualmente (solo admin)
 *      PUT    /users/:id       → actualizar perfil (usuario propio o admin)
 *      PATCH  /users/:id/role  → cambiar rol (solo admin)
 *      DELETE /users/:id       → eliminar usuario (solo admin)
 */

const express = require('express');
const router = express.Router();

// Controlador
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Validaciones
const { updateProfileValidation, adminCreateUserValidation, changeRoleValidation } = require('../validations/userValidation');
const { validateRequest } = require('../middlewares/validateRequest');


// Obtener datos del usuario autenticado (UC07 - perfil propio)
router.post("/me", protect, userController.getMe);

// Rutas protegidas (UC07 - panel admin)
// Obtener todos los usuarios (solo admin)
router.get('/', protect, restrictTo('admin'), validateRequest, userController.getAllUsers);
// Obtener un usuario específico (solo admin)
router.get('/:id', protect, restrictTo('admin'), validateRequest, userController.getUserById);
// Crear usuario manualmente (solo admin)
router.post('/', protect, restrictTo('admin'), adminCreateUserValidation, userController.adminCreateUser);
// Actualizar perfil (solo el usuario mismo o admin)
router.put('/:id', protect, updateProfileValidation, validateRequest, userController.updateUser);
// Cambiar rol (solo admin)
router.patch('/:id/role', protect, restrictTo('admin'), changeRoleValidation, userController.changeUserRole);
// Eliminar usuario (solo admin)
router.delete('/:id', protect, restrictTo('admin'), validateRequest, userController.deleteUser);

module.exports = router;
