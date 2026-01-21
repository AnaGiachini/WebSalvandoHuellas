const express = require('express');
const multer = require('multer');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const uploadController = require('../controllers/uploadController');

// Usamos almacenamiento en memoria porque luego subimos a Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Subida de foto de animal a Cloudinary
router.post(
  '/animal-photo',
  protect,
  restrictTo('admin'),
  upload.single('image'),
  uploadController.uploadAnimalPhoto
);

// Subida de foto de producto a Cloudinary
router.post(
  '/product-photo',
  protect,
  restrictTo('admin'),
  upload.single('image'),
  uploadController.uploadProductPhoto
);

module.exports = router;
