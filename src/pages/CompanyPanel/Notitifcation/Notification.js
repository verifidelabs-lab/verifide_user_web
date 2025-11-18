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
} from "../../../redux/CompanySlices/companiesSlice";
import { getCookie } from "../../../components/utils/cookieHandler";
import CustomToggle from "../../../components/ui/Toggle/CustomToggle";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ROLE_BASED_NOTIFICATION_TYPES = {
  Admin: {
    roles: [1, 2],
    types: [
      "education-verification-request",
      "education-verified",
      "education-rejected",
      "experience-verification-request",
      "experience-verified",
      "experience-rejected",
      "project-verification-request",
      "project-verified",
      "project-rejected",
      "certificate-verification-request",
      "certificate-verified",
      "certificate-rejected",
      "identity-verification-request",
      "identity-verified",
      "identity-rejected",
      "course-enrolled",
      "assessment-completed",
      "course-completed",
    ],
  },
  Companies: {
    roles: [3, 7],
    types: [
      "education-verification-request",
      "education-verified",
      "education-rejected",
      "experience-verification-request",
      "experience-verified",
      "experience-rejected",
      "project-verification-request",
      "project-verified",
      "project-rejected",
      "certificate-verification-request",
      "certificate-verified",
      "certificate-rejected",
      "identity-verification-request",
      "identity-verified",
      "identity-rejected",
      "course-enrolled",
      "assessment-completed",
      "course-completed",
    ],
  },
  Institutions: {
    roles: [4, 8],
    types: [
      "education-verification-request",
      "education-verified",
      "education-rejected",
      "experience-verification-request",
      "experience-verified",
      "experience-rejected",
      "project-verification-request",
      "project-verified",
      "project-rejected",
      "certificate-verification-request",
      "certificate-verified",
      "certificate-rejected",
      "identity-verification-request",
      "identity-verified",
      "identity-rejected",
      "course-enrolled",
      "assessment-completed",
      "course-completed",
    ],
  },
};
const getIconForType = (type) => {
  switch (type) {
    case "profile-completion":
    case "identity-verification":
    case "education-verification":
    case "employment-verification":
    case "project-verification":
    case "certificate-verification":
      return { Icon: CiLock, color: "glassy-card0" };
    case "skill-updates":
    case "course-progress":
    case "assessments-progress":
      return { Icon: BiBell, color: "bg-orange-500" };
    default:
      return { Icon: BsMailbox, color: "bg-purple-500" };
  }
};

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

