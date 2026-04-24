# Backend - Salvando Huellas

API REST para la plataforma Salvando Huellas. Gestiona autenticación, adopciones, animales, tienda solidaria, donaciones, eventos, usuarios, archivos e integraciones externas.

## Stack

- Node.js
- Express
- Sequelize
- PostgreSQL
- JWT
- Passport OAuth
- Mercado Pago
- Cloudinary
- Nodemailer
- Jest + Supertest

## Configuración

Crear el archivo de entorno local:

```bash
cp .env.example .env
```

Variables mínimas para desarrollo:

```text
PORT=4000
FRONT_URL=http://localhost:3000
BACK_URL=http://localhost:4000
DB_NAME=salvando_huellas
DB_USER=postgres
JWT_SECRET=replace-with-a-long-random-secret
```

También se puede usar `DATABASE_URL` para conectarse a Neon, Railway u otro PostgreSQL remoto.

## Scripts

```bash
npm install
npm run dev
npm start
npm test
npm run seed
npm run migrate
```

## Endpoints Base

```text
GET /api/health
/api/v1/auth
/api/v1/users
/api/v1/animals
/api/v1/adoptions
/api/v1/carts
/api/v1/purchases
/api/v1/articles
/api/v1/payments
/api/v1/donations
/api/v1/events
/api/v1/uploads
/api/v1/contact
```

## Organización

```text
src/routes       # Rutas Express
src/controllers  # Controladores HTTP
src/services     # Reglas de negocio
src/models       # Modelos Sequelize
src/validations  # Validaciones de entrada
src/middlewares  # Auth, errores y validación
src/configs      # DB, Passport, Cloudinary y asociaciones
tests            # Tests unitarios e integración
```

## Seguridad

- JWT para rutas protegidas.
- Roles `user` y `admin`.
- Contraseñas hasheadas con bcrypt.
- Helmet para cabeceras HTTP.
- Validación centralizada de requests.
- Variables sensibles fuera del repositorio.

## Producción

En producción se desactiva `sequelize.sync`. Usar migraciones para cambios de base de datos:

```bash
npm run migrate
```
