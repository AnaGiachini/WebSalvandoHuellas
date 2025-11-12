/**
 * Test: animalService
 * --------------------------------------------------------------------------
 * Tests unitarios para el servicio de animales.
 */

const { 
  createAnimalService, 
  getAnimalByIdService, 
  updateAnimalService, 
  deleteAnimalService,
  getAllAnimalsService,
  getAnimalsByStatusService 
} = require('../../src/services/animalService');

const resetDatabase = require('../../src/utils/resetDatabase.helper');

describe('animalService unit tests', () => {
  const animalData = { 
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
  });

  it('createAnimalService crea un animal correctamente', async () => {
    const animal = await createAnimalService(animalData);
    expect(animal).toHaveProperty('idAnimal');
    expect(animal.nombre).toBe(animalData.nombre);
    expect(animal.sexo).toBe(animalData.sexo);
  });

  it('getAllAnimalsService obtiene todos los animales', async () => {
    await createAnimalService(animalData);
    const animals = await getAllAnimalsService();
    expect(Array.isArray(animals)).toBe(true);
    expect(animals.length).toBeGreaterThan(0);
  });

  it('getAnimalByIdService obtiene un animal por ID', async () => {
    const animal = await createAnimalService(animalData);
    const found = await getAnimalByIdService(animal.idAnimal);
    expect(found.nombre).toBe(animalData.nombre);
    expect(found.sexo).toBe(animalData.sexo);
  });

  it('getAnimalByIdService lanza error si el animal no existe', async () => {
    await expect(
      getAnimalByIdService(9999)
    ).rejects.toHaveProperty('status', 404);
  });

  it('updateAnimalService actualiza datos de un animal', async () => {
    const animal = await createAnimalService(animalData);
    const updated = await updateAnimalService(animal.idAnimal, {
      nombre: 'Firulais Updated',
      estadoAdopcion: 'adoptado'
    });
    expect(updated.nombre).toBe('Firulais Updated');
    expect(updated.estadoAdopcion).toBe('adoptado');
  });

  it('getAnimalsByStatusService filtra animales por estado de adopción', async () => {
    await createAnimalService({ ...animalData, estadoAdopcion: 'adoptado' });
    await createAnimalService({ nombre: 'Luna', especie: 'gato', sexo: 'hembra', edad: 'joven', tamano: 'pequeño', estadoAdopcion: 'sin_hogar' });

    const adopted = await getAnimalsByStatusService('adoptado');
    expect(Array.isArray(adopted)).toBe(true);
    expect(adopted.every(a => a.estadoAdopcion === 'adoptado')).toBe(true);

    const homeless = await getAnimalsByStatusService('sin_hogar');
    expect(homeless.some(a => a.estadoAdopcion === 'sin_hogar')).toBe(true);
  });

  it('deleteAnimalService elimina un animal', async () => {
    const animal = await createAnimalService(animalData);
    await deleteAnimalService(animal.idAnimal);
    await expect(
      getAnimalByIdService(animal.idAnimal)
    ).rejects.toHaveProperty('status', 404);
  });
});

