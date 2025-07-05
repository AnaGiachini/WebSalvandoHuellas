const app = require('./app');
const sequelize = require('./src/configs/db');
require('dotenv').config();

// Puerto donde se ejecutará el servidor
const PORT = process.env.PORT || 3001;

// Función para iniciar el servidor
async function startServer() {
  try {
    // Verificar la conexión a la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    
    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
      console.log(`API disponible en: http://localhost:${PORT}/api`);
      console.log(`Verificar estado: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
}

// Iniciar el servidor
startServer();