/**
 * Configuración para Sequelize CLI
 * --------------------------------------------------------------------------
 * Este archivo es usado exclusivamente por sequelize-cli para migraciones y seeders.
 * Permite la configuración de diferentes entornos (desarrollo, prueba, producción).
 */
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'neondb',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: process.env.DB_SSL === 'true',
        rejectUnauthorized: false
      }
    },
    logging: false
  },
  test: {
    // Para pruebas, usa credenciales locales de PostgreSQL
    // IMPORTANTE: Ajustar estas credenciales según tu configuración local
    username: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || '123456',  // Dejamos vacío por defecto para que el usuario ajuste según su configuración
    database: 'salvando_huellas_test',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  }
};
