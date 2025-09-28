/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useFormHandler from '../../../components/hooks/useFormHandler'
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
import { toast } from 'sonner'
import { arrayTransform, uploadImageDirectly } from '../../../components/utils/globalFunction'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { countries } from '../../../redux/Global Slice/cscSlice'

import { FiEdit2, FiLock, FiMail, FiPhone, FiGlobe, FiUser, FiCamera, FiCheck } from 'react-icons/fi'
import Button from '../../../components/ui/Button/Button'
import CustomInput from '../../../components/ui/InputAdmin/CustomInput'
import FilterSelect from '../../../components/ui/InputAdmin/FilterSelect'
import Modal from '../../../components/ui/InputAdmin/Modal/Modal'
import PasswordInput from '../../../components/ui/InputAdmin/PasswordInput'
import { getCookie } from '../../../components/utils/cookieHandler'
const ROLES = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  COMPANIES: 3,
  COMPANIES_ADMIN: 7,
  INSTITUTIONS: 4,
  INSTITUTIONS_ADMIN: 8
};

const UpdateProfile = ({ adminProfileData, companiesProfileData, instituteProfileData }) => {
  const dispatch = useDispatch()
  const cscSelector = useSelector(state => state.global)

  const userRole = Number(getCookie("COMPANY_ROLE"))
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isImageUploading, setIsImageUploading] = useState(false)
  const countriesList = arrayTransform(cscSelector?.countriesData?.data?.data || [])
  const getDefaultName = (roleId) => {
    switch (roleId) {
      case ROLES.SUPER_ADMIN:
        return "Super Admin"
      case ROLES.ADMIN:
        return "Admin"
      case ROLES.COMPANIES:
      case ROLES.COMPANIES_ADMIN:
        return "Company"
      case ROLES.INSTITUTIONS:
      case ROLES.INSTITUTIONS_ADMIN:
        return "Institute"
      default:
        return "User"
    }
  }
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
  const [isLoading, setIsLoading] = useState(false)

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

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
    fetchData()
    dispatch(countries())
  }, [])

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

  const handlePasswordUpdate = () => {
    setIsPasswordModalOpen(true)
  }

  const handleProfileUpdate = () => {
    setIsProfileModalOpen(true)
  }

  const validatePasswordForm = () => {
    const newErrors = {}
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required"
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (!passwordRegex.test(formData.newPassword)) {
      newErrors.newPassword =
        "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character"
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required"
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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

  const handlePasswordSubmit = async () => {
    if (!validatePasswordForm()) {
      toast.error("Please fix the validation errors")
      return
    }
    try {
      setIsLoading(true)
      let res

      if ([ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole)) {
        res = await dispatch(adminChangePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        })).unwrap()
      } else if ([ROLES.COMPANIES, ROLES.COMPANIES_ADMIN].includes(userRole)) {
        res = await dispatch(resetPasswordCompanies({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        })).unwrap()
      } else if ([ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)) {
        res = await dispatch(resetPasswordInstitutions({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        })).unwrap()
      }

      toast.success(res?.message || "Password updated successfully")
      fetchData()
      setIsPasswordModalOpen(false)
      resetForm()
      setIsLoading(false)
    } catch (error) {
      toast.error(error || "Failed to update password")
      setIsLoading(false)
    }
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

  const renderProfileHeader = () => {
    if ([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.COMPANIES, ROLES.COMPANIES_ADMIN, ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)) {
      return (
        <>
          <h2 className="text-2xl font-bold text-white">
            {adminProfileData?.first_name || companiesProfileData?.name || instituteProfileData?.name || "N/A"} {adminProfileData?.last_name || ""}
          </h2>
          <p className="text-blue-100">{adminProfileData?.email || companiesProfileData?.email || instituteProfileData?.email || "N/A"}</p>
        </>
      )
    } else {
      // return (
      //   <>
      //     <h2 className="text-2xl font-bold text-white">
      //       {adminProfileData?.name || adminProfileData?.display_name || "N/A"}
      //     </h2>
      //     <p className="text-blue-100">{adminProfileData?.email ||  "N/A"}</p>
      //     <p className="text-blue-100">{adminProfileData?.website_url || "N/A"}</p>
      //   </>
      // )
    }
  }

  const renderPersonalInfo = () => {
    if ([ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(userRole)) {
      return (
        <>
          <div>
            <p className="text-xs text-gray-500">Full Name</p>
            <p className="font-medium">
              {adminProfileData?.first_name || "N/A"} {adminProfileData?.last_name || ""}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="font-medium">{adminProfileData?.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="font-medium">
              +{adminProfileData?.country_code?.dial_code} {adminProfileData?.phone_number || "N/A"}
            </p>
          </div>
        </>
      )
    } else if ([ROLES.COMPANIES, ROLES.COMPANIES_ADMIN, ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)) {
      return (
        <>
          <div>
            <p className="text-xs text-gray-500">Company Name</p>
            <p className="font-medium">{adminProfileData?.name || companiesProfileData?.name || instituteProfileData?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Display Name</p>
            <p className="font-medium">{adminProfileData?.display_name || companiesProfileData?.display_name || instituteProfileData?.display_name || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="font-medium">{adminProfileData?.email || companiesProfileData?.email || instituteProfileData?.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="font-medium">
              +{adminProfileData?.country_code?.dial_code || companiesProfileData?.country_code?.dial_code || instituteProfileData?.country_code?.dial_code} {adminProfileData?.phone_no || companiesProfileData?.phone_no || instituteProfileData?.phone_no || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Website</p>
            <p className="font-medium">{adminProfileData?.website_url || companiesProfileData?.website_url || instituteProfileData?.website_url || "N/A"}</p>
          </div>
        </>
      )
    } else if ([ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)) {
      return (
        <>
          <div>
            <p className="text-xs text-gray-500">Institute Name</p>
            <p className="font-medium">{instituteProfileData?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Display Name</p>
            <p className="font-medium">{instituteProfileData?.display_name || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="font-medium">{instituteProfileData?.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="font-medium">
              +{instituteProfileData?.country_code?.dial_code} {instituteProfileData?.phone_no || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Website</p>
            <p className="font-medium">{instituteProfileData?.website_url || "N/A"}</p>
          </div>
        </>
      )
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


  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Loader loading={loading} /> */}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8" data-aos="fade-down">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{getDefaultName(userRole)} Profile</h1>
          <p className="text-gray-600">Manage your account information and security</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            <div className="relative z-10 flex flex-col md:flex-row items-center">
              {renderProfileImage()}
              <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                {renderProfileHeader()}
                {/* <div className="mt-2 flex justify-center md:justify-start">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                    <span className="w-2 h-2 bg-green-300 rounded-full mr-2"></span>
                    Active {getDefaultName(userRole)}
                  </span>
                </div> */}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FiUser className="mr-2 text-blue-500" />
                    Personal Information
                  </h3>
                  <button
                    onClick={handleProfileUpdate}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <FiEdit2 className="mr-1" /> Edit
                  </button>
                </div>
                <div className="space-y-3">
                  {renderPersonalInfo()}
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FiLock className="mr-2 text-blue-500" />
                    Account Security
                  </h3>
                  <button
                    onClick={handlePasswordUpdate}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <FiEdit2 className="mr-1" /> Change
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Password</p>
                    <p className="font-medium">•••••••••••</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="font-medium">
                      {adminProfileData?.updatedAt ? new Date(adminProfileData.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Member Since</p>
                    <p className="font-medium">
                      {adminProfileData?.createdAt ? new Date(adminProfileData.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleProfileUpdate}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-full mr-3">
                    <FiUser className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Edit Profile</p>
                    <p className="text-sm text-gray-500">Update your personal information</p>
                  </div>
                </div>
                <FiEdit2 className="text-gray-400" />
              </button>
              <button
                onClick={handlePasswordUpdate}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-full mr-3">
                    <FiLock className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Change Password</p>
                    <p className="text-sm text-gray-500">Update your security credentials</p>
                  </div>
                </div>
                <FiEdit2 className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Update Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        title="Change Password"
        onClose={() => {
          setIsPasswordModalOpen(false);
          resetForm();
          setErrors({});
        }}
      >
        <div className="space-y-5">
          <div className="text-center mb-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-3">
              <FiLock className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Update your password</h3>
            <p className="mt-1 text-sm text-gray-500">
              Ensure your account is using a long, random password to stay secure.
            </p>
          </div>

          <div className="space-y-4">
            <PasswordInput
              label="Current Password"
              value={formData.currentPassword}
              onChange={(e) => handleChange("currentPassword", e.target.value)}
              name="currentPassword"
              placeholder="Enter current password"
              error={errors?.currentPassword}
              icon={<FiLock className="text-gray-400" />}
            />
            <PasswordInput
              label="New Password"
              value={formData.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
              name="newPassword"
              placeholder="Enter new password"
              error={errors?.newPassword}
              icon={<FiLock className="text-gray-400" />}
            />
            <PasswordInput
              label="Confirm New Password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              name="confirmPassword"
              placeholder="Confirm new password"
              error={errors?.confirmPassword}
              icon={<FiCheck className="text-gray-400" />}
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsPasswordModalOpen(false);
                resetForm();
                setErrors({});
              }}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handlePasswordSubmit}
              loading={isLoading}
              className="px-4 py-2"
            >
              Update Password
            </Button>
          </div>
        </div>
      </Modal>

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
  )
}
export default UpdateProfile;