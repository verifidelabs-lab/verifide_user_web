import React, { lazy, Suspense, useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sonner";
import "react-medium-image-zoom/dist/styles.css";

import Login from "./pages/Login/Login";
import SignUp from "./pages/Sign Up/SignUp";

import ForgotPassword from "./pages/Forgot Password/ForgorPassword";

import PageNotFound from "./components/Not found/PageNotFound";

import { getCookie } from "./components/utils/cookieHandler";

// PublicRoute for pages like login/signup
const PublicRoute = ({ children, allowCompanyLogin = false }) => {
  const isAuthenticated = getCookie("VERIFIED_TOKEN");
 
  return children;
};
const App = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="glassy-app">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/create-account"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>

      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export default App;
