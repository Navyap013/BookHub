const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Book = require('../models/Book');
const StudentBook = require('../models/StudentBook');
const { protect } = require('../middleware/auth');
const Razorpay = require('razorpay');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret'
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    const orderItems = cart.items.map(item => ({
      book: item.book || null,
      studentBook: item.studentBook || null,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity
    }));

    const itemsPrice = cart.totalPrice;
    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const taxPrice = itemsPrice * 0.18; // 18% GST
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const order = await Order.create({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      invoiceNumber: `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

    // Clear cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    // Update stock
    for (const item of orderItems) {
      if (item.book) {
        await Book.findByIdAndUpdate(item.book, {
          $inc: { stock: -item.quantity }
        });
      }
      if (item.studentBook) {
        await StudentBook.findByIdAndUpdate(item.studentBook, {
          $inc: { stock: -item.quantity }
        });
      }
    }

    // Create Razorpay order if payment method is Razorpay
    let razorpayOrder = null;
    if (paymentMethod === 'Razorpay') {
      try {
        razorpayOrder = await razorpay.orders.create({
          amount: Math.round(totalPrice * 100), // Amount in paise
          currency: 'INR',
          receipt: order.invoiceNumber,
          notes: {
            orderId: order._id.toString()
          }
        });
      } catch (error) {
        console.error('Razorpay order creation error:', error);
      }
    }

    res.status(201).json({
      success: true,
      order,
      razorpayOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('orderItems.book orderItems.studentBook');

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('orderItems.book orderItems.studentBook');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user owns the order or is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/orders/:id/pay
// @desc    Update order payment status
// @access  Private
router.post('/:id/pay', async (req, res) => {
  try {
    const { paymentId, orderId: razorpayOrderId, signature } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Verify payment (in production, verify Razorpay signature)
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      status: 'success'
    };
    order.status = 'Processing';

    await order.save();

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/orders/:id/deliver
// @desc    Update order delivery status (Admin only)
// @access  Private/Admin
router.put('/:id/deliver', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const { status, trackingNumber } = req.body;

    if (status) order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;

