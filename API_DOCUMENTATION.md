# BookHub 2.0 - API Documentation

## Base URL
```
http://localhost:5000/api (Development)
https://api.yourdomain.com/api (Production)
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Health Check

#### GET /api/health
Check API health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": {
    "status": "connected",
    "connected": true
  },
  "uptime": 3600,
  "environment": "development"
}
```

---

### Authentication

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",
  "studentClass": "Class 5" // Optional, if role is "student"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### POST /api/auth/login
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### GET /api/auth/me
Get current user (Protected).

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### PUT /api/auth/profile
Update user profile (Protected).

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "1234567890",
  "address": {
    "street": "123 Main St",
    "city": "City",
    "state": "State",
    "zipCode": "12345"
  },
  "studentClass": "Class 6" // For students
}
```

---

### Books

#### GET /api/books
Get all books with filters.

**Query Parameters:**
- `category` - Filter by category
- `author` - Filter by author
- `language` - Filter by language
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `search` - Search query
- `featured` - Featured books (true/false)
- `trending` - Trending books (true/false)
- `recentlyAdded` - Recently added (true/false)
- `sort` - Sort by (newest, price-low, price-high, rating)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "books": [...]
}
```

#### GET /api/books/:id
Get single book.

**Response:**
```json
{
  "success": true,
  "book": {
    "_id": "book_id",
    "title": "Book Title",
    "author": "Author Name",
    "description": "Book description",
    "price": 299,
    "rating": {
      "average": 4.5,
      "count": 120
    }
  }
}
```

#### GET /api/books/featured/list
Get featured books.

#### GET /api/books/trending/list
Get trending books.

#### GET /api/books/recent/list
Get recently added books.

---

### Student Books

#### GET /api/student-books
Get all student books with filters.

**Query Parameters:**
- `class` - Filter by class
- `subject` - Filter by subject
- `language` - Filter by language
- `isPreKG` - Pre-KG books (true/false)
- `page` - Page number
- `limit` - Items per page

#### GET /api/student-books/:id
Get single student book.

#### GET /api/student-books/class/:class
Get books by class.

#### GET /api/student-books/prekg/list
Get Pre-KG books.

---

### Cart (Protected)

#### GET /api/cart
Get user's cart.

**Response:**
```json
{
  "success": true,
  "cart": {
    "items": [
      {
        "_id": "item_id",
        "book": "book_id",
        "name": "Book Title",
        "price": 299,
        "quantity": 2
      }
    ],
    "totalPrice": 598
  }
}
```

#### POST /api/cart
Add item to cart.

**Request Body:**
```json
{
  "bookId": "book_id", // or
  "studentBookId": "student_book_id",
  "quantity": 1
}
```

#### PUT /api/cart/:itemId
Update item quantity.

**Request Body:**
```json
{
  "quantity": 3
}
```

#### DELETE /api/cart/:itemId
Remove item from cart.

#### DELETE /api/cart
Clear entire cart.

---

### Orders (Protected)

#### POST /api/orders
Create new order.

**Request Body:**
```json
{
  "shippingAddress": {
    "name": "John Doe",
    "phone": "1234567890",
    "street": "123 Main St",
    "city": "City",
    "state": "State",
    "zipCode": "12345",
    "country": "India"
  },
  "paymentMethod": "Razorpay"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "_id": "order_id",
    "invoiceNumber": "INV-123456",
    "totalPrice": 598,
    "status": "Pending"
  },
  "razorpayOrder": {
    "id": "order_razorpay_id",
    "amount": 59800
  }
}
```

#### GET /api/orders
Get user's orders.

#### GET /api/orders/:id
Get order details.

#### POST /api/orders/:id/pay
Update payment status.

**Request Body:**
```json
{
  "paymentId": "payment_id",
  "orderId": "razorpay_order_id",
  "signature": "razorpay_signature"
}
```

---

### Reviews

#### GET /api/reviews/book/:bookId
Get reviews for a book.

#### GET /api/reviews/student-book/:studentBookId
Get reviews for a student book.

#### POST /api/reviews (Protected)
Create a review.

**Request Body:**
```json
{
  "bookId": "book_id", // or
  "studentBookId": "student_book_id",
  "rating": 5,
  "comment": "Great book!"
}
```

#### PUT /api/reviews/:id (Protected)
Update review.

#### DELETE /api/reviews/:id (Protected)
Delete review.

---

### Favourites (Protected)

#### GET /api/favourites
Get user's favourites.

#### POST /api/favourites
Add to favourites.

**Request Body:**
```json
{
  "bookId": "book_id", // or
  "studentBookId": "student_book_id"
}
```

#### DELETE /api/favourites/:id
Remove from favourites.

#### GET /api/favourites/check
Check if book is in favourites.

**Query Parameters:**
- `bookId` - Book ID
- `studentBookId` - Student book ID

---

### Forum

#### GET /api/forum
Get all forum posts.

**Query Parameters:**
- `genre` - Filter by genre
- `readingClub` - Filter by reading club
- `sort` - Sort by (newest, popular)
- `page` - Page number
- `limit` - Items per page

#### GET /api/forum/:id
Get single forum post.

#### POST /api/forum (Protected)
Create forum post.

**Request Body:**
```json
{
  "title": "Post Title",
  "content": "Post content",
  "genre": "Fiction",
  "readingClub": "Fiction Club"
}
```

#### POST /api/forum/:id/comment (Protected)
Add comment to post.

**Request Body:**
```json
{
  "content": "Comment text"
}
```

#### POST /api/forum/:id/comment/:commentId/reply (Protected)
Reply to a comment.

**Request Body:**
```json
{
  "content": "Reply text"
}
```

#### POST /api/forum/:id/upvote (Protected)
Upvote a post.

#### POST /api/forum/:id/comment/:commentId/upvote (Protected)
Upvote a comment.

---

### Recommendations (Protected)

#### GET /api/recommendations
Get personalized recommendations.

**Response:**
```json
{
  "success": true,
  "recommendations": {
    "basedOnHistory": [...],
    "basedOnWishlist": [...],
    "basedOnClass": [...],
    "trending": [...],
    "popular": [...]
  }
}
```

#### GET /api/recommendations/search
Intelligent search.

**Query Parameters:**
- `q` - Search query
- `type` - Search type (all, books, student-books)

---

### Admin (Admin Only)

#### GET /api/admin/stats
Get dashboard statistics.

#### POST /api/admin/books
Create a book.

#### PUT /api/admin/books/:id
Update a book.

#### DELETE /api/admin/books/:id
Delete a book.

#### POST /api/admin/student-books
Create a student book.

#### PUT /api/admin/student-books/:id
Update a student book.

#### DELETE /api/admin/student-books/:id
Delete a student book.

#### GET /api/admin/orders
Get all orders.

#### PUT /api/orders/:id/deliver
Update order delivery status.

**Request Body:**
```json
{
  "status": "Shipped",
  "trackingNumber": "TRK123456"
}
```

---

### Classes

#### GET /api/classes
Get all classes.

#### POST /api/classes (Admin Only)
Create a class.

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [...] // Optional, for validation errors
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Rate Limiting

Currently no rate limiting implemented. Consider adding for production.

## Pagination

Most list endpoints support pagination:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

---

**For more details, check the source code in `backend/routes/`**

