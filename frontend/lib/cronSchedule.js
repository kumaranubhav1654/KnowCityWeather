/** Mirror of backend/utils/cronSchedule.js for live UI preview */

export function timeToCron(hour, minute) {
  const h = Number(hour);
  const m = Number(minute);
  if (!Number.isInteger(h) || h < 0 || h > 23) return null;
  if (!Number.isInteger(m) || m < 0 || m > 59) return null;
  return `${m} ${h} * * *`;
}

export function formatScheduleLabel(hour, minute) {
  const period = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  const mm = String(minute).padStart(2, '0');
  return `${h12}:${mm} ${period}`;
}

export function parseTimeInput(timeStr) {
  const [h, m] = String(timeStr).split(':').map(Number);
  return { hour: h, minute: m };
}

export function toTimeInputValue(hour, minute) {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}
