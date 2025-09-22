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
    <div className="max-w-4xl mx-auto  bg-gray-50">
      <div className="relative border border-gray-200 rounded-xl overflow-hidden bg-white"> 
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <img src="/logo.png" alt="Watermark" className="w-40 sm:w-60 md:w-80 lg:w-96 h-auto object-contain" />
        </div> 
        <div className="bg-blue-400 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 flex justify-center border-b border-gray-200 relative z-10">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="logo" className="2" />
            <span className="text-white text-lg sm:text-xl md:text-2xl font-semibold">Learning</span>
          </div>
        </div> 
        <div className="px-4 sm:px-8 md:px-12 py-6 sm:py-8 md:py-10 relative z-10">
 
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h1 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold text-gray-800 leading-relaxed max-w-2xl mx-auto">
              Verifide {certificateName} <br /> Professional Certificate
            </h1>
            <p className="mt-3 text-gray-600 text-xs sm:text-sm md:text-base italic">
              This is to certify that <span className="font-semibold text-gray-900">{username}</span>
              successfully completed the learning path.
            </p>
          </div>

          {/* Certificate Name */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-xl sm:text-xl md:text-xl lg:text-2xl font-bold text-blue-700 leading-relaxed max-w-2xl mx-auto">
              {certificateName}
            </h2>
            <p className="mt-2 text-gray-500 text-xs sm:text-sm md:text-base">Issued by {issueBy}</p>
          </div>

          {/* Date */}
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-gray-700 text-sm sm:text-base md:text-lg font-medium">
              Awarded on {convertTimestampToDate(date)}
            </p>
          </div>

          {/* Skills */}
          {skills?.length > 0 && (
            <div className="text-center mb-6 sm:mb-8 md:mb-10">
              <h3 className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base md:text-lg font-semibold">Top Skills Covered</h3>
              <div className="flex justify-center flex-wrap gap-2 sm:gap-3">
                <SkillsCard2 skills={skills} limit={2} />
              </div>
            </div>
          )}

          {/* Footer */}
          {certificateUrlOrNumber && (
            <div className="text-center mt-6 sm:mt-8 md:mt-12 border-t pt-4 sm:pt-5 md:pt-6">
              <p className="text-xs sm:text-sm md:text-base text-gray-600 tracking-wide">
                Certificate ID: <span className="font-medium text-gray-800">{certificateUrlOrNumber}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkedInCertificate;
