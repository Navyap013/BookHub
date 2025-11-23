const mongoose = require('mongoose');

const exchangeMessageSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExchangeListing',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

exchangeMessageSchema.index({ listing: 1, createdAt: -1 });
exchangeMessageSchema.index({ sender: 1, receiver: 1 });
exchangeMessageSchema.index({ receiver: 1, isRead: 1 });

module.exports = mongoose.model('ExchangeMessage', exchangeMessageSchema);

