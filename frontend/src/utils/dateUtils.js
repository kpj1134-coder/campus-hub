/**
 * dateUtils.js — Real-time date/time formatting utilities
 * 
 * IMPORTANT: Never hardcode date/time anywhere.
 * Always pass the real `createdAt` value from the backend.
 * Backend must always use LocalDateTime.now() when creating records.
 */

/**
 * Returns a human-readable relative time string.
 * Examples: "Just now", "5 minutes ago", "Today, 7:45 PM", "Yesterday, 10:30 AM", "24 Apr 2026, 3:15 PM"
 * 
 * @param {string|Date} dateInput — ISO string or Date object from backend
 * @returns {string}
 */
export function formatTimeAgo(dateInput) {
  if (!dateInput) return 'Unknown time';

  let date;
  try {
    // Handle both ISO string (e.g. "2026-04-26T13:45:00") and Date objects
    date = typeof dateInput === 'string'
      ? new Date(dateInput.includes('T') ? dateInput : dateInput.replace(' ', 'T'))
      : new Date(dateInput);
    
    if (isNaN(date.getTime())) return 'Unknown time';
  } catch {
    return 'Unknown time';
  }

  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  // Just now (< 60 seconds)
  if (diffSec < 60) return 'Just now';

  // Minutes ago (< 60 min)
  if (diffMin < 60) {
    return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
  }

  // Hours ago - same day
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return `Today, ${formatTime12h(date)}`;
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${formatTime12h(date)}`;
  }

  // Older — show full date
  return formatFullDate(date);
}

/**
 * Returns a formatted full date+time string.
 * Example: "24 Apr 2026, 3:15 PM"
 * 
 * @param {string|Date} dateInput
 * @returns {string}
 */
export function formatDateTime(dateInput) {
  if (!dateInput) return '';
  try {
    const date = typeof dateInput === 'string'
      ? new Date(dateInput.includes('T') ? dateInput : dateInput.replace(' ', 'T'))
      : new Date(dateInput);
    if (isNaN(date.getTime())) return '';
    return `${formatFullDate(date)}`;
  } catch {
    return '';
  }
}

/**
 * Formats date only: "26 Apr 2026"
 */
export function formatDateOnly(dateInput) {
  if (!dateInput) return '';
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return dateInput; // return as-is if can't parse
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return String(dateInput);
  }
}

// ── Helpers ──────────────────────────────────────────────

function formatTime12h(date) {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatFullDate(date) {
  const day = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const time = formatTime12h(date);
  return `${day}, ${time}`;
}
