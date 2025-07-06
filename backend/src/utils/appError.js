/**
 * Utilidad: AppError
 * --------------------------------------------------------------------------
 * Clase personalizada para manejo de errores en la aplicación.
 *
 *  • Propiedades
 *      status    → código HTTP del error (ej. 400, 404, 500)
 *      message   → descripción del error para el cliente
 *      errors    → detalles adicionales (opcional, ej. errores de validación)
 *
 *  • Uso principal
 *      - Base para errores controlados en la aplicación
 *      - Capturado por el errorMiddleware para respuestas estandarizadas
 *
 *  • Notas
 *      – Extiende la clase Error nativa de JavaScript
 *      – Facilita la creación de respuestas de error con formato consistente
 */

const AppError = class AppError extends Error {
  constructor(statusCode, message, errors = undefined) {
    super(message);
    this.status = statusCode;   // nombre corto que usaremos en el middleware
    this.errors = errors;       // opcional: array de detalles (ej. validaciones)
  }
};
module.exports = AppError;
