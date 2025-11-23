const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
    trim: true
  },
  genre: {
    type: String,
    required: [true, 'Please provide a genre'],
    enum: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Self-Help', 'Children', 'Educational', 'Comics', 'Poetry', 'Drama', 'Mystery', 'Romance', 'Fantasy', 'Horror', 'Thriller', 'General']
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    replies: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      content: {
        type: String,
        required: true,
        trim: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    upvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  readingClub: {
    type: String,
    enum: ['Fiction Club', 'Science Club', 'History Club', 'Children Club', 'Poetry Club', 'General Discussion'],
    default: 'General Discussion'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

forumPostSchema.index({ genre: 1, createdAt: -1 });
forumPostSchema.index({ readingClub: 1 });

module.exports = mongoose.model('ForumPost', forumPostSchema);

