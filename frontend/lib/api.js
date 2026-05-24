import axios from 'axios';

function resolveApiBase() {
  const raw =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  return raw.replace(/\/$/, '');
}

const API_BASE = resolveApiBase();

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  // Render free tier can cold-start 30–60s
  timeout: 90000,
});

export async function getHealth() {
  const { data } = await client.get('/api/health');
  return data;
}

export async function getConfig() {
  const { data } = await client.get('/api/config');
  return data;
}

export async function getTest() {
  const { data } = await client.get('/api/test');
  return data;
}

export async function getWeather(city) {
  const { data } = await client.get('/api/weather', {
    params: city ? { city } : undefined,
  });
  return data;
}

export async function postAdvice({ city, desiredReminders }) {
  const { data } = await client.post('/api/advice', {
    city,
    desiredReminders,
  });
  return data;
}

export async function postMessage({ to, message }) {
  const { data } = await client.post('/api/messages', { to, message });
  return data;
}

export async function postSmartAlert({ to, city, desiredReminders, message }) {
  const { data } = await client.post('/api/alert/smart', {
    to,
    city,
    desiredReminders,
    message,
  });
  return data;
}

export async function getSchedule() {
  const { data } = await client.get('/api/schedule');
  return data;
}

export async function putSchedule(body) {
  const { data } = await client.put('/api/schedule', body);
  return data;
}

export async function runScheduleNow() {
  const { data } = await client.post('/api/schedule/run');
  return data;
}

export { API_BASE };
