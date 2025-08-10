/**
 * Modelo: ItemCarrito
 * --------------------------------------------------------------------------
 * Representa un artículo específico dentro de un carrito de compras.
 *
 *  • Campos principales
 *      idItemCarrito → clave primaria autoincremental
 *      idCarrito     → clave foránea del carrito al que pertenece
 *      idArticulo    → clave foránea del artículo incluido
 *      cantidad      → cantidad del artículo en el carrito
 *
 *  • Relaciones
 *      ItemCarrito N‐1 Carrito (carrito al que pertenece)
 *      ItemCarrito N‐1 Articulo (artículo incluido)
 *
 *  • Notas
 *      – Actúa como tabla intermedia en la relación muchos a muchos entre Carrito y Articulo.
 *      – La cantidad por defecto es 1 si no se especifica.
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");

const ItemCarrito = sequelize.define("ItemCarrito", {
  idItemCarrito: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  idCarrito: { type: DataTypes.INTEGER, allowNull: false },
  idArticulo: { type: DataTypes.INTEGER, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
}, { tableName: 'items_carrito', timestamps: false });
module.exports = ItemCarrito;