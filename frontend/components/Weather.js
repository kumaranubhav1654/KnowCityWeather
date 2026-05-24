// components/Weather.js - React component to display weather data

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Weather() {
  // State variables to manage data
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('Bangalore');

  // Fetch weather when component loads
  useEffect(() => {
    fetchWeatherData();
  }, []);

  // Function to fetch weather from backend
  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📊 Fetching weather from backend...');

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      console.log('🔗 API Base URL:', API_BASE);
      
      // Call backend API (running on localhost:3001)
      const response = await axios.get(
        `${API_BASE}/api/weather?city=${city}`
      );

      console.log('✅ Weather data received:', response.data);
      
      // Store data in state
      setWeather(response.data.data);
      setError(null);
      
    } catch (err) {
      console.error('❌ Error fetching weather:', err.message);
      setError('Failed to fetch weather. Is backend running on port 3001?');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle city input change
  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  // Handle search button click
  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherData();
    }
  };

  // Display loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🌤️</div>
          <p className="text-gray-600 text-lg">Loading weather...</p>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="bg-red-100 border-2 border-red-500 text-red-700 px-6 py-4 rounded-lg">
        <h3 className="font-bold text-lg mb-2">❌ Error</h3>
        <p className="mb-4">{error}</p>
        <button 
          onClick={fetchWeatherData}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Display weather data
  return (
    <div className="w-full max-w-2xl">
      {/* Search Box */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={city}
            onChange={handleCityChange}
            placeholder="Enter city name..."
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
          >
            Search
          </button>
        </div>
      </form>

      {/* Weather Card */}
      {weather ? (
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-2xl p-8 text-white">
          
          {/* Location Header */}
          <div className="mb-6">
            <h2 className="text-4xl font-bold">
              📍 {weather.city}, {weather.country}
            </h2>
          </div>

          {/* Temperature Section */}
          <div className="bg-white bg-opacity-20 rounded-xl p-6 mb-6">
            <div className="text-6xl font-bold">{Math.round(weather.temperature)}°C</div>
            <div className="text-2xl capitalize mt-2">{weather.description}</div>
            <div className="text-lg opacity-90 mt-1">
              Feels like {Math.round(weather.feelsLike)}°C
            </div>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <WeatherDetail 
              icon="💧" 
              label="Humidity" 
              value={`${weather.humidity}%`}
            />
            <WeatherDetail 
              icon="💨" 
              label="Wind Speed" 
              value={`${weather.windSpeed.toFixed(1)} m/s`}
            />
            <WeatherDetail 
              icon="🔽" 
              label="Pressure" 
              value={`${weather.pressure} mb`}
            />
            <WeatherDetail 
              icon="☁️" 
              label="Cloudiness" 
              value={`${weather.cloudiness}%`}
            />
          </div>

          {/* Sun Times */}
          <div className="bg-white bg-opacity-10 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm opacity-75">🌅 Sunrise</div>
                <div className="text-lg font-semibold">{weather.sunrise}</div>
              </div>
              <div>
                <div className="text-sm opacity-75">🌇 Sunset</div>
                <div className="text-lg font-semibold">{weather.sunset}</div>
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          <button 
            onClick={fetchWeatherData}
            className="w-full bg-white text-blue-600 font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
          >
            🔄 Refresh Weather
          </button>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <p>No weather data available</p>
        </div>
      )}
    </div>
  );
}

// Helper component for weather details
function WeatherDetail({ icon, label, value }) {
  return (
    <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
      <div className="text-3xl mb-1">{icon}</div>
      <div className="text-xs opacity-75">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
