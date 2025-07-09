/**
 * Test: animalAPI
 * --------------------------------------------------------------------------
 * Tests de integración para las rutas de API relacionadas con animales.
 *
 *  • Pruebas principales
 *      - Obtención de listado de animales
 *      - Obtención de animal por ID
 *      - Creación de nuevos animales (requiere autenticación)
 *      - Actualización de animales (requiere autenticación)
 *      - Eliminación de animales (requiere autenticación)
 *      - Filtrado por estado de adopción
 */

const request = require('supertest');
const app = require('../app');
const db = require("../src/configs/db");
const Animal = require('../src/models/animal');
const Usuario = require('../src/models/usuario');
const { generate } = require('../src/utils/jwt');

describe('API de Animales', () => {
  let adminToken;
  let animalId;
  
  const testAnimal = { 
    nombre: 'Firulais', 
    sexo: 'macho', 
    edad: 3, 
    tamano: 'mediano', 
    historia: 'Historia de prueba',
    adoptado: false,
    foto: 'ruta/imagen.jpg' 
  };
  
  beforeAll(async () => {
    await db.sync();
    
    // Creamos un usuario admin para pruebas
    const admin = await Usuario.create({
      nombre: 'Admin',
      apellido: 'Test',
      email: 'admin@test.com',
      contrasena: 'Admin123',
      rol: 'admin'
    });
    
    adminToken = generate({ id: admin.idUsuario, rol: 'admin' });
    
    // Creamos un animal para las pruebas
    const animal = await Animal.create(testAnimal);
    animalId = animal.idAnimal;
  });

  it('GET /animals - Obtiene todos los animales', async () => {
    const res = await request(app)
      .get('/api/v1/animals');
      
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  
  it('GET /animals/:id - Obtiene un animal por ID', async () => {
    const res = await request(app)
      .get(`/api/v1/animals/${animalId}`);
      
    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe(testAnimal.nombre);
  });
  
  it('GET /animals/status - Filtra animales por estado de adopción', async () => {
    const res = await request(app)
      .get('/api/v1/animals/status')
      .query({ adoptado: 'false' });
      
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach(animal => {
      expect(animal.adoptado).toBe(false);
    });
  });
  
  it('POST /animals - Crea un nuevo animal (requiere autenticación)', async () => {
    const newAnimal = {
      nombre: 'Pelusa',
      sexo: 'hembra',
      edad: 2,
      tamano: 'pequeño',
      historia: 'Gata rescatada',
      adoptado: false
    };
    
    const res = await request(app)
      .post('/api/v1/animals')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newAnimal);
      
    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe(newAnimal.nombre);
    
    // Sin token debe dar error
    const resNoAuth = await request(app)
      .post('/api/v1/animals')
      .send(newAnimal);
      
    expect(resNoAuth.statusCode).toBe(401);
  });
  
  it('PUT /animals/:id - Actualiza un animal (requiere autenticación)', async () => {
    const updatedData = { 
      nombre: 'Firulais Updated', 
      adoptado: true 
    };
    
    const res = await request(app)
      .put(`/api/v1/animals/${animalId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updatedData);
      
    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe(updatedData.nombre);
    expect(res.body.adoptado).toBe(true);
    
    // Sin token debe dar error
    const resNoAuth = await request(app)
      .put(`/api/v1/animals/${animalId}`)
      .send(updatedData);
      
    expect(resNoAuth.statusCode).toBe(401);
  });
  
  it('DELETE /animals/:id - Elimina un animal (requiere autenticación)', async () => {
    // Primero creamos un animal para eliminar
    const animalToDelete = await Animal.create({
      nombre: 'AnimalToDelete',
      sexo: 'macho',
      adoptado: false
    });
    
    const res = await request(app)
      .delete(`/api/v1/animals/${animalToDelete.idAnimal}`)
      .set('Authorization', `Bearer ${adminToken}`);
      
    expect(res.statusCode).toBe(204);
    
    // Verificamos que ya no existe
    const checkRes = await request(app)
      .get(`/api/v1/animals/${animalToDelete.idAnimal}`);
      
    expect(checkRes.statusCode).toBe(404);
    
    // Sin token debe dar error
    const resNoAuth = await request(app)
      .delete(`/api/v1/animals/${animalId}`)
      
    expect(resNoAuth.statusCode).toBe(401);
  });

  afterAll(() => db.close());
});
