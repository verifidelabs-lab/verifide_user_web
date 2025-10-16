import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { BiMenu, BiX } from "react-icons/bi";
import HeaderJson from "./Header.json";

import { useDispatch, useSelector } from "react-redux";
import Button from "../../../ui/Button/Button";
import { BaseUrl } from "../../../hooks/axiosProvider";

const Header = ({ profileData, setUserType, playAndShowNotification }) => {
  const dispatch = useDispatch();
  const { id, username } = useParams();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const [isUserData, setIsUserData] = useState(null);
  const navigate = useNavigate();

  const dropdownRef = useRef();
  const modeDropdownRef = useRef();
  const [modeDropdown, setModeDropdown] = useState(false);

  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  // Example condition logic
  const getRedirectPath = () => {
    const currentPath = location.pathname;

    // Example conditions
    if (currentPath.includes("/company-details/")) {
      return `/user/view-details/companies/${id}`;
    } else if (currentPath.includes("/post-view/")) {
      return `/user/feed/${id}`;
    } else {
      return `/user/profile/${username}/${id}`;
    }
  };

  const redirectURL = encodeURIComponent(getRedirectPath());
  useEffect(() => {
    if (isUserData) {
      // Redirect to the user's own profile page (example)
      navigate(redirectURL);
    }
  }, [isUserData, navigate]); // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close profile dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }

      // Close mode dropdown
      if (
        modeDropdownRef.current &&
        !modeDropdownRef.current.contains(event.target)
      ) {
        setModeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  // Close dropdowns when route changes
  useEffect(() => {
    setIsDropdownOpen(false);
    setModeDropdown(false);
  }, [location.pathname]);

  const topRef = useRef(null);
  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const entryTypeOptions = [
    { value: "Master Entries", label: "Master Entries" },
    { value: "User Entries", label: "User Entries" },
  ];
  const [entryType, setEntryType] = useState(entryTypeOptions[0]);

  return (
    <header
      className="bg-white z-10 border-b border-black border-opacity-10"
      ref={topRef}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-2xl text-gray-700 md:hidden focus:outline-none"
          >
            {isMobileMenuOpen ? <BiX /> : <BiMenu />}
          </button>
          {location.pathname === "/user/terms-and-conditions" && (
            <div className="flex items-center gap-3 w-72">
              <img
                src="/logo.png"
                alt="logo"
                className="h-8 transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}
          <nav className="hidden lg:flex lg:gap-14 md:gap-3 2xl:ps-0 xl:ps-8 md:ps-10 lg:ps-0 flex-1">
            {HeaderJson?.headerItems?.map((item, index) => {
              const isActive = location.pathname === item?.path;
              const isHome = item?.path === "/";

              return (
                <Link
                  key={index}
                  to={item?.path}
                  onClick={() => {
                    if (isHome) {
                      scrollToTop();
                    }
                  }}
                  className={`lg:text-[16px] md:text-[14px] transition duration-200 ${
                    isActive
                      ? "font-semibold text-[#000000E6] border-b-2 border-blue-600"
                      : "font-medium text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
                  } pb-1`}
                >
                  {item?.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex gap-3 items-center relative">
          <div className="flex items-center gap-4">
            <Button>
              <Link
                to={`${BaseUrl}login?redirect=${redirectURL}`}
              >
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-3 space-y-2 bg-white border-t border-gray-200">
          {HeaderJson?.headerItems?.map((item, index) => {
            const isActive = location.pathname === item?.path;
            return (
              <Link
                key={index}
                to={item?.path}
                className={`block px-3 py-2 text-base transition duration-200 ${
                  isActive
                    ? "font-semibold text-[#000000E6] border-b-2 border-blue-600"
                    : "font-medium text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item?.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Header;
