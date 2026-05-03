const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin', 'superadmin'));

// Dashboard stats
router.get('/dashboard', asyncHandler(async (req, res) => {
  const [totalOrders, totalRevenue, totalUsers, totalProducts, recentOrders, topProducts] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    User.countDocuments({ role: 'user' }),
    Product.countDocuments(),
    Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(10),
    Product.find().sort({ sold: -1 }).limit(5),
  ]);

  // Revenue by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const monthlyRevenue = await Order.aggregate([
    { $match: { isPaid: true, createdAt: { $gte: sixMonthsAgo } } },
    { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.json({
    success: true,
    stats: {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalUsers,
      totalProducts,
    },
    recentOrders,
    topProducts,
    monthlyRevenue,
  });
}));

module.exports = router;
