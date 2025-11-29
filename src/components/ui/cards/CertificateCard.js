import React, { useEffect, useRef, useState } from "react";
import { BiCopy } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "sonner";
import LinkedInCertificate from "../../../pages/Certificates/Certificates";

const CertificateCard = ({
  imageUrl,
  certificateName,
  issueBy,
  description,
  date,
  certificateUrlOrNumber,
  isAction = false,
  isDeleting,
  record,
  onEdit,
  onDelete,
  type,
  companyName,
  profileInfo,
  sharePost,
  instituteName,
}) => {
  const [showFullText, setShowFullText] = useState(false);
  const textRef = useRef(null);

  const isImage = (url) => {
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".bmp",
      ".svg",
    ];
    return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  const toggleText = () => setShowFullText(!showFullText);

  return (
    <div
      className="relative glassy-card w-full rounded-lg shadow-md border 
      p-3 sm:p-4 flex flex-col items-center
      transition-all duration-300 overflow-hidden"
    >
      {/* CERTIFICATE PREVIEW */}
      <div className="w-full rounded-lg overflow-hidden">
        {(record?.issuing_organization === "Verifide" ||
          issueBy === "Verifide") &&
        record?.is_verified ? (
          <div className="w-full h-64 sm:h-72 md:h-80 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <LinkedInCertificate
              certificateName={certificateName}
              issueBy={issueBy}
              date={date}
              skills={record?.skills_acquired}
              certificateUrlOrNumber={record?.credential_id}
              username={`${profileInfo?.personalInfo?.first_name || "User"} ${
                profileInfo?.personalInfo?.last_name || ""
              }`}
            />
          </div>
        ) : (
          <>
            {isImage(imageUrl) ? (
              <img
                src={imageUrl}
                alt="preview"
                className="w-full h-64 sm:h-72 md:h-80 object-contain"
              />
            ) : (
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(
                  imageUrl
                )}&embedded=true`}
                className="w-full h-80 border rounded"
                title="file-preview"
              />
            )}
          </>
        )}
      </div>

      {/* CERTIFICATE INFO */}
      <div className="w-full mt-3 flex flex-col space-y-2">
        <div className="flex justify-between items-start">
          <h2
            className="text-sm md:text-base font-semibold glassy-text-primary 
            break-words break-all max-w-full truncate"
          >
            {certificateName}
          </h2>
          <span className="text-xs md:text-sm glassy-text-secondary whitespace-nowrap">
            {date}
          </span>
        </div>

        {issueBy && (
          <p className="text-xs md:text-sm glassy-text-secondary">
            <span className="font-medium">Issued By:</span> {issueBy}
          </p>
        )}

        {companyName && (
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold glassy-text-primary">
              Company:
            </p>
            <p className="text-xs glassy-text-secondary break-words">
              {companyName}
            </p>
          </div>
        )}

        {instituteName && (
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold glassy-text-primary">
              Institute:
            </p>
            <p className="text-xs glassy-text-secondary break-words">
              {instituteName}
            </p>
          </div>
        )}

        {/* DESCRIPTION */}
        {description && (
          <div className="text-xs mt-2">
            <p
              ref={textRef}
              className={`glassy-text-secondary transition-all break-words break-all ${
                showFullText ? "line-clamp-none" : "line-clamp-1"
              }`}
            >
              <span className="font-medium">Description:</span> {description}
            </p>
            {description.split(" ").length > 10 && (
              <button
                className="text-blue-600 hover:underline text-xs"
                onClick={toggleText}
              >
                {showFullText ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        )}

        {/* COPY CREDENTIAL ID */}
        {certificateUrlOrNumber && (
          <button
            className="mt-3 w-full text-xs md:text-sm flex justify-between items-center 
              border border-gray-300 rounded-lg py-2 px-4 glassy-button"
            onClick={() => {
              navigator.clipboard
                ?.writeText(certificateUrlOrNumber)
                .then(() => toast.info("Copied !!"))
                .catch(() => toast.error("Failed to copy"));
            }}
          >
            <span className="truncate break-all">{certificateUrlOrNumber}</span>
            <BiCopy />
          </button>
        )}

        {/* ACTION BUTTONS */}
        {isAction && (
          <div className="h-12 overflow-hidden">
            {!["requested", "approved"].includes(record?.status) && (
              <>
                {!record?.is_verified ? (
                  <div className="flex justify-end items-center gap-2 py-2">
                    <button
                      onClick={() => onEdit(type, record)}
                      className={`flex items-center gap-1 ${
                        isDeleting
                          ? "text-blue-400"
                          : "text-blue-600 hover:text-blue-800 hover:scale-105"
                      }`}
                      disabled={isDeleting}
                    >
                      <span
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full 
                        flex items-center justify-center hover:glassy-card"
                      >
                        <FaRegEdit />
                      </span>
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(type, record._id)}
                      className={`flex items-center gap-1 ${
                        isDeleting
                          ? "text-red-400"
                          : "text-red-600 hover:text-red-800 hover:scale-105"
                      }`}
                      disabled={isDeleting}
                    >
                      <span
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full flex 
                        items-center justify-center"
                      >
                        <RiDeleteBin6Line />
                      </span>
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 flex justify-end">
                    <span
                      className="text-blue-700 font-semibold px-3 py-1 rounded-md 
                        hover:glassy-card cursor-pointer"
                      onClick={() => sharePost(record)}
                    >
                      ✨ Share your achievement
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateCard;
