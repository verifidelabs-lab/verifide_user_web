import React from 'react'
import FilterSelect from '../../../components/ui/Input/FilterSelect';
import { BiX } from 'react-icons/bi';

const StepSecond = ({ handleSelectChange, allProfileRoles, allSkills, formData, errors, setAddModalState, handleInputChange, selectedSkills, removeSkill, handleSkillSelect, isCreatableIndustry,
    setInputField
}) => {
    return (
        <div>
            <div className="space-y-6">
                <FilterSelect
                    label="Job Title"
                    className="w-full h-10"
                    placeholder="e.g. Frontend Developer (React.js)"
                    onChange={(selected) => handleSelectChange('job_title', selected)}
                    selectedOption={allProfileRoles.find(opt => opt.value === formData?.job_title)}
                    options={allProfileRoles || []}
                    required
                    error={errors?.job_title}
                    onCreateOption={(inputValue, field) => {
                        setAddModalState({
                            isOpen: true,
                            type: 'Profile Role',
                            field: field
                        });
                        setInputField((prev) => ({ ...prev, name: inputValue }))

                    }}
                    isClearable={true}
                    isCreatedByUser={isCreatableIndustry ? true : false}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Description <span className='text-red-500'>*</span>
                    </label>
                    <textarea
                        value={formData.job_description}
                        onChange={(e) => handleInputChange('job_description', e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Describe the job role and what you're looking for in a candidate..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Tell people about this position and what you're looking for. For example, what they'll be doing on a typical day, why they should be interested, and requirements you may have.
                    </p>

                    <p className='text-xs text-red-600'>{errors?.job_description}</p>
                </div>

                <div>

                    <FilterSelect
                        label="Skills Required "
                        options={allSkills || []}
                        className="w-full h-10"
                        placeholder="Select skills"
                        onChange={handleSkillSelect}
                        required
                        error={errors?.required_skills}
                        onCreateOption={(inputValue, field) => {
                            setAddModalState({
                                isOpen: true,
                                type: 'skill',
                                field: field
                            });
                            setInputField((prev) => ({ ...prev, name: inputValue }))
                        }}
                        isClearable={true}
                        isCreatedByUser={isCreatableIndustry ? true : false}

                    />
                    <div className="flex flex-wrap gap-2 mt-3">
                        {selectedSkills.map((skill, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                            >
                                {skill.label}
                                <button
                                    onClick={() => removeSkill(skill.value)}
                                    className="ml-2 hover:text-blue-600"
                                >
                                    <BiX className="h-4 w-4" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StepSecond