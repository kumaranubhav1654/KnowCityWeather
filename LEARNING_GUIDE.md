# 📚 Complete Learning Guide - KnowCityWeather Phase 1

## Your Learning Path (Without AI First)

**Goal**: Understand APIs → Fetch Weather → Display on Dashboard → Send WhatsApp → AI-generated advice

**Time**: 1-2 days (hands-on coding)

---

# PHASE 1.1 - WEATHER FETCH ✅ (You are HERE)

## What You're Building
```
Your Code → Express Server → OpenWeatherMap API → Get Weather Data
```

## Step-by-Step Learning

### STEP 1: Project Setup (15 mins)
```bash
# You should already have done this:
mkdir -p backend/config
mkdir -p backend/services
mkdir -p backend/routes
mkdir -p backend/controllers
cd backend
npm init -y
npm install express axios dotenv node-cron
```

**What each folder does:**
- `services/` - Functions that DO WORK (fetch weather, send messages)
- `routes/` - URLs users visit (http://localhost:3001/api/weather)
- `controllers/` - Logic for handling requests
- `config/` - Configuration files

---

### STEP 2: Environment Setup (5 mins)

**File: `backend/.env`**
```env
OPENWEATHER_API_KEY=your_api_key_here
CITY=Bangalore
PORT=3001
```

**How to get API key:**
1. Go to https://openweathermap.org/api
2. Sign up (free)
3. Go to API keys tab
4. Copy your key
5. Paste into .env

---

### STEP 3: Create Weather Service (CORE LEARNING)

**File: `backend/services/weatherService.js`**

This is the **MOST IMPORTANT FILE** to understand.

```javascript
// weatherService.js - Fetches weather from OpenWeatherMap

const axios = require('axios');

const fetchWeather = async (city) => {
  try {
    // STEP 1: Build the URL with parameters
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    console.log('📍 Fetching weather for:', city);
    console.log('🔗 API URL:', url);
    
    // STEP 2: Make HTTP GET request (like browsing a website)
    const response = await axios.get(url);
    // "await" means: PAUSE here, get the response, then continue
    
    // STEP 3: Extract data from JSON response
    const weatherData = {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: response.data.main.temp,
      feelsLike: response.data.main.feels_like,
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      windSpeed: response.data.wind.speed,
      cloudiness: response.data.clouds.all,
      sunrise: new Date(response.data.sys.sunrise * 1000).toLocaleTimeString(),
      sunset: new Date(response.data.sys.sunset * 1000).toLocaleTimeString(),
    };
    
    console.log('✅ Weather fetched successfully!');
    return weatherData;
    
  } catch (error) {
    // Handle errors gracefully
    console.error('❌ Error fetching weather:');
    
    if (error.response) {
      console.error('API Error Status:', error.response.status);
      console.error('Message:', error.response.data.message);
    } else if (error.request) {
      console.error('No response from API - check internet');
    } else {
      console.error(error.message);
    }
    
    throw error;
  }
};

module.exports = { fetchWeather };
```

**KEY CONCEPTS IN THIS FILE:**

| Line | Concept | Explanation |
|------|---------|-------------|
| `async (city) =>` | Async Function | Function that works with promises |
| `await axios.get()` | Await | Pauses until API responds |
| `response.data` | JSON Response | Data returned by API |
| `.main.temp` | Data Extraction | Pick specific field from JSON |
| `try/catch` | Error Handling | What to do if something fails |

---

### STEP 4: Test File (Learn How Testing Works)

**File: `backend/testWeather.js`**

```javascript
// testWeather.js - Tests if our weather service works

require('dotenv').config(); // Load .env file

const { fetchWeather } = require('./services/weatherService');

const testWeatherFetch = async () => {
  console.log('🧪 Starting weather fetch test...\n');
  
  try {
    const city = process.env.CITY || 'Bangalore';
    
    console.log('Calling weather service...');
    const weather = await fetchWeather(city);
    
    console.log('\n📊 Weather Data Received:');
    console.log('═══════════════════════════════════════');
    console.log(`📍 Location: ${weather.city}, ${weather.country}`);
    console.log(`🌡️  Temperature: ${weather.temperature}°C`);
    console.log(`☁️  Condition: ${weather.description}`);
    console.log(`💧 Humidity: ${weather.humidity}%`);
    console.log(`💨 Wind Speed: ${weather.windSpeed} m/s`);
    console.log('═══════════════════════════════════════\n');
    
    console.log('✅ TEST PASSED!');
    
  } catch (error) {
    console.log('❌ TEST FAILED!');
    console.log('Check:');
    console.log('1. API key in .env is correct?');
    console.log('2. City name is spelled correctly?');
    console.log('3. Do you have internet connection?');
  }
};

testWeatherFetch();
```

**How to run:**
```bash
cd backend
node testWeather.js
```

**Expected output:**
```
📍 Location: Bangalore, IN
🌡️  Temperature: 28°C
☁️  Condition: partly cloudy
💧 Humidity: 65%
💨 Wind Speed: 2.5 m/s
✅ TEST PASSED!
```

---

### STEP 5: Verify Environment Variables (Debug File)

**File: `backend/checkEnv.js`**

```javascript
// checkEnv.js - Verify .env values are loaded

require('dotenv').config();

console.log('🔍 Checking Environment Variables:\n');

console.log('OPENWEATHER_API_KEY:', process.env.OPENWEATHER_API_KEY);
console.log('CITY:', process.env.CITY);
console.log('PORT:', process.env.PORT);

console.log('\n✅ Verification:');
if (process.env.OPENWEATHER_API_KEY && process.env.CITY && process.env.PORT) {
  console.log('✓ All environment variables loaded!');
} else {
  console.log('✗ Missing values in .env');
}
```

**Run:**
```bash
node checkEnv.js
```

---

## 🎓 WHAT YOU LEARNED (Phase 1.1)

### Concept 1: HTTP Requests
```javascript
// Making a GET request to an API
const response = await axios.get(url);
```
**Real-world analogy**: You ask a question to Google, you get an answer back.

### Concept 2: Async/Await
```javascript
const fetchWeather = async (city) => {
  const response = await axios.get(url); // WAIT for response
  // After response comes, continue
}
```
**Real-world analogy**: "Wait for the pizza delivery, then eat it."

### Concept 3: JSON Parsing
```javascript
// API returns JSON like this:
// { "main": { "temp": 28 }, "weather": [{ "description": "sunny" }] }

// Extract specific data:
const temperature = response.data.main.temp;
```
**Real-world analogy**: Opening a mail, finding what you need.

### Concept 4: Error Handling
```javascript
try {
  // Try to fetch weather
} catch (error) {
  // If something goes wrong, do this
}
```
**Real-world analogy**: "Try to call a friend. If they don't pick up, send a message instead."

---

## ✅ Phase 1.1 Checklist

- [ ] Created backend folder structure
- [ ] Ran `npm install` successfully
- [ ] Created `.env` with API key
- [ ] Created `weatherService.js`
- [ ] Created `testWeather.js`
- [ ] Ran `node testWeather.js` and got weather data
- [ ] Ran `node checkEnv.js` and saw all values

## ✅ Phase 1.3–1.4 Checklist (WhatsApp + AI)

- [ ] Added Twilio credentials to `.env` (see `backend/README_WHATSAPP.md`)
- [ ] Created `whatsappService.js` and `routes/messages.js`
- [ ] Ran `node testWhatsApp.js` or `POST /api/messages` successfully
- [ ] Added `GEMINI_API_KEY` to `.env`
- [ ] Created `AIService.js`
- [ ] Ran `node cron/weatherNotification.job.js` and received AI advice on WhatsApp

---

---

# PHASE 1.2 - DASHBOARD (NEXT)

## What You're Building
```
Frontend (React) → Calls Backend API → Shows Weather on Web Page
```

## Setup Steps

### STEP 1: Create Next.js Frontend (10 mins)

From KnowCityWeather root (NOT backend):
```bash
cd ..
npx create-next-app@latest frontend
# Choose:
# - TypeScript? No
# - ESLint? Yes
# - Tailwind? Yes
# - App Router? No (use Pages)
```

### STEP 2: Install Axios (Make HTTP Requests)
```bash
cd frontend
npm install axios
```

### STEP 3: Create Weather Component

**File: `frontend/components/Weather.js`**

```javascript
// Weather.js - React component that displays weather

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Weather() {
  // State to store weather data
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch weather when component loads
  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      // Call backend API
      const response = await axios.get('http://localhost:3001/api/weather');
      setWeather(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Failed to fetch weather data');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return <div className="text-center p-8">Loading weather...</div>;
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        {error}
        <button 
          onClick={fetchWeatherData}
          className="block mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  // Display weather data
  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">
        📍 {weather?.city}, {weather?.country}
      </h2>
      
      <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
        <div className="text-5xl font-bold">{weather?.temperature}°C</div>
        <div className="text-lg capitalize">{weather?.description}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm opacity-75">Feels Like</div>
          <div className="text-xl font-semibold">{weather?.feelsLike}°C</div>
        </div>
        <div>
          <div className="text-sm opacity-75">Humidity</div>
          <div className="text-xl font-semibold">{weather?.humidity}%</div>
        </div>
        <div>
          <div className="text-sm opacity-75">Wind Speed</div>
          <div className="text-xl font-semibold">{weather?.windSpeed} m/s</div>
        </div>
        <div>
          <div className="text-sm opacity-75">Pressure</div>
          <div className="text-xl font-semibold">{weather?.pressure} mb</div>
        </div>
      </div>

      <button 
        onClick={fetchWeatherData}
        className="w-full mt-6 bg-white text-blue-600 font-bold py-2 px-4 rounded hover:bg-gray-100"
      >
        🔄 Refresh
      </button>
    </div>
  );
}
```

### STEP 4: Update Home Page

**File: `frontend/pages/index.js`**

```javascript
// pages/index.js - Home page

import Head from 'next/head';
import Weather from '../components/Weather';

export default function Home() {
  return (
    <>
      <Head>
        <title>KnowCityWeather - Dashboard</title>
      </Head>

      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              🌤️ KnowCityWeather
            </h1>
            <p className="text-gray-600 mt-2">Your Weather Intelligence Platform</p>
          </div>

          <Weather />
        </div>
      </div>
    </>
  );
}
```

### STEP 5: Start Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm start  # or: node server.js
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Visit: http://localhost:3000

---

# PHASE 1.3 - WHATSAPP MESSAGES

## What You're Building
```
Backend API → Twilio API → WhatsApp Message → Your Phone
```

## Setup

### STEP 1: Get Twilio Account (Free)
1. Go to https://www.twilio.com
2. Sign up (free, includes $15 credit)
3. Go to "Console" → "Messaging" → "Services" → "Try Sandbox"
4. You'll see: Twilio WhatsApp Sandbox Number

### STEP 2: Install Twilio
```bash
cd backend
npm install twilio
```

### STEP 3: Create WhatsApp Service

**File: `backend/services/whatsappService.js`**

```javascript
// whatsappService.js - Sends WhatsApp messages via Twilio

import dotenv from 'dotenv';
dotenv.config();

import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  console.warn('⚠️ Twilio credentials not found. Add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to .env');
}

const client = twilio(accountSid, authToken);

const sendWhatsAppMessage = async (toPhoneNumber, messageText) => {
  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials missing in environment variables');
  }

  try {
    console.log('📱 Sending WhatsApp message to', toPhoneNumber);

    const message = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${toPhoneNumber}`,
      body: messageText,
    });

    console.log('✅ WhatsApp message sent. SID:', message.sid);
    return { sid: message.sid };

  } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error.message);
    throw error;
  }
};

