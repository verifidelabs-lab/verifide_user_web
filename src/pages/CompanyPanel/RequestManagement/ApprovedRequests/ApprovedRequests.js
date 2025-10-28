import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Table from '../../../components/Atoms/table/Table';
import ActionButtons from '../../../components/Atoms/table/TableAction';
import Modal from '../../../components/Atoms/Modal/Modal';
import Loader from '../../Loader/Loader';
import { verificationCenterList, verificationCenterSingleDoc } from '../../../redux/Admin/courseSlice';
import { getCookie } from '../../../components/utils/cookieHandler';
import FilterSelect from '../../../components/Atoms/Input/FilterSelect';

const PAGE_SIZE = 10;

const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border border-[#089D291A]/10';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-[#FFECB0]';
      case 'rejected':
        return 'bg-red-100 text-red-800 border border-[#FFEBEB]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`rounded-full px-2 py-1 ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

const ApprovedRequests = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.course);
  const { getVerificationCenterList: { data } = {} } = selector || {};
  const [documentTypeFilter, setDocumentTypeFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);


  const fetchRequestList = useCallback(async (page = 1, keyWord = '') => {
    const payload = {
      page,
      size: PAGE_SIZE,
      status: "APPROVED",
    };

    try {
      setLoading(true);
      await dispatch(verificationCenterList(payload)).unwrap();
    } catch (error) {
      toast.error('Failed to fetch approved requests');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchRequestList(currentPage, searchTerm);
  }, [currentPage, searchTerm, documentTypeFilter, fetchRequestList]);

  const handleView = useCallback(async (_id) => {
    try {
      setLoading(true);
      const res = await dispatch(verificationCenterSingleDoc({ _id })).unwrap();
      setSelectedRequest(res?.data);
      setModalOpen(true);
    } catch (error) {
      toast.error('Failed to fetch request details');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const tableRows = useMemo(() => {
    return data?.data?.list?.map((item, index) => ([
      (currentPage - 1) * PAGE_SIZE + index + 1,
      `${item.user_id.first_name} ${item.user_id.last_name}`,
      new Date(item.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      <StatusBadge status={item.status} />,
      <ActionButtons
        onView={() => handleView(item._id)}
        showEditButton={false}
        showDeleteButton={false}
      />
    ])) || [];
  }, [data?.data?.list, currentPage, handleView]);

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchRequestList(newPage, searchTerm);
  };

  const handleSearch = () => {
    fetchRequestList(1, searchTerm);
  };

  const handleRemoveSearch = () => {
    setSearchTerm('');
    fetchRequestList(1);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRequest(null);
  };

  const renderViewContent = () => {
    const user = selectedRequest?.user_id;
    const assignedTo = selectedRequest?.assigned_to;
    const model = selectedRequest?.document_model;
    const doc = selectedRequest?.document_id;
    const formatDate = (timestamp) => timestamp ? new Date(timestamp).toLocaleDateString() : null;
    const renderSkills = (skills) => (
      Array.isArray(skills) && skills.length > 0 && (
        <div>
          <p><span className="font-semibold">Skills Acquired:</span></p>
          <ul className="list-disc pl-5">
            {skills.map((skill) => (
              <li key={skill?._id}>{skill?.name}</li>
            ))}
          </ul>
        </div>
      )
    );

    const renderImage = (url, label) =>
      url && (
        <div>
          <p className="font-semibold">{label}:</p>
          <img
            src={url}
            alt={label}
            className="w-full max-w-xs rounded shadow border"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=500";
            }}
          />
        </div>
      );

    return (
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <div className="glassy-card p-6 rounded-lg shadow-lg max-w-xl mx-auto">
            <div className="flex flex-col items-center relative">
              <img
                src={user?.profile_picture_url || "https://plus.unsplash.com/premium_photo-1683584405772-ae58712b4172?w=500"}
                alt="Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=500";
                }}
                className="w-24 h-24 rounded-full border-4 border-gray-200 mb-2"
              />
              {selectedRequest?.is_verified ? (
                <span className="absolute top-0 right-0 bg-green-500 glassy-text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
                  Verified
                </span>
              ) : (
                <span className="absolute top-0 right-0 bg-red-500 glassy-text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
                  Not Verified
                </span>
              )}
              <h3 className="font-semibold text-xl text-gray-800">
                {user?.first_name} {user?.last_name}
              </h3>
            </div>
            <div className="mt-6 space-y-3 text-gray-700 text-sm">
              {user?.email && <p><span className="font-semibold">Email:</span> {user.email}</p>}
              {user?.phone_number && <p><span className="font-semibold">Phone:</span> {user.phone_number}</p>}
              {selectedRequest?.verification_category && <p><span className="font-semibold">Verification Category:</span> {selectedRequest.verification_category}</p>}
              {selectedRequest?.relation_path && <p><span className="font-semibold">Relation Path:</span> {selectedRequest.relation_path}</p>}
              {selectedRequest?.status && <p><span className="font-semibold">Status:</span> {selectedRequest.status}</p>}
              {selectedRequest?.assign_status && <p><span className="font-semibold">Assign Status:</span> {selectedRequest.assign_status}</p>}
              {selectedRequest?.assigned_path && <p><span className="font-semibold">Assigned Path:</span> {selectedRequest.assigned_path}</p>}
              {selectedRequest?.rejection_reason && <p><span className="font-semibold">Rejection Reason:</span> {selectedRequest.rejection_reason}</p>}
            </div>

            {assignedTo && (
              <div className="mt-6 border-t pt-4">
                <h4 className="font-semibold text-md text-gray-800 mb-2">Assigned To</h4>
                <div className="flex items-center space-x-4">
                  <img
                    src={assignedTo.profile_picture_url || "https://plus.unsplash.com/premium_photo-1683584405772-ae58712b4172?w=500"}
                    alt="Verifier"
                    className="w-12 h-12 rounded-full border-2 border-gray-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=500";
                    }}
                  />
                  <div>
                    <p className="font-medium">{assignedTo.first_name} {assignedTo.last_name}</p>
                    <p className="text-sm glassy-text-secondary">@{assignedTo.username}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {selectedRequest?.is_verified && selectedRequest?.verifier_id && (
            <div className="mt-4 border-t pt-4">
              <h4 className="font-semibold text-md text-gray-800 mb-2">Verified By</h4>
              <div className="flex items-center space-x-4">
                <img
                  src={selectedRequest.verifier_id.profile_picture_url || "https://plus.unsplash.com/premium_photo-1683584405772-ae58712b4172?w=500"}
                  alt="Verifier"
                  className="w-12 h-12 rounded-full border-2 border-gray-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=500";
                  }}
                />
                <div>
                  <p className="font-medium">
                    {selectedRequest.verifier_id.first_name} {selectedRequest.verifier_id.last_name}
                  </p>
                  <p className="text-sm glassy-text-secondary">@{selectedRequest.verifier_id.username}</p>
                </div>
              </div>
            </div>
          )}
          <div className="glassy-card p-6 rounded-lg shadow-lg">
            {model && (
              <h3 className="font-semibold text-xl text-gray-800 capitalize">
                {model.replace(/([a-z])([A-Z])/g, '$1 $2')} Information
              </h3>
            )}
            <div className="space-y-4 mt-4 text-sm text-gray-700">
              {model === "UserAdditionalCertifications" && (
                <>
                  {doc?.name && <p><span className="font-semibold">Document Name:</span> {doc.name}</p>}
                  {doc?.issuing_organization && <p><span className="font-semibold">Issuing Organization:</span> {doc.issuing_organization}</p>}
                  {doc?.credential_id && <p><span className="font-semibold">Credential ID:</span> {doc.credential_id}</p>}
                  {doc?.issue_date && <p><span className="font-semibold">Issue Date:</span> {formatDate(doc.issue_date)}</p>}
                  {renderSkills(doc?.skills_acquired)}
                  {renderImage(doc?.media_url, "Attached File")}
                </>
              )}
              {model === "UserIdentityVerifications" && (
                <>
                  {doc?.id_number && <p><span className="font-semibold">ID Number:</span> {doc.id_number}</p>}
                  {renderImage(doc?.front_side_file, "Front Side")}
                  {renderImage(doc?.back_side_file, "Back Side")}
                </>
              )}
              {model === "UserProjects" && (
                <>
                  {doc?.name && <p><span className="font-semibold">Project Name:</span> {doc.name}</p>}
                  {doc?.issuing_organization && <p><span className="font-semibold">Organization:</span> {doc.issuing_organization}</p>}
                  {doc?.credential_id && <p><span className="font-semibold">Credential ID:</span> {doc.credential_id}</p>}
                  {doc?.issue_date && <p><span className="font-semibold">Issue Date:</span> {formatDate(doc.issue_date)}</p>}
                  {doc?.company_id?.display_name && <p><span className="font-semibold">Company:</span> {doc.company_id.display_name}</p>}
                  {doc?.industries_id?.display_name && <p><span className="font-semibold">Industry:</span> {doc.industries_id.display_name}</p>}
                  {renderImage(doc?.media_url, "Media")}
                </>
              )}
              {model === "UserEducations" && (
                <>
                  {doc?.institution_id?.display_name && <p><span className="font-semibold">Institution:</span> {doc.institution_id.display_name}</p>}
                  {doc?.degree_id?.name && <p><span className="font-semibold">Degree:</span> {doc.degree_id.name}</p>}
                  {doc?.field_of_studies?.name && <p><span className="font-semibold">Field of Study:</span> {doc.field_of_studies.name}</p>}
                  {doc?.start_date && <p><span className="font-semibold">Start Date:</span> {formatDate(doc.start_date)}</p>}
                  {doc?.end_date && <p><span className="font-semibold">End Date:</span> {formatDate(doc.end_date)}</p>}
                  {doc?.currently_available !== undefined && (
                    <p><span className="font-semibold">Currently Studying:</span> {doc.currently_available ? "Yes" : "No"}</p>
                  )}
                  {doc?.duration && <p><span className="font-semibold">Duration:</span> {doc.duration}</p>}
                  {renderSkills(doc?.skills_acquired)}
                  {Array.isArray(doc?.media_urls) && doc.media_urls.map((url, idx) => renderImage(url, `Media ${idx + 1}`))}
                </>
              )}
              {model === "UserWorkExperiences" && (
                <>
                  {doc?.company_id?.display_name && <p><span className="font-semibold">Company:</span> {doc.company_id.display_name}</p>}
                  {doc?.industries_id?.name && <p><span className="font-semibold">Industry:</span> {doc.industries_id.name}</p>}
                  {doc?.profile_role_id?.name && <p><span className="font-semibold">Role:</span> {doc.profile_role_id.name}</p>}
                  {renderSkills(doc?.skills_acquired)}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="glassy-card p-6 rounded-lg shadow-lg">
            <h3 className="font-semibold text-xl text-gray-800">Attached File(s)</h3>
            {selectedRequest.attach_file && selectedRequest.attach_file.length > 0 ? (
              <div className="space-y-4 mt-4">
                {selectedRequest.attach_file.map((file, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <img
                      src={file}
                      alt={`Attachment ${index + 1}`}
                      className="w-full max-w-xs rounded shadow border"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?w=500";
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm glassy-text-secondary">No attached files available.</p>
            )}
          </div>
        </div>
      </div>
    );
  };
  const getDocumentTypeOptions = () => {
    const userRole = Number(getCookie("USER_ROLE"));
    const baseOptions = [{ value: '', label: 'All Document Types' }];
    const roleOptions = [];
    if ([1, 2, 4, 8].includes(userRole)) {
      roleOptions.push({ value: 'educations', label: 'User Educations' });
    }
    if ([1, 2, 3, 7].includes(userRole)) {
      roleOptions.push({ value: 'work-experience', label: 'User Work Experiences' });
    }
    if ([1, 2, 3, 4, 7, 8].includes(userRole)) {
      roleOptions.push({ value: 'projects', label: 'User Projects' });
    }
    if ([1, 2].includes(userRole)) {
      roleOptions.push({ value: 'additional-certifications', label: 'User Additional Certifications' });
    }
    if ([1, 2].includes(userRole)) {
      roleOptions.push({ value: 'identity-verifications', label: 'User Identity Verifications' });
    }
    return [...baseOptions, ...roleOptions];
  };
  const documentTypeOptions = getDocumentTypeOptions()

  return (
    <>
      <Loader loading={loading} />

      <div className="p-6">
        <div className='flex justify-between'>
          <div className='w-full'>
            <h2 className="text-2xl font-semibold">Approved Requests</h2>
          </div>
          <div className='flex justify-end'>
            <FilterSelect
              label="Document Type"
              value={documentTypeFilter}
              selectedOption={documentTypeOptions.find(opt => opt.value === documentTypeFilter) || documentTypeOptions[0]}
              onChange={(selectedOption) => setDocumentTypeFilter(selectedOption ? selectedOption.value : '')}
              options={documentTypeOptions}
              selectClassName="w-[22rem]"
            />
          </div>
        </div>
        <Table
          tableHeadings={['S.No.', 'Name', 'Request Date', 'Status', 'Actions']}
          data={tableRows}
          isLoading={loading}
          keyWord={searchTerm}
          setKeyword={setSearchTerm}
          totalItems={data?.data?.total}
          size={PAGE_SIZE}
          pageNo={currentPage}
          onPageChange={onPageChange}
          handleSearch={handleSearch}
          handleRemoveSearch={handleRemoveSearch}
          emptyMessage="No approved requests found"
          className="rounded-lg"
          totalData={data?.data?.total}
          showSearch={false}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title="Request Details"
        size="md"
      >
        {selectedRequest && (
          renderViewContent()
        )}
      </Modal>
    </>
  );
};

export default ApprovedRequests;
