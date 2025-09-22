import React, { useEffect, useState } from 'react'
import CustomInput from '../../components/ui/Input/CustomInput'
import { Link, useNavigate } from 'react-router-dom'
import useFormHandler from '../../components/hooks/useFormHandler'
import Button from '../../components/ui/Button/Button'
import Aos from 'aos'
import FilterSelect from '../../components/ui/Input/FilterSelect'
import CourseCard from '../../components/ui/cards/CourseCard'
import CustomDateInput from '../../components/ui/Input/CustomDateInput'
import { SkillsCard } from '../../components/ui/cards/Card'
import { useDispatch, useSelector } from 'react-redux'
import { arrayTransform, arrayTransform2, convertToTimestamp, getDuration, uploadImageDirectly } from '../../components/utils/globalFunction'
import { getAllCompanies, getAllIndustry, getAllProfileRole, getAllWorkSkillList, updateCompanyData, updateIndustryData, updateProfileRoleData, updateWorkSkillData } from '../../redux/work/workSlice'
import { toast } from 'sonner'
import { addWorkExp } from '../../redux/slices/authSlice'
import Modal from '../../components/ui/Modal/Modal'
import CustomFileInput from '../../components/ui/Input/CustomFileInput'
// import { updateDataCompany, updateDegreeData, updateFieldsOfStudyData, updateSkillsData } from '../../redux/education/educationSlice'
import { addOneData } from '../../redux/Users/userSlice'

