/**
 * Controlador: Usuario
 * --------------------------------------------------------------------------
 * Gestiona las rutas de la API relacionadas con usuarios.
 *
 *  • Caso de uso principal
 *      UC07: Gestión de usuarios (perfil del usuario logueado y panel admin).
 *
 *  • Operaciones principales
 *      getAllUsers   → lista todos los usuarios registrados (solo admin)
 *      getUserById   → obtiene un usuario específico por ID (solo admin)
 *      updateUser    → actualiza datos de un usuario existente
 *      deleteUser    → elimina un usuario del sistema (solo admin)
 *      getMe         → devuelve el perfil completo del usuario autenticado
 *      adminCreateUser / changeUserRole → funciones específicas de panel admin
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
  deleteUserService,
  getMeFullService,
  adminCreateUserService,
  changeUserRoleService,
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
    if (req.user.rol !== 'admin' && Number(req.user.idUsuario) != Number(req.params.id)) {
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

/**
 * Obtiene el perfil completo del usuario autenticado desde la BD
 */
const getMe = async (req, res, next) => {
  try {
    const me = await getMeFullService(req.user.idUsuario);
    res.json(me);
  } catch (err) { next(err); }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, getMe };
/**
 * Crea un usuario manualmente (solo admin, UC07)
 * --------------------------------------------------------------------------
 * Forma parte del panel de gestión de usuarios: permite al administrador
 * registrar cuentas sin pasar por el formulario de registro público.
 */
const adminCreateUser = async (req, res, next) => {
  try {
    const created = await adminCreateUserService(req.body);
    res.status(201).json(created);
  } catch (err) { next(err); }
};

/**
 * Cambia el rol de un usuario (solo admin, UC07)
 * --------------------------------------------------------------------------
 * Permite administrar permisos dentro del sistema, alternando entre los roles
 * "user" y "admin" según las necesidades de la organización.
 */
const changeUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;
    const updated = await changeUserRoleService(id, rol);
    res.json(updated);
  } catch (err) { next(err); }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, getMe, adminCreateUser, changeUserRole };
