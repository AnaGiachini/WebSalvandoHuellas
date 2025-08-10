/**
 * Servicio: Usuario
 * --------------------------------------------------------------------------
 * Provee la capa de lógica de negocio para operaciones relacionadas con usuarios.
 *
 *  • Funciones principales
 *      getAllUsersService   → obtiene todos los usuarios registrados
 *      getUserByIdService   → busca un usuario por su ID
 *      updateUserService    → actualiza datos de un usuario existente
 *      deleteUserService    → elimina un usuario del sistema
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

module.exports = { getAllUsersService, getUserByIdService, updateUserService, deleteUserService };


