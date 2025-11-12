/**
 * Validación: Animal
 * --------------------------------------------------------------------------
 * Proporciona reglas de validación para operaciones relacionadas con animales.
 *
 *  • Campos validados
 *      nombre      → entre 2-50 caracteres
 *      especie     → debe ser 'perro' o 'gato'
 *      sexo        → debe ser 'macho' o 'hembra'
 *      edad        → debe ser un número entero positivo
 *      tamano      → entre 2-20 caracteres
 *      historia    → texto libre
 *      estadoAdopcion → debe ser 'adoptado', 'en_proceso' o 'sin_hogar'
 *      foto        → ruta de la imagen (string)
 *
 *  • Conjuntos de reglas
 *      createAnimalValidation → validaciones para registro de nuevos animales
 *      updateAnimalValidation → validaciones para actualización de datos (campos opcionales)
 *
 *  • Notas
 *      – Se utiliza express-validator para definir las reglas
 *      – La normalización garantiza consistencia en los datos almacenados
 */

const { body } = require('express-validator');
const { validateRequest } = require('../middlewares/validateRequest');

/* ─── Reglas de campos reutilizables ──────────────────────────────────── */
const nombre = body('nombre')
  .isString()
  .isLength({ min: 2, max: 50 })
  .withMessage('El nombre debe tener entre 2 y 50 caracteres');

const especie = body('especie')
  .isIn(['perro', 'gato'])
  .withMessage('La especie debe ser perro o gato');

const sexo = body('sexo')
  .isIn(['macho', 'hembra'])
  .withMessage('El sexo debe ser macho o hembra');

const edad = body('edad')
  .isIn(['cachorro', 'joven', 'adulto', 'adulto mayor'])
  .withMessage('La edad debe ser cachorro, joven, adulto o adulto mayor');

const tamano = body('tamano')
  .isIn(['pequeño', 'mediano', 'grande'])
  .withMessage('El tamaño debe ser pequeño, mediano o grande');

const historia = body('historia')
  .isString()
  .withMessage('La historia debe ser un texto');

const estadoAdopcion = body('estadoAdopcion') 
  .isIn(['adoptado', 'en_proceso', 'sin_hogar'])
  .withMessage('El estado de adopción debe ser uno de los siguientes valores: adoptado, en_proceso, sin_hogar');

const foto = body('foto')
  .isString()
  .withMessage('La foto debe ser una ruta válida');

/* ─── Conjuntos de reglas exportados ─────────────────────────────────── */
const createAnimalValidation = [
  nombre, 
  especie,
  sexo, 
  edad.optional(), 
  tamano.optional(), 
  historia.optional(), 
  estadoAdopcion.optional(), 
  foto.optional(),
  validateRequest
];

const updateAnimalValidation = [
  nombre.optional(),
  especie.optional(),
  sexo.optional(),
  edad.optional(),
  tamano.optional(),
  historia.optional(),
  estadoAdopcion.optional(),
  foto.optional(),
  validateRequest
];

module.exports = { createAnimalValidation, updateAnimalValidation };
