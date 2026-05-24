// Maps weatherService output to the shape expected by AIService.generateAdvice
export function mapWeatherForAI(weather) {
  return {
    temp: weather.temperature,
    uv: weather.uv ?? 'N/A',
    feelsLike: weather.feelsLike,
    humidity: weather.humidity,
    sunrise: weather.sunrise,
    sunset: weather.sunset,
    description: weather.description,
  };
}
