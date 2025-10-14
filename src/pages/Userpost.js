import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaChartBar } from 'react-icons/fa';
import { apiUrl } from '../components/hooks/axiosProvider';
import Button from '../components/ui/Button/Button';
import { getCookie } from '../components/utils/cookieHandler';
import { useDispatch } from 'react-redux';
import { getProfile } from '../redux/slices/authSlice';
import MediaCarousel from './Home/components/MediaCarousel';
// import { toast } from 'sonner';

const urlRegex = /(https?:\/\/[^\s]+)/gi;
const isImageUrl = (u) => /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(u);
const isVideoUrl = (u) => /\.(mp4|webm|ogg|mov)$/i.test(u);

const MessageText = ({ msg }) => {
  const parts = useMemo(() => msg?.split(urlRegex) || [], [msg]);
  const urls = useMemo(() => msg?.match(urlRegex) || [], [msg]);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    try {
      let videoId = null;
      const u = new URL(url);
      const host = u.hostname.replace('www.', '');
      if (host === 'youtube.com') {
        if (u.pathname === '/watch') videoId = u.searchParams.get('v');
        if (u.pathname.startsWith('/embed/')) videoId = u.pathname.split('/embed/')[1];
        if (u.pathname.startsWith('/v/')) videoId = u.pathname.split('/v/')[1];
        if (u.pathname.startsWith('/shorts/')) videoId = u.pathname.split('/shorts/')[1];
      } else if (host === 'youtu.be') {
        videoId = u.pathname.replace('/', '');
      }
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&rel=0&modestbranding=1`;
      }
    } catch (e) {
      console.error('Error parsing YouTube URL:', e);
    }
    return null;
  };

  const renderPreview = (url) => {
    const yt = getYouTubeEmbedUrl(url);
    if (yt) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <div className="mt-3 border rounded-lg overflow-hidden w-full h-80">
            <iframe title="YouTube preview" src={yt} className="w-full h-full pointer-events-none" />
          </div>
        </a>
      );
    }
    if (isImageUrl(url)) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <img src={url} alt="Preview" className="w-full h-auto max-h-80 object-contain rounded-lg" />
        </a>
      );
    }
    if (isVideoUrl(url)) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <video src={url} controls autoPlay className="w-full max-h-80 rounded-lg" />
        </a>
      );
    }
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4 bg-gray-100 hover:bg-gray-200 rounded-lg"
      >
        <div className="flex items-center gap-3">
          <img
            src={`https://www.google.com/s2/favicons?sz=64&domain_url=${url}`}
            alt="favicon"
            className="w-6 h-6"
            loading="lazy"
          />
          <span className="truncate text-blue-600">{url}</span>
        </div>
      </a>
    );
  };

  return (
    <div>
      <div className="text-sm whitespace-pre-wrap break-words">
        {parts.map((part, i) =>
          urlRegex.test(part) ? (
            <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {part}
            </a>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </div>
      {urls.length > 0 && (
        <div className="mt-3 space-y-3 w-full max-w-md mx-auto">{urls.map((u, i) => <div key={i}>{renderPreview(u)}</div>)}</div>
      )}
    </div>
  );
};

const Userpost = () => {
  const { id } = useParams();
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const [isUserData, setIsUserData] = useState(null);
  const [accessMode,] = useState(getCookie("VERIFIED_TOKEN"));
  const dispatch = useDispatch();

  // Initialize ogData with a loading state
  const [ogData, setOgData] = useState({
    title: 'Loading Post...',
    description: 'Loading post content...',
    image: `${window.location.origin}/default-og-image.png`,
    url: `${window.location.origin}/user/post/view/${id}`,
    type: 'website',
    siteName: 'Your App Name',
    author: 'Your App Name',
    tags: []
  });

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(
          `${apiUrl}user/post/get-post-details?post_id=${id}`,
          { method: "GET" }
        );
        if (!res.ok) throw new Error("Failed to fetch post");

        if (accessMode) {
          const reduxRes = await dispatch(getProfile()).unwrap();
          setIsUserData(reduxRes?.data);
        }

        const data = await res.json();
        if (data.error) throw new Error(data.message);

        setPostData(data.data);
        setIsLiked(data.data.isLiked);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, accessMode, dispatch]);

  // Update ogData when postData is available
  useEffect(() => {
    if (postData) {
      const userName = postData.userData?.name || 'Anonymous User';

      let title = `${userName}`;
      if (postData.post_type === 'poll') {
        title += ' - Poll';
      } else if (postData.content) {
        const firstLine = postData.content.split('\n')[0];
        title += ` - ${firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine}`;
      }
      title += ' | Your App Name';

      let description = '';
      if (postData.post_type === 'poll' && postData.poll) {
        description = `${userName} created a poll with ${postData.poll.total_votes} votes. `;
        if (postData.content) {
          description += postData.content.length > 100
            ? postData.content.substring(0, 100) + '...'
            : postData.content;
        }
      } else if (postData.content) {
        description = postData.content.length > 160
          ? postData.content.substring(0, 160) + '...'
          : postData.content;
      } else {
        description = `Check out this post by ${userName} on Your App Name`;
      }

      let image = `${window.location.origin}/default-og-image.png`;
      if (postData.thumbnail) {
        image = postData.thumbnail;
      } else if (postData.image_urls && postData.image_urls.length > 0) {
        image = postData.image_urls[0];
      } else if (postData.userData?.profile_picture_url) {
        image = postData.userData.profile_picture_url;
      }

      setOgData({
        title,
        description,
        image,
        url: `${window.location.origin}/user/post/view/${id}`,
        type: 'article',
        siteName: 'Your App Name',
        author: userName,
        publishedTime: postData.createdAt,
        modifiedTime: postData.updatedAt,
        tags: postData.tags || []
      });
    }
  }, [postData, id]); // Depend on postData to re-run when it changes

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handlers
  const triggerPopup = () => setShowPopup(true);
  // const handleLike = () => triggerPopup();
  // const handleComment = () => triggerPopup();
  // const handleShare = () => triggerPopup();
  // const handleReport = () => triggerPopup();

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculatePercentage = (voteCount, totalVotes) => {
    if (totalVotes === 0) return 0;
    return Math.round((voteCount / totalVotes) * 100);
  };

  // const handleCustomShare = async () => {
  //   if (navigator.share) {
  //     try {
  //       await navigator.share({
  //         title: ogData.title,
  //         text: ogData.description,
  //         url: ogData.url,
  //       });
  //     } catch (error) {
  //       // console.log('Error sharing:', error);
  //       toast.error(error)

  //       copyToClipboard();
  //     }
  //   } else {
  //     copyToClipboard();
  //   }
  // };

  // const copyToClipboard = () => {
  //   navigator.clipboard.writeText(ogData.url).then(() => {
  //     alert('Link copied to clipboard!');
  //   });
  // };

  const generateStructuredData = useMemo(() => {
    if (!postData) return {};
    // Rest of the generateStructuredData logic
    const structuredData = {
      "@context": "https://schema.org",
      "@type": postData.post_type === 'poll' ? "Question" : "SocialMediaPosting",
      "headline": ogData.title,
      "description": ogData.description,
      "image": ogData.image,
      "url": ogData.url,
      "author": {
        "@type": "Person",
        "name": postData.userData?.name || "Anonymous",
        "image": postData.userData?.profile_picture_url
      },
      "publisher": {
        "@type": "Organization",
        "name": ogData.siteName,
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/logo.png`
        }
      },
      "datePublished": postData.createdAt,
      "dateModified": postData.updatedAt,
      "interactionStatistic": [
        {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/LikeAction",
          "userInteractionCount": postData.like_count || 0
        },
        {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/CommentAction",
          "userInteractionCount": postData.comments || 0
        },
        {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/ShareAction",
          "userInteractionCount": postData.share_count || 0
        }
      ]
    };

    if (postData.post_type === 'poll' && postData.poll) {
      structuredData.acceptedAnswer = postData.poll.options.map(option => ({
        "@type": "Answer",
        "text": option.text,
        "upvoteCount": option.vote_count
      }));
    }

    if (postData.tags && postData.tags.length > 0) {
      structuredData.keywords = postData.tags.join(', ');
    }

    return structuredData;
  }, [postData, ogData]);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>{ogData.title}</title>
          <meta name="description" content={ogData.description} />
          <meta property="og:title" content={ogData.title} />
          <meta property="og:description" content={ogData.description} />
          <meta property="og:type" content={ogData.type} />
        </Helmet>
        <div className="max-w-2xl mx-auto p-4 bg-white min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Error Loading Post | Your App Name</title>
          <meta name="description" content="An error occurred while loading the post." />
          <meta property="og:title" content="Error Loading Post" />
          <meta property="og:description" content="An error occurred while loading the post." />
          <meta property="og:type" content="website" />
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
          <title>Post Not Found | Your App Name</title>
          <meta name="description" content="The requested post could not be found." />
          <meta property="og:title" content="Post Not Found" />
          <meta property="og:description" content="The requested post could not be found." />
          <meta property="og:type" content="website" />
        </Helmet>
        <div className="flex justify-center items-center h-screen">
          <div className="text-gray-500">Post not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{ogData.title}</title>
        <meta name="description" content={ogData.description} />
        <meta name="keywords" content={ogData.tags.join(', ')} />
        <meta name="author" content={ogData.author} />

        {/* Enhanced OpenGraph Tags */}
        <meta property="og:title" content={ogData.title} />
        <meta property="og:description" content={ogData.description} />
        <meta property="og:image" content={ogData.image} />
        <meta property="og:image:alt" content={`Post by ${ogData.author}`} />
        <meta property="og:url" content={ogData.url} />
        <meta property="og:type" content={ogData.type} />
        <meta property="og:site_name" content={ogData.siteName} />
        <meta property="og:locale" content="en_US" />

        {/* Enhanced OpenGraph Image Tags */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:secure_url" content={ogData.image} />
        <meta property="og:image:type" content="image/jpeg" />

        {/* Enhanced Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogData.title} />
        <meta name="twitter:description" content={ogData.description} />
        <meta name="twitter:image" content={ogData.image} />
        <meta name="twitter:image:alt" content={`Post by ${ogData.author}`} />
        <meta name="twitter:site" content="@yourapphandle" />
        <meta name="twitter:creator" content="@yourapphandle" />

        {/* WhatsApp specific meta tags */}
        <meta property="og:title" content={ogData.title} />
        <meta property="og:description" content={ogData.description} />
        <meta property="og:image" content={ogData.image} />

        {/* Article/Post Specific Meta Tags */}
        {ogData.publishedTime && (
          <>
            <meta property="article:author" content={ogData.author} />
            <meta property="article:published_time" content={ogData.publishedTime} />
            <meta property="article:modified_time" content={ogData.modifiedTime} />
            {ogData.tags.map((tag, index) => (
              <meta key={index} property="article:tag" content={tag} />
            ))}
          </>
        )}

        {/* Additional social media meta tags */}
        <meta property="fb:app_id" content="your-facebook-app-id" />
        <meta name="theme-color" content="#1DA1F2" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(generateStructuredData)}
        </script>

        {/* Canonical URL */}
        <link rel="canonical" href={ogData.url} />
      </Helmet>

      {/* Rest of the component's JSX */}
      {/* <nav className="bg-white shadow-md py-3 px-6 flex justify-between items-center z-[9999]">
        <div className="flex items-center">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="logo"
              className="md:h-8 h-6 md:w-full w-28 transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
        <div className="flex items-center space-x-6">
          {isUserData ? (
            <>
              <ul className='flex justify-start items-center gap-6 font-semibold text-sm'>
                <li>
                  <Link to={`/user/feed`} className='hover:text-blue-500 bg-gray-50 rounded-full transition-all duration-300 hover:scale-100'
                    onClick={() => { window.localStorage.setItem("postId", id) }}>Home</Link>
                </li>
                <li className='md:block hidden'>
                  <Link to={`/user/profile`} className='hover:text-blue-500 bg-gray-50 rounded-full transition-all duration-300 hover:scale-100'>Profile</Link>
                </li>
                <li className='md:block hidden'>
                  <Link to={`/user/connections`} className='hover:text-blue-500 bg-gray-50 rounded-full transition-all duration-300 hover:scale-100'>Connections</Link>
                </li>
              </ul>
              <div className='flex justify-start gap-2 items-center'>
                {isUserData.personalInfo?.profile_picture_url ? (
                  <img src={isUserData.personalInfo?.profile_picture_url} alt='user' className='w-8 h-8 rounded-full border' />
                ) : (
                  <img src='/0684456b-aa2b-4631-86f7-93ceaf33303c.png' className='w-8 h-8 rounded-full border' alt='user' />
                )}
                <h2>{isUserData.personalInfo?.username}</h2>
              </div>
            </>
          ) : (
            <Button>
              <Link to={`https://dev-verifide.verifide.xyz/login`}
                onClick={() => window.localStorage.setItem("postId", id)}>Sign In</Link>
            </Button>
          )}
        </div>
      </nav> */}

      {/* Post Content */}
      <div className="max-w-2xl mx-auto p-4 min-h-screen">
        {/* User Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {postData?.userData?.profile_picture_url ?
              <img
                src={postData?.userData?.profile_picture_url}
                alt={postData?.userData?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              :
              <img
                src={`/0684456b-aa2b-4631-86f7-93ceaf33303c.png`}
                alt="logo"
                className="w-12 h-12 rounded-full object-cover"
              />
            }
            <div>
              <h3 className="font-semibold text-gray-900">
                {postData?.userData?.name}
              </h3>
              <p className="text-xs text-gray-500">
                {formatDate(postData?.updatedAt)}
              </p>
            </div>
          </div>

        </div>

        {/* Post Content */}
        <div className="mb-4">
          {/* <p className="text-gray-800 whitespace-pre-line">{postData?.content}</p> */}
        </div>
        {postData?.post_type === 'link' && postData?.link && (
          <div className="mx-auto w-full">
            <MessageText msg={postData?.link} />
          </div>
        )}

        {postData?.post_type === 'jobs' && postData?.job_id && (
          <div className="mb-6 border border-gray-200 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
            {/* Job Header */}
            <div className="bg-white p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center overflow-hidden">
                    {postData.job_id.company?.logo_url ? (
                      <img
                        src={postData.job_id.company.logo_url}
                        alt={postData.job_id.company.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={`/0684456b-aa2b-4631-86f7-93ceaf33303c.png`}
                        alt="logo"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {postData.job_id.job_title_details?.name || 'Job Position'}
                    </h2>
                    <p className="text-lg text-gray-700 font-semibold">
                      {postData.job_id.company?.name || 'Company Name'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {postData.job_id.industry?.name || 'Industry'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-2">
                    {/* <FaBriefcase className="mr-1" /> */}
                    {(postData.job_id.job_type)}
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {postData.job_id.job_location || 'Remote'}
                  </p>
                </div>
              </div>

              {/* Job Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  {/* <FaMapMarkerAlt className="text-gray-400" /> */}
                  {/* <span>{(postData.job_id.work_location) || 'Location not specified'}</span> */}
                </div>

                {postData.job_id.salary_range && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    {/* <FaMoneyBillWave className="text-green-500" /> */}
                    <span>₹{postData.job_id.salary_range}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  {/* <FaClock className="text-blue-500" /> */}
                  <span className="capitalize">{postData.job_id.pay_type || 'Payment type not specified'}</span>
                </div>
              </div>

              {/* Required Skills */}
              {postData.job_id.required_skills && postData.job_id.required_skills.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Required Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {postData.job_id.required_skills.map((skill, index) => (
                      <span
                        key={skill._id || index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Apply Button */}
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Posted {formatDate(postData.updatedAt)}
                </div>

              </div>
            </div>

            {/* Job Description */}
            {postData.job_id.job_description && (
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h4>
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line bg-white p-4 rounded-lg border border-gray-100">
                  {postData.job_id.job_description}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Regular Post Content (for non-job posts) */}
        {postData?.post_type !== 'jobs' && postData?.content && (
          <div className="mb-4">
            <p className="text-gray-800 whitespace-pre-line">{postData?.content}</p>
          </div>
        )}

        {postData?.video_url && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <video
              src={postData.video_url}
              controls
              className="w-full h-auto max-h-96 object-contain rounded-lg"
              poster={postData.thumbnail}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}


        {/* Poll Display */}
        {postData?.post_type === 'poll' && postData?.poll && (
          <div className="mb-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-2 mb-3 text-blue-600">
              <FaChartBar />
              <span className="font-medium">Poll</span>
              <span className="text-xs text-gray-500 ml-auto">
                {postData.poll.total_votes} votes • {postData.poll.voting_length} days left
              </span>
            </div>

            {postData.poll.options.map((option, index) => {
              const percentage = calculatePercentage(option.vote_count, postData.poll.total_votes);
              return (
                <div key={index} className="mb-3 last:mb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{option.text}</span>
                    <span className="text-xs text-gray-500">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {option.vote_count} vote{option.vote_count !== 1 ? 's' : ''}
                  </div>
                </div>
              );
            })}

            {!postData.isVoted && (
              <button
                onClick={triggerPopup}
                className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Vote in Poll
              </button>
            )}
          </div>
        )}

        {/* Post Image */}
        {postData?.thumbnail && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={postData?.thumbnail}
              alt="Post content"
              className="w-full h-auto max-h-96 object-contain rounded-lg"
            />
          </div>
        )}

        {postData.image_urls && postData.image_urls.length > 0 && (
          <div className="mb-4 rounded-lg overflow-hidden">
            {/* <img
              src={postData?.image_urls[0]}
              alt="Post content"
              className="w-full h-auto max-h-96 object-contain rounded-lg"
            /> */}
            <MediaCarousel post={{ image_urls: postData.image_urls, video_url: postData.video_url, }} />
          </div>
        )}

        {/* Tags */}
        {postData?.tags && postData?.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {postData?.tags.map((tag, index) => (
              <span key={index} className="text-blue-500 text-sm hover:underline cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Post Stats */}
        <div className="flex justify-between text-sm text-gray-500 mb-4 border-gray-200 pb-3">
          <div className="flex space-x-4">
            <span>{postData?.like_count} likes</span>
            <span>{postData?.comments} comments</span>
            <span>{postData?.share_count} shares</span>
            <span>{postData?.view_count} views</span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-semibold mb-3">Comments</h4>
          {postData?.commentList && postData?.commentList.length > 0 ? (
            <div className="space-y-4">
              {postData.commentList.slice(0, 4).map(comment => (
                <div key={comment._id} className="flex space-x-3">
                  {comment.user.profile_picture_url ?
                    <img
                      src={comment.user.profile_picture_url}
                      alt={comment.user.name}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    /> :
                    <img
                      src={`/0684456b-aa2b-4631-86f7-93ceaf33303c.png`}
                      alt={comment.user.name}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                  }
                  <div className="bg-gray-100 p-3 rounded-lg flex-1">
                    <div className="font-semibold text-sm">{comment?.user?.first_name}</div>
                    <div className="text-sm mt-1">{comment.text}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>

      {/* Login Prompt Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl flex flex-col items-center space-y-5">
            <img
              src="/headerlogo-D3k-kYIk 2.png"
              alt="App Logo"
              className="w-40 h-auto"
            />
            <h2 className="text-xl font-bold text-center text-gray-800">
              You're not logged in
            </h2>
            <p className="text-center text-gray-600 text-sm">
              To interact with this content, please sign in to your account.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
              <button
                onClick={() => navigate("/login")}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition duration-300"
              >
                Log in
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition duration-300"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Userpost;