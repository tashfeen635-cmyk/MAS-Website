const jwt = require('jsonwebtoken');
const Busboy = require('busboy');

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

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Authenticate
    authenticate(req);
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const busboy = Busboy({ headers: req.headers });
    let fileData = null;
    let fileMimeType = null;
    let fileName = null;

    busboy.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      
      if (name === 'image' && mimeType.startsWith('image/')) {
        fileMimeType = mimeType;
        fileName = filename || 'uploaded-image.jpg';
        const chunks = [];
        
        file.on('data', (data) => {
          chunks.push(data);
        });
        
        file.on('end', () => {
          fileData = Buffer.concat(chunks);
        });
      } else {
        file.resume(); // Discard non-image files
      }
    });

    busboy.on('finish', () => {
      if (!fileData) {
        return res.status(400).json({ message: 'No image file uploaded' });
      }

      // Check file size (5MB limit)
      if (fileData.length > 5 * 1024 * 1024) {
        return res.status(400).json({ message: 'File size exceeds 5MB limit' });
      }

      try {
        // Convert to base64 data URL (Vercel doesn't support persistent file storage)
        const base64Data = fileData.toString('base64');
        const dataURL = `data:${fileMimeType};base64,${base64Data}`;

        res.json({
          message: 'Image uploaded successfully',
          path: dataURL,
          filename: fileName
        });
      } catch (error) {
        console.error('Upload processing error:', error);
        res.status(500).json({ message: 'Server error' });
      }
    });

    busboy.on('error', (error) => {
      console.error('Busboy error:', error);
      res.status(400).json({ message: 'File upload error' });
    });

    req.pipe(busboy);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
