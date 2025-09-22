// components/CategoryCard.tsx
import React from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { toast } from 'sonner';


const CategoryCard = ({ item, getIcon, statusInfo, onClick }) => {



    return (
        <div
            className="flex  items-start sm:items-center justify-between p-4 bg-white border border-[#C3D6FF] shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => {
                if (statusInfo.text === "Verified" && (['email','phone'].includes(item?.type))) {
                    toast.info("Already verified!")
                } else {
                    onClick(item);
                }
            }}
        >
            <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-gray-50">
                    {getIcon(item.type)}
                </div>
                <div>
                    <h3 className="font-medium text-[#000000E6] capitalize">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                        {item.count} Item{item.count !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>
            <div className="flex  flex-col items-end justify-center gap-1 mt-2 sm:mt-0">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                    {statusInfo.text}
                </span>
                <IoIosArrowForward className="text-lg" />
            </div>
        </div>
    );
};

export default CategoryCard;
