const express = require('express');
const router = express.Router();
const { getUsers, addAdmin, deleteUser } = require('../controllers/userController');
const auth = require('../middleware/auth');

// @route   GET api/users
// @desc    Obtener todos los usuarios
// @access  Private (Admin)
router.get('/', auth, getUsers);

// @route   POST api/users/add-admin
// @desc    Agregar un nuevo administrador
// @access  Private (Admin)
router.post('/add-admin', auth, addAdmin);

// @route   DELETE api/users/:id
// @desc    Eliminar un usuario
// @access  Private (Admin)
router.delete('/:id', auth, deleteUser);

module.exports = router;