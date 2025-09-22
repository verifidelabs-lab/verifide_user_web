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
        <div className="max-w-full w-full bg-white rounded-lg shadow-md border p-4 flex flex-col items-center">

            {/* 👉 Instead of image/pdf, show LinkedInCertificate if Verifide & verified */}
            <div className="w-full rounded-lg overflow-hidden bg-gray-50">
                {(record?.issuing_organization === "Verifide" || issueBy === "Verifide") && record?.is_verified ? (
                    <div className='md:max-w-full md:min-h-80 min-h-80 max-h-80 overflow-hidden overflow-y-auto custom-scrollbar'>

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

            <div className="w-full mt-3">
                <div className="flex justify-between items-start">
                    <h2 className="md:text-base text-sm font-semibold text-[#000000]">{certificateName ? certificateName.split(' ').slice(0, 5).join(' ') : ""}</h2>
                    <span className="text-sm text-gray-500">{date}</span>
                </div>

                {issueBy && (
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">Issue By :</span> {issueBy}
                    </p>
                )}

                <div className="space-y-2">
                    {companyName && (
                        <div className="flex justify-start gap-2 items-center  ">
                            <p className="text-sm font-semibold text-gray-900">Company</p>
                            <p className="text-xs text-gray-500 font-medium">{companyName}</p>
                        </div>
                    )}

                    {instituteName && (
                        <div className="flex justify-start gap-2 items-center ">
                            <p className=" text-sm font-semibold text-gray-900">Institute</p>
                            <p className="text-xs text-gray-500 font-medium">{instituteName}</p>
                        </div>
                    )}
                </div>


                {description && (
                    <div className="text-xs mt-2 min-h-10">
                        <p
                            ref={textRef}
                            className={`text-gray-700 transition-all ${showFullText ? "line-clamp-none" : "line-clamp-1"}`}
                        >
                            <span className="font-medium">Disc Optional :</span> {description}
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

                {certificateUrlOrNumber && (
                    <button
                        className="mt-3 w-full md:text-sm text-xs flex justify-between place-items-center border border-gray-300 rounded-lg py-2  px-4 hover:bg-gray-50 transition"
                        onClick={() => {
                            if (navigator.clipboard && window.isSecureContext) {
                                navigator.clipboard.writeText(certificateUrlOrNumber)
                                    .then(() => toast.info("Copied !!"))
                                    .catch(() => toast.error("Failed to copy"));
                            }
                        }}
                    >
                        {certificateUrlOrNumber ? certificateUrlOrNumber.split('-').slice(0, 2) : ""}
                        <BiCopy />
                    </button>
                )}

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
                                            className={`flex items-center gap-1 ${isDeleting
                                                ? 'text-blue-400 cursor-not-allowed'
                                                : 'text-blue-600 hover:text-blue-800 hover:scale-105'
                                                } transition-all duration-200`}
                                        >
                                            <span
                                                className={`bg-[#E6EEFF] w-10 h-10 rounded-full flex justify-center items-center ${isDeleting ? 'bg-blue-100' : 'hover:bg-blue-100'
                                                    }`}
                                            >
                                                <FaRegEdit />
                                            </span>
                                            Edit
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => onDelete(type, record._id)}
                                            disabled={isDeleting}
                                            className={`flex items-center gap-1 ${isDeleting
                                                ? 'text-red-400 cursor-not-allowed'
                                                : 'text-red-600 hover:text-red-800 hover:scale-105'
                                                } ml-2`}
                                        >
                                            <span
                                                className={`bg-[#E6EEFF] w-10 h-10 rounded-full flex justify-center items-center ${isDeleting ? 'bg-red-100' : 'hover:bg-red-100'
                                                    }`}
                                            >
                                                <RiDeleteBin6Line />
                                            </span>
                                            {isDeleting ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className='pt-2 flex justify-end'>
                                        {/* <Button variant='outline' size='sm'></Button> */}
                                        <span
                                            className="inline-block text-blue-700 font-semibold px-3 py-1 rounded-md border border-transparent 
             hover:border-blue-500 hover:bg-blue-50 hover:text-blue-800 cursor-pointer 
             transition-all duration-300 ease-in-out  hover:shadow-md"
                                            onClick={() => sharePost(record)}>
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
