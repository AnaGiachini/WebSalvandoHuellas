/**
 * Test: purchaseAPI
 * --------------------------------------------------------------------------
 * Tests de integración para las rutas de API relacionadas con compras.
 */

const request = require('supertest');
const app = require("../../app");
const Compra = require("../../src/models/compra");
const Usuario = require("../../src/models/usuario");
const Carrito = require("../../src/models/carrito");
const ItemCarrito = require("../../src/models/itemCarrito");
const Articulo = require("../../src/models/articulo");
const ItemCompra = require("../../src/models/itemCompra");
const { generate } = require("../../src/utils/jwt");
const resetDatabase = require("../../src/utils/resetDatabase.helper");
const bcrypt = require('bcryptjs');

// Importar y ejecutar las asociaciones para evitar errores de SequelizeEagerLoadingError
const associations = require("../../src/configs/associations");
associations();

describe("purchaseAPI", () => {
  let adminToken;
  let userToken;
  let adminId;
  let userId;
  let compraId;
  let carritoId;
  let articuloId;
  
  // Generar emails únicos con timestamp para evitar conflictos
  const timestamp = Date.now();
  const adminEmail = `admin_${timestamp}@test.com`;
  const clienteEmail = `cliente_${timestamp}@test.com`;

  // Resetear la base de datos antes de todas las pruebas
  beforeAll(async () => {
    // Asegurarse que la base de datos esté limpia
    await resetDatabase();
    
    try {
      // Crear usuario administrador
      const admin = await Usuario.create({
        nombre: 'Admin',
        apellido: 'Test',
        email: adminEmail,
        contrasena: bcrypt.hashSync('Admin123', 10),
        rol: 'admin'
      });
      adminId = admin.idUsuario;
      adminToken = generate({ idUsuario: admin.idUsuario, rol: 'admin' });

      // Crear usuario normal
      const user = await Usuario.create({
        nombre: 'Cliente',
        apellido: 'Test',
        email: clienteEmail,
        contrasena: bcrypt.hashSync('Cliente123', 10),
        rol: 'user'
      });
      userId = user.idUsuario;
      userToken = generate({ idUsuario: user.idUsuario, rol: 'user' });

      console.log("✅ Usuarios creados correctamente");
    } catch (error) {
      console.error("❌ Error al crear usuarios:", error.message);
      throw error;
    }
  });

  // Configuración antes de cada test
  beforeEach(async () => {
    try {
      // No resetear toda la base de datos para mantener los usuarios creados
      // Solo limpiar las tablas específicas que usamos en los tests
      await Promise.all([
        Compra.destroy({ where: {}, force: true }),
        ItemCompra.destroy({ where: {}, force: true }),
        Carrito.destroy({ where: {}, force: true }),
        ItemCarrito.destroy({ where: {}, force: true }),
        Articulo.destroy({ where: {}, force: true }),
      ]);

      // Crear artículo para pruebas
      const articulo = await Articulo.create({
        nombre: 'Producto Test',
        descripcion: 'Descripción del producto',
        precio: 100,
        stock: 10,
        imagen: 'imagen.jpg'
      });
      articuloId = articulo.idArticulo;

      // Crear carrito para el usuario
      const carrito = await Carrito.create({
        idUsuario: userId
      });
      carritoId = carrito.idCarrito;

      // Agregar artículo al carrito
      await ItemCarrito.create({
        idCarrito: carritoId,
        idArticulo: articuloId,
        cantidad: 2
      });

      // Crear una compra para el administrador (para pruebas de listado y obtención)
      const compra = await Compra.create({
        idUsuario: adminId,
        total: 200,
        estadoPago: 'pendiente'
      });
      compraId = compra.idCompra;

      // Agregar items a la compra
      await ItemCompra.create({
        idCompra: compraId,
        idArticulo: articuloId,
        cantidad: 2,
        precioUnitario: 100,
        subtotal: 200
      });
      
      console.log("✅ Datos de prueba creados correctamente");
    } catch (error) {
      console.error("❌ Error al preparar datos de prueba:", error.message);
      throw error;
    }
  });

  // Limpiar después de todos los tests
  afterAll(async () => {
    try {
      await resetDatabase();
      console.log("✅ Base de datos limpiada correctamente");
    } catch (error) {
      console.error("❌ Error al limpiar la base de datos:", error.message);
    }
  });

  describe("POST /api/v1/purchases", () => {
    it("debe crear una compra exitosamente desde un carrito", async () => {
      const res = await request(app)
        .post('/api/v1/purchases')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          idCarrito: carritoId
        });

      // Verificar respuesta
      expect(res.status).toBe(201);
      expect(res.body.idCompra).toBeDefined();
      expect(res.body.total).toBe(200); // 2 items * 100 precio
      expect(res.body.estadoPago).toBe('pendiente');

      // Verificar que el carrito se vació
      const cartItems = await ItemCarrito.findAll({ where: { idCarrito: carritoId } });
      expect(cartItems.length).toBe(0);

      // Verificar que se actualizó el stock
      const articuloActualizado = await Articulo.findByPk(articuloId);
      expect(articuloActualizado.stock).toBe(8); // 10 inicial - 2 comprados
    });

    it("debe responder con error 404 si el carrito no existe", async () => {
      const res = await request(app)
        .post('/api/v1/purchases')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          idCarrito: 9999 // Carrito inexistente
        });

      expect(res.status).toBe(404);
      expect(res.body.message).toContain('Carrito no encontrado');
    });

    it("debe responder con error 400 si el carrito está vacío", async () => {
      // Vaciar carrito
      await ItemCarrito.destroy({ where: { idCarrito: carritoId } });

      const res = await request(app)
        .post('/api/v1/purchases')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          idCarrito: carritoId
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('El carrito está vacío');
    });

    it("debe responder con error 401 si no hay token de autenticación", async () => {
      const res = await request(app)
        .post('/api/v1/purchases')
        .send({
          idCarrito: carritoId
        });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/v1/purchases/:idCompra", () => {
    it("debe obtener una compra específica si el usuario es propietario", async () => {
      // Crear una compra para el usuario
      const compraUsuario = await Compra.create({
        idUsuario: userId,
        total: 200,
        estadoPago: 'pendiente'
      });

      const res = await request(app)
        .get(`/api/v1/purchases/${compraUsuario.idCompra}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.idCompra).toBe(compraUsuario.idCompra);
      expect(res.body.idUsuario).toBe(userId);
    });

    it("debe obtener cualquier compra si el usuario es admin", async () => {
      const res = await request(app)
        .get(`/api/v1/purchases/${compraId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.idCompra).toBe(compraId);
    });

    it("debe responder con error 403 si un usuario intenta ver compra ajena", async () => {
      const res = await request(app)
        .get(`/api/v1/purchases/${compraId}`) // compra del admin
        .set('Authorization', `Bearer ${userToken}`); // token de usuario normal

      expect(res.status).toBe(403);
    });

    it("debe responder con error 404 si la compra no existe", async () => {
      const res = await request(app)
        .get('/api/v1/purchases/9999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toContain('Compra no encontrada');
    });
  });

  describe("GET /api/v1/purchases", () => {
    it("debe listar todas las compras del usuario actual", async () => {
      // Crear varias compras para el usuario
      await Compra.create({ idUsuario: userId, total: 100, estadoPago: 'pendiente' });
      await Compra.create({ idUsuario: userId, total: 200, estadoPago: 'pagado' });

      const res = await request(app)
        .get('/api/v1/purchases')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0].idUsuario).toBe(userId);
      expect(res.body[1].idUsuario).toBe(userId);
    });

    it("debe devolver una lista vacía si el usuario no tiene compras", async () => {
      // Asegurar que el usuario no tenga compras
      await Compra.destroy({ where: { idUsuario: userId } });

      const res = await request(app)
        .get('/api/v1/purchases')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });

  describe("PUT /api/v1/purchases/:idCompra/status", () => {
    it("debe actualizar el estado de una compra si es admin", async () => {
      const res = await request(app)
        .put(`/api/v1/purchases/${compraId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          estadoPago: 'pagado'
        });

      expect(res.status).toBe(200);
      expect(res.body.estadoPago).toBe('pagado');

      // Verificar en la BD
      const compra = await Compra.findByPk(compraId);
      expect(compra.estadoPago).toBe('pagado');
    });

    it("debe restaurar stock al cancelar una compra pendiente", async () => {
      // Verificar stock inicial
      const stockInicial = (await Articulo.findByPk(articuloId)).stock;

      // Cancelar la compra
      const res = await request(app)
        .put(`/api/v1/purchases/${compraId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          estadoPago: 'cancelado'
        });

      expect(res.status).toBe(200);
      expect(res.body.estadoPago).toBe('cancelado');

      // Verificar que se restauró el stock
      const articuloActualizado = await Articulo.findByPk(articuloId);
      expect(articuloActualizado.stock).toBe(stockInicial + 2); // Se devuelven los 2 items
    });

    it("debe responder con error 403 si el usuario no es admin", async () => {
      const res = await request(app)
        .put(`/api/v1/purchases/${compraId}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          estadoPago: 'pagado'
        });

      expect(res.status).toBe(403);
    });

    it("debe responder con error 400 si el estado es inválido", async () => {
      const res = await request(app)
        .put(`/api/v1/purchases/${compraId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          estadoPago: 'estado_invalido'
        });

      expect(res.status).toBe(400);
    });

    it("debe responder con error 400 al cancelar una compra ya pagada", async () => {
      // Primero cambiar a pagado
      await request(app)
        .put(`/api/v1/purchases/${compraId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          estadoPago: 'pagado'
        });

      // Intentar cancelar
      const res = await request(app)
        .put(`/api/v1/purchases/${compraId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          estadoPago: 'cancelado'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('No se puede cancelar una compra ya pagada');
    });
  });
});
