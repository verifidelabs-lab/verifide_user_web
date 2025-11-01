import { BsPersonCheckFill, BsPersonFillAdd } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";

const FollowButton = ({ isFollowing, isLoading, onClick }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border transition-all duration-200 ease-in-out
      ${isFollowing
        ? 'bg-green-100 text-green-700 border-green-600 hover:bg-green-200 hover:text-green-800'
        : 'glassy-card text-blue-700 border-blue-600 hover:bg-blue-200 hover:text-blue-800'
      }
      ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
    `}
  >
    {isLoading ? (
      <ImSpinner2 size={18} className="animate-spin" />
    ) : isFollowing ? (
      <BsPersonCheckFill size={18} className="transition-transform duration-150 group-hover:scale-110" />
    ) : (
      <BsPersonFillAdd size={18} className="transition-transform duration-150 group-hover:scale-110" />
    )}
    <span className="hidden sm:inline">
      {isLoading ? 'Processing...' : isFollowing ? 'Following' : 'Follow'}
    </span>
  </button>
);

export default FollowButton;
