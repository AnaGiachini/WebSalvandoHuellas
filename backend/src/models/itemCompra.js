/**
 * Modelo: ItemCompra
 * --------------------------------------------------------------------------
 * Define la estructura de los ítems que componen una compra.
 * Representa cada artículo específico incluido en una compra finalizada.
 * 
 *  • Campos principales
 *      - idItemCompra: Identificador único del ítem de compra
 *      - idCompra: Referencia a la compra a la que pertenece
 *      - idArticulo: Referencia al artículo comprado
 *      - cantidad: Cantidad del artículo adquirida
 *      - precioUnitario: Precio al momento de la compra (histórico)
 *      - subtotal: Precio total para la cantidad de este artículo
 *
 *  • Características
 *      - Captura el precio histórico del artículo al momento de la compra
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