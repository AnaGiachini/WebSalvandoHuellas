# Frontend - Salvando Huellas

Aplicación React para la plataforma Salvando Huellas. Incluye la experiencia pública para adoptantes/donantes y el panel administrativo para la protectora.

## Stack

- React 19
- React Router
- Tailwind CSS
- Radix UI
- Axios
- Lucide React

## Configuración

Crear el archivo de entorno local:

```bash
cp .env.example .env
```

Variables principales:

```text
REACT_APP_API_URL=http://localhost:4000/api/v1
REACT_APP_BACK_URL=http://localhost:4000
REACT_APP_NAME=Salvando Huellas
```

## Scripts

```bash
npm install
npm start
npm run build
npm test -- --watchAll=false
```

## Rutas Principales

- `/` inicio
- `/adopcion` animales disponibles
- `/adopcion/:id` detalle de animal
- `/mis-solicitudes` solicitudes del usuario
- `/tienda` tienda solidaria
- `/carrito` carrito
- `/checkout` checkout
- `/eventos` eventos
- `/donaciones` donaciones
- `/perfil` perfil
- `/admin` panel administrativo

## Organización

```text
src/pages       # Vistas principales
src/components  # Componentes reutilizables
src/services    # Clientes HTTP
src/layouts     # Layout raíz
src/hooks       # Hooks compartidos
```

## Notas de Desarrollo

- El cliente HTTP central está en `src/services/api.js`.
- El token JWT se agrega automáticamente en el interceptor de Axios.
- Las rutas admin se protegen desde `components/auth/RequireAdmin.jsx`.
- El build de producción se genera en `build/`.
