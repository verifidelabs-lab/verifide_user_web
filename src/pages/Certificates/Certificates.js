import React from 'react';
import { SkillsCard2 } from '../../components/ui/cards/Card';
import { convertTimestampToDate } from '../../components/utils/globalFunction';

const LinkedInCertificate = ({
  certificateName,
  issueBy,
  date,
  skills = [],
  certificateUrlOrNumber,
  username = ''
}) => {
  return (
    <div className="max-w-4xl mx-auto glassy-card rounded-xl overflow-hidden shadow-lg border transition-all duration-300 glassy-card">

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <img
          src="/logo.png"
          alt="Watermark"
          className="w-40 sm:w-60 md:w-80 lg:w-96 h-auto object-contain"
        />
      </div>

      {/* Header */}
      <div className="bg-blue-500 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 flex justify-center items-center border-b border-gray-200 relative z-10">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="logo" className="w-8 h-8 sm:w-10 sm:h-10" />
          <span className="glassy-text-primary text-lg sm:text-xl md:text-2xl font-semibold">
            Learning
          </span>
        </div>
      </div>

      {/* Certificate Body */}
      <div className="px-4 sm:px-8 md:px-12 py-6 sm:py-8 md:py-10 relative z-10 flex flex-col items-center">

        {/* Certificate Heading */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h1 className="glassy-text-primary text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold leading-relaxed max-w-2xl mx-auto">
            Verified {certificateName} <br /> Professional Certificate
          </h1>
          <p className="glassy-text-secondary mt-3 text-xs sm:text-sm md:text-base italic">
            This is to certify that <span className="glassy-text-primary font-semibold">{username}</span> successfully completed the learning path.
          </p>
        </div>

        {/* Certificate Name */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h2 className="glassy-text-primary text-xl sm:text-xl md:text-xl lg:text-2xl font-bold leading-relaxed max-w-2xl mx-auto">
            {certificateName}
          </h2>
          <p className="glassy-text-secondary mt-2 text-xs sm:text-sm md:text-base">
            Issued by {issueBy}
          </p>
        </div>

        {/* Award Date */}
        <div className="text-center mb-6 sm:mb-8">
          <p className="glassy-text-primary text-sm sm:text-base md:text-lg font-medium">
            Awarded on {convertTimestampToDate(date)}
          </p>
        </div>

        {/* Skills */}
        {skills?.length > 0 && (
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h3 className="glassy-text-primary mb-3 sm:mb-4 text-sm sm:text-base md:text-lg font-semibold">
              Top Skills Covered
            </h3>
            <div className="flex justify-center flex-wrap gap-2 sm:gap-3">
              <SkillsCard2 skills={skills} limit={2} />
            </div>
          </div>
        )}

        {/* Certificate Footer */}
        {certificateUrlOrNumber && (
          <div className="text-center mt-6 sm:mt-8 md:mt-12 border-t border-gray-200 pt-4 sm:pt-5 md:pt-6">
            <p className="glassy-text-secondary text-xs sm:text-sm md:text-base tracking-wide">
              Certificate ID: <span className="glassy-text-primary font-medium">{certificateUrlOrNumber}</span>
            </p>
          </div>
        )}
      </div>
    </div>


  );
};

export default LinkedInCertificate;
