import { Link } from "react-router-dom";

const SharedPostCard = ({ sharedData, isOwn }) => {
  if (!sharedData) return null;

  const { image_urls = [], content = '', tags = [], share_id, video_url } = sharedData;

  // console.log("vide:---------",video_url)

  return (
    <div className={`border rounded-lg overflow-hidden shadow-sm max-w-sm ${isOwn ? 'bg-white' : 'bg-gray-50'}`}>
 
      {video_url ? (
        <div className="relative w-full h-40 bg-black">
          <video 
            controls 
            className="w-full h-full object-contain"
            onClick={(e) => e.preventDefault()}
          >
            <source src={video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : image_urls?.length > 0 ? (
        <div className="relative">
          {image_urls.length === 1 ? (
            <img
              src={image_urls[0]}
              alt="Shared post"
              className="w-full h-40 object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(image_urls[0], '_blank')}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x160?text=Image+Not+Found';
              }}
            />
          ) : (
            <div className="grid grid-cols-2 gap-1">
              {image_urls.slice(0, 4).map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Shared post ${index + 1}`}
                    className="w-full h-20 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(url, '_blank')}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150x80?text=Image+Not+Found';
                    }}
                  />
                  {index === 3 && image_urls.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">+{image_urls.length - 4}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      <div className="p-3">
        {content && (
          <p className="text-sm text-gray-800 mb-2 line-clamp-3">
            {content}
          </p>
        )}

        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-gray-500">+{tags.length - 3} more</span>
            )}
          </div>
        )}

        <Link 
          to={`/post/${share_id}`} 
          className="text-xs text-blue-500 hover:text-blue-700 font-medium"
        >
          View Original Post
        </Link>
      </div>
    </div>
  );
};

export default SharedPostCard;