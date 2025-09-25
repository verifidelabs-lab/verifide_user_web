import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Loader from "../../pages/Loader/Loader";
import Header from "../Header/Header"; // can reuse same header
import PageNotFound from "../Not found/PageNotFound";
import CompanySidebar from "../Sidebar/CompanySidebar/CompanySidebar";
import CompanyDashboard from "../../pages/CompanyPanel/Dashboard/dashboard";
import CompanyProfile from "../../pages/CompanyPanel/CompanyProfile/CompanyProfile";
import Message from "../../pages/Message/Message";
import { useSelector } from "react-redux";
import { socketConnection } from "../utils/shocket";
import bellSound from "./uberx_request_tone.mp3";

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
    const isNotificationDisabledRef = useRef(false);
  
  const [navbarOpen, setNavbarOpen] = useState(true);
      const profileData = useSelector(state => state.auth);
  const socket = socketConnection();
useEffect(() => {

    socket?.on("connect", () => {
      console.log("✅ Connected to socket:", socket.id);
      socket.emit("notification_connected");
      socket.emit("mark-all-as-read");

      socket.on('notification_connected', data => {
        console.log(data.message)
      })

      socket.on('notification_custom', data => {
        playAndShowNotification(data)
      })
    });

  }, [profileData?.getProfileData?.data?.data?._id, socket])
 const playAndShowNotification = ({ title, message, body, redirectUrl }) => {
    // 1. Check for cooldown to prevent spamming notifications
    if (isNotificationDisabledRef.current) {
      // console.log("Notification sound is in cool down.");
      return;
    }

    const audio = new Audio(bellSound);

    // 2. Attempt to play the audio
    audio
      .play()
      .then(() => {
        // console.log('Audio played successfully');
        showNotification(title, message, body, redirectUrl);
      })
      .catch(error => {
        console.error('Error playing sound:', error);
        // 3. Handle specific autoplay policy errors gracefully
        if (error.name === 'NotAllowedError' || error.name === 'AbortError') {
          // console.log('Autoplay was prevented. Showing notification without sound.');
          showNotification(title, message, body, redirectUrl);
        } else {
          // 4. Fallback to a simple alert for other errors
          window.alert(`🔔 ${message}`);
        }
      });

    // Helper function to display the browser notification
    const showNotification = (title, message, body, redirectUrl) => {
      // Check if the browser supports notifications and if permission is granted
      if ("Notification" in window && window.Notification.permission === 'granted') {
        const notification = new window.Notification(title, {
          body: body || message,
          icon: '/favicon.ico',
        });
        notification.onclick = () => {
          if (redirectUrl) {
            window.open(redirectUrl, '_self');
          }
        };
      }
    };

    // 5. Set the cooldown after the notification attempt
    isNotificationDisabledRef.current = true;
    setTimeout(() => {
      isNotificationDisabledRef.current = false;
    }, 30000); // 30-second cooldown
  };

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
              <Route path="profile" element={<CompanyProfile />} />
              <Route path="/message/:id?/:isConnected?" element={<Message profileData={profileData} socket={socket} />} />

              {/*  <Route path="jobs" element={<ManageJobs />} />
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
