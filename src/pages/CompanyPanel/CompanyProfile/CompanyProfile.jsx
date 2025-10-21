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
} from "../../../redux/CompanySlices/CompanyAuth";
import { useDispatch, useSelector } from "react-redux";
import { suggestedUser } from "../../../redux/Users/userSlice";
import { Link } from "react-router-dom";
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

const CompanyProfile = ({
  adminProfileData,
  companiesProfileData,
  instituteProfileData,
}) => {
  const ROLES = {
    SUPER_ADMIN: 1,
    ADMIN: 2,
    COMPANIES: 3,
    COMPANIES_ADMIN: 7,
    INSTITUTIONS: 4,
    INSTITUTIONS_ADMIN: 8,
  };
  const userRole = Number(getCookie("COMPANY_ROLE"));
  const dispatch = useDispatch();
  const [isImageUploading, setIsImageUploading] = useState(false);
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

  const allIndustry = arrayTransform(
    IndusteryData?.companyIndustryData?.data?.data?.list || []
  );
  const countriesList = arrayTransform(
    cscSelector?.countriesData?.data?.data || []
  );
  const getInitialFormData = () => {
    if ([ROLES.COMPANIES, ROLES.COMPANIES_ADMIN].includes(userRole)) {
      return {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        display_name: "",
        description: "",
        website_url: "",
        logo_url: "",
        banner_image_url: "",
        industry: [],
        country_code: {
          name: "",
          dial_code: "",
          short_name: "",
          emoji: "",
        },
        phone_no: "",
        company_size: "",
        company_type: "",
        headquarters: {
          address_line_1: "",
          address_line_2: "",
          country: {
            name: "",
            dial_code: "",
            short_name: "",
            emoji: "",
          },
          state: {
            name: "",
            code: "",
          },
          city: {
            name: "",
          },
          pin_code: "",
        },
        founded_year: "",
        specialties: [""],
        employee_count: "",
        linkedin_page_url: "",
      };
    }

    return {};
  };
  const {
    formData,
    setFormData,
    handleChange,
    resetForm,
    errors,
    setErrors,
    handleNestedChange,
  } = useFormHandler(getInitialFormData());

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
      companiesProfileData?.[imageField] ||
      instituteProfileData?.[imageField] ||
      "";

    return (
      <div className="relative group">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/80 shadow-lg bg-white relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105">
          {isImageUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <FiCamera className="w-6 h-6 text-white" />
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
  const fetchData = () => {
    if ([ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole)) {
      dispatch(adminProfile());
    }
    if ([ROLES.COMPANIES, ROLES.COMPANIES_ADMIN].includes(userRole)) {
      dispatch(companiesProfile());
    }
    if ([ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)) {
      dispatch(instituteProfile());
    }
  };
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

    // URL validation
    // const urlRegex = /^https?:\/\/.+/;
    // if (formData.website_url && !urlRegex.test(formData.website_url)) {
    //   newErrors.website_url =
    //     "Please enter a valid URL starting with http:// or https://";
    // }
    // if (
    //   formData.linkedin_page_url &&
    //   !urlRegex.test(formData.linkedin_page_url)
    // ) {
    //   newErrors.linkedin_page_url = "Please enter a valid LinkedIn URL";
    // }
    // General URL (must start with http or https)
    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

    // LinkedIn specific URL
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
    // ✅ Merge formData + overrideData (banner updates)
    const dataToUse = { ...formData, ...(overrideData || {}) };

    // ✅ Only validate on full form submit (not banner/logo)
    if (!overrideData && !validateProfileForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      setIsLoading(true);
      let res;

      if ([ROLES.COMPANIES, ROLES.COMPANIES_ADMIN].includes(userRole)) {
        const apiPayload = {
          name: dataToUse.name,
          display_name: dataToUse.display_name,
          description: dataToUse.description,
          website_url: dataToUse.website_url,
          logo_url: dataToUse.logo_url,
          banner_image_url: dataToUse.banner_image_url,
          industry: dataToUse.industry?.map((ind) => ind._id) || [],
          country_code: dataToUse.country_code,
          phone_no: dataToUse.phone_no,
          company_size: dataToUse.company_size,
          company_type: dataToUse.company_type,
          headquarters: dataToUse.headquarters,
          founded_year: dataToUse.founded_year
            ? Math.floor(
                new Date(`${dataToUse.founded_year}-01-01`).getTime() / 1000
              )
            : null,
          specialties: (dataToUse.specialties || [])
            .map((s) => String(s || "").trim())
            .filter((s) => s !== ""),
          employee_count: dataToUse.employee_count
            ? Number(dataToUse.employee_count)
            : null,
          linkedin_page_url: dataToUse.linkedin_page_url,
          email: dataToUse.email,
        };

        // ✅ Now the payload includes the new banner value
        res = await dispatch(updateProfileCompanies(apiPayload)).unwrap();

        // ✅ update Redux immediately
        dispatch(setCompaniesProfileData(apiPayload));
      }

      toast.success(res?.message || "Profile updated successfully");

      // ✅ Refresh UI after full profile update only
      if (!overrideData) {
        fetchData();
        setIsProfileModalOpen(false);
      } else {
        // For banner updates, also update local formData
        setFormData(dataToUse);
      }
    } catch (error) {
      toast.error(error?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const company_type = [
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
    { value: "non-profit", label: "Non-profit" },
    { value: "government", label: "Government" },
    { value: "partnership", label: "Partnership" },
    { value: "sole-proprietorship", label: "Sole Proprietorship" },
  ];
  const Company_Sizes = [
    { value: "1-10", label: "1-10" },
    { value: "11-50", label: "11-50" },
    { value: "51-200", label: "51-200" },
    { value: "201-500", label: "201-500" },
    { value: "501-1000", label: "501-1000" },
    { value: "1001-5000", label: "1001-5000" },
    { value: "5001-10000", label: "5001-10000" },
  ];
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
    const selectClasses = classNames(
      "h-[50px] opacity-100 rounded-[10px] border w-full",
      {
        "border-gray-300": !errors.industry,
        "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500":
          errors.industry,
      }
    );

    const customStyles = {
      control: (base, state) => ({
        ...base,
        borderRadius: "10px",
        borderColor: errors.industry ? "#f87171" : "#d1d5db",
        minHeight: "52px",
        opacity: 1,
        boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
        "&:hover": {
          borderColor: errors.industry ? "#f87171" : "#9ca3af",
        },
      }),
      placeholder: (base) => ({
        ...base,
        color: "#000000",
        opacity: 0.5,
      }),
      multiValue: (base) => ({
        ...base,
        backgroundColor: "#e5e7eb",
        borderRadius: "4px",
      }),
      multiValueLabel: (base) => ({
        ...base,
        color: "#374151",
      }),
      multiValueRemove: (base) => ({
        ...base,
        color: "#6b7280",
        ":hover": {
          backgroundColor: "#f87171",
          color: "white",
        },
      }),
    };
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company / Institute Name */}
        <div>
          <CustomInput
            label={
              [
                ROLES.COMPANIES,
                ROLES.COMPANIES_ADMIN,
                ROLES.INSTITUTIONS,
                ROLES.INSTITUTIONS_ADMIN,
              ].includes(userRole)
                ? "Company Name"
                : "Institute Name"
            }
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder={
              [
                ROLES.COMPANIES,
                ROLES.COMPANIES_ADMIN,
                ROLES.INSTITUTIONS,
                ROLES.INSTITUTIONS_ADMIN,
              ].includes(userRole)
                ? "Enter company name"
                : "Enter institute name"
            }
            icon={<FiUser className="text-gray-400" />}
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
            icon={<FiUser className="text-gray-400" />}
            error={errors?.display_name}
          />
        </div>

        {/* Industry Multi-Select */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industry <span className="text-red-500">*</span>
          </label>
          <CreatableSelect
            isMulti
            options={allIndustry}
            value={formData.industry?.map((ind) => ({
              value: ind._id,
              label: ind.name,
            }))}
            onChange={(selectedOptions) =>
              handleChange("industry", {
                target: {
                  value:
                    selectedOptions?.map((opt) => ({
                      _id: opt.value,
                      name: opt.label,
                    })) || [],
                },
              })
            }
            placeholder="Select industries..."
            styles={customStyles}
            className={selectClasses}
            classNamePrefix="react-select"
          />
          {errors.industry && (
            <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
          )}
        </div>

        {/* Company Type */}
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
          />
        </div>

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

  const [people, setPeople] = useState([
    {
      id: 1,
      name: "John Smith",
      position: "Creative Director",
      bio: "Leading creative vision with 10+ years of experience in digital design and user experience.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      position: "UX Research Lead",
      bio: "Passionate about user research and data-driven design decisions that create meaningful experiences.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b332c46c?w=400&h=400&fit=crop&crop=face",
    },
  ]);

  const EditableField = ({ value, multiline = false, className = "" }) => {
    return (
      <div className={`group relative ${className}`}>
        <div className={multiline ? "whitespace-pre-wrap" : ""}>{value}</div>
      </div>
    );
  };

  const Navigation = () => (
    <div className="mt-6">
      <nav className="flex border-b border-gray-200">
        {["Home", "About", "Posts", "Jobs", "People"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );

  const HomeTab = () => (
    <div className="mt-6 space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-gray-900 flex items-center gap-2">
          Overview
          <button
            onClick={handleProfileUpdate}
            className="flex items-center text-gray-400 hover:text-gray-600"
          >
            <Edit size={16} />
          </button>
        </h2>

        <div className="text-gray-600 space-y-2">
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
              <Globe className="text-gray-400 mt-1" size={16} />
              <div>
                <div className="text-gray-400 text-xs mb-1">Website</div>
                <EditableField
                  value={agencyData.website}
                  field="website"
                  type="url"
                  className="text-blue-600"
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="text-gray-400 mt-1" size={16} />
              <div>
                <div className="text-gray-400 text-xs mb-1">Phone</div>
                <EditableField
                  value={agencyData.phone}
                  field="phone"
                  type="tel"
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-400 mt-1" size={16} />
              <div>
                <div className="text-gray-400 text-xs mb-1">Verified since</div>
                <EditableField
                  value={agencyData.verifiedSince}
                  field="verifiedSince"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Building className="text-gray-400 mt-1" size={16} />
              <div>
                <div className="text-gray-400 text-xs mb-1">Industry</div>
                <EditableField
                  value={agencyData.industry}
                  field="industry"
                  className="capitalize"
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="text-gray-400 mt-1" size={16} />
              <div>
                <div className="text-gray-400 text-xs mb-1">Company size</div>
                <EditableField
                  value={agencyData.companySize}
                  field="companySize"
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="text-gray-400 mt-1" size={16} />
              <div>
                <div className="text-gray-400 text-xs mb-1">Founded</div>
                <EditableField value={agencyData.founded} field="founded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specialties in a new row spanning full width, minimal margin */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Specialties</h3>
        <div className="flex flex-wrap gap-2">
          {agencyData?.specialties?.map((s, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs border border-gray-200"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const AboutTab = () => (
    <div className="mt-6 space-y-6 text-gray-700">
      <h2 className="text-2xl font-bold text-gray-900">
        About {agencyData?.name}
      </h2>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900"></h3>
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
        <div className="text-gray-600 col-span-2">
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
      <div className="bg-white min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-7">
            <h2 className="text-2xl font-bold text-gray-900">Page posts</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Link to="/company/create-post">Create Post</Link>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {posts?.map((post) => (
              <div
                key={post?._id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col gap-4"
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
                        e.currentTarget.src = "https://res.cloudinary.com/dsnqduetr/image/upload/v1761043320/post-media/companylogo.png"; // fallback image
                      }}
                    />
                  ) : null}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                      {agencyData?.name}
                    </h3>
                    <div className="text-gray-500 text-xs">
                      {agencyData?.followers
                        ? `${agencyData?.followers} followers`
                        : ""}
                      {post?.date
                        ? ` • ${new Date(post?.date).toLocaleDateString()}`
                        : ""}
                    </div>
                  </div>
                  <div className="ml-auto text-gray-400 hover:text-gray-700 cursor-pointer">
                    <span className="text-sm">•••</span>
                  </div>
                </div>

                {/* Post content */}
                {post?.title && post?.content && (
                  <div>
                    <h3 className="text-gray-700 text-base">{post?.title}</h3>
                    <p className="text-gray-700 text-base">{post?.content}</p>
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
                <div className="flex items-center gap-4 mt-3 text-gray-600 text-sm">
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
                        className="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600"
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
            <button className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium">
              <Link to="/company/posts-manage">Show All Post</Link>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const JobsTab = ({ jobs }) => {
    console.log("this is the jobs", jobs);
    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Opening Jobs</h1>
            <button className="w-10 h-10 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center transition-colors shadow-sm">
              <Link
                to="/company/post-job"
                className="w-10 h-10 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center transition-colors shadow-sm"
              >
                <Plus size={24} className="text-gray-700" />
              </Link>
            </button>
          </div>

          {/* Job Cards */}
          <div className="space-y-4">
            {jobs?.length > 0 &&
              jobs?.map((job) => (
                <div
                  key={job?._id}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-colors shadow-sm"
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
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/companylogo.png"; // fallback image
                            }}
                          />
                        ) : null}
                      </div>

                      {/* Job Title and Company */}
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-1">
                          {job?.job_title?.name}
                        </h2>
                        <p className="text-gray-600 text-sm">
                          {agencyData?.name}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge and Bookmark */}
                    <div className="flex items-center gap-3">
                      <button className="text-gray-400 hover:text-gray-700 transition-colors">
                        <Bookmark size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Job Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
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
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {job?.job_description}
                  </p>

                  {/* Location and Matching */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
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
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg border border-gray-200"
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
    const [newPerson, setNewPerson] = useState({
      name: "",
      position: "",
      bio: "",
    });
    const [showAddForm, setShowAddForm] = useState(false);

    const addPerson = () => {
      if (newPerson.name && newPerson.position && newPerson.bio) {
        setPeople((prev) => [
          ...prev,
          {
            id: Date.now(),
            ...newPerson,
            avatar:
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
          },
        ]);
        setNewPerson({ name: "", position: "", bio: "" });
        setShowAddForm(false);
      }
    };

    return (
      <div className="bg-white text-black min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Our Team</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Team Member
            </button>
          </div>

          {showAddForm && (
            <div className="px-4 py-2 bg-white-600 text-black rounded hover:bg-white-700">
              <h3 className="text-lg font-semibold mb-4">Add Team Member</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full name"
                    value={newPerson.name}
                    onChange={(e) =>
                      setNewPerson((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="p-3 bg-white-700 border border-gray-600 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Position"
                    value={newPerson.position}
                    onChange={(e) =>
                      setNewPerson((prev) => ({
                        ...prev,
                        position: e.target.value,
                      }))
                    }
                    className="p-3 bg-white-700 border border-gray-600 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <textarea
                  placeholder="Bio"
                  value={newPerson.bio}
                  onChange={(e) =>
                    setNewPerson((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  rows={3}
                  className="w-full p-3 bg-white-700 border border-gray-600 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addPerson}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add Member
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {people.map((person) => (
              <div
                key={person.id}
                className="bg-white-800 rounded-lg p-6 border border-gray-700 text-center"
              >
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold mb-1">{person.name}</h3>
                <p className="text-blue-400 mb-3">{person.position}</p>
                <p className="text-gray-600 text-sm">{person.bio}</p>
              </div>
            ))}
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
        toast.success("Banner updated successfully");
      }
    };

    const handleBannerClick = () => {
      document.getElementById("bannerUploadInput").click();
    };

    return (
      <div className="max-w-6xl mx-auto">
        {/* 🔹 Editable Banner */}
        <div className="relative rounded-t-2xl overflow-hidden h-46 sm:h-54 md:h-52 bg-gray-200 group cursor-pointer transition-all">
          {previewBanner ? (
            <img
              src={formData["banner_image_url"]}
              alt="Company Banner"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
              Click to upload banner
            </div>
          )}

          {/* Overlay for edit button */}
          <div
            onClick={handleBannerClick}
            className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300"
          >
            <div className="flex items-center gap-2 text-white text-sm bg-black/40 px-3 py-2 rounded-lg">
              <FiCamera className="w-4 h-4" /> Change Banner
            </div>
          </div>

          {/* Loading spinner */}
          {isBannerUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
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
        <div className="bg-white rounded-b-2xl shadow-md">
          <div className="p-6">
            {/* Row 1: Logo + Edit Button */}
            <div className="flex items-start justify-between gap-2">
              <div className="relative -mt-16 flex-shrink-0">
                <div className="w-28 h-28 rounded-full flex items-center justify-center shadow-2xl border-4 border-zinc-800 bg-black overflow-hidden">
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
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 text-sm"
                onClick={handleProfileUpdate}
              >
                Edit Page
              </button>
            </div>

            {/* Row 2: Company Details */}
            <div className="mt-3">
              <h1 className="font-bold text-gray-700 mb-2">
                {agencyData.name}
              </h1>
              <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                {agencyData?.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-700">
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

  const handleProfileUpdate = () => {
    setIsProfileModalOpen(true);
  };
  const updateAgencyData = (field, value) => {
    setAgencyData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
    const fetchCompanyProfile = async () => {
      try {
        const res = await dispatch(companiesProfile()).unwrap();
        const data = res?.data;

        if (data) {
          console.log("This is companyData: " + JSON.stringify(data, null, 2));

          setAgencyData({
            name: data?.display_name || data?.name || "N/A",
            tagline: "", // no tagline in API, keep empty or default
            overview: data?.description || "N/A",
            description: data?.description || "N/A",
            workDescription: "", // no workDescription in API
            website: data?.website_url || "N/A",
            phone: data?.phone_no || "N/A",
            industry:
              data?.industry?.length > 0
                ? data.industry.map((i) => i?.name || "N/A").join(" , ")
                : "N/A",
            founded: data?.founded_year
              ? new Date(data.founded_year * 1000).getFullYear().toString()
              : "N/A",
            companySize: data?.company_size || "N/A",
            companyType: data?.company_type || "N/A",
            headquarters: {
              address_line_1: data?.headquarters?.address_line_1 || "N/A",
              address_line_2: data?.headquarters?.address_line_2 || "N/A",
              country_name: data?.headquarters?.country?.name || "N/A",
              state_name: data?.headquarters?.state?.name || "N/A",
              city_name: data?.headquarters?.city?.name || "N/A",
              pin_code: data?.headquarters?.pin_code || "N/A",
            },
            verifiedSince: data?.verified_at
              ? new Date(data.verified_at).toLocaleDateString()
              : "N/A",
            followers:
              data?.follower_count !== undefined
                ? `${data.follower_count} Followers`
                : "N/A",
            employees:
              data?.employee_count !== undefined
                ? `${data.employee_count} Employees`
                : "N/A",
            specialties:
              data?.specialties?.length > 0 ? data.specialties : ["N/A"],
            logo: data?.logo_url || "",
            banner_image_url: data?.banner_image_url || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch company profile:", error);
      }
    };

    fetchCompanyProfile();
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
    if ([ROLES.COMPANIES, ROLES.COMPANIES_ADMIN].includes(userRole)) {
      setFormData((prev) => ({
        ...prev,
        name: companiesProfileData?.name || "",
        display_name: companiesProfileData?.display_name || "",
        email: companiesProfileData?.email || "",
        logo_url: companiesProfileData?.logo_url || "",
        banner_image_url: companiesProfileData?.banner_image_url || "",
        website_url: companiesProfileData?.website_url || "",
        description: companiesProfileData?.description || "",
        country_code: companiesProfileData?.country_code || {
          name: "",
          dial_code: "",
          short_name: "",
          emoji: "",
        },
        phone_no: companiesProfileData?.phone_no || "",
        company_size: companiesProfileData?.company_size || "",
        company_type: companiesProfileData?.company_type || "",
        specialties: companiesProfileData?.specialties || [],
        founded_year: companiesProfileData?.founded_year
          ? new Date(companiesProfileData.founded_year * 1000).getFullYear()
          : "",
        employee_count: companiesProfileData?.employee_count || "",
        headquarters: companiesProfileData?.headquarters || "",
        industry: companiesProfileData?.industry || [],
      }));
    }
  }, [companiesProfileData]);
  useEffect(() => {
    dispatch(suggestedUser({ page: 1, size: 10, type: activeTab1 }));
  }, [dispatch, activeTab1]);
  useEffect(() => {
    dispatch(companyIndustries());
  }, [companiesProfileData?._id]);
  return (
    <div className="bg-gray-50   p-6">
      <div className="flex flex-col md:flex-row gap-6   ">
        <div className="w-full md:w-3/4 space-y-6">
          <Header />
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
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
              icon={<FiMail className="text-gray-400" />}
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
                icon={<FiGlobe className="text-gray-400" />}
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
                icon={<FiPhone className="text-gray-400" />}
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
                  icon={<FiGlobe className="text-gray-400" />}
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
              variant="primary"
              onClick={handleProfileSubmit}
              loading={isLoading}
              className="px-4 py-2"
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
