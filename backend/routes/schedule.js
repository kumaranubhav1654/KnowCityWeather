import express from 'express';
import {
  getScheduleState,
  updateSchedule,
  runScheduleNow,
} from '../services/schedulerService.js';
import { parseTimeInput } from '../utils/cronSchedule.js';

const router = express.Router();

// GET /api/schedule — current cron settings
router.get('/', (req, res) => {
  res.json({ success: true, data: getScheduleState() });
});

// PUT /api/schedule — update schedule from UI
// Body: { enabled?, hour?, minute?, time?: "07:00", city?, phone?, desiredReminders? }
router.put('/', async (req, res) => {
  try {
    const { enabled, hour, minute, time, city, phone, desiredReminders } =
      req.body;

    const updates = {};

    if (enabled !== undefined) updates.enabled = enabled;
    if (city !== undefined) updates.city = city;
    if (phone !== undefined) updates.phone = phone;
    if (desiredReminders !== undefined) {
      updates.desiredReminders = desiredReminders;
    }

    if (time !== undefined) {
      Object.assign(updates, parseTimeInput(time));
    } else {
      if (hour !== undefined) updates.hour = hour;
      if (minute !== undefined) updates.minute = minute;
    }

    const data = await updateSchedule(updates);
    res.json({ success: true, data });
  } catch (err) {
    console.error('Error in PUT /api/schedule:', err.message || err);
    res.status(400).json({
      success: false,
      error: err.message || 'Failed to update schedule',
    });
  }
});

// POST /api/schedule/run — trigger job immediately
router.post('/run', async (req, res) => {
  try {
    const data = await runScheduleNow();
    res.json({ success: true, data });
  } catch (err) {
    console.error('Error in POST /api/schedule/run:', err.message || err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to run scheduled job',
    });
  }
});

export default router;
