// Self-contained admin auth — no Supabase email confirmation required
// Credentials are verified locally; Supabase is only used for data (products, videos, etc.)

const ADMIN_EMAIL = "khalid.benbrahim.ma@hotmail.com";
const ADMIN_PASSWORD = "Chawni@Store2026";
const SESSION_KEY = "chawni_admin_v1";
const SESSION_VALUE = btoa(`${ADMIN_EMAIL}:authenticated:${Date.now()}`);

export function adminLogin(email: string, password: string): boolean {
  if (
    email.trim().toLowerCase() === ADMIN_EMAIL &&
    password === ADMIN_PASSWORD
  ) {
    sessionStorage.setItem(SESSION_KEY, "ok");
    return true;
  }
  return false;
}

export function adminLogout() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function isAdminSession(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "ok";
}

export const ADMIN_CREDENTIALS = {
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
};
