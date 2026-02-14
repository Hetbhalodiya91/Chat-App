import axios from "axios";
import { getStoredToken } from "../services/AuthService";

export const baseURL = "http://localhost:8080";
export const httpClient = axios.create({
  baseURL,
});

httpClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

httpClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("chat_token");
      localStorage.removeItem("chat_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);