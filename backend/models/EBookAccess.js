const mongoose = require('mongoose');

const ebookAccessSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ebook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EBook',
    required: true
  },
  accessMethod: {
    type: String,
    enum: ['purchase', 'class', 'free'],
    required: true
  },
  unlockedAt: {
    type: Date,
    default: Date.now
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  downloadCount: {
    type: Number,
    default: 0
  }
});

ebookAccessSchema.index({ user: 1, ebook: 1 }, { unique: true });
ebookAccessSchema.index({ user: 1, unlockedAt: -1 });

module.exports = mongoose.model('EBookAccess', ebookAccessSchema);

