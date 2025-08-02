/**
 * Servicio: Cart
 * --------------------------------------------------------------------------
 * Implementa la lógica de negocio para gestionar el carrito de compras.
 * 
 *  • Operaciones principales
 *      createCartService         → crea un nuevo carrito para un usuario
 *      getCartByIdService        → obtiene un carrito por ID
 *      getCurrentUserCartService → obtiene el carrito activo del usuario actual
 *      addItemToCartService      → añade un artículo al carrito
 *      updateCartItemService     → actualiza la cantidad de un artículo en el carrito
 *      removeCartItemService     → elimina un artículo del carrito
 *      clearCartService          → elimina todos los artículos del carrito
 *      
 *  • Características
 *      - Validación de disponibilidad de stock
 *      - Gestión automática de creación de carrito si no existe
 *      - Manejo de errores con mensajes descriptivos
 */

const Carrito = require('../models/carrito');
const ItemCarrito = require('../models/itemCarrito');
const Articulo = require('../models/articulo');
const AppError = require('../utils/AppError');

/**
 * Crea un nuevo carrito para un usuario
 * @param {number} idUsuario - ID del usuario propietario del carrito
 * @returns {Promise<Object>} Carrito creado
 */
const createCartService = async (idUsuario) => {
  const cart = await Carrito.create({ idUsuario });
  return cart;
};

/**
 * Obtiene un carrito específico por su ID
 * @param {number} idCarrito - ID del carrito a buscar
 * @returns {Promise<Object>} Carrito con sus ítems
 * @throws {AppError} Si no se encuentra el carrito
 */
const getCartByIdService = async (idCarrito) => {
  const cart = await Carrito.findByPk(idCarrito, {
    include: [{
      model: ItemCarrito,
      include: [Articulo]
    }]
  });
  
  if (!cart) {
    throw new AppError('Carrito no encontrado', 404);
  }
  
  return cart;
};

/**
 * Obtiene o crea el carrito activo para un usuario
 * @param {number} idUsuario - ID del usuario
 * @returns {Promise<Object>} Carrito activo con sus ítems
 */
const getCurrentUserCartService = async (idUsuario) => {
  // Buscar el carrito más reciente del usuario
  let cart = await Carrito.findOne({
    where: { idUsuario },
    order: [['fecha', 'DESC']],
    include: [{
      model: ItemCarrito,
      include: [Articulo]
    }]
  });
  
  // Si no existe carrito, crear uno nuevo
  if (!cart) {
    cart = await createCartService(idUsuario);
    // Cargar el carrito recién creado con sus relaciones
    cart = await getCartByIdService(cart.idCarrito);
  }
  
  return cart;
};

/**
 * Añade un artículo al carrito del usuario
 * @param {number} idCarrito - ID del carrito
 * @param {number} idArticulo - ID del artículo a añadir
 * @param {number} cantidad - Cantidad del artículo a añadir
 * @returns {Promise<Object>} Ítem añadido al carrito
 * @throws {AppError} Si no hay suficiente stock o el artículo no existe
 */
const addItemToCartService = async (idCarrito, idArticulo, cantidad) => {
  // Validar que el artículo exista y tenga suficiente stock
  const articulo = await Articulo.findByPk(idArticulo);
  if (!articulo) {
    throw new AppError('Artículo no encontrado', 404);
  }
  
  if (articulo.stock < cantidad) {
    throw new AppError('Stock insuficiente', 400);
  }
  
  // Verificar si el artículo ya está en el carrito
  let cartItem = await ItemCarrito.findOne({
    where: { idCarrito, idArticulo }
  });
  
  // Si ya existe, actualizar la cantidad
  if (cartItem) {
    const newQuantity = cartItem.cantidad + cantidad;
    
    // Validar stock nuevamente con la cantidad total
    if (articulo.stock < newQuantity) {
      throw new AppError('Stock insuficiente para la cantidad total', 400);
    }
    
    cartItem.cantidad = newQuantity;
    await cartItem.save();
  } else {
    // Si no existe, crear nuevo ítem
    cartItem = await ItemCarrito.create({
      idCarrito,
      idArticulo,
      cantidad
    });
  }
  
  // Retornar el ítem con información del artículo
  return ItemCarrito.findByPk(cartItem.idItemCarrito, {
    include: [Articulo]
  });
};

/**
 * Actualiza la cantidad de un artículo en el carrito
 * @param {number} idItemCarrito - ID del ítem de carrito
 * @param {number} cantidad - Nueva cantidad
 * @returns {Promise<Object>} Ítem actualizado
 * @throws {AppError} Si no hay suficiente stock o el ítem no existe
 */
const updateCartItemService = async (idItemCarrito, cantidad) => {
  const cartItem = await ItemCarrito.findByPk(idItemCarrito, {
    include: [Articulo]
  });
  
  if (!cartItem) {
    throw new AppError('Ítem no encontrado en el carrito', 404);
  }
  
  // Si cantidad es 0, eliminar ítem
  if (cantidad <= 0) {
    await cartItem.destroy();
    return { message: 'Ítem eliminado del carrito' };
  }
  
  // Validar stock
  if (cartItem.Articulo.stock < cantidad) {
    throw new AppError('Stock insuficiente', 400);
  }
  
  // Actualizar cantidad
  cartItem.cantidad = cantidad;
  await cartItem.save();
  
  return cartItem;
};

/**
 * Elimina un artículo del carrito
 * @param {number} idItemCarrito - ID del ítem de carrito a eliminar
 * @returns {Promise<Object>} Mensaje de confirmación
 * @throws {AppError} Si el ítem no existe
 */
const removeCartItemService = async (idItemCarrito) => {
  const cartItem = await ItemCarrito.findByPk(idItemCarrito);
  
  if (!cartItem) {
    throw new AppError('Ítem no encontrado en el carrito', 404);
  }
  
  await cartItem.destroy();
  return { message: 'Ítem eliminado del carrito' };
};

/**
 * Elimina todos los ítems de un carrito
 * @param {number} idCarrito - ID del carrito a vaciar
 * @returns {Promise<Object>} Mensaje de confirmación
 * @throws {AppError} Si el carrito no existe
 */
const clearCartService = async (idCarrito) => {
  const cart = await Carrito.findByPk(idCarrito);
  
  if (!cart) {
    throw new AppError('Carrito no encontrado', 404);
  }
  
  // Eliminar todos los ítems asociados
  await ItemCarrito.destroy({
    where: { idCarrito }
  });
  
  return { message: 'Carrito vaciado correctamente' };
};

module.exports = {
  createCartService,
  getCartByIdService,
  getCurrentUserCartService,
  addItemToCartService,
  updateCartItemService,
  removeCartItemService,
  clearCartService
};
