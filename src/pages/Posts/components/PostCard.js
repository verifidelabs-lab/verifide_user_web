import React, { useRef, useState } from 'react'
import { BiComment } from 'react-icons/bi';
import { FiExternalLink, FiEye, FiMoreHorizontal, FiTrash2 } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { FaExpand, FaPause, FaPlay } from 'react-icons/fa';

const POST_TYPES = {
    TEXT: 'text',
    IMAGE: 'image',
    VIDEO: 'video',
    LINK: 'link',
    POLL: 'poll',
    IMAGE_VIDEO: 'image-video'
};

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

// Poll Component
const PollComponent = ({ poll }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    // Calculate percentages for each option
    const totalVotes = poll.total_votes || poll.options.reduce((sum, option) => sum + (option.vote_count || 0), 0);


    return (
        <div className="mt-3 border border-gray-200 rounded-lg p-3">
            {/* <p className="font-medium text-sm mb-3">{poll.question || "Poll"}</p> */}
            <div className="space-y-2">
                {poll.options.map((option, index) => {
                    const voteCount = option.vote_count || 0;
                    const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                    const isSelected = selectedOption === index;

                    return (
                        <div
                            key={index}
                            className={`relative cursor-not-allowed p-2 rounded border ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                        // onClick={() => handleVote(index)}
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

const PostCard = ({ post, onDelete, onToggleStatus, onView, profileData, isViewMode = false, onShare, handleComment }) => {
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getPostType = (post) => {
        if (post.poll && post.poll.options && post.poll.options.length > 0) return POST_TYPES.POLL;
        if (post.video_url) return POST_TYPES.VIDEO;
        if (post.link) return POST_TYPES.LINK;
        if (post.image_urls && post.image_urls.length > 0) return POST_TYPES.IMAGE;
        if (post.post_type === 'image-video') return POST_TYPES.IMAGE_VIDEO;
        return POST_TYPES.TEXT;
    };


    const postType = getPostType(post);

    const PostHeader = ({ profileData, post, onView, onDelete, isViewMode, formatDate }) => {
        const [showActions, setShowActions] = useState(false);

        return (
            <div className="flex items-center justify-between p-4 pb-2">
                <div className="flex items-center space-x-3">
                    {profileData?.profile_picture_url ? (
                        <img
                            src={profileData.profile_picture_url}
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '';
                            }}
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-[#000000E6] text-lg font-semibold">
                            {profileData?.first_name?.charAt(0).toUpperCase() || "U"}
                        </div>
                    )}

                    <div>
                        <p className="font-semibold text-sm">
                            {profileData?.first_name} {profileData?.last_name}
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

    // Post Content Component
    const PostContent = ({ post, type }) => {
        const renderMedia = () => {
            // ---------- IMAGE ONLY ----------
            if (type === POST_TYPES.IMAGE && post.image_urls?.length) {
                return (
                    <div className="w-full   bg-neutral-100 mt-3 rounded-lg overflow-hidden">
                        <Swiper modules={[Pagination]} pagination={{ clickable: true }} className="h-full w-full">
                            {post.image_urls.map((url, index) => (
                                <SwiperSlide key={`img-${index}`}>
                                    <img
                                        src={url}
                                        alt={`Post content ${index}`}
                                        className="object-contain max-h-[666px] w-full"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                );
            }

            // ---------- IMAGE + VIDEO ----------

            if (type === POST_TYPES.IMAGE_VIDEO) {
                const mediaItems = [];

                if (post.image_urls?.length) {
                    post.image_urls.forEach((url, index) =>
                        mediaItems.push({ type: "image", url, id: `img-${index}` })
                    );
                }

                if (post.video_url) {
                    mediaItems.push({ type: "video", url: post.video_url, id: "video-single" });
                }

                if (post.video_urls?.length) {
                    post.video_urls.forEach((url, index) =>
                        mediaItems.push({ type: "video", url, id: `vid-${index}` })
                    );
                }

                if (mediaItems.length === 0) return null;

                return (
                    <div className="w-full flex justify-center bg-neutral-100 mt-3 rounded-lg overflow-hidden max-h-[666px]">
                        <Swiper modules={[Pagination]} pagination={{ clickable: true }} className="h-full w-full">
                            {mediaItems.map((media) => (
                                <SwiperSlide key={media.id}>
                                    <div className="w-full h-full flex items-center justify-center">
                                        {media.type === "image" ? (
                                            <img
                                                src={media.url}
                                                alt="Post content"
                                                className="w-full h-auto max-h-[666px] object-contain"
                                            />
                                        ) : (
                                            <div className="w-full max-h-[480px]">
                                                {/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(media.url) ? (
                                                    <div
                                                        className="w-full h-[300px] flex items-center justify-center bg-black text-white cursor-pointer rounded"
                                                        onClick={() => window.open(media.url, "_blank")}
                                                    >
                                                        <div className="text-center">
                                                            <div className="text-4xl mb-2">▶️</div>
                                                            <p className="text-sm underline">Watch on YouTube</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <CustomVideoPlayer
                                                        videoUrl={media.url}
                                                        className="w-full h-auto max-h-[480px] rounded"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                );
            }


            if (type === POST_TYPES.VIDEO && post.video_url) {
                const isYouTubeUrl = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(post.video_url);
                return (
                    <div className="w-full flex justify-center bg-neutral-100 mt-3 rounded-lg overflow-hidden">
                        {isYouTubeUrl ? (
                            <div
                                className="w-full h-[300px] flex items-center justify-center bg-black text-white cursor-pointer"
                                onClick={() => window.open(post.video_url, "_blank")}
                            >
                                <div className="text-center">
                                    <div className="text-4xl mb-2">▶️</div>
                                    <p className="text-sm underline">Watch on YouTube</p>
                                </div>
                            </div>
                        ) : (
                            <CustomVideoPlayer videoUrl={post.video_url} />
                        )}
                    </div>
                );
            }

            // ---------- LINK ----------
            if (type === POST_TYPES.LINK && post.link) {
                return <LinkPreview post={post} />;
            }

            // ---------- POLL ----------
            if (type === POST_TYPES.POLL && post.poll) {
                return <PollComponent poll={post.poll} />;
            }

            return null;
        };

        return (
            <div className="px-4 pb-2">
                {post.title && <h3 className="font-semibold text-gray-900 text-base mb-2">{post.title}</h3>}
                {post.content && <p className="text-sm text-gray-800 mb-2">{post.content}</p>}
                {post.tags && post.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {post.tags.map((tag, index) => (
                            <span key={index} className="text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-full">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
                {renderMedia()}
            </div>
        );
    };

    const PostActions = ({ post, onLike, handleComment, onShare, onToggleStatus }) => {
        const [isLiked, setIsLiked] = useState(false);
        const [likeCount, setLikeCount] = useState(post.like_count || 0);

        const handleLike = () => {
            setIsLiked(!isLiked);
            setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
            if (onLike) onLike(post._id, !isLiked);
        };



        return (
            <>
                <div className="flex justify-around border-t border-gray-100 py-2">
                    <button
                        onClick={handleLike}
                        className={`flex items-center justify-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors px-4 py-1 rounded-lg hover:bg-gray-50`}
                    >

                        <span className={isLiked ? 'text-blue-600 font-medium' : ''}>
                            {post?.like_count} Like
                        </span>
                    </button>
                    <button
                        onClick={() => handleComment(post)}
                        className="flex items-center justify-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors px-4 py-1 rounded-lg hover:bg-gray-50"
                    >
                        <BiComment />
                        <span>Comment</span>
                    </button>
                    <button
                        className="flex items-center justify-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors px-4 py-1 rounded-lg hover:bg-gray-50"
                        onClick={() => onShare(post)}
                    >
                        {post?.share_count}
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
                            : 'bg-green-100 border-green-200 hover:bg-green-200 text-green-700'
                            } text-xs font-medium`}
                    >
                        {post.isDisable ? 'Enable' : 'Disable'}
                    </button>
                </div>
            </>
        );
    };


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
                handleComment={handleComment}
            />
        </div>
    )
}

export default PostCard