import React from 'react';
import { BsChevronRight } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useProfileImage } from '../../context/profileImageContext';

const ProfileCard = (data) => {
    const { profileImage } = useProfileImage();
    const imageToDisplay = profileImage || data?.data?.profile_picture_url || '';

    const navigate = useNavigate();



    return (
        <div className="w-full border-[#E8E8E8] border rounded-[10px] mx-auto bg-white shadow-sm overflow-hidden">
            <div className='flex justify-center items-center gap-5 p-2'>
                <div>
                    {imageToDisplay ? (
                        <img
                            src={imageToDisplay}
                            className='w-12 h-12 rounded-full object-fill'
                            alt='profile'
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg overflow-hidden font-semibold text-zinc-600">
                            <img src='/0684456b-aa2b-4631-86f7-93ceaf33303c.png' alt='dummy logo' />
                        </div>
                    )}
                </div>
                <div>
                    <h3 className='text-[#000000] text-base font-semibold'>
                        {`${data?.data?.username || ''} `}
                    </h3>
                    <p className='text-xs text-[#000000] font-medium'>{data?.data?.headline ? data?.data?.headline.split(" ").slice(0, 3).join(' ') : null}</p>
                    <p className='text-xs font-medium text-[#00000080]/50'>
                        {`${data?.data?.address?.city?.name ? `${data?.data?.address?.city?.name} ,` : ''}  ${data?.data?.address?.state?.name || ""}`}
                    </p>
                </div>
                <div>
                    <BsChevronRight
                        className='text-[#000000] cursor-pointer'
                        onClick={() => navigate(`/user/profile`)}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;