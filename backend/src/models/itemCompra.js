/**
 * Modelo: ItemCompra
 * --------------------------------------------------------------------------
 * Representa un artículo específico incluido en una compra finalizada.
 *
 *  • Campos principales
 *      idItemCompra   → clave primaria autoincremental
 *      idCompra       → clave foránea de la compra a la que pertenece
 *      idArticulo     → clave foránea del artículo comprado
 *      cantidad       → cantidad del artículo adquirido
 *      precioUnitario → precio unitario del artículo al momento de la compra
 *      subtotal       → precio total para este ítem (cantidad * precioUnitario)
 *
 *  • Relaciones
 *      ItemCompra N‐1 Compra (compra a la que pertenece)
 *      ItemCompra N‐1 Articulo (artículo comprado)
 *
 *  • Notas
 *      – Actúa como tabla intermedia en la relación muchos a muchos entre Compra y Articulo.
 *      – Almacena el precio al momento de la compra para mantener un historial exacto.
 *      – El subtotal se calcula automáticamente (cantidad * precioUnitario).
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");

const ItemCompra = sequelize.define("ItemCompra", {
  idItemCompra: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  idCompra: { type: DataTypes.INTEGER, allowNull: false },
  idArticulo: { type: DataTypes.INTEGER, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  precioUnitario: { type: DataTypes.FLOAT, allowNull: false },
  subtotal: { type: DataTypes.FLOAT, allowNull: false }
}, { tableName: 'items_compra', timestamps: false });
module.exports = ItemCompra;