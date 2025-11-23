const express = require('express');
const EBook = require('../models/EBook');
const EBookAccess = require('../models/EBookAccess');
const User = require('../models/User');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/ebooks
// @desc    Get all e-books with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      class: studentClass,
      category,
      unlockMethod,
      isFree,
      search,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    if (studentClass) query.class = studentClass;
    if (category) query.category = category;
    if (unlockMethod) query.unlockMethod = unlockMethod;
    if (isFree === 'true') query.isFree = true;
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const ebooks = await EBook.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await EBook.countDocuments(query);

    res.json({
      success: true,
      count: ebooks.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      ebooks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/ebooks/:id
// @desc    Get single e-book
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const ebook = await EBook.findById(req.params.id)
      .populate('book studentBook');

    if (!ebook) {
      return res.status(404).json({
        success: false,
        message: 'E-book not found'
      });
    }

    res.json({
      success: true,
      ebook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/ebooks/my-library
// @desc    Get user's e-book library (unlocked e-books)
// @access  Private
router.get('/my-library', protect, async (req, res) => {
  try {
    const accesses = await EBookAccess.find({ user: req.user.id })
      .populate('ebook')
      .sort({ lastAccessed: -1 });

    const ebooks = accesses.map(access => access.ebook).filter(Boolean);

    res.json({
      success: true,
      count: ebooks.length,
      ebooks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/ebooks/:id/check-access
// @desc    Check if user has access to e-book
// @access  Private
router.get('/:id/check-access', protect, async (req, res) => {
  try {
    const ebook = await EBook.findById(req.params.id);
    if (!ebook) {
      return res.status(404).json({
        success: false,
        message: 'E-book not found'
      });
    }

    const user = await User.findById(req.user.id);
    let hasAccess = false;
    let accessMethod = null;

    // Check if already unlocked
    const existingAccess = await EBookAccess.findOne({
      user: req.user.id,
      ebook: req.params.id
    });

    if (existingAccess) {
      hasAccess = true;
      accessMethod = existingAccess.accessMethod;
    } else {
      // Check unlock conditions
      if (ebook.unlockMethod === 'free' || ebook.isFree) {
        hasAccess = true;
        accessMethod = 'free';
      } else if (ebook.unlockMethod === 'class') {
        if (user.role === 'student' && user.studentProfile?.class === ebook.class) {
          hasAccess = true;
          accessMethod = 'class';
        }
      } else if (ebook.unlockMethod === 'purchase') {
        // Check if user purchased the related book
        if (ebook.book) {
          const orders = await Order.find({
            user: req.user.id,
            isPaid: true,
            'orderItems.book': ebook.book
          });
          if (orders.length > 0) {
            hasAccess = true;
            accessMethod = 'purchase';
          }
        }
        if (ebook.studentBook) {
          const orders = await Order.find({
            user: req.user.id,
            isPaid: true,
            'orderItems.studentBook': ebook.studentBook
          });
          if (orders.length > 0) {
            hasAccess = true;
            accessMethod = 'purchase';
          }
        }
      }
    }

    res.json({
      success: true,
      hasAccess,
      accessMethod,
      ebook: {
        title: ebook.title,
        unlockMethod: ebook.unlockMethod,
        isFree: ebook.isFree,
        price: ebook.price
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/ebooks/:id/unlock
// @desc    Unlock an e-book for user
// @access  Private
router.post('/:id/unlock', protect, async (req, res) => {
  try {
    const ebook = await EBook.findById(req.params.id);
    if (!ebook) {
      return res.status(404).json({
        success: false,
        message: 'E-book not found'
      });
    }

    const user = await User.findById(req.user.id);
    let accessMethod = null;

    // Check unlock conditions
    if (ebook.unlockMethod === 'free' || ebook.isFree) {
      accessMethod = 'free';
    } else if (ebook.unlockMethod === 'class') {
      if (user.role === 'student' && user.studentProfile?.class === ebook.class) {
        accessMethod = 'class';
      } else {
        return res.status(403).json({
          success: false,
          message: 'This e-book is only available for students in the specified class'
        });
      }
    } else if (ebook.unlockMethod === 'purchase') {
      // Check if user purchased the related book
      let hasPurchase = false;
      if (ebook.book) {
        const orders = await Order.find({
          user: req.user.id,
          isPaid: true,
          'orderItems.book': ebook.book
        });
        if (orders.length > 0) hasPurchase = true;
      }
      if (ebook.studentBook) {
        const orders = await Order.find({
          user: req.user.id,
          isPaid: true,
          'orderItems.studentBook': ebook.studentBook
        });
        if (orders.length > 0) hasPurchase = true;
      }

      if (!hasPurchase) {
        return res.status(403).json({
          success: false,
          message: 'You need to purchase the physical book to unlock this e-book'
        });
      }
      accessMethod = 'purchase';
    }

    if (!accessMethod) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this e-book'
      });
    }

    // Create or update access
    const access = await EBookAccess.findOneAndUpdate(
      { user: req.user.id, ebook: req.params.id },
      {
        user: req.user.id,
        ebook: req.params.id,
        accessMethod,
        lastAccessed: Date.now()
      },
      { upsert: true, new: true }
    );

    // Update download count
    await EBook.findByIdAndUpdate(req.params.id, {
      $inc: { downloadCount: 1 }
    });

    res.json({
      success: true,
      message: 'E-book unlocked successfully',
      access
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/ebooks/:id/access
// @desc    Record e-book access (for tracking)
// @access  Private
router.post('/:id/access', protect, async (req, res) => {
  try {
    const access = await EBookAccess.findOneAndUpdate(
      { user: req.user.id, ebook: req.params.id },
      { lastAccessed: Date.now() },
      { new: true }
    );

    if (!access) {
      return res.status(404).json({
        success: false,
        message: 'E-book access not found'
      });
    }

    res.json({
      success: true
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/ebooks/:id/download
// @desc    Record e-book download
// @access  Private
router.post('/:id/download', protect, async (req, res) => {
  try {
    const access = await EBookAccess.findOne({
      user: req.user.id,
      ebook: req.params.id
    });

    if (!access) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this e-book'
      });
    }

    // Update download count
    await EBookAccess.findByIdAndUpdate(access._id, {
      $inc: { downloadCount: 1 }
    });

    await EBook.findByIdAndUpdate(req.params.id, {
      $inc: { downloadCount: 1 }
    });

    const ebook = await EBook.findById(req.params.id);

    res.json({
      success: true,
      downloadUrl: ebook.fileUrl
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Admin routes
// @route   POST /api/ebooks
// @desc    Create e-book (Admin only)
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const ebook = await EBook.create(req.body);
    res.status(201).json({
      success: true,
      ebook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/ebooks/:id
// @desc    Update e-book (Admin only)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const ebook = await EBook.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!ebook) {
      return res.status(404).json({
        success: false,
        message: 'E-book not found'
      });
    }

    res.json({
      success: true,
      ebook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/ebooks/:id
// @desc    Delete e-book (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const ebook = await EBook.findById(req.params.id);
    if (!ebook) {
      return res.status(404).json({
        success: false,
        message: 'E-book not found'
      });
    }

    await ebook.deleteOne();
    await EBookAccess.deleteMany({ ebook: req.params.id });

    res.json({
      success: true,
      message: 'E-book deleted successfully'
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

