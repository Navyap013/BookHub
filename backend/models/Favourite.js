const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  },
  studentBook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentBook'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

favouriteSchema.index({ user: 1, book: 1 });
favouriteSchema.index({ user: 1, studentBook: 1 });

module.exports = mongoose.model('Favourite', favouriteSchema);

