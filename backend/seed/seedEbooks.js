const mongoose = require('mongoose');
const EBook = require('../models/EBook');

// Use the same MongoDB URI as in server.js
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookhub2';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Sample ebooks data
const ebooks = [
  {
    title: 'The Art of War',
    author: 'Sun Tzu',
    description: 'An ancient Chinese military treatise that is still relevant today for its insights into strategy and leadership.',
    fileUrl: 'https://www.gutenberg.org/ebooks/132.epub.images',
    fileType: 'EPUB',
    fileSize: 800000, // 0.8 MB in bytes
    coverImage: 'https://m.media-amazon.com/images/I/61bu4DOPeFL._AC_UF1000,1000_QL80_.jpg',
    pages: 50,
    isbn: '9781599869773',
    publishedYear: -500,
    unlockMethod: 'free',
    isFree: true,
    subject: 'Strategy'
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'A romantic novel that charts the emotional development of Elizabeth Bennet, who learns about the repercussions of hasty judgments.',
    fileUrl: 'https://www.gutenberg.org/ebooks/1342.epub.images',
    fileType: 'EPUB',
    fileSize: 900000, // 0.9 MB in bytes
    coverImage: 'https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg',
    pages: 279,
    isbn: '9780141439518',
    publishedYear: 1813,
    unlockMethod: 'free',
    isFree: true,
    subject: 'Classic Literature'
  },
  {
    title: 'The Adventures of Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    description: 'A collection of twelve detective stories featuring Sherlock Holmes, a brilliant London-based detective.',
    fileUrl: 'https://www.gutenberg.org/ebooks/1661.epub.images',
    fileType: 'EPUB',
    fileSize: 700000, // 0.7 MB in bytes
    coverImage: 'https://m.media-amazon.com/images/I/81zB3rVq9OL._AC_UF1000,1000_QL80_.jpg',
    pages: 240,
    isbn: '9780199536955',
    publishedYear: 1892,
    unlockMethod: 'free',
    isFree: true,
    subject: 'Mystery'
  }
];

// Import data into DB
const importData = async () => {
  try {
    await EBook.deleteMany();
    await EBook.insertMany(ebooks);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error('Error with data import:', error);
    process.exit(1);
  }
};

// Run the import
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected, starting import...');
  importData();
});
