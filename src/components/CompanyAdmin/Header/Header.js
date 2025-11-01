import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BiMenu, BiX } from "react-icons/bi";
import { FiChevronDown } from "react-icons/fi";
import { RiNotification2Fill } from "react-icons/ri";
import HeaderJson from "./Header.json";
import {
  getCookie,
  clearCompanySession,
  setCookie,
} from "../../utils/cookieHandler";
import { switchAccount } from "../../../redux/slices/authSlice";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

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
  const dropdownRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const userRole = Number(getCookie("ROLE"));

  // Determine basePath
  const getBasePath = () => {
    switch (userRole) {
      case ROLES.COMPANIES:
      case ROLES.COMPANIES_ADMIN:
        return "/company";
      case ROLES.INSTITUTIONS:
      case ROLES.INSTITUTIONS_ADMIN:
        return "/institution";
      default:
        return "";
    }
  };
  const basePath = getBasePath();

  // Merge base header with role-specific items dynamically
  const getHeaderItems = () => {
    const baseItems = HeaderJson.headerItems;
    let roleSpecificItems = [];

    if ([ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)) {
      roleSpecificItems = [
        // { name: "Students", path: "/students" },
        {
          "name": "Assessment",
          "path": "/assessment"
        }
        // { name: "Courses", path: "/courses" },
      ];
    }

    return [...baseItems, ...roleSpecificItems];
  };
  const headerItems = getHeaderItems();

  // Determine profileData
  const profileData = [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole)
    ? adminProfileData
    : [ROLES.COMPANIES, ROLES.COMPANIES_ADMIN].includes(userRole)
      ? companiesProfileData
      : [ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)
        ? instituteProfileData
        : {};

  const getDefaultName = () => {
    switch (userRole) {
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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleRemoveCookie = () => {
    clearCompanySession();
    navigate("/user/feed")
    window.location.reload();
  };
  const switchAccountFunction2 = async (selectedMode) => {
    // setIsLoading(true);
    // setUserType(selectedMode);
    try {
      const res = await dispatch(switchAccount({ accessMode: selectedMode })).unwrap();
      if (res) {
        setCookie('VERIFIED_TOKEN', res?.data?.token);
        setCookie('ACCESS_MODE', res?.data?.user?.accessMode);
        handleRemoveCookie()
        // setAccessLabel(selectedMode === "6" ? "Recruiter" : "User");
        // Close dropdowns after selection
        // setModeDropdown(false);
        // setIsDropdownOpen(false);
        // Reload after a short delay to ensure state updates
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
      toast.success(res?.message);
    } catch (error) {
      toast.error(error);
    } finally {
      // setIsLoading(false);
    }
  };
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">

      {/* Logo and Desktop Menu */}
      <div className="flex-1 px-4 flex justify-between items-center h-full">
        <div className="flex items-center gap-3">
          <img
            src="/Frame 1000004906.png"
            alt="logo"
            className="h-8 cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => navigate("/user/feed")}
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex lg:gap-14 md:gap-3 flex-1 justify-center">
          {headerItems.map((item, idx) => {
            const fullPath = `${basePath}${item.path}`;
            const isActive = location.pathname === fullPath;
            return (
              <Link
                key={idx}
                to={fullPath}
                onClick={() => item.path === "/" && scrollToTop()}
                className={`lg:text-[16px] md:text-[14px] transition duration-200 pb-1 ${isActive
                  ? "font-semibold glassy-text-primary border-b-2 border-blue-600"
                  : "font-medium glassy-text-primary hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
                  }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div
            onClick={() => navigate(`${basePath}/notification`)}
            className="relative flex items-center justify-center w-9 h-9 rounded-full glassy-text-primary border border-[var(--border-color)] shadow-md cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:bg-[var(--bg-card)]"
          >
            <RiNotification2Fill size={20} className="glassy-text-primary" />
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img
                src={profileData?.logo_url || "/companylogo.png"}
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <div className="text-left">
                <p className="text-sm font-medium glassy-text-primary">
                  {profileData?.display_name || getDefaultName()}
                </p>
                <p className="text-xs glassy-text-secondary">
                  {profileData?.username ?? "N/A"}
                </p>
              </div>
              <FiChevronDown className="glassy-text-secondary" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 min-w-[200px] glassy-card-header rounded-2xl border-[var(--border-color)] shadow-xl z-50 overflow-hidden transition-all duration-200 ease-out">
                <Link
                  to={`${basePath}/profile`}
                  className="block px-4 py-2 text-sm glassy-text-primary hover:bg-[var(--bg-card)] transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={()=>switchAccountFunction2("STUDENT")}
                  className="block w-full text-left px-4 py-2 text-sm glassy-text-primary hover:bg-[var(--bg-card)] transition-colors"
                >
                  Switch to User
                </button>
                <button
                  onClick={()=>switchAccountFunction2("STUDENT")}
                  className="block w-full text-left px-4 py-2 text-sm glassy-text-primary hover:bg-[var(--bg-card)] transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-2xl glassy-text-primary md:hidden focus:outline-none"
        >
          {isMobileMenuOpen ? <BiX /> : <BiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="px-4 pb-3 space-y-2 glassy-card border-t border-gray-200 md:hidden">
          {headerItems.map((item, idx) => {
            const fullPath = `${basePath}${item.path}`;
            const isActive = location.pathname === fullPath;
            return (
              <Link
                key={idx}
                to={fullPath}
                className={`block px-3 py-2 text-[16px] transition duration-200 ${isActive
                  ? "font-semibold glassy-text-primary border-b-2 border-blue-600"
                  : "font-medium glassy-text-primary hover:border-b-2 hover:border-blue-600 hover:text-blue-600"
                  }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Header;
