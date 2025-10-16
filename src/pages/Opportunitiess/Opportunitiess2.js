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

  const [activeTab, setActiveTab] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    status: false,
    industry: false,
    role: false,
    skill: false,
    timePeriod: false,
  });
  useEffect(() => {
    const foundJob = data?.data?.list?.find(
      (value) =>
        value?.interviewDetails?._id === param?.id ||
        value?.jobApplication?._id === param?.id ||
        value?._id === param?.id
    );
    if (foundJob) {
      setSelectedJob(foundJob); // directly set the found item
    }
  }, [param?.id, data]);
  const [pageNo, setPageNo] = useState(1);
  const size = 8;
  const [searchFelids, setSearchFelids] = useState({
    company_id: "",
    industry_id: "",
    job_title: "",
    required_skills: [],
    formDate: "",
    toDate: "",
    timePeriod: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const allCompaniesList = [
    { value: "", label: "Select" },
    ...arrayTransform(selector2?.work?.getAllCompaniesData?.data?.data || []),
  ];
  const allIndustryList = [
    { value: "", label: "Select" },
    ...arrayTransform(selector?.masterIndustryData?.data?.data?.list),
  ];
  const allProfileRoleList = [
    { value: "", label: "Select" },
    ...arrayTransform(selector?.profileRolesData?.data?.data?.list),
  ];
  const allSkillsList = [
    { value: "", label: "Select" },
    ...arrayTransform(selector?.masterSkillsData?.data?.data?.list),
  ];

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchJobs = async () => {
        setIsLoading(true);

        const filters = {
          type: activeTab,
        };

        if (searchFelids?.company_id)
          filters.company_id = searchFelids.company_id;
        if (searchFelids?.industry_id)
          filters.industry_id = searchFelids.industry_id;
        if (searchFelids?.job_title) filters.job_title = searchFelids.job_title;
        if (searchFelids?.required_skills?.length > 0)
          filters.required_skills = searchFelids.required_skills;

        const apiPayload = {
          page: pageNo,
          size: size,
          query: JSON.stringify(filters),
          fromDate: searchFelids?.formDate || "",
          toDate: searchFelids?.toDate || "",
        };

        await dispatch(userJobs(apiPayload));
        setIsLoading(false);
      };

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
    // console.log("data:---->>>", data)
  };
  function applyForJob(data) {
    navigate(`/user/career-goal/${data?._id}`);
  }

  const handleSelectChange = (fields, value) => {
    if (fields === "required_skills") {
      setSearchFelids((prev) => ({
        ...prev,
        [fields]: value.map((v) => v.value),
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

      if (value.value === "Today") {
        formDate = formatDate(today);
        toDate = formatDate(today);
      } else if (value.value === "Last Week") {
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        formDate = formatDate(lastWeek);
        toDate = formatDate(today);
      } else if (value.value === "This Week") {
        const startOfWeek = new Date(today);
        const dayOfWeek = startOfWeek.getDay();
        const diffToMonday = (dayOfWeek + 6) % 7;
        startOfWeek.setDate(today.getDate() - diffToMonday);
        formDate = formatDate(startOfWeek);
        toDate = formatDate(today);
      } else if (value.value === "This Month") {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        formDate = formatDate(startOfMonth);
        toDate = formatDate(today);
      }

      setSearchFelids((prev) => ({
        ...prev,
        timePeriod: value.value,
        formDate,
        toDate,
      }));
    } else {
      setSearchFelids((prev) => ({
        ...prev,
        [fields]: value.value,
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

  return (
    <div className="bg-[#F6FAFD] min-h-screen flex justify-start place-items-start">
      <div
        className={`w-full p-4 sm:p-6 ${
          !selectedJob
            ? "xl:w-[100%] lg:w-[100%] md:w-[100%]"
            : "xl:w-[75%] lg:w-[70%] md:w-[60%]"
        } `}
      >
        <div className="flex flex-wrap lg:items-center justify-between mb-6  lg:space-y-0">
          <div className="flex flex-col lg:flex-row xl:flex-row flex-wrap gap-3 sm:flex-row items-end sm:justify-between  space-y-4 sm:space-y-0">
            <div className="flex space-x-1 p-1 rounded-full bg-white border border-gray-200 w-full sm:w-auto ">
              <button
                onClick={() => {
                  setActiveTab("all");
                  setSelectedJob(false);
                  setPageNo(1);
                }}
                className={`px-4 sm:px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-in-out flex-1 sm:flex-none ${
                  activeTab === "all"
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-[#000000E6]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setActiveTab("applied");
                  setSelectedJob(false);
                  setPageNo(1);
                }}
                className={`px-4 sm:px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-in-out flex-1 sm:flex-none ${
                  activeTab === "applied"
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-[#000000E6]"
                }`}
              >
                Applied
              </button>
              <button
                onClick={() => {
                  setActiveTab("closed");
                  setSelectedJob(false);
                  setPageNo(1);
                }}
                className={`px-4 sm:px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-in-out flex-1 sm:flex-none ${
                  activeTab === "closed"
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-[#000000E6]"
                }`}
              >
                Closed
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center  sm:items-center space-y-3 sm:space-y-0 gap-2 sm:space-x-4">
            <div className="relative" ref={filterDropdownRef}>
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full sm:w-auto"
              >
                <TbAdjustmentsHorizontal className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Filter</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-[#000000E6] mb-3">
                      Filter Settings
                    </h3>

                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.status}
                          onChange={() => handleFilterChange("status")}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          Company Name
                        </span>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.industry}
                          onChange={() => handleFilterChange("industry")}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Industry</span>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.role}
                          onChange={() => handleFilterChange("role")}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Role</span>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.skill}
                          onChange={() => handleFilterChange("skill")}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Skills</span>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.timePeriod}
                          onChange={() => handleFilterChange("timePeriod")}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          Time Period
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* <Button
              type="button"
              className="w-full sm:w-auto whitespace-nowrap"
              onClick={handlePostJob}
            >
              Post a Job
            </Button> */}
          </div>
        </div>

        {hasActiveFilters() && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {selectedFilters.status && (
              <FilterSelect2
                label="Company Name"
                options={allCompaniesList}
                selectedOption={allCompaniesList?.find(
                  (opt) => opt.value === searchFelids?.company_id
                )}
                onChange={(selected) =>
                  handleSelectChange("company_id", selected)
                }
                isClearable={false}
              />
            )}
            {selectedFilters.industry && (
              <FilterSelect2
                label="Industry"
                options={allIndustryList}
                selectedOption={allIndustryList?.find(
                  (opt) => opt.value === searchFelids?.industry_id
                )}
                onChange={(selected) =>
                  handleSelectChange("industry_id", selected)
                }
                isClearable={false}
              />
            )}
            {selectedFilters.role && (
              <FilterSelect2
                label="Role"
                options={allProfileRoleList}
                selectedOption={allProfileRoleList?.find(
                  (opt) => opt.value === searchFelids?.job_title
                )}
                onChange={(selected) =>
                  handleSelectChange("job_title", selected)
                }
                isClearable={false}
              />
            )}
            {selectedFilters.skill && (
              <FilterSelect2
                label="Skills"
                options={allSkillsList}
                selectedOption={allSkillsList?.find(
                  (opt) => opt.value === searchFelids?.required_skills
                )}
                onChange={(selected) =>
                  handleSelectChange("required_skills", selected)
                }
                isMulti
                isClearable={false}
              />
            )}
            {selectedFilters.timePeriod && (
              <FilterSelect2
                label="Today / Last Week"
                options={[
                  { label: "Select", value: "" },
                  { label: "Today", value: "Today" },
                  { label: "Last Week", value: "Last Week" },
                  { label: "This Month", value: "This Month" },
                  { label: "This Week", value: "This Week" },
                ]}
                onChange={(value) => handleSelectChange("timePeriod", value)}
                isClearable={false}
              />
            )}
          </div>
        )}

        <div className="h-full">
          <div
            className={`grid ${
              !selectedJob
                ? "xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-1 grid-cols-1"
                : "xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1"
            }  items-center gap-2`}
          >
            {isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={`skeleton-${idx}`} className="mb-4">
                  <SkeletonJobCard />
                </div>
              ))
            ) : data?.data?.list && data?.data?.list.length > 0 ? (
              data.data.list.map((ele) => (
                <StudentJobCard
                  key={ele._id}
                  job={ele}
                  handleAction={handleAction}
                  isSelected={selectedJob?._id === ele._id}
                  applyForJob={applyForJob}
                />
              ))
            ) : (
              <div className="w-full  mx-auto flex justify-center items-center">
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
        <div
          className={`w-full md:block hidden xl:max-w-[445px] lg:max-w-[345px] md:max-w-[300px] max-w-[200px] bg-[#FFFFFF] rounded-2xl border-l border-gray-200 p-6 overflow-y-auto mt-10`}
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              {!selectedJob.company_id?.logo_url || imageError ? (
                <div className="w-12 h-12 bg-gray-900  flex items-center justify-center text-white font-bold text-lg">
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
                  src={selectedJob.company_id.logo_url}
                  alt={selectedJob.company_id.name}
                  className="w-12 h-12 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/36369.jpg";
                  }}
                />
              )}
              <div>
                <h3 className="font-semibold text-[#000000E6]">
                  {selectedJob.company_id?.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {selectedJob.industry_id?.name}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedJob(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
          </div>

          <h2 className="text-xl font-bold text-[#000000E6] mb-2">
            {selectedJob.job_title?.name || "Job Title"}
          </h2>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded">
              {selectedJob.job_type?.replace("-", " ") || "Full-time"}
            </span>
            <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded">
              {selectedJob.job_location === "on-site" ? "On-site" : "Remote"}
            </span>
            <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded">
              {selectedJob.pay_type === "volunteer" ? "Volunteer" : "Paid"}
            </span>
          </div>

          {selectedJob.salary_range && (
            <div className="mb-4">
              <strong className="text-gray-700">Salary Range:</strong>
              <span className="ml-2 text-gray-600">
                {selectedJob.salary_range}
              </span>
            </div>
          )}

          {selectedJob.work_location && (
            <div className="mb-4">
              <strong className="text-gray-700">Location:</strong>
              <p className="text-[#000000] text-sm font-normal mb-2 truncate flex justify-start items-center gap-2 ">
                <CiLocationOn />
                {selectedJob?.work_location?.state?.name},
                {selectedJob?.work_location?.city?.name}
              </p>
            </div>
          )}

          <div className="mb-4">
            <strong className="text-gray-700 block mb-2">
              Job Description:
            </strong>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line bg-white p-4 rounded-lg border border-gray-100">
              {selectedJob.job_description || "No description provided."}
            </p>
          </div>

          {selectedJob.required_skills?.length > 0 && (
            <div className="mb-4">
              <strong className="text-gray-700 block mb-2">
                Required Skills:
              </strong>
              <div className="flex flex-wrap gap-2">
                {selectedJob.required_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded"
                  >
                    {skill.name || skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedJob.isApplied && (
            <div className="mb-4">
              <strong className="text-gray-700">Application Status:</strong>
              <span
                className={`ml-2 ${
                  selectedJob.jobApplication?.status === "applied"
                    ? "text-blue-600"
                    : selectedJob.jobApplication?.passed
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {selectedJob.jobApplication?.status === "applied"
                  ? "Applied"
                  : selectedJob.jobApplication?.passed
                  ? "Accepted"
                  : "Under Review"}
              </span>
            </div>
          )}

          {selectedJob?.isSchedule && selectedJob?.interviewDetails && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 capitalize mb-3">
                📅 Interview Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                <div>
                  <span className="font-medium">Interview Date:</span>
                  <div className="text-gray-600">
                    {convertTimestampToDate(
                      selectedJob.interviewDetails.select_date
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-medium">Interview Time:</span>
                  <div className="text-gray-600">
                    {convertTimestampToDate(
                      selectedJob.interviewDetails.select_time
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <span className="font-medium">Meeting Link:</span>
                  <div className="text-blue-600 truncate">
                    <a
                      href={selectedJob.interviewDetails.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {selectedJob.interviewDetails.meeting_url}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500 mt-4">
            Posted on:{" "}
            {new Date(selectedJob.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      )}
      {/* MOBILE MODAL VIEW */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center md:hidden">
          <div className="bg-white w-[90%] max-h-[90vh] overflow-y-auto rounded-2xl p-4 relative">
            <button
              onClick={() => setSelectedJob(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>

            {/* ✅ Reuse same content as your sidebar */}
            <div className="pt-6">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={selectedJob.company_id?.logo_url || "/36369.jpg"}
                  alt={selectedJob.company_id?.name}
                  className="w-12 h-12 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/36369.jpg";
                  }}
                />
                <div>
                  <h3 className="font-semibold text-[#000000E6]">
                    {selectedJob.company_id?.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {selectedJob.industry_id?.name}
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-bold text-[#000000E6] mb-2">
                {selectedJob.job_title?.name || "Job Title"}
              </h2>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded">
                  {selectedJob.job_type?.replace("-", " ") || "Full-time"}
                </span>
                <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded">
                  {selectedJob.job_location === "on-site"
                    ? "On-site"
                    : "Remote"}
                </span>
              </div>

              {/* ✅ Job Description */}
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">Job Description:</p>
                <p className="bg-gray-50 p-2 rounded-lg border border-gray-100 whitespace-pre-line">
                  {selectedJob.job_description || "No description provided."}
                </p>
              </div>

              {/* ✅ Required Skills */}
              {selectedJob.required_skills?.length > 0 && (
                <div className="mt-4">
                  <strong className="text-gray-700 block mb-2">
                    Required Skills:
                  </strong>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.required_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded"
                      >
                        {skill.name || skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ✅ Application Status */}
              {selectedJob.isApplied && (
                <div className="mt-4">
                  <strong className="text-gray-700">Application Status:</strong>
                  <span
                    className={`ml-2 ${
                      selectedJob.jobApplication?.status === "applied"
                        ? "text-blue-600"
                        : selectedJob.jobApplication?.passed
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {selectedJob.jobApplication?.status === "applied"
                      ? "Applied"
                      : selectedJob.jobApplication?.passed
                      ? "Accepted"
                      : "Under Review"}
                  </span>
                </div>
              )}

              {/* ✅ Interview Details */}
              {selectedJob?.isSchedule && selectedJob?.interviewDetails && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 capitalize mb-3">
                    📅 Interview Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                    <div>
                      <span className="font-medium">Interview Date:</span>
                      <div className="text-gray-600">
                        {convertTimestampToDate(
                          selectedJob.interviewDetails.select_date
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="font-medium">Interview Time:</span>
                      <div className="text-gray-600">
                        {convertTimestampToDate(
                          selectedJob.interviewDetails.select_time
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="font-medium">Meeting Link:</span>
                      <div className="text-blue-600 truncate">
                        <a
                          href={selectedJob.interviewDetails.meeting_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {selectedJob.interviewDetails.meeting_url}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ✅ Posted Date */}
              <div className="text-sm text-gray-500 mt-4">
                Posted on:{" "}
                {new Date(selectedJob.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Opportunitiess2;
