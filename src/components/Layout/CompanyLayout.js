
/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, useState, lazy, useEffect, useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './../Sidebar/Sidebar';
import Header from '../Header/Header';
import Loader from '../../pages/Loader/Loader';
import { getCookie } from '../../components/utils/cookieHandler';
import { useDispatch, useSelector } from 'react-redux';
import { adminProfile, companiesProfile, instituteProfile } from '../../redux/slices/authSlice';
import Posts from '../../pages/PostsManagement/Posts';
import NotificationInterface from '../../pages/Notitifcation/Notification';
import CreatePost from '../../pages/PostsManagement/CreatePost';
import bellSound from "./uberx_request_tone.mp3";
import { useRef } from 'react';
import { socketConnection } from '../utils/socket';
import UserPermissions from '../../pages/Admin/Users/UserPermissions';
import CompanyProfile from '../../pages/CompanyPanel/CompanyProfile/CompanyProfile';
import CompanyDashboard from '../../pages/CompanyPanel/Dashboard/dashboard';


// Lazy load components
const Dashboard = lazy(() => import('../../pages/Dashboard/Dashboard'));
// const UserModule = lazy(() => import('../../pages/Admin/Users/UserModule'));
// const Companies = lazy(() => import('../../pages/Admin/companies/Companies'));
// const Badge = lazy(() => import('../../pages/Admin/Badge/Badge'));
// const SkillsSuggestion = lazy(() => import('../../pages/Admin/Skills/SkillsSuggestion'));
// const InstituteType = lazy(() => import('../../pages/Admin/industry/InstituteType'));
// const Industry = lazy(() => import('../../pages/Admin/industry/Industry'));
// const ProfileRole = lazy(() => import('../../pages/Admin/Users/ProfileRole'));
// const Degree = lazy(() => import('../../pages/College/Degree/Degree'));
// const Institution = lazy(() => import('../../pages/College/Institution/Institution'));
// const FieldsOfStudy = lazy(() => import('../../pages/College/Fields Of Study/FieldsOfStudy'));
// const QuestionBank = lazy(() => import('../../pages/College/Question Bank/QuestionBank'));
// const AdminUsers = lazy(() => import('../../pages/Admin/Users/AdminUsers'));
// const Level = lazy(() => import('../../pages/Admin/Level/Level'));
const PageNotFound = lazy(() => import('../Not found/PageNotFound'));
const ApprovedRequests = lazy(() => import('../../pages/RequestManagement/ApprovedRequests/ApprovedRequests'));
// const PendingRequests = lazy(() => import('../../pages/RequestManagement/PendingRequests/PendingRequests'));
// const RejectedRequests = lazy(() => import('../../pages/RequestManagement/RejectedRequests/RejectedRequests'));
// const Assessments = lazy(() => import('../../pages/AssessmentsManagement/Assessments/Assessments'));
// const ResultManagement = lazy(() => import('../../pages/AssessmentsManagement/ResultManagement/ResultManagement'));
// const CourseCategory = lazy(() => import('../../pages/CourseManagement/CourseCategory/CourseCategory'));
// const Courses = lazy(() => import('../../pages/CourseManagement/Courses/Courses'));
// const Profile = lazy(() => import('../../pages/Profile/Profile'));
const UpdateProfile = lazy(() => import('../../pages/CompanyPanel/UpdateProfile'));
// const TNCManagement = lazy(() => import('../../pages/CmsManagement/TNCManagement'));
// const PrivacyPolicies = lazy(() => import('../../pages/CmsManagement/PrivacyPolicies'));
// const PromotionBanners = lazy(() => import('../../pages/PromotionsBanners/PromotionBanners'));
// const PostsManagement = lazy(() => import('../../pages/PostsManagement/PostsManagement'));
// const ContentPolicies = lazy(() => import('../../pages/CmsManagement/ContentPoilcies'));
// const CmsContent = lazy(() => import('../../pages/CmsManagement/CmsContent'));

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
  const userRole = Number(getCookie("USER_ROLE"));
  const dispatch = useDispatch();
  const isNotificationDisabledRef = useRef(false);
  const socket = socketConnection();
  const [refreshedConfigurations, setRefreshedConfigurations] = useState(false)


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


  const getBasePath = () => {
    switch (userRole) {
      case ROLES.SUPER_ADMIN:
      case ROLES.ADMIN:
        return "admin";
      case ROLES.COMPANIES:
      case ROLES.COMPANIES_ADMIN:
        return "companies";
      case ROLES.INSTITUTIONS:
      case ROLES.INSTITUTIONS_ADMIN:
        return "institute";
      default:
        return "admin";
    }
  };

  const basePath = getBasePath();

  const [adminProfileData, setAdminProfileData] = useState({});
  const [companiesProfileData, setCompanyProfileData] = useState({});
  const [instituteProfileData, setinstituteProfileData] = useState({});
  const [, setModuleName] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (userRole === ROLES.ADMIN || userRole === ROLES.SUPER_ADMIN) {
        await dispatch(adminProfile()).then((res) => {
          if (res?.payload?.data) {
            setAdminProfileData(res?.payload?.data)
          }
        })
      } else if (userRole === ROLES.COMPANIES || userRole === ROLES.COMPANIES_ADMIN) {
        await dispatch(companiesProfile()).then((res) => {
          if (res?.payload?.data) {
            setCompanyProfileData(res?.payload?.data)
          }
        })
      } else if (userRole === ROLES.INSTITUTIONS || userRole === ROLES.INSTITUTIONS_ADMIN) {
        await dispatch(instituteProfile()).then((res) => {
          if (res?.payload?.data) {
            setinstituteProfileData(res?.payload?.data)
          }
        })
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


  const selector = useSelector(state => state.user);
  const permissions = selector?.getAllModulePermissionData?.data?.data;
  const modulePermissions = useMemo(() => {
    const permMap = {};
    if (permissions && permissions.length) {
      permissions?.forEach(perm => {
        if (perm.module_code && perm.module_code.module_code) {
          permMap[perm.module_code.module_code] = perm;
        }
      });
    }
    return permMap;
  }, [permissions]);

  const getModulePermission = (moduleCode) => {
    return modulePermissions[moduleCode] || null;
  };


  return (
    <div className='flex h-screen overflow-hidden'>
      <div className={`h-full ${navbarOpen ? "w-64 absolute md:relative transition ease-in-out delay-150" : "w-0"}`}>
        <CompanySidebar navbarOpen={navbarOpen} setNavbarOpen={setNavbarOpen} />
      </div>

      <div className={`flex flex-col ${navbarOpen ? "flex-1" : "w-full"} overflow-hidden`}>
        <Header setNavbarOpen={setNavbarOpen} />
        <main className='flex-1 overflow-auto'>
          <Suspense fallback={<Loader />}>
            <Routes>
              {/* <Route index element={<Navigate to={`${basePath}/dashboard`} replace />} /> */}
              <Route path={`${basePath}/dashboard`} element={<Dashboard role={basePath} />} />

              {/* Routes for Super Admin and Admin */}
              {/* {(userRole === ROLES.SUPER_ADMIN || userRole === ROLES.ADMIN) && (
                <>

                  <Route path={`${basePath}/users`} element={<UserModule />} />
                  <Route path={`${basePath}/companies`} element={<Companies />} />
                  <Route path={`${basePath}/industry`} element={<Industry />} />
                  <Route path={`${basePath}/institute-type`} element={<InstituteType />} />
                  <Route path={`${basePath}/badge`} element={<Badge />} />
                  <Route path={`${basePath}/skills`} element={<SkillsSuggestion />} />
                  <Route path={`${basePath}/profile-role`} element={<ProfileRole />} />
                  <Route path={`${basePath}/degree`} element={<Degree />} />
                  <Route path={`${basePath}/institute`} element={<Institution />} />
                  <Route path={`${basePath}/fields-of-study`} element={<FieldsOfStudy />} />
                  <Route path={`${basePath}/question-bank`} element={<QuestionBank />} />
                  <Route path={`${basePath}/admin-users`} element={<AdminUsers />} />
                  <Route path={`${basePath}/levels`} element={<Level />} />
                  <Route path={`${basePath}/approved-requests`} element={<ApprovedRequests />} />
                  <Route path={`${basePath}/pending-requests`} element={<PendingRequests />} />
                  <Route path={`${basePath}/reject-requests`} element={<RejectedRequests />} />
                  <Route path={`${basePath}/assessments`} element={<Assessments />} />
                  <Route path={`${basePath}/results`} element={<ResultManagement />} />
                  <Route path={`${basePath}/courses`} element={<Courses />} />
                  <Route path={`${basePath}/course-categories`} element={<CourseCategory />} />
                  <Route path={`${basePath}/profile`} element={<Profile adminProfileData={adminProfileData} companiesProfileData={companiesProfileData} instituteProfileData={instituteProfileData} />} />
                  <Route path={`${basePath}/update-profile`} element={<UpdateProfile adminProfileData={adminProfileData} companiesProfileData={companiesProfileData} instituteProfileData={instituteProfileData} />} />
                  <Route path={`${basePath}/cms/terms-and-conditions`} element={<TNCManagement />} />
                  <Route path={`${basePath}/cms/privacy-policies`} element={<PrivacyPolicies />} />
                  <Route path={`${basePath}/cms-content2/:id`} element={<ContentPolicies />} />
                  <Route path={`${basePath}/cms-content/:id`} element={<CmsContent />} />
                  <Route path={`${basePath}/promotions`} element={<PromotionBanners />} />
                  <Route path={`${basePath}/posts`} element={<PostsManagement />} />
                  <Route path={`${basePath}/notification`} element={<NotificationInterface />} />
                  <Route path={`${basePath}/permissions/:id`} element={<UserPermissions />} />
                </>
              )} */}

              {/* Routes for Companies and Companies Admin */}
              {(userRole === ROLES.COMPANIES || userRole === ROLES.COMPANIES_ADMIN) && (
                <>
                  <Route path="dashboard" element={<CompanyDashboard />} />
                  {/* <Route path="post" element={<Posts />} /> */}
                  <Route path="profile" element={<CompanyProfile />} />
                  <Route path="/message/:id?/:isConnected?" element={<Message profileData={profileData} socket={socket} />} />

                  <Route path={`${basePath}/profile`} element={<Profile adminProfileData={adminProfileData} companiesProfileData={companiesProfileData} instituteProfileData={instituteProfileData} />} />
                  {/* <Route path={`${basePath}/admin-users`} element={<AdminUsers />} /> */}
                  <Route path={`${basePath}/approved-requests`} element={<ApprovedRequests />} />
                  {/* <Route path={`${basePath}/pending-requests`} element={<PendingRequests />} />
                  <Route path={`${basePath}/reject-requests`} element={<RejectedRequests />} /> */}
                  {/* <Route path={`${basePath}/assessments`} element={<Assessments />} />
                  <Route path={`${basePath}/results`} element={<ResultManagement />} />
                  <Route path={`${basePath}/courses`} element={<Courses />} />
                  <Route path={`${basePath}/course-categories`} element={<CourseCategory />} /> */}
                  <Route path={`${basePath}/update-profile`} element={<UpdateProfile adminProfileData={adminProfileData} companiesProfileData={companiesProfileData} instituteProfileData={instituteProfileData} />} />
                  <Route path={`${basePath}/posts-manage`} element={<Posts companiesProfileData={companiesProfileData} instituteProfileData={instituteProfileData} />} />
                  <Route path={`${basePath}/notification`} element={<NotificationInterface />} />
                  <Route path={`${basePath}/create-post`} element={<CreatePost />} />
                </>
              )}

              {/* Routes for Institutions and Institutions Admin */}
              {/* {(userRole === ROLES.INSTITUTIONS || userRole === ROLES.INSTITUTIONS_ADMIN) && (
                <>
                  <Route path={`${basePath}/profile`} element={<Profile adminProfileData={adminProfileData} companiesProfileData={companiesProfileData} instituteProfileData={instituteProfileData} />} />
                  <Route path={`${basePath}/admin-users`} element={<AdminUsers />} />
                  <Route path={`${basePath}/approved-requests`} element={<ApprovedRequests />} />
                  <Route path={`${basePath}/pending-requests`} element={<PendingRequests />} />
                  <Route path={`${basePath}/reject-requests`} element={<RejectedRequests />} />
                  <Route path={`${basePath}/assessments`} element={<Assessments />} />
                  <Route path={`${basePath}/results`} element={<ResultManagement />} />
                  <Route path={`${basePath}/courses`} element={<Courses />} />
                  <Route path={`${basePath}/course-categories`} element={<CourseCategory />} />
                  <Route path={`${basePath}/update-profile`} element={<UpdateProfile adminProfileData={adminProfileData} companiesProfileData={companiesProfileData} instituteProfileData={instituteProfileData} />} />
                  <Route path={`${basePath}/posts-manage`} element={<Posts companiesProfileData={companiesProfileData} instituteProfileData={instituteProfileData} />} />
                  <Route path={`${basePath}/notification`} element={<NotificationInterface />} />
                  <Route path={`${basePath}/create-post`} element={<CreatePost />} />
                </>
              )} */}

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default CompanyLayout;
