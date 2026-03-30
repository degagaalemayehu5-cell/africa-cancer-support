import express from 'express';
import Donation from '../models/Donation.js';
import User from '../models/User.js';
import { sendDonationReceipt } from '../utils/emailService.js';

const router = express.Router();

// Create donation
router.post('/', async (req, res) => {
  try {
    const { userId, amount, currency, message, anonymous } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const donation = new Donation({
      userId,
      amount,
      currency: currency || 'USD',
      message,
      anonymous: anonymous || false,
      status: 'completed'
    });
    
    await donation.save();
    
    // Send receipt email
    if (!anonymous) {
      await sendDonationReceipt(user.email, user.fullName, amount, currency);
    }
    
    res.status(201).json({ message: 'Donation successful!', donation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get donations for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.params.userId }).sort('-createdAt');
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all donations (public stats)
router.get('/stats', async (req, res) => {
  try {
    const totalAmount = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const count = await Donation.countDocuments({ status: 'completed' });
    
    res.json({
      totalRaised: totalAmount[0]?.total || 0,
      totalDonations: count,
      currency: 'USD'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;