const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const animalRoutes = require("./animalRoutes");

router.use("/auth", authRoutes); // Rutas de autenticación
router.use("/users", userRoutes); // Rutas de usuarios
router.use("/animals", animalRoutes); // Rutas de animales

module.exports = router;