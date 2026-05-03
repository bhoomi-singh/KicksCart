const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc  Create order
// @route POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Verify stock availability
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) throw new Error(`Product not found: ${item.product}`);
    const variant = product.variants.find(v => v.size === item.size);
    if (!variant || variant.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name} size ${item.size}`);
    }
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems, shippingAddress, paymentMethod,
    itemsPrice, shippingPrice, taxPrice, totalPrice,
    statusHistory: [{ status: 'pending', note: 'Order placed' }],
  });

  // Decrement stock
  for (const item of orderItems) {
    await Product.updateOne(
      { _id: item.product, 'variants.size': item.size },
      { $inc: { 'variants.$.stock': -item.quantity, sold: item.quantity } }
    );
  }

  // Clear user cart
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

  res.status(201).json({ success: true, order });
});

// @desc  Get my orders
// @route GET /api/orders/my
const getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Order.countDocuments({ user: req.user._id });
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  res.json({ success: true, orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

// @desc  Get single order
// @route GET /api/orders/:id
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  res.json({ success: true, order });
});

// @desc  Update order to paid
// @route PUT /api/orders/:id/pay
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.orderStatus = 'confirmed';
  order.paymentResult = { id: req.body.id, status: req.body.status, updateTime: req.body.update_time, emailAddress: req.body.payer?.email_address };
  order.statusHistory.push({ status: 'confirmed', note: 'Payment confirmed' });
  await order.save();
  res.json({ success: true, order });
});

// @desc  Get all orders (Admin)
// @route GET /api/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const query = status ? { orderStatus: status } : {};
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  res.json({ success: true, orders, total });
});

// @desc  Update order status (Admin)
// @route PUT /api/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note, trackingNumber } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }

  order.orderStatus = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (status === 'delivered') { order.isDelivered = true; order.deliveredAt = Date.now(); }
  order.statusHistory.push({ status, note: note || `Status updated to ${status}` });
  await order.save();
  res.json({ success: true, order });
});

module.exports = { createOrder, getMyOrders, getOrder, updateOrderToPaid, getAllOrders, updateOrderStatus };
