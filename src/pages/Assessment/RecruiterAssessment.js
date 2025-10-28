import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BiCalendar, BiEdit, BiSearch } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';
import Button from '../../components/ui/Button/Button';
import { toast } from 'sonner';
import useFormHandler from '../../components/hooks/useFormHandler';
import Modal from '../../components/ui/Modal/Modal';
import AlertModal from '../../components/ui/Modal/AlertModal';
import CustomInput from '../../components/ui/Input/CustomInput';
import FilterSelect from '../../components/ui/Input/FilterSelect';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  PiPlus, PiWarning, PiCheck, PiTrash, PiX, PiPencil, PiToggleLeft, PiToggleRight,
  PiDownloadBold
} from 'react-icons/pi';
import {
  assessmentsList,
  assessmentsSingleDocList,
  assessmentsCreate,
  assessmentsUpdate,
  assessmentsDelete,
  assessmentsEnableDisable,
  getALLCoursesDocList
} from '../../redux/assessments/assessmentSlice';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { GoClock } from 'react-icons/go';
import { BsBarChartLine, BsTrash2 } from 'react-icons/bs';
import { masterLevel, masterSkills, updateMasterSkillData } from '../../redux/Global Slice/cscSlice';
import moment from 'moment-timezone';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { addOneData } from '../../redux/Users/userSlice';
import { arrayTransform } from '../../components/utils/globalFunction';
// import { updateSkillsData } from '../../redux/education/educationSlice';


const initialFormData = {
  title: "",
  description: "",
  material_url: "",
  course_id: null,
  skill_ids: [],
  level_id: "",
  no_of_questions: 0,
  verification_type: "auto",
  time_limit: 1,
  passing_score: 100,
  max_attempts: 1,
  questions: []
};

const initialQuestionData = {
  question: "",
  question_type: "",
  options: [],
  option_format: "",
  correct_options: [],
  verification_type: "auto",
  time_limit: 1,
  currentOption: ""
};

const questionTypes = [
  { value: 'single_choice', label: 'Single Choice' },
  { value: 'multi_choice', label: 'Multiple Choice' }
];

const optionFormats = [
  { value: 'alphabetically', label: 'Alphabetically' },
  { value: 'numerical', label: 'Numerically' },
  { value: 'checked', label: 'Bullet Points' }
];
const MAX_VISIBLE_SKILLS = 3;

