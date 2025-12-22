/**
 * Servicio: Donation
 * --------------------------------------------------------------------------
 * Gestiona donaciones monetarias.
 */

const sequelize = require('../configs/db');
const AppError = require('../utils/AppError');
const Donacion = require('../models/donacion');
const Usuario = require('../models/usuario');

/**
 * Caso de uso 06 (UC06): Crear donación en estado pendiente
 * --------------------------------------------------------------------------
 *  • Se utiliza tanto para donaciones por transferencia como por Mercado Pago.
 *  • El estado inicial siempre es 'pendiente'; luego se marca 'pagado' cuando
 *    el administrador confirma la transferencia o el webhook de Mercado Pago
 *    notifica un pago aprobado.
 *
 * Crea una donación en estado pendiente
 * 
 * @param {number} idUsuario     ID del usuario donante (desde el token)
 * @param {number} monto         Importe de la donación
 * @param {object} opt           Opciones adicionales
 * @param {string} opt.metodoPago  'mercado_pago' o 'transferencia'
 */
const createDonationService = async (idUsuario, monto, { metodoPago } = {}) => {
  if (!monto || Number(monto) <= 0) throw new AppError(400, 'Monto inválido');
  const donation = await Donacion.create({ idUsuario, monto: Number(monto), estadoPago: 'pendiente', metodoPago: metodoPago || null });
  return donation;
};

/** Obtener donación por ID */
const getDonationByIdService = async (idDonacion) => {
  const d = await Donacion.findByPk(idDonacion);
  if (!d) throw new AppError(404, 'Donación no encontrada');
  return d;
};

/** Listar donaciones del usuario */
const getUserDonationsService = async (idUsuario) => {
  return await Donacion.findAll({ where: { idUsuario }, order: [['fechaDonacion', 'DESC']] });
};

/** Admin: Listar todas las donaciones con info del usuario */
const getAllDonationsService = async () => {
  return await Donacion.findAll({ 
    include: [{ 
      model: Usuario, 
      as: 'usuario',
      attributes: ['idUsuario', 'nombre', 'apellido', 'email']
    }],
    order: [['fechaDonacion', 'DESC']] 
  });
};

/**
 * Actualizar estado de pago de una donación y guardar refs MP si aplica
 */
const updateDonationStatusService = async (idDonacion, estadoPago, { mp_payment_id } = {}) => {
  const valid = ['pendiente', 'pagado', 'cancelado'];
  if (!valid.includes(estadoPago)) throw new AppError(400, 'Estado inválido');
  const d = await Donacion.findByPk(idDonacion);
  if (!d) throw new AppError(404, 'Donación no encontrada');
  await d.update({ estadoPago, mp_payment_id: mp_payment_id || d.mp_payment_id });
  return d;
};

module.exports = {
  createDonationService,
  getDonationByIdService,
  getUserDonationsService,
  getAllDonationsService,
  updateDonationStatusService,
};
