import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { PiPlus, PiSpinner, PiWarning, PiTrash } from 'react-icons/pi';
import { courseManagementCreate, courseManagementDelete, courseManagementEnableDisable, courseManagementUpdate, getAllSkillsSuggestion, getCourseCategoryALLData, getCourseManagement, getCourseManagementSingleDoc } from '../../../../redux/CompanySlices/courseSlice';
import { industriesDocuments } from '../../../../redux/Industry Slice/industrySlice';
import { getAllDegreeList, getAllFieldsOfStudy } from '../../../../redux/slices/degreeSlice';
import { getAllProfileRoleList } from '../../../../redux/CompanySlices/CompanyAuth';
import CustomToggle from '../../../../components/ui/Toggle/CustomToggle';
import ActionButtons from '../../../../components/ui/table/TableAction';
import Loader from '../../../Loader/Loader';
import Button from '../../../../components/ui/Button/Button';
import Table from '../../../../components/ui/table/Table';
import Modal from '../../../../components/ui/InputAdmin/Modal/Modal';
import CustomInput from '../../../../components/ui/InputAdmin/CustomInput';
import AlertModal from '../../../../components/ui/Modal/AlertModal';
import { FaEdit } from 'react-icons/fa';
import FilterSelect from '../../../../components/ui/InputAdmin/FilterSelect';
import { uploadImageDirectly } from '../../../../components/utils/globalFunction';
import ImageUpload from '../../../../components/ui/Image/ImageUpload';

const Language_Enums = [
  'English',
  'Hindi',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Japanese',
  'Korean',
  'Arabic',
  'Portuguese',
  'Russian',
  'Bengali',
  'Urdu',
  'Tamil',
  'Telugu',
  'Marathi',
  'Gujarati',
  'Punjabi',
  'Malayalam',
  'Kannada',
];
const Proficiency_Level_Enums = ['beginner', 'intermediate', 'advanced', 'expert'];

const initialFormData = {
  name: "",
  title: "",
  description: "",
  category_id: "",
  proficiency_level: "",
  duration: "",
  min_experience: "",
  language: "",
  course_type: "individual",
  modules: [],
  amount_currency: "USD",
  is_assessment: false,
  is_paid: false,
  amount: "",
  thumbnail_url: "",
  industries_ids: [],
  degree_ids: [],
  profile_role_ids: [],
  field_of_studies_ids: [],
  skill_ids: [],
  what_you_will_learn: [],
  target_audience: [],
  prerequisites: [],
  source_url: "",
};

const initialModuleData = {
  title: "",
  content: "",
  video_url: "",
  materials: "",
  duration: ""
};

