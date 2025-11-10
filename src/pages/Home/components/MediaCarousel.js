import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import { BiZoomIn } from "react-icons/bi";
import Modal from "../../../components/ui/Modal/Modal";

export default function MediaCarousel({ post }) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [mediaList, setMediaList] = useState([]);

  // Prepare media array: images + videos
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

  const handleZoom = (index) => {
    setZoomIndex(index);
    setZoomOpen(true);
  };

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
          className="w-full h-full object-contain"
          allow="autoplay; fullscreen"
        />
      ) : (
        <video
          src={media.src}
          className="w-full h-full object-contain"
          controls
          autoPlay
        />
      );
    }

    return (
      <video
        src={media.src}
        className="w-full h-full object-contain"
        controls
        autoPlay
      />
    );
  };

  if (!mediaList.length) return null;

  return (
    <>
      {/* Carousel */}
      <div className="w-full relative">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          loop={mediaList.length > 1}
          className="w-full"
          style={{ aspectRatio: "16/9" }}
        >
          {mediaList.map((media, idx) => (
            <SwiperSlide key={idx} className="flex justify-center items-center">
              {media.type === 'image' ? (
                <img
                  src={media.src}
                  alt={`Media ${idx}`}
                  className="w-full h-full object-contain cursor-pointer"
                  onClick={() => handleZoom(idx)}
                />
              ) : (
                <div
                  className="relative w-full h-full cursor-pointer"
                  onClick={() => handleZoom(idx)}
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
      </div>

      {/* Zoom Modal */}
      <Modal
        isOpen={zoomOpen}
        onClose={() => setZoomOpen(false)}
        title=""
        isActionButton={false}
      >
        <Swiper
          initialSlide={zoomIndex}
          modules={[Pagination]}
          pagination={{ clickable: true }}
          loop={mediaList.length > 1}
          className="w-full h-[80vh]"
        >
          {mediaList.map((media, idx) => (
            <SwiperSlide key={idx} className="flex justify-center items-center">
              {media.type === 'image' ? (
                <img
                  src={media.src}
                  alt={`Zoomed Media ${idx}`}
                  className="w-full h-full max-h-[90vh] object-contain"
                />
              ) : (
                <div className="w-full h-full flex justify-center items-center">
                  {renderVideo(media)}
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </Modal>
    </>
  );
}
