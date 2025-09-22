import { BiBookmark, } from "react-icons/bi";
import Button from "../../../../components/ui/Button/Button";
import { FcBookmark } from "react-icons/fc";

const ProviderIcon = ({ course, isPaid }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex justify-start items-center gap-2">
        {
          course?.organization_logo_url && (
            <img src={course?.organization_logo_url || "/Placeholder 2.png"} alt="logo"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/Placeholder 2.png";
              }}
              className="w-5 h-5 rounded-full"
            />
          )
        }
        <p className="text-[#000000E6] text-xs">{course?.organization_name}</p>
      </div>
      {isPaid && (
        <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
          Paid
        </span>
      )}
    </div>
  );
};

const CourseCard = ({ course, handleCourseDetails, onBookmarkToggle }) => {
  return (
    <div
      className="rounded-xl relative bg-white hover:shadow-lg transition-shadow duration-300 p-3 cursor-pointer group"

    >
      <div className=" w-full h-40 overflow-hidden rounded-4xl ">
        <img
          src={course?.thumbnail_url || '/Placeholder 4.png'}
          alt="course"
          onError={(e) => {
            e.target.style.background = 'linear-gradient(45deg, #f3f4f6, #e5e7eb)';
            e.target.src = '/logo.png';
          }}
          className="w-full h-full rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="pt-4 px-1 relative">
        <div className="flex items-center justify-between mb-2">
          <ProviderIcon isPaid={course?.is_paid} course={course} />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmarkToggle?.(course._id);
            }}
            className="text-gray-700 hover:text-blue-600 transition-colors text-xl"
          >
            {course?.isBookMarked ? <FcBookmark /> : <BiBookmark />}
          </button>
        </div>
        <h3 className="text-lg font-semibold text-[#000000] line-clamp-2 mb-1 min-h-14 max-h-10 overflow-hidden  flex flex-col">
          {course?.title?.split(' ').slice(0, 5).join(' ') + (course.title.split(' ').length > 8 ? '...' : '')}
          <p className="text-base text-[#000000] mb-2 capitalize">
            ( {course?.proficiency_level})
          </p>
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2 mb-2 ">
          {course?.description}
        </p>

        {course?.categories?.name && (
          <div className="mb-2 flex justify-between place-items-center">
            <span className="text-xs text-white bg-indigo-500 px-2 py-0.5 rounded-full">
              {course.categories.name}
            </span>

          </div>
        )}

        <div className="min-h-12">
          {course?.skills?.map((e) => {
            return (
              <>
                <span className="bg-gray-50 rounded-full px-2 py-0.5 border text-[10px] ">{e?.name}</span>
              </>
            )
          })}
        </div>

      </div>
      <div className="">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleCourseDetails(course)}
        >
          {course?.isResumed ? "Resume" : "Start Now"}
        </Button>

      </div>
    </div>
  );
};

export default CourseCard;
