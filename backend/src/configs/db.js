/**
 * Configuración de Base de Datos
 * --------------------------------------------------------------------------
 * Establece y configura la conexión a la base de datos PostgreSQL.
 *
 *  • Características principales
 *      - Soporta múltiples entornos (desarrollo, pruebas, producción)
 *      - Utiliza DATABASE_URL   → Conexión mediante URL completa desde variables de entorno
 *      - SSL configurado        → Seguridad en la conexión basada en configuración
 *      - Pool de conexiones     → Manejo eficiente de múltiples conexiones simultáneas
 *
 *  • Opciones configuradas
 *      - dialect: 'postgres'    → Motor de base de datos PostgreSQL
 *      - logging: false         → Deshabilita logs de consultas SQL en consola
 *      - ssl: require           → Conexión segura según configuración en .env
 *      - pool                   → Configuración de límites y tiempos del pool de conexiones
 *
 *  • Notas
 *      – Las credenciales se obtienen del archivo .env mediante dotenv
 *      – Para pruebas automatizadas se puede usar una base de datos local específica
 *      – Se establece rejectUnauthorized: false para permitir certificados autofirmados
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Determinar el entorno actual (desarrollo, prueba o producción)
const env = process.env.NODE_ENV || 'development';

// Configuración según el entorno
let sequelize;

if (env === 'test') {
  // Configuración para entorno de pruebas (base de datos PostgreSQL local)
  sequelize = new Sequelize({
    database: process.env.TEST_DB_NAME || 'salvando_huellas_test',
    username: process.env.TEST_DB_USER || process.env.DB_USER || 'postgres',
    password: process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD || 'postgres',
    host: process.env.TEST_DB_HOST || 'localhost',
    port: process.env.TEST_DB_PORT || process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else if (process.env.DATABASE_URL) {
  // Configuración para entornos donde se proporciona una URL completa (Neon, producción, etc.)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: process.env.DB_SSL === 'true',
        rejectUnauthorized: false
      }
    },
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Configuración por defecto con variables separadas (desarrollo local)
  sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
}

module.exports = sequelize;
