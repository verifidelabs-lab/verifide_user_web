import React, {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import sideBarJson from "./Sidebar/Sidebar.json";
import { useDispatch, useSelector } from "react-redux";
 

const Sidebar = lazy(() => import("./Sidebar/Sidebar"));
const Header = lazy(() => import("./Header/Header"));
const PageNotFound = lazy(() => import("../../Not found/PageNotFound"));

function PublicLayout({ children }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const [navbarOpen, setNavbarOpen] = useState(true);
  const [setIsOpen] = useState(false);
 
  const [unreadCounts, setUnreadCounts] = useState({
    notifications: 0,
    messages: 0,
  });

  const openLogout = () => {
    setIsOpen(true);
  };

  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1500) {
        setNavbarOpen(false);
      } else {
        setNavbarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

 
  return (
    <div className="flex  overflow-hidden  ">
      {
        <div
          className={`h-full ${
            navbarOpen
              ? "w-72 absolute md:relative transition ease-in-out delay-150"
              : "w-0 "
          }`}
        >
          <Sidebar
            openLogout={openLogout}
            setNavbarOpen={setNavbarOpen}
            navbarOpen={navbarOpen}
            // profileData={profileData?.getProfileData?.data?.data}
            unreadCounts={unreadCounts}
          />
        </div>
      }
      <div
        className={`flex flex-col  ${
          navbarOpen ? " flex-1  " : "w-full"
        } overflow-hidden`}
      >
        <Header
          openLogout={openLogout}
          sideBarJson={sideBarJson}
        //   profileData={profileData?.getProfileData?.data?.data}
        //   setUserType={setUserType}
        //   playAndShowNotification={playAndShowNotification}
        />
        <main className="flex-2 overflow-auto custom-scrollbar  bg-[#F6FAFD]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default PublicLayout;