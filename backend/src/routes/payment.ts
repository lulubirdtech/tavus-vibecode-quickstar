import express from 'express';
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

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Convert to kobo
        currency,
        reference,
        metadata
      })
    });

    if (!response.ok) {
      throw new Error(`Paystack API error: ${response.statusText}`);
    }

    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ message: 'Payment initialization failed' });
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

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Paystack verification error: ${response.statusText}`);
    }

    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
});

export { router as paymentRoutes };