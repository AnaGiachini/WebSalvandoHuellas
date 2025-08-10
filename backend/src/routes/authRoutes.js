const express = require('express');
const router = express.Router();

// Controlador
const authController = require('../controllers/authController');

// Validaciones
const { loginValidation } = require('../validations/authValidation');
const { registerValidation } = require('../validations/userValidation');
const { validateRequest } = require('../middlewares/validateRequest');

// Rutas protegidas
// Registrar un nuevo usuario
router.post('/register', registerValidation, validateRequest, authController.register);
// Iniciar sesión
router.post('/login', loginValidation, validateRequest, authController.login);

module.exports = router;
