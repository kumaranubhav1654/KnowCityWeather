import express from 'express';
import fetchWeather from '../services/weatherService.js';
import generateAdvice from '../services/AIService.js';
import sendWhatsAppMessage from '../services/whatsappService.js';
import { mapWeatherForAI } from '../utils/mapWeatherForAI.js';

const router = express.Router();

// POST /api/alert/smart — weather → AI advice → WhatsApp
// Body: { to?: string, city?: string, desiredReminders?: string, message?: string }
router.post('/smart', async (req, res) => {
  try {
    const { to, city, desiredReminders, message } = req.body;
    const phone = to || process.env.USER_WHATSAPP_NUMBER;

    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'Missing "to" phone number and USER_WHATSAPP_NUMBER not set in .env',
      });
    }

    const targetCity = city || process.env.CITY;
    const weather = await fetchWeather(targetCity);

    const advice =
      message?.trim() ||
      (await generateAdvice(mapWeatherForAI(weather), desiredReminders ?? ''));

    const result = await sendWhatsAppMessage(phone, advice);

    res.json({
      success: true,
      data: { weather, advice, whatsapp: result },
    });
  } catch (err) {
    console.error('Error in /api/alert/smart:', err.message || err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to send smart alert',
    });
  }
});

export default router;
