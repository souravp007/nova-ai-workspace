import { STORAGE_KEYS } from "../config/api.js";

export const getStoredAuth = () => {
  const accessToken = localStorage.getItem(STORAGE_KEYS.accessToken);
  const rawUser = localStorage.getItem(STORAGE_KEYS.user);

  return {
    accessToken,
    user: rawUser ? JSON.parse(rawUser) : null,
  };
};

export const persistAuth = ({ accessToken, user }) => {
  if (accessToken) {
    localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
  }
  if (user) {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  }
};

export const clearStoredAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.accessToken);
  localStorage.removeItem(STORAGE_KEYS.user);
};
