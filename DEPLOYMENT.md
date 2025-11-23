# BookHub 2.0 - Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Node.js 14+ installed on server
- MongoDB instance (local or cloud)
- Domain name (optional)
- SSL certificate (for HTTPS)
- PM2 or similar process manager (recommended)

## 📦 Backend Deployment

### Option 1: Traditional Server (VPS/Cloud)

1. **Prepare Server**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB (if using local)
# Or use MongoDB Atlas (cloud)
```

2. **Clone and Setup**
```bash
git clone <your-repo-url>
cd BookHub_2.0/backend
npm install --production
```

3. **Configure Environment**
```bash
# Create .env file
nano .env
```

```env
PORT=5000
MONGODB_URI=mongodb://your-mongodb-uri
JWT_SECRET=your_very_strong_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=https://yourdomain.com
RAZORPAY_KEY_ID=your_production_razorpay_key
RAZORPAY_KEY_SECRET=your_production_razorpay_secret
NODE_ENV=production
```

4. **Install PM2**
```bash
npm install -g pm2
```

5. **Start Application**
```bash
pm2 start server.js --name bookhub-backend
pm2 save
pm2 startup
```

6. **Setup Nginx Reverse Proxy**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. **Setup SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

### Option 2: Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login and Create App**
```bash
heroku login
heroku create bookhub-backend
```

3. **Set Environment Variables**
```bash
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
heroku config:set CLIENT_URL=https://yourdomain.com
heroku config:set RAZORPAY_KEY_ID=your_key
heroku config:set RAZORPAY_KEY_SECRET=your_secret
```

4. **Deploy**
```bash
git push heroku main
```

### Option 3: Docker

1. **Create Dockerfile**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

2. **Build and Run**
```bash
docker build -t bookhub-backend .
docker run -d -p 5000:5000 --env-file .env bookhub-backend
```

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd frontend
vercel
```

3. **Set Environment Variables**
- Go to Vercel dashboard
- Add environment variables:
  - `REACT_APP_API_URL=https://api.yourdomain.com/api`
  - `REACT_APP_RAZORPAY_KEY_ID=your_key`

### Option 2: Netlify

1. **Build Project**
```bash
cd frontend
npm run build
```

2. **Deploy**
- Drag and drop `build` folder to Netlify
- Or use Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

3. **Set Environment Variables**
- In Netlify dashboard → Site settings → Environment variables

### Option 3: Traditional Server

1. **Build Project**
```bash
cd frontend
npm run build
```

2. **Copy Build Files**
```bash
# Copy build folder to server
scp -r build/* user@server:/var/www/bookhub
```

3. **Setup Nginx**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/bookhub;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
    }
}
```

## 🔒 Security Checklist

- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Set secure CORS origins
- [ ] Use environment variables (never commit .env)
- [ ] Enable MongoDB authentication
- [ ] Use production Razorpay keys
- [ ] Set up rate limiting
- [ ] Enable MongoDB backups
- [ ] Use PM2 or similar for process management
- [ ] Set up monitoring and logging
- [ ] Regular security updates

## 📊 Monitoring

### PM2 Monitoring
```bash
pm2 monit
pm2 logs
pm2 status
```

### Health Check
```bash
curl https://api.yourdomain.com/api/health
```

## 🔄 Updates and Maintenance

1. **Pull Latest Changes**
```bash
git pull origin main
```

2. **Update Dependencies**
```bash
npm install
npm audit fix
```

3. **Restart Application**
```bash
pm2 restart bookhub-backend
```

## 🗄️ Database Backup

### MongoDB Backup
```bash
# Backup
mongodump --uri="mongodb://your-uri" --out=/backup/$(date +%Y%m%d)

# Restore
mongorestore --uri="mongodb://your-uri" /backup/20240101
```

### Automated Backup (Cron)
```bash
# Add to crontab
0 2 * * * mongodump --uri="mongodb://your-uri" --out=/backup/$(date +\%Y\%m\%d)
```

## 🌍 Environment-Specific Configs

### Development
- Hot reload enabled
- Detailed error messages
- CORS allows localhost

### Production
- Error messages sanitized
- CORS restricted to domain
- Performance optimizations
- Logging enabled

## 📈 Performance Optimization

1. **Enable Gzip Compression**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

2. **CDN for Static Assets**
- Use Cloudflare or similar
- Cache static files

3. **Database Indexing**
- Ensure indexes on frequently queried fields
- Monitor slow queries

4. **Image Optimization**
- Use WebP format
- Implement lazy loading
- Use CDN for images

## 🐛 Troubleshooting

### Application Won't Start
- Check MongoDB connection
- Verify environment variables
- Check port availability
- Review logs: `pm2 logs`

### Database Connection Issues
- Verify MONGODB_URI
- Check network connectivity
- Verify MongoDB is running
- Check firewall rules

### Frontend API Errors
- Verify REACT_APP_API_URL
- Check CORS settings
- Verify backend is running
- Check browser console

## 📞 Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test health endpoint
4. Review error messages
5. Check MongoDB connection

---

**Happy Deploying! 🚀**

