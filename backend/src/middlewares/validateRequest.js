/**
 * Middleware: Validación de Solicitudes
 * --------------------------------------------------------------------------
 * Verifica que las solicitudes cumplan con las reglas de validación definidas.
 *
 *  • Funcionalidad principal
 *      validateRequest → procesa los resultados de validación de express-validator
 *
 *  • Comportamiento
 *      - Captura errores de validación de datos en solicitudes
 *      - Genera un AppError con código 400 (Bad Request) cuando hay errores
 *      - Incluye detalles de validación para facilitar corrección al cliente
 *
 *  • Notas
 *      – Debe utilizarse después de las reglas de validación en las rutas
 *      – Trabaja en conjunto con express-validator para validación de campos
 */

const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * Verifica si hay errores de validación en la solicitud
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} _res - Objeto de respuesta Express (no utilizado)
 * @param {Function} next - Función para continuar al siguiente middleware
 */
exports.validateRequest = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return next(new AppError(400, 'Validation errors', errors.array()));
  next();
};

