/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PiPlus, PiSpinner, PiWarning, PiX } from "react-icons/pi";
import { toast } from "sonner";

import CustomInput from "../../components/ui/InputAdmin/CustomInput";
import FilterSelect from "../../components/ui/InputAdmin/FilterSelect";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/InputAdmin/Input";
 
import { arrayTransform } from "../../components/utils/globalFunction";

import {
  createInstitute,
  deleteInstitute,
  getInstituteDetails,
  getList,
  instituteAddOnsData,
  updateInstitute,
  updatePasswordInstitute,
  verifyInstitute,
} from "../../redux/CompanySlices/companiesSlice";
import { cities, countries, state } from "../../redux/Global Slice/cscSlice";
import { getAllInstituteType } from "../../redux/slices/instituteSlice";
import PasswordInput from "../../components/ui/InputAdmin/PasswordInput";
import { getAllDegreeList } from "../../redux/slices/degreeSlice";
import Loader from "../Loader/Loader";
import { CiCircleCheck } from "react-icons/ci";
import moment from "moment";
import AlertModal from "../../components/ui/Modal/AlertModal";
import Modal from "../../components/ui/Modal/Modal";
import Table from "../../components/ui/table/Table";
import CustomToggle from "../../components/ui/Toggle/CustomToggle";
import ActionButtons from "../../components/ui/table/TableAction";
import useFormHandler from "../../components/hooks/useFormHandler";

const PAGE_SIZE = 10;

