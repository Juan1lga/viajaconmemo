const express = require('express');
const router = express.Router();
const { checkout, webhook } = require('../controllers/paymentController');

// Crear orden con Conekta (pago OXXO)
router.post('/checkout', checkout);

// Webhook de Conekta para actualizar estado de orden
router.post('/webhook', webhook);

module.exports = router;