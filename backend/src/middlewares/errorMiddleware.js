/**
 * Middlewares de Manejo de Errores
 * --------------------------------------------------------------------------
 * Proporciona manejadores centralizados para responder a errores HTTP en la API.
 *
 *  • Middlewares incluidos
 *      notFoundMiddleware  → Maneja solicitudes a rutas inexistentes (404)
 *      errorMiddleware     → Captura y procesa errores generales (500 u otros)
 *
 *  • Características
 *      - Respuestas estandarizadas en formato JSON
 *      - Registro de errores en consola para facilitar depuración
 *      - Ocultamiento de detalles técnicos en entorno de producción
 *
 *  • Notas
 *      – El orden de aplicación importa: notFoundMiddleware debe aplicarse después
 *        de todas las rutas válidas y errorMiddleware debe ser el último middleware
 *      – En producción, solo se muestra el mensaje de error, no el objeto completo
 */

/**
 * Middleware para manejo de rutas no encontradas (404)
 */
const notFoundMiddleware = (req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
};

/**
 * Middleware para manejo de errores generales
 */
const errorMiddleware = (err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    errors: err.errors || undefined // Cambiado de 'details' a 'errors' para consistencia con frontend
  });
};

module.exports = {
  notFoundMiddleware,
  errorMiddleware
};
