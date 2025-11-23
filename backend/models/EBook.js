const mongoose = require('mongoose');

const ebookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    default: null
  },
  studentBook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentBook',
    default: null
  },
  fileUrl: {
    type: String,
    required: [true, 'Please provide an e-book file URL']
  },
  fileType: {
    type: String,
    enum: ['PDF', 'EPUB', 'MOBI'],
    default: 'PDF'
  },
  fileSize: {
    type: Number, // in bytes
    default: 0
  },
  coverImage: {
    type: String,
    default: ''
  },
  pages: {
    type: Number,
    default: 0
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true
  },
  category: {
    type: String,
    enum: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Self-Help', 'Children', 'Educational', 'Comics', 'Poetry', 'Drama', 'Mystery', 'Romance', 'Fantasy', 'Horror', 'Thriller']
  },
  class: {
    type: String,
    enum: ['Pre-KG', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
    default: null
  },
  unlockMethod: {
    type: String,
    enum: ['purchase', 'class', 'free'],
    default: 'purchase'
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  isFree: {
    type: Boolean,
    default: false
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  downloadCount: {
    type: Number,
    default: 0
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

ebookSchema.index({ title: 'text', author: 'text', description: 'text' });
ebookSchema.index({ class: 1, unlockMethod: 1 });

module.exports = mongoose.model('EBook', ebookSchema);

