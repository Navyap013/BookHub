const mongoose = require('mongoose');

const studentBookSchema = new mongoose.Schema({
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
  class: {
    type: String,
    required: [true, 'Please provide a class'],
    enum: ['Pre-KG', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']
  },
  subject: {
    type: String,
    enum: ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi', 'Art', 'Music', 'Physical Education', 'Computer Science', 'General Knowledge', 'Story Books', 'Activity Books']
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
  isPreKG: {
    type: Boolean,
    default: false
  },
  ageGroup: {
    type: String,
    enum: ['2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16', '16-17', '17-18']
  },
  tags: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
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

studentBookSchema.index({ title: 'text', author: 'text', description: 'text', class: 'text', subject: 'text' });
studentBookSchema.index({ class: 1, subject: 1, language: 1 });

module.exports = mongoose.model('StudentBook', studentBookSchema);

