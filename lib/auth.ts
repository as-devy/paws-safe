export function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value ?? "");
  }
  return null;
}

export function setUserIdCookie(userId: string | number) {
  document.cookie = `UserId=${userId}; path=/; max-age=604800`;
}

export const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PHONE_PATTERN = /^\+?[1-9]\d{1,14}$/;
