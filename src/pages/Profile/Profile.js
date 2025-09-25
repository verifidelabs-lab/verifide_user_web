import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import ProfileCardData from './components/ProfileCardData';
import Badge from '../../components/ui/Badge/Badge';
import ExpEduCard from '../../components/ui/cards/Card';
import SkillTag from '../../components/ui/SkillTag/SkillTag';
import PersonalInformation from './components/PersonalInformation';
import CommonSection from './components/CommonSection';
import PeopleToConnect from '../../components/ui/ConnectSidebar/ConnectSidebar';
import AddEducationModal from './components/AddEducationModal';
import AddExperience from './components/AddExperience';
import AddProject from './components/AddProject';
import AddCertificate from './components/AddCertificate';
import useFormHandler from '../../components/hooks/useFormHandler';
import { useEducationFormHandlers } from '../../components/hooks/useEducationHandler';
import { useLocationFormHandlers } from '../../components/hooks/useLocationFormHandlers';
import { arrayTransform, arrayTransform2, convertTimestampToDate, convertToTimestamp, formatDateRange, getDuration, uploadImageDirectly, uploadPdfDirectly } from '../../components/utils/globalFunction';
import { certificateShareAsPost, clearSkillListData, deleteCertificationsById, deleteEducationsById, deleteProjectById, deleteWorkById, getAllCertificateList, getAllDegree, getAllEducationList, getAllExperienceList, getAllFieldsOfStudy, getAllProjectList, getAllSkillList, instituteCollegeList, updateCertificationsById, updateDataCompany, updateDegreeData, updateEducationById, updateExperienceById, updateFieldsOfStudyData, updateProjectById, updateSkillsData } from '../../redux/education/educationSlice';
import { addCertification, addEducation, addProject, addWorkExp, getProfile, updateFrameStatus, userProfileUpdate } from '../../redux/slices/authSlice';
import { cities, countries, masterSkills, state, updateMasterSkillData } from '../../redux/Global Slice/cscSlice';
import { clearWorkSkillListData, getAllCompanies, getAllIndustry, getAllProfileRole, getAllWorkSkillList, updateCompanyData, updateIndustryData, updateProfileRoleData, } from '../../redux/work/workSlice';
import { addOneData, suggestedUser } from '../../redux/Users/userSlice';
import CertificateCard from '../../components/ui/cards/CertificateCard';
import Button from '../../components/ui/Button/Button';
import { GoPlus } from 'react-icons/go';
import Modal from '../../components/ui/Modal/Modal';
import CustomInput from '../../components/ui/Input/CustomInput';
import CustomFileInput from '../../components/ui/Input/CustomFileInput';
import AOS from "aos";
import "aos/dist/aos.css";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';


const validationRules = {
  education: {
    institution_id: { required: true, message: 'Institution is required' },
    degree_id: { required: true, message: 'Degree is required' },
    field_of_studies: { required: true, message: 'Field of study is required' },
    start_date: { required: true, message: 'Start date is required' },
    // end_date: { required: true, message: 'End date is required' },
    description: { required: true, message: 'Description  is required' },
    skills_acquired: {
      required: true,
      validate: (value) => (value && value.length > 0),
      message: 'At least one skill is required'
    },

  },
  experience: {
    company_id: { required: true, message: 'Company is required' },
    profile_role_id: { required: true, message: 'Role is required' },
    industries_id: { required: true, message: 'Industry is required' },
    start_date: { required: true, message: 'Start date is required' },
    // description: { required: true, message: 'description is required' },
    skills_acquired: {
      required: true,
      validate: (value) => (value && value.length > 0),
      message: 'At least one skill is required'
    },

  },
  project: {
    name: { required: true, message: 'Project name is required' },
    description: { required: true, message: 'Description is required' },
    start_date: { required: true, message: 'Start date is required' },
    // end_date: { required: true, message: 'End date is required' },
    // media_url: { required: true, message: 'Url  is required' },
    file_url: {
      required: true,
      validate: (value, formData) => {
        // Only require file_url if media_url is not provided
        return !formData.media_url || value;
      },
      message: 'File URL is required if no media is uploaded'
    },
    media_url: {
      required: true,
      validate: (value, formData) => {
        // Only require media_url if file_url is not provided
        return !formData.file_url || value;
      },
      message: 'Media is required if no file URL is provided'
    }

  },
  certification: {
    name: { required: true, message: 'Certification name is required' },
    issuing_organization: { required: true, message: 'Issuing organization is required' },
    issue_date: { required: true, message: 'Issue date is required' },
    credential_id: { required: true, message: 'Credential id is required' },
    credential_url: {
      required: true,
      validate: (value, formData) => {
        // Only require credential_url if media_url is not provided
        return !formData.media_url || value;
      },
      message: 'Credential URL is required if no media is uploaded'
    },
    skills_acquired: {
      required: true,
      validate: (value) => (value && value.length > 0),
      message: 'At least one skill is required'
    },
    media_url: {
      required: true,
      validate: (value, formData) => {
        // Only require media_url if credential_url is not provided
        return !formData.credential_url || value;
      },
      message: 'Media is required if no credential URL is provided'
    }
  },
  profile: {
    first_name: { required: true, message: 'First name is required' },
    last_name: { required: true, message: 'Last name is required' },
    birth_date: {
      required: true,
      validate: (value) => {
        if (!value) return false;
        const dob = new Date(value);
        const today = new Date();
        if (dob > today) return false;
        const minDate = new Date();
        minDate.setFullYear(today.getFullYear() - 3);

        return dob <= minDate;
      },
      message: 'Birth date must be at least 3 years ago and cannot be in the future',
    },
    gender: { required: true, message: 'Gender is required' },
    headline: {
      required: true,
      validate: (value) => value.length <= 100,
      message: 'Headline must be 100 characters or less'
    },
    summary: {
      required: true,
      validate: (value) => value.length >= 10 && value.length <= 500,
      message: 'Professional bio must be between 10-500 characters'
    },
    username: { required: true, message: 'username  is required' },
    'address.address_line_1': {
      required: true,
      validate: (value) => value.length <= 100,
      message: 'Address must be 100 characters or less'
    },
    'address.pin_code': { required: true, message: 'Pin code is required' },
    'address.country.name': { required: true, message: 'Country is required' },
    'address.state.name': { required: true, message: 'State is required' },
    'address.city.name': { required: true, message: 'City is required' },
  }

};

