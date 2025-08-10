/**
 * Servicio: adoptionApplication
 * --------------------------------------------------------------------------
 * Provee la capa de lógica de negocio para operaciones relacionadas con solicitudes de adopción.
 *
 *  • Funciones principales
 *      createAdoptionApplicationService      → crea nueva solicitud de adopción
 *      getAllAdoptionApplicationService    → obtiene todas las solicitudes
 *      getAdoptionApplicationByIdService      → filtra solicitudes por usuario
 *      getAdoptionApplicationByAnimalService       → filtra solicitudes por animal
 *      updateAdoptionApplicationService        → actualiza estado de la solicitud
 *      deleteAdoptionApplicationService      → elimina una solicitud
 *
 *  • Manejo de errores
 *      - Lanza AppError 404 cuando no encuentra una solicitud
 *      - Lanza AppError 400 cuando hay conflictos de estado
 *
 *  • Notas
 *      – Implementa la lógica de cambio de estado de animales según resultado de adopción
 */

const SolicitudAdopcion = require('../models/solicitudAdopcion');
const Animal = require('../models/animal');
const Usuario = require('../models/usuario');
const AppError = require('../utils/AppError');
const sequelize = require("../configs/db");

/**
 * Obtiene todas las solicitudes de adopción con información del usuario y animal
 * @returns {Promise<Array>} Lista de solicitudes con datos asociados
 */
const getAllAdoptionApplicationService = async () => {
  return await SolicitudAdopcion.findAll({
    include: [
      { model: Usuario, as: 'usuario' },
      { model: Animal, as: 'animal' }
    ]
  });
};

/**
 * Obtiene una solicitud de adopción por su ID
 * @param {number} id - ID de la solicitud
 * @returns {Promise<Object>} Datos de la solicitud
 * @throws {AppError} Si la solicitud no existe
 */
const getAdoptionApplicationByIdService = async (id) => {
  const solicitud = await SolicitudAdopcion.findOne({
    where: { idSolicitud: id },
    include: [
      { model: Usuario, as: 'usuario' },
      { model: Animal, as: 'animal' }
    ]
  });
  
  if (!solicitud) throw new AppError(404, 'Solicitud de adopción no encontrada');
  return solicitud;
};

/**
 * Obtiene todas las solicitudes de adopción de un usuario específico
 * @param {number} idUsuario - ID del usuario
 * @returns {Promise<Array>} Lista de solicitudes del usuario
 */
const getAdoptionApplicationByUserService = async (idUsuario) => {
  return await SolicitudAdopcion.findAll({
    where: { idUsuario },
    include: [{ model: Animal, as: 'animal' }]
  });
};

/**
 * Obtiene todas las solicitudes de adopción para un animal específico
 * @param {number} idAnimal - ID del animal
 * @returns {Promise<Array>} Lista de solicitudes para el animal
 */
const getAdoptionApplicationByAnimalService = async (idAnimal) => {
  return await SolicitudAdopcion.findAll({
    where: { idAnimal },
    include: [{ model: Usuario, as: 'usuario' }]
  });
};

/**
 * Crea una nueva solicitud de adopción
 * @param {Object} data - Datos de la solicitud (idUsuario, idAnimal)
 * @returns {Promise<Object>} Solicitud creada
 * @throws {AppError} Si el animal no está disponible o ya tiene una solicitud en proceso
 */
const createAdoptionApplicationService = async (data) => {
  const { idAnimal } = data;
  
  // Verificar si el animal existe y está disponible
  const animal = await Animal.findByPk(idAnimal);
  if (!animal) throw new AppError(404, 'Animal no encontrado');
  
  // Verificar que el animal esté en estado "sin_hogar" (disponible)
  if (animal.estadoAdopcion !== 'sin_hogar') {
    throw new AppError(
      400, 
      `Este animal no está disponible para adopción. Estado actual: ${animal.estadoAdopcion}`
    );
  }
  
  // Crear la solicitud y cambiar el estado del animal a "en_proceso"
  console.log('TIPO DE SEQUELIZE:', typeof sequelize);

  const result = await sequelize.transaction(async (t) => {
    const solicitud = await SolicitudAdopcion.create(data, { transaction: t });
    
    await Animal.update(
      { estadoAdopcion: 'en_proceso' },
      { where: { idAnimal }, transaction: t }
    );
    
    return solicitud;
  });
  
  return result;
};

/**
 * Actualiza el estado de una solicitud de adopción
 * @param {number} id - ID de la solicitud
 * @param {string} estado - Nuevo estado ('pendiente', 'aprobada', 'rechazada')
 * @returns {Promise<Object>} Solicitud actualizada
 * @throws {AppError} Si la solicitud no existe
 */
const updateAdoptionApplicationService = async (id, estado) => {
  const solicitud = await getAdoptionApplicationByIdService(id);
  const idAnimal = solicitud.idAnimal;
  
  // Actualizar la solicitud y el estado del animal según el resultado
  const result = await sequelize.transaction(async (t) => {
    // Actualizar el estado de la solicitud
    await solicitud.update({ estado }, { transaction: t });
    
    // Actualizar el estado del animal según el resultado de la solicitud
    let estadoAnimal;
    
    if (estado === 'aprobada') {
      estadoAnimal = 'adoptado';
    } else if (estado === 'rechazada') {
      estadoAnimal = 'sin_hogar'; // Vuelve a estar disponible
    } else {
      estadoAnimal = 'en_proceso';
    }
    
    await Animal.update(
      { estadoAdopcion: estadoAnimal },
      { where: { idAnimal }, transaction: t }
    );
    
    return solicitud;
  });
  
  return result;
};

/**
 * Elimina una solicitud de adopción
 * @param {number} id - ID de la solicitud
 * @returns {Promise<boolean>} True si se eliminó correctamente
 * @throws {AppError} Si la solicitud no existe
 */
const deleteAdoptionApplicationService = async (id) => {
  const solicitud = await getAdoptionApplicationByIdService(id);
  const idAnimal = solicitud.idAnimal;
  
  // Si la solicitud estaba en proceso y era la única, devolver el animal a estado disponible
  const result = await sequelize.transaction(async (t) => {
    await solicitud.destroy({ transaction: t });
    
    // Verificar si hay otras solicitudes pendientes para este animal
    const otrasSolicitudes = await SolicitudAdopcion.findOne({
      where: { 
        idAnimal,
        estado: 'pendiente'
      },
      transaction: t
    });
    
    // Si no hay más solicitudes pendientes, cambiar el estado del animal a disponible
    if (!otrasSolicitudes) {
      await Animal.update(
        { estadoAdopcion: 'sin_hogar' },
        { where: { idAnimal }, transaction: t }
      );
    }
    
    return true;
  });
  
  return result;
};

module.exports = {
  getAllAdoptionApplicationService,
  getAdoptionApplicationByIdService,
  getAdoptionApplicationByUserService,
  getAdoptionApplicationByAnimalService,
  createAdoptionApplicationService,
  updateAdoptionApplicationService,
  deleteAdoptionApplicationService
};
