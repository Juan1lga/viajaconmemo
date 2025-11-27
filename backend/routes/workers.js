const express = require('express');
const router = express.Router();
const { getWorkers, createWorker, updateWorker, deleteWorker } = require('../controllers/workerController');
const auth = require('../middleware/auth');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: function (req, file, cb) { const allowed = ['image/jpeg','image/png','image/jpg','image/webp']; if (allowed.includes(file.mimetype)) { cb(null, true); } else { cb(new Error('Solo se permiten imágenes JPG, JPEG, PNG o WEBP')); } } });

// @route   GET api/workers
// @desc    Obtener todos los trabajadores
// @access  Public
router.get('/', getWorkers);

// @route   POST api/workers
// @desc    Crear un trabajador
// @access  Private
router.post('/', auth, upload.single('image'), createWorker);

// @route   PUT api/workers/:id
// @desc    Actualizar un trabajador
// @access  Private
router.put('/:id', auth, upload.single('image'), updateWorker);

// @route   DELETE api/workers/:id
// @desc    Eliminar un trabajador
// @access  Private
router.delete('/:id', auth, deleteWorker);

module.exports = router;