import React, { lazy, Suspense, useContext, useEffect } from "react";
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
import PublicLayout from "./components/Layout/PublicLayout/PublicLayout";
import CompanyInstituteView from "./pages/ProfileView/CompanyInstituteView";
import { ThemeContext } from "./context/ThemeContext";
import { ROLE_CODES } from "./context/GlobalKeysContext";
import { TourProvider } from "./context/TourContext";
import TermsAndConditions from "./pages/Terms & Conditions/TermsAndConditions";

const PostDetailsPage = lazy(() => import("./PostDetailsPage"));

const PrivateRoute = ({ component: Component, ...rest }) => {
  const location = useLocation();

  const userToken = getCookie("VERIFIED_TOKEN");
  const token = getCookie("TOKEN");
  const role = getCookie("ROLE");

  // 🚫 If no tokens at all → go to login
  if (!userToken && !token) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  // 🏫 If institution logged in and has token
  if (role === ROLE_CODES.institution && token) {
    return <Navigate to="/institution" replace />;
  }

  // 🏢 If company logged in and has token
  if (role === ROLE_CODES.company && token) {
    return <Navigate to="/company" replace />;
  }

  // 👤 If user logged in (only VERIFIED_TOKEN)
  if (userToken) {
    return <Component {...rest} />;
  }

  // 🚫 Default (fallback)
  return (
    <Navigate
      to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
      replace
    />
  );
};

// CompanyPrivateRoute for company panel
const CompanyPrivateRoute = ({ component: Component, ...rest }) => {
  const isUserAuthenticated = getCookie("VERIFIED_TOKEN");
  const isCompanyAuthenticated = getCookie("TOKEN");
  const location = useLocation();

  if (!isUserAuthenticated) return <Navigate to="/login" replace />;

  if (!isCompanyAuthenticated) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return <Component {...rest} />;
};

// PublicRoute for pages like login/signup
const PublicRoute = ({ children, allowCompanyLogin = false }) => {
  const isAuthenticated = getCookie("VERIFIED_TOKEN");
  if (isAuthenticated && !allowCompanyLogin)
    return <Navigate to="/user/feed" replace />;
  return children;
};
const App = () => {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="glassy-app min-h-screen">
      <Router>
        <Routes>
          {/* Root redirect */}
          <Route
            path="/"
            element={
              getCookie("VERIFIED_TOKEN") ? (
                <Navigate to="/user/feed" replace />
              ) : (
                <Navigate to="/login" replace />
              )
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
            path="/terms-and-conditions"
            element={
              <PublicRoute>
                  <TermsAndConditions />
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
          <Route path="/certtificate-view/:id" element={<UserCertificate />} />

          <Route
            path="/user-details/:username/:id?"
            element={
              <PublicLayout>
                <UserDetails />
              </PublicLayout>
            }
          />
          <Route
            path="/company-details/:name/:id"
            element={
              <PublicLayout>
                <CompanyInstituteView />
              </PublicLayout>
            }
          />

          <Route
            path="/post-view/:id"
            element={
              <PublicLayout>
                <Userpost />
              </PublicLayout>
            }
          />

          {/* Private User Routes */}
          <Route
            path="/user/*"
            element={
              <TourProvider>
                <PrivateRoute component={Layout} />
              </TourProvider>
            }
          />
          <Route
            path="/education-details"
            element={<PrivateRoute component={EducationDetails} />}
          />
          <Route
            path="/work-experience"
            element={<PrivateRoute component={WorkExperience} />}
          />
          <Route
            path="/post-view/:id"
            element={<PrivateRoute component={Userpost} />}
          />
          <Route
            path="/post-view2"
            element={<PrivateRoute component={Userpost2} />}
          />
          <Route path="/post-view/:id" element={<PostDetailsPage />} />
          <Route
            path="/company-details/:username/:id?"
            element={<PrivateRoute component={CompanyDetails} />}
          />
          <Route
            path="/certtificate-view/:id"
            element={<PrivateRoute component={UserCertificate} />}
          />
          <Route
            path="/post-view/:id"
            element={<PrivateRoute component={PostDetailsPage} />}
          />

          {/* Private Company Routes */}
          <Route
            path="/company/*"
            element={<CompanyPrivateRoute component={CompanyLayout} />}
          />
          <Route
            path="/institution/*"
            element={<CompanyPrivateRoute component={CompanyLayout} />}
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
