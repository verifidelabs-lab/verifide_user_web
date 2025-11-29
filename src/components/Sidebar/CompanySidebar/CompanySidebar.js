// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// // Icons
// import { GiHamburgerMenu } from "react-icons/gi";
// import {
//   BiChevronRight,
//   BiMessageDetail,
//   BiSolidDashboard,
// } from "react-icons/bi";

// import { FaRegBuilding, FaUsers, FaUsersCog } from "react-icons/fa";
// import { TbHttpConnect } from "react-icons/tb";
// import { PiSealCheckLight } from "react-icons/pi";
// import { BsChevronRight } from "react-icons/bs";
// import { FaSignsPost } from "react-icons/fa6";

// const pulseAnimation = `
//   @keyframes pulse2 {
//     0% {
//       transform: scale(0.95);
//       box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
//     }
//     70% {
//       transform: scale(1);
//       box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
//     }
//     100% {
//       transform: scale(0.95);
//       box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
//     }
//   }
// `;

// const CompanySidebar = ({ navbarOpen, setNavbarOpen, unreadCounts }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isMobile, setIsMobile] = useState(false);
//   const [openSubmenu, setOpenSubmenu] = useState(null);
//   const [isClosing, setIsClosing] = useState(false);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 1000);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const onClickMenu = (path) => {
//     navigate(path);
//     if (isMobile) handleCloseSidebar();
//   };

//   const handleCloseSidebar = () => {
//     setIsClosing(true);
//     setTimeout(() => {
//       setNavbarOpen(false);
//       setIsClosing(false);
//     }, 300);
//   };

//   const toggleSubmenu = (label) => {
//     setOpenSubmenu(openSubmenu === label ? null : label);
//   };

//   const companySidebarData = [
//     { icon: BiSolidDashboard, label: "Dashboard", path: "/company" },
//     { icon: FaSignsPost, label: "Page Posts", path: "/company/posts-manage" },
//     { icon: BiMessageDetail, label: "Inbox", path: "/company/message" },
//     {
//       icon: PiSealCheckLight,
//       label: "Verification",
//       path: "/company/verification",
//     },
//     { icon: FaRegBuilding, label: "Company Profile", path: "/company/profile" },
//     { icon: TbHttpConnect, label: "Connection", path: "/company/connections" },

//     { icon: FaUsers, label: "Admin Roles", path: "/company/admin-role" },




//   ];

//   const companiesProfileData = useSelector(
//     (state) => state.companyAuth?.companiesProfileData?.data?.data || {}
//   );
//   console.log("This is sdfkjsdf", companiesProfileData);
//   return (
//     <>
//       <style>{pulseAnimation}</style>

//       {navbarOpen && isMobile && (
//         <div
//           className="fixed inset-0 glassy-card bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
//           onClick={handleCloseSidebar}
//         />
//       )}

//       {/* Hamburger button */}
//       <button
//         className={`${navbarOpen ? "hidden" : "flex"
//           } fixed top-4 left-4 p-2 z-40 glassy-card hover:glassy-card transition-all duration-300 hover:scale-110`}
//         onClick={() => setNavbarOpen(true)}
//       >
//         <GiHamburgerMenu className="text-xl glassy-text-primary" />
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`fixed left-0 top-0 h-screen w-72 flex-col glassy-card shadow-xl z-50 transform transition-all duration-300 ease-in-out ${navbarOpen
//           ? isClosing
//             ? "-translate-x-full"
//             : "translate-x-0"
//           : "-translate-x-full"
//           }`}
//       >


//         {/* Sidebar Menu */}
//         <nav className="flex-1 overflow-y-auto mt-4 pb-6 p-2">
//           <div className="w-full border-[#E8E8E8] border rounded-[10px] mx-auto glassy-card shadow-sm overflow-hidden">
//             <div className="flex justify-center items-center gap-2 p-2">
//               <div>
//                 <div className="w-12 h-12 rounded-full glassy-card flex items-center justify-center text-lg overflow-hidden font-semibold text-zinc-600">
//                   <img
//                     src={
//                       companiesProfileData?.logo_url
//                     }
//                     alt="dummy logo"
//                     onError={(e) => {
//                       e.currentTarget.onerror = null;
//                       e.currentTarget.src = "/companylogo.png"; // fallback image
//                     }}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <h3 className="glassy-text-primary text-base font-semibold">
//                   {companiesProfileData?.display_name}
//                 </h3>
//                 <p className="text-xs glassy-text-primary font-medium ">
//                   {companiesProfileData?.email}
//                 </p>

