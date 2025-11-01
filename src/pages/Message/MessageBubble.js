/* eslint-disable jsx-a11y/img-redundant-alt */

import React, { useCallback, useState } from 'react';
import { BiDownload, BiLink, BiShare, BiTag } from 'react-icons/bi';
// import { BsReplyAll } from 'react-icons/bs';
import { FaReply } from 'react-icons/fa6';
import { RiCheckDoubleLine, RiCheckLine } from 'react-icons/ri';
// import { FiShare2, FiTag, FiExternalLink,  } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import JobPost from '../Home/components/JobPost';
import LinkedInCertificate from '../Certificates/Certificates';
import { convertTimestampToDate } from '../../components/utils/globalFunction';
import { BaseUrl } from '../../components/hooks/axiosProvider';
// import PdfThumbnail from '../../components/ui/PdfThumbnail/PdfThumbnail';



const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;

  let videoId = null;

  try {
    if (url?.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      // Already an embed URL, but ensure it has proper parameters
      return url.includes('?') ? url : `${url}?enablejsapi=1&origin=${window.location.origin}`;
    } else if (url.includes('youtube.com/v/')) {
      videoId = url.split('v/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/shorts/')) {
      videoId = url.split('shorts/')[1]?.split('?')[0];
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&rel=0&modestbranding=1`;
    }
  } catch (error) {
    console.error('Error parsing YouTube URL:', error);
  }

  return null;
};


const MessageText = ({ msg, isOwn }) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = msg.message.match(urlRegex) || [];

  const renderPreview = (url) => {
    let embeddedUrl = "";
    let isYoutube = false;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      embeddedUrl = getYouTubeEmbedUrl(url);
      isYoutube = true;
    }
    const isImage = /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url);
    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(url);

    if (isYoutube) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <div className="mt-3 border rounded-lg overflow-hidden w-full h-80">
            <iframe
              src={embeddedUrl}
              title="Link Preview"
              className="w-full h-full pointer-events-none"
            />
          </div>
        </a>
      )
    }

    if (isImage) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <img
            src={url}
            alt="Preview"
            className="w-full h-auto max-h-80 object-contain rounded-lg"
          />
        </a>
      );
    }

    if (isVideo) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <video
            src={url}
            controls
            className="w-full max-h-80 rounded-lg"
          />
        </a>
      );
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4 glassy-card hover:glassy-card rounded-lg"
      >
        <div className="flex items-center gap-3">
          <img
            src={`https://www.google.com/s2/favicons?sz=64&domain_url=${url}`}
            alt="favicon"
            className="w-6 h-6"
          />
          <span className="truncate text-blue-600">{url}</span>
        </div>
      </a>
    );
  };

  return (
    <div>
      {/* Message text */}
      <div
        className={`text-sm whitespace-pre-wrap break-words ${urls.length
          ? "text-blue-600 cursor-pointer hover:underline"
          : isOwn
            ? "glassy-text-primary"
            : "glassy-text-primary"
          }`}
      >
        {msg.message.split(urlRegex).map((part, index) =>
          urlRegex.test(part) ? (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {part}
            </a>
          ) : (
            part
          )
        )}
      </div>

      {/* Preview section for each URL */}
      {urls.length > 0 && (
        <div className="mt-3 space-y-3 w-full max-w-md">
          {urls.map((url, idx) => (
            <div
              key={idx}
              className="border rounded-lg overflow-hidden shadow-sm"
            >
              {renderPreview(url)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const MessageBubble = ({ msg, isOwn, onReply, messages = [], user_id }) => {
  const [pollVote, setPollVote] = useState(null);
  const navigate = useNavigate()
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toLowerCase().replace(' ', '');
  };

  const getFileName = (url) => {
    // console.log(url)
    // PdfThumbnail(url)
    if (!url) return 'file';
    return url.split('/').pop().split('?')[0] || 'file';
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReplyClick = (e) => {
    e.stopPropagation();
    onReply(msg);
  };

  const getRepliedMessage = () => {
    if (!msg.isReplied || !msg.chat_id) return null;
    if (msg.reply_to) return msg.reply_to;
    if (!msg.isReplied || !msg.chat_id) return null;
    return messages.find(m => m._id === msg.chat_id || m.id === msg.chat_id);
    // return messages.find(m => m._id === msg.chat_id || m.id === msg.chat_id);
  };

  const renderRepliedMessage = () => {
    const repliedMsg = getRepliedMessage();
    if (!repliedMsg) return null;

    const getReplyPreviewText = () => {
      if (repliedMsg.message) return repliedMsg.message;
      if (repliedMsg.file_type === 'image') return '📷 Image';
      if (repliedMsg.file_type === 'video') return '🎥 Video';
      if (repliedMsg.file_type === 'pdf') return '📄 PDF';
      if (repliedMsg.file_type === 'shared-post') return '📝 Shared Post';
      if (repliedMsg.file_type === 'shared-interview') return '📅 Interview Scheduled';
      return 'Message';
    };

    const repliedMessageOwn = repliedMsg.sender_id === msg.sender_id;

    return (
      <div className={`mb-2 p-2 rounded-lg border-l-2 ${isOwn
        ? 'glassy-card border-white/40'
        : 'glassy-card border-gray-300'
        }`}>
        <p className={`text-xs font-medium mb-1 ${isOwn ? 'glassy-text-primary/80' : 'glassy-text-secondary'
          }`}>
          {repliedMessageOwn ? 'You' : 'Them'}
        </p>
        <p className={`text-xs truncate ${isOwn ? 'glassy-text-primary/90' : 'glassy-text-primary'
          }`}>
          {getReplyPreviewText()}
        </p>
      </div>
    );
  };

  const renderSharedPostMedia = (sharedData) => {
    if (sharedData.video_url && sharedData.image_urls?.length > 0) {
      return (
        <div className="mb-3">
          <div className="relative group">
            <img
              src={sharedData.image_urls[0]}
              alt="Shared content"
              className="w-full h-32 object-cover rounded-lg cursor-pointer hover:brightness-95 transition-all"
              onClick={() => window.open(sharedData.image_urls[0], '_blank')}
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity glassy-card/30 rounded-full p-1.5">
              <BiDownload
                className="w-4 h-4 glassy-text-primary cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(sharedData.image_urls[0], getFileName(sharedData.image_urls[0]));
                }}
              />
            </div>
          </div>
        </div>
      );
    }

    if (sharedData.video_url) {
      return (
        <div className="relative group mb-3">
          <video
            controls
            className="w-full h-32 object-contain glassy-card rounded-lg"
            preload="metadata"
          >
            <source src={sharedData.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity glassy-card/30 rounded-full p-1.5">
            <BiDownload
              className="w-4 h-4 glassy-text-primary cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(sharedData.video_url, getFileName(sharedData.video_url));
              }}
            />
          </div>
        </div>
      );
    }

    if (sharedData.image_urls?.length > 0) {
      return (
        <div className="mb-3">
          {sharedData.image_urls.length === 1 ? (
            <div className="relative group">
              <img
                src={sharedData.image_urls[0]}
                alt="Shared content"
                className="w-full h-32 object-cover rounded-lg cursor-pointer hover:brightness-95 transition-all"
                onClick={() => window.open(sharedData.image_urls[0], '_blank')}
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity glassy-card/30 rounded-full p-1.5">
                <BiDownload
                  className="w-4 h-4 glassy-text-primary cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(sharedData.image_urls[0], getFileName(sharedData.image_urls[0]));
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1">
              {sharedData.image_urls.slice(0, 4).map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Shared content ${index + 1}`}
                    className="w-full h-20 object-cover rounded cursor-pointer hover:brightness-95 transition-all"
                    onClick={() => window.open(url, '_blank')}
                  />
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity glassy-card/30 rounded-full p-1">
                    <BiDownload
                      className="w-3 h-3 glassy-text-primary cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(url, getFileName(url));
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const handleCopyLink = useCallback((post) => {
    // console.log(post)
    if (post) {
      navigator.clipboard.writeText(`${BaseUrl}user/feed/${post}`);
      // http://localhost:3000/post-view/68a2f34d189e623973cda851
      navigate(`/user/feed/${post}`)
      toast.success('Link copied to clipboard');
    } else {
      toast.error('Invalid post data');
    }
    // setShowOptionsDropdown(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePollVote = (optionIndex) => {
    setPollVote(optionIndex);
    // Here you would typically call an API to record the vote
    toast.success('Vote recorded!');
  };

  const renderLinkPreview = (sharedData) => {
    return (
      <div className="mb-3">
        {/* Link thumbnail */}
        {sharedData.thumbnail && (
          <div className="relative group mb-2">
            <img
              src={sharedData.thumbnail}
              alt="Link preview"
              className="w-full h-32 object-cover rounded-lg cursor-pointer hover:brightness-95 transition-all"
              onClick={() => window.open(sharedData.link, '_blank')}
            />
          </div>
        )}

        {/* Link details */}
        <div
          className={`p-3 rounded-lg border cursor-pointer hover:bg-opacity-80 transition-all ${isOwn ? 'glassy-card/10 border-white/20' : ' border-gray-200'
            }`}
          onClick={() => window.open(sharedData.link, '_blank')}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {sharedData.title && (
                <h4 className={`font-semibold text-sm mb-1 ${isOwn ? 'glassy-text-primary/90' : 'glassy-text-primary'
                  }`}>
                  {sharedData.title}
                </h4>
              )}
              {sharedData.link && (
                <p className={`text-xs mb-2 ${isOwn ? 'glassy-text-primary/70' : 'glassy-text-secondary'
                  }`}>
                  {new URL(sharedData.link).hostname}
                </p>
              )}
            </div>
            <BiLink className={`w-4 h-4 ml-2 ${isOwn ? 'glassy-text-primary/70' : 'glassy-text-secondary'
              }`} />
          </div>
        </div>
      </div>
    );
  };

  const renderPoll = (sharedData) => {
    const poll = sharedData.poll || {};
    const totalVotes = poll.total_votes || 0;

    return (
      <div className="mb-3">
        <div className={`flex items-center space-x-2 mb-3 ${isOwn ? 'glassy-text-primary/80' : 'glassy-text-secondary'
          }`}>
          {/* <ch className="w-4 h-4" /> */}
          <span className="text-xs font-medium">Poll • {totalVotes} votes</span>
        </div>

        <div className="space-y-2">
          {poll.options?.map((option, index) => {
            const percentage = totalVotes > 0 ? Math.round((option.vote_count / totalVotes) * 100) : 0;
            const hasVoted = pollVote === index;

            return (
              <div
                key={index}
                className={`relative p-3 rounded-lg border cursor-pointer transition-all ${hasVoted
                  ? isOwn
                    ? 'glassy-card0/20 border-blue-400/50'
                    : 'glassy-card border-blue-200'
                  : isOwn
                    ? 'glassy-card/10 border-white/20 hover:glassy-card/20'
                    : ' border-gray-200 hover:glassy-card'
                  }`}
                onClick={() => handlePollVote(index)}
              >
                {/* Progress bar background */}
                <div
                  className={`absolute inset-0 rounded-lg transition-all ${isOwn ? 'bg-blue-400/20' : 'glassy-card'
                    }`}
                  style={{ width: `${percentage}%` }}
                />

                <div className="relative flex items-center justify-between">
                  <span className={`text-sm font-medium ${isOwn ? 'glassy-text-primary/90' : 'glassy-text-primary'
                    }`}>
                    {option.text}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${isOwn ? 'glassy-text-primary/70' : 'glassy-text-secondary'
                      }`}>
                      {percentage}%
                    </span>
                    <span className={`text-xs ${isOwn ? 'glassy-text-primary/70' : 'glassy-text-secondary'
                      }`}>
                      ({option.vote_count})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {poll.voting_length && (
          <p className={`text-xs mt-2 ${isOwn ? 'glassy-text-primary/70' : 'glassy-text-secondary'
            }`}>
            Voting ends in {poll.voting_length} days
          </p>
        )}
      </div>
    );
  };

  const renderMessageContent = () => {
    switch (msg.file_type) {
      case 'shared-interview':
        const interview = msg.shared_data || {};
        const job = interview.job_details || {};
        const company = job.company || {};
        const skills = job.required_skills || [];

        return (
          <div
            className={`border rounded-lg overflow-hidden max-w-[320px] ${isOwn ? 'glassy-card/10 border-white/20' : 'glassy-card border-gray-200'
              }`}
          >
            <div
              className={`flex items-center space-x-2 p-3 border-b ${isOwn ? 'border-white/20' : 'border-gray-200'
                }`}
            >
              <BiShare className={`w-4 h-4 ${isOwn ? 'glassy-text-primary' : 'glassy-text-secondary'}`} />
              <span
                className={`text-xs font-medium ${isOwn ? 'glassy-text-primary' : 'glassy-text-secondary'}`}
              >
                Interview Scheduled
              </span>
            </div>

            <div className="p-3">
              <div className="flex items-center space-x-3 mb-3">
                {company.logo_url && (
                  <img
                    src={company.logo_url}
                    alt={company.name || 'Company Logo'}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                )}
                <div>
                  <p className="text-sm font-semibold glassy-text-primary">{company.name}</p>
                  <p className="text-xs glassy-text-secondary">{job.job_title_details?.name}</p>
                </div>
              </div>

              <div className="text-xs glassy-text-secondary space-y-1 mb-3">
                <p><strong>Type:</strong> {job.job_type}</p>
                <p><strong>Location:</strong> {job.job_location} ({job.work_location})</p>
                <p><strong>Pay:</strong> {job.pay_type} ({job.salary_range})</p>
                <p><strong>Industry:</strong> {job.industry?.name}</p>
              </div>

              {interview.content && (
                <p className="text-sm mb-3 glassy-text-primary">{interview.content}</p>
              )}

              {(interview.select_date || interview.select_time) && (
                <div className="text-xs glassy-text-secondary mb-3">
                  {interview.select_date && (
                    <p>
                      <strong>Date:</strong>{' '}
                      {new Date(interview.select_date).toLocaleDateString()}
                    </p>
                  )}
                  {interview.select_time && (
                    <p>
                      <strong>Time:</strong>{' '}
                      {new Date(interview.select_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              )}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {skills.map((skill) => (
                    <span
                      key={skill._id}
                      className="px-2 py-1 text-xs glassy-card text-blue-800 rounded-full"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Meeting URL */}
              {interview.meeting_url && (
                <a
                  href={interview.meeting_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline"
                >
                  Join Meeting
                </a>
              )}
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="relative group">
            <img
              src={msg.file_url}
              alt="Shared image"
              className="max-w-[280px] rounded-lg object-cover cursor-pointer hover:brightness-95 transition-all"
              onClick={() => window.open(msg.file_url, '_blank')}
            />
            {msg.message && (
              <div className={`mt-2 text-sm ${isOwn ? 'glassy-text-primary' : 'glassy-text-primary'}`}>
                {msg.message}
              </div>
            )}
            <div className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity glassy-card/30 rounded-full p-1.5`}>
              <BiDownload
                className="w-4 h-4 glassy-text-primary cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(msg.file_url, getFileName(msg.file_url));
                }}
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="relative group">
            <video
              controls
              className="max-w-[280px] rounded-lg"
              preload="metadata"
            >
              <source src={msg.file_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {msg.message && (
              <div className={`mt-2 text-sm ${isOwn ? 'glassy-text-primary' : 'glassy-text-primary'}`}>
                {msg.message}
              </div>
            )}
            <div className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity glassy-card/30 rounded-full p-1.5`}>
              <BiDownload
                className="w-4 h-4 glassy-text-primary cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(msg.file_url, getFileName(msg.file_url));
                }}
              />
            </div>
          </div>
        );

      case 'pdf':
        return (
          <div className={`flex items-center space-x-3 p-3 rounded-lg max-w-[280px] ${isOwn ? 'glassy-card/20' : 'glassy-card'}`}>

            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${isOwn ? 'glassy-text-primary' : 'glassy-text-primary'}`}>

                {msg?.file_url && (
                  <iframe
                    src={`https://docs.google.com/gview?url=${msg?.file_url}&embedded=true`}
                    style={{ width: "100%", height: "100px", border: "none" }}
                    title="PDF Preview"
                  />

                )}

              </p>
              <p className={`text-xs ${isOwn ? 'glassy-text-primary/70' : 'glassy-text-secondary'}`}>
                PDF Document
              </p>
            </div>
            <button
              onClick={() => handleDownload(msg.file_url, getFileName(msg.file_url))}
              className={`flex-shrink-0 p-2 rounded-full hover:bg-opacity-20 transition-colors ${isOwn ? 'hover:glassy-card/30' : 'hover:glassy-card'}`}
            >
              <BiDownload className={`w-4 h-4 ${isOwn ? 'glassy-text-primary' : 'glassy-text-secondary'}`} />
            </button>
          </div>
        );

      case 'shared-post':
        const sharedData = msg.shared_data || {};
        if (sharedData.post_type === 'jobs') {
          return <JobPost job={sharedData?.post_job_id} isOwn={isOwn} />;
        }
        if (sharedData?.post_type === 'certificates') {
          return <LinkedInCertificate
            certificateName={sharedData?.post_certificate_id?.name} issueBy={sharedData?.post_certificate_id?.issuing_organization} description={sharedData?.post_certificate_id?.description}
            date={convertTimestampToDate(sharedData?.post_certificate_id?.issue_date)} record={sharedData?.post_certificate_id} type="certifications" username={sharedData?.user_details?.name} />
        }
        return (
          <div className={`border rounded-lg overflow-hidden max-w-[320px] ${isOwn ? 'glassy-card/10 border-white/20' : 'glassy-card border-gray-200'}`}>
            <div className={`flex items-center space-x-2 p-3 border-b ${isOwn ? 'border-white/20' : 'border-gray-200'}`}
              onClick={() => {
                sessionStorage.setItem('currentPostId', msg?.shared_data?.share_id);
                // navigate(`/user/post-view/${user_id?.first_name}`);
                handleCopyLink(msg?.shared_data?.share_id)
              }}
            >
              <BiShare className={`w-4 h-4 ${isOwn ? 'glassy-text-primary' : 'glassy-text-secondary'}`} />
              <span className={`text-xs font-medium ${isOwn ? 'glassy-text-primary' : 'glassy-text-secondary'}`}>
                Shared Post
              </span>
            </div>

            <div className="flex items-center space-x-3 p-2">
              {sharedData?.user_details && (
                <img
                  src={sharedData?.user_details?.profile_picture_url || '/0684456b-aa2b-4631-86f7-93ceaf33303c.png'}
                  alt={'User Avatar'}
                  className="w-8 h-8 rounded-full object-cover border"
                />
              )}
              <div>
                <p className="text-sm font-semibold glassy-text-primary">
                  {sharedData?.user_details?.first_name} {sharedData?.user_details?.last_name} {sharedData?.user_details?.name}
                </p>
              </div>
            </div>

            <div className="p-3">
              {sharedData.content && (
                <p className={`text-sm mb-3 ${isOwn ? 'glassy-text-primary' : 'glassy-text-primary'}`}>
                  {sharedData.content}
                </p>
              )}

              {sharedData.post_type === 'link' && renderLinkPreview(sharedData)}
              {sharedData.post_type === 'poll' && renderPoll(sharedData)}
              {(!sharedData.post_type || sharedData.post_type === 'media') && renderSharedPostMedia(sharedData)}

              {sharedData.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {sharedData.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${isOwn ? 'glassy-card/20 glassy-text-primary' : 'glassy-card text-blue-800'
                        }`}
                    >
                      <BiTag className="w-3 h-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                  {sharedData.tags.length > 3 && (
                    <span className={`text-xs px-2 py-1 rounded-full ${isOwn ? 'glassy-card/20 glassy-text-primary' : 'glassy-card glassy-text-secondary'}`}>
                      +{sharedData.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div>
                <img src={sharedData?.image_urls[0]} alt='img' />
              </div>
            </div>
          </div>
        );

      case 'text':
      default:
        return msg.message ? (
          <div className={`text-sm whitespace-pre-wrap break-words ${isOwn ? 'glassy-text-primary' : 'glassy-text-primary'}`}>
            {/* {msg.message} */}
            <MessageText msg={msg} />
          </div>
        ) : null;
    }
  };

  return (
    <div className={`flex msg_ui overflow-hidden overflow-auto mb-1.5 px-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] relative group ${isOwn
            ? 'glassy-text-primary rounded-tr-none rounded-lg'
            : 'glassy-card rounded-tl-none rounded-lg shadow-sm'
          }`}
        style={{
          borderRadius: isOwn ? '7.5px 0 7.5px 7.5px' : '0 7.5px 7.5px 7.5px'
        }}
      >
        <div className="px-3 pt-3 pb-1">
          {renderRepliedMessage()}

          {renderMessageContent()}

          <div className={`flex justify-between items-center mt-2 space-x-2 ${isOwn ? 'glassy-text-primary' : 'glassy-text-secondary'}`}>
            {/* Reply button */}
            <button
              onClick={handleReplyClick}
              className={`transition-opacity p-1 rounded-full hover:bg-button-hover/20`}
              title="Reply"
            >
              <FaReply className="w-4 h-4" />
            </button>

            {/* Timestamp and read status */}
            <div className="flex justify-end items-center gap-2">
              <span className="text-[11px] glassy-text-secondary">
                {formatTime(msg.timestamp || msg.createdAt)}
              </span>
              {isOwn && (
                <span className="text-xs">
                  {msg.isRead ? (
                    <RiCheckDoubleLine size={20} color="var(--text-primary)" />
                  ) : (
                    <RiCheckLine size={20} color="var(--text-primary)" />
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default MessageBubble