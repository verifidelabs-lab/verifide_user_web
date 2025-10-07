import React, { useEffect, useState } from 'react';
import { LuChevronRight } from "react-icons/lu";
import { useDispatch, useSelector } from 'react-redux';
import { termsAndConditions } from '../../redux/Users/userSlice';
import { FaChevronRight } from "react-icons/fa6";

// Static fallback data
const staticTermsData = {
    title: "Terms and Conditions",
    description: "Please read these terms and conditions carefully before using our service. By accessing or using the service, you agree to be bound by these terms.",
    tableOfContents: [
        {
            display_order: 1,
            title: "Acceptance of Terms",
            content: `<p>By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
            <p>We reserve the right to modify these terms at any time. Your continued use of the platform constitutes acceptance of those changes.</p>`
        },
        {
            display_order: 2,
            title: "Use of Service",
            content: `<p>You agree to use our service only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the service.</p>
            <p>Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our service.</p>`
        },
        {
            display_order: 3,
            title: "User Accounts",
            content: `<p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
            <p>You must notify us immediately of any unauthorized use of your account. We will not be liable for any loss or damage arising from your failure to comply with this security obligation.</p>`
        },
        {
            display_order: 4,
            title: "Privacy Policy",
            content: `<p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information.</p>
            <p>By using our service, you consent to the collection and use of information in accordance with our Privacy Policy.</p>`
        },
        {
            display_order: 5,
            title: "Intellectual Property",
            content: `<p>All content included on this service, such as text, graphics, logos, images, and software, is the property of our company or its content suppliers and is protected by international copyright laws.</p>
            <p>You may not reproduce, distribute, or create derivative works from our content without express written permission.</p>`
        },
        {
            display_order: 6,
            title: "Limitation of Liability",
            content: `<p>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>
            <p>This includes but is not limited to damages for loss of profits, goodwill, use, data, or other intangible losses.</p>`
        },
        {
            display_order: 7,
            title: "Termination",
            content: `<p>We may terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the terms.</p>
            <p>Upon termination, your right to use the service will immediately cease.</p>`
        },
        {
            display_order: 8,
            title: "Governing Law",
            content: `<p>These terms shall be governed and construed in accordance with the laws of our jurisdiction, without regard to its conflict of law provisions.</p>
            <p>Any disputes relating to these terms will be subject to the exclusive jurisdiction of the courts in our location.</p>`
        },
        {
            display_order: 9,
            title: "Contact Information",
            content: `<p>If you have any questions about these Terms and Conditions, please contact us through our support channels.</p>
            <p>We aim to respond to all inquiries within 48 hours during business days.</p>`
        }
    ]
};

