import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BiHeart, BiSolidHeart } from "react-icons/bi";
import { BsSend } from "react-icons/bs";
import { LuMessageCircle } from "react-icons/lu";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import { BaseUrl } from "./components/hooks/axiosProvider";

const PostDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(
          `${BaseUrl}api/v1/user/post/get-post-details?post_id=${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch post");

        const data = await res.json();
        setPostData(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
    else {
      setError("Invalid post ID");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!postData) {
    return (
      <div className="min-h-screen flex items-center justify-center glassy-text-secondary">
        No post data available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="glassy-card border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:glassy-text-primary"
          >
            ← Back
          </button>
          <h1 className="text-lg font-semibold">Post</h1>
          <div className="w-6"></div> {/* Spacer */}
        </div>
      </header>

      {/* Post */}
      <div className="max-w-2xl mx-auto p-4">
        <div className="glassy-card rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Post header */}
          <div className="p-4 border-b border-gray-100 flex items-center space-x-3">
            <img
              src={postData.userData?.profile_picture_url || "/default-profile.png"}
              alt={postData.userData?.name || "User"}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{postData.userData?.name || "Unknown"}</h3>
              <p className="text-sm glassy-text-secondary">Posted publicly</p>
            </div>
          </div>

          {/* Post content */}
          <div className="p-4">
            <h2 className="font-semibold text-lg mb-2">{postData.title || "Untitled Post"}</h2>
            <p className="whitespace-pre-line text-gray-700">{postData.content || "No content available"}</p>
          </div>

          {/* Media */}
          {(postData.image_urls?.length > 0 || postData.video_url) && (
            <div className="border-t border-gray-100">
              {postData.image_urls?.length > 0 && (
                <Swiper
                  modules={[Pagination]}
                  pagination={{ clickable: true }}
                  className="h-64 w-full"
                >
                  {postData.image_urls.map((url, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={url}
                        alt={`Post media ${index + 1}`}
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.src = "/placeholder-image.png"; }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
              {postData.video_url && (
                <video
                  src={postData.video_url}
                  controls
                  className="w-full max-h-96 object-contain"
                  onError={(e) => console.log("Video failed to load")}
                />
              )}
            </div>
          )}

          {/* Actions */}
          <div className="p-4 border-t border-gray-100 flex justify-around">
            <button className="flex items-center space-x-1 text-gray-600">
              {postData.isLiked ? <BiSolidHeart className="text-red-500" /> : <BiHeart />}
              <span>Like ({postData.like_count || 0})</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600">
              <LuMessageCircle />
              <span>Comment ({postData.comments || 0})</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600">
              <BsSend />
              <span>Share ({postData.share_count || 0})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailsPage;
