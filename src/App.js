import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import Login from "./pages/Login/Login";
import SignUp from "./pages/Sign Up/SignUp";
import EducationDetails from "./pages/Education Details/EducationDetails";
import WorkExperience from "./pages/Work Experince/WorkExperince";
import ForgotPassword from "./pages/Forgot Password/ForgorPassword";
import Layout from "./components/Layout/Layout";
import CompanyLayout from "./components/Layout/CompanyLayout";
import CompanyLogin from "./pages/CompanyPanel/Login/Login";
import PageNotFound from "./components/Not found/PageNotFound";

import Userpost from "./pages/Userpost";
import Userpost2 from "./pages/Userpost2";
import UserDetails from "./pages/UserDetails";
import UserCertificate from "./pages/UserCertificate";

import { getCookie } from "./components/utils/cookieHandler";
import CompanyDetails from "./pages/CompanyDetails";

const PostDetailsPage = lazy(() => import("./PostDetailsPage"));

// PrivateRoute for user panel
const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = getCookie("VERIFIED_TOKEN");
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" replace />;
};

// CompanyPrivateRoute for company panel
const CompanyPrivateRoute = ({ component: Component, ...rest }) => {
  const isUserAuthenticated = getCookie("VERIFIED_TOKEN");
  const isCompanyAuthenticated = getCookie("COMPANY_TOKEN");
  if (!isUserAuthenticated) return <Navigate to="/login" replace />;
  return isCompanyAuthenticated ? <Component {...rest} /> : <Navigate to="/company/login" replace />;
};

// PublicRoute for pages like login/signup
const PublicRoute = ({ children, allowCompanyLogin = false }) => {
  const isAuthenticated = getCookie("VERIFIED_TOKEN");
  if (isAuthenticated && !allowCompanyLogin) return <Navigate to="/user/feed" replace />;
  return children;
};

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* Root redirect */}
          <Route
            path="/"
            element={
              getCookie("VERIFIED_TOKEN") ? <Navigate to="/user/feed" replace /> : <Navigate to="/login" replace />
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
            path="/company/login"
            element={
              <PublicRoute allowCompanyLogin={true}>
                <CompanyLogin role="company" />
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

          {/* Private User Routes */}
          <Route path="/user/*" element={<PrivateRoute component={Layout} />} />
          <Route path="/education-details" element={<PrivateRoute component={EducationDetails} />} />
          <Route path="/work-experience" element={<PrivateRoute component={WorkExperience} />} />
          <Route path="/post-view/:id" element={<PrivateRoute component={Userpost} />} />
          <Route path="/post-view2" element={<PrivateRoute component={Userpost2} />} />
          <Route path="/user-details/:username/:id?" element={<PrivateRoute component={UserDetails} />} />
          <Route path="/company-details/:username/:id?" element={<PrivateRoute component={CompanyDetails} />} />
          <Route path="/certtificate-view/:id" element={<PrivateRoute component={UserCertificate} />} />
          <Route path="/post-view/:id" element={<PrivateRoute component={PostDetailsPage} />} />

          {/* Private Company Routes */}
          <Route path="/company/*" element={<CompanyPrivateRoute component={CompanyLayout} />} />

          {/* 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>

      <Toaster position="top-center" richColors closeButton />
    </>
  );
};

export default App;
