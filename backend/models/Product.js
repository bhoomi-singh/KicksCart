const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true }, // e.g. UK6, UK7, US8
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String, required: true, unique: true },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Product name is required'], trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Running', 'Casual', 'Basketball', 'Training', 'Lifestyle', 'Limited Edition']
  },
  gender: { type: String, enum: ['Men', 'Women', 'Unisex', 'Kids'], required: true },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, default: 0 },
  images: [{ public_id: String, url: String }],
  variants: [variantSchema],
  colors: [String],
  materials: [String],
  features: [String],
  tags: [String],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [reviewSchema],
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  totalStock: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
}, { timestamps: true });

// Auto-generate slug
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
  }
  // Compute total stock
  this.totalStock = this.variants.reduce((sum, v) => sum + v.stock, 0);
  next();
});

module.exports = mongoose.model('Product', productSchema);
