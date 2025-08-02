/**
 * Rutas: adoptionApplication
 * --------------------------------------------------------------------------
 * Define las rutas de la API relacionadas con la gestión de solicitudes de adopción.
 *
 *  • Rutas principales
 *      POST /adoptions              → crea una nueva solicitud de adopción
 *      GET /adoptions               → obtiene todas las solicitudes (admin)
 *      GET /adoptions/:id           → obtiene una solicitud específica
 *      GET /adoptions/usuario/:id   → obtiene solicitudes de un usuario
 *      GET /adoptions/animal/:id    → obtiene solicitudes para un animal
 *      PUT /adoptions/:id/estado    → actualiza estado de la solicitud (admin)
 *      DELETE /adoptions/:id        → elimina una solicitud (admin)
 *
 *  • Características
 *      - Incorpora middlewares de autenticación y autorización
 *      - Aplica validaciones específicas para cada operación
 *      - Restringe ciertas operaciones a roles administrativos
 */

const express = require('express');
const router = express.Router();

// Controlador
const adoptionApplicationController = require('../controllers/adoptionApplicationController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Validaciones
const { createAdoptionApplicationValidation, updateAdoptionApplicationValidation } = require('../validations/adoptionApplicationValidation');
const { validateRequest } = require('../middlewares/validateRequest');

// Rutas para filtrar por usuario y animal
router.get('/usuario/:idUsuario', protect, adoptionApplicationController.getAdoptionApplicationByUser);
router.get('/animal/:idAnimal', protect, adoptionApplicationController.getAdoptionApplicationByAnimal);

// Rutas CRUD básicas
router.get('/', protect, restrictTo('admin'), adoptionApplicationController.getAllAdoptionApplications);
router.get('/:id', protect, adoptionApplicationController.getAdoptionApplicationById);

// Crear solicitud (requiere usuario autenticado)
router.post('/', protect, createAdoptionApplicationValidation, validateRequest, adoptionApplicationController.createAdoptionApplication);

// Actualizar estado (solo admin)
router.put('/:id/estado', protect, restrictTo('admin'), updateAdoptionApplicationValidation, validateRequest, adoptionApplicationController.updateAdoptionApplication);

// Eliminar solicitud (solo admin)
router.delete('/:id', protect, restrictTo('admin'), adoptionApplicationController.deleteAdoptionApplication);

module.exports = router;
