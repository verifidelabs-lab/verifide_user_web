/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, useCallback } from "react";
import { FiMessageCircle } from "react-icons/fi";
import {
  PiDotsThreeOutlineVerticalFill,
  PiHeartStraightFill,
  PiHeartStraightLight,
  PiShareFat,
  PiWarning,
} from "react-icons/pi";
import { BsExclamationCircle } from "react-icons/bs";
import { IoCopyOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  commentOnPost,
  getPostOnHome,
  likeDislikePostComment,
  suggestedUser,
  replyToComment,
  getCommentOnPost,
  messageChatUser,
  deletePost,
  reportPost,
  followUnfollowUsers,
  updatePostLike,
  deleteComment,
} from "../../../redux/Users/userSlice";
import FollowButton from "../../../components/ui/Button/FollowButton";
import ActionButton from "../../../components/ui/Button/ActionButton";
import PeopleToConnect from "../../../components/ui/ConnectSidebar/ConnectSidebar";
import CommentSection from "../../../pages/Home/components/CommentSection";
import ShareModal from "../../../pages/Home/components/ShareModal";
import AlertModal from "../../../components/ui/Modal/AlertModal";
import ReportPostModal from "../../../pages/Home/components/ReportPostModal";
import Poll from "../../../pages/Home/components/Poll";
import MediaCarousel from "../../../pages/Home/components/MediaCarousel";
import JobPost from "../../../pages/Home/components/JobPost";
import {
  convertTimestampToDate,
  convertTimestampToDate2,
} from "../../../components/utils/globalFunction";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import LinkedInCertificate from "../../../pages/Certificates/Certificates";
import SuggestedUsersSwiper from "../../../pages/Home/components/SuggestedUserSwiper";
import FilterDropdown from "../../../pages/Home/components/FilterDropdown";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.min.css";
import ActionButtonComment from "../../../components/ui/Button/ActionButtonComment";
import MessageText2 from "../../../pages/Home/components/MessageText2";
import { getCookie } from "../../../components/utils/cookieHandler";

