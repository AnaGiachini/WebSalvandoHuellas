const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const animalRoutes = require("./animalRoutes");
const adoptionApplicationRoutes = require("./adoptionApplicationRoutes");
const cartRoutes = require("./cartRoutes");
//const purchaseRoutes = require("./purchaseRoutes");


router.use("/auth", authRoutes); // Rutas de autenticación
router.use("/users", userRoutes); // Rutas de usuarios
router.use("/animals", animalRoutes); // Rutas de animales
router.use("/adoptions", adoptionApplicationRoutes); // Rutas de solicitudes de adopción
router.use("/cart", cartRoutes); // Rutas de carrito
//router.use("/purchase", purchaseRoutes); // Rutas de compra

module.exports = router;