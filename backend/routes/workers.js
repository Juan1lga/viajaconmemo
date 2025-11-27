const express = require('express');
const router = express.Router();
const { getWorkers, createWorker, updateWorker, deleteWorker } = require('../controllers/workerController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

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
const upload = multer({ storage });

// @route   GET api/workers
// @desc    Obtener todos los trabajadores
// @access  Public
router.get('/', getWorkers);

// @route   POST api/workers
// @desc    Crear un trabajador
// @access  Private
router.post('/', auth, upload.single('photo'), createWorker);

// @route   PUT api/workers/:id
// @desc    Actualizar un trabajador
// @access  Private
router.put('/:id', auth, upload.single('photo'), updateWorker);

// @route   DELETE api/workers/:id
// @desc    Eliminar un trabajador
// @access  Private
router.delete('/:id', auth, deleteWorker);

module.exports = router;