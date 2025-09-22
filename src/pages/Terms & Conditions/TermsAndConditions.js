import React, { useEffect, useState } from 'react';
import { LuChevronRight } from "react-icons/lu";
import { useDispatch, useSelector } from 'react-redux';
import { termsAndConditions } from '../../redux/Users/userSlice';
import { FaChevronRight } from "react-icons/fa6";

const TermsAndConditions = () => {
    const dispatch = useDispatch();
    const selector = useSelector(state => state.user);
    const termsData = selector?.termsAndConditionsData?.data?.data;
    const [activeSection, setActiveSection] = useState(1); // Default to first section

    useEffect(() => {
        dispatch(termsAndConditions());
    }, [dispatch]);

    const handleSectionClick = (order) => {
        setActiveSection(order);
        const element = document.getElementById(`section-${order}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className='p-4 md:p-6'>

            {/* ✅ DESKTOP/TABLET VIEW */}
            <div className='hidden md:flex space-x-4 items-start'>
                {/* Sidebar Table of Contents */}
                <div className="w-80 bg-[#FAFAFA] border border-[#0000001A] rounded-[20px] p-4 min-h-80 sticky top-4">
                    <h2 className="text-lg font-bold mb-4">TABLE OF CONTENT</h2>
                    <ul className="space-y-2">
                        {termsData?.tableOfContents?.map((item, index) => {
                            let textColor = 'text-[#000000]';
                            if (item?.display_order < activeSection) {
                                textColor = 'text-gray-500';
                            } else if (item?.display_order === activeSection) {
                                textColor = 'text-blue-600 font-semibold';
                            }

                            return (
                                <li
                                    key={index}
                                    className={`text-base font-normal capitalize ${textColor} hover:text-blue-600 cursor-pointer`}
                                    onClick={() => handleSectionClick(item.display_order)}
                                >
                                    {item.display_order}. {item.title}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Main Content */}
                <div className='flex-1 space-y-6'>
                    <nav className='flex items-center space-x-2'>
                        <span className='font-semibold text-[14px]'>Settings</span>
                        <LuChevronRight />
                        <span className='text-[#2563EB] font-semibold text-[14px]'>Terms And Conditions</span>
                    </nav>

                    <div className="bg-blue-600 text-white p-8 rounded-lg">
                        <h1 className="text-2xl font-bold text-center mb-2">{termsData?.title || "Terms and Conditions"}</h1>
                        <p className="text-blue-100 text-center">
                            {termsData?.description || "The information provided here is for customers and users who have questions about our terms, policies, intellectual property, and compliance."}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="space-y-6">
                            {termsData?.tableOfContents?.map((item, index) => (
                                <div key={index} id={`section-${item.display_order}`} className="mb-6 scroll-mt-20">
                                    <h2 className="text-lg font-bold mb-2">
                                        {item.display_order}. {item.title}
                                    </h2>
                                    <div
                                        className="text-sm text-gray-600 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: item.content }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ MOBILE VIEW */}
            <div className='block md:hidden'>
                <nav className='flex items-center space-x-2 mb-4'>
                    <span className='font-semibold text-[14px]'>Settings</span>
                    <LuChevronRight />
                    <span className='text-[#2563EB] font-semibold text-[14px]'>Terms & Conditions</span>
                </nav>

                <div className="bg-blue-600 text-white p-4 rounded-lg mb-4">
                    <h1 className="text-xl font-bold text-center mb-1">
                        {termsData?.title || "Terms and Conditions"}
                    </h1>
                    <p className="text-sm text-blue-100 text-center">
                        {termsData?.description || "The information provided here is for customers and users who have questions about our terms, policies, intellectual property, and compliance."}
                    </p>
                </div>

                {/* Accordion Style TOC & Content */}
                <div className="space-y-4">
                    {termsData?.tableOfContents?.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg">
                            <button
                                onClick={() =>
                                    setActiveSection(activeSection === item.display_order ? null : item.display_order)
                                }
                                className="w-full text-left p-4 bg-gray-50 font-semibold text-sm text-gray-800 flex items-center"
                            >
                                <span>
                                    {item.display_order}. {item.title}
                                </span>
                                <FaChevronRight
                                    className={`ml-auto transition-transform duration-300 ${activeSection === item.display_order ? 'rotate-90' : ''
                                        }`}
                                />
                            </button>
                            {activeSection === item.display_order && (
                                <div className="p-4 text-sm text-gray-700">
                                    <div dangerouslySetInnerHTML={{ __html: item.content }} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;