# BookHub 2.0 - Project Structure

## 📁 Directory Structure

```
BookHub_2.0/
│
├── backend/                          # Backend Server (Node.js/Express)
│   ├── models/                       # MongoDB Models
│   │   ├── User.js                   # User model with student profile
│   │   ├── Book.js                   # General books model
│   │   ├── StudentBook.js            # Student-specific books
│   │   ├── Review.js                 # Book reviews
│   │   ├── Order.js                  # Order management
│   │   ├── Cart.js                   # Shopping cart
│   │   ├── Favourite.js              # Wishlist/favourites
│   │   ├── ForumPost.js              # Forum posts
│   │   └── Class.js                  # Class definitions
│   │
│   ├── routes/                       # API Routes
│   │   ├── auth.js                   # Authentication routes
│   │   ├── books.js                  # Book CRUD operations
│   │   ├── studentBooks.js           # Student book routes
│   │   ├── cart.js                   # Cart management
│   │   ├── orders.js                 # Order processing
│   │   ├── reviews.js                # Review system
│   │   ├── favourites.js            # Favourites management
│   │   ├── forum.js                  # Forum/discussion routes
│   │   ├── recommendations.js        # AI recommendations
│   │   ├── admin.js                  # Admin operations
│   │   └── classes.js                # Class management
│   │
│   ├── middleware/                   # Express Middleware
│   │   └── auth.js                   # JWT authentication & authorization
│   │
│   ├── utils/                        # Utility Functions
│   │   └── generateToken.js          # JWT token generation
│   │
│   ├── scripts/                      # Utility Scripts
│   │   ├── seedData.js               # Database seeding
│   │   └── createAdmin.js            # Admin user creation
│   │
│   ├── server.js                     # Express server entry point
│   ├── package.json                  # Backend dependencies
│   └── .env                          # Environment variables (create this)
│
├── frontend/                          # Frontend App (React)
│   ├── public/                       # Static Files
│   │   └── index.html                # HTML template
│   │
│   ├── src/
│   │   ├── components/               # React Components
│   │   │   ├── layout/               # Layout components
│   │   │   │   ├── Navbar.js         # Navigation bar
│   │   │   │   └── Footer.js         # Footer component
│   │   │   │
│   │   │   ├── routing/              # Route protection
│   │   │   │   ├── PrivateRoute.js   # Protected routes
│   │   │   │   └── AdminRoute.js     # Admin-only routes
│   │   │   │
│   │   │   └── common/               # Common components
│   │   │       ├── LoadingSpinner.js # Loading indicator
│   │   │       └── ErrorBoundary.js  # Error handling
│   │   │
│   │   ├── pages/                    # Page Components
│   │   │   ├── Home.js               # Homepage
│   │   │   │
│   │   │   ├── auth/                 # Authentication
│   │   │   │   ├── Login.js          # Login page
│   │   │   │   └── Register.js       # Registration page
│   │   │   │
│   │   │   ├── books/                # Book pages
│   │   │   │   ├── BookBrowse.js     # Book listing with filters
│   │   │   │   └── BookDetails.js    # Book detail page
│   │   │   │
│   │   │   ├── student/              # Student pages
│   │   │   │   ├── StudentLibrary.js # Student book library
│   │   │   │   ├── PreKGZone.js      # Pre-KG special zone
│   │   │   │   └── StudentProfile.js # Student profile
│   │   │   │
│   │   │   ├── cart/                 # Shopping cart
│   │   │   │   └── Cart.js           # Cart page
│   │   │   │
│   │   │   ├── checkout/             # Checkout
│   │   │   │   └── Checkout.js       # Checkout page
│   │   │   │
│   │   │   ├── orders/               # Orders
│   │   │   │   ├── Orders.js         # Order list
│   │   │   │   └── OrderDetails.js   # Order details
│   │   │   │
│   │   │   ├── favourites/           # Favourites
│   │   │   │   └── Favourites.js     # Favourites page
│   │   │   │
│   │   │   ├── forum/                # Forum
│   │   │   │   ├── Forum.js          # Forum listing
│   │   │   │   └── ForumPost.js      # Individual post
│   │   │   │
│   │   │   └── admin/                # Admin pages
│   │   │       ├── AdminDashboard.js # Admin dashboard
│   │   │       ├── AdminBooks.js     # Book management
│   │   │       ├── AdminStudentBooks.js # Student book management
│   │   │       └── AdminOrders.js    # Order management
│   │   │
│   │   ├── context/                  # React Context
│   │   │   └── AuthContext.js       # Authentication context
│   │   │
│   │   ├── utils/                    # Utilities
│   │   │   └── api.js                # API client (Axios)
│   │   │
│   │   ├── App.js                    # Main App component
│   │   ├── index.js                  # React entry point
│   │   └── index.css                 # Global styles
│   │
│   ├── package.json                  # Frontend dependencies
│   ├── tailwind.config.js           # Tailwind CSS config
│   └── postcss.config.js            # PostCSS config
│
├── .gitignore                        # Git ignore rules
├── package.json                      # Root package.json
├── README.md                         # Main documentation
├── SETUP.md                          # Setup instructions
├── QUICK_START.md                    # Quick start guide
└── PROJECT_STRUCTURE.md              # This file

```

