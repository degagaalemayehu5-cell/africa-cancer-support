import nodemailer from 'nodemailer';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/users.js';
import donationRoutes from './routes/donations.js';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();



// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://africa-cancer-support.onrender.com']
    : ['http://localhost:5173', 'http://localhost:5000', 'http://127.0.0.1:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', limiter);

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/donations', donationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Cancer Support Africa API is running',
    environment: process.env.NODE_ENV || 'development'
  });
});


// Test email configuration endpoint
app.get('/api/check-email-config', (req, res) => {
  console.log('=== Email Configuration Check ===');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
  console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
  console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
  console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  res.json({
    success: true,
    config: {
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_HOST: process.env.EMAIL_HOST,
      EMAIL_PORT: process.env.EMAIL_PORT,
      EMAIL_PASS_SET: !!process.env.EMAIL_PASS,
      EMAIL_PASS_LENGTH: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0,
      NODE_ENV: process.env.NODE_ENV
    }
  });
});

// Test send email endpoint
app.get('/api/test-send-email', async (req, res) => {
  console.log('=== Testing Send Email ===');
  
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection verified');
    
    // Send test email
    const info = await transporter.sendMail({
      from: `"Cancer Support Africa Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'Test Email from Render - Cancer Support Africa',
      text: 'If you receive this email, your email configuration on Render is working correctly!',
      html: '<h1>✅ Email Working!</h1><p>Your email configuration on Render is correct.</p><p>Time: ' + new Date().toISOString() + '</p>'
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    res.json({
      success: true,
      message: 'Test email sent successfully!',
      messageId: info.messageId,
      to: process.env.EMAIL_USER
    });
  } catch (error) {
    console.error('❌ Test email failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error command:', error.command);
    
    res.json({
      success: false,
      error: error.message,
      code: error.code,
      command: error.command
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve frontend static files
  const frontendPath = path.join(__dirname, '../frontend/dist');
  console.log('📁 Serving frontend from:', frontendPath);
  
  app.use(express.static(frontendPath));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

/// MongoDB connection with optimized settings
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10, // Limit connections
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT,  '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🌐 Serving frontend from: /app/frontend/dist`);
  }
});

