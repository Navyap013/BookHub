const express = require('express');
const ExchangeListing = require('../models/ExchangeListing');
const ExchangeMessage = require('../models/ExchangeMessage');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for image uploads (store URLs, not files - for now)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// @route   GET /api/marketplace
// @desc    Get all marketplace listings
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      class: studentClass,
      condition,
      minPrice,
      maxPrice,
      search,
      status = 'active',
      page = 1,
      limit = 12
    } = req.query;

    const query = { status };

    if (category) query.category = category;
    if (studentClass) query.class = studentClass;
    if (condition) query.condition = condition;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const listings = await ExchangeListing.find(query)
      .populate('seller', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await ExchangeListing.countDocuments(query);

    res.json({
      success: true,
      count: listings.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      listings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/marketplace/:id
// @desc    Get single listing
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const listing = await ExchangeListing.findById(req.params.id)
      .populate('seller', 'name email avatar phone address')
      .populate('soldTo', 'name email');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Increment views
    listing.views += 1;
    await listing.save();

    res.json({
      success: true,
      listing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/marketplace
// @desc    Create new listing
// @access  Private
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      condition,
      price,
      originalPrice,
      category,
      class: studentClass,
      isbn,
      location
    } = req.body;

    // For now, we'll accept image URLs from frontend
    // In production, you'd upload to cloud storage (Cloudinary, S3, etc.)
    const images = req.body.images ? (Array.isArray(req.body.images) ? req.body.images : [req.body.images]) : [];

    const listing = await ExchangeListing.create({
      seller: req.user.id,
      title,
      author,
      description,
      condition,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      images,
      category,
      class: studentClass || null,
      isbn: isbn || '',
      location: location ? JSON.parse(location) : {}
    });

    const populatedListing = await ExchangeListing.findById(listing._id)
      .populate('seller', 'name email avatar');

    res.status(201).json({
      success: true,
      listing: populatedListing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/marketplace/:id
// @desc    Update listing
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const listing = await ExchangeListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if user is the seller
    if (listing.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['title', 'author', 'description', 'condition', 'price', 'originalPrice', 'images', 'category', 'class', 'isbn', 'location'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'location' && typeof req.body[field] === 'string') {
          listing[field] = JSON.parse(req.body[field]);
        } else {
          listing[field] = req.body[field];
        }
      }
    });

    listing.updatedAt = Date.now();
    await listing.save();

    const populatedListing = await ExchangeListing.findById(listing._id)
      .populate('seller', 'name email avatar');

    res.json({
      success: true,
      listing: populatedListing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/marketplace/:id
// @desc    Delete listing
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await ExchangeListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if user is the seller
    if (listing.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing'
      });
    }

    listing.status = 'removed';
    await listing.save();

    res.json({
      success: true,
      message: 'Listing removed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/marketplace/:id/interest
// @desc    Mark interest in listing
// @access  Private
router.post('/:id/interest', protect, async (req, res) => {
  try {
    const listing = await ExchangeListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    if (listing.seller.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot mark interest in your own listing'
      });
    }

    const index = listing.interestedUsers.indexOf(req.user.id);
    if (index > -1) {
      listing.interestedUsers.splice(index, 1);
    } else {
      listing.interestedUsers.push(req.user.id);
    }

    await listing.save();

    res.json({
      success: true,
      isInterested: index === -1
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/marketplace/:id/sold
// @desc    Mark listing as sold
// @access  Private
router.post('/:id/sold', protect, async (req, res) => {
  try {
    const listing = await ExchangeListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    if (listing.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { soldTo } = req.body;

    listing.status = 'sold';
    if (soldTo) {
      listing.soldTo = soldTo;
    }
    listing.soldAt = Date.now();
    await listing.save();

    res.json({
      success: true,
      listing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/marketplace/my-listings
// @desc    Get user's listings
// @access  Private
router.get('/my-listings', protect, async (req, res) => {
  try {
    const listings = await ExchangeListing.find({ seller: req.user.id })
      .populate('seller', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: listings.length,
      listings
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

