/**
 * Modelo: Articulo
 * --------------------------------------------------------------------------
 * Representa los productos disponibles para venta en la tienda de "Salvando Huellas".
 *
 *  • Campos principales
 *      idArticulo  → clave primaria autoincremental
 *      nombre      → nombre del artículo (2-80 caracteres)
 *      descripcion → descripción detallada del artículo
 *      precio      → precio unitario del artículo
 *      stock       → cantidad disponible en inventario
 *      foto        → ruta de la imagen del artículo
 *
 *  • Relaciones
 *      Articulo N─M Carrito (a través de ItemCarrito)
 *      Articulo N─M Compra (a través de ItemCompra)
 *
 *  • Notas
 *      – Se usa 'timestamps: false' porque se manejan los tiempos en las tablas 
 *        de transacciones (Compra, Carrito).
 *      – El stock se actualiza automáticamente al procesar compras.
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");

const Articulo = sequelize.define("Articulo", {
  idArticulo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(80), allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  precio: { type: DataTypes.FLOAT, allowNull: false },
  stock: { type: DataTypes.INTEGER, allowNull: false },
  foto: { type: DataTypes.STRING }
}, { tableName: 'articulos', timestamps: false });
module.exports = Articulo;