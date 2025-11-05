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

const Header = ({
  adminProfileData,
  companiesProfileData,
  instituteProfileData,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userRole = Number(getCookie("ROLE"));

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

  const getHeaderItems = () => {
    const baseItems = HeaderJson.headerItems;
    let roleSpecificItems = [];
    if ([ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)) {
      roleSpecificItems = [{ name: "Assessment", path: "/assessment" }];
    }
    return [...baseItems, ...roleSpecificItems];
  };
  const headerItems = getHeaderItems();

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
    navigate("/user/feed");
    window.location.reload();
  };

  const switchAccountFunction = async (selectedMode) => {
    try {
      const res = await dispatch(
        switchAccount({ accessMode: selectedMode })
      ).unwrap();
      if (res) {
        setCookie("VERIFIED_TOKEN", res?.data?.token);
        setCookie("ACCESS_MODE", res?.data?.user?.accessMode);
        handleRemoveCookie();
        setTimeout(() => window.location.reload(), 100);
      }
      toast.success(res?.message);
    } catch (error) {
      toast.error(error);
    }
  };

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
    <header className="w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16   shadow-md relative z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-3">
        <img
          src="/Frame 1000004906.png"
          alt="logo"
          className="h-8 w-auto max-w-[120px] sm:h-9 md:h-10 lg:h-11 transition-transform duration-300 hover:scale-105 object-contain cursor-pointer"
          // onClick={() => navigate(`/user/feed`)}
        />
      </div>

      {/* Desktop Menu */}
      <nav className="hidden lg:flex flex-1 justify-center gap-10">
        {headerItems.map((item, idx) => {
          const fullPath = `${basePath}${item.path}`;
          const isActive = location.pathname === fullPath;
          return (
            <Link
              key={idx}
              to={fullPath}
              onClick={() => item.path === "/" && scrollToTop()}
              className={`transition duration-200 pb-1 ${
                isActive
                  ? "font-semibold glassy-text-primary border-b-2 border-blue-600"
                  : "font-medium glassy-text-primary hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Right Icons */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-2xl glassy-text-primary md:hidden focus:outline-none"
        >
          {isMobileMenuOpen ? <BiX /> : <BiMenu />}
        </button>
        {/* Notifications */}
        <div
          onClick={() => navigate(`${basePath}/notification`)}
          className="relative flex items-center justify-center w-9 h-9 rounded-full glassy-text-primary border border-[var(--border-color)] shadow-md cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-[var(--bg-card)]"
        >
          <RiNotification2Fill size={20} className="glassy-text-primary" />
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 focus:outline-none"
            onClick={() => {
              setIsDropdownOpen((prev) => !prev);
            }}
          >
            {/* {profileData?.logo_url ? (
              <img
                src={profileData?.logo_url || "/companylogo.png"}
                alt="User"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="w-8 h-8 rounded-full border flex justify-center items-center glassy-card text-zinc-600 overflow-hidden">
                <img
                  src="/0684456b-aa2b-4631-86f7-93ceaf33303c.png"
                  alt="dummy logo"
                />
              </span>
            )} */}
            {profileData?.logo_url ? (
              <img
                src={profileData.logo_url}
                alt="User Logo"
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null; // prevent infinite loop
                  e.currentTarget.src =
                    "/0684456b-aa2b-4631-86f7-93ceaf33303c.png"; // fallback to dummy
                }}
              />
            ) : (
              <span className="w-8 h-8 rounded-full border flex justify-center items-center glassy-card text-zinc-600 overflow-hidden">
                <img
                  src="/0684456b-aa2b-4631-86f7-93ceaf33303c.png"
                  alt="Default Dummy Logo"
                  className="w-6 h-6 object-contain"
                />
              </span>
            )}

            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium glassy-text-primary leading-none">
                {profileData?.display_name}
              </p>
              <p className="text-xs glassy-text-secondary">
                {profileData?.email}
              </p>
            </div>
            <FiChevronDown
              className={`glassy-text-secondary transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 glassy-card-header rounded-2xl border-[var(--border-color)] shadow-xl z-50 overflow-hidden">
              <Link
                to={`${basePath}/profile`}
                className="block px-4 py-2 text-sm glassy-text-primary hover:bg-[var(--bg-card)] transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={() => switchAccountFunction("STUDENT")}
                className="block w-full text-left px-4 py-2 text-sm glassy-text-primary hover:bg-[var(--bg-card)] transition-colors"
              >
                Switch to User
              </button>
              <button
                onClick={handleRemoveCookie}
                className="block w-full text-left px-4 py-2 text-sm glassy-text-primary hover:bg-[var(--bg-card)] transition-colors"
              >
                Logout
              </button>
            </div>
          )}
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 glassy-card-header rounded-2xl border-[var(--border-color)] shadow-xl z-50 overflow-hidden">
              {headerItems.map((item, idx) => {
                const fullPath = `${basePath}${item.path}`;
                const isActive = location.pathname === fullPath;
                return (
                  <Link
                    key={idx}
                    to={fullPath}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 text-[16px] transition duration-200 ${
                      isActive
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
      </div>
    </header>
  );
};

export default Header;
