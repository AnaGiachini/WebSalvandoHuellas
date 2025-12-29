/**
 * Controlador: adoptionApplication
 * --------------------------------------------------------------------------
 * Gestiona las rutas de la API relacionadas con solicitudes de adopción.
 *
 *  • Operaciones principales
 *      createAdoptionApplication     → registra una nueva solicitud de adopción
 *      getAllAdoptionApplication   → lista todas las solicitudes registradas
 *      getAdoptionApplicationById    → obtiene una solicitud específica por ID
 *      getAdoptionApplicationByUser     → obtiene solicitudes de un usuario
 *      getAdoptionApplicationByAnimal      → obtiene solicitudes para un animal
 *      updateAdoptionApplication       → actualiza el estado de una solicitud
 *      deleteAdoptionApplication     → elimina una solicitud
 *
 *  • Características
 *      - Implementa manejo de errores con try/catch
 *      - Delega la lógica de negocio a los servicios correspondientes
 *      - Devuelve respuestas JSON estandarizadas
 */

const {
  createAdoptionApplicationService,
  getAllAdoptionApplicationService,
  getAdoptionApplicationByIdService,
  getAdoptionApplicationByUserService,
  getAdoptionApplicationByAnimalService,
  updateAdoptionApplicationService,
  deleteAdoptionApplicationService
} = require('../services/adoptionApplicationService');

/**
 * Crea una nueva solicitud de adopción
 * @param {Object} req - Objeto de solicitud Express con datos completos del adoptante en el body
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const createAdoptionApplication = async (req, res, next) => {
  try {
    const { idAnimal, nombre, apellido, email, telefono, direccion, experienciaPrevia, motivacion } = req.body;

    // ✅ el idUsuario viene del token (req.user)
    const idUsuario = req.user.idUsuario;

    const solicitud = await createAdoptionApplicationService({ 
      idUsuario, 
      idAnimal, 
      nombre, 
      apellido, 
      email, 
      telefono, 
      direccion, 
      experienciaPrevia, 
      motivacion 
    });

    res.status(201).json({
      status: 'success',
      message: 'Solicitud de adopción creada exitosamente',
      data: solicitud
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Obtiene la lista de todas las solicitudes de adopción
 * @param {Object} _req - Objeto de solicitud Express (no utilizado)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const getAllAdoptionApplications = async (_req, res, next) => {
  try {
    const solicitudes = await getAllAdoptionApplicationService();
    res.json({
      status: 'success',
      results: solicitudes.length,
      data: solicitudes
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Obtiene una solicitud de adopción por su ID
 * @param {Object} req - Objeto de solicitud Express con parámetro id
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const getAdoptionApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const solicitud = await getAdoptionApplicationByIdService(id);
    res.json({
      status: 'success',
      data: solicitud
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Obtiene las solicitudes de adopción de un usuario específico
 * @param {Object} req - Objeto de solicitud Express con parámetro idUsuario
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const getAdoptionApplicationByUser = async (req, res, next) => {
  try {
    const { idUsuario } = req.params;
    const solicitudes = await getAdoptionApplicationByUserService(idUsuario);
    res.json({
      status: 'success',
      results: solicitudes.length,
      data: solicitudes
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Obtiene las solicitudes de adopción para un animal específico
 * @param {Object} req - Objeto de solicitud Express con parámetro idAnimal
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const getAdoptionApplicationByAnimal = async (req, res, next) => {
  try {
    const { idAnimal } = req.params;
    const solicitudes = await getAdoptionApplicationByAnimalService(idAnimal);
    res.json({
      status: 'success',
      results: solicitudes.length,
      data: solicitudes
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Actualiza el estado de una solicitud de adopción
 * @param {Object} req - Objeto de solicitud Express con parámetro id y estado/observaciones en el body
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const updateAdoptionApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado, observaciones } = req.body;

    const solicitudActualizada = await updateAdoptionApplicationService(id, estado, observaciones);

    res.json({
      status: 'success',
      message: `Estado de solicitud actualizado a: ${estado}`,
      data: solicitudActualizada
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Elimina una solicitud de adopción
 * @param {Object} req - Objeto de solicitud Express con parámetro id
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const deleteAdoptionApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteAdoptionApplicationService(id);

    res.status(204).json({
      status: 'success',
      message: 'Solicitud de adopción eliminada correctamente'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createAdoptionApplication,
  getAllAdoptionApplications,
  getAdoptionApplicationById,
  getAdoptionApplicationByUser,
  getAdoptionApplicationByAnimal,
  updateAdoptionApplication,
  deleteAdoptionApplication
};
