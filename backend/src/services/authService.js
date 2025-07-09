/**
 * Servicio: Autenticación
 * --------------------------------------------------------------------------
 * Gestiona la lógica de negocio relacionada con registro e inicio de sesión.
 *
 *  • Funciones principales
 *      registerService → registro de nuevos usuarios con contraseña encriptada
 *      loginService    → validación de credenciales y generación de token
 *
 *  • Seguridad
 *      - Encriptación de contraseñas mediante bcrypt (factor 10)
 *      - Comparación segura de contraseñas hash vs plain text
 *      - Generación de tokens JWT con información del usuario
 *
 *  • Notas
 *      – Implementa normalización de datos para mejorar la consistencia
 *      – Las credenciales inválidas generan un error 401 (No autorizado)
 */

const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');
const Usuario = require('../models/usuario');
const AppError = require('../utils/AppError');

/**
 * Genera un hash seguro de la contraseña
 * @param {string} plain - Contraseña en texto plano
 * @returns {Promise<string>} Hash de la contraseña
 */
const hashPassword = (plain) => bcrypt.hash(plain, 10);

/**
 * Compara una contraseña en texto plano con su hash
 * @param {string} plain - Contraseña en texto plano
 * @param {string} hash - Hash almacenado de la contraseña
 * @returns {Promise<boolean>} True si coinciden, false en caso contrario
 */
const comparePassword = (plain, hash) => bcrypt.compare(plain, hash);

/**
 * Registra un nuevo usuario en el sistema
 * @param {Object} userData - Datos del nuevo usuario
 * @param {string} userData.nombre - Nombre del usuario
 * @param {string} userData.apellido - Apellido del usuario
 * @param {string} userData.email - Email (normalizado)
 * @param {string} userData.contrasena - Contraseña (sin encriptar)
 * @param {string} userData.direccion - Dirección del usuario
 * @returns {Promise<string>} Token JWT para autenticación
 */
const registerService = async ({ nombre, apellido, email, contrasena, direccion }) => {
  // Normalización de datos
  const datosNormalizados = {
    nombre: nombre ? nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase() : nombre,
    apellido: apellido ? apellido.charAt(0).toUpperCase() + apellido.slice(1).toLowerCase() : apellido,
    email: email ? email.trim().toLowerCase() : email,
    direccion: direccion ? direccion.trim() : direccion,
  };
  
  const hash = await hashPassword(contrasena);
  const user = await Usuario.create({ 
    ...datosNormalizados,
    contrasena: hash 
  });
  
  return jwt.generate({ id: user.idUsuario, rol: user.rol });
};

/**
 * Verifica credenciales y genera token de acceso
 * @param {Object} credentials - Credenciales de acceso
 * @param {string} credentials.email - Email del usuario
 * @param {string} credentials.contrasena - Contraseña sin encriptar
 * @returns {Promise<string>} Token JWT para autenticación
 * @throws {AppError} Error 401 si las credenciales son inválidas
 */
const loginService = async ({ email, contrasena }) => {
  const user = await Usuario.findOne({ where: { email } });
  if (!user || !(await comparePassword(contrasena, user.contrasena)))
    throw new AppError(401, 'Credenciales inválidas');

  return jwt.generate({ id: user.idUsuario, rol: user.rol });
};

module.exports = { registerService, loginService };
