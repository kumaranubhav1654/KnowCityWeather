WhatsApp (Twilio) Setup

This file explains the environment variables and steps to test WhatsApp messaging for KnowCityWeather.

Required environment variables (add to `backend/.env`):

- `TWILIO_ACCOUNT_SID` — Your Twilio Account SID
- `TWILIO_AUTH_TOKEN` — Your Twilio Auth Token
- `TWILIO_WHATSAPP_NUMBER` — Twilio WhatsApp sandbox number (e.g. +14155238886)
- `USER_WHATSAPP_NUMBER` — Your personal WhatsApp number (include country code, e.g. +9198XXXXXXXX)

Example additions to `backend/.env`:

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
USER_WHATSAPP_NUMBER=+9198XXXXXXXX
```

Testing steps (after adding env vars):

1. Start the backend server (if not running):

```bash
cd backend
npm start
```

2. Run the test script:

```bash
node testWhatsApp.js
```

3. Check your WhatsApp for the test message.

Troubleshooting:
- Ensure your Twilio sandbox is configured and your number is joined to the sandbox (follow Twilio console instructions).
- If you see errors about credentials, verify the `TWILIO_*` variables in `backend/.env` are correct.
- Check the backend logs for detailed error messages.
