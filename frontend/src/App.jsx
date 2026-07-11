import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./features/auth/AuthLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import WorkspacePage from "./pages/WorkspacePage.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import GuestRoute from "./routes/GuestRoute.jsx";

const getInitialTheme = () => {
  const storedTheme = localStorage.getItem("nova-theme");
  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const isDarkMode = theme === "dark";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDarkMode);
    document.body.classList.toggle("dark", isDarkMode);
    root.style.colorScheme = theme;
    localStorage.setItem("nova-theme", theme);
  }, [isDarkMode, theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute>
            <AuthLayout isDarkMode={isDarkMode} onToggleTheme={toggleTheme}>
              <LoginPage />
            </AuthLayout>
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <AuthLayout isDarkMode={isDarkMode} onToggleTheme={toggleTheme}>
              <RegisterPage />
            </AuthLayout>
          </GuestRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <WorkspacePage isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
