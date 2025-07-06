/**
 * Configuración de Asociaciones: Relaciones entre modelos
 * --------------------------------------------------------------------------
 * Define las relaciones entre los modelos de la plataforma "Salvando Huellas".
 *
 *  • Tipos de relaciones implementadas
 *      One-to-Many (1:N)   → Un modelo puede tener muchas instancias de otro modelo
 *                            Usuario tiene muchos Carritos (Usuario 1:N Carrito)
 *      Many-to-One (N:1)   → Muchas instancias de un modelo pertenecen a una instancia de otro
 *                            Muchos Carritos pertenecen a un Usuario (Carrito N:1 Usuario)
 *      Many-to-Many (N:M)  → Relación bidireccional a través de una tabla intermedia
 *                            Carrito y Articulo a través de ItemCarrito
 *
 *  • Secciones principales
 *      - Relaciones de Usuario      → con Carrito, Compra, Donacion, SolicitudAdopcion
 *      - Relaciones Carrito-Articulo → a través de ItemCarrito
 *      - Relaciones Compra-Articulo → a través de ItemCompra
 *      - Relaciones Animal-Solicitud → Animal con SolicitudAdopcion
 *
 *  • Notas importantes
 *      – Se aplica 'CASCADE' para operaciones DELETE y UPDATE, asegurando la
 *        integridad referencial automática.
 *      – Los alias ('as') permiten acceder fácilmente a las relaciones al hacer consultas.
 *      – Cada relación se configura simétricamente (hasMany/belongsTo, belongsToMany).
 */

const Articulo = require("../models/articulo");
const Carrito = require("../models/carrito");
const ItemCarrito = require("../models/itemCarrito");
const ItemCompra = require("../models/itemCompra");
const Compra = require("../models/compra");
const Donacion = require("../models/donacion");
const SolicitudAdopcion = require("../models/solicitudAdopcion");
const Usuario = require("../models/usuario");
const Animal = require("../models/animal");

const associations = () => {
  
  /* ───────────────────────────  USUARIO  ─────────────────────────────── */
  /**
   * Relaciones del Usuario con otras entidades
   * 
   * Usuario 1:N Carrito            → Un usuario puede tener varios carritos
   * Usuario 1:N Compra             → Un usuario puede realizar varias compras
   * Usuario 1:N Donacion           → Un usuario puede hacer varias donaciones
   * Usuario 1:N SolicitudAdopcion  → Un usuario puede solicitar varias adopciones
   */
  Usuario.hasMany(Carrito, { foreignKey: 'idUsuario', as: 'carritos', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  Carrito.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });

  Usuario.hasMany(Compra, { foreignKey: 'idUsuario', as: 'compras', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  Compra.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });

  Usuario.hasMany(Donacion, { foreignKey: 'idUsuario', as: 'donaciones', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  Donacion.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });

  Usuario.hasMany(SolicitudAdopcion, { foreignKey: 'idUsuario', as: 'solicitudes', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  SolicitudAdopcion.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });

  /* ─────────────────────  CARRITO  ↔  ITEMCARRITO  ↔  ARTICULO ───────── */
  /**
   * Relación Many-to-Many entre Carrito y Articulo
   * 
   * Carrito 1:N ItemCarrito       → Un carrito contiene varios items
   * Articulo 1:N ItemCarrito      → Un artículo puede estar en varios items de carrito
   * Carrito N:M Articulo          → Relación muchos a muchos a través de ItemCarrito
   */
  Carrito.hasMany(ItemCarrito, { foreignKey: 'idCarrito', as: 'items', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  ItemCarrito.belongsTo(Carrito, { foreignKey: 'idCarrito', as: 'carrito' });

  Articulo.hasMany(ItemCarrito, { foreignKey: 'idArticulo', as: 'itemsCarrito', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  ItemCarrito.belongsTo(Articulo, { foreignKey: 'idArticulo', as: 'articulo' });

  /*  Many-to-Many declarativa: Carrito ⇄ Articulo mediante ItemCarrito    */
  Carrito.belongsToMany(Articulo, { through: ItemCarrito, foreignKey: 'idCarrito', otherKey: 'idArticulo', as: 'articulos' });
  Articulo.belongsToMany(Carrito, { through: ItemCarrito, foreignKey: 'idArticulo', otherKey: 'idCarrito', as: 'carritos' });

  /* ──────────────────────  COMPRA  ↔  ITEMCOMPRA  ↔  ARTICULO ────────── */
  /**
   * Relación Many-to-Many entre Compra y Articulo
   * 
   * Compra 1:N ItemCompra         → Una compra contiene varios items
   * Articulo 1:N ItemCompra       → Un artículo puede estar en varios items de compra
   * Compra N:M Articulo           → Relación muchos a muchos a través de ItemCompra
   */
  Compra.hasMany(ItemCompra, { foreignKey: 'idCompra', as: 'items', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  ItemCompra.belongsTo(Compra, { foreignKey: 'idCompra', as: 'compra' });

  Articulo.hasMany(ItemCompra, { foreignKey: 'idArticulo', as: 'itemsCompra', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  ItemCompra.belongsTo(Articulo, { foreignKey: 'idArticulo', as: 'articulo' });

  /*  Many-to-Many declarativa: Compra ⇄ Articulo mediante ItemCompra      */
  Compra.belongsToMany(Articulo, { through: ItemCompra, foreignKey: 'idCompra', otherKey: 'idArticulo', as: 'articulos' });
  Articulo.belongsToMany(Compra, { through: ItemCompra, foreignKey: 'idArticulo', otherKey: 'idCompra', as: 'compras' });

  /* ──────────────────────  ANIMAL  ↔  SOLICITUDADOPCION ──────────────── */
  /**
   * Relación One-to-Many entre Animal y SolicitudAdopcion
   * 
   * Animal 1:N SolicitudAdopcion  → Un animal puede recibir múltiples solicitudes de adopción
   *                                de diferentes usuarios, pero solo una puede ser aprobada,
   *                                ya que un animal solo puede ser adoptado por un único usuario.
   */
  Animal.hasMany(SolicitudAdopcion, { foreignKey: 'idAnimal', as: 'solicitudes', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  SolicitudAdopcion.belongsTo(Animal, { foreignKey: 'idAnimal', as: 'animal' });

  /* ───────  Evento y Recurso no tienen relaciones adicionales por ahora  */
};
module.exports = associations;
