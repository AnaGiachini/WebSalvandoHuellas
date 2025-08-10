/**
 * Controlador: Article
 * --------------------------------------------------------------------------
 * Maneja las solicitudes HTTP relacionadas con la gestión de artículos.
 * Utiliza el servicio articleService para implementar la lógica de negocio.
 */

const { 
  getAllArticlesService,
  getArticleByIdService,
  createArticleService,
  updateArticleService,
  deleteArticleService,
  searchArticlesService
} = require('../services/articleService');

/**
 * Obtiene todos los artículos
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función next de Express
 */
const getAllArticles = async (req, res, next) => {
  try {
    const articles = await getAllArticlesService();
    res.status(200).json({ 
      success: true, 
      data: articles 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene un artículo específico por su ID
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función next de Express
 */
const getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await getArticleByIdService(id);
    res.status(200).json({ 
      success: true, 
      data: article 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crea un nuevo artículo
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función next de Express
 */
const createArticle = async (req, res, next) => {
  try {
    const articleData = req.body;
    const article = await createArticleService(articleData);
    res.status(201).json({ 
      success: true, 
      data: article,
      message: 'Artículo creado correctamente'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza un artículo existente
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función next de Express
 */
const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const articleData = req.body;
    const article = await updateArticleService(id, articleData);
    res.status(200).json({ 
      success: true, 
      data: article,
      message: 'Artículo actualizado correctamente'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina un artículo
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función next de Express
 */
const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteArticleService(id);
    res.status(200).json({ 
      success: true, 
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Busca artículos por nombre o descripción
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función next de Express
 */
const searchArticles = async (req, res, next) => {
  try {
    const { query } = req.query;
    const articles = await searchArticlesService(query);
    res.status(200).json({ 
      success: true, 
      data: articles 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  searchArticles
};
