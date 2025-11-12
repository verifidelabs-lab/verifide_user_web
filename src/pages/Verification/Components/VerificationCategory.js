import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Button from "../../../components/ui/Button/Button";
import CustomInput from "../../../components/ui/Input/CustomInput";
import FilterSelect from "../../../components/ui/Input/FilterSelect";
import FileUpload from "../../../components/ui/Image/ImageUploadWithSelect";
import NoDataFound from "../../../components/ui/No Data/NoDataFound";
import { BiChevronRight } from "react-icons/bi";
import { FaGraduationCap, FaUpload } from "react-icons/fa";
import { PiGraduationCapThin } from "react-icons/pi";
import { IoChevronDownOutline } from "react-icons/io5";
import {
  verificationCenterDocumentDetails,
  verifyRequest,
} from "../../../redux/Verification/Verification";
import { instituteCollegeList } from "../../../redux/education/educationSlice";
import { adminUsersDetails } from "../../../redux/Users/userSlice";
import {
  arrayTransform,
  convertTimestampToDate,
  getDuration,
  uploadImageDirectly,
  uploadPdfDirectly,
} from "../../../components/utils/globalFunction";
import Modal from "../../../components/ui/Modal/Modal";
import { generateHtmlPreview } from "../../../components/utils/globalFunction";
import { GoHistory } from "react-icons/go";

const DOCUMENT_MODELS = {
  education: "educations",
  identity: "identity-verifications",
  skills: null,
  experience: "work-experience",
  certificate: "additional-certifications",
  project: "projects",
};

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];
const MAX_FILE_SIZE = 5;

