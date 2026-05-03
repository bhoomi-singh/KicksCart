const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc  Get cart
// @route GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images price discountPrice variants totalStock');
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  res.json({ success: true, cart });
});

// @desc  Add to cart / update quantity
// @route POST /api/cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, size, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const variant = product.variants.find(v => v.size === size);
  if (!variant) { res.status(400); throw new Error('Size not available'); }
  if (variant.stock < quantity) { res.status(400); throw new Error('Insufficient stock'); }

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const existingItem = cart.items.find(i => i.product.toString() === productId && i.size === size);
  if (existingItem) {
    existingItem.quantity = Math.min(existingItem.quantity + quantity, variant.stock);
  } else {
    cart.items.push({ product: productId, size, quantity, price });
  }

  await cart.save();
  await cart.populate('items.product', 'name images price discountPrice');
  res.json({ success: true, cart });
});

// @desc  Update cart item quantity
// @route PUT /api/cart/:itemId
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error('Cart not found'); }

  const item = cart.items.id(req.params.itemId);
  if (!item) { res.status(404); throw new Error('Item not found'); }

  if (quantity <= 0) {
    cart.items.pull(req.params.itemId);
  } else {
    item.quantity = quantity;
  }
  await cart.save();
  res.json({ success: true, cart });
});

// @desc  Remove from cart
// @route DELETE /api/cart/:itemId
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error('Cart not found'); }
  cart.items.pull(req.params.itemId);
  await cart.save();
  res.json({ success: true, cart });
});

// @desc  Clear cart
// @route DELETE /api/cart
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], coupon: null });
  res.json({ success: true, message: 'Cart cleared' });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
