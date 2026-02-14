window.global = window;
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import AppRoutes from "./config/Routes.jsx";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Toaster />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
