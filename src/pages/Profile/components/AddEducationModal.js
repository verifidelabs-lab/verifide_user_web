import React, { useEffect, useRef } from "react";
import Modal from "../../../components/ui/Modal/Modal";
import CustomDateInput from "../../../components/ui/Input/CustomDateInput";
import FilterSelect from "../../../components/ui/Input/FilterSelect";
import CustomInput from "../../../components/ui/Input/CustomInput";
import { SkillsCard } from "../../../components/ui/cards/Card";
import { toast } from "sonner";

const AddEducationModal = ({
  formData,
  collegeList,
  modalState,
  handleClose,
  errors,
  handleSelectChange,
  degreeList,
  fieldsOfStudyList,
  handleChange,
  skillsList,
  loading,
  onClose,
  onSubmit,
  setFormData,
  allSkills,
  isSkillSelected,
  handleSkillClick,
  selectedSkills,
  setAddModalState,
  setInputFields,
  isCreatedByUser,
  isCreatedByUserForFields,
  isCreatedByUserForIndustry,
}) => {
  const getSelectedSkills = () => {
    if (!formData?.skills_acquired || !skillsList) return [];
    return formData.skills_acquired
      .map((skill) => {
        const id = typeof skill === "object" ? skill._id : skill;
        return skillsList.find((opt) => opt.value === id);
      })
      .filter(Boolean);
  };
  const validateDates = (startDate, endDate) => {
    if (!startDate || !endDate) return true;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      toast.error("End date cannot be before Start date!");
      return false;
    }
    return true;
  };
  const inputRefs = {
    institution_id: useRef(null),
    degree_id: useRef(null),
    field_of_studies: useRef(null),
    start_date: useRef(null),
    end_date: useRef(null),
    description: useRef(null),
    skills_acquired: useRef(null),
    institution_id: useRef(null),
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

  return (
    <div>
      <Modal
        isOpen={modalState.type === "education"}
        onClose={handleClose}
        title={modalState.type}
        handleClose={onClose}
        handleSubmit={onSubmit}
        loading={loading}
      >
        <div className="p-3 space-y-3 ">
          <FilterSelect
            label="College/ University Name"
            name="institution_id"
            ref={inputRefs.institution_id}
            placeholder="Select College/University"
            selectedOption={
              collegeList?.find(
                (opt) => opt.value === formData?.institution_id
              ) || null
            }
            options={collegeList || []}
            error={errors?.institution_id}
            onChange={(selected) =>
              handleSelectChange("institution_id", selected)
            }
            className="w-full h-10"
            onCreateOption={(inputValue, field) => {
              setAddModalState({
                isOpen: true,
                type: "college",
                field: field,
              });
              setInputFields((prev) => ({ ...prev, name: inputValue }));
            }}
            isClearable={true}
            required
            isCreatedByUser={true}
          />
          <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
            <FilterSelect
              label="Degree"
              name="degree_id"
              ref={inputRefs.degree_id}
              placeholder="Select Degree"
              options={degreeList || []}
              selectedOption={
                degreeList?.find((opt) => opt.value === formData?.degree_id) ||
                null
              }
              onChange={(selected) => handleSelectChange("degree_id", selected)}
              error={errors?.degree_id}
              className="w-full h-10"
              isDisabled={!formData.institution_id}
              onCreateOption={(inputValue, field) => {
                setAddModalState({
                  isOpen: true,
                  type: "degree",
                  field: field,
                });
                setInputFields((prev) => ({ ...prev, name: inputValue }));
              }}
              isClearable={true}
              isCreatedByUser={isCreatedByUser ? true : false}
              required
              disabledTooltip={`Please first select college`}
            />

            <FilterSelect
              label="Field of study"
              ref={inputRefs.field_of_studies}
              name="field_of_studies"
              options={fieldsOfStudyList || []}
              placeholder="Select Field of Study"
              selectedOption={
                fieldsOfStudyList?.find(
                  (opt) => opt.value === formData?.field_of_studies
                ) || null
              }
              onChange={(selected) =>
                handleSelectChange("field_of_studies", selected)
              }
              error={errors?.field_of_studies}
              className="w-full h-10"
              isDisabled={!formData.degree_id}
              onCreateOption={(inputValue, field) => {
                setAddModalState({
                  isOpen: true,
                  type: "field",
                  field: field,
                });
                setInputFields((prev) => ({ ...prev, name: inputValue }));
              }}
              isClearable={true}
              isCreatedByUser={isCreatedByUser ? true : false}
              required
              disabledTooltip={`Please first select degree`}
            />
          </div>

          <div className="flex md:flex-row flex-col justify-between place-items-center gap-4">
            <CustomDateInput
              label="Start Date"
              ref={inputRefs.start_date}
              name="start_date"
              type="date"
              value={formData?.start_date}
              onChange={(e) => handleChange("start_date", e.target.value)}
              error={errors?.start_date}
              autoComplete="off"
              className="w-full h-10"
              allowFutureDate={false}
              required
            />

            <CustomDateInput
              label="End Date"
              name="end_date"
              type="date"
              ref={inputRefs.end_date}
              value={formData?.end_date}
              onChange={(e) => {
                const endDate = e.target.value;
                if (validateDates(formData?.start_date, endDate)) {
                  handleChange("end_date", endDate);
                } else {
                  handleChange("end_date", ""); // reset invalid date
                }
              }}
              error={errors?.end_date}
              autoComplete="off"
              className="w-full h-10"
              min={formData?.start_date}
              disabled={formData?.currently_available}
              required
            />
          </div>

          <CustomInput
            type="checkbox"
            ref={inputRefs.checkbox}
            name="checkbox"
            value={formData?.currently_available}
            label="Currently Studying"
            onChange={(e) => {
              setFormData({
                ...formData,
                currently_available: e.target.checked,
              });
              if (e.target.checked) {
                setFormData((prev) => ({ ...prev, end_date: "" }));
              }
            }}
          />
          <div>
            <CustomInput
              type="textarea"
              required
              name="description"
              ref={inputRefs.description}
              label="Description"
              className="w-full"
              placeholder="Enter description (min length:0 max-length:200)"
              value={formData?.description}
              error={errors?.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
            <p className="text-end text-[14px] font-normal">
              Maximum 200 character{" "}
            </p>
          </div>

          <FilterSelect
            name="skills_acquired"
            ref={inputRefs.skills_acquired}
            label="Skills Acquired"
            options={skillsList || []}
            selectedOption={getSelectedSkills()}
            onChange={(selected) =>
              handleSelectChange("skills_acquired", selected)
            }
            isMulti={true}
            error={errors?.skills_acquired}
            placeholder="Select or search skills"
            onCreateOption={(inputValue, field) => {
              setAddModalState({
                isOpen: true,
                type: "skill",
                field: field,
              });
              setInputFields((prev) => ({ ...prev, name: inputValue }));
            }}
            isClearable={true}
            isCreatedByUser={isCreatedByUser ? true : false}
            // required
          />

          {allSkills.length > 0 && (
            <div className="max-w-lg overflow-hidden">
              <SkillsCard
                title="Suggested Skills"
                isSelected={isSkillSelected}
                handleSkillClick={handleSkillClick}
                selectedSkills={selectedSkills}
                skills={allSkills}
                limit={6}
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AddEducationModal;
