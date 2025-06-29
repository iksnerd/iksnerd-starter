/**
 * Format a date to a string in the format YYYY-MM-DD
 *
 * @param {Date} date
 *
 * @returns {string} - formatted in YYYY-MM-DD
 */
export function formatDateToYearMonthDay(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Get the time from a date in the format HH:MM
 *
 * @param {Date} date
 *
 * @returns {string} - formatted in HH:MM
 */
export function getTimeFromDate(date: Date): string {
  const time = date.toISOString().split("T")[1].split(".")[0];
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
}

/**
 * Format a date to a string in the format YYYY-MM-DD HH:MM
 *
 * @param {Date} date
 *
 * @returns {string} - formatted in YYYY-MM-DD HH:MM
 */
export function formatDateToYearMonthDayHourMinute(date: Date): string {
  return date.toISOString().split(".")[0];
}

export interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

/**
 * Convert Timestamp to Date
 * @param {Date} date
 */
export function convertTimestampToDate(date: Timestamp): Date {
  return new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
}

/**
 * Formats a date to a human-readable string.
 * @param date
 * @returns A string representing the date in a human-readable format.
 * This function formats the date as relative time (e.g., "Today at 12:00 PM", "Yesterday at 12:00 PM") or as an actual date (e.g., "Jan 1, 2023, 12:00 PM").
 */
export function formatDate(date: Date): string {
  // Format date as relative time (today, yesterday) or actual date
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === now.toDateString()) {
    return `Today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  } else {
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}
