# 📚 Detailed Guide: Steps 3 & 4 - MongoDB Setup & Environment Configuration

## Step 3: Setup MongoDB - Complete Guide

MongoDB is the database that stores all your application data (users, books, orders, etc.). You need to set it up before running the application.

---

## Option A: Local MongoDB Installation (Recommended for Development)

### What is Local MongoDB?
- MongoDB runs on your computer
- No internet required (after installation)
- Free and fast
- Best for development and testing

### Installation Steps by Operating System

#### 🪟 Windows Installation

**Method 1: Using MongoDB Installer (Easiest)**

1. **Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select:
     - Version: Latest (7.0 or higher)
     - Platform: Windows
     - Package: MSI
   - Click "Download"

2. **Install MongoDB:**
   - Run the downloaded `.msi` file
   - Click "Next" through the installation wizard
   - **Important:** Check "Install MongoDB as a Service"
   - Check "Install MongoDB Compass" (optional but helpful)
   - Click "Install"
   - Wait for installation to complete

3. **Verify Installation:**
   - Open Command Prompt (as Administrator)
   - Run:
     ```bash
     mongod --version
     ```
   - You should see version information

4. **Start MongoDB Service:**
   - MongoDB usually starts automatically
   - To manually start:
     ```bash
     # Open Command Prompt as Administrator
     net start MongoDB
     ```
   - To stop:
     ```bash
     net stop MongoDB
     ```

5. **Test Connection:**
   - Open a new Command Prompt
   - Run:
     ```bash
     mongosh
     ```
   - If you see `test>`, MongoDB is working!
   - Type `exit` to leave

**Method 2: Using Chocolatey (If you have it)**

```bash
choco install mongodb
```

#### 🍎 Mac Installation

**Method 1: Using Homebrew (Recommended)**

1. **Install Homebrew (if not installed):**
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Add MongoDB Tap:**
   ```bash
   brew tap mongodb/brew
   ```

3. **Install MongoDB:**
   ```bash
   brew install mongodb-community
   ```

4. **Start MongoDB:**
   ```bash
   brew services start mongodb-community
   ```

5. **Verify:**
   ```bash
   mongosh
   ```
   - Should connect to MongoDB
   - Type `exit` to leave

**Method 2: Using MongoDB Installer**

1. Download from: https://www.mongodb.com/try/download/community
2. Select: macOS, .tgz package
3. Follow installation instructions

#### 🐧 Linux Installation (Ubuntu/Debian)

1. **Import MongoDB GPG Key:**
   ```bash
   curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
   ```

2. **Add MongoDB Repository:**
   ```bash
   echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   ```

3. **Update and Install:**
   ```bash
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

4. **Start MongoDB:**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

5. **Verify:**
   ```bash
   sudo systemctl status mongod
   mongosh
   ```

---

## Option B: MongoDB Atlas (Cloud - Free Tier)

### What is MongoDB Atlas?
- MongoDB hosted in the cloud
- Free tier available (512MB storage)
- No installation needed
- Accessible from anywhere
- Best for production or if you can't install locally

### Step-by-Step Setup

1. **Create Account:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with email or Google account
   - Verify your email

2. **Create Organization:**
   - Enter organization name (e.g., "My Projects")
   - Select "I'm just exploring" or your use case
   - Click "Next"

3. **Create Project:**
   - Enter project name (e.g., "BookHub")
   - Click "Next"

4. **Create Free Cluster:**
   - Click "Build a Database"
   - Select "FREE" (M0) tier
   - Choose a cloud provider (AWS recommended)
   - Select a region closest to you
   - Cluster name: Leave default or change
   - Click "Create"

5. **Create Database User:**
   - Username: Create a username (e.g., "bookhubuser")
   - Password: Create a strong password (SAVE THIS!)
   - Click "Create User"

6. **Network Access:**
   - Click "Add My Current IP Address" (for development)
   - OR Click "Allow Access from Anywhere" (0.0.0.0/0) - Less secure but easier
   - Click "Finish and Close"

7. **Get Connection String:**
   - Click "Connect" button on your cluster
   - Select "Connect your application"
   - Choose "Node.js" and version "5.5 or later"
   - Copy the connection string
   - It looks like:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - **Important:** Replace `<username>` and `<password>` with your database user credentials
   - Add database name at the end: `...mongodb.net/bookhub2?retryWrites=true&w=majority`

8. **Save Your Connection String:**
   - You'll use this in Step 4 (the .env file)

---

## Option C: Docker (Advanced)

If you have Docker installed:

```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

This starts MongoDB in a Docker container.