const TermsAndConditions = () => {
    const dispatch = useDispatch();
    const selector = useSelector(state => state.user);
    const apiTermsData = selector?.termsAndConditionsData?.data?.data;
    const [activeSection, setActiveSection] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    // Use API data if available, otherwise use static data
    const termsData = apiTermsData.length > 0 && apiTermsData || staticTermsData;

    useEffect(() => {
        dispatch(termsAndConditions());
        // Simulate loading state
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, [dispatch]);

    const handleSectionClick = (order) => {
        setActiveSection(order);
        const element = document.getElementById(`section-${order}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (isLoading) {
        return (
            <div className='p-4 md:p-6 flex items-center justify-center min-h-screen'>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading terms and conditions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='p-4 md:p-6 bg-gray-50 min-h-screen'>

            {/* ✅ DESKTOP/TABLET VIEW */}
            <div className='hidden md:flex space-x-6 items-start   mx-auto'>
                {/* Sidebar Table of Contents */}
                <div className="w-80 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-6">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                        <h2 className="text-lg font-bold text-gray-900">TABLE OF CONTENTS</h2>
                    </div>
                    <ul className="space-y-1">
                        {termsData?.tableOfContents?.map((item, index) => {
                            const isActive = item?.display_order === activeSection;
                            const isPast = item?.display_order < activeSection;

                            return (
                                <li
                                    key={index}
                                    className={`
                                        text-sm font-medium capitalize rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-200
                                        ${isActive ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600' : ''}
                                        ${isPast ? 'text-gray-400' : 'text-gray-700'}
                                        ${!isActive && !isPast ? 'hover:bg-gray-50 hover:text-blue-600' : ''}
                                    `}
                                    onClick={() => handleSectionClick(item.display_order)}
                                >
                                    <span className="font-semibold">{item.display_order}.</span> {item.title}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Main Content */}
                <div className='flex-1 space-y-6'>
                    {/* Breadcrumb */}
                    <nav className='flex items-center space-x-2 text-sm'>
                        <span className='text-gray-600 font-medium'>Settings</span>
                        <LuChevronRight className="text-gray-400" size={16} />
                        <span className='text-blue-600 font-semibold'>Terms And Conditions</span>
                    </nav>

                    {/* Header Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-10 rounded-2xl shadow-lg">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-3xl font-bold mb-4">
                                {termsData?.title}
                            </h1>
                            <p className="text-blue-50 text-base leading-relaxed">
                                {termsData?.description}
                            </p>
                            <div className="mt-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <div className="space-y-10 max-w-4xl">
                            {termsData?.tableOfContents?.map((item, index) => (
                                <div
                                    key={index}
                                    id={`section-${item.display_order}`}
                                    className="scroll-mt-24 transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                                            {item.display_order}
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold text-gray-900 mb-3">
                                                {item.title}
                                            </h2>
                                            <div
                                                className="prose prose-sm text-gray-600 leading-relaxed space-y-3"
                                                dangerouslySetInnerHTML={{ __html: item.content }}
                                            />
                                        </div>
                                    </div>
                                    {index < termsData.tableOfContents.length - 1 && (
                                        <hr className="mt-8 border-gray-200" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                        <div className="flex gap-3">
                            <svg className="w-6 h-6 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <h3 className="font-semibold text-amber-900 mb-1">Important Notice</h3>
                                <p className="text-sm text-amber-800">
                                    By continuing to use our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ MOBILE VIEW */}
            <div className='block md:hidden'>
                {/* Breadcrumb */}
                <nav className='flex items-center space-x-2 mb-4 text-sm'>
                    <span className='text-gray-600 font-medium'>Settings</span>
                    <LuChevronRight className="text-gray-400" size={14} />
                    <span className='text-blue-600 font-semibold'>Terms & Conditions</span>
                </nav>

                {/* Header Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl mb-4 shadow-lg">
                    <h1 className="text-xl font-bold text-center mb-2">
                        {termsData?.title}
                    </h1>
                    <p className="text-sm text-blue-50 text-center leading-relaxed">
                        {termsData?.description}
                    </p>
                </div>

                {/* Accordion Style TOC & Content */}
                <div className="space-y-3">
                    {termsData?.tableOfContents?.map((item, index) => {
                        const isExpanded = activeSection === item.display_order;

                        return (
                            <div
                                key={index}
                                className={`
                                    border rounded-xl overflow-hidden transition-all duration-300
                                    ${isExpanded ? 'border-blue-300 shadow-md' : 'border-gray-200 shadow-sm'}
                                `}
                            >
                                <button
                                    onClick={() =>
                                        setActiveSection(isExpanded ? null : item.display_order)
                                    }
                                    className={`
                                        w-full text-left p-4 font-semibold text-sm flex items-center gap-3 transition-colors
                                        ${isExpanded ? 'bg-blue-50 text-blue-700' : 'bg-white text-gray-800'}
                                    `}
                                >
                                    <div className={`
                                        flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold
                                        ${isExpanded ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}
                                    `}>
                                        {item.display_order}
                                    </div>
                                    <span className="flex-1">{item.title}</span>
                                    <FaChevronRight
                                        className={`transition-transform duration-300 ${isExpanded ? 'rotate-90 text-blue-600' : 'text-gray-400'}`}
                                        size={14}
                                    />
                                </button>

                                <div className={`
                                    overflow-hidden transition-all duration-300
                                    ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
                                `}>
                                    <div className="p-4 text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">
                                        <div
                                            className="prose prose-sm"
                                            dangerouslySetInnerHTML={{ __html: item.content }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Mobile Footer Note */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
                    <div className="flex gap-3">
                        <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-amber-900 text-sm mb-1">Important Notice</h3>
                            <p className="text-xs text-amber-800 leading-relaxed">
                                By continuing to use our services, you acknowledge that you have read and agree to these Terms and Conditions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;