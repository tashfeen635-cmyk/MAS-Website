const connectDB = require('../../lib/mongodb');
const Team = require('../../server/models/Team');
const jwt = require('jsonwebtoken');

// Auth middleware helper
const authenticate = (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    throw new Error('No token provided');
  }
  return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this-in-production');
};

module.exports = async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectDB();

    // GET all team members (public)
    if (req.method === 'GET') {
      const teamMembers = await Team.find().sort({ order: 1, createdAt: 1 });
      return res.json(teamMembers);
    }

    // POST create team member (protected)
    if (req.method === 'POST') {
      try {
        authenticate(req);
      } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { name, position, description, image, social, order } = req.body;

      if (!name || !position || !description || !image) {
        return res.status(400).json({ message: 'Name, position, description, and image are required' });
      }

      const teamMember = new Team({
        name,
        position,
        description,
        image,
        social: social || {},
        order: order || 0
      });

      await teamMember.save();
      return res.status(201).json(teamMember);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Team API error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
