import React from 'react'

const Badge = ({ src, alt }) => {
  return (
    <div className="xl:w-10 xl:h-10 md:w-7 md:h-7  w-8 h-8 overflow-hidden">
      <img
        src={src}
        alt={alt}
        className="object-cover w-full h-full"
        onError={(e) => {
          e.target.style.background = 'linear-gradient(45deg, #f3f4f6, #e5e7eb)';
          e.target.src = '';
        }}
      />
    </div>
  );
}

export default Badge;
