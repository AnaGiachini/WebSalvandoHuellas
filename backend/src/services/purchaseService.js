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

const sequelize = require('../configs/db');
const AppError = require('../utils/AppError');

const Compra = require('../models/compra');
const ItemCompra = require('../models/itemCompra');
const Articulo = require('../models/articulo');
const Carrito = require('../models/carrito');
const ItemCarrito = require('../models/itemCarrito');

/**
 * Crea una nueva compra a partir del carrito de un usuario
 * @param {number} idCarrito
 * @param {number} idUsuario
 * @returns {Promise<Object>} Compra creada con sus ítems
 */
const createPurchaseService = async (idCarrito, idUsuario) => {
  const t = await sequelize.transaction();
  try {
    // Traer carrito + items + artículo (con alias correctos)
    const cart = await Carrito.findByPk(idCarrito, {
      include: [
        {
          model: ItemCarrito,
          as: 'items',
          include: [{ model: Articulo, as: 'articulo', attributes: ['idArticulo', 'nombre', 'precio', 'stock'] }]
        }
      ],
      transaction: t
    });

    if (!cart) throw new AppError(404, 'Carrito no encontrado');
    if (!cart.items || cart.items.length === 0) throw new AppError(400, 'El carrito está vacío');

    // Verificar stock y calcular total
    let total = 0;
    for (const it of cart.items) {
      if (!it.articulo) throw new AppError(400, 'Artículo no encontrado en item del carrito');
      if (it.cantidad > it.articulo.stock) {
        throw new AppError(400, `Stock insuficiente para ${it.articulo.nombre}`);
      }
      total += it.cantidad * it.articulo.precio;
    }

    // Crear compra en estado pendiente
    const purchase = await Compra.create(
      { idUsuario, total, estadoPago: 'pendiente' },
      { transaction: t }
    );

    // Crear ítems de compra y descontar stock
    for (const it of cart.items) {
      await ItemCompra.create(
        {
          idCompra: purchase.idCompra,
          idArticulo: it.idArticulo, // viene del ItemCarrito
          cantidad: it.cantidad,
          precioUnitario: it.articulo.precio,
          // ⚠️ si tu modelo ItemCompra NO tiene "subtotal", comenta la línea siguiente:
          subtotal: it.cantidad * it.articulo.precio
        },
        { transaction: t }
      );

      // Descontar stock
      await Articulo.update(
        { stock: it.articulo.stock - it.cantidad },
        { where: { idArticulo: it.idArticulo }, transaction: t }
      );
    }

    // Vaciar carrito
    await ItemCarrito.destroy({ where: { idCarrito }, transaction: t });

    await t.commit();

    // Devolver la compra ya con include y alias correctos
    return await getPurchaseByIdService(purchase.idCompra);
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

/**
 * Obtiene una compra específica por su ID (incluye items y artículo)
 */
const getPurchaseByIdService = async (idCompra) => {
  const purchase = await Compra.findByPk(idCompra, {
    include: [
      {
        model: ItemCompra,
        as: 'items', // alias de Compra.hasMany(ItemCompra)
        attributes: ['idItemCompra', 'idArticulo', 'cantidad', 'precioUnitario', 'subtotal'],
        include: [
          { model: Articulo, as: 'articulo', attributes: ['idArticulo', 'nombre', 'precio'] } // alias de ItemCompra.belongsTo(Articulo)
        ]
      }
    ]
  });

  if (!purchase) throw new AppError(404, 'Compra no encontrada');
  return purchase;
};

/**
 * Obtiene todas las compras de un usuario (incluye items y artículo)
 */
const getUserPurchasesService = async (idUsuario) => {
  const purchases = await Compra.findAll({
    where: { idUsuario },
    include: [
      {
        model: ItemCompra,
        as: 'items',
        attributes: ['idItemCompra', 'idArticulo', 'cantidad', 'precioUnitario', 'subtotal'],
        include: [
          { model: Articulo, as: 'articulo', attributes: ['idArticulo', 'nombre', 'precio'] }
        ]
      }
    ],
    order: [['fechaCompra', 'DESC']]
  });

  return purchases;
};

/**
 * Actualiza el estado de pago de una compra
 * @param {number} idCompra
 * @param {('pendiente'|'pagado'|'cancelado')} estadoPago
 */
const updatePurchaseStatusService = async (idCompra, estadoPago) => {
  const validStates = ['pendiente', 'pagado', 'cancelado'];
  if (!validStates.includes(estadoPago)) throw new AppError(400, 'Estado de pago inválido');

  const purchase = await Compra.findByPk(idCompra);
  if (!purchase) throw new AppError(404, 'Compra no encontrada');

  if (purchase.estadoPago === 'pagado' && estadoPago === 'cancelado') {
    throw new AppError(400, 'No se puede cancelar una compra ya pagada');
  }

  // Si cancelás una compra pendiente, devolver stock
  if (purchase.estadoPago === 'pendiente' && estadoPago === 'cancelado') {
    const t = await sequelize.transaction();
    try {
      const purchaseItems = await ItemCompra.findAll({ where: { idCompra }, transaction: t });
      for (const it of purchaseItems) {
        const art = await Articulo.findByPk(it.idArticulo, { transaction: t });
        if (art) {
          await art.update({ stock: art.stock + it.cantidad }, { transaction: t });
        }
      }
      await purchase.update({ estadoPago }, { transaction: t });
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  } else {
    await purchase.update({ estadoPago });
  }

  // devolver actualizada con include
  return await getPurchaseByIdService(idCompra);
};

module.exports = {
  createPurchaseService,
  getPurchaseByIdService,
  getUserPurchasesService,
  updatePurchaseStatusService
};