## 🔑 Key Files Explained

### Backend

**server.js**
- Express server setup
- MongoDB connection
- Socket.io initialization
- Route mounting
- Middleware configuration

**models/**
- Define MongoDB schemas
- Include validation
- Define relationships
- Index definitions for performance

**routes/**
- Handle HTTP requests
- Business logic
- Input validation
- Response formatting
- Error handling

**middleware/auth.js**
- JWT token verification
- Role-based access control
- User authentication

### Frontend

**App.js**
- Main application component
- Route definitions
- Global providers
- Error boundary

**context/AuthContext.js**
- User authentication state
- Login/logout functions
- User profile management

**components/layout/**
- Reusable layout components
- Navigation
- Footer

**pages/**
- Page-level components
- Route-specific views
- Business logic per page

## 🔄 Data Flow

1. **User Action** → Frontend Component
2. **API Call** → Axios (api.js)
3. **HTTP Request** → Backend Route
4. **Middleware** → Authentication Check
5. **Controller** → Business Logic
6. **Model** → Database Operation
7. **Response** → Frontend Update

## 📊 Database Schema

### Collections:
- `users` - User accounts (user, student, admin)
- `books` - General books
- `studentbooks` - Academic books
- `reviews` - Book reviews
- `orders` - Purchase orders
- `carts` - Shopping carts
- `favourites` - Wishlist items
- `forumposts` - Forum discussions
- `classes` - Class definitions

## 🎯 Feature Locations

| Feature | Backend Route | Frontend Page |
|---------|--------------|---------------|
| Authentication | `/api/auth/*` | `/login`, `/register` |
| Books | `/api/books/*` | `/books`, `/books/:id` |
| Student Books | `/api/student-books/*` | `/student-library` |
| Pre-KG Zone | `/api/student-books/prekg/*` | `/prekg-zone` |
| Cart | `/api/cart/*` | `/cart` |
| Orders | `/api/orders/*` | `/orders`, `/checkout` |
| Reviews | `/api/reviews/*` | Book detail page |
| Favourites | `/api/favourites/*` | `/favourites` |
| Forum | `/api/forum/*` | `/forum` |
| Admin | `/api/admin/*` | `/admin/*` |

## 🛠️ Development Workflow

1. **Backend Development**
   - Add models in `backend/models/`
   - Create routes in `backend/routes/`
   - Add middleware if needed
   - Test with Postman/curl

2. **Frontend Development**
   - Create components in `frontend/src/components/`
   - Add pages in `frontend/src/pages/`
   - Update routes in `App.js`
   - Style with Tailwind CSS

3. **Database Changes**
   - Update models
   - Run migrations if needed
   - Update seed data

## 📝 Notes

- All API routes are prefixed with `/api`
- Frontend uses React Router for navigation
- Authentication uses JWT tokens
- Real-time features use Socket.io
- Payment processing via Razorpay
- All images use URLs (can be extended to file uploads)

