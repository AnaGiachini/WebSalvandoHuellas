/**
 * Punto de Entrada: Servidor de API "Salvando Huellas"
 * --------------------------------------------------------------------------
 * Inicia el servidor Express y establece la conexión con la base de datos.
 *
 *  • Responsabilidades principales
 *      - Verificación de conexión a la base de datos PostgreSQL en Neon
 *      - Inicialización del servidor HTTP en el puerto configurado
 *      - Manejo de errores durante el proceso de inicialización
 *
 *  • Configuraciones
 *      - Puerto: Obtenido de variables de entorno (PORT) o 3001 por defecto
 *      - Base de datos: Utiliza la conexión configurada en configs/db.js
 *
 *  • Notas
 *      – El servidor no se inicia si la conexión a la base de datos falla
 *      – Se proporcionan URLs informativas en la consola al iniciar
 *      – Todos los detalles de configuración de rutas están en app.js
 */

// const app = require('./app');
// const sequelize = require('./src/configs/db');
// require('dotenv').config();

// // Puerto donde se ejecutará el servidor
// const PORT = process.env.PORT || 3001;

// // Función para iniciar el servidor
// async function startServer() {
//   try {
//     // Verificar la conexión a la base de datos
//     await sequelize.authenticate();
//     console.log('Conexión a la base de datos establecida correctamente.');

//     // Sincronizar modelos ↔ tablas
//     // alter:true  → ajusta columnas que falten o sobren
//     // force:false → NO borra tablas (seguro en dev)
//     await sequelize.sync({ alter: true, force: false });
//     console.log('Modelos sincronizados.');

    
//     // Iniciar el servidor
//     app.listen(PORT, () => {
//       console.log(`Servidor corriendo en el puerto ${PORT}`);
//       console.log(`API disponible en: http://localhost:${PORT}/api`);
//       console.log(`Verificar estado: http://localhost:${PORT}/api/health`);
//     });
//   } catch (error) {
//     console.error('Error al iniciar el servidor:', error);
//   }
// }

// // Iniciar el servidor
// startServer();



const app = require("./app");
const sequelize = require("./src/configs/db");
require("dotenv").config();

// Railway setea PORT automáticamente. Fallback seguro.
const PORT = Number(process.env.PORT) || 4000;
const isProd = process.env.NODE_ENV === "production";

async function startServer() {
  try {
    // Verificar conexión DB
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos OK.");

    /**
     * ⚠️ IMPORTANTE:
     * En producción NO usar sync con alter:true porque:
     * - puede colgarse
     * - puede fallar con constraints/locks
     * - te deja el server sin levantar (502 en Railway)
     *
     * En dev sí puede servir.
     */
    if (!isProd) {
      await sequelize.sync({ alter: true, force: false });
      console.log("✅ Modelos sincronizados (DEV).");
    } else {
      console.log("ℹ️ Producción: sequelize.sync desactivado (usar migraciones).");
    }

    // Levantar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    // Importante para Railway: si falla, que reinicie el contenedor
    process.exit(1);
  }
}

startServer();
