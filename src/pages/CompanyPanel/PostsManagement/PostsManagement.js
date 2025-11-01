/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from 'react-redux';
import { PiWarning } from 'react-icons/pi';
import { toast } from 'sonner';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ActionButtons from '../../components/Atoms/table/TableAction';
import Loader from '../Loader/Loader';
import Table from '../../components/Atoms/table/Table';
import AlertModal from '../../components/Atoms/Modal/AlertModal';
import Modal from '../../components/Atoms/Modal/Modal';
import { getPosts, getSinglePost, postDelete } from '../../redux/Admin/courseSlice';

const PAGE_SIZE = 10;

const PostsManagement = () => {
  const dispatch = useDispatch();
  const selector = useSelector(state => state.course);
  const { getPostsData: { data } = {} } = selector || {};
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isViewModal, setIsViewModal] = useState(false);
  const [isViewReject, setIsViewReject] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalData, setModalData] = useState({
    type: '',
    data: null,
  });

  const fetchPostsList = useCallback(async (page = 1) => {
    const apiPayload = {
      page,
      size: PAGE_SIZE,
      populate: 'user_id:first_name last_name profile_picture_url',
    };
    try {
      setIsLoading(true);
      await dispatch(getPosts(apiPayload)).unwrap();
    } catch (error) {
      toast.error(error)
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchPostsList(currentPage);
  }, [currentPage, fetchPostsList]);

  const handleDelete = useCallback((postId) => {
    setModalData({ type: 'delete', data: postId });
    setIsDeleteModal(true);
  }, []);

  const handleView = useCallback(async (post) => {
    try {
      setIsLoading(true);
      const res = await dispatch(getSinglePost({ _id: post._id })).unwrap();
      setModalData({ type: 'view', data: res.data });
      setIsViewModal(true);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const handleViewReport = useCallback(async (post) => {
    try {
      setIsLoading(true);
      const res = await dispatch(getSinglePost({ _id: post._id })).unwrap();
      setModalData({ type: 'reject', data: res.data });
      setIsViewReject(true);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!modalData.data) return;
    try {
      setIsLoading(true);
      const res = await dispatch(postDelete({ _id: modalData.data })).unwrap();
      toast.success(res?.message);
      await fetchPostsList(currentPage);
    } catch (error) {
      toast.error(error || 'Error deleting post');
    } finally {
      setIsLoading(false);
      setIsDeleteModal(false);
      setModalData({ type: '', data: null });
    }
  }, [modalData.data, dispatch, fetchPostsList, currentPage]);

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchPostsList(newPage);
  };

  const handleRemoveSearch = () => {
    fetchPostsList(1)
  }

  const handleSearch = () => {
    setCurrentPage(1);
    fetchPostsList(1)
  }

  const tableRows = useMemo(() => {
    return data?.data?.list?.map((post, index) => {
      // const user = post?.user_id;
      return [
        (currentPage - 1) * PAGE_SIZE + index + 1,
        <span className="line-clamp-2" title={post?.content}>
          {post?.content}
        </span>,
        // <div key={`user-${post?._id}`} className="flex items-center gap-2">
        //   <img
        //     src={user?.profile_picture_url}
        //     alt={`${user?.first_name} ${user?.last_name}`}
        //     className="w-8 h-8 rounded-full object-cover border"
        //   />
        //   <span className="font-medium glassy-text-primary">
        //     {user?.first_name} {user?.last_name}
        //   </span>
        // </div>,
        post?.like_count,
        <span className='cursor-pointer text-red-500 hover:underline rounded-[110px] p-1 bg-red-50' onClick={() => handleViewReport(post)} title='click to view reported user'>
          {post?.report_count}
        </span>,
        new Date(post?.updatedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        <div className="flex gap-2" key={`actions-${post?._id}`}>
          <ActionButtons
            onView={() => handleView(post)}
            onDelete={() => handleDelete(post?._id)}
            showEditButton={false}
          />
        </div>
      ];
    }) || [];
  }, [data?.data?.list, currentPage, handleView, handleDelete]);


  return (
    <>
      <Loader loading={isLoading} />
      <div className="min-h-screen">
        <div className="p-6">
          <div className="flex justify-between place-items-center">
            <div>
              <h1 className="md:text-3xl text-sm font-bold glassy-text-primary mb-2">
                Reported Posts
              </h1>
            </div>
          </div>
          <div className="overflow-hidden">
            <Table
              tableHeadings={["S.No", "Content", "Likes", "Report", "Updated At", "Actions"]}
              data={tableRows}
              isLoading={isLoading}
              showSearch={false}
              totalItems={data?.data?.total}
              size={PAGE_SIZE}
              pageNo={currentPage}
              onPageChange={onPageChange}
              emptyMessage="No posts found"
              className="rounded-lg"
              totalData={data?.data?.total}
              handleRemoveSearch={handleRemoveSearch}
              handleSearch={handleSearch}
            />
          </div>
        </div>
      </div>

      <AlertModal
        isOpen={isDeleteModal}
        title={
          <div className="flex items-center gap-2">
            <PiWarning className="text-red-500" />
            <span>Delete Post</span>
          </div>
        }
        message="Are you sure you want to delete this post? This action cannot be undone."
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
        title="Post Details"
      >
        {modalData.data && (
          <div className="relative overflow-hidden rounded-2xl text-whiteshadow-md p-8 transition-all duration-500">
            <div className="relative z-10 flex items-center gap-4 mb-6">
              <img
                src={modalData?.data?.user_id?.profile_picture_url || 'https://i.pinimg.com/736x/0f/36/88/0f368853758639a4839897ac215b462b.jpg'}
                alt="Reporter"
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://i.pinimg.com/736x/0f/36/88/0f368853758639a4839897ac215b462b.jpg';
                }}
              />
              <div>
                <h2 className="text-lg font-semibold">
                  {modalData.data.user_id?.first_name} {modalData.data.user_id?.last_name}
                </h2>
                <p className="text-sm glassy-text-secondary">
                  Updated on{" "}
                  {new Date(modalData.data.updatedAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            {modalData.data.content && (
              <div className="relative z-10 mb-6">
                <p className="text-base leading-relaxed whitespace-pre-line font-medium">
                  {modalData.data.content}
                </p>
              </div>
            )}

            {modalData.data.video_url && (
              <div className="relative z-10 mb-6">
                <a
                  href={modalData.data.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-5 py-2 rounded-full glassy-card glassy-text-primary font-semibold shadow-md hover:scale-105 transition-transform duration-300"
                >
                  🎬 Watch Video
                </a>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative z-10">
              {[
                { label: 'Likes', value: modalData.data.like_count },
                { label: 'Shares', value: modalData.data.share_count },
                { label: 'Views', value: modalData.data.view_count },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-neutral-100 p-4 text-center hover:shadow-md transition-all duration-200"
                >
                  <p className="text-sm glassy-text-secondary">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            {modalData.data.tags?.length > 0 && (
              <div className="mb-6 relative z-10">
                <p className="text-sm glassy-text-secondary mb-2 font-medium">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {modalData.data.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-neutral-200 rounded-full text-sm font-medium hover:scale-105 transition-transform cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Status */}
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <span
                className={`inline-block px-4 py-1 text-sm font-semibold rounded-full ${modalData.data.isDisable ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}
              >
                {modalData.data.isDisable ? '🚫Post Disabled' : '✅Post Enabled'}
              </span>

              {modalData.data.reports?.length > 0 && (
                <span className="px-4 py-1 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full animate-pulse">
                  ⚠️ Reported
                </span>
              )}
            </div>
            {/* {modalData.data.reports?.length > 0 && (
              <div className="space-y-4 relative z-10">
                <p className="text-sm font-medium glassy-text-secondary">Reported Users</p>
                {modalData.data.reports.map((report, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-red-200 p-4 bg-red-50"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={modalData?.data?.user_id?.profile_picture_url || 'https://i.pinimg.com/736x/0f/36/88/0f368853758639a4839897ac215b462b.jpg'}
                        alt="Reporter"
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://i.pinimg.com/736x/0f/36/88/0f368853758639a4839897ac215b462b.jpg';
                        }}
                      />
                      <p className="font-medium">
                        {report.user_id?.first_name} {report.user_id?.last_name}
                      </p>
                    </div>
                    <p><span className="font-semibold">Type:</span> {report.type}</p>
                    <p><span className="font-semibold">Reason:</span> {report.reason}</p>
                    <p className="glassy-text-secondary text-sm">
                      {new Date(report.updatedAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )} */}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isViewReject}
        onClose={() => setIsViewReject(false)}
        title="Reported Users"
      >
        {modalData?.data?.reports?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Reports</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full glassy-card border border-gray-200">
                <thead className="glassy-card">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">User</th>
                    <th className="px-4 py-2 text-left font-semibold">Type</th>
                    <th className="px-4 py-2 text-left font-semibold">Reason</th>
                    <th className="px-4 py-2 text-left font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {modalData.data.reports.map((report, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={report.user_id?.profile_picture_url || 'https://i.pinimg.com/736x/0f/36/88/0f368853758639a4839897ac215b462b.jpg'}
                            alt="Reporter"
                            className="w-6 h-6 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://i.pinimg.com/736x/0f/36/88/0f368853758639a4839897ac215b462b.jpg';
                            }}
                          />
                          <span>
                            {report.user_id?.first_name} {report.user_id?.last_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2">{report.type}</td>
                      <td className="px-4 py-2">{report.reason}</td>
                      <td className="px-4 py-2">
                        {new Date(report.updatedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default PostsManagement;