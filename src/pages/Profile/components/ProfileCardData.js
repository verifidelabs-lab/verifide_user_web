import React, { useState, useRef, useCallback } from 'react';
import { BsPencil } from 'react-icons/bs';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { toast } from 'sonner';
import { generateResumePDF, uploadImageDirectly } from '../../../components/utils/globalFunction';
import { useDispatch } from 'react-redux';
import { getProfile, updateProfileImage, updateProfileImageLocally } from '../../../redux/slices/authSlice';
import { useProfileImage } from '../../../components/context/profileImageContext';
import OpenToWorkSelect from '../../../components/ui/Button/ButtonWithIcon';
import Button from '../../../components/ui/Button/Button';
import { BiDownload } from 'react-icons/bi';
import { viewUserProfile } from '../../../redux/Users/userSlice';
import ResumeViewSelection from './ResumeViewSelection';

const ProfileCardData = ({ data, frameStatus, handleSelection }) => {
  const { setProfileImage } = useProfileImage();
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const cropperRef = useRef(null);
  const [openResumeSelection, setOpenResumeSelection] = useState(false);


  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    // if (file.size > 5 * 1024 * 1024) {
    //   toast.error('File size must be less than 5MB');
    //   return;
    // }

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only image files (JPEG, PNG,JPG) are allowed');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setShowCropper(true);
    };
    reader.onerror = () => {
      toast.error('Failed to read file');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleCrop = useCallback(async () => {
    if (!cropperRef.current) return;

    setIsLoading(true);
    try {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas({
        width: 300,
        height: 300,
        fillColor: '#fff',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });

      if (!croppedCanvas) {
        throw new Error('Cropping failed');
      }

      croppedCanvas.toBlob(async (blob) => {
        try {
          const result = await uploadImageDirectly(blob, "PROFILES");

          if (result?.data?.imageURL) {
            setCroppedImage(result.data.imageURL);
            dispatch(updateProfileImageLocally(result.data.imageURL));
            setProfileImage(result.data.imageURL);
            dispatch(updateProfileImage({ profile_picture_url: result.data.imageURL }));
            dispatch(getProfile());
            toast.success('Profile image updated successfully');
          } else {
            throw new Error('Upload failed');
          }
        } catch (error) {
          toast.error(error || 'Failed to upload image');
        } finally {
          setIsLoading(false);
          setShowCropper(false);
        }
      }, 'image/jpeg', 0.92);
    } catch (error) {
      toast.error('Failed to crop image');
      setIsLoading(false);
    }
  }, [dispatch]);

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const frameStatusOptions = [
    'open_for_job',
    'open_for_internship',
    'open_for_project',
    // 'none',
  ];


  return (
    <div className="flex justify-start items-start  gap-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png"
        style={{ display: 'none' }}
      />

      {showCropper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center glassy-card bg-opacity-50">
          <div className="glassy-card p-4 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Crop Profile Image</h2>
            <div className="mb-4" style={{ height: '400px' }}>
              <Cropper
                src={image}
                style={{ height: '100%', width: '100%' }}
                initialAspectRatio={1}
                guides={true}
                ref={cropperRef}
                viewMode={1}
                minCropBoxHeight={100}
                minCropBoxWidth={100}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCropper(false)}
                className="px-4 py-2 border border-gray-300 rounded-md"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleCrop}
                className="px-4 py-2 glassy-card0 glassy-text-primary rounded-md flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 glassy-text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Crop & Save'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative group justify-start items-start flex-shrink-0 xl:w-[120px] xl:h-[120px] lg:w-24 lg:h-24 md:w-20 md:h-20 border overflow-hidden glassy-card rounded-2xl cursor-pointer" onClick={handleProfileClick}>
        <div className="w-full h-full">
          {imageError || !data?.personalInfo?.profile_picture_url ? (
            <div className="object-cover md:w-full md:h-full w-[100px] h-[100px] md:rounded-md rounded-full flex items-center justify-center glassy-card">
              <span className="text-2xl font-bold glassy-text-secondary">
                <img src='/0684456b-aa2b-4631-86f7-93ceaf33303c.png' alt='dummy logo' />
              </span>
            </div>
          ) : (
            <img
              src={croppedImage || data?.personalInfo?.profile_picture_url || '/0684456b-aa2b-4631-86f7-93ceaf33303c.png'}
              alt="Profile"
              onError={handleImageError}
              className="object-cover md:w-full md:h-full w-[100px] h-[100px] md:rounded-md rounded-full"
            />
          )}
        </div>
        <div className="absolute inset-0 glassy-card bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <BsPencil className="glassy-text-primary text-lg" />
        </div>
      </div>



      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          {/* <img src="/Img/GroupMain.png" alt="group" /> */}
          {
            data?.personalInfo?.first_name && (

              <h1 className="xl:text-[20px] lg:text-[18px] md:text-[16px] font-bold glassy-text-primary">
                {`${data?.personalInfo?.first_name || ''} ${data?.personalInfo?.last_name || ''}`}
              </h1>
            )
          }
          {
            data?.personalInfo?.is_verified && (

              <div className="flex items-center justify-center w-5 h-5 rounded-full">
                <img src='/image (2).png' alt='approved' className='t' />
              </div>
            )
          }
        </div>
        {
          data?.personalInfo?.headline && (

            <p className="mt-1 md:text-[16px] font-medium glassy-text-primary">
              {data?.personalInfo?.headline || "Management Executive at Zara"}
            </p>
          )
        }
        {
          data?.personalInfo?.address?.city?.name && (

            <p className="text-xs font-medium text-[#00000080]/50 ">
              {data?.personalInfo?.address?.city?.name || "N/A"},{" "}
              {data?.personalInfo?.address?.state?.name || "N/A"}
            </p>
          )
        }

        <div className="flex items-center mt-2.5 space-x-3">
          <OpenToWorkSelect options={frameStatusOptions} value={frameStatus} onSelect={handleSelection} />
          <Button icon={<BiDownload />}   size='sm'
            className="text-sm text-primary"
            // tooltip={`Create Resume / profile`}
            onClick={() => {
              // handleResumeDownload();
              setOpenResumeSelection(true);
            }}
          >Resume</Button>
        </div>
      </div>
      <ResumeViewSelection isOpen={openResumeSelection} onClose={() => setOpenResumeSelection(false)} title={"Select Your Preview"} userData={{ userId: data._id, username: data.personalInfo.username }} />
    </div>
  );
};

export default ProfileCardData;