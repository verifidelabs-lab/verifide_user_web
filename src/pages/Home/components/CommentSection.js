import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {  FiSend,FiMessageCircle,} from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import moment from "moment";
import {commentOnPost,getCommentOnPost,getPostOnHome,getReplyOnPost,likeDislikePostComment,replyToComment,} from "../../../redux/Users/userSlice";
import { toast } from "sonner";
import { MdDelete } from "react-icons/md";

const CommentSection = ({ postId, type, size, page, setPosts, showComments, setShowComments,handleDelete, commentPostData }) => {
  const dispatch = useDispatch();
  const commentInputRef = useRef(null);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReplyList, setShowReplyList] = useState({});
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [loadingMoreComments, setLoadingMoreComments] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [commentPage, setCommentPage] = useState(1);
  const defaultAvatar = "/0684456b-aa2b-4631-86f7-93ceaf33303c.png";
   const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = defaultAvatar;
    e.target.onerror = () => {
      e.target.style.display = 'none';
      if (!e.target.nextSibling || !e.target.nextSibling.classList.contains('avatar-fallback')) {
        const fallback = document.createElement('div');
        fallback.className = 'avatar-fallback';
        fallback.innerHTML = '<FaUser />';
        e.target.parentNode.appendChild(fallback);
      }
    };
  };

  useEffect(() => {
    // if (showComments && !initialLoadComplete) {
      console.log(22222222222, showComments, initialLoadComplete);
      setLoading(true);
      dispatch(
        getCommentOnPost({
          post: postId,
          page: 1,
          size: 5
        })
      ).then((res) => {
        if (res) {
          const commentsData = res.payload.data.list || [];
          console.log("commentsData:----", commentsData)
          setComments(commentsData);
          const hasMore = commentsData.length === 5;
          setHasMoreComments(hasMore);
          setInitialLoadComplete(true);
        }
        setLoading(false);
      });
    // }
  }, [showComments, dispatch, postId, initialLoadComplete, commentPostData]);

  useEffect(() => {
    if (showComments && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [showComments]);

  const handleAddComment = (e) => {
    if (e) e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);
    dispatch(
      commentOnPost({
        post: postId,
        text: newComment,
      })
    ).then((res) => {
      const payload = res?.payload;
      if (payload?.error) {
        toast.error(`Error: ${payload.message || "Something went wrong."}`);
      } else {
        setNewComment("");
        dispatch(getCommentOnPost({
          post: postId,
          page: 1,
          size: 5
        })).then((res) => {
          console.log("es?.payload?.data1111", res?.payload?.data)
          if (res?.payload?.data) {
            setComments(res.payload.data.list || []);
          }
        });
        dispatch(getPostOnHome({ size: size, page: page, type: type })).then((res) => {
          if (res?.payload?.data) {
            setPosts(res.payload.data?.list || []);
          }
        });
      }
      setLoading(false);
    });
  };



  const handleAddReply = (commentId, e) => {
    if (e) e.preventDefault();
    if (!replyText.trim()) return;
    setLoading(true);
    dispatch(
      replyToComment({
        parentComment: commentId,
        text: replyText,
      })
    ).then((res) => {
      const payload = res?.payload;
      if (payload?.error) {
        toast.error(`Error: ${payload.message || "Something went wrong."}`);
      } else {
        setReplyText("");
        setReplyingTo(null);
        toast.success("Reply posted successfully.");
        dispatch(getReplyOnPost({ comment: commentId })).then((res) => {
          if (res?.payload?.data) {
            setComments((prev) =>
              prev.map((c) =>
                c._id === commentId ? { ...c, replies: res.payload.data } : c
              )
            );
          }
        });
        dispatch(
          getCommentOnPost({
            post: postId,
            page: 1,
            size: 5
          })
        ).then((res) => {
          if (res?.payload?.data) {
            setComments(res.payload.data.list || []);
          }
        });
      }
      setLoading(false);
    });
  };

  const toggleReplies = (commentId) => {
    if (!showReplyList[commentId]) {
      dispatch(
        getReplyOnPost({
          comment: commentId,
        })
      ).then((res) => {
        if (res?.payload?.data) {
          setComments((prev) =>
            prev.map((c) =>
              c._id === commentId ? { ...c, replies: res.payload.data } : c
            )
          );
        }
      });
    }
    setShowReplyList((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleLike = (id, type = "Comment") => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment._id === id && type === "Comment") {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likeCount: comment.isLiked
              ? comment.likeCount - 1
              : comment.likeCount + 1,
          };
        }
        return {
          ...comment,
          replies: comment.replies?.map((reply) =>
            reply._id === id && type === "Reply"
              ? {
                ...reply,
                isLiked: !reply.isLiked,
                likeCount: reply.isLiked
                  ? reply.likeCount - 1
                  : reply.likeCount + 1,
              }
              : reply
          ),
        };
      })
    );
    dispatch(
      likeDislikePostComment({
        content_id: id,
        content_type: type,
      })
    ).then((res) => {
      const payload = res?.payload;
      if (payload?.error) {
        setComments((prev) =>
          prev.map((comment) => {
            if (comment._id === id && type === "Comment") {
              return {
                ...comment,
                isLiked: !comment.isLiked,
                likeCount: comment.isLiked
                  ? comment.likeCount - 1
                  : comment.likeCount + 1,
              };
            }

            return {
              ...comment,
              replies: comment.replies?.map((reply) =>
                reply._id === id && type === "Reply"
                  ? {
                    ...reply,
                    isLiked: !reply.isLiked,
                    likeCount: reply.isLiked
                      ? reply.likeCount - 1
                      : reply.likeCount + 1,
                  }
                  : reply
              ),
            };
          })
        );
        toast.error(payload.message || "Failed to like. Please try again.");
      }
    });
  };

  const loadMoreComments = () => {
    setLoadingMoreComments(true);
    const nextPage = commentPage + 1;
    dispatch(
      getCommentOnPost({
        post: postId,
        page: nextPage,
        size: 5
      })
    ).then((res) => {
      if (res?.payload?.data) {
        const newComments = res.payload.data.list || [];
        setComments(prev => [...prev, ...newComments]);
        const hasMore = newComments.length === 5;
        setHasMoreComments(hasMore);
        setCommentPage(nextPage);
      }
      setLoadingMoreComments(false);
    });
  };

  const showLessComments = () => {
    setComments(comments.slice(0, 5));
    setCommentPage(1);
    setHasMoreComments(true);
  };

  return (
    <div className="w-full p-4">
      <form onSubmit={handleAddComment}>
        <div className="flex gap-2 mb-4 w-full">
          <input
            ref={commentInputRef}
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
          />
          <button
            disabled={!newComment.trim() || loading}
            className="text-[#000000E6] hover:text-blue-700 disabled:opacity-50"
            type="submit"
          >
            <FiSend size={23} />
          </button>
        </div>
      </form>

      {showComments && (
        <>
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-500">Loading comments...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.length > 0 ? (
                <>
                  {comments.map((comment) => (
                    <div key={comment._id} className="p-2 border-b border-gray-100">
                      <div className="flex justify-between items-start">
                        <div className="flex space-x-2">
                          <div className="relative">
                            {comment?.user?.profile_picture_url ? (
                              <img
                                src={comment?.user?.profile_picture_url || defaultAvatar}
                                alt={comment?.user?.first_name}
                                className="w-8 h-8 rounded-full object-cover "
                                onError={handleImageError}
                              />
                            ) : (
                              <img
                                src={`/0684456b-aa2b-4631-86f7-93ceaf33303c.png`}
                                alt={comment?.user?.first_name}
                                className="w-8 h-8 rounded-full object-cover "
                              />
                            )}
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-[13px] font-semibold text-[#000000E6]">
                                {comment?.user?.first_name} {comment?.user?.last_name}
                              </h4>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-500">
                                {moment(comment?.updatedAt).fromNow()}
                              </span>
                            </div>
                            <p className="text-[12px] text-gray-600 mb-2 flex justify-between place-items-center">
                              {comment?.text}
                              {comment?.isOwnComment && <MdDelete className="text-red-500 cursor-pointer" onClick={()=>handleDelete(comment?._id,postId)}/>}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                        <button
                          onClick={() => handleLike(comment._id, "Comment")}
                          className={`flex items-center gap-1 ${comment.isLiked ? "text-red-500" : "hover:text-red-500"
                            }`}
                        >
                          {comment.isLiked ? (
                            <FaHeart color="red" />
                          ) : (
                            <FaRegHeart />
                          )}
                          {comment.likeCount}
                        </button>
                        <button
                          onClick={() =>
                            setReplyingTo(
                              replyingTo === comment._id ? null : comment._id
                            )
                          }
                          className="flex items-center gap-1 hover:text-blue-600"
                        >
                          <FiMessageCircle /> Reply
                        </button>
                        {comment.repliesCount > 0 && (
                          <button
                            onClick={() => toggleReplies(comment._id)}
                            className="hover:text-blue-600"
                          >
                            {showReplyList[comment._id]
                              ? "Hide replies"
                              : `Show ${comment.repliesCount} replies`}
                          </button>
                        )}
                      </div>

                      {replyingTo === comment._id && (
                        <form onSubmit={(e) => handleAddReply(comment._id, e)}>
                          <div className="flex gap-2 mt-3">
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write a reply..."
                              className="flex-1 p-2 border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleAddReply(comment._id);
                                }
                              }}
                            />
                            <button
                              disabled={!replyText.trim() || loading}
                              className="p-2 text-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50"
                              type="submit"
                            >
                              <FiSend size={18} />
                            </button>
                          </div>
                        </form>
                      )}
                      {showReplyList[comment._id] && comment.replies?.length > 0 && (
                        <div className="mt-3 space-y-4 ml-6 border-l-2 border-gray-200 pl-4">
                          {comment.replies.map((reply) => (
                            <div key={reply._id} className="pt-3">
                              <div className="flex gap-2">
                                <div className="relative">
                                  {reply?.user?.profile_picture_url ? (
                                    <img
                                      src={reply?.user?.profile_picture_url || defaultAvatar}
                                      alt={reply?.user?.first_name}
                                      className="w-7 h-7 rounded-full object-cover "
                                      onError={handleImageError}
                                    />
                                  ) : (
                                    <img
                                      src={defaultAvatar}
                                      alt={reply?.user?.first_name}
                                      className="w-7 h-7 rounded-full object-cover"
                                      onError={handleImageError}
                                    />
                                  )}
                                </div>
                                <div className="bg-gray-50 rounded-lg p-2 flex-1">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="text-[13px] font-semibold text-[#000000E6]">
                                      {reply?.user?.first_name}{" "}
                                      {reply?.user?.last_name}
                                    </h4>
                                    <span className="text-xs text-gray-500">•</span>
                                    <span className="text-xs text-gray-500">
                                      {moment(reply?.updatedAt).fromNow()}
                                    </span>
                                  </div>
                                  <p className="text-[12px] text-gray-600 mb-1 flex justify-between place-items-center">
                                    {reply?.text}
                                    {comment?.isOwnComment}

                                  </p>
                                </div>
                              </div>
                              {/* <div className="flex items-center gap-4 mt-2 text-xs text-gray-600 ml-9">
                                <button
                                  onClick={() => handleLike(reply._id, "Comment")}
                                  className={`flex items-center gap-1 ${reply.isLiked ? "text-red-500" : "hover:text-red-500"
                                    }`}
                                >
                                  {reply.isLiked ? (
                                    <FaHeart color="red" />
                                  ) : (
                                    <FaRegHeart />
                                  )}
                                  {reply.likeCount}
                                </button>
                              </div> */}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {hasMoreComments && (
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={loadMoreComments}
                        disabled={loadingMoreComments}
                        className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 flex items-center"
                      >
                        {loadingMoreComments ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                            Loading...
                          </>
                        ) : (
                          "Show more"
                        )}
                      </button>
                    </div>
                  )}
                  {commentPage > 1 && (
                    <div className="flex justify-center mt-2">
                      <button
                        onClick={showLessComments}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Show less
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentSection;