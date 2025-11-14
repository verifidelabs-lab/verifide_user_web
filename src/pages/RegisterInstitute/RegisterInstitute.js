/* eslint-disable react-hooks/exhaustive-deps */

import { PiPlus, PiX } from "react-icons/pi";
import {
  arrayTransform,
  uploadImageDirectly,
} from "../../components/utils/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import { cities, countries, state } from "../../redux/Global Slice/cscSlice";
import { useCallback, useEffect, useState } from "react";
import {
  institutionTypePublic,
  institutionDegreePublic,
  institutionsRegister,
  institutionsRegisterVerifyOtp,
} from "../../redux/slices/authSlice";
import { toast } from "sonner";
import { setCookie } from "../../components/utils/cookieHandler";
import { useNavigate } from "react-router-dom";
import OTPVerificationPopup from "../RegisterCompany/components/OTPVerificationPopup";
import CreatableSelect from "react-select/creatable";
import classNames from "classnames";
import { TbArrowBack } from "react-icons/tb";
import CustomInput from "../../components/ui/InputAdmin/CustomInput";
import PasswordInput from "../../components/ui/InputAdmin/PasswordInput";
import FilterSelect from "../../components/ui/InputAdmin/FilterSelect";
import useFormHandler from "../../components/hooks/useFormHandler";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/InputAdmin/Input";
import {
  createInstitution,
  getInstitutionsList,
} from "../../redux/slices/instituteSlice";
import EnhancedFileInput from "../../components/ui/Input/CustomFileAndImage";

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
  institution_type_id: "",
  degree_ids: [],
  country_code: {
    name: "",
    dial_code: "",
    short_name: "",
    emoji: "",
  },
  phone_no: "",
  address: {
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

const FilterSelectAdd = ({
  label = "Filter By",
  options = [],
  selectedOption,
  onChange,
  isMulti = false,
  containerClassName = "",
  selectClassName = "",
  labelClassName = "",
  placeholder = "Select...",
  error = false,
  enableCustomInput = false,
  onAddCustomOption,
}) => {
  const [inputValue, setInputValue] = useState("");

  const selectClasses = classNames(
    "glassy-input-notification w-full rounded-[10px]",
    {
      "border-gray-300": !error,
      "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500":
        error,
    },
    selectClassName
  );

  // const customStyles = {
  //   // control: (base, state) => ({
  //   //   ...base,
  //   //   borderRadius: "10px",
  //   //   borderColor: error ? "#f87171" : "#d1d5db",
  //   //   minHeight: "52px",
  //   //   opacity: 1,
  //   //   boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
  //   //   "&:hover": {
  //   //     borderColor: error ? "#f87171" : "#9ca3af",
  //   //   },
  //   // }),
  //   control: (base, state) => ({
  //     ...base,
  //     backgroundColor: "var(--bg-input)",
  //     borderRadius: "10px",
  //     border: "1px solid var(--border-color)",
  //     minHeight: "50px",
  //     boxShadow: "none",
  //     color: "var(--text-primary)",
  //     "&:hover": {
  //       borderColor: error ? "#f87171" : "var(--border-hover)",
  //     },
  //   }),

  //   placeholder: (base) => ({
  //     ...base,
  //     color: "#000000",
  //     opacity: 0.5,
  //   }),
  //   multiValue: (base) => ({
  //     ...base,
  //     backgroundColor: "#e5e7eb",
  //     borderRadius: "4px",
  //   }),
  //   multiValueLabel: (base) => ({
  //     ...base,
  //     color: "#374151",
  //   }),
  //   multiValueRemove: (base) => ({
  //     ...base,
  //     color: "#6b7280",
  //     ":hover": {
  //       backgroundColor: "#f87171",
  //       color: "white",
  //     },
  //   }),
  // };
  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "var(--bg-input)", // ✅ ensure same dark tone
      borderRadius: "10px",
      border: "1px solid var(--border-color)",
      minHeight: "50px",
      boxShadow: "none",
      opacity: 1,
      color: "var(--text-primary)",
      "&:hover": {
        borderColor: error ? "#f87171" : "var(--border-hover)",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "var(--bg-card)", // ✅ dropdown background match
      borderRadius: "10px",
      color: "var(--text-primary)",
    }),
    singleValue: (base) => ({
      ...base,
      color: "var(--text-primary)",
    }),
    placeholder: (base) => ({
      ...base,
      color: "var(--text-primary)",
      opacity: 0.5,
    }),
    input: (base) => ({
      ...base,
      color: "var(--text-primary)",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "var(--bg-card)",
      borderRadius: "6px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "var(--text-primary)",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "var(--text-secondary)",
      ":hover": {
        backgroundColor: "#f87171",
        color: "white",
      },
    }),
  };
  const handleCreate = (inputValue) => {
    const newOption = { label: inputValue, value: inputValue };
    if (onAddCustomOption) {
      onAddCustomOption(inputValue);
    }
    if (isMulti) {
      onChange([...(selectedOption || []), newOption]);
    } else {
      onChange(newOption);
    }
  };

  return (
    <div className={`w-full ${containerClassName}`}>
      <label
        className={`block text-sm glassy-text-primary font-medium mb-2 ${labelClassName}`}
      >
        {label}
      </label>

      <CreatableSelect
        isMulti={isMulti}
        options={options}
        value={selectedOption}
        onChange={onChange}
        onCreateOption={handleCreate}
        inputValue={inputValue}
        onInputChange={(value, actionMeta) => {
          setInputValue(value);
        }}
        placeholder={placeholder}
        styles={customStyles}
        className={selectClasses}
        classNamePrefix="react-select"
        noOptionsMessage={({ inputValue }) =>
          enableCustomInput && inputValue
            ? `No match found. Press Enter to add "${inputValue}"`
            : "No options"
        }
      />
    </div>
  );
};

