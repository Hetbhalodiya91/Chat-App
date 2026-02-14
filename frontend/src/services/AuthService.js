import { httpClient } from "../config/AxiosHelper";

const TOKEN_KEY = "chat_token";
const USER_KEY = "chat_user";

export const signup = async (username, email, password) => {
  const { data } = await httpClient.post("/api/v1/auth/signup", {
    username,
    email,
    password,
  });
  return data;
};

export const login = async (username, password) => {
  const { data } = await httpClient.post("/api/v1/auth/login", {
    username,
    password,
  });
  return data;
};

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export const getStoredUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};
export const setStoredAuth = (token, user) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
};
export const clearStoredAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
