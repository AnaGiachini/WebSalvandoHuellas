# Salvando Huellas

Web application for **Salvando Huellas**, an animal rescue organization. The project helps manage animals for adoption, adoption requests, donations, events, store products, users, and admin tasks.

I built this project as a full stack application, with my main focus on the backend: REST API design, authentication, PostgreSQL data modeling, business logic, validations, and integrations.

## Tech Stack

**Backend**

- Node.js
- Express
- PostgreSQL
- Sequelize
- JWT
- Mercado Pago
- Cloudinary
- Nodemailer
- Jest + Supertest

**Frontend**

- React
- React Router
- Axios
- Tailwind CSS

## Main Features

- User registration and login.
- JWT authentication and protected routes.
- Public animal catalog.
- Adoption request form for logged-in users.
- Admin panel for animals, users, products, events, donations, orders, and adoption requests.
- Store flow with cart and purchases.
- Donation flow with Mercado Pago.
- Image uploads with Cloudinary.

## Backend Structure

```text
backend/
├── app.js
├── index.js
└── src/
    ├── routes/
    ├── controllers/
    ├── services/
    ├── models/
    ├── validations/
    ├── middlewares/
    ├── configs/
    └── utils/
```

The backend follows this flow:

```text
Request
-> route
-> middleware / validation
-> controller
-> service
-> Sequelize model
-> PostgreSQL
```

## Adoption Request Flow

One of the main backend flows is the adoption request:

```text
User submits the form from React
-> Axios sends POST /api/v1/adoptions
-> JWT is sent in the Authorization header
-> backend validates the token
-> backend validates the request body
-> service checks if the animal exists and is available
-> transaction creates the adoption request
-> transaction updates the animal status to en_proceso
```

The backend gets the user ID from the JWT (`req.user`) instead of trusting an ID sent from the frontend.

## API Examples

```text
POST   /api/v1/auth/register
POST   /api/v1/auth/login

GET    /api/v1/animals
GET    /api/v1/animals/:id
POST   /api/v1/animals              # admin
PUT    /api/v1/animals/:id          # admin
DELETE /api/v1/animals/:id          # admin

POST   /api/v1/adoptions            # logged-in user
GET    /api/v1/adoptions            # admin
PUT    /api/v1/adoptions/:id/estado # admin
```

## Environment Variables

Use the example files:

- `backend/.env.example`
- `frontend/.env.example`

The backend can connect to PostgreSQL using either:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

or local variables:

```env
DB_NAME=salvando_huellas
DB_USER=postgres
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=5432
```

Real `.env` files should not be committed.

## Local Setup

Backend:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Frontend:

```bash
cd frontend
cp .env.example .env
npm install
npm start
```

Local URLs:

```text
Backend:  http://localhost:4000
Frontend: http://localhost:3000
```

## Status

Functional full stack project built for a real animal rescue organization. I am currently using it as a backend-focused project for my portfolio and job applications.

## Author

Ana Giachini
