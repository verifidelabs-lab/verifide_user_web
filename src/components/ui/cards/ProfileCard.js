import React from 'react';
import { BsChevronRight } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useProfileImage } from '../../context/profileImageContext';

const ProfileCard = ({ data }) => {
  const { profileImage } = useProfileImage();
  const imageToDisplay = profileImage || data?.profile_picture_url || '';
  const navigate = useNavigate();

  return (
    <div className="bg-glassy-card space-y-3 p-4">
      <div className="flex flex-col md:flex-row items-center w-full mx-auto gap-4">
        {/* Profile Image */}
        <div>
          {imageToDisplay ? (
            <img
              src={imageToDisplay}
              className="w-12 h-12 rounded-full object-cover border border-[rgba(255,255,255,0.1)]"
              alt="profile"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
              <img
                src="/0684456b-aa2b-4631-86f7-93ceaf33303c.png"
                alt="dummy logo"
                className="w-8 h-8 object-contain opacity-70"
              />
            </div>
          )}
        </div>

        {/* Profile Text */}
        <div className="flex-1 space-y-1">
          <h3 className="glassy-text-primary text-base font-semibold">
            {data?.username || 'Unnamed User'}
          </h3>
          <p className="glassy-text-secondary text-sm">
            {data?.headline ? data?.headline.split(' ').slice(0, 3).join(' ') : 'No headline'}
          </p>
          <p className="glassy-text-secondary/50 text-xs">
            {`${data?.address?.city?.name ? `${data?.address?.city?.name}, ` : ''}${data?.address?.state?.name || ''}`}
          </p>
        </div>

        {/* Right Arrow */}
        <div>
          <BsChevronRight
            className="text-gray-400 hover:glassy-text-primary cursor-pointer"
            onClick={() => navigate(`/user/profile`)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