export default sendWhatsAppMessage;
```

**KEY CONCEPTS IN THIS FILE:**

| Line | Concept | Explanation |
|------|---------|-------------|
| `import twilio` | ES Modules | Backend uses `"type": "module"` in `package.json` |
| `whatsapp:+number` | Twilio format | Both `from` and `to` must use the `whatsapp:` prefix |
| `client.messages.create()` | Twilio SDK | Sends the message; returns a `sid` you can log for debugging |
| Credential check | Fail fast | Throws before calling Twilio if `.env` is missing keys |

### STEP 4: Update .env

```env
OPENWEATHER_API_KEY=your_key
CITY=Bangalore
PORT=3001

# Twilio credentials
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886  # Sandbox number
USER_WHATSAPP_NUMBER=+your_number  # Your WhatsApp number
```

### STEP 5: Test WhatsApp Sending

**File: `backend/testWhatsApp.js`**

**File: `backend/routes/messages.js`** — exposes WhatsApp over HTTP:

```javascript
// POST http://localhost:3001/api/messages
// Body: { "to": "+9198XXXXXXXX", "message": "High UV today. Carry sunscreen." }
```

The router calls `sendWhatsAppMessage(to, message)` and returns `{ success: true, result }`.

See `backend/README_WHATSAPP.md` for Twilio sandbox setup and troubleshooting.

---

**File: `backend/testWhatsApp.js`**

```javascript
// testWhatsApp.js - Test WhatsApp sending