const useValidation = () => {
  const validateForm = useCallback((formData, type) => {
    const rules = validationRules[type];
    if (!rules) return { isValid: true, errors: {} };

    const getValue = (obj, path) => {
      return path.split('.').reduce((acc, key) => acc?.[key], obj);
    };

    const errors = {};
    let isValid = true;

    Object.entries(rules).forEach(([field, rule]) => {
      const value = getValue(formData, field);
      let isInvalid = false;

      if (type === 'project') {
        if (field === 'file_url' || field === 'media_url') {
          // Check if both are empty
          if (!formData.file_url && !formData.media_url) {
            errors.file_url = 'Either a project URL or media file is required';
            errors.media_url = 'Either a project URL or media file is required';
            isValid = false;
            return;
          }

          return;
        }
      }

      if (type === 'certification') {
        if (field === 'credential_url' || field === 'media_url') {
          // Check if both are empty
          if (!formData.credential_url && !formData.media_url) {
            errors.credential_url = 'Either a credential URL or media file is required';
            errors.media_url = 'Either a credential URL or media file is required';
            isValid = false;
            return;
          }
          // Skip individual validation for these fields since we're handling them together
          return;
        }
      }

      if (typeof rule.required === 'function') {
        if (rule.required(formData)) {
          if (Array.isArray(value)) {
            isInvalid = !rule.validate?.(value) ?? value.length === 0;
          } else {
            isInvalid = !value || (typeof value === 'string' && !value.trim());
          }
        }
      } else if (rule.required) {
        if (Array.isArray(value)) {
          isInvalid = !rule.validate?.(value) ?? value.length === 0;
        } else {
          isInvalid = !value || (typeof value === 'string' && !value.trim());
        }
      }

      if (isInvalid) {
        errors[field] = rule.message;
        isValid = false;
      }
    });

    return { isValid, errors };
  }, []);

  return { validateForm };
};


const initialFormState = {
  institution_id: "",
  name: "",
  resume_url: "",
  media_url: "",
  description: "",
  degree_id: "",
  field_of_studies: "",
  start_date: "",
  end_date: "",
  currently_available: false,
  duration: "",
  skills_acquired: [],
  company_id: "",
  industries_id: "",
  profile_role_id: "",
  first_name: "",
  last_name: "",
  address: {
    address_line_1: "",
    address_line_2: "",
    country: { name: "", dial_code: "", short_name: "", emoji: "" },
    state: { name: "", code: "" },
    city: { name: "" },
    pin_code: ""
  },
  gender: "",
  birth_date: "",
  headline: "",
  summary: "",
  issuing_organization: "",
  issue_date: "",
  credential_id: "",
  credential_url: "",
  profile_picture_url: "",
  username: "",
  file_url: ""
};

