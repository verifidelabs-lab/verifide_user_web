import { useState } from "react";
import { BiChevronRight, BiEnvelope, BiMessageDetail, BiTime, BiUser } from "react-icons/bi";
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};
const EngagementItem = ({ engagement, navigate }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glassy-card shadow-sm hover:shadow-md transition-shadow duration-200 p-5 rounded-xl border border-gray-100">
      <div
        className="flex items-center gap-4 cursor-pointer group"
        onClick={() =>
          navigate(
            `/user/profile/${engagement?.user_id?.username}/${engagement?.user_id?._id}`
          )
        }
      >
        <img
          src={
            engagement.user_id.profile_picture_url ||
            "https://via.placeholder.com/40"
          }
          alt={engagement.user_id.username}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-indigo-400 transition-colors"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {engagement.user_id.first_name} {engagement.user_id.last_name}
          </h4>
          <p className="text-sm glassy-text-secondary">@{engagement.user_id.username}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-4">
        <div className="flex items-center text-gray-600">
          <BiEnvelope className="mr-2 text-indigo-500" />
          <span className="truncate">{engagement.email}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <BiUser className="mr-2 text-indigo-500" />
          <span className="font-medium">ID:</span>
          <span className="ml-1">{engagement.identifier}</span>
        </div>
      </div>

      {engagement.remarks && (
        <div className="mt-4">
          <div
            className="flex items-center text-gray-700 mb-2 cursor-pointer select-none"
            onClick={() => setExpanded(!expanded)}
          >
            <BiMessageDetail className="mr-2 text-indigo-500" />
            <span className="text-sm font-medium">Remarks</span>
            <BiChevronRight
              className={`ml-1 transform transition-transform ${expanded ? "rotate-90 text-indigo-500" : "text-gray-400"
                }`}
            />
          </div>
          {expanded && (
            <p className="text-gray-700 bg-indigo-50 p-3 rounded-lg border border-indigo-100 text-sm leading-relaxed">
              {engagement.remarks}
            </p>
          )}
        </div>
      )}

      <div className="flex items-center glassy-text-secondary text-xs mt-4">
        <BiTime className="mr-1 text-indigo-400" />
        <span>{formatDate(engagement.date)}</span>
      </div>
    </div>
  );
};

export default EngagementItem;