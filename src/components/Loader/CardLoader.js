const SkeletonCard = () => {
  return (
    <div className="animate-pulse flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center space-x-4 w-full">
        <div className="bg-gray-200 h-10 w-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="h-6 w-20 bg-gray-200 rounded-full mt-4 sm:mt-0"></div>
    </div>
  );
};

export default SkeletonCard;


