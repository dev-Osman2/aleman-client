import { User } from "@/src/types";

export const ADMIN_COOKIE_KEY = "admin_token";
export const LEGACY_COOKIE_KEY = "adminToken";
export const ADMIN_TOKEN_KEY = "aleman_admin_token";
export const ADMIN_USER_KEY = "aleman_admin_user";

export const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

export const getCookie = (name: string): string => {
  if (typeof document === "undefined") return "";

  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : "";
};

export const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
};

export const setAdminToken = (token: string, days = 7) => {
  setCookie(ADMIN_COOKIE_KEY, token, days);
  setCookie(LEGACY_COOKIE_KEY, token, days);
  setCookie("token", token, days);
  if (typeof window !== "undefined") {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  }
};

export const setAdminUser = (user: User) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
  }
};

export const getAdminUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem(ADMIN_USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
};

export const getAdminToken = (): string => {
  if (typeof window !== "undefined") {
    const ls = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (ls) return ls;
  }
  return (
    getCookie(ADMIN_COOKIE_KEY) ||
    getCookie(LEGACY_COOKIE_KEY) ||
    getCookie("token")
  );
};

export const removeAdminToken = () => {
  deleteCookie(ADMIN_COOKIE_KEY);
  deleteCookie(LEGACY_COOKIE_KEY);
  deleteCookie("token");
  if (typeof window !== "undefined") {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  }
};
