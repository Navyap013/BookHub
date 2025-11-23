const express = require('express');
const ForumPost = require('../models/ForumPost');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/forum
// @desc    Get all forum posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { genre, readingClub, sort = 'newest', page = 1, limit = 10 } = req.query;

    const query = {};
    if (genre) query.genre = genre;
    if (readingClub) query.readingClub = readingClub;

    const sortOptions = {};
    if (sort === 'popular') {
      sortOptions.upvotes = -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const skip = (page - 1) * limit;

    const posts = await ForumPost.find(query)
      .populate('user', 'name avatar role')
      .populate('comments.user', 'name avatar')
      .populate('comments.replies.user', 'name avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await ForumPost.countDocuments(query);

    res.json({
      success: true,
      count: posts.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/forum/:id
// @desc    Get single forum post
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('user', 'name avatar role')
      .populate('comments.user', 'name avatar')
      .populate('comments.replies.user', 'name avatar');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/forum
// @desc    Create forum post
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, genre, readingClub } = req.body;

    if (!title || !content || !genre) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, content, and genre'
      });
    }

    const post = await ForumPost.create({
      user: req.user.id,
      title,
      content,
      genre,
      readingClub: readingClub || 'General Discussion'
    });

    const populatedPost = await ForumPost.findById(post._id)
      .populate('user', 'name avatar role');

    res.status(201).json({
      success: true,
      post: populatedPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/forum/:id/comment
// @desc    Add comment to post
// @access  Private
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide comment content'
      });
    }

    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    post.comments.push({
      user: req.user.id,
      content
    });

    await post.save();

    const populatedPost = await ForumPost.findById(post._id)
      .populate('user', 'name avatar role')
      .populate('comments.user', 'name avatar')
      .populate('comments.replies.user', 'name avatar');

    res.json({
      success: true,
      post: populatedPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/forum/:id/comment/:commentId/reply
// @desc    Reply to a comment
// @access  Private
router.post('/:id/comment/:commentId/reply', protect, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide reply content'
      });
    }

    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    comment.replies.push({
      user: req.user.id,
      content
    });

    await post.save();

    const populatedPost = await ForumPost.findById(post._id)
      .populate('user', 'name avatar role')
      .populate('comments.user', 'name avatar')
      .populate('comments.replies.user', 'name avatar');

    res.json({
      success: true,
      post: populatedPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/forum/:id/upvote
// @desc    Upvote a post
// @access  Private
router.post('/:id/upvote', protect, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const upvoteIndex = post.upvotes.indexOf(req.user.id);
    const downvoteIndex = post.downvotes.indexOf(req.user.id);

    if (upvoteIndex > -1) {
      post.upvotes.splice(upvoteIndex, 1);
    } else {
      if (downvoteIndex > -1) {
        post.downvotes.splice(downvoteIndex, 1);
      }
      post.upvotes.push(req.user.id);
    }

    await post.save();

    res.json({
      success: true,
      upvotes: post.upvotes.length,
      downvotes: post.downvotes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/forum/:id/comment/:commentId/upvote
// @desc    Upvote a comment
// @access  Private
router.post('/:id/comment/:commentId/upvote', protect, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const upvoteIndex = comment.upvotes.indexOf(req.user.id);
    if (upvoteIndex > -1) {
      comment.upvotes.splice(upvoteIndex, 1);
    } else {
      comment.upvotes.push(req.user.id);
    }

    await post.save();

    res.json({
      success: true,
      upvotes: comment.upvotes.length
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

