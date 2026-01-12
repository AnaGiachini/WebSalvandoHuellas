const express = require('express');
const multer = require('multer');
const router = express.Router();

const uploadController = require('../controllers/uploadController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Usamos multer en memoria, Cloudinary se encarga del almacenamiento
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Solo administradores pueden subir fotos de animales
router.post(
  '/animal-photo',
  protect,
  restrictTo('admin'),
  upload.single('image'),
  uploadController.uploadAnimalPhoto
);

// Solo administradores pueden subir fotos de productos
router.post(
  '/product-photo',
  protect,
  restrictTo('admin'),
  upload.single('image'),
  uploadController.uploadProductPhoto
);

module.exports = router;