const VerificationCategory = ({ profileData }) => {
  const dispatch = useDispatch();
  // const selector = useSelector(state => state);
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const type = searchParams.get("type");
  const [apiRes, setApiRes] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemId2, setSelectedItemId2] = useState(null);
  const [activeOption, setActiveOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [institutionForm, setInstitutionForm] = useState({
    institute_id: "",
    name: "",
    email: "",
  });
  const [mailData, setMailData] = useState({});

  const [formData, setFormData] = useState({
    image_url: "",
    image_url2: "",
  });
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);

  const toggleHistory = (id) => {
    setExpandedHistoryId(expandedHistoryId === id ? null : id);
  };

  const allInstituteList = [
    { value: "", label: "Select verifier" },
    ...arrayTransform(userData),
  ];

  const fetchDataByTab = useCallback(async () => {
    if (!type || !tab) return;

    try {
      const res = await dispatch(
        verificationCenterDocumentDetails({
          moduleType: type,
          tab: tab,
        })
      ).unwrap();

      const data =
        res?.data?.education ||
        res?.data?.experience ||
        res?.data?.certificate ||
        res?.data?.project ||
        [];

      setApiRes(data);
    } catch (error) {
      toast.error(error?.message || "Failed to fetch data");
      console.error("Fetch error:", error);
    }
  }, [dispatch, type, tab]);

  const fetchInstituteData = useCallback(
    async (institutionId) => {
      if (!institutionId) return;

      try {
        const res = await dispatch(
          adminUsersDetails({
            organization_id: institutionId,
          })
        ).unwrap();
        setUserData(res?.data || []);
      } catch (error) {
        toast.error(error?.message || "Failed to fetch institute data");
        console.error("Institute fetch error:", error);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchDataByTab();
    dispatch(instituteCollegeList());
  }, [fetchDataByTab, dispatch]);

  const handleVerifyNow = useCallback((itemId) => {
    setSelectedItemId((prev) => (prev === itemId ? null : itemId));
    setActiveOption(null);
    // toggleHistory(null);
  }, []);

  const handleOptionClick = useCallback(
    async (option, itemId, item) => {
      const newOption =
        activeOption === option && selectedItemId2 === itemId ? null : option;
      setActiveOption(newOption);
      setSelectedItemId2(itemId);

      // console.log("option, itemId, item", item?.company_id)

      if (
        newOption === "institution" ||
        item?.institution_id ||
        item?.company_id
      ) {
        await fetchInstituteData(item.institution_id || item?.company_id);
      }
    },
    [activeOption, selectedItemId2, fetchInstituteData]
  );

  const handleSelectChange = useCallback((field, value) => {
    const values = value?.value || "";
    setInstitutionForm((prev) => ({
      ...prev,
      [field]: values,
    }));
  }, []);

  const handleInputChange = useCallback((field, value) => {
    const values = value || "";
    setInstitutionForm((prev) => ({
      ...prev,
      [field]: values,
    }));
  }, []);

  const handleFileUpload = useCallback(async (uploadType, file) => {
    if (!file) return;

    setLoading(true);

    try {
      const action =
        file.type === "application/pdf"
          ? uploadPdfDirectly
          : uploadImageDirectly;
      const result = await action(file, "VERIFICATION_MEDIA");

      if (!result?.data?.imageURL) {
        throw new Error("Upload failed - No image URL returned");
      }

      const fieldName = uploadType === "institute" ? "image_url" : "image_url2";
      setFormData((prev) => ({
        ...prev,
        [fieldName]: result.data.imageURL,
      }));

      toast.success(result?.message || "Image uploaded successfully");
    } catch (error) {
      console.error("File upload error:", error);
      toast.error(error?.message || "Failed to upload image");
    } finally {
      setLoading(false);
    }
  }, []);

  const resetForms = useCallback(() => {
    setActiveOption(null);
    setSelectedItemId(null);
    setInstitutionForm({
      institute_id: "",
      name: "",
      email: "",
    });
    setFormData({
      image_url: "",
      image_url2: "",
    });
  }, []);

  const handleSubmit = useCallback(
    async (e, data) => {
      e.preventDefault();

      const apiPayload = {
        type: DOCUMENT_MODELS[type],
        document_id: data?._id,
        attach_file: [formData.image_url2],
        verification_type: "none",
      };

      setLoading(true);

      try {
        const res = await dispatch(verifyRequest(apiPayload)).unwrap();
        toast.success(res?.message || "Request submitted successfully");
        await fetchDataByTab();
        resetForms();
      } catch (error) {
        toast.error(error?.message || "Request failed or already submitted");
      } finally {
        setLoading(false);
      }
    },
    [dispatch, formData.image_url2, type, fetchDataByTab, resetForms]
  );

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleInstitutionSubmit = useCallback(
    async (e, data) => {
      e.preventDefault();

      if (!formData.image_url) {
        toast.error("Please upload a document");
        return;
      }

      if (institutionForm.institute_id === "") {
        if (!institutionForm.name || !institutionForm.email) {
          toast.error("Please fill in verifier name and email");
          return;
        }
        if (!emailRegex.test(institutionForm.email)) {
          toast.error("Please enter a valid email address");
          return;
        }
      }

      const payload =
        institutionForm.institute_id === ""
          ? {
              type: DOCUMENT_MODELS[type],
              document_id: data?._id,
              attach_file: [formData.image_url],
              verification_type: "third-person",
              third_person_name: institutionForm.name,
              third_person_email: institutionForm.email,
            }
          : {
              assigned_to: institutionForm.institute_id,
              verification_type: "assigned",
              type: DOCUMENT_MODELS[type],
              document_id: data?._id,
              attach_file: [formData.image_url],
            };

      setLoading(true);

      try {
        const res = await dispatch(verifyRequest(payload)).unwrap();
        toast.success(
          res?.message || "Institution verification submitted successfully"
        );
        await fetchDataByTab();
        resetForms();
      } catch (error) {
        toast.error(error?.message || "Request failed or already submitted");
      } finally {
        setLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [
      dispatch,
      formData.image_url,
      institutionForm,
      type,
      fetchDataByTab,
      resetForms,
    ]
  );

  const formattedTab = (tab) => {
    if (tab === "needVerification") {
      return "Need Verification";
    } else if (tab === "pendingRequest") {
      return "Pending Request";
    } else if (tab === "verified") {
      return "Verified";
    } else if (tab === "categories") {
      return "Categories";
    } else {
      return tab; // fallback agar koi match na ho
    }
  };

  const renderStatusBadge = (status) => {
    const statusClasses = {
      // requested: "bg-[#EAF1FF] text-blue-500",
      requested: "glassy-card text-blue-500",
      rejected: "glassy-card text-red-500",
      pending: "glassy-card text-blue-500",
      approved: "glassy-card text-green-600",
    };

    return (
      <span
        className={`text-sm px-2 py-1 rounded-full border capitalize ${
          statusClasses[status] || statusClasses.pending
        }`}
      >
        {status === "pending"
          ? "UnVerified"
          : status === "approved"
          ? "Verified"
          : status}
      </span>
    );
  };

  const handlePreview = (data) => {
    setMailData(data);
    if (mailData) {
      setIsPreview(true);
    }
  };

  const renderInstitutionForm = (item) => (
    <form
      onSubmit={(e) => handleInstitutionSubmit(e, item)}
      className="p-4 space-y-4 glassy-card rounded-lg"
    >
      <FilterSelect
        options={allInstituteList}
        selectedOption={allInstituteList.find(
          (opt) => opt.value === institutionForm.institute_id
        )}
        onChange={(select) => handleSelectChange("institute_id", select)}
        label="Select Verified"
      />

      {institutionForm.institute_id === "" && (
        <>
          <div className="text-center">
            <strong>or</strong>
          </div>
          <CustomInput
            label="Verifier Name"
            value={institutionForm.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter Name"
            className="w-full h-10"
          />
          <CustomInput
            label="Verifier Email"
            value={institutionForm.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter Email"
            className="w-full h-10"
          />
        </>
      )}

      <FileUpload
        onFileUpload={(file) => handleFileUpload("institute", file)}
        isUploading={loading}
        file={formData.image_url}
        setFile={(uploadedFile) =>
          setFormData((prev) => ({ ...prev, image_url: uploadedFile }))
        }
        inputId="institution-verification-upload"
        allowedTypes={ALLOWED_FILE_TYPES}
        maxSize={MAX_FILE_SIZE}
      />

      <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-2 space-y-2 sm:space-y-0 w-full mt-4">
        {/* Cancel Button */}
        <Button
          variant="primary"
          type="button"
          onClick={() => setActiveOption(null)}
          className="glassy-button hover:scale-105 transition-transform duration-200 w-full sm:w-auto"
        >
          Cancel
        </Button>

        {/* Preview Button */}
        <Button
          variant="warning"
          type="button"
          onClick={() => handlePreview(item)}
          disabled={
            !institutionForm?.email &&
            !institutionForm?.name &&
            !formData?.image_url
          }
          className="w-full sm:w-auto"
        >
          Preview
        </Button>

        {/* Submit Button */}
        <Button
          type="submit"
          loading={loading}
          className="glassy-button hover:scale-105 transition-transform duration-200 w-full sm:w-auto"
        >
          Submit Request
        </Button>
      </div>
    </form>
  );

  const renderDocumentForm = (item) => (
    <form
      onSubmit={(e) => handleSubmit(e, item)}
      className="p-4 space-y-4 glassy-card rounded-lg"
    >
      <div className="items-end py-2">
        <FileUpload
          onFileUpload={(file) => handleFileUpload("document", file)}
          isUploading={loading}
          file={formData.image_url2}
          setFile={(uploadedFile) =>
            setFormData((prev) => ({ ...prev, image_url2: uploadedFile }))
          }
          inputId="document-verification-upload"
          allowedTypes={ALLOWED_FILE_TYPES}
          maxSize={MAX_FILE_SIZE}
        />
      </div>

      {tab !== "pendingRequest" && (
        <div className="flex justify-end space-x-2">
          <Button
            variant="primary"
            type="button"
            onClick={() => setActiveOption(null)}
            className="glassy-button hover:scale-105 transition-transform duration-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="glassy-button hover:scale-105 transition-transform duration-200"
          >
            Submit
          </Button>
        </div>
      )}
    </form>
  );

  return (
    <div className="min-h-screen    p-4">
      <div className="w-full mx-auto">
        <nav className="flex items-center py-4 text-sm">
          <span className="glassy-text-secondary hover:glassy-text-primary">
            Home
          </span>
          <BiChevronRight className="w-4 h-4 glassy-text-secondary mx-2" />
          <span
            className="glassy-text-secondary hover:glassy-text-primary"
            onClick={() => window.history.back()}
          >
            {formattedTab(tab)}
          </span>
          <BiChevronRight className="w-4 h-4 glassy-text-secondary mx-2" />
          <span className="text-blue-600 font-medium">
            {type
              ? `${type.charAt(0).toUpperCase() + type.slice(1)} Verification`
              : "Verification"}
          </span>
        </nav>
      </div>

      <div className="w-full px-3 sm:px-5 lg:px-8 p-3 sm:p-4 glassy-card rounded-lg">
        {/* Header */}
        <div className="flex items-center mb-6 sm:mb-8">
          <FaGraduationCap className="w-5 h-5 sm:w-6 sm:h-6 glassy-text-secondary mr-2 sm:mr-3" />
          <h1 className="text-xl sm:text-2xl font-semibold glassy-text-primary capitalize">
            {type || "Verification"}
          </h1>
        </div>

        <ul className="space-y-4 sm:space-y-6">
          {apiRes && apiRes.length > 0 ? (
            apiRes.map((item) => (
              <li
                key={item._id || item.id}
                className="border border-[#00000030]/20 rounded-xl overflow-hidden"
              >
                {/* Main Card */}
                <div className="glassy-card rounded-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-lg">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6">
                    {/* Left Side */}
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg md:text-xl font-medium glassy-text-primary mb-2 flex items-center gap-3 flex-wrap">
                        {item.degree || item.companyName || item.name}
                        {item?.verificationHistory?.length > 0 && (
                          <button
                            onClick={() => toggleHistory(item._id)}
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-md border border-green-400 flex justify-center items-center hover:glassy-card transition-colors"
                            aria-label="View verification history"
                          >
                            <GoHistory className="text-green-700" size={14} />
                          </button>
                        )}
                      </h3>

                      <div className="flex flex-wrap items-center text-xs sm:text-sm glassy-text-secondary gap-2 sm:gap-4">
                        <span>
                          {item.institution ||
                            item.profileName ||
                            item.issuing_organization ||
                            item?.description}
                        </span>

                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {item?.issue_date
                            ? convertTimestampToDate(item.issue_date)
                            : getDuration(item?.start_date, item?.end_date)}
                        </span>
                      </div>
                    </div>

                    {/* Right Side */}
                    {item.is_verified ? (
                      <div className="flex justify-end w-full md:w-auto">
                        {renderStatusBadge(item?.status)}
                      </div>
                    ) : (
                      <div className="flex flex-col md:items-end gap-2 md:gap-3 w-full md:w-auto">
                        <div className="flex justify-end w-full">
                          {renderStatusBadge(item.status)}
                        </div>

                        {item.status === "rejected" &&
                          item?.rejection_reason && (
                            <div className="text-xs sm:text-sm text-red-600 glassy-card border border-red-300 p-2 rounded-lg max-w-full sm:max-w-lg">
                              <strong>Rejection Reason:</strong>{" "}
                              {item.rejection_reason}
                            </div>
                          )}

                        {(item?.status === "rejected" ||
                          item?.status === "pending") &&
                          tab !== "pendingRequest" && (
                            <Button
                              className="glassy-button w-auto self-end md:self-end px-4 py-1.5 text-sm"
                              onClick={() => handleVerifyNow(item._id)}
                            >
                              {selectedItemId === item._id
                                ? "Back"
                                : "Verify Now"}
                            </Button>
                          )}
                      </div>
                    )}
                  </div>
                </div>

                {/* ---------- Verification History ---------- */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    expandedHistoryId === item._id
                      ? "max-h-[2000px]"
                      : "max-h-0"
                  }`}
                >
                  <div className="space-y-3 sm:space-y-4 my-3 sm:my-4 p-3 sm:p-4">
                    {item?.verificationHistory?.map((history) => (
                      <div
                        key={history._id}
                        className="glassy-card p-3 sm:p-4 transition-all duration-300 hover:shadow-lg"
                      >
                        {/* Header */}
                        <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              history.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : history.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {history.status.charAt(0).toUpperCase() +
                              history.status.slice(1)}
                          </span>
                          {history.verified_at && (
                            <span className="text-xs sm:text-sm glassy-text-secondary">
                              Verified on:{" "}
                              {convertTimestampToDate(history.verified_at)}
                            </span>
                          )}
                        </div>

                        {/* Verification Source */}
                        <div className="text-xs sm:text-sm glassy-text-secondary mb-2">
                          <span className="font-semibold glassy-text-primary">
                            Verification Source:
                          </span>{" "}
                          {history.is_verified_by_third_person ? (
                            <p>
                              Third-party verifier -{" "}
                              <span className="font-medium">
                                {history.third_person_name}
                              </span>{" "}
                              ({history.third_person_email})
                            </p>
                          ) : (
                            <p>Self-verified by {history.relation_to.name}</p>
                          )}
                        </div>

                        {/* Rejection Reason */}
                        {history.rejection_reason && (
                          <div className="mt-3 p-2 bg-red-50 border-l-4 border-red-400 text-red-700 rounded">
                            <p className="text-xs sm:text-sm font-semibold">
                              Rejection Reason:
                            </p>
                            <p className="text-xs sm:text-sm">
                              {history.rejection_reason}
                            </p>
                          </div>
                        )}

                        {/* Attachments */}
                        {history.attach_file?.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold glassy-text-primary mb-2">
                              Attachments:
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                              {history.attach_file.map((file, idx) => {
                                const isImage =
                                  /\.(jpeg|jpg|png|gif|webp)$/i.test(file);
                                const isPDF = /\.pdf$/i.test(file);
                                return (
                                  <a
                                    key={idx}
                                    href={file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glassy-card border rounded-lg overflow-hidden hover:shadow-md transition"
                                  >
                                    {isImage ? (
                                      <img
                                        src={file}
                                        alt={`Attachment ${idx + 1}`}
                                        className="w-full h-24 sm:h-28 object-cover"
                                      />
                                    ) : isPDF ? (
                                      <div className="flex flex-col items-center justify-center p-3 h-24 sm:h-28 text-center">
                                        <svg
                                          className="w-8 h-8 text-red-500"
                                          fill="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                        </svg>
                                        <p className="mt-1 text-xs glassy-text-secondary truncate">
                                          PDF Document
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col items-center justify-center p-3 h-24 sm:h-28 text-center">
                                        <svg
                                          className="w-8 h-8 glassy-text-secondary"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                          />
                                        </svg>
                                        <p className="mt-1 text-xs glassy-text-secondary truncate">
                                          Attachment
                                        </p>
                                      </div>
                                    )}
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ---------- Verification Options (Institution / Document Upload) ---------- */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    selectedItemId === item._id ? "max-h-[1000px]" : "max-h-0"
                  }`}
                >
                  <div className="space-y-3 sm:space-y-4 my-3 sm:my-4 p-3 sm:p-4">
                    {/* Institution Verification */}
                    {(item?.company_id || item?.institution_id) && (
                      <div className="glassy-card border border-blue-200 rounded-lg">
                        <div
                          className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 cursor-pointer transition-colors rounded-lg"
                          onClick={() =>
                            handleOptionClick("institution", item._id, item)
                          }
                        >
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex justify-center items-center glassy-card">
                              <PiGraduationCapThin className="glassy-text-primary text-lg sm:text-xl" />
                            </span>
                            <div>
                              <p className="glassy-text-primary text-base sm:text-lg font-semibold">
                                Verification by{" "}
                                {item?.company_id ? "Company" : "Institute"}
                              </p>
                              <p className="glassy-text-secondary text-xs sm:text-sm font-normal">
                                Request verification from authorized institution
                              </p>
                            </div>
                          </div>
                          <IoChevronDownOutline
                            className={`transition-transform duration-300 ${
                              activeOption === "institution" &&
                              selectedItemId2 === item._id
                                ? "transform rotate-180"
                                : ""
                            }`}
                          />
                        </div>
                        <div
                          className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            activeOption === "institution" &&
                            selectedItemId2 === item._id
                              ? "max-h-screen overflow-y-auto"
                              : "max-h-0"
                          }`}
                        >
                          {renderInstitutionForm(item)}
                        </div>
                      </div>
                    )}

                    {/* Document Upload */}
                    <div className="glassy-card border border-blue-200 rounded-lg">
                      <div
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 cursor-pointer transition-colors rounded-lg"
                        onClick={() => handleOptionClick("document", item._id)}
                      >
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex justify-center items-center glassy-card">
                            <FaUpload className="glassy-text-primary text-lg sm:text-xl" />
                          </span>
                          <div>
                            <p className="glassy-text-primary text-base sm:text-lg font-semibold">
                              Verification by Document Upload
                            </p>
                            <p className="glassy-text-secondary text-xs sm:text-sm font-normal">
                              Upload certificates, diplomas, or other documents
                              as proof
                            </p>
                          </div>
                        </div>
                        <IoChevronDownOutline
                          className={`transition-transform duration-300 ${
                            activeOption === "document" &&
                            selectedItemId2 === item._id
                              ? "transform rotate-180"
                              : ""
                          }`}
                        />
                      </div>
                      <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                          activeOption === "document" &&
                          selectedItemId2 === item._id
                            ? "max-h-[600px]"
                            : "max-h-0"
                        }`}
                      >
                        {renderDocumentForm(item)}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <NoDataFound />
          )}
        </ul>
      </div>

      <Modal
        isOpen={isPreview}
        title={`Preview the mail`}
        onClose={() => {
          setIsPreview(false);
          setMailData({});
        }}
        isActionButton={false}
      >
        <div
          style={{ width: "100%", height: "80vh", overflowY: "auto" }}
          dangerouslySetInnerHTML={{
            __html: generateHtmlPreview(mailData, profileData, institutionForm),
          }}
        />
      </Modal>
    </div>
  );
};

export default VerificationCategory;