import dotenv from 'dotenv';
dotenv.config();
import sendWhatsAppMessage from './services/whatsappService.js';

const testSendMessage = async () => {
  try {
    console.log('🧪 Testing WhatsApp message sending...\n');
    
    const message = 'High UV today. Carry sunscreen. 🧴';
    
    await sendWhatsAppMessage(
      process.env.USER_WHATSAPP_NUMBER,
      message
    );
    
    console.log('✅ Test passed! Check your WhatsApp.');
    
  } catch (error) {
    console.log('❌ Test failed!');
    console.log('Check:');
    console.log('1. Twilio credentials in .env are correct?');
    console.log('2. Your number is verified in Twilio sandbox?');
    console.log('3. Do you have internet connection?');
  }
};

testSendMessage();
```

Run:
```bash
node testWhatsApp.js
```

---

# PHASE 1.4 - AI WEATHER ADVICE (FINAL)

## What You're Building
```
Weather Data → Gemini API → Short personalized advice → WhatsApp (via whatsappService)
```

The AI service does **not** fetch weather itself. It takes weather fields you already have and returns a short, WhatsApp-friendly recommendation.

---

### STEP 1: Get a Gemini API Key (Free tier)

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create an API key
3. Add it to `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

### STEP 2: Create AI Service (CORE LEARNING)

