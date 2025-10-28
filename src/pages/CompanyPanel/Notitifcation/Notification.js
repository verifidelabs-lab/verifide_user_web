/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { BiBell, BiFilterAlt, BiSearch } from 'react-icons/bi';
import { BsMailbox } from 'react-icons/bs';
import { CiLock } from 'react-icons/ci';
import { useDispatch, useSelector } from 'react-redux';
import { notificationsList, notificationsMarkAllRead, notificationsMarkAsRead } from '../../../redux/CompanySlices/companiesSlice';
import { getCookie } from '../../../components/utils/cookieHandler';
import CustomToggle from '../../../components/ui/Toggle/CustomToggle';

const ROLE_BASED_NOTIFICATION_TYPES = {
  Admin: {
    roles: [1, 2],
    types: [
      'education-verification-request',
      'education-verified',
      'education-rejected',
      'experience-verification-request',
      'experience-verified',
      'experience-rejected',
      'project-verification-request',
      'project-verified',
      'project-rejected',
      'certificate-verification-request',
      'certificate-verified',
      'certificate-rejected',
      'identity-verification-request',
      'identity-verified',
      'identity-rejected',
      'course-enrolled',
      'assessment-completed',
      'course-completed',
    ]
  },
  Companies: {
    roles: [3, 7],
    types: [
      'education-verification-request',
      'education-verified',
      'education-rejected',
      'experience-verification-request',
      'experience-verified',
      'experience-rejected',
      'project-verification-request',
      'project-verified',
      'project-rejected',
      'certificate-verification-request',
      'certificate-verified',
      'certificate-rejected',
      'identity-verification-request',
      'identity-verified',
      'identity-rejected',
      'course-enrolled',
      'assessment-completed',
      'course-completed',
    ]
  },
  Institutions: {
    roles: [4, 8],
    types: [
      'education-verification-request',
      'education-verified',
      'education-rejected',
      'experience-verification-request',
      'experience-verified',
      'experience-rejected',
      'project-verification-request',
      'project-verified',
      'project-rejected',
      'certificate-verification-request',
      'certificate-verified',
      'certificate-rejected',
      'identity-verification-request',
      'identity-verified',
      'identity-rejected',
      'course-enrolled',
      'assessment-completed',
      'course-completed',
    ]
  }
};
const getIconForType = (type) => {
  switch (type) {
    case 'profile-completion':
    case 'identity-verification':
    case 'education-verification':
    case 'employment-verification':
    case 'project-verification':
    case 'certificate-verification':
      return { Icon: CiLock, color: 'bg-blue-500' };
    case 'skill-updates':
    case 'course-progress':
    case 'assessments-progress':
      return { Icon: BiBell, color: 'bg-orange-500' };
    default:
      return { Icon: BsMailbox, color: 'bg-purple-500' };
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const { Icon, color } = getIconForType(notification.type);

  const handleActionClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification._id);
    }
  };

  return (
    <div className={`flex items-start justify-between p-4 border-b border-gray-100 ${!notification.isRead ? 'bg-blue-50' : 'glassy-card'}`}>
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-full ${color}`}>
          <Icon className="w-4 h-4 glassy-text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            {notification.title}
          </h3>
          <p className="text-xs glassy-text-secondary mb-2">
            {notification.message}
          </p>
          <div className="flex items-center text-xs text-gray-400">
            <CiLock className="w-3 h-3 mr-1" />
            {formatDate(notification.createdAt)}
          </div>
        </div>
      </div>
      <button
        onClick={handleActionClick}
        className={`px-3 py-1 text-[#2563EB] glassy-text-primary/10 text-sm font-semibold rounded hover:opacity-80 ${notification.isRead ? 'opacity-50 cursor-default' : ''
          }`}
      >
        {notification.meta?.buttonText || 'View'}
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
  allowedTypes
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="glassy-card border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between mb-4">
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
          <button
            onClick={onMarkAllRead}
            className="px-4 py-2 bg-blue-600 glassy-text-primary text-sm rounded-md hover:bg-blue-700"
          >
            Mark All as Read
          </button>
        </div>
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
            <div className="absolute right-0 mt-2 w-56 glassy-card rounded-md shadow-lg z-10 border border-gray-200">
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
                  {allowedTypes.map((type) => (
                    <option key={type} value={type}>{type.replace(/-/g, ' ')}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">All Notification</h1>
        <span className="text-sm glassy-text-secondary flex"><CustomToggle handleClick={() => setIsToggle(prev => !prev)} isToggle={isToggle} />Unread</span>
      </div>
    </div>
  );
};

const NotificationInterface = () => {
  const dispatch = useDispatch();
  const selector = useSelector(state => state.companies);
  const notifyData = selector?.notificationsData?.data?.data;

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [filter, setFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isToggle, setIsToggle] = useState(false);

  const notifications = notifyData?.list || [];
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const userRole = Number(getCookie("COMPANY_ROLE"));

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
        ...(searchQuery && { title: { $regex: searchQuery, $options: 'i' } }),
      };

      if (isToggle) {
        query.isRead = !isToggle
      }

      const params = {
        page,
        size,
        query: JSON.stringify(query)
      };

      await dispatch(notificationsList(params));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await dispatch(notificationsMarkAsRead({ _id: notificationId }));
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await dispatch(notificationsMarkAllRead());
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
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
      <div className="w-full mx-auto shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
            <h2 className="text-lg font-semibold text-gray-700 mb-1">No Notifications</h2>
            <p className="text-sm text-gray-400">
              You're all caught up! We'll let you know when something new arrives.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={markAsRead}
            />
          ))
        )}

        {!loading && notifyData?.total > size && (
          <div className="flex justify-between items-center p-4 glassy-card border-t border-gray-100">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm glassy-text-secondary">
              Page {page} of {Math.ceil(notifyData.total / size)}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
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