const express = require('express');
const router = express.Router();

const { sendContact } = require('../controllers/contactController');

// Ruta pública para enviar mensajes de contacto desde la web
router.post('/', sendContact);

module.exports = router;