**File: `backend/services/AIService.js`**

```javascript
// AIService.js - Generates weather advice using Google Gemini

import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

const generateAdvice = async (weather, desiredReminders = '') => {
  if (desiredReminders.length === 0) {
    desiredReminders = `Also I need to commute to office around 9am and back around 5pm...
      I like to hit gym either in early morning or late evening...`;
  }

  try {
    const prompt = `
      Weather details:
      Temperature: ${weather.temp}°C
      UV Index: ${weather.uv}
      Feels like: ${weather.feelsLike}
      Humidity: ${weather.humidity}
      Sunrise: ${weather.sunrise}
      Sunset: ${weather.sunset}
      Description: ${weather.description}

      Generate a short WhatsApp-friendly weather recommendation...
      Keep it under 100 words.
    `;

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': process.env.GEMINI_API_KEY,
        },
      }
    );

    const advice =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    return advice || 'Weather looks normal today.';

  } catch (err) {
    console.error('❌ Error generating advice:', err.response?.data || err.message);
    return 'Unable to generate advice.';
  }
};

export default generateAdvice;
```

**KEY CONCEPTS IN THIS FILE:**

| Line | Concept | Explanation |
|------|---------|-------------|
| `generateAdvice(weather, desiredReminders)` | Pure logic layer | Input is structured weather data; output is plain text |
| `prompt` template string | Prompt engineering | You tell the model what data it has and how to format the reply |
| `axios.post()` + `X-goog-api-key` | REST API auth | Gemini is called over HTTPS; the key stays in `.env` |
| `candidates[0].content.parts[0].text` | Response parsing | Gemini nests the answer inside JSON; optional chaining avoids crashes |
| `try/catch` with fallback string | Graceful degradation | If AI fails, the app can still send a default message |

