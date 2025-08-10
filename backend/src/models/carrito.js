/**
 * Modelo: Carrito
 * --------------------------------------------------------------------------
 * Representa el carrito de compras de un usuario en la plataforma "Salvando Huellas".
 *
 *  • Campos principales
 *      idCarrito   → clave primaria autoincremental
 *      idUsuario   → clave foránea del usuario propietario del carrito
 *      fecha       → fecha de creación del carrito
 *
 *  • Relaciones
 *      Carrito N‐1 Usuario (propietario del carrito)
 *      Carrito 1─N ItemCarrito (items en el carrito)
 *      Carrito N─M Articulo (a través de ItemCarrito)
 *
 *  • Notas
 *      – Un usuario puede tener múltiples carritos (histórico).
 *      – La fecha del carrito se establece automáticamente al crear un nuevo carrito.
 *      – Se usa 'timestamps: false' y se gestiona la fecha manualmente.
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");

const Carrito = sequelize.define("Carrito", {
  idCarrito: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  idUsuario: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'carritos', timestamps: false });
module.exports = Carrito; 