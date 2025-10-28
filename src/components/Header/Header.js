import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BiMenu, BiX } from "react-icons/bi";
import { FiChevronDown } from "react-icons/fi";
import HeaderJson from "./Header.json";
import { getCookie, removeCookie, setCookie } from "../utils/cookieHandler";
import { useProfileImage } from "../context/profileImageContext";
import Button from "../ui/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  switchAccount,
  switchAccountCompany,
} from "../../redux/slices/authSlice";
import { toast } from "sonner";
import Modal from "../ui/Modal/Modal";
import CustomInput from "../ui/Input/CustomInput";
import FilterSelect2 from "../ui/Input/FilterSelect2";
import CustomDateInput from "../ui/Input/CustomDateInput";
import FileUpload from "../ui/Image/ImageUploadWithSelect";
import { getCompaniesList } from "../../redux/slices/companiesSlice";

const Header = ({ profileData, setUserType, playAndShowNotification }) => {
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef();
  const modeDropdownRef = useRef();
  const [modeDropdown, setModeDropdown] = useState(false);
  const showName = getCookie("ACCESS_MODE");
  const [accessLabel, setAccessLabel] = useState(
    showName === "6" ? "Recruiter" : "STUDENT"
  );
  const navigate = useNavigate();
  const { profileImage } = useProfileImage();
  const imageToDisplay =
    profileImage || profileData?.personalInfo?.profile_picture_url;
  const [isLoading, setIsLoading] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isInstitutionDropdownOpen, setIsInstitutionDropdownOpen] =
    useState(false);

  // Close dropdowns when clicking outside
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

  const switchAccountFunction = async (prefillEmail) => {
    setIsLoading(true);
    try {
      const res = await dispatch(
        switchAccountCompany({
          accessMode: accessLabel,
          companyId: prefillEmail,
        })
      ).unwrap();
      if (res) {
        // Save company token separately
        setCookie("COMPANY_TOKEN", JSON.stringify(res.data.token));
        setCookie("COMPANY_ROLE", res.data.accessMode); // optional for role-based routing
        setCookie("ACTIVE_MODE", "company"); // optional for role-based routing
        setCookie("ASSIGNED_USER", res.data.isAssignedUser); // optional for role-based routing
        toast.success(res?.message || "Company login successful");

        // Navigate to company dashboard
        navigate("/company");
      }
    } catch (error) {
      console.log(error);
      toast.error(error || "Invalid credentials or server error");
    } finally {
      setIsLoading(false);
    }
  };

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
  const {
    companiesList: { data: companiesData } = {},
    companyDetails: { data: companyDetails } = {},
  } = useSelector((state) => state.userCompanies);
  const fetchCompaniesList = useCallback(
    async (page = 1) => {
      const apiPayload = {
        page: 1,
        size: 100,
        populate: "industry|name",
        select:
          "name display_name email industry phone_no company_size company_type is_verified createdAt logo_url created_by_users ",
        searchFields: "name",
        keyWord: "",
        query: JSON.stringify({
          created_by_users: entryType.value === "User Entries",
        }),
      };
      try {
        setIsLoading(true);
        await dispatch(getCompaniesList(apiPayload));
      } catch (error) {
        toast.error("Failed to fetch companies list");
        console.error("Error fetching companies:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch]
  );
  useEffect(() => {
    fetchCompaniesList();
  }, [dispatch, fetchCompaniesList]);
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
            {/* <BiBell onClick={() => playAndShowNotification({
              title: "New User Registration",
              message: "A new user, John Doe, has signed up.",
              body: "User 'John Doe' has successfully registered on the platform. Review their profile for more details.",
              redirectUrl: ""
            })} /> */}
            {/* Mode Dropdown */}
            {/* <div className="relative" ref={modeDropdownRef}>
              <Button
                icon={<FiChevronDown />}
                iconPosition="right"
                variant="primary"
                onClick={() => {
                  setModeDropdown((prev) => !prev);
                  setIsDropdownOpen(false);
                }}
                loading={isLoading}
                className="hidden md:flex"
                size="sm"
              >
                {accessLabel}
              </Button>
              {modeDropdown && (
                <div className="absolute md:right-0 right-[88px] md:mt-2 mt-16 w-32 bg-white border rounded shadow-lg z-50">

                </div>
              )}
            </div> */}

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-2 focus:outline-none"
                onClick={() => {
                  setIsDropdownOpen((prev) => !prev);
                  setModeDropdown(false);
                }}
              >
                {imageToDisplay ? (
                  <img
                    src={imageToDisplay}
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="w-8 h-8 rounded-full border flex justify-center items-center bg-gray-300 text-zinc-600 overflow-hidden">
                    <img
                      src="/0684456b-aa2b-4631-86f7-93ceaf33303c.png"
                      alt="dummy logo"
                    />
                  </span>
                )}
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-[#000000E6] leading-none">
                    {profileData?.personalInfo?.first_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {profileData?.personalInfo?.email}
                  </p>
                </div>
                <FiChevronDown
                  className={`text-gray-500 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-20">
                  <Link
                    to="/user/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  {/* <button
                    className={`block w-full text-left px-4 py-2 text-sm ${accessLabel === "Recruiter"
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-blue-100"
                      }`}
                    onClick={() => {
                      if (accessLabel !== "Recruiter") {
                        switchAccountFunction("RECRUITERS");
                      }
                    }}
                    disabled={accessLabel === "Recruiter"}
                  >
                    Broadcast 
                  </button>

                  <button
                    className={`block w-full text-left px-4 py-2 text-sm ${accessLabel === "User"
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-blue-100"
                      }`}
                    onClick={() => {
                      if (accessLabel !== "User") {
                        switchAccountFunction("STUDENT");
                      }
                    }}
                    disabled={accessLabel === "User"}
                  >
                    User
                  </button> */}
                  {/* Mobile-only mode switcher inside profile dropdown */}
                  {/* <div className="block md:hidden border-t border-gray-200">
                    <div className="px-4 py-2">
                      <p className="text-xs text-gray-500 mb-1">Switch to:</p>
                      <div className="flex gap-2">
                        <button
                          className={`text-xs px-3 py-1 rounded ${
                            accessLabel === "User"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                          onClick={() => {
                            if (accessLabel !== "User") {
                              switchAccountFunction("STUDENT");
                            }
                          }}
                          disabled={accessLabel === "User"}
                        >
                          User
                        </button>
                        <button
                          className={`text-xs px-3 py-1 rounded ${accessLabel === "Recruiter"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          onClick={() => {
                            if (accessLabel !== "Recruiter") {
                              switchAccountFunction("RECRUITERS");
                            }
                          }}
                          disabled={accessLabel === "Recruiter"}
                        >
                          Recruiter
                        </button>
                      </div>
                    </div>
                  </div> */}

                  <Link
                    to="/user/change-password"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Change Password
                  </Link>
                  {/* {companiesData?.data?.list.length > 0
                    ? companiesData?.data?.list.map((company) => (
                        <button
                          key={company._id}
                          className="block w-full text-left text-gray-700 px-4 py-2 text-sm hover:bg-gray-100 capitalize"
                        >
                          <Link
                            to={`/company/login?email=${encodeURIComponent(
                              company.email
                            )}`}
                          >
                            Company : {company.name}
                          </Link>
                        </button>
                      ))
                    : null} */}
                  {/* {companiesData?.data?.list.length < 5 && (
                    <Link
                      to="/user/create-company"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Create Company
                    </Link>
                  )} */}
                  {/* Companies inside Profile Dropdown */}
                  <div className="border-t border-gray-200">
                    <button
                      onClick={() => setIsCompanyDropdownOpen((prev) => !prev)}
                      className="w-full flex justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Companies
                      <FiChevronDown
                        className={`ml-2 text-gray-500 transition-transform ${
                          isCompanyDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Expand inline */}
                    {isCompanyDropdownOpen && (
                      <div className="pl-4 space-y-1">
                        {companiesData?.data?.list?.length > 0 ? (
                          companiesData.data.list.map((company) => (
                            <Link
                              key={company._id}
                              // to={`/company/login?email=${encodeURIComponent(
                              //   company.email
                              // )}`}
                              className="flex items-center gap-2 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                              onClick={() => {
                                switchAccountFunction(company._id);
                              }}
                            >
                              {/* ✅ Company logo with fallback */}
                              {company.logo_url ? (
                                <img
                                  src={company.logo_url}
                                  alt={`${company.name} logo`}
                                  className="w-6 h-6 rounded-full object-cover border border-gray-200"
                                  // onError={(e) => {
                                  //   e.currentTarget.src = "/default-company.png"; // your fallback image
                                  // }}
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src =
                                      "https://res.cloudinary.com/dsnqduetr/image/upload/v1761043320/post-media/companylogo.png"; // fallback image
                                  }}
                                />
                              ) : (
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 text-xs font-semibold">
                                  {company.name?.charAt(0)?.toUpperCase() ||
                                    "C"}
                                </div>
                              )}

                              <span className="truncate">{company.name}</span>
                            </Link>
                          ))
                        ) : (
                          <p className=" py-2 text-sm text-gray-500">
                            No companies found
                          </p>
                        )}

                        {companiesData?.data?.list?.length < 5 && (
                          <Link
                            to="/user/create-company"
                            className="block   py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => {
                              setIsCompanyDropdownOpen(false);
                              setIsDropdownOpen(false);
                            }}
                          >
                            ➕ Create Company
                          </Link>
                        )}
                      </div>
                    )}
                  </div>

                  {/* <Link
                    to="/user/create-institute"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Create Institution
                  </Link> */}
                  <div className="border-t border-gray-200">
                    <button
                      onClick={() =>
                        setIsInstitutionDropdownOpen((prev) => !prev)
                      }
                      className="w-full flex justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Institution
                      <FiChevronDown
                        className={`ml-2 text-gray-500 transition-transform ${
                          isInstitutionDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Expand inline */}
                    {isInstitutionDropdownOpen && (
                      <div className="pl-4 space-y-1">
                        {companiesData?.data?.list?.length > 0 ? (
                          companiesData.data.list.map((company) => (
                            <Link
                              key={company._id}
                              // to={`/company/login?email=${encodeURIComponent(
                              //   company.email
                              // )}`}
                              className="flex items-center gap-2 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                              onClick={() => {
                                switchAccountFunction(company._id);
                              }}
                            >
                              {/* ✅ Company logo with fallback */}
                              {company.logo_url ? (
                                <img
                                  src={company.logo_url}
                                  alt={`${company.name} logo`}
                                  className="w-6 h-6 rounded-full object-cover border border-gray-200"
                                  // onError={(e) => {
                                  //   e.currentTarget.src = "/default-company.png"; // your fallback image
                                  // }}
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src =
                                      "https://res.cloudinary.com/dsnqduetr/image/upload/v1761043320/post-media/companylogo.png"; // fallback image
                                  }}
                                />
                              ) : (
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 text-xs font-semibold">
                                  {company.name?.charAt(0)?.toUpperCase() ||
                                    "C"}
                                </div>
                              )}

                              <span className="truncate">{company.name}</span>
                            </Link>
                          ))
                        ) : (
                          <p className=" py-2 text-sm text-gray-500">
                            No Institution found
                          </p>
                        )}

                        {companiesData?.data?.list?.length && (
                          <Link
                            to="/user/create-institute"
                            className="block   py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => {
                              setIsInstitutionDropdownOpen(false);
                              setIsDropdownOpen(false);
                            }}
                          >
                            ➕ Create Institution
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      removeCookie("VERIFIED_TOKEN");
                      window.location.reload();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
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

      {/* Modal (unchanged) */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={`Create `}>
        <div className="grid grid-cols-2 gap-3 items-center">
          <CustomInput
            label="Name"
            className="w-full h-10"
            placeholder="Enter Name"
          />
          <FilterSelect2 options={[]} />
          <CustomDateInput placeholder="State Date" />
          <CustomDateInput placeholder="State Date" label="End Date" />
          <div className="col-span-2">
            <CustomInput
              label="Priority"
              className="w-full h-10"
              placeholder="Priority"
            />
            <CustomInput
              type="textarea"
              label="Description"
              className="w-full h-10"
              placeholder="Enter decryption"
            />
          </div>
          <div className="col-span-2">
            <FileUpload className="c" />
          </div>
        </div>
      </Modal>
    </header>
  );
};

export default Header;
