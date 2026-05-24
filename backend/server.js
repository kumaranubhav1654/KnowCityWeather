// server.js - Main Express backend server
import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import fetchWeather from './services/weatherService.js';
import messagesRouter from './routes/messages.js';
import adviceRouter from './routes/advice.js';
import alertRouter from './routes/alert.js';
import scheduleRouter from './routes/schedule.js';
import { initScheduler } from './services/schedulerService.js';

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow frontend to call this server
app.use(express.json()); // Parse JSON requests

// ROUTES

// 1. GET /api/weather - Fetch weather data
app.get('/api/weather', async (req, res) => {
  try {
    console.log('📨 Received GET /api/weather request');
    
    // Get city from query parameter or .env
    const city = req.query.city || process.env.CITY;
    
    console.log('Fetching weather for:', city);
    
    // Call our weather service
    const weatherData = await fetchWeather(city);
    
    // Send data back to frontend
    res.json({
      success: true,
      data: weatherData,
    });
    
  } catch (error) {
    console.error('❌ Error in /api/weather:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch weather data',
      message: error.message,
    });
  }
});

// 2. GET /api/health - Check if server is running
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
  });
});

// Message routes (WhatsApp)
// POST /api/messages — body: { to, message }
app.use('/api/messages', messagesRouter);

// AI advice — POST /api/advice — body: { city?, desiredReminders? }
app.use('/api/advice', adviceRouter);

// Smart alert — POST /api/alert/smart — body: { to?, city?, desiredReminders?, message? }
app.use('/api/alert', alertRouter);

// Cron schedule — GET/PUT /api/schedule, POST /api/schedule/run
app.use('/api/schedule', scheduleRouter);

// App config (no secrets)
app.get('/api/config', (req, res) => {
  res.json({
    success: true,
    data: {
      defaultCity: process.env.CITY || 'Bangalore',
      defaultWhatsAppTo: process.env.USER_WHATSAPP_NUMBER || '',
      hasTwilio: Boolean(
        process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
      ),
      hasGemini: Boolean(process.env.GEMINI_API_KEY),
      port: PORT,
    },
  });
});

// 3. GET /api/test - Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Test endpoint working!',
    city: process.env.CITY,
    port: PORT,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  console.warn('⚠️ 404 Not Found:', req.method, req.path);
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  });
});

// Start server
app.listen(PORT, async () => {
  try {
    const schedule = await initScheduler();
    console.log(
      `📅 Schedule:  daily at ${schedule.label} (${schedule.cronExpression}) — ${schedule.enabled ? 'enabled' : 'paused'}`
    );
  } catch (err) {
    console.error('⚠️ Scheduler init failed:', err.message);
  }

  console.log(`📊 Weather:   http://localhost:${PORT}/api/weather`);
  console.log(`🤖 Advice:    http://localhost:${PORT}/api/advice`);
  console.log(`📱 Messages:  http://localhost:${PORT}/api/messages`);
  console.log(`🔔 Alert:     http://localhost:${PORT}/api/alert/smart`);
  console.log(`⏰ Schedule:  http://localhost:${PORT}/api/schedule`);
  console.log(`💚 Health:    http://localhost:${PORT}/api/health\n`);
});
