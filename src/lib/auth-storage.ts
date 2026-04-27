export const USER_INFO_KEY = "sayzo_user";
export const AUTH_STORAGE_EVENT = "sayzo-auth-storage";

export type StoredUserInfo = {
  avatar?: string;
  name?: string;
} | null;

export function getStoredUserInfoRaw() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(USER_INFO_KEY);
}

export function parseStoredUserInfo(value: string | null): StoredUserInfo {
  if (!value) return null;

  try {
    return JSON.parse(value) as StoredUserInfo;
  } catch {
    return null;
  }
}

export function setStoredUserInfo(value: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  localStorage.setItem(USER_INFO_KEY, JSON.stringify(value));
  window.dispatchEvent(new Event(AUTH_STORAGE_EVENT));
}

export function clearStoredUserInfo() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(USER_INFO_KEY);
  window.dispatchEvent(new Event(AUTH_STORAGE_EVENT));
}

export function subscribeStoredUserInfo(onChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleChange = () => onChange();

  window.addEventListener("storage", handleChange);
  window.addEventListener(AUTH_STORAGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(AUTH_STORAGE_EVENT, handleChange);
  };
}
