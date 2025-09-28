/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiTrash2, FiEye, FiSearch, FiMoreHorizontal, FiChevronLeft, FiChevronRight, FiExternalLink, FiPlus } from 'react-icons/fi';
import { PiHeartStraightFill, PiHeartStraightLight, PiWarning } from "react-icons/pi";
import { toast } from 'sonner';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
import { FaExpand, FaPause, FaPlay, FaTimes, FaRegComment, FaRegShareSquare } from 'react-icons/fa';
import { deletePost, enableDisablePost, getCommentOnPost, getPostList, getReplyOnPost } from '../../../redux/CompanySlices/companiesSlice';
import { BsFillHeartFill } from 'react-icons/bs';
import Button from '../../../components/ui/Button/Button';
import { getCookie } from '../../../components/utils/cookieHandler';
import { Pagination } from 'swiper/modules';
import AlertModal from '../../../components/ui/Modal/AlertModal';
import PeopleToConnect from '../../../components/ui/ConnectSidebar/ConnectSidebar';
import { suggestedUser } from '../../../redux/Users/userSlice';
const ROLES = {
  COMPANIES: 3,
  COMPANIES_ADMIN: 7,
  INSTITUTIONS: 4,
  INSTITUTIONS_ADMIN: 8,
};

const POST_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  LINK: 'link',
  POLL: 'poll',
  IMAGE_VIDEO: 'image-video'
};
const CommentItem = ({ comment, dispatch }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const fetchReplies = async () => {
    if (replies.length > 0) {
      setShowReplies(!showReplies);
      return;
    }

    setLoadingReplies(true);
    try {
      const result = await dispatch(getReplyOnPost({ comment: comment._id })).unwrap();
      setReplies(result.data || []);
      setShowReplies(true);
    } catch (error) {
      toast.error('Failed to load replies');
    } finally {
      setLoadingReplies(false);
    }
  };

  return (
    <div className="comment-item border-b border-gray-100 py-4">
      <div className="flex items-start space-x-3">
        <img
          src={comment.user?.profile_picture_url || "https://res.cloudinary.com/df9yljbof/image/upload/v1753439542/profiles/blob.jpg"}
          alt={comment.user?.first_name}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://res.cloudinary.com/df9yljbof/image/upload/v1753439542/profiles/blob.jpg";
          }}
        />
        <div className="flex-1">
          <div className="bg-gray-100 rounded-2xl p-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">
                {comment.user?.first_name} {comment.user?.last_name}
              </h4>
              <span className="text-xs text-gray-500">
                {new Date(comment.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-800 mt-1 text-sm">{comment.text}</p>
          </div>

          <div className="flex items-center mt-2 space-x-4">
            <button
              className={`flex items-center text-xs ${comment.isLiked ? 'text-blue-600' : 'text-gray-500'}`}
            >
              {comment.isLiked ? <PiHeartStraightFill className="mr-1" /> : <BsFillHeartFill className="mr-1" />}
              {comment.likeCount > 0 ? comment.likeCount : 'Like'}
            </button>

            {comment.repliesCount > 0 && (
              <button
                onClick={fetchReplies}
                className="flex items-center text-xs text-gray-500"
              >
                {showReplies ? 'Hide replies' : `View ${comment.repliesCount} replies`}
                {loadingReplies && <span className="ml-1">...</span>}
              </button>
            )}
          </div>
        </div>
      </div>

      {showReplies && replies.length > 0 && (
        <div className="replies-container ml-12 space-y-3">
          {replies?.map(reply => (
            <div key={reply._id} className="flex items-start space-x-3">
              <img
                src={reply.user?.profile_picture_url || "https://via.placeholder.com/32"}
                alt={reply.user?.first_name}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/32";
                }}
              />
              <div className="flex-1">
                <div className="bg-gray-100 rounded-2xl p-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs">
                      {reply.user?.first_name} {reply.user?.last_name}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {new Date(reply.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-800 mt-1 text-xs">{reply.text}</p>
                </div>
                <div className="flex items-center mt-1 space-x-3">
                  <button
                    className={`flex items-center text-xs ${reply.isLiked ? 'text-blue-600' : 'text-gray-500'}`}
                  >
                    {reply.isLiked ? <PiHeartStraightFill className="mr-1" /> : <BsFillHeartFill className="mr-1" />}
                    {reply.likeCount > 0 ? reply.likeCount : 'Like'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const CommentsModal = ({ isOpen, onClose, post, profileData }) => {
  const dispatch = useDispatch();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && post?._id) {
      fetchComments();
    }
  }, [isOpen, post]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const result = await dispatch(getCommentOnPost({ post: post._id })).unwrap();
      setComments(result.data || []);
    } catch (error) {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Comments</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="flex items-start space-x-3">
            <img
              src={profileData?.logo_url || "https://via.placeholder.com/40"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/40";
              }}
            />
            <div className="flex-1 bg-gray-100 rounded-2xl p-3">
              <h3 className="font-semibold text-sm">
                {profileData?.name || profileData?.username || "Unknown"}
              </h3>
              <p className="text-gray-800 mt-1 text-sm">{post.content}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)]?.map((_, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <Skeleton circle width={40} height={40} />
                  <div className="flex-1">
                    <Skeleton width={120} height={14} />
                    <Skeleton count={2} height={12} className="mt-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No comments yet.
            </div>
          ) : (
            <div className="space-y-4">
              {comments?.map(comment => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  currentUserId={getCookie("USER_ID")}
                  postId={post._id}
                  dispatch={dispatch}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const SkeletonLoader = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 w-full">
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
        {[1, 2, 3]?.map((_, i) => (
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
}

function CustomVideoPlayer({ videoUrl }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (video) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        video.requestFullscreen();
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain max-h-[400px]"
        muted
        playsInline
      />
      <button
        onClick={togglePlayPause}
        className="absolute text-white bg-black/50 p-4 rounded-full text-xl hover:bg-black/70 transition"
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <button
        onClick={toggleFullscreen}
        className="absolute bottom-4 right-4 text-white bg-black/50 p-2 rounded-full text-sm hover:bg-black/70 transition"
      >
        <FaExpand />
      </button>
    </div>
  );
}

const LinkPreview = ({ post }) => {
  const getDomainFromUrl = (url) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain;
    } catch (e) {
      return url;
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3 mt-3 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => window.open(post.link, '_blank')}>

      <div className="">
        <div className="flex items-center mt-2">
          <FiExternalLink className="text-blue-600 mr-1" size={12} />
          <p className="text-xs text-blue-600">{getDomainFromUrl(post.link)}</p>
        </div>
      </div>
      {post.thumbnail && (
        <div className="ml-3  bg-gray-200 max-h-96 rounded overflow-hidden flex-shrink-0">
          <img src={post.thumbnail} alt="Link thumbnail" className="w-full max-h-[400px] object-contain" />
        </div>
      )}
    </div>
  );
};

const PollComponent = ({ poll }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  // Calculate percentages for each option
  const totalVotes = poll.total_votes || poll.options.reduce((sum, option) => sum + (option.vote_count || 0), 0);

  const handleVote = (optionIndex) => {
    if (!selectedOption) {
      setSelectedOption(optionIndex);
      // In a real app, you would dispatch an action to record the vote
      toast.success('Vote recorded!');
    }
  };

  return (
    <div className="mt-3 border border-gray-200 rounded-lg p-3">
      <p className="font-medium text-sm mb-3">{poll.question || "Poll"}</p>
      <div className="space-y-2">
        {poll.options?.map((option, index) => {
          const voteCount = option.vote_count || 0;
          const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          const isSelected = selectedOption === index;

          return (
            <div
              key={index}
              className={`relative cursor-pointer p-2 rounded border ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
              onClick={() => handleVote(index)}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm">{option.text}</span>
                {(selectedOption !== null || totalVotes > 0) && (
                  <span className="text-xs font-medium">{percentage}%</span>
                )}
              </div>
              {(selectedOption !== null || totalVotes > 0) && (
                <div
                  className="absolute bottom-0 left-0 h-1 bg-blue-200 rounded"
                  style={{ width: `${percentage}%` }}
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-2">{totalVotes} votes</p>
    </div>
  );
};

const getPostType = (post) => {
  if (post.poll && post.poll.options && post.poll.options.length > 0) return POST_TYPES.POLL;
  if (post.video_url) return POST_TYPES.VIDEO;
  if (post.link) return POST_TYPES.LINK;
  if (post.image_urls && post.image_urls.length > 0) return POST_TYPES.IMAGE;
  if (post.post_type === 'image-video') return POST_TYPES.IMAGE_VIDEO;
  return POST_TYPES.TEXT;
};

const PostHeader = ({ profileData, post, onView, onDelete, isViewMode, formatDate }) => {
  const [showActions, setShowActions] = useState(false);
  return (
    <div className="flex items-center justify-between p-4 pb-2">
      <div className="flex items-center space-x-3">
        {profileData?.logo_url ? (
          <img
            src={profileData.logo_url}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '';
            }}
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-[#000000E6] text-lg font-semibold">
            {profileData?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        )}

        <div>
          <p className="font-semibold text-sm">
            {profileData?.name}
            {profileData?.is_verified && (
              <span className="ml-1 text-blue-500">✓</span>
            )}
          </p>
          <p className="text-xs text-gray-500">{profileData?.headline}</p>
          <p className="text-xs text-gray-400">{formatDate(post.createdAt)} • <span className={`${post.isDisable ? 'text-red-500' : 'text-green-500'}`}>{post.isDisable ? 'Disabled' : 'Active'}</span></p>
        </div>
      </div>
      {!isViewMode && (
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiMoreHorizontal size={20} />
          </button>
          {showActions && (
            <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10 min-w-[120px]">
              <button
                onClick={() => { onView(post); setShowActions(false) }}
                className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
              >
                <FiEye size={16} />
                <span>View</span>
              </button>
              <button
                onClick={() => { onDelete(post._id); setShowActions(false) }}
                className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-red-600"
              >
                <FiTrash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
const PostContent = ({ post, type }) => {
  const renderMedia = () => {
    if (type === POST_TYPES.IMAGE && post.image_urls?.length) {
      return (
        <div className="w-full flex justify-center bg-neutral-100 mt-3 rounded-lg overflow-hidden">
          <div className="w-full max-h-[500px] flex items-center justify-center">
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              className="w-full h-[500px]"
            >
              {post.image_urls?.map((url, index) => (
                <SwiperSlide
                  key={`img-${index}`}
                  className="flex items-center justify-center"
                >
                  <img
                    src={url}
                    alt={`Post content ${index}`}
                    className="max-h-[480px] max-w-full object-contain"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      );
    }
    if (type === POST_TYPES.IMAGE_VIDEO && post.image_urls?.length) {
      return (
        <div className="w-full flex justify-center bg-neutral-100 mt-3 rounded-lg overflow-hidden">
          <div className="w-full max-h-[500px] flex items-center justify-center">
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              className="w-full h-[500px]"
            >
              {post.image_urls?.map((url, index) => (
                <SwiperSlide
                  key={`imgvid-${index}`}
                  className="flex items-center justify-center"
                >
                  <img
                    src={url}
                    alt={`Post content ${index}`}
                    className="max-h-[480px] max-w-full object-contain"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      );
    }
    if (type === POST_TYPES.VIDEO && post.video_url) {
      const isYouTubeUrl = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(post.video_url);
      return (
        <div className="w-full flex justify-center bg-neutral-100 mt-3 rounded-lg overflow-hidden">
          {isYouTubeUrl ? (
            <div
              className="w-full h-64 flex items-center justify-center bg-black text-white cursor-pointer"
              onClick={() => window.open(post.video_url, '_blank')}
            >
              <p className="text-sm underline">Watch on YouTube</p>
            </div>
          ) : (
            <CustomVideoPlayer videoUrl={post.video_url} />
          )}
        </div>
      );
    }
    if (type === POST_TYPES.LINK && post.link) {
      return <LinkPreview post={post} />;
    }
    if (type === POST_TYPES.POLL && post.poll) {
      return <PollComponent poll={post.poll} />;
    }
    return null;
  };


  return (
    <div className="px-4 pb-2">
      {post.title && (
        <h3 className="font-semibold text-gray-900 text-base mb-2">{post.title}</h3>
      )}
      {post.content && (
        <p className="text-sm text-gray-800 mb-2">
          {post.content}
        </p>
      )}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-2">
          <div className="flex flex-wrap gap-1">
            {post.tags?.map((tag, index) => (
              <span key={index} className="text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
      {renderMedia()}
    </div>
  );
};
const PostActions = ({ post, onToggleStatus, profileData }) => {
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-around border-t border-gray-100 py-2">
        <button
          className={`flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors px-4 py-1 rounded-lg hover:bg-gray-50`}
        >
          {post.like_count > 0 ? (
            <PiHeartStraightFill className="text-red-500 w-5 h-5" />
          ) : (
            <PiHeartStraightLight className="text-gray-400 w-5 h-5" />
          )}
          <span>
            {post?.like_count}
          </span>
        </button>
        <button
          onClick={() => setCommentsModalOpen(true)}
          className="flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors px-4 py-1 rounded-lg hover:bg-gray-50"
        >
          <FaRegComment className="w-5 h-5" />
          <span>Comment</span>
        </button>
        <button
          className="flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors px-4 py-1 rounded-lg hover:bg-gray-50"
        >
          <FaRegShareSquare className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>
      <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between bg-gray-50">
        <span className="text-xs text-gray-500">
          Post Status: <span className={post.isDisable ? 'text-red-500 font-medium' : 'text-green-500 font-medium'}>{post.isDisable ? 'Disabled' : 'Active'}</span>
        </span>

        <button
          onClick={() => onToggleStatus(post)}
          className={`flex items-center justify-center px-3 py-1.5 rounded-xl border transition-colors ${post.isDisable
            ? 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-700'
            : 'bg-red-100 border-red-200 hover:bg-red-200 text-red-700'
            } text-xs font-medium`} title={post.isDisable ? 'Click to Enable' : 'Click to Disable'}
        >
          {post.isDisable ? 'Enable' : 'Disable'}
        </button>
      </div>
      <CommentsModal
        isOpen={commentsModalOpen}
        onClose={() => setCommentsModalOpen(false)}
        post={post}
        profileData={profileData}
      />
    </>
  );
};
const PostCard = ({ post, onDelete, onToggleStatus, onView, profileData, isViewMode = false, onShare }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const postType = getPostType(post);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-6">
      <PostHeader
        profileData={profileData}
        post={post}
        onView={onView}
        onDelete={onDelete}
        isViewMode={isViewMode}
        formatDate={formatDate}
      />

      <PostContent post={post} type={postType} />

      <PostActions
        post={post}
        onLike={() => { }}
        onComment={() => { }}
        onShare={onShare}
        onToggleStatus={onToggleStatus}
      />
    </div>
  );
};
const Posts = ({ companiesProfileData, instituteProfileData }) => {
      const [activeTab, setActiveTab] = useState('user');
    const userSelector = useSelector((state) => state.user);
    const { suggestedUserData: { data: suggestedUsers } = {} } =
        userSelector || {};

  const userRole = Number(getCookie("COMPANY_ROLE"));
  const profileData =
    [ROLES.COMPANIES, ROLES.COMPANIES_ADMIN].includes(userRole)
      ? companiesProfileData
      : [ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)
        ? instituteProfileData
        : {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getPostListData: { data: posts = [] }, loading } = useSelector(state => state.companies);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [loading2, setLoading2] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(12);
  const [totalPosts, setTotalPosts] = useState(0);
    useEffect(() => {
        dispatch(suggestedUser({ page: 1, size: 10, type: activeTab }));

    }, [dispatch, activeTab]);
  useEffect(() => {
    const timer = setTimeout(() => {
      const mode = getCookie("ACCESS_MODE");
      // if (mode === '5') {
      //   navigate('/user/feed');
      // }
      setLoading2(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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
      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 mt-4">

        <div className="text-sm text-gray-600">
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
          {getPageNumbers()?.map((item, index) => {
            if (item === 'start-ellipsis' || item === 'end-ellipsis') {
              return (
                <span key={index} className="px-2 text-gray-500">
                  ...
                </span>
              );
            }
            return (
              <button
                key={item}
                onClick={() => handlePageChange(item)}
                className={`w-8 h-8 rounded flex items-center justify-center transition ${currentPage === item
                  ? 'bg-blue-600 text-white'
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
  const getBasePath = () => {
    switch (userRole) {
      case 1:
      case 2:
        return "admin";
      case 3:
      case 7:
        return "companies";
      case 4:
      case 8:
        return "institute";
      default:
        return "admin";
    }
  };
  const basePath = getBasePath();
  const [bannerUrl, setBannerUrl] = useState(profileData?.banner_image_url || '/0684456b-aa2b-4631-86f7-93ceaf33303c.png');
  useEffect(() => {
    if (profileData?.banner_image_url) {
      const img = new Image();
      img.src = profileData.banner_image_url;
      img.onload = () => setBannerUrl(profileData.banner_image_url);
      img.onerror = () => setBannerUrl('/0684456b-aa2b-4631-86f7-93ceaf33303c.png');
    } else {
      setBannerUrl('/0684456b-aa2b-4631-86f7-93ceaf33303c.png');
    }
  }, [profileData?.banner_image_url]);
  if (loading2) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
      </div>
    )
  }

  return (
    <div className="bg-[#F6FAFD] p-6 min-h-screen">
      <div className="flex flex-col md:flex-row w-full mx-auto gap-6">
        <div className="xl:w-[75%] lg:w-[70%] md:w-[60%] w-full space-y-6">
          <div className="relative rounded-lg overflow-hidden shadow-md">
            {profileData?.banner_image_url && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${bannerUrl})`,
                  opacity: 0.15,
                  zIndex: 0,
                }}
              />
            )}
            <div className="absolute inset-0 bg-black/10 z-0" />
            <div className="relative z-10 bg-opacity-90 rounded-lg p-6">
              <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8 mb-6">
                <div className="flex-shrink-0">
                  <img
                    src={profileData?.logo_url || '/36369.jpg'}
                    alt="Company Logo"
                    className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover border-2 border-gray-200"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 justify-between">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl md:text-2xl font-light">
                        {profileData?.name}
                      </h1>
                      {profileData?.is_verified && (
                        <span className="text-blue-500 text-xl">✓</span>
                      )}
                    </div>
                    <a
                      href={profileData?.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm font-semibold"
                    >
                      Visit Website
                    </a>
                    <div className="flex gap-3">
                      <Button variant='primary' size='sm' icon={<FiPlus />}
                        onClick={() => navigate(`/company/create-post`)}>
                        Create Post
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-6 mb-4 text-sm">
                    <div><span className="font-semibold">{profileData?.follower_count}</span> followers</div>
                    <div><span className="font-semibold">{profileData?.employee_count}</span> employees</div>
                    <div><span className="font-semibold">{profileData?.company_size}</span> size</div>
                  </div>

                  <div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-y-2">
                    <div className='flex gap-1'>
                      <div className="font-semibold">Industry:</div>
                      <div className="capitalize">
                        {Array.isArray(profileData?.industry) && profileData?.industry?.map(ind => ind.name).join(', ')}
                      </div>
                    </div>

                    <div className='flex gap-1'>
                      <div className="font-semibold">Headquarters:</div>
                      <div>
                        {profileData?.headquarters?.city?.name}, {profileData?.headquarters?.state?.name}, {profileData?.headquarters?.country?.name}
                      </div>
                    </div>
                    <div className="text-gray-600 col-span-2">
                      {profileData?.company_type && `${profileData?.company_type} • `}
                      {profileData?.founded_year && `Founded ${new Date(profileData?.founded_year * 1000).getFullYear()}`}
                    </div>
                    {Array.isArray(profileData?.specialties) && profileData.specialties.length > 0 && (
                      <div className='flex gap-1 col-span-2'>
                        <div className="font-semibold">Specialties:</div>
                        <div>{profileData?.specialties.join(', ')}</div>
                      </div>
                    )}
                  </div>
                  {profileData?.description && (
                    <div className="mt-3">
                      <div className="font-semibold mb-1">About:</div>
                      <div className="text-black text-sm">{profileData?.description}</div>
                    </div>
                  )}
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
          </div>
          {loading ? (
            <div className="space-y-4">
              {[...Array(4)]?.map((_, index) => (
                <SkeletonLoader key={index} />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No posts found. Create your first post!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 mt-4">
                {filteredPosts?.map((post) => (
                  <PostCard
                    profileData={profileData}
                    key={post._id}
                    post={post}
                    onDelete={() => setIsDeleteModal(post._id)}
                    onToggleStatus={handleToggleStatus}
                    onView={openViewModal}
                    isViewMode={false}
                  />
                ))}
              </div>
              <PaginationComponent />
            </>
          )}

          {viewModalOpen && currentPost && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl z-10 bg-white rounded-full p-1"
                >
                  <FaTimes />
                </button>
                <PostCard
                  post={currentPost}
                  profileData={profileData}
                  onDelete={() => setIsDeleteModal(currentPost._id)}
                  onToggleStatus={handleToggleStatus}
                  onView={openViewModal}
                  isViewMode={true}
                />
              </div>
            </div>
          )}

          <AlertModal
            isOpen={!!isDeleteModal}
            title={
              <div className="flex items-center gap-2">
                <PiWarning className="text-red-500" />
                <span>Delete Post</span>
              </div>
            }
            message="Are you sure you want to delete this post? This action cannot be undone."
            onCancel={() => {
              setIsDeleteModal(false);
            }}
            onConfirm={() => handleDeletePost(isDeleteModal)}
            confirmText="Delete"
            cancelText="Cancel"
            type="danger"
          />
        </div>
        {/* Right Sidebar */}
        <div className="xl:w-[25%] lg:w-[30%] md:w-[40%] hidden md:block">
          <div className="sticky top-6 h-fit max-h-[calc(100vh-2rem)] overflow-y-auto hide-scrollbar">
            <PeopleToConnect
              data={suggestedUsers?.data?.list || []}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;