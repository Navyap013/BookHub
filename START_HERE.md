# 🚀 BookHub 2.0 - Start Here!

Welcome to **BookHub 2.0** - Your complete full-stack bookstore and student learning platform!

> 📖 **For detailed step-by-step instructions, see [RUN_PROJECT.md](RUN_PROJECT.md)**

## ⚡ Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Setup MongoDB
- Install MongoDB locally, OR
- Use MongoDB Atlas (cloud), OR
- Use Docker: `docker run -d -p 27017:27017 mongo`

### 3. Configure Environment

**Backend** (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookhub2
JWT_SECRET=your_super_secret_jwt_key_12345
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
RAZORPAY_KEY_ID=rzp_test_key
RAZORPAY_KEY_SECRET=rzp_test_secret
```

**Frontend** (`frontend/.env` - optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=rzp_test_key
```

### 4. Seed Database (Optional but Recommended)
```bash
npm run seed
```

### 5. Create Admin User
```bash
npm run create-admin admin@bookhub.com admin123 "Admin User"
```

### 6. Start Application
```bash
npm run dev
```

### 7. Access Application
- 🌐 Frontend: http://localhost:3000
- 🔌 Backend API: http://localhost:5000/api
- ❤️ Health Check: http://localhost:5000/api/health

## 📚 Documentation

| Document | Description |
|---------|-------------|
| [QUICK_START.md](QUICK_START.md) | Detailed quick start guide |
| [SETUP.md](SETUP.md) | Complete setup instructions |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | Full API reference |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment guide |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Codebase organization |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute |
| [README.md](README.md) | Main documentation |

## 🎯 What You Can Do

### As a User
- ✅ Browse and search books
- ✅ Add to cart and checkout
- ✅ Write reviews and ratings
- ✅ Save favourites
- ✅ Join forum discussions

### As a Student
- ✅ Access student library (Pre-KG to Class 12)
- ✅ Visit colorful Pre-KG Zone
- ✅ Track reading progress
- ✅ Get academic recommendations

### As an Admin
- ✅ Manage books and student books
- ✅ View and update orders
- ✅ See dashboard statistics
- ✅ Full CRUD operations

## 🛠️ Useful Commands

```bash
# Check MongoDB connection
npm run check-db

# Seed database
npm run seed

# Create admin user
npm run create-admin [email] [password] [name]

# Start development
npm run dev

# Build for production
npm run build
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check connection
npm run check-db

# Ensure MongoDB is running
# Windows: net start MongoDB
# Mac/Linux: sudo systemctl start mongod
```

### Port Already in Use
- Change `PORT` in `backend/.env`
- Or kill process: `lsof -ti:5000 | xargs kill`

### CORS Errors
- Verify `CLIENT_URL` in backend `.env`
- Ensure it matches frontend URL

## 📖 Next Steps

1. **Explore the Application**
   - Register a new account
   - Browse books
   - Test all features

2. **Customize**
   - Update colors in `tailwind.config.js`
   - Add your branding
   - Modify sample data

3. **Deploy**
   - Follow [DEPLOYMENT.md](DEPLOYMENT.md)
   - Set up production environment
   - Configure domain and SSL

## 🎉 Features

- ✅ Complete authentication system
- ✅ Book browsing with filters
- ✅ Shopping cart and checkout
- ✅ Payment integration (Razorpay)
- ✅ Order management
- ✅ Reviews and ratings
- ✅ Discussion forum
- ✅ Student library
- ✅ Pre-KG Zone
- ✅ Admin dashboard
- ✅ AI recommendations
- ✅ Real-time updates

## 💡 Tips

- Use the search bar for quick book search
- Filter books by category, price, language
- Join reading clubs in the forum
- Check personalized recommendations
- Admin can manage everything from dashboard

## 🆘 Need Help?

- Check [QUICK_START.md](QUICK_START.md) for setup help
- Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
- See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment issues
- Open an issue on GitHub for bugs

---

**Ready to start? Run `npm run install-all` and follow the steps above!** 🚀

**Happy Coding! 🎉**