const RegisterInstitute = () => {
  const { formData, handleChange, setFormData, errors, setErrors } =
    useFormHandler(initialFormData);
  const dispatch = useDispatch();
  const cscSelector = useSelector((state) => state.global);
  const stateList = arrayTransform(cscSelector?.stateData?.data?.data || []);
  const cityList = arrayTransform(cscSelector?.citiesData?.data?.data || []);
  const countriesList = arrayTransform(
    cscSelector?.countriesData?.data?.data || []
  );
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState(formData.logo_url || "");
  const [institutionTypes, setInstitutionTypes] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [customDegreeInput, setCustomDegreeInput] = useState("");
  const [showCustomDegreeInput, setShowCustomDegreeInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [institutionRedisToken, setInstitutionRedisToken] = useState("");
  const [customDegrees, setCustomDegrees] = useState([]);

  const institutionTypeOptions = institutionTypes?.map((item) => ({
    value: item?._id,
    label: item?.name,
  }));

  const degreeOptions = [
    { value: "other", label: "Other (Add new)" },
    ...(degrees?.map((item) => ({
      value: item?._id,
      label: item?.name,
    })) || []),
  ];

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

  const getDegrees = () => {
    dispatch(institutionDegreePublic())
      .then((res) => {
        if (res) {
          setDegrees(res?.payload?.data?.list || []);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    dispatch(countries());
    getInstitutionTypes();
    getInstitutionsList();
    getDegrees();
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

  const handleAddressChange = (field, value) => {
    if (field === "country") {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
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
        address: {
          ...prev.address,
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
        address: {
          ...prev.address,
          city: {
            name: value?.label || "",
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    }
  };

  const handleDegreeChange = (selectedOptions) => {
    const otherOption = selectedOptions?.find(
      (option) => option.value === "other"
    );
    if (otherOption) {
      setShowCustomDegreeInput(true);
      const filteredOptions = selectedOptions.filter(
        (option) => option.value !== "other"
      );
      setFormData((prev) => ({
        ...prev,
        degree_ids: filteredOptions.map((option) => option.value),
      }));
    } else {
      setShowCustomDegreeInput(false);
      setFormData((prev) => ({
        ...prev,
        degree_ids: selectedOptions
          ? selectedOptions.map((option) => option.value)
          : [],
      }));
    }
  };

  const handleAddCustomDegree = (degreeName) => {
    setCustomDegrees((prev) => [
      ...prev,
      { value: degreeName, label: degreeName },
    ]);
    setFormData((prev) => ({
      ...prev,
      degree_ids: [...prev.degree_ids, degreeName],
    }));
  };

  const addCustomDegree = () => {
    if (customDegreeInput.trim()) {
      handleAddCustomDegree(customDegreeInput.trim());
      setCustomDegreeInput("");
      setShowCustomDegreeInput(false);
    }
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
    // if (!formData.username?.trim()) newErrors.username = "Username is required";
    if (!formData.name?.trim()) newErrors.name = "Institution name is required";
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

    // // Password validation
    // if (!formData.password?.trim())
    //   newErrors.password = "Password is required";
    // else if (formData.password.length < 8) {
    //   newErrors.password = "Password must be at least 8 characters";
    // }

    // if (!formData.confirmPassword?.trim()) {
    //   newErrors.confirmPassword = "Please confirm your password";
    // } else if (formData.password !== formData.confirmPassword) {
    //   newErrors.confirmPassword = "Passwords do not match";
    // }

    // Institution type validation
    if (!formData.institution_type_id) {
      newErrors.institution_type_id = "Institution type is required";
    }

    // Degree validation
    if (!formData.degree_ids || formData.degree_ids.length === 0) {
      newErrors.degree_ids = "At least one degree is required";
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
    const urlRegex = /^https?:\/\/.+/;
    if (formData.website_url && !urlRegex.test(formData.website_url)) {
      newErrors.website_url =
        "Please enter a valid URL starting with http:// or https://";
    }
    if (
      formData.linkedin_page_url &&
      !urlRegex.test(formData.linkedin_page_url)
    ) {
      newErrors.linkedin_page_url = "Please enter a valid LinkedIn URL";
    }
 console.log("validatoin error",newErrors)
    return newErrors;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
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
        institution_type_id: formData.institution_type_id,
        degree_ids: formData.degree_ids || [],
        country_code: formData.country_code,
        phone_no: formData.phone_no,
        address: formData.address,
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
        username: formData.name,
        // password: formData.password,
        // confirmPassword: formData.confirmPassword,
      };

      const res = await dispatch(createInstitution(createPayload)).unwrap();
      if (res?.error) {
        toast.error(res?.message || "Failed to create institution");
        return;
      }

      // if (res?.data?.redisToken) {
      //   setInstitutionRedisToken(res.data.redisToken);
      //   setShowOtpPopup(true);
      //   toast.success("Registration successful! Please verify your OTP.");
      // } else
      {
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

        dispatch(getInstitutionsList());
        toast.success(res?.message || "Institution created successfully");
        setFormData(initialFormData);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error?.message || "An error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDashboardPath = (mode) => {
    switch (mode) {
      case 1:
      case 2:
        return "/app/admin/dashboard";
      case 3:
      case 7:
        return "/app/companies/dashboard";
      case 4:
      case 8:
        return "/app/institute/dashboard";
      default:
        return "/app/admin/dashboard";
    }
  };

  const navigate = useNavigate();

  const handleVerifyOtp = async (otp) => {
    setIsVerifying(true);
    setVerificationError("");
    try {
      const payload = {
        token: institutionRedisToken,
        otp: otp,
      };
      const res = await dispatch(
        institutionsRegisterVerifyOtp(payload)
      ).unwrap();

      if (!res?.error) {
        setCookie("VERIFIED_ADMIN_TOKEN", JSON.stringify(res?.data?.token));
        setCookie("USER_ROLE", res?.data?.accessMode);
        setCookie("SIDE_BAR", res?.data?.accessMode);
        toast.success(res?.message || "Login successful");
        navigate(getDashboardPath(res?.data?.accessMode));
      } else {
        setVerificationError(res?.message || "Verification failed");
        return;
      }
      toast.success(res?.message || "Verification successful!");
      setShowOtpPopup(false);
      setFormData(initialFormData);
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationError(
        error?.message || "An error occurred during verification"
      );
    } finally {
      setIsVerifying(false);
    }
  };
  const handleBack = () => {
    navigate("/login-selection");
  };
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
  return (
    <>
      <div className="h-screen ">
        {/* <header className=" fixed top-0 w-full z-50 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0 flex items-center">
                <img
                  className="h-8 w-auto"
                  src="/Frame 1000004906.png"
                  alt="Logo"
                />
              </div>
              <div>
                <button
                  onClick={() => navigate('/institute/login')}
                  className="px-4 py-2 text-sm font-medium glassy-text-primary bg-blue-600 hover:bg-blue-700 transition-colors rounded"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </header> */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 ">
          <div className="glassy-card  overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <button
                onClick={handleBack}
                title="go back"
                className="text-sm px-3 py-1 glassy-card hover:glassy-card rounded glassy-text-primary transition-colors"
              >
                <TbArrowBack size={20} />
              </button>
              <h2 className="text-2xl font-bold glassy-text-primary">
                Register Your Institution
              </h2>
              <p className="mt-1 text-sm glassy-text-secondary">
                Fill in your institution details to create an account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
              {/* <div>
                <h3 className="text-lg font-medium glassy-text-primary mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomInput
                    label="Username *"
                    value={formData?.username}
                    name="username"
                    onChange={(e) => handleChange("username", e)}
                    placeholder="Enter username"
                    error={errors.username}
                  />
                  <CustomInput
                    label="Email *"
                    value={formData?.email}
                    name="email"
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
                    placeholder="Enter password"
                    error={errors?.password}
                  />
                  <PasswordInput
                    label="Confirm Password *"
                    value={formData?.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e)}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    error={errors?.confirmPassword}
                  />
                </div> 
              </div> */}

              <div>
                <h3 className="text-lg font-medium glassy-text-primary mb-4">
                  Basic Institution Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomInput
                    label="Institution Name *"
                    value={formData?.name}
                    name="name"
                    onChange={(e) => handleChange("name", e)}
                    placeholder="Enter institution name"
                    error={errors.name}
                  />

                  <CustomInput
                    label="Display Name *"
                    value={formData?.display_name}
                    name="display_name"
                    onChange={(e) => handleChange("display_name", e)}
                    placeholder="Enter display name"
                    error={errors.display_name}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FilterSelect
                    label="Country Code"
                    options={countriesList || []}
                    selectedOption={countriesList?.find(
                      (opt) =>
                        opt.short_name === formData?.country_code?.short_name
                    )}
                    onChange={(country) =>
                      handleCountryChange("country_code", country)
                    }
                  />
                  <CustomInput
                    label="Phone Number *"
                    value={formData?.phone_no}
                    name="phone_no"
                    onChange={(e) => handleChange("phone_no", e)}
                    placeholder="Enter phone number"
                    error={errors?.phone_no}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <CustomInput
                    label="Email *"
                    value={formData?.email}
                    name="email"
                    onChange={(e) => handleChange("email", e)}
                    placeholder="Enter email"
                    error={errors.email}
                  />
                </div>
                <div className="mt-4">
                  <CustomInput
                    type="textarea"
                    label="Description"
                    value={formData?.description}
                    name="description"
                    onChange={(e) => handleChange("description", e)}
                    placeholder="Enter institution description"
                    rows={3}
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium glassy-text-primary mb-4">
                  Institution Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    />
                    {errors.institution_type_id && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.institution_type_id}
                      </p>
                    )}
                  </div>

                  <div>
                    <FilterSelectAdd
                      isMulti
                      label="Degrees Offered *"
                      options={degreeOptions || []}
                      selectedOption={[
                        ...(degreeOptions.filter((opt) =>
                          formData?.degree_ids?.includes(opt.value)
                        ) || []),
                        ...customDegrees.filter((degree) =>
                          formData?.degree_ids?.includes(degree.value)
                        ),
                      ]}
                      onChange={handleDegreeChange}
                      enableCustomInput={true}
                      onAddCustomOption={handleAddCustomDegree}
                    />
                    {errors.degree_ids && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.degree_ids}
                      </p>
                    )}

                    {showCustomDegreeInput && (
                      <div className="mt-2 flex gap-2">
                        <CustomInput
                          value={customDegreeInput}
                          onChange={(e) => setCustomDegreeInput(e.target.value)}
                          placeholder="Enter degree name"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={addCustomDegree}
                          className="mt-1"
                        >
                          Add
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <CustomInput
                    label="Website URL"
                    value={formData?.website_url}
                    name="website_url"
                    onChange={(e) => handleChange("website_url", e)}
                    placeholder="https://example.com"
                    error={errors.website_url}
                  />

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
                    label="Institute Logo"
                    name="logo_url"
                    onChange={handleImageUpload}
                    onDelete={removeImage}
                    error={errors.logo_url}
                    loading={loading}
                    value={logoUrl}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <CustomInput
                    label="Logo URL"
                    value={formData?.logo_url}
                    name="logo_url"
                    onChange={(e) => handleChange("logo_url", e)}
                    placeholder="https://example.com/Frame 1000004906.png"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium glassy-text-primary mb-4">
                  Address
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <CustomInput
                    label="Address Line 1"
                    value={formData?.address?.address_line_1}
                    onChange={(e) =>
                      handleAddressChange("address_line_1", e.target.value)
                    }
                    placeholder="Enter address line 1"
                  />

                  <CustomInput
                    label="Address Line 2"
                    value={formData?.address?.address_line_2}
                    onChange={(e) =>
                      handleAddressChange("address_line_2", e.target.value)
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
                        formData?.address?.country?.short_name
                    )}
                    onChange={(country) =>
                      handleAddressChange("country", country)
                    }
                    placeholder="Select Country"
                  />

                  <FilterSelect
                    label="State"
                    options={stateList}
                    selectedOption={stateList?.find(
                      (opt) => opt.state_code === formData?.address?.state?.code
                    )}
                    onChange={(state) => handleAddressChange("state", state)}
                    placeholder="Select State"
                    isDisabled={!formData?.address?.country?.short_name}
                  />

                  <FilterSelect
                    label="City"
                    options={cityList}
                    selectedOption={cityList?.find(
                      (opt) => opt.name === formData?.address?.city?.name
                    )}
                    onChange={(city) => handleAddressChange("city", city)}
                    placeholder="Select City"
                    isDisabled={!formData?.address?.state?.code}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <CustomInput
                    label="Pin Code"
                    value={formData?.address?.pin_code}
                    onChange={(e) =>
                      handleAddressChange("pin_code", e.target.value)
                    }
                    placeholder="Enter pin code"
                  />
                </div>
              </div>

              {/* Specialties */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium glassy-text-primary">
                    Specialties
                  </h3>
                  <Button
                    type="button"
                    variant=""
                    size="sm"
                    className="glassy-button"
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
                        variant=""
                        size="sm"
                        icon={<PiX />}
                        onClick={() => removeSpecialty(index)}
                        className="glassy-button text-red-500 hover:text-red-700 mt-1"
                        disabled={formData.specialties.length <= 1}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full  py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Register Institution"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <OTPVerificationPopup
        isOpen={showOtpPopup}
        onClose={() => setShowOtpPopup(false)}
        onVerify={handleVerifyOtp}
        isLoading={isVerifying}
        error={verificationError}
      />
    </>
  );
};

export default RegisterInstitute;
