// routes/messages.js - Router for sending messages

import express from 'express';
const router = express.Router();
import sendWhatsAppMessage from '../services/whatsappService.js';

// POST /api/messages/ - Send a WhatsApp message
// Body: { to: '+1234567890', message: 'Hello world' }
router.post('/', async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ success: false, error: 'Missing "to" or "message" in request body' });
    }

    const result = await sendWhatsAppMessage(to, message);
    res.json({ success: true, result });

  } catch (err) {
    console.error('Error in /api/messages:', err.message || err);
    res.status(500).json({ success: false, error: err.message || 'Failed to send message' });
  }
});

export default router;
