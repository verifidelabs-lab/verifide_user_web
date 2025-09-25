import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Toaster } from 'sonner';

import Login from "./pages/Login/Login";
import SignUp from "./pages/Sign Up/SignUp";
import EducationDetails from "./pages/Education Details/EducationDetails";
import WorkExperience from "./pages/Work Experince/WorkExperince";
import ForgotPassword from "./pages/Forgot Password/ForgorPassword";
import Layout from "./components/Layout/Layout";
import PageNotFound from "./components/Not found/PageNotFound";
import AuthLayout from "./components/ui/AuthLayout";
import { getCookie } from "./components/utils/cookieHandler";
import Userpost from "./pages/Userpost";
import UserDetails from "./pages/UserDetails";
import UserCertificate from "./pages/UserCertificate";
import Userpost2 from "./pages/Userpost2";
import CompanyLayout from "./components/Layout/CompanyLayout";

const PostDetailsPage = lazy(() => import("./PostDetailsPage"));

// PrivateRoute component
const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = getCookie("VERIFIED_TOKEN");
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" replace />;
};

// PublicRoute component
const PublicRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? <Navigate to="/user/feed" replace /> : children;
};
const App = () => {
  const isAuthenticated = getCookie("VERIFIED_TOKEN");

  return (
    <>
      <Router>
        <Routes>

          {/* Redirect root to login or dashboard based on auth */}
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/user/feed" : "/login"} replace />
            }
          />

          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute isAuthenticated={isAuthenticated}>
                <Login />
              </PublicRoute>
            }
          />
          {/* <Route
            path="/post-view/:id"
            element={
              <PublicRoute >
                <PostDetailsPage />
              </PublicRoute>
            }
          /> */}


          <Route
            path="/postView/:id"
            element={<Userpost />}
          />

          <Route
            path="/postView2"
            element={<Userpost2 />}
          />
          <Route
            path="/certtificate-view/:id"
            element={<UserCertificate />}
          />


          <Route
            path="/user-details/:username/:id?"
            element={<UserDetails />}
          />

          <Route
            path="/post-view/:id"
            element={<PostDetailsPage />}
          />

          <Route
            path="/create-account"
            element={
              <PublicRoute isAuthenticated={isAuthenticated}>
                <SignUp />
              </PublicRoute>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <PublicRoute isAuthenticated={isAuthenticated}>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          <Route
            path="/auth"
            element={
              <PublicRoute isAuthenticated={isAuthenticated}>
                <AuthLayout />
              </PublicRoute>
            }
          />

          {/* Private Routes */}
          <Route path="/user/*" element={<PrivateRoute component={Layout} />} />
          <Route path="/company/*" element={<PrivateRoute component={CompanyLayout} />} />

          <Route path="/education-details" element={<PrivateRoute component={EducationDetails} />} />

          <Route path="/work-experience" element={<PrivateRoute component={WorkExperience} />} />

          <Route
            path="/user/post/view/:id"
            element={<Userpost />}
          />

          {/* 404 Route */}
          <Route path="*" element={<PageNotFound />} />

        </Routes>
      </Router>

      <Toaster position="top-center" richColors closeButton />
    </>
  );
};

export default App;
