/**
 * Controlador: Purchase
 * --------------------------------------------------------------------------
 * Gestiona las rutas de la API relacionadas con las compras.
 *
 *  • Operaciones principales
 *      createPurchase      → crea una nueva compra a partir de un carrito
 *      getPurchaseById     → obtiene los detalles de una compra específica
 *      getUserPurchases    → lista las compras del usuario actual
 *      updatePurchaseStatus → actualiza el estado de pago de una compra
 *
 *  • Características
 *      - Implementa manejo de errores con try/catch
 *      - Delega la lógica de negocio a los servicios correspondientes
 *      - Devuelve respuestas JSON estandarizadas
 *
 *  • Respuestas HTTP
 *      200 → Éxito (OK) para operaciones de lectura y actualización
 *      201 → Éxito al crear un nuevo recurso
 *      4xx/5xx → Errores (manejados por errorMiddleware)
 */

const {
  createPurchaseService,
  getPurchaseByIdService,
  getUserPurchasesService,
  updatePurchaseStatusService,
  getAllPurchasesService,
  getSalesMetricsService,
} = require('../services/purchaseService');

/**
 * UC03: Crear compra desde carrito
 * --------------------------------------------------------------------------
 * Crea una nueva compra a partir del carrito actual del usuario.
 *
 *  • Request body esperado
 *      { idCarrito, metodoPago? }
 *
 *  • Comportamiento
 *      - Para compras directas (sin metodoPago) se descuenta stock y se vacía el carrito
 *      - Para pagos diferidos (ej. Mercado Pago, transferencia) se deja la compra en
 *        estado 'pendiente' y el stock se descuenta al confirmar el pago
 *
 * @param {Object} req - Objeto de solicitud Express con usuario autenticado y body (idCarrito)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const createPurchase = async (req, res, next) => {
  try {
    const { idCarrito, metodoPago } = req.body;
    const purchase = await createPurchaseService(idCarrito, req.user.idUsuario, { metodoPago });
    res.status(201).json(purchase);
  } catch (err) { next(err); }
};

/**
 * Obtiene los detalles de una compra específica
 * @param {Object} req - Objeto de solicitud Express con params (idCompra) y usuario autenticado
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const getPurchaseById = async (req, res, next) => {
  try {
    const { idCompra } = req.params;
    const purchase = await getPurchaseByIdService(idCompra);
    
    // Verificar si el usuario tiene permisos (es admin o es su propia compra)
    if (req.user.rol !== 'admin' && purchase.idUsuario !== req.user.idUsuario) {
      return res.status(403).json({
        message: 'No tienes permisos para ver esta compra'
      });
    }
    
    res.json(purchase);
  } catch (err) { next(err); }
};

/**
 * UC03: Historial de compras del usuario actual
 * --------------------------------------------------------------------------
 * Obtiene todas las compras del usuario actual. Si el usuario es admin y pasa
 * el query param ?all=1, devuelve todas las compras registradas en el sistema.
 *
 * @param {Object} req - Objeto de solicitud Express con usuario autenticado
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const getUserPurchases = async (req, res, next) => {
  try {
    // Si el usuario es admin y pasa ?all=1, listar todas las compras
    if (req.user?.rol === 'admin' && String(req.query.all) === '1') {
      const all = await getAllPurchasesService();
      return res.json(all);
    }
    const purchases = await getUserPurchasesService(req.user.idUsuario);
    res.json(purchases);
  } catch (err) { next(err); }
};

/**
 * Actualiza el estado de pago de una compra (solo admin)
 * @param {Object} req - Objeto de solicitud Express con params (idCompra) y body (estadoPago)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const updatePurchaseStatus = async (req, res, next) => {
  try {
    // Verificar si el usuario es administrador
    if (req.user.rol !== 'admin') {
      return res.status(403).json({
        message: 'Solo los administradores pueden actualizar el estado de las compras'
      });
    }
    
    const { idCompra } = req.params;
    const { estadoPago } = req.body;
    
    const purchase = await updatePurchaseStatusService(idCompra, estadoPago);
    res.json(purchase);
  } catch (err) { next(err); }
};

module.exports = {
  createPurchase,
  getPurchaseById,
  getUserPurchases,
  updatePurchaseStatus,
  /**
   * Métricas de ventas (solo admin)
   * Query: from, to (ISO o fecha parseable)
   */
  async getSalesMetrics(req, res, next) {
    try {
      const { from, to } = req.query;
      const metrics = await getSalesMetricsService({ from, to });
      res.json(metrics);
    } catch (err) { next(err); }
  }
};
