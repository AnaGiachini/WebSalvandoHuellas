/**
 * Modelo: Compra
 * --------------------------------------------------------------------------
 * Representa una transacción de compra finalizada en la plataforma "Salvando Huellas".
 *
 *  • Campos principales
 *      idCompra     → clave primaria autoincremental
 *      idUsuario    → clave foránea del usuario que realizó la compra
 *      fechaCompra  → fecha en que se realizó la transacción
 *      estadoPago   → estado del pago ('pendiente', 'pagado', 'cancelado')
 *      total        → monto total de la compra
 *
 *  • Relaciones
 *      Compra N‐1 Usuario (usuario que realizó la compra)
 *      Compra 1─N ItemCompra (items incluidos en la compra)
 *      Compra N─M Articulo (a través de ItemCompra)
 *
 *  • Notas
 *      – El estado del pago permite hacer seguimiento del proceso de pago.
 *      – El total se calcula automáticamente al finalizar la compra.
 *      – Se usa 'timestamps: false' y se gestiona la fecha manualmente.
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");

const Compra = sequelize.define("Compra", {
  idCompra: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  idUsuario: { type: DataTypes.INTEGER, allowNull: false },
  fechaCompra: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  estadoPago: { type: DataTypes.ENUM('pendiente', 'pagado', 'cancelado'), defaultValue: 'pendiente' },
  total: { type: DataTypes.FLOAT, allowNull: false },
  // Método de pago elegido por el usuario
  metodoPago: { type: DataTypes.ENUM('mercado_pago', 'transferencia'), allowNull: true },
  // Referencias opcionales para integraciones con Mercado Pago
  mp_preference_id: { type: DataTypes.STRING, allowNull: true },
  mp_payment_id: { type: DataTypes.STRING, allowNull: true }
}, { tableName: 'compras', timestamps: false });
module.exports = Compra;