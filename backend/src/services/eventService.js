/**
 * Servicio: Evento
 * --------------------------------------------------------------------------
 * Lógica de negocio para creación y consulta de eventos.
 *
 *  • Casos de uso
 *      - UC04: Crear evento (alta de actividades como jornadas de adopción,
 *        campañas, etc.)
 */

const AppError = require('../utils/AppError');
const Evento = require('../models/evento');

/**
 * Crea un nuevo evento (UC04)
 * --------------------------------------------------------------------------
 *  • Responsabilidad
 *      - Encapsula la lógica de alta de eventos en la base de datos.
 *      - Normaliza los datos mínimos recibidos desde el controlador antes de
 *        llamar al modelo Sequelize.
 *
 * @param {Object} data             Datos enviados desde el controlador
 * @param {string} data.titulo      Título visible del evento
 * @param {string} [data.descripcion] Descripción más extensa (opcional)
 * @param {string|Date} data.fecha  Fecha/hora del evento (ISO string o Date)
 * @param {string} [data.lugar]     Lugar donde se realizará (opcional)
 * @param {string} [data.foto]      URL o ruta de imagen del evento (opcional)
 */
const createEventService = async ({ titulo, descripcion, fecha, lugar, foto }) => {
  // Normalización mínima: se limpian espacios y se fuerza fecha a Date
  const payload = {
    titulo: titulo?.trim(),
    descripcion: descripcion?.trim(),
    fecha: new Date(fecha),
    lugar: lugar?.trim(),
    foto: foto?.trim()
  };

  try {
    const created = await Evento.create(payload);
    return created;
  } catch (err) {
    // Errores de validación de Sequelize
    if (err && (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError')) {
      const errors = err.errors?.map(e => ({ field: e.path, message: e.message }));
      throw new AppError(400, 'Datos de evento inválidos', errors);
    }
    throw err;
  }
};

/**
 * Obtiene todos los eventos (ordenados por fecha asc)
 */
const getAllEventsService = async () => {
  return Evento.findAll({ order: [['fecha', 'ASC']] });
};

/**
 * Obtiene un evento por ID
 */
const getEventByIdService = async (id) => {
  const event = await Evento.findByPk(id);
  if (!event) throw new AppError(404, 'Evento no encontrado');
  return event;
};

/**
 * Actualiza un evento existente por ID
 */
const updateEventService = async (id, data) => {
  const event = await Evento.findByPk(id);
  if (!event) throw new AppError(404, 'Evento no encontrado');

  // Normalización
  const payload = { ...data };
  if (payload.titulo !== undefined) payload.titulo = payload.titulo?.trim();
  if (payload.descripcion !== undefined) payload.descripcion = payload.descripcion?.trim();
  if (payload.fecha !== undefined) payload.fecha = new Date(payload.fecha);
  if (payload.lugar !== undefined) payload.lugar = payload.lugar?.trim();
  if (payload.foto !== undefined) payload.foto = payload.foto?.trim();

  try {
    await event.update(payload);
    return event;
  } catch (err) {
    if (err && err.name === 'SequelizeValidationError') {
      const errors = err.errors?.map(e => ({ field: e.path, message: e.message }));
      throw new AppError(400, 'Datos de evento inválidos', errors);
    }
    throw err;
  }
};

/**
 * Elimina un evento por ID
 */
const deleteEventService = async (id) => {
  const event = await Evento.findByPk(id);
  if (!event) throw new AppError(404, 'Evento no encontrado');
  await event.destroy();
  return { message: 'Evento eliminado correctamente' };
};

module.exports = {
  createEventService,
  getAllEventsService,
  getEventByIdService,
  updateEventService,
  deleteEventService,
};
