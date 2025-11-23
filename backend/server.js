const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route (before other routes)
app.use('/api/health', require('./routes/health'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/student-books', require('./routes/studentBooks'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/favourites', require('./routes/favourites'));
app.use('/api/forum', require('./routes/forum'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/classes', require('./routes/classes'));
app.use('/api/search', require('./routes/search'));
app.use('/api/ebooks', require('./routes/ebooks'));
app.use('/api/marketplace', require('./routes/marketplace'));
app.use('/api/marketplace/messages', require('./routes/marketplaceMessages'));

// Error handler middleware (must be after all routes)
app.use(require('./middleware/errorHandler'));

// Socket.io for real-time forum discussions
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
  });

  socket.on('new-comment', (data) => {
    socket.to(data.roomId).emit('comment-added', data);
  });

  socket.on('new-reply', (data) => {
    socket.to(data.roomId).emit('reply-added', data);
  });

  socket.on('upvote', (data) => {
    socket.to(data.roomId).emit('upvote-updated', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookhub2';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB Connected');
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

module.exports = { app, io };

