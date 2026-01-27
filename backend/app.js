/**
 * Configuración de la Aplicación Express
 * --------------------------------------------------------------------------
 * Configura la aplicación Express con middlewares, rutas y manejadores de error.
 *
 *  • Middlewares implementados
 *      - helmet         → Protección contra vulnerabilidades web comunes
 *      - cors           → Control de acceso entre dominios configurado para el frontend
 *      - morgan         → Registro de solicitudes HTTP para desarrollo
 *      - express.json   → Análisis de cuerpos JSON en solicitudes
 *      - express.urlencoded → Análisis de datos codificados en URL
 *
 *  • Rutas configuradas
 *      - /api/health    → Verificación del estado del servidor
 *      - /api/*         → Rutas principales (comentadas, pendientes de implementación)
 *
 *  • Manejo de errores
 *      - notFoundMiddleware → Captura rutas no definidas (404)
 *      - errorMiddleware    → Procesamiento centralizado de errores
 *
 *  • Notas
 *      – Las opciones CORS están configuradas para permitir conexiones desde el frontend
 *      – Las rutas principales están comentadas hasta su implementación
 *      – La ruta /api/health proporciona un punto de verificación simple
 */

// const express = require('express');
// const cors = require('cors');
// const morgan = require('morgan');
// const helmet = require('helmet');
// require('dotenv').config();

// // Importación de asociaciones
// const associations = require('./src/configs/associations');
// associations(); // Cargar asociaciones de modelos

// // Passport (estrategias OAuth)
// const passport = require('./src/configs/passport');

// // Configuración de CORS
// const corsOptions = {
//   origin: process.env.FRONT_URL || 'http://localhost:3000',
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   credentials: true,
//   allowedHeaders: [
//     "Origin",
//     "X-Requested-With",
//     "Content-Type",
//     "Accept",
//     "Authorization",
//     "user-device-id",
//     "user-device-name",
//   ],
// };

// // Importación de rutas (a implementar)
// const routes = require('./src/routes');

// // Importación de middlewares
// const { notFoundMiddleware, errorMiddleware } = require('./src/middlewares/errorMiddleware');

// // Inicialización de la aplicación
// const app = express();

// // Middlewares
// app.use(helmet()); // Seguridad
// app.use(cors(corsOptions)); // Habilitar CORS con opciones personalizadas
// app.use(morgan('dev')); // Logging
// app.use(express.json()); // Parse JSON bodies
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
// // Inicializar Passport (stateless)
// app.use(passport.initialize());

// // Ruta de verificación
// app.get('/api/health', (req, res) => {
//   res.status(200).json({ status: 'ok', message: 'Server is running!' });
// });

// // Implementación de rutas
// app.use('/api/v1', routes);

// // Middlewares para manejo de errores
// app.use(notFoundMiddleware); // Manejo de rutas no encontradas (404)
// app.use(errorMiddleware);    // Manejo de errores generales

// module.exports = app;

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
require("dotenv").config();

// Importación de asociaciones
const associations = require("./src/configs/associations");
associations(); // Cargar asociaciones de modelos

// Passport (estrategias OAuth)
const passport = require("./src/configs/passport");

// Importación de rutas
const routes = require("./src/routes");

// Importación de middlewares
const {
  notFoundMiddleware,
  errorMiddleware,
} = require("./src/middlewares/errorMiddleware");

// Inicialización de la aplicación
const app = express();

/**
 * =========================
 * CORS (Vercel + Local)
 * =========================
 * - Permite el dominio definido en FRONT_URL
 * - Permite localhost para desarrollo
 * - Permite requests sin Origin (Postman/curl)
 * - Resuelve preflight (OPTIONS) para login y endpoints protegidos
 */
const allowedOrigins = [
  process.env.FRONT_URL,       // ej: https://web-salvando-huellas.vercel.app
  "http://localhost:3000",
].filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    // Permite requests sin origin (Postman, curl, server-to-server)
    if (!origin) return cb(null, true);

    if (allowedOrigins.includes(origin)) return cb(null, true);

    return cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "user-device-id",
    "user-device-name",
  ],
};

// Middlewares (orden importante)
app.use(helmet());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ Preflight
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar Passport (stateless)
app.use(passport.initialize());

// Ruta de verificación
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running!" });
});

// Rutas API
app.use("/api/v1", routes);

// Middlewares para manejo de errores
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
