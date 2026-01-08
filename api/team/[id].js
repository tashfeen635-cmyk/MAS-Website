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

  const { id } = req.query;

  try {
    await connectDB();

    // GET single team member (public)
    if (req.method === 'GET') {
      const teamMember = await Team.findById(id);
      if (!teamMember) {
        return res.status(404).json({ message: 'Team member not found' });
      }
      return res.json(teamMember);
    }

    // PUT update team member (protected)
    if (req.method === 'PUT') {
      try {
        authenticate(req);
      } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { name, position, description, image, social, order } = req.body;

      const teamMember = await Team.findById(id);
      if (!teamMember) {
        return res.status(404).json({ message: 'Team member not found' });
      }

      if (name) teamMember.name = name;
      if (position) teamMember.position = position;
      if (description) teamMember.description = description;
      if (image) teamMember.image = image;
      if (social) teamMember.social = { ...teamMember.social, ...social };
      if (order !== undefined) teamMember.order = order;

      await teamMember.save();
      return res.json(teamMember);
    }

    // DELETE team member (protected)
    if (req.method === 'DELETE') {
      try {
        authenticate(req);
      } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const teamMember = await Team.findById(id);
      if (!teamMember) {
        return res.status(404).json({ message: 'Team member not found' });
      }

      await Team.findByIdAndDelete(id);
      return res.json({ message: 'Team member deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Team API error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
