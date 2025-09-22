import { createContext, useState, useContext } from 'react';

const ProfileImageContext = createContext();

const ProfileImageProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(null);

  return (
    <ProfileImageContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </ProfileImageContext.Provider>
  );
};
export default ProfileImageProvider;

export const useProfileImage = () => useContext(ProfileImageContext);