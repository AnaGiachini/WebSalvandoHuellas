/**
 * Test: adoptionApplicationService
 * --------------------------------------------------------------------------
 * Tests unitarios para el servicio de solicitudes de adopción.
 */

const {
  createAdoptionApplicationService,
  getAllAdoptionApplicationService,
  getAdoptionApplicationByIdService,
  getAdoptionApplicationByUserService,
  getAdoptionApplicationByAnimalService,
  updateAdoptionApplicationService,
  deleteAdoptionApplicationService
} = require('../../src/services/adoptionApplicationService');

const Usuario = require('../../src/models/usuario');
const Animal = require('../../src/models/animal');

const resetDatabase = require('../../src/utils/resetDatabase.helper');
const loadAssociations = require('../../src/configs/associations');

describe('adoptionApplicationService unit tests', () => {
  const userData = {
    nombre: 'User',
    apellido: 'Test',
    email: 'user@test.com',
    contrasena: 'User123',
    rol: 'user'
  };

  const animalData = {
    nombre: 'Luna',
    especie: 'gato',
    sexo: 'hembra',
    edad: 'adulto',
    tamano: 'pequeño',
    historia: 'Gata rescatada',
    estadoAdopcion: 'sin_hogar',
    foto: 'ruta/luna.jpg'
  };

  beforeEach(async () => {
    await resetDatabase();
    loadAssociations();
  });

  it('createAdoptionApplicationService crea una solicitud correctamente', async () => {
    const user = await Usuario.create(userData);
    const animal = await Animal.create(animalData);

    // Modificado: Pasar un objeto en lugar de parámetros separados
    const solicitudData = {
      idUsuario: user.idUsuario,
      idAnimal: animal.idAnimal
    };
    const solicitud = await createAdoptionApplicationService(solicitudData);

    expect(solicitud).toHaveProperty('idSolicitud');
    expect(solicitud.idUsuario).toBe(user.idUsuario);
    expect(solicitud.idAnimal).toBe(animal.idAnimal);
    expect(solicitud.estado).toBe('pendiente');
  });

  it('createAdoptionApplicationService lanza error si ya existe la solicitud', async () => {
    const user = await Usuario.create(userData);
    const animal = await Animal.create(animalData);

    // Modificado: Pasar un objeto en lugar de parámetros separados
    const solicitudData = {
      idUsuario: user.idUsuario,
      idAnimal: animal.idAnimal
    };
    await createAdoptionApplicationService(solicitudData);

    await expect(
      createAdoptionApplicationService(solicitudData)
    ).rejects.toHaveProperty('status', 400);
  });

  it('getAllAdoptionApplicationService devuelve todas las solicitudes', async () => {
    const user = await Usuario.create(userData);
    const animal = await Animal.create(animalData);

    // Modificado: Pasar un objeto en lugar de parámetros separados
    const solicitudData = {
      idUsuario: user.idUsuario,
      idAnimal: animal.idAnimal
    };
    await createAdoptionApplicationService(solicitudData);

    const solicitudes = await getAllAdoptionApplicationService();

    expect(Array.isArray(solicitudes)).toBe(true);
    expect(solicitudes.length).toBe(1);
    expect(solicitudes[0].idAnimal).toBe(animal.idAnimal);
  });

  // NUEVO: Test para getAdoptionApplicationByIdService
  it('getAdoptionApplicationByIdService obtiene una solicitud por ID', async () => {
    const user = await Usuario.create(userData);
    const animal = await Animal.create(animalData);
    
    const solicitudData = {
      idUsuario: user.idUsuario,
      idAnimal: animal.idAnimal
    };
    const solicitud = await createAdoptionApplicationService(solicitudData);
    
    const encontrada = await getAdoptionApplicationByIdService(solicitud.idSolicitud);
    
    expect(encontrada.idSolicitud).toBe(solicitud.idSolicitud);
    expect(encontrada.idUsuario).toBe(user.idUsuario);
    expect(encontrada.idAnimal).toBe(animal.idAnimal);
  });

  // NUEVO: Test para error en getAdoptionApplicationByIdService
  it('getAdoptionApplicationByIdService lanza error si la solicitud no existe', async () => {
    await expect(
      getAdoptionApplicationByIdService(9999)
    ).rejects.toHaveProperty('status', 404);
  });

  // NUEVO: Test para getAdoptionApplicationByUserService
  it('getAdoptionApplicationByUserService obtiene solicitudes de un usuario', async () => {
    const user = await Usuario.create(userData);
    const animal = await Animal.create(animalData);
    
    const solicitudData = {
      idUsuario: user.idUsuario,
      idAnimal: animal.idAnimal
    };
    await createAdoptionApplicationService(solicitudData);
    
    const solicitudes = await getAdoptionApplicationByUserService(user.idUsuario);
    
    expect(Array.isArray(solicitudes)).toBe(true);
    expect(solicitudes.length).toBe(1);
    expect(solicitudes[0].idUsuario).toBe(user.idUsuario);
  });

  // NUEVO: Test para getAdoptionApplicationByAnimalService
  it('getAdoptionApplicationByAnimalService obtiene solicitudes para un animal', async () => {
    const user = await Usuario.create(userData);
    const animal = await Animal.create(animalData);
    
    const solicitudData = {
      idUsuario: user.idUsuario,
      idAnimal: animal.idAnimal
    };
    await createAdoptionApplicationService(solicitudData);
    
    const solicitudes = await getAdoptionApplicationByAnimalService(animal.idAnimal);
    
    expect(Array.isArray(solicitudes)).toBe(true);
    expect(solicitudes.length).toBe(1);
    expect(solicitudes[0].idAnimal).toBe(animal.idAnimal);
  });

  it('updateAdoptionApplicationService actualiza el estado correctamente', async () => {
    const user = await Usuario.create(userData);
    const animal = await Animal.create(animalData);

    // Modificado: Pasar un objeto en lugar de parámetros separados
    const solicitudData = {
      idUsuario: user.idUsuario,
      idAnimal: animal.idAnimal
    };
    const solicitud = await createAdoptionApplicationService(solicitudData);

    const actualizada = await updateAdoptionApplicationService(solicitud.idSolicitud, 'aprobada');

    expect(actualizada.estado).toBe('aprobada');
  });

  it('updateAdoptionApplicationService lanza error si no existe la solicitud', async () => {
    await expect(
      updateAdoptionApplicationService(9999, 'rechazada')
    ).rejects.toHaveProperty('status', 404);
  });

  // NUEVO: Test para deleteAdoptionApplicationService
  it('deleteAdoptionApplicationService elimina una solicitud', async () => {
    const user = await Usuario.create(userData);
    const animal = await Animal.create(animalData);
    
    const solicitudData = {
      idUsuario: user.idUsuario,
      idAnimal: animal.idAnimal
    };
    const solicitud = await createAdoptionApplicationService(solicitudData);
    
    await deleteAdoptionApplicationService(solicitud.idSolicitud);
    
    // Verificar que la solicitud ya no existe
    await expect(
      getAdoptionApplicationByIdService(solicitud.idSolicitud)
    ).rejects.toHaveProperty('status', 404);
  });
});