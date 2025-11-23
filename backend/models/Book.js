const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
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
  isbn: {
    type: String,
    unique: true,
    sparse: true
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Self-Help', 'Children', 'Educational', 'Comics', 'Poetry', 'Drama', 'Mystery', 'Romance', 'Fantasy', 'Horror', 'Thriller']
  },
  language: {
    type: String,
    default: 'English',
    enum: ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  images: [{
    type: String
  }],
  coverImage: {
    type: String,
    default: ''
  },
  publisher: {
    type: String,
    default: ''
  },
  publishedDate: {
    type: Date
  },
  pages: {
    type: Number,
    min: 1
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
  tags: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  trending: {
    type: Boolean,
    default: false
  },
  recentlyAdded: {
    type: Boolean,
    default: false
  },
  bookType: {
    type: String,
    enum: ['Physical', 'E-Book', 'Both'],
    default: 'Physical'
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

bookSchema.index({ title: 'text', author: 'text', description: 'text', category: 'text' });
bookSchema.index({ category: 1, price: 1, language: 1 });

module.exports = mongoose.model('Book', bookSchema);

