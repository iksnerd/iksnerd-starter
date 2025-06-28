import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
