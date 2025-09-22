import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';

export const ImageCarousel = ({ images = [], currentIndex = 0, onIndexChange = () => { } }) => {
  const [errorIndices, setErrorIndices] = useState([]);

  const handleImageError = (index) => {
    if (!errorIndices.includes(index)) {
      setErrorIndices([...errorIndices, index]);
    }
  };

  // Default image when there are no images or all images have errors
  const defaultImage = 'https://cdn.dribbble.com/userupload/28010893/file/original-c0cfebb7aa78091b57661a6ae489b424.png?resize=1024x883&vertical=center';

  // Determine the current image
  const currentImage = errorIndices.includes(currentIndex) ? defaultImage : images[currentIndex];

  // Set up swipe handlers (no conditionals, always called)
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const nextIndex = (currentIndex + 1) % images.length;
      onIndexChange(nextIndex);
    },
    onSwipedRight: () => {
      const prevIndex = (currentIndex - 1 + images.length) % images.length;
      onIndexChange(prevIndex);
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  // If no images or all images have errors, show the default image
  if (images.length === 0 || errorIndices.length === images.length) {
    return (
      <div className="relative">
        <div className="overflow-hidden bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
          <img
            src={defaultImage}
            alt="Default content"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative" {...handlers}>
      <div className="overflow-hidden bg-gray-100 rounded-lg aspect-video">
        <img
          src={currentImage}
          alt="Post content"
          className="object-cover w-full h-full"
          onError={() => handleImageError(currentIndex)}
        />
      </div>
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => onIndexChange(index)}
              className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// import React from 'react';

// export const ImageCarousel = ({ images, currentIndex, onIndexChange }) => {
//   return (
//     <div className="relative">
//       <div className="overflow-hidden bg-gray-100 rounded-lg aspect-video">
//         <img
//           src={images[currentIndex]}
//           alt="Post content"
//           className="object-cover w-full"
//         />
//       </div>
//       {images.length > 1 && (
//         <div className="flex justify-center gap-2 mt-4">
//           {images.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => onIndexChange(index)}
//               className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };
