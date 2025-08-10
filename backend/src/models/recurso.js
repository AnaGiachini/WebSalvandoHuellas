/**
 * Modelo: Recurso
 * --------------------------------------------------------------------------
 * Representa recursos informativos y educativos ofrecidos por "Salvando Huellas".
 *
 *  • Campos principales
 *      idRecurso   → clave primaria autoincremental
 *      nombre      → nombre del recurso (2-80 caracteres)
 *      descripcion → descripción detallada del recurso
 *      foto        → ruta de la imagen del recurso
 *
 *  • Relaciones
 *      (No tiene relaciones directas con otros modelos por ahora)
 *
 *  • Notas
 *      – Se usa 'timestamps: false' para simplificar el modelo.
 *      – Los recursos pueden incluir guías, material educativo, infografías, etc.
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");

const Recurso = sequelize.define("Recurso", {
  idRecurso: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(80), allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  foto: { type: DataTypes.STRING }
}, { tableName: 'recursos', timestamps: false });
module.exports = Recurso; 