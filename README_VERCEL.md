# MAS Website - Vercel Deployment

The website has been restructured for Vercel deployment with proper file organization.

## Project Structure

```
MAS-Website/
├── api/                      # Vercel serverless functions
│   ├── auth/                # Authentication endpoints
│   │   ├── login.js
│   │   ├── verify.js
│   │   └── change-password.js
│   ├── team/                # Team management endpoints
│   │   ├── index.js         # GET all, POST create
│   │   └── [id].js          # GET one, PUT update, DELETE
│   └── upload/              # File upload endpoints
│       └── team.js
├── lib/                     # Shared utilities
│   ├── mongodb.js           # MongoDB connection (optimized for serverless)
│   └── initAdmin.js         # Admin initialization
├── public/                  # Static files (served directly by Vercel)
│   ├── admin/               # Admin panel
│   ├── assets/              # Images, CSS, JS
│   └── *.html               # Website pages
├── server/                  # Shared backend code
│   ├── models/              # Mongoose models
│   ├── middleware/          # Auth middleware
│   └── config/              # Configuration
├── package.json             # Root dependencies
├── vercel.json              # Vercel configuration
└── .vercelignore           # Files to ignore in Vercel

```

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set environment variables in Vercel:**
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Secret key for JWT tokens
   - `ADMIN_USERNAME` - Admin username (default: tashu)
   - `ADMIN_PASSWORD` - Admin password (default: tashu123)

3. **Deploy to Vercel:**
   ```bash
   vercel
   ```

## Key Changes for Vercel

1. **Static Files**: Moved from `MAS/` to `public/` directory
2. **API Routes**: Converted Express routes to Vercel serverless functions
3. **MongoDB**: Optimized connection with caching for serverless environment
4. **File Uploads**: Using base64 data URLs (consider cloud storage for production)
5. **API URLs**: Updated to use relative paths (`/api` instead of absolute URLs)

## File Upload Notes

- Images are stored as base64 data URLs in MongoDB
- For production, consider integrating:
  - Cloudinary (recommended)
  - AWS S3
  - Google Cloud Storage
  - MongoDB GridFS

## Environment Variables

Create these in Vercel dashboard:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mas-website
JWT_SECRET=your-secure-random-secret-key
ADMIN_USERNAME=tashu
ADMIN_PASSWORD=your-secure-password
```

## Deployment

See `VERCEL_DEPLOYMENT.md` for detailed deployment instructions.
