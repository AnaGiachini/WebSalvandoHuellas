/**
 * Middleware: Autenticación y Autorización
 * --------------------------------------------------------------------------
 * Gestiona el control de acceso a rutas protegidas de la API.
 *
 *  • Funciones principales
 *      protect    → verifica la validez del token JWT
 *      restrictTo → limita el acceso según el rol del usuario
 *
 *  • Comportamiento
 *      - Extrae el token del encabezado Authorization (formato Bearer)
 *      - Verifica la validez y expiración del token
 *      - Agrega la información del usuario a req.user si es válido
 *      - Controla permisos basados en el rol (admin/user)
 *
 *  • Códigos de error
 *      401 → Token ausente o inválido (no autorizado)
 *      403 → Usuario sin permisos suficientes (prohibido)
 */

const jwt = require('../utils/jwt');

/**
 * Verifica que el usuario esté autenticado mediante JWT
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al siguiente middleware
 */
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token requerido' });

  try {
    req.user = jwt.verify(token);
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido' });
  }
};

/**
 * Restringe el acceso según el rol del usuario
 * @param {string} role - Rol requerido para acceder (admin/user)
 * @returns {Function} Middleware que valida el rol del usuario
 */
const restrictTo = role => (req, res, next) =>
  req.user.rol === role
    ? next()
    : res.status(403).json({ message: 'Sin permisos' });

module.exports = { protect, restrictTo };

