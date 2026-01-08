# Quick Deploy Guide - 5 Minutes

## Super Quick Start

### 1. Push to GitHub (2 min)

```bash
cd D:\CODING\MAS-Website
git init
git add .
git commit -m "Ready for Vercel"
git remote add origin https://github.com/YOUR_USERNAME/mas-website.git
git push -u origin main
```

### 2. Get MongoDB Connection String (1 min)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account → Create free cluster (M0)
3. Database Access → Add User (username/password)
4. Network Access → Allow All (0.0.0.0/0)
5. Database → Connect → Connect your app → Copy connection string
6. Replace `<password>` and `<dbname>` in connection string

### 3. Deploy to Vercel (2 min)

1. Go to: https://vercel.com → Sign up (free)
2. New Project → Import Git Repository
3. Select your repo → Import
4. Configure:
   - Framework: Other
   - Output Directory: `public`
5. Add Environment Variables:
   ```
   MONGODB_URI = (paste your connection string)
   JWT_SECRET = any-random-32-char-string
   ADMIN_USERNAME = tashu
   ADMIN_PASSWORD = tashu123
   ```
6. Click Deploy → Wait 2 minutes → Done! 🎉

### 4. Test

- Website: `https://your-project.vercel.app`
- Admin: `https://your-project.vercel.app/admin`
- Login and add team members!

---

## Generate Secure JWT Secret

```bash
# On Windows PowerShell:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})

# Or use online: https://randomkeygen.com/
```
