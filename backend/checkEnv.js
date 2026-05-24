// checkEnv.js
// Simple file to verify .env values are loaded

require('dotenv').config();

console.log('🔍 Checking Environment Variables:\n');

// Check each variable
console.log('OPENWEATHER_API_KEY:', process.env.OPENWEATHER_API_KEY);
console.log('CITY:', process.env.CITY);
console.log('PORT:', process.env.PORT);

// Verify they're not undefined
console.log('\n✅ Check Results:');
if (process.env.OPENWEATHER_API_KEY) {
  console.log('✓ API Key is loaded');
} else {
  console.log('✗ API Key is MISSING - add it to .env');
}

if (process.env.CITY) {
  console.log('✓ City is loaded');
} else {
  console.log('✗ City is MISSING - add it to .env');
}

if (process.env.PORT) {
  console.log('✓ Port is loaded');
} else {
  console.log('✗ Port is MISSING - add it to .env');
}
