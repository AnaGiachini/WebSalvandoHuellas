/**
 * Rutas: Eventos
 * --------------------------------------------------------------------------
 * Endpoints para crear y consultar eventos.
 */

const express = require('express');
const router = express.Router();

const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { validateCreateEvent, validateEventId, validateUpdateEvent, validateDeleteEvent } = require('../validations/eventValidations');

// Público: listar y ver detalle
router.get('/', getAllEvents);
router.get('/:id', validateEventId, getEventById);

// Solo admin: crear evento
router.post('/', protect, restrictTo('admin'), validateCreateEvent, createEvent);

// Solo admin: actualizar y eliminar evento
router.put('/:id', protect, restrictTo('admin'), validateUpdateEvent, updateEvent);
router.delete('/:id', protect, restrictTo('admin'), validateDeleteEvent, deleteEvent);

module.exports = router;
