import React, { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Loader from "../../pages/Loader/Loader";
import Header from "../Header/Header"; // can reuse same header
import PageNotFound from "../Not found/PageNotFound";
import CompanySidebar from "../Sidebar/CompanySidebar/CompanySidebar";
import CompanyDashboard from "../../pages/CompanyPanel/Dashboard/dashboard";
// import Posts from "../../pages/CompanyPanel/PostsManagement/Posts";

// // lazy load company pages
// const CompanyDashboard = lazy(() => import("../../pages/Company/Dashboard"));
// const CompanyProfile = lazy(() => import("../../pages/Company/Profile"));
// const ManageJobs = lazy(() => import("../../pages/Company/Jobs/ManageJobs"));
// const PostJob = lazy(() => import("../../pages/Company/Jobs/PostJob"));
// const Applicants = lazy(() => import("../../pages/Company/Applicants/Applicants"));
// const Settings = lazy(() => import("../../pages/Company/Settings/Settings"));

function CompanyLayout() {
  const location = useLocation();
  const [navbarOpen, setNavbarOpen] = useState(true);

  return (
    <div className="flex overflow-hidden">
      <div className={`h-full ${navbarOpen ? "w-72" : "w-0"} transition-all`}>
        <CompanySidebar navbarOpen={navbarOpen} setNavbarOpen={setNavbarOpen} />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header setNavbarOpen={setNavbarOpen} />
        <main className="flex-1 overflow-auto bg-[#F6FAFD]">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<CompanyDashboard />} />
              {/* <Route path="post" element={<Posts />} /> */}
              {/* <Route path="profile" element={<CompanyProfile />} />
              <Route path="jobs" element={<ManageJobs />} />
              <Route path="jobs/post" element={<PostJob />} />
              <Route path="applicants" element={<Applicants />} />
              <Route path="settings" element={<Settings />} /> */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default CompanyLayout;
