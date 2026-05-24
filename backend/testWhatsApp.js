// testWhatsApp.js - Test WhatsApp sending (run after adding Twilio creds to .env)

require('dotenv').config();
const { sendWhatsAppMessage } = require('./services/whatsappService');

const testSend = async () => {
  try {
    const to = process.env.USER_WHATSAPP_NUMBER;
    if (!to) {
      console.log('✋ USER_WHATSAPP_NUMBER not set in .env. Please add your number to test.');
      return;
    }

    const message = 'HIGH UV INDEX ALERT ⚠️\nHigh UV today. Carry sunscreen.';
    console.log('Sending test message to', to);
    const res = await sendWhatsAppMessage(to, message);
    console.log('Test message sent:', res);
  } catch (err) {
    console.error('Test failed:', err.message || err);
  }
};

testSend();
