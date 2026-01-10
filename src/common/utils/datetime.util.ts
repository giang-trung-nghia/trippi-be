/**
 * Formats a Date object to HH-mm-ss_dd-MM-YYYY format
 * @param date - The date to format
 * @returns Formatted string like "14-30-45_10-01-2026"
 */
export function formatDateTime(date: Date = new Date()): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${hours}-${minutes}-${seconds}_${day}-${month}-${year}`;
}

/**
 * Sanitizes a string to be safe for use in filenames
 * @param text - The text to sanitize
 * @returns Sanitized string with only alphanumeric characters and underscores
 */
export function sanitizeFilename(text: string): string {
  return text.replace(/[^a-z0-9]/gi, '_');
}
