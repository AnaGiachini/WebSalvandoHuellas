const AppError = require('../utils/AppError');
const { createDonationService, getUserDonationsService, getAllDonationsService, updateDonationStatusService } = require('../services/donationService');

// Crear donación por transferencia (queda pendiente)
const createTransferDonation = async (req, res, next) => {
  try {
    const { monto } = req.body;
    const idUsuario = req.user.idUsuario;
    if (!monto || Number(monto) <= 0) throw new AppError(400, 'Monto inválido');
    const donation = await createDonationService(idUsuario, Number(monto), { metodoPago: 'transferencia' });
    res.status(201).json(donation);
  } catch (err) { next(err); }
};

// Listar donaciones del usuario autenticado
const getMyDonations = async (req, res, next) => {
  try {
    const idUsuario = req.user.idUsuario;
    const list = await getUserDonationsService(idUsuario);
    res.json(list);
  } catch (err) { next(err); }
};

// Admin: Listar todas las donaciones con info del usuario
const getAllDonations = async (req, res, next) => {
  try {
    const list = await getAllDonationsService();
    res.json(list);
  } catch (err) { next(err); }
};

// Admin: Actualizar estado de donación
const updateDonationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estadoPago } = req.body;
    if (!estadoPago) throw new AppError(400, 'estadoPago es requerido');
    const updated = await updateDonationStatusService(Number(id), estadoPago);
    res.json(updated);
  } catch (err) { next(err); }
};

module.exports = {
  createTransferDonation,
  getMyDonations,
  getAllDonations,
  updateDonationStatus,
};
