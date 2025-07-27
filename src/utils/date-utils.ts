/**
 * Utility functions for formatting dates from PocketBase
 */

export class DateUtils {
  /**
   * Formats a PocketBase date string (2025-07-26 23:20:07.542Z) into a human-readable format
   */
  static formatPocketBaseDate(dateString: string): string {
    const date = new Date(dateString? dateString : Date.now());
    // Format: dd/mm/yyyy
    const formattedDate = date.toLocaleDateString("en-GB"); // British
    return formattedDate;
  }

  /**
   * Formats a date for display in a more readable format (e.g., "Jan 15, 2024")
   */
  static formatDisplayDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (_) {
      return "Unknown date";
    }
  }

  /**
   * Formats a date with time for detailed views (e.g., "Jan 15, 2024 at 3:20 PM")
   */
  static formatDetailedDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Unknown date";
    }
  }
}