//               </div>
//               <div>
//                 <BsChevronRight
//                   className="glassy-text-primary cursor-pointer"
//                   onClick={() => navigate(`/company/profile`)}
//                 />
//               </div>
//             </div>
//           </div>

//           {companySidebarData.map((item, idx) => {
//             const hasUnread =
//               item.label === "Notifications" && unreadCounts?.notifications > 0;

//             return (
//               <div key={idx} className="mb-1">
//                 {item.children ? (
//                   <>
//                     <div
//                       className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-300 rounded-lg mx-2 hover:glassy-card hover:text-blue-600 ${openSubmenu === item.label
//                         ? "glassy-card text-blue-600"
//                         : "glassy-text-primary"
//                         }`}
//                       onClick={() => toggleSubmenu(item.label)}
//                     >
//                       <div className="flex items-center gap-3">
//                         <item.icon
//                           className={`text-base transition-colors duration-300 ${openSubmenu === item.label
//                             ? "text-blue-600"
//                             : "glassy-text-primary"
//                             }`}
//                         />
//                         <span>{item.label}</span>
//                       </div>
//                       <BiChevronRight
//                         className={`text-lg transition-transform duration-300 ${openSubmenu === item.label ? "rotate-90" : ""
//                           }`}
//                       />
//                     </div>

//                     {openSubmenu === item.label && (
//                       <div className="ml-10 mt-1 space-y-1">
//                         {item.children.map((child, childIdx) => (
//                           <div
//                             key={childIdx}
//                             className={`cursor-pointer text-sm py-2 px-3 rounded-md transition-all duration-300 ${location.pathname === child.path
//                               ? "text-blue-600 font-medium"
//                               : "glassy-text-primary hover:glassy-card hover:text-blue-600"
//                               }`}
//                             onClick={() => onClickMenu(child.path)}
//                           >
//                             {child.label}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </>
//                 ) : (
//                   <div
//                     className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-300 rounded-lg mx-2 ${location.pathname === item.path
//                       ? "text-blue-600"
//                       : "glassy-text-primary hover:glassy-card hover:text-blue-600"
//                       }`}
//                     onClick={() => onClickMenu(item.path)}
//                   >
//                     <item.icon
//                       className={`text-lg rounded-full transition-colors duration-300 ${location.pathname === item.path
//                         ? "text-blue-500"
//                         : "glassy-text-primary"
//                         } ${hasUnread ? "animate-[pulse_2s_infinite]" : ""}`}
//                       style={
//                         hasUnread ? { animation: "pulse2 2s infinite" } : {}
//                       }
//                     />
//                     <span className="text-sm">{item.label}</span>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </nav>
//       </div>
//     </>
//   );
// };

// export default CompanySidebar;
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Icons
import { GiHamburgerMenu } from "react-icons/gi";
import {
  BiChevronRight,
  BiMessageDetail,
  BiSolidDashboard,
} from "react-icons/bi";
import { FaRegBuilding, FaUsers, FaUsersCog, FaUniversity } from "react-icons/fa";
import { TbHttpConnect } from "react-icons/tb";
import { PiSealCheckLight } from "react-icons/pi";
import { BsChevronRight } from "react-icons/bs";
import { FaSignsPost } from "react-icons/fa6";
import { getCookie } from "../../utils/cookieHandler";
import { useGlobalKeys } from "../../../context/GlobalKeysContext";
import { MdEmojiEvents, MdWork } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";

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

