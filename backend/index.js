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
 *      - Puerto: Obtenido de variables de entorno (PORT) o 8080 por defecto
 *      - Base de datos: Utiliza la conexión configurada en src/configs/db.js
 *
 *  • Notas
 *      – El servidor no se inicia si la conexión a la base de datos falla
 *      – En producción no se ejecuta sequelize.sync (usar migraciones)
 *      – El servidor se vincula a 0.0.0.0 para funcionar en Railway/containers
 *      – Las rutas y middlewares de la API se definen en app.js
 */

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

const PORT = Number(process.env.PORT) || 8080;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos OK.");

    // En producción NO sincronices (puede tardar/morir el deploy)
    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync({ alter: true, force: false });
      console.log("✅ Modelos sincronizados (dev).");
    } else {
      console.log("ℹ️ Producción: sequelize.sync desactivado (usar migraciones).");
    }

    // 🔥 Importante: bind explícito a 0.0.0.0
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`✅ Health: http://0.0.0.0:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1); // si falla DB, que el deploy falle claro
  }
}

startServer();

