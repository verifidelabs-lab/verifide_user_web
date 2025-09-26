import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BiMenu, BiX } from 'react-icons/bi';
import { FiChevronDown } from 'react-icons/fi';
import HeaderJson from './Header.json';
import { RiNotification2Fill } from "react-icons/ri";
import { clearAllData, getCookie, removeCookie } from '../../utils/cookieHandler';
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

const Header = ({ adminProfileData, companiesProfileData, instituteProfileData }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate()
  const dropdownRef = useRef();
  const userRole = Number(getCookie("USER_ROLE"));
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRemoveCookie = () => {
    removeCookie('VERIFIED_ADMIN_TOKEN')
    removeCookie('USER_ROLE')
    // clearAllData()
  
  }


  const getBasePath = () => {
    switch (userRole) {
      case 1:
      case 2:
        return "admin";
      case 3:
      case 7:
        return "companies";
      case 4:
      case 8:
        return "institute";
      default:
        return "admin";
    }
  };
  const basePath = getBasePath();

  const getDefaultName = (roleId) => {
    switch (roleId) {
      case ROLES.SUPER_ADMIN:
        return "Super Admin";
      case ROLES.ADMIN:
        return "Admin";
      case ROLES.COMPANIES:
      case ROLES.COMPANIES_ADMIN:
        return "Company";
      case ROLES.INSTITUTIONS:
      case ROLES.INSTITUTIONS_ADMIN:
        return "Institute";
      default:
        return "User";
    }
  };

  const profileData =
    [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole)
      ? adminProfileData
      : [ROLES.COMPANIES, ROLES.COMPANIES_ADMIN].includes(userRole)
        ? companiesProfileData
        : [ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)
          ? instituteProfileData
          : {};

  return (
    <div className="bg-white z-10 flex-shrink-0 h-16 border-b border-black border-opacity-10 ">
      <div className="flex-1 px-4 flex justify-between items-center h-full">

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-2xl text-gray-700 md:hidden focus:outline-none"
          >
            {isMobileMenuOpen ? <BiX /> : <BiMenu />}
          </button>

        </div>

        <div className="flex items-center gap-4">
          <div className='hover:text-blue-600 cursor-pointer hover:bg-gray-200 hover:rounded-full hover:p-1 mr-4' onClick={() => navigate(`/app/${basePath}/notification`)}>
            <RiNotification2Fill size={22} />
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img
                src={profileData?.profile_picture_url ||
                  "https://media.istockphoto.com/id/2186780921/photo/young-woman-programmer-focused-on-her-work-coding-on-dual-monitors-in-a-modern-office.webp?a=1&b=1&s=612x612&w=0&k=20&c=SAF-y0Rjzil_3FQi2KmAyXOAKYHaHRRbNxjQXnMsObk="
                }
                alt="User"
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://media.istockphoto.com/id/2186780921/photo/young-woman-programmer-focused-on-her-work-coding-on-dual-monitors-in-a-modern-office.webp?a=1&b=1&s=612x612&w=0&k=20&c=SAF-y0Rjzil_3FQi2KmAyXOAKYHaHRRbNxjQXnMsObk=";
                }}
              />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 leading-none">{profileData?.first_name || profileData?.last_name
                  ? `${profileData?.first_name || ""} ${profileData?.last_name || ""}`.trim()
                  : getDefaultName(profileData?.role_ids?.[0])}</p>
                <p className="text-xs text-gray-500">{profileData?.username ?? "N/A"}</p>
              </div>
              <FiChevronDown className="text-gray-500" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg transition-all">
                <Link
                  to={"/company/profile"}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                {/* {(userRole === 1 || userRole === 2) && ( */}
                <Link
                  to={`/company/update-profile`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Update Profile
                </Link>
                {/* )} */}
                <button
                  onClick={handleRemoveCookie}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="px-4 pb-3 space-y-2 bg-white border-t border-gray-200 md:hidden">
          {HeaderJson?.headerItems?.map((item, index) => {
            const isActive = location.pathname === item?.path;
            return (
              <Link
                key={index}
                to={item?.path}
                className={`block px-3 py-2 text-[16px] transition duration-200 ${isActive
                  ? 'font-semibold text-[#000000] border-b-2 border-blue-600'
                  : 'font-medium text-[#000000]'
                  } hover:border-b-2 hover:border-blue-600 hover:text-blue-600`}
              >
                {item?.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Header;
