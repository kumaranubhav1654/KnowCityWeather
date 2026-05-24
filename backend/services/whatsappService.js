// whatsappService.js - Sends WhatsApp messages via Twilio
import dotenv from "dotenv";
dotenv.config();

import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  console.warn('⚠️ Twilio credentials not found in environment. Add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to .env to enable WhatsApp sending.');
}

const client = twilio(accountSid, authToken);

const sendWhatsAppMessage = async (toPhoneNumber, messageText) => {
  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials missing in environment variables');
  }

  try {
    console.log('📱 Sending WhatsApp message to', toPhoneNumber);

    const from = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;
    const to = `whatsapp:${toPhoneNumber}`;

    const message = await client.messages.create({
      from,
      to,
      body: messageText,
    });

    console.log('✅ WhatsApp message sent. SID:', message.sid);
    return { sid: message.sid };
  } catch (err) {
    console.error('❌ Error sending WhatsApp message:', err.message || err);
    throw err;
  }
};

export default sendWhatsAppMessage;
