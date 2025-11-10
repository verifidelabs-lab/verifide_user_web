import React, { useEffect, useRef, useState } from 'react'
import { BiCopy } from 'react-icons/bi';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { toast } from 'sonner';
import LinkedInCertificate from '../../../pages/Certificates/Certificates';
// import Button from '../Button/Button';
// import LinkedInCertificate from './LinkedInCertificate';

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
    profileInfo, sharePost, instituteName
}) => {

    // const [ setIsTruncated] = useState(false);
    const [showFullText, setShowFullText] = useState(false);
    const textRef = useRef(null);
    let maxLines = 1;



    const isImage = (url) => {
        const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"];
        return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
    };


    useEffect(() => {
        if (textRef.current) {
            const lineHeight = parseInt(getComputedStyle(textRef.current).lineHeight);
            const maxHeight = lineHeight * maxLines;
            const isOverflowing = textRef.current.scrollHeight > maxHeight;
            // setIsTruncated(isOverflowing);
        }
    }, [maxLines]);

    const toggleText = () => setShowFullText(!showFullText);

    // console.log(record)

    return (

<div className="relative glassy-card w-full max-w-full sm:w-5/6 md:w-4/5 lg:w-3/5 xl:w-2/5 rounded-lg shadow-md border p-4 flex flex-col items-center transition-all duration-300 hover:shadow-lg">

            {/* 👉 Certificate Preview */}
            <div className="w-full rounded-lg overflow-hidden ">
                {(record?.issuing_organization === "Verifide" || issueBy === "Verifide") && record?.is_verified ? (
                    <div className="md:max-w-full md:min-h-80 min-h-80 max-h-80 overflow-hidden overflow-y-auto custom-scrollbar">
                        <LinkedInCertificate
                            certificateName={certificateName}
                            issueBy={issueBy}
                            date={date}
                            skills={record?.skills_acquired}
                            certificateUrlOrNumber={record?.credential_id}
                            username={`${profileInfo?.personalInfo?.first_name || 'User'} ${profileInfo?.personalInfo?.last_name || ''}`}
                        />
                    </div>
                ) : (
                    <>
                        {isImage(imageUrl) ? (
                            <img
                                src={imageUrl}
                                alt="preview"
                                className="w-full md:max-w-full md:min-h-80 min-h-80 max-h-80 object-contain"
                            />
                        ) : (
                            <iframe
                                src={`https://docs.google.com/gview?url=${encodeURIComponent(imageUrl)}&embedded=true`}
                                title="file-preview"
                                className="w-full h-80 border rounded"
                            />
                        )}
                    </>
                )}
            </div>

            {/* 👉 Certificate Info */}
            <div className="w-full mt-3 flex flex-col space-y-2">
                <div className="flex justify-between items-start">
                    <h2 className="md:text-base text-sm font-semibold glassy-text-primary">
                        {certificateName ? certificateName.split(' ').slice(0, 5).join(' ') : ""}
                    </h2>
                    <span className="text-sm glassy-text-secondary">{date}</span>
                </div>

                {issueBy && (
                    <p className="text-sm glassy-text-secondary">
                        <span className="font-medium">Issued By:</span> {issueBy}
                    </p>
                )}

                {companyName && (
                    <div className="flex justify-start gap-2 items-center">
                        <p className="text-sm font-semibold glassy-text-primary">Company:</p>
                        <p className="text-xs glassy-text-secondary font-medium">{companyName}</p>
                    </div>
                )}

                {instituteName && (
                    <div className="flex justify-start gap-2 items-center">
                        <p className="text-sm font-semibold glassy-text-primary">Institute:</p>
                        <p className="text-xs glassy-text-secondary font-medium">{instituteName}</p>
                    </div>
                )}

                {description && (
                    <div className="text-xs mt-2 min-h-10">
                        <p
                            ref={textRef}
                            className={`glassy-text-secondary transition-all ${showFullText ? "line-clamp-none" : "line-clamp-1"}`}
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
                {/* 👉 Copy Credential ID */}
                {certificateUrlOrNumber && (
                    <button
                        className="mt-3 w-full md:text-sm text-xs flex justify-between items-center border border-gray-300 rounded-lg py-2 px-4  transition-all duration-300 ease-in-out glassy-button"
                        onClick={() => {
                            if (navigator.clipboard && window.isSecureContext) {
                                navigator.clipboard.writeText(certificateUrlOrNumber)
                                    .then(() => toast.info("Copied !!"))
                                    .catch(() => toast.error("Failed to copy"));
                            }
                        }}
                    >
                        <span className="truncate glassy-text-primary hover:glassy-text-primary">
                            {certificateUrlOrNumber ? certificateUrlOrNumber.split('-').slice(0, 2).join('-') : ""}
                        </span>
                        <BiCopy className="ml-2" />
                    </button>
                )}


                {/* 👉 Action Buttons: Edit / Delete / Share */}
                {isAction && (
                    <div className="h-12 overflow-hidden">
                        {!['requested', 'approved'].includes(record?.status) && (
                            <>
                                {!record?.is_verified ? (
                                    <div className="flex justify-end items-center gap-2 py-2">

                                        {/* Edit Button */}
                                        <button
                                            onClick={() => onEdit(type, record)}
                                            disabled={isDeleting}
                                            className={`flex items-center gap-1 transition-all duration-200 ${isDeleting ? 'text-blue-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800 hover:scale-105'}`}
                                        >
                                            <span className={` w-10 h-10 rounded-full flex justify-center items-center ${isDeleting ? 'glassy-card' : 'hover:glassy-card'}`}>
                                                <FaRegEdit />
                                            </span>
                                            Edit
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => onDelete(type, record._id)}
                                            disabled={isDeleting}
                                            className={`flex items-center gap-1 ml-2 transition-all duration-200 ${isDeleting ? 'text-red-400 cursor-not-allowed' : 'text-red-600 hover:text-red-800 hover:scale-105'}`}
                                        >
                                            <span className={` w-10 h-10 rounded-full flex justify-center items-center ${isDeleting ? '' : ' '}`}>
                                                <RiDeleteBin6Line />
                                            </span>
                                            {isDeleting ? 'Deleting...' : 'Delete'}
                                        </button>

                                    </div>
                                ) : (
                                    <div className='pt-2 flex justify-end'>
                                        <span
                                            className="inline-block text-blue-700 font-semibold px-3 py-1 rounded-md border border-transparent hover:border-blue-500 hover:glassy-card hover:text-blue-800 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-md"
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

    )
}

export default CertificateCard;
