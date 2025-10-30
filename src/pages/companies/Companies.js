/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PiPlus, PiSpinner, PiWarning, PiX } from "react-icons/pi";
import { toast } from "sonner";

// Components




import {
  companiesAddOnsData,
  createCompanies,
  deleteCompanies,
  getCompaniesDetails,
  getCompaniesList,
  updateCompanies,
  updatePasswordCompanies,
  verifyCompanies,
} from "../../redux/CompanySlices/companiesSlice";
import { cities, countries, state } from "../../redux/Global Slice/cscSlice";
import { industriesDocuments } from "../../redux/Industry Slice/industrySlice";
import { CiCircleCheck } from "react-icons/ci";
import moment from "moment";
import CustomInput from "../../components/ui/InputAdmin/CustomInput";
import FilterSelect from "../../components/ui/InputAdmin/FilterSelect";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/InputAdmin/Input";
import AlertModal from "../../components/ui/Modal/AlertModal";
import Modal from "../../components/ui/Modal/Modal";
import PasswordInput from "../../components/ui/InputAdmin/PasswordInput";
import useFormHandler from "../../components/hooks/useFormHandler";
import { arrayTransform } from "../../components/utils/globalFunction";
import ActionButtons from "../../components/ui/table/TableAction";
import Loader from "../Loader/Loader";
import selectJson from "../../components/utils/selectJson.json";
import Table from "../../components/ui/table/Table";
import CustomToggle from "../../components/ui/Toggle/CustomToggle";

const PAGE_SIZE = 10;

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

const entryTypeOptions = [
  { value: "Master Entries", label: "Master Entries" },
  { value: "User Entries", label: "User Entries" },
];

