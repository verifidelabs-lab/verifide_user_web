/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PiPlus, PiSpinner, PiWarning } from 'react-icons/pi';
import { toast } from 'sonner';
import {
  courseCategoryCreate,
  courseCategoryDelete,
  courseCategoryEnableDisable,
  courseCategoryUpdate,
  getCourseCategory,
  getCourseCategorySingleDoc
} from '../../../../redux/CompanySlices/courseSlice';
import CustomToggle from '../../../../components/ui/Toggle/CustomToggle';
import ActionButtons from '../../../../components/ui/table/TableAction';
import Loader from '../../../Loader/Loader';
import Button from '../../../../components/ui/Button/Button';
import Table from '../../../../components/ui/table/Table';
import Modal from '../../../../components/ui/InputAdmin/Modal/Modal';
import CustomInput from '../../../../components/ui/InputAdmin/CustomInput';
import AlertModal from '../../../../components/ui/Modal/AlertModal';
import useFormHandler from '../../../../components/hooks/useFormHandler';


const PAGE_SIZE = 10;
const initialFormData = {
  "name": "",
  "description": ""
};

const CourseCategory = () => {
  const dispatch = useDispatch();
  const selector = useSelector(state => state.course);
  const { getCourseCategoryData: { data } = {} } = selector || {};
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStatusModal, setIsStatusModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isViewModal, setIsViewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalData, setModalData] = useState({
    type: '',
    data: null,
  });
  const [viewData, setViewData] = useState(null);

  const { formData, handleChange, setFormData, errors, setErrors, resetForm } = useFormHandler(initialFormData);

  const fetchCourseCategoryList = useCallback(async (page = 1, searchKeyword = '') => {
    const apiPayload = {
      page,
      size: PAGE_SIZE,
      keyWord: searchKeyword || searchTerm,
      select: "name isDisable updatedAt createdAt description action_by organization_id",
      searchFields: "name",
      sortBy: "updatedAt",
      sortOrder: "desc"
    };

    try {
      setIsLoading(true);
      await dispatch(getCourseCategory(apiPayload)).unwrap();
    } catch (error) {
      toast.error(error.message || "Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, searchTerm]);

  useEffect(() => {
    fetchCourseCategoryList();
  }, [fetchCourseCategoryList]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Name must be less than 100 characters";
    } else if (!/^[a-zA-Z0-9\s&.-]+$/.test(formData.name.trim())) {
      newErrors.name = "Name contains invalid characters";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    return newErrors;
  }, [formData]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const tableRows = useMemo(() => {
    return data?.data?.list?.map((ele, index) => ([
      (currentPage - 1) * PAGE_SIZE + index + 1,
      ele.name,
      <span className='line-clamp-2' title={ele?.description}>{ele?.description || 'N/A'}</span>,
      <CustomToggle
        key={ele._id}
        isToggle={!ele?.isDisable}
        handleClick={() => handleStatusChange(ele)}
      />,
      formatDate(ele.createdAt),
      <div className="flex gap-2" key={`actions-${ele._id}`}>
        <ActionButtons
          onEdit={() => handleEdit(ele)}
          onDelete={() => handleDelete(ele._id)}
          onView={() => handleView(ele._id)}
        />
      </div>
    ])) || [];
  }, [data?.data?.list, currentPage]);

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

  const handleEdit = useCallback((data) => {
    setModalData({ type: 'edit', data: data });
    setFormData({
      name: data?.name || '',
      description: data?.description || '',
      _id: data?._id
    });
    setIsModalOpen(true);
  }, [setFormData]);

  const handleDelete = useCallback((categoryId) => {
    setModalData({ type: 'delete', data: categoryId });
    setIsDeleteModal(true);
  }, []);

  const handleView = useCallback(async (categoryId) => {
    try {
      setIsLoading(true);
      const response = await dispatch(getCourseCategorySingleDoc({ _id: categoryId })).unwrap();
      setViewData(response.data);
      setIsViewModal(true);
    } catch (error) {
      toast.error(error.message || "Failed to fetch category details");
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const handleStatusChange = useCallback((category) => {
    setModalData({ type: 'status', data: category });
    setIsStatusModal(true);
  }, []);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the validation errors");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim()
      };

      if (modalData.type === 'edit') {
        payload._id = formData._id;
        const res = await dispatch(courseCategoryUpdate(payload)).unwrap();
        toast.success(res?.message);
      } else {
        const res = await dispatch(courseCategoryCreate(payload)).unwrap();
        toast.success(res?.message);
      }

      handleCloseModal();
      await fetchCourseCategoryList(currentPage, searchTerm);
    } catch (error) {
      toast.error(error.message || "An error occurred while saving");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, modalData, validateForm, setErrors, dispatch, handleCloseModal, fetchCourseCategoryList, currentPage, searchTerm]);

  const handleStatusConfirm = useCallback(async () => {
    if (!modalData.data) return;

    try {
      setIsLoading(true);
      const res = await dispatch(courseCategoryEnableDisable({
        _id: modalData.data._id,
        isDisable: !modalData.data.isDisable
      })).unwrap();
      toast.success(res?.message);
      await fetchCourseCategoryList(currentPage, searchTerm);
    } catch (error) {
      toast.error(error.message || 'Failed to update category status');
    } finally {
      setIsLoading(false);
      setIsStatusModal(false);
      setModalData({ type: '', data: null });
    }
  }, [modalData.data, dispatch, fetchCourseCategoryList, currentPage, searchTerm]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!modalData.data) return;

    try {
      setIsLoading(true);
      const res = await dispatch(courseCategoryDelete({ _id: modalData.data })).unwrap();
      toast.success(res?.message);
      await fetchCourseCategoryList(currentPage, searchTerm);
    } catch (error) {
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setIsLoading(false);
      setIsDeleteModal(false);
      setModalData({ type: '', data: null });
    }
  }, [modalData.data, dispatch, fetchCourseCategoryList, currentPage, searchTerm]);

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchCourseCategoryList(newPage);
  };

  const handleRemoveSearch = () => {
    setSearchTerm("");
    fetchCourseCategoryList(1);
  };

  const handleSearch = () => {
    fetchCourseCategoryList(1, searchTerm);
  };

  return (
    <>
      <Loader loading={isLoading} />
      <div className="min-h-screen">
        <div className="p-6">
          <div className="flex justify-between place-items-center">
            <div>
              <h1 className="md:text-3xl text-sm font-bold glassy-text-primary mb-2">
                Course Category Management
              </h1>
            </div>
            <Button
              icon={<PiPlus className="w-5 h-5" />}
              onClick={handleOpenModal}
            >
              Add New
            </Button>
          </div>
          <div className="overflow-hidden">
            <Table
              tableHeadings={[
                "S.No",
                "Name",
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
              totalData={data?.data?.total || 0}
              handleSearch={handleSearch}
              handleRemoveSearch={handleRemoveSearch}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalData.type === 'edit' ? "Edit Course Category" : "Add New Course Category"}
        size="xl"
        className="max-w-2xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <CustomInput
              label="Name *"
              value={formData?.name}
              name="name"
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter category name"
              error={errors.name}
              maxLength={100}
            />
            <CustomInput
              label="Description *"
              type="textarea"
              value={formData?.description}
              name="description"
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter description"
              error={errors.description}
              maxLength={500}
              rows={4}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="flex-1 py-3 transition-all duration-200 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 glassy-text-primary py-3 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <PiSpinner className="animate-spin mr-2" />
                  {modalData.type === 'edit' ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                modalData.type === 'edit' ? 'Update' : 'Add'
              )}
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
              {modalData.data?.isDisable ? 'Enable' : 'Disable'} Course Category
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
            <span>Delete Course Category</span>
          </div>
        }
        message="Are you sure you want to delete this category? This action cannot be undone."
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
        title="Category Details"
        size="lg"
      >
        {viewData && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <p className="glassy-text-primary">{viewData.name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <p className="glassy-text-primary">{viewData.isDisable ? 'Disabled' : 'Enabled'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created At
                </label>
                <p className="glassy-text-primary">{formatDate(viewData.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Updated
                </label>
                <p className="glassy-text-primary">{formatDate(viewData.updatedAt)}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <p className="glassy-text-primary whitespace-pre-line">{viewData.description || 'N/A'}</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default CourseCategory;