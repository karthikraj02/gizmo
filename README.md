const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

// @desc  Create Stripe payment intent
// @route POST /api/payment/create-intent
const createPaymentIntent = async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100), // in paise for INR
    currency: 'inr',
    metadata: { orderId: orderId, userId: req.user._id.toString() },
  });

  res.json({ clientSecret: paymentIntent.client_secret });
};

// @desc  Stripe webhook
// @route POST /api/payment/webhook
const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const order = await Order.findById(pi.metadata.orderId);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = 'confirmed';
      order.paymentResult = { id: pi.id, status: pi.status, update_time: new Date().toISOString() };
      await order.save();
    }
  }
  res.json({ received: true });
};

module.exports = { createPaymentIntent, stripeWebhook };
