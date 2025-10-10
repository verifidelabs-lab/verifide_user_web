/* eslint-disable react-hooks/exhaustive-deps */

import { PiPlus, PiX } from "react-icons/pi";
import {
  arrayTransform,
  uploadImageDirectly,
} from "../../components/utils/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import {
  cities,
  countries,
  masterIndustry,
  state,
  updateMasterIndustryData,
} from "../../redux/Global Slice/cscSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import { companyRegisterVerifyOtp } from "../../redux/slices/authSlice";
import OTPVerificationPopup from "./components/OTPVerificationPopup";
import { toast } from "sonner";
import { setCookie } from "../../components/utils/cookieHandler";
import { useNavigate } from "react-router-dom";
import { TbArrowBack } from "react-icons/tb";
import CreatableSelect from "react-select/creatable";
import classNames from "classnames";
import CustomInput from "../../components/ui/InputAdmin/CustomInput";
import PasswordInput from "../../components/ui/InputAdmin/PasswordInput";
import FilterSelect from "../../components/ui/Input/FilterSelect";
import useFormHandler from "../../components/hooks/useFormHandler";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/InputAdmin/Input";

import EnhancedFileInput from "../../components/ui/Input/CustomFileAndImage";
import { addOneData } from "../../redux/Users/userSlice";
import Modal from "../../components/ui/Modal/Modal";
import { companyIndustries } from "../../redux/CompanySlices/CompanyAuth";
import {
  createCompany,
  getCompaniesList,
} from "../../redux/slices/companiesSlice";

const initialFormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  display_name: "",
  description: "",
  website_url: "",
  logo_url: "",
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



