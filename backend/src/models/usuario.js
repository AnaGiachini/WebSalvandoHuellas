/**
 * Modelo: Usuario
 * --------------------------------------------------------------------------
 * Representa a cada persona que interactúa con la plataforma “Salvando Huellas”.
 *
 *  • Campos principales
 *      idUsuario   → clave primaria autoincremental
 *      nombre      → nombre de pila (2-50 caracteres)
 *      apellido    → apellido (2-50 caracteres)
 *      email       → único, usado para iniciar sesión y notificaciones
 *      contrasena  → hash bcrypt de la contraseña
 *      rol         → ‘user’ (por defecto) o ‘admin’
 *
 *  • Relaciones
 *      Usuario 1─N Carrito          (historial de carritos)
 *      Usuario 1─N Compra           (órdenes completadas)
 *      Usuario 1─N Donacion         (donaciones realizadas)
 *      Usuario 1─N SolicitudAdopcion (formularios de adopción enviados)
 *
 *  • Notas
 *      – Se usa ‘timestamps: false’ porque auditaremos las fechas en tablas
 *        de negocio (Compra, Donacion, etc.).
 *      – El sistema aplica borrado en cascada: si se elimina un usuario,
 *        Sequelize elimina automáticamente sus carritos, compras y donaciones
 *        (ver configuraciones en configs/associations.js).
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");

const Usuario = sequelize.define("Usuario", {
  idUsuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false },
  apellido: { type: DataTypes.STRING(50), allowNull: false },
  direccion: { type: DataTypes.STRING(200) },
  telefono: { type: DataTypes.STRING(20) },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  contrasena: { type: DataTypes.STRING, allowNull: false },
  rol: { type: DataTypes.ENUM('admin', 'user'), defaultValue: 'user' }
}, { tableName: 'usuarios', timestamps: false });
module.exports = Usuario;
