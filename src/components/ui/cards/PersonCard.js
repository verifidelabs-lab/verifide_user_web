import { BsPersonFillAdd, BsPersonFillCheck } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";

const DEFAULT_AVATAR = "/0684456b-aa2b-4631-86f7-93ceaf33303c.png";

const PersonCard = ({
  person,
  handleConnect,
  handleConnectUser,
  isLoading,
  isConnected,
}) => {
  const {
    name,
    first_name,
    last_name,
    headline,
    logo_url,
    profile_picture_url,
    userConnection,
  } = person;

  const displayName = name || `${first_name || ""} ${last_name || ""}`;
  const displayImage =
    (logo_url && logo_url.trim()) ||
    (profile_picture_url && profile_picture_url.trim()) ||
    DEFAULT_AVATAR;

  const connectionActive = userConnection || isConnected;

  const buttonClasses = connectionActive
    ? "text-green-600 bg-green-100 hover:bg-green-200"
    : "text-blue-600 bg-[#2563EB1A] hover:bg-[#2564eb48]";

  return (
    <div className="flex items-center justify-between p-2 transition-colors hover:bg-gray-50">
      <div className="flex items-center space-x-3">
        <img
          src={displayImage}
          alt={displayName || "Company"}
          className="object-contain shadow lg:w-11 lg:h-11 md:w-10 md:h-10 border rounded-full cursor-pointer"
          onClick={() => handleConnect(person)}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_AVATAR;
          }}
        />

        <div className="break-all text-wrap">
          <h3
            className="font-medium lg:text-[16px] md:text-[14px] text-[12px] text-[#212121] capitalize cursor-pointer w-48"
            onClick={() => handleConnect(person)}
          >
            {displayName}
          </h3>
          <p className="lg:text-xs md:text-[10px] text-[11px] text-[#646464] w-44 break-words">
            {headline || "Not specified"}
          </p>
        </div>
      </div>

      <button
        className={`p-2 rounded-full flex items-center justify-center transition-colors ${buttonClasses}`}
        onClick={() => handleConnectUser(person)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ImSpinner2 className="animate-spin" size={20} />
        ) : connectionActive ? (
          <BsPersonFillCheck size={20} />
        ) : (
          <BsPersonFillAdd size={20} />
        )}
      </button>
    </div>
  );
};

export default PersonCard;
