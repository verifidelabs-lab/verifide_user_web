/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { BiHeart, BiSolidHeart } from 'react-icons/bi';
import { BsSend, BsExclamationCircle } from 'react-icons/bs';
import { FiMoreHorizontal } from 'react-icons/fi';
import { LuMessageCircle, LuRepeat2 } from 'react-icons/lu';
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';
import { FaExpand } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { toast } from 'sonner';
import { IoCopyOutline, IoReturnDownBackOutline } from 'react-icons/io5';
import { AiOutlineDelete } from 'react-icons/ai';
import { getCookie } from '../../components/utils/cookieHandler';
import { commentOnPost, deletePost, getCommentOnPost, getPostDetails, likeDislikePostComment, messageChatUser, replyToComment, reportPost } from '../../redux/Users/userSlice';
import ReportPostModal from './components/ReportPostModal';
import AlertModal from '../../components/ui/Modal/AlertModal';
import ShareModal from './components/ShareModal';
import moment from 'moment-timezone';

const PostDetails = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [postId, setPostId] = useState(null);
  const [userData, setUserData] = useState([]);
  const [accessMode, setAccessMode] = useState(getCookie("ACCESS_MODE"));
  const [postData, setPostData] = useState(null);
  const [expandedPost, setExpandedPost] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [localLikes, setLocalLikes] = useState({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const res = await dispatch(messageChatUser({ isBlocked: false })).unwrap();
        setUserData(res?.data || []);
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
        toast.error('Failed to load contacts');
      }
    };
    fetchUserList();
  }, [dispatch]);

  useEffect(() => {
    const storedPostId = sessionStorage.getItem('currentPostId');
    if (storedPostId) {
      setPostId(storedPostId);
    } else {
      navigate(-1);
    }
  }, [username, navigate]);

  useEffect(() => {
    const handleStorageChange = () => {
      setAccessMode(getCookie("ACCESS_MODE"));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const checkAndFetchData = async () => {
      if (postId) {
        try {
          const dataRes = await dispatch(getPostDetails({ post_id: postId }));
          setPostData(dataRes?.payload?.data);
          if (dataRes?.payload?.data?.like_count > 0) {
            setLocalLikes(prev => ({ ...prev, [postId]: true }));
          }
        } catch (error) {
          console.error("Failed to fetch post data:", error);
        }
      }
    };

    checkAndFetchData();
  }, [accessMode, postId, dispatch]);

  const handleLike = async () => {
    const wasLiked = localLikes[postId] || false;
    setLocalLikes(prev => ({ ...prev, [postId]: !wasLiked }));
    try {
      const res = await dispatch(likeDislikePostComment({
        content_id: postId,
        content_type: "Post"
      })).unwrap();
      if (res?.message === "Post disliked") {
        setLocalLikes(prev => ({ ...prev, [postId]: false }));
      }
      const dataRes = await dispatch(getPostDetails({ post_id: postId }));
      setPostData(dataRes?.payload?.data);
    } catch (err) {
      setLocalLikes(prev => ({ ...prev, [postId]: wasLiked }));
      toast.error('Failed to like post');
    }
  };

  const handleCommentSubmit = async (text) => {
    try {
      await dispatch(commentOnPost({
        post: postId,
        text: text
      }));
      const dataRes = await dispatch(getPostDetails({ post_id: postId }));
      setPostData(dataRes?.payload?.data);
    } catch (error) {
      toast.error('Failed to post comment');
    }
  };

  const handleReplySubmit = async (parentCommentId, text) => {
    try {
      await dispatch(replyToComment({
        parentComment: parentCommentId,
        text: text
      }));
      const dataRes = await dispatch(getPostDetails({ post_id: postId }));
      setPostData(dataRes?.payload?.data);
    } catch (error) {
      toast.error('Failed to post reply');
    }
  };

  const handleCommentLike = async (contentId, contentType) => {
    try {
      await dispatch(likeDislikePostComment({
        content_id: contentId,
        content_type: contentType
      }));
      const dataRes = await dispatch(getPostDetails({ post_id: postId }));
      setPostData(dataRes?.payload?.data);
    } catch (error) {
      toast.error('Failed to like comment');
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleSeeMore = () => {
    setExpandedPost(!expandedPost);
  };

  const handleShareClick = () => {
    setSelectedPost(postData);
    setShowShareModal(true);
  };

  const handleOptionsClick = () => {
    setShowOptionsDropdown(!showOptionsDropdown);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
    setShowOptionsDropdown(false);
  };

  const handleReportPost = () => {
    setShowReportModal(true);
    setShowOptionsDropdown(false);
  };

  const handleReportSubmit = async (type, reason) => {
    try {
      await dispatch(reportPost({
        post_id: postId,
        type,
        reason
      })).unwrap();
      toast.success('Post reported successfully');
      setShowReportModal(false);
    } catch (error) {
      toast.error('Failed to report post');
      console.error('Error reporting post:', error);
    }
  };

  const handleDeleteButtonClick = () => {
    setIsDeleteModal(true);
  };

  const handleDeletePost = async () => {
    try {
      const res = await dispatch(deletePost({ _id: postId })).unwrap();
      toast.success(res?.message);
      navigate(-1);
    } catch (error) {
      toast.error(error?.message || 'Failed to delete post');
    } finally {
      setIsDeleteModal(false);
    }
  };

  const MediaCarousel = ({ post }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [videoError, setVideoError] = useState(false);

    const isExternalVideo = post?.video_url && !post.video_url.endsWith('.mp4') && !post.video_url.endsWith('.webm');
    const isValidVideo = post?.video_url?.endsWith('.mp4') || post?.video_url?.endsWith('.webm');
    const hasVideo = !!post?.video_url;
    const hasMultipleImages = post?.image_urls?.length > 1;

    useEffect(() => {
      if (videoRef.current && isValidVideo) {
        videoRef.current.play();
      }
    }, [post?.video_url]);

    const togglePlayPause = () => {
      if (!videoRef.current) return;
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    const toggleMute = () => {
      if (videoRef.current) {
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(videoRef.current.muted);
      }
    };

    const toggleFullscreen = () => {
      const video = videoRef.current;
      if (!video) return;

      if (!document.fullscreenElement) {
        video.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    };

    const getYouTubeVideoId = (url) => {
      const match = url.match(/(?:youtu\.be\/|youtube\.com.*(?:\?|&)v=)([^&?/]+)/);
      return match ? match[1] : null;
    };

    const renderVideoSlide = () => {
      if (videoError) {
        return (
          <div className="w-full h-full flex items-center justify-center glassy-card glassy-text-primary text-lg font-semibold">
            This video is not supported.
          </div>
        );
      }

      if (isExternalVideo) {
        const videoId = getYouTubeVideoId(post.video_url);
        const thumbnail = videoId
          ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          : 'https://via.placeholder.com/480x360?text=Watch+Video';

        return (
          <div
            onClick={() => window.open(post.video_url, '_blank')}
            className="relative w-full h-full cursor-pointer group"
          >
            <img src={thumbnail} alt="External Video" className="w-full h-full object-cover" />
            <div className="absolute inset-0 glassy-card/40 flex items-center justify-center glassy-text-primary text-lg font-semibold group-hover:glassy-card/60 transition">
              Watch Video
            </div>
          </div>
        );
      }

      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <video
            ref={videoRef}
            src={post.video_url}
            className="w-full h-full object-contain"
            muted={isMuted}
            autoPlay
            playsInline
            controls={false}
            onError={() => setVideoError(true)}
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 group-hover:opacity-100 opacity-0 transition-opacity flex items-center justify-center">
            <button
              onClick={togglePlayPause}
              className="p-2 rounded-full glassy-card/50 glassy-text-primary hover:glassy-card/70"
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-4.596-2.65A1 1 0 009 9.36v5.279a1 1 0 001.156.987l4.596-2.65a1 1 0 000-1.731z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
            <button
              onClick={toggleMute}
              className="absolute top-3 right-3 glassy-card/50 glassy-text-primary p-2 rounded-full hover:glassy-card/70"
            >
              {isMuted ? <HiSpeakerXMark className="w-5 h-5" /> : <HiSpeakerWave className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="absolute top-3 left-3 glassy-card/50 glassy-text-primary p-2 rounded-full hover:glassy-card/70"
            >
              <FaExpand className="w-5 h-5" />
            </button>
          </div>
        </div>
      );
    };

    if (!hasVideo && (!post.image_urls || post.image_urls.length === 0)) return null;

    return (
      <div className="w-full aspect-square max-h-[500px] relative group overflow-hidden">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          loop={hasMultipleImages}
          className="h-full w-full"
        >
          {post.image_urls?.map((url, index) => (
            <SwiperSlide key={`img-${index}`}>
              <img
                src={url}
                alt={`Post content ${index}`}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </SwiperSlide>
          ))}

          {hasVideo && <SwiperSlide key="video">{renderVideoSlide()}</SwiperSlide>}
        </Swiper>
      </div>
    );
  };

  const CommentSection = ({ onCommentSubmit, onReplySubmit, onLike }) => {
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    const handleSubmitComment = (e) => {
      e.preventDefault();
      if (newComment.trim()) {
        onCommentSubmit(newComment);
        setNewComment('');
      }
    };

    const handleSubmitReply = (e, parentId) => {
      e.preventDefault();
      if (replyText.trim()) {
        onReplySubmit(parentId, replyText);
        setReplyText('');
        setReplyingTo(null);
      }
    };

    return (
      <div className="mt-4 border-t border-gray-100 pt-4">
        <form onSubmit={handleSubmitComment} className="mb-4">
          <div className="flex items-center space-x-2 mx-4">
            <img
              src={postData?.userData?.profile_picture_url || "/0684456b-aa2b-4631-86f7-93ceaf33303c.png"}
              alt="User"
              className="w-10 h-10 rounded-full border border-gray-400"
            />
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="glassy-card0 glassy-text-primary px-4 py-2 rounded-full hover:bg-blue-600"
            >
              Post
            </button>
          </div>
        </form>

        {postData?.commentList?.map((comment) => (
          <div key={comment._id} className="mb-4 pl-4 border-l-2 border-gray-200">
            <div className="flex items-start">
              <img
                src={comment.user?.profile_picture_url || "/0684456b-aa2b-4631-86f7-93ceaf33303c.png"}
                alt={comment.user?.first_name}
                className="w-8 h-8 rounded-full border border-gray-400 mr-2"
              />
              <div className="">
                <div className="">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{comment.user?.first_name} {comment.user?.last_name}</span>
                    <span className="text-xs glassy-text-secondary">{new Date(comment.updatedAt).toLocaleString()}</span>
                  </div>
                  <p className="mt-1">{comment.text}</p>
                </div>
                <div className="flex items-center space-x-4 mt-2 ml-2">
                  <button
                    onClick={() => onLike(comment._id, "Comment")}
                    className="flex items-center space-x-1 glassy-text-secondary hover:text-blue-500"
                  >
                    {comment.isLiked ? (
                      <BiSolidHeart className="text-red-500" />
                    ) : (
                      <BiHeart />
                    )}
                    <span>{comment.likeCount || ''}</span>
                  </button>
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                    className="glassy-text-secondary hover:text-blue-500"
                  >
                    Reply
                  </button>
                </div>

                {replyingTo === comment._id && (
                  <form onSubmit={(e) => handleSubmitReply(e, comment._id)} className="mt-2 flex items-center space-x-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-1 border border-gray-200 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="glassy-card0 glassy-text-primary px-3 py-1 rounded-full text-sm hover:bg-blue-600"
                    >
                      Post
                    </button>
                  </form>
                )}

                {comment.replies?.map((reply) => (
                  <div key={reply._id} className="mt-3 ml-4 pl-4 border-l-2 border-gray-200">
                    <div className="flex items-start">
                      <img
                        src={reply.user?.profile_picture_url || "/0684456b-aa2b-4631-86f7-93ceaf33303c.png"}
                        alt={reply.user?.first_name}
                        className="w-8 h-8 rounded-full border border-gray-400 mr-2"
                      />
                      <div className="">
                        <div className="rounded-lg">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{reply.user?.first_name} {reply.user?.last_name}</span>
                            <span className="text-xs glassy-text-secondary">{new Date(reply.updatedAt).toLocaleString()}</span>
                          </div>
                          <p className="mt-1">{reply.text}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const PostDetailsView = () => {
    if (!postData) return <div className="min-h-screen glassy-card flex items-center justify-center">Loading...</div>;

    return (
      <div className="min-h-screen glassy-card">
        {accessMode !== '6' && (
          <header className="glassy-card border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="glassy-text-secondary hover:glassy-text-primary"
                  >
                    ← Back
                  </button>
                  <h1 className="text-lg font-semibold glassy-text-primary">Post</h1>
                </div>
                <div className="relative">
                  <button
                    onClick={handleOptionsClick}
                    className="glassy-text-secondary hover:glassy-text-primary"
                  >
                    <FiMoreHorizontal className="w-6 h-6" />
                  </button>
                  {showOptionsDropdown && (
                    <div className="absolute right-0 mt-2 w-48 glassy-card rounded-md shadow-lg z-10 py-1 border border-gray-200">
                      <button
                        onClick={handleCopyLink}
                        className="flex items-center px-4 py-2 text-sm glassy-text-primary hover:glassy-card w-full text-left"
                      >
                        <IoCopyOutline className="mr-2" size={18} /> Copy Link
                      </button>
                      <button
                        onClick={handleReportPost}
                        className="flex items-center px-4 py-2 text-sm glassy-text-primary hover:glassy-card w-full text-left"
                      >
                        <BsExclamationCircle className="mr-2" size={18} /> Report
                      </button>
                      {postData?.isSelfPost && (
                        <button
                          onClick={handleDeleteButtonClick}
                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:glassy-card w-full text-left border-t border-gray-200"
                        >
                          <AiOutlineDelete className="mr-2" size={18} /> Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
        )}
        <div className="max-w-6xl mx-auto p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 mb-2 bg-blue-600 glassy-text-primary rounded-full shadow-md hover:bg-blue-700 transition-all ease-in-out duration-300 transform hover:scale-105" title="Back"
          >
            <IoReturnDownBackOutline size={22} />
          </button>
          <div className="glassy-card rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
            <div className="p-4 pb-2">
              <div className="flex items-start space-x-3">
                <img
                  src={postData.userData?.profile_picture_url || "/0684456b-aa2b-4631-86f7-93ceaf33303c.png"}
                  alt={postData.userData?.first_name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/0684456b-aa2b-4631-86f7-93ceaf33303c.png";
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold glassy-text-primary">
                      {postData.userData?.first_name} {postData.userData?.last_name}
                    </h3>
                    {postData.isConnected && (
                      <>
                        <span className="glassy-text-secondary">•</span>
                        <span className="text-sm glassy-text-secondary">Connected</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm glassy-text-secondary">{postData.userData?.headline || "Professional"}</p>
                  <div className="flex items-center space-x-1 text-xs glassy-text-secondary mt-1">
                    <span>{moment(postData.createdAt).format("DD/MM/YYYY")}</span>
                    <span>•</span>
                    <span>🌐</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-2">
              <div className="glassy-text-primary whitespace-pre-line leading-relaxed break-words break-all ">
                {expandedPost
                  ? postData.content
                  : postData.content.length > 200
                    ? `${postData.content.slice(0, 200)}...`
                    : postData.content}
                {postData.content.length > 200 && (
                  <button
                    onClick={handleSeeMore}
                    className="ml-2 text-blue-600 hover:underline"
                  >
                    {expandedPost ? 'See Less' : 'See More'}
                  </button>
                )}
              </div>
            </div>

            {postData.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 px-4 pb-2">
                {postData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm font-semibold text-indigo-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {(postData.image_urls?.length > 0 || postData.video_url) && (
              <div className="mt-2">
                <MediaCarousel post={postData} />
              </div>
            )}

            <div className="px-4 py-2 border-t border-gray-100 text-sm glassy-text-secondary">
              <div className="flex space-x-4">
                {postData.like_count > 0 && (
                  <span>{postData.like_count} likes</span>
                )}
                {postData.comments > 0 && (
                  <span>{postData.comments} comments</span>
                )}
                {postData.share_count > 0 && (
                  <span>{postData.share_count} reposts</span>
                )}
              </div>
            </div>

            <div className="px-6 py-3 border-t border-gray-100">
              <div className="flex items-center justify-around">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded hover:glassy-card ${(localLikes[postId] ?? postData.like_count > 0) ? 'text-red-600' : 'glassy-text-secondary'}`}
                >
                  {(localLikes[postId] ?? postData.like_count > 0) ? (
                    <BiSolidHeart className="w-5 h-5" />
                  ) : (
                    <BiHeart className="w-5 h-5" />
                  )}
                  <span>Like</span>
                </button>
                <button
                  onClick={toggleComments}
                  className={`flex items-center space-x-2 px-4 py-2 rounded hover:glassy-card ${showComments ? 'text-blue-600' : 'glassy-text-secondary'}`}
                >
                  <LuMessageCircle className="w-5 h-5" />
                  <span>Comment</span>
                </button>
                <button
                  // onClick={handleShareClick}
                  className="flex items-center space-x-2 px-4 py-2 rounded hover:glassy-card glassy-text-secondary"
                >
                  <LuRepeat2 className="w-5 h-5" />
                  <span>Repost</span>
                </button>
                <button
                  onClick={handleShareClick}
                  className="flex items-center space-x-2 px-4 py-2 rounded hover:glassy-card glassy-text-secondary"
                >
                  <BsSend className="w-5 h-5" />
                  <span>Send</span>
                </button>
              </div>
            </div>

            {showComments && (
              <CommentSection
                onCommentSubmit={handleCommentSubmit}
                onReplySubmit={handleReplySubmit}
                onLike={handleCommentLike}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {showReportModal && (
        <ReportPostModal
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReportSubmit}
          onCancel={() => setShowReportModal(false)}
        />
      )}
      {showShareModal && (
        <ShareModal
          post={selectedPost}
          onClose={() => setShowShareModal(false)}
          userData={userData}
        />
      )}
      <AlertModal
        isOpen={isDeleteModal}
        title={
          <div className="flex items-center gap-2">
            <BsExclamationCircle className="text-red-500" />
            <span>Delete Post</span>
          </div>
        }
        message="Are you sure you want to delete this post? This action cannot be undone."
        onCancel={() => setIsDeleteModal(false)}
        onConfirm={handleDeletePost}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
      {postData ? <PostDetailsView /> : (
        <div className="min-h-screen glassy-card flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </>
  );
};

export default PostDetails;