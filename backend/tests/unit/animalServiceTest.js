/**
 * Test: animalService
 * --------------------------------------------------------------------------
 * Tests unitarios para el servicio de animales.
 *
 *  • Pruebas principales
 *      - Creación de animales
 *      - Obtención de animales (todos, por ID)
 *      - Actualización de datos
 *      - Eliminación de animales
 *      - Filtrado por estado de adopción
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
  // Datos base de prueba
  const animalData = { 
    nombre: 'Firulais', 
    sexo: 'macho', 
    edad: 3, 
    tamano: 'mediano', 
    historia: 'Historia de prueba',
    estadoAdopcion: 'sin_hogar',
    foto: 'ruta/imagen.jpg' 
  };

  // Limpieza completa antes de cada test
  beforeEach(async () => {
    await resetDatabase();
  });

  // Test: creación de animal
  it('createAnimalService crea un animal correctamente', async () => {
    const animal = await createAnimalService(animalData);
    expect(animal).toHaveProperty('idAnimal');
    expect(animal.nombre).toBe(animalData.nombre);
    expect(animal.sexo).toBe(animalData.sexo);
    expect(animal.estadoAdopcion).toBe('sin_hogar');
  });

  // Test: obtener todos los animales
  it('getAllAnimalsService obtiene todos los animales', async () => {
    await createAnimalService(animalData);
    const animals = await getAllAnimalsService();
    expect(Array.isArray(animals)).toBe(true);
    expect(animals.length).toBeGreaterThan(0);
  });

  // Test: obtener animal por ID
  it('getAnimalByIdService obtiene un animal por ID', async () => {
    const animal = await createAnimalService(animalData);
    const found = await getAnimalByIdService(animal.idAnimal);
    expect(found.nombre).toBe(animalData.nombre);
    expect(found.sexo).toBe(animalData.sexo);
  });

  // Test: error si el animal no existe
  it('getAnimalByIdService lanza error si el animal no existe', async () => {
    await expect(
      getAnimalByIdService(9999)
    ).rejects.toHaveProperty('status', 404);
  });

  // Test: actualizar animal
  it('updateAnimalService actualiza datos de un animal', async () => {
    const animal = await createAnimalService(animalData);
    const updated = await updateAnimalService(animal.idAnimal, {
      nombre: 'Firulais Updated',
      estadoAdopcion: 'adoptado'
    });
    expect(updated.nombre).toBe('Firulais Updated');
    expect(updated.estadoAdopcion).toBe('adoptado');
  });

  // Test: filtrar por estado de adopción
  it('getAnimalsByStatusService filtra animales por estado de adopción', async () => {
    await createAnimalService({ ...animalData, estadoAdopcion: 'adoptado' });
    await createAnimalService({ nombre: 'Luna', sexo: 'hembra', estadoAdopcion: 'sin_hogar' });

    const adopted = await getAnimalsByStatusService('adoptado');
    expect(Array.isArray(adopted)).toBe(true);
    expect(adopted.every(a => a.estadoAdopcion === 'adoptado')).toBe(true);

    const homeless = await getAnimalsByStatusService('sin_hogar');
    expect(homeless.some(a => a.estadoAdopcion === 'sin_hogar')).toBe(true);
  });

  // Test: eliminar animal
  it('deleteAnimalService elimina un animal', async () => {
    const animal = await createAnimalService(animalData);
    await deleteAnimalService(animal.idAnimal);
    await expect(
      getAnimalByIdService(animal.idAnimal)
    ).rejects.toHaveProperty('status', 404);
  });
});
