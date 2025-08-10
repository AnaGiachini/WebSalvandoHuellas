/**
 * Servicio: Animal
 * --------------------------------------------------------------------------
 * Provee la capa de lógica de negocio para operaciones relacionadas con animales.
 *
 *  • Funciones principales
 *      getAllAnimalsService    → obtiene todos los animales registrados
 *      getAnimalByIdService    → busca un animal por su ID
 *      createAnimalService     → crea un nuevo animal en el sistema
 *      updateAnimalService     → actualiza datos de un animal existente
 *      deleteAnimalService     → elimina un animal del sistema
 *      getAnimalsByStatusService → filtra animales por estado de adopción
 *
 *  • Manejo de errores
 *      - Lanza AppError 404 cuando no encuentra un animal solicitado
 *      - Asegura consistencia en operaciones de creación, actualización y borrado
 *
 *  • Notas
 *      – Implementa validaciones para garantizar la integridad de datos
 *      – Utiliza modelo Animal para interactuar con la base de datos
 */

const Animal = require('../models/animal');
const AppError = require('../utils/AppError');

/**
 * Obtiene la lista completa de animales
 * @returns {Promise<Array>} Lista de animales
 */
const getAllAnimalsService = () => Animal.findAll();

/**
 * Busca un animal por su ID
 * @param {number} id - ID del animal a buscar
 * @returns {Promise<Object>} Datos del animal
 * @throws {AppError} Si el animal no existe
 */
const getAnimalByIdService = async (id) => {
  const animal = await Animal.findByPk(id);
  if (!animal) throw new AppError(404, 'Animal not found');
  return animal;
};

/**
 * Crea un nuevo animal en el sistema
 * @param {Object} data - Datos del nuevo animal
 * @returns {Promise<Object>} Animal creado
 */
const createAnimalService = async (data) => {
  return await Animal.create(data);
};

/**
 * Actualiza los datos de un animal
 * @param {number} id - ID del animal a actualizar
 * @param {Object} data - Nuevos datos del animal
 * @returns {Promise<Object>} Animal actualizado
 */
const updateAnimalService = async (id, data) => {
  const animal = await getAnimalByIdService(id);
  await animal.update(data);
  return animal;
};

/**
 * Elimina un animal del sistema
 * @param {number} id - ID del animal a eliminar
 */
const deleteAnimalService = async (id) => {
  const animal = await getAnimalByIdService(id);
  await animal.destroy();
};

/**
 * Filtra animales por su estado de adopción
 * @param {string} estadoAdopcion - Estado de adopción para filtrar ('adoptado', 'en_proceso', 'sin_hogar')
 * @returns {Promise<Array>} Lista de animales que cumplen el criterio
 */
const getAnimalsByStatusService = async (estadoAdopcion) => {
  return await Animal.findAll({ where: { estadoAdopcion } });
};

module.exports = { 
  getAllAnimalsService, 
  getAnimalByIdService, 
  createAnimalService, 
  updateAnimalService, 
  deleteAnimalService,
  getAnimalsByStatusService 
};