const CompanySidebar = ({ navbarOpen, setNavbarOpen, unreadCounts, companiesProfileData,
  instituteProfileData,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const {
    token,
    role,
    activeMode,
    isAssignedUser,
    isCompany,
    isInstitution,
    isUser,
    updateToken,
    updateRole,
    updateActiveMode,
    updateIsAssignedUser,
    clearAll,
  } = useGlobalKeys();
  const userRole = Number(getCookie("ROLE"));

  const ROLES = {
    SUPER_ADMIN: 1,
    ADMIN: 2,
    COMPANIES: 3,
    INSTITUTIONS: 4,
    STUDENT: 5,
    RECRUITERS: 6,
    COMPANIES_ADMIN: 7,
    INSTITUTIONS_ADMIN: 8,
  };

  // ✅ Fetch data conditionally

  const profileData = [ROLES.COMPANIES, ROLES.COMPANIES_ADMIN].includes(userRole)
    ? companiesProfileData
    : [ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)
      ? instituteProfileData
      : {};

  const basePath = useMemo(() => (isInstitution() ? "/institution" : "/company"), [isInstitution()]);


  const sidebarData = [
    { icon: BiSolidDashboard, label: "Dashboard", path: `${basePath}` },
    { icon: FaSignsPost, label: "Page Posts", path: `${basePath}/posts-manage` },
    { icon: BiMessageDetail, label: "Inbox", path: `${basePath}/message` },
    { icon: PiSealCheckLight, label: "Verification", path: `${basePath}/verification` },
    { icon: MdWork, label: "Opportunities", path: `${basePath}/opportunities` },
    { icon: MdEmojiEvents, label: "Quest", path: `${basePath}/quest` },
    {
      icon: isInstitution() ? FaUniversity : FaRegBuilding,
      label: isInstitution() ? "Institute Profile" : "Company Profile",
      path: `${basePath}/profile`,
    },
     {
          icon: IoIosNotificationsOutline,
          label: "Notification",
          path: `${basePath}/notification`,
        },
    { icon: TbHttpConnect, label: "Connection", path: `${basePath}/connections` },
    { icon: FaUsers, label: "Admin Roles", path: `${basePath}/admin-role` },
  ];

  // ✅ Responsive handling
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

  return (
    <>
      <style>{pulseAnimation}</style>

      {/* Overlay for mobile */}
      {navbarOpen && isMobile && (
        <div
          className="fixed inset-0 glassy-card bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
          onClick={handleCloseSidebar}
        />
      )}


      {/* Optional Close Button */}
      {isMobile && (
        <button
          className="absolute top-4 right-4 text-xl p-1 hover:scale-110 glassy-text-primary"
          onClick={handleCloseSidebar}
        >
          ✕
        </button>
      )}
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-72 flex-col glassy-card shadow-xl z-50 transform transition-transform duration-300 ease-in-out
          ${navbarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >


        <nav className="flex-1 overflow-y-auto mt-4 pb-6 p-2 ">
          {/* Profile Header */}
          <div className="w-full border-[#E8E8E8] border rounded-[10px] mx-auto glassy-card shadow-sm overflow-hidden mb-5">
            <div className="flex justify-around items-center gap-2 p-2 ">
              <div>
                <div className="w-12 h-12 rounded-full glassy-card flex items-center justify-around text-lg overflow-hidden font-semibold text-zinc-600">
                  <img
                    src={profileData?.logo_url}
                    key={profileData?.logo_url}
                    alt="profile logo"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = isInstitution()
                        ? "/institutionlogo.png"
                        : "/0684456b-aa2b-4631-86f7-93ceaf33303c.png";
                    }}
                  />
                </div>
              </div>
              <div>
                <h3 className="glassy-text-primary text-base font-semibold truncate max-w-[120px]">
                  {profileData?.display_name}
                </h3>
                <p className="text-xs glassy-text-primary font-medium truncate max-w-[120px]">
                  {profileData?.email}
                </p>
              </div>
              <div>
                <BsChevronRight
                  className="glassy-text-primary cursor-pointer"
                  onClick={() => navigate(`${basePath}/profile`)}
                />
              </div>
            </div>
          </div>

          {/* Sidebar Menu */}
          {sidebarData.map((item, idx) => {
            const isMobileHiddenLabel = ["Courses", "Opportunities", "Assessment", "Quest"].includes(item.label);
            const hasUnread =
              item.label === "Notifications" && unreadCounts?.notifications > 0;

            return (
              <div key={idx} className={`mb-1 ${
                  isMobileHiddenLabel ? "lg:hidden block" : ""
                }`}>
                {item.children ? (
                  <>
                    <div
                      className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-300 rounded-lg mx-2 hover:glassy-card hover:text-blue-600  ${isMobileHiddenLabel ? "lg:hidden block" : ""} ${openSubmenu === item.label
                        ? "glassy-card text-blue-600"
                        : "glassy-text-primary"
                        }`}
                      onClick={() => toggleSubmenu(item.label)}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={`text-base transition-colors duration-300 ${openSubmenu === item.label
                            ? "text-blue-600"
                            : "glassy-text-primary"
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
                              ? "text-blue-600 font-medium glassy-button"
                              : "glassy-text-primary hover:glassy-card hover:text-blue-600"
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
                      ? "text-blue-600 glassy-button !rounded"
                      : "glassy-text-primary hover:glassy-card hover:text-blue-600"
                      }`}
                    onClick={() => onClickMenu(item.path)}
                  >
                    <item.icon
                      className={`text-lg rounded-full transition-colors duration-300 ${location.pathname === item.path
                        ? "glassy-text-primary"
                        : "glassy-text-primary"
                        } ${hasUnread ? "animate-[pulse2_2s_infinite]" : ""}`}
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
