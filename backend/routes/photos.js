const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getPhotos, uploadPhoto, approvePhoto, deletePhoto, getPendingPhotos, updatePhoto } = require('../controllers/photoController');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, uniqueSuffix + '-' + safeName);
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: function (req, file, cb) { const allowed = ['image/jpeg','image/png','image/jpg','image/webp']; if (allowed.includes(file.mimetype)) { cb(null, true); } else { cb(new Error('Solo se permiten imágenes JPG, JPEG, PNG o WEBP')); } } });

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
router.post('/', upload.single('image'), uploadPhoto);

// @route   POST api/photos/upload
// @desc    Subir una foto (campo "image")
// @access  Public
router.post('/upload', upload.single('image'), uploadPhoto);

// @route   PUT api/photos/:id/approve
// @desc    Aprobar una foto
// @access  Private
router.put('/:id/approve', auth, approvePhoto);
router.put('/:id', auth, upload.single('image'), updatePhoto);

// @route   DELETE api/photos/:id
// @desc    Eliminar una foto
// @access  Private
router.delete('/:id', auth, deletePhoto);

module.exports = router;