const initialFormData = {
  name: "",
  display_name: "",
  description: "",
  website_url: "",
  logo_url: "",
  banner_image_url: "",
  institution_type_id: "",
  degree_ids: [""],
  country_code: {
    name: "",
    dial_code: "",
    short_name: "",
    emoji: "🇮",
  },
  phone_no: "",
  address: {
    address_line_1: "",
    address_line_2: "",
    country: {
      name: "",
      dial_code: "",
      short_name: "",
      emoji: "🇮",
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
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const entryTypeOptions = [
  { value: "Master Entries", label: "Master Entries" },
  { value: "User Entries", label: "User Entries" },
];
const Institution = () => {
  const dispatch = useDispatch();
  const {
    getListData: { data },
  } = useSelector((state) => state.companies);
  const cscSelector = useSelector((state) => state.countryStateCity);
  const instituteSelector = useSelector((state) => state.institute);
  const degreeSelector = useSelector((state) => state.degree);
  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStatusModal, setIsStatusModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isViewModal, setIsViewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewData, setViewDetails] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [entryType, setEntryType] = useState(entryTypeOptions[0]);
  const [modalData, setModalData] = useState({
    type: "",
    data: null,
  });
  const { formData, handleChange, setFormData, errors, setErrors, resetForm } =
    useFormHandler(initialFormData);
  const degreeList = arrayTransform(
    degreeSelector?.getAllDegreeListData?.data?.data?.list
  );
  // Data transformations
  const countriesList = arrayTransform(
    cscSelector?.countriesData?.data?.data || []
  );
  const stateList = arrayTransform(cscSelector?.stateData?.data?.data || []);
  const cityList = arrayTransform(cscSelector?.citiesData?.data?.data || []);
  const InstituteTypeList = arrayTransform(
    instituteSelector?.getAllInstituteTypeData?.data?.data?.list || []
  );
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const fetchCompaniesList = useCallback(
    async (page = 1) => {
      const apiPayload = {
        page,
        size: PAGE_SIZE,
        select:
          "name display_name phone_no company_size company_type is_verified updatedAt logo_ur created_by_users ",
        searchFields: "name",
        keyWord: searchTerm,
        query: JSON.stringify({
          created_by_users: entryType.value === "User Entries",
        }),
      };

      try {
        setIsLoading(true);
        await dispatch(getList(apiPayload));
      } catch (error) {
        toast.error("Failed to fetch companies list");
        console.error("Error fetching companies:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, searchTerm, entryType.value]
  );

  const fetchInstituteDetails = useCallback(
    async (InstituteId, modalType = null) => {
      try {
        setIsLoading(true);
        const apiPayload = {
          _id: InstituteId,
        };
        const res = await dispatch(getInstituteDetails(apiPayload)).unwrap();
        setFormData(res?.data);
        setViewDetails(res?.data);

        if (modalType && modalType === "addFromUser") {
          setModalData((prev) => ({
            ...prev,
            isPasswordVisible: !res?.data?.password,
          }));
        }
      } catch (error) {
        toast.error("Failed to fetch Institute details");
        console.error("Error fetching Institute details:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchCompaniesList(currentPage, searchTerm);
    dispatch(countries());
    dispatch(getAllInstituteType());
    dispatch(getAllDegreeList());
  }, [currentPage, dispatch, fetchCompaniesList, searchTerm, entryType.value]);

  const tableRows =
    data?.data?.list?.map((Institute, index) => [
      index + 1,
      Institute?.name,
      entryType.value === "Master Entries" ? Institute.display_name : "",
      entryType.value === "Master Entries" ? Institute.phone_no : "",
      entryType.value === "Master Entries" ? (
        <CustomToggle
          key={Institute._id}
          isToggle={Institute.is_verified}
          handleClick={() => handleStatusChange(Institute)}
        />
      ) : (
        ""
      ),
      moment(Institute.createdAt).format("DD/MM/YYYY"),
      entryType.value === "Master Entries" ? (
        <div className="flex gap-2" key={`actions-${Institute._id}`}>
          <ActionButtons
            onEdit={() => handleEdit(Institute._id)}
            onDelete={() => handleDelete(Institute._id)}
            onView={() => handleView(Institute._id)}
            showUpdatePasswordButton={true}
            onUpdatePassword={() => {
              setModalData({
                type: "edit",
                data: Institute,
              });
              setIsPasswordModalOpen(true);
            }}
          />
        </div>
      ) : (
        <div className="flex gap-2" key={`actions-${Institute._id}`}>
          <button
            onClick={() => handleAddFromUser(Institute)}
            className="p-2 text-sm glassy-card0 glassy-text-primary rounded hover:bg-blue-600"
          >
            <CiCircleCheck size={18} />
          </button>
        </div>
      ),
    ]) || [];

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

  const handleEdit = (InstituteId) => {
    setModalData({ type: "edit", data: InstituteId, isPasswordVisible: false });
    fetchInstituteDetails(InstituteId);
    setIsModalOpen(true);
  };

  const handleDelete = (InstituteId) => {
    setModalData({ type: "delete", data: InstituteId });
    setIsDeleteModal(true);
  };

  const handleView = (InstituteId) => {
    setModalData({ type: "view", data: InstituteId });
    fetchInstituteDetails(InstituteId);
    setIsViewModal(true);
  };

  const handleStatusChange = (Institute) => {
    setModalData({ type: "status", data: Institute });
    setIsStatusModal(true);
  };

  // Form field handlers
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

  // const addSpecialty = () => {
  //   const lastSpecialty = formData.specialties[formData.specialties.length - 1];
  //   if (String(lastSpecialty || "").trim() === "") {
  //     return;
  //   }

  //   setFormData(prev => ({
  //     ...prev,
  //     specialties: [...prev.specialties, ""]
  //   }));
  // };

  const addSpecialty = () => {
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
    console.log(field, value);
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

  const handleSelectChange = useCallback(
    (selectedOptions) => {
      const selectedIds = selectedOptions?.map((option) => option.value) || [];
      setFormData((prev) => ({ ...prev, degree_ids: selectedIds }));
    },
    [setFormData]
  );

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.name?.trim()) newErrors.name = "Institute name is required";
    if (!formData.display_name?.trim())
      newErrors.display_name = "Display name is required";
        if (!formData.username?.trim())
      newErrors.username = "user name is required";
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

    // Institution type validation
    if (!formData.institution_type_id) {
      newErrors.institution_type_id = "Institution type is required";
    }

    // Degree validation
    if (!formData.degree_ids?.length) {
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

    return newErrors;
  };
  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const errorMessages = Object.values(validationErrors)
        .flatMap((error) =>
          Array.isArray(error) ? error.filter(Boolean) : error
        )
        .filter(Boolean)
        .join(", ");
      toast.error(`Validation errors: ${errorMessages}`, { duration: 3000 });
      return;
    }
    setIsSubmitting(true);
    try {
      let payload = {
        ...formData,
        specialties: formData.specialties
          .map((s) => String(s || ""))
          .filter((s) => s.trim() !== ""),
        founded_year: formData.founded_year
          ? parseInt(formData?.founded_year)
          : null,
        employee_count: formData.employee_count
          ? parseInt(formData?.employee_count)
          : null,
        degree_ids: formData?.degree_ids,
        institution_type_id: formData?.institution_type_id,
      };
      if (modalData.type === "edit") {
        const {
          username,
          password,
          confirmPassword,
          is_verified,
          verified_at,
          action_path,
          created_by_users,
          user_ids,
          isDisable,
          isDeleted,
          updatedAt,
          date,
          month,
          year,
          createdAt,
          __v,
          ...rest
        } = payload;
        payload = {
          ...rest,
          _id: modalData.data,
        };
        await dispatch(updateInstitute(payload)).unwrap();
        toast.success("Institute updated successfully", { duration: 3000 });
      } else {
        await dispatch(createInstitute(payload)).unwrap();
        toast.success("Institute created successfully", { duration: 3000 });
      }
      handleCloseModal();
      fetchCompaniesList(currentPage);
    } catch (error) {
      if (error.errors) {
        const backendErrors = {};
        Object.keys(error.errors).forEach(key => {
          backendErrors[key] = error.errors[key].message || error.errors[key];
        });
        setErrors(backendErrors);
        toast.error("Please fix the validation errors");
      } else {
        toast.error(error.message || "Failed to submit Institute data", {
          duration: 3000,
        });
      }
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddFromUserSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const errorMessages = Object.values(validationErrors)
        .flatMap((error) =>
          Array.isArray(error) ? error.filter(Boolean) : error
        )
        .filter(Boolean)
        .join(", ");
      toast.error(`Validation errors: ${errorMessages}`, { duration: 3000 });
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
        institution_type_id: formData.institution_type_id,
        degree_ids: formData.degree_ids,
        country_code: formData.country_code,
        phone_no: formData.phone_no,
        address: formData.address,
        founded_year: formData.founded_year
          ? parseInt(formData.founded_year)
          : null,
        specialties: formData.specialties
          .map((s) => String(s || ""))
          .filter((s) => s.trim() !== ""),
        employee_count: formData.employee_count
          ? parseInt(formData.employee_count)
          : null,
        linkedin_page_url: formData.linkedin_page_url,
        email: formData.email,
        username: formData.username,
        ...(modalData?.isPasswordVisible && {
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      };
      const res = await dispatch(instituteAddOnsData(payload)).unwrap();
      toast.success(res?.message || "Institute promoted successfully", {
        duration: 3000,
      });
      handleCloseModal();
      fetchCompaniesList(currentPage);
    } catch (error) {
      toast.error(error, { duration: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };
  // Action confirmations
  const handleStatusConfirm = async () => {
    try {
      setIsLoading(true);
      await dispatch(
        verifyInstitute({ institution_id: modalData.data._id })
      ).unwrap();
      toast.success("Institute status updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update Institute status");
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
      await dispatch(deleteInstitute({ _id: modalData.data })).unwrap();
      toast.success("Institute deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete Institute");
    } finally {
      setIsLoading(false);
      fetchCompaniesList(currentPage);
      setIsDeleteModal(false);
      setModalData({ type: "", data: null });
    }
  };

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchInstituteDetails(newPage);
  };

  const handleRemoveSearch = () => {
    setSearchTerm("");
    fetchCompaniesList(currentPage);
  };

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
      const res = await dispatch(updatePasswordInstitute(payload)).unwrap();
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

  const [updateUser, setUpdateUser] = useState(false);
  const handleAddFromUser = useCallback(
    (institute) => {
      setModalData({
        type: "addFromUser",
        data: institute._id,
      });
      fetchInstituteDetails(institute._id, "addFromUser");
      setIsModalOpen(true);
    },
    [fetchInstituteDetails]
  );

  const updateTheUserEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await dispatch(
        instituteAddOnsData({ _id: modalData.data?._id })
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
          <h2 className="text-2xl font-semibold glassy-text-primary">Institute</h2>
          <Button icon={<PiPlus />} onClick={handleOpenModal}>
            Add Institute
          </Button>
        </div>
        <Table
          tableHeadings={[
            "S No",
            "Name",
            entryType.value === "Master Entries" ? "Display Name" : "",
            entryType.value === "Master Entries" ? "Phone No" : "",
            entryType.value === "Master Entries" ? "Is Verified" : "",
            "Updated At",
            "Action",
          ]}
          data={tableRows}
          isLoading={isLoading}
          totalItems={data?.data?.total}
          size={PAGE_SIZE}
          pageNo={currentPage}
          onPageChange={onPageChange}
          totalData={data?.data?.total || 0}
          keyWord={searchTerm}
          setKeyword={setSearchTerm}
          handleRemoveSearch={handleRemoveSearch}
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
          modalData.type === "edit" ? "Edit Institute" : "Add New Institute"
        }
        size="xl"
      >
        <div className="w-full">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                label="Institute Name"
                value={formData?.name}
                name="name"
                onChange={(e) => handleChange("name", e)}
                placeholder="Enter Institute name"
                error={errors.name}
                required
              />

              <CustomInput
                label="Display Name"
                value={formData?.display_name}
                name="display_name"
                onChange={(e) => handleChange("display_name", e)}
                placeholder="Enter display name"
                error={errors.display_name}
                required
              />
            </div>
            {modalData.type !== "edit" && (
              <CustomInput
                label="User Name"
                value={formData?.username}
                name="username"
                onChange={(e) => handleChange("userName", e)}
                placeholder="Enter username "
                error={errors.username}
                required
              />
            )}

            <CustomInput
              label="Email"
              value={formData?.email}
              name="email"
              onChange={(e) => handleChange("email", e)}
              placeholder="Enter email "
              error={errors.email}
              required
            />
            {modalData?.isPasswordVisible && (
              <div className="grid grid-cols-2 gap-3">
                <PasswordInput
                  label="Password"
                  value={formData?.password}
                  name="password"
                  onChange={(e) => handleChange("password", e)}
                  error={errors?.password}
                  required
                />

                <PasswordInput
                  label="Confirm Password"
                  value={formData?.confirmPassword}
                  name="confirmPassword"
                  onChange={(e) => handleChange("confirmPassword", e)}
                  error={errors?.confirmPassword}
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <CustomInput
                label="Phone Number"
                value={formData?.phone_no}
                name="phone_no"
                onChange={(e) => handleChange("phone_no", e)}
                placeholder="Enter phone number"
                error={errors?.phone_no}
                required
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
                placeholder="https://linkedin.com/Institute/example"
                error={errors.linkedin_page_url}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <CustomInput
                label="Logo URL"
                value={formData?.logo_url}
                name="logo_url"
                onChange={(e) => handleChange("logo_url", e)}
                placeholder="https://example.com/Frame 1000004906.png"
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
                  label="Institute Type"
                  required={true}
                  options={InstituteTypeList || []}
                  selectedOption={InstituteTypeList?.find(
                    (opt) => opt.value === formData?.institution_type_id
                  )}
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      institution_type_id: selected?.value,
                    }))
                  }
                />
                {errors.institution_type_id && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.institution_type_id}
                  </p>
                )}
              </div>
              <div>
                <FilterSelect
                  label="Degree"
                  isMulti
                  required={true}
                  options={degreeList || []}
                  selectedOption={degreeList?.filter((option) =>
                    formData?.degree_ids?.includes(option.value)
                  )}
                  onChange={handleSelectChange}
                  error={errors.degree_ids}
                />
              </div>
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
                required
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
                required
              />
            </div>

            <CustomInput
              type="textarea"
              label="Description"
              value={formData?.description}
              name="description"
              onChange={(e) => handleChange("description", e)}
              placeholder="Enter Institute description"
              rows={3}
              required
            />

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium glassy-text-primary mb-4">
                Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInput
                  label="Address Line 1"
                  value={formData?.address?.address_line_1}
                  onChange={(e) =>
                    handleHeadquartersChange("address_line_1", e.target.value)
                  }
                  placeholder="Enter address line 1"
                  name="address_line_1"
                  required
                />

                <CustomInput
                  label="Address Line 2"
                  value={formData?.address?.address_line_2}
                  onChange={(e) =>
                    handleHeadquartersChange("address_line_2", e.target.value)
                  }
                  placeholder="Enter address line 2"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 mt-4">
                <FilterSelect
                  label="Country"
                  required={true}
                  options={countriesList}
                  selectedOption={countriesList?.find(
                    (opt) =>
                      opt.short_name === formData?.address?.country?.short_name
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
                    (opt) => opt.state_code === formData?.address?.state?.code
                  )}
                  onChange={(state) => handleHeadquartersChange("state", state)}
                  placeholder="Select State"
                  isDisabled={!formData?.address?.country?.short_name}
                  required
                />

                <FilterSelect
                  label="City"
                  options={cityList}
                  selectedOption={cityList?.find(
                    (opt) => opt.name === formData?.address?.city?.name
                  )}
                  onChange={(city) => handleHeadquartersChange("city", city)}
                  placeholder="Select City"
                  isDisabled={!formData?.address?.state?.code}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <CustomInput
                  label="Pin Code"
                  value={formData?.address?.pin_code}
                  onChange={(e) =>
                    handleHeadquartersChange("pin_code", e.target.value)
                  }
                  placeholder="Enter pin code"
                  required
                />
              </div>
            </div>

            <div className=" pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium glassy-text-primary flex items-center">
                  Specialties
                  <span className="text-red-500 text-sm ml-1">*</span>
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={<PiPlus />}
                  onClick={addSpecialty}
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
                    {formData.specialties.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        icon={<PiX />}
                        onClick={() => removeSpecialty(index)}
                        className="text-red-500 hover:text-red-700 mt-1"
                      />
                    )}
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
                    : modalData.type === "edit"
                      ? handleSubmit
                      : handleSubmit
                }
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {modalData.type === "addFromUser"
                  ? "Promote Institute"
                  : modalData.type === "edit"
                    ? "Update Institute"
                    : "Add Institute"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <AlertModal
        isOpen={isStatusModal}
        title={`Are you sure you want to ${modalData.data?.is_verified ? "unVerify" : "verify"
          } this institute?`}
        onCancel={() => {
          setIsStatusModal(false);
          setModalData({ type: "", data: null });
        }}
        onConfirm={handleStatusConfirm}
      />
      <AlertModal
        isOpen={isDeleteModal}
        title="Are you sure you want to delete this Institute?"
        onCancel={() => {
          setIsDeleteModal(false);
          setModalData({ type: "", data: null });
        }}
        onConfirm={handleDeleteConfirm}
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
      <Modal
        isOpen={isViewModal}
        onClose={() => {
          setIsViewModal(false);
          setModalData({ type: "", data: null });
        }}
        title="Institute Details"
        size="xl"
      >
        <div className="space-y-6">
          {viewData?.banner_image_url && (
            <img
              src={viewData?.banner_image_url}
              alt="Banner"
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://cdn.dribbble.com/userupload/31370234/file/original-6cee7974f9ba015f9d5d54c6bbe7fd1a.png?resize=1024x768&vertical=center";
              }}
            />
          )}

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {viewData?.logo_url && (
              <img
                src={viewData?.logo_url}
                alt="Logo"
                className="w-20 h-20 object-cover rounded-full border border-gray-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://cdn.dribbble.com/userupload/31370234/file/original-6cee7974f9ba015f9d5d54c6bbe7fd1a.png?resize=1024x768&vertical=center";
                }}
              />
            )}
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold glassy-text-primary">
                {viewData?.name}
              </h2>
              <p className="text-sm glassy-text-secondary">{viewData?.display_name}</p>

              {/* Verified Status */}
              {viewData?.is_verified ? (
                <div className="flex items-center justify-center sm:justify-start space-x-1 text-green-600 mt-1">
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
                <div className="flex items-center justify-center sm:justify-start space-x-1 text-red-600 mt-1">
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
            </div>
          </div>

          {/* Verified At, Email, Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm glassy-text-primary">
            {viewData?.verified_at && (
              <div>
                <span className="font-medium">Verified At:</span>{" "}
                {new Date(viewData?.verified_at).toLocaleString()}
              </div>
            )}
            {viewData?.email && (
              <div>
                <span className="font-medium">Email:</span> {viewData?.email}
              </div>
            )}
            {viewData?.username && (
              <div>
                <span className="font-medium">Username:</span>{" "}
                {viewData?.username}
              </div>
            )}
          </div>

          {/* Description */}
          {viewData?.description && (
            <p className="glassy-text-primary text-sm">{viewData?.description}</p>
          )}

          {/* Website & LinkedIn */}
          <div className="flex flex-wrap gap-4 text-sm text-blue-600">
            {viewData?.website_url && (
              <a
                href={viewData?.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                🌐 Website
              </a>
            )}
            {viewData?.linkedin_page_url && (
              <a
                href={viewData?.linkedin_page_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                🔗 LinkedIn
              </a>
            )}
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm glassy-text-primary">
            <div>
              <span className="font-medium">Email:</span>{" "}
              {viewData?.email || "N/A"}
            </div>
            <div>
              <span className="font-medium">Phone:</span>{" "}
              {viewData?.phone_no || "N/A"}
            </div>
          </div>

          {/* Address */}
          {viewData?.address && (
            <div className="text-sm glassy-text-primary space-y-1">
              <p className="font-medium">Address:</p>
              <p>
                {viewData?.address.address_line_1},{" "}
                {viewData?.address.address_line_2}
              </p>
              <p>
                {viewData?.address.city?.name}, {viewData?.address.state?.name},{" "}
                {viewData?.address.country?.name} - {viewData?.address.pin_code}
              </p>
            </div>
          )}

          {/* Country Info */}
          {viewData?.country_code && (
            <div className="text-sm glassy-text-primary">
              <span className="font-medium">Country:</span>{" "}
              {viewData?.country_code.emoji} {viewData?.country_code.name}
            </div>
          )}

          {/* Founded Year */}
          {viewData?.founded_year && (
            <div className="text-sm glassy-text-primary">
              <span className="font-medium">Founded:</span>{" "}
              {new Date(viewData?.founded_year).getFullYear()}
            </div>
          )}
          {viewData?.specialties?.length > 0 && (
            <div>
              <p className="font-medium text-sm glassy-text-primary">Specialties:</p>
              <ul className="list-disc list-inside text-sm glassy-text-secondary">
                {viewData.specialties.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
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
              className="flex-1 py-3 transition-all duration-200 hover:glassy-card"
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

export default Institution;
