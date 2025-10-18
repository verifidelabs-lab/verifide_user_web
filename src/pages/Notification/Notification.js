/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { BiBell, BiFilterAlt, BiSearch } from "react-icons/bi";
import { BsMailbox } from "react-icons/bs";
import { CiLock } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import {
  notificationsList,
  notificationsMarkAllRead,
  notificationsMarkAsRead,
} from "../../redux/Users/userSlice";
import { useNavigate } from "react-router-dom";
import CustomToggle from "../../components/ui/Toggle/CustomToggle";

// Notification type mappings
const NOTIFICATION_TYPES = {
  "Profile Completion": "profile-completion",
  "Skill Updates": "skill-updates",
  "Identity Verification": "identity-verification",
  "Education Verification": "education-verification",
  "Employment Verification": "employment-verification",
  "Project Verification": "project-verification",
  "Certificate Verification": "certificate-verification",
  "Course Progress": "course-progress",
  "Assessments Progress": "assessments-progress",
};

// Icon mapping based on notification type
const getIconForType = (type) => {
  switch (type) {
    case "profile-completion":
    case "identity-verification":
    case "education-verification":
    case "employment-verification":
    case "project-verification":
    case "certificate-verification":
      return { Icon: CiLock, color: "bg-blue-500" };
    case "skill-updates":
    case "course-progress":
    case "assessments-progress":
      return { Icon: BiBell, color: "bg-orange-500" };
    default:
      return { Icon: BsMailbox, color: "bg-purple-500" };
  }
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
const parseNotificationTitle = (title) => {
  const typeMatch = title.match(/\[\[type:(.*?)\]\]/);
  const eventMatch = title.match(/\[\[event:(.*?)\]\]/);
  const companyMatch = title.match(/\[\[company:(.*?)\]\]/);

  return {
    cleanTitle: title.replace(/\[\[.*?\]\]/g, "").trim(),
    type: typeMatch ? typeMatch[1] : null,
    event: eventMatch ? eventMatch[1] : null,
    company: companyMatch ? companyMatch[1] : null,
  };
};

// Individual Notification Item Component
// const NotificationItem = ({ notification, onMarkAsRead, navigate }) => {
//   const { Icon, color } = getIconForType(notification.type);
//   const { cleanTitle, type, event, company } = parseNotificationTitle(
//     notification.title
//   );

//   const handleActionClick = () => {
//     const redirectPath = notification?.redirectPath;

//     if (redirectPath)
//       // 🟢 Log the redirect path
//       console.log("Redirect Path:", redirectPath);
//     if (!notification.isRead) {
//       onMarkAsRead(notification._id, notification?.redirectPath);
//     } else if (notification?.redirectPath) {
//       navigate(notification?.redirectPath);
//     }
//   };

//   return (
//     <div
//       className={`flex items-start justify-between p-4 border-b border-gray-100 ${
//         !notification.isRead ? "bg-blue-50" : "bg-white"
//       }`}
//     >
//       <div className="flex items-start space-x-3">
//         <div className={`p-2 rounded-full ${color}`}>
//           <Icon className="w-4 h-4 text-white" />
//         </div>
//         <div className="flex-1">
//           <h3 className="text-sm font-medium text-[#000000E6] mb-1">
//             {cleanTitle}
//           </h3>
//           <p className="text-xs text-gray-500 mb-2">{notification.message}</p>
//           {/* 🟢 Added this block for type | event | company */}
//           {(type || event || company) && (
//             <div className="text-xs text-gray-500 mb-1">
//               {[type, event, company].filter(Boolean).join(" | ")}
//             </div>
//           )}
//           <div className="flex items-center text-xs text-gray-400">
//             <CiLock className="w-3 h-3 mr-1" />
//             {formatDate(notification.createdAt)}
//           </div>
//         </div>
//       </div>
//       <button
//         onClick={handleActionClick}
//         className={`px-3 py-1 text-[#2563EB] bg-[#2563EB]/10 text-sm font-semibold rounded hover:opacity-80 ${
//           notification.isRead ? "opacity-50 cursor-default" : ""
//         }`}
//       >
//         {notification.meta?.buttonText || "View"}
//       </button>
//     </div>
//   );
// };
const NotificationItem = ({ notification, onMarkAsRead, navigate }) => {
  const { Icon, color } = getIconForType(notification.type);
  const { cleanTitle, type, event, company } = parseNotificationTitle(
    notification.title
  );

  const handleActionClick = () => {
    const redirectPath = notification?.redirectPath;
    if (redirectPath) console.log("Redirect Path:", redirectPath);
    if (!notification.isRead) {
      onMarkAsRead(notification._id, notification?.redirectPath);
    } else if (notification?.redirectPath) {
      navigate(notification?.redirectPath);
    }
  };

  return (
    //  <div
    //   className={`flex items-start justify-between p-4 border-b border-gray-200 ${
    //     !notification.isRead ? "bg-blue-50" : "bg-white"
    //   }`}
    // >
    //   <div className="flex items-start space-x-3 w-full">
    //     {/* Icon */}
    //     <div className={`p-2 rounded-full ${color}`}>
    //       <Icon className="w-4 h-4 text-white" />
    //     </div>

    //     {/* Content */}
    //     <div className="flex-1">
    //       {/* Title + Date */}
    //       <div className="flex justify-between items-center">
    //         <h3 className="text-sm font-semibold text-gray-900">
    //           {cleanTitle}
    //         </h3>
    //         <span className="text-xs text-gray-500">
    //           {formatDate(notification.createdAt)}
    //         </span>
    //       </div>

    //       {/* Job Info */}
    //       <div className="flex flex-wrap gap-4 text-xs text-gray-700 mt-1">
    //         {event && (
    //           <span>
    //             <strong className="text-gray-900">Job Position:</strong> {event}
    //           </span>
    //         )}
    //         {type && (
    //           <span>
    //             <strong className="text-gray-900">Job Type:</strong> {type}
    //           </span>
    //         )}
    //         {company && (
    //           <span>
    //             <strong className="text-gray-900">Company:</strong> {company}
    //           </span>
    //         )}
    //       </div>

    //       {/* Message */}
    //       <p className="text-xs text-gray-600 mt-2">{notification.message}</p>
    //     </div>
    //   </div>

    //   {/* Button */}
    //   <button
    //     onClick={handleActionClick}
    //     className="ml-4 px-3 py-1 text-blue-600 bg-blue-100 hover:bg-blue-200 text-sm font-medium rounded"
    //   >
    //     {notification.meta?.buttonText || "View"}
    //   </button>
    // </div>

    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50 transition ${
        !notification.isRead ? "bg-blue-50" : "bg-white"
      }`}
    >
      <div className="flex items-start space-x-3 w-full">
        {/* Icon */}
        <div className={`p-2 rounded-full ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Title + Date */}
          {/* <div className="flex flex-col sm:flex-row sm:justify-between">
            <h3 className="text-sm font-semibold text-gray-900 mb-1 sm:mb-0">
              {cleanTitle}
            </h3>
            <span className="text-xs text-gray-500">
              {formatDate(notification.createdAt)}
            </span>
          </div> */}
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900">
              {cleanTitle}
            </h3>
            <span className="text-xs text-gray-500 italic">
              {formatDate(notification.createdAt)}
            </span>
          </div>

          {/* Job Info */}
          <div className="mt-2 space-y-1 text-xs text-gray-700">
            {event && (
              <p className="flex items-center gap-1">
                <span className="text-gray-900 font-medium">
                  💼 Job Position:
                </span>{" "}
                {event}
              </p>
            )}
            {type && (
              <p className="flex items-center gap-1">
                <span className="text-gray-900 font-medium">🕒 Job Type:</span>{" "}
                {type}
              </p>
            )}
            {company && (
              <p className="flex items-center gap-1">
                <span className="text-gray-900 font-medium">🏢 Company:</span>{" "}
                {company}
              </p>
            )}
          </div>

          {/* Message */}
          <p className="text-xs text-gray-600 mt-2 leading-relaxed">
            {notification.message}
          </p>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleActionClick}
        className="mt-3 sm:mt-0 ml-8 sm:ml-4 px-4 py-1 text-blue-600 bg-blue-100 hover:bg-blue-200 text-sm font-medium rounded transition"
      >
        {notification.meta?.buttonText || "View"}
      </button>
    </div>
  );
};

