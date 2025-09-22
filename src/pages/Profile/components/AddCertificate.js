import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal/Modal';
import CustomInput from '../../../components/ui/Input/CustomInput';
import CustomDateInput from '../../../components/ui/Input/CustomDateInput';
import FilterSelect from '../../../components/ui/Input/FilterSelect';
import EnhancedFileInput from '../../../components/ui/Input/CustomFileAndImage';

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
  loading
}) => {
  const [uploadType, setUploadType] = useState('link');

  const getSelectedSkills = (ids) => {
    return masterSkillsList?.filter((skill) => ids?.includes(skill.value)) || masterSkillsList[0].value;
  };

  return (
    <Modal
      isOpen={modalState.type === 'certifications'}
      onClose={handleClose}
      title="Additional Certifications"
      handleSubmit={handleSubmit}
      loading={loading}
    >
      <div className="p-3 space-y-4">
        {/* Certificate Name */}
        <CustomInput
          label="Certificate Name"
          value={formData?.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter certificate name"
          className="w-full h-10"
          error={error?.name}
          required
        />

        {/* Issuing Organization */}
        <CustomInput
          label="Issuing Organization"
          value={formData?.issuing_organization}
          onChange={(e) => handleChange('issuing_organization', e.target.value)}
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
            value={formData?.issue_date}
            onChange={(e) => handleChange('issue_date', e.target.value)}
            placeholder="MM/YYYY"
            className="w-full h-10"
            error={error?.issue_date}
            required
          />

          <CustomInput
            label="Credential ID"
            placeholder="Enter credential ID (min length 5)"
            value={formData?.credential_id}
            onChange={(e) => handleChange('credential_id', e.target.value)}
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
            console.log(inputValue, field)
            setAddModalState({
              isOpen: true,
              type: 'masterSkill',
              field: field
            });
            setInputFields(prev => ({ ...prev, name: inputValue }))

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
              checked={uploadType === 'link'}
              onChange={() => setUploadType('link')}
              className="w-4 h-4"
            />
            Certification Link
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="uploadType"
              value="media"
              checked={uploadType === 'media'}
              onChange={() => setUploadType('media')}
              className="w-4 h-4"
            />
            Certification Media
          </label>
        </div>

        {uploadType === 'link' && (
          <CustomInput
            label="Credential URL"
            value={formData?.credential_url}
            onChange={(e) => handleChange('credential_url', e.target.value)}
            placeholder="Enter credential URL (e.g. https://example.com)"
            className="w-full h-10"
            error={error?.credential_url}
            required
          />
        )}

        {uploadType === 'media' && (
          <EnhancedFileInput
            label="Upload Certificate Media/PDF"
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
