import express from 'express';
import axios from 'axios';
import { auth } from '../middleware/auth';

const router = express.Router();

// Initialize payment endpoint
router.post('/initialize', auth, async (req, res) => {
  try {
    const { email, amount, currency = 'NGN', metadata } = req.body;
    
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      return res.status(500).json({ message: 'Payment service not configured' });
    }

    const reference = `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      email,
      amount: Math.round(amount * 100), // Convert to kobo
      currency,
      reference,
      metadata
    }, {
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('Payment initialization error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Payment initialization failed',
      error: error.response?.data?.message || error.message
    });
  }
});

// Verify payment endpoint
router.get('/verify/:reference', auth, async (req, res) => {
  try {
    const { reference } = req.params;
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    
    if (!paystackSecretKey) {
      return res.status(500).json({ message: 'Payment service not configured' });
    }

    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('Payment verification error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Payment verification failed',
      error: error.response?.data?.message || error.message
    });
  }
});

export { router as paymentRoutes };