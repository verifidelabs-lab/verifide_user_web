import React, { useEffect, useRef, useState } from 'react'
import Modal from '../../../components/ui/Modal/Modal'
import CustomInput from '../../../components/ui/Input/CustomInput'
import CustomDateInput from '../../../components/ui/Input/CustomDateInput'
import FilterSelect from '../../../components/ui/Input/FilterSelect'
import EnhancedFileInput from '../../../components/ui/Input/CustomFileAndImage'
import { toast } from 'sonner'

const AddProject = ({
    formData,
    handleSubmit,
    handleChange,
    modalState,
    handleClose,
    error,
    collegeList,
    handleSelectChange,
    companyList,
    handleFileUpload,
    handleFileDelete,
    setAddModalState,
    loading,
    setInputFields
}) => {
    const [projectType, setProjectType] = useState(formData?.institution_id ? 'college' : formData?.company_id ? 'company' : 'personal');
    const [linkType, setLinkType] = useState(formData?.media_url ? 'media' : 'link');

    // console.log("formDataformData",formData)
    // refs for all inputs
    const inputRefs = {
        name: useRef(null),
        description: useRef(null),
        start_date: useRef(null),
        end_date: useRef(null),
        file_url: useRef(null),
        media_url: useRef(null),
        company_id: useRef(null),
        institution_id: useRef(null)
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

    const validateDates = (startDate, endDate) => {
        if (!startDate || !endDate) return true;

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end < start) {
            toast.error("End date cannot be before Start date!");
            return false;
        }
        if (end == start) {
            toast.error("End date cannot be same as  Start date!");
            return false;
        }
        return true;
    };

    const handleProjectTypeChange = (type) => {
        setProjectType(type);
        if (type !== 'college') handleChange("institution_id", "");
        if (type !== 'company') handleChange("company_id", "");
    };

    const handleLinkTypeChange = (type) => {
        setLinkType(type);

    };

    return (
        <div>
            <Modal
                isOpen={modalState.type === "projects"}
                onClose={handleClose}
                title="Add Project"
                handleSubmit={handleSubmit}
                loading={loading}
            >
                <div className='p-3 space-y-5'>
                    <CustomInput
                        ref={inputRefs.name}
                        label="Project Name"
                        value={formData?.name || ''}
                        onChange={(e) => handleChange("name", e.target.value)}
                        name='name'
                        placeholder="Enter project name"
                        className="w-full h-10"
                        required
                        error={error?.name}
                    />

                    <div className="space-y-3">
                        <p className="text-sm glassy-text-secondary font-medium">
                            Project Type
                            <span className='text-sky-500 ml-1 text-xs font-normal'>(Optional)</span>
                        </p>
                        <p className="text-xs glassy-text-secondary -mt-2">
                            Select whether this was a personal project or done for an organization
                        </p>

                        <div className="flex flex-wrap gap-4 items-center mt-2">
                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
                                <input
                                    type="radio"
                                    name="projectType"
                                    value="personal"
                                    checked={projectType === 'personal'}
                                    onChange={() => handleProjectTypeChange('personal')}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm">Personal</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
                                <input
                                    type="radio"
                                    name="projectType"
                                    value="company"
                                    checked={projectType === 'company'}
                                    onChange={() => handleProjectTypeChange('company')}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm">Company</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
                                <input
                                    type="radio"
                                    name="projectType"
                                    value="college"
                                    checked={projectType === 'college'}
                                    onChange={() => handleProjectTypeChange('college')}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm">College</span>
                            </label>
                        </div>
                    </div>

                    {projectType === 'company' && (
                        <FilterSelect
                            ref={inputRefs.company_id}
                            options={companyList || []}
                            selectedOption={companyList?.find(opt => opt.value === formData?.company_id)}
                            onChange={(selected) => handleSelectChange("company_id", selected)}
                            label='Company'
                            placeholder='Select Company'
                            onCreateOption={(inputValue, field) => {
                                setAddModalState({
                                    isOpen: true,
                                    type: 'companies',
                                    field: field
                                });
                                setInputFields(prev => ({ ...prev, name: inputValue }))
                            }}
                            isClearable={true}
                            error={error?.company_id}
                        />
                    )}

                    {projectType === 'college' && (
                        <FilterSelect
                            ref={inputRefs.institution_id}

                            options={collegeList || []}
                            selectedOption={collegeList?.find(opt => opt.value === formData?.institution_id)}
                            onChange={(selected) => handleSelectChange("institution_id", selected)}
                            label='College'
                            placeholder='Select College'
                            onCreateOption={(inputValue, field) => {
                                setAddModalState({
                                    isOpen: true,
                                    type: 'institutions',
                                    field: field
                                });
                                setInputFields(prev => ({ ...prev, name: inputValue }))
                            }}
                            isClearable={true}
                            error={error?.institution_id}
                        />
                    )}

                    <div className="space-y-2">
                        <CustomInput
                            ref={inputRefs.description}
                            type="textarea"
                            label="Project Description"
                            value={formData?.description || ''}
                            onChange={(e) => handleChange("description", e.target.value)}
                            placeholder="Briefly describe your project, key features, and your role"
                            className="w-full min-h-[80px]"
                            maxLength={200}
                            required
                            error={error?.description}
                        />
                        <p className='text-end text-sm glassy-text-secondary'>
                            {formData?.description?.length || 0}/200 characters
                        </p>
                    </div>

                    <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                        <CustomDateInput
                            ref={inputRefs.start_date}
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
                            ref={inputRefs.end_date}
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
                            allowFutureDate={false}
                        />
                    </div>

                    <div className="space-y-3">
                        <div>
                            <p className="text-sm glassy-text-secondary font-medium mb-2">
                                Project Link or Media
                            </p>
                            <div className="flex gap-5 items-center">
                                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
                                    <input

                                        type="radio"
                                        name="linkType"
                                        value="link"
                                        checked={linkType === "link"}
                                        onChange={() => handleLinkTypeChange("link")}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="text-sm">Project Link</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="linkType"
                                        value="media"
                                        checked={linkType === 'media'}
                                        onChange={() => handleLinkTypeChange('media')}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="text-sm">Project Media</span>
                                </label>
                            </div>
                        </div>

                        {linkType === 'link' ? (
                            <CustomInput
                                ref={inputRefs.file_url}
                                type="url"
                                label="Project URL"
                                value={formData?.file_url || ''}
                                onChange={(e) => handleChange("file_url", e.target.value)}
                                placeholder="e.g., https://github.com/username/project or https://demo.com"
                                className="w-full h-10 border rounded-md p-1"
                                required
                                error={error?.file_url}
                            />
                        ) : (
                            <EnhancedFileInput
                                ref={inputRefs.media_url}
                                label='Upload Project Media/PDF'
                                className="w-full h-10"
                                onChange={handleFileUpload}
                                onDelete={handleFileDelete}
                                value={formData?.media_url}
                                error={error?.media_url}
                                accept=".jpg,.jpeg,.png,.pdf"
                                maxSize={5}
                                supportedFormats="Images (JPEG, PNG) or PDF files"
                            />
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default AddProject;