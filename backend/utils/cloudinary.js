const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Función para subir un buffer a Cloudinary
const uploadBuffer = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Función para extraer el public_id de una URL de Cloudinary
const getPublicIdFromUrl = (url) => {
  const regex = /v\d+\/(?:[^\/]+\/)*([^\.]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};


// Función para borrar una imagen de Cloudinary por URL
const deleteByUrl = async (url) => {
    const publicId = getPublicIdFromUrl(url);
    if (!publicId) {
        throw new Error('URL de Cloudinary inválida o no se pudo extraer el public_id');
    }
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error al borrar imagen de Cloudinary:', error);
        throw error;
    }
};

// Función para verificar si una URL es de Cloudinary
const isCloudinaryUrl = (url) => {
  return url && url.includes('res.cloudinary.com');
};

module.exports = {
  uploadBuffer,
  deleteByUrl,
  isCloudinaryUrl,
};