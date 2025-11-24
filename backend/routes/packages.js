const express = require('express');
const router = express.Router();
const { getPackages, getPackageById, createPackage, updatePackage, deletePackage } = require('../controllers/packageController');
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

// @route   GET api/packages
// @desc    Obtener todos los paquetes
// @access  Public
router.get('/', getPackages);
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