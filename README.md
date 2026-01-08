# MAS Website Backend

Backend implementation for Maqsood Ahmed & Sons Private Limited website with Node.js, Express, and MongoDB.

## Features

- ✅ Node.js backend with Express
- ✅ MongoDB database with Mongoose
- ✅ Admin authentication with JWT
- ✅ Team management with image upload
- ✅ RESTful API endpoints
- ✅ Admin panel at `/admin` route

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Install backend dependencies:
```bash
cd server
npm install
```

2. Create a `.env` file in the `server` directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mas-website
JWT_SECRET=your-secret-key-change-this-in-production
ADMIN_USERNAME=tashu
ADMIN_PASSWORD=tashu123
```

3. Make sure MongoDB is running on your system.

## Running the Application

1. Start the backend server:
```bash
cd server
npm start
```

For development with auto-reload:
```bash
npm run dev
```

2. The server will run on `http://localhost:3000`

3. Access the website at `http://localhost:3000`

4. Access the admin panel at `http://localhost:3000/admin`

## Seeding Initial Data

To seed the database with initial team data:

```bash
cd server
node scripts/seedTeamData.js
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token
- `PUT /api/auth/change-password` - Change admin password

### Team Management
- `GET /api/team` - Get all team members (public)
- `GET /api/team/:id` - Get single team member (public)
- `POST /api/team` - Create team member (protected)
- `PUT /api/team/:id` - Update team member (protected)
- `DELETE /api/team/:id` - Delete team member (protected)

### File Upload
- `POST /api/upload/team` - Upload team member image (protected)

## Default Admin Credentials

- Username: `tashu`
- Password: `tashu123`

**Important:** Change these credentials in production!

## Project Structure

```
MAS-Website/
├── server/
│   ├── models/
│   │   ├── Admin.js
│   │   └── Team.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── team.js
│   │   └── upload.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config/
│   │   └── initAdmin.js
│   ├── scripts/
│   │   └── seedTeamData.js
│   ├── uploads/
│   │   └── team/
│   ├── server.js
│   └── package.json
├── MAS/
│   ├── admin/
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   └── js/
│   │       ├── api.js
│   │       └── admin.js
│   ├── index.html
│   └── ...
└── README.md
```

## Notes

- The backend serves static files from the `MAS` directory
- Uploaded images are stored in `server/uploads/team/`
- JWT tokens are stored in localStorage on the client side
- The admin panel requires authentication to access

## Troubleshooting

1. **MongoDB connection error**: Make sure MongoDB is running and the connection string in `.env` is correct
2. **Port already in use**: Change the PORT in `.env` file
3. **Image upload fails**: Make sure the `uploads/team` directory exists and has write permissions
