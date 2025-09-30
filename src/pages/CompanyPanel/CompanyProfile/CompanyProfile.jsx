import React, { useEffect, useState } from "react";
import {
  Edit,
  Globe,
  Phone,
  Mail,
  Users,
  Calendar,
  MapPin,
  Building,
  Award,
  Camera,
  Save,
  X,
  CheckCircle,
} from "lucide-react";
import { FaRegEdit } from "react-icons/fa";
import PeopleToConnect from "../../../components/ui/ConnectSidebar/ConnectSidebar";
import {
  adminChangePassword,
  adminProfile,
  updateProfile,
  updateProfileInstitutions,
  resetPasswordInstitutions,
  updateProfileCompanies,
  resetPasswordCompanies,
  companiesProfile,
  instituteProfile
} from '../../../redux/CompanySlices/CompanyAuth'
import { useDispatch, useSelector } from "react-redux";
import { suggestedUser } from "../../../redux/Users/userSlice";
import { Link } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { Bookmark, Plus } from "lucide-react";
import useFormHandler from "../../../components/hooks/useFormHandler";
import { FiEdit2, FiLock, FiMail, FiPhone, FiGlobe, FiUser, FiCamera, FiCheck } from 'react-icons/fi'
import { arrayTransform, uploadImageDirectly } from "../../../components/utils/globalFunction";
import { getCookie } from "../../../components/utils/cookieHandler";
import { toast } from "sonner";
import Button from "../../../components/ui/Button/Button";
import CustomInput from "../../../components/ui/InputAdmin/CustomInput";
import FilterSelect from "../../../components/ui/InputAdmin/FilterSelect";
import Modal from "../../../components/ui/InputAdmin/Modal/Modal";

