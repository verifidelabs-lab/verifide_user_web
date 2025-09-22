const UserCardSkeleton = () => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition relative animate-pulse">
      <div className="flex gap-4 items-center mb-4">
        <div className="w-14 h-14 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
      <div className="flex justify-between text-xs text-gray-500 bg-gray-50 rounded-lg p-2 mb-3">
        {[...Array(3)].map((_, i) => (
          <div className="text-center flex-1 space-y-1" key={i}>
            <div className="h-4 bg-gray-200 rounded w-8 mx-auto" />
            <div className="h-3 bg-gray-100 rounded w-12 mx-auto" />
          </div>
        ))}
      </div>
      <div className="h-9 bg-gray-200 rounded-md w-full" />
    </div>
  );
};


export default UserCardSkeleton