import React, {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import sideBarJson from "../Sidebar/Sidebar.json";
import Loader from "../../pages/Loader/Loader";
import { getProfile } from "../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { socketConnection } from "../utils/shocket";
import { getCookie } from "../utils/cookieHandler";
import Quest from "../../pages/Quest/Quest";
import Certificates from "../../pages/Certificates/Certificates";
import ForageCertificate from "../../pages/Certificates/ForageCertificate";
import ResumeCertificate from "../../pages/Certificates/ResumeCertificate";
import CreateCompany from "../../pages/CreateCompany/CreateCompany";
import CreatePost from "../../pages/Posts/components/CreatePost";
import CompanyInstituteView from "../../pages/ProfileView/CompanyInstituteView";
import CreateQuest from "../../pages/Quest/Components/CreateQuest";
import Index from "../../pages/Assessment/index";
import Home from "../../pages/Home/Home";
// import { connectNotificationSocket } from '../utils/globalFunction';
import bellSound from "./uberx_request_tone.mp3";
import { unreadCount } from "../../redux/Users/userSlice";
import { toast } from "sonner";
import RegisterCompany from "../../pages/RegisterCompany/RegisterCompany";
import RegisterInstitute from "../../pages/RegisterInstitute/RegisterInstitute";
import Companies from "../../pages/companies/Companies";
import Institution from "../../pages/Institution/Institution";
import { GiHamburgerMenu } from "react-icons/gi";
import Joyride, { EVENTS, STATUS } from "react-joyride";
import {
  assessmentTourSteps,
  coursesTourSteps,
  dashboardTourSteps,
  fullTourSteps,
  opportunitiesTourSteps,
} from "../../data/tutorialSteps";
import { useTour } from "../../context/TourContext";

const Sidebar = lazy(() => import("./../Sidebar/Sidebar"));
const Header = lazy(() => import("../Header/Header"));
const PageNotFound = lazy(() => import("../Not found/PageNotFound"));
const Profile = lazy(() => import("../../pages/Profile/Profile"));
const CareerGoal = lazy(() => import("../../pages/CareerGoal/CareerGoal"));
const Recommended = lazy(() =>
  import("../../pages/Course/Recommended/Recommended")
);
const CourseDetailPage = lazy(() =>
  import("../../pages/Course/CourseDetails/CourseDetails")
);
const Opportunitiess = lazy(() =>
  import("../../pages/Opportunitiess/Opportunitiess")
);
const Message = lazy(() => import("../../pages/Message/Message"));
const NotificationInterface = lazy(() =>
  import("../../pages/Notification/Notification")
);
const ActivityList = lazy(() =>
  import("../../pages/Activicty List/ActivityList")
);
const Verification = lazy(() =>
  import("../../pages/Verification/Verification")
);
const VerificationCategory = lazy(() =>
  import("../../pages/Verification/Components/VerificationCategory")
);
const TermsAndConditions = lazy(() =>
  import("../../pages/Terms & Conditions/TermsAndConditions")
);
const PostJob = lazy(() => import("../../pages/PostJob/PostJob"));
const ChangePassword = lazy(() =>
  import("../../pages/Password/ChangePassword")
);
const UsersProfile = lazy(() => import("../../pages/ProfileView/UsersProfile"));
const Posts = lazy(() => import("../../pages/Posts/Posts"));
const Opportunitiess2 = lazy(() =>
  import("../../pages/Opportunitiess/Opportunitiess2")
);
const Users = lazy(() => import("../../pages/users/Users"));
const Connections = lazy(() => import("../../pages/Connections/Connections"));

function Layout() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [navbarOpen, setNavbarOpen] = useState(true);
  const [setIsOpen] = useState(false);
  const profileData = useSelector((state) => state.auth);
  const socket = socketConnection();
  const [, setUserType] = useState("");
  const isNotificationDisabledRef = useRef(false);
  const [accessMode, setAccessMode] = useState(getCookie("ACCESS_MODE"));
  const [unreadCounts, setUnreadCounts] = useState({
    notifications: 0,
    messages: 0,
  });

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
      .catch((error) => {
        console.error("Error playing sound:", error);
        // 3. Handle specific autoplay policy errors gracefully
        if (error.name === "NotAllowedError" || error.name === "AbortError") {
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
      if (
        "Notification" in window &&
        window.Notification.permission === "granted"
      ) {
        const notification = new window.Notification(title, {
          body: body || message,
          icon: "/favicon.ico",
        });
        notification.onclick = () => {
          if (redirectUrl) {
            window.open(redirectUrl, "_self");
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
        const res = await dispatch(unreadCount()).unwrap();
        // console.log(res?.data)
        setUnreadCounts({
          notifications: res?.data?.notifications || 0,
          messages: res?.data?.messages || 0,
        });
      } catch (error) {
        toast.error(error);
      }
    };

    fetchUnreadCount();
  }, [location.pathname, dispatch]);

  useEffect(() => {
    socket?.on("connect", () => {
      console.log("✅ Connected to socket:", socket.id);
      socket.emit("notification_connected");
      socket.emit("mark-all-as-read");

      socket.on("notification_connected", (data) => {
        console.log("notification_connected ", data.message);
      });

      socket.on("notification_custom", (data) => {
        console.log("notification_custom:", data);

        playAndShowNotification(data);
      });
    });
  }, [profileData?.getProfileData?.data?.data?._id, socket]);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1000) {
        setNavbarOpen(false);
        setIsMobile(window.innerWidth < 1000);
      } else {
        setNavbarOpen(true);
        setIsMobile(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const restrictedPaths = [
    "/app/opportunities",
    "/user/terms-and-conditions",
    "/user/course/recommended",
    "/user/opportunitiess",
    "/user/opportunitiess/:id",
  ];

  // ✅ Use regex match instead of includes
  const isRestrictedPath = restrictedPaths.some((path) => {
    if (path.includes(":")) {
      // Convert Express-style :param to regex
      const regex = new RegExp("^" + path.replace(/:[^/]+/g, "[^/]+") + "$");
      return regex.test(location.pathname);
    }
    return path === location.pathname;
  });
  useEffect(() => {
    const handleStorageChange = () => {
      setAccessMode(getCookie("ACCESS_MODE"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if ("Notification" in window) {
      if (
        Notification.permission !== "granted" &&
        Notification.permission !== "denied"
      ) {
        Notification.requestPermission()
          .then((permission) => {
            console.log("Notification permission:", permission);
          })
          .catch((error) => {
            // console.error("Error requesting notification permission:", error);
          });
      }
    }
  }, []);
  const { steps, stepIndex, runTour, handleJoyrideCallback, setStepIndex } =
    useTour();
  return (
    <div className=" min-h-screen flex flex-col relative" id="layout-container">
      {!isMobile && (
        <Joyride
          steps={steps}
          run={runTour}
          stepIndex={stepIndex}
          continuous
          showSkipButton
          showProgress
          callback={handleJoyrideCallback}
          disableScrolling
          scrollToFirstStep
          styles={{
            options: { overlayColor: "rgba(0,0,0,0.5)", zIndex: 10000 },
          }}
          tooltipComponent={({
            step,
            backProps,
            primaryProps,
            closeProps,
            skipProps,
            index,
            size,
          }) => {
            return (
              <div
                className="custom-tooltip    inset-0 z-40 transition-all duration-300 ease-in-out hide-scrollbar glassy-card bg-opacity-30 glassy-card bg-opacity-30 backdrop-blur backdrop-blur-sm  p-4 flex flex-col gap-4 w-80"
                style={{
                  backgroundImage: 'url("/Group.png")',
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="step-number glassy-text-primary">
                    Step {index + 1} of {size}
                  </span>
                  <div className="flex gap-2">
                    <button
                      {...closeProps}
                      className="close-btn glassy-text-primary"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {step.title && (
                  <h3 className="tooltip-title glassy-text-primary font-semibold text-lg">
                    {step.title}
                  </h3>
                )}

                <p className="tooltip-content glassy-text-primary text-sm">
                  {step.content}
                </p>

                <div className="flex justify-between mt-2">
                  <button
                    {...skipProps}
                    className="skip-button  glassy-text-primary  "
                  >
                    Skip
                  </button>
                  <div className="flex justify-between">
                    {/* <button
                  {...backProps}
                  className="back-button glassy-button opacity-70 hover:opacity-100"
                >
                  Back
                </button> */}
                    <button
                      {...primaryProps}
                      className="next-button glassy-button"
                    >
                      {index === size - 1 ? "Finish" : "Next"}
                    </button>
                  </div>
                </div>
              </div>
            );
          }}
        />
      )}
      {runTour && !isMobile && (
        <div
          className="fixed inset-0 z-[9999]   cursor-not-allowed pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation(); // prevent event bubbling
            toast.error("⚠ Please complete the tour first!");
          }}
          onScroll={(e) => e.preventDefault()}
        />
      )}

      {/* Full-width Header */}
      <Header
        openLogout={openLogout}
        sideBarJson={sideBarJson}
        profileData={profileData?.getProfileData?.data?.data}
        setUserType={setUserType}
        playAndShowNotification={playAndShowNotification}
      />
      {/* Sidebar Toggle Button for Mobile */}
      {!navbarOpen && window.innerWidth <= 1000 && (
        <button
          className="fixed top-4 left-4 p-2 z-60 flex items-center justify-center rounded-md hover:glassy-card transition-all duration-300 hover:scale-110"
          onClick={() => setNavbarOpen(true)}
        >
          <GiHamburgerMenu className="text-xl glassy-text-primary" />
        </button>
      )}
      {/* Sidebar + Content stacked below header */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden p-0 md:p-5">
        {/* Sidebar */}
        {(!isRestrictedPath || isMobile) && (
          <div
            className={`
        fixed md:relative top-0 left-0 h-screen md:h-auto z-50
        transition-transform duration-300 ease-in-out
        ${
          navbarOpen ? "translate-x-0 w-72" : "translate-x-[-100%] w-72 md:w-20"
        }
      `}
          >
            <Sidebar
              openLogout={openLogout}
              setNavbarOpen={setNavbarOpen}
              navbarOpen={navbarOpen}
              profileData={profileData?.getProfileData?.data?.data}
              unreadCounts={unreadCounts}
            />
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto custom-scrollbar   md:transition-all md:duration-300">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route index element={<Navigate to="feed" replace />} />
              <Route path="feed/:postId?" element={<Home />} />
              <Route
                path="/profile"
                element={<Profile profileData={profileData} />}
              />
              <Route path="/career-goal/:id" element={<CareerGoal />} />
              <Route
                path="/verification"
                element={
                  <Verification
                    headline={
                      profileData?.getProfileData?.data?.data?.personalInfo
                        ?.headline
                    }
                  />
                }
              />
              <Route
                path="/message/:id?/:isConnected?"
                element={<Message profileData={profileData} socket={socket} />}
              />
              <Route path="/notification" element={<NotificationInterface />} />
              <Route path="/activity" element={<ActivityList />} />
              <Route
                path="/verification-category"
                element={
                  <VerificationCategory
                    profileData={
                      profileData?.getProfileData?.data?.data?.personalInfo
                    }
                  />
                }
              />
              <Route path="/post-job/:id?" element={<PostJob />} />
              <Route
                path="/terms-and-conditions"
                element={<TermsAndConditions />}
              />
              {/* <Route path="/feed" element={<Home />} /> */}
              <Route path="/course/recommended" element={<Recommended />} />
              <Route
                path="/course/course-details/:id"
                element={<CourseDetailPage />}
              />
              <Route
                path="/opportunitiess/:id?"
                element={
                  accessMode === "6" ? <Opportunitiess /> : <Opportunitiess2 />
                }
              />{" "}
              <Route path="/suggested-users" element={<Users />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/assessment/:token?" element={<Index />} />
              <Route
                path="/posts"
                element={<Posts profileData={profileData} />}
              />
              <Route
                path="/connections"
                element={<Connections profileData={profileData} />}
              />
              {/* For User details Page  */}
              <Route
                path="/profile/:first_name/*"
                element={
                  <UsersProfile
                    currentUserId={
                      profileData?.getProfileData?.data?.data?._id || null
                    }
                  />
                }
              />
              {/* For Company details Page  */}
              <Route
                path="/view-details/:name/:id"
                element={<CompanyInstituteView />}
              />
              <Route
                path="/quest"
                element={<Quest profileData={profileData} />}
              />
              <Route
                path="/quest/create-your-quest/:id?"
                element={<CreateQuest />}
              />
              <Route path="/certificates" element={<Certificates />} />
              <Route
                path="/forage-certificates"
                element={<ForageCertificate />}
              />
              {/* <Route path="/create-company" element={<CreateCompany />} /> */}
              <Route path="/create-company" element={<RegisterCompany />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/create-institute" element={<RegisterInstitute />} />
              <Route path="/institutions" element={<Institution />} />
              {/* <Route path="/create-institute" element={<RegisterInstitute />} /> */}
              <Route
                path="/resume/:username?"
                element={<ResumeCertificate />}
              />
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
