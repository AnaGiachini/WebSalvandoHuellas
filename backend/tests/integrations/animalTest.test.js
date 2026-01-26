/**
 * Test: animalAPI
 * --------------------------------------------------------------------------
 * Tests de integración para las rutas de API relacionadas con animales.
 */

const request = require('supertest');
const app = require("../../app");
const Animal = require("../../src/models/animal");
const Usuario = require("../../src/models/usuario");
const { generate } = require("../../src/utils/jwt");
const resetDatabase = require("../../src/utils/resetDatabase.helper");

describe('API de Animales', () => {
  let adminToken;
  let animalId;

  const testAnimal = { 
    nombre: 'Firulais',
    especie: 'perro',
    sexo: 'macho', 
    edad: 'adulto', 
    tamano: 'mediano', 
    historia: 'Historia de prueba',
    estadoAdopcion: 'sin_hogar',
    foto: 'ruta/imagen.jpg' 
  };

  beforeEach(async () => {
    await resetDatabase();

    const admin = await Usuario.create({
      nombre: 'Admin',
      apellido: 'Test',
      email: 'admin@test.com',
      contrasena: 'Admin123',
      rol: 'admin'
    });

    adminToken = generate({ id: admin.idUsuario, rol: 'admin' });

    const animal = await Animal.create(testAnimal);
    animalId = animal.idAnimal;
  });

  it('GET /animals - Obtiene todos los animales', async () => {
    const res = await request(app).get('/api/v1/animals');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /animals/:id - Obtiene un animal por ID', async () => {
    const res = await request(app).get(`/api/v1/animals/${animalId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe(testAnimal.nombre);
  });

  it('GET /animals/status - Filtra animales por estado de adopción', async () => {
    const res = await request(app)
      .get('/api/v1/animals/status')
      .query({ estadoAdopcion: 'sin_hogar' });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach(animal => {
      expect(animal.estadoAdopcion).toBe('sin_hogar');
    });
  });

  it('POST /animals - Crea un nuevo animal (requiere autenticación)', async () => {
    const newAnimal = {
      nombre: 'Pelusa',
      especie: 'gato',
      sexo: 'hembra',
      edad: 'joven',
      tamano: 'pequeño',
      historia: 'Gata rescatada',
      estadoAdopcion: 'sin_hogar'
    };

    const res = await request(app)
      .post('/api/v1/animals')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newAnimal);

    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe(newAnimal.nombre);

    const resNoAuth = await request(app).post('/api/v1/animals').send(newAnimal);
    expect(resNoAuth.statusCode).toBe(401);
  });

  it('PUT /animals/:id - Actualiza un animal (requiere autenticación)', async () => {
    const updatedData = { nombre: 'Firulais Updated', estadoAdopcion: 'adoptado' };

    const res = await request(app)
      .put(`/api/v1/animals/${animalId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updatedData);

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe(updatedData.nombre);
    expect(res.body.estadoAdopcion).toBe(updatedData.estadoAdopcion);

    const resNoAuth = await request(app)
      .put(`/api/v1/animals/${animalId}`)
      .send(updatedData);

    expect(resNoAuth.statusCode).toBe(401);
  });

  it('DELETE /animals/:id - Elimina un animal (requiere autenticación)', async () => {
    const animalToDelete = await Animal.create({
      nombre: 'AnimalToDelete',
      especie: 'perro',
      sexo: 'macho',
      edad: 'cachorro',
      tamano: 'pequeño',
      estadoAdopcion: 'sin_hogar'
    });

    const res = await request(app)
      .delete(`/api/v1/animals/${animalToDelete.idAnimal}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(204);

    const checkRes = await request(app).get(`/api/v1/animals/${animalToDelete.idAnimal}`);
    expect(checkRes.statusCode).toBe(404);

    const resNoAuth = await request(app)
      .delete(`/api/v1/animals/${animalId}`);
    expect(resNoAuth.statusCode).toBe(401);
  });
});
