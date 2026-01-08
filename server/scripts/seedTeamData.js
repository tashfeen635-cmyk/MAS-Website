const mongoose = require('mongoose');
require('dotenv').config();
const Team = require('../models/Team');

const defaultTeamData = [
  {
    name: "Maqsood Ahmed Dar",
    position: "Founder / Chief Executive Officer",
    description: "Visionary leader driving company growth, strategy, and long-term business excellence.",
    image: "assets/img/team/team-1.jpg",
    social: {
      twitter: "#",
      facebook: "#",
      instagram: "#",
      linkedin: "#"
    },
    order: 1
  },
  {
    name: "Hammad Ahmed Dar",
    position: "Managing Director",
    description: "Oversees operations, ensures efficiency, and leads teams to achieve organizational goals.",
    image: "assets/img/team/team-2.jpg",
    social: {
      twitter: "#",
      facebook: "#",
      instagram: "#",
      linkedin: "#"
    },
    order: 2
  },
  {
    name: "Dr Mehfooz Ullah Dar",
    position: "Consultant",
    description: "Provides expert advice, strategic insights, and professional guidance for informed decision-making.",
    image: "assets/img/team/team-3.jpg",
    social: {
      twitter: "#",
      facebook: "#",
      instagram: "#",
      linkedin: "#"
    },
    order: 3
  },
  {
    name: "Mehran Ali",
    position: "Manager",
    description: "Responsible for team management, workflow coordination, and achieving company targets efficiently.",
    image: "assets/img/team/team-4.jpg",
    social: {
      twitter: "#",
      facebook: "#",
      instagram: "#",
      linkedin: "#"
    },
    order: 4
  },
  {
    name: "M.Ahmed Hussain",
    position: "Civil Engineer",
    description: "Certified civil engineer with expertise in construction planning, structural analysis, and site management.",
    image: "assets/img/team/team-5.jpg",
    social: {
      twitter: "#",
      facebook: "#",
      instagram: "#",
      linkedin: "#"
    },
    order: 5
  },
  {
    name: "Muhammad Shoaib",
    position: "Electrical Engineer",
    description: "Skilled electrical engineer specializing in electrical design, power systems, installation, maintenance, and energy-efficient solutions.",
    image: "assets/img/team/team-6.jpg",
    social: {
      twitter: "#",
      facebook: "#",
      instagram: "#",
      linkedin: "#"
    },
    order: 6
  }
];

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mas-website';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Clear existing team data
  await Team.deleteMany({});
  console.log('Cleared existing team data');
  
  // Insert default team data
  await Team.insertMany(defaultTeamData);
  console.log('Seeded default team data');
  
  process.exit(0);
})
.catch((err) => {
  console.error('Error seeding data:', err);
  process.exit(1);
});
