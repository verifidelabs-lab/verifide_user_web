import React from 'react';
import { FaStar } from 'react-icons/fa';
import { CiUser } from "react-icons/ci";


const CourseCard = ({
    bannerImage,
    courseTitle,
    author,
    authorLink,
    description,
    rating,
    reviews,
    price,
    oldPrice,
    tags = [],
}) => {
    return (
        <div className="w-[256px] max-h-[342px] rounded-[14px] p-3 overflow-hidden glassy-card">
            <div className="relative ">
                <img src={bannerImage} alt={courseTitle} className=" mb-2 rounded-lg mx-auto" />
                <div className="absolute bottom-2 left-2 flex space-x-1">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="glassy-card/80 text-xs px-1.5 py-0.5 rounded font-medium text-gray-700"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="">
                <h3 className="text-[14px] glassy-text-primary font-semibold ">{courseTitle}</h3>
                <a href={authorLink} className="text-[12px] text-[#3DCBB1] font-normal flex items-center gap-1 mb-2">
                   <CiUser className='glassy-text-secondary text-md'/>
                    {author}
                </a>
                <p className="text-[#1B1B1BE5]/90 text-[12.6px] mb-2">{description}</p>
                <div className="flex items-center text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <FaStar key={i} size={16} fill={i < rating ? '#facc15' : 'none'} stroke="#facc15" />
                    ))}
                    <span className="glassy-text-secondary text-xs ml-2">({reviews})</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-[#1B1B1BE5]/90">${price}</span>
                    <span className="text-[#1B1B1B99]/60 text-sm font-normal line-through">${oldPrice}</span>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
