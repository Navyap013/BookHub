const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  query: {
    type: String,
    required: true,
    trim: true
  },
  resultsCount: {
    type: Number,
    default: 0
  },
  searchType: {
    type: String,
    enum: ['books', 'student-books', 'all'],
    default: 'all'
  },
  ipAddress: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

searchHistorySchema.index({ query: 'text' });
searchHistorySchema.index({ user: 1, createdAt: -1 });
searchHistorySchema.index({ createdAt: -1 });

module.exports = mongoose.model('SearchHistory', searchHistorySchema);

