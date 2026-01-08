# How to Deploy MAS Website on Vercel

## Step-by-Step Deployment Guide

### Prerequisites

1. **GitHub/GitLab/Bitbucket Account** - Vercel integrates with Git
2. **MongoDB Atlas Account** (Free tier available) - For database
3. **Vercel Account** - Sign up at https://vercel.com (Free)

---

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push Code to Git Repository

1. Initialize git (if not already):
   ```bash
   cd D:\CODING\MAS-Website
   git init
   git add .
   git commit -m "Initial commit - Ready for Vercel deployment"
   ```

2. Create a repository on GitHub/GitLab:
   - Go to GitHub.com → New Repository
   - Name it (e.g., `mas-website`)
   - Don't initialize with README

3. Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/mas-website.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Set Up MongoDB Atlas (Free Database)

1. **Create MongoDB Atlas Account:**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for free (M0 tier is free forever)

2. **Create a Cluster:**
   - After signup, click "Build a Database"
   - Choose "M0 FREE" tier
   - Choose a cloud provider and region (closest to you)
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Create Database User:**
   - Go to "Database Access" → "Add New Database User"
   - Username: `masadmin` (or your choice)
   - Password: Generate a strong password (SAVE IT!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access:**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `mas-website`
   - Example: `mongodb+srv://masadmin:YourPassword@cluster0.xxxxx.mongodb.net/mas-website?retryWrites=true&w=majority`

### Step 3: Deploy to Vercel

1. **Go to Vercel Dashboard:**
   - Visit https://vercel.com
   - Sign up/Login (can use GitHub account)

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Click "Import Git Repository"
   - Select your repository (`mas-website`)
   - Click "Import"

3. **Configure Project:**
   - **Framework Preset:** Other
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** (leave empty)
   - **Output Directory:** `public`
   - **Install Command:** `npm install`

4. **Add Environment Variables:**
   Click "Environment Variables" and add:

   ```
   MONGODB_URI = mongodb+srv://masadmin:YourPassword@cluster0.xxxxx.mongodb.net/mas-website?retryWrites=true&w=majority
   ```
   (Use your actual connection string from Step 2)

   ```
   JWT_SECRET = your-super-secret-random-string-change-this-in-production
   ```
   (Generate a random string - can use: `openssl rand -base64 32`)

   ```
   ADMIN_USERNAME = tashu
   ```

   ```
   ADMIN_PASSWORD = tashu123
   ```
   (Change this to a secure password!)

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for deployment
   - Once deployed, you'll get a URL like: `https://mas-website.vercel.app`

### Step 4: Seed Initial Data

After deployment, you need to add team members. You have two options:

**Option A: Using Admin Panel**
1. Go to: `https://your-app.vercel.app/admin`
2. Login with your admin credentials
3. Add team members through the dashboard

**Option B: Using MongoDB Atlas UI**
1. Go to MongoDB Atlas → Database → Browse Collections
2. Click on your cluster → Browse Collections
3. Create collection `teams`
4. Insert documents with team member data

---

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
cd D:\CODING\MAS-Website
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (Select your account)
- Link to existing project? **No**
- What's your project's name? **mas-website**
- In which directory is your code located? **./**
- Want to override the settings? **No**

### Step 4: Set Environment Variables

```bash
vercel env add MONGODB_URI
# Paste your MongoDB connection string when prompted
# Select: Production, Preview, Development

vercel env add JWT_SECRET
# Enter your secret key when prompted
# Select: Production, Preview, Development

vercel env add ADMIN_USERNAME
# Enter: tashu
# Select: Production, Preview, Development

vercel env add ADMIN_PASSWORD
# Enter your admin password
# Select: Production, Preview, Development
```

### Step 5: Deploy to Production

```bash
vercel --prod
```

---

## After Deployment

### 1. Test Your Website

- Visit: `https://your-project.vercel.app`
- Check if the website loads
- Test team section (should show empty or seeded data)

### 2. Test Admin Panel

- Visit: `https://your-project.vercel.app/admin`
- Login with your admin credentials
- Try adding a team member

### 3. Seed Team Data (Quick Method)

Run this in your browser console on the admin dashboard page:

```javascript
// This will help you add default team members via the admin panel
// Just use the "Add New Member" button in the admin dashboard
```

Or manually add via MongoDB Atlas UI.

---

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `masconstruction.pk`)
4. Follow DNS configuration instructions
5. Update your domain's DNS records as shown

---

## Troubleshooting

### API Routes Not Working

- Check Vercel function logs: Dashboard → Project → Functions
- Verify environment variables are set correctly
- Check MongoDB connection string format

### MongoDB Connection Issues

- Verify MongoDB Atlas network access allows all IPs (0.0.0.0/0)
- Check database user credentials
- Verify connection string format

### Static Files Not Loading

- Ensure files are in `/public` directory
- Check file paths are relative (not absolute)
- Clear browser cache

### Image Upload Issues

- Images are stored as base64 in MongoDB (this works but has size limits)
- For production, consider Cloudinary integration (instructions in code comments)

---

## Quick Checklist

- [ ] Code pushed to Git repository
- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster created and configured
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string copied
- [ ] Vercel account created
- [ ] Project imported from Git
- [ ] Environment variables set:
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] ADMIN_USERNAME
  - [ ] ADMIN_PASSWORD
- [ ] Project deployed
- [ ] Website tested
- [ ] Admin panel tested
- [ ] Team data seeded

---

## Production Recommendations

1. **Change Default Credentials:**
   - Use a strong `ADMIN_PASSWORD`
   - Use a secure `JWT_SECRET` (at least 32 characters)

2. **Set Up Image Storage:**
   - Consider Cloudinary for image storage
   - Or AWS S3, Google Cloud Storage

3. **Enable Monitoring:**
   - Set up Vercel Analytics (free)
   - Monitor function logs

4. **Backup:**
   - Export MongoDB data regularly
   - Keep code in Git repository

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check MongoDB Atlas logs
3. Verify all environment variables
4. Test API endpoints directly: `https://your-app.vercel.app/api/team`

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Check deployment logs in Vercel dashboard
