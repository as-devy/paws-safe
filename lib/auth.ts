/** Shared field patterns. Sessions are handled by Auth.js (`auth.ts`), not cookies here. */

export const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PHONE_PATTERN = /^\+?[1-9]\d{1,14}$/;
