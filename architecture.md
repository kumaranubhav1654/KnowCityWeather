# 🏗️ KnowCityWeather - Architecture & Learning Journey

## Project Overview

**KnowCityWeather** is a weather intelligence platform that:
1. **Fetches** real-time weather data from OpenWeatherMap
2. **Displays** weather info on a Next.js dashboard
3. **Generates** short, practical advice with Google Gemini (`AIService.js`)
4. **Sends** that advice to your phone via WhatsApp (Twilio — `whatsappService.js`)

Think of it as an automated system that tells you when to carry sunscreen, an umbrella, or a jacket by sending WhatsApp messages.

---

## 📚 Tech Stack

### Frontend
- **Next.js** (React framework with built-in routing & SSR)
- **React** (UI components)
- **Tailwind CSS** (styling)
- **Axios** (HTTP client)

### Backend
- **Node.js** (runtime)
- **Express.js** (REST API framework)
- **node-cron** (job scheduling)

### External APIs
- **OpenWeatherMap API** (weather data)
- **Twilio API** (WhatsApp sending)
- **Google Gemini API** (AI-generated weather advice)

### Database (Optional, for Phase 2)
- **MongoDB** (store user preferences, message history)

---

## 📁 Project Structure

```
KnowCityWeather/
├── backend/                      # Node.js + Express
│   ├── config/
│   │   └── env.example          # API keys template
│   ├── services/
│   │   ├── weatherService.js    # Fetches weather from OpenWeatherMap
│   │   ├── whatsappService.js   # Sends WhatsApp messages via Twilio
│   │   └── AIService.js         # Generates advice via Google Gemini
│   ├── routes/
│   │   └── messages.js          # POST /api/messages (WhatsApp)
│   ├── cron/
│   │   └── weatherNotification.job.js  # weather → AI → WhatsApp pipeline
│   ├── testWeather.js           # Manual weather test
│   ├── testWhatsApp.js          # Manual WhatsApp test
│   ├── README_WHATSAPP.md       # Twilio setup guide
│   └── server.js                # Express server entry point
│
├── frontend/                     # Next.js + React
│   ├── pages/
│   │   ├── index.js            # Homepage (dashboard)
│   │   └── api/                # Next.js API routes
│   ├── components/
│   │   ├── Weather.js          # Weather display
│   │   └── MessageLog.js       # Message history
│   ├── public/
│   │   └── weather-icons/      # Weather images
│   └── styles/
│       └── globals.css         # Global styles
│
├── docs/
│   └── API_REFERENCE.md        # API endpoints
│
├── .gitignore
└── README.md
```

---

## 🧠 Key Concepts for Beginners

### 1. **What is a Weather API?**
An API is like a waiter at a restaurant:
- **You (client)** ask: "Give me weather for Bangalore"
- **OpenWeatherMap API (server)** responds: `{ temp: 31°C, condition: "Sunny", ... }`

**Code Example:**
```javascript
// This is what happens behind the scenes
fetch('https://api.openweathermap.org/data/2.5/weather?q=Bangalore&appid=YOUR_API_KEY')
  .then(response => response.json())
  .then(data => console.log(data)) // { temp: 72, ... }
```

### 2. **Backend Flow (Server-Side)**
```
┌─────────────────────────────────────────┐
│ 1. Express Server Starts                │
│    (Listens on port 3001)               │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ 2. Scheduler (node-cron) Setup          │
│    "Run this task every 12 hours"       │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ 3. At scheduled time → weatherService   │
│    Calls OpenWeatherMap API             │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ 4. Get weather data                     │
│    {"temperature": 28, "desc": "sunny"} │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ 5. AIService.generateAdvice(weather)    │
│    Calls Google Gemini API              │
│    Returns short WhatsApp-friendly text │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ 6. whatsappService sends message        │
│    Via Twilio API → User's WhatsApp     │
└─────────────────────────────────────────┘
```

### 3. **What is Node-Cron (Scheduling)?**
It's like setting a daily alarm:
```javascript
// "Every day at 8 AM, send a WhatsApp message"
cron.schedule('0 8 * * *', () => {
  console.log('Time to send morning weather alerts!');
  sendWeatherAlert();
});
```

---

## 📋 Phase 1 - Build WITHOUT AI First (IMPORTANT)

### Duration: 1–2 days
### Goal: Understand the complete flow end-to-end

---

### **Phase 1.1 - Weather Fetch (2-3 hours)**

**What you'll learn:**
- How to make HTTP requests in Node.js
- Working with JSON responses
- Error handling
- Environment variables (hiding API keys)

**Task:**
```
Create a simple script that:
1. Calls OpenWeatherMap API
2. Logs temperature, description, humidity
3. Logs it to console
```

**Expected Output:**
```
Weather for New York:
- Temperature: 28°C
- Condition: Sunny
- Humidity: 65%
```

**Files to create:**
- `backend/config/env.example`
- `backend/services/weatherService.js`
- `backend/testWeather.js` (temporary test file)

