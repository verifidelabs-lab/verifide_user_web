import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Icons
import { GiHamburgerMenu } from "react-icons/gi";
import { BiChevronRight, BiMessageDetail, BiSolidDashboard } from "react-icons/bi";
import { MdWork, MdPeople, MdSettings, MdAnalytics, MdEvent } from "react-icons/md";
import { FaRegBuilding, FaUsersCog } from "react-icons/fa";
import { IoIosNotificationsOutline } from "react-icons/io";
import { TbReportAnalytics } from "react-icons/tb";
import ProfileCard from "../../ui/cards/ProfileCard";


const pulseAnimation = `
  @keyframes pulse2 {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
    }
  }
`;

const CompanySidebar = ({ navbarOpen, setNavbarOpen, unreadCounts }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1000);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onClickMenu = (path) => {
    navigate(path);
    if (isMobile) handleCloseSidebar();
  };

  const handleCloseSidebar = () => {
    setIsClosing(true);
    setTimeout(() => {
      setNavbarOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const toggleSubmenu = (label) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  const companySidebarData = [
    { icon: BiSolidDashboard, label: "Dashboard", path: "/company/dashboard" },
    { icon: FaRegBuilding, label: "Company Profile", path: "/company/profile" },
    { icon: BiMessageDetail, label: "Message", path: "/company/message" },

    {
      icon: MdWork,
      label: "Jobs",
      children: [
        { label: "Post a Job", path: "/company/jobs/create" },
        { label: "Manage Jobs", path: "/company/jobs" },
        { label: "Applications", path: "/company/applications" },
      ],
    },
    {
      icon: MdPeople,
      label: "Employees",
      children: [
        { label: "Employee List", path: "/company/employees" },
        { label: "Invite Employees", path: "/company/employees/invite" },
        { label: "Roles & Permissions", path: "/company/employees/roles" },
      ],
    },
    {
      icon: TbReportAnalytics,
      label: "Reports & Analytics",
      children: [
        { label: "Job Reports", path: "/company/reports/jobs" },
        { label: "Hiring Metrics", path: "/company/reports/hiring" },
      ],
    },
    { icon: MdEvent, label: "Events", path: "/company/events" },
    { icon: IoIosNotificationsOutline, label: "Notifications", path: "/company/notifications" },
    {
      icon: MdSettings,
      label: "Settings",
      children: [
        { label: "Company Settings", path: "/company/settings" },
        { label: "Billing", path: "/company/settings/billing" },
        { label: "Integrations", path: "/company/settings/integrations" },
      ],
    },
  ];

  const { companyInfo } = useSelector(
    (state) => state.company?.profileData?.data?.data || {}
  );

  return (
    <>
      <style>{pulseAnimation}</style>

      {navbarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
          onClick={handleCloseSidebar}
        />
      )}

      {/* Hamburger button */}
      <button
        className={`${navbarOpen ? "hidden" : "flex"
          } fixed top-4 left-4 p-2 z-40 bg-white hover:bg-gray-100 transition-all duration-300 hover:scale-110`}
        onClick={() => setNavbarOpen(true)}
      >
        <GiHamburgerMenu className="text-xl text-black" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-72 flex-col bg-white shadow-xl z-50 transform transition-all duration-300 ease-in-out ${navbarOpen
          ? isClosing
            ? "-translate-x-full"
            : "translate-x-0"
          : "-translate-x-full"
          }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 relative">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="logo"
              className="h-8 transition-transform duration-300 hover:scale-105"
              onClick={() => navigate(`/company/dashboard`)}
            />
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 overflow-y-auto mt-4 pb-6 p-2">
          <ProfileCard data={companyInfo} />

          {companySidebarData.map((item, idx) => {
            const hasUnread =
              (item.label === "Notifications" && unreadCounts?.notifications > 0);

            return (
              <div key={idx} className="mb-1">
                {item.children ? (
                  <>
                    <div
                      className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-300 rounded-lg mx-2 hover:bg-blue-50 hover:text-blue-600 ${openSubmenu === item.label
                        ? "bg-blue-50 text-blue-600"
                        : "text-[#000000E6]"
                        }`}
                      onClick={() => toggleSubmenu(item.label)}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={`text-base transition-colors duration-300 ${openSubmenu === item.label
                            ? "text-blue-600"
                            : "text-[#000000E6]"
                            }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      <BiChevronRight
                        className={`text-lg transition-transform duration-300 ${openSubmenu === item.label ? "rotate-90" : ""
                          }`}
                      />
                    </div>

                    {openSubmenu === item.label && (
                      <div className="ml-10 mt-1 space-y-1">
                        {item.children.map((child, childIdx) => (
                          <div
                            key={childIdx}
                            className={`cursor-pointer text-sm py-2 px-3 rounded-md transition-all duration-300 ${location.pathname === child.path
                              ? "text-blue-600 font-medium"
                              : "text-[#000000E6] hover:bg-gray-100 hover:text-blue-600"
                              }`}
                            onClick={() => onClickMenu(child.path)}
                          >
                            {child.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-300 rounded-lg mx-2 ${location.pathname === item.path
                      ? "text-blue-600"
                      : "text-[#000000E6] hover:bg-gray-100 hover:text-blue-600"
                      }`}
                    onClick={() => onClickMenu(item.path)}
                  >
                    <item.icon
                      className={`text-lg rounded-full transition-colors duration-300 ${location.pathname === item.path
                        ? "text-blue-500"
                        : "text-[#000000E6]"
                        } ${hasUnread ? "animate-[pulse_2s_infinite]" : ""}`}
                      style={hasUnread ? { animation: "pulse2 2s infinite" } : {}}
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

export default CompanySidebar;
