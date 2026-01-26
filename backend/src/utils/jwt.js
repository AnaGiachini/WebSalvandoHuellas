/**
 * Utilidad: JWT (JSON Web Token)
 * --------------------------------------------------------------------------
 * Gestiona la creación y verificación de tokens para autenticación segura.
 *
 *  • Funciones principales
 *      generate → crea un token firmado con la información del usuario
 *      verify   → valida un token y retorna la información original
 *
 *  • Configuración
 *      - Usa variable JWT_SECRET del archivo .env para la firma
 *      - Tokens con expiración de 7 días por defecto
 *
 *  • Notas
 *      – Los tokens son usados para operaciones autenticadas en la API
 *      – Se recomienda transmitirlos solo por canales seguros (HTTPS)
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();

const generate = payload => {
  // Si el payload es un número (ID), usar idUsuario por consistencia
  if (typeof payload === 'number') {
    payload = { idUsuario: payload, rol: 'user' };
  } else if (payload && typeof payload === 'object') {
    // Asegurar rol por defecto
    if (!payload.rol) payload.rol = 'user';
    // Estandarizar clave de id
    if (payload.id && !payload.idUsuario) {
      payload.idUsuario = payload.id;
      delete payload.id;
    }
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Generar token con expiración custom (e.g., "15m")
const generateWithExpiry = (payload, expiresIn) => {
  if (typeof payload === 'number') {
    payload = { idUsuario: payload, rol: 'user' };
  } else if (payload && typeof payload === 'object') {
    if (!payload.rol) payload.rol = 'user';
    if (payload.id && !payload.idUsuario) {
      payload.idUsuario = payload.id;
      delete payload.id;
    }
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const verify = token => {
  // Verifica el token y devuelve el payload decodificado
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // Normalizar estructura
  if (decoded && !decoded.rol) decoded.rol = 'user';
  if (decoded && decoded.id && !decoded.idUsuario) decoded.idUsuario = decoded.id;
  return decoded;
};

module.exports = { generate, generateWithExpiry, verify };
