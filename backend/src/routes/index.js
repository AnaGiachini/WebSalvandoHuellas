const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");

router.use("/auth", authRoutes); // Rutas de autenticación
router.use("/users", userRoutes); // Rutas de usuarios

module.exports = router;