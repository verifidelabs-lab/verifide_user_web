import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BiMessageDetail, BiChevronRight } from "react-icons/bi";
import { FaFileContract, FaRegUser } from "react-icons/fa";
import { PiSealCheckLight } from "react-icons/pi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { FaSignsPost } from "react-icons/fa6";
import {
  MdHome,
  MdSchool,
  MdAssignment,
  MdWork,
  MdEmojiEvents,
} from "react-icons/md";
import { TbHttpConnect } from "react-icons/tb";
import { GiHamburgerMenu } from "react-icons/gi";
import ProfileCard from "../ui/cards/ProfileCard";
import { useSelector } from "react-redux";
import { getCookie } from "../utils/cookieHandler";

const pulseAnimation = `
  @keyframes pulse2 {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
  }
`;

const Sidebar = ({ navbarOpen, setNavbarOpen, unreadCounts }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1000);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCloseSidebar = () => {
    setNavbarOpen(false);
    setOpenSubmenu(null);
  };

  const onClickMenu = (path) => {
    navigate(path);
    if (isMobile) handleCloseSidebar();
  };

  const toggleSubmenu = (label) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  const mode = getCookie("ACCESS_MODE");

  const rawSidebarData = [
    { icon: MdHome, label: "Highlights", path: "/user/feed" },
    { icon: FaRegUser, label: "Profile", path: "/user/profile" },
    {
      icon: PiSealCheckLight,
      label: "Verification",
      path: "/user/verification",
    },
    { icon: MdSchool, label: "Courses", path: "/user/course/recommended" },
    { icon: MdAssignment, label: "Assessment", path: "/user/assessment" },
    { icon: MdWork, label: "Opportunities", path: "/user/opportunitiess" },
    { icon: MdEmojiEvents, label: "Quest", path: "/user/quest" },
    { icon: BiMessageDetail, label: "Message", path: "/user/message" },
    { icon: FaSignsPost, label: "Posts", path: "/user/posts" },
    {
      icon: IoIosNotificationsOutline,
      label: "Notification",
      path: "/user/notification",
    },
    { icon: TbHttpConnect, label: "Connection", path: "/user/connections" },
    {
      icon: CiSettings,
      label: "Settings",
      children: [
        {
          icon: FaFileContract,
          label: "Terms and Conditions",
          path: "/user/terms-and-conditions",
        },
      ],
    },
  ];

  const sidebarData = rawSidebarData.filter((item) =>
    mode === "5" && item.label === "Posts" ? false : true
  );
  const { personalInfo } = useSelector(
    (state) => state.auth.getProfileData?.data?.data || {}
  );

  return (
    <>
      <style>{pulseAnimation}</style>

      {/* Overlay for mobile */}
      {/* {navbarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={handleCloseSidebar}
        />
      )} */}

      {/* Hamburger button */}
      {!navbarOpen && isMobile && (
        <button
          className="fixed top-4 left-4 p-2 z-50 flex items-center justify-center hover:glassy-card transition-all duration-300 hover:scale-110"
          onClick={() => setNavbarOpen(true)}
        >
          <GiHamburgerMenu className="text-xl glassy-text-primary" />
        </button>
      )}

      {/* Sidebar */}
      {/* <div
        className={`fixed left-0 top-0 h-screen w-72 flex-col glassy-card shadow-xl z-50 transform transition-transform duration-300 ease-in-out
          ${navbarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      > */}
      <div
        className={`fixed left-0 top-0 h-screen w-72 flex-col glassy-card shadow-xl z-50 transform transition-transform duration-300 ease-in-out
    ${navbarOpen ? "translate-x-0" : "-translate-x-full"}
    
  `}
      >
        {/* Optional Close Button */}
        {isMobile && (
          <button
            className="absolute top-4 right-4 text-xl p-1 hover:scale-110 glassy-text-primary"
            onClick={handleCloseSidebar}
          >
            ✕
          </button>
        )}
        <nav className="flex-1 overflow-y-auto mt-4 pb-6 p-2">
          <ProfileCard data={personalInfo} />

          {sidebarData.map((item, idx) => {
            const isMobileHiddenLabel = [
              "Courses",
              "Opportunities",
              "Assessment",
              "Quest",
            ].includes(item.label);
            const hasUnread =
              (item.label === "Message" && unreadCounts?.messages > 0) ||
              (item.label === "Notification" &&
                unreadCounts?.notifications > 0);

            return (
              <div
                key={idx}
                className={`mb-1 ${
                  isMobileHiddenLabel ? "lg:hidden block" : ""
                }`}
              >
                {item.children ? (
                  <>
                    <div
                      className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-300 rounded-lg mx-2 hover:glassy-card hover:text-blue-600 ${
                        openSubmenu === item.label
                          ? " text-blue-600"
                          : "glassy-text-primary"
                      }`}
                      onClick={() => toggleSubmenu(item.label)}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={`text-base font-normal transition-colors duration-300 ${
                            openSubmenu === item.label
                              ? "text-blue-600"
                              : "glassy-text-primary"
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      <BiChevronRight
                        className={`text-lg transition-transform duration-300 ${
                          openSubmenu === item.label ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                    {openSubmenu === item.label && (
                      <div className="ml-10 mt-1 space-y-1 glassy-text-primary">
                        {item.children.map((child, childIdx) => (
                          <div
                            key={childIdx}
                            onClick={() => onClickMenu(child.path)}
                            className={`text-base font-normal transition-colors  duration-300 ${
                              openSubmenu === child.label
                                ? "text-blue-600"
                                : "glassy-text-primary hover:glassy-card hover:text-blue-600"
                            }`}
                          >
                            <span>{child.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-300 rounded-lg mx-2 ${
                      location.pathname === item.path
                        ? " glassy-button !rounded text-blue-600"
                        : "glassy-text-primary hover:glassy-card hover:text-blue-600"
                    }`}
                    onClick={() => onClickMenu(item.path)}
                  >
                    <item.icon
                      className={`text-lg rounded-full transition-colors duration-300 ${
                        location.pathname === item.path
                          ? "glassy-text-primary"
                          : "glassy-text-primary"
                      } ${hasUnread ? "animate-[pulse_2s_infinite]" : ""}`}
                      style={
                        hasUnread ? { animation: "pulse2 2s infinite" } : {}
                      }
                    />
                    <span className="text-sm">{item.label}</span>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
