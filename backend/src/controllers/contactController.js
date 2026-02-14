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

    // No bloquear la respuesta del usuario por demoras del SMTP.
    // Disparamos el envío "en segundo plano" y registramos cualquier error en consola.
    mailService
      .sendContactMessage({ nombre, email, asunto, mensaje })
      .catch((error) => {
        console.error('[Contact] Error al enviar correo de contacto:', error?.message || error);
      });

    return res.status(200).json({ message: 'Mensaje enviado correctamente.' });
  } catch (err) {
    return next(err);
  }
};
