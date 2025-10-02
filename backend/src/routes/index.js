const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const animalRoutes = require("./animalRoutes");
const adoptionApplicationRoutes = require("./adoptionApplicationRoutes");
const cartRoutes = require("./cartRoutes");
const purchaseRoutes = require("./purchaseRoutes");
const articleRoutes = require("./articleRoutes");
const paymentsRoutes = require("./paymentsRoutes");
const donationRoutes = require("./donationRoutes");;


router.use("/auth", authRoutes); // Rutas de autenticación
router.use("/users", userRoutes); // Rutas de usuarios
router.use("/animals", animalRoutes); // Rutas de animales
router.use("/adoptions", adoptionApplicationRoutes); // Rutas de solicitudes de adopción
router.use("/carts", cartRoutes); // Rutas de carrito
router.use("/purchases", purchaseRoutes); // Rutas de compra
router.use("/articles", articleRoutes); // Rutas de artículos
router.use("/payments", paymentsRoutes); // Rutas de pagos (mercadopago)
router.use("/donations", donationRoutes); // Rutas de donaciones

module.exports = router;