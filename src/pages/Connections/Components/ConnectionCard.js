import Button from "../../../components/ui/Button/Button";

const ConnectionsCard = ({ user, handleDisconnectUser, actionLoading, handleUserClick, DEFAULT_AVATAR }) => {
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
          <h3
            onClick={() => handleUserClick(user)}
            className="font-bold text-lg text-gray-900 cursor-pointer hover:text-blue-600 transition truncate"
          >
            {user.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">{user.title || "No headline"}</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-5 min-h-10">
        {user?.summary
          ? user.summary.split(" ").slice(0, 10).join(" ") + "..."
          : ""}
      </p>


      <div className="grid grid-cols-3 gap-2 text-sm text-gray-500 bg-gray-50 rounded-xl p-3 mb-5">
        <div className="text-center">
          <span className="font-semibold text-gray-800 text-base block">{user.followerCount}</span>
          <div className="mt-1">Followers</div>
        </div>
        <div className="text-center">
          <span className="font-semibold text-gray-800 text-base block">{user.connectionCount}</span>
          <div className="mt-1">Connections</div>
        </div>
        <div className="text-center">
          <span className="font-semibold text-gray-800 text-base block">{user.profileViews}</span>
          <div className="mt-1">Views</div>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full transition hover:text-white"
        onClick={() => handleDisconnectUser(user)}
        loading={actionLoading[`disconnect-${user.id}`]}
      >
        Disconnect
      </Button>
    </div>
  );
};

export default ConnectionsCard