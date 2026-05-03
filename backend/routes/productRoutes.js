const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, createReview, getFeaturedProducts } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.get('/featured', getFeaturedProducts);
router.route('/').get(getProducts).post(protect, authorize('admin', 'superadmin'), createProduct);
router.route('/:id').get(getProduct).put(protect, authorize('admin', 'superadmin'), updateProduct).delete(protect, authorize('admin', 'superadmin'), deleteProduct);
router.post('/:id/reviews', protect, createReview);

module.exports = router;
