# BookHub 2.0 - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Setup MongoDB

**Option A: Local MongoDB**
- Install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service
- Default connection: `mongodb://localhost:27017/bookhub2`

**Option B: MongoDB Atlas (Cloud)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string
- Update `MONGODB_URI` in `backend/.env`

### Step 3: Configure Environment

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookhub2
JWT_SECRET=your_super_secret_jwt_key_12345
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
RAZORPAY_KEY_ID=rzp_test_key
RAZORPAY_KEY_SECRET=rzp_test_secret
```

### Step 4: Seed Sample Data (Optional but Recommended)

```bash
cd backend
npm run seed
```

This will add:
- 8 sample books
- 8 sample student books (including Pre-KG books)
- 15 class definitions

### Step 5: Start the Application

**Option A: Run Both Servers Together**
```bash
# From root directory
npm run dev
```

**Option B: Run Separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

### Step 6: Access the Application

- 🌐 Frontend: http://localhost:3000
- 🔌 Backend API: http://localhost:5000/api

### Step 7: Create Your First Admin User

1. Go to http://localhost:3000/register
2. Register a new account
3. Open MongoDB Compass or use MongoDB shell
4. Find your user and update role to "admin":
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

Or use MongoDB Compass GUI to edit the user document.

## 🎯 Test the Application

### As a Regular User:
1. Browse books at `/books`
2. View book details
3. Add books to cart
4. Add to favourites
5. Write reviews

### As a Student:
1. Register with role "student"
2. Set your class in profile
3. Browse Student Library
4. Visit Pre-KG Zone
5. Track reading progress

### As an Admin:
1. Access `/admin` dashboard
2. Add/edit/delete books
3. Manage student books
4. View and update orders
5. See statistics

## 🔧 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### Port Already in Use
- Change `PORT` in `backend/.env`
- Or kill the process using the port

### CORS Errors
- Ensure `CLIENT_URL` in backend `.env` matches frontend URL
- Check backend `server.js` CORS configuration

### Razorpay Payment
- For testing, use test keys from Razorpay dashboard
- Test card: 4111 1111 1111 1111
- Any future expiry date and CVV

## 📚 Next Steps

1. **Customize**: Update colors, branding in Tailwind config
2. **Add Books**: Use admin panel to add more books
3. **Configure Payment**: Add real Razorpay keys for production
4. **Deploy**: Follow deployment guide for production setup

## 🎨 Features to Explore

- ✅ Book browsing with advanced filters
- ✅ Student library (Pre-KG to Class 12)
- ✅ Pre-KG Zone with colorful interface
- ✅ Shopping cart and checkout
- ✅ Order management
- ✅ Reviews and ratings
- ✅ Favourites/Wishlist
- ✅ Discussion forum
- ✅ AI recommendations
- ✅ Admin dashboard

## 💡 Tips

- Use the search bar in navbar for quick book search
- Filter books by category, price, language
- Join reading clubs in the forum
- Check recommendations based on your activity
- Admin can manage everything from dashboard

Enjoy exploring BookHub 2.0! 🎉