const Courses = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isStatusModal, setIsStatusModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isViewModal, setIsViewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalData, setModalData] = useState({ type: '', data: null });
  const [formData, setFormData] = useState(initialFormData);
  const [moduleFormData, setModuleFormData] = useState(initialModuleData);
  const [viewData, setViewData] = useState(null);
  // Data for dropdowns
  const [categories, setCategories] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [profileRoles, setProfileRoles] = useState([]);
  const [fieldsOfStudy, setFieldsOfStudy] = useState([]);
  const [skills, setSkills] = useState([]);
  console.log(formData)
  const PAGE_SIZE = 10;
  const selector = useSelector(state => state.course);
  const { getCourseManagementData: { data } = {} } = selector || {};

  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [
        categoriesRes,
        industriesRes,
        degreesRes,
        profileRolesRes,
        fieldsOfStudyRes,
        skillsRes
      ] = await Promise.all([
        dispatch(getCourseCategoryALLData()).unwrap(),
        dispatch(industriesDocuments()).unwrap(),
        dispatch(getAllDegreeList()).unwrap(),
        dispatch(getAllProfileRoleList()).unwrap(),
        dispatch(getAllFieldsOfStudy()).unwrap(),
        dispatch(getAllSkillsSuggestion()).unwrap()
      ]);
      setCategories(categoriesRes?.data?.list || []);
      setIndustries(industriesRes?.data?.list || []);
      setDegrees(degreesRes?.data?.list || []);
      setProfileRoles(profileRolesRes?.data?.list || []);
      setFieldsOfStudy(fieldsOfStudyRes?.data?.list || []);
      setSkills(skillsRes?.data?.list || []);
    } catch (error) {
      toast.error("Failed to load dropdown data");
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const fetchCourseList = useCallback(async (page = 1, searchKeyword = '') => {
    const apiPayload = {
      page,
      size: PAGE_SIZE,
      keyWord: searchKeyword || searchTerm,
      select: "name title description isDisable updatedAt createdAt",
      searchFields: "name,title",
      sortBy: "updatedAt",
      sortOrder: "desc"
    };
    try {
      setIsLoading(true);
      await dispatch(getCourseManagement(apiPayload)).unwrap();
    } catch (error) {
      toast.error(error.message || "Failed to fetch courses");
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, searchTerm]);

  useEffect(() => {
    fetchAllData();
    fetchCourseList();
  }, [fetchAllData, fetchCourseList]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const tableRows = data?.data?.list?.map((course, index) => ([
    (currentPage - 1) * PAGE_SIZE + index + 1,
    course.name,
    course.title,
    <span className="line-clamp-2" title={course.description}>{course.description}</span>,
    <CustomToggle
      key={course._id}
      isToggle={!course?.isDisable}
      handleClick={() => handleStatusChange(course)}
    />,
    formatDate(course.createdAt),
    <div className="flex gap-2" key={`actions-${course._id}`}>
      <ActionButtons
        onEdit={() => handleEdit(course)}
        onDelete={() => handleDelete(course._id)}
        onView={() => handleView(course._id)}
      />
    </div>
  ])) || [];

  const handleOpenModal = () => {
    setModalData({ type: 'add', data: null });
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData({ type: '', data: null });
    setFormData(initialFormData);
  };

  const handleEdit = async (course) => {
    try {
      setIsLoading(true);
      const response = await dispatch(getCourseManagementSingleDoc({
        _id: course._id,
        select: "name title description category_id proficiency_level duration min_experience language course_type modules amount_currency amount thumbnail_url industries_ids degree_ids profile_role_ids field_of_studies_ids skill_ids what_you_will_learn target_audience prerequisites is_assessment is_paid source_url"
      })).unwrap();

      const courseData = response.data;
      setModalData({ type: 'edit', data: courseData });
      const formattedModules = courseData.modules?.map(module => ({
        ...module,
        materials: Array.isArray(module.materials) ?
          module.materials[0] || "" :
          module.materials || ""
      })) || [];
      setFormData({
        ...courseData,
        modules: formattedModules,
        name: courseData.name || "",
        title: courseData.title || "",
        description: courseData.description || "",
        category_id: courseData.category_id || "",
        proficiency_level: courseData.proficiency_level || "intermediate",
        duration: courseData.duration || "",
        min_experience: courseData.min_experience || "",
        language: courseData.language || "English",
        course_type: courseData.course_type || "individual",
        amount_currency: courseData.amount_currency || "USD",
        amount: courseData.amount || "",
        thumbnail_url: courseData.thumbnail_url || "",
        industries_ids: courseData.industries_ids || [],
        degree_ids: courseData.degree_ids || [],
        profile_role_ids: courseData.profile_role_ids || [],
        field_of_studies_ids: courseData.field_of_studies_ids || [],
        skill_ids: courseData.skill_ids || [],
        what_you_will_learn: courseData.what_you_will_learn || [],
        target_audience: courseData.target_audience || [],
        prerequisites: courseData.prerequisites || [],
        is_assessment: courseData.is_assessment || false,
        is_paid: courseData.is_paid || false,
        source_url: courseData.source_url || ""
        // name: courseData.name || "",
        // title: courseData.title || "",
        // description: courseData.description || "",
        // category_id: courseData.category_id || "",
        // proficiency_level: courseData.proficiency_level || "intermediate",
        // duration: courseData.duration || "",
        // min_experience: courseData.min_experience || "",
        // language: courseData.language || "English",
        // course_type: courseData.course_type || "individual",
        // modules: courseData.modules || [],
        // amount_currency: courseData.amount_currency || "USD",
        // amount: courseData.amount || "",
        // thumbnail_url: courseData.thumbnail_url || "",
        // industries_ids: courseData.industries_ids || [],
        // degree_ids: courseData.degree_ids || [],
        // profile_role_ids: courseData.profile_role_ids || [],
        // field_of_studies_ids: courseData.field_of_studies_ids || [],
        // skill_ids: courseData.skill_ids || [],
        // what_you_will_learn: courseData.what_you_will_learn || [],
        // target_audience: courseData.target_audience || [],
        // prerequisites: courseData.prerequisites || [],
        // is_assessment: courseData.is_assessment || false,
        // is_paid: courseData.is_paid || false,
        // source_url: courseData.source_url || ""
      });

      setIsModalOpen(true);
    } catch (error) {
      toast.error(error.message || "Failed to load course data");
    } finally {
      setIsLoading(false);
    }
  };
  const handleDelete = (courseId) => {
    setModalData({ type: 'delete', data: courseId });
    setIsDeleteModal(true);
  };

  const handleView = async (courseId) => {
    try {
      setIsLoading(true);
      const response = await dispatch(getCourseManagementSingleDoc({ _id: courseId })).unwrap();
      setViewData(response.data);
      setIsViewModal(true);
    } catch (error) {
      toast.error(error.message || "Failed to fetch course details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (course) => {
    setModalData({ type: 'status', data: course });
    setIsStatusModal(true);
  };

  const handleAddModule = () => {
    setModuleFormData(initialModuleData);
    setIsModuleModalOpen(true);
  };

  const handleSaveModule = () => {
    if (moduleToEdit !== null) {
      setFormData(prev => ({
        ...prev,
        modules: prev.modules.map((module, index) =>
          index === moduleToEdit ? {
            ...moduleFormData,
            materials: moduleFormData.materials || ""
          } : module
        )
      }));
      setModuleToEdit(null);
    } else {
      setFormData(prev => ({
        ...prev,
        modules: [...prev.modules, {
          ...moduleFormData,
          materials: moduleFormData.materials || ""
        }]
      }));
    }
    setIsModuleModalOpen(false);
  };

  const handleRemoveModule = (index) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index)
    }));
  };

  const handleAddItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const handleRemoveItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (field, index, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData?.name?.trim()) errors.name = "Name is required";
    if (!formData?.title?.trim()) errors.title = "Title is required";
    if (!formData?.description?.trim()) errors.description = "Description is required";
    if (!formData?.category_id) errors.category_id = "Category is required";
    if (!formData?.duration?.trim()) errors.duration = "Duration is required";
    if (formData?.is_paid && !formData?.amount) errors.amount = "Amount is required for paid courses";
    if (!formData?.thumbnail_url) errors.thumbnail_url = "Thumbnail is required";
    if (formData?.modules?.length === 0) errors.modules = "At least one module is required";
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      const errorMessage = Object.values(errors).map((error, index) => (
        `${index + 1}. ${error}`
      )).join('\n');
      toast.error(
        <div className="space-y-1">
          <p className="font-semibold">Please fix the following errors:</p>
          <div className="max-h-40 overflow-y-auto">
            {Object.values(errors).map((error, index) => (
              <p key={index} className="text-sm">• {error}</p>
            ))}
          </div>
        </div>,
        { duration: 3000 }
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData
      };
      if (modalData.type === 'edit') {
        payload._id = modalData?.data._id;
        const res = await dispatch(courseManagementUpdate(payload)).unwrap();
        toast.success(res?.message);
      } else {
        const res = await dispatch(courseManagementCreate(payload)).unwrap();
        toast.success(res?.message);
      }
      handleCloseModal();
      await fetchCourseList(currentPage, searchTerm);
    } catch (error) {
      toast.error(error.message || "Failed to save course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusConfirm = async () => {
    if (!modalData.data) return;
    try {
      setIsLoading(true);
      const res = await dispatch(courseManagementEnableDisable({
        _id: modalData.data._id,
        isDisable: !modalData.data.isDisable
      })).unwrap();
      toast.success(res?.message);
      await fetchCourseList(currentPage, searchTerm);
    } catch (error) {
      toast.error(error.message || 'Failed to update course status');
    } finally {
      setIsLoading(false);
      setIsStatusModal(false);
      setModalData({ type: '', data: null });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!modalData.data) return;
    try {
      setIsLoading(true);
      const res = await dispatch(courseManagementDelete({ _id: modalData.data })).unwrap();
      toast.success(res?.message);
      await fetchCourseList(currentPage, searchTerm);
    } catch (error) {
      toast.error(error.message || 'Failed to delete course');
    } finally {
      setIsLoading(false);
      setIsDeleteModal(false);
      setModalData({ type: '', data: null });
    }
  };

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchCourseList(newPage);
  };

  const handleRemoveSearch = () => {
    setSearchTerm("");
    fetchCourseList(1);
  };

  const handleSearch = () => {
    fetchCourseList(1, searchTerm);
  };

  const handleFileUpload = useCallback(async (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only image files (JPEG, PNG) are allowed");
      return;
    }

    try {
      setIsLoading(true);
      const result = await uploadImageDirectly(file, "COURSES_THUMBNAILS");

      if (result?.data?.imageURL) {
        setFormData(prev => ({ ...prev, thumbnail_url: result.data.imageURL }));
        toast.success(result?.message || "Image uploaded successfully");
      } else {
        throw new Error("Invalid response from upload service");
      }
    } catch (error) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  }, [setFormData]);


  const [moduleToEdit, setModuleToEdit] = useState(null);
  const handleEditModule = (index) => {
    setModuleFormData(formData.modules[index]);
    setModuleToEdit(index);
    setIsModuleModalOpen(true);
  };

  return (
    <>
      <Loader loading={isLoading} />
      <div className="min-h-screen">
        <div className="p-6">
          <div className="flex justify-between place-items-center">
            <div>
              <h1 className="md:text-3xl text-sm font-bold text-gray-900 mb-2">
                Course Management
              </h1>
            </div>
            <Button
              icon={<PiPlus className="w-5 h-5" />}
              onClick={handleOpenModal}
            >
              Add New Course
            </Button>
          </div>
          <div className="overflow-hidden">
            <Table
              tableHeadings={[
                "S.No",
                "Name",
                "Title",
                "Description",
                "Status",
                "Created At",
                "Actions"
              ]}
              data={tableRows}
              isLoading={isLoading}
              keyWord={searchTerm}
              setKeyword={setSearchTerm}
              totalItems={data?.data?.total}
              size={PAGE_SIZE}
              pageNo={currentPage}
              onPageChange={onPageChange}
              handleSearch={handleSearch}
              handleRemoveSearch={handleRemoveSearch}
              totalData={data?.data?.total}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalData.type === 'edit' ? "Edit Course" : "Add New Course"}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <CustomInput
              label="Course Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter course name"
            />
            <CustomInput
              label="Course Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter course title"
            />
            <FilterSelect
              isMulti={false}
              label="Category *"
              options={categories.map(cat => ({ value: cat._id, label: cat.name }))}
              selectedOption={formData.category_id ? {
                value: formData.category_id,
                label: categories.find(c => c._id === formData.category_id)?.name || ''
              } : null}
              onChange={(selected) => setFormData({
                ...formData,
                category_id: selected ? selected.value : ''
              })}
            />
            <FilterSelect
              isMulti={true}
              label="Industries"
              options={industries.map(ind => ({ value: ind._id, label: ind.name }))}
              selectedOption={formData.industries_ids.map(id => ({
                value: id,
                label: industries.find(i => i._id === id)?.name || ''
              }))}
              onChange={(selected) => setFormData({
                ...formData,
                industries_ids: selected ? selected.map(item => item.value) : []
              })}
            />
            <FilterSelect
              isMulti={false}
              label="Language *"
              options={Language_Enums.map(lang => ({ value: lang, label: lang }))}
              selectedOption={formData.language ? {
                value: formData.language,
                label: formData.language
              } : null}
              onChange={(selected) => setFormData({
                ...formData,
                language: selected ? selected.value : ''
              })}
            />
            <FilterSelect
              isMulti={false}
              label="Proficiency Level *"
              options={Proficiency_Level_Enums.map(level => ({
                value: level,
                label: level.charAt(0).toUpperCase() + level.slice(1)
              }))}
              selectedOption={formData.proficiency_level ? {
                value: formData.proficiency_level,
                label: formData.proficiency_level.charAt(0).toUpperCase() +
                  formData.proficiency_level.slice(1)
              } : null}
              onChange={(selected) => setFormData({
                ...formData,
                proficiency_level: selected ? selected.value : ''
              })}
            />
            <CustomInput
              label="Duration *"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g., 12 weeks"
            />
            <CustomInput
              label="Minimum Experience"
              value={formData.min_experience}
              onChange={(e) => setFormData({ ...formData, min_experience: e.target.value })}
              placeholder="e.g., 1 year"
            />
            <CustomInput
              label="Amount *"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Enter course amount"
            />
          </div>
          <ImageUpload
            label="Course Thumbnail *"
            file={formData.thumbnail_url}
            onChange={handleFileUpload}
            accept="image/*"
            maxSize={5 * 1024 * 1024}
          />

          <div className="grid grid-cols-1 gap-6">
            <CustomInput
              label="Description *"
              type="textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter course description"
              rows={4}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FilterSelect
              isMulti={true}
              label="Industries"
              options={industries.map(ind => ({ value: ind._id, label: ind.name }))}
              selectedOption={formData.industries_ids.map(id => ({
                value: id,
                label: industries.find(i => i._id === id)?.name || ''
              }))}
              onChange={(selected) => setFormData({
                ...formData,
                industries_ids: selected ? selected.map(item => item.value) : []
              })}
            />
            <FilterSelect
              isMulti={true}
              label="Degrees"
              options={degrees.map(deg => ({ value: deg._id, label: deg.name }))}
              selectedOption={formData.degree_ids.map(id => ({
                value: id,
                label: degrees.find(d => d._id === id)?.name || ''
              }))}
              onChange={(selected) => setFormData({
                ...formData,
                degree_ids: selected ? selected.map(item => item.value) : []
              })}
            />
            <FilterSelect
              isMulti={true}
              label="Profile Roles"
              options={profileRoles.map(role => ({ value: role._id, label: role.name }))}
              selectedOption={formData.profile_role_ids.map(id => ({
                value: id,
                label: profileRoles.find(r => r._id === id)?.name || ''
              }))}
              onChange={(selected) => setFormData({
                ...formData,
                profile_role_ids: selected ? selected.map(item => item.value) : []
              })}
            />
            <FilterSelect
              isMulti={true}
              label="Fields of Study"
              options={fieldsOfStudy.map(field => ({ value: field._id, label: field.name }))}
              selectedOption={formData.field_of_studies_ids.map(id => ({
                value: id,
                label: fieldsOfStudy.find(f => f._id === id)?.name || ''
              }))}
              onChange={(selected) => setFormData({
                ...formData,
                field_of_studies_ids: selected ? selected.map(item => item.value) : []
              })}
            />
            <FilterSelect
              isMulti={true}
              label="Skills"
              options={skills.map(skill => ({ value: skill._id, label: skill.name }))}
              selectedOption={formData.skill_ids.map(id => ({
                value: id,
                label: skills.find(s => s._id === id)?.name || ''
              }))}
              onChange={(selected) => setFormData({
                ...formData,
                skill_ids: selected ? selected.map(item => item.value) : []
              })}
            />

            <div className="flex items-end">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_assessment || false}
                  onChange={(e) => setFormData({ ...formData, is_assessment: e.target.checked })}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Is Assessment Course</span>
              </label>
            </div>
          </div>

          {['what_you_will_learn', 'target_audience', 'prerequisites'].map((field) => (
            <div key={field} className="bg-white border rounded-md p-4 shadow-sm mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold text-gray-800 capitalize">
                  {field.replace(/_/g, ' ')}
                </h3>
                <Button
                  type="button"
                  size="sm"
                  variantStyles="outline"
                  onClick={() => handleAddItem(field)}
                >
                  + Add
                </Button>
              </div>

              {formData[field]?.length === 0 && (
                <p className="text-sm text-gray-400 italic mb-2">No entries yet.</p>
              )}

              <div className="space-y-3">
                {Array.isArray(formData[field]) && formData[field]?.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CustomInput
                      value={item}
                      onChange={(e) => handleItemChange(field, index, e.target.value)}
                      placeholder={`Enter ${field.replace(/_/g, ' ')}`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveItem(field, index)}
                      title="Remove item"
                    >
                      <PiTrash className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}


          {/* Modules section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Modules *</h3>
              <Button
                type="button"
                onClick={handleAddModule}
              >
                Add Module
              </Button>
            </div>
            {formData.modules?.length === 0 ? (
              <p className="text-sm text-gray-500">No modules added yet</p>
            ) : (
              <div className="space-y-4">
                {Array.isArray(formData.modules) && formData.modules.map((module, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{module.title}</h4>
                        <p className="text-sm text-gray-600">{module.content}</p>
                        <div className="mt-2 text-xs text-gray-500">
                          <p>Duration: {module.duration}</p>
                          {module.video_url && <p>Video: {module.video_url}</p>}
                          {module.materials && (
                            <p>Materials: {Array.isArray(module.materials) ? module.materials[0] : module.materials}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEditModule(index)}
                          title="Edit module"
                        >
                          <FaEdit className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveModule(index)}
                          title="Remove module"
                        >
                          <PiTrash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="flex-1 py-3"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              {isSubmitting ? (
                <>
                  <PiSpinner className="animate-spin mr-2" />
                  {modalData.type === 'edit' ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                modalData.type === 'edit' ? 'Update Course' : 'Create Course'
              )}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isModuleModalOpen}
        onClose={() => {
          setIsModuleModalOpen(false);
          setModuleToEdit(null);
        }}
        title={moduleToEdit !== null ? "Edit Module" : "Add Module"}
        size="lg"
      >
        <div className="space-y-4">
          <CustomInput
            label="Module Title *"
            value={moduleFormData.title}
            onChange={(e) => setModuleFormData({ ...moduleFormData, title: e.target.value })}
            placeholder="Enter module title"
          />
          <CustomInput
            label="Content *"
            type="textarea"
            value={moduleFormData.content}
            onChange={(e) => setModuleFormData({ ...moduleFormData, content: e.target.value })}
            placeholder="Enter module content"
            rows={3}
          />
          <CustomInput
            label="Video URL"
            value={moduleFormData.video_url}
            onChange={(e) => setModuleFormData({ ...moduleFormData, video_url: e.target.value })}
            placeholder="Enter video URL"
          />
          <CustomInput
            label="Materials URL"
            value={moduleFormData.materials}
            onChange={(e) => setModuleFormData({ ...moduleFormData, materials: e.target.value })}
            placeholder="Enter materials URL"
          />
          <CustomInput
            label="Duration *"
            value={moduleFormData.duration}
            onChange={(e) => setModuleFormData({ ...moduleFormData, duration: e.target.value })}
            placeholder="e.g., 1h 30m"
          />
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModuleModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveModule}
            >
              Save Module
            </Button>
          </div>
        </div>
      </Modal>

      <AlertModal
        isOpen={isStatusModal}
        title={
          <div className="flex items-center gap-2">
            <PiWarning className="text-yellow-500" />
            <span>
              {modalData.data?.isDisable ? 'Enable' : 'Disable'} Course
            </span>
          </div>
        }
        message={`Are you sure you want to ${modalData.data?.isDisable ? 'enable' : 'disable'} "${modalData.data?.name}"?`}
        onCancel={() => {
          setIsStatusModal(false);
          setModalData({ type: '', data: null });
        }}
        onConfirm={handleStatusConfirm}
        confirmText={modalData.data?.isDisable ? 'Enable' : 'Disable'}
        cancelText="Cancel"
        type="warning"
      />

      <AlertModal
        isOpen={isDeleteModal}
        title={
          <div className="flex items-center gap-2">
            <PiWarning className="text-red-500" />
            <span>Delete Course</span>
          </div>
        }
        message="Are you sure you want to delete this course? This action cannot be undone."
        onCancel={() => {
          setIsDeleteModal(false);
          setModalData({ type: '', data: null });
        }}
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <Modal
        isOpen={isViewModal}
        onClose={() => setIsViewModal(false)}
        title="Course Details"
        size="3xl"
      >
        {viewData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-semibold">
                  Course Name
                </label>
                <p className="text-gray-900">{viewData.name}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-semibold">
                  Title
                </label>
                <p className="text-gray-900">{viewData.title}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-semibold">
                  Category
                </label>
                <p className="text-gray-900">
                  {categories.find(cat => cat._id === viewData.category_id)?.name || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-semibold">
                  Status
                </label>
                <p className="text-gray-900">{viewData.isDisable ? 'Disabled' : 'Enabled'}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-semibold">
                  Language
                </label>
                <p className="text-gray-900">{viewData.language}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-semibold">
                  Proficiency Level
                </label>
                <p className="text-gray-900">
                  {viewData.proficiency_level.charAt(0).toUpperCase() + viewData.proficiency_level.slice(1)}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-semibold">
                  Duration
                </label>
                <p className="text-gray-900">{viewData.duration}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-semibold">
                  Minimum Experience
                </label>
                <p className="text-gray-900">{viewData.min_experience || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-semibold">
                  Amount
                </label>
                <p className="text-gray-900">
                  {viewData.amount_currency} {viewData.amount}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-semibold">
                  Created At
                </label>
                <p className="text-gray-900">{formatDate(viewData.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <p>{categories.find(c => c._id === viewData.category_id)?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industries</label>
                <div className="flex flex-wrap gap-2">
                  {viewData.industries_ids?.map(id => (
                    <span key={id} className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                      {industries.find(i => i._id === id)?.name || id}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1 font-semibold">
                Description
              </label>
              <p className="text-gray-900 whitespace-pre-line">{viewData.description}</p>
            </div>

            {[
              // { field: 'industries_ids', label: 'Industries', data: industries },
              { field: 'degree_ids', label: 'Degrees', data: degrees },
              { field: 'profile_role_ids', label: 'Profile Roles', data: profileRoles },
              { field: 'field_of_studies_ids', label: 'Fields of Study', data: fieldsOfStudy },
              { field: 'skill_ids', label: 'Skills', data: skills }
            ].map(({ field, label, data }) => (
              <div key={field} className="mt-4">
                <label className="block text-sm text-gray-700 mb-1 font-semibold">
                  {label}
                </label>
                <div className="flex flex-wrap gap-2">
                  {viewData[field]?.length > 0 ? (
                    viewData[field].map(id => {
                      const item = data.find(item => item._id === id);
                      return item ? (
                        <span key={id} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                          {item.name}
                        </span>
                      ) : null;
                    })
                  ) : (
                    <p className="text-gray-500">None selected</p>
                  )}
                </div>
              </div>
            ))}

            {[
              { field: 'what_you_will_learn', label: 'What You Will Learn' },
              { field: 'target_audience', label: 'Target Audience' },
              { field: 'prerequisites', label: 'Prerequisites' }
            ].map(({ field, label }) => (
              <div key={field} className="mt-4">
                <label className="block text-sm text-gray-700 mb-1 font-semibold">
                  {label}
                </label>
                {viewData[field]?.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {viewData[field].map((item, index) => (
                      <li key={index} className="text-gray-900">{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">None specified</p>
                )}
              </div>
            ))}

            {/* Display modules */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modules
              </label>
              {viewData.modules?.length > 0 ? (
                <div className="space-y-4">
                  {viewData.modules.map((module, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium">{module.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{module.content}</p>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Duration:</span> {module.duration}
                        </div>
                        {module.video_url && (
                          <div>
                            <span className="font-medium">Video:</span>{' '}
                            <a href={module.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              View Video
                            </a>
                          </div>
                        )}
                        {module.materials && (
                          <div>
                            <span className="font-medium">Materials:</span>{' '}
                            <a href={module.materials} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              View Materials
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No modules added</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Courses;