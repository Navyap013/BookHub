const express = require('express');
const Review = require('../models/Review');
const Book = require('../models/Book');
const StudentBook = require('../models/StudentBook');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reviews/book/:bookId
// @desc    Get reviews for a book
// @access  Public
router.get('/book/:bookId', async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/reviews/student-book/:studentBookId
// @desc    Get reviews for a student book
// @access  Public
router.get('/student-book/:studentBookId', async (req, res) => {
  try {
    const reviews = await Review.find({ studentBook: req.params.studentBookId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/reviews
// @desc    Create a review
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { bookId, studentBookId, rating, comment } = req.body;

    if (!bookId && !studentBookId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either bookId or studentBookId'
      });
    }

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rating and comment'
      });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      user: req.user.id,
      $or: [
        { book: bookId },
        { studentBook: studentBookId }
      ]
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this book'
      });
    }

    const review = await Review.create({
      user: req.user.id,
      book: bookId || null,
      studentBook: studentBookId || null,
      rating: Number(rating),
      comment
    });

    // Update book rating
    if (bookId) {
      const book = await Book.findById(bookId);
      const reviews = await Review.find({ book: bookId });
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      book.rating.average = avgRating;
      book.rating.count = reviews.length;
      await book.save();
    }

    if (studentBookId) {
      const studentBook = await StudentBook.findById(studentBookId);
      const reviews = await Review.find({ studentBook: studentBookId });
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      studentBook.rating.average = avgRating;
      studentBook.rating.count = reviews.length;
      await studentBook.save();
    }

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      review: populatedReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    const { rating, comment } = req.body;
    if (rating) review.rating = Number(rating);
    if (comment) review.comment = comment;
    review.updatedAt = Date.now();

    await review.save();

    // Update book rating
    if (review.book) {
      const book = await Book.findById(review.book);
      const reviews = await Review.find({ book: review.book });
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      book.rating.average = avgRating;
      book.rating.count = reviews.length;
      await book.save();
    }

    if (review.studentBook) {
      const studentBook = await StudentBook.findById(review.studentBook);
      const reviews = await Review.find({ studentBook: review.studentBook });
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      studentBook.rating.average = avgRating;
      studentBook.rating.count = reviews.length;
      await studentBook.save();
    }

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name avatar');

    res.json({
      success: true,
      review: populatedReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const bookId = review.book;
    const studentBookId = review.studentBook;

    await review.deleteOne();

    // Update book rating
    if (bookId) {
      const book = await Book.findById(bookId);
      const reviews = await Review.find({ book: bookId });
      if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        book.rating.average = avgRating;
        book.rating.count = reviews.length;
      } else {
        book.rating.average = 0;
        book.rating.count = 0;
      }
      await book.save();
    }

    if (studentBookId) {
      const studentBook = await StudentBook.findById(studentBookId);
      const reviews = await Review.find({ studentBook: studentBookId });
      if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        studentBook.rating.average = avgRating;
        studentBook.rating.count = reviews.length;
      } else {
        studentBook.rating.average = 0;
        studentBook.rating.count = 0;
      }
      await studentBook.save();
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
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

