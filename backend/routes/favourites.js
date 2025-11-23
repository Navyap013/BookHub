const express = require('express');
const Favourite = require('../models/Favourite');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/favourites
// @desc    Get user's favourites
// @access  Private
router.get('/', async (req, res) => {
  try {
    const favourites = await Favourite.find({ user: req.user.id })
      .populate('book')
      .populate('studentBook')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: favourites.length,
      favourites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/favourites
// @desc    Add to favourites
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { bookId, studentBookId } = req.body;

    if (!bookId && !studentBookId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either bookId or studentBookId'
      });
    }

    // Check if already in favourites
    const existingFavourite = await Favourite.findOne({
      user: req.user.id,
      $or: [
        { book: bookId },
        { studentBook: studentBookId }
      ]
    });

    if (existingFavourite) {
      return res.status(400).json({
        success: false,
        message: 'Already in favourites'
      });
    }

    const favourite = await Favourite.create({
      user: req.user.id,
      book: bookId || null,
      studentBook: studentBookId || null
    });

    const populatedFavourite = await Favourite.findById(favourite._id)
      .populate('book')
      .populate('studentBook');

    res.status(201).json({
      success: true,
      favourite: populatedFavourite
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/favourites/:id
// @desc    Remove from favourites
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const favourite = await Favourite.findById(req.params.id);

    if (!favourite) {
      return res.status(404).json({
        success: false,
        message: 'Favourite not found'
      });
    }

    if (favourite.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await favourite.deleteOne();

    res.json({
      success: true,
      message: 'Removed from favourites'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/favourites/check
// @desc    Check if book is in favourites
// @access  Private
router.get('/check', async (req, res) => {
  try {
    const { bookId, studentBookId } = req.query;

    if (!bookId && !studentBookId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either bookId or studentBookId'
      });
    }

    const favourite = await Favourite.findOne({
      user: req.user.id,
      $or: [
        { book: bookId },
        { studentBook: studentBookId }
      ]
    });

    res.json({
      success: true,
      isFavourite: !!favourite,
      favouriteId: favourite ? favourite._id : null
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