const WorkExperience = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const selector = useSelector(state => state.work)
    const [selectedSkills, setSelectedSkills] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [formErrors, setFormErrors] = useState({})
    const [addModalState, setAddModalState] = useState({
        isOpen: false,
        type: '',
        field: ''
    });
    // const [setIsCreatedByUser] = useState(true)
    const [isCreatedByUser, setIsCreatedByUser] = useState(true)
    const [isCreatedByUserForFields, setIsCreatedByUserForFields] = useState(false)
    const [isCreatedByUserForIndustry, setIsCreatedByUserForIndustry] = useState(false)
    const [isCreatedByUserFor, setIsCreatedByUserFor] = useState(false)


    console.log("isCreatedByUserForFields", isCreatedByUserForFields)


    const [inputFields, setInputFields] = useState({
        name: "", logo_url: ""
    })

    const getModalTitle = (type) => {
        switch (type) {
            case 'company':
                return 'Add Company'
            case 'industry':
                return 'Add Industry'
            case 'profile-role':
                return 'Add Profile Role'
            case 'skill':
                return 'Add Skill'
            default:
                return `Add ${type}`
        }
    }

    const allCompanies = arrayTransform2(selector?.getAllCompaniesData?.data?.data || [])
    const allIndustry = arrayTransform(selector?.getAllIndustryData?.data?.data || [])
    const allProfile = arrayTransform(selector?.getAllProfileRoleData?.data?.data || [])
    const allWorkSkill = arrayTransform(selector?.getAllWorkSkillListData?.data?.data || [])

    // Transform skills for suggestions
    const allSkills = selector?.getAllWorkSkillListData?.data?.data?.map((skill) => ({
        value: skill?._id,
        label: skill?.name,
        selection_count: skill?.selection_count,
        isSuggested: skill?.isSuggested
    })) || []


    // console.log("all skills:---", allSkills)

    // Initialize form with proper structure
    const { formData, setFormData, handleChange, } = useFormHandler({
        company_id: "",
        industries_id: "",
        profile_role_id: "",
        start_date: "",
        end_date: "",
        currently_available: false,
        duration: "",
        skills_acquired: [],
    })

    useEffect(() => {
        Aos.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 50
        });
    }, []);

    useEffect(() => {
        dispatch(getAllCompanies())
    }, [dispatch])

    const validateForm = () => {
        const newErrors = {}

        if (!formData.company_id) {
            newErrors.company_id = "Company is required"
        }
        if (!formData.industries_id) {
            newErrors.industries_id = "Industry is required"
        }
        if (!formData.profile_role_id) {
            newErrors.profile_role_id = "Position is required"
        }
        if (!formData.start_date) {
            newErrors.start_date = "Start date is required"
        }
        if (!formData.currently_working && !formData.end_date) {
            newErrors.end_date = "End date is required when not currently working"
        }
        if (formData.start_date && formData.end_date && new Date(formData.start_date) > new Date(formData.end_date)) {
            newErrors.end_date = "End date must be after start date"
        }


        setFormErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fill in all required fields correctly")
            return;
        }

        setIsLoading(true)
        try {
            const submissionData = {
                company_id: formData.company_id,
                industries_id: formData.industries_id,
                profile_role_id: formData.profile_role_id,
                start_date: convertToTimestamp(formData.start_date),
                end_date: convertToTimestamp(formData.end_date),
                currently_available: formData.currently_available,
                duration: formData.currently_working ? null : getDuration(formData.start_date, formData.end_date),
                skills_acquired: selectedSkills.map(skill => skill.value || skill._id)
            }

            if (!submissionData.skills_acquired.length) {
                delete submissionData.skills_acquired
            }

            const res = await dispatch(addWorkExp(submissionData)).unwrap()
            toast.success(res?.message || "Work experience added successfully!")
            navigate('/user/feed')

        } catch (error) {
            toast.error(error || "Failed to save work experience")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSelectChange = async (field, selected) => {


        console.log(selected, field)

        if (field === 'company_id') {
            setIsCreatedByUser(selected?.created_by_users)
        } else if (field === 'industries_id') {
            setIsCreatedByUserForFields(selected?.created_by_users)
        }

        const exists = Array.isArray(selected) ? selected?.find(e => e.value === 'ADD') : selected?.value === 'ADD';
        if (exists) {
            let modalType = ''

            switch (field) {
                case "company_id":
                    modalType = 'company'
                    break
                case "industries_id":
                    modalType = 'industry'
                    break
                case "profile_role_id":
                    modalType = 'profile-role'
                    break
                case "skills_acquired":
                    modalType = 'skill'
                    break
                default:
                    return
            }

            setAddModalState({
                isOpen: true,
                type: modalType,
                field: field
            })
            return // Exit early since we're opening modal
        }

        if (field === "skills_acquired" && Array.isArray(selected)) {
            const validSkills = selected.filter(skill => skill.value !== 'ADD')
            setSelectedSkills(validSkills)
            setFormData(prev => ({
                ...prev,
                skills_acquired: validSkills.map(skill => skill.value)
            }))
            return
        }

        setFormData((prev) => ({
            ...prev,
            [field]: selected?.value || "",
            ...(field === "company_id" && {
                industries_id: "",
                profile_role_id: "",
                skills_acquired: []
            }),
            ...(field === "industries_id" && {
                profile_role_id: "",
                skills_acquired: []
            }),
            ...(field === "profile_role_id" && {
                skills_acquired: []
            }),
        }))

        const newErrors = { ...formErrors }
        delete newErrors[field]

        if (field === "company_id") {
            delete newErrors.industries_id
            delete newErrors.profile_role_id
            delete newErrors.skills_acquired
            setSelectedSkills([])
        } else if (field === "industries_id") {
            delete newErrors.profile_role_id
            delete newErrors.skills_acquired
            setSelectedSkills([]) // Clear selected skills
        } else if (field === "profile_role_id") {
            delete newErrors.skills_acquired
            setSelectedSkills([]) // Clear selected skills
        }

        setFormErrors(newErrors)

        // Fetch dependent data
        try {
            if (field === "company_id" && selected?.value) {
                setIsLoading(true)
                await dispatch(getAllIndustry({ company_id: selected.value, created_by_users: selected?.created_by_users || null }))
            } else if (field === "industries_id" && selected?.value) {
                setIsLoading(true)
                await dispatch(getAllProfileRole({ industry_id: selected.value, created_by_users: selected?.created_by_users || null }))
            } else if (field === "profile_role_id" && selected?.value) {
                setIsLoading(true)
                await dispatch(getAllWorkSkillList({ profile_role_id: selected.value, created_by_users: selected?.created_by_users || null }))
            }
        } catch (error) {
            toast.error(`Failed to load ${field} data`)
        } finally {
            setIsLoading(false)
        }
    }


    const handleSkillClick = (skill) => {
        if (!skill || !skill.label) {
            return
        }


        setSelectedSkills(prev => {
            const isSelected = prev.some(s => s.value === skill.value);
            let newSelectedSkills;

            if (isSelected) {
                // Remove skill
                newSelectedSkills = prev.filter(s => s.value !== skill.value);
            } else {
                // Add skill
                newSelectedSkills = [...prev, skill];
            }

            // Update form data
            setFormData(prevFormData => ({
                ...prevFormData,
                skills_acquired: newSelectedSkills.map(s => s.value)
            }));

            if (newSelectedSkills.length > 0) {
                const newErrors = { ...formErrors }
                delete newErrors.skills_acquired
                setFormErrors(newErrors)
            }

            return newSelectedSkills;
        });
    }

    const isSkillSelected = (skill) => {
        return selectedSkills.some(s => s.value === skill.value);
    };

    const handleCurrentlyWorkingChange = (e) => {
        const isCurrentlyWorking = e.target.checked
        setFormData(prev => ({
            ...prev,
            currently_working: isCurrentlyWorking,
            ...(isCurrentlyWorking && { end_date: "" }) // Clear end date if currently working
        }))

        if (isCurrentlyWorking) {
            const newErrors = { ...formErrors }
            delete newErrors.end_date
            setFormErrors(newErrors)
        }
    }

    // Find selected option for display
    const getSelectedOption = (options, value) => {
        return options.find(option => option.value === value) || null
    }

    const courses = [
        {
            id: 1,
            title: 'Bootstrap 5 & iOS Development',
            author: 'Kitani Studio',
            authorLink: '#',
            description: 'Learn how to make web application with iOS Framework.',
            rating: 4,
            reviews: '1.2K',
            price: '24.92',
            originalPrice: '32.90',
            tags: ['Swift'],
            img: "/Placeholder 1.png"
        },
        {
            id: 2,
            title: 'Website Dev Zero to Hero',
            author: 'Kitani Studio',
            authorLink: '#',
            description: 'More than 8yr Experience as Illustrator. Learn how to becoming professional Illustrator Now...',
            rating: 4,
            reviews: '1.2K',
            price: '24.92',
            originalPrice: '32.90',
            tags: ['UI', 'UX', 'Figma'],
            img: "/Placeholder 3.png"
        },
        {
            id: 3,
            verified: false,
            title: "WEBSITE DEV ZERO TO HERO",
            author: "Kiani Studio",
            category: "Design Fundamentals",
            description: "More than 8yr Experience as Illustrator. Learn how to becoming professional Illustrator Now...",
            ctaText: "MAKE UBER CLONE APP",
            price: "$24,92",
            originalPrice: "32,00",
            img: "/Placeholder 2.png",
            rating: 4,
        },
        {
            id: 4,
            verified: false,
            title: "WEBSITE DEV ZERO TO HERO",
            author: "Kiani Studio",
            category: "Design Fundamentals",
            description: "More than 8yr Experience as Illustrator. Learn how to becoming professional Illustrator Now...",
            ctaText: "MAKE UBER CLONE APP",
            price: "$24,92",
            originalPrice: "32,00",
            img: "/Placeholder 4.png",
            rating: 4,
        }
    ];


    const handleFileUpload2 = async (file) => {
        if (!file) {
            toast.error('Please select a file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Only image files (JPEG, PNG) are allowed');
            return;
        }

        try {
            const result = await uploadImageDirectly(file, "ADDITIONAL_CERTIFICATIONS_MEDIA");

            if (result?.data?.imageURL) {
                setInputFields(prev => ({ ...prev, logo_url: result.data.imageURL }));

                toast.success(result?.message || 'Image uploaded successfully');
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            toast.error(error?.message || 'Failed to upload image');
        }
    }

    const handleAddItem = async () => {
        // Validate required fields
        if (!inputFields.name.trim()) {
            toast.error('Please enter a name');
            return;
        }

        try {
            let type = '';
            let updateAction = null;

            switch (addModalState.type) {
                case 'company':
                    type = 'companies'
                    updateAction = updateCompanyData
                    break
                case 'industry':
                    type = 'industries'
                    updateAction = updateIndustryData
                    break
                case 'profile-role':
                    type = 'profile-roles'
                    updateAction = updateProfileRoleData
                    break
                case 'skill':
                    type = 'skills'
                    updateAction = updateWorkSkillData
                    break
                default:
                    toast.error('Invalid item type')
                    return
            }
            setIsLoading(true)
            const res = await dispatch(addOneData({ type, ...inputFields })).unwrap();
            setIsLoading(false)


            // Update the respective data in Redux store
            if (updateAction) {
                dispatch(updateAction({ _id: res.data._id, name: res.data.name }));
            }
            const newOption = {
                value: res.data._id,
                label: res.data.name,
                created_by_users: res.data.created_by_users
            };

            // Automatically select the newly created item
            handleSelectChange(addModalState.field, newOption);
            // Auto-select the newly added item in the form
            if (addModalState.field && res.data) {
                // const newItem = {
                //     value: res.data._id,
                //     label: res.data.name
                // };



            }

            // Close modal and reset
            setAddModalState({ isOpen: false, type: '', field: '' });
            setInputFields({ name: "", logo_url: "" });

            toast.success(`${res.data.name} added successfully`);

        } catch (error) {
            console.error('Error adding item:', error);
            toast.error(error?.message || 'Failed to add item');
        }finally{
            setIsLoading(false)
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex flex-col md:flex-row">
                <div className='md:block hidden'>

                    <div className="gradient-background flex gap-x-10 items-center justify-center h-screen">
                        {courses
                            .filter((course) => course.id === 1)
                            .map((course) => (
                                <CourseCard
                                    key={course.id}
                                    bannerImage={course.img}
                                    verified={course.verified}
                                    courseTitle={course.title}
                                    author={course.author}
                                    category={course.category}
                                    description={course.description}
                                    ctaText={course.ctaText}
                                    price={course.price}
                                    oldPrice={course.originalPrice}
                                    rating={course?.rating}
                                />
                            ))}
                        <div className='space-y-10'>
                            {courses
                                .filter((course) => course.id === 2)
                                .map((course) => (
                                    <CourseCard
                                        key={course.id}
                                        bannerImage={course.img}
                                        verified={course.verified}
                                        courseTitle={course.title}
                                        author={course.author}
                                        category={course.category}
                                        description={course.description}
                                        ctaText={course.ctaText}
                                        price={course.price}
                                        oldPrice={course.originalPrice}
                                        rating={course?.rating}
                                    />
                                ))}
                            {courses
                                .filter((course) => course.id === 3)
                                .map((course) => (
                                    <CourseCard
                                        key={course.id}
                                        bannerImage={course.img}
                                        verified={course.verified}
                                        courseTitle={course.title}
                                        author={course.author}
                                        category={course.category}
                                        description={course.description}
                                        ctaText={course.ctaText}
                                        price={course.price}
                                        oldPrice={course.originalPrice}
                                        rating={course?.rating}
                                    />
                                ))}
                        </div>
                        <div>
                            {courses
                                .filter((course) => course.id === 4)
                                .map((course) => (
                                    <CourseCard
                                        key={course.id}
                                        bannerImage={course.img}
                                        verified={course.verified}
                                        courseTitle={course.title}
                                        author={course.author}
                                        category={course.category}
                                        description={course.description}
                                        ctaText={course.ctaText}
                                        price={course.price}
                                        oldPrice={course.originalPrice}
                                        rating={course?.rating}
                                    />
                                ))}
                        </div>
                    </div>
                </div>


                <div className="w-full md:w-1/2 flex items-center justify-center p-6">
                    <div className="w-full max-w-lg border-[0.5px] bg-[#FFFFFF] border-[#A9A9A9]/50 shadow-sm rounded-[10px] p-4" data-aos="fade-left">
                        <div className="text-center mb-4">
                            <img
                                src="/headerlogo-D3k-kYIk 2.png"
                                alt="logo"
                                className="mx-auto max-w-56 h-10 my-2"
                            />
                            <p className='text-[#000000] text-base font-normal'>Learn More. Earn More</p>
                            <h1 className="text-3xl font-semibold text-[#000000] py-3">
                                Work Experience
                            </h1>
                            <p className="text-[#646464] text-base font-normal mb-3">
                                Fill the below Details
                            </p>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <FilterSelect
                                label="Company *"
                                name="company_id"
                                placeholder="Select Company"
                                options={allCompanies}
                                selectedOption={getSelectedOption(allCompanies, formData.company_id)}
                                onChange={(selected) => handleSelectChange("company_id", selected)}
                                error={formErrors.company_id}
                                className="w-full h-10"
                                disabled={isLoading}
                                onCreateOption={(inputValue, field) => {
                                    setAddModalState({
                                        isOpen: true,
                                        type: 'company',
                                        field: field
                                    });
                                    setInputFields((prev) => ({ ...prev, name: inputValue }))

                                }}
                                isCreatedByUser={true}
                            />

                            <FilterSelect
                                label="Industry *"
                                name="industries_id"
                                placeholder="Select Industry"
                                options={allIndustry}
                                selectedOption={getSelectedOption(allIndustry, formData.industries_id)}
                                onChange={(selected) => handleSelectChange("industries_id", selected)}
                                error={formErrors.industry_id}
                                className="w-full h-10"
                                isDisabled={!formData.company_id || isLoading}
                                onCreateOption={(inputValue, field) => {
                                    setAddModalState({
                                        isOpen: true,
                                        type: 'industry', // same as institution
                                        field: field
                                    });
                                    setInputFields((prev) => ({ ...prev, name: inputValue }))

                                }}
                                isCreatedByUser={isCreatedByUser ? true : false}
                            />

                            <FilterSelect
                                label="Position *"
                                name="profile_role_id"
                                placeholder="Select Position"
                                options={allProfile}
                                selectedOption={getSelectedOption(allProfile, formData.profile_role_id)}
                                onChange={(selected) => handleSelectChange("profile_role_id", selected)}
                                error={formErrors.profile_role_id}
                                className="w-full h-10"
                                isDisabled={!formData.industries_id}
                                onCreateOption={(inputValue, field) => {
                                    setAddModalState({
                                        isOpen: true,
                                        type: 'profile-role', // same as institution
                                        field: field
                                    });
                                    setInputFields((prev) => ({ ...prev, name: inputValue }))

                                }}
                                isClearable={true}
                                isCreatedByUser={isCreatedByUser ? true : false}
                            />

                            <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                                <CustomDateInput
                                    label="Start Date *"
                                    name="start_date"
                                    type="date"
                                    placeholder="Enter Date"
                                    value={formData.start_date}
                                    onChange={(e) => handleChange("start_date", e.target.value)}
                                    error={formErrors.start_date}
                                    className="w-full h-10"
                                />
                                <CustomDateInput
                                    label="End Date"
                                    name="end_date"
                                    type="date"
                                    placeholder="Enter Date"
                                    value={formData.end_date}
                                    onChange={(e) => handleChange("end_date", e.target.value)}
                                    error={formErrors.end_date}
                                    className="w-full h-10"
                                    disabled={formData.currently_working}
                                />
                            </div>

                            <div className='grid grid-cols-2 gap-2'>
                                <CustomInput
                                    type="checkbox"
                                    label="I am currently working here"
                                    checked={formData.currently_working}
                                    onChange={handleCurrentlyWorkingChange}
                                />
                                <p className='text-end font-semibold text-sm'>{getDuration(formData?.start_date, formData?.end_date)}</p>
                            </div>

                            <FilterSelect
                                label='Skills Gained *'
                                placeholder="Select skills"
                                options={allWorkSkill}
                                selectedOption={selectedSkills}
                                onChange={(selected) => handleSelectChange("skills_acquired", selected)}
                                error={formErrors.skills_acquired}
                                isMulti={true}
                                isDisabled={!formData.profile_role_id || isLoading}
                                onCreateOption={(inputValue, field) => {
                                    setAddModalState({
                                        isOpen: true,
                                        type: 'skill',
                                        field: field
                                    });
                                    setInputFields((prev) => ({ ...prev, name: inputValue }))

                                }}
                                isCreatedByUser={isCreatedByUser ? true : false}
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

                            <div className='flex justify-between flex-wrap place-items-center gap-4 py-5'>
                                <Button
                                    type="button"
                                    variant='outline'
                                    className='w-40'
                                    onClick={() => navigate(-1)}
                                    disabled={isLoading}
                                >
                                    Prev
                                </Button>
                                <Button
                                    type="submit"
                                    className='w-40'
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : 'Next'}
                                </Button>
                            </div>
                        </form>

                        <div className="mt-2 text-center text-base text-[#646464]">
                            <Link
                                to="/user/feed"
                                className="text-[#2563EB] hover:underline font-medium text-base hover:text-blue-500"
                            >
                                Skip Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={addModalState.isOpen}
                title={getModalTitle(addModalState.type)}
                onClose={() => {
                    setAddModalState({ isOpen: false, type: '', field: '' })
                    setInputFields({ name: "", logo_url: "" })
                }}
                handleSubmit={handleAddItem}
                loading={isLoading}
            >
                <div className='space-y-3'>
                    <CustomInput
                        className="w-full h-10"
                        label="Enter Name"
                        required
                        placeholder={`Enter ${addModalState.type} name`}
                        value={inputFields?.name}
                        onChange={(e) => setInputFields(prev => ({ ...prev, name: e.target.value }))}
                    />
                    {/* Show logo upload only for companies */}
                    {addModalState.type === 'company' && (
                        <CustomFileInput
                            value={inputFields?.logo_url}
                            required
                            label='Logo'
                            onChange={(file) => handleFileUpload2(file)}
                        />
                    )}
                </div>
            </Modal>
        </div>
    )
}

export default WorkExperience