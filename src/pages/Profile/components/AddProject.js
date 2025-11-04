import React, { useState, useEffect, useRef } from 'react';
import Modal from '../../../components/ui/Modal/Modal';
import CustomInput from '../../../components/ui/Input/CustomInput';
import CustomDateInput from '../../../components/ui/Input/CustomDateInput';
import FilterSelect from '../../../components/ui/Input/FilterSelect';
import EnhancedFileInput from '../../../components/ui/Input/CustomFileAndImage';
import { toast } from 'sonner';

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
    const [projectType, setProjectType] = useState('personal');
    const [linkType, setLinkType] = useState('link');

    // local state for smooth typing
    const [localInputs, setLocalInputs] = useState({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        file_url: ''
    });

    // ✅ refs to preserve input focus
    const nameRef = useRef(null);
    const descRef = useRef(null);
    const urlRef = useRef(null);
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    // initialize modal data only once
    useEffect(() => {
        if (modalState.type === 'projects') {
            setLocalInputs({
                name: formData?.name || '',
                description: formData?.description || '',
                start_date: formData?.start_date || '',
                end_date: formData?.end_date || '',
                file_url: formData?.file_url || ''
            });

            setProjectType(
                formData?.institution_id ? 'college' : formData?.company_id ? 'company' : 'personal'
            );
            setLinkType(formData?.media_url ? 'media' : 'link');
        }
    }, [modalState.type]);

    const handleLocalChange = (field, value) => {
        setLocalInputs((prev) => ({ ...prev, [field]: value }));

        // ✅ Remove error instantly for the field being typed
        if (error?.[field]) {
            handleChange(field, value); // sync parent form state
            error[field] = ''; // remove the specific error (if parent manages error state locally)
        }

        // ✅ Optional: live validation examples
        if (field === 'file_url' && linkType === 'link') {
            if (validateURL(value)) {
                error.file_url = '';
            }
        }
    };

    const handleBlurSync = (field, value) => handleChange(field, value);

    const validateDates = (startDate, endDate) => {
        if (!startDate || !endDate) return true;
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end < start) {
            toast.error('End date cannot be before Start date!');
            return false;
        }
        if (end.getTime() === start.getTime()) {
            toast.error('End date cannot be same as Start date!');
            return false;
        }
        return true;
    };

    const validateURL = (url) => {
        if (!url) return true;
        const pattern =
            /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
        // const pattern = new RegExp(
        //   '^(https?:\\/\\/)?(([\\da-z.-]+)\\.([a-z.]{2,6})|([\\d.]+))(\\:[0-9]{1,5})?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$',
        //   'i'
        // );
        return pattern.test(url);
    };

    const handleProjectTypeChange = (type) => {
        setProjectType(type);
        if (type !== 'college') handleChange('institution_id', '');
        if (type !== 'company') handleChange('company_id', '');
    };

    const handleSubmitWrapper = (e) => {
        e.preventDefault();
        Object.entries(localInputs).forEach(([key, value]) => handleChange(key, value));

        if (linkType === 'link' && localInputs.file_url && !validateURL(localInputs.file_url)) {
            toast.error('Please enter a valid URL.');
            return;
        }

        handleSubmit(e);
    };
    // inside AddProject component
    const handleLinkTypeChange = (type) => {
        setLinkType(type);

        // clear previous link/media values when switching type
        if (type === "link") {
            // switching to link: clear media_url
            handleChange("media_url", "");
        } else {
            // switching to media: clear link URL
            handleChange("file_url", "");
        }

        // also clear local input field
        setLocalInputs((prev) => ({
            ...prev,
            file_url: "",
        }));
    };

    return (
        <Modal
            isOpen={modalState.type === 'projects'}
            onClose={handleClose}
            title="Add Project"
            handleSubmit={handleSubmitWrapper}
            loading={loading}
        >
            <div className="p-3 space-y-5">
                {/* Project Name */}
                <CustomInput
                    ref={nameRef}
                    label="Project Name"
                    value={localInputs.name}
                    onChange={(e) => handleLocalChange('name', e.target.value)}
                    name="name"
                    placeholder="Enter project name"
                    className="w-full h-10"
                    required
                    error={error?.name}
                />

                {/* Project Type */}
                <div className="space-y-3">
                    <p className="text-sm glassy-text-secondary font-medium">
                        Project Type{' '}
                        <span className="text-sky-500 ml-1 text-xs font-normal">(Optional)</span>
                    </p>
                    <div className="flex flex-wrap gap-4 items-center mt-2">
                        {['personal', 'company', 'college'].map((type) => (
                            <label
                                key={type}
                                className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:glassy-card transition-colors"
                            >
                                <input
                                    type="radio"
                                    name="projectType"
                                    value={type}
                                    checked={projectType === type}
                                    onChange={() => handleProjectTypeChange(type)}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm">
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Company / College */}
                {projectType === 'company' && (
                    <FilterSelect
                        options={companyList || []}
                        selectedOption={companyList?.find((opt) => opt.value === formData?.company_id)}
                        onChange={(selected) => handleSelectChange('company_id', selected)}
                        label="Company"
                        placeholder="Select Company"
                        onCreateOption={(inputValue, field) => {
                            setAddModalState({ isOpen: true, type: 'companies', field });
                            setInputFields((prev) => ({ ...prev, name: inputValue }));
                        }}
                        isClearable
                        error={error?.company_id}
                    />
                )}
                {projectType === 'college' && (
                    <FilterSelect
                        options={collegeList || []}
                        selectedOption={collegeList?.find(
                            (opt) => opt.value === formData?.institution_id
                        )}
                        onChange={(selected) => handleSelectChange('institution_id', selected)}
                        label="College"
                        placeholder="Select College"
                        onCreateOption={(inputValue, field) => {
                            setAddModalState({ isOpen: true, type: 'institutions', field });
                            setInputFields((prev) => ({ ...prev, name: inputValue }));
                        }}
                        isClearable
                        error={error?.institution_id}
                    />
                )}

                {/* Description */}
                <CustomInput
                    ref={descRef}
                    type="textarea"
                    label="Project Description"
                    value={localInputs.description}
                    onChange={(e) => handleLocalChange('description', e.target.value)}
                    placeholder="Briefly describe your project"
                    className="w-full h-24 resize-none overflow-y-auto"
                    maxLength={200}
                    required
                    error={error?.description}
                />

                {/* Dates */}
                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                    <CustomDateInput
                        ref={startDateRef}
                        label="Start Date"
                        name="start_date"
                        value={localInputs.start_date}
                        onChange={(e) => handleLocalChange('start_date', e.target.value)}
                        error={error?.start_date}
                        autoComplete="off"
                        className="w-full h-10"
                        allowFutureDate={false}
                        required
                    />
                    <CustomDateInput
                        ref={endDateRef}
                        label="End Date"
                        name="end_date"
                        value={localInputs.end_date}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (validateDates(localInputs.start_date, val)) {
                                handleLocalChange('end_date', val);
                            } else {
                                handleLocalChange('end_date', '');
                            }
                        }}
                        error={error?.end_date}
                        autoComplete="off"
                        className="w-full h-10"
                        allowFutureDate={false}
                        min={localInputs.start_date}
                    />
                </div>

                {/* Link or Media */}
                <div className="space-y-3">
                    <div className="flex gap-5 items-center">
                        {['link', 'media'].map((type) => (
                            <label
                                key={type}
                                className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:glassy-card transition-colors"
                            >
                                <input
                                    type="radio"
                                    name="linkType"
                                    value={type}
                                    checked={linkType === type}
                                    onChange={() => handleLinkTypeChange(type)}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm">
                                    {type === 'link' ? 'Project Link' : 'Project Media'}
                                </span>
                            </label>
                        ))}
                    </div>

                    {linkType === 'link' ? (
                        <CustomInput
                            ref={urlRef}
                            type="url"
                            label="Project URL"
                            value={localInputs.file_url}
                            onChange={(e) => handleLocalChange('file_url', e.target.value)}
                            placeholder="e.g., https://github.com/username/project"
                            className="w-full h-10 border rounded-md p-1"
                            required
                            error={error?.file_url}
                        />
                    ) : (
                        <EnhancedFileInput
                            label="Upload Project Media/PDF"
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
    );
};

export default AddProject;
