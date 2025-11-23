# BookHub 2.0 - Advanced Online Bookstore & Student Learning Platform

A complete full-stack MERN application that serves as both an advanced online bookstore and a student learning platform with comprehensive features including authentication, e-commerce, forums, recommendations, and admin management.

## Features

### 🎯 Core Features
- **User Authentication**: JWT-based authentication with role-based access (User, Student, Admin)
- **Book Management**: Browse, search, filter books with advanced options
- **Student Library**: Dedicated section for academic books (Pre-KG to Class 12)
- **Pre-KG Zone**: Colorful, cartoon-themed interface for young learners
- **Shopping Cart**: Full cart functionality with add/remove/update quantities
- **Favourites/Wishlist**: Save books for later
- **Reviews & Ratings**: Users can rate and review books
- **Order Management**: Complete order flow with payment integration (Razorpay)
- **Discussion Forum**: Community forum with comments, replies, and upvotes
- **AI Recommendations**: Personalized book recommendations based on history and preferences
- **Admin Dashboard**: Complete admin panel for managing books, orders, and users

### 🆕 New Features (Latest Update)
- **E-Book System**: Complete e-book library with unlock mechanisms (purchase, class-based, free)
- **Book Exchange Marketplace**: Buy and sell used books with photos, condition tags, and in-app messaging
- **Enhanced Search**: Intelligent search with autocomplete, trending searches, and fuzzy matching
- **Voice Search**: Speech-to-text voice search functionality
- **Advanced Filters**: Book type (Physical/E-Book/Both) and rating range filters
- **E-Book Access Control**: Unlock e-books based on purchases, class, or free access
- **Marketplace Messaging**: Real-time messaging between buyers and sellers

### 🎨 UI/UX Features
- Modern, responsive design with Tailwind CSS
- Smooth animations using Framer Motion
- Mobile-friendly interface
- Intuitive navigation
- Beautiful color schemes and gradients

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Socket.io** for real-time forum discussions
- **Razorpay** for payment processing
- **bcryptjs** for password hashing
- **Multer** for file uploads (marketplace images)

### Frontend
- **React 18** with React Router
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Axios** for API calls
- **React Toastify** for notifications
- **Socket.io Client** for real-time features

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookhub2
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

4. Start the frontend development server:
```bash
npm start
```

### Running Both Servers

From the root directory:
```bash
npm run dev
```

This will start both backend and frontend servers concurrently.

## Project Structure

```
BookHub_2.0/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Utility functions
│   └── server.js       # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── utils/       # Utility functions
│   │   └── App.js       # Main app component
│   └── public/          # Static files
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Books
- `GET /api/books` - Get all books (with filters)
- `GET /api/books/:id` - Get single book
- `GET /api/books/featured/list` - Get featured books
- `GET /api/books/trending/list` - Get trending books

### Student Books
- `GET /api/student-books` - Get all student books
- `GET /api/student-books/:id` - Get single student book
- `GET /api/student-books/prekg/list` - Get Pre-KG books

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update item quantity
- `DELETE /api/cart/:itemId` - Remove item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/:id/pay` - Process payment

### Reviews
- `GET /api/reviews/book/:bookId` - Get book reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Forum
- `GET /api/forum` - Get all posts
- `POST /api/forum` - Create post
- `POST /api/forum/:id/comment` - Add comment
- `POST /api/forum/:id/upvote` - Upvote post

### Admin
- `GET /api/admin/stats` - Get dashboard stats
- `POST /api/admin/books` - Create book
- `PUT /api/admin/books/:id` - Update book
- `DELETE /api/admin/books/:id` - Delete book

## Creating Admin User

After setting up, create an admin user using the provided script:

```bash
cd backend
npm run create-admin [email] [password] [name]
```

Example:
```bash
npm run create-admin admin@bookhub.com admin123 "Admin User"
```

Or create a user through registration and manually update the role in MongoDB:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Sample Data

The application includes a seeding script to populate the database with sample data:

```bash
cd backend
npm run seed
```

This will add:
- 8 sample books (including featured and trending)
- 8 sample student books (Pre-KG to Class 10)
- 15 class definitions

You can also:
1. Use the admin panel to add books
2. Create sample data through API calls
3. Manually add data through MongoDB

## Payment Integration

The application includes Razorpay integration. For testing:
1. Sign up for Razorpay test account
2. Get test API keys
3. Add keys to `.env` file
4. Use test card numbers provided by Razorpay

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Additional Resources

- [Quick Start Guide](QUICK_START.md) - Get started in 5 minutes
- [Setup Instructions](SETUP.md) - Detailed setup guide
- [API Documentation](API_DOCUMENTATION.md) - Complete API reference
- [Deployment Guide](DEPLOYMENT.md) - Production deployment instructions
- [Project Structure](PROJECT_STRUCTURE.md) - Codebase organization
- [Contributing Guide](CONTRIBUTING.md) - How to contribute

## Support

For issues and questions, please open an issue on the repository.

## License

This project is open source and available under the MIT License.

---

Built with ❤️ using MERN Stack

