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
// Refactor: corregimos el path por case-sensitive FS (utils/appError.js)
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
 * UC01: Registrar usuario - Lógica de negocio
 * --------------------------------------------------------------------------
 * Crea un nuevo usuario en el sistema aplicando normalización y seguridad.
 *
 *  • Pasos principales
 *      - Normaliza nombre, apellido, email y dirección
 *      - Encripta la contraseña con bcrypt
 *      - Persiste el usuario en la base de datos (tabla 'usuarios')
 *      - Genera un JWT con idUsuario y rol por defecto
 *
 *  • Errores
 *      - Lanza AppError(409, 'Email ya registrado') si el email está duplicado
 *
 * @param {Object} userData - Datos del nuevo usuario
 * @param {string} userData.nombre - Nombre del usuario
 * @param {string} userData.apellido - Apellido del usuario
 * @param {string} userData.email - Email (sin normalizar)
 * @param {string} userData.contrasena - Contraseña (sin encriptar)
 * @param {string} [userData.direccion] - Dirección del usuario
 * @returns {Promise<{token: string, user: Object}>} Token JWT y datos básicos del usuario
 */
const registerService = async ({ nombre, apellido, email, contrasena, direccion }) => {
  // Normalización de datos
  const datosNormalizados = {
    nombre: nombre ? nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase() : nombre,
    apellido: apellido ? apellido.charAt(0).toUpperCase() + apellido.slice(1).toLowerCase() : apellido,
    email: email ? email.trim().toLowerCase() : email,
    direccion: direccion ? direccion.trim() : direccion,
  };

  try {
    const hash = await hashPassword(contrasena);
    const user = await Usuario.create({
      ...datosNormalizados,
      contrasena: hash,
    });

    const token = jwt.generate({ idUsuario: user.idUsuario, rol: user.rol });

    // Devolvemos también datos básicos del usuario para que el frontend pueda
    // reflejar inmediatamente la sesión sin depender solo del formulario.
    const safeUser = {
      idUsuario: user.idUsuario,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.rol,
    };

    return { token, user: safeUser };
  } catch (err) {
    // UC01 - Regla de negocio: si el email ya existe, devolvemos un 409 controlado
    // en lugar de un error genérico de base de datos.
    if (err && (err.name === 'SequelizeUniqueConstraintError' || /unique|duplic/i.test(String(err.message)))) {
      throw new AppError(409, 'Email ya registrado');
    }
    throw err;
  }
};

/**
 * UC02: Inicio de sesión - Lógica de negocio
 * --------------------------------------------------------------------------
 * Verifica las credenciales del usuario y genera un token de acceso junto
 * con datos básicos del usuario.
 *
 *  • Errores
 *      - Lanza AppError(401, 'Credenciales inválidas') para email o contraseña incorrectos
 *
 * @param {Object} credentials - Credenciales de acceso
 * @param {string} credentials.email - Email del usuario
 * @param {string} credentials.contrasena - Contraseña sin encriptar
 * @returns {Promise<{token: string, user: Object}>} Token JWT y datos básicos del usuario
 */
const loginService = async ({ email, contrasena }) => {
  // Aseguramos email normalizado por seguridad adicional (además de la validación)
  email = email?.trim().toLowerCase();
  const user = await Usuario.findOne({ where: { email } });
  if (!user || !(await comparePassword(contrasena, user.contrasena)))
    throw new AppError(401, 'Credenciales inválidas');

  const token = jwt.generate({ idUsuario: user.idUsuario, rol: user.rol });

  const safeUser = {
    idUsuario: user.idUsuario,
    nombre: user.nombre,
    apellido: user.apellido,
    email: user.email,
    rol: user.rol,
  };

  return { token, user: safeUser };
};

module.exports = { registerService, loginService };