---

## Step 4: Create Backend .env File - Complete Guide

The `.env` file stores configuration settings for your backend server. It's like a settings file that tells your application how to connect to the database and what keys to use.

### What is a .env file?
- Environment variables file
- Contains sensitive and configuration data
- Never committed to Git (for security)
- Each environment (dev/prod) has its own

---

## Detailed Steps to Create .env File

### Step 4.1: Navigate to Backend Folder

**Using File Explorer (Windows):**
1. Open File Explorer
2. Navigate to: `C:\Users\Navya P\Downloads\BookHub_2.0\backend`
3. You should see files like: `server.js`, `package.json`, `models`, etc.

**Using Command Line:**
```bash
cd "C:\Users\Navya P\Downloads\BookHub_2.0\backend"
```

### Step 4.2: Create .env File

#### Method 1: Using Notepad (Windows - Easiest)

1. **Open Notepad:**
   - Press `Windows + R`
   - Type `notepad`
   - Press Enter

2. **Copy this content into Notepad:**
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

3. **Save the file:**
   - Click "File" → "Save As"
   - Navigate to: `C:\Users\Navya P\Downloads\BookHub_2.0\backend`
   - **Important:** In "Save as type", select "All Files (*.*)"
   - File name: `.env` (just `.env`, nothing else)
   - Click "Save"
   - **Note:** The file might appear invisible - that's normal!

#### Method 2: Using VS Code

1. Open VS Code
2. Open the `backend` folder
3. Click "New File" icon
4. Name it `.env`
5. Paste the content above
6. Save (Ctrl+S)

#### Method 3: Using Command Line

**Windows (PowerShell):**
```powershell
cd "C:\Users\Navya P\Downloads\BookHub_2.0\backend"
New-Item -Path .env -ItemType File
notepad .env
```
Then paste the content and save.

**Mac/Linux:**
```bash
cd backend
touch .env
nano .env
# or
vim .env
```
Paste content, save and exit.

---

## Step 4.3: Understanding Each Environment Variable

Let's break down what each line means:

### `PORT=5000`
- **What it does:** Sets the port number for your backend server
- **Why:** Your backend API will run on http://localhost:5000
- **Can change?** Yes, if 5000 is busy, use 5001, 5002, etc.
- **Example:** `PORT=5001`

### `MONGODB_URI=mongodb://localhost:27017/bookhub2`
- **What it does:** Connection string to your MongoDB database
- **Breaking it down:**
  - `mongodb://` - Protocol
  - `localhost` - Database server (your computer)
  - `27017` - MongoDB default port
  - `bookhub2` - Database name (will be created automatically)
  
- **For Local MongoDB:** Keep as is
- **For MongoDB Atlas:** Replace with your Atlas connection string
  ```
  MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bookhub2?retryWrites=true&w=majority
  ```
  - Replace `username` with your Atlas database username
  - Replace `password` with your Atlas database password
  - Replace `cluster0.xxxxx` with your actual cluster address

### `JWT_SECRET=your_super_secret_jwt_key_change_this_12345`
- **What it does:** Secret key for encrypting authentication tokens
- **Why:** Used to sign JWT tokens for user authentication
- **Important:** 
  - Change this to a random string
  - Keep it secret (never share)
  - Use a long, random string for production
- **Generate a secure one:**
  ```bash
  # In Node.js
  require('crypto').randomBytes(64).toString('hex')
  ```
- **Example:** `JWT_SECRET=a8f5f167f44f4964e6c998dee827110c1234567890abcdef1234567890abcdef`

### `JWT_EXPIRE=7d`
- **What it does:** How long authentication tokens last
- **Options:**
  - `7d` - 7 days
  - `30d` - 30 days
  - `1h` - 1 hour
  - `24h` - 24 hours
- **Recommendation:** `7d` for development, shorter for production

### `CLIENT_URL=http://localhost:3000`
- **What it does:** URL of your frontend application
- **Why:** Used for CORS (Cross-Origin Resource Sharing)
- **For development:** Keep as is
- **For production:** Change to your domain
  ```
  CLIENT_URL=https://yourdomain.com
  ```

### `RAZORPAY_KEY_ID=rzp_test_key`
- **What it does:** Razorpay payment gateway key ID
- **For testing:** Use `rzp_test_key` (fake key for development)
- **For production:** Get real keys from Razorpay dashboard
  - Sign up at: https://razorpay.com
  - Go to Settings → API Keys
  - Copy Key ID

