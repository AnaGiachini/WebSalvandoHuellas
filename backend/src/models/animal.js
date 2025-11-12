/**
 * Modelo: Animal
 * --------------------------------------------------------------------------
 * Representa a los animales registrados en la plataforma "Salvando Huellas".
 *
 *  • Campos principales
 *      idAnimal      → clave primaria autoincremental
 *      nombre        → nombre del animal (2-50 caracteres)
 *      especie       → 'perro' o 'gato'
 *      sexo          → 'macho' o 'hembra'
 *      edad          → edad en años
 *      tamano        → tamaño del animal (pequeño, mediano, grande)
 *      historia      → descripción de la historia del animal
 *      estadoAdopcion → estado de adopción ('adoptado', 'en_proceso', 'sin_hogar')
 *      foto          → ruta de la imagen del animal
 *
 *  • Relaciones
 *      Animal 1─N SolicitudAdopcion (solicitudes de adopción para el animal)
 *
 *  • Notas
 *      – Se usa 'timestamps: false' para gestionar manualmente los tiempos.
 *      – El campo 'estadoAdopcion' indica el estado actual del animal en el proceso de adopción.
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");

const Animal = sequelize.define("Animal", {
  idAnimal: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false },
  especie: { type: DataTypes.ENUM('perro', 'gato'), allowNull: false },
  sexo: { type: DataTypes.ENUM('macho', 'hembra'), allowNull: false },
  edad: { type: DataTypes.ENUM('cachorro', 'joven', 'adulto', 'adulto mayor'), allowNull: false },
  tamano: { type: DataTypes.ENUM('pequeño', 'mediano', 'grande'), allowNull: false },
  historia: { type: DataTypes.TEXT },
  estadoAdopcion: { 
    type: DataTypes.ENUM('adoptado', 'en_proceso', 'sin_hogar'), 
    defaultValue: 'sin_hogar', 
    allowNull: false 
  },
  foto: { type: DataTypes.STRING }
}, { tableName: 'animales', timestamps: false });
module.exports = Animal;