/**
 * Modelo: Evento
 * --------------------------------------------------------------------------
 * Representa eventos organizados por "Salvando Huellas" (adopciones, campañas, etc.).
 *
 *  • Campos principales
 *      idEvento    → clave primaria autoincremental
 *      titulo      → título del evento (2-100 caracteres)
 *      descripcion → descripción detallada del evento
 *      fecha       → fecha programada para el evento
 *      lugar       → ubicación donde se realizará el evento
 *      foto        → ruta de la imagen del evento
 *
 *  • Relaciones
 *      (No tiene relaciones directas con otros modelos por ahora)
 *
 *  • Notas
 *      – Se usa 'timestamps: false' y se gestiona la fecha manualmente.
 *      – Los eventos pueden ser gestionados solo por administradores.
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");

const Evento = sequelize.define("Evento", {
  idEvento: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING(100), allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  fecha: { type: DataTypes.DATE, allowNull: false },
  lugar: { type: DataTypes.STRING(120) },
  foto: { type: DataTypes.STRING }
}, { tableName: 'eventos', timestamps: false });
module.exports = Evento;