### `RAZORPAY_KEY_SECRET=rzp_test_secret`
- **What it does:** Razorpay payment gateway secret key
- **For testing:** Use `rzp_test_secret` (fake key for development)
- **For production:** Get real secret from Razorpay dashboard
  - **Important:** Never share this key!

### `NODE_ENV=development`
- **What it does:** Sets the environment mode
- **Options:**
  - `development` - For local development
  - `production` - For live server
- **Why:** Different settings for dev vs production

---

## Step 4.4: Customizing for Your Setup

### If Using MongoDB Atlas:

Replace the `MONGODB_URI` line with your Atlas connection string:

```env
MONGODB_URI=
```

**How to get it:**
1. Go to MongoDB Atlas dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials
6. Add `/bookhub2` before the `?` for database name

### If Port 5000 is Busy:

```env
PORT=5001
```

And update `CLIENT_URL` if needed (usually not necessary).

### For Production:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookhub2?retryWrites=true&w=majority
JWT_SECRET=your_very_long_random_secret_key_here
JWT_EXPIRE=1d
CLIENT_URL=https://yourdomain.com
RAZORPAY_KEY_ID=rzp_live_your_real_key
RAZORPAY_KEY_SECRET=your_real_secret
NODE_ENV=production
```

---

## Step 4.5: Verify .env File is Created

### Check if file exists:

**Using File Explorer:**
- Go to `backend` folder
- Enable "Show hidden files" (View → Show → Hidden items)
- You should see `.env` file

**Using Command Line:**
```bash
cd backend
dir .env    # Windows
ls -la .env # Mac/Linux
```

**Using VS Code:**
- Open backend folder in VS Code
- You should see `.env` in the file list

---

## Step 4.6: Common Mistakes to Avoid

### ❌ Wrong File Name
- ❌ `.env.txt` - Wrong! Has .txt extension
- ❌ `env` - Wrong! Missing the dot
- ❌ `env.txt` - Wrong!
- ✅ `.env` - Correct!

### ❌ Wrong Location
- ❌ In root folder - Wrong!
- ❌ In frontend folder - Wrong!
- ✅ In backend folder - Correct!

### ❌ Wrong Format
- ❌ Spaces around `=` sign
  ```
  PORT = 5000  ❌
  ```
- ✅ No spaces
  ```
  PORT=5000  ✅
  ```

### ❌ Quotes Around Values
- ❌ `PORT="5000"` - Usually works but not needed
- ✅ `PORT=5000` - Preferred

### ❌ Comments in Wrong Format
- ❌ `# This is a comment PORT=5000` - Wrong!
- ✅ Use `#` on separate line:
  ```
  # This is a comment
  PORT=5000
  ```

---

## Step 4.7: Test Your Configuration

After creating `.env` file, test it:

1. **Go back to root directory:**
   ```bash
   cd ..
   ```

2. **Test MongoDB connection:**
   ```bash
   npm run check-db
   ```

3. **Expected output:**
   ```
   ✅ MongoDB connection successful!
   📊 Database: bookhub2
   ```

4. **If you see errors:**
   - Check MongoDB is running
   - Verify `MONGODB_URI` is correct
   - Check `.env` file is in the right location
   - Ensure no typos in variable names

---

## Quick Reference: Complete .env Template

### For Local MongoDB:
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

### For MongoDB Atlas:
```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/bookhub2?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_12345
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
RAZORPAY_KEY_ID=rzp_test_key
RAZORPAY_KEY_SECRET=rzp_test_secret
NODE_ENV=development
```

**Remember to replace:**
- `YOUR_USERNAME` with your Atlas username
- `YOUR_PASSWORD` with your Atlas password
- `cluster0.xxxxx` with your actual cluster address

---

## Troubleshooting

### Problem: Can't see .env file
**Solution:** Enable "Show hidden files" in File Explorer

### Problem: File saves as .env.txt
**Solution:** 
- When saving, select "All Files" in file type dropdown
- Or rename after saving: remove .txt extension

### Problem: MongoDB connection fails
**Solutions:**
1. Check MongoDB is running
2. Verify MONGODB_URI is correct
3. For Atlas: Check network access settings
4. For Atlas: Verify username/password are correct

### Problem: "Cannot find module" errors
**Solution:** Make sure you're in the backend folder when creating .env

---

## Next Steps

After completing Steps 3 & 4:
1. ✅ MongoDB is installed and running
2. ✅ .env file is created in backend folder
3. ✅ All environment variables are set

**Continue to Step 5:** Test MongoDB connection with `npm run check-db`

---

**Need more help?** Check the main [RUN_PROJECT.md](RUN_PROJECT.md) guide!

