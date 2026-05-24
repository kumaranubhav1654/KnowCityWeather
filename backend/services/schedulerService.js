import cron from 'node-cron';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  timeToCron,
  formatScheduleLabel,
} from '../utils/cronSchedule.js';
import { runWeatherNotificationJob } from '../cron/weatherNotification.job.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');
const SCHEDULE_FILE = path.join(DATA_DIR, 'schedule.json');

let scheduledTask = null;
let currentSchedule = null;

function defaultSchedule() {
  return {
    enabled: true,
    hour: 7,
    minute: 0,
    city: process.env.CITY || 'Bangalore',
    phone: process.env.USER_WHATSAPP_NUMBER || '',
    desiredReminders: '',
  };
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function loadScheduleFromDisk() {
  try {
    const raw = await fs.readFile(SCHEDULE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return { ...defaultSchedule(), ...parsed };
  } catch {
    return defaultSchedule();
  }
}

async function persistSchedule(schedule) {
  await ensureDataDir();
  const { enabled, hour, minute, city, phone, desiredReminders } = schedule;
  await fs.writeFile(
    SCHEDULE_FILE,
    JSON.stringify(
      { enabled, hour, minute, city, phone, desiredReminders },
      null,
      2
    ),
    'utf8'
  );
}

function stopCron() {
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
  }
}

function startCron() {
  stopCron();
  if (!currentSchedule?.enabled) return;

  const expression = timeToCron(currentSchedule.hour, currentSchedule.minute);

  if (!cron.validate(expression)) {
    throw new Error(`Invalid cron expression: ${expression}`);
  }

  scheduledTask = cron.schedule(expression, async () => {
    try {
      await runWeatherNotificationJob({
        city: currentSchedule.city,
        phone: currentSchedule.phone,
        desiredReminders: currentSchedule.desiredReminders,
      });
    } catch (err) {
      console.error('❌ Scheduled cron failed:', err.message || err);
    }
  });

  console.log(
    `📅 Weather cron scheduled: ${expression} (${formatScheduleLabel(currentSchedule.hour, currentSchedule.minute)} daily)`
  );
}

export function getScheduleState() {
  const expression = timeToCron(
    currentSchedule.hour,
    currentSchedule.minute
  );

  return {
    ...currentSchedule,
    cronExpression: expression,
    label: formatScheduleLabel(currentSchedule.hour, currentSchedule.minute),
    timezone:
      process.env.TZ ||
      Intl.DateTimeFormat().resolvedOptions().timeZone ||
      'server local',
    isRunning: Boolean(scheduledTask),
  };
}

export async function initScheduler() {
  currentSchedule = await loadScheduleFromDisk();
  startCron();
  return getScheduleState();
}

export async function updateSchedule(updates) {
  const next = { ...currentSchedule, ...updates };

  if (updates.hour !== undefined || updates.minute !== undefined) {
    const hour = Number(next.hour);
    const minute = Number(next.minute);
    timeToCron(hour, minute); // validates
    next.hour = hour;
    next.minute = minute;
  }

  if (updates.enabled !== undefined) {
    next.enabled = Boolean(updates.enabled);
  }

  currentSchedule = next;
  startCron();
  await persistSchedule(currentSchedule);
  return getScheduleState();
}

export async function runScheduleNow() {
  return runWeatherNotificationJob({
    city: currentSchedule.city,
    phone: currentSchedule.phone,
    desiredReminders: currentSchedule.desiredReminders,
  });
}
