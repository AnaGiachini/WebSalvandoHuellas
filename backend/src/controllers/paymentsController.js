/**
 * Controlador: Payments (Mercado Pago)
 * --------------------------------------------------------------------------
 * Crea preferencias reales con el SDK de Mercado Pago y procesa webhooks.
 *
 *  • Casos de uso
 *      - UC03: Realizar compra con Mercado Pago
 *      - UC Donaciones: Donar mediante Mercado Pago
 *
 *  • Configuración
 *      – Requiere variable de entorno MP_ACCESS_TOKEN y el paquete 'mercadopago'
 *      – Usa BACK_URL y FRONT_URL para armar las URLs de retorno y de webhook
 */

const AppError = require('../utils/AppError');
const { createPurchaseService, getPurchaseByIdService, updatePurchaseStatusService } = require('../services/purchaseService');
const { createDonationService, getDonationByIdService, updateDonationStatusService } = require('../services/donationService');
const Compra = require('../models/compra');
const Donacion = require('../models/donacion');

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
 * --------------------------------------------------------------------------
 * UC03: Rama de pago con Mercado Pago.
 *
 *  • Flujo
 *      - Crea una Compra en estado 'pendiente' con metodoPago='mercado_pago'
 *        (sin descontar stock todavía)
 *      - Construye los ítems de la preferencia a partir de los ItemCompra
 *      - Configura back_urls al frontend (/gracias) y notification_url al webhook
 *      - Devuelve init_point para redirigir al checkout de Mercado Pago
 *
 *  • Request body
 *      { idCarrito }
 *
 *  • Respuesta
 *      { init_point, preference_id, compra }
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
 * Crea preferencia de Mercado Pago para una donación (monto único)
 * Body: { monto }
 * Respuesta: { init_point, preference_id, donacion }
 */
// UC06: Realizar donación – rama Mercado Pago
// ---------------------------------------------------------------------------
//  • Crea una donación en estado 'pendiente' y genera una preferencia de
//    Mercado Pago para que el usuario complete el pago.
//  • Cuando MP confirma el pago (webhook), mpWebhook actualizará la donación
//    a estado 'pagado' usando updateDonationStatusService.
const createMpDonationPreference = async (req, res, next) => {
  try {
    const { monto } = req.body;
    const idUsuario = req.user.idUsuario;
    if (!mp) throw new AppError(500, 'SDK de Mercado Pago no disponible. Instalar paquete "mercadopago" y configurar MP_ACCESS_TOKEN.');
    if (!monto || Number(monto) <= 0) throw new AppError(400, 'Monto inválido');

    // Crear donación pendiente
    const donation = await createDonationService(idUsuario, Number(monto), { metodoPago: 'mercado_pago' });

    const BACK_URL = process.env.BACK_URL || 'http://localhost:4000';
    const FRONT_URL = process.env.FRONT_URL || 'http://localhost:3000';

    const prefBody = {
      items: [{ id: `donation-${donation.idDonacion}`, title: 'Donación Salvando Huellas', quantity: 1, currency_id: 'ARS', unit_price: Number(monto) }],
      external_reference: `donation:${donation.idDonacion}`,
      back_urls: {
        success: `${FRONT_URL}/donaciones/gracias`,
        pending: `${FRONT_URL}/donaciones/gracias`,
        failure: `${FRONT_URL}/donaciones/gracias`,
      },
      //auto_return: 'approved',
      notification_url: `${BACK_URL}/api/v1/payments/mp/webhook`,
    };

    const prefRes = await mp.Preference.create({ body: prefBody });
    const init_point = prefRes?.init_point || prefRes?.sandbox_init_point;
    const preference_id = prefRes?.id;

    await Donacion.update({ mp_preference_id: preference_id }, { where: { idDonacion: donation.idDonacion } });

    res.status(201).json({ init_point, preference_id, donacion: donation });
  } catch (err) { next(err); }
};

/**
 * Webhook de Mercado Pago: consulta el pago y actualiza la compra/donación.
 * --------------------------------------------------------------------------
 *  • Comportamiento
 *      - Recibe notificaciones 'payment' con data.id (payment_id)
 *      - Consulta el pago en Mercado Pago y obtiene status + external_reference
 *      - Si external_reference corresponde a una donación, delega en donationService
 *      - Si corresponde a una compra:
 *          - Guarda mp_payment_id en la Compra
 *          - Si el pago está 'approved', llama updatePurchaseStatusService(idCompra, 'pagado')
 *            → aquí se descuenta stock y se limpia el carrito (UC03)
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

    // Soportar compras y donaciones según external_reference
    if (String(external_reference).startsWith('donation:')) {
      const idDonacion = Number(String(external_reference).split(':')[1]);
      if (idDonacion) {
        await Donacion.update({ mp_payment_id: String(paymentId) }, { where: { idDonacion } });
        if (status === 'approved') {
          await updateDonationStatusService(idDonacion, 'pagado', { mp_payment_id: String(paymentId) });
        }
      }
    } else {
      const idCompra = Number(external_reference);
      if (idCompra) {
        await Compra.update({ mp_payment_id: String(paymentId) }, { where: { idCompra } });
        if (status === 'approved') {
          await updatePurchaseStatusService(idCompra, 'pagado');
        }
      }
    }

    res.sendStatus(200);
  } catch (err) { next(err); }
};

module.exports = {
  createMpPreference,
  mpWebhook,
  createMpDonationPreference,
};