const RegisterCompany = () => {
  const {
    formData,
    handleChange,
    setFormData,
    errors,
    handleSelectChange,
    setErrors,
  } = useFormHandler(initialFormData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoUrl, setLogoUrl] = useState(formData.logo_url || "");
  const [loading, setLoading] = useState(false);
  const [inputFields, setInputFields] = useState({
    name: "",
    logo_url: "",
  });
  const [addModalState, setAddModalState] = useState({
    isOpen: false,
    type: "",
    field: "",
  });
  const handleFileUpload = useCallback(
    async (file, fileType) => {
      if (!file) {
        toast.error("Please select a file");
        return;
      }

      const maxSize = fileType === "image" ? 5 * 1024 * 1024 : 20 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(
          `File size must be less than ${fileType === "image" ? "5MB" : "20MB"}`
        );
        return;
      }

      setLoading(true);

      try {
        if (fileType === "image") {
          const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
          if (!allowedImageTypes.includes(file.type)) {
            toast.error("Only JPEG, JPG, or PNG files are allowed");
            return;
          }

          const result = await uploadImageDirectly(file, "COMPANY_LOGO");
          if (result?.data?.imageURL) {
            setLogoUrl(result.data.imageURL);
            setFormData((prev) => ({
              ...prev,
              logo_url: result.data.imageURL,
            }));

            if (errors.logo_url) {
              setErrors((prev) => ({ ...prev, logo_url: "" }));
            }

            toast.success(result?.message || "Logo uploaded successfully");
          } else {
            throw new Error("Logo upload failed");
          }
        }
      } catch (error) {
        console.error("File upload error:", error);
        toast.error(error?.message || "Failed to upload logo");
      } finally {
        setLoading(false);
      }
    },
    [errors.logo_url, setFormData, setErrors]
  );

  const handleImageUpload = useCallback(
    (file) => {
      handleFileUpload(file, "image");
    },
    [handleFileUpload]
  );

  const removeImage = () => {
    setLogoUrl("");
    setFormData((prev) => ({ ...prev, logo_url: "" }));
  };

  useEffect(() => {
    const checkCompanyLimit = async () => {
      const apiPayload = {
        page: 1,
        size: 100,
        populate: "industry|name",
        select:
          "name display_name email industry phone_no company_size company_type is_verified createdAt logo_url created_by_users ",
        searchFields: "name",
        keyWord: "",
        query: JSON.stringify({}),
      };

      try {
        const result = await dispatch(getCompaniesList(apiPayload)).unwrap();
        const companies = result?.data?.list || [];
        if (companies.length >= 5) {
          toast.error("You have exceeded your company creation limit.");
          navigate("/user/feed");
        }
      } catch (error) {
        // Optionally handle fetch error
      }
    };

    checkCompanyLimit();
  }, [dispatch, navigate]);

  const cscSelector = useSelector((state) => state.global);
  const stateList = arrayTransform(cscSelector?.stateData?.data?.data || []);
  const cityList = arrayTransform(cscSelector?.citiesData?.data?.data || []);
  const countriesList = arrayTransform(
    cscSelector?.countriesData?.data?.data || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);





  const selector = useSelector((state) => state.global);

  const allIndustry = [
    { value: "", label: "Select" },
    ...arrayTransform(selector?.masterIndustryData?.data?.data?.list),
  ];
  const getIndustries = () => {
    dispatch(masterIndustry());
  };

  useEffect(() => {
    dispatch(countries());
    getIndustries();
  }, []);

  const removeSpecialty = (index) => {
    if (formData.specialties.length <= 1) return;

    const newSpecialties = formData.specialties.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      specialties: newSpecialties,
    }));

    if (errors.specialties && errors.specialties[index]) {
      const newErrors = {
        ...errors,
        specialties: errors.specialties.filter((_, i) => i !== index),
      };
      setErrors(newErrors);
    }
  };

  const handleCountryChange = (field, country) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        name: country?.label || "",
        dial_code: country?.dial_code || "",
        short_name: country?.short_name || "",
        emoji: country?.emoji || "",
      },
    }));
  };

  const handleHeadquartersChange = (field, value) => {
    if (field === "country") {
      setFormData((prev) => ({
        ...prev,
        headquarters: {
          ...prev.headquarters,
          country: {
            name: value?.label || "",
            dial_code: value?.dial_code || "",
            short_name: value?.short_name || "",
            emoji: value?.emoji || "",
          },
          state: { name: "", code: "" },
          city: { name: "" },
        },
      }));

      if (value?.short_name) {
        dispatch(state({ country_code: value.short_name }));
      }
    } else if (field === "state") {
      setFormData((prev) => ({
        ...prev,
        headquarters: {
          ...prev.headquarters,
          state: {
            name: value?.label || "",
            code: value?.state_code || "",
          },
          city: { name: "" },
        },
      }));

      if (value?.country_code && value?.state_code) {
        dispatch(
          cities({
            country_code: value.country_code,
            state_code: value.state_code,
          })
        );
      }
    } else if (field === "city") {
      setFormData((prev) => ({
        ...prev,
        headquarters: {
          ...prev.headquarters,
          city: {
            name: value?.label || "",
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        headquarters: {
          ...prev.headquarters,
          [field]: value,
        },
      }));
    }
  };

  const handleCompanySizeChange = (data) => {
    setFormData((prev) => ({
      ...prev,
      company_size: data?.value,
    }));
  };

  const handleSpecialtyChange = (index, value) => {
    const newSpecialties = [...formData.specialties];
    newSpecialties[index] = String(value || "");

    if (errors.specialties) {
      const newErrors = { ...errors };
      if (newErrors.specialties[index]) {
        newErrors.specialties[index] = "";
        setErrors(newErrors);
      }
    }

    setFormData((prev) => ({
      ...prev,
      specialties: newSpecialties,
    }));
  };

  const addSpecialty = () => {
    const lastSpecialty = formData.specialties[formData.specialties.length - 1];
    if (String(lastSpecialty || "").trim() === "") {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      specialties: [...prev.specialties, ""],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.username?.trim()) newErrors.username = "Username is required";
    if (!formData.name?.trim()) newErrors.name = "Company name is required";
    if (!formData.display_name?.trim())
      newErrors.display_name = "Display name is required";
    if (!formData.phone_no?.trim())
      newErrors.phone_no = "Phone number is required";
    if (!formData.country?.trim())
      newErrors.country = "country is required";
    if (!formData.country?.trim())
      newErrors.country = "country is required";
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
    setErrors({ ...newErrors });
    return newErrors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const createPayload = {
        name: formData.name,
        display_name: formData.display_name,
        description: formData.description,
        website_url: formData.website_url,
        logo_url: formData.logo_url,
        industry: formData.industry || [],
        country_code: formData.country_code,
        phone_no: formData.phone_no,
        company_size: formData.company_size,
        company_type: formData.company_type,
        headquarters: formData.headquarters,
        founded_year: formData.founded_year
          ? Math.floor(
            new Date(`${formData.founded_year}-01-01`).getTime() / 1000
          )
          : null,
        specialties: (formData.specialties || [])
          .map((s) => String(s || "").trim())
          .filter((s) => s !== ""),
        employee_count: formData.employee_count
          ? Number(formData.employee_count)
          : null,
        linkedin_page_url: formData.linkedin_page_url,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      const res = await dispatch(createCompany(createPayload)).unwrap();
      if (res?.error) {
        toast.error(res?.message || "Failed to create company");
        return;
      }
      console.log("formDataformData11111111111111111111", res);

      if (res?.data?.redisToken) {

      } else {
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

        dispatch(getCompaniesList(apiPayload));
        toast.success(res?.message || "Company created successfully");
        setFormData(initialFormData);
        navigate("/user/feed"); // Redirects to desired route
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error || "An error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputRefs = {
    username: useRef(null),
    email: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
    name: useRef(null),
    display_name: useRef(null),
    phone_no: useRef(null),
    industry: useRef(null),
  };

  // scroll to first error field
  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      const firstErrorKey = Object.keys(errors)[0];
      if (inputRefs[firstErrorKey]?.current) {
        inputRefs[firstErrorKey].current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        inputRefs[firstErrorKey].current.focus?.();
      }
    }
  }, [errors]);

  const handleBack = () => {
    navigate("/user/feed");
  };

  const getSelectedOption = (options, value) => {
    if (!value) return null;

    if (Array.isArray(value)) {
      // value is array of IDs (strings)
      return options.filter((opt) => value.includes(opt.value));
    }

    // single value (string)
    return options.find((opt) => opt.value === value) || null;
  };

  const handleAddItem = async () => {
    try {
      let type = "";
      let updateAction = null;
      let selectField = addModalState.field; // Get the field this item should be selected in

      switch (addModalState.type) {
        case "industries":
          type = "industries";
          updateAction = updateMasterIndustryData;
          break;

        default:
          return;
      }
      setLoading(true);

      const res = await dispatch(addOneData({ type, ...inputFields })).unwrap();
      setLoading(false);

      console.log("this is the response", res);
      dispatch(
        updateAction({
          _id: res.data._id,
          name: res.data.name,
          created_by_users: res?.data?.created_by_users,
        })
      );

      setFormData((prev) => ({
        ...prev,
        [selectField]: res.data._id,
      }));

      setAddModalState({ isOpen: false, type: "", field: "" });
      setInputFields({ name: "", logo_url: "" });
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };
  console.log("this is formdata", formData);

  return (
    <div className="h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <button
              onClick={handleBack}
              title="go back"
              className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 transition-colors"
            >
              <TbArrowBack size={20} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              Register Your Company
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Fill in your company details to create an account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInput
                  label="Username *"
                  type="text"
                  value={formData?.username}
                  name="username"
                  ref={inputRefs.username}
                  onChange={(e) => handleChange("username", e)}
                  placeholder="Enter username"
                  error={errors.username}
                />
                <CustomInput
                  label="Email *"
                  value={formData?.email}
                  name="email"
                  ref={inputRefs.email}
                  onChange={(e) => handleChange("email", e)}
                  placeholder="Enter email"
                  error={errors.email}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <PasswordInput
                  label="Password *"
                  value={formData?.password}
                  onChange={(e) => handleChange("password", e)}
                  name="password"
                  ref={inputRefs.password}
                  placeholder="Enter password"
                  error={errors?.password}
                />
                <PasswordInput
                  label="Confirm Password *"
                  value={formData?.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e)}
                  name="confirmPassword"
                  ref={inputRefs.confirmPassword}
                  placeholder="Confirm password"
                  error={errors?.confirmPassword}
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Basic Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInput
                  label="Company Name *"
                  value={formData?.name}
                  name="name"
                  ref={inputRefs.name}
                  onChange={(e) => handleChange("name", e)}
                  placeholder="Enter company name"
                  error={errors.name}
                />

                <CustomInput
                  label="Display Name *"
                  value={formData?.display_name}
                  name="display_name"
                  ref={inputRefs.display_name}
                  onChange={(e) => handleChange("display_name", e)}
                  placeholder="Enter display name"
                  error={errors.display_name}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <CustomInput
                  label="Phone Number *"
                  value={formData?.phone_no}
                  name="phone_no"
                  ref={inputRefs.phone_no}
                  onChange={(e) => handleChange("phone_no", e)}
                  placeholder="Enter phone number"
                  error={errors?.phone_no}
                />

                <FilterSelect
                  label="Country Code *"
                  name="country_code"
                  options={countriesList || []}
                  selectedOption={countriesList?.find(
                    (opt) =>
                      opt.short_name === formData?.country_code?.short_name
                  )}
                  onChange={(country) =>
                    handleCountryChange("country_code", country)
                  }
                  error={errors?.country_code}

                />
              </div>

              <div className="mt-4">
                <CustomInput
                  type="textarea"
                  label="Description"
                  value={formData?.description}
                  name="description"
                  onChange={(e) => handleChange("description", e)}
                  placeholder="Enter company description"
                  rows={3}
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Company Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FilterSelect
                  label="Industry Name"
                  name="industry"
                  placeholder="Select Industry"
                  options={allIndustry}
                  selectedOption={getSelectedOption(
                    allIndustry,
                    formData?.industry
                  )}
                  onChange={(selected) => {
                    // store only IDs
                    const ids = Array.isArray(selected)
                      ? selected.map((s) => s.value)
                      : selected?.value;
                    handleSelectChange(
                      "industry",
                      ids,
                      Array.isArray(selected)
                    );
                  }}
                  error={errors.industry}
                  ref={inputRefs.industry}
                  required
                  onCreateOption={(inputValue, field) => {
                    setAddModalState({
                      isOpen: true,
                      type: "industries",
                      field: field,
                    });
                    setInputFields((prev) => ({ ...prev, name: inputValue }));
                  }}
                  isClearable={true}
                  // isDisabled={!formData?.company_id}
                  disabledTooltip="Please select first Company"
                  isCreatedByUser={true}
                  isMulti
                />

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FilterSelect
                  options={Company_Sizes || []}
                  label="Company Size"
                  selectedOption={Company_Sizes?.find(
                    (opt) => opt.value === formData?.company_size
                  )}
                  name="company_size"
                  onChange={handleCompanySizeChange}
                  placeholder="Select company size"
                />

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

                <CustomInput
                  label="Website URL"
                  value={formData?.website_url}
                  name="website_url"
                  onChange={(e) => handleChange("website_url", e)}
                  placeholder="https://example.com"
                  error={errors.website_url}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <CustomInput
                  label="LinkedIn Page URL"
                  value={formData?.linkedin_page_url}
                  name="linkedin_page_url"
                  onChange={(e) => handleChange("linkedin_page_url", e)}
                  placeholder="https://linkedin.com/company/example"
                  error={errors.linkedin_page_url}
                />
              </div>
              <div className="mt-4">
                <EnhancedFileInput
                  accept=".jpg,.jpeg,.png"
                  supportedFormats="Image"
                  label="Company Logo"
                  name="logo_url"
                  onChange={handleImageUpload}
                  onDelete={removeImage}
                  error={errors.logo_url}
                  loading={loading}
                  value={logoUrl}
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Headquarters
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <CustomInput
                  label="Address Line 1"
                  value={formData?.headquarters?.address_line_1}
                  onChange={(e) =>
                    handleHeadquartersChange("address_line_1", e.target.value)
                  }
                  placeholder="Enter address line 1"
                />

                <CustomInput
                  label="Address Line 2"
                  value={formData?.headquarters?.address_line_2}
                  onChange={(e) =>
                    handleHeadquartersChange("address_line_2", e.target.value)
                  }
                  placeholder="Enter address line 2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <FilterSelect
                  label="Country"
                  options={countriesList}
                  selectedOption={countriesList?.find(
                    (opt) =>
                      opt.short_name ===
                      formData?.headquarters?.country?.short_name
                  )}
                  onChange={(country) =>
                    handleHeadquartersChange("country", country)
                  }
                  placeholder="Select Country"
                />

                <FilterSelect
                  label="State"
                  options={stateList}
                  selectedOption={stateList?.find(
                    (opt) =>
                      opt.state_code === formData?.headquarters?.state?.code
                  )}
                  onChange={(state) =>
                    handleHeadquartersChange("state", state)
                  }
                  placeholder="Select State"
                  isDisabled={!formData?.headquarters?.country?.short_name}
                />

                <FilterSelect
                  label="City"
                  options={cityList}
                  selectedOption={cityList?.find(
                    (opt) => opt.name === formData?.headquarters?.city?.name
                  )}
                  onChange={(city) => handleHeadquartersChange("city", city)}
                  placeholder="Select City"
                  isDisabled={!formData?.headquarters?.state?.code}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <CustomInput
                  label="Pin Code"
                  value={formData?.headquarters?.pin_code}
                  onChange={(e) =>
                    handleHeadquartersChange("pin_code", e.target.value)
                  }
                  placeholder="Enter pin code"
                />
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Specialties
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={<PiPlus />}
                  onClick={addSpecialty}
                  disabled={formData?.specialties?.some(
                    (s) => String(s || "").trim() === ""
                  )}
                >
                  Add Specialty
                </Button>
              </div>

              <div className="space-y-2">
                {formData?.specialties?.map((specialty, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-1">
                      <Input
                        value={specialty}
                        onChange={(e) =>
                          handleSpecialtyChange(index, e.target.value)
                        }
                        placeholder="Enter specialty"
                      />
                      {errors.specialties && errors.specialties[index] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.specialties[index]}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      icon={<PiX />}
                      onClick={() => removeSpecialty(index)}
                      className="text-red-500 hover:text-red-700 mt-1"
                      disabled={formData.specialties.length <= 1}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <Button
                type="submit"
                className="w-full py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register Company"}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Modal
        isOpen={addModalState.isOpen}
        title={`Add ${addModalState.type}`}
        onClose={() => {
          setAddModalState({ isOpen: false, type: "", field: "" });
          setInputFields({ name: "", logo_url: "" });
        }}
        handleSubmit={handleAddItem}
        loading={loading}
      >
        <div className="space-y-3">
          <CustomInput
            className="w-full h-10"
            label="Enter Name"
            required
            placeholder="Enter name"
            value={inputFields?.name}
            onChange={(e) =>
              setInputFields((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
      </Modal>
    </div>
  );
};

export default RegisterCompany;
