import React, { useEffect, useState } from "react";
import {
  Edit,
  Globe,
  Phone,
  Users,
  Calendar,
  MapPin,
  Building,
  CheckCircle,
} from "lucide-react";
import CreatableSelect from "react-select/creatable";
import { getPostList } from "../../../redux/CompanySlices/companiesSlice";
import PeopleToConnect from "../../../components/ui/ConnectSidebar/ConnectSidebar";
import {
  adminProfile,
  updateProfileCompanies,
  companiesProfile,
  instituteProfile,
  companyIndustries,
  setCompaniesProfileData,
  updateProfileInstitutions,
  setInstitutionsProfileData,
  institutionTypePublic,
} from "../../../redux/CompanySlices/CompanyAuth";
import { useDispatch, useSelector } from "react-redux";
import { suggestedUser } from "../../../redux/Users/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, Plus } from "lucide-react";
import useFormHandler from "../../../components/hooks/useFormHandler";
import {
  FiMail,
  FiPhone,
  FiGlobe,
  FiUser,
  FiCamera,
  FiCheck,
} from "react-icons/fi";
import {
  arrayTransform,
  uploadImageDirectly,
} from "../../../components/utils/globalFunction";
import { getCookie } from "../../../components/utils/cookieHandler";
import { toast } from "sonner";
import Button from "../../../components/ui/Button/Button";
import CustomInput from "../../../components/ui/InputAdmin/CustomInput";
import FilterSelect from "../../../components/ui/InputAdmin/FilterSelect";
import Modal from "../../../components/ui/InputAdmin/Modal/Modal";
import { FaRegCommentDots, FaRegShareSquare } from "react-icons/fa";
import { AiOutlineLike, AiOutlineEye } from "react-icons/ai";
import { jobsList } from "../../../redux/Global Slice/cscSlice";
import classNames from "classnames";
import JobPost from "../../Home/components/JobPost";
import NoDataFound from "../../../components/ui/No Data/NoDataFound";
import { useGlobalKeys } from "../../../context/GlobalKeysContext";
import { company_type, ROLES } from "../../../utils/utils";