---

### **Phase 1.2 - Dashboard (2-3 hours)**

**What you'll learn:**
- Next.js folder structure
- React components (display data)
- CSS (Tailwind)
- Fetching data from your backend

**Task:**
```
Create a simple dashboard that:
1. Displays weather from your backend
2. Shows temp, condition, humidity
3. Simple card layout with icons
4. Updates data when page loads
```

**Expected Output:**
A web page showing:
```
🌤️ New York
Temperature: 28°C
Condition: Sunny
Humidity: 65%
```

**Files to create:**
- `frontend/pages/index.js`
- `frontend/components/Weather.js`
- `frontend/styles/globals.css`

---

### **Phase 1.3 - WhatsApp Message (Static) (2-3 hours)**

**What you'll learn:**
- Authentication with third-party APIs (Twilio)
- Sending HTTP POST requests
- Working with Twilio sandbox (free WhatsApp testing)

**Task:**
```
Send a static WhatsApp message:
"High UV today. Carry sunscreen."

Steps:
1. Sign up for Twilio free account
2. Get sandbox WhatsApp number
3. Create whatsappService.js
4. Test sending a message manually
```

**Expected Output:**
WhatsApp message received:
```
HIGH UV INDEX ALERT ⚠️
High UV today. Carry sunscreen.
```

**Files to create:**
- `backend/services/whatsappService.js`
- `backend/routes/messages.js`
- `backend/testWhatsApp.js` (temporary test file)

**Service: `whatsappService.js`**

| Export | Purpose |
|--------|---------|
| `sendWhatsAppMessage(toPhoneNumber, messageText)` | Sends a text message via Twilio WhatsApp sandbox |

**Environment variables:** `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_NUMBER`, `USER_WHATSAPP_NUMBER`

**HTTP endpoint:** `POST /api/messages` with body `{ "to": "+91...", "message": "..." }`

---

### **Phase 1.4 - AI Weather Advice (2-3 hours)**

**What you'll learn:**
- Calling a generative AI API (Google Gemini) with `axios`
- Building prompts from structured weather data
- Chaining multiple services in one workflow

**Task:**
```
1. Add GEMINI_API_KEY to .env
2. Create AIService.js with generateAdvice()
3. Run weatherNotification.job.js:
   fetch weather → generate advice → send WhatsApp
```

**Expected Output:**
WhatsApp message with personalized tips (sunscreen, umbrella, commute/gym timing, etc.) — not a fixed static string.

**Files to create:**
- `backend/services/AIService.js`
- `backend/cron/weatherNotification.job.js`

**Service: `AIService.js`**

| Export | Purpose |
|--------|---------|
| `generateAdvice(weather, desiredReminders?)` | Builds a prompt from weather fields, calls Gemini, returns advice text |

**Prompt inputs:** `temp`, `uv`, `feelsLike`, `humidity`, `sunrise`, `sunset`, `description` (map from `weatherService` when integrating).

**Environment variable:** `GEMINI_API_KEY`

**API:** `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent` with header `X-goog-api-key`.

---

## 🔄 Complete Phase 1 Flow (After completing all 4 parts)

```
User Action:
  ↓
Visit Dashboard (http://localhost:3000)
  ↓
Frontend fetches from backend (http://localhost:3001/api/weather)
  ↓
Backend calls OpenWeatherMap API
  ↓
Gets: {"temp": 28, "description": "sunny", ...}
  ↓
Frontend displays weather card
  ↓
Option A — Manual/static message:
  User / API client POSTs to http://localhost:3001/api/messages
  ↓
  whatsappService → Twilio → WhatsApp

Option B — Smart alert (cron or test script):
  weatherNotification.job.js runs
  ↓
  weatherService → OpenWeatherMap
  ↓
  AIService.generateAdvice() → Gemini
  ↓
  whatsappService → Twilio → WhatsApp with AI-generated advice
  ↓
✅ Message received on user's phone
```

---

## 📚 Before You Start - Setup Guide

### Prerequisites
- Node.js v16+ installed
- npm installed
- A Twilio free account (for WhatsApp)
- An OpenWeatherMap API key (free tier available)
- A local WhatsApp number for testing (use Twilio sandbox)

### Initial Setup Commands
```bash
# Create backend
mkdir backend
cd backend
npm init -y
npm install express axios dotenv node-cron

# Create frontend
cd ..
npx create-next-app@latest frontend
cd frontend
npm install axios tailwindcss
```

---

## 🎯 Key Learning Takeaways (Phase 1)

| Concept | What You'll Learn |
|---------|-------------------|
| **APIs** | How to call external services & parse responses |
| **Backend Flow** | Server receives request → processes → responds |
| **Async Code** | Using `async/await` for API calls |
| **Environment Variables** | Keeping API keys safe in `.env` files |
| **HTTP Methods** | GET (fetch data), POST (send data) |
| **Scheduling** | Running tasks automatically at specific times |
| **AI Integration** | Prompts, parsing Gemini JSON, graceful fallbacks |
| **Service chaining** | weather → advice → WhatsApp in one pipeline |
| **Error Handling** | What to do when API calls fail |