const useIO = ({ onIntersect, rootMargin = "120px", threshold = 0.1 }) => {
  const observerRef = useRef(null);

  const observe = useCallback(
    (el) => {
      if (!el) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry?.isIntersecting) onIntersect?.(entry);
        },
        { root: null, rootMargin, threshold }
      );

      observerRef.current.observe(el);
    },
    [onIntersect, rootMargin, threshold]
  );

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return observe;
};
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const Posts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postId } = useParams();
  const isCompany = getCookie("ACTIVE_MODE")
  console.log("Post ID:", postId); // 👉 "68e4ecced9a37663be3f8576"
  const dropdownRef = useRef(null);
  const userSelector = useSelector((state) => state.user);
  const { suggestedUserData: { data: suggestedUsers } = {} } =
    userSelector || {};
  const postData = useSelector((state) => state.user);
  const [userData, setUserData] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [activeCommentSections, setActiveCommentSections] = useState({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedPostForReport, setSelectedPostForReport] = useState(null);
  const [localLikes, setLocalLikes] = useState({});
  const [optimisticComments, setOptimisticComments] = useState({});
  const [commentsData, setCommentsData] = useState({});
  const [tabActive, setTabActive] = useState("all");
  const [endOfContent, setEndOfContent] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    likes: {},
    follows: {},
    comments: {},
    reports: {},
    deletes: {},
  });
  const [activeTab, setActiveTab] = useState("user");
  const [posts, setPosts] = useState(
    postData?.getPostOnHomeData?.data?.data?.list || []
  );
  const [loadingId, setLoadingId] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreNext, setHasMoreNext] = useState(true);
  const [hasMorePrev, setHasMorePrev] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const firstPostRef = useRef(null);
  const lastPostRef = useRef(null);

  const scrollContainerRef = useRef(null);
  const locomotiveScrollRef = useRef(null);

  // useEffect(() => {
  //   const reduxPosts = postData?.getPostOnHomeData?.data?.data?.list || [];
  //   if (reduxPosts.length > 0 && posts.length === 0) {
  //     // Initialize posts from Redux store and set up local likes state
  //     setPosts(reduxPosts);

  //     // Initialize local likes based on the actual isLiked property from API
  //     const initialLikes = {};
  //     reduxPosts.forEach(post => {
  //       // Use the isLiked property from the API response, not a derived state
  //       initialLikes[post._id] = post.isLiked === true;
  //     });
  //     setLocalLikes(initialLikes);
  //   }
  // }, [postData?.getPostOnHomeData?.data?.data?.list, posts.length],tabActive);

  const fetchPosts = useCallback(
    async (page = 1, direction = "initial") => {
      console.log("This is the fetch post ", page, direction);
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;
      setIsLoading(true);
      setEndOfContent(false);

      try {
        const getPostId = postId || "";
        const isCompanyTab = isCompany === "company" ? "self" : tabActive
        const res = await dispatch(
          getPostOnHome({ page, size: 10, type: isCompanyTab, post_id: getPostId })
        ).unwrap();

        const newPosts = res?.data?.list || [];
        if (getPostId) {
          window.localStorage.removeItem("postId");
        }

        if (newPosts.length === 0) {
          setEndOfContent(true);
          if (direction === "next") {
            setHasMoreNext(false);
          }
          return;
        }

        const newLikes = {};
        newPosts.forEach((post) => {
          newLikes[post._id] = post.isLiked === true;
        });

        if (direction === "next") {
          setPosts((prev) => [...prev, ...newPosts]);
          setLocalLikes((prev) => ({ ...prev, ...newLikes }));
          setHasMoreNext(newPosts.length === 10);
        } else if (direction === "prev") {
          setPosts((prev) => [...newPosts, ...prev]);
          setLocalLikes((prev) => ({ ...newLikes, ...prev }));
          setHasMorePrev(page > 1);
        } else {
          setPosts(newPosts);
          setLocalLikes(newLikes);
          setHasMoreNext(newPosts.length === 10);
          setHasMorePrev(page > 1);
        }

        setCurrentPage(page);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to load posts");
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    [dispatch, tabActive]
  );

  useEffect(() => {
    setPosts([]);
    setCurrentPage(1);
    fetchPosts(1, "initial");
  }, [fetchPosts, tabActive]);

  useEffect(() => {
    dispatch(suggestedUser({ page: 1, size: 10, type: activeTab }));
    (async () => {
      try {
        const res = await dispatch(
          messageChatUser({ isBlocked: false })
        ).unwrap();
        setUserData(res?.data || []);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    })();
  }, [dispatch, activeTab]);

  useEffect(() => {
    let timeout = setTimeout(() => {
      if (scrollContainerRef.current) {
        locomotiveScrollRef.current = new LocomotiveScroll({
          el: scrollContainerRef.current,
          smooth: true,
          multiplier: 1,
          class: "is-inview",
          offset: ["15%", 0],
          reloadOnContextChange: true,
          smartphone: { smooth: true },
          tablet: { smooth: true },
        });
      }
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (locomotiveScrollRef.current) {
        locomotiveScrollRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (locomotiveScrollRef.current && !isLoading) {
      setTimeout(() => {
        locomotiveScrollRef.current.update();
      }, 100);
    }
  }, [posts, isLoading]);

  const observeNext = useIO({
    onIntersect: () => {
      if (hasMoreNext && !isLoadingRef.current && !endOfContent)
        fetchPosts(currentPage + 1, "next");
    },
    rootMargin: "200px",
    threshold: 0.1,
  });

  const observePrev = useIO({
    onIntersect: () => {
      if (hasMorePrev && currentPage > 1 && !isLoadingRef.current) {
        const prevPage = clamp(currentPage - 1, 1, Number.MAX_SAFE_INTEGER);
        fetchPosts(prevPage, "prev");
      }
    },
    rootMargin: "200px",
    threshold: 0.1,
  });

  useEffect(() => {
    if (lastPostRef.current && hasMoreNext && !isLoading)
      observeNext(lastPostRef.current);
  }, [posts, hasMoreNext, isLoading, observeNext]);

  useEffect(() => {
    if (firstPostRef.current && hasMorePrev && !isLoading && currentPage > 1)
      observePrev(firstPostRef.current);
  }, [posts, hasMorePrev, isLoading, currentPage, observePrev]);

  const handleLike = useCallback(
    async (postId) => {
      const currentPost = posts.find((p) => p._id === postId);
      if (!currentPost) return;

      const wasLiked = !!localLikes[postId];
      const newLikedState = !wasLiked;

      const currentLikeCount = currentPost.like_count || 0;
      console.log(currentLikeCount);
      const newLikeCount = newLikedState
        ? currentLikeCount + 1
        : Math.max(0, currentLikeCount - 1);

      setLocalLikes((prev) => ({ ...prev, [postId]: newLikedState }));
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
              ...post,
              like_count: newLikeCount,
              isLiked: newLikedState,
            }
            : post
        )
      );

      setLoadingStates((p) => ({
        ...p,
        likes: { ...p.likes, [postId]: true },
      }));

      try {
        const response = await dispatch(
          likeDislikePostComment({
            content_id: postId,
            content_type: "Post",
          })
        ).unwrap();

        // If your API returns updated post data, use it to ensure consistency
        if (response.data) {
          // Update with the actual response from API
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post._id === postId
                ? {
                  ...post,
                  like_count: response.data.likeCount || newLikeCount,
                  isLiked:
                    response.data.isLiked !== undefined
                      ? response.data.isLiked
                      : newLikedState,
                }
                : post
            )
          );
          dispatch(
            updatePostLike({
              postId,
              isLiked:
                response.data.isLiked !== undefined
                  ? response.data.isLiked
                  : newLikedState,
              likeCount: response.data.likeCount || newLikeCount,
            })
          );
        }
      } catch (err) {
        // Revert optimistic updates on error
        setLocalLikes((prev) => ({ ...prev, [postId]: wasLiked }));
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                ...post,
                like_count: currentLikeCount,
                isLiked: wasLiked,
              }
              : post
          )
        );

        // Revert Redux store
        dispatch(
          updatePostLike({
            postId,
            isLiked: wasLiked,
            likeCount: currentLikeCount,
          })
        );

        toast.error("Failed to update like");
      } finally {
        setLoadingStates((p) => ({
          ...p,
          likes: { ...p.likes, [postId]: false },
        }));
      }
    },
    [dispatch, localLikes, posts]
  );

  const handleDelete = async (commentId, postId) => {
    console.log("comment_id", commentId);
    try {
      // setCommentsData((prev) => ({
      //   ...prev,
      //   [postId]: {
      //     ...prev[postId],
      //     list: prev[postId]?.list?.filter(comment => comment._id !== commentId) || [],
      //     total: Math.max(0, (prev[postId]?.total || 1) - 1)
      //   }
      // }));
      const res1 = await dispatch(
        deleteComment({ comment_id: commentId })
      ).unwrap();
      const res = await dispatch(
        getCommentOnPost({ post: postId, page: 1, size: 10 })
      ).unwrap();

      console.log(1111111111, res?.data, postId);
      setCommentsData((prev) => ({
        ...prev,
        [postId]: res?.data || { list: [], total: 0 },
      }));

      toast.success(res1?.message);
    } catch (error) {
      const res = await dispatch(
        getCommentOnPost({ post: postId, page: 1, size: 10 })
      ).unwrap();
      setCommentsData((prev) => ({
        ...prev,
        [postId]: res?.data || { list: [], total: 0 },
      }));
      toast.error(error?.message || "Failed to delete comment");
    }
  };

  const handleFollowClick = useCallback(
    async (userId, userPath) => {
      setLoadingStates((p) => ({
        ...p,
        follows: { ...p.follows, [userId]: true },
      }));
      try {
        await dispatch(
          followUnfollowUsers({
            target_id: userId,
            target_model: userPath,
          })
        ).unwrap();
        await fetchPosts(currentPage, "initial");
      } catch (error) {
        toast.error("Failed to update follow status");
      } finally {
        setLoadingStates((p) => ({
          ...p,
          follows: { ...p.follows, [userId]: false },
        }));
      }
    },
    [dispatch, fetchPosts, currentPage]
  );

  const handleCommentSubmit = useCallback(
    async (postId, text) => {
      const tempId = `temp-${Date.now()}`;
      setOptimisticComments((prev) => ({
        ...prev,
        [postId]: [
          ...(prev[postId] || []),
          {
            _id: tempId,
            text,
            createdAt: new Date().toISOString(),
            userData: userSelector.userData,
            isOptimistic: true,
          },
        ],
      }));
      setLoadingStates((p) => ({
        ...p,
        comments: { ...p.comments, [postId]: true },
      }));

      try {
        await dispatch(commentOnPost({ post: postId, text })).unwrap();
        const res = await dispatch(
          getCommentOnPost({ post: postId, page: 1, size: 10 })
        ).unwrap();
        setCommentsData((prev) => ({
          ...prev,
          [postId]: res?.data || { list: [], total: 0 },
        }));
        setOptimisticComments((prev) => ({ ...prev, [postId]: [] }));
      } catch (error) {
        setOptimisticComments((prev) => ({
          ...prev,
          [postId]: (prev[postId] || []).filter((c) => c._id !== tempId),
        }));
        toast.error("Failed to post comment");
      } finally {
        setLoadingStates((p) => ({
          ...p,
          comments: { ...p.comments, [postId]: false },
        }));
      }
    },
    [dispatch, userSelector.userData]
  );

  const handleReplySubmit = useCallback(
    async (parentCommentId, text) => {
      try {
        await dispatch(
          replyToComment({ parentComment: parentCommentId, text })
        ).unwrap();
      } catch {
        toast.error("Failed to post reply");
      }
    },
    [dispatch]
  );

  const handleCommentLike = useCallback(
    async (contentId, contentType) => {
      try {
        await dispatch(
          likeDislikePostComment({
            content_id: contentId,
            content_type: contentType,
          })
        ).unwrap();
      } catch {
        toast.error("Failed to update comment like");
      }
    },
    [dispatch]
  );

  const toggleComments = useCallback(
    async (postId) => {
      setActiveCommentSections((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));
      const shouldOpen = !activeCommentSections[postId];
      if (shouldOpen) {
        try {
          const res = await dispatch(
            getCommentOnPost({ post: postId, page: 1, size: 10 })
          ).unwrap();
          setCommentsData((prev) => ({
            ...prev,
            [postId]: res?.data || { list: [], total: 0 },
          }));
        } catch (err) {
          console.error("Error fetching comments:", err);
        }
      }
    },
    [activeCommentSections, dispatch]
  );

  const handleSeeMore = useCallback((postId) => {
    setExpandedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  }, []);

  const handleShareClick = useCallback((post) => {
    setSelectedPost(post);
    setShowShareModal(true);
  }, []);

  const handleOptionsClick = (postId, e) => {
    e.stopPropagation();
    setLoadingId(postId); // start spinner
    setTimeout(() => {
      setShowOptionsDropdown((prev) => (prev === postId ? null : postId));
      setLoadingId(null); // stop spinner after options open
    }, 800); // delay for spinner effect
  };
  const handleCopyLink = useCallback((post) => {
    if (post && post?._id) {
      const baseUrl = `https://dev-verifide.verifide.xyz/user/feed/${post?._id}`;

      navigator.clipboard.writeText(baseUrl);
      toast.success("Link copied to clipboard");
    } else {
      toast.error("Invalid post data");
    }
    setShowOptionsDropdown(null);
  }, []);

  const handleReportPost = useCallback((postId) => {
    setSelectedPostForReport(postId);
    setShowReportModal(true);
    setShowOptionsDropdown(null);
  }, []);

  const handleReportSubmit = useCallback(
    async (type, reason) => {
      if (!selectedPostForReport) return;
      setLoadingStates((p) => ({
        ...p,
        reports: { ...p.reports, [selectedPostForReport]: true },
      }));
      try {
        await dispatch(
          reportPost({ post_id: selectedPostForReport, type, reason })
        ).unwrap();
        toast.success("Post reported successfully");
        setShowReportModal(false);
        await fetchPosts(currentPage, "initial");
      } catch (error) {
        toast.error("Failed to report post");
      } finally {
        setLoadingStates((p) => ({
          ...p,
          reports: { ...p.reports, [selectedPostForReport]: false },
        }));
      }
    },
    [dispatch, selectedPostForReport, fetchPosts, currentPage]
  );

  const handleDeleteButtonClick = useCallback((postId) => {
    setIsDeleteModal(true);
    setPostIdToDelete(postId);
  }, []);

  const handleDeletePost = useCallback(async () => {
    if (!postIdToDelete) return;
    setLoadingStates((p) => ({
      ...p,
      deletes: { ...p.deletes, [postIdToDelete]: true },
    }));
    try {
      const res = await dispatch(deletePost({ _id: postIdToDelete })).unwrap();
      toast.success(res?.message || "Post deleted");
      setIsDeleteModal(false);
      setPosts((prev) => prev.filter((p) => p._id !== postIdToDelete));
    } catch (error) {
      toast.error(error?.message || "Failed to delete post");
    } finally {
      setLoadingStates((p) => ({
        ...p,
        deletes: { ...p.deletes, [postIdToDelete]: false },
      }));
    }
  }, [dispatch, postIdToDelete]);

  const getCombinedComments = useCallback(
    (postId) => {
      const server = commentsData[postId]?.list || [];
      const optimistic = optimisticComments[postId] || [];
      return [...optimistic, ...server];
    },
    [commentsData, optimisticComments]
  );

  const tabs = [
    { label: "All", value: "all" },
    { label: "Jobs", value: "jobs" },
    { label: "Certificates", value: "certificates" },
    { label: "My Post", value: "self" },
  ];

  const buttonRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowOptionsDropdown(null);
      }
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptionsDropdown]);

  console.log(
    "2222222222222",
    commentsData["68c506de8c890beb0a1c427c"] || [],
    commentsData
  );

  const [commentLoadingStates, setCommentLoadingStates] = useState({});

  return (
    <div className="  bg-[#F6FAFD] space-y-3 p-4">
      <div className="flex flex-col md:flex-row w-full mx-auto gap-4">
        <div className="xl:w-[75%] lg:w-[70%] md:w-[60%] w-full space-y-6 overflow-hidden h-screen  overflow-y-auto   hide-scrollbar">
          <div className="flex justify-between items-center gap-2 mb-2 text-sm">
            <nav className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Home</span>
              <span className="text-gray-400">›</span>
              <span className="font-medium text-blue-600">Highlights</span>
            </nav>
            {
              isCompany && isCompany !== "company" && <FilterDropdown
                tabs={tabs}
                tabActive={tabActive}
                setTabActive={setTabActive}
              />
            }

          </div>

          {Array.isArray(posts) &&
            posts.map((post, index) => {
              const isExpanded = !!expandedPosts[post._id];
              const showComments = !!activeCommentSections[post._id];
              const isLikeLoading = !!loadingStates.likes[post._id];
              // const isFollowLoading = !!loadingStates.follows[post.userData?._id];
              const isCommentLoading = !!loadingStates.comments[post._id];
              const isFirst = index === 0;
              const isLast = index === posts.length - 1;
              return (
                <>
                  {index === 4 &&
                    suggestedUsers?.data?.list &&
                    suggestedUsers?.data?.list.length > 0 && (
                      <div className="md:hidden block">
                        <SuggestedUsersSwiper
                          suggestedUsers={suggestedUsers?.data?.list}
                          onFollowClick={handleFollowClick}
                          loadingStates={loadingStates}
                          onExploreMore={() =>
                            navigate(`/user/suggested-users`)
                          }
                        />
                      </div>
                    )}
                  <div
                    key={post._id}
                    className="p-6 bg-white shadow-sm rounded-xl border border-gray-100"
                    ref={
                      isFirst ? firstPostRef : isLast ? lastPostRef : undefined
                    }
                  >
                    <div className="flex items-start justify-between mb-4">
                      <button
                        type="button"
                        className="flex items-center gap-4 cursor-pointer"
                        onClick={() => {
                          if (post.userData?.user_path !== "Companies") {
                            navigate(
                              `/user/profile/${post.userData?.first_name || post.userData?.name
                              }/${post.userData?._id}`
                            );
                          } else if (post.userData?.user_path === "Companies") {
                            toast.info(
                              "Redirecting to the company's profile view..."
                            );
                            navigate(
                              `/user/view-details/companies/${post.userData?._id}`
                            );
                          } else {
                            toast.info(
                              "The Page You are Looking For Is Not Present!!"
                            );
                          }
                        }}
                        title="View profile"
                      >
                        {post?.userData?.profile_picture_url ? (
                          <img
                            src={
                              post?.userData?.profile_picture_url ||
                              "/0684456b-aa2b-4631-86f7-93ceaf33303c.png"
                            }
                            alt={`${post?.userData?.first_name || post?.userData?.name
                              } ${post?.userData?.last_name || ""}`}
                            className="object-cover rounded-full w-12 h-12 border"
                            onError={(e) => {
                              const fallback =
                                "/0684456b-aa2b-4631-86f7-93ceaf33303c.png";
                              if (!e.currentTarget.src.endsWith(fallback))
                                e.currentTarget.src = fallback;
                            }}
                          />
                        ) : (
                          <img
                            src="/0684456b-aa2b-4631-86f7-93ceaf33303c.png"
                            alt={`${post?.userData?.first_name || post?.userData?.name
                              } ${post?.userData?.last_name || ""}`}
                            className="object-cover rounded-full w-12 h-12 border"
                            loading="lazy"
                          />
                        )}

                        <div className="text-left">
                          <h3 className="md:text-lg text-md font-semibold text-[#000000E6] capitalize hover:text-gray-700">
                            {post.userData?.first_name || post?.userData?.name}{" "}
                            {post.userData?.last_name}
                          </h3>
                          <p className="md:text-sm text-xs text-gray-600">
                            {post.userData?.headline ||
                              (post.userData?.user_path === "Users"
                                ? "user"
                                : post?.userData?.user_path)}
                          </p>
                        </div>
                      </button>

                      <div className="flex items-center">
                        {!post?.isSelfPost && (
                          <FollowButton
                            isFollowing={post?.isConnected}
                            isLoading={
                              loadingStates.follows[post.userData?._id]
                            }
                            onClick={() =>
                              handleFollowClick(
                                post.userData?._id,
                                post.userData?.user_path
                              )
                            }
                          />
                        )}
                        <div className="relative ml-2">
                          <button
                            className="p-2 transition-colors rounded hover:bg-gray-50"
                            onClick={(e) => handleOptionsClick(post._id, e)}
                            aria-haspopup="menu"
                            aria-expanded={showOptionsDropdown === post._id}
                            title="More options"
                          >
                            {loadingId === post._id ? (
                              <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <PiDotsThreeOutlineVerticalFill className="w-6 h-6 text-gray-600" />
                            )}
                          </button>
                          {showOptionsDropdown === post._id && (
                            <div
                              role="menu"
                              className="absolute right-0 mt-3 w-40 bg-white rounded-md shadow-lg z-20 py-1 border border-[#0000001A]"
                            >
                              <button
                                onClick={() => handleCopyLink(post)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-[#000000E6] hover:bg-gray-50 w-full text-left border-b border-gray-200"
                                role="menuitem"
                              >
                                <IoCopyOutline size={18} /> Copy link
                              </button>

                              {post?.post_type === "certificates" ||
                                post?.post_type === "jobs" ? (
                                <></>
                              ) : (
                                <button
                                  onClick={() => handleReportPost(post._id)}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#000000E6] hover:bg-gray-50 w-full text-left"
                                  role="menuitem"
                                >
                                  <BsExclamationCircle size={18} /> Report
                                </button>
                              )}
                              {post?.isSelfPost && (
                                <button
                                  onClick={() =>
                                    handleDeleteButtonClick(post._id)
                                  }
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full text-left border-t border-gray-200"
                                  role="menuitem"
                                >
                                  <AiOutlineDelete size={18} /> Delete
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {post?.title ? (
                      <p className="mb-3 leading-relaxed text-[#000000] md:text-base font-normal text-sm">
                        {isExpanded ? post?.title : post?.title}
                      </p>
                    ) : null}
                    {post?.content ? (
                      <p className="mb-3 leading-relaxed text-[#000000] md:text-base font-normal text-sm">
                        {isExpanded
                          ? post?.content
                          : post?.content?.slice(0, 200)}
                        {post?.content?.length > 200 && (
                          <>
                            {!isExpanded && "..."}
                            <button
                              onClick={() => handleSeeMore(post?._id)}
                              className="ml-2 md:text-sm text-xs text-blue-600 hover:underline"
                            >
                              {isExpanded ? "See less" : "See more"}
                            </button>
                          </>
                        )}
                      </p>
                    ) : null}

                    {post?.post_type === "link" && post?.link && (
                      <div className="mx-auto w-full">
                        <MessageText2 msg={post?.link} />
                      </div>
                    )}

                    {Array.isArray(post?.tags) && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="md:text-sm text-sm font-semibold text-[#6B6B6B] capitalize"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="space-y-3">
                      {post?.post_type === "jobs" && post.job_id && (
                        <JobPost job={post.job_id} />
                      )}

                      {post?.post_type === "certificates" &&
                        post?.certificate_id && (
                          <LinkedInCertificate
                            certificateName={post?.certificate_id?.name}
                            issueBy={post?.certificate_id?.issuing_organization}
                            description={post?.certificate_id?.description}
                            date={convertTimestampToDate(
                              post?.certificate_id?.issue_date
                            )}
                            record={post?.certificate_id}
                            type="certifications"
                            username={post?.userData?.name}
                          />
                        )}

                      {post?.post_type === "poll" && post.poll && (
                        <Poll
                          poll={post.poll}
                          postId={post._id}
                          isSelfPost={post.isSelfPost}
                          updatedAt={post?.updatedAt}
                          isVoted={post?.isVoted}
                          voting_index={post?.voting_index}
                        />
                      )}
                      <MediaCarousel
                        post={{
                          image_urls: post.image_urls,
                          video_url: post.video_url,
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      <ActionButton
                        icon={
                          localLikes[post._id]
                            ? PiHeartStraightFill
                            : PiHeartStraightLight
                        }
                        count={post.like_count || 0}
                        isCount={!!localLikes[post._id]}
                        onClick={() => handleLike(post._id)}
                        isLoading={isLikeLoading}
                        ariaLabel="Like"
                      />
                      <ActionButtonComment
                        icon={FiMessageCircle}
                        count={post.comments}
                        isActive={!!activeCommentSections[post._id]}
                        isLoading={!!commentLoadingStates[post._id]}
                        onClick={() => {
                          toggleComments(post._id);
                          // setShowComments(!showComments);
                        }}
                        ariaLabel="Comments"
                      />
                      <ActionButton
                        icon={PiShareFat}
                        onClick={() => handleShareClick(post)}
                        ariaLabel="Share"
                      />
                    </div>

                    <div className="mt-1">
                      <span className="text-xs text-gray-400">
                        Posted on {convertTimestampToDate2(post?.updatedAt)}
                      </span>
                    </div>

                    {showComments && (
                      <CommentSection
                        postId={post._id}
                        initialComments={getCombinedComments(post._id)}
                        onCommentSubmit={handleCommentSubmit}
                        onReplySubmit={handleReplySubmit}
                        onLike={handleCommentLike}
                        commentCount={post?.comments}
                        commentPostData={commentsData[post._id] || []}
                        isLoading={isCommentLoading}
                        setPosts={setPosts}
                        type={tabActive}
                        size={10}
                        page={currentPage}
                        showComments={showComments}
                        // setShowComments={setShowComments}
                        handleDelete={handleDelete}
                      />
                    )}
                  </div>
                </>
              );
            })}
          {isLoading && (
            <div className="space-y-4 mt-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-100 p-6 rounded-xl h-36"
                />
              ))}
            </div>
          )}
        </div>

        <div className="xl:w-[25%] lg:w-[30%] md:w-[40%] md:block hidden mt-1">
          <div className="sticky top-4 h-fit max-h-[calc(100vh-2rem)] overflow-y-auto hide-scrollbar">
            <PeopleToConnect
              data={suggestedUsers?.data?.list || []}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              fetchPosts={fetchPosts}
            />
          </div>
        </div>
      </div>

      {showShareModal && (
        <ShareModal
          post={selectedPost}
          onClose={() => setShowShareModal(false)}
          userData={userData}
          hanleCopyLink={handleCopyLink}
        />
      )}

      {showReportModal && (
        <ReportPostModal
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReportSubmit}
          onCancel={() => setShowReportModal(false)}
          isLoading={loadingStates.reports[selectedPostForReport]}
        />
      )}

      <AlertModal
        isOpen={isDeleteModal}
        title={
          <div className="flex items-center gap-2">
            <PiWarning className="text-red-500" />
            <span>Delete Post</span>
          </div>
        }
        message="Are you sure you want to delete this post? This action cannot be undone."
        onCancel={() => setIsDeleteModal(false)}
        onConfirm={handleDeletePost}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={loadingStates.deletes[postIdToDelete]}
      />
    </div>
  );
};

export default Posts;
