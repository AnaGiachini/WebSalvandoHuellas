/**
 * Servicio: Article
 * --------------------------------------------------------------------------
 * Implementa la lógica de negocio para gestionar los artículos de la tienda.
 * 
 *  • Operaciones principales
 *      getAllArticlesService    → obtiene todos los artículos
 *      getArticleByIdService    → obtiene un artículo por ID
 *      createArticleService     → crea un nuevo artículo
 *      updateArticleService     → actualiza un artículo existente
 *      deleteArticleService     → elimina un artículo
 *      searchArticlesService    → busca artículos por nombre o descripción
 *      
 *  • Características
 *      - Validación de datos
 *      - Manejo de errores con mensajes descriptivos
 */

const Articulo = require('../models/articulo');
const AppError = require('../utils/AppError');

/**
 * Obtiene todos los artículos
 * @returns {Promise<Array>} Lista de artículos
 */
const getAllArticlesService = async () => {
  const articles = await Articulo.findAll();
  return articles;
};

/**
 * Obtiene un artículo específico por su ID
 * @param {number} idArticulo - ID del artículo a buscar
 * @returns {Promise<Object>} Artículo encontrado
 * @throws {AppError} Si no se encuentra el artículo
 */
const getArticleByIdService = async (idArticulo) => {
  const article = await Articulo.findByPk(idArticulo);
  
  if (!article) {
    throw new AppError('Artículo no encontrado', 404);
  }
  
  return article;
};

/**
 * Crea un nuevo artículo
 * @param {Object} articleData - Datos del artículo a crear
 * @returns {Promise<Object>} Artículo creado
 */
const normalizePayload = (data = {}) => {
  const out = { ...data };
  if (out.descuento != null) {
    const d = Number(out.descuento);
    out.descuento = isNaN(d) ? 0 : Math.max(0, Math.min(100, d));
  }
  if (out.variantes != null && typeof out.variantes !== 'string') {
    try { out.variantes = JSON.stringify(out.variantes); } catch { out.variantes = null; }
  }
  return out;
};

const createArticleService = async (articleData) => {
  const article = await Articulo.create(normalizePayload(articleData));
  return article;
};

/**
 * Actualiza un artículo existente
 * @param {number} idArticulo - ID del artículo a actualizar
 * @param {Object} articleData - Nuevos datos del artículo
 * @returns {Promise<Object>} Artículo actualizado
 * @throws {AppError} Si no se encuentra el artículo
 */
const updateArticleService = async (idArticulo, articleData) => {
  const article = await Articulo.findByPk(idArticulo);
  
  if (!article) {
    throw new AppError('Artículo no encontrado', 404);
  }
  
  await article.update(normalizePayload(articleData));
  return article;
};

/**
 * Elimina un artículo
 * @param {number} idArticulo - ID del artículo a eliminar
 * @returns {Promise<Object>} Mensaje de confirmación
 * @throws {AppError} Si no se encuentra el artículo o tiene referencias
 */
const deleteArticleService = async (idArticulo) => {
  const article = await Articulo.findByPk(idArticulo);
  
  if (!article) {
    throw new AppError('Artículo no encontrado', 404);
  }
  
  try {
    await article.destroy();
    return { message: 'Artículo eliminado correctamente' };
  } catch (error) {
    // Si hay error de integridad referencial (FK constraint)
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      throw new AppError('No se puede eliminar el artículo porque está siendo utilizado', 400);
    }
    throw error;
  }
};

/**
 * Busca artículos por nombre o descripción
 * @param {string} query - Término de búsqueda
 * @returns {Promise<Array>} Lista de artículos que coinciden con la búsqueda
 */
const searchArticlesService = async (query) => {
  const articles = await Articulo.findAll({
    where: {
      [Articulo.sequelize.Op.or]: [
        { nombre: { [Articulo.sequelize.Op.like]: `%${query}%` } },
        { descripcion: { [Articulo.sequelize.Op.like]: `%${query}%` } }
      ]
    }
  });
  
  return articles;
};

module.exports = {
  getAllArticlesService,
  getArticleByIdService,
  createArticleService,
  updateArticleService,
  deleteArticleService,
  searchArticlesService
};
