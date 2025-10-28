import React from 'react'
import { BiBook, BiBookAdd, BiCalendar, BiChevronUp, } from 'react-icons/bi'
import Button from '../../components/ui/Button/Button'
import { SkillsCard } from '../../components/ui/cards/Card'
import { HiOutlineCheck } from 'react-icons/hi2'

const ActivityList = () => {
    return (
        <div>
            <div className="md:p-4 p-2 ">

                <nav className="flex justify-start items-center gap-2 mb-2 text-sm">
                    <span className="text-gray-600">Home</span>
                    <span className="text-gray-400">›</span>
                    <span className="font-medium text-blue-600">Activity</span>
                </nav>
                <div>
                    <div className="w-full mx-auto p-6 glassy-card rounded-xl border">
                        <div className="mb-8">
                            <h1 className="text-[28px] font-bold glassy-text-primary mb-3">Project Management</h1>
                            <p className="text-[#6B6B6B] text-[18px]">
                                Learn how to confidently develop custom & profitable Responsive WordPress Themes and Websites with no prior experience.
                            </p>
                        </div>

                        <div className="flex items-center justify-between mb-8 relative">
                            <div className="absolute top-9 left-6 right-0 h-0.5 bg-gray-200">
                                <div className="h-full glassy-text-primary w-1/4"></div>
                            </div>
                            <div className="flex flex-col items-center relative z-10">
                                <div className="text-center">
                                    <div className="text-base font-medium text-[#6B6B6B]">15 Courses</div>
                                </div>
                                <div className="w-6 h-6 glassy-text-primary rounded-full flex items-center justify-center mb-2">
                                    <HiOutlineCheck className='glassy-text-primary' />
                                </div>
                            </div>

                            <div className="flex flex-col items-center relative z-10">
                                <div className="text-center">
                                    <div className="text-base font-medium text-[#6B6B6B]">20 Assessment</div>
                                </div>
                                <div className="w-6 h-6 glassy-text-primary rounded-full flex items-center justify-center mb-2">
                                    <HiOutlineCheck className='glassy-text-primary' />

                                </div>
                            </div>
                            <div className="flex flex-col items-center relative z-10">
                                <div className="text-center">
                                    <div className="text-base font-medium text-[#6B6B6B]">05 Project</div>
                                </div>
                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mb-2">

                                </div>
                            </div>
                            <div className="flex flex-col items-center relative z-10">
                                <div className="text-center">
                                    <div className="text-base font-medium text-[#6B6B6B]">01 Internship</div>
                                </div>
                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mb-2">

                                </div>
                            </div>
                            <div className="flex flex-col items-center relative z-10">
                                <div className="text-center">
                                    <div className="text-base font-medium text-[#6B6B6B]">Job/Opportunity</div>
                                </div>
                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mb-2">

                                </div>
                            </div>
                            <div className="flex flex-col items-center relative z-10">
                                <div className="text-center">
                                    <div className="text-base font-medium text-[#6B6B6B]">30 Days</div>
                                </div>
                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mb-2">

                                </div>
                            </div>
                        </div>
                        <div className="mb-8">
                            <SkillsCard title={`Skills`} limit={7}
                                skills={[
                                    { name: 'Communication ', rating: null },
                                    { name: 'Relationship ', rating: null },
                                    { name: 'Leadership', rating: 5 },
                                    { name: 'Leadership', rating: 5 },
                                    { name: 'Leadership', rating: 5 },
                                    { name: 'Leadership', rating: 5 },{ name: 'Leadership', rating: 5 },{ name: 'Leadership', rating: 5 },

                                ]}
                            />
                        </div>
                    </div>

                    <div className="">
                        <h2 className="text-2xl font-medium glassy-text-primary py-4">Running Activities</h2>

                        <div className="glassy-card rounded-lg border border-gray-200  relative">

                            <div className='glassy-card p-3 border-b'>
                                <button className="absolute top-6 right-6 p-1 hover:bg-gray-100 rounded">
                                    <BiChevronUp className="w-5 h-5 text-gray-400" />
                                </button>

                                <div className="flex items-start gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs b text-gray-600 px-2 py-1 rounded  font-medium">
                                            COURSE
                                        </span>
                                        <span className="text-xs bg-[#EAF1FF] text-[#6B6B6B] px-2 py-1 rounded-full  font-medium">
                                            Beginner
                                        </span>
                                    </div>

                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center glassy-text-primary font-bold">
                                            1
                                        </div>
                                        <h3 className="text-[20px] font-semibold glassy-text-primary">UI/UX Design for Beginners</h3>
                                    </div>
                                    <p className="text-gray-600 ml-11">
                                        Learn how to confidently develop custom & profitable Responsive WordPress Themes and Websites with no prior experience.
                                    </p>
                                </div>

                                <div className="flex items-center gap-6 mb-6 ml-11 text-sm glassy-text-secondary">
                                    <div className="flex items-center gap-1">
                                        <BiBookAdd className="w-4 h-4" />
                                        <span>Number of Chapters: 3</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <BiCalendar className="w-4 h-4" />
                                        <span>30 Days</span>
                                    </div>
                                </div>

                            </div>

                            <div className=" bg-[#F9FBFF] pl-12">
                                <h4 className="text-sm font-medium text-gray-700 my-3 uppercase tracking-wide">CHAPTERS:</h4>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3 p-2  ">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <BiBook className="w-4 h-4 glassy-text-primary" />
                                        </div>
                                        <span className="font-medium text-[18px] glassy-text-primary">Introduction to UI/UX</span>
                                    </div>

                                    <div className="flex items-center gap-3 p-2 ">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <BiBook className="w-4 h-4 glassy-text-primary" />
                                        </div>
                                        <span className="font-medium text-[18px] glassy-text-primary">Design Thinking Process</span>
                                    </div>

                                    <div className="flex items-center gap-3 p-2 ">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <BiBook className="w-4 h-4 glassy-text-primary" />
                                        </div>
                                        <span className="font-medium text-[18px] glassy-text-primary">Wireframing Basics</span>
                                    </div>
                                </div>
                                <div className='flex justify-end p-2'>
                                    <Button variant='outline'>Start Now</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ActivityList