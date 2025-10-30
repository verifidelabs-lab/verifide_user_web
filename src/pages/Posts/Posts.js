/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toast } from 'sonner';
import 'react-loading-skeleton/dist/skeleton.css';
import { deletePost, getPostList, enableDisablePost, messageChatUser, getCommentOnPost } from '../../redux/Users/userSlice';
import { getCookie } from '../../components/utils/cookieHandler';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../../components/ui/Modal/AlertModal';
import {  FaTimes, } from 'react-icons/fa';
import ShareModal from '../Home/components/ShareModal';
import Button from '../../components/ui/Button/Button';
import { PiWarning } from 'react-icons/pi';
import PostCard from './components/PostCard';


const Posts = ({ profileData }) => {
  const personalInfo = profileData.getProfileData.data.data.personalInfo;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getPostListData: { data: posts = [] }, loading } = useSelector(state => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [loading2, setLoading2] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(12);
  const [totalPosts, setTotalPosts] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [userData, setUserData] = useState([]);
  const [comments, setComments] = useState(null)


  const profileUser = profileData?.getProfileData?.data?.data?.personalInfo

  const handleShareClick = (post) => {
    setSelectedPost(post);
    setShowShareModal(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const mode = getCookie("ACCESS_MODE");
      if (mode === '5') {
        navigate('/user/feed');
      }
      setLoading2(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const res = await dispatch(messageChatUser()).unwrap();
        setUserData(res?.data || []);
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
        toast.error('Failed to load contacts');
      }
    };
    fetchUserList();
  }, [dispatch]);

  const formatBirthDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format numbers with commas
  const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    dispatch(getPostList({ page: currentPage, size: postsPerPage }))
      .unwrap()
      .then(res => {
        setTotalPosts(res.data?.total || 0);
      });
  }, [dispatch, currentPage, postsPerPage]);

  const handleToggleStatus = (post) => {
    const newStatus = !post.isDisable;
    dispatch(enableDisablePost({ _id: post._id, isDisable: newStatus }))
      .unwrap()
      .then(() => {
        toast.success(`Post ${newStatus ? 'disabled' : 'enabled'} successfully`);
        dispatch(getPostList({ page: currentPage, size: postsPerPage }));
      })
      .catch(error => {
        toast.error(error.message || 'Failed to update post status');
      });
  };

  const handleDeletePost = async (postId) => {
    try {
      setLoading2(true);
      const res = await dispatch(deletePost({ _id: postId })).unwrap();
      toast.success(res?.message);
      await dispatch(getPostList({ page: currentPage, size: postsPerPage }));
    } catch (error) {
      toast.error(error?.message || 'Failed to delete post');
    } finally {
      setLoading2(false);
      setIsDeleteModal(false);
    }
  };

  const openViewModal = (post) => {
    setCurrentPost(post);
    setViewModalOpen(true);
  };

  const handleComment = async (data) => {
    try {
      const res = await dispatch(getCommentOnPost({ post: data?._id, page: 1, size: 1000 })).unwrap();
      setComments(res?.data)
      console.log(res?.data)

    } catch (error) {
      toast.error(error)
    }

  }

  const PaginationComponent = () => {
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    const handlePageChange = (page) => {
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);
    };

    const getPageNumbers = () => {
      const pages = [];
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage > 3) {
          pages.push(1);
          if (currentPage > 4) {
            pages.push('start-ellipsis');
          }
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }

        if (currentPage < totalPages - 2) {
          if (currentPage < totalPages - 3) {
            pages.push('end-ellipsis');
          }
          pages.push(totalPages);
        }
      }

      return pages;
    };

    return (
      <div className="flex items-center justify-between p-4 glassy-card rounded-lg border border-gray-200 mt-4">

        <div className="text-sm glassy-text-secondary">
          Showing {(currentPage - 1) * postsPerPage + 1} to{' '}
          {Math.min(currentPage * postsPerPage, totalPosts)} of {totalPosts} posts
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded text-gray-700 hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
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
            className="p-2 rounded text-gray-700 hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  // Filter posts based on search term
  const filteredPosts = posts?.data?.list?.filter(post => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      (post.title && post.title.toLowerCase().includes(searchLower)) ||
      (post.content && post.content.toLowerCase().includes(searchLower)) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
      (post.link && post.link.toLowerCase().includes(searchLower))
    );
  }) || [];


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="w-full mx-auto">

        <div className="glassy-card rounded-lg shadow-md p-6">

          {/* DESKTOP/TABLET VIEW */}
          <div className="hidden md:flex flex-col md:flex-row items-start gap-6 md:gap-8 mb-6">
            <div className="flex-shrink-0">
              {profileUser.profile_picture_url ?
                <img
                  src={profileUser.profile_picture_url || '/default-avatar.png'}
                  alt="Profile"
                  className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover border-2 border-gray-200"
                />
                :
                <img
                  src={`/0684456b-aa2b-4631-86f7-93ceaf33303c.png`}
                  alt="Profile"
                  className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover border-2 border-gray-200"
                />
              }
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 justify-between">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-light">
                    {profileUser.first_name} {profileUser.last_name}
                  </h1>
                  {profileUser.is_verified && (
                    <span className="text-blue-500 text-xl">✓</span>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<FiPlus />}
                    onClick={() => navigate(`/user/create-post`)}
                  >
                    Create Post
                  </Button>
                </div>
              </div>

              <div className="flex gap-6 mb-4 text-sm">
                <div>
                  <span className="font-semibold">
                    {formatNumber(profileUser.connection_count)}
                  </span>{" "}
                  connections
                </div>
                <div>
                  <span className="font-semibold">
                    {formatNumber(profileUser.follower_count)}
                  </span>{" "}
                  followers
                </div>
                <div>
                  <span className="font-semibold">
                    {formatNumber(profileUser.profile_views)}
                  </span>{" "}
                  profile views
                </div>
              </div>

              <div className="text-sm">
                <div className="font-semibold mb-1">{profileUser.headline}</div>
                <div className="mb-1">
                  {profileUser.address?.city?.name && `${profileUser.address.city.name}, `}
                  {profileUser.address?.state?.name && `${profileUser.address.state.name}, `}
                  {profileUser.address?.country?.name}
                </div>
                <div className="glassy-text-secondary">
                  {profileUser.gender && `${profileUser.gender} • `}
                  {profileUser.birth_date && `Born ${formatBirthDate(profileUser.birth_date)}`}
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE VIEW */}
          <div className="flex flex-col md:hidden items-start gap-4 mb-6">
            <div className="flex items-center gap-4">
              {profileUser.profile_picture_url ?
                <img
                  src={profileUser.profile_picture_url || '/default-avatar.png'}
                  alt="Profile"
                  className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover border-2 border-gray-200"
                />
                :
                <img
                  src={`/0684456b-aa2b-4631-86f7-93ceaf33303c.png`}
                  alt="Profile"
                  className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover border-2 border-gray-200"
                />
              }
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-medium">
                    {profileUser.first_name} {profileUser.last_name}
                  </h1>
                  {profileUser.is_verified && (
                    <span className="text-blue-500 text-lg">✓</span>
                  )}
                </div>
                <div className="text-sm glassy-text-secondary">{profileUser.headline}</div>
              </div>
            </div>

            <div className="flex gap-4 text-sm">
              <div>
                <span className="font-semibold">{formatNumber(profileUser.connection_count)}</span> connections
              </div>
              <div>
                <span className="font-semibold">{formatNumber(profileUser.follower_count)}</span> followers
              </div>
            </div>

            <div className="text-sm">
              <div>
                {profileUser.address?.city?.name && `${profileUser.address.city.name}, `}
                {profileUser.address?.state?.name && `${profileUser.address.state.name}, `}
                {profileUser.address?.country?.name}
              </div>
              <div className="glassy-text-secondary">
                {profileUser.gender && `${profileUser.gender} • `}
                {profileUser.birth_date && `Born ${formatBirthDate(profileUser.birth_date)}`}
              </div>
            </div>

            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                icon={<FiPlus />}
                onClick={() => navigate(`/user/create-post`)}
              >
                Create Post
              </Button>
            </div>
          </div>
          <div className="">
            <div className="relative flex-1 min-w-[250px]">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts or tags..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

          </div>

        </div>


        {loading ? (
          <div className="space-y-4">

          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="glassy-card rounded-lg shadow p-8 text-center">
            <p className="glassy-text-secondary">No posts found. Create your first post!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 mt-4">
              {filteredPosts.map((post) => (
                <PostCard
                  profileData={personalInfo}
                  key={post._id}
                  post={post}
                  onDelete={() => setIsDeleteModal(post._id)}
                  onToggleStatus={handleToggleStatus}
                  onView={openViewModal}
                  isViewMode={false}
                  onShare={handleShareClick}
                  handleComment={handleComment}
                />
              ))}
            </div>
            {comments && (
              <div className="space-y-4">
                {Array.isArray(comments?.list) && comments?.list?.map((comment, index) => (
                  <div key={index} className="flex items-start space-x-3 p-2 border-b">
                    {/* Profile picture */}
                    <img
                      src={comment.user.profile_picture_url}
                      alt={comment.user.first_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm">
                          {comment.user.first_name} {comment.user.last_name}
                        </span>
                        <span className="text-xs glassy-text-secondary">
                          {new Date(comment.updatedAt).toLocaleString()}
                        </span>
                      </div>

                      <p className="glassy-text-primary text-sm">{comment.text}</p>

                      <div className="flex items-center space-x-4 mt-1 text-xs glassy-text-secondary">
                        <button className="hover:text-blue-600">
                          👍 {comment.likeCount}
                        </button>
                        <button className="hover:text-blue-600">
                          💬 Reply ({comment.repliesCount})
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <PaginationComponent />
          </>
        )}

        {viewModalOpen && currentPost && (
          <div className="fixed inset-0 glassy-card/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glassy-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => setViewModalOpen(false)}
                className="absolute top-4 right-4 glassy-text-secondary hover:glassy-text-primary text-2xl z-10 glassy-card rounded-full p-1"
              >
                <FaTimes />
              </button>
              <PostCard
                post={currentPost}
                profileData={personalInfo}
                onDelete={() => setIsDeleteModal(currentPost._id)}
                onToggleStatus={handleToggleStatus}
                onView={openViewModal}
                isViewMode={true}
                onShare={handleShareClick}
              />
            </div>
          </div>
        )}

        <AlertModal isOpen={!!isDeleteModal}
          title={
            <div className="flex items-center gap-2">
              <PiWarning className="text-red-500" />
              <span>Delete Post</span>
            </div>
          }
          message="Are you sure you want to delete this post? This action cannot be undone."
          onCancel={() => { setIsDeleteModal(false); }}
          onConfirm={() => handleDeletePost(isDeleteModal)}
          confirmText="Delete" cancelText="Cancel" type="danger"
        />

        {showShareModal && (
          <ShareModal
            post={selectedPost}
            onClose={() => setShowShareModal(false)}
            userData={userData}
          />
        )}
      </div>
    </div>
  );
};

export default Posts;