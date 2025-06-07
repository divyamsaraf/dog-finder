/**
 * Cookie utility functions for managing browser cookies
 * Used primarily for authentication state management
 */

/**
 * Get a cookie value by name
 * @param name - The name of the cookie to retrieve
 * @returns The cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

/**
 * Set a cookie with the specified name, value and expiration
 * @param name - The name of the cookie
 * @param value - The value to store
 * @param days - Number of days until expiration (default: 7)
 */
export function setCookie(name: string, value: string, days = 7): void {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}${expires}; path=/; SameSite=Strict`;
}

/**
 * Delete a cookie by setting its expiration to a past date
 * @param name - The name of the cookie to delete
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
