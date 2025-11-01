
/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, useState, lazy, useEffect, useMemo } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './../Sidebar/Sidebar';
import Loader from '../../pages/Loader/Loader';
import { getCookie } from '../../components/utils/cookieHandler';
import { useDispatch, useSelector } from 'react-redux';
import { adminProfile, companiesProfile, instituteProfile } from '../../redux/CompanySlices/CompanyAuth';


import bellSound from "./uberx_request_tone.mp3";
import { useRef } from 'react';
import { socketConnection } from '../utils/shocket';
import CompanyProfile from '../../pages/CompanyPanel/CompanyProfile/CompanyProfile';
import CompanyDashboard from '../../pages/CompanyPanel/Dashboard/dashboard';
import CompanySidebar from '../Sidebar/CompanySidebar/CompanySidebar';
import Message from '../../pages/Message/Message';
import Header from '../CompanyAdmin/Header/Header';
import Courses from '../../pages/CompanyPanel/CourseManagement/Courses/Courses';
import CourseCategory from '../../pages/CompanyPanel/CourseManagement/CourseCategory/CourseCategory';
import Opportunities from '../../pages/Opportunitiess/Opportunitiess';
import PendingRequests from '../../pages/CompanyPanel/RequestManagement/PendingRequests/PendingRequests';
import NotificationInterface from '../../pages/CompanyPanel/Notitifcation/Notification';
import PostJob from '../../pages/CompanyPanel/PostJob/PostJob';
import Posts from '../../pages/CompanyPanel/PostsManagement/Posts';
import CreatePost from '../../pages/CompanyPanel/PostsManagement/CreatePost';
import Quest from '../../pages/Quest/Quest';
import CreateQuest from '../../pages/Quest/Components/CreateQuest';
import AdminRoles from '../../pages/CompanyPanel/AdminRoles/AdminRoles';
import Users from '../../pages/users/Users';
import UsersProfile from '../../pages/ProfileView/UsersProfile';
import Connections from '../../pages/Connections/Connections';
import CompanyInstituteView from '../../pages/ProfileView/CompanyInstituteView';
import Index from '../../pages/Assessment';
import Recommended from '../../pages/Course/Recommended/Recommended';

const PageNotFound = lazy(() => import('../Not found/PageNotFound'));


const ROLES = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  COMPANIES: 3,
  COMPANIES_ADMIN: 7,
  INSTITUTIONS: 4,
  INSTITUTIONS_ADMIN: 8
};

function CompanyLayout() {
  const [navbarOpen, setNavbarOpen] = useState(true);
  const userRole = Number(getCookie("ROLE"));
  const dispatch = useDispatch();
  const isNotificationDisabledRef = useRef(false);
  const socket = socketConnection();
  const [refreshedConfigurations, setRefreshedConfigurations] = useState(false)
  const companiesProfileData = useSelector(
    (state) => state.companyAuth?.companiesProfileData?.data?.data || {}
  );
  const instituteProfileData = useSelector(
    (state) => state.companyAuth?.instituteProfileData?.data?.data || {}
  );
  console.log("this is the companiespfsdkjlsdklskdfjlskdjf;aoierowieurowieuroweir", companiesProfileData, instituteProfileData)
  const playAndShowNotification = ({ title, message, body, redirectUrl }) => {
    if (isNotificationDisabledRef.current) {
      console.log("Notification sound is in cool down.");
      return;
    }
    const audio = new Audio(bellSound);
    audio
      .play()
      .then(() => {
        console.log('Audio played successfully');
        showNotification(title, message, body, redirectUrl);
      })
      .catch(error => {
        console.error('Error playing sound:', error);
        if (error.name === 'NotAllowedError' || error.name === 'AbortError') {
          console.log('Autoplay was prevented. Showing notification without sound.');
          showNotification(title, message, body, redirectUrl);
        } else {
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
  }





  useEffect(() => {
    const fetchData = async () => {
      if (userRole == ROLES.COMPANIES || userRole == ROLES.COMPANIES_ADMIN) {
        await dispatch(companiesProfile())
      } else if (userRole == ROLES.INSTITUTIONS || userRole == ROLES.INSTITUTIONS_ADMIN) {
        await dispatch(instituteProfile())
      }
    };

    fetchData();
  }, [dispatch, userRole]);

  useEffect(() => {

    socket?.on("connect", () => {
      console.log("✅ Connected to socket:", socket.id);
      socket.emit("notification_connected");

      socket.on('notification_connected', data => {
        console.log(data.message)
      })

      socket.on('refreshed-configurations', () => {
        console.log("---hitted")
        setRefreshedConfigurations(!refreshedConfigurations)
      })

      socket.on('notification_custom', data => {
        playAndShowNotification(data)
      })
    });

  }, [socket])

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission()
          .then(permission => {
            console.log("Notification permission:", permission);
          })
          .catch(error => {
            console.error("Error requesting notification permission:", error);
          });
      }
    }
  }, []);

  const location = useLocation()

  return (
    <div className=" min-h-screen flex flex-col ">
      <Header companiesProfileData={companiesProfileData} instituteProfileData={instituteProfileData} />
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden p-5">
        {location.pathname !== "/company/opportunities" && location.pathname !== "/institution/opportunities" && location.pathname !== "/institution/course/recommended" && <div
          className={`transition-all duration-300 ${navbarOpen ? 'md:w-72 w-full' : 'w-0 md:w-20'
            }`}
        >
          <CompanySidebar navbarOpen={navbarOpen} setNavbarOpen={setNavbarOpen} companiesProfileData={companiesProfileData} instituteProfileData={instituteProfileData} />
        </div>}
        <main className='flex-1 overflow-auto custom-scrollbar  '>
          <Suspense fallback={<Loader />}>
            <Routes>
              {(
                <>
                  <Route path={`/`} element={<CompanyDashboard companiesProfileData={companiesProfileData} instituteProfileData={instituteProfileData} role={userRole}/>} />
                  <Route path={`/admin-role`} element={<AdminRoles />} />
                  <Route path="profile" element={<CompanyProfile companiesProfileData={companiesProfileData} instituteProfileData={instituteProfileData} />} />
                  <Route path="/message/:id?/:isConnected?" element={<Message profileData={companiesProfileData} socket={socket} />} />
                  <Route path="/opportunities" element={< Opportunities />} />
                  <Route path="/suggested-users" element={<Users />} />
                  <Route path="/post-job/:id?" element={<PostJob companiesProfileData={companiesProfileData} />} />
                  <Route path={`verification`} element={<PendingRequests />} />
                  <Route path={`courses`} element={<Courses />} />
                  <Route path={`course-categories`} element={<CourseCategory />} />
                  <Route path={`posts-manage`} element={<Posts companiesProfileData={companiesProfileData} instituteProfileData={instituteProfileData} />} />
                  <Route path={`create-post`} element={<CreatePost />} />
                  <Route path={`notification`} element={<NotificationInterface />} />
                  <Route path="/quest" element={<Quest profileData={companiesProfileData} />} />
                  <Route path="/quest/create-your-quest/:id?" element={<CreateQuest />} />
                  <Route path="/connections" element={<Connections profileData={companiesProfileData} />} />
                  <Route path="/view-details/:name/:id" element={<CompanyInstituteView />} />
                  <Route path="/profile/:first_name/*" element={<UsersProfile currentUserId={companiesProfileData._id || null} />} />
                  <Route path="/assessment/:token?" element={<Index />} />
                  <Route path="/course/recommended" element={<Recommended />} />

                </>
              )}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default CompanyLayout;
