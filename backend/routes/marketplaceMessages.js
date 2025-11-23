const express = require('express');
const ExchangeMessage = require('../models/ExchangeMessage');
const ExchangeListing = require('../models/ExchangeListing');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/marketplace/messages/listing/:listingId
// @desc    Get messages for a listing
// @access  Private
router.get('/listing/:listingId', async (req, res) => {
  try {
    const listing = await ExchangeListing.findById(req.params.listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Only seller or interested users can see messages
    const isSeller = listing.seller.toString() === req.user.id;
    const isInterested = listing.interestedUsers.some(id => id.toString() === req.user.id);

    if (!isSeller && !isInterested) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view messages for this listing'
      });
    }

    const messages = await ExchangeMessage.find({
      listing: req.params.listingId,
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ]
    })
    .populate('sender', 'name email avatar')
    .populate('receiver', 'name email avatar')
    .sort({ createdAt: 1 });

    // Mark messages as read
    await ExchangeMessage.updateMany(
      {
        listing: req.params.listingId,
        receiver: req.user.id,
        isRead: false
      },
      {
        isRead: true,
        readAt: Date.now()
      }
    );

    res.json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/marketplace/messages
// @desc    Send a message
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { listingId, receiverId, message } = req.body;

    const listing = await ExchangeListing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Verify user can message (seller or interested user)
    const isSeller = listing.seller.toString() === req.user.id;
    const isInterested = listing.interestedUsers.some(id => id.toString() === req.user.id);
    const isReceiver = receiverId === listing.seller.toString() || listing.interestedUsers.some(id => id.toString() === receiverId);

    if (!isSeller && !isInterested) {
      return res.status(403).json({
        success: false,
        message: 'You must mark interest in the listing first'
      });
    }

    if (!isReceiver && receiverId !== listing.seller.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Invalid receiver'
      });
    }

    const newMessage = await ExchangeMessage.create({
      listing: listingId,
      sender: req.user.id,
      receiver: receiverId,
      message
    });

    const populatedMessage = await ExchangeMessage.findById(newMessage._id)
      .populate('sender', 'name email avatar')
      .populate('receiver', 'name email avatar');

    res.status(201).json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/marketplace/messages/conversations
// @desc    Get all user's conversations
// @access  Private
router.get('/conversations', async (req, res) => {
  try {
    const messages = await ExchangeMessage.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ]
    })
    .populate('listing', 'title images price condition')
    .populate('sender', 'name email avatar')
    .populate('receiver', 'name email avatar')
    .sort({ createdAt: -1 });

    // Group by listing
    const conversations = {};
    messages.forEach(msg => {
      const listingId = msg.listing._id.toString();
      if (!conversations[listingId]) {
        conversations[listingId] = {
          listing: msg.listing,
          messages: [],
          otherUser: msg.sender._id.toString() === req.user.id ? msg.receiver : msg.sender,
          unreadCount: 0
        };
      }
      conversations[listingId].messages.push(msg);
      if (!msg.isRead && msg.receiver._id.toString() === req.user.id) {
        conversations[listingId].unreadCount++;
      }
    });

    res.json({
      success: true,
      conversations: Object.values(conversations)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/marketplace/messages/unread-count
// @desc    Get unread message count
// @access  Private
router.get('/unread-count', async (req, res) => {
  try {
    const count = await ExchangeMessage.countDocuments({
      receiver: req.user.id,
      isRead: false
    });

    res.json({
      success: true,
      unreadCount: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;

