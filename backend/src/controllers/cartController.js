/**
 * Controlador: Cart
 * --------------------------------------------------------------------------
 * Gestiona las rutas de la API relacionadas con el carrito de compras.
 *
 *  • Operaciones principales
 *      getCart         → obtiene el carrito del usuario actual
 *      addItemToCart   → añade un artículo al carrito
 *      updateCartItem  → actualiza la cantidad de un artículo
 *      removeCartItem  → elimina un artículo del carrito
 *      clearCart       → elimina todos los artículos del carrito
 *
 *  • Características
 *      - Implementa manejo de errores con try/catch
 *      - Delega la lógica de negocio a los servicios correspondientes
 *      - Devuelve respuestas JSON estandarizadas
 *
 *  • Respuestas HTTP
 *      200 → Éxito (OK) para operaciones de lectura y actualización
 *      201 → Éxito al crear un nuevo recurso
 *      204 → Éxito sin contenido (No Content) para eliminaciones
 *      4xx/5xx → Errores (manejados por errorMiddleware)
 */

const {
  getCurrentUserCartService,
  addItemToCartService,
  updateCartItemService,
  removeCartItemService,
  clearCartService
} = require('../services/cartService');

/**
 * Obtiene el carrito del usuario actual o crea uno nuevo si no existe
 * @param {Object} req - Objeto de solicitud Express con usuario autenticado
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const getCart = async (req, res, next) => {
  try {
    const cart = await getCurrentUserCartService(req.user.idUsuario);
    res.json(cart);
  } catch (err) { next(err); }
};

/**
 * Añade un artículo al carrito del usuario
 * @param {Object} req - Objeto de solicitud Express con body (idArticulo, cantidad)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const addItemToCart = async (req, res, next) => {
  try {
    const { idArticulo, cantidad } = req.body;
    
    // Primero obtener o crear el carrito del usuario
    const cart = await getCurrentUserCartService(req.user.idUsuario);
    
    // Luego añadir el ítem
    const item = await addItemToCartService(cart.idCarrito, idArticulo, cantidad);
    
    res.status(201).json(item);
  } catch (err) { next(err); }
};

/**
 * Actualiza la cantidad de un artículo en el carrito
 * @param {Object} req - Objeto de solicitud Express con params (idItemCarrito) y body (cantidad)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const updateCartItem = async (req, res, next) => {
  try {
    const { idItemCarrito } = req.params;
    const { cantidad } = req.body;
    
    const result = await updateCartItemService(idItemCarrito, cantidad);
    res.json(result);
  } catch (err) { next(err); }
};

/**
 * Elimina un artículo del carrito
 * @param {Object} req - Objeto de solicitud Express con params (idItemCarrito)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const removeCartItem = async (req, res, next) => {
  try {
    const { idItemCarrito } = req.params;
    
    await removeCartItemService(idItemCarrito);
    res.sendStatus(204);
  } catch (err) { next(err); }
};

/**
 * Vacía el carrito del usuario actual
 * @param {Object} req - Objeto de solicitud Express con usuario autenticado
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const clearCart = async (req, res, next) => {
  try {
    // Primero obtener el carrito del usuario
    const cart = await getCurrentUserCartService(req.user.idUsuario);
    
    // Luego vaciarlo
    await clearCartService(cart.idCarrito);
    
    res.sendStatus(204);
  } catch (err) { next(err); }
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
