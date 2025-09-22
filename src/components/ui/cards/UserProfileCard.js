import React, { useState } from "react";
import { convertTimestampToDate } from "../../utils/globalFunction";

const UserProfileCard = ({
  email,
  summary,
  follow,
  connection,
  profile_views,
  profile_picture_url,
  handleView,
  user,
  activeTab,
  handleFollowUnfollow,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowClick = async (userData) => {
    setIsLoading(true);
    try {
      await handleFollowUnfollow(userData);
    } catch (error) {
      console.error("Error in follow/unfollow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDisplayData = () => {
    const typeLabels = {
      skill: "skills",
      work: "experiences",
      education: "educations",
    };
    function capitalizeWords(str = "") {
      return str
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
    }

    switch (activeTab) {
      case "user":
        const isConnected = user?.is_connected;
        return {
          title: `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
            user?.username ||
            "Unknown User",
          subtitle:
            email || user?.headline || user?.display_name || "No headline",
          // description: summary || user?.summary || "No summary available",
          description:
            user?.matchedType === "none"
              ? "No match available."
              : `${capitalizeWords(user?.matchedFirstValueName)} and ${user?.matchedCount} more ${typeLabels[user?.matchedType] ?? ""
              } matched.`,

          image:
            profile_picture_url ||
            user?.profile_picture_url ||
            "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
          stats: {
            first: { value: connection || user?.connection_count || 0, label: "Connections" },
            second: { value: follow || user?.follower_count || 0, label: "Followers" },
            third: { value: profile_views || user?.profile_views || 0, label: "Views" },
          },
          buttons: [isConnected ? "Connected" : "Connect", "Profile"],
          isConnected,
        };
      case "companies":
        const isFollowingCompany = user?.is_following;
        return {
          title: user?.name || user?.display_name || "Unknown Company",
          subtitle: user?.display_name || "Company",
          description: user?.description || "No description available",
          image: user?.logo_url || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
          errorImage: "/Img/Profile/Frame.png",
          stats: {
            first: { value: user?.employee_count || 0, label: "Employees" },
            second: { value: user?.follower_count || 0, label: "Followers" },
            third: { value: convertTimestampToDate(user?.founded_year) || "N/A", label: "Founded" },
          },
          buttons: [isFollowingCompany ? "Following" : "Follow", "Visit"],
          isConnected: isFollowingCompany,
        };
      case "institutions":
        const isFollowingInstitution = user?.is_following;
        return {
          title: user?.name || user?.display_name || "Unknown Institution",
          subtitle: user?.display_name || "Institution",
          description: user?.description || "No description available",
          image: user?.logo_url || "/Img/Profile/Frame.png",
          errorImage: "/Img/Profile/Frame.png",
          stats: {
            first: { value: user?.employee_count || 0, label: "Staff" },
            second: { value: user?.follower_count || 0, label: "Followers" },
            third: { value: convertTimestampToDate(user?.founded_year) || "N/A", label: "Founded" },
          },
          buttons: [isFollowingInstitution ? "Following" : "Follow", "Visit"],
          isConnected: isFollowingInstitution,
        };
      default:
        return {
          title: "Unknown",
          subtitle: "Unknown",
          description: "No data available",
          image: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
          stats: {
            first: { value: 0, label: "N/A" },
            second: { value: 0, label: "N/A" },
            third: { value: 0, label: "N/A" },
          },
          buttons: ["Follow", "Contact"],
          isConnected: false,
        };
    }
  };

  const displayData = getDisplayData();

  return (
    <div className="w-80 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative h-[170px]">
        <img
          src={displayData.image}
          alt={displayData.title}
          onError={(e) => (e.currentTarget.src = displayData.errorImage)}
          className="w-full h-full object-cover"
        />

        {user?.is_verified && (
          <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            ✔ Verified
          </span>
        )}
      </div>

      <div className="p-5">
        <h2 className="text-lg font-semibold text-gray-900 truncate">
          {displayData.title}
        </h2>
        <p className="text-sm text-gray-500 truncate">{displayData.subtitle}</p>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {displayData.description}
        </p>

        <div className="flex justify-between mt-5">
          {Object.values(displayData.stats).map((stat, idx) => (
            <div key={idx} className="text-center">
              {stat.value==="N/A"?<></>:<>
                <p className="text-lg font-bold text-blue-600">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              
              </>}
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-5">
          <button
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold ${displayData.isConnected
              ? "bg-green-500 text-white cursor-default"
              : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            onClick={() =>
              !displayData.isConnected && handleFollowClick(user)
            }
            disabled={isLoading || displayData.isConnected}
          >
            {isLoading ? "Connecting..." : displayData.buttons[0]}
          </button>
          <button
            className="flex-1 py-2 px-4 rounded-lg text-sm font-semibold border border-gray-300 hover:bg-gray-100"
            onClick={() => handleView(user)}
          >
            {displayData.buttons[1]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
