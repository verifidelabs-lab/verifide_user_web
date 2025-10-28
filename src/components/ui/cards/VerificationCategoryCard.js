// components/CategoryCard.tsx
import React from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { toast } from 'sonner';

const CategoryCard = ({ item, getIcon, statusInfo, onClick }) => {
    return (
        <div
            className="flex items-start sm:items-center justify-between p-4 glassy-card border border-[var(--border-color)] shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => {
                if (statusInfo.text === "Verified" && ['email', 'phone'].includes(item?.type)) {
                    toast.info("Already verified!");
                } else {
                    onClick(item);
                }
            }}
        >
            <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-[var(--bg-card-light)] flex justify-center items-center">
                    {getIcon(item.type)}
                </div>
                <div>
                    <h3 className="font-medium glassy-text-primary capitalize">{item.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                        {item.count} Item{item.count !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-end justify-center gap-1 mt-2 sm:mt-0">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusInfo.color} `}>
                    {statusInfo.text}
                </span>
                <IoIosArrowForward className="text-lg text-[var(--text-primary)]" />
            </div>
        </div>
    );
};

export default React.memo(CategoryCard);
