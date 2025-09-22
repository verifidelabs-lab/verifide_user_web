import Button from "../../../components/ui/Button/Button";

const FollowingCard = ({ user, handleUnfollow, actionLoading, handleUserClick, getEntityIcon,DEFAULT_AVATAR }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={user.avatar || DEFAULT_AVATAR}
          alt={user.name}
          onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform"
          onClick={() => handleUserClick(user)}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {getEntityIcon(user.entityType)}
            <h3
              onClick={() => handleUserClick(user)}
              className="font-bold text-lg text-gray-900 cursor-pointer hover:text-blue-600 transition truncate"
            >
              {user.name}
            </h3>
          </div>
          <p className="text-sm text-gray-500 truncate">{user.headline || "No headline"}</p>
        </div>
      </div>

      <div className="flex flex-col items-center text-center mb-5">
        <div className="text-sm font-semibold text-gray-600 bg-gray-100 rounded-full px-4 py-1 mb-4">
          {user.targetModel}
        </div>
      </div>

      {user.followerCount > 0 && (
        <div className="text-sm text-gray-500 bg-gray-100 rounded-lg p-3 mb-5 text-center">
          <span className="font-semibold text-gray-700">{user.followerCount}</span> followers
        </div>
      )}

      <Button
        // variant=""
        onClick={() => handleUnfollow(user)}
        loading={actionLoading[`unfollow-${user.id}`]}
        className="w-full"
      >
        Unfollow
      </Button>
    </div>
  );
};

export default FollowingCard