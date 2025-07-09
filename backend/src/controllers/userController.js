/**
 * Controlador: Usuario
 * --------------------------------------------------------------------------
 * Gestiona las rutas de la API relacionadas con usuarios.
 *
 *  • Operaciones principales
 *      getAllUsers   → lista todos los usuarios registrados
 *      getUserById   → obtiene un usuario específico por ID
 *      updateUser    → actualiza datos de un usuario existente
 *      deleteUser    → elimina un usuario del sistema
 *
 *  • Características
 *      - Implementa manejo de errores con try/catch
 *      - Delega la lógica de negocio a los servicios correspondientes
 *      - Devuelve respuestas JSON estandarizadas
 *
 *  • Respuestas HTTP
 *      200 → Éxito (OK) para operaciones de lectura y actualización
 *      204 → Éxito sin contenido (No Content) para eliminaciones
 *      4xx/5xx → Errores (manejados por errorMiddleware)
 */

const {
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService
} = require('../services/userService');

/**
 * Obtiene la lista de todos los usuarios
 * @param {Object} _req - Objeto de solicitud Express (no utilizado)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const getAllUsers = async (_req, res, next) => {
  try {
    const users = await getAllUsersService();
    res.json(users);
  } catch (err) { next(err); }
};

/**
 * Obtiene un usuario por su ID
 * @param {Object} req - Objeto de solicitud Express con parámetro id
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id);
    res.json(user);
  } catch (err) { next(err); }
};

/**
 * Actualiza los datos de un usuario existente
 * @param {Object} req - Objeto de solicitud Express con parámetro id y body
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const updateUser = async (req, res, next) => {
  try {
    // Verificar si el usuario tiene permisos para esta actualización
    // Solo se permite si es admin o si está actualizando su propio perfil
    if (req.user.rol !== 'admin' && req.user.id != req.params.id) {
      return res.status(403).json({ message: 'Sin permisos para editar este usuario' });
    }
    
    const user = await updateUserService(req.params.id, req.body);
    res.json(user);
  } catch (err) { next(err); }
};

/**
 * Elimina un usuario del sistema
 * @param {Object} req - Objeto de solicitud Express con parámetro id
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al middleware de error
 */
const deleteUser = async (req, res, next) => {
  try {
    await deleteUserService(req.params.id);
    res.sendStatus(204);
  } catch (err) { next(err); }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
