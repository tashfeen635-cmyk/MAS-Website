# Vercel Deployment Guide

This guide explains how to deploy the MAS Website to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. MongoDB Atlas account (or MongoDB connection string)
3. Git repository (GitHub, GitLab, or Bitbucket)

## Project Structure

```
MAS-Website/
├── api/                    # Vercel serverless functions
│   ├── auth/              # Authentication endpoints
│   ├── team/              # Team management endpoints
│   └── upload/            # File upload endpoints
├── lib/                   # Shared utilities
│   └── mongodb.js         # MongoDB connection handler
├── public/                # Static files (served directly)
│   ├── admin/            # Admin panel
│   ├── assets/           # Images, CSS, JS
│   └── *.html            # Website pages
├── server/                # Backend code (shared models, etc.)
├── package.json          # Dependencies
├── vercel.json           # Vercel configuration
└── .env.example          # Environment variables template
```

## Deployment Steps

### 1. Prepare Your Repository

Ensure all files are committed and pushed to your Git repository.

### 2. Set Up MongoDB Atlas (Recommended)

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string (replace `<password>` with your password)
4. Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mas-website?retryWrites=true&w=majority`

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? mas-website (or your choice)
# - Directory? ./
# - Override settings? No
```

#### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your Git repository
4. Configure project:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: (leave empty)
   - Output Directory: public
   - Install Command: npm install

### 4. Configure Environment Variables

In your Vercel project settings, add the following environment variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mas-website?retryWrites=true&w=majority
JWT_SECRET=your-very-secure-random-secret-key-change-this
ADMIN_USERNAME=tashu
ADMIN_PASSWORD=tashu123
```

**Important:** 
- Change `JWT_SECRET` to a strong random string
- Change `ADMIN_PASSWORD` to a secure password
- Use MongoDB Atlas connection string for production

### 5. Seed Initial Data

After deployment, you can seed the database by running the seed script locally or creating a one-time API endpoint:

```bash
# Option 1: Run locally (requires MongoDB connection)
cd server
node scripts/seedTeamData.js

# Option 2: Use MongoDB Compass or MongoDB Atlas UI to insert data
```

### 6. Verify Deployment

1. Visit your Vercel deployment URL
2. Test the website: `https://your-project.vercel.app`
3. Test admin login: `https://your-project.vercel.app/admin`
4. Verify API endpoints work correctly

## Important Notes

### File Uploads

- Vercel serverless functions have limited file system access
- Uploaded images are converted to base64 data URLs
- For production, consider using:
  - Cloudinary (recommended for image storage)
  - AWS S3
  - Google Cloud Storage
  - MongoDB GridFS

### MongoDB Connection

- The connection is cached and reused across serverless function invocations
- Ensure your MongoDB Atlas cluster allows connections from Vercel IPs (or allow all IPs: 0.0.0.0/0)

### Environment Variables

- Never commit `.env` files
- All sensitive data should be in Vercel's environment variables
- Update environment variables in Vercel dashboard for production changes

## Custom Domain

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### API Routes Not Working

- Check that files in `/api` directory are properly exported
- Verify environment variables are set correctly
- Check Vercel function logs in the dashboard

### MongoDB Connection Issues

- Verify MONGODB_URI is correct
- Check MongoDB Atlas network access settings
- Ensure database user has proper permissions

### Static Files Not Loading

- Verify files are in the `/public` directory
- Check file paths in HTML are relative (start with `/` or `../`)
- Clear browser cache

### Image Upload Issues

- Base64 images work but have size limitations
- Consider implementing cloud storage for production
- Check file size limits (currently 5MB)

## Production Checklist

- [ ] Change JWT_SECRET to a secure random string
- [ ] Change ADMIN_PASSWORD
- [ ] Use MongoDB Atlas (production-grade database)
- [ ] Set up custom domain
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Configure proper CORS if needed
- [ ] Set up image storage solution (Cloudinary/S3)
- [ ] Seed initial team data
- [ ] Test all functionality
- [ ] Set up monitoring/logging

## Support

For issues:
1. Check Vercel function logs in dashboard
2. Verify environment variables
3. Test API endpoints directly
4. Check MongoDB connection
