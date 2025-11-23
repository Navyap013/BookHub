const express = require('express');
const Book = require('../models/Book');
const StudentBook = require('../models/StudentBook');
const Favourite = require('../models/Favourite');
const Review = require('../models/Review');
const Order = require('../models/Order');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/recommendations
// @desc    Get personalized recommendations
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const recommendations = {
      basedOnHistory: [],
      basedOnWishlist: [],
      basedOnClass: [],
      trending: [],
      popular: []
    };

    // Based on order history
    const orders = await Order.find({ user: req.user.id })
      .populate('orderItems.book orderItems.studentBook')
      .limit(10);

    if (orders.length > 0) {
      const purchasedCategories = new Set();
      const purchasedAuthors = new Set();

      orders.forEach(order => {
        order.orderItems.forEach(item => {
          if (item.book) {
            const book = item.book;
            if (book.category) purchasedCategories.add(book.category);
            if (book.author) purchasedAuthors.add(book.author);
          }
          if (item.studentBook) {
            const studentBook = item.studentBook;
            if (studentBook.subject) purchasedCategories.add(studentBook.subject);
            if (studentBook.author) purchasedAuthors.add(studentBook.author);
          }
        });
      });

      if (purchasedCategories.size > 0) {
        const categoryArray = Array.from(purchasedCategories);
        recommendations.basedOnHistory = await Book.find({
          category: { $in: categoryArray },
          _id: { $nin: orders.flatMap(o => o.orderItems.map(i => i.book || i.studentBook).filter(Boolean)) }
        })
        .limit(10)
        .sort({ 'rating.average': -1 });
      }
    }

    // Based on wishlist/favourites
    const favourites = await Favourite.find({ user: req.user.id })
      .populate('book studentBook')
      .limit(20);

    if (favourites.length > 0) {
      const favouriteCategories = new Set();
      const favouriteAuthors = new Set();

      favourites.forEach(fav => {
        if (fav.book) {
          if (fav.book.category) favouriteCategories.add(fav.book.category);
          if (fav.book.author) favouriteAuthors.add(fav.book.author);
        }
        if (fav.studentBook) {
          if (fav.studentBook.subject) favouriteCategories.add(fav.studentBook.subject);
          if (fav.studentBook.author) favouriteAuthors.add(fav.studentBook.author);
        }
      });

      if (favouriteCategories.size > 0) {
        const categoryArray = Array.from(favouriteCategories);
        const favouriteIds = favourites.map(f => f.book?._id || f.studentBook?._id).filter(Boolean);
        recommendations.basedOnWishlist = await Book.find({
          category: { $in: categoryArray },
          _id: { $nin: favouriteIds }
        })
        .limit(10)
        .sort({ 'rating.average': -1 });
      }
    }

    // Based on student class
    if (user.role === 'student' && user.studentProfile && user.studentProfile.class) {
      recommendations.basedOnClass = await StudentBook.find({
        class: user.studentProfile.class
      })
      .limit(10)
      .sort({ 'rating.average': -1, featured: -1 });
    }

    // Trending books
    recommendations.trending = await Book.find({ trending: true })
      .limit(10)
      .sort({ 'rating.average': -1, 'rating.count': -1 });

    // Popular books (highly rated)
    recommendations.popular = await Book.find({
      'rating.average': { $gte: 4 },
      'rating.count': { $gte: 10 }
    })
    .limit(10)
    .sort({ 'rating.average': -1, 'rating.count': -1 });

    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/recommendations/search
// @desc    Intelligent search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, type = 'all' } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    const results = {
      books: [],
      studentBooks: []
    };

    if (type === 'all' || type === 'books') {
      results.books = await Book.find({
        $text: { $search: q }
      })
      .limit(20)
      .sort({ score: { $meta: 'textScore' } });
    }

    if (type === 'all' || type === 'student-books') {
      results.studentBooks = await StudentBook.find({
        $text: { $search: q }
      })
      .limit(20)
      .sort({ score: { $meta: 'textScore' } });
    }

    res.json({
      success: true,
      query: q,
      results
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

