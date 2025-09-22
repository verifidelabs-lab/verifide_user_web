import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
export default function MediaCarousel({ post }) {
    const videoRef = useRef(null);
    const [videoError, setVideoError] = useState(false);

    const isExternalVideo =
        post?.video_url &&
        !post.video_url.endsWith(".mp4") &&
        !post.video_url.endsWith(".webm"); 

    const hasVideo = !!post?.video_url;
    const hasThumbnail = !!post?.thumbnail;
    const hasMultipleImages = post?.image_urls?.length > 1; 

    const getYouTubeVideoId = (url) => {
        const match = url.match(
            /(?:youtu\.be\/|youtube\.com.*(?:\?|&)v=)([^&?/]+)/
        );
        return match ? match[1] : null;
    };

    const renderVideoSlide = () => {
        if (videoError) {
            return (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-700 text-lg font-semibold">
                    This video is not supported.
                </div>
            );
        }

        if (isExternalVideo) {
            const videoId = getYouTubeVideoId(post.video_url);
            const thumbnail = videoId
                ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                : post.thumbnail || "https://via.placeholder.com/480x360?text=Watch+Video";

            return (
                <div
                    onClick={() => window.open(post.video_url, "_blank")}
                    className="relative w-full h-full cursor-pointer group"
                >
                    <img
                        src={thumbnail}
                        alt="External Video"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-lg font-semibold group-hover:bg-black/60 transition">
                        ▶ Watch Video
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
                    autoPlay={true}
                    // playsInline
                    controls
                    controlsList="nodownload"
                    onError={() => setVideoError(true)}
                >
                    Your browser does not support the video tag.
                </video>
            </div>
        );
    };

    if (!hasVideo && !hasThumbnail && post?.image_urls?.length === 0) return null;

    return (
        <div className="w-full aspect-square max-h-96 relative group">
            <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                loop={hasMultipleImages || hasVideo}
                className="h-full w-full"
            >
                {hasThumbnail && (
                    <SwiperSlide key="thumbnail">
                        <img
                            src={post?.thumbnail}
                            alt="Post Thumbnail"
                            className="w-full h-full object-contain"
                        />
                    </SwiperSlide>
                )}

                {post?.image_urls?.map((url, index) => (
                    <SwiperSlide >
                        <img
                            src={url}
                            alt={`Post content ${index}`}
                            className="w-full h-full md:object-contain object-cover"
                        />
                    </SwiperSlide>
                ))}

                {hasVideo && (
                    <SwiperSlide key="video">{renderVideoSlide()}</SwiperSlide>
                )}
            </Swiper>
        </div>
    );
}