import React, { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import sideBarJson from "../Sidebar/Sidebar.json";
import Loader from '../../pages/Loader/Loader';
import { getProfile } from '../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { socketConnection } from '../utils/shocket';
import { getCookie } from '../utils/cookieHandler';
import Quest from '../../pages/Quest/Quest';
import Certificates from '../../pages/Certificates/Certificates';
import ForageCertificate from '../../pages/Certificates/ForageCertificate';
import ResumeCertificate from '../../pages/Certificates/ResumeCertificate';
import CreateCompany from '../../pages/CreateCompany/CreateCompany';
import CreatePost from '../../pages/Posts/components/CreatePost';
import CompanyInstituteView from '../../pages/ProfileView/CompanyInstituteView';
import CreateQuest from '../../pages/Quest/Components/CreateQuest';
import Index from '../../pages/Assessment/index';
import Home from '../../pages/Home/Home';
// import { connectNotificationSocket } from '../utils/globalFunction';
import bellSound from "./uberx_request_tone.mp3";
import { unreadCount } from '../../redux/Users/userSlice';
import { toast } from 'sonner';
import RegisterCompany from '../../pages/RegisterCompany/RegisterCompany';
import RegisterInstitute from '../../pages/RegisterInstitute/RegisterInstitute';

const Sidebar = lazy(() => import('./../Sidebar/Sidebar'));
const Header = lazy(() => import('../Header/Header'));
const PageNotFound = lazy(() => import('../Not found/PageNotFound'));
const Profile = lazy(() => import('../../pages/Profile/Profile'));
const CareerGoal = lazy(() => import('../../pages/CareerGoal/CareerGoal'));
const Recommended = lazy(() => import('../../pages/Course/Recommended/Recommended'));
const CourseDetailPage = lazy(() => import('../../pages/Course/CourseDetails/CourseDetails'));
const Opportunitiess = lazy(() => import('../../pages/Opportunitiess/Opportunitiess'));
const Message = lazy(() => import('../../pages/Message/Message'));
const NotificationInterface = lazy(() => import('../../pages/Notification/Notification'));
const ActivityList = lazy(() => import('../../pages/Activicty List/ActivityList'));
const Verification = lazy(() => import('../../pages/Verification/Verification'));
const VerificationCategory = lazy(() => import('../../pages/Verification/Components/VerificationCategory'));
const TermsAndConditions = lazy(() => import('../../pages/Terms & Conditions/TermsAndConditions'));
const PostJob = lazy(() => import('../../pages/PostJob/PostJob'));
const ChangePassword = lazy(() => import('../../pages/Password/ChangePassword'));
const UsersProfile = lazy(() => import('../../pages/ProfileView/UsersProfile'));
const Posts = lazy(() => import('../../pages/Posts/Posts'));
const Opportunitiess2 = lazy(() => import('../../pages/Opportunitiess/Opportunitiess2'));
const Users = lazy(() => import('../../pages/users/Users'));
const Connections = lazy(() => import('../../pages/Connections/Connections'))

function Layout() {
  const location = useLocation()
  const dispatch = useDispatch()
  const [navbarOpen, setNavbarOpen] = useState(true);
  const [setIsOpen] = useState(false);
  const profileData = useSelector(state => state.auth);
  const socket = socketConnection();
  const [, setUserType] = useState("")
  const isNotificationDisabledRef = useRef(false);
  const [accessMode, setAccessMode] = useState(getCookie("ACCESS_MODE"));
  const [unreadCounts, setUnreadCounts] = useState({ notifications: 0, messages: 0 });


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

  const openLogout = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await dispatch(unreadCount()).unwrap()
        // console.log(res?.data)
        setUnreadCounts({
          notifications: res?.data?.notifications || 0,
          messages: res?.data?.messages || 0,
        });
      } catch (error) {
        toast.error(error)
      }
    }

    fetchUnreadCount()

  }, [location.pathname, dispatch]);

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

  useEffect(() => {
    dispatch(getProfile())
  }, [dispatch])

  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1500) {
        setNavbarOpen(false);
      } else {
        setNavbarOpen(true)
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setAccessMode(getCookie("ACCESS_MODE"));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission()
          .then(permission => {
            console.log("Notification permission:", permission);
          })
          .catch(error => {
            // console.error("Error requesting notification permission:", error);
          });
      }
    }
  }, []);

  return (
    <div className='flex  overflow-hidden  '>
      {
        (location.pathname !== '/app/opportunities' && location.pathname !== '/user/terms-and-conditions') && (location.pathname !== '/user/course/recommended' && location.pathname !== "/user/opportunitiess") && (
          <div className={`h-full ${navbarOpen ? "w-72 absolute md:relative transition ease-in-out delay-150" : "w-0 "}`}>
            <Sidebar openLogout={openLogout} setNavbarOpen={setNavbarOpen} navbarOpen={navbarOpen} profileData={profileData?.getProfileData?.data?.data}
              unreadCounts={unreadCounts} />
          </div>
        )
      }
      <div className={`flex flex-col  ${navbarOpen ? " flex-1  " : "w-full"} overflow-hidden`}>
        <Header openLogout={openLogout} sideBarJson={sideBarJson} profileData={profileData?.getProfileData?.data?.data} setUserType={setUserType} playAndShowNotification={playAndShowNotification} />
        <main className='flex-1 overflow-auto custom-scrollbar  bg-[#F6FAFD]'>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route index element={<Navigate to="feed" replace />} />
              <Route path="feed" element={<Home />} />
              <Route path="/profile" element={<Profile profileData={profileData} />} />
              <Route path="/career-goal/:id" element={<CareerGoal />} />
              <Route path="/verification" element={<Verification headline={profileData?.getProfileData?.data?.data?.personalInfo?.headline} />} />
              <Route path="/message/:id?/:isConnected?" element={<Message profileData={profileData} socket={socket} />} />
              <Route path="/notification" element={<NotificationInterface />} />
              <Route path="/activity" element={<ActivityList />} />
              <Route path="/verification-category" element={<VerificationCategory profileData={profileData?.getProfileData?.data?.data?.personalInfo}/>} />
              <Route path="/post-job/:id?" element={<PostJob />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              {/* <Route path="/feed" element={<Home />} /> */}
              <Route path="/course/recommended" element={<Recommended />} />
              <Route path="/course/course-details/:id" element={<CourseDetailPage />} />
              <Route path="/opportunitiess" element={accessMode === '6' ? < Opportunitiess /> : <Opportunitiess2 />} /> :
              <Route path="/suggested-users" element={<Users />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/assessment/:token?" element={<Index />} />
              <Route path="/posts" element={<Posts profileData={profileData} />} />
              <Route path="/connections" element={<Connections profileData={profileData} />} />
              <Route path="/profile/:first_name/*" element={<UsersProfile currentUserId={profileData?.getProfileData
                ?.data?.data?._id || null} />} />
              <Route path="/view-details/:name/:id" element={<CompanyInstituteView />} />
              <Route path="/quest" element={<Quest profileData={profileData} />} />
              <Route path="/quest/create-your-quest/:id?" element={<CreateQuest />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/forage-certificates" element={<ForageCertificate />} />
              {/* <Route path="/create-company" element={<CreateCompany />} /> */}
              <Route path="/create-company" element={<RegisterCompany />} />
              <Route path="/create-institute" element={<RegisterInstitute />} />
              <Route path="/resume/:username?" element={<ResumeCertificate />} />
              <Route path="/create-post" element={<CreatePost />} />

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>


        </main>
      </div>
    </div>
  );
}

export default Layout;