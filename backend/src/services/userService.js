/**
 * Servicio: Usuario
 * --------------------------------------------------------------------------
 * Provee la capa de lógica de negocio para operaciones relacionadas con usuarios.
 *
 *  • Casos de uso
 *      - UC01 / UC02: apoyo indirecto para registro e inicio de sesión
 *      - UC07: Gestión de usuarios (panel admin y datos de perfil)
 *
 *  • Funciones principales
 *      getAllUsersService   → obtiene todos los usuarios registrados (admin, UC07)
 *      getUserByIdService   → busca un usuario por su ID (admin, UC07)
 *      updateUserService    → actualiza datos de un usuario existente (perfil propio o admin, UC07)
 *      deleteUserService    → elimina un usuario del sistema (admin, UC07)
 *      getMeFullService     → devuelve el perfil del usuario autenticado (UC07)
 *
 *  • Manejo de errores
 *      - Lanza AppError 404 cuando no encuentra un usuario solicitado
 *      - Asegura consistencia en operaciones de actualización y borrado
 *
 *  • Notas
 *      – Implementa normalización de datos para mejorar la consistencia
 *      – Utiliza modelo Usuario para interactuar con la base de datos
 */

const Usuario = require('../models/usuario');
const AppError = require('../utils/AppError');
const bcrypt = require('bcrypt');

/**
 * Obtiene la lista completa de usuarios
 * @returns {Promise<Array>} Lista de usuarios
 */
const getAllUsersService = () => Usuario.findAll();

/**
 * Busca un usuario por su ID
 * @param {number} id - ID del usuario a buscar
 * @returns {Promise<Object>} Datos del usuario
 * @throws {AppError} Si el usuario no existe
 */
const getUserByIdService = async (id) => {
  const user = await Usuario.findByPk(id);
  if (!user) throw new AppError(404, 'User not found');
  return user;
};

/**
 * Actualiza los datos de un usuario
 * @param {number} id - ID del usuario a actualizar
 * @param {Object} data - Nuevos datos del usuario
 * @returns {Promise<Object>} Usuario actualizado
 */
const updateUserService = async (id, data) => {
  const user = await getUserByIdService(id);
  await user.update(data);
  return user;
};

/**
 * Elimina un usuario del sistema
 * @param {number} id - ID del usuario a eliminar
 */
const deleteUserService = async (id) => {
  const user = await getUserByIdService(id);
  await user.destroy();
};

/**
 * Obtiene los datos del usuario autenticado
 * @param {Object} req - Request object
 * @returns {Promise<Object>} Datos del usuario autenticado
 */
const getMeService = async (req) => req.user;

/**
 * Obtiene el perfil completo del usuario autenticado (desde DB)
 * @param {number} idUsuario - ID del usuario autenticado
 * @returns {Promise<Object>} Datos seguros del usuario
 */
const getMeFullService = async (idUsuario) => {
  const user = await Usuario.findByPk(idUsuario, {
    attributes: ['idUsuario', 'nombre', 'apellido', 'email', 'rol', 'direccion', 'telefono'],
  });
  if (!user) throw new AppError(404, 'User not found');
  return user;
};

module.exports = {
  /**
   * Admin: crea usuario manualmente (UC07)
   * ------------------------------------------------------------------------
   * Permite que un administrador registre usuarios desde el panel de gestión,
   * aplicando las mismas reglas de normalización y seguridad que el registro
   * tradicional (UC01), pero sin pasar por el flujo de formulario público.
   */
  adminCreateUserService: async ({ nombre, apellido, email, contrasena, direccion, telefono, rol = 'user' }) => {
    // Normalización (siguiendo memoria previa)
    const normalized = {
      nombre: nombre ? nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase() : nombre,
      apellido: apellido ? apellido.charAt(0).toUpperCase() + apellido.slice(1).toLowerCase() : apellido,
      email: email ? email.trim().toLowerCase() : email,
      direccion: direccion ? direccion.trim() : direccion,
      telefono,
      rol,
    };
    try {
      const hash = await bcrypt.hash(contrasena, 10);
      const created = await Usuario.create({ ...normalized, contrasena: hash });
      // Retornar datos seguros
      const { contrasena: _p, ...safe } = created.toJSON();
      return safe;
    } catch (err) {
      if (err && (err.name === 'SequelizeUniqueConstraintError' || /unique|duplic/i.test(String(err.message)))) {
        throw new AppError(409, 'Email ya registrado');
      }
      throw err;
    }
  },
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
  getMeService,
  getMeFullService,
  /**
   * Admin: cambiar rol (UC07)
   * ------------------------------------------------------------------------
   * Habilita la administración de permisos dentro del sistema, permitiendo
   * promover o degradar usuarios entre los roles "user" y "admin".
   */
  changeUserRoleService: async (id, rol) => {
    const user = await getUserByIdService(id);
    await user.update({ rol });
    return user;
  }
};
