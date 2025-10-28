import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PiPlus, PiSpinner, PiWarning } from 'react-icons/pi';
import { toast } from 'sonner';
import useFormHandler from '../../components/hooks/useFormHandler';
import { instituteCreate, instituteDelete, instituteEnableDisable, instituteType, instituteUpdate } from '../../redux/slices/instituteSlice';
import AlertModal from "../../components/ui/Modal/AlertModal";
import Modal from "../../components/ui/Modal/Modal";
import Table from "../../components/ui/table/Table";
import CustomToggle from "../../components/ui/Toggle/CustomToggle";
import ActionButtons from "../../components/ui/table/TableAction";
import useFormHandler from "../../components/hooks/useFormHandler";
const PAGE_SIZE = 10;
const initialFormData = {
    "name": "",
    display_name: "",
    description: ""
};

const InstituteType = () => {
    const dispatch = useDispatch();
    const selector = useSelector(state => state.institute);
    const { instituteTypeData: { data } = {} } = selector || {};
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

    const { formData, handleChange, setFormData, errors, setErrors, resetForm } = useFormHandler(initialFormData);

    const fetchInstituteTypeList = useCallback(async (page = 1) => {
        const apiPayload = {
            page,
            size: PAGE_SIZE,
            keyWord: searchTerm,
            select: "name display_name description isDisable updatedAt createdAt",
            searchFields: "name", sortBy: "updatedAt", sortOrder: "desc",
        };

        try {
            setIsLoading(true);
            await dispatch(instituteType(apiPayload)).unwrap();
        } catch (error) {
            toast.error(error)
        } finally {
            setIsLoading(false);
        }
    }, [dispatch, searchTerm]);


    useEffect(() => {
        fetchInstituteTypeList(currentPage, searchTerm);
    }, [currentPage, fetchInstituteTypeList, searchTerm]);

    const validateForm = useCallback(() => {
        const newErrors = {};
        if (!formData.name?.trim()) {
            newErrors.name = " name is required";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = " name must be at least 2 characters";
        } else if (formData.name.trim().length >= 20) {
            newErrors.name = " name must be less than or equal to 20 characters";
        } else if (!/^[a-zA-Z0-9\s&.-]+$/.test(formData.name.trim())) {
            newErrors.name = " name contains invalid characters";
        }
        if (!formData.display_name) {
            newErrors.display_name = " display name is required";
        }
        if (!formData.description) {
            newErrors.description = " description is required";
        }

        return newErrors;
    }, [formData]);

    const tableRows = useMemo(() => {
        return data?.data?.list?.map((ele, index) => ([
            (currentPage - 1) * PAGE_SIZE + index + 1,
            ele.name,
            <span>{ele?.display_name || "N/A"}</span>,
            <span className='text-wrap truncate break-words'>{ele?.description || "N/A"}</span>,
            <CustomToggle
                key={ele._id}
                isToggle={!ele?.isDisable}
                handleClick={() => handleStatusChange(ele)}
            />,
            new Date(ele.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            <div className="flex gap-2" key={`actions-${ele._id}`}>
                <ActionButtons
                    onEdit={() => handleEdit(ele)}
                    onDelete={() => handleDelete(ele._id)}
                    onView={() => handleView(ele)}
                />
            </div>
        ])) || [];
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            display_name: data?.display_name,
            description: data?.description,
            _id: data?._id
        });
        setIsModalOpen(true);
    }, [setFormData]);

    const handleDelete = useCallback((industryId) => {
        setModalData({ type: 'delete', data: industryId });
        setIsDeleteModal(true);
    }, []);

    const handleView = useCallback((industry) => {
        setModalData({ type: 'view', data: industry });
        setIsViewModal(true);
    }, []);

    const handleStatusChange = useCallback((industry) => {
        setModalData({ type: 'status', data: industry });
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
                display_name: formData?.display_name,
                description: formData?.description
            };
            if (modalData.type === 'edit') {
                payload._id = modalData.data._id;
                const res = await dispatch(instituteUpdate(payload)).unwrap();
                toast.success(res?.message);
            } else {
                const res = await dispatch(instituteCreate(payload)).unwrap();
                toast.success(res?.message);
            }

            handleCloseModal();
            await fetchInstituteTypeList(currentPage, searchTerm);
        } catch (error) {
            toast.error(error || "An error while saving")
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, modalData, validateForm, setErrors, dispatch, handleCloseModal, fetchInstituteTypeList, currentPage, searchTerm,]);

    const handleStatusConfirm = useCallback(async () => {
        if (!modalData.data) return;

        try {
            setIsLoading(true);
            const res = await dispatch(instituteEnableDisable({
                _id: modalData.data._id,
                isDisable: !modalData.data.isDisable
            })).unwrap();
            toast.success(res?.message)
            await fetchInstituteTypeList(currentPage, searchTerm);
        } catch (error) {
            toast.error(error || 'update industry status');
        } finally {
            setIsLoading(false);
            setIsStatusModal(false);
            setModalData({ type: '', data: null });
        }
    }, [modalData.data, dispatch, fetchInstituteTypeList, currentPage, searchTerm,]);

    const handleDeleteConfirm = useCallback(async () => {
        if (!modalData.data) return;

        try {
            setIsLoading(true);
            const res = await dispatch(instituteDelete({ _id: modalData.data })).unwrap();
            toast.success(res?.message);
            await fetchInstituteTypeList(currentPage, searchTerm);
        } catch (error) {
            toast.error(error || 'delete industry');
        } finally {
            setIsLoading(false);
            setIsDeleteModal(false);
            setModalData({ type: '', data: null });
        }
    }, [modalData.data, dispatch, fetchInstituteTypeList, currentPage, searchTerm,]);


    const onPageChange = (newPage) => {
        setCurrentPage(newPage)
    };

    const handleRemoveSearch = () => {
        setSearchTerm("")
        fetchInstituteTypeList(currentPage)
    }

    return (
        <>
            <Loader loading={isLoading} />
            <div className="min-h-screen ">
                <div className=" p-6">
                    <div className="flex justify-between place-items-center">
                        <div>
                            <h1 className="md:text-3xl text-sm font-bold text-gray-900 mb-2">
                                institution Type Management
                            </h1>

                        </div>
                        <Button
                            icon={<PiPlus className="w-5 h-5" />}
                            onClick={handleOpenModal}
                        >
                            Add New
                        </Button>
                    </div>
                    <div className="overflow-hidden" >
                        <Table
                            tableHeadings={["S.No", " Name", "Display Name", "Description", "Status", "Created At", "Actions"]}
                            data={tableRows}
                            isLoading={isLoading}
                            keyWord={searchTerm}
                            setKeyword={setSearchTerm}
                            handleRemoveSearch={handleRemoveSearch}
                            totalItems={data?.data?.total} size={PAGE_SIZE} pageNo={currentPage}
                            onPageChange={onPageChange}
                            totalData={data?.data?.total || 0}
                            emptyMessage="No industries found"
                            className="rounded-lg"
                        />
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={modalData.type === 'edit' ? "Edit " : "Add New "}
                size="xl"
                className="max-w-2xl"
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">

                        <CustomInput
                            label="Industry Name *"
                            value={formData?.name}
                            name="name"
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="Enter industry name"
                            error={errors.name}
                            maxLength={100}
                        />
                        <CustomInput
                            label="Display Name *"
                            value={formData?.display_name}
                            name="display_name"
                            onChange={(e) => handleChange("display_name", e.target.value)}
                            placeholder="Enter display_name"
                            error={errors.display_name}
                            maxLength={100}
                        />
                        <CustomInput type="textarea"
                            label="description *"
                            value={formData?.description}
                            name="description"
                            onChange={(e) => handleChange("description", e.target.value)}
                            placeholder="Enter display_name"
                            error={errors.description}
                            maxLength={100}
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
                                modalData.type === 'edit' ? 'Update ' : 'Add '
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
                            {modalData.data?.isDisable ? 'Enable' : 'Disable'} Institution Type
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

            <AlertModal isOpen={isDeleteModal} title={
                <div className="flex items-center gap-2">
                    <PiWarning className="text-red-500" />
                    <span>Delete Institute Type </span>
                </div>
            }
                message="Are you sure you want to delete this Institute Type? This action cannot be undone."
                onCancel={() => {
                    setIsDeleteModal(false);
                    setModalData({ type: '', data: null });
                }}
                onConfirm={handleDeleteConfirm}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />

            <Modal isOpen={isViewModal} onClose={() => setIsViewModal(false)} title="Type Details" size="lg" >
                {modalData.data && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <p className="text-gray-900">{modalData.data.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Display Name
                                </label>
                                <p className="text-gray-900">{modalData.data.display_name}</p>
                            </div>

                        </div>

                        {modalData.data.description && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <p>{modalData.data.description || "N/A"}</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </>
    );
};

export default InstituteType;