const CompanyProfile = ({ adminProfileData, companiesProfileData, instituteProfileData }) => {
  const ROLES = {
    SUPER_ADMIN: 1,
    ADMIN: 2,
    COMPANIES: 3,
    COMPANIES_ADMIN: 7,
    INSTITUTIONS: 4,
    INSTITUTIONS_ADMIN: 8
  };
  console.log("tesetesdfesdrsdfsdfsdfsdfsfsdfsfsdfsdf", companiesProfileData)
  const userRole = Number(getCookie("COMPANY_ROLE"))
  const [isImageUploading, setIsImageUploading] = useState(false)
  const cscSelector = useSelector(state => state.global)
  const [isLoading, setIsLoading] = useState(false)

  const countriesList = arrayTransform(cscSelector?.countriesData?.data?.data || [])
  const getInitialFormData = () => {
    if ([ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole)) {
      return {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
        email: "",
        profile_picture_url: "",
        country_code: {
          name: "",
          dial_code: "",
          short_name: "",
          emoji: ""
        },
        phone_number: ""
      }
    } else if ([ROLES.COMPANIES, ROLES.COMPANIES_ADMIN].includes(userRole)) {
      return {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        name: "",
        display_name: "",
        email: "",
        logo_url: "",
        website_url: "",
        description: "",
        country_code: {
          name: "",
          dial_code: "",
          short_name: "",
          emoji: ""
        },
        phone_no: "",
        company_size: "",
        company_type: "",
        specialties: [],
        founded_year: ""
      }
    } else if ([ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)) {
      return {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        name: "",
        display_name: "",
        email: "",
        logo_url: "",
        website_url: "",
        description: "",
        country_code: {
          name: "",
          dial_code: "",
          short_name: "",
          emoji: ""
        },
        phone_no: "",
        institution_type_id: "",
        specialties: [],
        founded_year: ""
      }
    }
    return {}
  }
  const { formData, setFormData, handleChange, resetForm, errors, setErrors } = useFormHandler(getInitialFormData())
  console.log("this is the form fields", formData)
  const renderProfileImage = () => {
    const imageField = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.COMPANIES, ROLES.COMPANIES_ADMIN, ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)
      ? 'profile_picture_url'
      : 'logo_url'
    const imageUrl = formData[imageField] || adminProfileData?.[imageField] || companiesProfileData?.[imageField] || instituteProfileData?.[imageField] || ''

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
            src={imageUrl || "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=500"}
            className="w-full h-full object-cover"
            alt="Profile"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=500";
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
    )
  };
  const fetchData = () => {
    if ([ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole)) {
      dispatch(adminProfile())
    }
    if ([ROLES.COMPANIES, ROLES.COMPANIES_ADMIN].includes(userRole)) {
      dispatch(companiesProfile())
    }
    if ([ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)) {
      dispatch(instituteProfile())
    }
  }
  const validateProfileForm = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^[0-9]{10,15}$/

    if ([ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole)) {
      if (!formData.first_name?.trim()) {
        newErrors.first_name = "First name is required"
      } else if (formData.first_name.trim().length < 2) {
        newErrors.first_name = "First name must be at least 2 characters"
      }

      if (!formData.last_name?.trim()) {
        newErrors.last_name = "Last name is required"
      } else if (formData.last_name.trim().length < 2) {
        newErrors.last_name = "Last name must be at least 2 characters"
      }
    } else {
      if (!formData.name?.trim()) {
        newErrors.name = "Name is required"
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters"
      }

      if (!formData.display_name?.trim()) {
        newErrors.display_name = "Display name is required"
      }
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    const phoneField = [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole) ? "phone_number" : "phone_no"
    if (!formData[phoneField]?.trim()) {
      newErrors[phoneField] = "Phone number is required"
    } else if (!phoneRegex.test(formData[phoneField].replace(/\D/g, ''))) {
      newErrors[phoneField] = "Please enter a valid phone number (10-15 digits)"
    }

    if (!formData.country_code?.name) {
      newErrors.country_code = "Country is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleProfileSubmit = async () => {
    if (!validateProfileForm()) {
      toast.error("Please fix the validation errors")
      return
    }
    try {
      setIsLoading(true)
      let res

      if ([ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole)) {
        const apiPayload = {
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          email: formData.email.trim(),
          profile_picture_url: formData.profile_picture_url,
          country_code: formData.country_code,
          phone_number: formData.phone_number.trim()
        }
        res = await dispatch(updateProfile(apiPayload)).unwrap()
      } else if ([ROLES.COMPANIES, ROLES.COMPANIES_ADMIN].includes(userRole)) {
        const apiPayload = {
          name: formData.name.trim(),
          display_name: formData.display_name.trim(),
          email: formData.email.trim(),
          logo_url: formData.logo_url,
          website_url: formData.website_url.trim(),
          description: formData.description.trim(),
          country_code: formData.country_code,
          phone_no: formData.phone_no.trim(),
          company_size: formData.company_size,
          company_type: formData.company_type,
          specialties: formData.specialties,
          founded_year: formData.founded_year,
          headquarters: formData.headquarters,
          industry: formData.industry
        }
        res = await dispatch(updateProfileCompanies(apiPayload)).unwrap()
      } else if ([ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)) {
        const apiPayload = {
          name: formData.name.trim(),
          display_name: formData.display_name.trim(),
          email: formData.email.trim(),
          logo_url: formData.logo_url,
          website_url: formData.website_url.trim(),
          description: formData.description.trim(),
          country_code: formData.country_code,
          phone_no: formData.phone_no.trim(),
          institution_type_id: formData.institution_type_id,
          specialties: formData.specialties,
          founded_year: formData.founded_year
        }
        res = await dispatch(updateProfileInstitutions(apiPayload)).unwrap()
      }

      toast.success(res?.message || "Profile updated successfully")
      fetchData()
      setIsProfileModalOpen(false)
      setIsLoading(false)
    } catch (error) {
      toast.error(error || "Failed to update profile")
      setIsLoading(false)
    }
  }
  const handleImageUpload = async (file, fieldName = 'profile_picture_url') => {
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB")
      return
    }

    const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only image files (JPEG, PNG) are allowed")
      return
    }

    try {
      setIsImageUploading(true)
      const result = await uploadImageDirectly(file, "PROFILES")
      toast.success(result?.message)
      setFormData((prev) => ({ ...prev, [fieldName]: result?.data?.imageURL }))

    } catch (error) {
      toast.error(error || 'Failed to upload image')
    } finally {
      setIsImageUploading(false)
    }
  }
  const renderProfileFormFields = () => {
    if ([ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <CustomInput
              label="First Name"
              type="text"
              value={formData.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
              placeholder="Enter first name"
              icon={<FiUser className="text-gray-400" />}
              error={errors?.first_name}
            />
          </div>
          <div>
            <CustomInput
              label="Last Name"
              type="text"
              value={formData.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
              placeholder="Enter last name"
              icon={<FiUser className="text-gray-400" />}
              error={errors?.last_name}
            />
          </div>
        </div>
      )
    } else {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <CustomInput
              label={[ROLES.COMPANIES, ROLES.COMPANIES_ADMIN, ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole) ? "Company Name" : "Institute Name"}
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={[ROLES.COMPANIES, ROLES.COMPANIES_ADMIN, ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole) ? "Enter company name" : "Enter institute name"}
              icon={<FiUser className="text-gray-400" />}
              error={errors?.name}
            />
          </div>
          <div>
            <CustomInput
              label={[ROLES.COMPANIES, ROLES.COMPANIES_ADMIN, ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole) ? "Industry Name" : "Institute Name"}
              type="text"
              value={formData.industry}
              onChange={(e) => handleChange("industry", e.target.value)}
              placeholder={[ROLES.COMPANIES, ROLES.COMPANIES_ADMIN, ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole) ? "Enter industry" : "Enter institute industry"}
              icon={<FiUser className="text-gray-400" />}
              error={errors?.industry}
            />
          </div>
          <div>
            <CustomInput
              label={[ROLES.COMPANIES, ROLES.COMPANIES_ADMIN, ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole) ? "Headquarters Name" : "Institute Name"}
              type="text"
              value={formData.headquarters}
              onChange={(e) => handleChange("headquarters", e.target.value)}
              placeholder={[ROLES.COMPANIES, ROLES.COMPANIES_ADMIN, ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole) ? "Enter headquarters" : "Enter institute headquarters"}
              icon={<FiUser className="text-gray-400" />}
              error={errors?.headquarters}
            />
          </div>
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
        </div>
      )
    }
  };
  const handleImageClick = (fieldName = 'profile_picture_url') => {
    const inputId = `imageUpload-${fieldName}`
    document.getElementById(inputId).click()
  }

  const handleCountryChange = (data) => {
    setFormData((prev) => ({
      ...prev,
      country_code: {
        "name": data?.label,
        "dial_code": data?.dial_code,
        "short_name": data?.short_name,
        "emoji": data?.emoji
      }
    }))
  }
  useEffect(() => {
    if (adminProfileData) {
      if ([ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole)) {
        setFormData(prev => ({
          ...prev,
          first_name: adminProfileData?.first_name || "",
          last_name: adminProfileData?.last_name || "",
          email: adminProfileData?.email || "",
          profile_picture_url: adminProfileData?.profile_picture_url || "",
          country_code: adminProfileData?.country_code || {
            name: "",
            dial_code: "",
            short_name: "",
            emoji: ""
          },
          phone_number: adminProfileData?.phone_number || ""
        }))
      } else if ([ROLES.COMPANIES, ROLES.COMPANIES_ADMIN].includes(userRole)) {
        setFormData(prev => ({
          ...prev,
          name: companiesProfileData?.name || "",
          display_name: companiesProfileData?.display_name || "",
          email: companiesProfileData?.email || "",
          logo_url: companiesProfileData?.logo_url || "",
          website_url: companiesProfileData?.website_url || "",
          description: companiesProfileData?.description || "",
          country_code: companiesProfileData?.country_code || {
            name: "",
            dial_code: "",
            short_name: "",
            emoji: ""
          },
          phone_no: companiesProfileData?.phone_no || "",
          company_size: companiesProfileData?.company_size || "",
          company_type: companiesProfileData?.company_type || "",
          specialties: companiesProfileData?.specialties || [],
          founded_year: companiesProfileData?.founded_year || ""
        }))
      } else if ([ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)) {
        setFormData(prev => ({
          ...prev,
          name: instituteProfileData?.name || "",
          display_name: instituteProfileData?.display_name || "",
          email: instituteProfileData?.email || "",
          logo_url: instituteProfileData?.logo_url || "",
          website_url: instituteProfileData?.website_url || "",
          description: instituteProfileData?.description || "",
          country_code: instituteProfileData?.country_code || {
            name: "",
            dial_code: "",
            short_name: "",
            emoji: ""
          },
          phone_no: instituteProfileData?.phone_no || "",
          institution_type_id: instituteProfileData?.institution_type_id?._id || "",
          specialties: instituteProfileData?.specialties || [],
          founded_year: instituteProfileData?.founded_year || ""
        }))
      }
    }
  }, [adminProfileData, instituteProfileData, companiesProfileData])
  const [activeTab, setActiveTab] = useState("Home");
  const [agencyData, setAgencyData] = useState({});
  const [activeTab1, setActiveTab1] = useState("user");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.user);
  const { suggestedUserData: { data: suggestedUsers } = {} } =
    userSelector || {};

  useEffect(() => {
    dispatch(suggestedUser({ page: 1, size: 10, type: activeTab1 }));
  }, [dispatch, activeTab1]);

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "The Future of UX Design",
      content:
        "Exploring emerging trends in user experience design and how they shape digital experiences...",
      date: "2025-09-20",
      author: "Musemind Team",
    },
    {
      id: 2,
      title: "Building Digital Products That Scale",
      content:
        "Our comprehensive approach to creating scalable digital solutions for modern businesses...",
      date: "2025-09-18",
      author: "Design Team",
    },
  ]);

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Senior UX Designer",
      location: "Dubai, UAE",
      type: "Full-time",
      description:
        "We are looking for a Senior UX Designer to join our growing team and help shape the future of digital experiences...",
    },
    {
      id: 2,
      title: "Frontend Developer",
      location: "Remote",
      type: "Full-time",
      description:
        "Join our development team to build amazing digital experiences using cutting-edge technologies...",
    },
  ]);

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

  const handleProfileUpdate = () => {
    setIsProfileModalOpen(true)
  }
  const updateAgencyData = (field, value) => {
    setAgencyData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const EditableField = ({
    value,
    onSave,
    field,
    multiline = false,
    placeholder = "Enter text...",
    type = "text",
    className = "",
  }) => {
    const [tempValue, setTempValue] = useState(value);
    const [editing, setEditing] = useState(false);

    const handleSave = () => {
      onSave(field, tempValue);
      setEditing(false);
    };

    const handleCancel = () => {
      setTempValue(value);
      setEditing(false);
    };

    if (editing) {
      return (
        <div className="space-y-3">
          {multiline ? (
            <textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={multiline === true ? 4 : multiline}
              placeholder={placeholder}
            />
          ) : (
            <input
              type={type}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={placeholder}
            />
          )}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <Save size={16} />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 flex items-center gap-2 transition-colors"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={`group relative ${className}`}>
        <div className={multiline ? "whitespace-pre-wrap" : ""}>{value}</div>

      </div>
    );
  };
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
                ? data.industry.map((i) => i?.name || "N/A").join(", ")
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
  // Header
  const Header = () => (
    <div className="max-w-6xl mx-auto">
      {/* Top Banner with gradient and partner logos */}
      <div className="relative bg-gradient-to-r from-yellow-100 via-orange-50 to-pink-100 rounded-t-2xl px-6 py-8 overflow-hidden">
        <div className="flex items-center justify-center mb-4">
          <div className="inline-flex items-center gap-2">
            <div className="bg-yellow-300 px-4 py-1 rounded-full">
              <span className="text-gray-900 font-semibold text-sm">
                {/* Next-Gen */}
                {agencyData.name}{" "}
              </span>
            </div>
            <span className="text-gray-800 font-medium text-sm">
              Experience Makers.
            </span>
          </div>
        </div>

        {/* Partner Logos */}
        <div className="flex items-center justify-center gap-8 mb-2">
          <span className="text-gray-500 text-xs font-semibold">VISA</span>
          <span className="text-gray-500 text-xs">fintech</span>
          <span className="text-gray-500 text-xs">tamara</span>
          <span className="text-gray-500 text-xs">panther</span>
          <span className="text-gray-500 text-xs">Qumra</span>
        </div>

        {/* Decorative text */}
        <div className="absolute bottom-2 right-4 text-xs text-gray-400">
          {/* #YourBrandLogos */}
          {agencyData.name}
        </div>

        {/* Decorative wavy lines */}
        <svg
          className="absolute bottom-4 right-12 w-40 h-12 pointer-events-none opacity-70"
          viewBox="0 0 160 48"
        >
          <path
            d="M0,24 Q20,12 40,24 T80,24"
            stroke="#FF6B6B"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M0,32 Q20,20 40,32 T80,32"
            stroke="#FFA500"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M20,16 Q40,4 60,16 T100,16"
            stroke="#4ADE80"
            strokeWidth="2.5"
            fill="none"
          />
        </svg>
      </div>

      <div className="bg-white rounded-b-2xl shadow-2xl">
        <div className="p-6">
          {/* Row 1: Logo + Buttons */}
          <div className="flex items-start justify-between gap-2">
            {/* Logo - overlapping the banner */}
            {/* <div className="relative -mt-16 flex-shrink-0">
              <div className="w-24 h-24 bg-black rounded-xl flex items-center justify-center shadow-2xl border-4 border-zinc-800">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path
                    d="M12 40V8L24 24L36 8V40L24 24L12 40Z"
                    fill="#FFD700"
                  />
                </svg>
              </div>
            </div> */}
            <div className="relative -mt-16 flex-shrink-0">
              <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl border-4 border-zinc-800 bg-black overflow-hidden">
                {agencyData.logo ? (
                  <img
                    src={agencyData.logo}
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

            {/* Buttons */}
            {/* <div className="flex items-start gap-2 pt-2"> */}
            {/* <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                <FaRegEdit />
                <Link to={"/company/update-profile"}>Edit</Link>
              </button> */}
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 px-4 py-2  text-white rounded " onClick={handleProfileUpdate}>

              Edit Page

            </button>
            {/* </div> */}
          </div>

          {/* Row 2: Company Details */}
          <div className="mt-3">
            <h1 className="font-bold text-gray-700 mb-2">{agencyData.name}</h1>
            <p className="text-gray-600 text-sm mb-3 leading-relaxed">
              {agencyData.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-700">
              <span>{agencyData.industry}</span>
              <span>•</span>
              <span>{agencyData.founded}</span>
              <span>•</span>
              <span>{agencyData.followers}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );



  // Navigation
  const Navigation = () => (
    <div className="mt-6">
      <nav className="flex border-b border-gray-200">
        {["Home", "About", "Posts", "Jobs", "People"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-4 text-sm font-medium transition-colors ${activeTab === tab
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
          <Link
            to="/company/update-profile"
            className="flex items-center text-gray-400 hover:text-gray-600"
          >
            <Edit size={16} />
          </Link>
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
                <EditableField
                  value={agencyData.founded}

                  field="founded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specialties in a new row spanning full width, minimal margin */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Specialties</h3>
        <div className="flex flex-wrap gap-2">
          {agencyData.specialties?.map((s, i) => (
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
        About {agencyData.name}
      </h2>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900"></h3>
        <EditableField
          value={agencyData.description}
          onSave={updateAgencyData}
          field="mission"
          multiline={3}
        />
      </div>
      {/* <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900">Our Vision</h3>
        <EditableField
          value="To be the leading global UX design agency that creates meaningful digital products for the future."
          onSave={updateAgencyData}
          field="vision"
          multiline={3}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900">
          Global Presence
        </h3>
        <p>
          With offices in Dubai, Berlin, Riyadh, Dhaka, London, and New York, we
          bring diverse perspectives to every project.
        </p>
      </div> */}
    </div>
  );

  const PostsTab = ({ posts }) => {
    return (
      <div className="bg-white-900 text-black min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Posts</h2>
            <button
              // onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Link to="/company/create-post">Create Post</Link>
            </button>
          </div>

          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white-800 rounded-lg p-6 border border-gray-700"
            >
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-400 text-sm mb-3">
                By {post.author} • {new Date(post.date).toLocaleDateString()}
              </p>
              <p className="text-gray-300">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };




  const JobsTab = () => {
    const [jobs, setJobs] = useState([
      {
        id: 1,
        title: "Sr. UX-UI Designer,",
        company: "Comfygen Private limited",
        logo: "https://via.placeholder.com/48/4F46E5/ffffff?text=C",
        postedDate: "1d Ago",
        type: "Full Time",
        applicants: 10,
        salaryRange: "20-30K",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        location: "152, Vaishali Nagar Jaipur Rajasthan 202012",
        matching: "90%",
        skills: [
          "Communication",
          "Negotiation",
          "Relationship Bulding",
          "Leadership",
          "+5",
        ],
        status: "Shortlisted",
      },
      {
        id: 2,
        title: "Sr. UX-UI Designer,",
        company: "Comfygen Private limited",
        logo: "https://via.placeholder.com/48/1E40AF/ffffff?text=N",
        postedDate: "1d Ago",
        type: "Full Time",
        applicants: 10,
        salaryRange: "20-30K",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        location: "152, Vaishali Nagar Jaipur Rajasthan 202012",
        matching: "90%",
        skills: [
          "Communication",
          "Negotiation",
          "Relationship Bulding",
          "Leadership",
          "+5",
        ],
        status: "Rejected",
      },
    ]);

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
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-colors shadow-sm"
              >
                {/* Header with logo, title, and status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-4">
                    {/* Company Logo */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={job.logo}
                        alt={job.company}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Job Title and Company */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">
                        {job.title}
                      </h2>
                      <p className="text-gray-600 text-sm">{job.company}</p>
                    </div>
                  </div>

                  {/* Status Badge and Bookmark */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-medium ${job.status === "Shortlisted"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                    >
                      {job.status}
                    </span>
                    <button className="text-gray-400 hover:text-gray-700 transition-colors">
                      <Bookmark size={20} />
                    </button>
                  </div>
                </div>

                {/* Job Meta Info */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span>{job.postedDate}</span>
                  <span>-</span>
                  <span>{job.type}</span>
                  <span>-</span>
                  <span>{job.applicants} Applied</span>
                  <span>-</span>
                  <span>{job.salaryRange}</span>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {job.description}
                </p>

                {/* Location and Matching */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <MapPin size={16} className="flex-shrink-0" />
                  <span>{job.location}</span>
                  <span className="text-blue-600 font-medium ml-2">
                    {job.matching} Matching
                  </span>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg border border-gray-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Apply Now Button */}
                <button className="px-6 py-2.5 bg-transparent border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-500/10 transition-colors font-medium">
                  Apply Now
                </button>
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
      <div className="bg-white-900 text-black min-h-screen">
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

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Home":
        return <HomeTab />;
      case "About":
        return <AboutTab />;
      // case 'Posts': return <PostsTab setPosts={setPosts} />;
      case "Posts":
        return <PostsTab posts={posts} setPosts={setPosts} />;
      case "Jobs":
        return <JobsTab jobs={jobs} setJobs={setJobs} />;
      case "People":
        return <PeopleTab people={people} setPeople={setPeople} />;
      default:
        return <HomeTab />;
    }
  };

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
              onClick={() => handleImageClick([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.COMPANIES, ROLES.COMPANIES_ADMIN, ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole) ? 'profile_picture_url' : 'logo_url')}
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
            <div>
              <FilterSelect
                options={countriesList}
                label="Country"
                selectedOption={countriesList?.find(opt => opt?.label === formData?.country_code?.name)}
                onChange={(data) => handleCountryChange(data)}
                error={errors?.country_code}
                icon={<FiGlobe className="text-gray-400" />}
              />
            </div>
            <div>
              <CustomInput
                label={[ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole) ? "Phone Number" : "Phone"}
                type="tel"
                value={[ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole) ? formData.phone_number : formData.phone_no}
                onChange={(e) => handleChange([ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole) ? "phone_number" : "phone_no", e.target.value)}
                placeholder={[ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole) ? "Enter phone number" : "Enter phone"}
                icon={<FiPhone className="text-gray-400" />}
                error={[ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole) ? errors?.phone_number : errors?.phone_no}
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
