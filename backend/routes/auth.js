const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Registrar un administrador
// @access  Public
router.post('/register', auth, register);

// @route   POST api/auth/login
// @desc    Autenticar un administrador y obtener token
// @access  Public
router.post('/login', login);

module.exports = router;