const AssessmentCard = ({ assessment, onEdit, onDelete, onStatusChange }) => {
  const [expandedSkills, setExpandedSkills] = useState(false);
  const toggleSkills = () => {
    setExpandedSkills(prev => !prev);
  };

  const visibleSkills = expandedSkills ? assessment.skill_ids : assessment.skill_ids.slice(0, MAX_VISIBLE_SKILLS);
  const remainingCount = assessment.skill_ids.length - MAX_VISIBLE_SKILLS;

  return (
    <div className="glassy-card rounded-xl shadow-sm border border-gray-200 p-4 mx-auto w-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 w-full">
          <img
            src={assessment.action_by.profile_picture_url}
            alt={`${assessment.action_by.first_name} ${assessment.action_by.last_name}`}
            className="w-14 h-14 object-cover"
          />
          <div>
            <h3 className="font-semibold glassy-text-primary text-lg">
              {`${assessment.action_by.first_name} ${assessment.action_by.last_name}`}
            </h3>
            <p className="text-sm glassy-text-secondary flex items-center">
              <BiCalendar size={14} className="mr-1" />
              {moment(assessment.updatedAt).format("DD MM YYYY")}
            </p>
          </div>
        </div>
        {assessment.material_url && (
          <button
            className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2.5 px-4 rounded-xl border border-blue-200 transition-colors flex items-center justify-center space-x-2 W-24 gap-2"
            onClick={() => window.open(assessment.material_url, '_blank')}
          >
            Guide<PiDownloadBold size={23} />
          </button>
        )}
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
        <h3 className="font-semibold glassy-text-primary text-lg mb-1">
          {assessment.title}
        </h3>
        <div className="flex mb-2 flex-row md:items-center gap-2 mt-2 md:mt-0">
          <p className="text-[#5D5FEF] text-[14px] font-[400] flex items-center gap-2">
            {assessment.passing_score}% Passing Score
          </p>
          {assessment.assessmentTaken > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {assessment.assessmentTaken} Taken
            </span>
          )}
        </div>
      </div>


      <div className="flex flex-wrap gap-2 mb-4">
        <span className="flex items-center text-xs space-x-1 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
          <HiOutlineClipboardList className="w-4 h-4 text-gray-600" />
          <span className="text-gray-600">{assessment.no_of_questions} Questions</span>
        </span>
        <span className="flex items-center text-xs space-x-1 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
          <GoClock className="w-4 h-4 text-gray-600" />
          <span className="text-gray-600">{assessment.time_limit} mins</span>
        </span>
        <span className="flex items-center text-xs space-x-1 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
          <BsBarChartLine className="w-4 h-4 text-gray-600" />
          <span className="text-gray-600">{assessment.level_id?.name || 'N/A'}</span>
        </span>
      </div>
      <div className=''>
        <p className="text-[#6B6B6B] text-[14px] font-[400] line-clamp-2">
          {assessment.description}
        </p>
      </div>

      <div className="my-4">
        <div className="flex flex-wrap gap-2">
          {visibleSkills.map((skill, index) => (
            <span
              key={skill._id || index}
              className="px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200"
            >
              {skill.name}
            </span>
          ))}
          {remainingCount > 0 && !expandedSkills && (
            <button
              className="px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200 hover:bg-gray-100"
              onClick={toggleSkills}
            >
              +{remainingCount}
            </button>
          )}
          {expandedSkills && remainingCount > 0 && (
            <button
              className="px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200 hover:bg-gray-100"
              onClick={toggleSkills}
            >
              Show less
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <div className="flex space-x-3">
          <button
            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2.5 px-4 rounded-xl border border-blue-200 transition-colors flex items-center justify-center space-x-2"
            onClick={() => onEdit(assessment)}
          >
            <BiEdit size={16} />
            <span>Edit</span>
          </button>
          <button
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2.5 px-4 rounded-xl border border-red-200 transition-colors flex items-center justify-center space-x-2"
            onClick={() => onDelete(assessment._id)}
          >
            <BsTrash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
        <div className='flex space-x-3 justify-between'>
          <button
            onClick={() => onStatusChange(assessment)}
            className={`flex items-center justify-center px-4 py-2.5 rounded-xl border transition-colors ${assessment.isDisable ? 'bg-gray-100 border-gray-200 hover:bg-gray-200' : 'bg-green-100 border-green-200 hover:bg-green-200'}`}
          >
            {assessment.isDisable ? (
              <PiToggleLeft className="w-6 h-6 text-gray-600" />
            ) : (
              <PiToggleRight className="w-6 h-6 text-green-600" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
const AssessmentCardSkeleton = () => {
  return (
    <div className="glassy-card rounded-xl shadow-sm border border-gray-200 p-4 w-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 w-full">
          <Skeleton circle width={56} height={56} />
          <div className="flex flex-col gap-2 w-full">
            <Skeleton width={150} height={16} />
            <Skeleton width={100} height={14} />
          </div>
        </div>
        <Skeleton width={80} height={36} borderRadius={12} />
      </div>
      <div className="flex items-center justify-between mb-3">
        <Skeleton width={200} height={18} />
        <Skeleton width={50} height={20} />
      </div>
      <div className="flex gap-2 mb-4">
        <Skeleton width={100} height={24} borderRadius={999} />
        <Skeleton width={80} height={24} borderRadius={999} />
        <Skeleton width={90} height={24} borderRadius={999} />
      </div>
      <Skeleton count={2} height={14} className="mb-4" />
      <div className="flex flex-wrap gap-2 mb-4">
        {[1, 2, 3].map((_, i) => (
          <Skeleton key={i} width={70} height={20} borderRadius={999} />
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Skeleton height={40} className="flex-1" borderRadius={12} />
        <Skeleton height={40} className="flex-1" borderRadius={12} />
        <Skeleton width={48} height={40} borderRadius={12} />
      </div>
    </div>
  );
};

const RecruiterAssessment = () => {
  const dispatch = useDispatch();
  const selector = useSelector(state => state.assessments);
  const selector2 = useSelector(state => state.global)

  const skillList = arrayTransform(selector2?.masterSkillsData?.data?.data?.list)
  const levelList = arrayTransform(selector2?.masterLevelData?.data?.data?.list)




  const { getAssessmentsListData } = selector || {};
  const [assessments, setAssessments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [, setIsSubmitting] = useState(false);
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isStatusModal, setIsStatusModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  // Data states
  const [skills ] = useState([]);
  const [levels] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [modalData, setModalData] = useState({
    type: '',
    data: null,
  });


  const [inputFields, setInputFields] = useState({
    name: "", logo_url: ""
  })

  const [questionModalData, setQuestionModalData] = useState({
    type: '',
    data: null,
    index: null
  });
  const [addModalState, setAddModalState] = useState({
    isOpen: false,
    type: '',
    field: ''
  });
  const { formData, handleChange, setFormData, errors, setErrors, resetForm } = useFormHandler(initialFormData);
  const [questionFormData, setQuestionFormData] = useState(initialQuestionData);
  const [questionErrors, setQuestionErrors] = useState({});
  const [postsPerPage] = useState(8);
  const [totalPosts, setTotalPosts] = useState(0);

  const fetchAssessmentsList = useCallback(async (page = 1, search = '') => {
    const apiPayload = {
      page,
      size: postsPerPage,
      keyWord: search,
      select: "title description skill_ids level_id no_of_questions isDisable updatedAt",
      populate: "skill_ids:name,level_id:name"
    };
    try {
      setIsLoading(true);
      const response = await dispatch(assessmentsList(apiPayload)).unwrap();
      if (response?.total) {
        setTotalPosts(response.total);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch assessments");
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, postsPerPage]);



  const fetchSkillsAndLevels = useCallback(async () => {
    try {
      const [coursesData] = await Promise.all([
        dispatch(masterSkills()),
        dispatch(masterLevel()),
        dispatch(getALLCoursesDocList()).unwrap(),
      ]);

      // setSkills(skillsData?.data?.list || []);
      // setLevels(levelsData?.data?.list || []);
      setAllCourses(coursesData?.data?.list || []);
    } catch (error) {
      toast.error("Failed to load skills or levels");
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAssessmentsList(currentPage, searchTerm);
    fetchSkillsAndLevels();
  }, [currentPage, fetchAssessmentsList, fetchSkillsAndLevels, searchTerm]);

  useEffect(() => {
    if (getAssessmentsListData?.data?.data?.list) {
      setAssessments(getAssessmentsListData?.data?.data?.list);
    }
  }, [getAssessmentsListData]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }
    const description = formData.description?.trim();
    if (!description) {
      newErrors.description = "Description is required";
    } else if (description.length < 5 || description.length > 500) {
      newErrors.description = "Description must be between 5 to 500 characters";
    }
    if (!Array.isArray(formData.skill_ids) || formData.skill_ids.length === 0) {
      newErrors.skill_ids = "At least one skill is required";
    }
    if (!formData.level_id) {
      newErrors.level_id = "Level is required";
    }
    if (typeof formData.no_of_questions !== "number" || formData.no_of_questions <= 0) {
      newErrors.no_of_questions = "Number of questions must be greater than 0";
    }
    if (typeof formData.max_attempts !== "number" || formData.max_attempts <= 0) {
      newErrors.max_attempts = "Max attempts must be greater than 0";
    }
    if (formData.max_attempts < formData.no_of_questions) {
      newErrors.max_attempts = "Max attempts should not be less than number of questions";
    }
    if (!Array.isArray(formData.questions) || formData.questions.length !== formData.no_of_questions) {
      newErrors.questions = `Please add all ${formData.no_of_questions} questions`;
    }
    // if (
    //   typeof formData.passing_score !== "number" ||
    //   formData.passing_score < 0 ||
    //   formData.passing_score > 100
    // ) {
    //   newErrors.passing_score = "Passing score must be between 0 and 100";
    // }

    return newErrors;
  }, [formData]);


  const validateQuestionForm = useCallback(() => {
    const newErrors = {};
    if (!questionFormData.question?.trim()) {
      newErrors.question = "Question is required";
    }

    if (!questionFormData.question_type) {
      newErrors.question_type = "Question type is required";
    }

    if (questionFormData.options.length < 2) {
      newErrors.options = "At least 2 options are required";
    }

    if (questionFormData.correct_options.length === 0) {
      newErrors.correct_options = "At least one correct option is required";
    }

    if (!questionFormData.option_format) {
      newErrors.option_format = "Option format is required";
    }

    if (!questionFormData.time_limit || questionFormData.time_limit <= 0) {
      newErrors.time_limit = "Time limit must be at least 1 minute";
    } else if (questionFormData.time_limit > 5) {
      newErrors.time_limit = "Time limit cannot exceed 5 minutes";
    }

    return newErrors;
  }, [questionFormData]);

  const handleOpenModal = useCallback(() => {
    setModalData({ type: 'add', data: null });
    resetForm();
    setIsModalOpen(true);
  }, [resetForm]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setModalData({ type: '', data: null });
    resetForm();
    setErrors({});
  }, [resetForm, setErrors]);

  const handleOpenQuestionModal = useCallback((index = null) => {
    if (index !== null) {
      setQuestionModalData({
        type: 'edit',
        data: formData.questions[index],
        index
      });
      setQuestionFormData(formData.questions[index]);
    } else {
      setQuestionModalData({
        type: 'add',
        data: null,
        index: null
      });
      setQuestionFormData(initialQuestionData);
    }
    setIsQuestionModalOpen(true);
  }, [formData.questions]);

  const handleCloseQuestionModal = useCallback(() => {
    setIsQuestionModalOpen(false);
    setQuestionModalData({ type: '', data: null, index: null });
    setQuestionFormData(initialQuestionData);
    setQuestionErrors({});
  }, []);

  const handleEdit = useCallback(async (assessment) => {
    try {
      setIsLoading(true);
      const res = await dispatch(assessmentsSingleDocList({ _id: assessment._id })).unwrap();
      const course = allCourses.find(c => c._id === res.data.course_id);
      const level = levels.find(l => l._id === res.data.level_id);

      setModalData({ type: 'edit', data: res.data });
      setFormData({
        ...res.data,
        _id: res.data._id,
        course_id: course ? {
          value: course._id,
          label: course.name
        } : null,
        skill_ids: res.data.skill_ids.map(skillId => {
          const skill = skills.find(s => s._id === skillId) ||
            course?.skill_ids?.find(s => s._id === skillId);
          return {
            value: skillId,
            label: skill?.name || skillId
          };
        }),
        level_id: level ? {
          value: level._id,
          label: level.name
        } : {
          value: res.data.level_id,
          label: 'Unknown Level'
        },
        questions: res.data.questions.map(question => ({
          ...question,
          question_type: questionTypes.find(qt => qt.value === question.question_type) || {
            value: question.question_type,
            label: question.question_type === 'single_choice' ? 'Single Choice' : 'Multiple Choice'
          },
          option_format: optionFormats.find(of => of.value === question.option_format) || {
            value: question.option_format,
            label: question.option_format.charAt(0).toUpperCase() + question.option_format.slice(1)
          }
        }))
      });
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to load assessment details");
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, setFormData, skills, levels, allCourses]);

  const handleDelete = useCallback((assessmentId) => {
    setModalData({ type: 'delete', data: assessmentId });
    setIsDeleteModal(true);
  }, []);

  const handleStatusChange = useCallback((assessment) => {
    setModalData({ type: 'status', data: assessment });
    setIsStatusModal(true);
  }, []);

  const handleAddQuestion = useCallback(() => {
    if (formData.no_of_questions <= 0) {
      toast.error("Please set number of questions first");
      return;
    }
    handleOpenQuestionModal();
  }, [formData.no_of_questions, handleOpenQuestionModal]);

  const handleQuestionSubmit = useCallback(() => {
    const validationErrors = validateQuestionForm();
    if (Object.keys(validationErrors).length > 0) {
      setQuestionErrors(validationErrors);
      toast.error("Please fix the validation errors");
      return;
    }

    const newQuestion = {
      question: questionFormData.question.trim(),
      question_type: questionFormData.question_type,
      options: questionFormData.options,
      option_format: questionFormData.option_format,
      correct_options: questionFormData.correct_options,
      verification_type: "auto",
      time_limit: questionFormData.time_limit
    };

    if (questionModalData.type === 'edit' && questionModalData.index !== null) {
      const updatedQuestions = [...formData.questions];
      updatedQuestions[questionModalData.index] = newQuestion;
      setFormData(prev => ({
        ...prev,
        questions: updatedQuestions
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        questions: [...prev.questions, newQuestion]
      }));
    }

    handleCloseQuestionModal();
  }, [questionFormData, questionModalData, validateQuestionForm, formData.questions, setFormData, handleCloseQuestionModal]);

  const handleRemoveQuestion = useCallback((index) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  }, [formData.questions, setFormData]);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the validation errors");
      return;
    }

    const totalTime = formData.questions.reduce((sum, question) => sum + (question.time_limit || 1), 0);
    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        material_url: formData.material_url.trim(),
        course_id: formData.course_id?.value || null,
        skill_ids: formData.skill_ids.map(skill => skill.value),
        level_id: formData.level_id.value,
        no_of_questions: formData.no_of_questions,
        verification_type: formData.verification_type,
        time_limit: totalTime,
        passing_score: formData.passing_score,
        max_attempts: formData.max_attempts,
        questions: formData.questions.map(question => ({
          question: question.question.trim(),
          question_type: question.question_type.value,
          options: question.options,
          option_format: question.option_format.value,
          correct_options: question.correct_options,
          verification_type: "auto",
          time_limit: question.time_limit || 1
        }))
      };

      if (modalData.type === 'edit') {
        payload._id = modalData.data._id;
        const res = await dispatch(assessmentsUpdate(payload)).unwrap();
        toast.success(res?.message);
      } else {
        const res = await dispatch(assessmentsCreate(payload)).unwrap();
        toast.success(res?.message);
      }

      handleCloseModal();
      await fetchAssessmentsList(currentPage, searchTerm);
    } catch (error) {
      toast.error(error?.message || "An error occurred while saving");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    formData,
    modalData,
    validateForm,
    setErrors,
    dispatch,
    handleCloseModal,
    fetchAssessmentsList,
    currentPage,
    searchTerm
  ]);

  const handleStatusConfirm = useCallback(async () => {
    if (!modalData.data) return;

    try {
      setIsLoading(true);
      const res = await dispatch(assessmentsEnableDisable({
        _id: modalData.data._id,
        isDisable: !modalData.data.isDisable
      })).unwrap();
      toast.success(res?.message);
      await fetchAssessmentsList(currentPage, searchTerm);
    } catch (error) {
      toast.error(error?.message || 'Failed to update assessment status');
    } finally {
      setIsLoading(false);
      setIsStatusModal(false);
      setModalData({ type: '', data: null });
    }
  }, [modalData.data, dispatch, fetchAssessmentsList, currentPage, searchTerm]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!modalData.data) return;

    try {
      setIsLoading(true);
      const res = await dispatch(assessmentsDelete({ _id: modalData.data })).unwrap();
      toast.success(res?.message);
      await fetchAssessmentsList(currentPage, searchTerm);
    } catch (error) {
      toast.error(error?.message || 'Failed to delete assessment');
    } finally {
      setIsLoading(false);
      setIsDeleteModal(false);
      setModalData({ type: '', data: null });
    }
  }, [modalData.data, dispatch, fetchAssessmentsList, currentPage, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAssessmentsList(1, searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    fetchAssessmentsList(1);
  };

  const handleQuestionChange = (field, value) => {
    setQuestionFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (questionErrors[field]) {
      setQuestionErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSelectChange = (field, value) => {
    handleQuestionChange(field, value);
  };

  const addOption = () => {
    if (!questionFormData.currentOption.trim()) {
      setQuestionErrors(prev => ({
        ...prev,
        currentOption: "Option cannot be empty"
      }));
      return;
    }

    if (questionFormData.options.includes(questionFormData.currentOption.trim())) {
      setQuestionErrors(prev => ({
        ...prev,
        currentOption: "Option already exists"
      }));
      return;
    }

    setQuestionFormData(prev => ({
      ...prev,
      options: [...prev.options, prev.currentOption.trim()],
      currentOption: ""
    }));
  };

  const handleCurrentOptionKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addOption();
    }
  };

  const removeOption = (index) => {
    const optionToRemove = questionFormData.options[index];
    const updatedOptions = [...questionFormData.options];
    updatedOptions.splice(index, 1);

    setQuestionFormData(prev => ({
      ...prev,
      options: updatedOptions,
      correct_options: prev.correct_options.filter(opt => opt !== optionToRemove)
    }));
  };

  const toggleCorrectOption = (option) => {
    if (questionFormData.question_type?.value === 'single_choice') {
      setQuestionFormData(prev => ({
        ...prev,
        correct_options: [option]
      }));
    } else {
      setQuestionFormData(prev => {
        const isSelected = prev.correct_options.includes(option);
        return {
          ...prev,
          correct_options: isSelected
            ? prev.correct_options.filter(opt => opt !== option)
            : [...prev.correct_options, option]
        };
      });
    }
  };

  const selectJson = useMemo(() => ({
    questionTypes,
    optionFormats,
    skills: skills?.map(skill => ({ value: skill._id, label: skill.name })) || [],
    levels: levels?.map(level => ({ value: level._id, label: level.name })) || []
  }), [skills, levels]);



  const Pagination = () => {
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    const handlePageChange = (page) => {
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);
    };

    const getPageNumbers = () => {
      const pages = [];
      if (currentPage > 3) {
        pages.push(1);
      }
      if (currentPage > 4) {
        pages.push('start-ellipsis');
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 3) {
        pages.push('end-ellipsis');
      }
      if (currentPage < totalPages - 2) {
        pages.push(totalPages);
      }

      return pages;
    };

    return (
      <div className="flex items-center justify-between p-4">
        <div className="text-sm text-gray-600">
          Showing {(currentPage - 1) * postsPerPage + 1} to{' '}
          {Math.min(currentPage * postsPerPage, totalPosts)} of {totalPosts} posts
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded text-gray-700 hover:bg-gray-300 hover:glassy-text-primary disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            <FiChevronLeft size={18} />
          </button>
          {getPageNumbers().map((item, index) => {
            if (item === 'start-ellipsis' || item === 'end-ellipsis') {
              return (
                <span key={index} className="px-2 glassy-text-secondary">
                  ...
                </span>
              );
            }
            return (
              <button
                key={item}
                onClick={() => handlePageChange(item)}
                className={`w-8 h-8 rounded flex items-center justify-center transition ${currentPage === item
                  ? 'bg-blue-600 glassy-text-primary'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {item}
              </button>
            );
          })}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded text-gray-700 hover:bg-gray-300 hover:glassy-text-primary disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };



  const handleAddItem = async () => {
    try {
      let type = '';
      let updateAction = null;

      switch (addModalState.type) {
        case 'level':
          type = 'levels';
          updateAction = ''; // You might want to add a similar update action for companies
          break;
        case 'skill':
          type = 'skills';
          updateAction = updateMasterSkillData;
          break;
        default:
          return;
      }

      const res = await dispatch(addOneData({ type, ...inputFields })).unwrap();

      if (res?.message) {
        toast.info(res?.message)
      }
      if (addModalState.type === 'skill') {
        await dispatch(masterSkills());
      } else if (addModalState.type === 'level') {
        await dispatch(masterLevel());

      }

      setAddModalState({ isOpen: false, type: '', field: '' });
      setInputFields({ name: "", logo_url: "" });

    } catch (error) {
      // Handle error
      console.error('Error adding item:', error);
      // toast.error(error || 'Failed to add item');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen px-4 lg:px-6 md:py-6 py-2">
      <div className="w-full mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold glassy-text-primary">Assessments</h1>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <form onSubmit={handleSearch} className="relative w-full sm:w-80">
              <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search assessments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <IoClose size={18} />
                </button>
              )}
            </form>
          </div>
        </div>

        <div className="flex justify-end items-center mb-6">
          <div className="flex items-center gap-2">
            <Button
              onClick={handleOpenModal}
              className="flex items-center gap-2"
            >
              Create Assessment
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className='grid md:grid-cols-2 grid-cols-1 gap-6'>
            <AssessmentCardSkeleton />
            <AssessmentCardSkeleton />
            <AssessmentCardSkeleton />
            <AssessmentCardSkeleton />
          </div>
        ) : assessments.length > 0 ? (
          <>
            <Pagination />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {assessments.map((assessment) => (
                <AssessmentCard
                  key={assessment._id}
                  assessment={assessment}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="glassy-card rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <HiOutlineClipboardList className="mx-auto w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium glassy-text-primary mb-2">No assessments found</h3>
            <p className="glassy-text-secondary mb-6">
              {searchTerm ?
                "Try adjusting your search query" :
                "Create your first assessment to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Status Change Modal */}
      <AlertModal
        isOpen={isStatusModal}
        title={
          <div className="flex items-center gap-2">
            <PiWarning className="text-yellow-500" />
            <span>
              {modalData.data?.isDisable ? 'Enable' : 'Disable'} Assessment
            </span>
          </div>
        }
        message={`Are you sure you want to ${modalData.data?.isDisable ? 'enable' : 'disable'} "${modalData.data?.title}"?`}
        onCancel={() => {
          setIsStatusModal(false);
          setModalData({ type: '', data: null });
        }}
        onConfirm={handleStatusConfirm}
        confirmText={modalData.data?.isDisable ? 'Enable' : 'Disable'}
        cancelText="Cancel"
        type="warning"
      />

      {/* Delete Modal */}
      <AlertModal
        isOpen={isDeleteModal}
        title={
          <div className="flex items-center gap-2">
            <PiWarning className="text-red-500" />
            <span>Delete Assessment</span>
          </div>
        }
        message="Are you sure you want to delete this assessment? This action cannot be undone."
        onCancel={() => {
          setIsDeleteModal(false);
          setModalData({ type: '', data: null });
        }}
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Main Assessment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        handleSubmit={handleSubmit}
        title={modalData.type === 'edit' ? "Edit Assessment" : "Add New Assessment"}
      >
        <div className=" max-h-[65vh]">
          <div className="grid grid-cols-1 gap-6">
            <CustomInput
              className="w-full h-10"
              label="Title *"
              value={formData?.title}
              name="title"
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter assessment title"
              error={errors.title}
              maxLength={100}
              fullWidth
            />

            <CustomInput
              className="w-full h-10"
              type="textarea"
              label="Description *"
              value={formData?.description}
              name="description"
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter assessment description"
              error={errors.description}
              rows={4}
            />

            <CustomInput
              className="w-full h-10"
              type="text"
              label="Material URL *"
              value={formData?.material_url}
              name="material_url"
              onChange={(e) => handleChange("material_url", e.target.value)}
              placeholder="Enter assessment material_url"
              error={errors.material_url}
            />

            <FilterSelect
              options={skillList}
              label="Skills *"
              selectedOption={formData.skill_ids}
              onChange={(val) => handleChange("skill_ids", val)}
              isMulti
              placeholder="Select skills..."
              error={errors.skill_ids}
              isRequired
              onCreateOption={(inputValue, field) => {
                setAddModalState({
                  isOpen: true,
                  type: 'skill',
                  field: field
                });
              }}
              isClearable={true}
            />

            <FilterSelect
              options={levelList}
              label="Level *"
              selectedOption={formData.level_id}
              onChange={(val) => handleChange("level_id", val)}
              placeholder="Select level..."
              error={errors.level_id}
              isRequired
              isClearable={true}
              onCreateOption={(inputValue, field) => {
                setAddModalState({
                  isOpen: true,
                  type: 'level',
                  field: field
                });
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CustomInput
                className="w-full h-10"
                type="number"
                label="Number of Questions *"
                value={formData?.no_of_questions}
                name="no_of_questions"
                onChange={(e) => handleChange("no_of_questions", parseInt(e.target.value) || 0)}
                placeholder="Enter number of questions"
                error={errors.no_of_questions}
                min="1"
              />

              <CustomInput
                className="w-full h-10"
                type="number"
                label="Passing Score % *"
                value={formData?.passing_score || "100"}
                name="passing_score"
                onChange={(e) => handleChange("passing_score", e.target.value)}
                placeholder="Enter passing score"
                error={errors.passing_score}
                min="1"
                maxLength={100}
              />

              <CustomInput
                className="w-full h-10"
                type="number"
                label="Max Attempts *"
                value={formData?.max_attempts}
                name="max_attempts"
                onChange={(e) => handleChange("max_attempts", parseInt(e.target.value) || 1)}
                placeholder="Enter max attempts"
                error={errors.max_attempts}
                min="1"
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Questions ({formData.questions.length}/{formData.no_of_questions})
                </h3>
                <Button
                  type="button"
                  onClick={handleAddQuestion}
                  disabled={formData.questions.length >= formData.no_of_questions}
                  size="sm"
                >
                  Add Question
                </Button>
              </div>

              {errors.questions && (
                <p className="text-red-500 text-sm mb-4">{errors.questions}</p>
              )}

              {formData.questions.length > 0 ? (
                <div className="space-y-4">
                  {formData.questions.map((question, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{index + 1}. {question.question}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Type: {question.question_type?.label || question.question_type}
                          </p>
                          <p className="text-sm text-gray-600">
                            Correct Options: {question.correct_options.join(', ')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenQuestionModal(index)}
                            icon={<PiPencil className="w-4 h-4" />}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveQuestion(index)}
                            icon={<PiTrash className="w-4 h-4 text-red-500" />}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 glassy-text-secondary">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <PiPlus className="w-8 h-8 text-gray-400" />
                  </div>
                  <p>No questions added yet</p>
                  <p className="text-sm">Add questions for this assessment</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Question Modal */}
      <Modal
        isOpen={isQuestionModalOpen}
        onClose={handleCloseQuestionModal}
        handleSubmit={handleQuestionSubmit}
        title={questionModalData.type === 'edit' ? "Edit Question" : "Add Question"}
        icon={questionModalData.type === 'edit' ? <PiPencil className="w-4 h-4" /> : <PiCheck className="w-4 h-4" />}
        buttonLabel={questionModalData.type === 'edit' ? 'Update Question' : 'Add Question'}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <CustomInput
              className="w-full h-10"
              type="textarea"
              label="Question *"
              name="question"
              value={questionFormData.question}
              onChange={(e) => handleQuestionChange("question", e.target.value)}
              error={questionErrors.question}
              placeholder="Enter your question here..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <FilterSelect
              options={selectJson.questionTypes}
              label="Question Type *"
              selectedOption={questionFormData.question_type}
              onChange={(val) => handleSelectChange('question_type', val)}
              placeholder="Select question type..."
              error={questionErrors.question_type}
              isRequired
            />
          </div>

          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-lg font-semibold glassy-text-primary flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Answer Options
            </h3>

            <div className="space-y-2">
              <div className="flex gap-3 justify-start items-center">
                <div className="flex-1">
                  <CustomInput
                    className="w-full h-10"
                    label="Add Option"
                    value={questionFormData.currentOption}
                    onChange={(e) => handleQuestionChange("currentOption", e.target.value)}
                    onKeyPress={handleCurrentOptionKeyPress}
                    placeholder="Type an option and press Enter or click Add"
                    error={questionErrors.currentOption}
                  />
                </div>
                <button
                  type="button"
                  className='bg-blue-500 glassy-text-primary w-8 h-8 flex justify-center items-center rounded-full hover:bg-blue-600 transition-colors'
                  onClick={addOption}
                >
                  <PiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {questionFormData.options.length > 0 ? (
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700">
                  Options ({questionFormData.options.length})
                  <span className="glassy-text-secondary ml-2">
                    {questionFormData.question_type?.value === 'single_choice'
                      ? '(Select one correct answer)'
                      : '(Select one or more correct answers)'}
                  </span>
                </div>

                <div className="grid gap-3">
                  {questionFormData.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${questionFormData.correct_options.includes(opt)
                        ? 'bg-green-50 border-green-200'
                        : 'glassy-card border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type={questionFormData.question_type?.value === 'single_choice' ? 'radio' : 'checkbox'}
                          checked={questionFormData.correct_options.includes(opt)}
                          onChange={() => toggleCorrectOption(opt)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          name={questionFormData.question_type?.value === 'single_choice' ? 'correct-option' : `correct-option-${idx}`}
                        />
                        <span className="flex-1 glassy-text-primary">
                          {idx + 1}. {opt}
                        </span>
                        {questionFormData.correct_options.includes(opt) && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                            <PiCheck className="w-3 h-3" />
                            Correct
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeOption(idx)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                      >
                        <PiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 glassy-text-secondary">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <PiPlus className="w-8 h-8 text-gray-400" />
                </div>
                <p>No options added yet</p>
                <p className="text-sm">Add options for this question above</p>
              </div>
            )}

            {questionErrors.options && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <PiX className="w-4 h-4" />
                {questionErrors.options}
              </p>
            )}
            {questionErrors.correct_options && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <PiX className="w-4 h-4" />
                {questionErrors.correct_options}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FilterSelect
                options={selectJson.optionFormats}
                label="Option Format *"
                selectedOption={questionFormData.option_format}
                onChange={(val) => handleSelectChange('option_format', val)}
                placeholder="Select option format..."
                error={questionErrors.option_format}
                isRequired
              />
              <CustomInput
                className="w-full h-10"
                type="number"
                label="Time Limit (minutes) *"
                value={questionFormData.time_limit}
                name="time_limit"
                onChange={(e) => {
                  const value = Math.min(Math.max(1, parseInt(e.target.value) || 1), 5);
                  handleQuestionChange("time_limit", value)
                }}
                placeholder="Enter time limit (1-5 mins)"
                error={questionErrors.time_limit}
                min="1"
                max="5"
              />
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={addModalState.isOpen}
        title={`Add ${addModalState.type}`}
        onClose={() => {
          setAddModalState({ isOpen: false, type: '', field: '' });
          setInputFields({ name: "", logo_url: "" });
        }}
        handleSubmit={handleAddItem}
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

        </div>
      </Modal>
    </div>
  );
};

export default RecruiterAssessment;