const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const products = [
  {
    name: 'AirEdge Pro Runner',
    brand: 'KicksCart Original',
    category: 'Running',
    gender: 'Men',
    price: 12999,
    discountPrice: 9999,
    description: 'Engineered for peak performance, the AirEdge Pro Runner combines responsive cushioning with a breathable upper for your best run yet.',
    features: ['React foam midsole', 'Breathable mesh upper', 'Carbon fibre plate', 'Grip outsole'],
    colors: ['Black/Lime', 'White/Orange'],
    tags: ['running', 'performance', 'cushioned'],
    variants: [
      { size: 'UK6', stock: 10, sku: 'AEP-001-UK6' },
      { size: 'UK7', stock: 15, sku: 'AEP-001-UK7' },
      { size: 'UK8', stock: 20, sku: 'AEP-001-UK8' },
      { size: 'UK9', stock: 18, sku: 'AEP-001-UK9' },
      { size: 'UK10', stock: 12, sku: 'AEP-001-UK10' },
      { size: 'UK11', stock: 8, sku: 'AEP-001-UK11' },
    ],
    images: [{ public_id: 'runner1', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' }],
    isFeatured: true, isNewArrival: true, isBestSeller: true, rating: 4.7, numReviews: 128,
  },
  {
    name: 'StreetKing Low',
    brand: 'KicksCart Original',
    category: 'Casual',
    gender: 'Unisex',
    price: 8499,
    discountPrice: 0,
    description: 'Classic low-top silhouette with modern comfort. The StreetKing Low transitions seamlessly from day to night.',
    features: ['Premium leather upper', 'EVA cushioned insole', 'Rubber outsole', 'Clean minimal design'],
    colors: ['White', 'Black', 'Navy'],
    tags: ['casual', 'street', 'lifestyle'],
    variants: [
      { size: 'UK5', stock: 8, sku: 'SKL-002-UK5' },
      { size: 'UK6', stock: 12, sku: 'SKL-002-UK6' },
      { size: 'UK7', stock: 20, sku: 'SKL-002-UK7' },
      { size: 'UK8', stock: 20, sku: 'SKL-002-UK8' },
      { size: 'UK9', stock: 15, sku: 'SKL-002-UK9' },
      { size: 'UK10', stock: 10, sku: 'SKL-002-UK10' },
    ],
    images: [{ public_id: 'casual1', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80' }],
    isFeatured: true, isNewArrival: false, isBestSeller: true, rating: 4.5, numReviews: 95,
  },
  {
    name: 'DunkSlam Elite',
    brand: 'KicksCart Original',
    category: 'Basketball',
    gender: 'Men',
    price: 15999,
    discountPrice: 12999,
    description: 'Dominate the court with the DunkSlam Elite. High-ankle support meets explosive cushioning for your best game.',
    features: ['High-ankle support collar', 'Zoom Air cushioning', 'Herringbone traction pattern', 'Lockdown lacing'],
    colors: ['Black/Red', 'White/Gold'],
    tags: ['basketball', 'court', 'high-top'],
    variants: [
      { size: 'UK7', stock: 10, sku: 'DSE-003-UK7' },
      { size: 'UK8', stock: 14, sku: 'DSE-003-UK8' },
      { size: 'UK9', stock: 16, sku: 'DSE-003-UK9' },
      { size: 'UK10', stock: 12, sku: 'DSE-003-UK10' },
      { size: 'UK11', stock: 8, sku: 'DSE-003-UK11' },
    ],
    images: [{ public_id: 'bball1', url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80' }],
    isFeatured: false, isNewArrival: true, isBestSeller: false, rating: 4.8, numReviews: 67,
  },
  {
    name: 'Volt X Limited',
    brand: 'KicksCart Collab',
    category: 'Limited Edition',
    gender: 'Unisex',
    price: 24999,
    discountPrice: 0,
    description: 'An exclusive limited-edition collab. The Volt X features hand-finished details and premium materials that make each pair unique.',
    features: ['Hand-finished details', 'Premium Italian suede', 'Numbered limited run', 'Collector box included'],
    colors: ['Electric Yellow', 'Cream/Black'],
    tags: ['limited', 'collab', 'exclusive', 'collector'],
    variants: [
      { size: 'UK7', stock: 3, sku: 'VX-004-UK7' },
      { size: 'UK8', stock: 3, sku: 'VX-004-UK8' },
      { size: 'UK9', stock: 3, sku: 'VX-004-UK9' },
      { size: 'UK10', stock: 2, sku: 'VX-004-UK10' },
    ],
    images: [{ public_id: 'limited1', url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80' }],
    isFeatured: true, isNewArrival: true, isBestSeller: false, rating: 4.9, numReviews: 42,
  },
  {
    name: 'FlexTrain Cross',
    brand: 'KicksCart Original',
    category: 'Training',
    gender: 'Women',
    price: 7999,
    discountPrice: 5999,
    description: 'Engineered for cross-training versatility. The FlexTrain Cross adapts to every movement in your workout.',
    features: ['Multi-directional flex grooves', 'Lightweight mesh upper', 'Flat heel for stability', 'Wide toe box'],
    colors: ['Pink/White', 'Teal/Grey', 'Black/Pink'],
    tags: ['training', 'gym', 'cross-training', 'women'],
    variants: [
      { size: 'UK4', stock: 10, sku: 'FTC-005-UK4' },
      { size: 'UK5', stock: 15, sku: 'FTC-005-UK5' },
      { size: 'UK6', stock: 20, sku: 'FTC-005-UK6' },
      { size: 'UK7', stock: 18, sku: 'FTC-005-UK7' },
      { size: 'UK8', stock: 12, sku: 'FTC-005-UK8' },
    ],
    images: [{ public_id: 'training1', url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80' }],
    isFeatured: false, isNewArrival: true, isBestSeller: false, rating: 4.4, numReviews: 83,
  },
  {
    name: 'RetroWave 90s',
    brand: 'KicksCart Heritage',
    category: 'Lifestyle',
    gender: 'Unisex',
    price: 9499,
    discountPrice: 7499,
    description: 'Inspired by the golden era of sneaker culture, the RetroWave 90s brings chunky silhouettes and bold colourways back into the spotlight.',
    features: ['OG chunky sole unit', 'Suede and leather upper', 'Vintage inspired colourway', 'Comfortable foam insole'],
    colors: ['White/Teal/Purple', 'Black/Gold', 'Grey/Orange'],
    tags: ['retro', 'lifestyle', '90s', 'chunky'],
    variants: [
      { size: 'UK6', stock: 12, sku: 'RW9-006-UK6' },
      { size: 'UK7', stock: 18, sku: 'RW9-006-UK7' },
      { size: 'UK8', stock: 22, sku: 'RW9-006-UK8' },
      { size: 'UK9', stock: 18, sku: 'RW9-006-UK9' },
      { size: 'UK10', stock: 14, sku: 'RW9-006-UK10' },
    ],
    images: [{ public_id: 'retro1', url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80' }],
    isFeatured: true, isNewArrival: false, isBestSeller: true, rating: 4.6, numReviews: 156,
  },
];

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');
};

const seedDB = async () => {
  await connectDB();

  console.log('🗑️  Clearing existing data...');
  await Product.deleteMany({});
  await User.deleteMany({});
  await Order.deleteMany({});

  console.log('👤 Creating admin user...');
  await User.create({
    name: 'Admin',
    email: 'admin@kickscart.com',
    password: 'admin123',
    role: 'admin',
    isEmailVerified: true,
  });

  await User.create({
    name: 'Test User',
    email: 'user@kickscart.com',
    password: 'user1234',
    role: 'user',
    isEmailVerified: true,
  });

  console.log('👟 Seeding products...');
  await Product.insertMany(products);

  console.log('✅ Database seeded successfully!');
  console.log('\n📋 Admin credentials:');
  console.log('   Email: admin@kickscart.com');
  console.log('   Password: admin123');
  console.log('\n📋 Test user:');
  console.log('   Email: user@kickscart.com');
  console.log('   Password: user1234');
  process.exit(0);
};

seedDB().catch(err => { console.error(err); process.exit(1); });
