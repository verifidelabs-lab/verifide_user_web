import React from "react";
import { SkillsCard2 } from "../../components/ui/cards/Card";
import { convertTimestampToDate } from "../../components/utils/globalFunction";

const LinkedInCertificate = ({
  certificateName,
  issueBy,
  date,
  skills = [],
  certificateUrlOrNumber,
  username = "",
}) => {
  return (
    <div className="relative w-full glassy-card rounded-xl overflow-hidden shadow-lg border">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <img
          src="/Frame 1000004906.png"
          alt="Watermark"
          className="w-32 sm:w-48 md:w-64 lg:w-72 h-auto object-contain"
        />
      </div>

      {/* Header */}
      <div className="glassy-card0 flex justify-center items-center px-4 sm:px-6 py-4 border-b relative z-10">
        <div className="flex items-center space-x-2">
          <img
            src="/Frame 1000004906.png"
            alt="logo"
            className=" "
          />
          <span className="glassy-text-primary text-lg sm:text-xl font-semibold">
            Learning
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 sm:px-6 md:px-10 py-6 sm:py-8 relative z-10 flex flex-col items-center">
        {/* Heading */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="glassy-text-primary text-lg sm:text-xl md:text-2xl font-semibold leading-relaxed break-words max-w-full">
            Verified {certificateName} <br /> Professional Certificate
          </h1>
          <p className="glassy-text-secondary mt-3 text-xs sm:text-sm md:text-base italic">
            This is to certify that{" "}
            <span className="font-semibold glassy-text-primary">
              {username}
            </span>{" "}
            completed the learning path.
          </p>
        </div>

        {/* Certificate Name */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="glassy-text-primary text-xl sm:text-2xl font-bold break-words max-w-full">
            {certificateName}
          </h2>
          <p className="glassy-text-secondary mt-2 text-xs sm:text-sm md:text-base">
            Issued by {issueBy}
          </p>
        </div>

        {/* Date */}
        <p className="glassy-text-primary text-sm sm:text-base md:text-lg font-medium mb-6">
          Awarded on {convertTimestampToDate(date)}
        </p>

        {/* Skills */}
        {skills?.length > 0 && (
          <div className="text-center mb-6 sm:mb-10">
            <h3 className="glassy-text-primary mb-2 text-sm sm:text-base font-semibold">
              Top Skills Covered
            </h3>

            <div className="flex justify-center flex-wrap gap-2">
              <SkillsCard2 skills={skills} limit={2} />
            </div>
          </div>
        )}

        {/* Footer */}
        {certificateUrlOrNumber && (
          <div className="text-center mt-4 border-t w-full border-gray-300 pt-4">
            <p className="glassy-text-secondary text-xs sm:text-sm md:text-base">
              Certificate ID:{" "}
              <span className="glassy-text-primary font-medium break-words">
                {certificateUrlOrNumber}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkedInCertificate;
