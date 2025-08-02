/**
 * Servicio: Purchase
 * --------------------------------------------------------------------------
 * Implementa la lógica de negocio para gestionar las compras y pagos.
 * 
 *  • Operaciones principales
 *      createPurchaseService      → convierte un carrito en una compra finalizada
 *      getPurchaseByIdService     → obtiene una compra por ID
 *      getUserPurchasesService    → lista las compras de un usuario
 *      updatePurchaseStatusService → actualiza el estado de pago de una compra
 *      
 *  • Características
 *      - Cálculo automático de totales y subtotales
 *      - Actualización de stock al finalizar una compra
 *      - Validaciones de stock disponible
 *      - Manejo de estados de pago
 */

const Compra = require('../models/compra');
const ItemCompra = require('../models/itemCompra');
const Articulo = require('../models/articulo');
const Carrito = require('../models/carrito');
const ItemCarrito = require('../models/itemCarrito');
const AppError = require('../utils/AppError');
const sequelize = require('../configs/db');

/**
 * Crea una nueva compra a partir del carrito de un usuario
 * @param {number} idCarrito - ID del carrito a convertir en compra
 * @param {number} idUsuario - ID del usuario que realiza la compra
 * @returns {Promise<Object>} Compra creada con sus ítems
 * @throws {AppError} Si el carrito no existe o está vacío
 */
const createPurchaseService = async (idCarrito, idUsuario) => {
  // Usar transacción para asegurar integridad
  const transaction = await sequelize.transaction();
  
  try {
    // Verificar si el carrito existe y tiene ítems
    const cart = await Carrito.findByPk(idCarrito, {
      include: [{
        model: ItemCarrito,
        include: [Articulo]
      }],
      transaction
    });
    
    if (!cart) {
      throw new AppError('Carrito no encontrado', 404);
    }
    
    if (!cart.ItemCarritos || cart.ItemCarritos.length === 0) {
      throw new AppError('El carrito está vacío', 400);
    }
    
    // Calcular total de la compra
    let total = 0;
    
    // Verificar stock de todos los artículos
    for (const item of cart.ItemCarritos) {
      if (item.cantidad > item.Articulo.stock) {
        throw new AppError(`Stock insuficiente para ${item.Articulo.nombre}`, 400);
      }
      total += item.cantidad * item.Articulo.precio;
    }
    
    // Crear la compra
    const purchase = await Compra.create({
      idUsuario,
      total,
      estadoPago: 'pendiente'
    }, { transaction });
    
    // Crear los ítems de compra y actualizar stock
    for (const item of cart.ItemCarritos) {
      // Crear ítem de compra
      await ItemCompra.create({
        idCompra: purchase.idCompra,
        idArticulo: item.idArticulo,
        cantidad: item.cantidad,
        precioUnitario: item.Articulo.precio,
        subtotal: item.cantidad * item.Articulo.precio
      }, { transaction });
      
      // Actualizar stock del artículo
      const articulo = await Articulo.findByPk(item.idArticulo, { transaction });
      articulo.stock -= item.cantidad;
      await articulo.save({ transaction });
    }
    
    // Eliminar los ítems del carrito
    await ItemCarrito.destroy({
      where: { idCarrito },
      transaction
    });
    
    // Confirmar transacción
    await transaction.commit();
    
    // Retornar la compra creada con todos sus ítems
    return getPurchaseByIdService(purchase.idCompra);
    
  } catch (error) {
    // Revertir transacción en caso de error
    await transaction.rollback();
    throw error;
  }
};

/**
 * Obtiene una compra específica por su ID
 * @param {number} idCompra - ID de la compra
 * @returns {Promise<Object>} Compra con sus ítems
 * @throws {AppError} Si la compra no existe
 */
const getPurchaseByIdService = async (idCompra) => {
  const purchase = await Compra.findByPk(idCompra, {
    include: [{
      model: ItemCompra,
      include: [Articulo]
    }]
  });
  
  if (!purchase) {
    throw new AppError('Compra no encontrada', 404);
  }
  
  return purchase;
};

/**
 * Obtiene todas las compras de un usuario
 * @param {number} idUsuario - ID del usuario
 * @returns {Promise<Array>} Lista de compras del usuario
 */
const getUserPurchasesService = async (idUsuario) => {
  const purchases = await Compra.findAll({
    where: { idUsuario },
    include: [{
      model: ItemCompra,
      include: [Articulo]
    }],
    order: [['fechaCompra', 'DESC']]
  });
  
  return purchases;
};

/**
 * Actualiza el estado de pago de una compra
 * @param {number} idCompra - ID de la compra
 * @param {string} estadoPago - Nuevo estado ('pendiente', 'pagado', 'cancelado')
 * @returns {Promise<Object>} Compra actualizada
 * @throws {AppError} Si la compra no existe o el estado es inválido
 */
const updatePurchaseStatusService = async (idCompra, estadoPago) => {
  // Validar estado
  const validStates = ['pendiente', 'pagado', 'cancelado'];
  if (!validStates.includes(estadoPago)) {
    throw new AppError('Estado de pago inválido', 400);
  }
  
  const purchase = await Compra.findByPk(idCompra);
  
  if (!purchase) {
    throw new AppError('Compra no encontrada', 404);
  }
  
  // Si se cancela una compra pagada, manejar lógica específica
  if (purchase.estadoPago === 'pagado' && estadoPago === 'cancelado') {
    throw new AppError('No se puede cancelar una compra ya pagada', 400);
  }
  
  // Si se cancela una compra pendiente, devolver stock
  if (purchase.estadoPago === 'pendiente' && estadoPago === 'cancelado') {
    // Usar transacción para asegurar integridad
    const transaction = await sequelize.transaction();
    
    try {
      // Obtener ítems de la compra
      const purchaseItems = await ItemCompra.findAll({
        where: { idCompra },
        transaction
      });
      
      // Devolver stock de cada artículo
      for (const item of purchaseItems) {
        const articulo = await Articulo.findByPk(item.idArticulo, { transaction });
        articulo.stock += item.cantidad;
        await articulo.save({ transaction });
      }
      
      // Actualizar estado
      purchase.estadoPago = estadoPago;
      await purchase.save({ transaction });
      
      // Confirmar transacción
      await transaction.commit();
    } catch (error) {
      // Revertir transacción en caso de error
      await transaction.rollback();
      throw error;
    }
  } else {
    // Actualizar estado normalmente
    purchase.estadoPago = estadoPago;
    await purchase.save();
  }
  
  return purchase;
};

module.exports = {
  createPurchaseService,
  getPurchaseByIdService,
  getUserPurchasesService,
  updatePurchaseStatusService
};
