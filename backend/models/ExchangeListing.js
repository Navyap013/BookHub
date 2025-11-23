const mongoose = require('mongoose');

const exchangeListingSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
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
  condition: {
    type: String,
    required: [true, 'Please provide condition'],
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor']
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
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    enum: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Self-Help', 'Children', 'Educational', 'Comics', 'Poetry', 'Drama', 'Mystery', 'Romance', 'Fantasy', 'Horror', 'Thriller', 'Textbook', 'Academic']
  },
  class: {
    type: String,
    enum: ['Pre-KG', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
    default: null
  },
  isbn: {
    type: String,
    default: ''
  },
  location: {
    city: String,
    state: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'removed'],
    default: 'active'
  },
  views: {
    type: Number,
    default: 0
  },
  interestedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  soldTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  soldAt: {
    type: Date
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

exchangeListingSchema.index({ title: 'text', author: 'text', description: 'text' });
exchangeListingSchema.index({ seller: 1, status: 1 });
exchangeListingSchema.index({ status: 1, createdAt: -1 });
exchangeListingSchema.index({ category: 1, class: 1 });

module.exports = mongoose.model('ExchangeListing', exchangeListingSchema);