const NotificationItem = ({ notification, onMarkAsRead, navigate }) => {
  const { Icon, color } = getIconForType(notification.type);

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
    <div
      className={`flex items-start justify-between p-4  border-gray-100 ${
        !notification.isRead ? "bg-card-unread" : ""
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-full ${color}`}>
          <Icon className="w-4 h-4 glassy-text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium glassy-text-primary mb-1">
            {notification.title}
          </h3>
          <p className="text-xs glassy-text-secondary mb-2">
            {notification.message}
          </p>
          <div className="flex items-center text-xs glassy-text-secondary">
            <CiLock className="w-3 h-3 mr-1" />
            {formatDate(notification.createdAt)}
          </div>
        </div>
      </div>
      <button
        onClick={handleActionClick}
        className={`px-3 py-1 glassy-button text-sm font-semibold rounded ${
          notification.isRead ? "opacity-50 cursor-default" : ""
        }`}
        disabled={notification.isRead}
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
  allowedTypes,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    // <div className="glassy-card  border-gray-200 px-6 py-4">  <div className="hidden md:flex flex-col">
    //   <div className="flex flex-row items-center justify-between mb-4">
    //     {/* Breadcrumb */}
    //     <nav className="flex items-center space-x-2 text-sm">
    //       <span
    //         className="glassy-text-primary hover:glassy-text-primary-dark cursor-pointer"
    //       // onClick={() => navigate("/user/feed")}
    //       >
    //         Home
    //       </span>
    //       <span className="glassy-text-secondary">›</span>
    //       <span className="glassy-text-secondary">Notifications</span>
    //     </nav>

    //     {/* Search + Filter + Mark All */}
    //     <div className="flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-4 relative z-40">

    //       {/* 🔍 Search */}
    //       <form onSubmit={handleSearch} className="relative w-full md:w-64">
    //         <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 glassy-text-secondary w-4 h-4" />
    //         <input
    //           type="text"
    //           placeholder="Search..."
    //           value={searchTerm}
    //           onChange={(e) => setSearchTerm(e.target.value)}
    //           className="pl-10 pr-4 py-2 glassy-input-notification text-sm w-full
    //              focus:ring-2 focus:ring-blue-500 focus:border-transparent
    //              rounded-xl transition-all duration-200"
    //         />
    //       </form>

    //       {/* 🧩 Filter Dropdown */}
    //       <div className="relative">
    //         <button
    //           type="button"
    //           onClick={() => setShowFilters(!showFilters)}
    //           className="flex items-center justify-center space-x-2 px-4 py-2 glassy-button
    //              text-sm rounded-xl border border-[var(--border-color)]
    //              hover:scale-105 transition-all duration-200"
    //         >
    //           <BiFilterAlt className="w-4 h-4 glassy-text-primary" />
    //           <span className="glassy-text-primary">Filter</span>
    //           <FiChevronDown
    //             className={`transition-transform duration-200 glassy-text-secondary ${showFilters ? "rotate-180" : ""
    //               }`}
    //           />
    //         </button>

    //         {showFilters && (
    //           <div
    //             className="absolute right-0 mt-2 w-56 glassy-card-header rounded-xl
    //                border border-[var(--border-color)] shadow-xl
    //                backdrop-blur-lg z-50 transition-all duration-200 ease-out"
    //           >
    //             <div className="">
    //               <select
    //                 value={filterValue}
    //                 onChange={(e) => {
    //                   onFilterChange(e.target.value);
    //                   setShowFilters(false);
    //                 }}
    //                 className="w-full px-3 py-2 glassy-input text-sm rounded-lg
    //                    bg-transparent text-[var(--text-primary)]
    //                    focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    //               >
    //                 <option value="">All Notifications</option>
    //                 {allowedTypes.map((type) => (
    //                   <option key={type} value={type}>
    //                     {type.replace(/-/g, " ")}
    //                   </option>
    //                 ))}
    //               </select>
    //             </div>
    //           </div>
    //         )}
    //       </div>

    //       {/* ✅ Mark All as Read */}
    //       <button
    //         onClick={onMarkAllRead}
    //         className="px-4 py-2 glassy-button text-sm rounded-xl border border-[var(--border-color)]
    //            hover:scale-105 transition-all duration-200"
    //       >
    //         Mark All as Read
    //       </button>
    //     </div>

    //   </div>

    //   {/* Title + Toggle */}
    //   <div className="flex items-center justify-between">
    //     <h1 className="text-xl font-semibold glassy-text-primary">
    //       All Notifications
    //     </h1>
    //     <span className="text-sm glassy-text-secondary flex items-center">
    //       <CustomToggle handleClick={() => setIsToggle((prev) => !prev)} isToggle={isToggle} />
    //       Unread
    //     </span>
    //   </div>
    // </div>

    // </div>
    <div className="glassy-card border-gray-200 px-4 sm:px-6 py-4 w-full">
      <div className="flex flex-col w-full">
        {/* ===================== DESKTOP (md+) ===================== */}
        <div className="hidden md:flex flex-col">
          <div className="flex flex-row items-center justify-between mb-4 w-full">
            {/* Breadcrumb */}
            <nav className="flex items-center flex-wrap space-x-1 text-sm max-w-xl">
              <span className="glassy-text-primary hover:glassy-text-primary-dark cursor-pointer">
                Home
              </span>
              <span className="glassy-text-secondary">›</span>
              <span className="glassy-text-secondary">Notifications</span>
            </nav>

            {/* Search + Filter + Mark All */}
            <div className="flex items-center gap-3 md:gap-4 relative z-40">
              {/* 🔍 Search */}
              <form onSubmit={handleSearch} className="relative w-48 lg:w-64">
                <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 glassy-text-secondary w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 glassy-input-notification text-sm w-full 
                focus:ring-2 focus:ring-blue-500 rounded-xl transition-all duration-200"
                />
              </form>

              {/* 🧩 Filter Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-center space-x-2 px-4 py-2 glassy-button
                text-sm rounded-xl border border-[var(--border-color)] hover:scale-105"
                >
                  <BiFilterAlt className="w-4 h-4 glassy-text-primary" />
                  <span className="glassy-text-primary">Filter</span>
                  <FiChevronDown
                    className={`transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showFilters && (
                  <div
                    className="absolute right-0 mt-2 w-56 glassy-card-header rounded-xl 
                border border-[var(--border-color)] shadow-xl backdrop-blur-lg z-50"
                  >
                    <select
                      value={filterValue}
                      onChange={(e) => {
                        onFilterChange(e.target.value);
                        setShowFilters(false);
                      }}
                      className="w-full px-3 py-2 glassy-input text-sm rounded-lg bg-transparent"
                    >
                      <option value="">All Notifications</option>
                      {allowedTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.replace(/-/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Mark All Read */}
              <button
                onClick={onMarkAllRead}
                className="px-4 py-2 glassy-button text-sm rounded-xl border border-[var(--border-color)] hover:scale-105"
              >
                Mark All as Read
              </button>
            </div>
          </div>

          {/* Title + Toggle */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold glassy-text-primary">
              All Notifications
            </h1>
            <span className="text-sm glassy-text-secondary flex items-center">
              <CustomToggle
                handleClick={() => setIsToggle(!isToggle)}
                isToggle={isToggle}
              />
              Unread
            </span>
          </div>
        </div>

        {/* ===================== MOBILE (below md) ===================== */}
        <div className="md:hidden flex flex-col gap-4 w-full">
          {/* Breadcrumb */}
          <nav className="flex items-center flex-wrap gap-1 text-sm sm:text-base glassy-text-secondary">
            <span className="cursor-pointer glassy-text-primary">Home</span>
            <span>›</span>
            <span>Notifications</span>
          </nav>

          {/* Title */}
          <h1 className="text-xl font-semibold glassy-text-primary">
            All Notifications
          </h1>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative w-full">
            <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 glassy-text-secondary w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 glassy-input-notification text-base w-full 
      focus:ring-2 focus:ring-blue-500 rounded-xl"
            />
          </form>

          {/* Filter + Mark All + Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Filter */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 glassy-button text-sm rounded-xl border border-[var(--border-color)]"
            >
              Filter
            </button>

            {/* Mark All Read */}
            <button
              onClick={onMarkAllRead}
              className="px-3 py-2 glassy-button text-sm rounded-xl border border-[var(--border-color)]"
            >
              Mark All Read
            </button>

            {/* Toggle */}
            <span className="text-sm glassy-text-secondary flex items-center gap-2">
              <CustomToggle
                handleClick={() => setIsToggle(!isToggle)}
                isToggle={isToggle}
              />
              Unread
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationInterface = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selector = useSelector((state) => state.companies);
  const notifyData = selector?.notificationsData?.data?.data;

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [filter, setFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isToggle, setIsToggle] = useState(false);

  const notifications = notifyData?.list || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const userRole = Number(getCookie("ROLE"));

  const getAllowedNotificationTypes = () => {
    for (const key in ROLE_BASED_NOTIFICATION_TYPES) {
      if (ROLE_BASED_NOTIFICATION_TYPES[key].roles.includes(userRole)) {
        return ROLE_BASED_NOTIFICATION_TYPES[key].types;
      }
    }
    return [];
  };

  const allowedNotificationTypes = getAllowedNotificationTypes();

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
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page, filter, searchQuery, isToggle]);

  const handleFilterChange = (value) => {
    setFilter(value);
    setPage(1);
  };

  const handleSearch = (term) => {
    setSearchQuery(term);
    setPage(1);
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
        allowedTypes={allowedNotificationTypes}
      />
      <div className="w-full mx-auto shadow-sm mt-2 glassy-card">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 -2 lue-500"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-8 glassy-text-secondary glassy-card rounded-md shadow-sm border border-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75h.008v.008H9.75V9.75zm4.5 0h.008v.008h-.008V9.75zm-6.364 6.364a8.25 8.25 0 1111.677 0M15.75 15.75a3 3 0 00-4.242 0"
              />
            </svg>
            <h2 className="text-lg font-semibold glassy-text-primary mb-1">
              No Notifications
            </h2>
            <p className="text-sm glassy-text-secondary">
              You're all caught up! We'll let you know when something new
              arrives.
            </p>
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
          <div className="flex justify-between items-center p-4 glassy-card border-t border-gray-100">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm glassy-text-secondary">
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
