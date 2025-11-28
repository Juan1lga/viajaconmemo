const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getPhotos, uploadPhoto, approvePhoto, deletePhoto, getPendingPhotos, updatePhoto } = require('../controllers/photoController');
const auth = require('../middleware/auth');

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

// @route   GET api/photos
// @desc    Obtener fotos (usar ?approved=true para solo aprobadas)
// @access  Public
router.get('/', getPhotos);

// @route   GET api/photos/pending
// @desc    Obtener fotos pendientes
// @access  Private (admin)
router.get('/pending', auth, getPendingPhotos);

// @route   POST api/photos
// @desc    Subir una foto
// @access  Public
router.post('/', handleMulter(upload.single('image')), uploadPhoto);

// @route   POST api/photos/upload
// @desc    Subir una foto (campo "image")
// @access  Public
router.post('/upload', handleMulter(upload.single('image')), uploadPhoto);

// @route   PUT api/photos/:id/approve
// @desc    Aprobar una foto
// @access  Private
router.put('/:id/approve', auth, approvePhoto);
router.put('/:id', auth, handleMulter(upload.single('image')), updatePhoto);

// @route   DELETE api/photos/:id
// @desc    Eliminar una foto
// @access  Private
router.delete('/:id', auth, deletePhoto);

module.exports = router;