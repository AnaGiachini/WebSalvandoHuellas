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
  // Si el payload es un número (ID), convertirlo a objeto con id y rol por defecto
  if (typeof payload === 'number') {
    payload = { id: payload, rol: 'user' };
  } else if (payload && typeof payload === 'object') {
    // Asegurarse de que el payload tiene la estructura correcta
    if (!payload.rol) {
      payload.rol = 'user'; // Rol por defecto
    }
  }
  
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const verify = token => {
  // Verifica el token y devuelve el payload decodificado
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // Asegurar que el objeto decodificado tenga la estructura esperada
  if (decoded && !decoded.rol) {
    decoded.rol = 'user'; // Rol por defecto si no existe
  }
  return decoded;
};

module.exports = { generate, verify };
