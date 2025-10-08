import React, { useEffect, useRef, useState } from 'react'
import Modal from '../../../components/ui/Modal/Modal'
import CustomInput from '../../../components/ui/Input/CustomInput'
import CustomDateInput from '../../../components/ui/Input/CustomDateInput'
import FilterSelect from '../../../components/ui/Input/FilterSelect'
import { SkillsCard } from '../../../components/ui/cards/Card'
import { toast } from 'sonner'
// import { useEducationFormHandlers } from '../../../components/hooks/useEducationHandler'

const AddExperience = ({ formData, allCompanies, handleSubmit, getSelectedOption, handleSelectChange, formErrors, modalState, isLoading, allIndustry,
  allProfile, handleClose, allWorkSkill, handleChange, error, setFormData, allSkills, isSkillSelected, handleSkillClick, selectedSkills, setAddModalState,
  setInputFields, isCreatedByUserForIndustry, isCreatedByUserFor, skillForProfileRoleId, loading }) => {




  const getSelectedSkills = () => {
    if (!formData?.skills_acquired || !allWorkSkill) return [];
    return formData.skills_acquired.map(skill => {
      const id = typeof skill === 'object' ? skill._id : skill;
      return allWorkSkill.find(opt => opt.value === id);
    }).filter(Boolean);
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

    company_id: useRef(null),

  };

  // scroll to first error field
  useEffect(() => {
    if (error && Object.keys(error).length > 0) {
      const firstErrorKey = Object.keys(error)[0];
      if (inputRefs[firstErrorKey]?.current) {
        inputRefs[firstErrorKey].current.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
        inputRefs[firstErrorKey].current.focus?.();
      }
    }
  }, [error]);
  return (
    <div>
      <Modal isOpen={modalState.type === "experience"} onClose={handleClose} title={modalState.type} handleSubmit={handleSubmit} loading={loading}>
        <div className='p-3 space-y-3'>
          <FilterSelect
            ref={inputRefs.company_id}
            label="Company "
            name="company_id"
            placeholder="Select Company"
            options={allCompanies}
            selectedOption={getSelectedOption(allCompanies, formData?.company_id)}
            onChange={(selected) => handleSelectChange("company_id", selected)}
            error={error.company_id}
            className="w-full h-10"
            disabled={!formData?.company_id}
            required
            onCreateOption={(inputValue, field) => {
              setAddModalState({
                isOpen: true,
                type: 'companies',
                field: field
              });
              setInputFields(prev => ({ ...prev, name: inputValue }))

            }}
            isClearable={true}
            isCreatedByUser={true}
          />
          <div className='grid md:grid-cols-2 grid-cols-1 gap-2'>

            <FilterSelect

              ref={inputRefs.industries_id}

              label="Industry "
              name="industries_id"
              placeholder="Select Industry"
              options={allIndustry}
              selectedOption={getSelectedOption(allIndustry, formData?.industries_id)}
              onChange={(selected) => handleSelectChange("industries_id", selected)}
              error={error.industries_id}
              className="w-full h-10"
              required
              onCreateOption={(inputValue, field) => {
                setAddModalState({
                  isOpen: true,
                  type: 'industries',
                  field: field
                });
                setInputFields(prev => ({ ...prev, name: inputValue }))

              }}
              isClearable={true}
              isDisabled={!formData?.company_id}
              disabledTooltip='Please select first Company'
              isCreatedByUser={true}
            />

            <FilterSelect
              label="Position "



              name="profile_role_id"
              placeholder="Select Position"
              options={allProfile}
              selectedOption={getSelectedOption(allProfile, formData?.profile_role_id)}
              onChange={(selected) => handleSelectChange("profile_role_id", selected)}
              error={error.profile_role_id}
              className="w-full h-10"
              required
              // disabled={!formData.industry_id || isLoading}
              onCreateOption={(inputValue, field) => {
                setAddModalState({
                  isOpen: true,
                  type: 'profile-roles',
                  field: field
                });
                setInputFields(prev => ({ ...prev, name: inputValue }))

              }}
              isClearable={true}
              isDisabled={!formData?.industries_id}
              disabledTooltip='Please select first Industry'
              isCreatedByUser={isCreatedByUserFor ? true : false}

            />

            <CustomDateInput
              label="Start Date"
              name="start_date"
              type="date"
              value={formData?.start_date}
              onChange={(e) => handleChange("start_date", e.target.value)}
              error={error?.start_date}
              autoComplete="off"
              className="w-full h-10"
              allowFutureDate={false}
              required
            />

            <CustomDateInput
              label="End Date"
              name="end_date"
              type="date"
              value={formData?.end_date}
              onChange={(e) => {
                const endDate = e.target.value;
                if (validateDates(formData?.start_date, endDate)) {
                  handleChange("end_date", endDate);
                } else {
                  handleChange("end_date", "");
                }
              }}
              error={error?.end_date}
              autoComplete="off"
              className="w-full h-10"
              min={formData?.start_date}
              disabled={formData?.currently_available}

            />
          </div>
          <CustomInput type={`checkbox`}
            label='i am currently Working'
            value={formData?.currently_available}
            name="currently_available"
            onChange={(e) => {
              setFormData({
                ...formData,
                currently_available: e.target.checked
              });
              if (e.target.checked) {
                setFormData((prev) => ({ ...prev, end_date: "" }))
              }
            }}
          />
          <CustomInput type="textarea" label="Description" className="w-full" placeholder="Enter description (min length:0 max-length:200)"
            value={formData?.description} error={error?.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          <p className='text-end text-[14px] font-normal'>Maximum 200 character </p>



          <FilterSelect
            label='Skills Acquired'
            options={allWorkSkill || []}
            selectedOption={getSelectedSkills()}
            onChange={(selected) => handleSelectChange("skills_acquired", selected)}
            isMulti={true}
            error={error?.skills_acquired}
            placeholder="Select or search skills"
            onCreateOption={(inputValue, field) => {
              setAddModalState({
                isOpen: true,
                type: 'skill',
                field: field
              });
              setInputFields(prev => ({ ...prev, name: inputValue }))

            }}
            isClearable={true}
            required
            isCreatedByUser={skillForProfileRoleId ? true : false}

          />
          {allSkills.length > 0 && (
            <div className='max-w-lg overflow-hidden'>
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
  )
}

export default AddExperience