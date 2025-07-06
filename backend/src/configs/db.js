/**
 * Configuración de Base de Datos
 * --------------------------------------------------------------------------
 * Establece y configura la conexión a la base de datos PostgreSQL en Neon.
 *
 *  • Características principales
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
 *      – La configuración simplificada utiliza DATABASE_URL para todos los parámetros
 *      – Se establece rejectUnauthorized: false para permitir certificados autofirmados
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración para conectar a la base de datos PostgreSQL en Neon
const sequelize = new Sequelize(process.env.DATABASE_URL, {
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

module.exports = sequelize;
