const mailService = require('../services/mailService');

/**
 * Controlador: Contacto
 * --------------------------------------------------------------------------
 * Recibe los datos del formulario de contacto público y envía un correo a la
 * casilla configurada en CONTACT_EMAIL o, por defecto, a contacto@salvandohuellas.org.
 */

exports.sendContact = async (req, res, next) => {
  try {
    const { nombre, email, asunto, mensaje } = req.body || {};

    if (!email || !mensaje) {
      return res.status(400).json({ message: 'El correo y el mensaje son obligatorios.' });
    }

    await mailService.sendContactMessage({ nombre, email, asunto, mensaje });

    return res.status(200).json({ message: 'Mensaje enviado correctamente.' });
  } catch (err) {
    return next(err);
  }
};
