const express = require('express');
const router = express.Router();
const { getPackages, getPackageById, createPackage, updatePackage, deletePackage, registerPackagesStream } = require('../controllers/packageController');
const auth = require('../middleware/auth');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// @route   GET api/packages
// @desc    Obtener todos los paquetes
// @access  Public
router.get('/', getPackages);
router.get('/stream', registerPackagesStream);
router.get('/:id', getPackageById);

// @route   POST api/packages
// @desc    Crear un paquete
// @access  Private
router.post('/', auth, upload.single('image'), createPackage);

// @route   PUT api/packages/:id
// @desc    Actualizar un paquete
// @access  Private
router.put('/:id', auth, upload.single('image'), updatePackage);

// @route   DELETE api/packages/:id
// @desc    Eliminar un paquete
// @access  Private
router.delete('/:id', auth, deletePackage);

module.exports = router;