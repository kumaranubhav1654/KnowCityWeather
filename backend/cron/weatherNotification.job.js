import fetchWeather from '../services/weatherService.js';
import sendWhatsAppMessage from '../services/whatsappService.js';
import generateAdvice from '../services/AIService.js';
import { mapWeatherForAI } from '../utils/mapWeatherForAI.js';

/**
 * Runs the daily weather → AI → WhatsApp pipeline once.
 * @param {{ city?: string, phone?: string, desiredReminders?: string }} options
 */
export async function runWeatherNotificationJob(options = {}) {
  const city = options.city || process.env.CITY;
  const phone = options.phone || process.env.USER_WHATSAPP_NUMBER;
  const desiredReminders = options.desiredReminders ?? '';

  if (!phone) {
    throw new Error(
      'No WhatsApp number: set phone in schedule or USER_WHATSAPP_NUMBER in .env'
    );
  }

  console.log('⏰ Running weather notification job…', { city, phone: '***' });

  const weather = await fetchWeather(city);
  const advice = await generateAdvice(
    mapWeatherForAI(weather),
    desiredReminders
  );

  const result = await sendWhatsAppMessage(phone, advice);

  console.log('✅ Scheduled weather alert sent');

  return { weather, advice, whatsapp: result };
}
