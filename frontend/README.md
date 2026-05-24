This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


Basic Model 1:
┌─────────────────────────────────────────┐
│ You visit: http://localhost:3000        │
└─────────────────┬───────────────────────┘
                  │
                  ↓
        ┌─────────────────────┐
        │ React Component     │
        │ (Weather.js)        │
        │                     │
        │ useEffect runs →    │
        │ fetchWeatherData()  │
        └─────────┬───────────┘
                  │ axios.get()
                  ↓
        ┌─────────────────────┐
        │ Backend Express     │
        │ localhost:3001      │
        │                     │
        │ GET /api/weather    │
        └─────────┬───────────┘
                  │ calls weatherService
                  ↓
        ┌─────────────────────┐
        │ OpenWeatherMap API  │
        │                     │
        │ Returns JSON        │
        └─────────┬───────────┘
                  │
                  ↓ Data flows back
        ┌─────────────────────┐
        │ React renders card  │
        │ Shows temperature,  │
        │ humidity, etc.      │
        └─────────────────────┘

Model 2 — Full stack (weather + AI + WhatsApp):

```
┌─────────────────────────────────────────┐
│ Dashboard: http://localhost:3000        │
│ (Next.js — Weather component)           │
└─────────────────┬───────────────────────┘
                  │ GET /api/weather
                  ↓
        ┌─────────────────────┐
        │ Backend Express     │
        │ localhost:3001      │
        │ weatherService.js   │
        └─────────┬───────────┘
                  │
                  ↓
        ┌─────────────────────┐
        │ OpenWeatherMap API  │
        └─────────────────────┘

Smart alert pipeline (cron or manual test):

        ┌─────────────────────┐
        │ weatherNotification │
        │ .job.js             │
        └─────────┬───────────┘
                  │
    ┌─────────────┼─────────────┐
    ↓             ↓             ↓
weatherService  AIService    whatsappService
    │          (Gemini)         (Twilio)
    ↓             │               ↓
OpenWeather    Short advice    WhatsApp
               text            on your phone
```

**Backend services** (see `LEARNING_GUIDE.md` and `architecture.md`):

| Service | File | Role |
|---------|------|------|
| Weather | `backend/services/weatherService.js` | Fetches live weather from OpenWeatherMap |
| WhatsApp | `backend/services/whatsappService.js` | Sends messages via Twilio (`POST /api/messages`) |
| AI | `backend/services/AIService.js` | `generateAdvice()` — Gemini turns weather into tips |

**Env vars (backend/.env):** `OPENWEATHER_API_KEY`, `CITY`, Twilio (`TWILIO_*`, `USER_WHATSAPP_NUMBER`), `GEMINI_API_KEY`.

**Test smart alerts:**

```bash
cd backend
node cron/weatherNotification.job.js
```

---

Planned / reference layout (`weather-ai-assistant/`):

weather-ai-assistant/

├── frontend/
│   ├── pages/
│   │    ├── index.js
│   │    ├── settings.js
│   │    └── dashboard.js
│   │
│   ├── components/
│   │    ├── WeatherCard.jsx
│   │    ├── UserPreferences.jsx
│   │    ├── NotificationSettings.jsx
│   │    └── MessagePreview.jsx
│   │
│   ├── services/
│   │    └── api.js
│   │
│   └── utils/
│        └── constants.js
│
│
├── backend/
│   ├── routes/
│   │    ├── weather.routes.js
│   │    ├── notification.routes.js
│   │    └── user.routes.js
│   │
│   ├── services/
│   │    ├── weatherService.js      # ✅ implemented
│   │    ├── whatsappService.js     # ✅ implemented
│   │    ├── AIService.js           # ✅ implemented (Gemini)
│   │    └── user.service.js        # planned
│   │
│   ├── cron/
│   │    └── weatherNotification.job.js   # ✅ weather → AI → WhatsApp
│   │
│   ├── utils/
│   │    ├── generateMessage.js
│   │    └── logger.js
│   │
│   ├── config/
│   │    └── env.js
│   │
│   ├── app.js
│   └── server.js
│
└── .env