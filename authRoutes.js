const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ServiceBooking = require('../models/ServiceBooking');

// @desc  Dashboard analytics
// @route GET /api/admin/dashboard
const getDashboard = async (req, res) => {
  const [totalUsers, totalProducts, totalOrders, totalBookings] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    ServiceBooking.countDocuments(),
  ]);

  const revenueAgg = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  const totalRevenue = revenueAgg[0]?.total || 0;

  const monthlyRevenue = await Order.aggregate([
    { $match: { isPaid: true } },
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);

  const categoryRevenue = await Order.aggregate([
    { $match: { isPaid: true } },
    { $unwind: '$items' },
    { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
    { $unwind: '$product' },
    { $group: { _id: '$product.category', revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
  ]);

  const recentOrders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 }).limit(10);
  const topProducts = await Product.find({ isActive: true }).sort({ sold: -1 }).limit(5);

  res.json({ totalUsers, totalProducts, totalOrders, totalBookings, totalRevenue, monthlyRevenue, categoryRevenue, recentOrders, topProducts });
};

// @desc  Get all users (admin)
// @route GET /api/admin/users
const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
};

// @desc  Update user role (admin)
// @route PUT /api/admin/users/:id
const updateUserRole = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.role = req.body.role || user.role;
  user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
  await user.save();
  res.json({ message: 'User updated', user });
};

module.exports = { getDashboard, getAllUsers, updateUserRole };
