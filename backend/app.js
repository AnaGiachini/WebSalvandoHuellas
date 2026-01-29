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
 *      - /api/v1/*      → Rutas principales de la API (auth, adopción, tienda, etc.)
 *
 *  • Manejo de errores
 *      - notFoundMiddleware → Captura rutas no definidas (404)
 *      - errorMiddleware    → Procesamiento centralizado de errores
 *
 *  • Notas
 *      – CORS está configurado en modo "origin: true" (eco del origen) para simplificar
 *        el despliegue en Vercel/Railway durante la tesis
 *      – La ruta /api/health proporciona un punto de verificación simple
 */

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

app.get("/", (req, res) => {
  res.status(200).send("OK");
});


/**
 * =========================
 * CORS (Vercel + Local)
 * =========================
 * - Permite el dominio definido en FRONT_URL
 * - Permite localhost para desarrollo
 * - Permite requests sin Origin (Postman/curl)
 * - Resuelve preflight (OPTIONS) para login y endpoints protegidos
 */
const corsOptions = {
  // Permitir cualquier origen válido. Para tesis/demo es suficiente y evita
  // problemas de configuración entre dominios (Vercel, Railway, etc.).
  // Express-CORS devolverá dinámicamente el mismo origin del request.
  origin: true,
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
