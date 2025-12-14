import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import {
  masterIndustry,
  masterSkills,
  profileRoles,
  userJobs,
} from "../../redux/Global Slice/cscSlice";
import { useNavigate, useParams } from "react-router-dom";
import StudentJobCard from "./components/StudentJobCard";
import SkeletonJobCard from "../../components/Loader/SkeletonJobCard";
import {
  arrayTransform,
  convertTimestampToDate,
} from "../../components/utils/globalFunction";
import { getAllCompanies } from "../../redux/work/workSlice";
import Pagination from "../../components/Pagination/Pagination";
import NoDataFound from "../../components/ui/No Data/NoDataFound";
import FilterSelect2 from "../../components/ui/Input/FilterSelect2";
import { CiLocationOn } from "react-icons/ci";
import Button from "../../components/ui/Button/Button";
import { getCookie } from "../../components/utils/cookieHandler";
import { FiFilter } from "react-icons/fi";
import ProfileUpdateAlert from "../../components/ui/InputAdmin/Modal/ProfileUpdateAlert";
import { toast } from "sonner";
import { addBookmarked } from "../../redux/Users/userSlice";

const Opportunitiess2 = () => {
  const param = useParams();

  const dispatch = useDispatch();
  const selector = useSelector((state) => state.global);
  let {
    userJobsData: { data },
  } = selector ? selector : {};
  const selector2 = useSelector((state) => state);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("Received ID from URL:", param?.id);
  }, [param?.id]);
  const profileData = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [updateAlertOpen, setUpdateAlertOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    status: false,
    industry: false,
    role: false,
    skill: false,
    timePeriod: false,
  });
   const [searchFelids, setSearchFelids] = useState({
    company_id: "",
    industry_id: "",
    job_title: "",
    required_skills: [],
    formDate: "",
    toDate: "",
    timePeriod: "",
    job_type: [], // <-- added for backend filtering
  });
  const resetFilters = () => {
    setSearchFelids({
      company_id: "",
      industry_id: "",
      job_title: "",
      required_skills: [],
      formDate: "",
      toDate: "",
      timePeriod: "",
      job_type: [],
    });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fetchJobs = async () => {
    setIsLoading(true);

    const filters = {
      type: activeTab, // open, closed, etc.
    };

    // Add other filters if they exist
    if (searchFelids?.company_id) filters.company_id = searchFelids.company_id;
    if (searchFelids?.industry_id)
      filters.industry_id = searchFelids.industry_id;
    if (searchFelids?.job_title) filters.job_title = searchFelids.job_title;
    if (searchFelids?.required_skills?.length > 0)
      filters.required_skills = searchFelids.required_skills;
    if (searchFelids?.job_type?.length > 0)
      filters.job_type = searchFelids.job_type; // <-- new
    // ✅ Add job_id only if param?.id exists

    const apiPayload = {
      page: pageNo,
      size: size,
      query: JSON.stringify(filters),
      fromDate: searchFelids?.formDate || "",
      toDate: searchFelids?.toDate || "",
      searchFields: searchFelids?.job_title || "",
    };
    if (param?.id) {
      apiPayload.job_id = param.id;
    }
    await dispatch(userJobs(apiPayload));
    setIsLoading(false);
  };
  const handleBookmark = async (courseId) => {
    try {
      const res = await dispatch(addBookmarked({ job_id: courseId })).unwrap();
      await fetchJobs();
      toast.success(res?.message);
    } catch (error) {
      toast.error(error);
    }
  };
  // useEffect(() => {
  //   if (param?.id) {
  //     const foundJob = data?.data?.list?.find(
  //       (value) =>
  //         value?.interviewDetails?._id === param?.id ||
  //         value?.jobApplication?._id === param?.id ||
  //         value?._id === param?.id
  //     );
  //     console.log(
  //       "chck user=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
  //       foundJob
  //     );
  //     if (foundJob) {
  //       setSelectedJob(foundJob); // directly set the found item
  //     }
  //   }
  // }, [param?.id]);
  useEffect(() => {
    if (!param?.id || !data?.data?.list?.length) return;

    console.log("Searching for param.id:", param?.id);
    const foundJob = data?.data?.list?.find(
      (value) =>
        value?.interviewDetails?._id === param?.id ||
        value?.jobApplication?._id === param?.id ||
        value?._id === param?.id
    );

    if (foundJob) {
      console.log("✅ Found job:", foundJob);
      setSelectedJob(foundJob);
    } else {
      console.warn("❌ No job found for id:", param?.id);
    }
  }, [param?.id, data]);

  const isDateInRange = () => {
    if (!selectedJob?.start_date || !selectedJob?.end_date) return false;
    const currentDate = new Date().getTime();
    return (
      currentDate >= selectedJob?.start_date &&
      currentDate <= selectedJob?.end_date
    );
  };

  const shouldDisableApply = () => {
    if (selectedJob?.isApplied)
      return { disabled: true, reason: "Already Applied" };
    if (!isDateInRange())
      return { disabled: true, reason: "Applications Closed" };
    return { disabled: false, reason: "Apply Now" };
  };

  const applyStatus = shouldDisableApply();

  const [pageNo, setPageNo] = useState(1);
  const size = 8;
 
  const allCompaniesList = [
    ...arrayTransform(selector2?.work?.getAllCompaniesData?.data?.data || []),
  ];
  const allIndustryList = [
    ...arrayTransform(selector?.masterIndustryData?.data?.data?.list),
  ];
  const allProfileRoleList = [
    ...arrayTransform(selector?.profileRolesData?.data?.data?.list),
  ];
  const allSkillsList = [
    ...arrayTransform(selector?.masterSkillsData?.data?.data?.list),
  ];

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchJobs();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [dispatch, activeTab, searchFelids, pageNo, size]);

  useEffect(() => {
    dispatch(masterIndustry());
    dispatch(masterSkills());
    dispatch(getAllCompanies());
    dispatch(profileRoles());
  }, [dispatch]);

  const filterDropdownRef = useRef(null);
  const [isExpandedDesktop, setIsExpandedDesktop] = useState(false);
  const [isExpandedMobile, setIsExpandedMobile] = useState(false);

  const handleSeeMoreDesktop = () => setIsExpandedDesktop(!isExpandedDesktop);
  const handleSeeMoreMobile = () => setIsExpandedMobile(!isExpandedMobile);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFilterChange = (filterName) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const getActiveFiltersCount = () => {
    return Object.values(selectedFilters).filter(Boolean).length;
  };

  const hasActiveFilters = () => {
    return Object.values(selectedFilters).some(Boolean);
  };

  const handleAction = (data) => {
    setSelectedJob(data);
    console.log("data:---->>>", data);
  };
  // function applyForJob(data) {
  //   console.log("datadatadata",data);

  //   const completion =
  //     profileData?.getProfileData?.data?.data?.personalInfo
  //       ?.profile_completion_percentage;
  //   // If profile < 60 → show modal
  //   if (completion < 60) {
  //     setUpdateAlertOpen(true);
  //     return;
  //   }
  //   // Else → navigate to career goal page
  //   navigate(`/user/career-goal/${data?._id}`);
  // }
  function applyForJob(data) {
    const completion =
      profileData?.getProfileData?.data?.data?.personalInfo
        ?.profile_completion_percentage;
    const isEducationAdded =
      profileData?.getProfileData?.data?.data?.first_education_added;

    const jobType = data?.job_type;
    const payType = data?.pay_type;

    // Low-profile friendly lists
    const lowProfileJobTypes = [
      "internship",
      "part-time",
      "contract",
      "freelance",
      "temporary",
      "volunteer",
      "training",
      "walk-in",
      "shift-based",
      "night-shift",
      "weekend",
      "remote",
      "work-from-home",
    ];

    const lowProfilePayTypes = [
      "unpaid",
      "volunteer",
      "stipend",
      "hourly",
      "daily",
      "negotiable",
      "commission-based",
      "project-based",
    ];

    console.log("job details:", data);

    // 1️⃣ If profile < 50 → Always show alert (cannot apply)
    if (completion < 50 && !isEducationAdded) {
      setUpdateAlertOpen(true);
      return;
    }

    // 2️⃣ If profile >= 50 and < 60 → only allow low-profile jobs
    if (completion >= 50 && !isEducationAdded && completion < 60) {
      const isLowProfileAllowed =
        lowProfileJobTypes.includes(jobType) ||
        lowProfilePayTypes.includes(payType);

      if (!isLowProfileAllowed) {
        setUpdateAlertOpen(true); // Show modal
        return;
      }

      // Allowed
      navigate(`/user/career-goal/${data?._id}`);
      return;
    }

    // 3️⃣ If profile >= 60 → follow your original logic (allow all)
    if (completion >= 60) {
      navigate(`/user/career-goal/${data?._id}`);
      return;
    }
  }
  function handleUpdateProfile() {
    setUpdateAlertOpen(false);
    navigate(`/user/profile`);
  }

  const handleSelectChange = (fields, value) => {
    // If user clears the select, just reset that field
    if (!value) {
      setSearchFelids((prev) => ({
        ...prev,
        [fields]:
          fields === "required_skills" || fields === "job_type" ? [] : "",
      }));
      return;
    }

    if (fields === "required_skills" || fields === "job_type") {
      setSearchFelids((prev) => ({
        ...prev,
        [fields]: Array.isArray(value)
          ? value.map((v) => v?.value)
          : [value?.value],
      }));
    } else if (fields === "timePeriod") {
      const today = new Date();
      let formDate = "";
      let toDate = "";

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${day}-${month}-${year}`;
      };

      switch (value?.value) {
        case "Today":
          formDate = formatDate(today);
          toDate = formatDate(today);
          break;
        case "Last Week":
          const lastWeek = new Date(today);
          lastWeek.setDate(today.getDate() - 7);
          formDate = formatDate(lastWeek);
          toDate = formatDate(today);
          break;
        case "This Week":
          const startOfWeek = new Date(today);
          const diffToMonday = (startOfWeek.getDay() + 6) % 7;
          startOfWeek.setDate(today.getDate() - diffToMonday);
          formDate = formatDate(startOfWeek);
          toDate = formatDate(today);
          break;
        case "This Month":
          const startOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
          );
          formDate = formatDate(startOfMonth);
          toDate = formatDate(today);
          break;
        default:
          formDate = "";
          toDate = "";
      }

      setSearchFelids((prev) => ({
        ...prev,
        timePeriod: value?.value,
        formDate,
        toDate,
      }));
    } else {
      setSearchFelids((prev) => ({
        ...prev,
        [fields]: value?.value || "",
      }));
    }
  };

  const handlePostJob = () => {
    const isCompany = getCookie("ACTIVE_MODE");
    const accessMode = Number(getCookie("ACCESS_MODE")); // make sure it's a number
    if (isCompany === "company") {
      navigate(`/company/post-job`);
    } else if (accessMode === 6 || accessMode === 5) {
      navigate(`/user/post-job`);
    } else {
      console.warn("Unknown mode, cannot navigate");
    }
  };
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex w-full min-h-screen relative">
      {/* Sidebar / Filters */}
      <div
        className={`
    ${isMobile ? "!fixed" : ""}  /* 👈 fixed only on mobile */
    top-0 left-0 h-screen w-72 sm:w-80 
    glassy-card shadow-xl z-50 overflow-y-auto 
    p-6 pt-10 hide-scrollbar
    transition-transform duration-300 ease-in-out
    ${
      isMobile
        ? isFilterOpen
          ? "translate-x-0"
          : "-translate-x-full"
        : "translate-x-0"
    }
  `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold glassy-text-primary tracking-wide">
            Filters
          </h2>
          <Button
            onClick={resetFilters}
            // className="text-sm glassy-button hover:opacity-80"
          >
            Reset
          </Button>
        </div>

        {/* Filters */}
        <div className="space-y-5">
          {/* Job type checkboxes */}
          <div
            data-tour="opportunity-filter"
            className="relative inline-block w-full z-10"
            // style={{ zIndex: 10 }}
          >
            <div>
              <h3 className="text-sm font-medium glassy-text-primary mb-3">
                Job Type
              </h3>
              <div className="space-y-3">
                {[
                  { key: "full-time", label: "Full Time" },
                  { key: "part-time", label: "Part Time" },
                  { key: "internship", label: "Internship" },
                  { key: "freelance", label: "Freelance" },
                  { key: "remote", label: "Remote" },
                  { key: "on-site", label: "On-site" },
                ].map((filter) => (
                  <label
                    key={filter.key}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={searchFelids?.job_type?.includes(filter.key)}
                      onChange={() => {
                        const updatedJobTypes = searchFelids.job_type.includes(
                          filter.key
                        )
                          ? searchFelids.job_type.filter(
                              (j) => j !== filter.key
                            )
                          : [...searchFelids.job_type, filter.key];

                        handleSelectChange(
                          "job_type",
                          updatedJobTypes.map((v) => ({ value: v }))
                        );
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm glassy-text-primary">
                      {filter.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Select Filters */}
            <FilterSelect2
              label="Industry"
              name={"industry_id"}
              options={allIndustryList}
              selectedOption={allIndustryList?.find(
                (opt) => opt.value === searchFelids?.industry_id
              )}
              onChange={(selected) =>
                handleSelectChange("industry_id", selected)
              }
              isClearable={true}
            />
            <FilterSelect2
              name={"company_id"}
              label="Company Name"
              options={allCompaniesList}
              selectedOption={allCompaniesList?.find(
                (opt) => opt.value === searchFelids?.company_id
              )}
              onChange={(selected) =>
                handleSelectChange("company_id", selected)
              }
              isClearable={true}
            />
            <FilterSelect2
              label="Role"
              options={allProfileRoleList}
              name={"job_title"}
              selectedOption={allProfileRoleList?.find(
                (opt) => opt.value === searchFelids?.job_title
              )}
              onChange={(selected) => handleSelectChange("job_title", selected)}
              isClearable={true}
            />
            <FilterSelect2
              name={"timePeriod"}
              label="Time Period"
              options={[
                { label: "Today", value: "Today" },
                { label: "Last Week", value: "Last Week" },
                { label: "This Month", value: "This Month" },
                { label: "This Week", value: "This Week" },
              ]}
              onChange={(value) => handleSelectChange("timePeriod", value)}
              isClearable={true}
            />
            <FilterSelect2
              label="Skills"
              options={allSkillsList}
              name={"required_skills"}
              selectedOption={allSkillsList?.find(
                (opt) => opt.value === searchFelids?.required_skills
              )}
              onChange={(selected) =>
                handleSelectChange("required_skills", selected)
              }
              isMulti
              isClearable={true}
            />
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={`  p-4 sm:p-6 w-full transition-all duration-300
      ${!selectedJob ? "xl:w-full" : "xl:w-[75%] lg:w-[70%] md:w-[60%]"}`}
      >
        {/* Filter Toggle Button (Mobile Only) */}

        <div className="flex-1   mb-4">
          {/* Your job listing content here */}
        </div>
        <div className="flex flex-wrap items-center justify-between mb-6 gap-3 lg:gap-0">
          {/* Tabs Section */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex space-x-1 p-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] w-full sm:w-auto">
              {["all", "applied", "closed", "bookmarked"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSelectedJob(false);
                    setPageNo(1);
                  }}
                  className={`px-4 sm:px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-in-out flex-1 sm:flex-none
            ${
              activeTab === tab
                ? "glassy-card text-blue-600 shadow-sm"
                : "text-[var(--text-primary)] hover:glassy-text-primary hover:bg-[var(--bg-button-hover)]"
            }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Icon (for Mobile) */}
          {isMobile && (
            <button
              className="glassy-card p-2 rounded-full border border-[var(--border-color)] hover:shadow-md transition-all duration-200"
              onClick={() => setIsFilterOpen(true)}
              aria-label="Open Filters"
            >
              <FiFilter className="text-[var(--text-primary)] text-lg hover:glassy-text-primary" />
            </button>
          )}
        </div>
        {/* ✅ Scrollable Job List */}
        <div className="h-[calc(100vh-160px)] overflow-y-auto hide-scrollbar pr-2">
          <div className="flex flex-col gap-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={`skeleton-${idx}`} className="w-full">
                  <SkeletonJobCard />
                </div>
              ))
            ) : data?.data?.list && data?.data?.list.length > 0 ? (
              data.data.list.map((ele) => (
                <div key={ele._id} className="w-full">
                  <StudentJobCard
                    job={ele}
                    handleAction={handleAction}
                    isSelected={selectedJob?._id === ele._id}
                    applyForJob={applyForJob}
                    onBookmarkToggle={handleBookmark}
                  />
                </div>
              ))
            ) : (
              <div className="w-full mx-auto flex justify-center items-center">
                <NoDataFound />
              </div>
            )}
          </div>
        </div>

        {data?.data?.total > size && (
          <Pagination
            totalPages={Math.ceil(data?.data?.total / size)}
            currentPage={pageNo}
            onPageChange={(newPage) => setPageNo(newPage)}
          />
        )}
      </div>

      {selectedJob && (
        // <div className="!sticky right-0 top-0 h-screen xl:max-w-[445px] lg:max-w-[345px] md:max-w-[300px] w-full glassy-card rounded-2xl p-6 overflow-y-auto mt-10">
        <div className="hidden md:block !sticky right-0 top-0 h-screen xl:max-w-[445px] lg:max-w-[345px] md:max-w-[300px] w-full glassy-card rounded-2xl p-6 overflow-y-auto mt-10">
          <div className="mb-4">
            <span className="inline-block glassy-card text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
              Selected Job
            </span>
          </div>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              {!selectedJob?.company_id?.logo_url || imageError ? (
                <div className="w-12 h-12   flex items-center justify-center glassy-text-primary font-bold text-lg rounded-lg">
                  <img
                    src={"/36369.jpg"}
                    alt={"company name"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/36369.jpg";
                    }}
                    className="md:w-12 md:h-12 w-10 h-10 object-cover "
                  />
                </div>
              ) : (
                <img
                  src={selectedJob?.company_id.logo_url}
                  alt={selectedJob?.company_id.name}
                  className="w-12 h-12 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/36369.jpg";
                  }}
                />
              )}
              <div>
                <h3 className="font-semibold glassy-text-primary">
                  {selectedJob?.company_id?.name}
                </h3>
                <p className="glassy-text-secondary text-sm">
                  {selectedJob?.industry_id?.name}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedJob(false)}
              className="glassy-text-secondary hover:glassy-text-primary transition-all"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Job Title */}
          <h2 className="text-xl font-bold glassy-text-primary mb-2">
            {selectedJob?.job_title?.name || "Job Title"}
          </h2>

          {/* Job Type / Location / Pay */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium glassy-card0/20 text-blue-400">
              {selectedJob?.job_type?.replace("-", " ") || "Full-time"}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium glassy-card/20 text-green-400">
              {selectedJob?.job_location === "on-site" ? "On-site" : "Remote"}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
              {selectedJob?.pay_type === "volunteer" ? "Volunteer" : "Paid"}
            </span>
          </div>

          {/* Salary */}
          {selectedJob?.salary_range && (
            <div className="mb-4">
              <strong className="glassy-text-primary">Salary Range:</strong>
              <span className="ml-2 glassy-text-secondary">
                {selectedJob?.salary_range}
              </span>
            </div>
          )}

          {/* Location */}
          {selectedJob?.work_location && (
            <div className="mb-4">
              <strong className="glassy-text-primary">Location:</strong>
              <p className="glassy-text-secondary text-sm flex items-center gap-2 mt-1">
                <CiLocationOn />
                {selectedJob?.work_location?.state?.name},{" "}
                {selectedJob?.work_location?.city?.name}
              </p>
            </div>
          )}

          {/* Description */}
          <div className="mb-4">
            <strong className="glassy-text-primary block mb-2">
              Job Description:
            </strong>
            {/* <p className="glassy-text-secondary text-sm leading-relaxed break-words break-all  whitespace-pre-line rounded-lg p-4 border border-[var(--border-color)] bg-[var(--bg-card)]">
              {selectedJob?.job_description || "No description provided."}
            </p> */}
            <p
              className="glassy-text-primary leading-relaxed break-words break-all whitespace-pre-line
      p-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)]
      overflow-hidden text-ellipsis"
            >
              {isExpandedDesktop
                ? selectedJob?.job_description
                : selectedJob?.job_description.slice(0, 200)}
              {selectedJob?.job_description.length > 200 && (
                <>
                  {!isExpandedDesktop && "..."}
                  <button
                    onClick={() => setIsExpandedDesktop(!isExpandedDesktop)}
                    className="ml-2 md:text-sm text-xs text-blue-500 hover:underline"
                  >
                    {isExpandedDesktop ? "See less" : "See more"}
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Skills */}
          {selectedJob?.required_skills?.length > 0 && (
            <div className="mb-4">
              <strong className="glassy-text-primary block mb-2">
                Required Skills:
              </strong>
              <div className="flex flex-wrap gap-2">
                {selectedJob?.required_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium glassy-card glassy-text-secondary"
                  >
                    {skill.name || skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Application Status */}
          {selectedJob?.isApplied && (
            <div className="mb-4">
              <strong className="glassy-text-primary">
                Application Status:
              </strong>
              <span
                className={`ml-2 ${
                  selectedJob?.jobApplication?.status === "applied"
                    ? "text-blue-600"
                    : selectedJob?.jobApplication?.status === "rejected"
                    ? "text-red-600"
                    : selectedJob?.jobApplication?.status ===
                      "selected_in_interview"
                    ? "text-green-600"
                    : selectedJob?.isSchedule && selectedJob?.interviewDetails
                    ? "text-purple-600"
                    : selectedJob?.jobApplication?.passed
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {selectedJob?.jobApplication?.status === "applied"
                  ? "Applied"
                  : selectedJob?.jobApplication?.status === "rejected"
                  ? "Not Selected"
                  : selectedJob?.jobApplication?.status ===
                    "selected_in_interview"
                  ? "🎉 Selected"
                  : selectedJob?.isSchedule && selectedJob?.interviewDetails
                  ? "Scheduled Interview"
                  : selectedJob?.jobApplication?.passed
                  ? "Accepted"
                  : "Under Review"}
              </span>
            </div>
          )}

          {selectedJob?.isSchedule &&
            selectedJob?.interviewDetails &&
            selectedJob?.jobApplication?.status !== "rejected" &&
            selectedJob?.jobApplication?.status !== "selected_in_interview" && (
              <div className="mt-4 p-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm">
                <h3 className="text-lg font-semibold glassy-text-primary capitalize mb-3 flex items-center gap-1">
                  📅 Interview Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm glassy-text-secondary">
                  <div>
                    <span className="font-medium glassy-text-primary">
                      Interview Date:
                    </span>
                    <div className="glassy-text-secondary">
                      {convertTimestampToDate(
                        selectedJob?.interviewDetails.select_date
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="font-medium glassy-text-primary">
                      Interview Time:
                    </span>
                    <div className="glassy-text-secondary">
                      {convertTimestampToDate(
                        selectedJob?.interviewDetails.select_time
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="font-medium glassy-text-primary">
                      Meeting Link:
                    </span>
                    <div className="text-blue-600 truncate">
                      <a
                        href={selectedJob?.interviewDetails.meeting_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {selectedJob?.interviewDetails.meeting_url}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* Posted Date */}
          <div className="text-sm glassy-text-secondary mt-4">
            Posted on:{" "}
            {new Date(selectedJob?.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          {/* Apply Button */}
          <div className="mt-6">
            <Button
              size="sm"
              disabled={applyStatus.disabled}
              onClick={() => !applyStatus.disabled && applyForJob(selectedJob)}
              className={`w-full ${
                applyStatus.disabled ? "opacity-60 cursor-not-allowed" : ""
              }`}
              variant="primary"
            >
              {applyStatus.reason}
            </Button>
          </div>
        </div>
      )}
      {/* MOBILE MODAL VIEW */}
      {selectedJob && (
        // <div className="fixed inset-0   bg-opacity-50 z-50 flex justify-center items-center md:hidden">
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center md:hidden">
          {/* Main Modal Box */}
          <div className="relative glassy-card w-[90%] max-h-[85vh] rounded-2xl shadow-lg flex flex-col overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setSelectedJob(false)}
              className="absolute top-3 right-3  glassy-text-secondary"
            >
              <IoClose size={24} />
            </button>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 pt-8">
              {/* Header Section */}
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={selectedJob?.company_id?.logo_url || "/36369.jpg"}
                  alt={selectedJob?.company_id?.name}
                  className="w-12 h-12 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/36369.jpg";
                  }}
                />
                <div>
                  <h3 className="font-semibold glassy-text-primary">
                    {selectedJob?.company_id?.name}
                  </h3>
                  <p className="glassy-text-secondary text-sm">
                    {selectedJob?.industry_id?.name}
                  </p>
                </div>
              </div>

              {/* Job Title */}
              <h2 className="text-lg font-bold glassy-text-primary mb-2">
                {selectedJob?.job_title?.name || "Job Title"}
              </h2>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded">
                  {selectedJob?.job_type?.replace("-", " ") || "Full-time"}
                </span>
                <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded">
                  {selectedJob?.job_location === "on-site"
                    ? "On-site"
                    : "Remote"}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-400">
                  {selectedJob?.pay_type === "volunteer" ? "Volunteer" : "Paid"}
                </span>
              </div>

              {/* Job Description */}
              <div className="text-sm glassy-text-primary mb-4">
                <p className="font-medium mb-1">Job Description:</p>
                {/* <p className="glassy-text-secondary p-3 rounded-lg border border-gray-100 whitespace-pre-line break-words break-all overflow-hidden text-ellipsis">
                  {selectedJob?.job_description || "No description provided."}
                </p> */}
                {isExpandedMobile
                  ? selectedJob?.job_description
                  : selectedJob?.job_description.slice(0, 200)}
                {selectedJob?.job_description.length > 200 && (
                  <>
                    {!isExpandedMobile && "..."}
                    <button
                      onClick={() => setIsExpandedMobile(!isExpandedMobile)}
                      className="ml-2 md:text-sm text-xs text-blue-500 hover:underline"
                    >
                      {isExpandedMobile ? "See less" : "See more"}
                    </button>
                  </>
                )}
              </div>

              {/* Required Skills */}
              {selectedJob?.required_skills?.length > 0 && (
                <div className="mb-4">
                  <strong className="glassy-text-primary block mb-2">
                    Required Skills:
                  </strong>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob?.required_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="glassy-card glassy-text-primary text-xs px-2.5 py-0.5 rounded"
                      >
                        {skill.name || skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Application Status */}
              {selectedJob?.isApplied && (
                <div className="mb-4">
                  <strong className="glassy-text-primary">
                    Application Status:
                  </strong>
                  <span
                    className={`ml-2 ${
                      selectedJob?.jobApplication?.status === "applied"
                        ? "text-blue-600"
                        : selectedJob?.jobApplication?.status === "rejected"
                        ? "text-red-600"
                        : selectedJob?.jobApplication?.status ===
                          "selected_in_interview"
                        ? "text-green-600"
                        : selectedJob?.isSchedule &&
                          selectedJob?.interviewDetails
                        ? "text-purple-600"
                        : selectedJob?.jobApplication?.passed
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {selectedJob?.jobApplication?.status === "applied"
                      ? "Applied"
                      : selectedJob?.jobApplication?.status === "rejected"
                      ? "Not Selected"
                      : selectedJob?.jobApplication?.status ===
                        "selected_in_interview"
                      ? "🎉 Selected"
                      : selectedJob?.isSchedule && selectedJob?.interviewDetails
                      ? "Scheduled Interview"
                      : selectedJob?.jobApplication?.passed
                      ? "Accepted"
                      : "Under Review"}
                  </span>
                </div>
              )}

              {/* Interview Details */}
              {selectedJob?.isSchedule && selectedJob?.interviewDetails && (
                <div className="mb-4 p-4 glassy-card rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-base font-semibold glassy-text-primary mb-3">
                    📅 Interview Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm ">
                    <div>
                      <span className="glassy-text-primary font-medium">
                        Interview Date:
                      </span>
                      <div className="glassy-text-secondary">
                        {convertTimestampToDate(
                          selectedJob?.interviewDetails.select_date
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="font-medium glassy-text-primary">
                        Interview Time:
                      </span>
                      <div className="glassy-text-secondary">
                        {convertTimestampToDate(
                          selectedJob?.interviewDetails.select_time
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="font-medium glassy-text-primary">
                        Meeting Link:
                      </span>
                      <div className="text-blue-600 truncate">
                        <a
                          href={selectedJob?.interviewDetails.meeting_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {selectedJob?.interviewDetails.meeting_url}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Posted Date */}
              <div className="text-sm glassy-text-secondary mt-2">
                Posted on:{" "}
                {new Date(selectedJob?.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* Sticky Apply Button */}
            <div className="p-4 border-t border-gray-200">
              <Button
                size="sm"
                disabled={applyStatus.disabled}
                onClick={() =>
                  !applyStatus.disabled && applyForJob(selectedJob)
                }
                className={`w-full ${
                  applyStatus.disabled
                    ? "opacity-60 cursor-not-allowed"
                    : "glassy-button"
                }`}
                variant="primary"
              >
                {applyStatus.reason}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ProfileUpdateAlert
        isOpen={updateAlertOpen}
        onClose={() => setUpdateAlertOpen(false)}
        onUpdate={handleUpdateProfile}
      />
    </div>
  );
};

export default Opportunitiess2;