const Profile = ({ profileData }) => {
  const dispatch = useDispatch();
  const { validateForm } = useValidation();
  const selector = useSelector(state => state.educations);
  const masterSkillsSelector = useSelector(state => state.global);
  const countriesSelector = useSelector(state => state.global);
  const workSelector = useSelector(state => state.work);
  const userSelector = useSelector(state => state.user)
  const { suggestedUserData: { data } } = userSelector ? userSelector : {}
  const [frameStatus, setFrameStatus] = useState('')
  const [inputFields, setInputFields] = useState({
    name: "", logo_url: ""
  })
  const [isExtended, setIsExtended] = useState(false);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const prevRef2 = useRef(null);
  const nextRef2 = useRef(null);
  const [activeTab, setActiveTab] = useState("user")
  const [isCreatedByUser, setIsCreatedByUser] = useState(true)
  const [isCreatedByUserForFields, setIsCreatedByUserForFields] = useState(false)
  const [isCreatedByUserForIndustry, setIsCreatedByUserForIndustry] = useState(null)
  const [isCreatedByUserFor, setIsCreatedByUserFor] = useState(false)
  const [skillForProfileRoleId, setIsSkillForProfileRoleId] = useState(false)
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [slidesPerView2, setSlidesPerView2] = useState(1);


  const transformedData = useMemo(() => ({
    collegeList: arrayTransform(selector?.instituteCollegeListData?.data?.data || []),
    degreeList: arrayTransform(selector?.getAllDegreeData?.data?.data || []),
    fieldsOfStudyList: arrayTransform(selector?.getAllFieldsOfStudyData?.data?.data || []),
    skillsList: arrayTransform(selector?.getAllSkillListData?.data?.data || []),
    masterSkillsList: arrayTransform(masterSkillsSelector?.masterSkillsData?.data?.data?.list || []),
    countryList: arrayTransform(countriesSelector?.countriesData?.data?.data || []),
    stateList: arrayTransform(countriesSelector?.stateData?.data?.data || []),
    citiesList: arrayTransform(countriesSelector?.citiesData?.data?.data || []),
    allCompanies: arrayTransform2(workSelector?.getAllCompaniesData?.data?.data || []),
    allIndustry: arrayTransform(workSelector?.getAllIndustryData?.data?.data || []),
    allProfile: arrayTransform(workSelector?.getAllProfileRoleData?.data?.data || []),
    allWorkSkill: arrayTransform(workSelector?.getAllWorkSkillListData?.data?.data || [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [
    selector, masterSkillsSelector, countriesSelector, workSelector
  ]);

  const profileInfo = profileData?.getProfileData?.data?.data;
  const educationData = selector?.getAllEducationListData?.data?.data
  const experienceData = selector?.getAllExperienceListData?.data?.data
  const projectData = selector?.getAllProjectListData?.data?.data
  const certificationData = selector?.getAllCertificateListData?.data?.data
  const city_code = profileData?.getProfileData?.data?.data?.personalInfo?.address?.state?.name
  const country_id = profileData?.getProfileData?.data?.data?.personalInfo?.address?.country?.dial_code
  const [addModalState, setAddModalState] = useState({
    isOpen: false,
    type: '',
    field: ''
  });



  useEffect(() => {
    const updateSlides = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth < 768) {
        // mobile
        setSlidesPerView(1);
      } else {
        // tablet/desktop
        setSlidesPerView(certificationData?.length > 1 ? 2 : 1);
      }
    };

    updateSlides(); // run once on mount
    window.addEventListener("resize", updateSlides);

    return () => {
      window.removeEventListener("resize", updateSlides);
    };
  }, [certificationData]);

  useEffect(() => {
    const updateSlides = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth < 768) {
        // mobile
        setSlidesPerView2(1);
      } else {
        // tablet/desktop
        setSlidesPerView2(projectData?.length > 1 ? 2 : 1);
      }
    };

    updateSlides(); // run once on mount
    window.addEventListener("resize", updateSlides);

    return () => {
      window.removeEventListener("resize", updateSlides);
    };
  }, [projectData]);


  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allSkills = selector?.getAllSkillListData?.data?.data?.map((e) => ({
    value: e?._id,
    label: e?.name,
    selection_count: e?.selection_count,
    isSuggested: e?.isSuggested

  })) || []


  const allWorkSkills = workSelector?.getAllWorkSkillListData?.data?.data?.map((e) => ({
    value: e?._id,
    label: e?.name,
    selection_count: e?.selection_count,
    isSuggested: e?.isSuggested

  })) || []



  const [loadingStates, setLoadingStates] = useState({
    profile: false,
    education: false,
    experience: false,
    projects: false,
    certifications: false,
    deletingItems: {}
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "",
    initialData: {}
  });
  const [loading, setLoading] = useState(false);

  const { setFormData, formData, handleChange, errors, setErrors, resetForm } = useFormHandler(initialFormState);

  const { handleLocationSelectChange } = useLocationFormHandlers(setFormData, formData, setLoading, setErrors);

  const { handleSelectChange, fetchDependentData } = useEducationFormHandlers(setFormData, setLoading, setErrors, setAddModalState,
    setIsCreatedByUser, setIsCreatedByUserForFields, setIsSkillForProfileRoleId, setIsCreatedByUserForIndustry, setIsCreatedByUserFor,
  );



  console.log("isCreatedByUserForIndustry", isCreatedByUserForIndustry)


  const badges = useMemo(() => [
    { src: '/Img/badge1.png', alt: 'Badge 1' },
    { src: '/Img/badge2.png', alt: 'Badge 2' },
    { src: '/Img/badge3.png', alt: 'Badge 3' },
    { src: '/Img/badge4.png', alt: 'Badge 4' },
    { src: '/Img/badge5.png', alt: 'Badge 5' },
    { src: '/Img/badge5.png', alt: 'Badge 6' }
  ], []);


  const updateLoadingState = (section, isLoading, itemId = null) => {
    setLoadingStates(prev => {
      if (itemId) {
        return {
          ...prev,
          deletingItems: {
            ...prev.deletingItems,
            [itemId]: isLoading
          }
        };
      } else {
        return {
          ...prev,
          [section]: isLoading
        };
      }
    });
  };


  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration in ms
      offset: 100,    // offset (in px) from the original trigger point
      once: true,     // whether animation should happen only once
    });
  }, []);




  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([
          dispatch(instituteCollegeList()),
          dispatch(countries()),
          dispatch(getAllCompanies()),
          dispatch(getAllEducationList()),
          dispatch(getAllExperienceList()),
          dispatch(getAllProjectList()),
          dispatch(getAllCertificateList()),
          dispatch(suggestedUser({ page: 1, size: 10, type: activeTab })),
        ]);
      } catch (error) {
        toast.error('Failed to load initial data');
      }
    };



    initializeData();
  }, [dispatch, activeTab]);

  useEffect(() => {
    if (country_id) {
      dispatch(state({ country_code: profileData?.getProfileData?.data?.data?.personalInfo?.address?.country?.short_name }))
    }
    if (city_code) {
      dispatch(cities({ state_name: city_code }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])


  useEffect(() => {
    // console.log(profileInfo?.personalInfo)
    if (profileInfo?.personalInfo) {
      setFormData(prevData => ({
        ...prevData,
        ...profileInfo.personalInfo,
        birth_date: convertTimestampToDate(profileInfo.personalInfo.birth_date),
        address: {
          ...prevData.address,
          ...(profileInfo.personalInfo.address || {})
        }
      }));
      setFrameStatus(profileInfo?.personalInfo?.frame_status)
    }
  }, [profileInfo, setFormData]);

  const handleOpenModal = useCallback((type) => {
    setModalState({
      isOpen: true,
      type,
      initialData: {}
    });

    if (type === "certifications") {
      dispatch(masterSkills());
    }
  }, [dispatch]);

  const handleEdit = useCallback(async (type, data) => {

    setModalState({ isOpen: true, type: type });



    // console.log("state:-------????", data?.address?.country)


    const transformedData = {
      ...data,
      company_id: data?.company_id?._id,
      degree_id: data?.degree_id?._id,
      field_of_studies: data?.field_of_studies?._id,
      industries_id: data?.industries_id?._id ? data?.industries_id?._id : data?.industries_id,
      profile_role_id: data?.profile_role_id?._id,
      institution_id: data.institution_id?._id || '',
      skills_acquired: data.skills_acquired?.map(skill => skill._id) || [],
      issue_date: data.issue_date ? new Date(data.issue_date).toISOString().split('T')[0] : '',
      start_date: data.start_date ? new Date(data.start_date).toISOString().split('T')[0] : '',
      end_date: data.end_date ? new Date(data.end_date).toISOString().split('T')[0] : '',

    };



    setFormData(transformedData);

    try {
      if (transformedData.institution_id) {
        await dispatch(getAllDegree({ institution_id: transformedData.institution_id }));
      }
      if (transformedData.degree_id) {
        await dispatch(getAllFieldsOfStudy({ degree_id: transformedData.degree_id }));
      }
      if (transformedData.field_of_studies) {
        await dispatch(getAllSkillList({ study_id: transformedData.field_of_studies }));
      }
      if (transformedData.company_id) {
        await dispatch(getAllIndustry({ company_id: transformedData.company_id }));
      }
      if (transformedData.industries_id) {
        await dispatch(getAllProfileRole({ industry_id: transformedData.industries_id }));
      }
      if (transformedData.profile_role_id) {
        await dispatch(getAllWorkSkillList({ profile_role_id: transformedData.profile_role_id }));
      }

    } catch (error) {
      console.error('Error fetching dependent data:', error);
      toast.error('Failed to load dependent data');
    }
  }, [dispatch, setFormData]);

  const handleDelete = async (type, id) => {


    updateLoadingState(null, true, id);

    try {
      let res;
      if (type === "projects") {
        res = await dispatch(deleteProjectById({ _id: id })).unwrap();
        toast.success(res?.message);
        dispatch(getAllProjectList());
      } else if (type === "certifications") {
        res = await dispatch(deleteCertificationsById({ _id: id })).unwrap();
        toast.success(res?.message);
        dispatch(getAllCertificateList());
      } else if (type === 'experience') {
        res = await dispatch(deleteWorkById({ _id: id })).unwrap();
        toast.success(res?.message);
        dispatch(getAllExperienceList());
        dispatch(getProfile())

      } else if (type === "education") {
        res = await dispatch(deleteEducationsById({ _id: id })).unwrap();
        toast.success(res?.message);
        dispatch(getAllEducationList());
        dispatch(getProfile())

      }
    } catch (error) {
      toast.error(error);
    } finally {
      updateLoadingState(null, false, id);
    }
  };

  const handleClose = useCallback(() => {
    setModalState({ isOpen: false, type: "", initialData: {} });
    setErrors({});
    resetForm()
    dispatch(getProfile())
    // setSuggestedSkills([])
    dispatch(clearSkillListData())
    dispatch(clearWorkSkillListData())

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetForm, setErrors]);

  const handleEducationSubmit = useCallback(async (e) => {
    e.preventDefault();

    const { isValid, errors } = validateForm(formData, 'education');
    if (!isValid) {
      setErrors(errors);
      // toast.error('Please fix the validation errors');
      return;
    }

    setLoading(true);
    try {
      const submissionData = {
        start_date: convertToTimestamp(formData.start_date),
        end_date: convertToTimestamp(formData.end_date),
        duration: getDuration(formData.start_date, formData.end_date),
        institution_id: formData?.institution_id,
        field_of_studies: formData?.field_of_studies,
        degree_id: formData?.degree_id,
        currently_available: formData?.currently_available,
        skills_acquired: formData?.skills_acquired,
        description: formData?.description

      };

      if (formData?._id) {
        submissionData._id = formData?._id
      }

      const action = formData?._id ? updateEducationById : addEducation

      const res = await dispatch(action(submissionData)).unwrap();
      toast.success(res?.message || 'Education added successfully');
      dispatch(getAllEducationList());
      handleClose();
    } catch (error) {
      console.error('Education submission error:', error);
      toast.error(error?.message || 'Failed to save education details');
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, setErrors, dispatch, handleClose]);

  const handleProfileUpdate = useCallback(async () => {
    const { isValid, errors } = validateForm(formData, 'profile');
    if (!isValid) {
      setErrors(errors);
      toast.error('Please fix the validation errors');
      return;
    }

    setLoading(true);
    try {
      const {
        institution_id, degree_id, profile_views, email, connection_count,
        frame_status, follower_count, field_of_studies, start_date, end_date,
        currently_available, duration, skills_acquired, name, description,
        company_id, industries_id, profile_role_id, media_url, is_verified,
        issuing_organization, issue_date, credential_id, credential_url, profile_picture_url, projects, topSkills, userConnection, educations,

        ...rest
      } = formData;

      const apiPayload = {
        // _id: profileInfo?._id,
        birth_date: convertToTimestamp(rest.birth_date),
        "first_name": formData?.first_name,
        "last_name": formData?.last_name,
        // "email": formData?.email,
        "gender": formData?.gender,
        summary: formData?.summary,
        address: formData?.address,
        headline: formData?.headline,
        username: formData?.username

      };

      const res = await dispatch(userProfileUpdate(apiPayload)).unwrap();
      toast.success(res?.message || 'Profile updated successfully');
      setIsExtended(false)
      dispatch(getProfile());
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, validateForm, setErrors, dispatch, profileInfo]);

  const handleProjectSubmit = useCallback(async () => {
    const { isValid, errors } = validateForm(formData, 'project');
    if (!isValid) {
      setErrors(errors);
      // toast.error('Please fix the validation errors');
      return;
    }

    setLoading(true);
    try {
      const apiPayload = {
        name: formData.name,
        description: formData.description,
        institution_id: formData.institution_id,
        start_date: convertToTimestamp(formData.start_date),
        end_date: convertToTimestamp(formData.end_date),
        media_url: formData.media_url,
        company_id: formData?.company_id,
        file_url: formData?.file_url
      };
      if (formData?._id) {
        apiPayload._id = formData?._id
      }
      const action = formData?._id ? updateProjectById : addProject
      const res = await dispatch(action(apiPayload)).unwrap();
      toast.success(res?.message || 'Project added successfully');
      handleClose();
      dispatch(getAllProjectList())
    } catch (error) {
      console.error('Project submission error:', error);
      toast.error(error?.message || 'Failed to add project');
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, setErrors, dispatch, handleClose]);


  const handleCertificationSubmit = useCallback(async () => {
    const { isValid, errors } = validateForm(formData, 'certification');
    // console.log(isValid, errors)
    if (!isValid) {
      setErrors(errors);
      // toast.error('Please fix the validation errors');
      return;
    }

    setLoading(true);
    try {
      const apiPayload = {
        name: formData.name,
        issuing_organization: formData.issuing_organization,
        issue_date: convertToTimestamp(formData.issue_date),
        credential_id: formData.credential_id,
        credential_url: formData.credential_url,
        media_url: formData.media_url,
        skills_acquired: formData.skills_acquired
      };

      if (formData?._id) {
        apiPayload._id = formData?._id
      }

      const action = formData?._id ? updateCertificationsById : addCertification
      const res = await dispatch(action(apiPayload)).unwrap();
      toast.success(res?.message || 'Certification added successfully');
      handleClose();
      dispatch(getAllCertificateList());
    } catch (error) {
      console.error('Certification submission error:', error);
      toast.error(error?.message || 'Failed to add certification');
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, setErrors, dispatch, handleClose]);

  const handleFileUpload = useCallback(async (file) => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    const allowedPdfTypes = ["application/pdf"];

    // console.log(file)

    if (![...allowedImageTypes, ...allowedPdfTypes].includes(file.type)) {
      toast.error("Only image (JPEG, PNG) or PDF files are allowed");
      return;
    }

    setLoading(true);
    try {
      if (allowedImageTypes.includes(file.type)) {

        const result = await uploadImageDirectly(
          file,
          "ADDITIONAL_CERTIFICATIONS_MEDIA"
        );

        if (result?.data?.imageURL) {
          setFormData((prev) => ({ ...prev, media_url: result.data.imageURL }));
          if (errors?.media_url) {
            setErrors((prev) => ({ ...prev, media_url: "" }));
          }
          toast.success(result?.message || "Image uploaded successfully");
        } else {
          throw new Error("Image upload failed");
        }
      } else if (allowedPdfTypes.includes(file.type)) {

        const result = await uploadPdfDirectly(
          file,
          "ADDITIONAL_CERTIFICATIONS_MEDIA"
        );

        if (result?.data?.imageURL) {
          setFormData((prev) => ({ ...prev, media_url: result.data.imageURL }));
          if (errors?.file_url) {
            setErrors((prev) => ({ ...prev, media_url: "" }));
          }
          toast.success(result?.message || "PDF uploaded successfully");
        } else {
          throw new Error("PDF upload failed");
        }
      }
    } catch (error) {
      console.error('File upload error:', error);
      toast.error(error?.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  }, [setFormData, errors?.media_url, errors?.file_url, setErrors]);


  const getSelectedOption = useCallback((options, value) => {
    if (!value) return null;
    const id = value._id ? value._id : value;
    return options.find(option => option.value === id) || null;
  }, []);


  const handleWorkExperienceSubmit = async () => {

    const { isValid, errors } = validateForm(formData, 'experience');
    // console.log(isValid, errors)
    if (!isValid) {
      setErrors(errors);
      // toast.error('Please fix the validation errors');
      return;
    }

    setLoading(true)
    try {
      const submissionData = {
        company_id: formData.company_id,
        industries_id: formData.industries_id,
        profile_role_id: formData.profile_role_id,
        start_date: convertToTimestamp(formData?.start_date),
        end_date: convertToTimestamp(formData?.end_date),
        currently_available: formData?.currently_available,
        duration: getDuration(formData?.start_date, formData?.end_date),
        skills_acquired: formData?.skills_acquired,
        description: formData?.description

      }
      if (formData?._id) {
        submissionData._id = formData?._id
      }

      const action = formData?._id ? updateExperienceById : addWorkExp
      const res = await dispatch(action(submissionData)).unwrap()
      toast.success(res?.message || "Work experience added successfully!")
      handleClose()
      dispatch(getAllExperienceList())
    } catch (error) {
      toast.error(error || "Failed to save work experience")
    } finally {
      setLoading(false)
    }
  }

  const handleSelection = async (selected) => {
    try {
      const res = await dispatch(updateFrameStatus({ frame_status: selected })).unwrap()
      toast.success(res?.message)
      setFrameStatus(selected)
      dispatch(getProfile());
    } catch (error) {
      toast.error(error)
    }
  }


  const handleConnect = (data) => {
    // console.log("data user ka -->", data)
  }

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

    setLoading(true);
    try {
      const result = await uploadImageDirectly(file, "ADDITIONAL_CERTIFICATIONS_MEDIA");

      if (result?.data?.imageURL) {
        setInputFields(prev => ({ ...prev, logo_url: result.data.imageURL }));

        toast.success(result?.message || 'Image uploaded successfully');
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  }


  // const handleAddItem = async () => {
  //   try {
  //     let type = '';
  //     let updateAction = null;

  //     switch (addModalState.type) {
  //       case 'college':
  //         type = 'institutions';
  //         updateAction = updateDataCompany;
  //         break;
  //       case 'degree':
  //         type = 'degrees';
  //         updateAction = updateDegreeData;
  //         break;
  //       case 'field':
  //         type = 'fields-of-studies';
  //         updateAction = updateFieldsOfStudyData;
  //         break;
  //       case 'skill':
  //         type = 'skills';
  //         updateAction = updateSkillsData;
  //         break;
  //       case 'companies':
  //         type = "companies"
  //         updateAction = updateCompanyData;
  //         break;
  //       case 'industries':
  //         type = 'industries'
  //         updateAction = updateIndustryData;
  //         break;
  //       case 'profile-roles':
  //         type = "profile-roles"
  //         updateAction = updateProfileRoleData;
  //         break;
  //       default:
  //         return;
  //     }

  //     const res = await dispatch(addOneData({ type, ...inputFields })).unwrap();
  //     console.log("res?.data:----", res?.data)
  //     dispatch(updateAction({ _id: res.data._id, name: res.data.name, created_by_users: res?.data?.created_by_users }));

  //     setAddModalState({ isOpen: false, type: '', field: '' });
  //     setInputFields({ name: "", logo_url: "" });

  //     if (addModalState.field) {
  //       // You might want to update the select field with the new value here
  //     }
  //   } catch (error) {
  //     toast.error(error);
  //   }
  // };


  const handleAddItem = async () => {
    try {
      let type = '';
      let updateAction = null;
      let selectField = addModalState.field; // Get the field this item should be selected in

      switch (addModalState.type) {
        case 'college':
          type = 'institutions';
          updateAction = updateDataCompany;
          break;
        case 'degree':
          type = 'degrees';
          updateAction = updateDegreeData;
          break;
        case 'field':
          type = 'fields-of-studies';
          updateAction = updateFieldsOfStudyData;
          break;
        case 'skill':
          type = 'skills';
          updateAction = updateSkillsData;
          break;
        case 'companies':
          type = "companies"
          updateAction = updateCompanyData;
          break;
        case 'industries':
          type = 'industries'
          updateAction = updateIndustryData;
          break;
        case 'profile-roles':
          type = "profile-roles"
          updateAction = updateProfileRoleData;
          break;
        case 'masterSkill':
          type = 'skills'
          updateAction = updateMasterSkillData
          break;
        default:
          return;
      }
      setLoading(true)

      const res = await dispatch(addOneData({ type, ...inputFields })).unwrap();
      setLoading(false)


      dispatch(updateAction({
        _id: res.data._id,
        name: res.data.name,
        created_by_users: res?.data?.created_by_users
      }));

      if (selectField) {
        // For single select fields
        if (selectField !== 'skills_acquired') {
          setFormData(prev => ({
            ...prev,
            [selectField]: res.data._id
          }));

          // Also trigger any dependent data fetching
          const iscreated_by_users = res.data.created_by_users;
          fetchDependentData(selectField, res.data._id, iscreated_by_users);
        }
        // For multi-select skills field
        else {
          setFormData(prev => ({
            ...prev,
            skills_acquired: [...(prev.skills_acquired || []), res.data._id]
          }));
        }
      }

      setAddModalState({ isOpen: false, type: '', field: '' });
      setInputFields({ name: "", logo_url: "" });

    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false)

    }
  };


  const handleFileDelete = () => {
    setFormData((prev) => ({ ...prev, media_url: "" }))
  }
  const sharePost = async (data) => {
    // console.log("data", data)
    try {
      const response = await dispatch(certificateShareAsPost({ _id: data?._id })).unwrap()
      toast.success(response?.message || "Certificate share successfully")
      // console.log(response)
    } catch (error) {
      toast.error(error || "Failed to share certificate")
    }
  }



  return (
    <>

      {/* <VerifiedLoader/> */}

      <style>
        {`
          @media (max-width: 1400px) {
            .top-skills { grid-column: span 3; }
          }
          @media (min-width: 1400px) {
            .top-skills { grid-column: span 1; }
          }
          @media (max-width: 1000px) {
            .exp-edu-card { flex-direction: column; }
          }
          @media (min-width: 1000px) {
            .exp-edu-card { flex-direction: row; }
          }
        `}
      </style>
      <div className="  bg-[##F4F2EE] space-y-3 p-4">

        <div className="flex flex-col md:flex-row w-full mx-auto gap-4">
          <div className="xl:w-[75%] lg:w-[70%] md:w-[60%] w-full space-y-6 overflow-hidden h-screen  overflow-y-auto   hide-scrollbar">
            <nav className="flex justify-start items-center gap-2 mb-2 text-sm" >
              <span className="text-gray-600">Home</span>
              <span className="text-gray-400">›</span>
              <span className="font-medium text-blue-600">Profile</span>
            </nav>

            <div className="flex flex-col gap-6 lg:flex-row mx-auto">
              <div className="w-full mx-auto space-y-4 overflow-y-auto">
                <div className="overflow-hidden bg-white border border-gray-200 rounded-lg" >
                  <div className="p-4">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between" >
                      <ProfileCardData data={profileInfo} setFrameStatus={setFrameStatus} frameStatus={frameStatus} handleSelection={handleSelection} />
                      <div className="lg:text-right border border-[#dddddda8] p-2 rounded-lg relative group">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="xl:text-lg lg:text-base font-semibold text-[#000000E6]">
                            Badges Earned
                          </h3>
                          <button className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            How it works?
                          </button>
                        </div>
                        <div className="flex flex-wrap justify-end gap-2">
                          {badges.map((badge, index) => (
                            <Badge key={index} src={badge.src} alt={badge.alt} />
                          ))}
                        </div>
                        <div
                          className="fixed md:right-[20%] right-[6%] z-10 mt-2 w-96 rounded-md bg-[#2563EB] p-4 shadow-lg border border-[#D3D3D3] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"   >
                          <h4 className="text-start text-[#FFFFFF] font-semibold mb-2">How it works?</h4>
                          <ul className='text-[#FFFFFF] text-start font-normal text-sm'>
                            <li>🚀 Complete Deliveries: Get 1 badge for every 10 on-time deliveries</li>
                            <li>🧠 Training Sessions: Earn a badge for attending training events</li>
                            <li>🥇 Top Performer: Get a gold badge for consistent high ratings</li>
                            <li>🔄 Stay Active: Receive badges for weekly logins or daily check-ins</li>

                          </ul>
                        </div>

                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6" >
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 md:grid-cols-2">
                      <div className="exp-edu-card " data-aos="fade-right" data-aos-duration="1500">
                        <h2 className="md:mb-1 lg:mb-2 xl:text-base lg:text-[14px] md:text-[12px]  font-semibold text-[#000000E6]">
                          LATEST WORK EXPERIENCE
                        </h2>
                        <ExpEduCard
                          logo={profileInfo?.latestCompany?.logo_url || "/Img/Profile/Frame (1).png"}
                          title={
                            profileInfo?.latestCompany?.profileName ||
                            "Add your latest work experience"
                          }
                          company={
                            profileInfo?.latestCompany?.companyName ||
                            "Click the + button to add details about your job role and company"
                          }
                          duration={
                            profileInfo?.latestCompany?.start_date && profileInfo?.latestCompany?.end_date
                              ? formatDateRange(profileInfo.latestCompany.start_date, profileInfo.latestCompany.end_date)
                              : "Start and end date not added"
                          }
                          location={profileInfo?.latestCompany?.headquarters?.address_line_1 || "Location not specified"}
                        />
                      </div>

                      <div className="exp-edu-card " data-aos="fade-up" data-aos-duration="1500">
                        <h2 className="md:mb-1 lg:mb-2 xl:text-base lg:text-[14px] md:text-[12px] font-semibold text-[#000000E6]">
                          LATEST EDUCATION
                        </h2>
                        <ExpEduCard
                          logo={profileInfo?.latestEducation?.logo_url || "/Img/Profile/Frame.png"}
                          title={
                            profileInfo?.latestEducation?.institution ||
                            "Add your latest education details"
                          }
                          company={
                            profileInfo?.latestEducation?.field_of_studies ||
                            "Click the + button to include your course and department"
                          }
                          duration={
                            profileInfo?.latestEducation?.start_date && profileInfo?.latestEducation?.end_date
                              ? formatDateRange(profileInfo.latestEducation.start_date, profileInfo.latestEducation.end_date)
                              : "Start and end date not added"
                          }
                        // location="Grade not added"
                        />
                      </div>


                      <div className="lg:col-span-1 md:col-span-2 mt-6 lg:mt-0" data-aos="fade-left" data-aos-duration="1500">
                        <h2 className="md:mb-1 lg:mb-2 lg:text-lg md:text-[14px] font-semibold text-[#000000E6]">
                          Top Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {profileInfo?.topSkills?.data.length > 0 ? (
                            <SkillTag
                              // key={index}
                              skills={profileInfo?.topSkills?.data}
                              // variant={item.variant}
                              limit={3}

                            />
                          ) : (<p className="w-full bg-yellow-50 text-yellow-800 text-sm p-2 rounded-md border border-yellow-200 shadow-sm">
                            🚀 No skills added yet. Verify your education and update your skills to
                            showcase your expertise!
                          </p>)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div >

                  <PersonalInformation formData={formData} handleChange={handleChange} countryList={transformedData.countryList}
                    handleSelectChange={handleLocationSelectChange} stateList={transformedData.stateList}
                    citiesList={transformedData.citiesList} setFormData={setFormData} handleSubmit={handleProfileUpdate}
                    loading={loading} error={errors} setErrors={setErrors} isExtended={isExtended} setIsExtended={setIsExtended} />

                </div>
                <div className="space-y-4 bg-gray-50" >
                  <CommonSection title="EDUCATION" buttonText="Add Education"
                    emptyStateTitle="No Education Records" emptyStateDescription="Add your education history to enhance your profile"
                    logo="/Img/Profile/Frame.png" handleOpenModal={() => handleOpenModal('education')}
                    type="education" onEdit={handleEdit} onDelete={handleDelete} data={educationData}
                    loadingStates={loadingStates} />

                  <CommonSection title="EXPERIENCE" buttonText="Add Experience" emptyStateTitle="No Experience Added"
                    emptyStateDescription="Add your Experience history to enhance your profile"
                    logo="/Img/Profile/Frame (1).png" handleOpenModal={() => handleOpenModal('experience')}
                    type="experience" onEdit={handleEdit} onDelete={handleDelete} data={experienceData}
                    loadingStates={loadingStates} />

                  {/* <CommonSection title="PROJECTS" buttonText="Add Projects" emptyStateTitle="No Projects Added"
                  emptyStateDescription="Add your Projects history to enhance your profile" logo="/Img/Profile/fi_1336494.png"
                  handleOpenModal={() => handleOpenModal('projects')} type="projects" onEdit={handleEdit}
                  onDelete={handleDelete} data={projectData || []} loadingStates={loadingStates} /> */}




                  <div>

                    <div className='bg-white p-2'>
                      <div className="flex items-center justify-between mb-6 ">
                        <h2 className="md:text-sm text-xs font-semibold tracking-wide text-gray-800 uppercase">
                          PROJECTS
                        </h2>
                        <Button
                          onClick={() => handleOpenModal('projects')}
                          icon={<GoPlus />}
                          className="hover:scale-105 transition-transform duration-200"
                        > Add Projects </Button>
                      </div>


                      <div>
                        {projectData?.length > 0 ? (
                          <div className="relative">
                            <Swiper
                              modules={[Navigation]}
                              onBeforeInit={(swiper) => {
                                // attach refs before swiper initializes
                                swiper.params.navigation.prevEl = prevRef.current;
                                swiper.params.navigation.nextEl = nextRef.current;
                              }}
                              navigation={{
                                prevEl: prevRef.current,
                                nextEl: nextRef.current,
                              }}
                              pagination={{ clickable: true }}
                              spaceBetween={20}
                              slidesPerView={slidesPerView2}
                              className="mySwiper md:w-full w-96"
                            >
                              {projectData?.map((ele, index) => (
                                <SwiperSlide key={index}>
                                  <CertificateCard
                                    certificateName={ele?.name} companyName={ele?.company_id?.name} instituteName={ele?.institution_id?.name} description={ele?.description}
                                    date={convertTimestampToDate(ele?.issue_date)}
                                    certificateUrlOrNumber={ele?.file_url} imageUrl={ele?.media_url ? ele?.media_url : "/Img/Profile/fi_1336494.png"} record={ele}
                                    isAction={true} onEdit={handleEdit} type="projects" isLoading={loading} onDelete={handleDelete}
                                  />
                                </SwiperSlide>
                              ))}
                            </Swiper>

                            <button
                              ref={prevRef}
                              className="custom-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-100"
                            >
                              <BiChevronLeft className="w-6 h-6 text-gray-700" />
                            </button>
                            <button
                              ref={nextRef}
                              className="custom-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-100"
                            >
                              <BiChevronRight className="w-6 h-6 text-gray-700" />
                            </button>

                          </div>
                        ) : (
                          <div className="px-6 py-5 text-center border-2 border-gray-300 border-dashed rounded-lg bg-[#FBFBFB] hover:border-blue-300 transition-colors duration-300">
                            <div className="flex items-center justify-center mx-auto mb-4">
                              <img src={`/Img/Profile/Frame (2).png`} alt='' className="hover:scale-110 transition-transform duration-300" />
                            </div>
                            <h3 className="mb-2 text-[20px]  font-semibold text-[#000000E6]">
                              {`No Projects added`}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {`Add your projects to build a comprehensive profile`}
                            </p>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>





                  <div>

                    <div className='bg-white p-2'>
                      <div className="flex items-center justify-between mb-6 ">
                        <h2 className="md:text-sm text-xs font-semibold tracking-wide text-gray-800 uppercase">
                          Certificate
                        </h2>
                        <Button
                          onClick={() => handleOpenModal('certifications')}
                          icon={<GoPlus />}
                          className="hover:scale-105 transition-transform duration-200"
                        > Add Certificate</Button>
                      </div>


                      <div>
                        {certificationData?.length > 0 ? (
                          <div className="relative">

                            <Swiper
                              modules={[Navigation]}
                              // navigation
                              onBeforeInit={(swiper) => {
                                swiper.params.navigation.prevEl = prevRef2.current;
                                swiper.params.navigation.nextEl = nextRef2.current;
                              }}
                              navigation={{
                                prevEl: prevRef2.current,
                                nextEl: nextRef2.current,
                              }}
                              pagination={{ clickable: true }}
                              spaceBetween={20}
                              slidesPerView={slidesPerView}
                              className="mySwiper md:w-full w-96"
                            >
                              {certificationData?.map((ele, index) => (
                                <SwiperSlide key={index}>
                                  <CertificateCard
                                    certificateName={ele?.name} issueBy={ele?.issuing_organization} description={ele?.description}
                                    date={convertTimestampToDate(ele?.issue_date)}
                                    certificateUrlOrNumber={ele?.credential_url} imageUrl={ele?.media_url ? ele?.media_url : "/Img/Profile/Frame (2).png"} record={ele}
                                    isAction={true} onEdit={handleEdit} type="certifications" isLoading={loading} onDelete={handleDelete}
                                    profileInfo={profileInfo} sharePost={sharePost}
                                  />
                                </SwiperSlide>
                              ))}
                            </Swiper>

                            <button
                              ref={prevRef2}
                              className="custom-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-100"
                            >
                              <BiChevronLeft className="w-6 h-6 text-gray-700" />
                            </button>
                            <button
                              ref={nextRef2}
                              className="custom-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-100"
                            >
                              <BiChevronRight className="w-6 h-6 text-gray-700" />
                            </button>
                          </div>
                        ) : (
                          <div className="px-6 py-5 text-center border-2 border-gray-300 border-dashed rounded-lg bg-[#FBFBFB] hover:border-blue-300 transition-colors duration-300">
                            <div className="flex items-center justify-center mx-auto mb-4">
                              <img src={`/Img/Profile/Frame (2).png`} alt='' className="hover:scale-110 transition-transform duration-300" />
                            </div>
                            <h3 className="mb-2 text-[20px]  font-semibold text-[#000000E6]">
                              {`No Certifications added`}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {`Add your certifications to build a comprehensive profile`}
                            </p>
                          </div>
                        )}
                      </div>


                    </div>

                  </div>



                </div>
              </div>
            </div>
          </div>
          <div className="xl:w-[25%] lg:w-[30%] md:w-[40%] md:block hidden mt-1 " >
            <div className="sticky top-4 h-fit max-h-[calc(100vh-2rem)] overflow-y-auto hide-scrollbar">
              <PeopleToConnect data={data?.data?.list || []} handleConnect={handleConnect} setFormData={setFormData} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </div>
        </div>
      </div>

      <AddEducationModal modalState={modalState} handleClose={handleClose} formData={formData}
        loading={loading} skillsList={transformedData.skillsList} collegeList={transformedData.collegeList}
        errors={errors} handleChange={handleChange} handleSelectChange={handleSelectChange}
        degreeList={transformedData.degreeList} fieldsOfStudyList={transformedData.fieldsOfStudyList}
        onSubmit={handleEducationSubmit} setFormData={setFormData} allSkills={allSkills || []} setAddModalState={setAddModalState}
        setInputFields={setInputFields}
        isCreatedByUser={isCreatedByUser}
        isCreatedByUserForFields={isCreatedByUserForFields}
        isCreatedByUserForIndustry={isCreatedByUserForIndustry}
      />

      <AddExperience modalState={modalState} handleClose={handleClose} getSelectedOption={getSelectedOption}
        formData={formData} handleSelectChange={handleSelectChange}
        allCompanies={transformedData.allCompanies} allIndustry={transformedData.allIndustry}
        allProfile={transformedData.allProfile} allWorkSkill={transformedData.allWorkSkill}
        error={errors} handleSubmit={handleWorkExperienceSubmit} handleChange={handleChange} setFormData={setFormData}
        allSkills={allWorkSkills || []} setAddModalState={setAddModalState}
        setInputFields={setInputFields}
        isCreatedByUserForIndustry={isCreatedByUserForIndustry}
        isCreatedByUserFor={isCreatedByUserFor}
        skillForProfileRoleId={skillForProfileRoleId} loading={loading}

      />

      <AddProject modalState={modalState} handleClose={handleClose} collegeList={transformedData.collegeList}
        formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange}
        handleSubmit={handleProjectSubmit} error={errors} companyList={transformedData?.allCompanies} setFormData={setFormData}
        handleFileUpload={handleFileUpload} setAddModalState={setAddModalState} loading={loading} handleFileDelete={handleFileDelete}
        setInputFields={setInputFields}
      />

      <AddCertificate modalState={modalState} handleClose={handleClose} formData={formData} handleChange={handleChange}
        error={errors} masterSkillsList={transformedData.masterSkillsList} handleSubmit={handleCertificationSubmit}
        handleFileUpload={handleFileUpload} setFormData={setFormData} setError={setErrors} handleFileDelete={handleFileDelete}
        setAddModalState={setAddModalState} loading={loading} setInputFields={setInputFields}
      />

      <Modal
        isOpen={addModalState.isOpen}
        title={`Add ${addModalState.type}`}
        onClose={() => {
          setAddModalState({ isOpen: false, type: '', field: '' });
          setInputFields({ name: "", logo_url: "" });
        }}
        handleSubmit={handleAddItem}
        loading={loading}
      >
        <div className='space-y-3'>
          <CustomInput
            className="w-full h-10"
            label="Enter Name"
            required
            placeholder="Enter name"
            value={inputFields?.name}
            onChange={(e) => setInputFields(prev => ({ ...prev, name: e.target.value }))}
          />
          {(addModalState.type === 'Add company' || addModalState.type === "Add companies") && (
            <CustomFileInput
              value={inputFields?.logo_url}
              required
              label='Logo'
              onChange={(file) => handleFileUpload2(file)}
            />

          )}
        </div>
      </Modal>
    </>
  );
};

export default Profile;