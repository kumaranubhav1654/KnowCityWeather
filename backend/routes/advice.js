import express from 'express';
import fetchWeather from '../services/weatherService.js';
import generateAdvice from '../services/AIService.js';
import { mapWeatherForAI } from '../utils/mapWeatherForAI.js';

const router = express.Router();

// POST /api/advice — fetch weather and generate AI recommendation
// Body: { city?: string, desiredReminders?: string }
router.post('/', async (req, res) => {
  try {
    const { city, desiredReminders } = req.body;
    const targetCity = city || process.env.CITY;

    const weather = await fetchWeather(targetCity);
    const advice = await generateAdvice(
      mapWeatherForAI(weather),
      desiredReminders ?? ''
    );

    res.json({
      success: true,
      data: { weather, advice },
    });
  } catch (err) {
    console.error('Error in /api/advice:', err.message || err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to generate advice',
    });
  }
});

export default router;
