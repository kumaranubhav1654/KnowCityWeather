/** Convert hour (0–23) and minute (0–59) to a daily node-cron expression. */
export function timeToCron(hour, minute) {
  const h = Number(hour);
  const m = Number(minute);

  if (!Number.isInteger(h) || h < 0 || h > 23) {
    throw new Error('Hour must be an integer between 0 and 23');
  }
  if (!Number.isInteger(m) || m < 0 || m > 59) {
    throw new Error('Minute must be an integer between 0 and 59');
  }

  return `${m} ${h} * * *`;
}

/** Parse a daily cron expression (minute hour * * *) back to hour/minute. */
export function cronToTime(cronExpression) {
  const parts = String(cronExpression).trim().split(/\s+/);
  if (parts.length < 5) {
    throw new Error('Invalid cron expression');
  }

  const minute = parseInt(parts[0], 10);
  const hour = parseInt(parts[1], 10);

  if (Number.isNaN(minute) || Number.isNaN(hour)) {
    throw new Error('Invalid cron expression');
  }

  return { hour, minute };
}

/** Human-readable label, e.g. "7:00 AM". */
export function formatScheduleLabel(hour, minute) {
  const period = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  const mm = String(minute).padStart(2, '0');
  return `${h12}:${mm} ${period}`;
}

/** HTML time input value, e.g. "07:00". */
export function toTimeInputValue(hour, minute) {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/** Parse HTML time input "HH:mm". */
export function parseTimeInput(timeStr) {
  const [h, m] = String(timeStr).split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) {
    throw new Error('Invalid time');
  }
  return { hour: h, minute: m };
}