const NotificationHeader = ({
  onFilterChange,
  onSearch,
  onMarkAllRead,
  unreadCount,
  filterValue,
  isToggle,
  setIsToggle,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    // <div className="bg-white border-b border-gray-200 px-6 md:py-4 py-2">
    //   <div className="flex md:flex-row flex-col items-center justify-between mb-4">
    //     <nav className="flex items-center space-x-2 text-sm">
    //       <span className="text-blue-600 hover:text-blue-800 cursor-pointer" onClick={() => navigate('/user/feed')}>Home</span>
    //       <span className="text-gray-400">›</span>
    //       <span className="text-gray-600">Notifications</span>
    //     </nav>

    //     <div className="flex items-center space-x-4">
    //       <form onSubmit={handleSearch} className="relative">
    //         <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    //         <input
    //           type="text"
    //           placeholder="Search..."
    //           value={searchTerm}
    //           onChange={(e) => setSearchTerm(e.target.value)}
    //           className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    //         />
    //       </form>

    //       <div className="relative">
    //         <button
    //           type="button"
    //           className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
    //           onClick={() => setShowFilters(!showFilters)}
    //         >
    //           <BiFilterAlt className="w-4 h-4" />
    //           <span>Filter</span>
    //         </button>

    //         {showFilters && (
    //           <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
    //             <div className="p-2">
    //               <select
    //                 value={filterValue}
    //                 onChange={(e) => {
    //                   onFilterChange(e.target.value);
    //                   setShowFilters(false);
    //                 }}
    //                 className="w-full p-2 border border-gray-300 rounded-md text-sm"
    //               >
    //                 <option value="">All Notifications</option>
    //                 {Object.entries(NOTIFICATION_TYPES).map(([label, value]) => (
    //                   <option key={value} value={value}>{label}</option>
    //                 ))}
    //               </select>
    //             </div>
    //           </div>
    //         )}
    //       </div>

    //       <button
    //         onClick={onMarkAllRead}
    //         className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
    //       >
    //         Mark All as Read
    //       </button>
    //     </div>
    //   </div>

    //   <div className="flex items-center justify-between">
    //     <h1 className="text-xl font-semibold text-[#000000E6]">All Notification</h1>
    //     <span className="text-sm text-gray-500 flex"><CustomToggle handleClick={() => setIsToggle(prev => !prev)} isToggle={isToggle} />Unread</span>
    //   </div>
    // </div>
    <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-2 md:py-4">
      <div className="hidden md:flex flex-col">
        <div className="flex flex-row items-center justify-between mb-4">
          <nav className="flex items-center space-x-2 text-sm">
            <span
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => navigate("/user/feed")}
            >
              Home
            </span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-600">Notifications</span>
          </nav>
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </form>
            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                onClick={() => setShowFilters(!showFilters)}
              >
                <BiFilterAlt className="w-4 h-4" />
                <span>Filter</span>
              </button>

              {showFilters && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="p-2">
                    <select
                      value={filterValue}
                      onChange={(e) => {
                        onFilterChange(e.target.value);
                        setShowFilters(false);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">All Notifications</option>
                      {Object.entries(NOTIFICATION_TYPES).map(
                        ([label, value]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={onMarkAllRead}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              Mark All as Read
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[#000000E6]">
            All Notifications
          </h1>
          <span className="text-sm text-gray-500 flex">
            <CustomToggle
              handleClick={() => setIsToggle((prev) => !prev)}
              isToggle={isToggle}
            />
            Unread
          </span>
        </div>
      </div>
      <div className="md:hidden flex flex-col gap-3">
        <nav className="flex items-center space-x-2 text-sm mb-2">
          <span
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
            onClick={() => navigate("/user/feed")}
          >
            Home
          </span>
          <span className="text-gray-400">›</span>
          <span className="text-gray-600">Notifications</span>
        </nav>
        <div className="flex flex-col gap-2">
          <form onSubmit={handleSearch} className="relative w-full">
            <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </form>
          <div className="relative w-full">
            <button
              type="button"
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              onClick={() => setShowFilters(!showFilters)}
            >
              <BiFilterAlt className="w-4 h-4" />
              <span>Filter</span>
            </button>
            {showFilters && (
              <div className="absolute right-0 mt-2 w-full bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="p-2">
                  <select
                    value={filterValue}
                    onChange={(e) => {
                      onFilterChange(e.target.value);
                      setShowFilters(false);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Notifications</option>
                    {Object.entries(NOTIFICATION_TYPES).map(
                      ([label, value]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-2">
          <h1 className="text-lg font-semibold text-[#000000E6]">
            All Notifications
          </h1>
          <div className="flex justify-between w-full sm:w-auto items-center gap-2">
            <span className="text-sm text-gray-500 flex items-center">
              <CustomToggle
                handleClick={() => setIsToggle((prev) => !prev)}
                isToggle={isToggle}
              />
              Unread
            </span>
            <button
              onClick={onMarkAllRead}
              className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 w-full sm:w-auto"
            >
              Mark All as Read
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationInterface = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.user);
  const notifyData = selector?.notificationsData?.data?.data;

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [filter, setFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isToggle, setIsToggle] = useState(false);

  const notifications = notifyData?.list || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const query = {
        ...(filter && { type: filter }),
        ...(searchQuery && { title: { $regex: searchQuery, $options: "i" } }),
      };

      if (isToggle) {
        query.isRead = !isToggle;
      }

      const params = {
        page,
        size,
        query: JSON.stringify(query),
      };

      await dispatch(notificationsList(params));
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId, redirectPath = "") => {
    try {
      await dispatch(notificationsMarkAsRead({ _id: notificationId }));
      if (redirectPath) {
        navigate(redirectPath);
      }
      fetchNotifications(); // Refresh the list
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await dispatch(notificationsMarkAllRead());
      fetchNotifications(); // Refresh the list
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page, filter, searchQuery, isToggle]);

  const handleFilterChange = (value) => {
    setFilter(value);
    setPage(1); // Reset to first page when filter changes
  };

  const handleSearch = (term) => {
    setSearchQuery(term);
    setPage(1); // Reset to first page when search changes
  };

  return (
    <div className="min-h-screen p-3">
      <NotificationHeader
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onMarkAllRead={markAllAsRead}
        unreadCount={unreadCount}
        filterValue={filter}
        isToggle={isToggle}
        setIsToggle={setIsToggle}
      />

      <div className="w-full mx-auto shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No notifications found
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={markAsRead}
              navigate={navigate}
            />
          ))
        )}

        {!loading && notifyData?.total > size && (
          <div className="flex justify-between items-center p-4 bg-white border-t border-gray-100">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {page} of {Math.ceil(notifyData.total / size)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(notifyData.total / size)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationInterface;
