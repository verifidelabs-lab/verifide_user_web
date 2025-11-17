import React from "react";
import { BsChevronRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useProfileImage } from "../../context/profileImageContext";

const ProfileCard = ({ data = {} }) => {
  const { profileImage } = useProfileImage();
  const navigate = useNavigate();

  // Determine image to display
  const imageToDisplay =
    profileImage ||
    data?.profile_picture_url ||
    "/0684456b-aa2b-4631-86f7-93ceaf33303c.png";

  // Safe property access
  const username = data?.username || "Unnamed User";
  const headline = data?.headline || "No headline";
  const locationText = [data?.address?.city?.name, data?.address?.state?.name]
    .filter(Boolean)
    .join(", ");

  // Function to truncate text based on length
  const truncateText = (text, maxLength) =>
    text.length > maxLength ? text.slice(0, maxLength) + "…" : text;

  return (
    <div className="bg-glassy-card p-4 sm:p-5 rounded-xl shadow-md w-full">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 w-full">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <img
            src={imageToDisplay}
            key={imageToDisplay}
            alt="profile"
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border border-[rgba(255,255,255,0.1)]"
            onError={(e) => {
              e.currentTarget.onerror = null; // prevent infinite loop
              e.currentTarget.src = "/0684456b-aa2b-4631-86f7-93ceaf33303c.png"; // fallback to dummy
            }}
          />
        </div>

        {/* Profile Text */}
        <div className="flex-1 text-center sm:text-left space-y-1 min-w-0">
          <h3 className="glassy-text-primary text-sm sm:text-base font-semibold truncate">
            {truncateText(username, 20)}
          </h3>
          <p className="glassy-text-secondary text-xs sm:text-sm truncate">
            {truncateText(headline, 30)}
          </p>
          {locationText && (
            <p className="glassy-text-secondary text-xs sm:text-sm truncate">
              {truncateText(locationText, 25)}
            </p>
          )}
        </div>

        {/* Right Arrow */}
        <div className="flex-shrink-0 mt-2 sm:mt-0">
          <BsChevronRight
            className="glassy-text-secondary hover:glassy-text-primary cursor-pointer text-lg sm:text-xl"
            onClick={() => navigate(`/user/profile`)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
