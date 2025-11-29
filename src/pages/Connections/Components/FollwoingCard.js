import Button from "../../../components/ui/Button/Button";

const FollowingCard = ({
  user,
  handleUnfollow,
  actionLoading,
  handleUserClick,
  getEntityIcon,
  DEFAULT_AVATAR,
}) => {
  return (
    <div className="glassy-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={user.avatar || DEFAULT_AVATAR}
          alt={user.name}
          onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
          className="w-16 h-16 rounded-full object-cover border border-[var(--border-color)] cursor-pointer glassy-text-primary transition-transform duration-300"
          onClick={() => handleUserClick(user)}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {getEntityIcon(user.entityType)}
            <h3
              onClick={() => handleUserClick(user)}
              className="font-semibold text-base sm:text-lg glassy-text-primary cursor-pointer transition-colors truncate hover:underline underline-offset-2"
            >
              {user?.name}
            </h3>
          </div>
          <p className="text-sm glassy-text-secondary truncate">
            {user.headline || "No headline"}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center text-center mb-5">
        {user.targetModel && (
          <div className="text-sm font-medium glassy-text-primary glassy-card border border-[var(--border-color)] rounded-full px-4 py-1 mb-4 transition-all duration-300">
            {user.targetModel}
          </div>
        )}
      </div>

      {user.followerCount > 0 && (
        <div className="text-sm text-center glassy-card border border-[var(--border-color)] rounded-xl p-3 mb-5 transition-all duration-300">
          <span className="font-semibold glassy-text-primary">
            {user.followerCount}
          </span>{" "}
          <span className="glassy-text-secondary">followers</span>
        </div>
      )}

      <Button
        onClick={() => handleUnfollow(user)}
        loading={actionLoading[`unfollow-${user.id}`]}
        className="w-full glassy-button hover:glassy-text-primary transition-colors"
      >
        Unfollow
      </Button>
    </div>
  );
};

export default FollowingCard;
