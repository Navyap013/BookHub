const express = require('express');
const Book = require('../models/Book');
const StudentBook = require('../models/StudentBook');
const SearchHistory = require('../models/SearchHistory');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/search/suggestions
// @desc    Get search suggestions (autocomplete)
// @access  Public
router.get('/suggestions', async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        suggestions: []
      });
    }

    // Search in book titles and authors (fuzzy matching)
    const bookSuggestions = await Book.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } }
      ]
    })
    .select('title author coverImage')
    .limit(Number(limit));

    const studentBookSuggestions = await StudentBook.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } }
      ]
    })
    .select('title author coverImage class')
    .limit(Number(limit));

    const suggestions = [
      ...bookSuggestions.map(b => ({
        type: 'book',
        title: b.title,
        author: b.author,
        image: b.coverImage,
        id: b._id
      })),
      ...studentBookSuggestions.map(b => ({
        type: 'student-book',
        title: b.title,
        author: b.author,
        image: b.coverImage,
        class: b.class,
        id: b._id
      }))
    ].slice(0, Number(limit));

    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/search/trending
// @desc    Get trending searches
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const { limit = 10, days = 7 } = req.query;

    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - Number(days));

    // Get most searched queries in last N days
    const trending = await SearchHistory.aggregate([
      {
        $match: {
          createdAt: { $gte: dateLimit }
        }
      },
      {
        $group: {
          _id: '$query',
          count: { $sum: 1 },
          lastSearched: { $max: '$createdAt' }
        }
      },
      {
        $sort: { count: -1, lastSearched: -1 }
      },
      {
        $limit: Number(limit)
      },
      {
        $project: {
          query: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      success: true,
      trending: trending.map(t => t.query)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/search/log
// @desc    Log a search query
// @access  Public (optional auth)
router.post('/log', async (req, res) => {
  try {
    const { query, resultsCount = 0, searchType = 'all' } = req.body;
    const userId = req.user?.id || null;
    const ipAddress = req.ip || req.connection.remoteAddress || '';

    if (query && query.trim().length > 0) {
      await SearchHistory.create({
        user: userId,
        query: query.trim(),
        resultsCount,
        searchType,
        ipAddress
      });
    }

    res.json({
      success: true
    });
  } catch (error) {
    // Don't fail the request if logging fails
    res.json({
      success: true
    });
  }
});

// @route   GET /api/search/intelligent
// @desc    Intelligent search with fuzzy matching
// @access  Public
router.get('/intelligent', async (req, res) => {
  try {
    const { q, type = 'all', page = 1, limit = 20 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.json({
        success: true,
        query: q,
        results: {
          books: [],
          studentBooks: []
        },
        total: 0
      });
    }

    const query = q.trim();

    // Fuzzy matching: try exact match first, then partial, then similar
    const exactMatch = new RegExp(`^${query}$`, 'i');
    const partialMatch = new RegExp(query, 'i');
    const wordMatch = new RegExp(query.split(' ').join('|'), 'i');

    const results = {
      books: [],
      studentBooks: []
    };

    if (type === 'all' || type === 'books') {
      // Try exact match first
      let books = await Book.find({
        $or: [
          { title: exactMatch },
          { author: exactMatch }
        ]
      }).limit(Number(limit));

      // If not enough, add partial matches
      if (books.length < Number(limit)) {
        const partialBooks = await Book.find({
          $or: [
            { title: partialMatch },
            { author: partialMatch },
            { description: partialMatch }
          ],
          _id: { $nin: books.map(b => b._id) }
        }).limit(Number(limit) - books.length);
        books = [...books, ...partialBooks];
      }

      // If still not enough, try word matching
      if (books.length < Number(limit)) {
        const wordBooks = await Book.find({
          $or: [
            { title: wordMatch },
            { author: wordMatch }
          ],
          _id: { $nin: books.map(b => b._id) }
        }).limit(Number(limit) - books.length);
        books = [...books, ...wordBooks];
      }

      results.books = books;
    }

    if (type === 'all' || type === 'student-books') {
      let studentBooks = await StudentBook.find({
        $or: [
          { title: exactMatch },
          { author: exactMatch }
        ]
      }).limit(Number(limit));

      if (studentBooks.length < Number(limit)) {
        const partialStudentBooks = await StudentBook.find({
          $or: [
            { title: partialMatch },
            { author: partialMatch },
            { description: partialMatch }
          ],
          _id: { $nin: studentBooks.map(b => b._id) }
        }).limit(Number(limit) - studentBooks.length);
        studentBooks = [...studentBooks, ...partialStudentBooks];
      }

      if (studentBooks.length < Number(limit)) {
        const wordStudentBooks = await StudentBook.find({
          $or: [
            { title: wordMatch },
            { author: wordMatch }
          ],
          _id: { $nin: studentBooks.map(b => b._id) }
        }).limit(Number(limit) - studentBooks.length);
        studentBooks = [...studentBooks, ...wordStudentBooks];
      }

      results.studentBooks = studentBooks;
    }

    const total = results.books.length + results.studentBooks.length;

    res.json({
      success: true,
      query,
      results,
      total
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

