import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Zoom } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/zoom';
import { BiZoomIn, BiX } from "react-icons/bi";

export default function MediaCarousel({ post }) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [mediaList, setMediaList] = useState([]);

  useEffect(() => {
    const list = [];
    if (post?.thumbnail) list.push({ type: 'image', src: post.thumbnail });
    if (post?.image_urls?.length) post.image_urls.forEach(url => list.push({ type: 'image', src: url }));
    if (post?.video_url) list.push({
      type: 'video',
      src: post.video_url,
      external: !post.video_url.endsWith('.mp4') && !post.video_url.endsWith('.webm')
    });
    setMediaList(list);
  }, [post]);

  const getYouTubeEmbedUrl = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com.*(?:\?|&)v=)([^&?/]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&controls=1` : null;
  };

  const renderVideo = (media) => {
    if (media.external) {
      const embedUrl = getYouTubeEmbedUrl(media.src);
      return embedUrl ? (
        <iframe
          src={embedUrl}
          title="External Video"
          className="w-full h-full object-contain rounded-lg"
          allow="autoplay; fullscreen"
        />
      ) : (
        <video
          src={media.src}
          className="w-full h-full object-contain rounded-lg"
          controls
          autoPlay
        />
      );
    }

    return (
      <video
        src={media.src}
        className="w-full h-full object-contain rounded-lg"
        controls
        autoPlay
      />
    );
  };

  if (!mediaList.length) return null;

  return (
    <>
      {/* Main Carousel */}
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        loop={mediaList.length > 1}
        className="w-full rounded-lg overflow-hidden"
        style={{ aspectRatio: "16/9" }}
      >
        {mediaList.map((media, idx) => (
          <SwiperSlide key={idx} className="flex justify-center items-center relative">
            {media.type === 'image' ? (
              <img
                src={media.src}
                alt={`Media ${idx}`}
                className=" w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => {
                  setZoomIndex(idx);
                  setZoomOpen(true);
                }}
              />
            ) : (
              <div
                className="relative w-full h-full cursor-pointer"
                onClick={() => {
                  setZoomIndex(idx);
                  setZoomOpen(true);
                }}
              >
                {renderVideo(media)}
                <div className="absolute inset-0 flex items-center justify-center text-3xl glassy-card/40">
                  <BiZoomIn />
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Fullscreen Lightbox */}
      {zoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fadeIn">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white text-3xl z-50 p-2 hover:bg-white/20 rounded-full transition"
            onClick={() => setZoomOpen(false)}
          >
            <BiX />
          </button>

          <Swiper
            initialSlide={zoomIndex}
            modules={[Navigation, Pagination, Zoom]}
            pagination={{ clickable: true }}
            navigation
            loop={mediaList.length > 1}
            zoom
            className="w-full h-full max-w-[90%] max-h-[90%]"
          >
            {mediaList.map((media, idx) => (
              <SwiperSlide key={idx} className="flex justify-center items-center">
                {media.type === 'image' ? (
                  <div className="swiper-zoom-container">
                    <img
                      src={media.src}
                      alt={`Zoomed Media ${idx}`}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex justify-center items-center">
                    {renderVideo(media)}
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </>
  );
}
