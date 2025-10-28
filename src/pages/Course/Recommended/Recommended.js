import React, { useEffect, useState } from 'react'
import { BiSearchAlt } from 'react-icons/bi';
// import FilterButton from '../../../components/ui/Button/FilterButton';
import CourseCard from './components/CoueseCard';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addBookmarked, userCourseList } from '../../../redux/course/courseSlice';
import NoDataFound from '../../../components/ui/No Data/NoDataFound';
import { toast } from 'sonner';
// import { RiExternalLinkFill } from 'react-icons/ri';
import Pagination from '../../../components/Pagination/Pagination';
// import { FaBookmark, FaShoppingCart, FaStar, FaThLarge } from 'react-icons/fa';
import { CiBookmarkCheck, CiSquareChevUp } from 'react-icons/ci';
import { LuBriefcaseBusiness } from 'react-icons/lu';
import { BsDisplay } from 'react-icons/bs';
import { getAllCourseCategory } from '../../../redux/Global Slice/cscSlice';
import { arrayTransform } from '../../../components/utils/globalFunction';
import FilterSelect2 from '../../../components/ui/Input/FilterSelect2';

const Recommended = () => {
  const dispatch = useDispatch()
  const selector = useSelector(state => state.course)
  const globalSelector = useSelector(state => state.global)
  // console.log(globalSelector?.getAllCourseCategoryData?.data?.data?.list)
  const [courses, setCourses] = useState();
  const navigate = useNavigate();
  let { userCourseListData } = selector ? selector : {}
  const [activeSection, setActiveSection] = useState("Recommendation");
  const [pageNo, setPageNo] = useState(1)
  const tab = ["Recommendation", "Bookmarked", "Purchased", "All"]
  const tabIcons = {
    All: <LuBriefcaseBusiness size={18} />,
    Recommendation: <CiSquareChevUp size={18} />,
    Bookmarked: <CiBookmarkCheck size={18} />,
    Purchased: <BsDisplay size={18} />,
  };
  const [keyWord, setKeyWord] = useState("")
  const coursecategoryList = [{ value: "", label: "All" }, ...arrayTransform(globalSelector?.getAllCourseCategoryData?.data?.data?.list)]
  const [selectedOption, setSelectedOptions] = useState('')

  useEffect(() => {
    setCourses(() => userCourseListData?.data?.data?.list)
  }, [userCourseListData?.data?.data?.list])

  useEffect(() => {
    dispatch(userCourseList(
      {
        "type": activeSection,
        // "category_id": "",
        "page": pageNo,
        "size": 10,
        "keyWord": keyWord || "",
        "category_id": selectedOption
      }
    ))
    dispatch(getAllCourseCategory({ select: "_id name" }))
  }, [activeSection, dispatch, pageNo, keyWord, selectedOption])

  const handleBookmark = async (courseId) => {
    try {
      const res = await dispatch(addBookmarked({ course_id: courseId })).unwrap()
      setCourses(courses.map(course =>
        course._id === courseId
          ? { ...course, isBookMarked: !course.isBookMarked }
          : course
      ));
      toast.success(res?.message)
    } catch (error) {
      toast.error(error)
    }
  };

  const handleCourseDetails = (data) => {
    navigate(`/user/course/course-details/${data?._id}`)
  }

  const handleSectionClick = (order) => {
    setActiveSection(order);
    setSelectedOptions("")
  };

  const onPageChange = (newPage) => {
    setPageNo(newPage)
  }

  return (
    <div className=" flex flex-col md:flex-row justify-between gap-3   h-[90vh] p-2 overflow-hidden">

      <div className="md:hidden md:mb-4">
        <div className="flex justify-between border-b border-gray-200 ">
          {tab?.map((item, index) => {
            const isActive = item === activeSection;
            return (
              <button
                key={index}
                className={`py-2 px-4 text-sm font-medium ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'glassy-text-secondary hover:text-gray-700'}`}
                onClick={() => handleSectionClick(item)}
              >
                {item}
              </button>
            )
          })}
        </div>
      </div>

      <div className="hidden md:block xl:w-[15%] lg:w-[20%] md:w-[25%]   ">
        <div className="glassy-card h-full rounded-lg flex justify-around pt-5">
          <div className="sticky top-4">
            <ul className="space-y-2">
              {tab?.map((item, index) => {
                let textColor = 'glassy-text-primary'
                if (item < activeSection) {
                  textColor = 'glassy-text-secondary'
                } else if (item === activeSection) {
                  textColor = 'text-blue-600  bg-[#2563EB1A]/10 text-[#2563EB]  rounded';
                }

                return (
                  <li
                    key={index}
                    className={`xl:text-base lg:text-sm md:text-sm font-normal p-2 xl:w-52  lg:w-40 md:w-40  flex justify-start items-center gap-2 capitalize ${textColor} ${activeSection ? " " : ""} hover:text-blue-600 cursor-pointer`}
                    onClick={() => handleSectionClick(item)}
                  >
                    {tabIcons[item]}
                    {item}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full flex-1 p-1 md:p-6 mx-auto h-screen custom-scrollbar overflow-hidden overflow-y-auto">
        <div className="mb-8">
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span>Course</span>
            <span>›</span>
            <span className="text-[#2563EB] font-semibold">{activeSection}</span>
          </div>

          <div className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-4">
            <h1 className="text-xl md:text-2xl font-semibold glassy-text-primary">{activeSection} Courses</h1>
            <div className="flex items-end gap-2 md:gap-4 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <BiSearchAlt className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={keyWord}
                  onChange={(e) => setKeyWord(e.target.value)}
                  className="pl-10 pr-4 py-1.5 glassy-input-notification border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>

              <FilterSelect2
                key={activeSection}
                options={coursecategoryList || []}
                label="Course category"
                onChange={(select) => setSelectedOptions(select?.value || "")}
                value={coursecategoryList?.find(opt => opt.value === selectedOption) || coursecategoryList[0]}
                labelClassName="hidden md:block"
              />

              {/* 
              <button className="hidden md:block bg-blue-600 glassy-text-primary px-4 py-2 rounded-md hover:bg-blue-700">
                View All
              </button> */}
              {/* <button className="text-blue-600 md:hidden block border border-gray-300 rounded-lg hover:bg-gray-50 p-2">
                <RiExternalLinkFill size={20} />
              </button> */}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 "
        >
          {Array.isArray(courses) && courses.length > 0 ? courses?.map((course, index) => (
            <div
              key={course._id}
              className="animate-floatIn"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <CourseCard
                key={course.id}
                course={course}
                onBookmarkToggle={handleBookmark}
                handleCourseDetails={handleCourseDetails}
              />
            </div>
          )) : <NoDataFound />}
        </div>
        <div>
          {
            userCourseListData?.data?.data?.total > 8 && (
              <Pagination
                totalPages={Math.ceil(userCourseListData?.data?.data?.total / 8)}
                currentPage={pageNo}
                onPageChange={onPageChange}
              />
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Recommended