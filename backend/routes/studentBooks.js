const express = require('express');
const StudentBook = require('../models/StudentBook');
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/student-books
// @desc    Get all student books with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      class: studentClass,
      subject,
      language,
      minPrice,
      maxPrice,
      search,
      isPreKG,
      featured,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    if (studentClass) query.class = studentClass;
    if (subject) query.subject = subject;
    if (language) query.language = language;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (isPreKG === 'true') query.isPreKG = true;
    if (featured === 'true') query.featured = true;
    if (search) {
      query.$text = { $search: search };
    }

    const sortOptions = {};
    if (sort === 'price-low') sortOptions.price = 1;
    else if (sort === 'price-high') sortOptions.price = -1;
    else if (sort === 'rating') sortOptions['rating.average'] = -1;
    else if (sort === 'newest') sortOptions.createdAt = -1;
    else sortOptions.createdAt = -1;

    const skip = (page - 1) * limit;

    const books = await StudentBook.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await StudentBook.countDocuments(query);

    res.json({
      success: true,
      count: books.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/student-books/:id
// @desc    Get single student book
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const book = await StudentBook.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/student-books/class/:class
// @desc    Get books by class
// @access  Public
router.get('/class/:class', async (req, res) => {
  try {
    const books = await StudentBook.find({ class: req.params.class })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: books.length,
      books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/student-books/prekg/list
// @desc    Get Pre-KG books
// @access  Public
router.get('/prekg/list', async (req, res) => {
  try {
    const books = await StudentBook.find({ isPreKG: true })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: books.length,
      books
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

