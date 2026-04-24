# Salvando Huellas

Plataforma web full stack para una protectora de animales. Centraliza adopciones, donaciones, eventos solidarios, tienda de recaudación, gestión administrativa y pagos en línea.

## Objetivo

El proyecto busca ayudar a una protectora a ordenar su operación diaria y aumentar su impacto:

- Publicar animales disponibles para adopción.
- Recibir solicitudes de adopción con datos del postulante.
- Gestionar donaciones y compras solidarias.
- Difundir eventos de recaudación.
- Administrar usuarios, animales, productos, pedidos, donaciones y solicitudes desde un panel privado.

## Stack

**Frontend**

- React 19
- React Router
- Tailwind CSS
- Radix UI
- Axios
- Lucide React

**Backend**

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

## Funcionalidades Principales

- Registro e inicio de sesión con JWT.
- Recuperación de contraseña.
- Login social con Google/Facebook, sujeto a configuración de credenciales.
- Catálogo de animales y detalle de cada animal.
- Formulario de solicitud de adopción.
- Panel de administración con CRUD de animales, productos, eventos, usuarios, pedidos, donaciones y adopciones.
- Tienda solidaria con carrito, checkout y pedidos.
- Donaciones con integración de Mercado Pago.
- Eventos solidarios.
- Formulario de contacto.
- Subida de imágenes mediante Cloudinary.

## Estructura

```text
.
├── backend/   # API REST, modelos, servicios, rutas, tests y configuración
├── frontend/  # Aplicación React
└── docs/      # Documentación funcional, técnica y de casos de uso
```

## Puesta en Marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/AnaGiachini/WebSalvandoHuellas.git
cd WebSalvandoHuellas
```

### 2. Configurar backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

La API queda disponible en:

```text
http://localhost:4000/api/health
http://localhost:4000/api/v1
```

### 3. Configurar frontend

```bash
cd frontend
cp .env.example .env
npm install
npm start
```

La aplicación queda disponible en:

```text
http://localhost:3000
```

## Scripts

### Backend

```bash
npm run dev      # servidor con nodemon
npm start        # servidor en modo producción/local
npm test         # tests con Jest y Supertest
npm run seed     # datos iniciales de ejemplo
npm run migrate  # migraciones con sequelize-cli
```

### Frontend

```bash
npm start        # servidor de desarrollo
npm run build    # build de producción
npm test -- --watchAll=false
```

## Variables de Entorno

Los valores reales no deben subirse al repositorio. Usar:

- [backend/.env.example](backend/.env.example)
- [frontend/.env.example](frontend/.env.example)

## Documentación

- [Arquitectura](docs/ARQUITECTURA.md)
- [Roadmap profesional](docs/ROADMAP.md)
- [Valor para la protectora](docs/VALOR-PARA-LA-PROTECTORA.md)
- Casos de uso y verificaciones en [docs/](docs/)

## Estado del Proyecto

Proyecto académico/profesional en evolución, preparado para portfolio. Incluye una base funcional amplia y documentación de casos de uso. Las próximas mejoras recomendadas están orientadas a trazabilidad real de adopciones, transparencia de donaciones, automatización de comunicación y métricas para la protectora.

## Autora

Ana Giachini
