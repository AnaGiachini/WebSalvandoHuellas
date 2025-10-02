/**
 * Controlador: Payments (Mercado Pago)
 * --------------------------------------------------------------------------
 * Crea preferencias reales con el SDK de Mercado Pago y procesa webhooks.
 */

const AppError = require('../utils/AppError');
const { createPurchaseService, getPurchaseByIdService, updatePurchaseStatusService } = require('../services/purchaseService');
const Compra = require('../models/compra');

// SDK de Mercado Pago
let mp;
try {
  const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
  const mpClient = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
  mp = { Preference: new Preference(mpClient), Payment: new Payment(mpClient) };
} catch (err) {
  // Si no está instalado el SDK, las funciones lanzarán error claro
  mp = null;
}

/**
 * Crea preferencia de Mercado Pago para un carrito.
 * Body: { idCarrito }
 * Respuesta: { init_point, preference_id, compra }
 */
const createMpPreference = async (req, res, next) => {
  try {
    const { idCarrito } = req.body;
    const idUsuario = req.user.idUsuario;

    if (!idCarrito) throw new AppError(400, 'idCarrito es requerido');
    if (!mp) throw new AppError(500, 'SDK de Mercado Pago no disponible. Instalar paquete "mercadopago" y configurar MP_ACCESS_TOKEN.');

    // Crear la compra en estado pendiente, sin descontar stock ni vaciar carrito
    const purchase = await createPurchaseService(idCarrito, idUsuario, { metodoPago: 'mercado_pago' });

    // Volver a traer compra con items y artículos
    const fullPurchase = await getPurchaseByIdService(purchase.idCompra);

    // Construir ítems para MP
    const items = (fullPurchase.items || []).map((it) => ({
      id: String(it.idArticulo),
      title: it.articulo?.nombre || `Artículo ${it.idArticulo}`,
      quantity: it.cantidad,
      currency_id: 'ARS',
      unit_price: Number(it.precioUnitario || 0),
    }));

    const BACK_URL = process.env.BACK_URL || 'http://localhost:4000';
    const FRONT_URL = process.env.FRONT_URL || 'http://localhost:3000';

    const prefBody = {
      items,
      external_reference: String(purchase.idCompra),
      back_urls: {
        success: `${FRONT_URL}/gracias`,
        pending: `${FRONT_URL}/gracias`,
        failure: `${FRONT_URL}/gracias`,
      },
      auto_return: 'approved',
      notification_url: `${BACK_URL}/api/v1/payments/mp/webhook`,
    };

    const prefRes = await mp.Preference.create({ body: prefBody });
    const init_point = prefRes?.init_point || prefRes?.sandbox_init_point;
    const preference_id = prefRes?.id;

    // Guardar referencia de preferencia en la compra
    await Compra.update({ mp_preference_id: preference_id }, { where: { idCompra: purchase.idCompra } });

    res.status(201).json({ init_point, preference_id, compra: fullPurchase });
  } catch (err) { next(err); }
};

/**
 * Webhook de Mercado Pago: consulta el pago y actualiza la compra.
 * MP envía normalmente: type=payment & data.id=<payment_id>
 */
const mpWebhook = async (req, res, next) => {
  try {
    if (!mp) throw new AppError(500, 'SDK de Mercado Pago no disponible');

    // Soporta formato v2 (type, data.id) y fallback por body/payment.id
    const paymentId = req.query['data.id'] || req.body['data.id'] || req.body?.data?.id || req.body?.id || req.query?.id;
    const type = req.query.type || req.body.type;

    if (type !== 'payment' || !paymentId) {
      return res.sendStatus(200);
    }

    // Obtener pago desde MP
    const payment = await mp.Payment.get({ id: paymentId });
    const status = String(payment?.status || '').toLowerCase();
    const external_reference = payment?.external_reference || payment?.order?.external_reference;

    if (!external_reference) {
      return res.sendStatus(200);
    }

    const idCompra = Number(external_reference);
    if (!idCompra) return res.sendStatus(200);

    // Guardar mp_payment_id en la compra
    await Compra.update({ mp_payment_id: String(paymentId) }, { where: { idCompra } });

    if (status === 'approved') {
      await updatePurchaseStatusService(idCompra, 'pagado');
    }

    res.sendStatus(200);
  } catch (err) { next(err); }
};

module.exports = {
  createMpPreference,
  mpWebhook,
};
