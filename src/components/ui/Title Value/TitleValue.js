import React from 'react'

// import { FaStar } from 'react-icons/fa';

export const TitleValue = ({ title, desc }) => {
    return (
        <div>
            <h2 className='text-[#000000] text-2xl font-semibold'>{title}</h2>
            <p className='text-[#6B6B6B] text-base font-normal'>{desc}</p>
        </div>
    )
}




export const ProgressItem = ({ title, desc, icon, bg }) => {

    // const progressPercentage = (progress / maxProgress) * 100;

    return (
        <div className="mb-4 border border-[#00000033]/20 bg-[#FFFFFF] p-3 rounded-md" >
            <div className="flex items-center mb-1">
                {icon &&
                    <span className={`mr-2 text-gray-600 w-10 h-10 rounded-md flex justify-center items-center ${bg}`}>{icon}</span>
                }

                <div>
                    <div className='flex justify-start items-center'>
                        <span className="text-[#000000] font-medium text-lg ">{title}</span>
                    </div>
                    <span className="font-normal text-xs text-[#00000080]/50">{desc}</span>
                </div>
            </div>

        </div>
    );
};
