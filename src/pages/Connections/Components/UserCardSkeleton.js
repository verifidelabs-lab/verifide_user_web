const UserCardSkeleton = () => {
  return (
    <div className="bg-[var(--bg-card)] p-5 rounded-2xl shadow hover:shadow-lg transition relative animate-pulse glassy-card">
      {/* Header with avatar */}
      <div className="flex gap-4 items-center mb-4">
        <div className="w-14 h-14 rounded-full bg-[var(--bg-button-hover)]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[var(--bg-button-hover)] rounded w-3/4" />
          <div className="h-3 bg-[var(--bg-card)] rounded w-1/2" />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-[var(--bg-card)] rounded w-full" />
        <div className="h-3 bg-[var(--bg-card)] rounded w-5/6" />
        <div className="h-3 bg-[var(--bg-card)] rounded w-1/3" />
      </div>

      {/* Stats / badges */}
      <div className="flex justify-between text-xs text-[var(--text-secondary)] bg-[var(--bg-card)] rounded-lg p-2 mb-3">
        {[...Array(3)].map((_, i) => (
          <div className="text-center flex-1 space-y-1" key={i}>
            <div className="h-4 bg-[var(--bg-button-hover)] rounded w-8 mx-auto" />
            <div className="h-3 bg-[var(--bg-card)] rounded w-12 mx-auto" />
          </div>
        ))}
      </div>

      {/* Action button placeholder */}
      <div className="h-9 bg-[var(--bg-button-hover)] rounded-md w-full" />
    </div>

  );
};


export default UserCardSkeleton