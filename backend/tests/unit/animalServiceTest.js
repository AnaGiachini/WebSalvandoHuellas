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
const db = require("../../src/configs/db");
const Animal = require('../../src/models/animal');

describe('animalService unit tests', () => {
  const testAnimal = { 
    nombre: 'Firulais', 
    sexo: 'macho', 
    edad: 3, 
    tamano: 'mediano', 
    historia: 'Historia de prueba',
    adoptado: false,
    foto: 'ruta/imagen.jpg' 
  };
  
  let animalId;

  beforeAll(() => db.sync({ force: true }));

  it('createAnimalService crea un animal correctamente', async () => {
    const animal = await createAnimalService(testAnimal);
    expect(animal).toHaveProperty('idAnimal');
    expect(animal.nombre).toBe(testAnimal.nombre);
    expect(animal.sexo).toBe(testAnimal.sexo);
    animalId = animal.idAnimal;
  });

  it('getAllAnimalsService obtiene todos los animales', async () => {
    const animals = await getAllAnimalsService();
    expect(Array.isArray(animals)).toBe(true);
    expect(animals.length).toBeGreaterThan(0);
  });

  it('getAnimalByIdService obtiene un animal por ID', async () => {
    const animal = await getAnimalByIdService(animalId);
    expect(animal.nombre).toBe(testAnimal.nombre);
    expect(animal.sexo).toBe(testAnimal.sexo);
  });

  it('getAnimalByIdService lanza error si el animal no existe', async () => {
    await expect(
      getAnimalByIdService(9999)
    ).rejects.toHaveProperty('status', 404);
  });

  it('updateAnimalService actualiza datos de un animal', async () => {
    const updatedData = { nombre: 'Firulais Updated', adoptado: true };
    const animal = await updateAnimalService(animalId, updatedData);
    expect(animal.nombre).toBe(updatedData.nombre);
    expect(animal.adoptado).toBe(true);
  });

  it('getAnimalsByStatusService filtra animales por estado de adopción', async () => {
    const adoptedAnimals = await getAnimalsByStatusService(true);
    expect(Array.isArray(adoptedAnimals)).toBe(true);
    expect(adoptedAnimals.length).toBeGreaterThan(0);
    expect(adoptedAnimals[0].adoptado).toBe(true);

    const nonAdoptedAnimals = await getAnimalsByStatusService(false);
    expect(Array.isArray(nonAdoptedAnimals)).toBe(true);
    expect(nonAdoptedAnimals.every(animal => !animal.adoptado)).toBe(true);
  });

  it('deleteAnimalService elimina un animal', async () => {
    await deleteAnimalService(animalId);
    
    await expect(
      getAnimalByIdService(animalId)
    ).rejects.toHaveProperty('status', 404);
  });

  afterAll(async () => {
    await db.close();
  });
});
