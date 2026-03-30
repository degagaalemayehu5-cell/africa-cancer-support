import express from 'express';
import User from '../models/User.js';
import upload from '../middleware/cloudinaryUpload.js';
import { sendWelcomeEmail } from '../utils/emailService.js';

const router = express.Router();

// Register new volunteer/helper
router.post('/register', (req, res, next) => {
  console.log('=== Registration Request Started ===');
  
  upload.single('idPhoto')(req, res, async (err) => {
    if (err) {
      console.error('Upload middleware error:', err);
      return res.status(400).json({ 
        message: 'File upload error: ' + err.message,
        error: err.message
      });
    }
    
    try {
      console.log('File upload result:', req.file ? {
        originalname: req.file.originalname,
        size: req.file.size,
        path: req.file.path,
        filename: req.file.filename
      } : 'No file uploaded');
      
      console.log('Request body:', req.body);
      
      const { fullName, email, phoneNumber, homeAddress, occupation, role, skills, availability } = req.body;
      
      // Validate required fields
      if (!fullName || !email || !phoneNumber || !homeAddress || !occupation) {
        return res.status(400).json({ 
          message: 'Missing required fields',
          required: { 
            fullName: !fullName, 
            email: !email, 
            phoneNumber: !phoneNumber, 
            homeAddress: !homeAddress, 
            occupation: !occupation 
          }
        });
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address' });
      }
      
      // Check if user exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: 'User already registered with this email' });
      }
      
      // Parse home address
      let parsedAddress = {};
      try {
        parsedAddress = typeof homeAddress === 'string' ? JSON.parse(homeAddress) : homeAddress;
      } catch (e) {
        parsedAddress = { street: homeAddress };
      }
      
      // Create user
      const user = new User({
        fullName,
        email: email.toLowerCase(),
        phoneNumber,
        homeAddress: {
          street: parsedAddress.street || '',
          city: parsedAddress.city || '',
          country: parsedAddress.country || '',
          postalCode: parsedAddress.postalCode || ''
        },
        occupation,
        idPhotoUrl: req.file ? req.file.path : '',
        idPhotoPublicId: req.file ? req.file.filename : '',
        role: role || 'volunteer',
        skills: skills ? skills.split(',').map(s => s.trim()) : [],
        availability: availability || 'flexible',
        status: 'pending'
      });
      
      await user.save();
      console.log('✅ User saved successfully:', user._id);
      
      // Try to send welcome email (don't fail if email fails)
      try {
        await sendWelcomeEmail(email, fullName);
        console.log('📧 Welcome email sent to:', email);
      } catch (emailError) {
        console.error('Email sending failed:', emailError.message);
      }
      
      res.status(201).json({ 
        message: 'Registration successful! Our team will verify your ID within 24-48 hours.',
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          verified: user.verified,
          status: user.status
        }
      });
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ 
        message: 'Registration failed: ' + error.message,
        error: error.message
      });
    }
  });
});

// Get all volunteers
router.get('/volunteers', async (req, res) => {
  try {
    const volunteers = await User.find({ verified: true, status: 'active' })
      .select('fullName occupation skills availability createdAt')
      .limit(50);
    res.json(volunteers);
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-idPhotoUrl -idPhotoPublicId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;