import { useCallback, useEffect, useMemo, useState } from "react";

const urlRegex = /(https?:\/\/[^\s]+)/gi;
const isImageUrl = (u) => /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(u);
const isVideoUrl = (u) => /\.(mp4|webm|ogg|mov)$/i.test(u);

const MessageText2 = ({ msg }) => {
    const parts = useMemo(() => msg?.split(urlRegex) || [], [msg]);
    const urls = useMemo(() => msg?.match(urlRegex) || [], [msg]);
    const fetchLinkPreview = useCallback(async (url) => {
        try {

            const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
             if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error fetching link preview:', error);
        }

        return {
            title: new URL(url).hostname,
            description: '',
            image: null,
            url: url
        };
    }, []);

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


    const useLinkPreview = (url) => {
        const [preview, setPreview] = useState(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            let isMounted = true;

            const getPreview = async () => {
                setLoading(true);
                try {
                    const data = await fetchLinkPreview(url);
                    if (isMounted) {
                        setPreview(data);
                    }
                } catch (error) {
                    console.error('Error getting link preview:', error);
                } finally {
                    if (isMounted) {
                        setLoading(false);
                    }
                }
            };

            getPreview();

            return () => {
                isMounted = false;
            };
        }, [url, fetchLinkPreview]);

        return { preview, loading };
    };

    const renderPreview = (url) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { preview, loading } = useLinkPreview(url);
        const yt = getYouTubeEmbedUrl(url);
 

        if (loading) {
            return (
                <div className="mt-3 p-4 bg-gray-100 rounded-lg animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
            );
        }

        if (yt) {
            return (
                <a href={url} target="_blank" rel="noopener noreferrer">
                    <div className="mt-3 border rounded-lg overflow-hidden w-full h-80">
                        <iframe
                            title="YouTube preview"
                            src={yt}
                            className="w-full h-full pointer-events-none"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </a>
            );
        }

        if (isImageUrl(url)) {
            return (
                <a href={url} target="_blank" rel="noopener noreferrer">
                    <img
                        src={url}
                        alt="Preview"
                        className="w-full h-auto max-h-80 object-contain rounded-lg"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                </a>
            );
        }

        if (isVideoUrl(url)) {
            return (
                <a href={url} target="_blank" rel="noopener noreferrer">
                    <video
                        src={url}
                        controls
                        autoPlay
                        className="w-full max-h-80 rounded-lg"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                </a>
            );
        }

        // For PDFs and other document types
        if (url.toLowerCase().endsWith('.pdf')) {
            return (
                <a href={url} target="_blank" rel="noopener noreferrer" className="block mt-3">
                    <div className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">PDF</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium truncate">{preview?.title || 'PDF Document'}</h4>
                                <p className="text-sm text-gray-600 truncate">Click to view PDF document</p>
                            </div>
                        </div>
                    </div>
                </a>
            );
        }

        // For other URLs with preview data
        if (preview) {
            return (
                <a href={url} target="_blank" rel="noopener noreferrer" className="block mt-3">
                    <div className="border rounded-lg overflow-hidden bg-white hover:bg-gray-50 transition-colors">
                        {preview.image && (
                            <img
                                src={preview.image}
                                alt={preview.title}
                                className="w-full h-40 object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        )}
                        <div className="p-3">
                            <h4 className="font-medium text-sm mb-1 line-clamp-2">{preview.title}</h4>
                            <p className="text-xs text-gray-600 line-clamp-2">{preview.description}</p>
                            <div className="flex items-center mt-2">
                                <img
                                    src={`https://www.google.com/s2/favicons?sz=64&domain_url=${url}`}
                                    alt="favicon"
                                    className="w-4 h-4 mr-2"
                                />
                                <span className="text-xs text-gray-500 truncate">{new URL(url).hostname}</span>
                            </div>
                        </div>
                    </div>
                </a>
            );
        }

        // Fallback for URLs without specific preview handling
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-gray-100 hover:bg-gray-200 rounded-lg mt-3"
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
                <div className="space-y-3 w-full max-w-md mx-auto">
                    {urls.map((u, i) => (
                        <div key={i}>{renderPreview(u)}</div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default MessageText2