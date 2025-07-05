# Backend - Salvando Huellas

Este es el backend para el proyecto Salvando Huellas, desarrollado con Node.js, Express, Sequelize y PostgreSQL.

## Estructura del Proyecto

```
backend/
├── src/
│   ├── docs/         # Documentación
│   ├── utils/        # Utilidades y funciones helper
│   ├── middlewares/  # Middlewares de Express
│   ├── routes/       # Definición de rutas
│   ├── services/     # Lógica de negocio
│   ├── controllers/  # Controladores
│   ├── models/       # Modelos de Sequelize
│   └── validations/  # Validaciones
├── app.js           # Configuración de Express
├── index.js         # Punto de entrada
├── .env             # Variables de entorno
└── package.json     # Dependencias
```

## Configuración

1. Instala las dependencias:
   ```
   npm install
   ```

2. Configura las variables de entorno:
   Crea un archivo `.env` basado en el ejemplo y añade tus credenciales de base de datos.

3. Ejecuta el servidor:
   ```
   npm start
   ```

## Base de datos

Este proyecto utiliza Sequelize como ORM y PostgreSQL hospedado en Neon como base de datos.
