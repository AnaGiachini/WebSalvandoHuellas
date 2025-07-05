/**
 * Middleware para manejo de rutas no encontradas (404)
 */
const notFoundMiddleware = (req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
};

/**
 * Middleware para manejo de errores generales
 */
const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
};

module.exports = {
  notFoundMiddleware,
  errorMiddleware
};
