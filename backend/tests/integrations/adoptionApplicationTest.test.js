/**
 * Test: adoptionApplicationAPI
 * --------------------------------------------------------------------------
 * Tests de integración para las rutas de API relacionadas con solicitudes de adopción.
 */

const request = require("supertest");
const app = require("../../app");
const Animal = require("../../src/models/animal");
const Usuario = require("../../src/models/usuario");
const resetDatabase = require("../../src/utils/resetDatabase.helper");
const { generate } = require("../../src/utils/jwt");

describe("API de Solicitudes de Adopción", () => {
  let user, admin, userToken, adminToken, animal;

  beforeEach(async () => {
    await resetDatabase();

    user = await Usuario.create({
      nombre: "Usuario",
      apellido: "Test",
      email: "user@test.com",
      contrasena: "1234",
      rol: "user",
    });

    admin = await Usuario.create({
      nombre: "Admin",
      apellido: "Admin",
      email: "admin@test.com",
      contrasena: "admin",
      rol: "admin",
    });

    userToken = generate({ id: user.idUsuario, rol: user.rol });
    adminToken = generate({ id: admin.idUsuario, rol: admin.rol });

    animal = await Animal.create({
      nombre: "Manchitas",
      especie: "perro",
      sexo: "macho",
      edad: "adulto",
      tamano: "mediano",
      historia: "Simpático y juguetón",
      estadoAdopcion: "sin_hogar",
      foto: "imagen.jpg"
    });
  });

  it("POST /adoptions - Crea una solicitud de adopción (usuario autenticado)", async () => {
    const res = await request(app)
      .post("/api/v1/adoptions")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ idAnimal: animal.idAnimal });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.idUsuario).toBe(user.idUsuario);
    expect(res.body.data.idAnimal).toBe(animal.idAnimal);
    expect(res.body.data.estado).toBe("pendiente");
  });

  it("POST /adoptions - No permite duplicados del mismo usuario y animal", async () => {
    await request(app)
      .post("/api/v1/adoptions")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ idAnimal: animal.idAnimal });

    const res = await request(app)
      .post("/api/v1/adoptions")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ idAnimal: animal.idAnimal });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/no está disponible/i); // actualizado
  });

  it("GET /adoptions - Lista todas las solicitudes (solo admin)", async () => {
    await request(app)
      .post("/api/v1/adoptions")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ idAnimal: animal.idAnimal });

    const res = await request(app)
      .get("/api/v1/adoptions")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].idAnimal).toBe(animal.idAnimal);
  });

  it("PATCH /adoptions/:id - Cambia estado de una solicitud (solo admin)", async () => {
    // crear nueva solicitud
    const newAnimal = await Animal.create({
      nombre: "Luna",
      especie: "gato",
      sexo: "hembra",
      edad: "joven",
      tamano: "pequeño",
      historia: "Tranquila y amorosa",
      estadoAdopcion: "sin_hogar",
      foto: "gato.jpg"
    });
  
    const createRes = await request(app)
      .post("/api/v1/adoptions")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ idAnimal: newAnimal.idAnimal });
  
    const solicitudId = createRes.body.data.idSolicitud;
    console.log("ID SOLICITUD EN TEST:", solicitudId);

  
    const res = await request(app)
      .put(`/api/v1/adoptions/${solicitudId}/estado`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ estado: "aprobada" });
  
    expect(res.statusCode).toBe(200);
    expect(res.body.data.estado).toBe("aprobada");
  });

  it("POST /adoptions - Falla si no hay autenticación", async () => {
    const res = await request(app)
      .post("/api/v1/adoptions")
      .send({ idAnimal: animal.idAnimal });

    expect(res.statusCode).toBe(401);
  });

  it("PATCH /adoptions/:id - No permite cambiar estado a usuarios comunes", async () => {
  const anotherAnimal = await Animal.create({
    nombre: "Toby",
    especie: "perro",
    sexo: "macho",
    edad: "adulto",
    tamano: "grande",
    historia: "Cariñoso pero guardián",
    estadoAdopcion: "sin_hogar",
    foto: "perro2.jpg"
  });

  const createRes = await request(app)
    .post("/api/v1/adoptions")
    .set("Authorization", `Bearer ${userToken}`)
    .send({ idAnimal: anotherAnimal.idAnimal });

  const solicitudId = createRes.body.data.idSolicitud;
  console.log("ID SOLICITUD EN TEST:", solicitudId);


  const res = await request(app)
    .put(`/api/v1/adoptions/${solicitudId}/estado`)
    .set("Authorization", `Bearer ${userToken}`)
    .send({ estado: "rechazada" });

  expect(res.statusCode).toBe(403);
});

});
