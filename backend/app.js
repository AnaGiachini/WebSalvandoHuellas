const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

// Configuración de CORS
const corsOptions = {
  origin: process.env.FRONT_URL || 'http://localhost:3000',
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

// Importación de rutas (a implementar)
// const routes = require('./src/routes');

// Importación de middlewares
const { notFoundMiddleware, errorMiddleware } = require('./src/middlewares/errorMiddleware');

// Inicialización de la aplicación
const app = express();

// Middlewares
app.use(helmet()); // Seguridad
app.use(cors(corsOptions)); // Habilitar CORS con opciones personalizadas
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Ruta de verificación
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running!' });
});

// Implementación de rutas (descomentá cuando implementes las rutas)
// app.use('/api', routes);

// Middlewares para manejo de errores
app.use(notFoundMiddleware); // Manejo de rutas no encontradas (404)
app.use(errorMiddleware);    // Manejo de errores generales

module.exports = app;