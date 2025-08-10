/**
 * Test: purchaseService
 * --------------------------------------------------------------------------
 * Tests de integración para el servicio de compras.
 *
 *  • Pruebas principales
 *      - Creación de compra desde un carrito
 *      - Obtención de compra por ID
 *      - Obtención de compras de un usuario
 *      - Actualización de estado de pago
 *      - Manejo de errores y validaciones
 */

const { 
  createPurchaseService, 
  getPurchaseByIdService, 
  getUserPurchasesService, 
  updatePurchaseStatusService 
} = require('../../src/services/purchaseService');

const Usuario = require('../../src/models/usuario');
const Compra = require('../../src/models/compra');
const ItemCompra = require('../../src/models/itemCompra');
const Articulo = require('../../src/models/articulo');
const Carrito = require('../../src/models/carrito');
const ItemCarrito = require('../../src/models/itemCarrito');
const bcrypt = require('bcryptjs');
const resetDatabase = require('../../src/utils/resetDatabase.helper');
// Importar las asociaciones
const associations = require('../../src/configs/associations');

// Inicializar las asociaciones antes de cualquier test
associations();

describe('purchaseService integration tests', () => {
  // Datos de prueba
  let testUser;
  let testUserId;
  let testCartId;
  let testArticulo1;
  let testArticulo2;
  let testPurchaseId;
  
  // Configuración previa a todos los tests
  beforeAll(async () => {
    // Crear usuario de prueba
    testUser = await Usuario.create({
      nombre: 'Cliente',
      apellido: 'Test',
      direccion: 'Dirección Test',
      telefono: '123456789',
      email: 'cliente.test@example.com',
      contrasena: bcrypt.hashSync('Clave1234', 10)
    });
    testUserId = testUser.idUsuario;
  });

  // Configuración previa a cada test
  beforeEach(async () => {
    // Limpiar base de datos
    await resetDatabase();
    
    // Recrear usuario de prueba si fue eliminado
    const userExists = await Usuario.findByPk(testUserId);
    if (!userExists) {
      testUser = await Usuario.create({
        nombre: 'Cliente',
        apellido: 'Test',
        direccion: 'Dirección Test',
        telefono: '123456789',
        email: 'cliente.test@example.com',
        contrasena: bcrypt.hashSync('Clave1234', 10)
      });
      testUserId = testUser.idUsuario;
    }
    
    // Crear artículos de prueba
    testArticulo1 = await Articulo.create({
      nombre: 'Producto Test 1',
      descripcion: 'Descripción del producto 1',
      precio: 100,
      stock: 10,
      imagen: 'imagen1.jpg'
    });
    
    testArticulo2 = await Articulo.create({
      nombre: 'Producto Test 2',
      descripcion: 'Descripción del producto 2',
      precio: 200,
      stock: 5,
      imagen: 'imagen2.jpg'
    });
    
    // Crear carrito de prueba
    const cart = await Carrito.create({
      idUsuario: testUserId
    });
    testCartId = cart.idCarrito;
    
    // Añadir items al carrito
    await ItemCarrito.create({
      idCarrito: testCartId,
      idArticulo: testArticulo1.idArticulo,
      cantidad: 2
    });
    
    await ItemCarrito.create({
      idCarrito: testCartId,
      idArticulo: testArticulo2.idArticulo,
      cantidad: 1
    });
  });

  // Limpieza después de todos los tests
  afterAll(async () => {
    await resetDatabase();
  });

  describe('createPurchaseService', () => {
    it('debe crear una compra exitosamente desde un carrito', async () => {
      // Ejecutar
      const purchase = await createPurchaseService(testCartId, testUserId);
      testPurchaseId = purchase.idCompra;
      
      // Verificar
      expect(purchase).toBeDefined();
      expect(purchase.idUsuario).toBe(testUserId);
      expect(purchase.total).toBe(400); // (2 * 100) + (1 * 200)
      expect(purchase.estadoPago).toBe('pendiente');
      
      // Verificar items
      expect(purchase.items).toBeDefined();
      expect(purchase.items.length).toBe(2);
      
      // Verificar stock actualizado
      const articulo1Updated = await Articulo.findByPk(testArticulo1.idArticulo);
      const articulo2Updated = await Articulo.findByPk(testArticulo2.idArticulo);
      expect(articulo1Updated.stock).toBe(8); // 10 - 2
      expect(articulo2Updated.stock).toBe(4); // 5 - 1
      
      // Verificar que el carrito esté vacío
      const cartItems = await ItemCarrito.findAll({ where: { idCarrito: testCartId } });
      expect(cartItems.length).toBe(0);
    });

    it('debe arrojar error si el carrito no existe', async () => {
      await expect(createPurchaseService(9999, testUserId))
        .rejects
        .toThrow('Carrito no encontrado');
    });

    it('debe arrojar error si el carrito está vacío', async () => {
      // Vaciar el carrito existente
      await ItemCarrito.destroy({ where: { idCarrito: testCartId } });
      
      await expect(createPurchaseService(testCartId, testUserId))
        .rejects
        .toThrow('El carrito está vacío');
    });

    it('debe arrojar error si el stock es insuficiente', async () => {
      // Modificar la cantidad de un item para exceder el stock
      await ItemCarrito.update(
        { cantidad: 15 }, // Stock insuficiente (solo hay 10)
        { where: { idCarrito: testCartId, idArticulo: testArticulo1.idArticulo } }
      );
      
      await expect(createPurchaseService(testCartId, testUserId))
        .rejects
        .toThrow('Stock insuficiente');
    });
  });

  describe('getPurchaseByIdService', () => {
    it('debe obtener una compra por su ID', async () => {
      // Crear una compra primero
      const purchase = await createPurchaseService(testCartId, testUserId);
      testPurchaseId = purchase.idCompra;
      
      // Ejecutar
      const result = await getPurchaseByIdService(testPurchaseId);
      
      // Verificar
      expect(result.idCompra).toBe(testPurchaseId);
      expect(result.idUsuario).toBe(testUserId);
      expect(result.items.length).toBe(2);
    });

    it('debe arrojar error si la compra no existe', async () => {
      await expect(getPurchaseByIdService(9999))
        .rejects
        .toThrow('Compra no encontrada');
    });
  });

  describe('getUserPurchasesService', () => {
    it('debe obtener todas las compras de un usuario', async () => {
      // Crear una compra primero
      await createPurchaseService(testCartId, testUserId);
      
      // Crear un nuevo carrito y una segunda compra
      const newCart = await Carrito.create({ idUsuario: testUserId });
      await ItemCarrito.create({
        idCarrito: newCart.idCarrito,
        idArticulo: testArticulo1.idArticulo,
        cantidad: 1
      });
      await createPurchaseService(newCart.idCarrito, testUserId);
      
      // Ejecutar
      const purchases = await getUserPurchasesService(testUserId);
      
      // Verificar
      expect(Array.isArray(purchases)).toBe(true);
      expect(purchases.length).toBe(2);
      expect(purchases[0].idUsuario).toBe(testUserId);
      expect(purchases[1].idUsuario).toBe(testUserId);
    });

    it('debe devolver un array vacío si el usuario no tiene compras', async () => {
      // Crear un usuario sin compras
      const newUser = await Usuario.create({
        nombre: 'Usuario',
        apellido: 'Sin Compras',
        email: 'sin.compras@example.com',
        contrasena: bcrypt.hashSync('Clave1234', 10)
      });
      
      // Ejecutar
      const purchases = await getUserPurchasesService(newUser.idUsuario);
      
      // Verificar
      expect(Array.isArray(purchases)).toBe(true);
      expect(purchases.length).toBe(0);
    });
  });

  describe('updatePurchaseStatusService', () => {
    beforeEach(async () => {
      // Crear una compra para actualizar
      const purchase = await createPurchaseService(testCartId, testUserId);
      testPurchaseId = purchase.idCompra;
    });
    
    it('debe actualizar el estado de pago de una compra a "pagado"', async () => {
      // Ejecutar
      const updatedPurchase = await updatePurchaseStatusService(testPurchaseId, 'pagado');
      
      // Verificar
      expect(updatedPurchase.estadoPago).toBe('pagado');
      
      // Verificar en la base de datos
      const purchaseDb = await Compra.findByPk(testPurchaseId);
      expect(purchaseDb.estadoPago).toBe('pagado');
    });

    it('debe arrojar error con un estado de pago inválido', async () => {
      await expect(updatePurchaseStatusService(testPurchaseId, 'estado_invalido'))
        .rejects
        .toThrow('Estado de pago inválido');
    });

    it('debe arrojar error si la compra no existe', async () => {
      await expect(updatePurchaseStatusService(9999, 'pagado'))
        .rejects
        .toThrow('Compra no encontrada');
    });

    it('no debe permitir cancelar una compra ya pagada', async () => {
      // Primero actualizar a pagado
      await updatePurchaseStatusService(testPurchaseId, 'pagado');
      
      // Intentar cancelar
      await expect(updatePurchaseStatusService(testPurchaseId, 'cancelado'))
        .rejects
        .toThrow('No se puede cancelar una compra ya pagada');
    });

    it('debe restaurar el stock al cancelar una compra pendiente', async () => {
      // Obtener stock antes de cancelar
      const stockInicialArticulo1 = (await Articulo.findByPk(testArticulo1.idArticulo)).stock;
      const stockInicialArticulo2 = (await Articulo.findByPk(testArticulo2.idArticulo)).stock;
      
      // Cancelar la compra
      await updatePurchaseStatusService(testPurchaseId, 'cancelado');
      
      // Verificar stock restaurado
      const articulo1Updated = await Articulo.findByPk(testArticulo1.idArticulo);
      const articulo2Updated = await Articulo.findByPk(testArticulo2.idArticulo);
      
      expect(articulo1Updated.stock).toBe(stockInicialArticulo1 + 2);
      expect(articulo2Updated.stock).toBe(stockInicialArticulo2 + 1);
      
      // Verificar estado
      const updatedPurchase = await Compra.findByPk(testPurchaseId);
      expect(updatedPurchase.estadoPago).toBe('cancelado');
    });
  });
});