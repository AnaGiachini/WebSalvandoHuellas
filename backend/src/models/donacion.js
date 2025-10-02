/**
 * Modelo: Donacion
 * --------------------------------------------------------------------------
 * Representa las donaciones monetarias realizadas a "Salvando Huellas".
 *
 *  • Campos principales
 *      idDonacion    → clave primaria autoincremental
 *      idUsuario     → clave foránea del usuario donante
 *      monto         → cantidad donada
 *      fechaDonacion → fecha en que se realizó la donación
 *
 *  • Relaciones
 *      Donacion N‐1 Usuario (usuario que realizó la donación)
 *
 *  • Notas
 *      – Se usa 'timestamps: false' y se gestiona la fecha manualmente.
 *      – Las donaciones son siempre monetarias en esta implementación.
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");

const Donacion = sequelize.define("Donacion", {
  idDonacion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  idUsuario: { type: DataTypes.INTEGER, allowNull: false },
  monto: { type: DataTypes.FLOAT, allowNull: false },
  fechaDonacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  estadoPago: { type: DataTypes.ENUM('pendiente', 'pagado', 'cancelado'), defaultValue: 'pendiente' },
  metodoPago: { type: DataTypes.ENUM('mercado_pago', 'transferencia'), allowNull: true },
  mp_preference_id: { type: DataTypes.STRING, allowNull: true },
  mp_payment_id: { type: DataTypes.STRING, allowNull: true }
}, { tableName: 'donaciones', timestamps: false });
module.exports = Donacion;