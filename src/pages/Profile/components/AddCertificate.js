import React, { useEffect, useRef, useState } from "react";
import Modal from "../../../components/ui/Modal/Modal";
import CustomInput from "../../../components/ui/Input/CustomInput";
import CustomDateInput from "../../../components/ui/Input/CustomDateInput";
import FilterSelect from "../../../components/ui/Input/FilterSelect";
import EnhancedFileInput from "../../../components/ui/Input/CustomFileAndImage";

const AddCertificate = ({
  formData,
  handleSubmit,
  setFormData,
  handleChange,
  error,
  modalState,
  handleClose,
  handleFileUpload,
  masterSkillsList,
  setError,
  handleFileDelete,
  setAddModalState,
  setInputFields,
  loading,
}) => {
  const [uploadType, setUploadType] = useState("link");

  const getSelectedSkills = (ids) => {
    return (
      masterSkillsList?.filter((skill) => ids?.includes(skill.value)) ||
      masterSkillsList[0].value
    );
  };
  const inputRefs = {
    name: useRef(null),
    issuing_organization: useRef(null),
    field_of_studies: useRef(null),
    issue_date: useRef(null),
    credential_id: useRef(null),
    skills_acquired: useRef(null),
    media_url: useRef(null),
     };

  // scroll to first error field
  useEffect(() => {
    if (error && Object.keys(error).length > 0) {
      const firstErrorKey = Object.keys(error)[0];
      if (inputRefs[firstErrorKey]?.current) {
        inputRefs[firstErrorKey].current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        inputRefs[firstErrorKey].current.focus?.();
      }
    }
  }, [error]);

  return (
    <Modal
      isOpen={modalState.type === "certifications"}
      onClose={handleClose}
      title="Additional Certifications"
      handleSubmit={handleSubmit}
      loading={loading}
    >
      <div className="p-3 space-y-4">
        {/* Certificate Name */}
        <CustomInput
          label="Certificate Name"
          name="name"
          ref={inputRefs.name}
          value={formData?.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter certificate name"
          className="w-full h-10"
          error={error?.name}
          required
        />

        {/* Issuing Organization */}
        <CustomInput
          label="Issuing Organization"
          value={formData?.issuing_organization}
          name="issuing_organization"
          ref={inputRefs.institution_id}
          onChange={(e) => handleChange("issuing_organization", e.target.value)}
          placeholder="Enter company/organization name"
          className="w-full h-10"
          error={error?.issuing_organization}
          required
        />

        {/* Date & Credential ID */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
          <CustomDateInput
            type="date"
            label="Issue Date"
            name="issue_date"
            ref={inputRefs.issue_date}
            value={formData?.issue_date}
            onChange={(e) => handleChange("issue_date", e.target.value)}
            placeholder="MM/YYYY"
            className="w-full h-10"
            allowFutureDate={false}
            error={error?.issue_date}
            required
          />

          <CustomInput
            label="Credential ID"
            placeholder="Enter credential ID (min length 5)"
            name="credential_id"
            ref={inputRefs.credential_id}
            value={formData?.credential_id}
            onChange={(e) => handleChange("credential_id", e.target.value)}
            className="w-full h-10"
            error={error?.credential_id}
            min={5}
            required
          />
        </div>

        {/* Skills Acquired */}
        <FilterSelect
          label="Skills Acquired"
          options={masterSkillsList || []}
          onChange={(selected) => {
            setFormData((prev) => ({
              ...prev,
              skills_acquired: selected?.map((e) => e.value),
            }));
            setError({});
          }}
          selectedOption={getSelectedSkills(formData?.skills_acquired)}
          isMulti
          error={error?.skills_acquired}
          onCreateOption={(inputValue, field) => {
            console.log(inputValue, field);
            setAddModalState({
              isOpen: true,
              type: "masterSkill",
              field: field,
            });
            setInputFields((prev) => ({ ...prev, name: inputValue }));
          }}
          isClearable={true}
          required
          isCreatedByUser={true}
        />

        {/* Upload Type */}
        <div className="flex gap-6 items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="uploadType"
              value="link"
              checked={uploadType === "link"}
              onChange={() => setUploadType("link")}
              className="w-4 h-4"
            />
            Certification Link
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="uploadType"
              value="media"
              checked={uploadType === "media"}
              onChange={() => setUploadType("media")}
              className="w-4 h-4"
            />
            Certification Media
          </label>
        </div>

        {uploadType === "link" && (
          <CustomInput
            label="Credential URL"
            value={formData?.credential_url}
            onChange={(e) => handleChange("credential_url", e.target.value)}
            placeholder="Enter credential URL (e.g. https://example.com)"
            className="w-full h-10"
            ref={inputRefs.credential_url}

            error={error?.credential_url}
            required
          />
        )}

        {uploadType === "media" && (
          <EnhancedFileInput
            label="Upload Certificate Media/PDF"
            name="media_url"
            ref={inputRefs.media_url}
            className="w-full"
            onChange={handleFileUpload}
            onDelete={handleFileDelete}
            value={formData?.media_url}
            error={error?.media_url}
            accept=".jpg,.jpeg,.png,.pdf"
            maxSize={5} // 5MB
            supportedFormats="Images (JPEG, PNG) or PDF files"
          />
        )}
      </div>
    </Modal>
  );
};

export default AddCertificate;
