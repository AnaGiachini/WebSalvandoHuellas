/**
 * Modelo: Animal
 * --------------------------------------------------------------------------
 * Representa a los animales registrados en la plataforma "Salvando Huellas".
 *
 *  • Campos principales
 *      idAnimal    → clave primaria autoincremental
 *      nombre      → nombre del animal (2-50 caracteres)
 *      sexo        → 'macho' o 'hembra'
 *      edad        → edad en años
 *      tamano      → tamaño del animal (pequeño, mediano, grande)
 *      historia    → descripción de la historia del animal
 *      adoptado    → estado de adopción (true/false)
 *      foto        → ruta de la imagen del animal
 *
 *  • Relaciones
 *      Animal 1─N SolicitudAdopcion (solicitudes de adopción para el animal)
 *
 *  • Notas
 *      – Se usa 'timestamps: false' para gestionar manualmente los tiempos.
 *      – El campo 'adoptado' indica si el animal ha sido adoptado.
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");

const Animal = sequelize.define("Animal", {
  idAnimal: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false },
  sexo: { type: DataTypes.ENUM('macho', 'hembra'), allowNull: false },
  edad: { type: DataTypes.INTEGER },
  tamano: { type: DataTypes.STRING(20) },
  historia: { type: DataTypes.TEXT },
  adoptado: { type: DataTypes.BOOLEAN, defaultValue: false },
  foto: { type: DataTypes.STRING }
}, { tableName: 'animales', timestamps: false });
module.exports = Animal;