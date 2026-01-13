const express = require('express');
const router = express.Router();
const { createAlbum, getAlbums, getAlbumPhotos, updateAlbum, deleteAlbum, getPendingAlbums, approveAlbum } = require('../controllers/albumController');
const auth = require('../middleware/auth');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowed = ['image/jpeg','image/png','image/jpg','image/webp','image/jfif','image/pjpeg'];
    if (!file || !file.mimetype) {
      return cb(new Error('Archivo inválido o sin tipo MIME'));
    }
    if (allowed.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes JPG, JPEG, PNG o WEBP'));
    }
  }
});

// Middleware para capturar errores de Multer y responder 400 en vez de 500
const handleMulter = (mw) => (req, res, next) => {
  mw(req, res, (err) => {
    if (err) {
      return res.status(400).json({ ok: false, error: 'invalid_file', message: err.message });
    }
    next();
  });
};

// @route   GET api/albums
// @desc    Listar álbumes
// @access  Public
router.get('/', getAlbums);

// @route   GET api/albums/pending
// @desc    Listar álbumes pendientes de aprobación
// @access  Private (admin)
router.get('/pending', auth, getPendingAlbums);

// @route   PUT api/albums/:id/approve
// @desc    Aprobar un álbum
// @access  Private (admin)
router.put('/:id/approve', auth, approveAlbum);

// @route   POST api/albums
// @desc    Crear un álbum (cualquier usuario)
// @access  Public
router.post('/', handleMulter(upload.single('cover')), createAlbum);

// @route   GET api/albums/:id/photos
// @desc    Obtener fotos de un álbum (usar ?approved=true para solo aprobadas)
// @access  Public
router.get('/:id/photos', getAlbumPhotos);

// @route   PUT api/albums/:id
// @desc    Actualizar un álbum (renombrar / actualizar portada)
// @access  Private (admin)
router.put('/:id', auth, handleMulter(upload.single('cover')), updateAlbum);

// @route   DELETE api/albums/:id
// @desc    Eliminar un álbum (desvincula fotos)
// @access  Private (admin)
router.delete('/:id', auth, deleteAlbum);

module.exports = router;