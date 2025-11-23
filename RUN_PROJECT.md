# 🚀 How to Run BookHub 2.0 - Step by Step Guide

Follow these steps in order to get your project running!

## 📋 Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js installed (v14 or higher)
- ✅ npm installed (comes with Node.js)
- ✅ MongoDB installed OR MongoDB Atlas account

**Check if you have Node.js:**
```bash
node --version
npm --version
```

If not installed, download from: https://nodejs.org/

---

## Step 1: Setup MongoDB

### Option A: Local MongoDB (Recommended for Development)

**Windows:**
1. Download MongoDB from: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. MongoDB usually starts automatically as a service
4. Verify it's running:
   ```bash
   # Open Command Prompt as Administrator
   net start MongoDB
   ```

**Mac:**
```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Option B: MongoDB Atlas (Cloud - Free)

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string (you'll use this in Step 3)

---

## Step 2: Navigate to Project Directory

Open your terminal/command prompt and navigate to the project:

```bash
cd "C:\Users\Navya P\Downloads\BookHub_2.0"
```

Or if you're in a different location:
```bash
cd path/to/BookHub_2.0
```

---

## Step 3: Install Dependencies

### Install All Dependencies (Root, Backend, Frontend)

```bash
npm run install-all
```

This will install dependencies for:
- Root package.json
- Backend (Express, MongoDB, etc.)
- Frontend (React, Tailwind, etc.)

**If the above doesn't work, install separately:**

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

**Wait for installation to complete** (this may take 2-5 minutes)

---

## Step 4: Configure Environment Variables

> 📖 **For extremely detailed instructions with all options explained, see [DETAILED_SETUP_STEPS_3_4.md](DETAILED_SETUP_STEPS_3_4.md)**

### Backend Configuration

1. Navigate to backend folder:
```bash
cd backend
```

2. Create `.env` file:
   - **Windows:** Create a new file named `.env` (no extension)
   - **Mac/Linux:** `touch .env`

3. Open `.env` file and add this content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookhub2
JWT_SECRET=your_super_secret_jwt_key_change_this_12345
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
RAZORPAY_KEY_ID=rzp_test_key
RAZORPAY_KEY_SECRET=rzp_test_secret
NODE_ENV=development
```

**If using MongoDB Atlas**, replace `MONGODB_URI` with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookhub2?retryWrites=true&w=majority
```

4. Save the file

5. Go back to root:
```bash
cd ..
```

### Frontend Configuration (Optional)

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Create `.env` file (same way as above)

3. Add this content:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=rzp_test_key
```

4. Save and go back:
```bash
cd ..
```

---

## Step 5: Verify MongoDB Connection

Test if MongoDB is accessible:

```bash
npm run check-db
```

**Expected Output:**
```
✅ MongoDB connection successful!
📊 Database: bookhub2
```

**If you see an error:**
- Make sure MongoDB is running
- Check your MONGODB_URI in `.env`
- For local MongoDB, ensure it's started

---

## Step 6: Seed Database (Add Sample Data)

This adds sample books and student books to your database:

```bash
npm run seed
```

**Expected Output:**
```
✅ Database seeded successfully!
📚 8 books added
📖 8 student books added
🎓 15 classes added
```

**Note:** You can skip this step, but it's recommended to have sample data to test with.

---

## Step 7: Create Admin User

Create an admin account to access the admin dashboard:

```bash
npm run create-admin admin@bookhub.com admin123 "Admin User"
```

**Expected Output:**
```
✅ Admin user created successfully!
📧 Email: admin@bookhub.com
🔑 Password: admin123
```

**You can also create your own:**
```bash
npm run create-admin your-email@example.com yourpassword "Your Name"
```

---

## Step 8: Start the Application

### Option A: Start Both Servers Together (Recommended)

From the root directory:

```bash
npm run dev
```

This starts:
- Backend server on http://localhost:5000
- Frontend server on http://localhost:3000

**Expected Output:**
```
[0] MongoDB Connected
[0] Server running on port 5000
[1] Compiled successfully!
[1] webpack compiled with 0 warnings
```

### Option B: Start Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

---

## Step 9: Access the Application

### Open in Browser

1. **Frontend (Main Application):**
   - Open: http://localhost:3000
   - You should see the BookHub homepage

2. **Backend API:**
   - Health Check: http://localhost:5000/api/health
   - Should return: `{"status":"ok",...}`

3. **Admin Dashboard:**
   - Login with admin credentials
   - Go to: http://localhost:3000/admin

---

## Step 10: Test the Application

### 1. Register a New User
- Go to http://localhost:3000/register
- Fill in the form
- Click "Create account"

### 2. Browse Books
- Click "Books" in navbar
- Use filters to search
- Click on a book to see details

### 3. Test Shopping Cart
- Add books to cart
- Go to Cart page
- Proceed to checkout

### 4. Access Admin Panel
- Login with admin credentials
- Go to `/admin`
- Try adding/editing books

---

## 🐛 Troubleshooting

### Problem: "MongoDB connection failed"

**Solutions:**
1. Check if MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   brew services start mongodb-community
   # or
   sudo systemctl start mongod
   ```

2. Verify MONGODB_URI in `backend/.env`
3. For MongoDB Atlas, check your connection string
4. Run: `npm run check-db` to test connection

### Problem: "Port 5000 already in use"

**Solution:**
1. Change PORT in `backend/.env` to another number (e.g., 5001)
2. Update `CLIENT_URL` if needed
3. Update `REACT_APP_API_URL` in frontend `.env`

### Problem: "Port 3000 already in use"

**Solution:**
- React will automatically ask to use port 3001
- Or kill the process:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

### Problem: "Cannot find module" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json

# Reinstall
npm run install-all
```

### Problem: Frontend shows "Network Error"

**Solution:**
1. Check if backend is running (http://localhost:5000/api/health)
2. Verify `REACT_APP_API_URL` in `frontend/.env`
3. Check CORS settings in backend

### Problem: "JWT_SECRET" error

**Solution:**
- Make sure `backend/.env` file exists
- Verify JWT_SECRET is set in `.env`
- Restart the backend server

---

## ✅ Verification Checklist

Before considering setup complete, verify:

- [ ] MongoDB is running and connected
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:5000/api/health
- [ ] Can register a new user
- [ ] Can login with admin credentials
- [ ] Can browse books
- [ ] Admin dashboard is accessible

---

## 🎯 Quick Reference Commands

```bash
# Check MongoDB connection
npm run check-db

# Seed database with sample data
npm run seed

# Create admin user
npm run create-admin email@example.com password "Name"

# Start both servers
npm run dev

# Start backend only
cd backend && npm run dev

# Start frontend only
cd frontend && npm start
```

---

## 📝 Next Steps After Running

1. **Explore Features:**
   - Browse books
   - Add to cart
   - Write reviews
   - Join forum discussions

2. **Test Admin Panel:**
   - Add new books
   - Manage orders
   - View statistics

3. **Customize:**
   - Update colors in `frontend/tailwind.config.js`
   - Add your branding
   - Modify sample data

---

## 🆘 Still Having Issues?

1. **Check Logs:**
   - Backend: Look at terminal where backend is running
   - Frontend: Check browser console (F12)

2. **Verify Files:**
   - Ensure `.env` files exist in both backend and frontend
   - Check all dependencies are installed

3. **Common Issues:**
   - MongoDB not running → Start MongoDB service
   - Port conflicts → Change ports in `.env`
   - Missing dependencies → Run `npm run install-all` again

---

## 🎉 Success!

If you can see the BookHub homepage at http://localhost:3000, you're all set! 

**Happy Coding! 🚀**

