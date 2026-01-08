const express = require('express');
const Team = require('../models/Team');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all team members (public)
router.get('/', async (req, res) => {
  try {
    const teamMembers = await Team.find().sort({ order: 1, createdAt: 1 });
    res.json(teamMembers);
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single team member (public)
router.get('/:id', async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json(teamMember);
  } catch (error) {
    console.error('Get team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create team member (protected)
router.post('/', auth, async (req, res) => {
  try {
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
    res.status(201).json(teamMember);
  } catch (error) {
    console.error('Create team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update team member (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, position, description, image, social, order } = req.body;

    const teamMember = await Team.findById(req.params.id);
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
    res.json(teamMember);
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete team member (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
