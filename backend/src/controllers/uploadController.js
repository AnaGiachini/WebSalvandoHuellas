const cloudinary = require('../configs/cloudinary');

// Sube una foto de animal a Cloudinary y devuelve la URL segura
exports.uploadAnimalPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se recibió ninguna imagen.' });
    }

    const folder = process.env.CLOUDINARY_FOLDER_ANIMALES || 'salvando-huellas/animales';

    const result = await cloudinary.uploader.upload_stream(
      { folder },
      (error, uploadResult) => {
        if (error) {
          return next(error);
        }
        return res.status(201).json({
          message: 'Imagen subida correctamente',
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        });
      }
    );

    // Escribimos el buffer en el stream
    result.end(req.file.buffer);
  } catch (error) {
    next(error);
  }
};
