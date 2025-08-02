/**
 * Rutas: Animal
 * --------------------------------------------------------------------------
 * Define las rutas de la API relacionadas con la gestión de animales.
 *
 *  • Rutas principales
 *      GET /animals          → obtiene todos los animales
 *      GET /animals/:id      → obtiene un animal específico por ID
 *      POST /animals         → crea un nuevo animal
 *      PUT /animals/:id      → actualiza datos de un animal existente
 *      DELETE /animals/:id   → elimina un animal del sistema
 *      GET /animals/status   → filtra animales por estado de adopción
 *
 *  • Características
 *      - Incorpora middlewares de autenticación y autorización
 *      - Aplica validaciones específicas para cada operación
 *      - Restringe ciertas operaciones a roles administrativos
 */

const express = require('express');
const router = express.Router();

// Controlador
const animalController = require('../controllers/animalController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Validaciones
const { createAnimalValidation, updateAnimalValidation } = require('../validations/animalValidation');
const { validateRequest } = require('../middlewares/validateRequest');

// Ruta para filtrar por estado de adopción
router.get('/status', animalController.getAnimalsByStatus);

// Rutas CRUD básicas
router.get('/', animalController.getAllAnimals);
router.get('/:id', animalController.getAnimalById);

// Rutas protegidas (requieren autenticación y autorización)
router.post('/', protect, restrictTo('admin'), createAnimalValidation, validateRequest, animalController.createAnimal);
router.put('/:id', protect, restrictTo('admin'), updateAnimalValidation, validateRequest, animalController.updateAnimal);
router.delete('/:id', protect, restrictTo('admin'), animalController.deleteAnimal);

module.exports = router;
