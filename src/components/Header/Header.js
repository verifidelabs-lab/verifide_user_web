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
  switchAccountInstitution,
} from "../../redux/slices/authSlice";
import { toast } from "sonner";
import Modal from "../ui/Modal/Modal";
import CustomInput from "../ui/Input/CustomInput";
import FilterSelect2 from "../ui/Input/FilterSelect2";
import CustomDateInput from "../ui/Input/CustomDateInput";
import FileUpload from "../ui/Image/ImageUploadWithSelect";
import { getCompaniesList } from "../../redux/slices/companiesSlice";
import { getInstitutionsList } from "../../redux/slices/instituteSlice";
import { useGlobalKeys } from "../../context/GlobalKeysContext";
import { useTour } from "../../context/TourContext";
import { dashboardTourSteps } from "../../data/tutorialSteps";
import { GiHamburgerMenu } from "react-icons/gi";

const Header = ({ profileData, setUserType, playAndShowNotification,navbarOpen,setNavbarOpen }) => {
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
  const navigate = useNavigate();
  const { profileImage } = useProfileImage();
  const imageToDisplay =
      profileData?.personalInfo?.profile_picture_url;
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
  const switchAccountFunction2 = async (selectedMode) => {
    setIsLoading(true);
    setUserType(selectedMode);
    try {
      const res = await dispatch(switchAccount({ accessMode: selectedMode })).unwrap();
      if (res) {
        setCookie('VERIFIED_TOKEN', res?.data?.token);
        setCookie('ACCESS_MODE', res?.data?.user?.accessMode);
        setAccessLabel(selectedMode === "6" ? "Recruiter" : "User");
        // Close dropdowns after selection
        setModeDropdown(false);
        setIsDropdownOpen(false);
        // Reload after a short delay to ensure state updates
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
      toast.success(res?.message);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  // const switchAccountFunction = async (prefillEmail) => {
  //   setIsLoading(true);
  //   try {
  //     const res = await dispatch(
  //       switchAccountCompany({
  //         accessMode: accessLabel,
  //         companyId: prefillEmail,
  //       })
  //     ).unwrap();
  //     if (res) {
  //       // Save company token separately
  //       setCookie("COMPANY_TOKEN", JSON.stringify(res.data.token));
  //       setCookie("ROLE", res.data.accessMode); // optional for role-based routing
  //       setCookie("ACTIVE_MODE", "company"); // optional for role-based routing
  //       setCookie("ASSIGNED_USER", res.data.isAssignedUser); // optional for role-based routing
  //       toast.success(res?.message || "Company login successful");

  //       // Navigate to company dashboard
  //       navigate("/company");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error || "Invalid credentials or server error");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Close dropdowns when route changes
  const switchAccountFunction = async (prefillId, type) => {
    // type can be "company" or "institution"
    setIsLoading(true);
    try {
      const dispatchAction =
        type === "company" ? switchAccountCompany : switchAccountInstitution;

      const res = await dispatch(
        dispatchAction({
          accessMode: accessLabel,
          [`${type}Id`]: prefillId, // dynamically set companyId or institutionId
        })
      ).unwrap();

      if (res) {
        // Use the same keys for all types
        setCookie("TOKEN", JSON.stringify(res.data.token));
        setCookie("ROLE", res.data.accessMode); // role for routing
        setCookie("ACTIVE_MODE", type); // 'company' or 'institution'
        setCookie("ASSIGNED_USER", res.data.isAssignedUser);
        // ✅ Update global context
        updateToken(res.data.token);
        updateRole(res.data.accessMode);
        updateActiveMode(type);
        updateIsAssignedUser(res.data.isAssignedUser);
        toast.success(res?.message || `${type} login successful`);

        // Navigate dynamically
        navigate(`/${type}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(error || "Invalid credentials or server error");
    } finally {
      setIsLoading(false);
    }
  };

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
  const {
    institutionsList: { data: institutionsList } = {},
    // companyDetails: { data: companyDetails } = {},
  } = useSelector((state) => state.institute);
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
          created_by_users: false,
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
  const fetchInstitutionsList = useCallback(
    async (page = 1) => {
      const apiPayload = {
        page: 1,
        size: 100,
        // populate: "industry|name",
        // select:
        //   "name display_name email industry phone_no company_size company_type is_verified createdAt logo_url created_by_users ",
        // searchFields: "name",
        keyWord: "",
        query: JSON.stringify({
          created_by_users: false,
        }),
      };
      try {
        setIsLoading(true);
        await dispatch(getInstitutionsList(apiPayload));
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
    fetchInstitutionsList()
  }, [dispatch, fetchCompaniesList, fetchInstitutionsList]);
  const { stepIndex, steps, setAlertMessage } = useTour();

  // Auto-open dropdowns if step targets require it
  useEffect(() => {
    if (!steps[stepIndex]) return;
    const target = steps[stepIndex].target;

    const openProfileDropdown = target.includes("profile-dropdown");
    const openCompanies = target.includes("companies-dropdown") || target.includes("company-list");
    const openInstitutions = target.includes("institutions-dropdown") || target.includes("institution-list");

    // Open parent profile dropdown
    if (openProfileDropdown || openCompanies || openInstitutions) {
      if (!isDropdownOpen) setIsDropdownOpen(true);
    }

    // Auto-open companies dropdown
    if (openCompanies) {
      const interval = setInterval(() => {
        const el = document.querySelector("[data-tour='companies-dropdown']");
        if (el) {
          setIsCompanyDropdownOpen(true);
          clearInterval(interval);
        }
      }, 100);

      // Safety timeout if element not found
      setTimeout(() => {
        const el = document.querySelector("[data-tour='companies-dropdown']");
        if (!el) {
          setAlertMessage("⚠ Companies dropdown not found! Make sure your company list is loaded.");
          clearInterval(interval);
        }
      }, 3000);
    }

    // Auto-open institutions dropdown
    if (openInstitutions) {
      const interval = setInterval(() => {
        const el = document.querySelector("[data-tour='institutions-dropdown']");
        if (el) {
          setIsInstitutionDropdownOpen(true);
          clearInterval(interval);
        }
      }, 100);

      setTimeout(() => {
        const el = document.querySelector("[data-tour='institutions-dropdown']");
        if (!el) {
          setAlertMessage("⚠ Institutions dropdown not found! Make sure your institution list is loaded.");
          clearInterval(interval);
        }
      }, 3000);
    }
  }, [
    stepIndex,
    steps,
    isDropdownOpen,
    isCompanyDropdownOpen,
    isInstitutionDropdownOpen
  ]);

  return (
    <header
      className=""
      ref={topRef}
    >
      {/* Alert UI for missing step target */}

      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center justify-between p-4   relative">
            {/* Sidebar Toggle Button for Mobile */}
      {!navbarOpen && window.innerWidth <= 1000 && (
        <button
          className="fixed top-4 left-4 p-2 z-60 flex items-center justify-center rounded-md hover:glassy-card transition-all duration-300 hover:scale-110"
          onClick={() => setNavbarOpen(true)}
        >
          <GiHamburgerMenu className="text-xl glassy-text-primary" />
        </button>
      )}
          <div className="flex items-center gap-3 px-4 py-3">
            <img
              src="/Frame 1000004906.png"
              alt="logo"
              className="h-8 w-auto max-w-[120px] sm:h-9 md:h-10 lg:h-11 transition-transform duration-300 hover:scale-105 object-contain cursor-pointer"
              onClick={() => navigate(`/user/feed`)}
            />
          </div>

        </div>
        <div className="flex items-center gap-4">
          {/* <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-2xl glassy-text-primary md:hidden focus:outline-none"
          >
            {isMobileMenuOpen ? <BiX /> : <BiMenu />}
          </button> */}
          {/* {location.pathname === "/user/terms-and-conditions" && (
            <div className="flex items-center gap-3 w-72">
              <img
                src="/Frame 1000004906.png"
                alt="logo"
                className="h-8 transition-transform duration-300 hover:scale-105"
              />
            </div>
          )} */}
          <nav className="hidden lg:flex lg:gap-14 md:gap-3 2xl:ps-0 xl:ps-8 md:ps-10 lg:ps-0 flex-1">
            {HeaderJson?.headerItems?.map((item, index) => {
              const isActive = location.pathname === item?.path;
              const isHome = item?.path === "/";

              return (
                <Link
                  key={index}
                  to={item?.path}
                  data-tour={`header-${item?.name.toLowerCase()}`} // Add tour target
                  // onClick={() => {
                  //   if (isHome) scrollToTop();
                  // }}
                  className={`lg:text-[16px] md:text-[14px] transition duration-200 ${isActive
                    ? "font-semibold glassy-text-primary border-b-2 border-blue-600"
                    : "font-medium glassy-text-primary hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
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
                <div className="absolute md:right-0 right-[88px] md:mt-2 mt-16 w-32 glassy-card border rounded shadow-lg z-50">

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
                data-tour="profile-dropdown"
              >
                {imageToDisplay ? (
                  <img
                    src={imageToDisplay}
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover"
                    key={imageToDisplay}
                  />
                ) : (
                  <span className="w-8 h-8 rounded-full border flex justify-center items-center glassy-card text-zinc-600 overflow-hidden">
                    <img
                      src="/0684456b-aa2b-4631-86f7-93ceaf33303c.png"
                      alt="dummy logo"
                    />
                  </span>
                )}
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium glassy-text-primary leading-none">
                    {profileData?.personalInfo?.first_name}
                  </p>
                  <p className="text-xs glassy-text-secondary">
                    {profileData?.personalInfo?.email}
                  </p>
                </div>
                <FiChevronDown
                  className={`glassy-text-secondary transition-transform ${isDropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 min-w-[200px] glassy-card-header rounded-2xl border-[var(--border-color)] shadow-xl z-50 overflow-hidden transition-all duration-200 ease-out">

                  {/* Profile Link */}
                  <Link
                    to="/user/profile"
                    className="block px-4 py-2 text-sm glassy-text-primary hover:bg-[var(--bg-card)] transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>

                  {/* Change Password */}
                  <Link
                    to="/user/change-password"
                    className="block px-4 py-2 text-sm glassy-text-primary hover:bg-[var(--bg-card)] transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Change Password
                  </Link>
                  {/* <button
                    className={`text-xs px-3 py-1 rounded ${accessLabel === "Recruiter"
                      ? "bg-blue-600 glassy-text-primary"
                      : "glassy-card glassy-text-primary hover:glassy-card"
                      }`}
                    onClick={() => {
                      if (accessLabel !== "User") {
                        switchAccountFunction2("STUDENT");
                      }
                    }}
                  // disabled={accessLabel === "Recruiter"}
                  >
                    Recruiter
                  </button> */}
                  {/* Companies Dropdown */}
                  <div className="border-t border-[var(--border-color)]">
                    <button
                      onClick={() => setIsCompanyDropdownOpen((prev) => !prev)}
                      className="w-full flex justify-between items-center px-4 py-2 text-sm glassy-text-primary hover:bg-[var(--bg-card)] transition-colors "
                      data-tour="companies-dropdown"
                    >
                      Companies
                      <FiChevronDown
                        className={`ml-2 glassy-text-primary transition-transform ${isCompanyDropdownOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {isCompanyDropdownOpen && (
                      <div className="pl-4 space-y-1 max-h-60 overflow-y-auto" data-tour="company-list">
                        {companiesData?.data?.list?.length > 0 ? (
                          companiesData.data.list.map((company) => (
                            <Link
                              key={company._id}
                              className="flex items-center gap-2 py-2 text-sm glassy-text-primary rounded-lg hover:bg-[var(--bg-card)] transition-colors"
                              onClick={() => switchAccountFunction(company._id, "company")}
                            >
                              {company.logo_url ? (
                                <img
                                  src={company.logo_url}
                                  alt={`${company.name} logo`}
                                  key={company.logo_url}  
                                  className="w-6 h-6 rounded-full object-cover border border-[var(--border-color)]"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/companylogo.png"; // fallback
                                  }}
                                />
                              ) : (
                                <div className="w-6 h-6 flex items-center justify-center rounded-full glassy-card glassy-text-secondary text-xs font-semibold">
                                  {company.name?.charAt(0)?.toUpperCase() || "C"}
                                </div>
                              )}
                              <span className="truncate">{company.name}</span>
                            </Link>
                          ))
                        ) : (
                          <p className="py-2 text-sm glassy-text-secondary">No companies found</p>
                        )}

                        {companiesData?.data?.list?.length < 5 && (
                          <Link
                            to="/user/create-company"
                            className="block py-2 text-sm glassy-text-primary hover:bg-[var(--bg-card)] rounded-lg transition-colors"
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
                    className="block px-4 py-2 text-sm glassy-text-primary hover:glassy-card"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Create Institution
                  </Link> */}
                  <div className=" ">
                    <button
                      onClick={() =>
                        setIsInstitutionDropdownOpen((prev) => !prev)
                      }
                      className="w-full flex justify-between items-center px-4 py-2 text-sm glassy-text-primary hover:bg-[var(--bg-card)] transition-colors"
                      data-tour="institutions-dropdown"
                    >
                      Institution
                      <FiChevronDown
                        className={`ml-2 glassy-text-primary transition-transform ${isInstitutionDropdownOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {/* Expand inline */}
                    {isInstitutionDropdownOpen && (
                      <div className="pl-4 space-y-1" data-tour="institution-list">
                        {institutionsList?.data?.list?.length > 0 ? (
                          institutionsList.data.list.map((company) => (
                            <Link
                              key={company._id}
                              // to={`/company/login?email=${encodeURIComponent(
                              //   company.email
                              // )}`}
                              className="flex items-center gap-2 py-2 text-sm glassy-text-primary rounded-lg hover:bg-[var(--bg-card)] transition-colors"

                              onClick={() => {
                                switchAccountFunction(company._id, "institution");
                              }}
                            >
                              {/* ✅ Company logo with fallback */}
                              {company.logo_url ? (
                                <img
                                  src={company.logo_url}
                                  alt={`${company.name} logo`}
                                  key={company.logo_url}
                                  className="w-6 h-6 rounded-full object-cover border border-[var(--border-color)]"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/companylogo.png"; // fallback
                                  }}
                                />
                              ) : (

                                <div className="w-6 h-6 flex items-center justify-center rounded-full glassy-card glassy-text-secondary text-xs font-semibold">

                                  {company.name?.charAt(0)?.toUpperCase() ||
                                    "C"}
                                </div>
                              )}

                              <span className="truncate  ">{company.name}</span>
                            </Link>
                          ))
                        ) : (
                          <p className=" py-2 text-sm glassy-text-primary">
                            No Institution found
                          </p>
                        )}

                        {institutionsList?.data?.list?.length < 5 && (
                          <Link
                            to="/user/create-institute"
                            className="block   py-2 text-sm glassy-text-primary rounded-lg transition-colors"
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
                    className="w-full text-left px-4 py-2 text-sm glassy-text-primary hover:bg-[var(--bg-card)] border-t border-[var(--border-color)] transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
              {isMobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 min-w-[200px] glassy-card-header rounded-2xl border-[var(--border-color)] shadow-xl z-50 overflow-hidden transition-all duration-200 ease-out">

                  {HeaderJson?.headerItems?.map((item, index) => {
                    const isActive = location.pathname === item?.path;
                    return (
                      <Link
                        key={index}
                        to={item?.path}
                        className={`block px-3 py-2 text-base transition duration-200 ${isActive
                          ? "font-semibold glassy-text-primary border-b-2 border-blue-600"
                          : "font-medium glassy-text-primary hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
                          }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item?.name}
                      </Link>
                    );
                  })}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}

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