---

## ⚠️ Common Beginner Mistakes (AVOID THESE)

1. **Hardcoding API keys** in code → Use `.env` files
2. **Not handling errors** → Always add `.catch()` or `try/catch`
3. **Forgetting to start servers** → Start backend (3001) & frontend (3000) separately
4. **Mixing frontend & backend code** → Keep them completely separate
5. **Using wrong HTTP methods** → GET for reading, POST for sending
6. **Not testing manually first** → Always test API calls in Postman/curl before building UI

---

## 📞 API Keys You'll Need (Phase 1)

### 1. OpenWeatherMap
- Get free key: https://openweathermap.org/api
- Free tier: 1000 calls/day (plenty for testing)

### 2. Twilio
- Get free account: https://www.twilio.com
- Includes $15 free credit
- Sandbox: Test WhatsApp WITHOUT charging real money
- Setup details: `backend/README_WHATSAPP.md`

### 3. Google Gemini
- Get free API key: https://aistudio.google.com/apikey
- Used by `backend/services/AIService.js` for short weather recommendations

---

## 🚀 Phase 2 Preview (After Phase 1)

Once you complete Phase 1, you'll add:
- **Automated Scheduling**: Wire `node-cron` to `weatherNotification.job.js` (every 12 hours)
- **Multiple Users**: Store user locations & preferences in database
- **Richer weather data**: UV index and forecasts fed into `generateAdvice()`
- **Message History**: Log all messages sent
- **Deployment**: Deploy to Heroku/Vercel

---

## 📖 Learning Strategy

### For Each Phase:
1. **Understand the concept** (5 min read)
2. **See example code** (look at examples in files)
3. **Write code yourself** (NOT copy-paste, type it out!)
4. **Test manually** (use Postman/curl for APIs)
5. **Debug when it breaks** (it will! This is learning)

### Why "Without AI First"?
- You'll understand HOW things work (not just copy solutions)
- You'll debug problems yourself (critical skill)
- You'll remember the concepts (hands-on learning)
- You'll be confident with your code (you wrote it!)

---

## 🎓 Resources

### Documentation to Read
- [Node.js Official Docs](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Next.js Basics](https://nextjs.org/learn/basics/create-nextjs-app)
- [Axios HTTP Client](https://axios-http.com/)
- [Twilio WhatsApp API](https://www.twilio.com/docs/whatsapp)
- [Google Gemini API](https://ai.google.dev/gemini-api/docs)

### Tools You'll Use
- **Postman**: Test API endpoints (download free version)
- **VS Code**: Code editor
- **Terminal**: Run commands & servers
- **Browser DevTools**: Debug frontend (F12)

---

## 💡 Pro Tips

1. **Keep it simple first** → Add features later
2. **Test each part separately** → Don't build everything at once
3. **Read error messages** → They tell you what's wrong!
4. **Google the error** → 99% of errors are common
5. **Console.log everything** → Debug by logging data at each step
6. **Take breaks** → Your brain needs rest to process concepts

---

## 📞 Debugging Checklist

When something doesn't work:

- [ ] Is the backend server running? (`npm start`)
- [ ] Is the frontend server running? (`npm run dev`)
- [ ] Are both running on correct ports? (Backend 3001, Frontend 3000)
- [ ] Did you add API keys to `.env`?
- [ ] Did you restart the server after changing `.env`?
- [ ] Check browser console (F12 → Console tab)
- [ ] Check terminal output for errors
- [ ] Try the API directly in Postman
- [ ] Check API documentation for rate limits

---

## ✅ Success Metrics for Phase 1

You're done Phase 1 when:

- ✅ You can fetch weather from OpenWeatherMap API
- ✅ Dashboard displays weather information
- ✅ You understand how requests flow from frontend → backend → API
- ✅ You can send a WhatsApp message using Twilio (static or via API)
- ✅ You can generate weather advice with Gemini (`AIService.js`)
- ✅ You can run the full pipeline: weather → AI → WhatsApp
- ✅ You can explain to someone else how each part works
- ✅ You've hit at least 3 errors and fixed them yourself

---

## 📝 Notes Section (For Your Progress)

```
Phase 1.1 Status: [ ] Not Started [ ] In Progress [ ] Done
Phase 1.2 Status: [ ] Not Started [ ] In Progress [ ] Done
Phase 1.3 Status: [ ] Not Started [ ] In Progress [ ] Done
Phase 1.4 Status: [ ] Not Started [ ] In Progress [ ] Done

Challenges Faced:
- 

Solutions Found:
- 

Concepts Understood:
- 
```

---

**Good luck! Remember: Every expert was once a beginner. 🚀**