**Weather object shape** — `generateAdvice` expects fields like `temp`, `uv`, `feelsLike`, `humidity`, `sunrise`, `sunset`, `description`. Map from `weatherService` output when calling it (e.g. `temp: weather.temperature`).

---

### STEP 3: Wire the Full Pipeline (Cron / Manual Test)

**File: `backend/cron/weatherNotification.job.js`**

```javascript
import fetchWeather from '../services/weatherService.js';
import sendWhatsAppMessage from '../services/whatsappService.js';
import generateAdvice from '../services/AIService.js';

const testCron = async () => {
  const weather = await fetchWeather();

  const advice = await generateAdvice({
    temp: weather.temperature,
    uv: 'N/A',
    feelsLike: weather.feelsLike,
    humidity: weather.humidity,
    sunrise: weather.sunrise,
    sunset: weather.sunset,
    description: weather.description,
  });

  await sendWhatsAppMessage(
    process.env.USER_WHATSAPP_NUMBER,
    advice
  );
};

testCron()
  .then(() => console.log('Cron test completed'))
  .catch(console.error);
```

**Run the end-to-end test:**

```bash
cd backend
node cron/weatherNotification.job.js
```

**Expected flow:**
1. `fetchWeather()` → OpenWeatherMap
2. `generateAdvice(weather)` → Gemini
3. `sendWhatsAppMessage()` → Twilio → your WhatsApp

---

### STEP 4: Full `.env` for Phase 1.4

```env
OPENWEATHER_API_KEY=your_key
CITY=Bangalore
PORT=3001

# Twilio (WhatsApp)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
USER_WHATSAPP_NUMBER=+your_number

# Google Gemini (AI advice)
GEMINI_API_KEY=your_gemini_api_key
```

---

## 📚 Learning Summary

| Phase | What You Learn | Time |
|-------|----------------|------|
| **1.1** | API calls, async/await, error handling | 2-3 hrs |
| **1.2** | React components, state, frontend-backend communication | 2-3 hrs |
| **1.3** | Third-party APIs (Twilio), authentication, sending data | 2-3 hrs |
| **1.4** | AI APIs (Gemini), prompts, chaining services together | 2-3 hrs |

---

## 🎯 After Phase 1 - What You Know

✅ How to fetch data from external APIs  
✅ How async/await works  
✅ How to build React components  
✅ How to connect frontend to backend  
✅ How to use third-party services (Twilio for WhatsApp)  
✅ How to call an AI API (Gemini) and parse its JSON response  
✅ How to chain services: weather → AI advice → WhatsApp  
✅ How to handle errors gracefully  
✅ How environment variables protect secrets  

---

## 🚀 Next: Phase 2 Features

Once Phase 1 works:
- Automated scheduling with `node-cron` (send alerts every 12 hours)
- Multiple user support
- UV index from a dedicated API (feed into `generateAdvice`)
- Database storage (message history, user preferences)
- Deployment to production

---

**Happy coding! Remember: Type everything yourself, don't copy-paste. That's how you learn! 💪**
