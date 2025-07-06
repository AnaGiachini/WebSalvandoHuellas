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

const generate = payload =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

const verify = token =>
  jwt.verify(token, process.env.JWT_SECRET);

module.exports = { generate, verify };
