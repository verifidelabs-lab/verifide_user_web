import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { getPostDetails } from './redux/Users/userSlice';
import { BiHeart, BiSolidHeart } from 'react-icons/bi';
import { BsSend } from 'react-icons/bs';
// import { FiMoreHorizontal } from 'react-icons/fi';
import { LuMessageCircle } from 'react-icons/lu';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';

const PostDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const [postData, ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(
          `https://dev-verified.jamsara.com/api/v1/user/post/get-post-details?post_id=${id}`,
          {
            method: "GET",
            // credentials: "include", // 🚀 important for cookies
          }
        );
        if (!res.ok) throw new Error("Failed to fetch post");

        // const data = await res.json(); // ✅ must be JSON
        // console.log(data)
        // setPost(data);
      } catch (error) {
        // console.error(error);
      } finally {
        setLoading(false);
      }
    };

    // if (id) {
      fetchPost();
    // } else {
    //   setError('Invalid post ID');
    //   setLoading(false);
    //   navigate('/', { replace: true });
    // }
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!postData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-[#000000E6]"
          >
            ← Back
          </button>
          <h1 className="text-lg font-semibold">Post</h1>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Post header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <img
                src={postData.userData?.profile_picture_url || '/default-profile.png'}
                alt={`${postData.userData?.first_name}'s profile`}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold">
                  {postData.userData?.first_name} {postData.userData?.last_name}
                </h3>
                <p className="text-sm text-gray-500">Posted publicly</p>
              </div>
            </div>
          </div>

          {/* Post content */}
          <div className="p-4">
            <p className="whitespace-pre-line">{postData.content}</p>
          </div>

          {/* Media */}
          {postData.image_urls?.length > 0 && (
            <div className="border-t border-gray-100">
              <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                className="h-64 w-full"
              >
                {postData.image_urls.map((url, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={url}
                      alt={`Post media ${index}`}
                      className="w-full h-full object-contain"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          {/* Actions */}
          <div className="p-4 border-t border-gray-100 flex justify-around">
            <button className="flex items-center space-x-1 text-gray-600">
              {postData.isLiked ? (
                <BiSolidHeart className="text-red-500" />
              ) : (
                <BiHeart />
              )}
              <span>Like</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600">
              <LuMessageCircle />
              <span>Comment</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600">
              <BsSend />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailsPage;