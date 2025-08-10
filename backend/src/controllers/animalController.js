/**
 * Controlador: Animal
 * --------------------------------------------------------------------------
 * Gestiona las rutas de la API relacionadas con animales.
 *
 *  • Operaciones principales
 *      getAllAnimals   → lista todos los animales registrados
 *      getAnimalById   → obtiene un animal específico por ID
 *      createAnimal    → crea un nuevo animal en el sistema
 *      updateAnimal    → actualiza datos de un animal existente
 *      deleteAnimal    → elimina un animal del sistema
 *      getAnimalsByStatus → obtiene animales por estado de adopción
 *
 *  • Características
 *      - Implementa manejo de errores con try/catch
 *      - Delega la lógica de negocio a los servicios correspondientes
 *      - Devuelve respuestas JSON estandarizadas
 *
 *  • Respuestas HTTP
 *      200 → Éxito (OK) para operaciones de lectura y actualización
 *      201 → Creado (Created) para nuevos registros
 *      204 → Éxito sin contenido (No Content) para eliminaciones
 *      4xx/5xx → Errores (manejados por errorMiddleware)
 */

const {
  getAllAnimalsService,
  getAnimalByIdService,
  createAnimalService,
  updateAnimalService,
  deleteAnimalService,
  getAnimalsByStatusService
} = require('../services/animalService');

/**
 * Obtiene la lista de todos los animales
 * @param {Object} _req - Objeto de solicitud Express (no utilizado)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const getAllAnimals = async (_req, res, next) => {
  try {
    const animals = await getAllAnimalsService();
    res.json(animals);
  } catch (err) { next(err); }
};

/**
 * Obtiene un animal por su ID
 * @param {Object} req - Objeto de solicitud Express con parámetro id
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const getAnimalById = async (req, res, next) => {
  try {
    const animal = await getAnimalByIdService(req.params.id);
    res.json(animal);
  } catch (err) { next(err); }
};

/**
 * Crea un nuevo animal en el sistema
 * @param {Object} req - Objeto de solicitud Express con datos en el body
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const createAnimal = async (req, res, next) => {
  try {
    const animal = await createAnimalService(req.body);
    res.status(201).json(animal);
  } catch (err) { next(err); }
};

/**
 * Actualiza los datos de un animal existente
 * @param {Object} req - Objeto de solicitud Express con parámetro id y body
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const updateAnimal = async (req, res, next) => {
  try {
    const animal = await updateAnimalService(req.params.id, req.body);
    res.json(animal);
  } catch (err) { next(err); }
};

/**
 * Elimina un animal del sistema
 * @param {Object} req - Objeto de solicitud Express con parámetro id
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const deleteAnimal = async (req, res, next) => {
  try {
    await deleteAnimalService(req.params.id);
    res.sendStatus(204);
  } catch (err) { next(err); }
};

/**
 * Obtiene animales filtrados por su estado de adopción
 * @param {Object} req - Objeto de solicitud Express con parámetro de consulta estadoAdopcion
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const getAnimalsByStatus = async (req, res, next) => {
  try {
    const animals = await getAnimalsByStatusService(req.query.estadoAdopcion);
    res.json(animals);
  } catch (err) { next(err); }
};

module.exports = { 
  getAllAnimals, 
  getAnimalById, 
  createAnimal, 
  updateAnimal, 
  deleteAnimal,
  getAnimalsByStatus 
};
