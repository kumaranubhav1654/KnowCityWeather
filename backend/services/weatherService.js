// weatherService.js
// This file handles fetching weather data from OpenWeatherMap API
import dotenv from "dotenv";
dotenv.config();

import axios from 'axios';

// Function to fetch weather for a city
const fetchWeather = async (city = process.env.CITY) => {
  try {
    // Step 1: Build the API URL
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    // Step 2: Make the HTTP GET request
    const response = await axios.get(url);
    
    // Step 3: Extract useful data from response
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
      // API responded with error
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data.message);
    } else if (error.request) {
      // No response from API
      console.error('No response from API');
    } else {
      // Other errors
      console.error(error.message);
    }
    
    throw error;
  }
};

// Export the function so other files can use it
export default fetchWeather;
