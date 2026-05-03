// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createPaymentIntent, stripeWebhook, getStripeConfig } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.get('/config', getStripeConfig);
router.post('/create-intent', protect, createPaymentIntent);
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

module.exports = router;
