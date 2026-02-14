import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getStoredToken,
  getStoredUser,
  setStoredAuth,
  clearStoredAuth,
  login as loginApi,
  signup as signupApi,
} from "../services/AuthService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = getStoredToken();
    const u = getStoredUser();
    if (t && u) {
      setToken(t);
      setUser(u);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const data = await loginApi(username, password);
    const userInfo = { userId: data.userId, username: data.username, email: data.email };
    setToken(data.token);
    setUser(userInfo);
    setStoredAuth(data.token, userInfo);
    return data;
  };

  const signup = async (username, email, password) => {
    const data = await signupApi(username, email, password);
    const userInfo = { userId: data.userId, username: data.username, email: data.email };
    setToken(data.token);
    setUser(userInfo);
    setStoredAuth(data.token, userInfo);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    clearStoredAuth();
  };

  const value = { user, token, loading, login, signup, logout, isAuthenticated: !!token };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
