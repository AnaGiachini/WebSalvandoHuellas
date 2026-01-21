const cloudinary = require('cloudinary').v2;

/**
 * Controlador de subida de imágenes a Cloudinary.
 * Se utiliza para fotos de animales y productos desde el panel de administración.
 */

async function uploadToCloudinary(buffer, folder) {
  const base64 = buffer.toString('base64');
  const dataUri = `data:image/jpeg;base64,${base64}`;
  const res = await cloudinary.uploader.upload(dataUri, {
    folder,
  });
  return res.secure_url;
}

exports.uploadAnimalPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se recibió archivo' });
    }
    const url = await uploadToCloudinary(req.file.buffer, 'salvando_huellas/animals');
    return res.status(200).json({ url });
  } catch (err) {
    return next(err);
  }
};

exports.uploadProductPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se recibió archivo' });
    }
    const url = await uploadToCloudinary(req.file.buffer, 'salvando_huellas/products');
    return res.status(200).json({ url });
  } catch (err) {
    return next(err);
  }
};
