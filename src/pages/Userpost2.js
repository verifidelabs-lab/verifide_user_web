import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { apiUrl } from '../components/hooks/axiosProvider';

const Userpost2 = () => {
  const location = useLocation();
  const [postId, setPostId] = useState(null);
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const dropdownRef = useRef();

  // Extract query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    if (id) {
      setPostId(id);
    } else {
      setError('Post ID not found in URL');
      setLoading(false);
    }
  }, [location]);

  // OG Tags data
  const ogTitle = postData ? `${postData.userData?.name} - Post` : 'Loading Post...';

  // 👇 Yaha sirf content rakha hai OG description me
  const ogDescription = postData?.content
    ? postData.content.length > 160
      ? postData.content.substring(0, 160) + '...'
      : postData.content
    : 'View this post on our platform';

  const ogImage =
    postData?.thumbnail ||
    postData?.image_urls?.[0] ||
    `${window.location.origin}/default-og-image.png`;

  const ogUrl = window.location.href;

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      try {
        const res = await fetch(
          `${apiUrl}user/post/get-post-details?post_id=${postId}`
        );
        if (!res.ok) throw new Error('Failed to fetch post');

        const data = await res.json();
        if (data.error) throw new Error(data.message);

        setPostData(data.data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Post...</title>
          <meta name="description" content="Loading post content..." />
        </Helmet>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Error Loading Post</title>
        </Helmet>
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      </>
    );
  }

  if (!postData) {
    return (
      <>
        <Helmet>
          <title>Post Not Found</title>
        </Helmet>
        <div className="flex justify-center items-center h-screen">
          <div className="text-gray-500">Post not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Dynamic OG Tags */}
      <Helmet>
        <title>{ogTitle}</title>
        <meta name="description" content={ogDescription} />

        {/* OpenGraph Tags */}
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:type" content="article" />

        {/* Twitter Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <div className="max-w-2xl mx-auto p-4 bg-white min-h-screen">
        {/* User Header */}
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={postData?.userData?.profile_picture_url}
            alt={postData?.userData?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <h3 className="font-semibold">{postData?.userData?.name}</h3>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-gray-800 whitespace-pre-line">{postData?.content}</p>
        </div>
      </div>
    </>
  );
};

export default Userpost2;
