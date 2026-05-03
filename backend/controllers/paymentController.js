const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

// @desc  Create Stripe Payment Intent
// @route POST /api/payments/create-intent
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, currency = 'inr', orderId } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Stripe uses smallest currency unit (paise)
    currency,
    metadata: { orderId, userId: req.user._id.toString() },
    automatic_payment_methods: { enabled: true },
  });

  res.json({ success: true, clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
});

// @desc  Stripe webhook
// @route POST /api/payments/webhook
const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object;
      const order = await Order.findById(pi.metadata.orderId);
      if (order && !order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.orderStatus = 'confirmed';
        order.stripePaymentIntentId = pi.id;
        order.paymentResult = { id: pi.id, status: 'succeeded', updateTime: new Date().toISOString() };
        order.statusHistory.push({ status: 'confirmed', note: 'Stripe payment confirmed' });
        await order.save();
      }
      break;
    }
    case 'payment_intent.payment_failed': {
      const pi = event.data.object;
      const order = await Order.findById(pi.metadata.orderId);
      if (order) {
        order.orderStatus = 'cancelled';
        order.statusHistory.push({ status: 'cancelled', note: 'Payment failed' });
        await order.save();
      }
      break;
    }
  }

  res.json({ received: true });
});

// @desc  Get Stripe publishable key
// @route GET /api/payments/config
const getStripeConfig = asyncHandler(async (req, res) => {
  res.json({ success: true, publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

module.exports = { createPaymentIntent, stripeWebhook, getStripeConfig };
