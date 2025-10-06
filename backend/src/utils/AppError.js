/**
 * Utilidad: AppError
 * --------------------------------------------------------------------------
 * Clase personalizada para manejo de errores en la aplicación.
 */

class AppError extends Error {
  constructor(statusCode, message, errors = undefined) {
    super(message);
    this.status = statusCode;
    this.errors = errors;
  }
}

module.exports = AppError;
