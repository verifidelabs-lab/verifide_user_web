import Button from "../../../components/ui/Button/Button";

const ConnectionsCard = ({
  user,
  handleDisconnectUser,
  actionLoading,
  handleUserClick,
  DEFAULT_AVATAR,
  handleFollowerClick, // ✅ NEW: function to open follower modal
  handleConnectionClick, // ✅ NEW
  ShowFollowerClick = true, // ✅ NEW: prop to conditionally show follower click
}) => {
  return (
    <div className="glassy-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={user?.avatar || DEFAULT_AVATAR}
          alt={user?.name}
          onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
          className="w-16 h-16 rounded-full object-cover border border-[var(--border-color)] cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={() => handleUserClick(user)}
        />
        <div className="flex-1 min-w-0">
          <h3
            onClick={() => handleUserClick(user)}
            className="font-semibold text-base sm:text-lg glassy-text-primary cursor-pointer transition-colors truncate hover:underline underline-offset-2"
          >
            {user?.name}
          </h3>
          <p className="text-sm glassy-text-secondary truncate">
            {user?.title || "No headline"}
          </p>
        </div>
      </div>

      {/* {user?.summary && (
        <p className="text-sm glassy-text-secondary mb-5 min-h-[2.5rem]">
          {user?.summary.split(" ").slice(0, 12).join(" ")}...
        </p>
      )} */}
      {user?.summary && (
        <p className="text-sm glassy-text-secondary mb-4 h-[2.5rem] overflow-hidden text-ellipsis">
          {user?.summary.split(" ").slice(0, 12).join(" ")}...
        </p>
      )}

      {ShowFollowerClick && (
        <>
          <div className="grid grid-cols-3 gap-2 text-sm glassy-card border border-[var(--border-color)] rounded-xl p-3 mb-5 transition-all duration-300">
            <div
              className="text-center cursor-pointer hover:underline underline-offset-2"
              onClick={() => handleFollowerClick(user)}
            >
              <span className="font-semibold text-base glassy-text-primary block glassy-text-primary cursor-pointer transition-colors truncate hover:underline underline-offset-2">
                {user?.followerCount}
              </span>
              <span className="text-xs glassy-text-secondary">Followers</span>
            </div>
            <div
              className={`text-center ${
                user?.employee_count === "connection_count"
                  ? "cursor-pointer hover:underline underline-offset-2 transition-colors"
                  : ""
              }`}
              onClick={() => {
                if (user?.employee_count === "connection_count") {
                  handleConnectionClick(user); // only trigger for connections
                }
              }}
            >
              <span className="font-semibold text-base glassy-text-primary block truncate">
                {user?.connectionCount}
              </span>
              <span className="text-xs glassy-text-secondary">
                {user?.employee_count === "employee_count"
                  ? "Employees"
                  : "Connections"}
              </span>
            </div>
            <div className="text-center">
              <span className="font-semibold text-base glassy-text-primary block">
                {user?.profileViews}
              </span>
              <span className="text-xs glassy-text-secondary">Views</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full glassy-button hover:glassy-text-primary transition-colors"
            onClick={() => handleDisconnectUser(user)}
            loading={actionLoading[`disconnect-${user?.id}`]}
          >
            Disconnect
          </Button>
        </>
      )}
    </div>
  );
};

export default ConnectionsCard;