const Companies = () => {
  const dispatch = useDispatch();
  const {
    getCompaniesListData: { data: companiesData } = {},
    getCompaniesDetailsData: { data: companyDetails } = {},
  } = useSelector((state) => state.companies);

  const cscSelector = useSelector((state) => state.global);
  const industrySelector = useSelector((state) => state.industry);
  const [isOpen, setIsOpen] = useState(false);
  const [entryType, setEntryType] = useState(entryTypeOptions[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStatusModal, setIsStatusModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isViewModal, setIsViewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalData, setModalData] = useState({
    type: "",
    data: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const { formData, handleChange, setFormData, errors, setErrors, resetForm } =
    useFormHandler(initialFormData);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const countriesList = arrayTransform(
    cscSelector?.countriesData?.data?.data || []
  );
  const stateList = arrayTransform(cscSelector?.stateData?.data?.data || []);
  const cityList = arrayTransform(cscSelector?.citiesData?.data?.data || []);
  const industryList = arrayTransform(
    industrySelector?.industriesDocumentsData?.data?.data?.list || []
  );
  const fetchCompaniesList = useCallback(
    async (page = 1) => {
      const apiPayload = {
        page,
        size: PAGE_SIZE,
        populate: "industry|name",
        select:
          "name display_name email industry phone_no company_size company_type is_verified createdAt logo_url created_by_users ",
        searchFields: "name",
        keyWord: searchTerm,
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
    [dispatch, searchTerm, entryType.value]
  );

  const fetchCompanyDetails = useCallback(
    async (companyId) => {
      try {
        setIsLoading(true);
        const apiPayload = {
          _id: companyId,
        };
        await dispatch(getCompaniesDetails(apiPayload)).unwrap();
      } catch (error) {
        toast.error("Failed to fetch company details");
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchCompaniesList(currentPage);
    dispatch(countries());
    dispatch(industriesDocuments());
  }, [currentPage, dispatch, fetchCompaniesList, entryType.value, searchTerm]);

  useEffect(() => {
    if (
      companyDetails &&
      (modalData.type === "edit" || modalData.type === "addFromUser")
    ) {
      const details = companyDetails?.data;
      const cleanDetails = {
        name: details.name,
        display_name: details.display_name,
        description: details.description,
        website_url: details.website_url,
        logo_url: details.logo_url,
        banner_image_url: details.banner_image_url,
        industry: Array.isArray(details.industry)
          ? details.industry.map((ind) => ind._id || ind)
          : [],
        country_code: details.country_code,
        phone_no: details.phone_no,
        company_size: details.company_size,
        company_type: details.company_type,
        headquarters: details.headquarters,
        founded_year: details.founded_year
          ? new Date(details.founded_year * 1000).getFullYear()
          : "",
        specialties: details.specialties?.length ? details.specialties : [""],
        employee_count: details.employee_count,
        linkedin_page_url: details.linkedin_page_url,
        email: details.email,
      };

      if (modalData.type === "addFromUser") {
        setModalData((prev) => ({
          ...prev,
          isPasswordVisible: !details?.password,
        }));
        cleanDetails.username = details?.username;
      }

      setFormData(cleanDetails);

      if (details.headquarters?.country?.short_name) {
        dispatch(
          state({ country_code: details.headquarters.country.short_name })
        );

        if (details.headquarters?.state?.code) {
          dispatch(
            cities({
              country_code: details.headquarters.country.short_name,
              state_code: details.headquarters.state.code,
            })
          );
        }
      }
    }
  }, [companyDetails, modalData.type, setFormData, dispatch]);

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    if (!passwordForm.password.trim()) {
      newErrors.password = "New password is required";
    } else if (passwordForm.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (passwordForm.password !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handlePasswordSubmit = useCallback(async () => {
    const validationErrors = validatePasswordForm();
    if (Object.keys(validationErrors).length > 0) {
      setPasswordErrors(validationErrors);
      toast.error("Please fix the validation errors");
      return;
    }
    try {
      setIsSubmitting(true);
      const payload = {
        _id: modalData?.data?._id,
        password: passwordForm.password.trim(),
        confirmPassword: passwordForm.confirmPassword.trim(),
      };
      const res = await dispatch(updatePasswordCompanies(payload)).unwrap();
      toast.success(res?.message || "Password updated successfully");
      setIsPasswordModalOpen(false);
      setPasswordForm({
        password: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
    } catch (error) {
      toast.error("An error occurred while updating password");
    } finally {
      setIsSubmitting(false);
    }
  }, [passwordForm, modalData.data, dispatch]);

  const tableRows = useMemo(() => {
    return (
      companiesData?.data?.list?.map((company, index) => [
        (currentPage - 1) * PAGE_SIZE + index + 1,
        company.name,
        entryType.value === "Master Entries" ? company.display_name : "",
        entryType.value === "Master Entries" ? company.phone_no : "",
        entryType.value === "Master Entries"
          ? Array.isArray(company?.industry)
            ? company?.industry?.map((e) => e?.name).join(", ")
            : ""
          : "",
        entryType.value === "Master Entries" ? (
          <CustomToggle
            key={company._id}
            isToggle={company.is_verified}
            handleClick={() => handleStatusChange(company)}
          />
        ) : (
          ""
        ),
        moment(company.createdAt).format("DD/MM/YYYY"),
        entryType.value === "Master Entries" ? (
          <div className="flex gap-2" key={`actions-${company._id}`}>
            <ActionButtons
              onEdit={() => handleEdit(company._id)}
              onDelete={() => handleDelete(company._id)}
              onView={() => handleView(company._id)}
              showUpdatePasswordButton={true}
              onUpdatePassword={() => {
                setModalData({
                  type: "edit",
                  data: company,
                });
                setIsPasswordModalOpen(true);
              }}
            />
          </div>
        ) : (
          <div className="flex gap-2" key={`actions-${company._id}`}>
            <button
              onClick={() => handleAddFromUser(company)}
              className="p-2 text-sm bg-blue-500 glassy-text-primary rounded hover:bg-blue-600"
            >
              <CiCircleCheck size={18} />
            </button>
          </div>
        ),
      ]) || []
    );
  }, [companiesData?.data?.list, currentPage, entryType.value]);

  // Modal handlers
  const handleOpenModal = () => {
    setModalData({ type: "add", data: null, isPasswordVisible: true });
    resetForm();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData({ type: "", data: null, isPasswordVisible: true });
    resetForm();
  };

  const handleEdit = (companyId) => {
    setModalData({ type: "edit", data: companyId, isPasswordVisible: false });
    fetchCompanyDetails(companyId);
    setIsModalOpen(true);
  };

  const handleDelete = (companyId) => {
    setModalData({ type: "delete", data: companyId });
    setIsDeleteModal(true);
  };

  const handleView = (companyId) => {
    setModalData({ type: "view", data: companyId });
    fetchCompanyDetails(companyId);
    setIsViewModal(true);
  };

  const handleStatusChange = (company) => {
    setModalData({ type: "status", data: company });
    setIsStatusModal(true);
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

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
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

    // Only validate password fields for new entries
    if (modalData?.isPasswordVisible) {
      if (!formData.password?.trim())
        newErrors.password = "Password is required";
      else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      if (!formData.confirmPassword?.trim()) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
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

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      const commonPayload = {
        name: formData.name,
        display_name: formData.display_name,
        description: formData.description,
        website_url: formData.website_url,
        logo_url: formData.logo_url,
        banner_image_url: formData.banner_image_url,
        industry: Array.isArray(formData.industry) ? formData.industry : [],
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
      };
      if (modalData.type === "edit") {
        const updatePayload = {
          ...commonPayload,
          _id: modalData.data,
        };
        const res = await dispatch(updateCompanies(updatePayload)).unwrap();
        toast.success(res?.message || "Company updated successfully");
      } else {
        const createPayload = {
          ...commonPayload,
          username: formData.username,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        };
        const res = await dispatch(createCompanies(createPayload)).unwrap();
        if (res?.error) {
          toast.error(res?.message || "Failed to create company");
          return;
        }
        toast.success(res?.message || "Company created successfully");
      }
      handleCloseModal();
      fetchCompaniesList(currentPage);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusConfirm = async () => {
    try {
      setIsLoading(true);
      await dispatch(
        verifyCompanies({ company_id: modalData.data._id })
      ).unwrap();
      toast.success("Company status updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update company status");
    } finally {
      setIsLoading(false);
      fetchCompaniesList(currentPage);
      setIsStatusModal(false);
      setModalData({ type: "", data: null });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsLoading(true);
      await dispatch(deleteCompanies({ _id: modalData.data })).unwrap();
      toast.success("Company deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete company");
    } finally {
      setIsLoading(false);
      fetchCompaniesList(currentPage);
      setIsDeleteModal(false);
      setModalData({ type: "", data: null });
    }
  };

  const handleSearch = () => {
    fetchCompaniesList(1, searchTerm);
  };

  const handleRemoveSearch = () => {
    setSearchTerm("");
    fetchCompaniesList(1);
  };

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const [updateUser, setUpdateUser] = useState(false);
  const handleAddFromUser = useCallback(
    (company) => {
      setModalData({
        type: "addFromUser",
        data: company._id,
      });
      fetchCompanyDetails(company._id);
      setIsModalOpen(true);
    },
    [fetchCompanyDetails]
  );

  const updateTheUserEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await dispatch(
        companiesAddOnsData({ _id: modalData.data?._id })
      ).unwrap();
      toast.success(res?.message);
      await fetchCompaniesList(currentPage, searchTerm);
    } catch (error) {
      toast.error(error || "delete industry");
    } finally {
      setIsLoading(false);
      setUpdateUser(false);
      setModalData({ type: "", data: null });
    }
  }, [modalData.data, dispatch, fetchCompaniesList, currentPage, searchTerm]);

  const handleAddFromUserSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      const errorMessages = Object.values(validationErrors)
        .filter((msg) => typeof msg === "string")
        .join(", ");

      toast.error(`Validation errors: ${errorMessages}`);
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        _id: modalData.data,
        name: formData.name,
        display_name: formData.display_name,
        description: formData.description,
        website_url: formData.website_url,
        logo_url: formData.logo_url,
        banner_image_url: formData.banner_image_url,
        industry: Array.isArray(formData.industry) ? formData.industry : [],
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
        specialties: formData.specialties
          .map((s) => String(s || ""))
          .filter((s) => s.trim() !== ""),
        employee_count: formData.employee_count
          ? Number(formData.employee_count)
          : null,
        linkedin_page_url: formData.linkedin_page_url,
        email: formData.email,
        username: formData.username,
        ...(modalData?.isPasswordVisible && {
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      };
      const res = await dispatch(companiesAddOnsData(payload)).unwrap();
      toast.success(res?.message || "Company promoted successfully");
      handleCloseModal();
      fetchCompaniesList(currentPage);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to promote company";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEntryTypeChange = (option) => {
    setEntryType(option);
    setIsOpen(false);
    setCurrentPage(1);
  };

  return (
    <>
      <Loader loading={isLoading} />
      <div className="p-3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold glassy-text-primary">Companies</h2>
          {entryType.value === "Master Entries" && (
            <Button
              icon={<PiPlus className="w-5 h-5" />}
              onClick={handleOpenModal}
            >
              Add Company
            </Button>
          )}
        </div>
        <Table
          tableHeadings={[
            "S No",
            "Name",
            entryType.value === "Master Entries" ? "Display Name" : "",
            entryType.value === "Master Entries" ? "Phone No" : "",
            entryType.value === "Master Entries" ? "Industry" : "",
            entryType.value === "Master Entries" ? "Is Verified" : "",
            "Created At",
            "Action",
          ]}
          data={tableRows}
          isLoading={isLoading}
          handleRemoveSearch={handleRemoveSearch}
          handleSearch={handleSearch}
          keyWord={searchTerm}
          setKeyword={setSearchTerm}
          totalItems={companiesData?.data?.total}
          size={PAGE_SIZE}
          pageNo={currentPage}
          onPageChange={onPageChange}
          totalData={companiesData?.data?.total || 0}
          setIsOpen={setIsOpen}
          entryType={entryType}
          isOpen={isOpen}
          entryTypeOptions={entryTypeOptions}
          handleEntryTypeChange={handleEntryTypeChange}
          showFilterDropdown={true}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          modalData.type === "addFromUser"
            ? "Promote User Company"
            : modalData.type === "edit"
              ? "Edit Company"
              : "Add New Company"
        }
      >
        <div className="w-full">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                label="Company Name *"
                value={formData?.name}
                name="name"
                onChange={(e) => handleChange("name", e)}
                placeholder="Enter company name"
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
            {modalData.type !== "edit" && (
              <CustomInput
                label="User Name *"
                value={formData?.username}
                name="username"
                onChange={(e) => handleChange("username", e)}
                placeholder="Enter username name"
                error={errors.username}
              />
            )}
            <CustomInput
              label="Email  *"
              value={formData?.email}
              name="email"
              onChange={(e) => handleChange("email", e)}
              placeholder="Enter email "
              error={errors.email}
            />
            {modalData?.isPasswordVisible && (
              <div className="grid grid-cols-2 gap-3">
                <PasswordInput
                  label={`Password`}
                  value={formData?.password}
                  onChange={(e) => handleChange("password", e)}
                  name={`password`}
                  placeholder="*******"
                  error={errors?.password}
                />
                <PasswordInput
                  label={`Confirm Password`}
                  value={formData?.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e)}
                  name={`confirmPassword`}
                  placeholder="*******"
                  error={errors?.confirmPassword}
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                label="Phone Number *"
                value={formData?.phone_no}
                name="phone_no"
                onChange={(e) => handleChange("phone_no", e)}
                placeholder="Enter phone number"
                error={errors?.phone_no}
              />

              <FilterSelect
                label="Country Code"
                options={countriesList || []}
                selectedOption={countriesList?.find(
                  (opt) => opt.short_name === formData?.country_code?.short_name
                )}
                onChange={(country) =>
                  handleCountryChange("country_code", country)
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
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

            <div className="grid grid-cols-1 gap-4">
              <CustomInput
                label="Logo URL"
                value={formData?.logo_url}
                name="logo_url"
                onChange={(e) => handleChange("logo_url", e)}
                placeholder="https://example.com/logo.png"
              />

              <CustomInput
                label="Banner Image URL"
                value={formData?.banner_image_url}
                name="banner_image_url"
                onChange={(e) => handleChange("banner_image_url", e)}
                placeholder="https://example.com/banner.jpg"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <FilterSelect
                  isMulti
                  label="Industry *"
                  options={industryList || []}
                  selectedOption={industryList.filter((opt) =>
                    formData?.industry?.includes(opt.value)
                  )}
                  onChange={(selected) =>
                    handleChange("industry", {
                      target: {
                        value: selected.map((item) => item.value),
                      },
                    })
                  }
                />
                {errors.industry && (
                  <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
                )}
              </div>

              <FilterSelect
                label="Company Type"
                options={selectJson?.company_type || []}
                selectedOption={selectJson?.company_type?.find(
                  (opt) => opt.value === formData?.company_type
                )}
                onChange={(selected) =>
                  handleChange("company_type", {
                    target: { value: selected?.value || "" },
                  })
                }
              />

              <FilterSelect
                options={selectJson?.Company_Sizes || []}
                label="Company Size"
                selectedOption={selectJson?.Company_Sizes?.find(
                  (opt) => opt.value === formData?.company_size
                )}
                name="company_size"
                onChange={handleCompanySizeChange}
                placeholder="e.g., 50-200 employees"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <CustomInput
              type="textarea"
              label="Description"
              value={formData?.description}
              name="description"
              onChange={(e) => handleChange("description", e)}
              placeholder="Enter company description"
              rows={3}
            />

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium glassy-text-primary mb-4">
                Headquarters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 gap-4 mt-4">
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
                  onChange={(state) => handleHeadquartersChange("state", state)}
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

            <div className=" pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium glassy-text-primary">
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

            <div className="flex justify-between gap-3 pt-4 ">
              <Button
                type="button"
                className="w-full"
                variant="secondary"
                onClick={handleCloseModal}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="w-full"
                onClick={
                  modalData.type === "addFromUser"
                    ? handleAddFromUserSubmit
                    : handleSubmit
                }
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {modalData.type === "addFromUser"
                  ? "Promote Company"
                  : modalData.type === "edit"
                    ? "Update Company"
                    : "Add Company"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <AlertModal
        isOpen={isStatusModal}
        title={`Are you sure you want to ${modalData.data?.is_verified ? "unverify" : "verify"
          } this company?`}
        onCancel={() => {
          setIsStatusModal(false);
          setModalData({ type: "", data: null });
        }}
        onConfirm={handleStatusConfirm}
      />

      <AlertModal
        isOpen={updateUser}
        title={
          <div className="flex items-center gap-2">
            <PiWarning className="text-red-500" />
            <span>Approved Company Suggestion</span>
          </div>
        }
        message="Are you sure you want to approved this Companies Suggestion? This action cannot be undone."
        onCancel={() => {
          setUpdateUser(false);
          setModalData({ type: "", data: null });
        }}
        onConfirm={updateTheUserEntries}
        confirmText="Update"
        cancelText="Cancel"
        type="danger"
      />

      <AlertModal
        isOpen={isDeleteModal}
        title="Are you sure you want to delete this company?"
        onCancel={() => {
          setUpdateUser(false);
          setModalData({ type: "", data: null });
        }}
        onConfirm={handleDeleteConfirm}
      />

      <Modal
        isOpen={isViewModal}
        onClose={() => {
          setIsViewModal(false);
          setModalData({ type: "", data: null });
        }}
        title="Company Details"
      >
        {companyDetails ? (
          <div className="space-y-4">
            <div className="w-full flex flex-col items-center space-y-2">
              <img
                src={companyDetails?.data?.logo_url}
                alt="Company Logo"
                className="h-44 object-contain border border-gray-50 rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://cdn.dribbble.com/userupload/31370234/file/original-6cee7974f9ba015f9d5d54c6bbe7fd1a.png?resize=1024x768&vertical=center";
                }}
              />
              {companyDetails?.data?.is_verified ? (
                <div className="flex items-center space-x-1 text-green-600">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm font-medium">Verified</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-red-600">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="text-sm font-medium">Not Verified</span>
                </div>
              )}
              <div className="text-center text-sm glassy-text-secondary space-y-1 mt-1">
                {companyDetails?.data?.verified_at && (
                  <p>
                    <span className="font-medium text-gray-700">
                      Verified At:
                    </span>{" "}
                    {new Date(companyDetails.data.verified_at).toLocaleString()}
                  </p>
                )}
                {companyDetails?.data?.username && (
                  <p>
                    <span className="font-medium text-gray-700">Username:</span>{" "}
                    {companyDetails.data.username}
                  </p>
                )}
                {companyDetails?.data?.email && (
                  <p>
                    <span className="font-medium text-gray-700">Email:</span>{" "}
                    {companyDetails.data.email}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium glassy-text-secondary">
                  Company Name
                </p>
                <p className="mt-1 text-sm glassy-text-primary">
                  {companyDetails?.data?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium glassy-text-secondary">
                  Display Name
                </p>
                <p className="mt-1 text-sm glassy-text-primary">
                  {companyDetails?.data?.display_name || "N/A"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium glassy-text-secondary">
                  Phone Number
                </p>
                <p className="mt-1 text-sm glassy-text-primary">
                  {companyDetails?.data?.country_code?.dial_code
                    ? `${companyDetails?.data?.country_code.dial_code} `
                    : ""}
                  {companyDetails?.data?.phone_no || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium glassy-text-secondary">
                  Company Type
                </p>
                <p className="mt-1 text-sm glassy-text-primary">
                  {companyDetails?.data?.company_type || "N/A"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium glassy-text-secondary">Description</p>
              <p className="mt-1 text-sm glassy-text-primary">
                {companyDetails?.data?.description || "N/A"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium glassy-text-secondary">Website</p>
                <p className="mt-1 text-sm glassy-text-primary line-clamp-2">
                  {companyDetails?.data?.website_url ? (
                    <a
                      href={companyDetails?.data?.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {companyDetails?.data?.website_url}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium glassy-text-secondary">LinkedIn</p>
                <p className="mt-1 text-sm glassy-text-primary line-clamp-2">
                  {companyDetails?.data?.linkedin_page_url ? (
                    <a
                      href={companyDetails?.data?.linkedin_page_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {companyDetails?.data?.linkedin_page_url}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium glassy-text-primary mb-4">
                Headquarters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium glassy-text-secondary">Address</p>
                  <p className="mt-1 text-sm glassy-text-primary">
                    {[
                      companyDetails?.data?.headquarters?.address_line_1,
                      companyDetails?.data?.headquarters?.address_line_2,
                      companyDetails?.data?.headquarters?.city?.name,
                      companyDetails?.data?.headquarters?.state?.name,
                      companyDetails?.data?.headquarters?.country?.name,
                      companyDetails?.data?.headquarters?.pin_code,
                    ]
                      .filter(Boolean)
                      .join(", ") || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium glassy-text-secondary">
                  Founded Year
                </p>
                <p className="mt-1 text-sm glassy-text-primary">
                  {companyDetails?.data?.founded_year || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium glassy-text-secondary">
                  Company Size
                </p>
                <p className="mt-1 text-sm glassy-text-primary">
                  {companyDetails?.data?.company_size || "N/A"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium glassy-text-secondary">Specialties</p>
              <p className="mt-1 text-sm glassy-text-primary">
                {companyDetails?.data?.specialties?.length
                  ? companyDetails.data.specialties.join(", ")
                  : "N/A"}
              </p>
            </div>
            <div className="grid grid-cols-2">
              <div>
                <p className="text-sm font-medium glassy-text-secondary">Employee</p>
                <p className="mt-1 text-sm glassy-text-primary">
                  {companyDetails?.data?.employee_count ?? "N/A"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading company details...</p>
        )}
      </Modal>
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Update Password"
        size="xl"
        className="max-w-2xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PasswordInput
                label={`Password`}
                value={passwordForm.password}
                name={`password`}
                onChange={(e) =>
                  handlePasswordChange("password", e.target.value)
                }
                placeholder="Enter new password"
                error={passwordErrors.password}
              />

              <PasswordInput
                label={`Confirm Password`}
                name={`confirmPassword`}
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  handlePasswordChange("confirmPassword", e.target.value)
                }
                placeholder="Confirm password"
                error={passwordErrors.confirmPassword}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsPasswordModalOpen(false)}
              disabled={isSubmitting}
              className="flex-1 py-3 transition-all duration-200 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handlePasswordSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 glassy-text-primary py-3 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <PiSpinner className="animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Companies;
