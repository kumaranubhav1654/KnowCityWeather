import dotenv from "dotenv";
dotenv.config();

import axios from "axios";

const generateAdvice = async (weather, desiredReminders = '') => {
    
    if(desiredReminders.length == 0) {
        desiredReminders = `Also I need to commute to office around 9am and back around 5pm, so suggest the best time to leave based on sunrise/sunset and current weather.
      I like to hit gym either in early morning or late evening, so suggest the best time for that as well.`;
    }
    
    try {
    console.log("🌤️ Weather data:", weather);

    const prompt = `
      Weather details:

      Temperature: ${weather.temp}°C
      UV Index: ${weather.uv}
      feelsLike: ${weather.feelsLike}
      Humidity: ${weather.humidity}
      Sunrise: ${weather.sunrise}
      Sunset: ${weather.sunset}
      description: ${weather.description}

      Generate a short WhatsApp-friendly weather recommendation. Which can have few reminders like:
        - If UV index is high, remind to carry sunscreen.
        - If it's going to rain, remind to carry an umbrella.
        - If it's sunny, suggest outdoor activities.
        - If it's cold, suggest wearing warm clothes.
        ${desiredReminders}
      Keep it under 100 words.
      Give practical advice only.
    `;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY
        }
      }
    );

    const advice =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("AI Advice:", advice);

    return advice || "Weather looks normal today.";

  } catch (err) {
    console.error(
      "❌ Error generating advice:",
      err.response?.data || err.message
    );

    return "Unable to generate advice.";
  }
};

export default generateAdvice;