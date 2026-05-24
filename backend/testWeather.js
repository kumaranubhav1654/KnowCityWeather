// testWeather.js
// This file tests our weatherService
// Run this with: node testWeather.js

// Load environment variables from .env file
require('dotenv').config();

// Import our weather service
const { fetchWeather } = require('./services/weatherService');

// Test function
const testWeatherFetch = async () => {
  console.log('🧪 Starting weather fetch test...\n');
  
  try {
    // Get city from .env or use default
    const city = process.env.CITY || 'New York';

    console.log(`!!!!!!!!!!!!!!!!!!!` , process.env.CITY);
    
    // Call our weather service
    const weather = await fetchWeather(city);
    
    // Display the results in a nice format
    console.log('\n📊 Weather Data Received:');
    console.log('═══════════════════════════════════════');
    console.log(`📍 Location: ${weather.city}, ${weather.country}`);
    console.log(`🌡️  Temperature: ${weather.temperature}°C (feels like ${weather.feelsLike}°C)`);
    console.log(`☁️  Condition: ${weather.description}`);
    console.log(`💧 Humidity: ${weather.humidity}%`);
    console.log(`💨 Wind Speed: ${weather.windSpeed} m/s`);
    console.log(`🌅 Sunrise: ${weather.sunrise}`);
    console.log(`🌇 Sunset: ${weather.sunset}`);
    console.log('═══════════════════════════════════════\n');
    
    console.log('✅ Test passed! Weather service is working correctly.');
    
  } catch (error) {
    console.log('\n❌ Test failed! There was an error.');
    console.log('Common reasons:');
    console.log('1. Did you add your OpenWeatherMap API key to .env?');
    console.log('2. Is the API key valid?');
    console.log('3. Do you have internet connection?');
  }
};

// Run the test
testWeatherFetch();
