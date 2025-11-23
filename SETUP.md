# BookHub 2.0 Setup Guide

## Quick Start

### 1. Install Dependencies

From the root directory:
```bash
npm run install-all
```

Or install separately:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Setup MongoDB

Make sure MongoDB is running on your system. You can:
- Install MongoDB locally
- Use MongoDB Atlas (cloud)
- Use Docker: `docker run -d -p 27017:27017 mongo`

### 3. Configure Environment Variables

#### Backend (.env)
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookhub2
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

#### Frontend (.env)
Create `frontend/.env` (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 4. Start the Application

#### Option 1: Run Both Servers Together
From root directory:
```bash
npm run dev
```

#### Option 2: Run Separately

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

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Creating Your First Admin User

1. Register a new user through the registration page
2. Connect to MongoDB and update the user's role:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

Or use MongoDB Compass/Studio 3T to manually update the role field.

## Testing Payment Integration

For Razorpay testing:
1. Sign up at https://razorpay.com
2. Get test API keys from the dashboard
3. Use test card: 4111 1111 1111 1111
4. Use any future expiry date and any CVV

## Sample Data

You can add books through:
1. Admin Dashboard (after creating admin user)
2. Direct API calls using Postman/curl
3. MongoDB import scripts (create as needed)

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in .env
- Verify MongoDB port (default: 27017)

### Port Already in Use
- Change PORT in backend/.env
- Update CLIENT_URL if needed
- Update REACT_APP_API_URL in frontend/.env

### CORS Issues
- Ensure CLIENT_URL in backend/.env matches frontend URL
- Check backend server.js CORS configuration

### Razorpay Not Working
- Verify API keys are correct
- Check Razorpay script is loading in browser console
- Ensure you're using test keys for development

## Production Deployment

1. Set NODE_ENV=production
2. Use strong JWT_SECRET
3. Configure proper MongoDB connection
4. Set up SSL certificates
5. Configure environment variables on hosting platform
6. Build frontend: `cd frontend && npm run build`
7. Serve build folder with a web server (nginx, etc.)

## Next Steps

- Add more sample books through admin panel
- Customize UI colors and branding
- Add email notifications
- Implement file uploads for book covers
- Add more payment gateways
- Set up analytics

