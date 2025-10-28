const SkeletonCard = () => {
  return (
    <div className="animate-pulse flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 glassy-card border border-[var(--border-color)] rounded-lg shadow-sm">
      <div className="flex items-center space-x-4 w-full">
        <div className="bg-[var(--bg-card)] h-10 w-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[var(--bg-card-light)] rounded w-3/4"></div>
          <div className="h-3 bg-[var(--bg-card-light)] rounded w-1/2"></div>
        </div>
      </div>
      <div className="h-6 w-20 bg-[var(--bg-card-light)] rounded-full mt-4 sm:mt-0"></div>
    </div>

  );
};

export default SkeletonCard;


