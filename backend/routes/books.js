const express = require('express');
const Book = require('../models/Book');
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/books
// @desc    Get all books with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      author,
      language,
      minPrice,
      maxPrice,
      minRating,
      maxRating,
      bookType,
      search,
      featured,
      trending,
      recentlyAdded,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (author) query.author = { $regex: author, $options: 'i' };
    if (language) query.language = language;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (featured === 'true') query.featured = true;
    if (trending === 'true') query.trending = true;
    if (recentlyAdded === 'true') query.recentlyAdded = true;
    if (bookType) {
      if (bookType === 'E-Book') {
        query.bookType = 'E-Book';
      } else if (bookType === 'Physical') {
        query.bookType = 'Physical';
      } else if (bookType === 'Both') {
        query.bookType = 'Both';
      }
    }
    if (minRating || maxRating) {
      query['rating.average'] = {};
      if (minRating) query['rating.average'].$gte = Number(minRating);
      if (maxRating) query['rating.average'].$lte = Number(maxRating);
    }
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

    const books = await Book.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Book.countDocuments(query);

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

// @route   GET /api/books/:id
// @desc    Get single book
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
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

// @route   GET /api/books/featured/list
// @desc    Get featured books
// @access  Public
router.get('/featured/list', async (req, res) => {
  try {
    const books = await Book.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
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

// @route   GET /api/books/trending/list
// @desc    Get trending books
// @access  Public
router.get('/trending/list', async (req, res) => {
  try {
    const books = await Book.find({ trending: true })
      .sort({ 'rating.average': -1, 'rating.count': -1 })
      .limit(10);

    res.json({
      success: true,
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

// @route   GET /api/books/recent/list
// @desc    Get recently added books
// @access  Public
router.get('/recent/list', async (req, res) => {
  try {
    const books = await Book.find({ recentlyAdded: true })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
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

