import React, { useMemo } from 'react'
const urlRegex = /(https?:\/\/[^\s]+)/gi;
const isImageUrl = (u) => /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(u);
const isVideoUrl = (u) => /\.(mp4|webm|ogg|mov)$/i.test(u);

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
const MessageText = ({ msg }) => {
  const parts = useMemo(() => msg?.split(urlRegex) || [], [msg]);
  const urls = useMemo(() => msg?.match(urlRegex) || [], [msg]);

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

export default MessageText