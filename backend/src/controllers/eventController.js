/**
 * Controlador: Evento
 * --------------------------------------------------------------------------
 * Maneja solicitudes HTTP para crear y consultar eventos.
 */

const {
  createEventService,
  getAllEventsService,
  getEventByIdService,
  updateEventService,
  deleteEventService,
} = require('../services/eventService');

/**
 * Lista todos los eventos
 */
const getAllEvents = async (_req, res, next) => {
  try {
    const events = await getAllEventsService();
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene un evento por ID
 */
const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await getEventByIdService(id);
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

/**
 * Crea un nuevo evento (solo admin) – UC04
 * --------------------------------------------------------------------------
 *  • Este endpoint representa el caso de uso "Crear evento" en el panel de
 *    administración.
 *  • Requiere que el usuario esté autenticado y tenga rol "admin" (se
 *    valida en las rutas con protect + restrictTo('admin')).
 *  • Delegan la lógica de negocio en createEventService, que se encarga de
 *    normalizar datos y persistir en la base.
 */
const createEvent = async (req, res, next) => {
  try {
    const event = await createEventService(req.body);
    res.status(201).json({ success: true, data: event, message: 'Evento creado correctamente' });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza un evento (solo admin)
 */
const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await updateEventService(id, req.body);
    res.status(200).json({ success: true, data: updated, message: 'Evento actualizado correctamente' });
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina un evento (solo admin)
 */
const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteEventService(id);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
