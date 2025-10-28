/**
 * Modelo: SolicitudAdopcion
 * --------------------------------------------------------------------------
 * Representa las solicitudes de adopción de animales en la plataforma "Salvando Huellas".
 *
 *  • Campos principales
 *      idSolicitud    → clave primaria autoincremental
 *      idUsuario      → clave foránea del usuario solicitante
 *      idAnimal       → clave foránea del animal que se desea adoptar
 *      estado         → estado del proceso ('pendiente', 'aprobada', 'rechazada')
 *      fechaSolicitud → fecha en que se realizó la solicitud
 *      
 *  • Datos del adoptante (snapshot al momento de la solicitud)
 *      nombre         → nombre del solicitante
 *      apellido       → apellido del solicitante
 *      email          → email del solicitante
 *      telefono       → teléfono de contacto
 *      direccion      → dirección actual
 *      experienciaPrevia → experiencia con mascotas
 *      motivacion     → razón para adoptar
 *
 *  • Relaciones
 *      SolicitudAdopcion N‐1 Usuario (usuario que solicitó la adopción)
 *      SolicitudAdopcion N‐1 Animal (animal que se desea adoptar)
 *
 *  • Notas
 *      – Se usa 'timestamps: false' y se gestiona la fecha manualmente.
 *      – El estado 'pendiente' se establece por defecto al crear la solicitud.
 *      – Solo los administradores pueden cambiar el estado de una solicitud.
 *      – Se guarda snapshot de datos del adoptante para mantener registro histórico.
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");

const SolicitudAdopcion = sequelize.define("SolicitudAdopcion", {
  idSolicitud: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  idUsuario: { type: DataTypes.INTEGER, allowNull: false },
  idAnimal: { type: DataTypes.INTEGER, allowNull: false },
  estado: { type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada'), defaultValue: 'pendiente' },
  fechaSolicitud: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  // Snapshot de datos del adoptante
  nombre: { type: DataTypes.STRING(50), allowNull: false },
  apellido: { type: DataTypes.STRING(50), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false },
  telefono: { type: DataTypes.STRING(20), allowNull: false },
  direccion: { type: DataTypes.STRING(200), allowNull: false },
  experienciaPrevia: { type: DataTypes.TEXT, allowNull: true },
  motivacion: { type: DataTypes.TEXT, allowNull: true }
}, { tableName: 'solicitudes_adopcion', timestamps: false });
module.exports = SolicitudAdopcion;
