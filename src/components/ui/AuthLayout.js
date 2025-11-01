import React, { useState } from "react";




const AuthLayout = ({ children }) => {
  const [activeSlide, ] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setActiveSlide(prev => (prev + 1) % 2);
  //   }, 10000);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="relative grid grid-cols-3 h-screen overflow-hidden">
      {activeSlide === 0 ? (
        <div className="flex justify-start items-center  gradient-background col-span-2">
          {/* <div className="flex flex-col items-center justify-center">
            <CourseCard {...cardData[0]} />
          </div>
          <div className="flex flex-col items-center justify-center gap-8">
            <CourseCard {...cardData[1]} />
            <CourseCard {...cardData[2]} />
          </div>
          <div className="flex items-center justify-center">
            <CourseCard {...cardData[3]} />
          </div> */}
        </div>) : (
        <div className="grid grid-cols-3 gap-4 p-6">
          {/* <CourseCard {...cardData[0]} />
          <div className="flex flex-col items-center justify-center gap-8">
            <CourseCard {...cardData[1]} />
            <CourseCard {...cardData[2]} />
          </div>
          <div className="flex items-center justify-center">
            <CourseCard {...cardData[3]} />
          </div> */}
        </div>
      )}
      {children}
      {/* <div className="absolute bottom-0 left-[calc(50%-100px)] w-[200px]">
        <button className="flex items-center justify-center w-full gap-2 px-6 py-3 text-sm font-medium glassy-text-primary transition-colors glassy-card rounded-full hover:glassy-card">
          Choose Goals
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((dot, i) => (
            <div
              key={i}
              onClick={() => setActiveSlide(i === 0 ? 0 : 1)}
              className={`w-3 h-3 rounded-full cursor-pointer ${activeSlide === (i === 0 ? 0 : 1) ? "bg-blue-600" : "glassy-card"
                }`}
            ></div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default React.memo(AuthLayout);
