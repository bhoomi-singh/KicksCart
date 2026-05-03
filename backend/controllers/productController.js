const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc  Get all products with filtering, sorting, pagination
// @route GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const { keyword, category, gender, minPrice, maxPrice, rating, sort, page = 1, limit = 12, brand, isFeatured, isNewArrival } = req.query;

  let query = {};

  if (keyword) query.$or = [
    { name: { $regex: keyword, $options: 'i' } },
    { tags: { $regex: keyword, $options: 'i' } },
    { brand: { $regex: keyword, $options: 'i' } },
  ];
  if (category) query.category = category;
  if (gender) query.gender = gender;
  if (brand) query.brand = { $regex: brand, $options: 'i' };
  if (minPrice || maxPrice) query.price = {};
  if (minPrice) query.price.$gte = Number(minPrice);
  if (maxPrice) query.price.$lte = Number(maxPrice);
  if (rating) query.rating = { $gte: Number(rating) };
  if (isFeatured) query.isFeatured = isFeatured === 'true';
  if (isNewArrival) query.isNewArrival = isNewArrival === 'true';

  let sortObj = { createdAt: -1 };
  if (sort === 'price_asc') sortObj = { price: 1 };
  else if (sort === 'price_desc') sortObj = { price: -1 };
  else if (sort === 'rating') sortObj = { rating: -1 };
  else if (sort === 'popular') sortObj = { sold: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(query);
  const products = await Product.find(query).sort(sortObj).skip(skip).limit(Number(limit));

  res.json({
    success: true, products, total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
});

// @desc  Get single product
// @route GET /api/products/:id
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }] })
    .populate('reviews.user', 'name avatar');

  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, product });
});

// @desc  Create product (Admin)
// @route POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// @desc  Update product (Admin)
// @route PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, product });
});

// @desc  Delete product (Admin)
// @route DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, message: 'Product deleted' });
});

// @desc  Create product review
// @route POST /api/products/:id/reviews
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) { res.status(400); throw new Error('Product already reviewed'); }

  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
  await product.save();

  res.status(201).json({ success: true, message: 'Review added' });
});

// @desc  Get featured / new arrivals
// @route GET /api/products/featured
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const featured = await Product.find({ isFeatured: true }).limit(8);
  const newArrivals = await Product.find({ isNewArrival: true }).sort({ createdAt: -1 }).limit(8);
  const bestSellers = await Product.find({ isBestSeller: true }).sort({ sold: -1 }).limit(8);
  res.json({ success: true, featured, newArrivals, bestSellers });
});

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, createReview, getFeaturedProducts };