const CompanyProfile = ({
  adminProfileData,
  companiesProfileData,
  instituteProfileData,
}) => {
  const userRole = Number(getCookie("ROLE"));
  const dispatch = useDispatch();
  const emptyCountryCode = {
    name: "",
    dial_code: "",
    short_name: "",
    emoji: "",
  };
  const emptyState = { name: "", code: "" };
  const emptyCity = { name: "" };

  const baseForm = {
    name: "",
    display_name: "",
    description: "",
    website_url: "",
    logo_url: "",
    founded_year: "",
    specialties: [],
    employee_count: "",
    linkedin_page_url: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    country_code: { ...emptyCountryCode },
    phone_no: "",
  };

  // Company-specific extra fields
  const companyExtra = {
    banner_image_url: "",
    industry: [],
    company_size: "",
    company_type: "",
    headquarters: {
      address_line_1: "",
      address_line_2: "",
      country: { ...emptyCountryCode },
      state: { ...emptyState },
      city: { ...emptyCity },
      pin_code: "",
    },
    specialties: [""], // override baseForm specialties for default
  };

  // Institution-specific extra fields
  const institutionExtra = {
    institution_type_id: "",
    degree_ids: [],
    address: {
      address_line_1: "",
      address_line_2: "",
      country: { ...emptyCountryCode },
      state: { ...emptyState },
      city: { ...emptyCity },
      pin_code: "",
    },
  };

  const getInitialFormData = () => {
    if ([ROLES.COMPANIES, ROLES.COMPANIES_ADMIN].includes(userRole)) {
      return { ...baseForm, ...companyExtra };
    }

    if ([ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)) {
      return { ...baseForm, ...institutionExtra };
    }

    return {};
  };

  const { formData, setFormData, handleChange, errors, setErrors } =
    useFormHandler(getInitialFormData());
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [institutionTypes, setInstitutionTypes] = useState([]);
  const [people, setPeople] = useState([]);
  const [activeTab, setActiveTab] = useState("Home");
  const [agencyData, setAgencyData] = useState({});
  const [activeTab1, setActiveTab1] = useState("user");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cscSelector = useSelector((state) => state.global);
  const IndusteryData = useSelector((state) => state.companyAuth);
  const userSelector = useSelector((state) => state.user);
  const { suggestedUserData: { data: suggestedUsers } = {} } =
    userSelector || {};
  const { getPostListData: { data: posts = [] } = {} } = useSelector(
    (state) => state.companies
  );
  const { jobsListData: { data: jobs = [] } = {} } = useSelector(
    (state) => state.global
  );
  const companiesSelector = useSelector((state) => state.companies);
  const assignedUsers =
    companiesSelector?.getAssignedUsersData?.data?.data || [];

  const allIndustry = arrayTransform(
    IndusteryData?.companyIndustryData?.data?.data?.list || []
  );
  const countriesList = arrayTransform(
    cscSelector?.countriesData?.data?.data || []
  );
  const profileData = [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole)
    ? adminProfileData
    : [ROLES.COMPANIES, ROLES.COMPANIES_ADMIN].includes(userRole)
    ? companiesProfileData
    : [ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)
    ? instituteProfileData
    : {};

  const institutionTypeOptions = institutionTypes?.map((item) => ({
    value: item?._id,
    label: item?.name,
  }));

  const fetchData = () => {
    if ([ROLES.COMPANIES, ROLES.COMPANIES_ADMIN].includes(userRole)) {
      dispatch(companiesProfile());
    }
    if ([ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)) {
      dispatch(instituteProfile());
    }
  };
  const navigate = useNavigate();
  const { isCompany } = useGlobalKeys();
  const validateProfileForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.username?.trim()) newErrors.username = "Username is required";
    if (!formData.name?.trim()) newErrors.name = "Company name is required";
    if (!formData.display_name?.trim())
      newErrors.display_name = "Display name is required";
    if (!formData.phone_no?.trim())
      newErrors.phone_no = "Phone number is required";
    if (!formData.email?.trim()) newErrors.email = "Email is required";

    // Email format validation
    if (
      formData.email?.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password?.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword?.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Industry validation
    if (!Array.isArray(formData.industry) || formData.industry.length === 0) {
      newErrors.industry = "At least one industry is required";
    }

    // Specialty validation
    const specialtyErrors = [];
    formData.specialties.forEach((specialty, index) => {
      if (specialty && String(specialty).trim() === "") {
        specialtyErrors[index] = "Specialty cannot be empty";
      }
    });
    if (specialtyErrors.some((error) => error)) {
      newErrors.specialties = specialtyErrors;
    }

    // Year validation
    if (
      formData.founded_year &&
      (isNaN(formData.founded_year) ||
        formData.founded_year < 1800 ||
        formData.founded_year > new Date().getFullYear())
    ) {
      newErrors.founded_year =
        "Please enter a valid year between 1800 and current year";
    }

    // Employee count validation
    if (
      formData.employee_count &&
      (isNaN(formData.employee_count) || formData.employee_count < 0)
    ) {
      newErrors.employee_count = "Please enter a valid positive number";
    }

    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

    const linkedInRegex = /^https?:\/\/(www\.)?linkedin\.com\/.*$/i;

    if (formData.website_url && !urlRegex.test(formData.website_url.trim())) {
      newErrors.website_url =
        "Please enter a valid URL starting with http:// or https://";
    }

    if (
      formData.linkedin_page_url &&
      !linkedInRegex.test(formData.linkedin_page_url.trim())
    ) {
      newErrors.linkedin_page_url =
        "Please enter a valid LinkedIn URL (e.g. https://www.linkedin.com/...)";
    }

    return newErrors;
  };
  const handleProfileSubmit = async (overrideData = null) => {
    // Merge formData + overrideData (e.g., banner/logo updates)
    const dataToUse = { ...formData, ...(overrideData || {}) };

    // Only validate on full form submit (not banner/logo updates)
    if (!overrideData && !validateProfileForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      setIsLoading(true);
      let res;
      const formattedSpecialties = (dataToUse.specialties || [])
        .map((s) => String(s || "").trim())
        .filter((s) => s !== "");

      const foundedYearTimestamp = dataToUse.founded_year
        ? Math.floor(
            new Date(`${dataToUse.founded_year}-01-01`).getTime() / 1000
          )
        : null;

      const employeeCount = dataToUse.employee_count
        ? Number(dataToUse.employee_count)
        : [ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)
        ? null
        : 0;

      // Common payload for both roles
      const commonPayload = {
        name: dataToUse.name,
        display_name: dataToUse.display_name,
        description: dataToUse.description,
        website_url: dataToUse.website_url,
        logo_url: dataToUse.logo_url,
        banner_image_url: dataToUse.banner_image_url,
        country_code: dataToUse.country_code,
        phone_no: dataToUse.phone_no,
        founded_year: foundedYearTimestamp,
        specialties: formattedSpecialties,
        employee_count: employeeCount,
        linkedin_page_url: dataToUse.linkedin_page_url,
        email: dataToUse.email,
      };

      if ([ROLES.COMPANIES, ROLES.COMPANIES_ADMIN].includes(userRole)) {
        const apiPayload = {
          ...commonPayload,
          name: dataToUse.name,
          // password: dataToUse.password,
          // confirmPassword: dataToUse.confirmPassword,
          industry: dataToUse.industry?.map((ind) => ind._id) || [],
          company_size: dataToUse.company_size,
          company_type: dataToUse.company_type,
          headquarters: dataToUse.headquarters,
        };

        res = await dispatch(updateProfileCompanies(apiPayload)).unwrap();
        dispatch(setCompaniesProfileData(apiPayload));
      }

      if ([ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)) {
        const apiPayload = {
          ...commonPayload,
          name: dataToUse.name,
          // password: dataToUse.password,
          // confirmPassword: dataToUse.confirmPassword,
          institution_type_id: dataToUse.institution_type_id,
          degree_ids: dataToUse.degree_ids?.map((d) => d._id) || [],
          address: dataToUse.address,
        };

        res = await dispatch(updateProfileInstitutions(apiPayload)).unwrap();
        // dispatch(setInstitutionsProfileData(apiPayload));
      }

      toast.success(res?.message || "Profile updated successfully");

      // Refresh UI after full profile update only
      if (!overrideData) {
        fetchData();
        setIsProfileModalOpen(false);
      } else {
        // For banner/logo updates, update local formData
        setFormData(dataToUse);
      }
    } catch (error) {
      toast.error(error?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file, fieldName = "logo_url") => {
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only image files (JPEG, PNG) are allowed");
      return;
    }

    try {
      setIsImageUploading(true);
      const result = await uploadImageDirectly(file, "PROFILES");
      toast.success(result?.message);

      // Update local form data instantly
      setFormData((prev) => ({
        ...prev,
        [fieldName]: result?.data?.imageURL,
      }));

      // ✅ Return result so caller can use it
      return result;
    } catch (error) {
      toast.error(error || "Failed to upload image");
      throw error; // propagate to caller
    } finally {
      setIsImageUploading(false);
    }
  };

  const getSelectedIndustry = () => {
    if (!formData?.industry || !allIndustry) return [];
    return formData?.industry
      ?.map((industry) => {
        const id = typeof industry === "object" ? industry._id : industry;
        return allIndustry.find((opt) => opt.value === id);
      })
      .filter(Boolean);
  };
  const renderProfileFormFields = () => {
    const isInstitution =
      userRole === ROLES.INSTITUTIONS || userRole === ROLES.INSTITUTIONS_ADMIN;
    const isCompany =
      userRole === ROLES.COMPANIES || userRole === ROLES.COMPANIES_ADMIN;

    return (
      <div className="space-y-8">
        {/* ====== COMMON SECTION ====== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company / Institute Name */}
          <div>
            <CustomInput
              label={isInstitution ? "Institute Name" : "Company Name"}
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={
                isInstitution ? "Enter institute name" : "Enter company name"
              }
              icon={<FiUser className="glassy-text-primary" />}
              error={errors?.name}
            />
          </div>

          {/* Display Name */}
          <div>
            <CustomInput
              label="Display Name"
              type="text"
              value={formData.display_name}
              onChange={(e) => handleChange("display_name", e.target.value)}
              placeholder="Enter display name"
              icon={<FiUser className="glassy-text-primary" />}
              error={errors?.display_name}
            />
          </div>

          {/* Industry Multi-Select */}
          {isCompany && (
            <div className="md:col-span-2">
              <FilterSelect
                label="Industry Name"
                name="industry *"
                placeholder="Select Industry"
                options={allIndustry || []}
                selectedOption={
                  formData.industry && formData.industry.length > 0
                    ? allIndustry.find(
                        (opt) => opt.value === formData.industry[0]?._id
                      )
                    : null
                }
                onChange={(selected) => {
                  if (selected) {
                    handleChange("industry", {
                      target: {
                        value: [{ _id: selected.value, name: selected.label }],
                      },
                    });
                  } else {
                    handleChange("industry", { target: { value: [] } });
                  }
                }}
                error={errors.industry}
                required
                isClearable
              />

              {errors.industry && (
                <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
              )}
            </div>
          )}

          {/* Conditional Section: Company Type */}
          {isCompany && (
            <div>
              <FilterSelect
                label="Company Type"
                options={company_type || []}
                selectedOption={company_type?.find(
                  (opt) => opt.value === formData?.company_type
                )}
                onChange={(selected) =>
                  handleChange("company_type", {
                    target: { value: selected?.value || "" },
                  })
                }
                error={errors.company_type}
              />
            </div>
          )}

          {/* Employee Count */}
          <div>
            <CustomInput
              label="Employee Count"
              value={formData?.employee_count}
              name="employee_count"
              onChange={(e) => handleChange("employee_count", e)}
              placeholder="e.g., 150"
              type="number"
              min="0"
              error={errors.employee_count}
            />
          </div>

          {/* Founded Year */}
          <div>
            <CustomInput
              label="Founded Year"
              value={formData?.founded_year}
              name="founded_year"
              onChange={(e) => handleChange("founded_year", e)}
              placeholder="e.g., 2020"
              type="number"
              min="1800"
              max={new Date().getFullYear()}
              error={errors.founded_year}
            />
          </div>
        </div>

        {/* ====== INSTITUTION SPECIFIC SECTION ====== */}
        {isInstitution && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium glassy-text-primary mb-4">
              Institution Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Institution Type */}
              <div>
                <FilterSelect
                  label="Institution Type *"
                  options={institutionTypeOptions || []}
                  selectedOption={institutionTypeOptions?.find(
                    (opt) => opt.value === formData?.institution_type_id
                  )}
                  onChange={(selected) =>
                    handleChange("institution_type_id", {
                      target: { value: selected?.value || "" },
                    })
                  }
                  error={errors.institution_type_id}
                />
                {errors.institution_type_id && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.institution_type_id}
                  </p>
                )}
              </div>
              <CustomInput
                label="LinkedIn Page URL"
                value={formData?.linkedin_page_url}
                name="linkedin_page_url"
                type="url"
                onChange={(e) =>
                  handleChange("linkedin_page_url", e.target.value)
                }
                placeholder="https://linkedin.com/company/example"
                error={errors.linkedin_page_url}
              />
            </div>

            {/* Website + LinkedIn */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"></div>
          </div>
        )}
      </div>
    );
  };

  const handleImageClick = (fieldName = "logo_url") => {
    const inputId = `imageUpload-${fieldName}`;
    document.getElementById(inputId).click();
  };

  const handleCountryChange = (data) => {
    setFormData((prev) => ({
      ...prev,
      country_code: {
        name: data?.label,
        dial_code: data?.dial_code,
        short_name: data?.short_name,
        emoji: data?.emoji,
      },
    }));
  };

  function timeAgo(timestamp) {
    if (!timestamp) return "";

    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days >= 7) {
      return new Date(timestamp).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } else if (days >= 1) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours >= 1) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes >= 1) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  }

  const EditableField = ({ value, multiline = false, className = "" }) => {
    return (
      <div className={`group relative ${className}`}>
        <div
          className={
            multiline
              ? "whitespace-pre-wrap glassy-text-secondary"
              : "glassy-text-secondary"
          }
        >
          {value}
        </div>
      </div>
    );
  };

  const Navigation = () => (
    <div className="mt-6">
      <nav className="flex border-b border-[var(--border-color)] overflow-x-auto">
        {["Home", "About", "Posts", "Jobs", "People"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "glassy-text-secondary hover:text-blue-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
  const isInstitution =
    userRole === ROLES.INSTITUTIONS || userRole === ROLES.INSTITUTIONS_ADMIN;

  const handleProfileUpdate = () => {
    setIsProfileModalOpen(true);
  };
  const updateAgencyData = (field, value) => {
    setAgencyData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const renderProfileImage = () => {
    const imageField = [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.COMPANIES,
      ROLES.COMPANIES_ADMIN,
      ROLES.INSTITUTIONS,
      ROLES.INSTITUTIONS_ADMIN,
    ].includes(userRole)
      ? "logo_url"
      : "logo_url";
    const imageUrl =
      formData[imageField] ||
      adminProfileData?.[imageField] ||
      profileData?.[imageField] ||
      instituteProfileData?.[imageField] ||
      "";

    return (
      <div className="relative group">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/80 shadow-lg glassy-card relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105">
          {isImageUploading && (
            <div className="absolute inset-0 glassy-card/50 flex items-center justify-center z-10">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <div className="absolute inset-0 glassy-card/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <FiCamera className="w-6 h-6 glassy-text-primary" />
          </div>
          <img
            src={
              imageUrl ||
              "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=500"
            }
            className="w-full h-full object-cover"
            alt="Profile"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=500";
            }}
          />
        </div>
        <input
          type="file"
          id={`imageUpload-${imageField}`}
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0], imageField)}
          className="hidden"
        />
      </div>
    );
  };
  const renderActiveTab = () => {
    switch (activeTab) {
      case "Home":
        return <HomeTab />;
      case "About":
        return <AboutTab />;
      // case 'Posts': return <PostsTab setPosts={setPosts} />;
      case "Posts":
        return <PostsTab posts={posts?.data?.list} />;
      case "Jobs":
        return <JobsTab jobs={jobs?.data?.list} />;
      case "People":
        return <PeopleTab people={people} setPeople={setPeople} />;
      default:
        return <HomeTab />;
    }
  };

  const getInstitutionTypes = () => {
    dispatch(institutionTypePublic())
      .then((res) => {
        if (res) {
          setInstitutionTypes(res?.payload?.data?.list || []);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    const fetchJobs = async () => {
      // ✅ Only send page & size, no extra filters
      const apiPayload = {
        page: 1,
        size: 4,
        query: JSON.stringify({ type: "open" }),
      };

      try {
        const res = await dispatch(jobsList(apiPayload)).unwrap();
        console.log("✅ Jobs API response:", res);

        // If API returns jobs in `data.list`, adjust this
      } catch (err) {
        console.error("❌ Error fetching jobs:", err);
      } finally {
      }
    };

    fetchJobs();
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPostList({ page: 1, size: 2 }))
      .unwrap()
      .then((res) => {
        console.log("✅ API posts response:", res); // full response
      })
      .catch((err) => console.error("❌ Error fetching posts:", err));
  }, [dispatch]);
  useEffect(() => {
    if (!profileData) return;

    const emptyCountryCode = {
      name: "",
      dial_code: "",
      short_name: "",
      emoji: "",
    };
    const emptyState = { name: "", code: "" };
    const emptyCity = { name: "" };
    const emptyAddress = {
      address_line_1: "",
      address_line_2: "",
      country: { ...emptyCountryCode },
      state: { ...emptyState },
      city: { ...emptyCity },
      pin_code: "",
    };

    // Agency / UI-friendly data
    setAgencyData({
      name: profileData?.display_name || profileData?.name || "N/A",
      tagline: "", // default empty
      overview: profileData?.description || "N/A",
      description: profileData?.description || "N/A",
      workDescription: "", // default empty
      website: profileData?.website_url || "N/A",
      phone: profileData?.phone_no || "N/A",
      industry:
        profileData?.industry?.length > 0
          ? profileData.industry.map((i) => i?.name || "N/A").join(", ")
          : "N/A",
      founded: profileData?.founded_year
        ? new Date(profileData.founded_year * 1000).getFullYear().toString()
        : "N/A",
      companySize: profileData?.company_size || "N/A",
      companyType: profileData?.company_type || "N/A",
      headquarters: {
        address_line_1: profileData?.headquarters?.address_line_1 || "N/A",
        address_line_2: profileData?.headquarters?.address_line_2 || "N/A",
        country_name: profileData?.headquarters?.country?.name || "N/A",
        state_name: profileData?.headquarters?.state?.name || "N/A",
        city_name: profileData?.headquarters?.city?.name || "N/A",
        pin_code: profileData?.headquarters?.pin_code || "N/A",
      },
      verifiedSince: profileData?.verified_at
        ? new Date(profileData.verified_at).toLocaleDateString()
        : "N/A",
      followers:
        profileData?.follower_count !== undefined
          ? `${profileData.follower_count} Followers`
          : "N/A",
      employees:
        profileData?.employee_count !== undefined
          ? `${profileData.employee_count} Employees`
          : "N/A",
      specialties:
        profileData?.specialties?.length > 0
          ? profileData.specialties
          : ["N/A"],
      logo: profileData?.logo_url || "",
      banner_image_url: profileData?.banner_image_url || "",
      institution_type_id: profileData?.institution_type_id?._id || "",
    });

    // Form state aligned with initial state
    setFormData((prev) => ({
      name: profileData?.name || "",
      display_name: profileData?.display_name || "",
      email: profileData?.email || "",
      username: profileData?.username || "",
      password: "",
      confirmPassword: "",
      logo_url: profileData?.logo_url || "",
      banner_image_url: profileData?.banner_image_url || "",
      website_url: profileData?.website_url || "",
      description: profileData?.description || "",
      country_code: profileData?.country_code || { ...emptyCountryCode },
      phone_no: profileData?.phone_no || "",
      company_size: profileData?.company_size || "",
      company_type: profileData?.company_type || "",
      specialties: profileData?.specialties || [],
      founded_year: profileData?.founded_year
        ? new Date(profileData.founded_year * 1000).getFullYear()
        : "",
      employee_count: profileData?.employee_count || "",
      headquarters: profileData?.headquarters || { ...emptyAddress },
      industry: profileData?.industry || [],
      institution_type_id: profileData?.institution_type_id?._id || "",
      degree_ids: profileData?.degree_ids || [],
      address: profileData?.address || { ...emptyAddress },
    }));
  }, [profileData]);

  useEffect(() => {
    dispatch(suggestedUser({ page: 1, size: 10, type: activeTab1 }));
  }, [dispatch, activeTab1]);
  useEffect(() => {
    dispatch(companyIndustries());
  }, [profileData?._id]);
  useEffect(() => {
    getInstitutionTypes();
  }, []);

  const HomeTab = () => (
    <div className="mt-6 space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-medium glassy-text-primary flex items-center gap-2">
          Overview
          <button
            onClick={handleProfileUpdate}
            className="flex items-center glassy-text-primary hover:glassy-text-secondary"
          >
            <Edit size={16} />
          </button>
        </h2>

        <div className="glassy-text-secondary space-y-2">
          <EditableField
            value={agencyData.overview}
            field="overview"
            multiline={2}
          />
          <EditableField
            value={agencyData.workDescription}
            field="workDescription"
            multiline={4}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 text-sm">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Globe className="glassy-text-primary mt-1" size={16} />
              <div>
                <div className="glassy-text-primary text-xs mb-1">Website</div>
                <EditableField
                  value={agencyData.website}
                  field="website"
                  type="url"
                  className="text-blue-600"
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="glassy-text-primary mt-1" size={16} />
              <div>
                <div className="glassy-text-primary text-xs mb-1">Phone</div>
                <EditableField
                  value={agencyData.phone}
                  field="phone"
                  type="tel"
                />
              </div>
            </div>

            {!isInstitution && (
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-400 mt-1" size={16} />
                <div>
                  <div className="glassy-text-primary text-xs mb-1">
                    Verified since
                  </div>
                  <EditableField
                    value={agencyData.verifiedSince}
                    field="verifiedSince"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {!isInstitution && (
              <div className="flex items-start gap-3">
                <Building className="glassy-text-primary mt-1" size={16} />
                <div>
                  <div className="glassy-text-primary text-xs mb-1">
                    Industry
                  </div>
                  <EditableField
                    value={agencyData.industry}
                    field="industry"
                    className="capitalize"
                  />
                </div>
              </div>
            )}

            {!isInstitution && (
              <div className="flex items-start gap-3">
                <Users className="glassy-text-primary mt-1" size={16} />
                <div>
                  <div className="glassy-text-primary text-xs mb-1">
                    Company size
                  </div>
                  <EditableField
                    value={agencyData.companySize}
                    field="companySize"
                  />
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar className="glassy-text-primary mt-1" size={16} />
              <div>
                <div className="glassy-text-primary text-xs mb-1">Founded</div>
                <EditableField value={agencyData.founded} field="founded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specialties in a new row spanning full width, minimal margin */}
      <div>
        <h3 className="text-sm font-medium glassy-text-primary mb-2">
          Specialties
        </h3>
        <div className="flex flex-wrap gap-2">
          {agencyData?.specialties?.map((s, i) => (
            <span
              key={i}
              className="px-2 py-1 glassy-card  glassy-text-primary rounded text-xs  "
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const AboutTab = () => (
    <div className="mt-6 space-y-6 glassy-text-primary">
      <h2 className="text-2xl font-bold glassy-text-primary">
        About {agencyData?.name}
      </h2>
      <div>
        <h3 className="text-lg font-semibold mb-2 glassy-text-primary"></h3>
        <EditableField
          value={agencyData?.description}
          onSave={updateAgencyData}
          field="mission"
          multiline={3}
        />
      </div>
      <div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-y-2">
        <div className="flex gap-1">
          <div className="font-semibold">Industry:</div>
          <div className="capitalize">{agencyData?.industry}</div>
        </div>

        <div className="flex gap-1">
          <div className="font-semibold">Headquarters:</div>
          <div>
            {agencyData?.headquarters?.address_line_1},{" "}
            {agencyData?.headquarters?.state_name},{" "}
            {agencyData?.headquarters?.city_name}
            {agencyData?.headquarters?.country_name}
          </div>
        </div>
        <div className="glassy-text-secondary col-span-2">
          {agencyData?.company_type && `${agencyData?.company_type} • `}
          {agencyData?.founded_year &&
            `Founded ${new Date(
              agencyData?.founded_year * 1000
            ).getFullYear()}`}
        </div>
        {Array.isArray(agencyData?.specialties) &&
          agencyData?.specialties.length > 0 && (
            <div className="flex gap-1 col-span-2">
              <div className="font-semibold">Specialties:</div>
              <div>{agencyData?.specialties.join(", ")}</div>
            </div>
          )}
      </div>
    </div>
  );

  const PostsTab = ({ posts }) => {
    return (
      <div className="  min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-7">
            <h2 className="text-2xl font-bold glassy-text-primary">
              Page posts
            </h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Link
                to={
                  isCompany === "company"
                    ? "/company/create-post"
                    : "/institution/create-post"
                }
              >
                Create Post
              </Link>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {posts?.map((post) => (
              <div
                key={post?._id}
                className="glassy-card rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col gap-4"
              >
                {/* Header row: company/user info */}
                <div className="flex items-center gap-3">
                  {agencyData?.logo ? (
                    <img
                      src={agencyData?.logo}
                      alt="Company Logo"
                      className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://res.cloudinary.com/dsnqduetr/image/upload/v1761043320/post-media/companylogo.png"; // fallback image
                      }}
                    />
                  ) : null}
                  <div>
                    <h3 className="text-lg font-bold glassy-text-primary leading-tight">
                      {agencyData?.name}
                    </h3>
                    <div className="glassy-text-secondary text-xs">
                      {agencyData?.followers
                        ? `${agencyData?.followers} followers`
                        : ""}
                      {post?.date
                        ? ` • ${new Date(post?.date).toLocaleDateString()}`
                        : ""}
                    </div>
                  </div>
                  <div className="ml-auto glassy-text-primary hover:glassy-text-primary cursor-pointer">
                    <span className="text-sm">•••</span>
                  </div>
                </div>

                {/* Post content */}
                {post?.title && post?.content && (
                  <div>
                    <h3 className="glassy-text-primary text-base">
                      {post?.title}
                    </h3>
                    <p className="glassy-text-primary text-base">
                      {post?.content}
                    </p>
                  </div>
                )}
                {/* Media: image or video */}
                {post?.post_type === "image-video" &&
                  post?.image_urls?.length > 0 && (
                    <div className="w-full rounded-lg overflow-hidden mt-2">
                      <img
                        src={post?.image_urls[0]}
                        alt="Post Media"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                {post?.post_type === "image-video" && post?.video_url && (
                  <div className="w-full mt-2">
                    <video controls className="w-full rounded-lg">
                      <source src={post?.video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                {post?.post_type === "jobs" && post.job_id && (
                  <JobPost job={post.job_id} />
                )}

                {/* Stats row */}
                <div className="flex items-center gap-4 mt-3 glassy-text-secondary text-sm">
                  <div className="flex items-center gap-1">
                    <AiOutlineLike />
                    <span>{post?.like_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AiOutlineEye />
                    <span>{post?.view_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaRegCommentDots />
                    <span>{post?.report_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaRegShareSquare />
                    <span>{post?.share_count || 0}</span>
                  </div>
                </div>

                {/* Tags */}
                {post?.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {post?.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 glassy-card rounded-lg text-xs glassy-text-secondary"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="px-5 py-2 rounded-lg glassy-card hover:glassy-card glassy-text-primary font-medium">
              <Link
                to={
                  isCompany === "company"
                    ? "/company/posts-manage"
                    : "/institution/posts-manage"
                }
              >
                Show All Posts
              </Link>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const JobsTab = ({ jobs }) => {
    console.log("this is the jobs", jobs);
    return (
      <div className="  min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold glassy-text-primary">
              Opening Jobs
            </h1>
            <button className="w-10 h-10 glassy-card hover:glassy-card border border-gray-300 rounded-lg flex items-center justify-center transition-colors shadow-sm">
              <Link
                to={
                  isCompany === "company"
                    ? "/company/post-job"
                    : "/institution/post-job"
                }
                className="w-10 h-10 glassy-card hover:glassy-card border border-gray-300 rounded-lg flex items-center justify-center transition-colors shadow-sm"
              >
                <Plus size={24} className="glassy-text-primary" />
              </Link>
            </button>
          </div>

          {/* Job Cards */}
          <div className="space-y-4">
            {jobs?.length > 0 &&
              jobs?.map((job) => (
                <div
                  key={job?._id}
                  className="glassy-card rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-colors shadow-sm"
                >
                  {/* Header with logo, title, and status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4">
                      {/* Company Logo */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                        {agencyData?.logo ? (
                          <img
                            src={agencyData?.logo}
                            alt="Company Logo"
                            className="w-12 h-12 rounded-full object-cover border border-gray-200"
                            onError={(e) => {
                              e.currentTarget.onerror = null; // prevent infinite loop
                              e.currentTarget.src =
                                "/0684456b-aa2b-4631-86f7-93ceaf33303c.png"; // fallback to dummy
                            }}
                          />
                        ) : null}
                      </div>

                      {/* Job Title and Company */}
                      <div>
                        <h2 className="text-xl font-semibold glassy-text-primary mb-1">
                          {job?.job_title?.name}
                        </h2>
                        <p className="glassy-text-secondary text-sm">
                          {agencyData?.name}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge and Bookmark */}
                    <div className="flex items-center gap-3">
                      <button className="glassy-text-primary hover:glassy-text-primary transition-colors">
                        <Bookmark size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Job Meta Info */}
                  <div className="flex items-center gap-4 text-sm glassy-text-secondary mb-4">
                    {/* <span>{job?.createdAt}</span> */}
                    <span>{timeAgo(job?.createdAt)}</span>

                    <span>-</span>
                    <span>{job?.job_type}</span>
                    <span>-</span>
                    <span>{job?.total_applicants} Applied</span>
                    <span>-</span>
                    <span>{job?.salary_range}</span>
                  </div>

                  {/* Description */}
                  <p className="glassy-text-primary text-sm leading-relaxed break-words break-all  mb-4">
                    {job?.job_description}
                  </p>

                  {/* Location and Matching */}
                  <div className="flex items-center gap-2 text-sm glassy-text-secondary mb-4">
                    <MapPin size={16} className="flex-shrink-0" />
                    <span>
                      {job?.job_location} ,{job?.work_location?.city?.name}{" "}
                      {job?.work_location?.state?.name}{" "}
                      {job?.work_location?.country?.name}
                    </span>
                    <span className="text-blue-600 font-medium ml-2">
                      {job?.matching} Matching
                    </span>
                  </div>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job?.required_skills?.map((skill, index) => (
                      <span
                        key={skill?._id || index}
                        className="px-3 py-1.5 glassy-card glassy-text-primary text-sm rounded-lg border border-gray-200"
                      >
                        {skill?.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  const PeopleTab = ({ people, setPeople }) => {
    const handleConnect = async (data) => {
      if (!data?.user_path) {
        navigate(
          isCompany
            ? `/company/profile/${data?.first_name}/${data?._id}`
            : `/user/profile/${data?.first_name}/${data?._id}`
        );
      } else {
        const name =
          data?.user_path === "Companies"
            ? "companies"
            : data?.user_path === "Institutions"
            ? "institutions"
            : "users";

        navigate(
          isCompany
            ? `/company/view-details/${name}/${data?._id}`
            : `/user/view-details/${name}/${data?._id}`
        );
      }
    };

    return (
      <div className="  text-white min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Our Team</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedUsers && assignedUsers.length > 0 ? (
              assignedUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-white-800 rounded-lg p-6 border border-gray-700 text-center"
                  onClick={() => handleConnect(user)}
                >
                  <img
                    src={
                      user.profile_picture_url ||
                      "/0684456b-aa2b-4631-86f7-93ceaf33303c.png"
                    }
                    alt={user.first_name}
                    className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold mb-1">
                    {user.first_name} {user.last_name}
                  </h3>

                  <p className="glassy-text-secondary text-sm">{user.email}</p>
                </div>
              ))
            ) : (
              <NoDataFound />
            )}
          </div>
        </div>
      </div>
    );
  };

  const EditableBanner = ({
    agencyData,
    userRole,
    handleImageUpload,
    isBannerUploading = false,
    handleProfileUpdatee,
  }) => {
    const [previewBanner, setPreviewBanner] = useState(
      agencyData?.banner_image_url || formData["banner_image_url"] || ""
    );

    const handleBannerChange = async (file) => {
      if (!file) return;

      // instant preview
      const previewUrl = URL.createObjectURL(file);
      setPreviewBanner(previewUrl);

      // actual upload logic
      const uploaded = await handleImageUpload(file, "banner_image_url");
      console.log("Thisis the updloaded", uploaded);
      // auto-update backend profile once upload success
      if (uploaded?.data?.imageURL) {
        await handleProfileUpdatee({
          banner_image_url: uploaded.data.imageURL,
        });
        // toast.success("Banner updated successfully");
      }
    };

    const handleBannerClick = () => {
      document.getElementById("bannerUploadInput").click();
    };

    return (
      <div className="max-w-6xl mx-auto glassy-card">
        {/* 🔹 Editable Banner */}
        <div className="relative rounded-t-2xl overflow-hidden h-46 sm:h-54 md:h-52  group cursor-pointer transition-all">
          {previewBanner ? (
            <img
              src={formData["banner_image_url"]}
              alt="Company Banner"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full glassy-text-primary text-sm">
              Click to upload banner
            </div>
          )}

          {/* Overlay for edit button */}
          <div
            onClick={handleBannerClick}
            className="absolute inset-0 glassy-card/80  opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300"
          >
            <div className="flex items-center gap-2 glassy-text-primary text-sm glassy-card px-3 py-2 rounded-lg">
              <FiCamera className="w-4 h-4" /> Change Banner
            </div>
          </div>

          {/* Loading spinner */}
          {isBannerUploading && (
            <div className="absolute inset-0 glassy-card/50 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Hidden file input */}
          <input
            type="file"
            id="bannerUploadInput"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleBannerChange(e.target.files[0])}
          />
        </div>

        {/* 🔹 White card content below banner */}
        <div className="  rounded-b-2xl shadow-md">
          <div className="p-6">
            {/* Row 1: Logo + Edit Button */}
            <div className="flex items-start justify-between gap-2">
              <div className="relative -mt-16 flex-shrink-0">
                <div className="w-28 h-28 rounded-full flex items-center justify-center shadow-2xl    overflow-hidden">
                  {agencyData?.logo ? (
                    <img
                      src={agencyData?.logo}
                      alt="Company Logo"
                      className="w-full h-full object-contain rounded-full"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/companylogo.png"; // fallback image
                      }}
                    />
                  ) : null}
                </div>
              </div>

              <button
                className="px-4 py-2  rounded glassy-button flex items-center gap-2 text-sm"
                onClick={handleProfileUpdate}
              >
                Edit Page
              </button>
            </div>

            {/* Row 2: Company Details */}
            <div className="mt-3">
              <h1 className="font-bold glassy-text-primary mb-2 text-lg">
                {agencyData.name}
              </h1>

              <div
                className={`mb-3 ${
                  4
                    ? "whitespace-pre-wrap glassy-text-secondary"
                    : "glassy-text-secondary"
                }`}
              >
                {agencyData?.description}
              </div>
              <div className="flex items-center gap-3 text-xs glassy-text-secondary">
                <span>{agencyData?.industry}</span>
                <span>•</span>
                <span>{agencyData?.founded}</span>
                <span>•</span>
                <span>{agencyData?.followers}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Header = () => (
    <EditableBanner
      agencyData={agencyData}
      userRole={userRole}
      handleImageUpload={handleImageUpload}
      handleProfileUpdatee={async (updateFields) => {
        await handleProfileSubmit(updateFields); // ✅ works with overrideData now
      }}
      isBannerUploading={isImageUploading}
    />
  );
  return (
    <div className="   p-6">
      <div className="flex flex-col md:flex-row gap-6   ">
        <div className="w-full md:w-3/4 space-y-6">
          <Header />
          <div className="glassy-card p-6 rounded-2xl shadow-md border border-gray-200">
            <Navigation />
            {renderActiveTab()}
          </div>
        </div>
        <div className="w-full md:w-1/4 hidden md:block">
          <div className="sticky top-6 max-h-[calc(100vh-2rem)] overflow-y-auto">
            <PeopleToConnect
              data={suggestedUsers?.data?.list || []}
              activeTab={activeTab1}
              setActiveTab={setActiveTab1}
            />
          </div>
        </div>
      </div>
      {/* Profile Update Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        title="Edit Profile"
        onClose={() => {
          setIsProfileModalOpen(false);
          setErrors({});
        }}
        size="lg"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            {renderProfileImage()}
            <button
              onClick={() =>
                handleImageClick(
                  [
                    ROLES.SUPER_ADMIN,
                    ROLES.ADMIN,
                    ROLES.COMPANIES,
                    ROLES.COMPANIES_ADMIN,
                    ROLES.INSTITUTIONS,
                    ROLES.INSTITUTIONS_ADMIN,
                  ].includes(userRole)
                    ? "logo_url"
                    : "logo_url"
                )
              }
              className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <FiCamera className="mr-1" /> Change photo
            </button>
          </div>

          {renderProfileFormFields()}

          <div>
            <CustomInput
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter email address"
              icon={<FiMail className="glassy-text-primary" />}
              error={errors?.email}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <div>
              <FilterSelect
                options={countriesList}
                label="Country"
                selectedOption={countriesList?.find(
                  (opt) => opt?.label === formData?.country_code?.name
                )}
                onChange={(data) => handleCountryChange(data)}
                error={errors?.country_code}
                icon={<FiGlobe className="glassy-text-primary" />}
              />
            </div> */}
            <div>
              <CustomInput
                label={
                  [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole)
                    ? "Phone Number"
                    : "Phone"
                }
                type="tel"
                value={
                  [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole)
                    ? formData.phone_number
                    : formData.phone_no
                }
                onChange={(e) =>
                  handleChange(
                    [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole)
                      ? "phone_number"
                      : "phone_no",
                    e.target.value
                  )
                }
                placeholder={
                  [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole)
                    ? "Enter phone number"
                    : "Enter phone"
                }
                icon={<FiPhone className="glassy-text-primary" />}
                error={
                  [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole)
                    ? errors?.phone_number
                    : errors?.phone_no
                }
                prefix={formData.country_code?.dial_code || "+"}
              />
            </div>
          </div>

          {![ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole) && (
            <>
              <div>
                <CustomInput
                  label="Website URL"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => handleChange("website_url", e.target.value)}
                  placeholder="Enter website URL"
                  icon={<FiGlobe className="glassy-text-primary" />}
                  error={errors?.website_url}
                />
              </div>
              <div>
                <CustomInput
                  label="Description"
                  type="textarea"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Enter description"
                  error={errors?.description}
                  rows={3}
                />
              </div>
            </>
          )}

          <div>
            <Button
              variant="outline"
              onClick={handleProfileSubmit}
              loading={isLoading}
              className="px-4 py-2 glassy-button"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CompanyProfile;
