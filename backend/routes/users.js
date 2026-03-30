import express from 'express';
import User from '../models/User.js';
import upload from '../middleware/cloudinaryUpload.js';
import { sendWelcomeEmail } from '../utils/emailService.js';

const router = express.Router();

// Step 1: Save user without ID photo
router.post('/register-step1', async (req, res) => {
  try {
    console.log('=== Step 1: Saving user information ===');
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
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered. Please use a different email.' });
    }
    
    // Parse home address if it's a string
    let parsedAddress = {};
    try {
      parsedAddress = typeof homeAddress === 'string' ? JSON.parse(homeAddress) : homeAddress;
    } catch (e) {
      parsedAddress = { street: homeAddress };
    }
    
    // Create user with temporary status
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
      role: role || 'volunteer',
      skills: skills ? skills.split(',').map(s => s.trim()) : [],
      availability: availability || 'flexible',
      status: 'pending_upload', // Special status for users who haven't uploaded ID yet
      verified: false,
      idPhotoUrl: '',
      idPhotoPublicId: ''
    });
    
    const savedUser = await user.save();
    console.log('✅ User saved successfully with ID:', savedUser._id);
    
    res.status(201).json({ 
      message: 'Personal information saved successfully. Please upload your ID.',
      userId: savedUser._id,
      email: savedUser.email
    });
    
  } catch (error) {
    console.error('❌ Step 1 error:', error);
    res.status(500).json({ 
      message: 'Failed to save information. Please try again.',
      error: error.message 
    });
  }
});

// Step 2: Upload ID photo and complete registration
router.post('/upload-id', upload.single('idPhoto'), async (req, res) => {
  try {
    console.log('=== Step 2: Uploading ID photo ===');
    console.log('Request body:', req.body);
    console.log('File:', req.file ? {
      originalname: req.file.originalname,
      size: req.file.size,
      path: req.file.path
    } : 'No file');
    
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'ID photo is required' });
    }
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please start registration again.' });
    }
    
    // Update user with ID photo
    user.idPhotoUrl = req.file.path;
    user.idPhotoPublicId = req.file.filename;
    user.status = 'pending'; // Now pending verification
    user.updatedAt = Date.now();
    
    await user.save();
    console.log('✅ User updated with ID photo:', user._id);
    
    // Send welcome email in background (don't wait for it)
    sendWelcomeEmail(user.email, user.fullName)
      .then(result => {
        if (result.success) {
          console.log('✅ Welcome email sent to:', user.email);
        } else {
          console.log('⚠️ Email not sent:', result.error);
        }
      })
      .catch(emailError => {
        console.error('❌ Email error:', emailError.message);
      });
    
    res.json({ 
      message: 'Registration complete! Please check your email for confirmation. Our team will verify your ID within 24-48 hours.',
      userId: user._id,
      email: user.email
    });
    
  } catch (error) {
    console.error('❌ Step 2 error:', error);
    res.status(500).json({ 
      message: 'Failed to upload ID. Please try again.',
      error: error.message 
    });
  }
});

// Legacy single-step registration (kept for backward compatibility)
router.post('/register', upload.single('idPhoto'), async (req, res) => {
  try {
    console.log('=== Legacy Registration Request ===');
    console.log('Body:', req.body);
    console.log('File:', req.file ? req.file.originalname : 'No file');
    
    const { fullName, email, phoneNumber, homeAddress, occupation, role, skills, availability } = req.body;
    
    // Validate required fields
    if (!fullName || !email || !phoneNumber || !homeAddress || !occupation) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
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
    console.log('✅ User saved:', user._id);
    
    // Send welcome email
    sendWelcomeEmail(email, fullName).catch(console.error);
    
    res.status(201).json({ 
      message: 'Registration successful! Please check your email.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all volunteers (public)
router.get('/volunteers', async (req, res) => {
  try {
    const volunteers = await User.find({ verified: true, status: 'active' })
      .select('fullName occupation skills availability createdAt')
      .limit(50)
      .sort({ createdAt: -1 });
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

// Verify user (admin only - add auth middleware in production)
router.patch('/:id/verify', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        verified: true, 
        status: 'active',
        verificationDate: new Date()
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User verified successfully', user: { id: user._id, fullName: user.fullName } });
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get registration statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ verified: true });
    const pendingUsers = await User.countDocuments({ status: 'pending' });
    const activeVolunteers = await User.countDocuments({ role: 'volunteer', status: 'active' });
    
    res.json({
      totalUsers,
      verifiedUsers,
      pendingUsers,
      activeVolunteers,
      pendingVerification: pendingUsers
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;